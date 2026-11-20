import type { Metadata } from "next";

/**
 * Unlisted draft: /experiments carries X-Robots-Tag noindex from next.config.ts, and the robots meta here
 * says the same thing. The research record behind it is research/2026-11_override-history.md in the
 * meeting-digest folder; the shareable doc version is "Beverly and Proposition 2½" in Claude Docs.
 */
export const metadata: Metadata = {
  title: "Beverly and Proposition 2½ (draft) — James Laurenti",
  description:
    "Every push for a property tax override or debt exclusion in Beverly's records since 1992: the one that reached the ballot in 2008, the five that stopped short, and how the idea returned in 2024.",
  robots: { index: false, follow: false },
};

export default function BeverlyOverridesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
