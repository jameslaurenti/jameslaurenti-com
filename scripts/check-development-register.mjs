#!/usr/bin/env node
// Checks data/beverly/development-register.json against the rules in docs/beverly/development-map.md,
// works out each site's map group (including the automatic "quiet" rule), and lists what still needs checking.
// The status rules themselves live in lib/beverly/development.mjs, shared with the site pages.
//
//   node scripts/check-development-register.mjs                 # as of today
//   node scripts/check-development-register.mjs --today 2027-03-01
//
// Exit code 1 when the register has errors (missing fields, unknown sources, broken digest links).
// Warnings (sources without a public link, passed dates, open checks) don't fail the run.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { APPROVAL_STATUSES, ENDINGS, GROUPS, SOURCE_KINDS, STAGES, dayOf, parseDate, siteStatus } from "../lib/beverly/development.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTER = join(ROOT, "data/beverly/development-register.json");
const DIGEST_DIR = join(ROOT, "app/beverly/digest");

const args = process.argv.slice(2);
const TODAY = dayOf(args.includes("--today") ? args[args.indexOf("--today") + 1] : undefined);

const DEPTHS = ["row", "page", "deep"];
const BEVERLY = { latMin: 42.52, latMax: 42.62, lngMin: -70.95, lngMax: -70.78 };

const reg = JSON.parse(readFileSync(REGISTER, "utf8"));
const rules = reg.rules ?? {};

const errors = [];
const warnings = [];
const usedSources = new Set();
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

const digestCache = new Map();
function checkDigestRef(where, ref) {
  const [issue, anchor] = ref.split("#");
  const page = join(DIGEST_DIR, issue, "page.tsx");
  if (!existsSync(page)) return err(where, `digest issue ${issue} not found at app/beverly/digest/${issue}/`);
  if (!anchor) return;
  if (!digestCache.has(page)) digestCache.set(page, readFileSync(page, "utf8"));
  const pattern = new RegExp(`id(?:=|:\\s*)\\{?["'\`]${anchor}["'\`]`);
  if (!pattern.test(digestCache.get(page))) warn(where, `no id "${anchor}" found in digest issue ${issue}`);
}

// A source is a register id, optionally with a page ("boulder-deck p. 12") or a recording time ("bevcam-x at 37:01"),
// or digest:<issue>#<id>.
function checkSource(where, source) {
  if (typeof source !== "string" || !source) return err(where, "missing source");
  if (source.startsWith("digest:")) return checkDigestRef(where, source.slice(7));
  const [id, ...rest] = source.split(" ");
  if (!reg.sources?.[id]) return err(where, `unknown source "${id}"`);
  const loc = rest.join(" ");
  if (/^at /.test(loc)) {
    if (!/^at (\d+:)?\d{1,2}:\d{2}$/.test(loc)) err(where, `time reference should look like "at 37:01" or "at 1:18:18", got "${loc}"`);
    else if (!/^https:\/\/www\.youtube\.com\/watch\?v=/.test(reg.sources[id].url ?? "")) err(where, `a time reference needs a YouTube recording, and "${id}" isn't one`);
  } else if (rest.length && !/^pp?\. \d+(-\d+)?$/.test(loc)) err(where, `page reference should look like "p. 12" or "pp. 2-7", got "${loc}"`);
  usedSources.add(id);
}

function checkEvent(where, e) {
  if (!parseDate(e.date)) err(where, `bad date "${e.date}"`);
  if (!e.what) err(where, "event has no description");
  checkSource(where, e.source);
  if (e.digest) checkDigestRef(where, e.digest);
}

const ids = new Set();
const rows = [];
const todo = [];

