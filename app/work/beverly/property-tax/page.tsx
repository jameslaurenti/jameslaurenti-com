import type { Metadata } from "next";
import Explorer from "./Explorer";

export const metadata: Metadata = {
  title: "MA Property Tax Explorer — James Laurenti",
  description:
    "A decade of property-tax data for all 351 Massachusetts municipalities: posted rate, effective rate, average bill, and burden as a share of income.",
};

export default function MaPropertyTaxPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-accent">Tools · Massachusetts</p>
      <h1 className="mb-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        MA Property Tax Explorer
      </h1>

      <div className="prose">
        <p>
          If you own a home in Beverly, you may have noticed something that looks like a contradiction: the
          city’s residential tax <em>rate</em> has fallen for years, yet your <em>bill</em> keeps climbing.
          Both are true at once, and the reason is arithmetic — a tax bill is the rate multiplied by your
          home’s assessed value.
        </p>
        <p>
          Beverly’s posted residential rate dropped from <strong>$14.39</strong> per $1,000 in FY2016 to{" "}
          <strong>$10.81</strong> in FY2026, while the average single-family bill rose from{" "}
          <strong>$6,107</strong> to <strong>$8,834</strong>. It’s natural to blame rising home values —
          assessed values nearly doubled, to about $817,000 — but that isn’t what raised the bill. A city can
          collect only about 2.5% more in total each year (plus taxes on new construction), and that limit is
          what lifts bills. Rising values did the opposite: they pushed the <em>rate</em> down. Your home’s
          value sets your <em>share</em> of the bill, not the pace at which it grows.
        </p>
        <p className="text-sm text-ink-mid">
          Not from Beverly? Use the search below the chart to add your own town, or switch to the statewide
          view. Every town in the Commonwealth is here.
        </p>
      </div>

      <section className="mt-8" aria-label="Quadrant chart of rate versus burden">
        <Explorer />
      </section>

      <p className="mt-6 text-xs leading-relaxed text-ink-faint">
        <strong className="font-medium text-ink-mid">Reading the chart.</strong> Each dot is one municipality
        in the selected fiscal year. Left–right is the <em>effective</em> rate (average bill ÷ average value);
        up–down is <em>burden</em> (average bill ÷ median household income). Dashed lines sit at the statewide
        median for that year, splitting the field into four quadrants. Select a town to trace its path across
        the decade. Residential single-family figures only. Full definitions and sources will accompany the
        methodology section. Copy here is a working draft.
      </p>
    </div>
  );
}
