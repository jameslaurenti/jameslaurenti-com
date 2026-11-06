import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 2 to Nov 8, 2026 — James Laurenti",
  description:
    "The developer's 200-unit plan for Boulder Lane and the approvals it would need, including a use variance. How Beverly voted on the nine ballot questions, next to the state. The finance director leaves for Ipswich, and the Council's data center hearing.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 2 to Nov 8, 2026",
    description:
      "The Boulder Lane plan and the approvals it needs, how Beverly voted, and the finance director leaves for Ipswich. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-11-09",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-11-09/opengraph-image"],
  },
};

export default function Issue9Layout({ children }: { children: React.ReactNode }) {
  return children;
}
