// Shared types, constants, and pure helpers for the MA Property Tax Explorer.
// Data is the static JSON at /public/data/ma-property-tax.json (built by the
// mass-tax-rate-comparison pipeline).

export interface TownYear {
  fy: number;
  rate: number | null; // posted residential rate, $ per $1,000
  avg_bill: number | null;
  avg_value: number | null;
  income: number | null;
  effective_rate: number | null; // bill / value
  burden: number | null; // bill / median household income
  rank: number | null; // DLS statewide bill rank
  // Prop 2½ levy figures (present only when the Excess Levy Capacity report is built in)
  levy_ceiling?: number | null; // 2.5% of total assessed value
  levy_limit?: number | null; // levy limit w/o debt & capital (the 2.5%-growth wall)
  actual_levy?: number | null; // total tax levy actually raised
}

export interface Town {
  name: string;
  county: string | null;
  type?: "Gateway City" | "Coastal" | "Inland";
  gateway?: boolean;
  coastal?: boolean;
  series: TownYear[];
}

export interface StateMedian {
  fy: number;
  effective_rate: number | null;
  burden: number | null;
}

export interface TaxData {
  meta: {
    generated: string;
    fiscal_years: number[];
    fy_to_acs_endyear: Record<string, number>;
    scope: string;
    sources: Record<string, string>;
  };
  state_medians: StateMedian[];
  towns: Town[];
}

export const DATA_URL = "/data/ma-property-tax.json";
export const HOME_TOWN = "Beverly";
export const DEFAULT_COUNTY = "Essex";
export const MAX_SELECTED = 5;

// A community is "at its ceiling" when override capacity is a negligible share
// of the ceiling (levy limit ≈ ceiling). Matches the pipeline's threshold.
export const AT_CEILING_THRESHOLD = 0.02;

// Fixed plotting domains (kept constant across years so the scrubber shows real
// movement, not a rescaling frame). Values outside are clamped to the edge; the
// tooltip and table still show true numbers.
export const EFF_DOMAIN: [number, number] = [0.002, 0.025];
export const BURDEN_DOMAIN: [number, number] = [0.01, 0.15];

// Distinguishable, warm-leaning palette for highlighted towns. Index 0 (forest
// green, the site accent) is reserved for Beverly / the first selection.
export const SELECT_COLORS = ["#2d6a4f", "#bc4b51", "#c0842a", "#3f7cac", "#7a5195"];

// Emphasis tiers for the non-highlighted background cloud.
export const TIER_ESSEX = "rgba(45,106,79,0.40)"; // mid tone
export const TIER_REST = "rgba(26,24,21,0.13)"; // faint gray

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
export const normEff = (v: number) =>
  clamp01((v - EFF_DOMAIN[0]) / (EFF_DOMAIN[1] - EFF_DOMAIN[0]));
export const normBurden = (v: number) =>
  clamp01((v - BURDEN_DOMAIN[0]) / (BURDEN_DOMAIN[1] - BURDEN_DOMAIN[0]));

export const fmtPct = (v: number | null | undefined, digits = 1) =>
  v == null ? "—" : `${(v * 100).toFixed(digits)}%`;
export const fmtUSD = (v: number | null | undefined) =>
  v == null ? "—" : `$${Math.round(v).toLocaleString("en-US")}`;
export const fmtRate = (v: number | null | undefined) =>
  v == null ? "—" : `$${v.toFixed(2)}`;

export const yearRecord = (town: Town, fy: number): TownYear | undefined =>
  town.series.find((s) => s.fy === fy);

export const stateMedian = (data: TaxData, fy: number): StateMedian | undefined =>
  data.state_medians.find((m) => m.fy === fy);

// Prop 2½ levy headroom, derived from the three stored raw values.
// Bar decomposition (sums to the ceiling): actual levy + excess-under-limit +
// override capacity. Override capacity is the "phantom" headroom — reachable
// only via override votes, not a rate change.
export interface LevyView {
  ceiling: number;
  limit: number;
  actual: number;
  override: number; // ceiling − limit (needs override vote)
  excess: number; // max(0, limit − actual) (unused under the limit, no vote)
  pctOfCeiling: number; // actual / ceiling
  overridePct: number; // override / ceiling
  atCeiling: boolean;
}

export function levyView(s: TownYear | undefined): LevyView | null {
  if (!s || s.levy_ceiling == null || s.levy_limit == null || s.actual_levy == null) return null;
  const ceiling = s.levy_ceiling;
  const limit = s.levy_limit;
  const actual = s.actual_levy;
  if (ceiling <= 0) return null;
  const override = Math.max(0, ceiling - limit);
  const excess = Math.max(0, limit - actual);
  return {
    ceiling,
    limit,
    actual,
    override,
    excess,
    pctOfCeiling: actual / ceiling,
    overridePct: override / ceiling,
    atCeiling: override / ceiling < AT_CEILING_THRESHOLD,
  };
}

export const fmtMillions = (v: number | null | undefined) =>
  v == null ? "—" : `$${(v / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;

// 10-year change helper for a numeric field (first vs last non-null in series).
export function firstLast(town: Town, field: keyof TownYear): {
  first?: { fy: number; v: number };
  last?: { fy: number; v: number };
} {
  let first, last;
  for (const s of town.series) {
    const v = s[field];
    if (typeof v === "number") {
      if (!first) first = { fy: s.fy, v };
      last = { fy: s.fy, v };
    }
  }
  return { first, last };
}
