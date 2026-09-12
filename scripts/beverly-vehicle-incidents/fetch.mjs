#!/usr/bin/env node
/**
 * Regenerate data/beverly/vehicle-incidents.json from BevScan.
 *
 *   npm run beverly:vehicle-incidents
 *
 * One request per build, no polling. Geocodes are cached to disk, so a rerun
 * on an unchanged window makes no Census requests at all.
 *
 * Why the window is ~9 days and not 30
 * -----------------------------------
 * BevScan's /public/incidents is capped at 500 records with no pagination,
 * which currently spans about nine days. /public/search reaches further back
 * but returns at most 50 hits per query ranked by relevance: measured against
 * BevScan's own daily counts it surfaces roughly 5% of older incidents. A
 * 30-day baseline built that way would undercount the older weeks and make the
 * current week look like a spike that is really a sampling artifact. So the map
 * covers only the window /incidents serves completely, and says how long it is.
 *
 * See docs/beverly/vehicle-incidents.md for the BevScan access note and the
 * editorial rules this script enforces at ingest.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classify } from "./classify.mjs";
import {
  GeocodeCache, parseAddress, geocodeBlock, distanceMeters, streetKey, blockOf,
} from "./geocode.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const OUT = path.join(REPO, "data/beverly/vehicle-incidents.json");
const CACHE = path.join(REPO, "data/beverly/vehicle-incidents.geocache.json");

const BEVSCAN = "https://scanner.beverlybrief.com";
const UA =
  "jameslaurenti.com/beverly-vehicle-incidents (+https://jameslaurenti.com/work/beverly; one fetch per build)";

const API_LIMIT = 500; // BevScan's hard cap on /public/incidents
const DEFAULT_WINDOW_DAYS = 7;
const DAY_MS = 86400000;

// A geocode this far from BevScan's own pin means the street name resolved to
// the wrong street, usually a suffix swap on a name misheard from radio audio.
const MAX_PIN_DRIFT_M = 1200;

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
}

/** Same kind on the same block within 45 minutes is one event heard twice. */
function dedupe(records) {
  const sorted = [...records].sort((a, b) => a.at.localeCompare(b.at));
  const kept = [];
  let merged = 0;
  for (const r of sorted) {
    const dup = kept.find(
      (k) =>
        k.kind === r.kind &&
        k._key === r._key &&
        Math.abs(Date.parse(r.at) - Date.parse(k.at)) < 45 * 60 * 1000,
    );
    if (dup) {
      merged++;
      continue;
    }
    kept.push(r);
  }
  return { kept, merged };
}

