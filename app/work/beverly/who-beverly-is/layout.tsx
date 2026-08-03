import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who Beverly Is: What a Decade of Budgets Reveals — James Laurenti",
  description:
    "A decade of Beverly's budget choices, measured against six North Shore neighbors: near-bottom services, top-tier reserves, aggressive growth, and the balance sheet over the service level. The scorecard behind the choices ahead.",
};

export default function WhoBeverlyIsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
