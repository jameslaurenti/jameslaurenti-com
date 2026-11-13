import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 9 to Nov 15, 2026 — James Laurenti",
  description:
    "The data center pause passes its first vote, 8-0, as councilors ask what its wording would catch. The city lets its Flock camera contract lapse. Next year's projected deficit is about $1.6 million. The Council splits 4-4 on restoring the diversity director, then asks the Mayor for $20,000 for the Human Rights Committee.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 9 to Nov 15, 2026",
    description:
      "The data center pause passes its first vote, the Flock contract lapses, and next year's projected deficit. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-11-16",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-11-16/opengraph-image"],
  },
};

export default function Issue10Layout({ children }: { children: React.ReactNode }) {
  return children;
}
