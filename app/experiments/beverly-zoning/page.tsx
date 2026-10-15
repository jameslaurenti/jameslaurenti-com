import guide from "@/data/beverly/zoning-guide.json";
import AddressLookup from "./AddressLookup";
import DistrictExplorer from "./DistrictExplorer";
import LandShare from "./LandShare";
import LotLadder from "./LotLadder";
import ProcessPaths from "./ProcessPaths";
import { FamilyMaps, MINIMAP_VIEWBOX, ThumbDefs } from "./Thumbs";
import ZoningMap from "./ZoningMap";
import { ZoningProvider } from "./ZoningState";
import { A, Callout, Confidence, Fn, H2, H3, type Level, P, SectionNum, Term, Unchecked } from "./ui";
import { FAMILIES, OVERLAYS, PARCEL_TOTALS, STATS, fmt } from "./zoning";

/**
 * "Zoning in Beverly, from zero": an unlisted experiment under /experiments.
 *
 * What it is built from, and how far each part can be trusted:
 * - The map, the land shares and every "what is there today" figure come from the state’s FY2027
 *   assessor parcel file for Beverly, processed by scripts/beverly-zoning/build_zoning_data.py.
 * - District rules (data/beverly/zoning-districts.json) and most process, state and comparison
 *   facts (data/beverly/zoning-guide.json) were gathered while the ordinance, the General Laws
 *   and mass.gov were unreachable from the build environment, so they come from search-engine
 *   excerpts of those pages. They are marked Unverified on the page until someone reads the
 *   source. Facts this site’s digest already reported from primary documents are Confirmed.
 * Do not move this to a public route until the Unverified items are checked.
 */

const G = guide;
const SECTION = "border-b border-rule py-14 scroll-mt-16";

function totalAcres(zones: string[]) {
  return zones.reduce((s, z) => s + (STATS[z]?.acres ?? 0), 0);
}

const oneFamily = FAMILIES.find((f) => f.id === "one-family")!;
const oneFamilyShare = Math.round((100 * totalAcres(oneFamily.zones)) / PARCEL_TOTALS.zonedAcres);
const belowAll = Object.values(G.parcels.singleFamilyLotsBelowMin.byDistrict).reduce(
  (acc, d) => ({ lots: acc.lots + d.lots, below: acc.below + d.below }),
  { lots: 0, below: 0 },
);
const belowPct = Math.round((100 * belowAll.below) / belowAll.lots);
const aboutBelow = belowPct === 50 ? "half" : belowPct + " percent";
const BELOW_BY_DISTRICT = Object.entries(G.parcels.singleFamilyLotsBelowMin.byDistrict)
  .map(([z, d]) => `${z.replace(/^R/, "R-")} ${Math.round((100 * d.below) / d.lots)}`)
  .join(", ")
  .concat(" percent");

const CONTENTS: [string, string][] = [
  ["basics", "The basics"],
  ["districts", "Beverly’s 18 districts"],
  ["map", "The map"],
  ["you", "What it means for you"],
  ["change", "How the rules change"],
  ["state", "The state’s role"],
  ["compare", "How Beverly compares"],
  ["glossary", "Glossary"],
  ["notes", "Notes and sources"],
];

const GLOSSARY: [string, string, string][] = [
  ["abutter", "Abutter", "An owner of land next to or near a property that is asking for a permit. For zoning hearings, owners within 300 feet get mailed notice."],
  ["adu", "Accessory dwelling unit (ADU)", "A small second home on the same lot as a house: a basement or attic apartment, an addition, or a cottage out back."],
  ["by-right", "By right", "Allowed without a hearing, as long as the project meets every rule. The building permit is the only approval."],
  ["40b", "Chapter 40B", "A state law that lets a developer who sets aside affordable homes ask for one permit that overrides local zoning, in places where less than 10 percent of homes count as affordable."],
  ["frontage", "Frontage", "The length of a lot’s edge along a street. Each district sets a minimum."],
  ["mbta", "MBTA Communities law", "Section 3A of the state Zoning Act, passed in 2021. It requires the 177 communities served by the MBTA to allow multifamily housing by right in at least one district."],
  ["new-growth", "New growth", "Property tax from new construction and improvements. It raises the city’s levy limit beyond Proposition 2½’s 2.5 percent yearly cap."],
  ["nonconforming", "Nonconforming", "A lot, building or use that was legal when it began but does not meet today’s rules. It can generally continue. Often called grandfathered."],
  ["overlay", "Overlay district", "A second layer of rules on top of the base districts, covering part of the city: a floodplain, the area around a train station."],
  ["setback", "Setback", "The required distance between a building and a lot line, measured separately for the front, sides and rear."],
  ["site-plan", "Site plan review", "A Planning Board review of a larger project’s layout, traffic, drainage and design, even when its use is allowed."],
  ["special-permit", "Special permit", "Approval, after a public hearing, for a use or feature the ordinance allows only if a board finds it fits. The board can attach conditions."],
  ["shi", "Subsidized Housing Inventory", "The state’s count of each community’s affordable homes, used to decide where Chapter 40B can override local zoning."],
  ["variance", "Variance", "Permission to depart from a rule, usually a dimensional one, because the lot’s shape, soil or slope makes the rule a hardship."],
];

type Note = { level: Level; body: React.ReactNode };

