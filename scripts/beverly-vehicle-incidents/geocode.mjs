/**
 * Block-level geocoding via the US Census Bureau geocoder.
 *
 * The precision rule is the point of this module: a house number is rounded
 * down to its block and only the block is ever geocoded or stored. A specific
 * address never reaches the output file, so it cannot leak at render time.
 */

import fs from "node:fs";
import path from "node:path";

const CENSUS = "https://geocoding.geo.census.gov/geocoder/locations/onelineaddress";
const BENCHMARK = "Public_AR_Current";

// Generous box around Beverly, MA. A match outside it is a bad geocode
// (usually a street name mistranscribed from radio audio into a real street
// somewhere else) and is dropped rather than drawn.
const BOUNDS = { minLat: 42.52, maxLat: 42.63, minLon: -70.96, maxLon: -70.79 };

const inBeverly = (lat, lon) =>
  lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat && lon >= BOUNDS.minLon && lon <= BOUNDS.maxLon;

export class GeocodeCache {
  constructor(file) {
    this.file = file;
    this.map = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
    this.hits = 0;
    this.misses = 0;
  }
  has(k) { return Object.hasOwn(this.map, k); }
  get(k) { this.hits++; return this.map[k]; }
  set(k, v) { this.misses++; this.map[k] = v; }
  save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    const sorted = Object.fromEntries(Object.keys(this.map).sort().map((k) => [k, this.map[k]]));
    fs.writeFileSync(this.file, JSON.stringify(sorted, null, 2) + "\n");
  }
}

// Radio transcription gives the same street two ways ("22 Federal" and
// "22 Federal Street"). Canonicalising the suffix is what lets those dedupe
// into one incident instead of reading as two.
const SUFFIXES = {
  st: "St", street: "St", ave: "Ave", avenue: "Ave", rd: "Rd", road: "Rd",
  dr: "Dr", drive: "Dr", ln: "Ln", lane: "Ln", ct: "Ct", court: "Ct",
  pl: "Pl", place: "Pl", ter: "Ter", terrace: "Ter", blvd: "Blvd",
  boulevard: "Blvd", cir: "Cir", circle: "Cir", sq: "Sq", square: "Sq",
  pkwy: "Pkwy", parkway: "Pkwy", hwy: "Hwy", highway: "Hwy", way: "Way",
};

// Endings that are part of the name, not a suffix. "Cummings Center" must not
// become "Cummings Center St".
const PLACE_WORDS = new Set([
  "center", "centre", "park", "plaza", "common", "commons", "beach", "point",
  "wharf", "landing", "heights", "hill", "row", "path", "walk", "green",
  "neck", "island", "crossing", "mall",
]);

const lastToken = (s) => String(s).trim().split(/\s+/).pop().replace(/\.$/, "").toLowerCase();

/** Dedupe key: lowercase, suffix stripped. "Federal Street" and "Federal" match. */
export function streetKey(street) {
  const parts = String(street).trim().split(/\s+/);
  if (parts.length > 1 && Object.hasOwn(SUFFIXES, lastToken(street))) parts.pop();
  return parts.join(" ").toLowerCase();
}

/** Display form: one canonical suffix per street. */
export function displayStreet(street) {
  const parts = String(street).trim().split(/\s+/);
  const last = lastToken(street);
  if (parts.length > 1 && Object.hasOwn(SUFFIXES, last)) {
    parts[parts.length - 1] = SUFFIXES[last];
    return parts.join(" ");
  }
  if (PLACE_WORDS.has(last)) return parts.join(" ");
  return `${parts.join(" ")} St`;
}

/**
 * Pull a house number and street out of a BevScan address string.
 * BevScan addresses are transcribed from radio audio, so they are frequently
 * truncated ("24 Blaine Avenue, Front Stre") or missing a suffix ("705 Boden").
 */
