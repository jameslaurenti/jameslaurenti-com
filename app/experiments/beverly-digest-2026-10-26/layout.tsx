import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Oct 19 to 25, 2026 — James Laurenti",
  description:
    "The Coast Guard's empty houses on Laurel Street are headed to a federal auction. What was new at the deficit committee's first community meeting, and at the second Council look at the Flock cameras. Next week the Council picks a budget analyst and the Planning Board takes up the data center pause.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Oct 19 to 25, 2026",
    description:
      "The Coast Guard houses head to auction, the deficit committee meets the public, and the Flock contract. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-10-26",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-10-26/opengraph-image"],
  },
};

export default function Issue7Layout({ children }: { children: React.ReactNode }) {
  return children;
}
