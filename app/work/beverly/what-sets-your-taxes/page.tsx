"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import RateScatter from "./RateScatter";
import AssessmentCalculator from "./AssessmentCalculator";
import ReassessmentWash from "./ReassessmentWash";

// ---- scroll reveal (respects reduced motion) ----
function useReveal() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => (el.style.opacity = "1"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "none";
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return root;
}

const revealStyle: React.CSSProperties = {
  opacity: 0,
  transform: "translateY(16px)",
  transition: "opacity .6s ease, transform .6s ease",
};

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal style={revealStyle}>
      {children}
    </div>
  );
}

function SectionNum({ children }: { children: React.ReactNode }) {
  return <span className="mb-3 block font-display text-sm italic tracking-wide text-gold-strong">{children}</span>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-relaxed">{children}</p>;
}

function Fn({ n, noId }: { n: number; noId?: boolean }) {
  return (
    <a
      href={`#fn-${n}`}
      {...(noId ? {} : { id: `fnref-${n}` })}
      className="ml-0.5 align-super text-[0.68em] font-bold text-accent no-underline hover:underline"
      aria-label={`Footnote ${n}`}
    >
      [{n}]
    </a>
  );
}

function Confidence({ level }: { level: "confirmed" | "modeled" | "illustrative" }) {
  const map = {
    confirmed: { c: "var(--color-accent)", t: "Confirmed", d: "Primary source" },
    modeled: { c: "var(--color-gold-strong)", t: "Modeled", d: "Derived, assumptions stated" },
    illustrative: { c: "var(--color-debt)", t: "Illustrative", d: "" },
  }[level];
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide" style={{ color: map.c }}>
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: map.c }} />
      {map.t}
      {map.d && <span className="font-normal normal-case tracking-normal text-ink-faint">· {map.d}</span>}
    </span>
  );
}

// Every A link navigates away from this article (another page or an external
// source), so all of them open in a new tab. In-page footnote anchors use a raw
// <a> below, not this component, so they stay in the same tab.
const A = (props: { href: string; children: React.ReactNode; ext?: boolean }) => (
  <Link href={props.href} className="rlink" target="_blank" rel={props.ext ? "noopener noreferrer" : "noopener"}>
    {props.children}
  </Link>
);

