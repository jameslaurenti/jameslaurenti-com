import type { Metadata } from "next";

/**
 * Unlisted draft: /experiments carries X-Robots-Tag noindex from next.config.ts, and the robots meta here
 * says the same thing. The research record behind it lives in the private development folder; facts change
 * there first.
 */
export const metadata: Metadata = {
  title: "Bass River: the story so far (draft) — James Laurenti",
  description:
    "Beverly has tried three times since 2005 to rezone the industrial land on River Street for homes, shops and a riverfront path. What each try proposed, why the last one paused, and how the Hall-Whitaker Bridge put it on hold.",
  robots: { index: false, follow: false },
};

export default function BassRiverHistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
