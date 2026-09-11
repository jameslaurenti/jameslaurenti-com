import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly Meeting Digest: Aug 26 to Sep 9, 2026 — James Laurenti",
  description:
    "What the City Council, School Committee and Deficit Reduction Committee took up between August 26 and September 9, 2026, with every claim tagged by source.",
  openGraph: {
    type: "article",
    title: "Beverly Meeting Digest, Aug 26 to Sep 9, 2026",
    description:
      "What the City Council, School Committee and Deficit Reduction Committee took up, plus the dates coming next. Every claim tagged by source.",
    url: "/work/beverly/meeting-digest",
    // Declaring openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to name the image explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function MeetingDigestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