const NOTES: React.ReactNode[] = [
  <>
    Proposition 2½ (Massachusetts General Laws chapter 59, section 21C), passed by ballot in 1980 and effective for fiscal 1982. A
    community&apos;s levy limit rises 2.5 percent a year plus certified new growth, and can be raised further only by a voter-approved
    override or debt exclusion. Appreciation on existing property does not raise the levy; it lowers the rate. Source: Massachusetts
    Division of Local Services, &quot;Levy Limits: A Primer on Proposition 2½,&quot; corroborated by the Center on Budget and Policy
    Priorities and the Tax Foundation. <em>Confirmed.</em>
  </>,
  <>
    Interactive mechanism demonstrator, not a data series. It holds the levy at 2.5 percent annual growth and models only the
    reassessment reshuffle, so it deliberately ignores new growth and any override. Formula: new bill ≈ old bill × 1.025 × (1 + your
    home&apos;s growth) ÷ (1 + the town&apos;s growth). <em>Illustrative.</em>
  </>,
  <>
    Author&apos;s analysis of FY2024 Schedule A General Fund revenues (Massachusetts Division of Local Services Municipal
    Databank) against FY2024 equalized valuation per capita and 2023 population (DLS Community Comparison Report). Effective rate
    = total tax levy ÷ equalized valuation, the state&apos;s estimate of full and fair cash value, which puts every town on the same
    basis despite differences in local assessment practice and split residential and commercial rates. Across the 345 municipalities
    with clean data, the correlation between effective rate and property value per capita is about −0.61 (−0.75 on a log scale);
    between tax dollars per resident and property value per capita, about +0.74. <em>Confirmed and reproducible from the DLS files.</em>
  </>,
  <>
    Author&apos;s analysis of Massachusetts Division of Local Services Proposition 2½ levy and valuation data (Excess Levy Capacity
    report), FY2022 through FY2026, all 351 municipalities. The median town&apos;s total assessed value rose about 41 percent
    over the four years. A levy limit growing at the statutory 2.5 percent a year rises about 10 percent over the same span, before new
    growth. <em>Confirmed.</em>
  </>,
  <>
    Same source. Marblehead: equalized valuation about $468,000 per resident, effective rate 0.90 percent, levy about $4,200 per
    resident. Beverly: about $255,000 per resident, 1.23 percent, about $3,135 per resident. <em>Confirmed.</em>
  </>,
  <>
    Same statewide pull, effective-rate extremes: Chilmark 0.21 percent and Nantucket 0.34 percent at the low end (equalized
    valuations in the millions per resident); Springfield 2.13 percent and North Adams 2.25 percent at the high end (equalized
    valuations under $90,000 per resident). The statewide median effective rate is about 1.37 percent. <em>Confirmed.</em>
  </>,
  <>
    The Proposition 2½ &quot;levy ceiling&quot;: a community&apos;s levy may never exceed 2.5 percent of the total full and fair cash
    value of its taxable property, distinct from the 2.5 percent annual growth limit on the levy. A town pressed against the ceiling
    cannot levy more even with an override. Source: DLS, &quot;Levy Limits: A Primer on Proposition 2½.&quot; The clustering of the
    highest effective rates just below 2.5 percent in note 6 is this ceiling binding. <em>Confirmed.</em>
  </>,
  <>
    Author&apos;s analysis of real, inflation-adjusted growth from 2012 to 2022 in equalized valuation per capita (DLS EQV-per-capita
    trend report) and median household income (U.S. Census Bureau, American Community Survey five-year estimates, table B19013), across
    the roughly 345 municipalities with clean data on both. The correlation between a town&apos;s real property-value growth and its
    real household-income growth is about +0.09, effectively zero: the two move independently. Statewide median real growth over the
    decade was about 5 percent for property value and about 10 percent for household income. Deflated by CPI-U. <em>Confirmed.</em>
  </>,
  <>
    Same sources. Swampscott: real equalized valuation per capita up about 22 percent from 2012 to 2022; real median household income
    roughly flat over the same span (a decline of a fraction of a percent). <em>Confirmed.</em>
  </>,
  <>
    Proposition 2½ set each community&apos;s initial fiscal 1982 levy limit at its fiscal 1981 actual levy (reduced over several years
    for communities then taxing above the 2.5 percent ceiling), growing 2.5 percent a year thereafter plus new growth. Today&apos;s
    cross-town differences in levy per resident largely trace to that 1980–81 starting position plus accumulated new growth and
    overrides. Source: DLS primer. <em>Confirmed.</em>
  </>,
  <>
    &quot;New growth&quot; is the levy capacity a community gains from new construction, additions, and parcel subdivisions, certified
    annually by DLS. It is the only routine way to raise the levy limit by more than 2.5 percent without a ballot vote. Source: DLS,
    &quot;Proposition 2½ New Growth.&quot; <em>Confirmed.</em>
  </>,
  <>
    Massachusetts Division of Local Services, Proposition 2½ override/underride and debt-exclusion ballot-question results
    (mass.gov), retrieved 2026. An override permanently raises a community&apos;s levy limit; a debt exclusion raises it temporarily to
    pay debt service on a specific project. Statewide, about 305 of 351 municipalities have held an operating-override vote and roughly
    254 have passed at least one; about 318 have used a debt exclusion. <em>Confirmed.</em>
  </>,
  <>
    Same DLS ballot-question data. Beverly appears in neither the override nor the debt-exclusion dataset: it has never held either
    vote in the life of the law, funding both operations and buildings inside the 2.5 percent levy cap. Detailed treatment in the{" "}
    <A href="/work/beverly">Beverly piece</A>. <em>Confirmed.</em>
  </>,
  <>
    The companion <A href="/work/beverly/property-tax">MA property tax explorer</A> scores every municipality on the three levers and on its
    property-value-versus-income drift, and returns the towns most similar in shape to any one you pick. <em>Interactive; underlying
    data as in notes 3, 7, 8, and 9.</em>
  </>,
];

