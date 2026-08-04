import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Sets Your Property Taxes, and What Doesn't — James Laurenti",
  description:
    "How the property tax really works across Massachusetts under Proposition 2½, and why the wealthiest towns are taxed at the lowest rates. The rate and your assessment carry almost no information; three levers do.",
  openGraph: {
    type: "article",
    title: "What sets your property taxes, and what doesn't",
    description: "How the property tax really works across Massachusetts, and why the wealthiest towns are not the highest-taxed. Statewide, not just Beverly.",
    url: "/work/beverly/what-sets-your-taxes",
    // Defining openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to be named explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function WhatSetsYourTaxesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
