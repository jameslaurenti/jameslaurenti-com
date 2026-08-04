import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find the Money: The Beverly Budget Challenge — James Laurenti",
  description:
    "\"The money is there, they just need to find it.\" Here is Beverly's actual budget and the FY2027 gap. Try to close it yourself, and see what the choice really costs in jobs and services.",
  openGraph: {
    type: "article",
    title: "Find the money: the Beverly budget challenge",
    description:
      "Beverly's actual FY2027 budget, and the chair. Put the trash fee back, restore the bus line, then find the money somewhere else. It is harder than just cutting the waste.",
    url: "/work/beverly/budget-challenge",
    // Defining openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to be named explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function BudgetChallengeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
