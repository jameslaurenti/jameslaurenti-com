import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 23 to Nov 29, 2026 — James Laurenti",
  description:
    "Your tax bill gets decided in the next nine days: what's already settled, what the Council's December 7 vote decides, and how to read the bill due February 1. The data center pause is final, the Mayor's update on the FEMA appeal, and Lynch Park's seawall design money.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 23 to Nov 29, 2026",
    description:
      "Your tax bill gets decided in the next nine days: what's settled, what's left, and how to read the February bill. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-11-30",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-11-30/opengraph-image"],
  },
};

export default function Issue12Layout({ children }: { children: React.ReactNode }) {
  return children;
}
