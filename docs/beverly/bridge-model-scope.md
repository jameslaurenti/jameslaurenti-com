# Beverly Bridge Model: Scope (Phase 3)

The quantitative engine behind the hub. It produces the override number and, more
importantly, tests whether any combination of levers **bends the structural scissors**
or only **shifts/delays** it. Companion to `hub-skeleton.md` and `beverly-story-roadmap.md`
(Phase 3).

## The core question
Expenditures grow ~5%/yr; revenue is capped near ~2.9% (Prop 2½ + new growth). That
divergence *is* the deficit. The model must make the level-vs-slope distinction visible:
which moves lift or drop a line once, and which (if any) change its *growth rate*.

## Structure
Year-by-year, **FY27–FY40** (past the FY33 cliff, so the post-cliff regrowth shows). Layers:
- city forecast revenue + expenditure lines (gap $3.9M → $13.7M, FY27–30),
- the PERAC pension schedule including the FY32–33 cliff,
- a ramp per structural lever (new growth, PILOT, health) with adjustable assumptions,
- reserve balances drawn down / rebuilt, against a floor,
- an override.

## The three toggles (the point of the tool)
1. **Override** — size, phase-in, duration. Locked planning band: **$10–12M permanent**,
   sized to hold the FY29–31 peak after cliff + levers + a bounded reserve draw. Not
   temporary; framed as the last one.
2. **Cliff date** — FY33 (adopted) / FY35 (PERAC outer bound) / user slip. Tests
   robustness to the anchor being soft.
3. **Pension re-amortization** — keep the aggressive FY33 schedule vs. stretch toward
   2040. Path A (override + cliff) vs. Path B (smaller override + flattened FY29–31 peak,
   more total cost, no windfall).

## Required outputs
- Deficit + reserve trajectory FY27–FY40, no-override vs. with-override, side by side.
- **Peak-year test:** does the chosen override hold FY29–31 without breaching the reserve floor?
- **Scissors view:** revenue vs. expenditure *slopes*, and how far each lever bend narrows
  them. Show that the cliff resets the *level* but the gap regrows in ~4 years absent a
  slope bend.
- Path A vs. Path B vs. cliff-slip, on the same axes.

## Locked decisions (from the strategy discussion)
- The cliff is a **tailwind, not the anchor** (conditional, buys ~4 yrs, partly pre-claimed).
- Revenue leadership is **new growth**, the only city-controlled compounding lever, but it
  bends the curve only if it *accelerates*, and it is correlated with the same downturn that
  slips the cliff (not a hedge against it).
- Override ~**$10–12M**, permanent, peak-year-sized, "the last one."
- The realistic goal is to **narrow** the scissors, not close it. No silver bullet.

## Readiness (after data audit, 2026-07)
Most of the engine is in hand. `forecast.json` carries the FY27 revenue/expenditure detail
line by line, the forecast's own per-line **growth assumptions** (salaries 1.5%, expenses
2.5%, health 6%, retirement 4.5%, OPEB 3.75%, schools 3%+enrollment, vocational 3.75%), and
the reserve history + DLS 3–8% policy band. `newgrowth.json` and `exempt.json` carry the
lever baselines and targets. So the model can be built bottom-up now: rebuild the forecast
from the FY27 bases × growth rates, extend to FY40, layer the PERAC schedule, parameterize
the lever ramps, track reserves, add the override.

Reconciliation note: the forecast's retirement line ($14.98M FY27) sits ~$0.6M below the
PERAC schedule ($15.58M). Use `pension.json` (PERAC) as authoritative for the pension line.

## Still genuinely open (does not block the core build)
- **Re-amortization legality + cost** (actuary / PERAC) → blocks only the Path B toggle;
  stub as illustrative or defer. Do not invent.
- **OPEB total liability + trust balance** → needed for the hub's §7 allocation narrative,
  not the model's deficit path (the annual OPEB contribution is already in the forecast).
- **Reserve floor** → a settable assumption within the DLS 3–8% band, not a blocker.
- **FY26 certified tax rate** → minor; scales PILOT foregone-tax linearly.
- **Lever ramp shapes** → adjustable parameters (the point of the tool), not blockers.

## Build form
Spreadsheet or interactive React scenario tool. The React version doubles as the
publishable artifact behind the hub's §1 and §5 charts. Fidelity: label every modeled
assumption; never blur modeled vs. confirmed.
