import type { Metadata } from "next";
import PensionCliffExplainer from "@/components/beverly/PensionCliffExplainer";

export const metadata: Metadata = {
  title: "Beverly's pension cliff — James Laurenti",
  description:
    "Two thirds of Beverly's pension bill is debt on decades of underfunding, and like a mortgage it has a payoff date. On the current plan it ends around FY33, freeing about $12.8M a year.",
  // Earlier exploratory work, not part of the published collection and not linked from
  // the hub. Kept reachable by URL, but out of search results until it is reviewed.
  robots: { index: false, follow: false },
};

export default function PensionCliffPage() {
  return <PensionCliffExplainer />;
}
