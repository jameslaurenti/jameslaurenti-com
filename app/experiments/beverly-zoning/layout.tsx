import type { Metadata } from "next";

/**
 * The zoning guide is unlisted: /experiments carries X-Robots-Tag noindex from next.config.ts,
 * and the robots meta here says the same thing in the page itself.
 */
export const metadata: Metadata = {
  title: "Zoning in Beverly, from Zero (draft) — James Laurenti",
  description:
    "What zoning is, Beverly's 18 districts and what each allows, how the rules change and who decides, the state's role, and how Beverly compares. A working draft, shared by link.",
  robots: { index: false, follow: false },
};

export default function BeverlyZoningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
