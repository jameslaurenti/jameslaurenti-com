// Beverly bridge model — stage-2 engine.
//
// Rebuilds the city forecast bottom-up, swaps in the authoritative PERAC pension
// line (incl. the FY32-33 cliff), extends past the forecast horizon (FY30) to
// FY40 on the forecast's own observed slopes, layers the structural levers (new
// growth, PILOT, health savings) and a permanent override, and tracks reserves
// against a floor.
//
// Fidelity: FY27-FY30 use the city's confirmed forecast aggregates
// (data/beverly/forecast.json) with the PERAC pension line
// (data/beverly/pension.json) substituted, which runs ~$0.6M steeper than the
// forecast's own pension assumption. FY31-FY40 are a MODELED extension on the
// FY27-30 revenue and ex-pension slopes. Lever ramps and the override are
// modeled. Reserves assume gaps are absorbed by the undesignated fund balance (no
// service cuts modeled), so a balance below the floor marks where cuts would be
// forced. Spec: docs/beverly/bridge-model-scope.md.

import forecast from "@/data/beverly/forecast.json";
import pension from "@/data/beverly/pension.json";
import newgrowth from "@/data/beverly/newgrowth.json";
import exempt from "@/data/beverly/exempt.json";

export type BridgeParams = {
  overrideAmount: number; // permanent operating override, $M
  newGrowthTarget?: number; // sustained new growth $/yr, default = city plan (1.25)
  pilotTarget?: number; // PILOT revenue target $/yr, default = current (0.25)
  healthSavings?: number; // annual expenditure reduction $/yr, default 0
  overrideStartFy?: number; // default 2028
  leverStartFy?: number; // default 2028
  newGrowthRampYears?: number; // default 4
  reserveFloorPct?: number; // default 0.05 (mid of DLS 3-8% band)
};

export type YearRow = {
  fy: number;
  fyLabel: string;
  confirmed: boolean;
  revenue: number;
  expenseExPension: number;
  pension: number;
  totalExpense: number;
  leverRevenue: number; // new growth + PILOT above baseline
  leverExpReduction: number; // health savings
  overrideRevenue: number;
  effRevenue: number; // revenue + levers + override
  effExpense: number; // totalExpense - health savings
  deficitBase: number; // do nothing
  deficitStrategy: number; // levers + override
  reserveBase: number;
  reserveStrategy: number;
  reserveFloor: number;
};

export type Scissors = {
  baseRevPct: number;
  baseExpPct: number;
  stratRevPct: number;
  stratExpPct: number;
  baseGapPct: number; // structural gap in points, do nothing
  stratGapPct: number; // ... with levers (slope bend only, not the override)
};

export type BridgeResult = {
  rows: YearRow[];
  peak: { fyLabel: string; deficit: number };
  breachBaseFy: string | null;
  breachStrategyFy: string | null;
  smallestOverrideToHold: number | null; // given the current levers, holds reserves >= floor through FY33
  scissors: Scissors;
};

const FIRST_FY = 2027;
const LAST_FY = 2040;
const CLIFF_END_FY = 2033;

const START_RESERVE = forecast.reserves.undesignatedFundBalance.FY26; // $14.2M
const RET_FY27 = forecast.expenditureDetailFy27.municipalLines.retirementAssessment / 1e6;
const RET_GROWTH = 0.045;
const NORMAL_GROWTH = 0.04;

const NEW_GROWTH_BASELINE = newgrowth.cityPlanningAssumption.amount; // 1.25, already in forecast revenue
const PILOT_CURRENT = exempt.totals.currentPilotRevenue / 1e6; // 0.25

const fyLabel = (y: number) => `FY${String(y).slice(2)}`;

const peracTotal: Record<string, number> = {};
for (const r of pension.schedule) peracTotal[r.fy] = r.total;
const PERAC_FY33 = pension.cliff.clearedTotal;

const sumByFy: Record<string, { revenue: number; expenditure: number }> = {};
for (const s of forecast.summary.years) {
  sumByFy[s.fy] = { revenue: s.revenue, expenditure: s.expenditure };
}

function pensionFor(y: number): number {
  const label = fyLabel(y);
  if (peracTotal[label] !== undefined) return peracTotal[label];
  return PERAC_FY33 * Math.pow(1 + NORMAL_GROWTH, y - CLIFF_END_FY);
}

function baseSeries() {
  const rev: Record<number, number> = {};
  const exPen: Record<number, number> = {};
  for (let y = 2027; y <= 2030; y++) {
    const s = sumByFy[fyLabel(y)];
    const forecastRet = RET_FY27 * Math.pow(1 + RET_GROWTH, y - 2027);
    rev[y] = s.revenue;
    exPen[y] = s.expenditure - forecastRet;
  }
  const revCagr = Math.pow(rev[2030] / rev[2027], 1 / 3) - 1;
  const exPenCagr = Math.pow(exPen[2030] / exPen[2027], 1 / 3) - 1;
  for (let y = 2031; y <= LAST_FY; y++) {
    rev[y] = rev[2030] * Math.pow(1 + revCagr, y - 2030);
    exPen[y] = exPen[2030] * Math.pow(1 + exPenCagr, y - 2030);
  }
  return { rev, exPen };
}

// New growth above the city's baseline compounds like the levy (stacks, then +2.5%/yr),
// ramping to target linearly over rampYears.
function newGrowthExtra(target: number, startFy: number, rampYears: number, y: number): number {
  const delta = Math.max(0, target - NEW_GROWTH_BASELINE);
  if (delta === 0 || y < startFy) return 0;
  let sum = 0;
  for (let k = startFy; k <= y; k++) {
    const inc = delta * Math.min(1, (k - startFy + 1) / rampYears);
    sum += inc * Math.pow(1.025, y - k);
  }
  return sum;
}

