import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find the Money: The Beverly Budget Challenge — James Laurenti",
  description:
    "\"The money is there, they just need to find it.\" Here is Beverly's actual budget and the FY2027 gap. Try to close it yourself, and see what the choice really costs in jobs and services.",
};

export default function BudgetChallengeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
