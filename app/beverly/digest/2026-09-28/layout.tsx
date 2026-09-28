import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Sep 21 to Sep 27, 2026 — James Laurenti",
  description:
    "Beverly banned cryptocurrency machines, moved to fine and bill owners whose trees or shrubs block the sidewalk, dropped the rule that public commenters say their address aloud, and opened $2.46 million in preservation grants.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Sep 21 to Sep 27, 2026",
    description:
      "A crypto kiosk ban with teeth, a lien for overgrown trees and shrubs, a safer way to speak at Council, and $2.46 million in grants due October 8. Every claim tagged by source.",
    url: "/beverly/digest/2026-09-28",
    // This issue's own card. The dates are baked into the image, so it cannot reuse
    // another issue's.
    images: ["/beverly/digest/2026-09-28/opengraph-image"],
  },
};

export default function Issue3Layout({ children }: { children: React.ReactNode }) {
  return children;
}