export default function WhatSetsYourTaxes() {
  const root = useReveal();
  return (
    <div ref={root} className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        {/* hero */}
        <header className="border-b border-rule py-14 sm:py-20">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Massachusetts · How the property tax really works
          </span>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            What sets your property taxes, and what doesn&apos;t.
          </h1>
          <p className="mt-5 max-w-[60ch] text-xl leading-snug text-ink-mid sm:text-[1.5625rem]">
            The two numbers everyone watches, the rate on the bill and the value in the assessor&apos;s letter, carry almost no
            information. <b className="font-bold text-ink">Here is what actually moves your bill.</b>
          </p>
          <p className="mt-8 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-faint">
            A nonpartisan, statewide explainer. Figures from the Massachusetts Division of Local Services and the U.S. Census, with
            sources at the bottom. It grew out of a closer look at one city:{" "}
            <A href="/work/beverly">What Beverly Does Next</A>.
          </p>
        </header>

        {/* 01 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>01 · The letter in the mailbox</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A bigger number in the letter feels like a bigger bill coming. It usually isn&apos;t.
            </h2>
            <P>
              Every year or two a letter arrives from the town assessor with a new number on it: what the town now says your home is
              worth. When that number goes up, most people read it as a warning. A home worth more on paper feels like a bigger tax bill
              on the way.
            </P>

            <ValuationNotice />
            <P>
              It does not work that way. Under Proposition 2½, the property-tax law Massachusetts voters passed in 1980, a rising
              assessment mostly changes the tax rate, not what you owe.<Fn n={1} /> The same law explains a fact that sounds impossible:
              the wealthiest towns in the state, the ones that send the largest tax bills, tax their property at the lowest rates in it.
            </P>
            <P>
              Two numbers everyone watches, the rate on the bill and the value in the letter, turn out to carry almost no information.
              Here is what does.
            </P>
          </Reveal>
        </section>

        {/* 02 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>02 · The one rule</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The law caps the town&apos;s total, not the rate and not your house.
            </h2>
            <P>
              Two words do all the work here: the <b>levy</b>{" "}and the <b>rate</b>. The levy is the total amount of money a town raises
              from all of its property taxes put together, one pot for the whole town. The rate is the price of the tax, the dollars owed
              per thousand dollars of assessed value. Your bill is your assessment times the rate, and nothing else.
            </P>
            <P>
              Proposition 2½ caps the levy. Not the rate, and not the value of any single house. A town&apos;s levy can rise only 2.5
              percent a year, plus a little extra for brand-new construction, unless the voters agree to lift the cap.<Fn n={1} noId />
            </P>
            <P>
              Hold that cap in mind and watch what a reassessment does. Every year or two the assessor updates what each property is
              worth to track the market. When values across town jump, the levy cannot follow, so the rate drops to fit.
            </P>

            <div className="mt-8">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">A revaluation, in four numbers</h3>
                <Confidence level="illustrative" />
              </div>
              <ReassessmentWash />
            </div>

            <P>
              The rate is not a decision about how hard to tax. It is whatever number makes the capped levy come out of this year&apos;s
              values. It moves so the levy does not have to.
            </P>
          </Reveal>
        </section>

        {/* 03 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>03 · Your assessment is not your bill</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A town-wide reassessment is close to a wash.
            </h2>
            <P>
              If every home in town rises the same 20 percent, every rate falls about 20 percent, and almost nobody&apos;s bill
              changes. The town is dividing the same pie. A revaluation just remeasures the slices.
            </P>
            <P>
              Your own bill moves for one reason the assessment letter never mentions: whether your home rose faster or slower than the
              town as a whole. Outrun the town average and your slice of the pie grows, so your bill rises. Lag it and your bill falls.
              This is the one real catch in the whole system, and it is a small one, because it is zero-sum. For every homeowner whose
              bill goes up because their block got hot, another&apos;s goes down. The town still collects the same total.
            </P>

            <div className="mt-8">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">Watch the number that doesn&apos;t matter</h3>
                <Confidence level="illustrative" />
              </div>
              <AssessmentCalculator />
            </div>

            <P>
              The tool lets you feel it. Put in your assessment and your current bill, then move the two sliders. Set them equal and
              push the town-wide number as high as you like. Your assessment can double while your bill barely stirs.<Fn n={2} /> Only
              when your own home outruns the town does the bill move, and then only by the gap between the two.
            </P>
          </Reveal>
        </section>

        {/* 04 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>04 · The most useless number on your tax bill</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The wealthiest towns tax their property at the lowest rates.
            </h2>
            <P>
              The rate does the same disappearing act from one town to the next, and it produces a result that ought to be impossible if
              the myth were true. Line up the 345 Massachusetts cities and towns with clean numbers and compare two things for each: how
              much property it has per resident, and the rate at which it taxes that property. The relationship runs backward. The more
              valuable a town&apos;s property, the lower its tax rate.<Fn n={3} />
            </P>

            <div className="mt-8">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink">The rate is just wealth, flipped</h3>
                <Confidence level="confirmed" />
              </div>
              <RateScatter />
            </div>

            <P>
              The reason is arithmetic, not virtue. A rate is the levy divided by the town&apos;s total property value, so two towns can
              collect identical dollars per resident and the one with pricier homes will post the lower rate, because it is dividing by a
              bigger number. And that number keeps swelling. Between FY2022 and FY2026, the assessed value of the typical
              Massachusetts town rose about 41 percent while the capped levy could rise only about 10.<Fn n={4} /> Each revaluation, the
              rate dropped to keep the levy inside the larger value. It was not tracking anyone&apos;s decision about taxes. It was
              chasing the housing market.
            </P>
            <P>
              Watch it at the edges. In Marblehead, where property runs about $468,000 a resident, the effective tax rate is 0.90
              percent. In Beverly next door, at about $255,000 a resident, it is 1.23 percent.<Fn n={5} /> Marblehead&apos;s property is
              worth roughly 1.8 times Beverly&apos;s per person, and it taxes that property at about three-quarters of Beverly&apos;s
              rate. Go to the ends of the state and the pattern only sharpens. The lowest rates in Massachusetts belong to its most
              expensive addresses: Chilmark, on Martha&apos;s Vineyard, taxes at about 0.21 percent, Nantucket at about 0.34 percent.
              The highest rates belong to some of its poorest cities: Springfield near 2.13 percent, North Adams near 2.25 percent.
              <Fn n={6} /> The poorest places tax hardest and the richest tax softest. Read as a measure of how much a town asks of its
              property, the rate gets the story exactly backward.
            </P>
            <P>
              The rate has one honest job. A second, separate limit in the law says a town&apos;s levy can never exceed 2.5 percent of
              the full value of everything in it, a ceiling rather than a yearly step.<Fn n={7} /> A town whose rate climbs toward that
              ceiling is near a wall, which is why the highest rates in the state all sit just under 2.5 percent and stop. Only a
              handful of communities are anywhere close to that ceiling, and no town on the North Shore is. For nearly everyone, the rate
              is a number to ignore.
            </P>
            <P>
              So why is almost everyone sure it runs the other way? Because the wealthy town does send the bigger bill, and that half is
              true: a modest rate on an expensive house is still a large pile of dollars. People see those bills, and the big houses
              behind them, and reach the obvious verdict. The myth is really two true facts, that wealthy towns pay large bills and that
              assessments keep climbing, wired together by a mechanism that is not there. Pull it out and the two sit harmlessly side by
              side. Rich towns pay large bills because their houses are worth a lot, not because their rate or their appetite is high.
              Assessments rise because the market rises, and the rate quietly falls to meet them.
            </P>
          </Reveal>
        </section>

        {/* 05 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>05 · One more thing the value is not</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A rising assessment is not a sign your neighbors are doing well.
            </h2>
            <P>
              There is one more thing the number in the letter is not. It is not a sign that the people in your town are doing well.
              Property values and residents&apos; incomes drift apart. Track how much each has grown across Massachusetts over the last
              decade, with inflation stripped out, and the two barely relate: a town&apos;s values can climb while its households&apos;
              earnings stall, or the reverse.<Fn n={8} />
            </P>
            <P>
              In Swampscott, on the North Shore, property values rose about 22 percent in real terms over that span while the income of
              the typical household did not move at all.<Fn n={9} /> The houses got more expensive. The people living in them did not
              get richer. In other towns the opposite happened, incomes rising while values slipped.
            </P>
            <P>
              So a rising assessment can mean your neighborhood is prospering. It can also mean buyers from somewhere else are bidding
              up the housing while the families already there are priced further out. The number in the letter cannot tell you which. It
              measures the house, not the household.
            </P>
            <P>
              This is the same law working underneath. The revenue a town collects rides a formula set in 1980, and it changes only
              through a few narrow channels, slowly. What swings freely, independently and out of sight, is the value of the property
              and the income of the people. A town can look transformed on paper while collecting almost exactly what its formula always
              said it would.
            </P>

            <ExploreCallout>
              See how far your own town&apos;s property values and residents&apos; incomes have pulled apart in the{" "}
              <A href="/work/beverly/property-tax?lens=drift">explorer&apos;s Drift view</A>.
            </ExploreCallout>
          </Reveal>
        </section>

        {/* 06 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>06 · What moves the money</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Three levers decide what a town collects. The rate is not one of them.
            </h2>
            <P>
              So if it is not the rate and not your rising assessment, what decides how much a Massachusetts town collects? Three
              things, and close to only three.
            </P>
            <div className="my-7 flex flex-col gap-4">
              <Lever
                n="1"
                name="History"
                body={
                  <>
                    When Proposition 2½ took effect, it set each town&apos;s starting levy at roughly what the town was already
                    collecting around 1980, then capped the growth at 2.5 percent a year from there.<Fn n={10} /> A town that taxed and
                    spent heavily in 1980 began with a high base that has compounded every year since. A town that ran lean began low.
                    Four decades on, much of where a town sits was settled before most of its current residents arrived. The starting
                    hand still shows.
                  </>
                }
              />
              <Lever
                n="2"
                name="New growth"
                body={
                  <>
                    The taxes on brand-new construction and major renovation. New growth is the one lever that lets a town raise its
                    levy by more than 2.5 percent without asking anyone&apos;s permission, so a town that keeps building keeps expanding
                    the pot.<Fn n={11} /> A town that stops building is held to 2.5 percent a year, and inflation eats the rest.
                  </>
                }
              />
              <Lever
                n="3"
                name="The override"
                body={
                  <>
                    And its cousin the <b>debt exclusion</b>: a town-wide vote to raise the levy past the cap, permanently in the case
                    of an override, temporarily and tied to one specific project in the case of a debt exclusion. These are the only
                    ways to break the cap on purpose, and each takes a majority at the ballot box. Some towns override again and again.
                    Most never do.<Fn n={12} />
                  </>
                }
              />
            </div>
            <P>
              Every town is some blend of these three: the hand it was dealt in 1980, how much it has built since, and how willing its
              voters are to tax themselves past the limit. That blend is a kind of fiscal fingerprint, and it explains far more about a
              town&apos;s finances than any rate ever will. Beverly is one sharp version of it. It has leaned on the second lever and
              never once pulled the third, growing its tax base steadily while never, in the entire life of the law, passing an
              operating override or a debt exclusion.<Fn n={13} />
            </P>

            <ExploreCallout>
              Every town&apos;s blend of these three levers is its fiscal fingerprint. Map any town by the same levers in the{" "}
              <A href="/work/beverly/property-tax?lens=shape">explorer&apos;s Town&apos;s shape view</A>.
            </ExploreCallout>
          </Reveal>
        </section>

        {/* 07 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>07 · What the letter is, and is not</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The letter tells you what your house is worth. It was never what set your taxes.
            </h2>
            <P>
              So when the assessor&apos;s letter lands and the number has jumped, it helps to remember what the number is. It is an
              estimate of what your house would sell for. It is not your tax bill, and on its own it barely predicts it. It is not a
              measure of what your town collects, and it is not proof that your town grew richer. If the whole town rose with you, your
              bill is going almost nowhere. If your rate fell, that is the law working as designed, not a favor and not a mistake.
            </P>
            <P>
              The rate on the bill and the value in the letter are the two numbers residents are trained to watch. Both are mostly
              noise. The signal is underneath, in three levers most people never see: the hand a town was dealt in 1980, what it has
              built since, and whether its voters have ever gone to the polls to tax themselves more.
            </P>

            <div className="mt-8 rounded-r-md border-l-4 border-gold bg-bg-card/50 px-6 py-6">
              <p className="max-w-[64ch] text-[1rem] leading-relaxed text-ink">
                For a close look at how one city played that hand across a decade of its own budgets, see{" "}
                <A href="/work/beverly">What Beverly Does Next</A>, the second lever made concrete: a town that grew its base and never
                went to the voters. And to place your own town, the{" "}
                <A href="/work/beverly/property-tax">MA property tax explorer</A>{" "}maps every community in Massachusetts by those three levers,
                and shows whether its property values have outrun its residents&apos; incomes.<Fn n={14} />
              </p>
            </div>
          </Reveal>
        </section>

        {/* footnotes */}
        <section className="py-12">
          <h2 className="font-display text-lg font-semibold text-ink">Notes referenced in the text</h2>
          <ol className="mt-4 space-y-3 text-[0.84375rem] leading-relaxed text-ink-mid">
            {NOTES.map((note, i) => (
              <li key={i} id={`fn-${i + 1}`} className="grid grid-cols-[1.6rem_1fr] gap-1 scroll-mt-20">
                <a href={`#fnref-${i + 1}`} className="font-bold text-accent no-underline hover:underline">
                  {i + 1}.
                </a>
                <span className="max-w-[72ch]">{note}</span>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 font-display text-lg font-semibold text-ink">Core source documents</h3>
          <ul className="mt-3 max-w-[72ch] list-disc space-y-1.5 pl-5 text-[0.84375rem] leading-relaxed text-ink-mid">
            <li>
              Massachusetts Division of Local Services,{" "}
              <A href="https://www.mass.gov/info-details/proposition-2-12-and-tax-rate-process" ext>
                Proposition 2½ and the tax rate process
              </A>{" "}
              (the levy limit, the levy ceiling, new growth, and how overrides differ from debt exclusions).
            </li>
            <li>
              DLS Municipal Databank: Schedule A revenues, Community Comparison Report, equalized-valuation and income trend reports,
              Excess Levy Capacity report.
            </li>
            <li>U.S. Census Bureau, American Community Survey five-year estimates, table B19013 (median household income).</li>
          </ul>
          <p className="mt-6 max-w-[72ch] text-[0.8125rem] leading-relaxed text-ink-faint">
            Percentages are rounded. &quot;Effective rate&quot; means the levy divided by the state&apos;s equalized valuation, which
            puts every town on the same footing regardless of local assessment practice. This piece explains how the property tax
            works; it does not argue for or against any town&apos;s choices.
          </p>
        </section>
      </div>
    </div>
  );
}

function NoticeRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-rule/60 pb-1.5">
      <span className="text-[0.6875rem] uppercase tracking-wide text-ink-faint">{label}</span>
      <span className={`text-[0.875rem] tabular-nums ${muted ? "text-ink-faint" : "text-ink"}`}>{value}</span>
    </div>
  );
}

function ValuationNotice() {
  return (
    <figure className="my-9">
      <div className="mx-auto max-w-md rounded-md border border-rule bg-bg-card/70 p-6 shadow-sm">
        {/* letterhead */}
        <div className="border-b border-rule pb-3 text-center">
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Town of Sample · Board of Assessors</div>
          <div className="mt-1 font-display text-lg font-semibold text-ink">FY2027 Property Valuation Notice</div>
          <div className="mt-0.5 text-[0.75rem] italic text-ink-faint">This is not a tax bill.</div>
        </div>
        {/* body */}
        <div className="mt-4 flex flex-col gap-2">
          <NoticeRow label="Property" value="12 Example Street" />
          <NoticeRow label="Parcel ID" value="0034-0071-000" />
          <NoticeRow label="Prior assessed value" value="$500,000" muted />
        </div>
        {/* the number everyone watches */}
        <div
          className="mt-3 rounded-md px-4 py-3"
          style={{
            border: "1px solid color-mix(in srgb, var(--color-debt) 35%, transparent)",
            background: "color-mix(in srgb, var(--color-debt) 7%, transparent)",
          }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">New assessed value</span>
            <span
              className="rounded-full px-2 py-0.5 text-[0.75rem] font-bold tabular-nums"
              style={{ background: "color-mix(in srgb, var(--color-debt) 16%, transparent)", color: "var(--color-debt)" }}
            >
              +20%
            </span>
          </div>
          <div className="mt-1 font-display text-3xl font-extrabold tabular-nums text-ink">$600,000</div>
        </div>
      </div>
      <figcaption className="mx-auto mt-3 max-w-md text-[0.78125rem] leading-relaxed text-ink-faint">
        <span className="font-semibold" style={{ color: "var(--color-debt)" }}>Illustration.</span>{" "}This is the number everyone
        watches. It estimates what the house would sell for, and on its own it barely predicts the tax bill. The tax rate isn&apos;t on
        this notice. It arrives months later, on the actual bill, after the state sets it.
      </figcaption>
    </figure>
  );
}

function ExploreCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-7 flex items-start gap-2.5 rounded-r-md border-l-4 border-accent bg-bg-card/40 px-4 py-3">
      <span aria-hidden className="mt-0.5 select-none font-bold text-accent">→</span>
      <p className="max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-mid">{children}</p>
    </div>
  );
}

function Lever({ n, name, body }: { n: string; name: string; body: React.ReactNode }) {
  return (
    <div className="flex gap-4 rounded-md border border-l-4 border-rule border-l-accent bg-bg-card/50 px-5 py-4">
      <span className="font-display text-3xl font-extrabold leading-none text-accent/50" aria-hidden>
        {n}
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
        <p className="mt-1 max-w-[62ch] text-[0.96875rem] leading-relaxed text-ink-mid">{body}</p>
      </div>
    </div>
  );
}
