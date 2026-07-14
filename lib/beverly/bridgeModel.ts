// Beverly bridge model — stage-1 engine.
//
// Rebuilds the city forecast bottom-up, swaps in the authoritative PERAC pension
// line (incl. the FY32-33 cliff), extends past the forecast horizon (FY30) to
// FY40 on the forecast's own observed slopes, and tracks reserves against a floor.
//
// Fidelity: FY27-FY30 use the city's confirmed forecast aggregates
// (data/beverly/forecast.json) with the PERAC pension line
// (data/beverly/pension.json) substituted, which runs ~$0.6M steeper than the
// forecast's own pension assumption. FY31-FY40 are a MODELED extension on the
// FY27-30 revenue and ex-pension slopes. Reserves assume gaps are absorbed by the
// undesignated fund balance (no service cuts modeled), so a balance below the
// floor marks where cuts would be forced. Spec: docs/beverly/bridge-model-scope.md.

import forecast from "@/data/beverly/forecast.json";
import pension from "@/data/beverly/pension.json";

export type BridgeParams = {
  overrideAmount: number; // permanent operating override, $M
  overrideStartFy?: number; // default 2028
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
  overrideRevenue: number;
  deficitBase: number; // revenue - totalExpense (no override)
  deficitWithOverride: number;
  reserveBase: number;
  reserveWithOverride: number;
  reserveFloor: number;
};

export type BridgeResult = {
  rows: YearRow[];
  peak: { fyLabel: string; deficit: number };
  breachBaseFy: string | null; // first year reserves drop below floor, no override
  breachOverrideFy: string | null; // ... with the given override
  smallestOverrideToHold: number | null; // smallest override holding reserves >= floor through FY33
};

const FIRST_FY = 2027;
const LAST_FY = 2040;
const CLIFF_END_FY = 2033;

const START_RESERVE = forecast.reserves.undesignatedFundBalance.FY26; // $14.2M
const RET_FY27 = forecast.expenditureDetailFy27.municipalLines.retirementAssessment / 1e6; // forecast's own pension line
const RET_GROWTH = 0.045; // forecast assumption for its pension line
const NORMAL_GROWTH = 0.04; // post-cliff normal-cost growth (payroll-ish)

const fyLabel = (y: number) => `FY${String(y).slice(2)}`;

const peracTotal: Record<string, number> = {};
for (const r of pension.schedule) peracTotal[r.fy] = r.total;
const PERAC_FY33 = pension.cliff.clearedTotal; // normal cost only, $5.8M

const sumByFy: Record<string, { revenue: number; expenditure: number }> = {};
for (const s of forecast.summary.years) {
  sumByFy[s.fy] = { revenue: s.revenue, expenditure: s.expenditure };
}

function pensionFor(y: number): number {
  const label = fyLabel(y);
  if (peracTotal[label] !== undefined) return peracTotal[label];
  return PERAC_FY33 * Math.pow(1 + NORMAL_GROWTH, y - CLIFF_END_FY); // FY34+
}

// Override-independent revenue and ex-pension series, FY27-FY40.
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

function overrideRevenueFor(amount: number, startFy: number, y: number): number {
  return y < startFy ? 0 : amount * Math.pow(1.025, y - startFy);
}

// True if reserves stay >= floor every year through the cliff (FY33).
function holdsThroughCliff(
  amount: number,
  startFy: number,
  rev: Record<number, number>,
  exPen: Record<number, number>,
  floorPct: number,
): boolean {
  let reserve = START_RESERVE;
  for (let y = FIRST_FY; y <= CLIFF_END_FY; y++) {
    const totalExpense = exPen[y] + pensionFor(y);
    const deficit = rev[y] - totalExpense + overrideRevenueFor(amount, startFy, y);
    reserve += deficit;
    if (reserve < floorPct * totalExpense) return false;
  }
  return true;
}

export function computeBridge(params: BridgeParams): BridgeResult {
  const { overrideAmount } = params;
  const startFy = params.overrideStartFy ?? 2028;
  const floorPct = params.reserveFloorPct ?? 0.05;
  const { rev, exPen } = baseSeries();

  const rows: YearRow[] = [];
  let reserveBase = START_RESERVE;
  let reserveOv = START_RESERVE;

  for (let y = FIRST_FY; y <= LAST_FY; y++) {
    const pen = pensionFor(y);
    const totalExpense = exPen[y] + pen;
    const deficitBase = rev[y] - totalExpense;
    const overrideRevenue = overrideRevenueFor(overrideAmount, startFy, y);
    const deficitWithOverride = deficitBase + overrideRevenue;
    reserveBase += deficitBase;
    reserveOv += deficitWithOverride;
    rows.push({
      fy: y,
      fyLabel: fyLabel(y),
      confirmed: y <= 2030,
      revenue: rev[y],
      expenseExPension: exPen[y],
      pension: pen,
      totalExpense,
      overrideRevenue,
      deficitBase,
      deficitWithOverride,
      reserveBase,
      reserveWithOverride: reserveOv,
      reserveFloor: floorPct * totalExpense,
    });
  }

  // Peak within the bridge window (through the cliff), the deficit the override
  // must hold. The post-cliff structural regrowth to FY40 is shown in the chart,
  // not treated as "the peak."
  let peak = rows[0];
  for (const r of rows) if (r.fy <= CLIFF_END_FY && r.deficitBase < peak.deficitBase) peak = r;

  const firstBreach = (key: "reserveBase" | "reserveWithOverride") => {
    for (const r of rows) if (r[key] < r.reserveFloor) return r.fyLabel;
    return null;
  };

  let smallest: number | null = null;
  for (let amt = 0; amt <= 20.0001; amt += 0.25) {
    if (holdsThroughCliff(amt, startFy, rev, exPen, floorPct)) {
      smallest = Math.round(amt * 100) / 100;
      break;
    }
  }

  return {
    rows,
    peak: { fyLabel: peak.fyLabel, deficit: peak.deficitBase },
    breachBaseFy: firstBreach("reserveBase"),
    breachOverrideFy: firstBreach("reserveWithOverride"),
    smallestOverrideToHold: smallest,
  };
}
