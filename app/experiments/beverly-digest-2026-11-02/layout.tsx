import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Oct 26 to Nov 1, 2026 — James Laurenti",
  description:
    "The Stop & Shop site's apartment plan gets its first Planning Board hearing, continued to November 17. A 55-and-older proposal off Boulder Lane and a community meeting Thursday. The Planning Board backs the data center pause, and a Beverly Airport noise bill passes the House.",
  // DRAFT: remove before publishing. qa:issue fails while this is here. (Under /experiments
  // the next.config header also sends noindex; this tag is the belt to its braces.)
  robots: { index: false, follow: false },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Oct 26 to Nov 1, 2026",
    description:
      "37 Enon St's first hearing, senior housing proposed off Boulder Lane, and the data center pause. Every claim tagged by source.",
    url: "/experiments/beverly-digest-2026-11-02",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/experiments/beverly-digest-2026-11-02/opengraph-image"],
  },
};

export default function Issue8Layout({ children }: { children: React.ReactNode }) {
  return children;
}
