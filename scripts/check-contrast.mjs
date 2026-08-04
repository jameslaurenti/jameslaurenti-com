#!/usr/bin/env node
/**
 * Dependency-free WCAG contrast check for the site's design tokens.
 * Parses --color-* from app/globals.css so it can't drift from the real palette,
 * then audits every text/mark on every surface it's actually used on.
 *
 *   node scripts/check-contrast.mjs          # report
 *   node scripts/check-contrast.mjs --ci     # exit 1 if any AA-normal text pairing fails
 *
 * Thresholds (WCAG 2.1): AA normal text 4.5:1, AA large text (>=24px, or >=18.66px bold)
 * and non-text UI/graphics 3:1.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "app", "globals.css"), "utf8");
// The fiscal-shape palette lives in TypeScript, not CSS tokens, so read it directly.
const taxData = readFileSync(join(root, "lib", "beverly", "taxData.ts"), "utf8");

const tok = {};
for (const m of css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) tok[m[1]] = m[2];

const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const h = hex.replace("#", ""); const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; const hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05); };

// Audit matrix: [foreground token, background token, usage, "text" | "large" | "ui"]
const CHECKS = [
  ["ink", "bg", "body text", "text"], ["ink-mid", "bg", "secondary text", "text"],
  ["ink-faint", "bg", "captions / footnotes", "text"], ["accent", "bg", "links", "text"],
  ["accent-deep", "bg", "emphasis", "text"], ["debt", "bg", "cost eyebrows / amounts", "text"],
  ["gold-strong", "bg", "section eyebrows / labels", "text"], ["cuts", "bg", "cuts phase text", "text"],
  ["ink-faint", "bg-card", "captions on cards", "text"], ["debt", "bg-card", "amounts on cards", "text"],
  ["gold-strong", "bg-card", "labels on cards", "text"],
];
// Bright --color-gold is FILLS-ONLY (bars/borders); it fails as text on paper by design,
// so it is not audited as text here. It is used as text only against the dark tracker,
// where gold on ink = 6.08:1 (passes).
// White text on colored badges/buttons (fg is literal white)
const ON_COLOR = [["accent", "badge"], ["debt", "badge"], ["gold-strong", "adopted badge"], ["cuts", "badge"]];

// Shape badges: white type on the darkened variants of the fiscal-shape palette. The mark
// colours in SHAPE_COLORS are deliberately not audited as text surfaces; three of the four
// fail there, which is exactly why SHAPE_BADGE_COLORS exists.
const badgeBlock = taxData.match(/SHAPE_BADGE_COLORS[^{]*\{([^}]*)\}/s);
const SHAPE_BADGES = badgeBlock
  ? [...badgeBlock[1].matchAll(/"?([A-Za-z -]+)"?:\s*"(#[0-9a-fA-F]{6})"/g)].map((m) => [m[1].trim(), m[2]])
  : [];

const th = (kind) => (kind === "text" ? 4.5 : 3);
const pad = (s, n) => s.padEnd(n);
let fails = 0;
const rows = [];

for (const [fg, bg, use, kind] of CHECKS) {
  if (!tok[fg] || !tok[bg]) continue;
  const r = ratio(tok[fg], tok[bg]);
  const ok = r >= th(kind);
  if (!ok && kind === "text") fails++;
  rows.push([`${fg} on ${bg}`, r.toFixed(2), kind, ok ? "PASS" : "FAIL", use]);
}
for (const [bg, use] of ON_COLOR) {
  if (!tok[bg]) continue;
  const r = ratio("#ffffff", tok[bg]);
  const ok = r >= 4.5; // badge text is small
  if (!ok) fails++;
  rows.push([`white on ${bg}`, r.toFixed(2), "text", ok ? "PASS" : "FAIL", use]);
}

for (const [name, hex] of SHAPE_BADGES) {
  const r = ratio("#ffffff", hex);
  const ok = r >= 4.5;
  if (!ok) fails++;
  rows.push([`white on ${name}`, r.toFixed(2), "text", ok ? "PASS" : "FAIL", "fiscal-shape badge"]);
}

console.log("\nWCAG contrast audit — design tokens + fiscal-shape badges\n");
console.log(`  ${pad("pairing", 22)}${pad("ratio", 8)}${pad("need", 8)}${pad("result", 8)}usage`);
console.log("  " + "-".repeat(78));
for (const [pair, r, kind, res, use] of rows) {
  const mark = res === "PASS" ? "  ok " : " FAIL";
  console.log(`  ${pad(pair, 22)}${pad(r + ":1", 8)}${pad((kind === "text" ? "4.5" : "3.0") + ":1", 8)}${pad(mark, 8)}${use}`);
}
console.log("");
if (fails) {
  console.log(`  ${fails} text pairing(s) below WCAG AA (4.5:1).\n`);
  if (process.argv.includes("--ci")) process.exit(1);
} else {
  console.log("  All audited text pairings pass WCAG AA.\n");
}