for (const site of reg.sites ?? []) {
  const w = site.id ?? "(site without id)";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(site.id ?? "")) err(w, "id must be lower-case words joined by hyphens");
  if (ids.has(site.id)) err(w, "duplicate id");
  ids.add(site.id);
  if (!site.name) err(w, "missing name");
  if (!Number.isInteger(site.ward) || site.ward < 1 || site.ward > 6) err(w, "ward must be 1 to 6, from the city's ward layer");
  const loc = site.location ?? {};
  if (!(loc.lat >= BEVERLY.latMin && loc.lat <= BEVERLY.latMax && loc.lng >= BEVERLY.lngMin && loc.lng <= BEVERLY.lngMax))
    err(w, "location is missing or outside Beverly");
  if (loc.source) checkSource(`${w} location`, loc.source);
  if (!DEPTHS.includes(site.depth)) err(w, `depth must be one of ${DEPTHS.join(", ")}`);
  (site.history ?? []).forEach((e, i) => checkEvent(`${w} history[${i}]`, e));
  (site.facts ?? []).forEach((f, i) => checkSource(`${w} facts[${i}]`, f.source));
  (site.page_sources ?? []).forEach((id, i) => checkSource(`${w} page_sources[${i}]`, id));
  (site.recordings ?? []).forEach((r, i) => {
    const rw = `${w} recordings[${i}]`;
    if (!parseDate(r.date)) err(rw, `bad date "${r.date}"`);
    if (!r.title || !r.what) err(rw, "needs a title and a description");
    checkSource(rw, r.source);
    if (!/^https:\/\/www\.youtube\.com\/watch\?v=/.test(reg.sources?.[r.source]?.url ?? "")) err(rw, "source should be a YouTube recording");
    (r.moments ?? []).forEach((m, j) => {
      if (!m.label) err(`${rw} moments[${j}]`, "needs a label");
      checkSource(`${rw} moments[${j}]`, `${r.source} at ${m.at}`);
    });
  });
  for (const key of ["land_notes", "zoning_notes"]) {
    (site[key] ?? []).forEach((n, i) => {
      if (!n.text) err(`${w} ${key}[${i}]`, "missing text");
      checkSource(`${w} ${key}[${i}]`, n.source);
    });
  }
  (site.figures ?? []).forEach((f, i) => {
    const fw = `${w} figures[${i}]`;
    if (!["proposal", "land"].includes(f.section)) err(fw, 'section must be "proposal" or "land"');
    if (!f.alt || !f.caption) err(fw, "needs alt text and a caption");
    if (!existsSync(join(ROOT, "public", f.src ?? ""))) err(fw, `file not found under public/: ${f.src}`);
  });
  if (site.plan) {
    checkSource(`${w} plan.map`, site.plan.map?.source);
    if (site.plan.definition) checkSource(`${w} plan.definition`, site.plan.definition.source);
    const n = site.plan.passages?.length ?? 0;
    if (n < 3 || n > 4) warn(`${w} plan`, `the passage rule asks for three or four passages; found ${n}`);
    (site.plan.passages ?? []).forEach((p, i) => {
      if (!p.topic || !p.quote) err(`${w} plan.passages[${i}]`, "needs topic and quote");
      checkSource(`${w} plan.passages[${i}]`, p.source);
    });
  }
  (site.digest_extra ?? []).forEach((ref, i) => checkDigestRef(`${w} digest_extra[${i}]`, ref));
  if (!existsSync(join(ROOT, "public/beverly/development/maps", `${site.id}.svg`)))
    warn(w, "no site map yet; run python -I scripts/beverly-development/site_maps.py");
  if (!Array.isArray(site.chapters) || !site.chapters.length) {
    err(w, "needs at least one chapter");
    continue;
  }

  const chapterIds = new Set();
  for (const ch of site.chapters) {
    const cw = `${w} / ${ch.id ?? "(chapter without id)"}`;
    if (!ch.id || chapterIds.has(ch.id)) err(cw, "chapter id missing or repeated");
    chapterIds.add(ch.id);
    if (!STAGES.includes(ch.stage)) err(cw, `stage must be one of ${STAGES.join(", ")}`);
    if (!ch.what) err(cw, "missing what");
    if (ch.decided != null && !parseDate(ch.decided)) err(cw, `bad decided date "${ch.decided}"`);
    (ch.events ?? []).forEach((e, i) => checkEvent(`${cw} event[${i}]`, e));
    (ch.facts ?? []).forEach((f, i) => checkSource(`${cw} facts[${i}]`, f.source));
    (ch.approvals ?? []).forEach((a, i) => {
      const aw = `${cw} approvals[${i}]`;
      if (!a.board || !a.what) err(aw, "needs board and what");
      if (!APPROVAL_STATUSES.includes(a.status)) err(aw, `status must be one of ${APPROVAL_STATUSES.join(", ")}`);
      if (a.date != null && !parseDate(a.date)) err(aw, `bad date "${a.date}"`);
      if (["granted", "denied", "withdrawn", "done"].includes(a.status) && !a.date) err(aw, `a ${a.status} approval needs its date`);
      checkSource(aw, a.source);
    });
    if (ch.ending) {
      if (!ENDINGS.includes(ch.ending.type)) err(cw, `ending must be one of ${ENDINGS.join(", ")}`);
      checkEvent(`${cw} ending`, ch.ending);
    }
    if (ch.next) checkEvent(`${cw} next`, ch.next);
    if (ch.permit_until) {
      if (!parseDate(ch.permit_until.date)) err(cw, "bad permit_until date");
      checkSource(`${cw} permit_until`, ch.permit_until.source);
    }
    if (ch.status_note) checkSource(`${cw} status_note`, ch.status_note.source);

    if (ch.permit_until && ch.stage === "approved") {
      const p = parseDate(ch.permit_until.date);
      if (p && p.end < TODAY) todo.push([w, `Permit date passed (${p.label}): check whether it was extended, started or lapsed`]);
    }
    if (ch.next) {
      const n = parseDate(ch.next.date);
      if (n && n.end < TODAY) todo.push([w, `"Next" date passed (${n.label}, ${ch.next.what}): record what happened`]);
    }
  }

  const s = siteStatus(site, TODAY, rules);
  rows.push({
    id: site.id,
    ward: site.ward,
    group: s.group,
    note: s.note,
    stage: s.stage,
    decided: s.decided?.label ?? "not decided",
    last: s.last?.label ?? "none",
    active: s.active,
    depth: site.depth,
    homes: s.current.homes ?? "?",
    earlier: s.earlier.map((e) => `${e.chapter.id}: ${e.note || e.stageLabel.toLowerCase()}`),
  });
  for (const c of site.check ?? []) todo.push([w, c]);
}

