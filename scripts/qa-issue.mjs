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
// --path checks a copy somewhere else, e.g. a review copy under /preview/.
const url = `${BASE}${flag("path", `/beverly/digest/${slug}`)}`;

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
 * simply drops the reader somewhere the sentence did not promise.
 *
 * From issue 3 on, every timestamped link carries its own printed time in `data-moment`,
 * so each link is checked against its own label. Issues 1 and 2 predate that and print
 * "from 1:38:09" in the Hear button instead; for those the old page-wide match still runs.
 */
head(`RECORDING DEEP LINKS`);
const hhmmss = (s) => new Date(s * 1000).toISOString().substring(11, 19).replace(/^00:/, "");
const same = (a, b) => a === b || `0${a}` === b || a === `0${b}`;
const legacy = [...html.matchAll(/from (\d{1,2}:\d{2}(?::\d{2})?)</g)].map((m) => m[1]);

const stamped = [...html.matchAll(/<a\b[^>]*>/g)]
  .map(([tag]) => ({
    href: (tag.match(/href="([^"]+)"/) || [])[1]?.replace(/&amp;/g, "&"),
    moment: (tag.match(/data-moment="([^"]+)"/) || [])[1],
    placement: (tag.match(/data-placement="([^"]+)"/) || [])[1] ?? "",
  }))
  .filter((a) => a.href && isYouTube(a.href) && /[?&]t=/.test(a.href));

for (const a of stamped) {
  const u = new URL(a.href);
  const secs = Number(String(u.searchParams.get("t")).replace("s", ""));
  const shown = hhmmss(secs);
  const ok = a.moment ? same(a.moment, shown) : legacy.some((l) => same(l, shown));
  const how = a.moment ? `labelled ${a.moment}` : "legacy label";
  line(
    ok ? "ok" : "CHECK",
    `v=${u.searchParams.get("v")}  t=${secs}s  ->  ${shown}  (${a.placement || "link"}, ${how})`
  );
}
if (!stamped.length) line("CHECK", "no timestamped recording links found");

/**
 * The JSX compiler occasionally drops the space between an inline element and the text that
 * follows it, so a sentence renders as "</a>Capital planning". It has happened in issues 2
 * and 3 on source lines that look correct, which is why this checks the rendered HTML rather
 * than the source. Chip internals (the play icon beside its time) are spaced by layout, not
 * text, and are excluded.
 */
head(`TEXT SPACING`);
{
  const prose = html.slice(html.indexOf("<header")).replace(/<!-- -->/g, "");
  const afterInline = [...prose.matchAll(/(.{0,40})<\/(a|b|strong|em)>([A-Za-z0-9$][^<]{0,20})/g)];
  const afterFigure = [
    ...prose.matchAll(/(.{0,40})<span class="font-bold tabular-nums">[^<]*<\/span>([A-Za-z0-9$][^<]{0,20})/g),
  ];
  const lost = [
    ...afterInline.map((m) => [m[1], m[3]]),
    ...afterFigure.map((m) => [m[1], m[2]]),
  ];
  if (!lost.length) line("ok", "no lost spaces after links, bold text or figures");
  for (const [before, after] of lost) {
    line("CHECK", `lost space: ...${before.replace(/<[^>]+>/g, "").slice(-24)}|${after}`);
  }
}

/**
 * Links into long PDFs carry #page=N, which desktop browsers honor and phone PDF viewers
 * mostly ignore. So the label prints the page too, "(p. 58)", and the two must agree.
 */
head(`PDF PAGE LABELS`);
{
  const paged = [...html.matchAll(/<a\b[^>]*href="([^"]*#page=(\d+))"[^>]*>([\s\S]*?)<\/a>/g)].map(
    (m) => ({ href: m[1], page: m[2], label: m[3]
        .replace(/<[^>]+>/g, "")
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim(),
    })
  );
  if (!paged.length) line("ok", "no page-anchored PDF links");
  for (const a of paged) {
    const printed = (a.label.match(/\(p\. (\d+)\)/) || [])[1];
    line(
      printed === a.page ? "ok" : "CHECK",
      `#page=${a.page}  ->  "${a.label}"${printed ? "" : "  (no page in label)"}`
    );
  }
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
