import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 9 to Nov 15, 2026 — James Laurenti",
  description:
    "The Council backs the data center pause 8-0 and flags concerns over its wording. The city lets its Flock camera contract lapse. Early estimates put next year's budget gap at $1.56 million. A move to restore the DEIB director's funding fails on a 4-4 tie; the Council asks the Mayor for $20,000 for the Human Rights Committee instead.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 9 to Nov 15, 2026",
    description:
      "The data center pause passes its first vote, the Flock contract lapses, and early estimates of next year's budget gap. Every claim tagged by source.",
    url: "/beverly/digest/2026-11-16",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-11-16/opengraph-image"],
  },
};

export default function Issue10Layout({ children }: { children: React.ReactNode }) {
  return children;
}
