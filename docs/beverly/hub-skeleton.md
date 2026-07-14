# Beverly Deficit Story: Hub Skeleton (Phase 2)

Outline only, no prose (per `beverly-story-roadmap.md`, Phase 2). Purpose: fix the
hub's argument, and learn what each spoke must deliver before the spokes are built.
This becomes the spec for the Phase-6 hub page. Every number below is either sourced
(from `beverly-driver-ledger.md` / the data layer) or explicitly marked as owed by a
spoke or the bridge model.

## Framing: this is a slope problem, not a level problem

The real problem is a **structural scissors**: expenditures grow ~5%/yr while revenue
is capped near 2.5% + new growth by Prop 2½ (the city forecast runs ~2.9% revenue vs.
~5% expenditure). That gap *compounds*, and nearly every Massachusetts municipality
shares it. It is largely systemic, not a Beverly failure.

Almost every lever in this story is a **level shift**, not a slope bend:
- **Pension cliff** — a one-time ~$12.8M level *drop* at FY33. It buys ~4 years (the
  structural gap regrows ~$3–3.5M/yr and eats it back), it is conditional on returns,
  and it is partly pre-claimed (OPEB, new debt). It is a **tailwind, not the anchor.**
- **New growth** — a recurring level shift up. It bends the revenue curve only if it
  *accelerates* year over year; steady new growth just raises a line still climbing ~2.5%.
- **PILOT, override, re-amortization** — all level moves.

Genuine **slope bends** are few, hard, and partial: on cost, regionalization / benefit
redesign / contract discipline / enrollment-driven school right-sizing (maybe 0.5–1.5
pts off ~5%); on revenue, only sustained *accelerating* development. The honest goal is
to **narrow the scissors** (≈2 pts → ≈1 pt) so the cliff + a modest override + reserves
make it *manageable*, not to eliminate it. No silver bullet, and saying so plainly
serves the neutrality/trust bar. How the model tests level vs. slope: `bridge-model-scope.md`.

---

## The argument, section by section

### 1. Thesis: a compounding structural gap, with a dated reprieve
- **Claim:** Beverly's deficit compounds to $13.7M by FY30 because costs outgrow a capped revenue line. The pension cliff (~$12.8M/yr at FY33) is a real reprieve, but a one-time reset, not a fix: the gap regrows within ~4 years unless the structural levers narrow the scissors.
- **Needs (hero chart):** top-level trajectory — forecast deficit FY27–FY30 ($3.9M → $13.7M) extended *through FY40*, layering the pension step-down AND the post-cliff regrowth. The regrowth is the point of the chart, not just the drop.
- **Links to:** pension-cliff spoke (done); FY27 budget explainer (shipped, static).
- **Fidelity:** forecast lines `confirmed` (Dec 2025 Financial Forecast Committee). The FY31+ extension is `modeled`. **Blocked on: bridge model.**

### 2. Why the gap compounds
- **Claim:** revenue is capped near 2.5% (Prop 2½) while expenditures grow ~5%; the wedge is structural, not waste.
- **Needs (one number):** revenue vs. expenditure growth slopes (~2.9% vs. ~5%/yr).
- **Links to:** cost-side reality spoke (not started); FY27 explainer.
- **Fidelity:** `confirmed` (forecast). Backed by `data/beverly/forecast.json`.

### 3. Why it happened (inherited-debt frame)
- **Claim:** the largest fixed cost is legacy pension debt with a scheduled end; that end is what makes the deficit a bridge.
- **Needs (one number):** ~2/3 of the pension line is debt; clears ~$12.8M/yr at FY33.
- **Links to:** pension-cliff spoke (done). Reuse its opener at summary length.
- **Fidelity:** `confirmed` (PERAC 1/1/24). Backed by `data/beverly/pension.json`.

### 4. The levers, threaded (one screen + one number each)
Each links to its spoke and firms its ramp assumption in the bridge model.

| Lever | Claim (one line) | The number | Spoke status | Data |
|---|---|---|---|---|
| New growth | The only lever that compounds and costs residents nothing | ~$1.6M avg today (city plans $1.25M) → target $2.5–3M/yr | Data ready | `newgrowth.json` |
| PILOT | The answer to "why should residents pay first" | $250K now → $600K–1.25M/yr; Endicott alone forgoes $2.16M | Data ready | `exempt.json` |
| Health insurance | The largest cost line the city can actually touch | self-insured, ~10% trend; local lever $150–500K/yr | Partial data | needs Finance cost-share % |
| Cost-side reality | Schools are half the budget; nothing structural works without bending them | schools +5%/yr, ~49.7% of budget; SPED = the variance | Not started | ledger Part 2 |
| Pension cliff | The endgame, already partly claimed | ~$12.8M/yr from FY33; $50M services building lands the same year | Done | `pension.json` |

