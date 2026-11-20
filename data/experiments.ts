/**
 * What lives under /experiments, for the private dashboard at /admin/experiments.
 *
 * The dashboard also scans app/experiments/ and public/experiments/ at build time, so a new
 * experiment shows up there even before it gets an entry here. Add one to give it a title,
 * a line of description and a status.
 */

export type ExperimentStatus = "draft" | "paused" | "review" | "internal" | "reference";

export type Experiment = {
  /** Folder name under app/experiments/ or public/experiments/, and the URL slug. */
  slug: string;
  title: string;
  blurb: string;
  status: ExperimentStatus;
  /** Month it was last worked on, YYYY-MM. */
  updated?: string;
};

export const EXPERIMENTS: Experiment[] = [
  {
    slug: "bass-river-history",
    title: "Bass River: the story so far",
    blurb:
      "Three tries since 2005 to rezone River Street for homes and a riverfront path, why the 2022 draft paused, and the bridge hold. Groundwork for a 2027 piece; research record in the development folder.",
    status: "draft",
    updated: "2026-11",
  },
  {
    slug: "beverly-overrides",
    title: "Beverly and Proposition 2½",
    blurb:
      "Every override and debt exclusion push in the city's records since 1992: the failed 2008 school override, five that stopped short, and the idea's return. Back-pocket history; doc version shareable.",
    status: "reference",
    updated: "2026-11",
  },
  {
    slug: "beverly-zoning",
    title: "Zoning in Beverly, from zero",
    blurb:
      "Beginner’s guide to Beverly zoning: the 18 districts, a map with address lookup, how the rules change, the state’s role, and how neighbors compare. Some facts still marked unverified.",
    status: "draft",
    updated: "2026-10",
  },
  {
    slug: "average-and-squeezed",
    title: "Average, and Squeezed Anyway",
    blurb:
      "The Beverly identity essay. Paused: a load-bearing claim about overrides was wrong, and the sections that depend on it need rebuilding.",
    status: "paused",
    updated: "2026-09",
  },
  {
    slug: "digest-reuse",
    title: "Reuse the Beverly Meeting Digest",
    blurb: "The feeds, the reuse terms, and how to adapt a story. Waiting on someone who adapts the content to try it.",
    status: "review",
    updated: "2026-10",
  },
  {
    slug: "candle-crawl",
    title: "Candle Crawl",
    blurb:
      "A quiet turn-based dungeon game on a 4×4 grid of cards, with a trader between floors, pocket tools and altar deals. Silent, dark-only, saves every step.",
    status: "internal",
    updated: "2026-10",
  },
  {
    slug: "beverly-fy27-slides",
    title: "Beverly FY2027 budget, slides",
    blurb: "A slide version of the FY2027 budget piece.",
    status: "reference",
  },
];

export const STATUS_LABEL: Record<ExperimentStatus, string> = {
  draft: "Draft",
  paused: "Paused",
  review: "Out for review",
  internal: "Internal",
  reference: "Reference",
};
