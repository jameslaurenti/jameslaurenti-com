# Beverly Deficit Story: Build Roadmap

A sequenced plan for building the hub-and-spoke story. The order is chosen so each
piece rests on confirmed data and every later piece inherits the frame from an
earlier one.

## The goal, restated

Build a holistic account of Beverly's structural deficit, top-level and lever by
lever, that produces two things:

**(a) A realistic override ask.** A specific size and duration, framed as an
either/or: fund an override of $X/yr for Y years, or cut services by the same
amount. Same number, two forms.

**(b) A with-or-without-override strategy.** The structural work Beverly should do
regardless. Without an override it relieves pressure slowly and the bridge years
require deep cuts. With an override it covers the bridge and Beverly reaches
surplus sooner, once the pension cliff and matured levers stack.

Both outputs fall out of one quantitative spine: a year-by-year bridge model. Build
the model, and a and b are two readings of it.

## The architecture

| Piece | Role | Status |
|---|---|---|
| **Hub** | The holistic story. Top-level trajectory, threads the levers, lands a and b. | Not started |
| Pension cliff | Anchor spoke. The dated far shore. | **Done** |
| The bridge model | Quantitative spine. Produces the override number. | Not started |
| PILOT | Revenue lever. Strongest data (Endicott $2.16M vs $250K). | Data ready |
| New growth | Revenue lever. The compounding one. | Data ready |
| The override | Synthesis spoke. Crystallizes (a), the this-or-that. | Blocked on model |
| Health insurance | Cost lever. Modest, self-insured risk. | Partial data |
| Cost-side reality | What drives the gap, what is actually cuttable. | Not started |
| State aid advocacy | Lighter spoke. Low-dollar for Beverly, honest about it. | Optional |

## Build sequence

### Phase 0. Lock the data
Close the open items so nothing downstream rests on estimates.
- Pull Beverly's OPEB report + latest ACFR → OPEB liability and trust balance.
- Pull the capital improvement plan + debt schedule → school project and public
  services building timing and size.
- Get health-insurance cost-share % and a GIC-vs-self-insured comparison from
  Finance.
Produces: a confirmed-numbers cheat sheet. Unblocks: the health spoke, the
"spoken for" claims in the cliff spoke, and the bridge model's cost side.

### Phase 1. Anchor spoke: pension cliff  *(done)*
The load-bearing wall. Everything else inherits "bridge to a dated cliff." Keep it
as the reference for voice, design, and fidelity discipline.

### Phase 2. Draft the hub skeleton (not the prose)
Write the hub's argument as an outline only: section headers, the claim each makes,
and the one number or chart each needs. Purpose is to learn what every spoke must
deliver before building them. Do not write hub prose yet. Revisit in Phase 6.

### Phase 3. Build the bridge model
The analytical engine. A year-by-year model, FY27 through FY35, that layers:
- the city forecast's revenue and expenditure lines (the gap: $3.9M → $13.7M),
- the pension schedule including the FY32–33 cliff,
- a ramp for each structural lever (PILOT, new growth) with adjustable assumptions,
- reserve balances drawn down or rebuilt,
- an override toggle (size, phase-in, duration).
Output: the deficit path and reserve trajectory under any combination of
assumptions. This is where the override number is born. Build as a spreadsheet or
an interactive React scenario tool; the React version doubles as a publishable
artifact.
Fidelity note: label every lever assumption, and show the no-override and
with-override paths side by side.

### Phase 4. Revenue-lever spokes
Build the two levers that feed the model and reduce the override need. Both are
"do regardless" and both have data in hand.
- **PILOT spoke.** Endicott $2.16M foregone vs. $250K paid; the $451.6M
  PILOT-eligible exempt base; Boston's 25% framework → $600K–1.25M/yr realistic.
  Strongest rhetorical lever. The answer to "why should residents pay first."
- **New growth spoke.** The 11-year baseline (~$1.6M avg, city plans for $1.25M);
  the headroom to ~$2.5–3M; the commercial-vs-residential margin point; the named
  parcels. The only lever that compounds and costs residents nothing.
Each spoke firms up its ramp assumption in the model.

### Phase 5. The override spoke, which crystallizes (a)
Now the model has real lever inputs. Read the residual off it and present it two
ways:
- as an override: $X/yr phased over Y years, converted to dollars on the median
  tax bill (each ~$1M ≈ $50–55/yr), with the far shore visible (cliff + matured
  levers), and
- as the alternative: the same $X as an itemized service-cut list from the
  break-glass options (school reductions, fees, library/COA/veterans cuts, capital
  deferral, reserve depletion).
Anchor against Marblehead: smaller ask, shorter duration, a dated end. This is the
this-or-that piece.

### Phase 6. Write the hub, which crystallizes (b)
Everything now exists to assemble it. The hub:
- opens on the inherited-debt frame (fifty-year-old bill, almost paid),
- shows the top-level trajectory (the forecast gap widening),
- threads each lever at summary level, one screen and one number each, linking to
  its spoke,
- lands (b): the structural work happens regardless; without an override it relieves
  pressure slowly and the bridge hurts; with an override Beverly crosses the bridge
  intact and reaches surplus sooner, at which point freed pension capacity funds
  OPEB and the structural levers carry the base.
Write the hub prose last. It leans on every spoke, so it should be built when the
spokes can hold its weight.

### Phase 7. Supporting spokes, as needed
Build only what the hub actually leans on:
- **Health insurance:** self-insured, ~10% trend, the modest local lever, the
  GIC-entry question.
- **Cost-side reality:** schools (half the budget), Essex Tech, SPED volatility.
  What is truly cuttable and what is not.
- **State aid advocacy:** UGGA, Chapter 70 minimum aid. Honest that it is
  low-dollar for Beverly. Optional.

## Dependency logic, in one line

Data lock → anchor (done) → hub skeleton → bridge model → lever spokes refine the
model → override spoke reads (a) off the model → hub writes (b) → supporting spokes
fill gaps.

## Open questions to resolve along the way
- What is Beverly's OPEB liability, and how much of the FY33 relief should
  prudently go to pre-funding it?
- Is any Beverly school in or near the MSBA pipeline? That single decision could
  dwarf the rest.
- What reserve floor is prudent (DLS guidance ~5%), and how much can the bridge
  years draw down before the bond rating suffers?
- What lever ramp is defensible? PILOT and new growth both take years to produce;
  the model should not assume they arrive fast.
