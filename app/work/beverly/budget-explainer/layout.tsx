import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Beverly's Budget Works — James Laurenti",
  description:
    "Why the city keeps running short: a state law caps how fast Beverly can raise money, and its costs rise faster. The problem, in plain language.",
  openGraph: {
    type: "article",
    title: "How Beverly's budget works",
    description: "Why the city keeps running short: a state cap on how fast it can raise money, and costs that outrun it. The problem, in plain language.",
    url: "/work/beverly/budget-explainer",
    // Defining openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to be named explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function BudgetExplainerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
