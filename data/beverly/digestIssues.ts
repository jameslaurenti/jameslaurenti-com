/**
 * Every issue of the digest, newest first.
 *
 * One list, three consumers: the archive index, the card on the Beverly hub, and the
 * sitemap. Adding an issue here updates all of them, which matters because the hub is
 * supposed to show the current issue and a weekly cadence is exactly the kind of thing a
 * manual edit quietly stops keeping up with.
 *
 * This is a pointer list, not content. The issues themselves keep their own inline copy
 * of everything they report, so editing this file can never change what a published issue
 * says it found.
 */

export type DigestIssue = {
  /** Also the route: /beverly/digest/<slug>. */
  slug: string;
  number: number;
  published: string;
  covering: string;
  /** What is in it. Used on the archive and on the hub card. */
  teaser: string;
};

export const issues: DigestIssue[] = [
  {
    slug: "2026-10-05",
    number: 4,
    published: "October 5, 2026",
    covering: "September 28 to October 4",
    teaser:
      "The deficit committee made a first pass at its ideas, three weeks before presenting them. The Varian cleanup gave its first update since its main treatment began, and this year's MCAS results are out. Tonight the Council takes up a pause on data centers and two oversight ordinances.",
  },
  {
    slug: "2026-09-28",
    number: 3,
    published: "September 28, 2026",
    covering: "September 21 to 27",
    teaser:
      "Cryptocurrency machines are banned, with thirty days for the ones already here to go. Owners who let trees or shrubs block the sidewalk could be billed and liened. And $2.46 million in preservation grants is open, first applications due October 8.",
  },
  {
    slug: "2026-09-21",
    number: 2,
    published: "September 21, 2026",
    covering: "September 10 to 20",
    teaser:
      "Beverly can stop raising its pension payment, worth about $700,000 next year. The committee looking at the deficit heard what a city-run electric utility would take. And the School Committee ratified three union agreements, by name.",
  },
  {
    slug: "2026-09-11",
    number: 1,
    published: "September 11, 2026",
    covering: "August 26 to September 9",
    teaser:
      "The Council rejected every proposal for the former dollar store site. A ban on crypto kiosks passed first reading nine to nothing. City Hall moves across the street in October, and Council meetings move with it.",
  },
];

/** The one the hub features. Kept as a function so the list stays the single source. */
export const latestIssue = (): DigestIssue => issues[0];
