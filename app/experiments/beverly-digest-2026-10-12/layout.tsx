import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Oct 5 to 11, 2026 — James Laurenti",
  description:
    "Lynch Park gets the money to finish its seawall permits. How Beverly's proposed pause on data centers fits with the governor's new order and Salem's ban. National Grid's Cabot Street work, planned for after New Year's. Plus final votes, and who controls the city budget.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Oct 5 to 11, 2026",
    description:
      "Lynch Park's seawall permits, how Beverly's data center pause fits with the state's rule, and winter electric work on Cabot Street. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-10-12",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-10-12/opengraph-image"],
  },
};

export default function Issue5Layout({ children }: { children: React.ReactNode }) {
  return children;
}
