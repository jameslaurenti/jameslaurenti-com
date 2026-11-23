import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 16 to Nov 22, 2026 — James Laurenti",
  description:
    "How last year's $7.1 million forecast gap for FY2028 became $1.63 million. Waring School's plan for 38 Standley St and the house it would take down. The schools at mid-year. The School Committee puts off its e-bike vote. 37 Enon St heads to a December 15 vote.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 16 to Nov 22, 2026",
    description:
      "How the forecast gap went from $7.1 million to $1.63 million, Waring School's plan for 38 Standley St, and the schools at mid-year. Every claim tagged by source.",
    url: "/beverly/digest/2026-11-23",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-11-23/opengraph-image"],
  },
};

export default function Issue11Layout({ children }: { children: React.ReactNode }) {
  return children;
}
