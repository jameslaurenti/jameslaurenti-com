export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Day = (typeof DAYS)[number];

export const DAY_LABEL: Record<Day, { short: string; long: string }> = {
  mon: { short: "Mon", long: "Monday" },
  tue: { short: "Tue", long: "Tuesday" },
  wed: { short: "Wed", long: "Wednesday" },
  thu: { short: "Thu", long: "Thursday" },
  fri: { short: "Fri", long: "Friday" },
  sat: { short: "Sat", long: "Saturday" },
  sun: { short: "Sun", long: "Sunday" },
};

/** Nearest first, roughly, from downtown Beverly. Used to sort within a day. */
export const TOWN_ORDER = [
  "Beverly",
  "Salem",
  "Danvers",
  "Wenham",
  "Peabody",
  "Hamilton",
  "Marblehead",
  "Swampscott",
] as const;

export type Deal = {
  restaurant: string;
  town: string;
  address: string;
  cuisine: string;
  /** National or regional chain, as opposed to a local independent. */
  chain: boolean;
  /** All seven when the deal runs every day. */
  days: Day[];
  meal: "lunch" | "dinner" | "all-day" | "late-night";
  time: string | null;
  deal: string;
  price: string | null;
  /** "unclear" means the source didn't say; call before driving over. */
  takeout: "yes" | "no" | "unclear";
  delivery: "yes" | "no" | "unclear";
  how: string | null;
  healthy: boolean;
  /** An editor's pick: a deal that is clearly better than the usual price, not just a menu item. */
  standout?: boolean;
  source: string;
  /** When the source was posted or last updated, as best we could tell. */
  sourceDate: string;
  /** high: the restaurant's own current site. medium: recent third party or social. low: old or unconfirmed. */
  confidence: "high" | "medium" | "low";
  notes: string | null;
};
