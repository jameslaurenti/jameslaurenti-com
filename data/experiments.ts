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
    slug: "takeout-deals",
    title: "Takeout deals around Beverly",
    blurb:
      "Day-by-day restaurant specials in Beverly, Salem and nearby towns that work for pickup or delivery. First pass, built from search snippets; most prices still need a call.",
    status: "draft",
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