// PILOT is a negotiated level add above the current $0.25M, ramped over 3 years.
function pilotExtra(target: number, startFy: number, y: number): number {
  const delta = Math.max(0, target - PILOT_CURRENT);
  if (delta === 0 || y < startFy) return 0;
  return delta * Math.min(1, (y - startFy + 1) / 3);
}

// Health savings reduce expenditure, ramped over 3 years, held flat (conservative).
function healthReduction(savings: number, startFy: number, y: number): number {
  if (savings <= 0 || y < startFy) return 0;
  return savings * Math.min(1, (y - startFy + 1) / 3);
}

function overrideRevenueFor(amount: number, startFy: number, y: number): number {
  return y < startFy ? 0 : amount * Math.pow(1.025, y - startFy);
}

export function computeBridge(params: BridgeParams): BridgeResult {
  const { overrideAmount } = params;
  const ngTarget = params.newGrowthTarget ?? NEW_GROWTH_BASELINE;
  const pilotTarget = params.pilotTarget ?? PILOT_CURRENT;
  const healthSavings = params.healthSavings ?? 0;
  const overrideStartFy = params.overrideStartFy ?? 2028;
  const leverStartFy = params.leverStartFy ?? 2028;
  const rampYears = params.newGrowthRampYears ?? 4;
  const floorPct = params.reserveFloorPct ?? 0.05;
  const { rev, exPen } = baseSeries();

  const leverRevenueFor = (y: number) =>
    newGrowthExtra(ngTarget, leverStartFy, rampYears, y) + pilotExtra(pilotTarget, leverStartFy, y);
  const leverExpReductionFor = (y: number) => healthReduction(healthSavings, leverStartFy, y);

  const rows: YearRow[] = [];
  let reserveBase = START_RESERVE;
  let reserveStrategy = START_RESERVE;

  for (let y = FIRST_FY; y <= LAST_FY; y++) {
    const pen = pensionFor(y);
    const totalExpense = exPen[y] + pen;
    const leverRevenue = leverRevenueFor(y);
    const leverExpReduction = leverExpReductionFor(y);
    const overrideRevenue = overrideRevenueFor(overrideAmount, overrideStartFy, y);
    const deficitBase = rev[y] - totalExpense;
    const effRevenue = rev[y] + leverRevenue + overrideRevenue;
    const effExpense = totalExpense - leverExpReduction;
    const deficitStrategy = effRevenue - effExpense;
    reserveBase += deficitBase;
    reserveStrategy += deficitStrategy;
    rows.push({
      fy: y,
      fyLabel: fyLabel(y),
      confirmed: y <= 2030,
      revenue: rev[y],
      expenseExPension: exPen[y],
      pension: pen,
      totalExpense,
      leverRevenue,
      leverExpReduction,
      overrideRevenue,
      effRevenue,
      effExpense,
      deficitBase,
      deficitStrategy,
      reserveBase,
      reserveStrategy,
      reserveFloor: floorPct * totalExpense,
    });
  }

  let peak = rows[0];
  for (const r of rows) if (r.fy <= CLIFF_END_FY && r.deficitBase < peak.deficitBase) peak = r;

  const firstBreach = (key: "reserveBase" | "reserveStrategy") => {
    for (const r of rows) if (r[key] < r.reserveFloor) return r.fyLabel;
    return null;
  };

  // Smallest override that, ON TOP of the current levers, holds reserves >= floor through FY33.
  let smallest: number | null = null;
  for (let amt = 0; amt <= 20.0001; amt += 0.25) {
    let reserve = START_RESERVE;
    let holds = true;
    for (let y = FIRST_FY; y <= CLIFF_END_FY; y++) {
      const totalExpense = exPen[y] + pensionFor(y);
      const deficit =
        rev[y] - totalExpense + leverRevenueFor(y) + leverExpReductionFor(y) +
        overrideRevenueFor(amt, overrideStartFy, y);
      reserve += deficit;
      if (reserve < floorPct * totalExpense) { holds = false; break; }
    }
    if (holds) { smallest = Math.round(amt * 100) / 100; break; }
  }

  // Structural scissors: revenue vs ex-pension expenditure growth, FY27->FY40.
  // Levers bend the slope; the override is a level shift, so it is excluded here.
  const n = LAST_FY - FIRST_FY;
  const cagr = (a: number, b: number) => Math.pow(b / a, 1 / n) - 1;
  const baseRevPct = cagr(rev[FIRST_FY], rev[LAST_FY]);
  const baseExpPct = cagr(exPen[FIRST_FY], exPen[LAST_FY]);
  const stratRevPct = cagr(rev[FIRST_FY] + leverRevenueFor(FIRST_FY), rev[LAST_FY] + leverRevenueFor(LAST_FY));
  const stratExpPct = cagr(exPen[FIRST_FY] - leverExpReductionFor(FIRST_FY), exPen[LAST_FY] - leverExpReductionFor(LAST_FY));

  return {
    rows,
    peak: { fyLabel: peak.fyLabel, deficit: peak.deficitBase },
    breachBaseFy: firstBreach("reserveBase"),
    breachStrategyFy: firstBreach("reserveStrategy"),
    smallestOverrideToHold: smallest,
    scissors: {
      baseRevPct,
      baseExpPct,
      stratRevPct,
      stratExpPct,
      baseGapPct: baseExpPct - baseRevPct,
      stratGapPct: stratExpPct - stratRevPct,
    },
  };
}
