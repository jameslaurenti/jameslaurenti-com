import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Nov 2 to Nov 8, 2026 — James Laurenti",
  description:
    "Waverly Development's 200-unit plan for Boulder Lane and the approvals it would need from three city boards. How Beverly voted on the three ballot questions closest to home. The finance director leaves for Ipswich, and the Council holds the last required hearing on the data center pause.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Nov 2 to Nov 8, 2026",
    description:
      "The Boulder Lane plan and the approvals it needs, how Beverly voted, and the finance director leaves for Ipswich. Every claim tagged by source.",
    url: "/beverly/digest/2026-11-09",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-11-09/opengraph-image"],
  },
};

export default function Issue9Layout({ children }: { children: React.ReactNode }) {
  return children;
}