async function main() {
  const startedAt = new Date();
  console.log("BevScan -> Beverly vehicle incidents\n");

  console.log(`  GET /public/incidents?limit=${API_LIMIT}`);
  const raw = await getJson(`${BEVSCAN}/public/incidents?limit=${API_LIMIT}`);
  const dated = raw.filter((r) => r.started_at);
  if (!dated.length) throw new Error("BevScan returned no dated incidents");

  // The oldest record in the response is where complete coverage begins.
  const times = dated.map((r) => Date.parse(r.started_at)).sort((a, b) => a - b);
  const coverageStart = new Date(times[0]);
  const coverageEnd = startedAt;
  const coverageDays = (coverageEnd - coverageStart) / DAY_MS;
  const atCap = raw.length >= API_LIMIT;

  console.log(`    ${raw.length} records, ${coverageDays.toFixed(1)} days of complete coverage`);
  console.log(`    ${coverageStart.toISOString().slice(0, 16)} -> ${coverageEnd.toISOString().slice(0, 16)}`);
  if (!atCap) console.log("    (under the 500 cap: this is BevScan's whole published archive)");

  // Classify and strip in one pass. Nothing reaching `records` carries BevScan
  // summary text, a name, a plate, or a house number.
  const classified = [];
  let unclassified = 0;
  for (const inc of dated) {
    const verdict = classify(inc);
    if (verdict) classified.push({ inc, verdict });
    else unclassified++;
  }
  console.log(`\n  ${classified.length} classified as vehicle property crime (${unclassified} other incidents)`);

  const cache = new GeocodeCache(CACHE);
  const records = [];
  const dropped = { noAddress: 0, ungeocoded: 0, pinDrift: 0 };
  console.log("\n  geocoding to block level ...");

  for (const { inc, verdict } of classified) {
    const parsed = parseAddress(inc.address);
    if (!parsed) {
      dropped.noAddress++;
      console.log(`    dropped (no parsable address): ${inc.address ?? "(none)"}`);
      continue;
    }

    const point = await geocodeBlock(parsed, cache, {
      userAgent: UA,
      onError: (q, e) => console.warn(`    ! census failed for "${q}": ${e.message}`),
    });
    if (!point) {
      dropped.ungeocoded++;
      console.log(`    dropped (unresolvable): ${inc.address}`);
      continue;
    }

    if (inc.lat && inc.lon) {
      const off = distanceMeters(point, { lat: inc.lat, lon: inc.lon });
      if (off > MAX_PIN_DRIFT_M) {
        dropped.pinDrift++;
        console.log(`    dropped (${Math.round(off)}m from source pin): ${inc.address}`);
        continue;
      }
    }

    records.push({
      _key: `${streetKey(parsed.street)}|${parsed.kind === "address" ? blockOf(parsed.number) : "street"}`,
      id: inc.id,
      caseNumber: inc.case_number ?? null,
      at: inc.started_at,
      kind: verdict.kind,
      label: verdict.label,
      category: inc.category,
      location: point.label,
      precision: point.precision,
      lat: Number(point.lat.toFixed(5)),
      lon: Number(point.lon.toFixed(5)),
      url: `${BEVSCAN}/incidents?focus=${inc.id}`,
    });
  }

  cache.save();
  const { kept, merged } = dedupe(records);
  kept.forEach((r) => delete r._key);
  kept.sort((a, b) => b.at.localeCompare(a.at));

  const since = (days) => kept.filter((r) => Date.parse(r.at) >= coverageEnd.getTime() - days * DAY_MS);
  const week = since(DEFAULT_WINDOW_DAYS);
  const count = (rs, kind) => rs.filter((r) => r.kind === kind).length;
  const droppedTotal = dropped.noAddress + dropped.ungeocoded + dropped.pinDrift;

  const payload = {
    _meta: {
      title: "Vehicle-related police incidents in Beverly, MA",
      source: "BevScan (scanner.beverlybrief.com), public incidents API",
      sourceUrl: BEVSCAN,
      confidence: "modeled",
      retrieved: startedAt.toISOString(),
      coverageStart: coverageStart.toISOString(),
      coverageEnd: coverageEnd.toISOString(),
      coverageDays: Number(coverageDays.toFixed(2)),
      coverageIsWholeArchive: !atCap,
      defaultWindowDays: DEFAULT_WINDOW_DAYS,
      counts: {
        total: kept.length,
        confirmed: count(kept, "confirmed"),
        suspicious: count(kept, "suspicious"),
        last7Days: week.length,
        last7DaysConfirmed: count(week, "confirmed"),
        last7DaysSuspicious: count(week, "suspicious"),
        perDayOverCoverage: Number((kept.length / coverageDays).toFixed(2)),
        droppedUnresolvable: droppedTotal,
        duplicatesMerged: merged,
        incidentsScanned: dated.length,
      },
      notes:
        "Built from police-scanner radio traffic, not police reports. Incident type is inferred " +
        "from AI-generated transcript text because BevScan's category vocabulary has no " +
        "vehicle-specific value. Locations are rounded down to the block and geocoded with the US " +
        "Census Bureau geocoder; no house number is stored. Summary text is never copied from the " +
        "source because it contains suspect descriptions. Coverage is limited to the window " +
        "BevScan's 500-record API serves completely; older weeks are not comparable and are " +
        "excluded rather than shown as a baseline. Not an official record.",
    },
    incidents: kept,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n");

  const c = payload._meta.counts;
  console.log(`\n  wrote ${path.relative(REPO, OUT)}`);
  console.log(`    ${c.total} incidents over ${coverageDays.toFixed(1)} days (${c.last7Days} in the last ${DEFAULT_WINDOW_DAYS})`);
  console.log(`    confirmed ${c.confirmed} / suspicious ${c.suspicious} / ${c.perDayOverCoverage} per day`);
  console.log(`    dropped ${droppedTotal} unresolvable, merged ${merged} duplicates`);
  console.log(`    geocode cache: ${cache.hits} hits, ${cache.misses} new lookups`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
