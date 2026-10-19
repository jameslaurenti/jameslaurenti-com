import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Oct 12 to 18, 2026 — James Laurenti",
  description:
    "A preview of the deficit committee's first public presentation. Tonight, the city's Flock cameras go back before the Council. From the schools: an interim finance director, a fix after an accidental lockdown, and a call for residents to help review school fees.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Oct 12 to 18, 2026",
    description:
      "The deficit committee's first public presentation, the city's Flock cameras, and an interim finance director for the schools. Every claim tagged by source.",
    url: "/beverly/digest/2026-10-19",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-10-19/opengraph-image"],
  },
};

export default function Issue6Layout({ children }: { children: React.ReactNode }) {
  return children;
}
