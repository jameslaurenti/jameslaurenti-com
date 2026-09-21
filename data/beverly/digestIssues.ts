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
    slug: "2026-09-21",
    number: 2,
    published: "September 21, 2026",
    covering: "September 10 to 20",
    teaser:
      "Beverly can stop raising its pension payment, worth about $700,000 next year. The committee looking at the deficit heard what a city-run electric utility would take. And the School Committee ratified two union agreements, by name.",
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