const NOTES: Note[] = [
  {
    level: "unverified",
    body: (
      <>
        City of Beverly Zoning Ordinance, City Code Chapter 300, on{" "}
        <A href="https://ecode360.com/29283330">eCode360</A>. The code is reported as current through February 17, 2026, with one
        later zoning amendment, Ord. No. 119-2026 (June 15, 2026), adopted but not yet codified. Article IV places the official
        zoning map with the City Clerk.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Ordinance excerpts name the Zoning Board of Appeals for most special permits and the Planning Board for some, including
        parking reductions under § 300-59D. G.L. c. 40A, § 9 sets the hearing within 65 days of filing, the decision within 90 days
        after it, and four votes on a five-member board. The 37 Enon Street parking request (Planning Board agenda, October 6, 2026)
        is confirmed; the rest is unverified.{" "}
        <A href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section9">c. 40A, § 9</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Variances: G.L. c. 40A, § 10, with the four-of-five vote in § 15. Older houses: § 6, which lets a nonconforming one- or
        two-family house be altered when the change does not increase the nonconformity, and otherwise requires a finding that it is
        not substantially more detrimental to the neighborhood. Whether Beverly’s ordinance allows use variances was not
        determined. <A href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section10">c. 40A, § 10</A>.
      </>
    ),
  },
  {
    level: "modeled",
    body: (
      <>
        FY2027 assessor records: the {fmt(belowAll.lots)}{" "}parcels holding exactly one single-family home in R-90 through R-6, compared
        with each district’s minimum lot as given in note 7. {fmt(belowAll.below)} ({belowPct} percent) are smaller. By district:{" "}
        {BELOW_BY_DISTRICT}. Lot area only; frontage and other tests are not checked.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        § 300-6 (Article III) is reported to read “The City of Beverly, Massachusetts is hereby divided into 18 zoning
        districts,” and the district regulations run from § 300-30 (R-90) to § 300-47 (MOSR). The assessor’s FY2027
        records carry exactly 18 matching codes, which is confirmed.
      </>
    ),
  },
  {
    level: "modeled",
    body: (
      <>
        MassGIS Level 3 assessor parcels for Beverly, FY2027 (
        <A href="https://www.mass.gov/info-details/massgis-data-property-tax-parcels">MassGIS</A>), processed by{" "}
        <code>scripts/beverly-zoning/build_zoning_data.py</code>. Each parcel takes the assessor’s zoning code; overlays are not
        recorded there. Land counted: {fmt(Math.round(PARCEL_TOTALS.zonedAcres))} acres of parcels, leaving out{" "}
        {fmt(Math.round(PARCEL_TOTALS.streetAcres))} acres of streets, {fmt(Math.round(PARCEL_TOTALS.railAcres))} of railroad and{" "}
        {fmt(Math.round(PARCEL_TOTALS.waterAcres))} of water. One parcel carried two codes and takes the more common one.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Ordinance excerpts: R-90 “Minimum lot area: 90,000 square feet”; R-6 “minimum of 6,000 square
        feet”; R-45 45,000 square feet. R-22, R-15 and R-10 follow the district names, which match their purpose statements
        (“approximately 1/2 acre,” about a third of an acre, “approximately 1/4 acre”). A football field
        between the goal lines is 300 by 160 feet.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Affordable Homes Act, St. 2024, c. 150, amending G.L. c. 40A, §§ 1A and 3, with state regulations at 760 CMR 71.00,
        effective February 2, 2025. Size limit, no owner-occupancy requirement, and at most one parking space, none within half a mile
        of transit. <A href="https://malegislature.gov/Laws/SessionLaws/Acts/2024/Chapter150">Chapter 150 of 2024</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        § 300-55, amended December 4, 2023; the City’s{" "}
        <A href="https://www.beverlyma.gov/1028/Accessory-Dwelling-Unit-ADU-Ordinance">ADU page</A> on the 1,000 square foot cap and
        the May 4, 2026 joint hearing of the Council and Planning Board on changes to match state law. Whether those changes were
        adopted, possibly as Ord. No. 119-2026, was not confirmed.
      </>
    ),
  },
  {
    level: "modeled",
    body: (
      <>
        FY2027 assessor records: {G.parcels.oneFamilyMultiUnitBuildings.value} records with two-family, three-family or apartment use
        codes (104, 105, 111, 112) in R-90 through R-10. {G.parcels.oneFamilyMultiUnitPre1940Pct.value} percent list a year built
        before 1940; the median is 1905.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Residential rate ${G.tax.residentialRate.value.toFixed(2)}: Massachusetts Division of Local Services, confirmed. Commercial,
        industrial and personal property ${G.tax.commercialRate.value.toFixed(2)}: the{" "}
        <A href={G.tax.commercialRate.url}>City Assessors page</A>, unverified. The City Council set the split with the state’s
        maximum shift, {G.tax.shift.value}, on December 1, 2025 (unverified). Tax class follows use under G.L. c. 59, § 2A and the
        state’s property type codes. The full mechanics are in{" "}
        <A href="/beverly/what-sets-your-taxes">What sets your property taxes</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Assessors value property at its highest and best use, which must be legally permissible, physically possible, financially
        feasible and the most productive. Appellate Tax Board decisions apply the test; the{" "}
        <A href="https://www.iaao.org/wp-content/uploads/Standard_on_Mass_Appraisal.pdf">IAAO Standard on Mass Appraisal</A> treats
        zoning as the usual limit on legal use.
      </>
    ),
  },
  {
    level: "confirmed",
    body: (
      <>
        Massachusetts Division of Local Services, “Levy Limits: A Primer on Proposition 2½.” How new growth figures in
        Beverly’s budget: <A href="/beverly/budget-explainer">How the budget works</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        G.L. c. 40A, § 11 (“parties in interest,” including abutters to abutters within 300 feet) and § 17 (appeal
        within 20 days after the decision is filed with the City Clerk). Decisions take effect once recorded at the Southern Essex
        District Registry of Deeds.
      </>
    ),
  },
  {
    level: "unverified",
    body: <>Wetlands Protection Act, G.L. c. 131, § 40; public waterfront licensing, G.L. c. 91; the State Building Code, 780 CMR.</>,
  },
  {
    level: "confirmed",
    body: (
      <>
        Order #250: <A href={G.order250.filed.url}>Council agenda packet, October 5, 2026 (p. 37)</A>;{" "}
        <A href={G.order250.planningBoardSetDate.url}>Planning Board agenda, October 6</A>;{" "}
        <A href={G.order250.councilHearing.url}>Council recording, October 5</A>. Reported in the{" "}
        <A href="/beverly/digest/2026-10-12#datacenters">Beverly Meeting Digest, October 12</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Adoption on November 12, 2024: the City’s{" "}
        <A href={G.mbta.zonedUnits.url}>MBTA Communities page</A>, confirmed. The October 7, 2024 joint hearing date comes from a
        search excerpt of the City’s Design Standards page and is unverified, as is the simple-majority vote reported by{" "}
        <A href={G.mbta.simpleMajority.url}>North Shore Realtors</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        G.L. c. 40A, § 3, and Beverly § 300-26, reported to read: “Those uses exempted from the provisions of this chapter in
        accordance with MGL c. 40A, § 3, are allowed in all zoning districts, subject to the provisions and requirements of that
        section of state law.” <A href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section3">c. 40A, § 3</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        G.L. c. 40A, § 3A, and 760 CMR 72.00. EOHLC’s{" "}
        <A href={G.mbta.category.url}>community categories table</A> (January 14, 2025) lists Beverly as a commuter rail community
        with 17,887 housing units, a minimum capacity of {fmt(G.mbta.requiredUnits.value)} and a minimum of {G.mbta.minAcres.value}{" "}
        acres.
      </>
    ),
  },
  {
    level: "confirmed",
    body: (
      <>
        City of Beverly, <A href={G.mbta.zonedUnits.url}>MBTA Communities Multifamily Zoning</A>: about {G.mbta.zonedAcres.value} acres,
        adopted November 12, 2024, compliance confirmed April 2025.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        The same City page compares the district’s {fmt(G.mbta.zonedUnits.value)} homes with {fmt(G.mbta.requiredAfterOffset.value)}{" "}
        required after the state’s mixed-use offset. The arithmetic matches a 25 percent reduction from{" "}
        {fmt(G.mbta.requiredUnits.value)}.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        G.L. c. 40A, § 3A(b) bars noncompliant communities from four grant programs, among them MassWorks and Housing Choice.
        Attorney General v. Town of Milton, SJC-13580 (January 8, 2025). On January 29, 2026 the Attorney General sued nine towns,
        including Marblehead and Middleton (<A href={G.mbta.statewide.url}>press release</A>).
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        EOHLC <A href={G.shi.percent.url}>Subsidized Housing Inventory</A>, as of September 30, 2025: {fmt(G.shi.units.value)} of{" "}
        {fmt(G.shi.yearRoundUnits.value)} year-round homes, {G.shi.percent.value} percent. G.L. c. 40B, §§ 20 to 23, and 760 CMR
        56.03 for the 10 percent threshold and how a board claims it.
      </>
    ),
  },
  {
    level: "confirmed",
    body: (
      <>
        Executive Order 658, September 8, 2026, as reported in the{" "}
        <A href="/beverly/digest/2026-10-12#datacenters">Beverly Meeting Digest, October 12</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        <A href={G.ballot2026.question7.url}>Secretary of the Commonwealth, 2026 information for voters</A>. The description of
        Question 7 is the campaign’s, as reported in local coverage, and was not checked against the official summary.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Peabody: <A href="https://itemlive.com/2024/12/12/peabody-adopts-mbta-zoning/">Daily Item, December 12, 2024</A>. Salem:
        Harvard Design Magazine on “paper-compliant” communities, and the state’s December 2023 announcement of the
        first compliant communities.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        <A href="https://bankerandtradesman.com/lexington-slash-mbta-communities-zoning-amid-development-boom/">Banker & Tradesman</A>{" "}
        on Lexington’s 2025 cutback; Boston Indicators on the MBTA Communities permitting pipeline (January 2026).
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Milton: SJC-13580 and EOHLC’s February 2025 notice of noncompliance. Marblehead:{" "}
        <A href="https://marbleheadcurrent.org/2026/05/12/towns-3a-plan-what-happens-next/">Marblehead Current, May 12, 2026</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        <A href="https://www.mapc.org/news/parking-mandates-new-multifamily-housing-salem/">MAPC on Salem’s parking ordinance</A>,
        signed September 29, 2025 after a 10 to 1 Council vote. Enon Street figures:{" "}
        <A href="/beverly/digest/2026-10-05#enon">Beverly Meeting Digest, October 5</A> (confirmed).
      </>
    ),
  },
  {
    level: "unverified",
    body: (
      <>
        Amy Dain, “The State of Zoning for Multi-Family Housing in Greater Boston” (Massachusetts Smart Growth Alliance,
        June 2019), covering 100 communities around Boston; figures as summarized by{" "}
        <A href={G.research.dain2019.url}>MAPC</A>.
      </>
    ),
  },
  {
    level: "unverified",
    body: <>Salem’s accessory apartment ordinance: two 7 to 4 Council votes in May 2021, as reported by Patch.</>,
  },
  {
    level: "confirmed",
    body: (
      <>
        City Council, February 13, 2023 (<A href={G.downtown2023.date.url}>minutes</A>): eliminated the Tall Building Overlay on
        Rantoul Street, capped new construction on and near Cabot Street at four stories (the CC2 subdistrict), and kept the
        requirement that {G.downtown2023.inclusionaryPercent.value}{" "}percent of homes in new projects of six or more be affordable.
        The overlay’s heights, {G.downtown2023.tallBuildingFromFt.value} feet raised to {G.downtown2023.tallBuildingToFt.value} by
        special permit, are unverified.
      </>
    ),
  },
];

