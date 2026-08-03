"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import forecast from "@/data/beverly/forecast.json";
import {
  FunctionSpendingChart,
  SchoolFundingStack,
  ReceiptsChart,
  PensionTable,
  FreeCashDisposition,
  StabilizationLeap,
} from "./IdentityCharts";

const YEARS = forecast.summary.years;
const FY27 = YEARS.find((y) => y.fy === "FY27")!;
const FY30 = YEARS.find((y) => y.fy === "FY30")!;
const gapM = (fy: { deficit: number }) => `$${(-fy.deficit).toFixed(2)} million`;

// ---- scroll reveal ----
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
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return root;
}

const revealStyle: React.CSSProperties = { opacity: 0, transform: "translateY(16px)", transition: "opacity .6s ease, transform .6s ease" };

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

const A = (props: { href: string; children: React.ReactNode; ext?: boolean }) => (
  <Link
    href={props.href}
    className="rlink"
    {...(props.ext ? { target: "_blank", rel: "noopener" } : {})}
  >
    {props.children}
  </Link>
);

const NOTES: React.ReactNode[] = [
  <>The idea that a public budget is a government&apos;s real statement of priorities is a staple of public finance; the standard reference is Aaron Wildavsky, <em>The Politics of the Budgetary Process</em> (1964), and the popular phrasing, &quot;a budget is a moral document,&quot; is common in civic debate. <em>Framing, not a data point.</em></>,
  <>Massachusetts Division of Local Services, Municipal Databank, Schedule A General Fund expenditures by function, fiscal 2014 through 2024, shown per capita on 2020 decennial Census population. <em>Confirmed.</em></>,
  <>Author&apos;s analysis of fiscal 2024 Schedule A expenditures for all Massachusetts municipalities against 2023 population (DLS Community Comparison Report). Across the 345 municipalities with reported spending, the correlation between population and per-capita total spending is about +0.09, effectively zero. The strong negative relationship inside the seven-town cohort is a composition effect: its two smallest towns, Marblehead and Swampscott, are also its wealthiest and highest-spending. <em>Confirmed and reproducible from the DLS files.</em></>,
  <>Same source, function-by-function rankings, fiscal 2016 through 2025. <em>Confirmed.</em></>,
  <>Massachusetts DLS, Proposition 2½ override and debt-exclusion ballot-question results, retrieved 2026. Beverly appears in neither dataset: it has never held an operating-override or debt-exclusion vote. Among the cohort, only Marblehead and Swampscott have passed operating overrides (Marblehead&apos;s include a $15 million general override in June 2026, for schools, police, and libraries). Salem, Peabody, and Danvers have also never passed one. <em>Confirmed.</em></>,
  <>WBUR, GBH, and CBS Boston, November 2024. The Beverly Teachers Association struck beginning November 8, 2024, seeking smaller class sizes in the roughly 4,500-student district, twelve weeks of paid parental leave, and higher pay for paraprofessionals. A tentative agreement ended the strike in late November. <em>Confirmed.</em></>,
  <>Massachusetts Department of Elementary and Secondary Education, in-district expenditures per pupil, fiscal 2024. <em>Confirmed.</em></>,
  <>DESE, Chapter 70 district profiles, fiscal 2024. <em>Confirmed.</em></>,
  <>DESE, Chapter 70 trends in aid and local contribution (equalized valuation, aggregate resident income, and low-income share, fiscal 2026), per capita on 2020 Census population. The 82.5 percent target local share is the statutory cap in the Chapter 70 formula. <em>Confirmed.</em></>,
  <>Class size and teacher pay, fiscal 2024. Students per teacher: Beverly 12.0 (Marblehead 10.6, Salem 10.7, Gloucester 10.9, Swampscott 11.0, Danvers 12.2, Peabody 12.3); Beverly&apos;s ratio has fallen from 14.6 in 2015, so the gap is narrowing. Average teacher salary: Beverly $87,991, sixth of seven (Danvers $97,514 highest, Gloucester $86,417 lowest). <em>Confirmed.</em></>,
  <>Education spending, Schedule A: $76.1 million (fiscal 2024) to $82.3 million (fiscal 2025), up 8.2 percent; further increases of about 9 percent (fiscal 2026) and 5.28 percent (fiscal 2027) are budgeted, not yet actual. Statewide percentile: 7th in fiscal 2020, 21st in fiscal 2024. <em>Confirmed on the fiscal 2025 actual and the percentiles; later years budgeted.</em></>,
  <>DLS Municipal Databank, stabilization fund trend, fiscal 2013 through 2022; the series ends at fiscal 2022 in this report. <em>Confirmed.</em></>,
  <>DLS Municipal Databank, certified free cash, fiscal 2014 through 2024. <em>Confirmed.</em></>,
  <>DLS Municipal Databank, local receipt estimate versus actual, fiscal 2018 through 2024, excluding investment income. Beverly&apos;s range is +21.1 percent (fiscal 2020) to +50.7 percent (fiscal 2021). <em>Confirmed.</em></>,
  <>Beverly other financing uses and transfers, fiscal 2021 through 2024. <em>Confirmed.</em></>,
  <>Complete audit of Beverly City Council free-cash appropriation orders for fiscal 2024, from the AgendaCenter minutes. Seven approved orders totaling $7,719,626 against a certified pool of about $11.36 million: roads and sidewalks $2.75 million, a downtown parking lot and building $2.5 million, the stabilization fund $1,135,505 and the retiree-health trust $227,101, debt stabilization $1,000,000, and a restricted opioid-settlement fund $107,020. No order funded a recurring operating service. A $2,045,000 free-cash request for the main library&apos;s heating system was disapproved June 3, 2024, and funded from the debt stabilization fund instead. Corroborated by the city&apos;s own fiscal 2026 to 2030 forecast, which lists reserve uses as the City Hall project, roads and sidewalks, stabilization, and the retiree-health trust, and records the Forecast Committee&apos;s suggestion to consider lowering the free-cash target to fund operations, an option not taken. <em>Confirmed against the minutes.</em></>,
  <>Massachusetts School Building Authority board action, September 30, 2015: a grant of up to $49,199,215, or 56.19 percent of eligible costs, for a 231,509-square-foot school for 1,395 students; opened 2018. Total project cost about $109 million; the city&apos;s net share about $60 million after the grant. <em>Confirmed on the grant and square footage; the total and city share are from news coverage.</em></>,
  <>Beverly debt service, $10,847,899 (fiscal 2019) to $7,186,751 (fiscal 2025), with a fiscal 2022 secondary peak of $10,440,569 attributed to a new police station. <em>Confirmed.</em></>,
  <>PERAC funded-ratio list and the Beverly Retirement Board actuarial valuation, January 1, 2024. PERAC records Beverly&apos;s amortization as completed in 2032, with the appropriation rising to $18.58 million in fiscal 2031, falling to $11.74 million in fiscal 2032 (the last amortization payment), then to a $5.80 million normal cost from fiscal 2033. Amortization-completed years for the rest: Swampscott 2031, Salem 2032, Gloucester 2034, Danvers 2035, Marblehead and Peabody 2036. <em>Confirmed.</em></>,
  <>PERAC funded-ratio list: Beverly 75.3 percent (valuation 1/1/2024), Swampscott 75.3 (1/1/2025), Salem 73.5, Marblehead 71.5, Danvers 64.5, Gloucester 60.4, Peabody 59.5. Beverly is tied with Swampscott for the highest in the cohort and equal to the statewide group median. All seven towns maintain their own retirement board; Essex Regional is a separate system. <em>Confirmed.</em></>,
  <>Beverly culture-and-recreation spending, fiscal 2014 through 2025, second or third of seven per resident. The Beverly Arts District on Cabot Street was designated a cultural district by the Massachusetts Cultural Council in 2015; Massachusetts has several dozen such districts. <em>Confirmed.</em></>,
  <>U.S. Census, 2010 and 2020 decennial: Beverly 39,502 to 42,670. <em>Confirmed.</em></>,
  <>Boston Globe, January 20, 2023, citing Beverly&apos;s Planning Department: 168 units built between 2010 and 2014, and nearly 1,400 built or permitted since. The figure is &quot;built or permitted,&quot; not delivered, and runs to early 2023. <em>Confirmed as to the source.</em></>,
  <>City of Beverly, MBTA Communities multifamily zoning page: districts of about 98 acres zoned for 2,063 units, adopted November 12, 2024, state compliance confirmed April 2025. <em>Confirmed.</em></>,
  <>The Marblehead Town Meeting exchange (May 2026) drew wide coverage and roughly two million online views, and Marblehead was among the municipalities the attorney general pursued over MBTA Communities compliance. <em>Confirmed via contemporaneous news coverage.</em></>,
  <>Beverly new-growth split, 58 percent commercial and industrial, third of seven. Cummings Center square footage and history from Cummings Properties. <em>Confirmed on the split; the Cummings figures are company-published.</em></>,
  <>Illustrative, out-of-cohort comparisons. Waltham: commercial and industrial property pays about 45.9 percent of the tax levy (fiscal 2026 split rate), spends roughly $23,800 per pupil (DESE, fiscal 2024), and has no recent operating override. Lexington: roughly six operating overrides plus debt exclusions over the years, spending about $24,300 per pupil on a low-need student body. Per-pupil here is actual net school spending per foundation pupil, a different basis than the in-district figure used elsewhere, shown only as relative context. <em>Illustrative.</em></>,
  <>DESE enrollment, fiscal 2015 through 2024. <em>Confirmed.</em></>,
  <>Cohort: new growth averaging 1.5 percent of the levy, fiscal 2014 through 2025, second of seven behind Salem at 1.9 percent. Statewide: recent years about 1.2 to 1.3 percent of prior levy against a 1.2 percent statewide median, a flat trend. <em>Confirmed.</em></>,
  <>DLS assessed values by class, fiscal 2026: Beverly $264,717 per resident, fifth of seven. <em>Confirmed.</em></>,
  <>Boston Globe, January 20, 2023, for the resident pushback; Beverly City Council zoning ordinances, February 13, 2023: eliminated the seven-story overlay on Rantoul Street, dropping the effective limit to five stories, and capped new construction on and near Cabot Street at four; retained the requirement that 12 percent of units in new projects of six or more be affordable, passed unanimously. <em>Confirmed on date and substance.</em></>,
  <>Pointer, not a source. <A href="https://openbeverly.org/pavement.html" ext>Open Beverly</A>, an independent data portal by a fellow Beverly resident, maps the city&apos;s own pavement-condition inventory, so you can look up any street&apos;s score across all six wards. The roads and public-works figures in the text are sourced at notes 4, 15, and 16.</>,
  <>Beverly City Council approved the negotiated eminent-domain taking of 218 to 226 Cabot Street and 8 Chapman Street on May 1, 2023. Purchase price $7.35 million; total authorization $8 million including about $650,000 of renovation. The city ultimately funded about $4.5 million from certified free cash across two years and borrowed the rest. Mayor Cahill cited 108 parking spaces; the city&apos;s current redevelopment page says 107. <em>Confirmed.</em></>,
  <>Beverly Financial Forecast Report fiscal 2026 through 2030, December 2025: fiscal 2027 −$3.92 million, fiscal 2028 −$7.11 million, fiscal 2029 −$10.01 million, fiscal 2030 −$13.68 million. <em>Confirmed.</em></>,
  <>The <A href="/work/beverly/fy27-budget">FY2027 budget piece</A> in this series carries the primary sourcing for the trash-fee votes, the council amendments, and the final budget vote.</>,
  <>Stabilization fund about $16.9 million (fiscal 2022, the last year in the DLS trend report); certified free cash about $10.5 million (fiscal 2026), inside the city&apos;s 3-to-8-percent policy band. The roughly $2 million rainy-day draw is reported in the FY2027 budget piece, sourced to the mayor. <em>Confirmed on the balances.</em></>,
  <>Beverly fiscal 2021 budget, as reported by Patch. A $4.6 million pandemic revenue shortfall was closed with a 2.5 percent tax increase, new growth, about $1 million from reserves, and department reductions; state aid was projected down 17.5 percent; no layoffs. <em>Confirmed via Patch.</em></>,
];

