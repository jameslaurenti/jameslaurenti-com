import type { Metadata } from "next";

/**
 * Prototype pages for the development map (docs/beverly/development-map.md). Unlisted: /experiments
 * carries X-Robots-Tag noindex from next.config.ts, and the robots meta here says the same thing.
 * Each page moves to /beverly/development/<id> once it reads well.
 */
export const metadata: Metadata = {
  title: "Beverly development (draft) — James Laurenti",
  description: "Draft pages for a map of development in Beverly, with each property's history and sources.",
  robots: { index: false, follow: false },
};

export default function BeverlyDevelopmentDraftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
