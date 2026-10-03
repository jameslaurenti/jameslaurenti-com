import type { Metadata } from "next";

/**
 * /preview is a makeshift pre-production area: review copies of unfinished pages, live on
 * the real site so they can be checked in production and shown to a few people by link.
 *
 * Nothing here is linked from the nav, the hub, the archive or the sitemap, every page is
 * noindex (set here, so a new page cannot forget it), and robots.ts disallows the folder.
 * This is "please don't read this yet," not security. Pages should also carry a visible
 * draft banner. When a page is ready, it moves to its real route and leaves this folder.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
