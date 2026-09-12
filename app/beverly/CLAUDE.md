# CLAUDE.md

Guidance for Claude Code working on the **Civic Resources: Beverly** section
(`/work/beverly`) of jameslaurenti.com. Read this before building or editing
anything here. The repo-wide file is the root `CLAUDE.md` (`@AGENTS.md`); this
file is scoped to Beverly and does not override it.

## What this section is

`/work/beverly` is the Civic Resources: Beverly section of the site (a Next.js 16
/ Tailwind v4 / Vercel personal site). It collects explainers and tools that make
Beverly, Massachusetts's budget and development legible: a budget explainer, an
FY2027 budget piece, a budget challenge, and a development map, with room to grow
into other civic topics.

The current major body of work is a civic analysis of Beverly's structural budget
deficit. Its pieces are interactive React components (recharts) plus written
analysis, and they establish the interactive-piece pattern described under
"Components and routing" below.

## The frame (so you understand what you're building)

Beverly's deficit is not open-ended. Its largest fixed cost, the pension
unfunded-liability payment, is a decades-old inherited debt on a fixed PERAC
schedule that clears around FY33, freeing ~$12.8M/yr. The deficit is a bridge to a
dated cliff. The story maps the deficit trajectory (top-level and lever by lever)
to crystallize a realistic override ask and a long-term strategy. The pension cliff
piece is the load-bearing anchor; other pieces inherit its "bridge to a cliff"
frame.

## Division of labor

Analysis, sourcing, and first-draft components are produced in a separate claude.ai
project and handed off here as reference implementations plus a spec. Your job is to
port them into idiomatic repo code, wire routing, and ship. Reference components use
inline styles, a `<style>` block, and a Google Fonts `@import` so they preview
outside the repo. Always port those out (see "Porting reference components").

## Design system

- Primary: forest green `#2d6a4f`, the `--color-accent` token.
- Display type: Bricolage Grotesque. Body: DM Sans. Backgrounds: warm gray.
- Fonts are loaded site-wide via next/font in `app/layout.tsx`
  (`Bricolage_Grotesque` → `--font-bricolage`, `DM_Sans` → `--font-dm-sans`). The
  `@theme` block in `app/globals.css` re-exposes them as `--font-display` and
  `--font-sans`, so components use the Tailwind classes `font-display` and
  `font-sans`. `h1`–`h3` already default to the display face via `globals.css`.
  **Do not** add `@import` or `<link>` font tags in components.
- Tailwind v4 tokens live in the `@theme` block in `app/globals.css`. Use the
  existing tokens; do not hardcode hex values. The ones you will reach for:
  - Forest green is **`--color-accent`** (`#2d6a4f`), used as `text-accent`,
    `bg-accent`, `border-accent`; lighter shade `--color-accent-lt` (`#40916c`);
    soft glow `--color-accent-glow`. It is **not** `--color-forest` or
    `--color-primary`.
  - Backgrounds `--color-bg` (`#f0ede8`) and `--color-bg-card` (`#e8e4de`).
  - Text `--color-ink`, `--color-ink-mid`, `--color-ink-faint`.
  - Hairlines `--color-rule` and `--color-line` (both `rgba(0,0,0,0.09)`; both are
    used in existing pages).
- Supporting palette used in the reference charts (debt/burden burnt sienna
  `#b0562b`, a muted gold `#b8923a`, and a deep forest `#1e4d38` the reference
  calls `forestDeep`) is **not** in `@theme` yet. Add them as tokens (e.g.
  `--color-debt`, `--color-gold`, `--color-accent-deep`) in `app/globals.css` when
  the first chart needs them, rather than inlining hex.

## Voice (all written copy and UI text)

Clean register. Lead with the answer. **No em-dashes** anywhere; use commas,
periods, or restructure. Vary sentence length. No filler intensifiers (actually,
genuinely, really, simply, truly). No windup filler (moreover, ultimately, that
said). No reassuring closers. Credential unfamiliar terms on first use (e.g.
"unfunded liability" gets a plain-language gloss). This applies to headings, chart
labels, tooltips, and body copy, not just prose.

## Fidelity conventions

Fidelity is the point of this project. Every published figure must be traceable.

- Numbers come from the shared data layer (see below), never hardcoded in a
  component.
- Each figure carries a confidence level: `confirmed` (from a primary source),
  `modeled` (derived on stated assumptions), or `illustrative` (a sketch, not a
  source number).
- Components should surface confidence where it matters: a citation or source note
  for `confirmed`, a visible "modeled" or "illustrative" marker otherwise. Never let
  a chart imply a modeled number is a source number.
- When a value updates (e.g. the Jan 2026 pension valuation), change it in the data
  layer only.

## Data layer

Domain data lives in `data/beverly/*.json` (repo root), each file with a `_meta`
block (source, page, confidence, retrieved date, notes). See
`data/beverly/pension.json` for the pattern; `forecast.json` (FY26–30 city
forecast lines), `exempt.json` (PILOT parcel totals), and `newgrowth.json`
(11-year DLS series) follow it. The `@/*` alias maps to `./*` (see
`tsconfig.json`) and `resolveJsonModule` is enabled, so components import as
`import pension from "@/data/beverly/pension.json"`. No `components/beverly/`
directory exists yet; the first ported piece establishes it.

## Components and routing

- Charts use recharts. It is **not** installed yet (absent from `package.json`);
  run `npm install recharts` before the first chart piece. The pension-cliff port
  will be the first recharts consumer in the repo.
- Existing routing today: the section index is `app/work/beverly/page.tsx` (a
  hand-coded, grouped list of `Link`s, no MDX). The shipped text pieces
  (`budget-explainer`, `fy27-budget`, `budget-challenge`) are static hand-authored
  HTML at `public/work/beverly/<slug>/index.html`, served at that path. The
  development map is an iframe embed at `app/work/beverly/development-map/page.tsx`.
  `vercel.json` holds short-URL redirects into these paths.
- No interactive React route segment exists yet. Build an interactive piece like
  the pension cliff as a new `app/work/beverly/<slug>/page.tsx` client component;
  this is the deliberate pattern for interactive pieces, and adding a new
  `piece` entry to the index in `page.tsx` links it in.
- Interactive components need `"use client"`. Keep each piece a single component
  file where practical.
- Respect `prefers-reduced-motion`.

## Porting reference components

Reference components handed off from the claude.ai project live in
`docs/beverly/reference/` (`.jsx`, not built). To port one:
1. Remove the Google Fonts `@import`; rely on the site font loader.
2. Convert the `<style>` block and inline styles to the repo's Tailwind v4 tokens
   and class conventions (see "Design system").
3. Replace hardcoded data arrays with imports from `data/beverly/`.
4. Add `"use client"` if it uses state or recharts.
5. Wire it in as a new `app/work/beverly/<slug>/page.tsx` client component and add
   a `piece` entry to the index in `app/work/beverly/page.tsx`.
6. Keep the copy verbatim unless it violates the voice rules; the copy is authored,
   not placeholder.

## Key files

- `app/globals.css` — the `@theme` block (color and font tokens) and prose styles.
- `app/layout.tsx` — the `next/font` loader for Bricolage Grotesque and DM Sans.
- `app/work/beverly/page.tsx` — the section index; add a `piece` entry to link a
  new page in.
- `tsconfig.json` — the `@/*` alias and `resolveJsonModule`.
- `docs/beverly/` — planning docs (`beverly-driver-ledger.md`,
  `beverly-story-roadmap.md`) and `reference/` handoff components.

If you add a piece that needs recharts, remember it is not installed yet.