function Lead({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[60ch] text-xl leading-snug text-ink-mid sm:text-[1.4rem]">{children}</p>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-rule bg-white/60 px-5 py-4">
      <p className="font-display text-lg font-semibold leading-snug">{title}</p>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-mid">{children}</p>
    </div>
  );
}

function Actor({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-3">
      <p className="font-display text-base font-semibold">{name}</p>
      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mid">{children}</p>
    </div>
  );
}

export default function BeverlyZoningGuide() {
  return (
    <div className="bg-bg text-ink">
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        Working draft · shared by link · not yet fact-checked in full
      </div>

      <ZoningProvider>
        <ThumbDefs />
        <div className="mx-auto max-w-5xl px-5 pb-24 sm:px-6">
          {/* ---- hero */}
          <header className="border-b border-rule py-14 sm:py-20">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-accent">Beverly · Zoning, from zero</span>
            <h1 className="mt-2 max-w-[18ch] font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Every lot in Beverly comes with rules.
            </h1>
            <Lead>
              Zoning decides what can be built on a piece of land, how big it can be, and who has to say yes first. It shapes your
              street, your neighbor’s plans and what your house is worth. <b className="font-semibold text-ink">This guide starts from nothing.</b>
            </Lead>
            <p className="mt-6 max-w-[64ch] text-[0.8125rem] leading-relaxed text-ink-faint">
              Built from the state’s parcel records for Beverly and from Beverly’s zoning ordinance. While it was being
              written, the ordinance and the state’s websites could not be opened directly, so many details come from search
              summaries of those pages. Those are marked <Unchecked /> until someone checks them against the source. Nonpartisan,
              and not legal advice: for a decision about your property, the ordinance and the City’s Building and Planning
              Departments have the final word.
            </p>

            <div className="mt-10 max-w-xl rounded-lg border border-rule bg-white/70 px-5 py-5">
              <p className="font-display text-xl font-semibold">What zone am I in?</p>
              <div className="mt-3">
                <AddressLookup id="hero-lookup" />
              </div>
            </div>

            <nav aria-label="Contents" className="mt-10">
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink-faint">In this guide</p>
              <ol className="mt-2 grid gap-x-8 gap-y-1 text-[0.9375rem] sm:grid-cols-3">
                {CONTENTS.map(([id, label], i) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-ink-mid hover:text-accent">
                      <span className="mr-1.5 font-semibold tabular-nums text-accent">{i < 7 ? `0${i + 1}` : "·"}</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </header>

          {/* ---- 01 */}
          <section id="basics" className={SECTION}>
            <SectionNum>01 · The basics</SectionNum>
            <H2>Zoning answers three questions about every lot.</H2>
            <P>
              Zoning is a local law that divides a city into districts and sets rules for each one. In Beverly that law is Chapter 300
              of the City Code, the Zoning Ordinance, plus a map that puts every lot in a district.
              <Fn n={1} /> When you apply for a building permit, the Building Department checks your plans against both.
            </P>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card title="What can go here?">
                The use. Houses, apartments, shops, offices, factories. Each district lists what it allows, and anything not on the list
                is not allowed.
              </Card>
              <Card title="How big, and where on the lot?">
                The dimensions. How large a lot must be, how much of it must face the street, how far a building sits from the lot
                lines, and how tall it can rise.
              </Card>
              <Card title="Who has to say yes?">
                The permission. Some projects need only a building permit. Some need a public hearing first. Some need the law itself
                to change.
              </Card>
            </div>

            <H3>Three kinds of yes</H3>
            <P>Most of the confusion about zoning comes from three phrases.</P>
            <dl className="mt-5 max-w-[64ch] space-y-4">
              <div>
                <dt className="font-display text-lg font-semibold">
                  <Term id="by-right">By right</Term>
                </dt>
                <dd className="mt-1 text-[1.0625rem] leading-relaxed">
                  The project meets every rule. It gets a building permit with no hearing and no vote.
                </dd>
              </div>
              <div>
                <dt className="font-display text-lg font-semibold">
                  <Term id="special-permit">Special permit</Term>
                </dt>
                <dd className="mt-1 text-[1.0625rem] leading-relaxed">
                  The ordinance allows it, but only after a public hearing where a board decides whether it fits its surroundings. In
                  Beverly that is usually the Zoning Board of Appeals or the Planning Board, and the board can attach conditions.
                  <Fn n={2} />
                </dd>
              </div>
              <div>
                <dt className="font-display text-lg font-semibold">
                  <Term id="variance">Variance</Term>
                </dt>
                <dd className="mt-1 text-[1.0625rem] leading-relaxed">
                  Permission to break a rule for one lot, because something about that lot, such as its shape or slope, makes the rule
                  a hardship. State law sets the bar high on purpose.
                  <Fn n={3} />
                </dd>
              </div>
            </dl>

            <Callout title="Older buildings get to stay">
              Much of Beverly was built before today’s rules. A building or lot that was legal when it was created can generally
              stay, even if the rules would forbid it now. Planners call it <Term id="nonconforming">nonconforming</Term>; most people
              say grandfathered. About {aboutBelow}{" "}of Beverly’s single-family homes sit on
              lots smaller than their district’s minimum.
              <Fn n={4} />
            </Callout>
          </section>

          {/* ---- 02 */}
          <section id="districts" className={SECTION}>
            <SectionNum>02 · The districts</SectionNum>
            <H2>Eighteen districts, and four-fifths of the land is zoned for one-family homes.</H2>
            <P>
              Beverly’s ordinance divides the city into 18 base districts, each with a short code.
              <Fn n={5} /> The R districts are residential, and the number is the minimum lot size in thousands of square feet: a new
              lot in R-10 must be at least 10,000 square feet, about a quarter acre. RMD, RHD and RSD are written for apartments and
              condos. The C districts are commercial, the I districts industrial, and four special districts cover the hospital, the
              harbor, one waterfront property and city open space.
            </P>

            <div className="mt-10 max-w-3xl">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">Share of Beverly’s land, by kind of district</h3>
                <Confidence level="modeled" short />
              </div>
              <LandShare />
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-faint">
                Land means the lots on the assessor’s map, about {fmt(Math.round(PARCEL_TOTALS.zonedAcres / 10) * 10)} acres.
                Streets, railroad and water are left out. Hover or tab to a row for acres and lot counts.
                <Fn n={6} />
              </p>
            </div>

            <P>
              The one-family districts, {oneFamilyShare} percent of the land, are not one kind of place. They run from two-acre estates
              to quarter-acre lots, and the difference is written into the minimum lot size.
            </P>

            <div className="mt-8 grid items-start gap-6 md:grid-cols-[1fr_1fr]">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">The minimum lot, drawn to scale</h3>
                  <Confidence level="unverified" short />
                </div>
                <div className="mt-3">
                  <LotLadder />
                </div>
              </div>
              <div className="text-[0.9375rem] leading-relaxed text-ink-mid md:pt-10">
                <p>
                  Each square is the smallest lot a new house needs in that district, in square feet, all sharing one corner. The
                  street runs along the bottom.
                </p>
                <p className="mt-3">
                  A square R-90 lot would be 300 feet on a side, about two acres. An R-45 lot, at 45,000 square feet, is close to a
                  football field between the goal lines. An R-6 lot would fit into an R-90 fifteen times.
                  <Fn n={7} />
                </p>
              </div>
            </div>

            <H3 id="explore">Pick a district</H3>
            <P>
              See what the ordinance says about each district next to what the assessor’s records say is there now. If you looked
              up an address above, its district is already open.
            </P>
            <DistrictExplorer viewBox={MINIMAP_VIEWBOX} />

            <H3>Overlays add rules on top</H3>
            <P>
              An <Term id="overlay">overlay district</Term> is a second layer that sits on top of the base districts and adds or
              loosens rules for part of the city. A lot can be in R-10 and the floodplain overlay at the same time. The map on this
              page shows base districts only.
            </P>
            <ul className="mt-5 max-w-[64ch] space-y-3">
              {OVERLAYS.map((o) => (
                <li key={o.name} className="border-t border-rule pt-3 text-[0.9375rem] leading-relaxed">
                  <span className="font-semibold text-ink">{o.name}</span>
                  <span className="text-ink-faint">
                    {" "}
                    · {o.section.startsWith("Art") ? o.section : `§ ${o.section}`}
                  </span>
                  <span className="block text-ink-mid">
                    {o.what}
                    {o.status !== "digest" && <Unchecked />}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ---- 03 */}
          <section id="map" className={SECTION}>
            <SectionNum>03 · The map</SectionNum>
            <H2>Where each kind of district is.</H2>
            <P>
              The large-lot districts take up the east end of the city and much of the north. Quarter-acre neighborhoods cover most of
              the west and the middle. Apartments, shops and the densest housing sit in a narrow band around downtown and the railroad,
              and industrial land runs along the tracks and across the north, near the airport and Route 128.
            </P>
            <FamilyMaps />

            <H3>Find your street</H3>
            <P>
              Search an address, pick a district, or click the map. Zoom in and the district codes appear on each block.
            </P>
            <div className="mt-6">
              <ZoningMap />
            </div>
            <p className="mt-4 max-w-[64ch] text-[0.8125rem] leading-relaxed text-ink-faint">
              Built from the assessor’s records, not the City’s official zoning map, which is filed with the City Clerk. The
              two should agree for nearly every lot. Near a district line, or where an overlay applies, ask the Planning Department.
              <Fn n={6} noId />
            </p>
          </section>

          {/* ---- 04 */}
          <section id="you" className={SECTION}>
            <SectionNum>04 · What it means for you</SectionNum>
            <H2>What your district decides about your house, your taxes and your street.</H2>

            <H3>What you can do with your property</H3>
            <P>
              Your district’s list of uses decides whether you can run a business from home, rent out a second unit or turn a
              house into two apartments. In the one-family districts the answer to the last one is no, with one exception the state
              made.
            </P>
            <P>
              Since February 2, 2025, state law has allowed one <Term id="adu">accessory dwelling unit</Term> on any lot in a
              single-family district in Massachusetts, without a special permit. It can be as large as 900 square feet or half the size
              of the main house, whichever is smaller, and the city cannot require the owner to live there.
              <Fn n={8} /> Beverly adopted its own ADU rules in December 2023 with a 1,000 square foot cap, and its Council and
              Planning Board held a hearing in May 2026 on changes to match the state law.
              <Fn n={9} />
            </P>

            <H3>Adding on, or building new</H3>
            <P>
              The dimensional rules decide how much house fits on a lot, and they explain why so many renovations end up before a
              board. About {aboutBelow}{" "}of Beverly’s single-family homes sit on lots smaller
              than their district now requires.
              <Fn n={4} noId /> Inside the one-family districts, the assessor counts{" "}
              {fmt(G.parcels.oneFamilyMultiUnitBuildings.value)} two-family, three-family and apartment buildings, and{" "}
              {G.parcels.oneFamilyMultiUnitPre1940Pct.value} percent were built before 1940.
              <Fn n={10} /> Districts named for one family still hold a mix of older housing.
            </P>
            <P>
              Being nonconforming does not make a house illegal. It changes what happens when you want to expand it. An addition that
              makes a house less conforming, such as one reaching into a required <Term id="setback">setback</Term>, needs a finding
              from the Zoning Board of Appeals that it will not be substantially more detrimental to the neighborhood.
              <Fn n={3} noId />
            </P>

            <H3>Your taxes</H3>
            <P>
              Zoning does not set your tax rate. What the property is used for does. Beverly taxes homes and businesses at different
              rates: in fiscal 2026, ${G.tax.residentialRate.value.toFixed(2)} per $1,000 of value for homes and $
              {G.tax.commercialRate.value.toFixed(2)} for commercial, industrial and personal property.
              <Fn n={11} /> A house in an industrial district still pays the residential rate. A shop in a residential district pays
              the commercial one.
            </P>
            <P>
              Zoning reaches your bill in two other ways. Assessors value land for what the law lets someone build on it, so a lot that
              can hold three homes is worth more than one that can hold one.
              <Fn n={12} /> And when zoning lets new buildings go up, their taxes arrive as <Term id="new-growth">new growth</Term>, the
              one kind of revenue that lifts the city’s levy limit past Proposition 2½’s 2.5 percent cap without a vote.
              Beverly’s budget leans on it.
              <Fn n={13} />
            </P>

            <H3>Your neighbors, and your say</H3>
            <P>
              When a neighbor asks for a special permit or a variance, owners within 300 feet get a mailed notice of the hearing.
              <Fn n={14} /> Anyone can speak at the hearing or send a letter. Once the board’s decision is filed, anyone aggrieved
              by it has 20 days to appeal to court. Zoning hearings are posted in the City’s agenda center, and the{" "}
              <A href="/beverly/digest">Beverly Meeting Digest</A> lists them each week.
            </P>

            <H3>Rules that are not zoning</H3>
            <P>
              Zoning is one approval among several. Work near wetlands needs the Conservation Commission, which applies the state
              Wetlands Protection Act. Changes in a local historic district go through the Historic District Commission. Waterfront
              projects can need a state license, and every building has to meet the state building code. Any of them can stop a
              project zoning allows.
              <Fn n={15} />
            </P>
          </section>

          {/* ---- 05 */}
          <section id="change" className={SECTION}>
            <SectionNum>05 · How the rules change</SectionNum>
            <H2>Two ways zoning bends: change the law, or ask for an exception.</H2>
            <P>
              Changing the ordinance changes the rules for every lot it covers. Only the City Council can do it, after two public
              hearings. An exception changes nothing for anyone else. A board grants it for one property after its own hearing.
            </P>
            <ProcessPaths />

            <H3>How long it takes</H3>
            <P>
              The legal clocks set a floor, not a typical pace. Order #250, the proposed pause on data centers, was filed on October 5,
              2026. The Council’s hearing is November 9, five weeks later, and the vote comes after the Planning Board weighs in.
              <Fn n={16} /> The MBTA Communities zoning, a far larger change, was adopted on November 12, 2024, about five weeks after a
              joint hearing of the Council and the Planning Board.
              <Fn n={17} />
            </P>

            <H3>Who decides what</H3>
            <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Actor name="City Council">
                Nine members. Adopts and amends the ordinance after hearings, with {G.council.twoThirds.value} votes needed for most
                changes.
              </Actor>
              <Actor name="Planning Board">
                Holds the other hearing on every change and recommends. Reviews the site plans of larger projects and grants some special
                permits. Meets Tuesday evenings, and its meetings are not filmed.
              </Actor>
              <Actor name="Zoning Board of Appeals">
                Grants variances, most special permits and findings for older houses, and hears appeals of Building Department
                decisions. Meets Wednesday evenings.
              </Actor>
              <Actor name="Building Department">Checks every building permit against zoning and enforces it.</Actor>
              <Actor name="Planning Department">
                City staff who draft changes, run studies and advise the boards. Darlene Wynne is the Planning Director.
              </Actor>
              <Actor name="Mayor">Proposes many changes and signs or vetoes what the Council passes.</Actor>
              <Actor name="Other boards">
                The Conservation Commission, Historic District Commission and Design Review Board review parts of projects, and the
                Parking and Traffic Commission advises on parking requests.
              </Actor>
              <Actor name="You">
                Speak at hearings, write to the boards and your councilor, and appeal decisions that harm you. Owners of a fifth of the
                land affected by a change can file a protest that raises the vote it needs.
                <Unchecked />
              </Actor>
            </div>
          </section>

          {/* ---- 06 */}
          <section id="state" className={SECTION}>
            <SectionNum>06 · The state’s role</SectionNum>
            <H2>Beverly writes its zoning inside rules the state sets.</H2>
            <P>
              Cities in Massachusetts zone because the state lets them, under the Zoning Act, Chapter 40A of the General Laws. The state
              writes the procedure in section 05, protects some uses from local limits, has started to require some kinds of zoning, and
              gives developers a way around local rules where a city has too little affordable housing. Its courts hear the appeals.
            </P>

            <H3>Uses the state protects</H3>
            <P>
              Some uses cannot be banned anywhere: religious uses, nonprofit schools and colleges, child care centers, farming on larger
              parcels, solar panels, and since 2025 one accessory apartment per house. A city can apply only reasonable rules on their
              size, height, setbacks and parking. The best known of these protections, the Dover Amendment, is why a nonprofit college
              such as Endicott can put an educational building in a residential district. Beverly’s ordinance allows all of these
              protected uses in every district.
              <Fn n={18} />
            </P>

            <H3>Zoning the state requires</H3>
            <P>
              The <Term id="mbta">MBTA Communities law</Term> requires the 177 cities and towns served by the MBTA to zone at least one
              district where apartments are allowed by right. For Beverly, a commuter rail community, that meant at least{" "}
              {G.mbta.minAcres.value} acres near a station, at least 15 homes per acre, and room for {fmt(G.mbta.requiredUnits.value)}{" "}
              homes.
              <Fn n={19} /> The City Council adopted about {G.mbta.zonedAcres.value} acres around Beverly Depot on November 12, 2024,
              before the deadline, and the state confirmed compliance in April 2025.
              <Fn n={20} />
            </P>
            <P>
              The district is zoned for {fmt(G.mbta.zonedUnits.value)} homes, fewer than {fmt(G.mbta.requiredUnits.value)} because the
              state lowers the target for districts that mix homes with commercial space. The City measures its district against{" "}
              {fmt(G.mbta.requiredAfterOffset.value)}.
              <Fn n={21} /> Zoned capacity is permission, not construction. Owners and the market decide how much of it gets built.
            </P>
            <P>
              Communities that refuse lose some state grants, and the Attorney General can sue. The state’s highest court upheld
              the law in January 2025, in a case the Attorney General brought against Milton.
              <Fn n={22} />
            </P>

            <H3>The state’s workaround for affordable housing</H3>
            <P>
              Under <Term id="40b">Chapter 40B</Term>, a developer who sets aside part of a project as affordable housing can ask the
              Zoning Board of Appeals for a single permit that overrides local zoning, in any community where less than 10 percent of
              homes count as affordable on the state’s list. Beverly is at {G.shi.percent.value} percent, {fmt(G.shi.units.value)}{" "}
              of {fmt(G.shi.yearRoundUnits.value)} homes.
              <Fn n={23} /> Above that line, a board’s decision to turn down a 40B project is treated as consistent with local
              needs, and it generally stands.
            </P>

            <H3>Courts, regional planners and the federal government</H3>
            <P>
              Appeals of board decisions go to state court, usually the Land Court or the Superior Court.
              <Fn n={14} noId /> The Metropolitan Area Planning Council, the regional planning agency for Greater Boston, gets notice of
              zoning changes and helps cities draft them.
              <Unchecked /> Federal flood maps decide where Beverly’s floodplain rules apply.
            </P>

            <H3>What the state is doing now</H3>
            <div className="mt-5 max-w-[64ch] space-y-5">
              <div className="border-l-[3px] border-accent/60 pl-4">
                <p className="font-semibold">Data centers</p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-mid">
                  On September 8, 2026, the Governor signed Executive Order 658. It holds state permits for data centers drawing more
                  than 25 megawatts until the developer signs a community benefits agreement and meets the state’s energy
                  expectations. It does not change local zoning. Beverly’s proposed pause uses zoning, which reaches data centers
                  of any size.
                  <Fn n={24} />
                </p>
              </div>
              <div className="border-l-[3px] border-debt/60 pl-4">
                <p className="font-semibold">
                  Question 7 on the November 3 ballot
                  <Unchecked />
                </p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-mid">
                  A statewide question on starter homes. As its campaign describes it, it would bar cities and towns from requiring
                  single-family lots larger than 5,000 square feet or frontage longer than 50 feet. Every one of Beverly’s
                  one-family districts requires more than 5,000 square feet today. Read the official summary in the state’s voter
                  guide before relying on this description.
                  <Fn n={25} />
                </p>
              </div>
            </div>
          </section>

          {/* ---- 07 */}
          <section id="compare" className={SECTION}>
            <SectionNum>07 · How Beverly compares</SectionNum>
            <H2>Neighbors got the same assignment from the state and chose differently.</H2>
            <P>
              The MBTA Communities law handed every city and town around Beverly the same task. What each did with it says more about
              local zoning politics than any ranking could.
            </P>

            {/* Phones get one card per community; the table needs room for its three columns. */}
            <ul className="mt-8 space-y-3 sm:hidden">
              {G.compare.map((c) => (
                <li
                  key={c.place}
                  className={`rounded-lg border border-rule px-4 py-3 ${c.place === "Beverly" ? "bg-accent-glow" : "bg-white/60"}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold">
                      {c.place} <span className="text-[0.75rem] font-normal text-ink-faint">{c.kind}</span>
                    </p>
                    <p className="text-[0.8125rem] tabular-nums text-ink-mid">
                      {c.required ? `${fmt(c.required)} homes required` : "Requirement not found"}
                    </p>
                  </div>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-mid">
                    {c.what}
                    {c.status !== "confirmed" && <Unchecked />}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-8 hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[560px] border-collapse text-left text-[0.9375rem]">
                <caption className="sr-only">How Beverly and other Massachusetts communities responded to the MBTA Communities law</caption>
                <thead>
                  <tr className="border-b-2 border-ink/20 text-[0.75rem] uppercase tracking-[0.08em] text-ink-faint">
                    <th scope="col" className="py-2 pr-4 font-semibold">Community</th>
                    <th scope="col" className="py-2 pr-4 text-right font-semibold">Homes required</th>
                    <th scope="col" className="py-2 font-semibold">What happened</th>
                  </tr>
                </thead>
                <tbody>
                  {G.compare.map((c) => (
                    <tr key={c.place} className={`border-b border-rule align-top ${c.place === "Beverly" ? "bg-accent-glow" : ""}`}>
                      <th scope="row" className="py-3 pr-4 font-semibold">
                        {c.place}
                        <span className="block text-[0.75rem] font-normal text-ink-faint">{c.kind}</span>
                      </th>
                      <td className="py-3 pr-4 text-right tabular-nums">{c.required ? fmt(c.required) : "Not found"}</td>
                      <td className="py-3 leading-relaxed text-ink-mid">
                        {c.what}
                        {c.status !== "confirmed" && <Unchecked />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[0.75rem] text-ink-faint">
              Homes required: the minimum multifamily capacity the state set for each community. Beverly’s requirement is
              unverified; the rest of its row is confirmed.
            </p>

            <H3>What the rest of Massachusetts has learned</H3>
            <ol className="mt-5 max-w-[64ch] list-decimal space-y-4 pl-5 text-[1.0625rem] leading-relaxed marker:font-semibold marker:text-accent">
              <li>
                <b>Zoning for housing is not the same as getting it.</b> Peabody drew its districts over complexes that already held
                about 2,200 homes, leaving room for roughly 140 more. Salem met the law largely with districts it already had.
                <Fn n={26} />
              </li>
              <li>
                <b>The size and place of a district decide what happens.</b> Lexington zoned far beyond its minimum and drew about 1,100
                homes’ worth of proposals, then cut the district back in 2025. A 312-unit project approved under the larger
                district is under construction.
                <Fn n={27} />
              </li>
              <li>
                <b>Saying no did not last.</b> Milton’s voters overturned its plan in 2024 and Marblehead’s in 2025. Both
                towns were found out of compliance, and both adopted plans afterward.
                <Fn n={28} />
              </li>
              <li>
                <b>Parking rules are a lever a city controls.</b> Salem stopped requiring parking for new buildings of three or more
                homes in 2025. Beverly requires 2 spaces per home in most districts, and the {G.enon.units.value} apartments proposed on
                Enon Street need a special permit to build {G.enon.parkingProposed.value} spaces where zoning requires{" "}
                {G.enon.parkingRequired.value}.
                <Fn n={29} />
              </li>
              <li>
                <b>How projects get approved matters as much as what is allowed.</b> A 2019 study of 100 communities around Boston found
                that only 14 percent of new multifamily homes were allowed by right; 57 percent needed a special permit.
                <Fn n={30} /> Every special permit is a hearing, a vote and a chance to appeal.
              </li>
              <li>
                <b>Vote thresholds change outcomes.</b> Salem’s accessory apartment rule fell short under the old two-thirds
                requirement and passed 7 to 4 in May 2021, after the Housing Choice Act lowered the bar to a majority.
                <Fn n={31} />
              </li>
            </ol>
            <P>
              Beverly sits near the middle. It complied on time and zoned close to its target. In 2023, after a wave of downtown
              apartments drew pushback, it lowered building heights on Rantoul and Cabot Streets.
              <Fn n={32} /> Lower ceilings mean fewer homes and less new tax base than the old rules would have allowed.
            </P>
          </section>

          {/* ---- glossary */}
          <section id="glossary" className={SECTION}>
            <SectionNum>Glossary</SectionNum>
            <H2>Words you will hear at a hearing.</H2>
            <dl className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
              {GLOSSARY.map(([id, term, def]) => (
                <div key={id} id={`g-${id}`} className="scroll-mt-20 border-t border-rule pt-3">
                  <dt className="font-display text-base font-semibold">{term}</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-mid">{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ---- notes */}
          <section id="notes" className="py-14 scroll-mt-16">
            <SectionNum>Notes and sources</SectionNum>
            <p className="max-w-[64ch] text-[0.9375rem] leading-relaxed text-ink-mid">
              Every figure carries a level. Confirmed: from a primary source already checked, including documents the Beverly Meeting
              Digest reported. Modeled: computed from the state’s parcel data, method stated. Unverified: from a search summary of
              the cited page, not yet read in full.
            </p>
            <ol className="mt-6 space-y-4">
              {NOTES.map((n, i) => (
                <li
                  key={i}
                  id={`fn-${i + 1}`}
                  className="grid scroll-mt-20 grid-cols-[2rem_1fr] gap-x-2 text-[0.875rem] leading-relaxed text-ink-mid"
                >
                  <a href={`#fnref-${i + 1}`} className="font-semibold text-accent" aria-label={`Back to note ${i + 1} in the text`}>
                    {i + 1}.
                  </a>
                  <div>
                    {n.body} <Confidence level={n.level} short />
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </ZoningProvider>
    </div>
  );
}
