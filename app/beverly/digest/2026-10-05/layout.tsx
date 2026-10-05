import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Sep 28 to Oct 4, 2026 — James Laurenti",
  description:
    "The deficit committee made a first pass at sorting its ideas before its October 20 presentation. Tonight the Council takes up a pause on data centers, a final vote on fines for private trees and shrubs that block the sidewalk, and two oversight ordinances. Plus where the Varian cleanup stands, and this year's MCAS.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Sep 28 to Oct 4, 2026",
    description:
      "A first pass at the deficit committee's ideas, a proposed pause on data centers, and where the Varian cleanup stands. Every claim tagged by source.",
    url: "/beverly/digest/2026-10-05",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-10-05/opengraph-image"],
  },
};

export default function Issue4Layout({ children }: { children: React.ReactNode }) {
  return children;
}