// Built before 2021: context pins on the map, no pages.
for (const e of reg.earlier?.buildings ?? []) {
  const w = `earlier ${e.id ?? "(no id)"}`;
  if (!e.id || ids.has(e.id)) err(w, "id missing or already used by a site");
  if (!e.name || !e.address) err(w, "needs a name and an address");
  if (!Number.isInteger(e.ward) || e.ward < 1 || e.ward > 6) err(w, "ward must be 1 to 6");
  if (!Number.isInteger(e.homes) || e.homes < 1) err(w, "homes must be a whole number");
  if (!Number.isInteger(e.year) || e.year >= Number(reg.rules.built_since.slice(0, 4))) err(w, `year must be before ${reg.rules.built_since.slice(0, 4)}`);
  if (!e.year_basis) err(w, "say where the year comes from");
  const loc = e.location ?? {};
  if (!(loc.lat >= BEVERLY.latMin && loc.lat <= BEVERLY.latMax && loc.lng >= BEVERLY.lngMin && loc.lng <= BEVERLY.lngMax)) err(w, "location is missing or outside Beverly");
  if (!e.sources?.length) err(w, "needs at least one source");
  (e.sources ?? []).forEach((s, i) => checkSource(`${w} sources[${i}]`, s));
  if (e.story && !(e.story in (reg.explainers ?? {}))) err(w, `story "${e.story}" is not an explainer`);
}
// Sources an explainer page cites in its own copy.
for (const [page, list] of Object.entries(reg.explainers ?? {})) list.forEach((s, i) => checkSource(`explainer ${page}[${i}]`, s));

