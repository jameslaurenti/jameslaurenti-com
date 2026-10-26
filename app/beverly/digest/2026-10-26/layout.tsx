import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Oct 19 to 25, 2026 — James Laurenti",
  description:
    "The Coast Guard's empty houses on Laurel Street head to auction, and what Question 7 could mean for them. The deficit committee's ideas by how soon and how much, the Flock contract a month from expiring, and tonight's public meeting on Camp Paradise.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Oct 19 to 25, 2026",
    description:
      "The Coast Guard houses head to auction, the deficit committee's ideas sized, the Flock contract a month out, and tonight's Camp Paradise meeting. Every claim tagged by source.",
    url: "/beverly/digest/2026-10-26",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-10-26/opengraph-image"],
  },
};

export default function Issue7Layout({ children }: { children: React.ReactNode }) {
  return children;
}