export default function WhoBeverlyIs() {
  const root = useReveal();
  const seen = new Set<number>();
  const fn = (n: number) => {
    const first = !seen.has(n);
    if (first) seen.add(n);
    return (
      <a
        href={`#fn-${n}`}
        {...(first ? { id: `fnref-${n}` } : {})}
        className="ml-0.5 align-super text-[0.68em] font-bold text-accent no-underline hover:underline"
        aria-label={`Footnote ${n}`}
      >
        [{n}]
      </a>
    );
  };

  return (
    <div ref={root} className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        {/* hero */}
        <header className="border-b border-rule py-14 sm:py-20">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Beverly, Massachusetts · Who the town is, in dollars
          </span>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            What a decade of budgets says about Beverly.
          </h1>
          <p className="mt-5 max-w-[60ch] text-xl leading-snug text-ink-mid sm:text-[1.5625rem]">
            A choice made once is a response to circumstance. The same choice made ten years running is a portrait of what a city is
            for. <b className="font-bold text-ink">Here is Beverly&apos;s, measured against six neighbors.</b>
          </p>
          <p className="mt-8 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-faint">
            A nonpartisan read of the public record, from the state&apos;s own reports on spending, taxes, reserves, and schools. It
            is the deeper companion to the two explainers on how the budget works:{" "}
            <A href="/work/beverly">What Beverly Does Next</A>. Where a number is an estimate rather than a reported figure, the text
            says so.
          </p>
        </header>

        {/* frame */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>The frame</SectionNum>
            <P>
              Show a person a city&apos;s budget and you show them what the city values. Not the values in its mission statements or its
              campaign promises, but the ones it backs with money. It is an old idea in public finance, and it holds because a budget
              cannot claim one priority while funding another.{fn(1)}
            </P>
            <P>
              A single year of a budget is mostly constraints: contracts signed years earlier, assessments set by the state, debt
              payments on buildings already standing, and a cap on property taxes written into state law in 1980. A decade of budgets is
              a different thing. The margins accumulate. This piece reads Beverly&apos;s last decade that way. Not one budget, and not the
              deficit that arrived in 2026, but the pattern underneath both: what Beverly funded year after year, what it did not, and
              where it put the money it had left over.
            </P>
            <P>
              The answer comes from comparison. Beverly is measured here against six North Shore neighbors: Salem, Peabody, Danvers,
              Gloucester, Marblehead, and Swampscott. They share a region, a housing market, a commuter rail line, and the same state
              rules. Where Beverly looks like its neighbors, the shared rules are the reason. Where it stands apart, the reason is
              something Beverly chose.
            </P>
            <P>
              Most people here already have a strong opinion about one or two of these. The teachers&apos; strike in 2024. The trash fee.
              The City Hall renovation. The apartment buildings on Rantoul Street. The city spending millions to buy the old Family
              Dollar building and save a parking lot. This piece will not claim they were secretly one decision. It will lay out the
              decade of budget choices sitting underneath them, so that whatever you concluded about any single fight, you can see the
              larger set of priorities it came out of.
            </P>
            <P>
              Start with what Beverly gets right, because it is real. By the usual measures of a well-run city, Beverly does well. It
              balances its budget every year, carries little debt for its size, and keeps a healthy reserve. If you think of Beverly as
              financially careful, the record backs you up. This piece asks a narrower question: careful toward what end?
            </P>
            <P>So the same decade supports two honest readings, and this piece holds both open.</P>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-l-4 border-rule border-l-accent bg-bg-card/50 px-5 py-4">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-accent">Stewardship</span>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                  A city that lived within its means, built a reserve, paid its debts early, and guarded its residents against the next
                  downturn.
                </p>
              </div>
              <div className="rounded-md border border-l-4 border-rule border-l-debt bg-bg-card/50 px-5 py-4">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-debt">Under-investment</span>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                  A city that grew, banked the proceeds, and held its services near the bottom of the region.
                </p>
              </div>
            </div>
            <P>
              Which reading is right depends on what you believe a town is for, and that judgment is yours, not this piece&apos;s. What
              follows is that decade, function by function, and the year the bill came due. It starts with how Beverly spends.
            </P>
          </Reveal>
        </section>

        {/* 01 lean */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>01 · Beverly runs lean, almost everywhere</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              It spends less per resident than nearly every community around it, and has for a decade.
            </h2>
            <P>
              The spending figures come from Schedule A, the annual report of spending by function that every Massachusetts city and
              town files with the state. Shown per capita, so a city of 42,000 can be compared to a town of 15,000, Beverly ranks sixth
              of seven on total spending, and the same low ranking repeats across nearly every function of government.{fn(2)}
            </P>

            <FunctionSpendingChart />

            <P>
              The obvious objection is size. Maybe bigger places just spend less per person. It is a fair question, and the answer is no.
              Across all of Massachusetts, how big a town is tells you almost nothing about what it spends per resident.{fn(3)} Within
              this particular group the smallest towns happen to be the biggest spenders, but that is a fact about which seven towns are
              being compared, not a law of arithmetic. Beverly&apos;s low spending is a choice, made on a middle-of-the-road tax base
              rather than a rich one.
            </P>
            <P>
              What makes it a pattern rather than a quirk is the consistency. This is not one underfunded department. Public safety,
              public works, general government, debt service: the whole shape of the budget sits low, and it has for a decade.{fn(4)}{" "}
              Public works comes with one asterisk. Beverly pays for some of its roads out of free cash rather than the operating budget,
              so the operating figure understates the real total. Counted in full, its road spending still lands below the regional
              median.
            </P>
            <P>
              One caveat about the neighbors, because it changes how to read the gap. The two that spend the most, Marblehead and
              Swampscott, are override towns. Proposition 2½, the state law that caps how fast a town&apos;s property tax revenue can
              rise, lets a community tax above its cap only when its voters approve it, and theirs have, repeatedly, most recently a $15
              million override in Marblehead in 2026.{fn(5)} That extra spending is money residents chose to raise. Most of the cohort,
              Beverly included, has never put the question. So the fair comparison is Beverly against the towns under the same limit, and
              there Beverly still comes in low. What it does with the difference is the rest of this story.
            </P>
            <P>
              The schools are the exception that isn&apos;t. They sidestep the size question entirely, because they are measured per
              student and adjusted for how much the state says each district needs. On that measure Beverly is not mid-pack. It is last.
            </P>
          </Reveal>
        </section>

        {/* 02 schools */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>02 · The schools are the sharpest edge, not an exception</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Beverly&apos;s schools are the clearest instance of the pattern, and the one that forced a reckoning.
            </h2>
            <P>
              On November 8, 2024, Beverly&apos;s teachers went on strike, with class size among their central demands, and stayed out
              more than two weeks.{fn(6)} One caution before the numbers: this section measures what Beverly chooses to spend on its
              schools, not how good those schools are. Money does not guarantee results. But spending is a choice, and among the clearest
              a town makes.
            </P>
            <P>
              By the crude number the state reports for general accounting, Beverly&apos;s school spending looks ordinary. But that number
              is measured per resident, not per student, which makes it a poor guide to what reaches a classroom. The measure built for
              that is in-district spending per pupil, and on it Beverly spent $18,595 in fiscal 2024, last of the seven and the 21st
              percentile statewide, less per pupil than roughly four out of five districts in Massachusetts.{fn(7)} Count every dollar,
              including the tuition it pays to place some students in programs outside the district, and Beverly is still last per pupil.
              It is last however you count it.
            </P>
            <P>
              The obvious objection is that this is not a fair fight, that some of these towns just collect more from the state. So look
              at how Massachusetts pays for schools. Every district gets a foundation budget, the state&apos;s estimate of what it costs
              to educate that district&apos;s own students, set higher where there are more low-income students, English learners, and
              children in special education. The town pays a required share, set by its wealth and its residents&apos; income, and the
              state covers the rest. Whatever a town spends above the required share is its own choice.
            </P>

            <SchoolFundingStack />

            <P>
              The objection is right about Salem. The state measures Salem&apos;s students as needier, so its foundation budget is larger
              and its aid is more than double Beverly&apos;s per pupil.{fn(8)} But read the green segment, the money each town adds above
              what it is required to spend. Beverly&apos;s $3,506 per pupil is second from the bottom, ahead of only Peabody. And Beverly
              is not a shortchanged, low-aid town: the state already expects it, like four of its neighbors, to cover the largest local
              share the formula allows, 82.5 percent of the foundation budget. Beverly is expected to pay near the top and chooses to add
              near the bottom.{fn(9)}
            </P>
            <P>
              The cleanest single comparison is Danvers, the one town that matches Beverly on both measures the state uses to gauge what a
              community can afford, property wealth and income, each within about ten percent. Danvers has slightly less student need and
              takes slightly less state aid, and it still puts in $15,574 of local money per pupil to Beverly&apos;s $13,912. Gloucester
              sharpens the point from the other side: its residents earn 16 percent less than Beverly&apos;s, and its schools serve nearly
              twice the share of low-income students, yet it funds its classrooms about a quarter more richly anyway, $17,209 per pupil.
            </P>
            <P>
              The underinvestment shows up in the two things the teachers walked out over. Beverly&apos;s classes run fuller than in the
              towns that spend the most on schools, about 12 students per teacher against 10.6 in Marblehead. And its teachers are paid
              near the bottom of the cohort, sixth of seven.{fn(10)} Fuller classes and lower pay are part of what last-place spending
              buys, and in November 2024 they are what emptied the schools for two weeks.
            </P>
            <P>
              The strike did change the direction. After the 2024 settlement, Beverly&apos;s school spending rose about 8 percent in a
              single year, and its statewide standing climbed from the 7th percentile in 2020 to the 21st in 2024.{fn(11)} That belongs
              in the record. But it is a climb from the floor of its cohort and the bottom fifth of the state, its peers are rising too,
              and one contract does not reverse a decade of position. A city that holds its classrooms at the bottom of the state is
              putting its money somewhere else. That is the next question.
            </P>
          </Reveal>
        </section>

        {/* 03 what it spends on */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>03 · What a frugal city does spend on</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A lean government&apos;s exceptions are the most revealing thing about it.
            </h2>
            <P>
              Beverly is aggressive about a short list of things, and every one of them is a building or the balance sheet, not a
              service.
            </P>

            <h3 className="mt-8 font-display text-xl font-semibold text-ink">The surplus machine</h3>
            <P>
              Start with savings. Beverly&apos;s stabilization fund, its rainy-day account, held $750,000 in 2013 and $16.9 million by
              2022, growing every single year.{fn(12)}
            </P>

            <StabilizationLeap />

            <P>
              On top of that, the city certified free cash, the surplus left when the books close, in every year from fiscal 2014 through
              2024, lately running about $10 million a year.{fn(13)} Hold that next to the problem. The deficit now forcing service cuts
              is {gapM(FY27)}. Beverly&apos;s yearly surplus is more than twice that. The money exists. Where it goes is not services.
            </P>
            <P>
              Where does a $10 million surplus come from every year? Partly from a habit. Local receipts, the money a city takes in
              outside property taxes, run $11 to $15 million a year for Beverly, and cities must estimate that revenue before the year
              begins. Beverly estimates it low and beats the estimate every year. Even in its most accurate year, it collected 21 percent
              more than it budgeted, the most conservative floor of any town in the cohort.{fn(14)}
            </P>

            <ReceiptsChart />

            <P>
              Under-forecasting revenue is legal, common, and encouraged by the state. But Beverly does it harder than anyone around it,
              and the effect is not neutral. Money the city forecasts lands in the operating budget, where it can pay a teacher or a
              firefighter. Money that arrives instead as a year-end surplus is &quot;one-time&quot; money, and one-time money is not
              supposed to fund recurring costs, because the job vanishes the first year the surplus dips. So the habit quietly sorts what
              could have been operating revenue into a pot that, by its own rules, cannot be spent on operations.
            </P>
            <P>
              That pot goes where one-time money is allowed to go. Fiscal 2024 is a closed year now, every Council order on the record, so
              its free cash can be traced in full.{fn(15)}
            </P>

            <FreeCashDisposition />

            <P>
              The one order that came closest to breaking the pattern confirms it. A $2 million free-cash request to replace the main
              library&apos;s heating system was voted down, and the same repair was funded from the debt stabilization fund instead. Even
              the capital project that reached for free cash was routed through a reserve, not an operating line. The reserves were being
              fed, not drained, straight through the years the squeeze was building.{fn(16)}
            </P>

            <h3 className="mt-10 font-display text-xl font-semibold text-ink">What it buys</h3>
            <P>
              The biggest thing Beverly buys with borrowed money is a building. The marquee project of the decade is the new Briscoe
              Middle School, 1,395 students, opened in 2018: a roughly $109 million project, of which about $49 million came as a state
              grant and the remaining $60 million was borrowed by the city.{fn(17)} Beverly bonded $60 million for the building and then
              staffed the classrooms inside it at the bottom of the cohort, in the same years. And it kept even the borrowing lean: for
              all that it builds, Beverly carries less debt per resident than almost every town in the cohort.{fn(18)}
            </P>
            <P>
              And it did all of this inside the tax cap. When a Massachusetts town builds a new school, it usually passes a debt
              exclusion, a temporary tax increase tied to that one project. It is a routine move, and most communities have made it.
              Beverly never has. It built Briscoe and the police station within the same cap that pays for its classrooms and its patrols,
              and asked its voters for nothing extra to do it.{fn(5)}
            </P>
            <P>
              The sharpest version of the pattern is the pension. Every Massachusetts city owes its retirement system an unfunded
              liability, the benefits already promised to workers but not yet backed by money in the fund, and pays it down on a
              state-approved schedule that must finish by fiscal 2040. Beverly&apos;s finishes early, in 2032, and it enters this stretch
              tied for the best-funded system in the cohort, at 75 percent, though in absolute terms that is merely the statewide median.
              It reaches that mark on a leaner budget than the two cohort towns that vote to tax themselves above the cap.{fn(19)}
            </P>

            <PensionTable />

            <P>
              Paying a debt early is, in one light, the definition of prudence.{fn(20)} It is also not free. The pension payment is one of
              the largest fixed costs in the budget, and retiring it early means a heavier bill in the years before it ends, the same
              years the city is eliminating its bus line and trimming its libraries. It is the school-building trade on a longer clock.
            </P>
            <P>
              One service breaks the pattern, and it fits Beverly&apos;s identity rather than denting it. Culture and recreation, the
              library, the parks, and the theaters and galleries of the Cabot Street corridor, is the one function Beverly funds above its
              peers, though it is only about two percent of the budget. The state designated that corridor a cultural district in 2015.
              {fn(21)} So the pattern is more specific than &quot;spends little.&quot; Beverly holds down the core services and funds the
              amenities that give the place its character. The exception is not a contradiction. It is a preference.
            </P>
            <div className="mt-8 rounded-r-md border-l-4 border-gold bg-bg-card/50 px-6 py-5 font-display text-xl leading-snug sm:text-[1.4375rem]">
              Put the list together and the priorities resolve. Beverly opens its wallet for what can be bonded, reimbursed by the state,
              or banked, and holds the line on what becomes a permanent salary in next year&apos;s budget.{" "}
              <b className="font-extrabold">Bricks over staff. The balance sheet over the service level.</b>
            </div>
          </Reveal>
        </section>

        {/* 04 grew */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>04 · And it grew the whole time</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Growth is what turns thin spending from a constraint into a choice.
            </h2>
            <P>
              The reserves and thin services might describe a town of modest means, husbanding what little it has. They do not. Over the
              same decade it held services at the bottom of the cohort, Beverly was one of the fastest-growing communities on the North
              Shore. Its population rose 8.0 percent between the 2010 and 2020 censuses, second in the cohort.{fn(22)} About 168 housing
              units were built citywide from 2010 to 2014, and nearly 1,400 were built or permitted in the years after, most of it dense
              and downtown along the Rantoul Street corridor.{fn(23)}
            </P>
            <P>
              Beverly also did the thing many of its neighbors would not. When the state&apos;s MBTA Communities law required cities on the
              transit system to zone for multifamily housing, Beverly complied on time, zoning about 98 acres near the Depot for 2,063
              units, and was not among the towns the attorney general later sued.{fn(24)} The contrast played out next door in 2026, when
              a Marblehead resident asked at Town Meeting whether his town was quietly dodging the same law, a question that drew two
              million views online.{fn(25)} Beverly took the law seriously. Marblehead made the news for not.
            </P>
            <P>
              Here is why that matters to the budget. Growth is not just construction; it is revenue, and revenue of an unusual kind.
              Proposition 2½ lets a city&apos;s tax take rise only 2.5 percent a year, with one exception: new growth, the taxes on newly
              built or improved property, which stack on top of the limit and then compound at 2.5 percent every year after. And the kind
              of construction matters. Commercial and lab space, well over half of Beverly&apos;s new growth at 58 percent, pays taxes
              without sending children to school or filling the roads with new residents, the highest-margin revenue a city can add.
              Beverly&apos;s growth leaned toward the profitable side, anchored by the Cummings Center&apos;s two million square feet of
              offices and labs.{fn(26)}
            </P>
            <P>
              Some cities are built almost entirely on this. Waltham, on the Route 128 lab corridor, lets commercial property cover close
              to half its tax levy, which funds schools near the top of the state with low residential taxes and no override.{fn(27)}{" "}
              Beverly runs a far smaller version of the same playbook, its base a fraction as commercial, and it banks the proceeds rather
              than spending them.
            </P>
            <P>
              The housing still reached the services in one visible place: the schools. Between fiscal 2015 and 2024 every other district
              in the cohort lost students, some sharply, while Beverly&apos;s enrollment held roughly flat, the only one that did not
              shrink.{fn(28)} The cohort lost about 7 percent of its students over the decade; had Beverly followed that trend, it would
              have several hundred fewer children in its schools today. Its new apartments did not flood the district, but they kept it
              full while its neighbors emptied. That is growth arriving as real service demand, and Beverly met it at the bottom of the
              cohort per pupil.
            </P>
            <P>
              Notice the shape. On spending, Beverly ranks low in its cohort and low statewide. On growth, it ranks high in its cohort but
              only average for the state, its new growth running near the statewide median.{fn(29)} But average-for-the-state is also
              headroom. Beverly has a decade-long record of adding taxable value and a base nowhere near built out, and every additional
              million dollars of new growth is a million dollars of permanent, compounding revenue. That matters because the next section
              is about Beverly choosing to grow less. Part of what those choices set aside was future tax base.
            </P>
            <P>
              None of this makes Beverly rich. Its tax base is about $265,000 of assessed value per resident, fifth of the seven, without
              the coastal home values of Marblehead and Gloucester or the retail base of Peabody.{fn(30)} A middling base shapes the town,
              but it is not what holds spending down. Beverly grows its base well and taxes it to the ceiling, and it has never once asked
              voters to go beyond that ceiling. The revenue side is not where Beverly is stuck. Which puts the question back on the
              spending side. The frugality was never the only option. It was a choice.
            </P>
          </Reveal>
        </section>

        {/* 05 calibration */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>05 · The calibration</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              By 2023, Beverly began to pump the brakes, with the two tools it always reaches for.
            </h2>
            <P>
              Two moves stand out, and both are usually read as the city reversing course. They are better read as a city slowing the
              pace of its growth while keeping the direction, and doing it with the rulebook and the checkbook.
            </P>
            <P>
              The first move was zoning. After the Rantoul Street apartment wave, residents pushed back, and the Boston Globe caught the
              mood in January 2023: traffic, a five-story building out of scale with its neighbors, poorly maintained streets, and open
              questions about whether Beverly had the resources to keep up with its own growth.{fn(31)} Those worries had a basis. Beverly
              runs the leanest public works budget in the cohort, and lately it has been playing catch-up on its roads with one-time free
              cash rather than steady operating money.{fn(32)}
            </P>
            <P>
              Weeks later, on February 13, the City Council rewrote the downtown rules. It eliminated the overlay that had allowed
              seven-story buildings on Rantoul Street, dropping the effective limit to five stories, and capped new construction on and
              near Cabot Street at four. It kept the rule that new projects of six or more units set aside 12 percent as affordable, which
              passed unanimously. This is moderation, not reversal, and it has a price: lower ceilings mean less new housing and less new
              tax base than the peak-boom zoning would have produced.
            </P>
            <P>
              The second move was sharper, and it cost real money. In May 2023 the City Council approved buying 218 to 226 Cabot Street,
              the former Family Dollar and its neighbors, through a negotiated eminent domain taking. The price was $7.35 million, with the
              authorization reaching $8 million once renovation was included. Beverly ended up funding about $4.5 million of it from free
              cash and borrowing the rest. The main reason was parking: 108 public spaces the city had leased for years and would lose if
              the parcel were sold and redeveloped.{fn(33)}
            </P>
            <P>
              Read that against the record. A city that permitted roughly 1,400 units and zoned for state-mandated density spent $7.4
              million to stop one downtown parcel from becoming apartments, in order to keep a parking lot.
            </P>

            <div className="my-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-l-4 border-rule border-l-debt bg-bg-card/50 px-5 py-4">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-debt">The unflattering read</span>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                  A city trying to have it both ways, chasing the density and the tax base while spending to freeze the parts of downtown
                  that longtime residents did not want to lose.
                </p>
              </div>
              <div className="rounded-md border border-l-4 border-rule border-l-accent bg-bg-card/50 px-5 py-4">
                <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-accent">The flattering read</span>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">
                  A city maturing, deciding on purpose that it had grown fast enough, and buying back a public asset before the market
                  took it.
                </p>
              </div>
            </div>
            <P>
              Both fit the facts, and this piece will not pick. What is not in question is how Beverly answered the friction of its own
              growth. It changed a rule and it bought a building. It did not add the services that growth demands: no new public works
              crews for the denser streets, no new teachers for the students it alone kept. Even while slowing down, Beverly reached for
              the rulebook and the checkbook, and left the service side where it has always been.
            </P>
          </Reveal>
        </section>

        {/* 06 pressure test */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>06 · The pressure test</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              An identity is easy to hold while nothing forces the question.
            </h2>
            <P>
              In December 2025, Beverly&apos;s Financial Forecasting Committee reported that the city faced a {gapM(FY27)} gap in the
              fiscal 2027 budget, and that on current trends the gap reaches {gapM(FY30)} by fiscal 2030. Massachusetts requires a
              balanced budget every year, so the gap has to be closed each year.{fn(34)}
            </P>
            <P>
              The fiscal 2027 budget closed the first one. The mechanics are covered in the{" "}
              <A href="/work/beverly/fy27-budget">previous piece</A>, and the short version is fees and cuts: a higher trash fee, tighter
              department budgets, reduced library hours, the elimination of the city&apos;s single municipal bus line, and positions lost
              across the mayor&apos;s office, planning, the Council on Aging, and one each in police and fire by attrition.{fn(35)}
            </P>
            <P>
              Here is the part that belongs in this piece. Beverly closed that gap while holding about $16.9 million in its stabilization
              fund and certifying about $10.5 million in free cash, an amount inside the city&apos;s own policy target. The reserves were
              not untouched; the mayor noted spending roughly $2 million from the rainy-day fund. They were also not spent down to
              preserve the services being cut.{fn(36)}
            </P>
            <P>
              This is not a city that refuses to touch its reserves. It touched them when the reason fit. In 2020, when the pandemic
              opened a $4.6 million hole and state aid fell more than 17 percent in a single year, Beverly drew about $1 million from the
              rainy-day fund, leaned on new growth and a tax increase, trimmed departments, and laid no one off.{fn(37)} That is what a
              reserve is for: a sharp one-year shock bridged until revenue comes back.
            </P>
            <P>
              The fiscal 2027 deficit is a different kind of problem, and the difference is the point. It is not a one-year shock but a
              structural one, a permanent gap between how fast costs rise and how fast revenue can. Reserves are one-time money, and
              one-time money cannot cover a recurring cost. Beverly has held to that line more tightly than any of its neighbors for a
              decade. So when the structural squeeze finally arrived, it arrived as service cuts, not a drawdown. The decade of choices
              described here was made when choosing was cheap. Fiscal 2027 is the first year it was expensive. Fiscal 2030, on the
              city&apos;s own projection, is more than three times harder.
            </P>
          </Reveal>
        </section>

        {/* 07 the question */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>07 · The question</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Every one of those decisions is defensible on its own. Together they describe what the city is for.
            </h2>
            <P>
              Put the decade in one paragraph. Beverly grew its population, its housing stock, and its commercial tax base faster than
              most of its neighbors. It taxed that base to the state ceiling every year. It forecast its revenue conservatively, banked
              the surplus, took a reserve fund from $750,000 to $16.9 million, and moved to retire its pension debt years early. It ran
              its schools, its police and fire, and its public works near the bottom of its peer group throughout. When the costs of those
              choices arrived together, it reduced services rather than spend the reserve on them.
            </P>
            <P>
              None of it was ever put to residents as a single question. Budgets are adopted one year at a time, and each year&apos;s
              version is a set of narrow tradeoffs that rarely feels like a statement of identity. The identity is what accumulates.
            </P>
            <div className="mt-8 rounded-md bg-ink px-7 py-8 text-bg">
              <p className="max-w-[62ch] font-display text-2xl font-extrabold leading-tight text-white sm:text-[2rem]">
                The question is not whether Beverly has managed its money carefully.
              </p>
              <p className="mt-4 max-w-[64ch] leading-relaxed text-bg/90">
                The reserve, the low debt, and the early pension payoff answer that. The question is whether the balance it struck between
                financial strength and the services people use every day is the one you would choose, if someone put it to you plainly.
              </p>
              <p className="mt-5 font-display text-lg font-semibold text-white">For the next several years, someone will.</p>
            </div>
            <p className="mt-8 max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-mid">
              What Beverly could do about the gaps ahead, and what each choice costs, is a separate question, taken up in the options
              piece to come. To place your own town on the same map, the{" "}
              <A href="/work/beverly/property-tax">MA property tax explorer</A> scores every community in Massachusetts by the levers behind
              this story.
            </p>
          </Reveal>
        </section>

        {/* footnotes */}
        <section className="py-12">
          <h2 className="font-display text-lg font-semibold text-ink">Notes referenced in the text</h2>
          <ol className="mt-4 space-y-3 text-[0.84375rem] leading-relaxed text-ink-mid">
            {NOTES.map((note, i) => (
              <li key={i} id={`fn-${i + 1}`} className="grid grid-cols-[1.9rem_1fr] gap-1 scroll-mt-20">
                <a href={`#fnref-${i + 1}`} className="font-bold text-accent no-underline hover:underline">
                  {i + 1}.
                </a>
                <span className="max-w-[74ch]">{note}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[74ch] text-[0.8125rem] leading-relaxed text-ink-faint">
            Figures come from the Massachusetts Division of Local Services (Schedule A, the Municipal Databank, and Proposition 2½
            reports), the Department of Elementary and Secondary Education (Chapter 70), the Public Employee Retirement Administration
            Commission, the U.S. Census, and the City of Beverly&apos;s own budget and forecast documents. Where a figure is an estimate
            or a projection rather than a reported number, the note says so. This piece describes what Beverly has done; it does not argue
            what it should do next.
          </p>
        </section>
      </div>
    </div>
  );
}
