import type { Metadata } from "next";

// Unlisted section. Keep it out of search indexes and off sitemaps; it is shared
// by direct link with a small group of parents, not published.
export const metadata: Metadata = {
  title: "Harborlight parent digest",
  description: "A light recap of Harborlight Montessori school notes.",
  robots: { index: false, follow: false },
};

export default function HarborlightLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