### 5. The bridge model (the math)
- **Claim:** layer forecast + pension schedule + lever ramps + reserves + an override toggle to produce the deficit and reserve path under any assumptions, and to show whether the scissors is *bent* or merely *shifted*.
- **Needs (chart):** no-override vs. with-override deficit and reserve trajectories, FY27–**FY40** (past the cliff, to show regrowth), under three toggles: **override** (size/phase/duration), **cliff date** (FY33/FY35/slip), **pension re-amortization** (aggressive vs. stretch toward 2040).
- **Links to:** bridge model (not built) — full spec in `bridge-model-scope.md`. **This section IS the model surfaced.**
- **Fidelity:** every lever ramp `modeled` and labeled; show both paths, and show revenue vs. expenditure *slopes* explicitly. **Blocked on: bridge model.**

### 6. Output (a): the override ask (this-or-that)
- **Claim:** one **permanent** operating override of roughly **$10–12M** (floor ~$8M; politically risky ceiling ~$15M / Marblehead territory), framed as *the last one* — small and final because the cliff and the levers carry it from there. Or the same dollars as an itemized service-cut list.
- **Sizing logic (locked):** the binding constraint is the **peak years (FY29–31)**, ~$17M deficit at the FY31 peak. Size the override to hold the peak *after* the cliff, the maturing levers, and a **bounded** reserve draw, without breaching the reserve floor. Against the *net* bridge that is ~⅓ (the "30%" instinct, on the right denominator). It is a **permanent** levy increase, so its cumulative bridge-years value is large; "temporary/phased" is a narrative device, and phasing means multiple ballot questions (harder than one).
- **Needs (chart + number):** override size → tax impact (~$50–55/yr per $1M on the median ~$7,100–7,700 bill) vs. the service-cut alternative; Marblehead ($15M, ~$1,230/yr cumulative, no end date) as the anchor.
- **Links to:** override spoke (blocked on model).
- **Fidelity:** the residual `modeled` off the bridge model; tax-per-$1M `confirmed`. **Blocked on: bridge model → override spoke.**

### 7. Output (b): the strategy, with or without an override
- **Claim:** do the structural work regardless (new growth, PILOT, health, capital discipline, a pre-set cliff-allocation plan); an override buys the bridge years; without it the bridge requires deep cuts; with it Beverly crosses intact, reaches surplus sooner, and freed pension capacity funds OPEB while matured levers carry the base.
- **Needs (chart):** the two paths to surplus; plus the "cliff allocation" of the freed ~$12.8M split into must-do (OPEB) vs. choice (capital: school, services building).
- **Links to:** all spokes; the OPEB figure.
- **Fidelity:** **Blocked on: OPEB liability (data-lock item)** and the bridge model. This is the hub's landing; it is built last.

### 8. The honest framing (close)
- **Claim:** a bridge to dated, named fixes is a different product than a subscription, and it is true only if the city executes the structural work; the failure mode is taking the money and skipping the work (Marblehead will demonstrate it by 2029).
- **Needs:** none (rhetorical close).
- **Fidelity:** voice + neutrality bar per the pension-cliff piece. No blame, no boosterism.

### 9. Sources / fidelity footer
- Same discipline as the anchor: every figure traceable, confidence surfaced, modeled vs. confirmed never blurred.

---

## What each spoke owes the hub (the spec this skeleton produces)

- **Pension cliff (done):** the ~$12.8M/yr release, the FY32–33 two-step, the "already claimed" services-building point. *Ready.*
- **Bridge model (build next):** the extended deficit curve for §1, the two-path chart for §5, and the residual that becomes the override number for §6. *Gating dependency for §1, §5, §6, §7.*
- **New growth:** a defensible ramp from ~$1.6M to the $2.5–3M target, with a timeline (2–4 yrs/project) and the CIP-margin point. *Feeds §4 + model.*
- **PILOT:** the realistic $600K–1.25M/yr band and the Endicott $2.16M headline. *Feeds §4 + model.*
- **Health insurance:** the $150–500K/yr local-action ceiling and the GIC-entry question. *Feeds §4 + model. Needs Finance cost-share %.*
- **Cost-side reality:** what is truly cuttable (schools, Essex Tech, SPED). *Feeds §4 + the §6 cut-list alternative.*
- **Override (synthesis):** reads (a) off the model and presents the this-or-that. *Blocked on model.*

## Open items that gate specific sections
- **OPEB liability + trust balance** → gates §7's cliff-allocation split. (Data-lock item.)
- **MSBA school-project status** → could dwarf the capital picture in §4/§7.
- **Prudent reserve floor** (DLS ~5%) → sets the bridge-years drawdown limit in §5.
- **Defensible lever ramps** (PILOT + new growth take years) → the model must not assume fast arrival.

## Sequencing note
Per the roadmap, the finished hub page is Phase 6 (built last). The gating build is
the **bridge model** (Phase 3): it unblocks §1, §5, §6, and §7. Recommend that as the
next artifact after this skeleton is agreed.
