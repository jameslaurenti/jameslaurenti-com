# Accessibility (ongoing checks)

Target standard: **WCAG 2.1 AA** (the level U.S. courts and the DOJ treat as the ADA
benchmark for websites). Run these before shipping visual changes to `/work`.

## 1. Token contrast — fast, dependency-free

```
npm run a11y:contrast        # prints a pass/fail table for every text/background pairing
npm run a11y:contrast:ci     # same, but exits 1 on any AA failure (use in CI / pre-push)
```

`scripts/check-contrast.mjs` parses the real `--color-*` tokens out of `app/globals.css`,
so it can't drift from the palette. It encodes which token is used as text on which
surface. **If you add a color token or use one on a new surface, add the pairing to the
`CHECKS` array in that script.**

Palette rules baked in (do not regress):
- **`--color-gold` is fills-only** (bars, decorative borders, light tints, and marks on the
  dark tracker). It fails contrast as text on paper. For any gold **text or badge**, use
  **`--color-gold-strong`** (`text-gold-strong`, `bg-gold-strong`).
- `--color-debt` was darkened to `#9c4a24` so it passes AA as small text.

## 2. Full-page audit — contrast in context, ARIA, labels, headings, alt

Uses [pa11y-ci] (axe-core + HTML CodeSniffer) against the running dev server.

```
npm install -D pa11y-ci     # one time
npm run dev                 # in one terminal
npm run a11y                # in another; audits every route in .pa11yci.json
```

Add new routes to `.pa11yci.json` as pages ship. Runs headless, no in-app browser needed.

## 3. Manual checklist (a few minutes, per release)

Automated tools catch ~40% of issues. Also eyeball:

- [ ] **Keyboard only:** Tab through each page. Every control reachable, focus ring always
      visible (we set `focus-visible` and never use `outline-none`).
- [ ] **Zoom to 200%** (Ctrl/Cmd +): no clipping, no horizontal scroll, text reflows.
- [ ] **Mobile (375px) and tablet (768px):** no horizontal overflow; tap targets comfortable;
      the smallest labels (8.5–11px) still legible on a phone.
- [ ] **Reduced motion:** with OS "reduce motion" on, reveal animations don't run
      (handled in the `useReveal` hooks).
- [ ] **Charts:** the meaning is never carried by color alone (values/labels/legends present).
- [ ] **Screen-reader spot check** (VoiceOver/NVDA) on one reading page and one tool.

## Font sizing

All `text-[…]` sizes in `/work/beverly` are **rem**, so they honor a user's browser
font-size preference (not just zoom). The tiny-label tier is **floored at 11px** (0.6875rem);
nothing renders smaller at default. Keep it that way: use `rem` for any new font size, and
don't go below `text-[0.6875rem]` for real text. (Borders, spacing, and SVG chart labels stay
in px on purpose.)

## Known follow-ups (not blockers)

- The identity-essay charts (`IdentityCharts.tsx`) are `<div>` bars; values are in adjacent
  text, but a visually-hidden `<table>` alternative would be cleaner for screen readers.
