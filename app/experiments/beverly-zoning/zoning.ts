import rules from "@/data/beverly/zoning-districts.json";
import parcels from "@/data/beverly/zoning-parcels.json";

/**
 * Lookups and formatting shared by the zoning guide’s components. District facts live in
 * data/beverly/zoning-districts.json (the ordinance, as far as it could be checked) and
 * data/beverly/zoning-parcels.json (what the assessor’s records say is on the ground).
 */

export type Sourced<T> = { value: T; status: "excerpt" | "digest" | "name" | "assessor" | "confirmed" | "unverified" | "modeled" };
export type District = {
  code: string;
  name: string;
  section: string;
  plain: string;
  purpose: ({ quote?: string; paraphrase?: string; status: string }) | null;
  housing: Sourced<string> | null;
  minLotSqft: Sourced<number> | null;
  frontageFt: Sourced<number> | null;
  heightFt: Sourced<number> | null;
  parking: Sourced<string> | null;
  notes: { text: string; status: string }[];
};
export type Family = { id: string; label: string; blurb: string; zones: string[] };
export type ParcelStats = {
  parcels: number;
  assessorRecords: number;
  acres: number;
  shareOfZonedLand: number;
  uses: Record<string, number>;
  singleFamilyLots: number;
  singleFamilyLotSqftMedian: number | null;
};

export const DISTRICTS = rules.districts as Record<string, District>;
export const FAMILIES = rules.families as Family[];
export const OVERLAYS = rules.overlays;
export const RULES_META = rules._meta;
export const STATS = parcels.districts as Record<string, ParcelStats>;
export const PARCEL_META = parcels._meta;
export const PARCEL_TOTALS = parcels.totals;

/** Every district code in reading order: families first, then the order within each. */
export const DISTRICT_ORDER: string[] = FAMILIES.flatMap((f) => f.zones);

export function displayCode(zone: string): string {
  return DISTRICTS[zone]?.code ?? zone;
}

/** The ordinance’s name for a district. `short` drops the parenthetical, for tight spaces. */
export function districtName(zone: string, short = false): string {
  const name = DISTRICTS[zone]?.name ?? "Unknown district";
  return short ? name.replace(/\s*\(with .*\)$/, "") : name;
}

/** CC lots that front Cabot Street fall in the CC2 subdistrict, which the assessor does not record. */
export function likelyCC2(zone: string, address: string): boolean {
  return zone === "CC" && /\bCABOT ST\b/i.test(address);
}

export function titleCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(\d+)([A-Za-z])\b/g, (_, n, l) => `${n}${l.toUpperCase()}`);
}

export function familyOf(zone: string): Family | undefined {
  return FAMILIES.find((f) => f.zones.includes(zone));
}

/**
 * Map fills. Homes run on one amber scale from light (biggest lots, fewest homes per acre) to
 * dark (apartments), because "how much housing is allowed" is a quantity. Business, industry
 * and special districts each get one color of their own. The three hues were checked for
 * color-blind separation; the map also prints district codes, so color is never the only cue.
 */
const AMBER = ["#ffeed3", "#fcdfaf", "#f7cd87", "#edb95d", "#dea433", "#cb9100"];
export const BUSINESS_FILL = "#c8455a";
export const INDUSTRIAL_FILL = "#6d5bd0";
export const SPECIAL_FILL = "#8a8175";

export const ZONE_FILL: Record<string, string> = {
  R90: AMBER[0],
  R45: AMBER[0],
  R22: AMBER[1],
  R15: AMBER[1],
  R10: AMBER[2],
  R6: AMBER[3],
  RMD: AMBER[4],
  RSD: AMBER[4],
  RHD: AMBER[5],
  CN: BUSINESS_FILL,
  CC: BUSINESS_FILL,
  CG: BUSINESS_FILL,
  IR: INDUSTRIAL_FILL,
  IG: INDUSTRIAL_FILL,
  HD: SPECIAL_FILL,
  BHD: SPECIAL_FILL,
  WDR: SPECIAL_FILL,
  MOSR: SPECIAL_FILL,
};

/** Special-purpose districts get a hatch on the map instead of a fourth hue. */
export const HATCHED = new Set(["HD", "BHD", "WDR", "MOSR"]);

/** The amber steps with the districts that share each one, for the map legend. */
export const DENSITY_STEPS: { fill: string; zones: string[] }[] = [
  { fill: AMBER[0], zones: ["R90", "R45"] },
  { fill: AMBER[1], zones: ["R22", "R15"] },
  { fill: AMBER[2], zones: ["R10"] },
  { fill: AMBER[3], zones: ["R6"] },
  { fill: AMBER[4], zones: ["RMD", "RSD"] },
  { fill: AMBER[5], zones: ["RHD"] },
];

/** Plain labels for the assessor’s use categories (built in build_zoning_data.py). */
export const USE_LABEL: Record<string, string> = {
  single: "A single-family home",
  condo: "Condominiums",
  two: "A two-family home",
  three: "A three-family home",
  apartments: "An apartment building (4 or more homes)",
  otherRes: "Other housing",
  vacantRes: "Vacant residential land",
  mixed: "Mixed use (homes and business)",
  commercial: "Commercial",
  industrial: "Industrial",
  exempt: "Tax-exempt property (government, schools, churches, nonprofits)",
  chapter61: "Forest, farm or recreation land in a state tax program",
  other: "Other",
};

/** Short forms for lists and bars. */
export const USE_SHORT: Record<string, string> = {
  single: "Single-family homes",
  condo: "Condo buildings",
  two: "Two-family homes",
  three: "Three-family homes",
  apartments: "Apartment buildings",
  otherRes: "Other housing",
  vacantRes: "Vacant residential land",
  mixed: "Mixed use",
  commercial: "Commercial",
  industrial: "Industrial",
  exempt: "Tax-exempt",
  chapter61: "State tax-program land",
  other: "Other",
};

const nf = new Intl.NumberFormat("en-US");
export const fmt = (n: number) => nf.format(n);

/** "10,000 sq ft (about a quarter acre)". Fractions are rounded to the nearest familiar one. */
export function formatSqft(sqft: number): string {
  const acres = sqft / 43560;
  let gloss: string;
  if (acres >= 1.75) gloss = `about ${Math.round(acres)} acres`;
  else if (acres >= 0.85) gloss = "about an acre";
  else if (acres >= 0.42) gloss = "about half an acre";
  else if (acres >= 0.29) gloss = "about a third of an acre";
  else if (acres >= 0.2) gloss = "about a quarter acre";
  else if (acres >= 0.15) gloss = "about a sixth of an acre";
  else if (acres >= 0.115) gloss = "about an eighth of an acre";
  else if (acres >= 0.085) gloss = "about a tenth of an acre";
  else gloss = "under a tenth of an acre";
  const rounded = sqft >= 10000 ? Math.round(sqft / 100) * 100 : Math.round(sqft / 10) * 10;
  return `${fmt(rounded)} sq ft (${gloss})`;
}

export function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((100 * part) / whole) : 0;
}
