#!/usr/bin/env node
/**
 * Pre-publish check for a digest issue.
 *
 *   npm run qa:issue                       # newest issue, against localhost:3111
 *   npm run qa:issue -- 2026-09-21         # a specific issue
 *   npm run qa:issue -- --base http://localhost:3000
 *   npm run qa:issue -- --ci               # exit 1 on any failure
 *
 * The only mistakes that do lasting damage are a claim that is wrong and a source link
 * that does not go where the sentence says it goes. The first needs a human and the
 * recording. This covers the second, plus the publish mechanics that are easy to forget
 * on a Monday morning.
 *
 * Deliberately not covered: browser matrices, and anything pa11y or check-contrast
 * already does. Those change when the design changes, not when an issue does, so they
 * belong in `npm run a11y` rather than here.
 */
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};

const BASE = flag("base", "http://localhost:3111").replace(/\/$/, "");
const CI = argv.includes("--ci");

const issues = readdirSync(join(root, "app", "beverly", "digest"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
  .map((d) => d.name)
  .sort();

const slug = argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) ?? issues.at(-1);
if (!slug) {
  console.error("No dated issue directory found under app/beverly/digest/.");
  process.exit(1);
}
const url = `${BASE}/beverly/digest/${slug}`;

let failures = 0;
const line = (mark, text) => {
  if (mark === "FAIL") failures++;
  console.log(`  ${mark.padEnd(5)} ${text}`);
};
const head = (t) => console.log(`\n${t}`);

let html;
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  html = await res.text();
} catch (e) {
  console.error(`\nCould not load ${url}\n  ${e.message}`);
  console.error(`\nIs the dev server running? Try: npm run dev -- -p ${new URL(BASE).port}\n`);
  process.exit(1);
}

console.log(`\n${url}\n${"=".repeat(72)}`);

const hrefs = [
  ...new Set(
    [...html.matchAll(/href="([^"]+)"/g)]
      .map((m) => m[1].replace(/&amp;/g, "&"))
      .filter((h) => !h.startsWith("#") && !h.startsWith("/_next/") && !h.startsWith("mailto:"))
  ),
];

const isYouTube = (h) => /youtube\.com\/watch/.test(h);
const isGCal = (h) => h.includes("calendar.google.com");

/**
 * Deep links are the highest-value check here: a wrong `t=` still renders perfectly and
 * simply drops the reader somewhere the sentence did not promise. Each Hear button prints
 * its own timestamp in its label, so the two can be compared.
 */
head(`RECORDING DEEP LINKS`);
const hhmmss = (s) => new Date(s * 1000).toISOString().substring(11, 19).replace(/^00:/, "");
const labels = [...html.matchAll(/from (\d{1,2}:\d{2}(?::\d{2})?)</g)].map((m) => m[1]);
const stamped = hrefs.filter((h) => isYouTube(h) && /[?&]t=/.test(h));

for (const h of stamped) {
  const u = new URL(h);
  const secs = Number(String(u.searchParams.get("t")).replace("s", ""));
  const shown = hhmmss(secs);
  const claimed = labels.find((l) => l === shown || `0${l}` === shown || l === `0${shown}`);
  line(claimed ? "ok" : "CHECK", `v=${u.searchParams.get("v")}  t=${secs}s  ->  ${shown}`);
}
if (!stamped.length) line("CHECK", "no timestamped recording links found");
if (labels.length !== stamped.length) {
  line("CHECK", `${labels.length} printed timestamps vs ${stamped.length} deep links`);
}

head(`LINKS`);
const status = async (h) => {
  try {
    const r = await fetch(h.startsWith("/") ? `${BASE}${h}` : h, { redirect: "follow" });
    return r.status;
  } catch (e) {
    return e.message.slice(0, 40);
  }
};
for (const h of hrefs.filter((x) => !isGCal(x))) {
  const s = await status(h);
  line(s >= 200 && s < 400 ? "ok" : "FAIL", `${String(s).padEnd(5)} ${h.slice(0, 88)}`);
}

/**
 * Calendar buttons are Google-only URLs. They are not broken, but they serve one vendor:
 * an Outlook or Apple Calendar user lands on a Google page. Reported, not failed, until
 * the per-client chooser exists.
 */
const gcal = hrefs.filter(isGCal);
if (gcal.length) {
  head(`CALENDAR BUTTONS (${gcal.length}, all Google-only)`);
  for (const h of gcal) {
    const p = new URL(h).searchParams;
    const dates = p.get("dates") ?? "";
    const wellFormed = /^\d{8}(T\d{6}Z)?\/\d{8}(T\d{6}Z)?$/.test(dates);
    line(wellFormed ? "ok" : "FAIL", `${(p.get("text") ?? "").slice(0, 40).padEnd(42)} ${dates}`);
  }
}

head(`PUBLICATION GATES`);
const gates = [
  ["draft banner removed", !/DRAFT, NOT PUBLISHED/i.test(html)],
  ["noindex removed", !/noindex/i.test(html)],
  ["og:image declared", /property="og:image"/.test(html)],
  ["analytics mounted", /gtag|googletagmanager/.test(html)],
];
for (const [label, pass] of gates) line(pass ? "ok" : "TODO", label);

const archive = await (await fetch(`${BASE}/beverly/digest`)).text();
line(
  archive.includes(`/beverly/digest/${slug}`) ? "ok" : "TODO",
  `listed on the archive index`
);

console.log(
  `\n${failures ? `${failures} failure(s).` : "No broken links."}` +
    ` TODO items above are the publish checklist, not errors.\n`
);
if (CI && failures) process.exit(1);
