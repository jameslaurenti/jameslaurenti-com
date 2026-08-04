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

// ---------------------------------------------------------------------------
// Companion fiscal-shape / drift dataset — public/data/ma-town-shape.json.
// Town-level attributes (keyed by town name) that join to the per-year tax data
// above. Built from the beverly-identity statewide_data pulls (DLS levers +
// Census ACS income). Reconciliations: income = ACS median household; the
// canonical effective rate stays the residential bill/value in the tax file, so
// it is NOT duplicated here.
// ---------------------------------------------------------------------------

export const SHAPE_DATA_URL = "/data/ma-town-shape.json";

export type ShapeLabel = "Develops" | "Overrides" | "Aid-reliant" | "Banks within the cap";
export const SHAPE_ORDER: ShapeLabel[] = ["Develops", "Overrides", "Aid-reliant", "Banks within the cap"];

// Friendlier, less-charged display labels. The data keys (and the generated JSON
// from the beverly-identity pipeline) keep the internal names; the UI renders
// these. "Aid-reliant" read as a knock on towns that receive more state aid, so
// it shows as "State-supported."
export const SHAPE_DISPLAY: Record<ShapeLabel, string> = {
  Develops: "Develops",
  Overrides: "Overrides",
  "Aid-reliant": "State-supported",
  "Banks within the cap": "Banks within the cap",
};

export interface TownDrift {
  valRealG_12_22: number; // real property-value growth, 2012→2022 (%)
  valRealG_12_24: number; // real property-value growth, 2012→2024 (%)
  incRealG_12_22: number; // real ACS median-household-income growth, 2012→2022 (%)
  divergence: number; // valRealG_12_22 − incRealG_12_22 (positive = values outran incomes)
}

export interface TownShape {
  shape: ShapeLabel;
  levers: {
    develop: { pctile: number; newGrowthPctOfLevy: number; commercialShare: number };
    override: { pctile: number; operatingOverridesPassed: number; anyOverridesPassed: number };
    aid: { pctile: number; stateShareOfRevenue: number };
    wealth: { pctile: number; eqvPerCapita: number };
  };
  drift: TownDrift | null; // null for towns without an ACS estimate (a handful of tiny towns)
  neighbors: string[]; // nearest-neighbor "towns like this" by fiscal shape
}

export interface TownShapeData {
  _meta: {
    generated: string;
    scope: string;
    nTowns: number;
    source: string;
    incomeBasis: string;
    driftWindow: string;
    effectiveRateNote: string;
    shapeThresholds: { aid: number; override: number; developMedianPct: number } | null;
    shapes: ShapeLabel[];
    confidence: string;
  };
  towns: Record<string, TownShape>;
}

// CVD-validated categorical palette for the four shapes (site is light-mode only).
// Do NOT map Develops to the site's forest green: green + sienna fail the colorblind
// separation check (see the prototype's palette validation), so this data palette is
// its own thing, used inline like SELECT_COLORS rather than as brand tokens.
// Marks only: dots, legend swatches, bar fills.
export const SHAPE_COLORS: Record<ShapeLabel, string> = {
  Develops: "#0c8a72", // teal
  Overrides: "#c8551c", // vermillion
  "Aid-reliant": "#2f6d9e", // blue
  "Banks within the cap": "#9c9488", // neutral gray
};

// The same hues, darkened until white text clears WCAG AA on them. Three of the four mark
// colours fail as a background for white type (Develops 4.29:1, Overrides 4.40:1, Banks
// 3.00:1), so anything that sets text on the colour uses these. Marks keep the palette
// above, so the colourblind separation is untouched.
export const SHAPE_BADGE_COLORS: Record<ShapeLabel, string> = {
  Develops: "#0b7a64", // 5.27:1 on white
  Overrides: "#b44c19", // 5.27:1
  "Aid-reliant": "#2f6d9e", // 5.52:1, already passing
  "Banks within the cap": "#736b60", // 5.25:1
};

// Plain-language, sign-aware read of a town's value-vs-income drift (see the
// prototype's verdict logic). Kept here so the Shape/Drift lens and any prose
// stay consistent.
export function driftVerdict(d: TownDrift): { headline: string; detail: string } {
  const word = (v: number) =>
    v >= 20 ? { t: "climbed well ahead of inflation", dir: 1 }
    : v >= 5 ? { t: "rose in real terms", dir: 1 }
    : v > -5 ? { t: "roughly kept pace with inflation", dir: 0 }
    : { t: "lost ground to inflation", dir: -1 };
  const val = word(d.valRealG_12_22);
  const inc = word(d.incRealG_12_22);
  const g = Math.round(Math.abs(d.divergence));
  const headline = `Property values ${val.t}; residents' incomes ${inc.t}.`;
  let detail: string;
  if (d.divergence >= 6) {
    detail = val.dir > 0
      ? (inc.dir <= 0
          ? `Values climbed while incomes ${inc.dir < 0 ? "fell" : "barely moved"}. That ${g}-point gap is the priced-out pattern.`
          : `Values pulled ${g} points ahead of incomes.`)
      : `Even with values ${val.dir < 0 ? "falling" : "flat"} in real terms, they still ran ${g} points ahead of incomes, which fell further.`;
  } else if (d.divergence <= -6) {
    detail = inc.dir > 0 && val.dir > 0
      ? `Incomes ran ${g} points ahead of values; residents kept up with, and passed, their rising home values.`
      : inc.dir > 0
        ? `Residents' incomes rose in real terms while home values ${val.dir < 0 ? "slipped" : "stayed roughly flat"}. The gap is ${g} points.`
        : `The ${g}-point gap comes from property values ${val.dir < 0 ? "losing ground" : "staying flat"}, not from incomes rising.`;
  } else {
    detail = `Values and incomes moved within a few points of each other. The town's profile held its shape.`;
  }
  return { headline, detail };
}
