import type { Metadata } from "next";
import Link from "next/link";
import Explorer from "./Explorer";

export const metadata: Metadata = {
  title: "MA property tax explorer — James Laurenti",
  description:
    "A decade of property-tax data for all 351 Massachusetts municipalities: posted rate, effective rate, average bill, and burden as a share of income.",
  openGraph: {
    type: "article",
    title: "MA property tax explorer",
    description: "All 351 Massachusetts cities and towns on the same footing: what an average bill is, how hard it lands on local incomes, how each town funds itself, and whether values have outrun incomes.",
    url: "/work/beverly/property-tax",
    // Defining openGraph here replaces the block inherited from the collection,
    // images included, so the shared card has to be named explicitly.
    images: ["/work/beverly/opengraph-image"],
  },
};

export default function MaPropertyTaxPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">Tools · Massachusetts</p>
      <h1 className="mb-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        MA property tax explorer
      </h1>

      <div className="prose">
        <p>
          In Massachusetts, the property tax funds most of what a town does. How much it takes, and who feels
          it most, differs sharply from one town to the next. These views line up all 351 cities and towns by
          what they tax, what their residents earn, and how far the two have drifted, so you can place your own
          town and read what its numbers say about it.
        </p>
        <p>
          One word needs pinning down first, because two different numbers answer to it. The{" "}
          <em>posted rate</em>, the dollars-per-thousand figure printed on your bill, is the least useful number
          on it, and it usually runs the opposite way you would expect, lowest in the most expensive towns. The
          companion article{" "}
          <Link href="/work/beverly/what-sets-your-taxes" target="_blank" rel="noopener">
            what sets your property taxes, and what doesn&apos;t
          </Link>{" "}
          explains why. The rate on the chart below is the other one, the <em>effective rate</em>: what the
          average bill actually works out to, as a share of what an average home in that town is worth. That is
          the comparable number, and it is the one used here throughout.
        </p>
        <p>
          Three views share the same set of towns. <strong>Your bill</strong> follows the rate, the average
          bill, and how hard that bill presses on local incomes over the decade. <strong>Town&apos;s
          shape</strong> shows how a town funds itself, by growing its base, voting past the cap, or leaning on
          state aid, and points to the towns most like it. <strong>Drift</strong>{" "}asks whether a town&apos;s
          property values have outrun its residents&apos; incomes.
        </p>
        <p className="text-sm text-ink-mid">
          Not from Beverly? Add your own town with the search, or switch to the statewide view. Every town in
          the Commonwealth is here.
        </p>
      </div>

      <section
        className="mt-8"
        aria-label="Property tax explorer: your bill, town's shape, drift, and the full table"
      >
        <Explorer />
      </section>

      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        <strong className="font-medium text-ink-mid">Reading the Your bill chart.</strong> Each dot is one
        municipality in the selected fiscal year. Left–right is the <em>effective rate</em> (average bill ÷
        average home value), not the posted dollars-per-thousand rate; up–down is <em>burden</em> (average
        bill ÷ median household income). The two are close to independent, which is what makes the quadrants
        worth reading: a town can be expensive per dollar of value and still land lightly on local incomes, or
        the reverse. Dashed lines sit at the statewide median for that year. Select a town to trace its path
        across the decade.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-ink-faint">
        <strong className="font-medium text-ink-mid">Sources, all views.</strong> Residential single-family
        figures only. Rate and bill data from the Massachusetts Division of Local Services; household income
        from the U.S. Census American Community Survey five-year estimates.
      </p>
    </div>
  );
}
