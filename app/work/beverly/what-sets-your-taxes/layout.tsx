import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What Sets Your Property Taxes, and What Doesn't — James Laurenti",
  description:
    "How the property tax really works across Massachusetts under Proposition 2½, and why the wealthiest towns are taxed at the lowest rates. The rate and your assessment carry almost no information; three levers do.",
};

export default function WhatSetsYourTaxesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
