import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Sep 10 to Sep 20, 2026 — James Laurenti",
  description:
    "What the Deficit Reduction Committee, School Committee and Planning Board took up between September 10 and 20, 2026, with every claim tagged by source.",
  // Out of search, matching issue 1 and the archive index. Whether the digest enters
  // search is a separate decision from publishing it, and has not been revisited.
  robots: { index: false, follow: true },
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Sep 10 to Sep 20, 2026",
    description:
      "A pension increase the city can stop paying, a city-run electric utility on the table, and two union agreements ratified by name. Every claim tagged by source.",
    url: "/beverly/digest/2026-09-21",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-09-21/opengraph-image"],
  },
};

export default function Issue2Layout({ children }: { children: React.ReactNode }) {
  return children;
}