export function parseAddress(raw) {
  if (!raw) return null;
  let s = String(raw).trim();

  // Intersections: "Cabot at May", "Cabot and May", "Cabot & May".
  const cross = s.match(/^(.+?)\s+(?:at|and|&)\s+(.+?)$/i);
  if (cross && !/^\d/.test(cross[2].trim())) {
    return { kind: "intersection", street: cross[1].trim(), cross: cross[2].trim() };
  }

  // Otherwise the first comma segment is the location; the rest is context
  // ("downtown", a second street fragment) that only confuses the geocoder.
  s = s.split(",")[0].trim();

  const withNumber = s.match(/^(\d{1,5})\s+(.*\S)$/);
  if (withNumber) {
    return { kind: "address", number: Number(withNumber[1]), street: withNumber[2].trim() };
  }
  if (s) return { kind: "street", street: s };
  return null;
}

/** 217 -> 200. The block, never the house. */
export const blockOf = (n) => Math.floor(n / 100) * 100;

export function blockLabel(block, street) {
  const st = displayStreet(street);
  return block === 0 ? `First block of ${st}` : `${block} block of ${st}`;
}

async function censusLookup(address, { fetchImpl = fetch, userAgent } = {}) {
  const url = `${CENSUS}?address=${encodeURIComponent(address)}&benchmark=${BENCHMARK}&format=json`;
  const res = await fetchImpl(url, { headers: { "User-Agent": userAgent, Accept: "application/json" } });
  if (!res.ok) throw new Error(`census ${res.status} for ${address}`);
  const body = await res.json();
  const m = body?.result?.addressMatches?.[0];
  if (!m?.coordinates) return null;
  const lat = Number(m.coordinates.y);
  const lon = Number(m.coordinates.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon, matched: m.matchedAddress ?? null };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Resolve one parsed address to a block-level or street-level point.
 * @returns {{lat,lon,precision:'block'|'street',label:string,block:number|null} | null}
 */
export async function geocodeBlock(parsed, cache, opts = {}) {
  if (!parsed) return null;
  const { delayMs = 250 } = opts;

  const attempt = async (query) => {
    if (cache.has(query)) return cache.get(query);
    await sleep(delayMs);
    let out = null;
    try {
      out = await censusLookup(query, opts);
    } catch (err) {
      out = null;
      if (opts.onError) opts.onError(query, err);
    }
    cache.set(query, out);
    return out;
  };

  if (parsed.kind === "address") {
    const block = blockOf(parsed.number);
    // Geocode the middle of the block, not the reported house. Census
    // interpolates along the street segment, so a mid-block number resolves
    // even though nobody lives at it. Try several points inside the block
    // before giving up: a short street may not interpolate at every offset,
    // and falling straight to street level would move the circle to the far
    // end of the road.
    for (const offset of [50, 25, 75, 10, 90]) {
      const hit = await attempt(`${block + offset} ${parsed.street}, Beverly, MA`);
      if (hit && inBeverly(hit.lat, hit.lon)) {
        return {
          lat: hit.lat, lon: hit.lon, precision: "block", block,
          label: blockLabel(block, parsed.street),
        };
      }
    }
    // Fall back to street level rather than to the exact house number.
    return streetLevel(parsed.street, attempt);
  }

  if (parsed.kind === "intersection") {
    const hit = await attempt(`${parsed.street} & ${parsed.cross}, Beverly, MA`);
    if (hit && inBeverly(hit.lat, hit.lon)) {
      return { lat: hit.lat, lon: hit.lon, precision: "street", block: null,
               label: `${parsed.street} at ${parsed.cross}` };
    }
    return streetLevel(parsed.street, attempt);
  }

  return streetLevel(parsed.street, attempt);
}

/**
 * A street with no number: sample a few numbers along it and use the centroid
 * of whatever resolves, so the point sits nearer the middle of the street than
 * its low end. Flagged `street`, which the UI draws as a wider circle.
 */
async function streetLevel(street, attempt) {
  const pts = [];
  for (const n of [50, 250, 500]) {
    const hit = await attempt(`${n} ${street}, Beverly, MA`);
    if (hit && inBeverly(hit.lat, hit.lon)) pts.push(hit);
  }
  if (!pts.length) return null;
  const lat = pts.reduce((a, p) => a + p.lat, 0) / pts.length;
  const lon = pts.reduce((a, p) => a + p.lon, 0) / pts.length;
  return { lat, lon, precision: "street", block: null, label: displayStreet(street) };
}

/** Metres between two points, for sanity-checking against BevScan's own pin. */
export function distanceMeters(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