for (const c of reg.candidates ?? []) {
  const w = `candidate ${c.id ?? "(no id)"}`;
  if (!c.id || ids.has(c.id)) err(w, "candidate id missing or already used by a site");
  if (c.ward != null && (!Number.isInteger(c.ward) || c.ward < 1 || c.ward > 6)) err(w, "ward must be 1 to 6 or null");
  if (c.digest) checkDigestRef(w, c.digest);
}

// Digest coverage on a page comes from the timeline's digest links, each needing a headline.
for (const [ref, title] of Object.entries(reg.digest_headlines ?? {})) {
  if (!title) err(`digest_headlines ${ref}`, "missing headline");
  checkDigestRef(`digest_headlines ${ref}`, ref);
}
for (const site of reg.sites ?? []) {
  const refs = [
    ...(site.chapters ?? []).flatMap((c) => [...(c.events ?? []), ...(c.ending ? [c.ending] : [])].map((e) => e.digest)),
    ...(site.digest_extra ?? []),
  ].filter(Boolean);
  for (const ref of new Set(refs))
    if (ref.includes("#") && !reg.digest_headlines?.[ref]) warn(site.id, `digest story ${ref} has no headline in digest_headlines, so it won't be listed`);
}

const KINDS = SOURCE_KINDS.map((k) => k.kind);
for (const [id, s] of Object.entries(reg.sources ?? {})) {
  if (!usedSources.has(id)) warn(`source ${id}`, "not used by any site");
  if (!KINDS.includes(s.kind)) err(`source ${id}`, `kind must be one of ${KINDS.join(", ")}, so pages can group it`);
  if (s.date != null && !parseDate(s.date)) err(`source ${id}`, `bad date "${s.date}"`);
  if (!s.url) warn(`source ${id}`, `no public link yet${s.note ? ` (${s.note})` : ""}`);
}

// Report
const pad = (s, n) => String(s).padEnd(n).slice(0, n);
console.log(`Development register, as of ${TODAY.toISOString().slice(0, 10)} (quiet after ${rules.quiet_after_days ?? 365} days, active window ${rules.active_window_days ?? 90} days)\n`);
console.log(`${pad("site", 28)} ${pad("ward", 4)} ${pad("map group", 15)} ${pad("decided", 18)} ${pad("last heard", 19)} ${pad("depth", 5)} homes`);
rows.sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || a.ward - b.ward);
for (const r of rows) {
  console.log(`${pad(r.id, 28)} ${pad(r.ward, 4)} ${pad(r.group, 15)} ${pad(r.decided, 18)} ${pad(r.last + (r.active ? " *" : ""), 19)} ${pad(r.depth, 5)} ${r.homes}${r.stage === "under-construction" ? " (building)" : ""}`);
  if (r.note) console.log(`${" ".repeat(29)}${r.note}`);
  for (const e of r.earlier) console.log(`${" ".repeat(29)}earlier: ${e}`);
}
console.log(`\n* active lately (an event in the last ${rules.active_window_days ?? 90} days, or a step scheduled)`);
const count = (k) => rows.filter((r) => r.group === k).length;
console.log(`\n${rows.length} sites: ${GROUPS.map((k) => `${count(k)} ${k.toLowerCase()}`).join(", ")}. ${rows.filter((r) => r.active).length} active lately. ${(reg.candidates ?? []).length} candidates still to check for scope.`);

if (todo.length) {
  console.log(`\nTo check (${todo.length}):`);
  for (const [w, t] of todo) console.log(`  - ${w}: ${t}`);
}
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const x of warnings) console.log(`  - ${x}`);
}
if (errors.length) {
  console.log(`\nErrors (${errors.length}):`);
  for (const x of errors) console.log(`  - ${x}`);
  process.exit(1);
}
console.log("\nNo errors.");
