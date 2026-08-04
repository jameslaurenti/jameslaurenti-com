import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beverly FY2027: A Structural Gap, and How It Was Closed for One Year — James Laurenti",
  description:
    "A four-part walkthrough of Beverly's FY2027 budget: $7.2M in new revenue against $10M in cost growth, the trash-fee vote, and the service cuts that balanced one year. With the City Hall debt timing, a debt-schedule appendix, and sources throughout.",
  openGraph: {
    type: "article",
    title: "Beverly's FY2027 budget, and how it was closed",
    description: "The year the gap got real: rising costs, the trash-fee fight, and what was cut to balance one budget.",
    url: "/work/beverly/fy27-budget",
    // Defining openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to be named explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function FY27BudgetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
