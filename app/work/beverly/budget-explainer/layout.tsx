import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Beverly's Budget Works — James Laurenti",
  description:
    "Why the city keeps running short: a state law caps how fast Beverly can raise money, and its costs rise faster. The problem, in plain language.",
};

export default function BudgetExplainerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
