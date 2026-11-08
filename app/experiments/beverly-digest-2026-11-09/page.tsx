import type { ReactNode } from "react";
import PageTracking from "@/components/PageTracking";
import AddToCalendar, { type CalendarEvent } from "@/components/beverly/AddToCalendar";

const Src = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className="rlink"
    data-track="source_opened"
    data-placement="sources-row"
  >
    {children}
  </a>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">
    {children}
  </span>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-1 max-w-[63ch] font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
    {children}
  </h2>
);

/** Which meeting an item came from. Thematic items can name more than one. */
const From = ({ children }: { children: ReactNode }) => (
  <p className="mt-2.5 max-w-[63ch] text-[0.9rem] leading-relaxed text-ink-mid">{children}</p>
);



const Refs = ({ sources, more }: { sources: ReactNode; more?: ReactNode }) => (
  <div className="mt-5 grid max-w-[63ch] gap-1.5 border-t border-rule pt-3">
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.93rem]">
      <span className="min-w-[5.5rem] text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
        Go deeper
      </span>
      {sources}
    </p>
    {more && (
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.93rem]">
        <span className="min-w-[5.5rem] text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
          Read more
        </span>
        {more}
      </p>
    )}
  </div>
);

const SECTION = "mt-14 scroll-mt-24";
const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";
const LIST = "mt-4 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]";

/**
 * A pointer back to the issue where a story was told in full. Follow-ups stay short by
 * linking to the earlier item instead of retelling it.
 */
const Earlier = ({ issue, slug, id, label }: { issue: number; slug: string; id: string; label: string }) => (
  <a
    href={`/beverly/digest/${slug}#${id}`}
    className="rlink"
    data-track="read_more_clicked"
    data-placement="earlier-issue"
  >
    Issue {issue}: {label}
  </a>
);

/* ---------------- sources ---------------- */

/** A picture with a caption. Tapping it opens the full-size file. */
const Figure = ({ src, alt, w, h, children }: { src: string; alt: string; w: number; h: number; children: ReactNode }) => (
  <figure className="mt-6 max-w-[63ch]">
    <a href={src} target="_blank" rel="noopener" data-track="figure_opened">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={w} height={h} loading="lazy" className="h-auto w-full rounded border border-rule" />
    </a>
    <figcaption className="mt-2 text-[0.85rem] leading-snug text-ink-faint">{children}</figcaption>
  </figure>
);
const FIGS = "/beverly/digest/2026-11-09";

const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DOC = "https://www.beverlyma.gov/DocumentCenter/View";
const COUNCIL_1109 = `${AGENDA}/ViewFile/Agenda/_11092026-2991`;
const AIRPORT_1109 = `${AGENDA}/ViewFile/Agenda/_11092026-2986`;
const DRC_1112 = `${AGENDA}/ViewFile/Agenda/_11122026-2992`;
const PARKS_1112 = `${AGENDA}/ViewFile/Agenda/_11122026-2990`;
const CLERK_1116 = `${AGENDA}/ViewFile/Agenda/_11162026-2993`;
const CPC_1119 = `${AGENDA}/ViewFile/Agenda/_11192026-2985`;
const SLIDES =
  "https://www.flipsnack.com/77BFA7F7C6F/beverly_boulder_lane_presentation_10-12-26-1";
const SALEM_NEWS_BOULDER =
  "https://www.salemnews.com/news/centerville-residents-speak-out-against-200-unit-development/article_cb13dccb-82d1-4c54-a412-7fe620f099d7.html";
const ZBA_RULES = "https://ecode360.com/29285066";
const WETLAND_RULES = `${DOC}/856/Chapter-565-Wetlands-Protection-Regulations-PDF`;
const VERNAL_POOLS = "https://www.mass.gov/info-details/massgis-data-nhesp-certified-vernal-pools";
const ZONING_DEFS = "https://ecode360.com/29283349";
const MGL_40A = "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A";
const MGL_40A_10 = `${MGL_40A}/Section10`;
const MGL_40A_15 = `${MGL_40A}/Section15`;
const MGL_40A_17 = `${MGL_40A}/Section17`;
const RESULTS = `${DOC}/7770/November-3-2026-State-Election-Unofficial-Result-PDF`;
const NBC_RESULTS =
  "https://www.nbcboston.com/news/local/massachusetts-election-results-ballot-questions-2026/4043419/";
const CBS_Q7 =
  "https://www.cbsnews.com/boston/news/masschusetts-ballot-question-7-results/";
const DOR_LOCAL_TAX =
  "https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=LocalOptions.Local_Options_Tax";
const VOTER_GUIDE =
  "https://www.sec.state.ma.us/divisions/elections/download/information-for-voters/archive/IFV_2026%20English.pdf";
const LOCAL_NEWS_AYLES = "https://thelocalnews.news/2026/10/22/ipswich-hires-first-deputy-town-manager/";
const FINANCE_JOB = `${DOC}/7752`;

const contents: [string, string][] = [
  ["boulder", "Boulder Lane: the developer's plan is 200 units, and it would need a use variance"],
  ["election", "How Beverly voted on the three ballot questions closest to home"],
  ["ayles", "The city's finance director leaves for Ipswich"],
  ["council", "Tonight at the Council: the data center hearing and a recycling drop-off"],
  ["zba", "How it works: special permits and variances"],
  ["ahead", "Coming up, through November 23"],
  ["corrections", "Correction"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Nov 9",
    what: "Airport Commission",
    detail:
      "Tonight, 6:00pm at the airport, 50 L.P. Henderson Rd, and online. A report on noise complaints since October 13, updates on the Airport Road parcel and tree removal on airport land, and a proposed mission statement for a vote.",
    cal: {
      id: "airport-2026-11-09",
      title: "Beverly Airport Commission",
      start: "2026-11-09T23:00:00Z",
      end: "2026-11-10T00:30:00Z",
      location: "Beverly Regional Airport, 50 L.P. Henderson Rd, Beverly, MA",
    },
  },
  {
    date: "Nov 9",
    what: "City Council: data center hearing",
    detail:
      "Tonight, 7:00pm in the Middle School library, 502 Cabot St. The data center hearing is set for 7:30pm.",
    cal: {
      id: "council-2026-11-09",
      title: "Beverly City Council: data center pause hearing",
      start: "2026-11-10T00:00:00Z",
      end: "2026-11-10T02:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 11",
    what: "Veterans Day",
    detail: "Trash and recycling run one day late for the rest of the week.",
  },
  {
    date: "Nov 12",
    what: "Deficit Reduction Committee",
    detail:
      "6:30pm, online (Google Meet). On the agenda: questions from the October 20 presentation, a city finance and forecast update, and next steps for a resident survey or focus groups.",
    cal: {
      id: "drc-2026-11-12",
      title: "Beverly Deficit Reduction Committee (online)",
      start: "2026-11-12T23:30:00Z",
      end: "2026-11-13T01:00:00Z",
      location: "Online (Google Meet)",
    },
  },
  {
    date: "Nov 12",
    what: "Parks and Recreation Commission",
    detail:
      "7:00pm at the Senior Center, 90 Colon St, moved from November 5. Updates on Community Preservation projects and this round's applications.",
    cal: {
      id: "parks-2026-11-12",
      title: "Beverly Parks and Recreation Commission",
      start: "2026-11-13T00:00:00Z",
      end: "2026-11-13T01:30:00Z",
      location: "Beverly Senior Center, 90 Colon St, Beverly, MA",
    },
  },
  {
    date: "Nov 16",
    what: "Post-election tabulation",
    detail: "8:00am at the City Clerk's office, temporary City Hall, 175 Cabot St.",
  },
  {
    date: "Mid-Nov",
    what: "The city's Flock contract expires",
    detail: "Per the Mayor on October 19. No renewal decision had been announced.",
  },
  {
    date: "Nov 17",
    what: "Planning Board: 37 Enon St and Waring School",
    detail:
      "Expected at 7:00pm in the Middle School library; the agenda is not posted yet. The 37 Enon St hearing continues with the traffic study, then a public hearing on Waring School's plan for 38 Standley St.",
  },
  {
    date: "Nov 18",
    what: "School Committee: policy votes",
    detail:
      "Subcommittees at 6:00pm, then the Committee of the Whole at 7:15pm, in the Middle School library. Second reading of the policies on powered e-bikes and scooters and on school trips abroad. The Clean Energy Advisory Committee also meets this day.",
    cal: {
      id: "school-committee-2026-11-18",
      title: "Beverly School Committee",
      start: "2026-11-18T23:00:00Z",
      end: "2026-11-19T02:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 19",
    what: "Community Preservation Committee",
    detail:
      "6:00pm in the Police Station community room, 175 Elliott St. This round's pre-applications, and updates on Lynch Park and the Central Cemetery tomb house.",
    cal: {
      id: "cpc-2026-11-19",
      title: "Beverly Community Preservation Committee",
      start: "2026-11-19T23:00:00Z",
      end: "2026-11-20T01:00:00Z",
      location: "Beverly Police Station, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Nov 23",
    what: "City Council: National Grid hearings",
    detail:
      "Public hearings on National Grid's petitions for underground lines on Woodbury Street, 7:30pm, and Dane Street, 7:40pm.",
    cal: {
      id: "council-2026-11-23",
      title: "Beverly City Council: National Grid hearings",
      start: "2026-11-24T00:30:00Z",
      end: "2026-11-24T01:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
];

/** The nine questions, Beverly next to the state. Yes as a share of yes plus no votes. */
type Q = { n: number; what: string; bev: number; state: number; result: string };
const questions: Q[] = [
  { n: 1, what: "Public records law covers the Legislature and Governor", bev: 87.3, state: 85.9, result: "Passed" },
  { n: 2, what: "Public defender staff may unionize", bev: 65.7, state: 64.2, result: "Passed" },
  { n: 3, what: "Top-two primaries for state offices", bev: 38.5, state: 38.9, result: "Failed" },
  { n: 4, what: "Election Day voter registration", bev: 59.1, state: 56.4, result: "Passed" },
  { n: 5, what: "State revenue limit and rebate", bev: 44.8, state: 47.9, result: "Failed" },
  { n: 6, what: "Nature for All conservation fund", bev: 65.0, state: 60.9, result: "Passed" },
  { n: 7, what: "Single-family homes on smaller lots", bev: 52.5, state: 49.4, result: "Failed" },
  { n: 8, what: "Repeal retail marijuana sales", bev: 21.5, state: 24.4, result: "Failed" },
  { n: 9, what: "Keep the 2024 gun law", bev: 75.0, state: 67.0, result: "Passed" },
];
const qn = (n: number) => questions.find((q) => q.n === n)!;

/** Beverly's yes share next to the state's, on a 0 to 100 track with a tick at 50%. */
const BEV = "#2d6a4f";
const STATE = "#8a8174";
const Bars = ({ q, compact }: { q: Q; compact?: boolean }) => (
  <div className={compact ? "mt-1.5 grid gap-1" : "mt-3 grid gap-1.5"}>
    {(
      [
        ["Beverly", q.bev, BEV],
        ["State", q.state, STATE],
      ] as const
    ).map(([who, v, c]) => (
      <div
        key={who}
        title={`${who}: ${v.toFixed(1)}% yes`}
        className="grid grid-cols-[4rem_1fr_3.3rem] items-center gap-2 text-[0.85rem] tabular-nums"
      >
        <span className="text-ink-mid">{who}</span>
        <span className={`relative rounded-sm bg-bg-card ${compact ? "h-2.5" : "h-3.5"}`}>
          <span
            className="absolute inset-y-0 left-0 rounded-r-[4px]"
            style={{ width: `${v}%`, background: c }}
          />
          <span aria-hidden className="absolute -inset-y-1 left-1/2 w-px bg-ink/45" />
        </span>
        <span className="text-right font-semibold">{v.toFixed(1)}%</span>
      </div>
    ))}
  </div>
);

/** One ballot question: what it was, how it went, the bars, and what it means here. */
const QCard = ({ q, outcome, children }: { q: Q; outcome: string; children: ReactNode }) => (
  <div className="mt-5 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-4">
    <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
      Question {q.n}
    </p>
    <h3 className="mt-0.5 font-display text-lg font-bold leading-snug">{q.what}</h3>
    <p className="mt-1 text-[0.95rem] font-semibold text-ink-mid">{outcome}</p>
    <Bars q={q} />
    <p className="mt-1.5 text-[0.78rem] text-ink-faint">Share voting yes. The line marks 50%.</p>
    <p className="mt-3 text-[1rem] leading-[1.65]">{children}</p>
  </div>
);

/* ---------------- page ---------------- */

export default function DigestIssue9() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 9. Set to
          "2026-11-09" when publishing. */}
      <PageTracking surface="digest" issue="2026-11-09-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 9 &middot; Week of November 9
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering November 2 to November 8, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The developer behind the Boulder Lane proposal showed a 200-unit plan, built in a
            band between wetlands, and it would need a zoning variance. Beverly voted with the
            state on eight of nine ballot questions. The finance director leaves for Ipswich, and
            the Council holds its data center hearing tonight.
          </p>
        </header>

        <nav aria-label="In this issue" className="mt-8 border-l-2 border-accent pl-5">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            In this issue
          </h2>
          <ol className="mt-2.5 space-y-1.5">
            {contents.map(([id, label], i) => (
              <li key={id} className="text-[0.97rem] leading-snug">
                <span className="mr-2 tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={`#${id}`} className="font-medium text-accent hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 className="mt-14 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          What happened{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            November 2 to November 8
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="boulder"
          data-dek={"Waverly Development's slides for the November 5 community meeting show 200 units off Boulder Lane: 40 townhomes for buyers 55 and older and a 160-unit assisted living and memory care building, in a band between wetlands. The slides list four approvals it would need, starting with a Zoning Board use variance. Nothing has been filed."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Housing</Eyebrow>
          <H2>Boulder Lane: the developer&apos;s plan is 200 units, and it would need a use variance</H2>
          <From>
            The developer&apos;s slides for the Mayor&apos;s community meeting &middot; Thursday,
            November 5 &middot; Centerville Elementary
          </From>
          <p className={BODY}>
            Waverly Development, the developer behind the 55-and-older proposal off Boulder Lane in
            Centerville, in Ward 6, showed residents a plan for 200 units on the 26-acre parcel at
            128 Boulder Lane, in its{" "}
            <Src href={SLIDES}>slides for the Mayor&apos;s November 5 community meeting</Src>.
            That is fewer than the 250 to 300 units first reported. Nothing has been filed with the
            city.
          </p>
          <p className={BODY}>
            For a map of where the parcel sits and what its zoning allows, see{" "}
            <Earlier issue={8} slug="2026-11-02" id="boulder" label="the land and its zoning" />.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What the plan shows
          </h3>
          <ul className={LIST}>
            <li>
              <b>40 townhomes</b>{" "}for buyers 55 and older, 2&frac12; stories, on the side
              nearest Kennel Hill Drive.
            </li>
            <li>
              <b>A 160-unit assisted living and memory care building,</b>{" "}four stories, at the
              Route 128 end.
            </li>
            <li>
              <b>268 parking spaces and one driveway,</b>{" "}out to Boulder Lane by Route 128. No
              road to Kennel Hill Drive.
            </li>
          </ul>
          <Figure
            src={`${FIGS}/boulder-plan-labeled.svg`}
            alt="The developer's October site plan for 128 Boulder Lane, with our labels. A pink line encloses everything the plan builds, in a band on the east side of the site: 40 townhomes at the north end, nearest Kennel Hill Drive, then the assisted living and memory care building and its parking toward Route 128, and a driveway out to Boulder Lane at the southeast corner. West of the line are woods and wetlands, including two ponds that match the state-certified vernal pools."
            w={915}
            h={558}
          >
            The developer&apos;s site plan, from{" "}
            <a href={SLIDES} className="underline">
              its slides
            </a>
            , with our labels. The plan marks the pink line as its 100-foot wetland limit. The two
            ponds sit where{" "}
            <a href={VERNAL_POOLS} className="underline">
              the state lists
            </a>{" "}
            two vernal pools. Tap to enlarge.
          </Figure>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Why the buildings sit where they do
          </h3>
          <p className={BODY}>
            Wetlands run through the west and middle of the parcel and along its east edge, by
            the Wenham line. Beverly&apos;s <Src href={WETLAND_RULES}>wetland rules</Src>{" "}keep
            most buildings at least 50 feet from a wetland. Near a vernal pool the limit is 100
            feet, and even clearing land is not allowed.
          </p>
          <p className={BODY}>
            A vernal pool is a small pond that dries out in summer, where salamanders and wood
            frogs breed.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What it would need
          </h3>
          <p className={BODY}>
            The slides list four approvals, each from a city board after a public hearing.
          </p>
          <ol className="mt-4 max-w-[63ch] list-decimal space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>A use variance from the Zoning Board of Appeals</b>{" "}for the assisted living
              building. The land is zoned for offices, research and light industry, and that zoning
              does not allow assisted living.
            </li>
            <li>
              <b>A special permit from the Zoning Board</b>{" "}for the townhomes, as what the
              zoning calls &ldquo;subsidized elderly housing.&rdquo; Its{" "}
              <Src href={ZONING_DEFS}>definition</Src>{" "}requires at least 15% of the units to be
              permanently affordable. The slides say &ldquo;a share of homes&rdquo; would be.
            </li>
            <li>
              <b>An order of conditions from the Conservation Commission</b>{" "}for work near the
              wetlands.
            </li>
            <li>
              <b>Site plan review by the Planning Board.</b>
            </li>
          </ol>
          <p className={BODY}>
            A use variance lets an owner use land in a way its zoning does not allow. To grant one,
            the Zoning Board has to find that something about this particular piece of land, such
            as its shape or slopes, makes it a hardship to use as zoned. Four of the board&apos;s
            five members must agree <Src href={ZBA_RULES}>(zoning &sect; 300-92)</Src>. More in{" "}
            <a href="#zba" className="underline">
              How it works
            </a>
            , below.
          </p>
          <p className={BODY}>
            The slides say an earlier plan, from January, fit the zoning: two five-story buildings
            closer to the neighborhood. They say this one was redesigned &ldquo;based on feedback
            from the City.&rdquo;
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Where it stands
          </h3>
          <p className={BODY}>
            Residents at the meeting opposed the project,{" "}
            <Src href={SALEM_NEWS_BOULDER}>The Salem News reported</Src>. Nothing has been filed
            yet. If plans are filed, each approval above comes with a public hearing, where
            residents can speak.
          </p>
          <Refs
            sources={
              <>
                <Src href={SLIDES}>The developer&apos;s slides</Src>
                <Src href={WETLAND_RULES}>Wetland rules (Chapter 565)</Src>
                <Src href={ZBA_RULES}>Zoning Board rules (&sect;&sect; 300-89 to 300-95)</Src>
                <Src href={SALEM_NEWS_BOULDER}>The Salem News, Nov 6</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="election"
          data-dek={"Beverly voted with the state on eight of the nine ballot questions. Of the three that touch the city most directly, Question 7, on smaller lots for single-family homes, failed statewide, though most Beverly voters supported it; the marijuana repeal failed, keeping the city's local tax; and the Nature for All fund passed. About 19,200 residents voted, 62% of those registered."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Election</Eyebrow>
          <H2>How Beverly voted on the three ballot questions closest to home</H2>
          <From>The city&apos;s unofficial results and the Associated Press count</From>
          <p className={BODY}>
            About 19,200 residents voted on November 3, 62% of those registered, the most in a
            midterm here since at least 2010 <Src href={RESULTS}>(unofficial results)</Src>.
            Beverly voted with the state on eight of the nine questions. These three touch the city
            most directly. All nine are below.
          </p>

          <QCard q={qn(7)} outcome="Failed statewide. Most Beverly voters supported it, the one question where Beverly and the state split.">
            Nothing changes in Beverly: its zoning stays as it is. The question would have let
            someone build a single-family home on any lot of at least 5,000 square feet with 50 feet
            along the street, as long as the lot connects to public water and sewer lines rather
            than a well and septic system. City zoning could not have required a bigger lot{" "}
            <Src href={VOTER_GUIDE}>(voter guide)</Src>. The Associated Press called it Friday
            with 99% counted, <Src href={CBS_Q7}>CBS Boston reported</Src>.
          </QCard>
          <QCard q={qn(8)} outcome="Failed statewide, and most Beverly voters opposed it too.">
            Nothing changes in Beverly. Marijuana shops stay open, and so does the city&apos;s 3%
            local tax on their sales, in effect since July 2023{" "}
            <Src href={DOR_LOCAL_TAX}>(state tax records)</Src>. A yes vote would have ended retail
            sales, and the taxes on them, from 2028 <Src href={VOTER_GUIDE}>(voter guide)</Src>.
          </QCard>
          <QCard q={qn(6)} outcome="Passed statewide, and most Beverly voters supported it.">
            From July 2027, part of the state sales tax on sporting goods, recreational vehicles
            and golf goes to a fund for conservation and parks, set each year in the state budget.
            Cities and towns can apply for the money.
          </QCard>

          <details className="mt-5 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-3">
            <summary className="cursor-pointer text-[0.95rem] font-semibold text-accent">
              More: all nine questions, Beverly next to the state
            </summary>
            <div className="mt-2 divide-y divide-rule">
              {questions.map((q) => (
                <div key={q.n} className="py-3">
                  <p className="flex items-baseline justify-between gap-3 text-[0.93rem]">
                    <span className="font-semibold">
                      {q.n}. {q.what}
                    </span>
                    <span className="shrink-0 text-[0.82rem] text-ink-faint">{q.result} statewide</span>
                  </p>
                  <Bars q={q} compact />
                </div>
              ))}
            </div>
            <p className="mt-2 text-[0.83rem] leading-snug text-ink-faint">
              Share voting yes. The line marks 50%. State figures are from the Associated Press
              count.
            </p>
          </details>
          <p className={BODY}>
            Every figure here is unofficial. The City Clerk&apos;s post-election tabulation is
            November 16, and the state certifies results in early December.
          </p>
          <Refs
            sources={
              <>
                <Src href={RESULTS}>Beverly&apos;s unofficial results</Src>
                <Src href={VOTER_GUIDE}>The state voter guide</Src>
                <Src href={DOR_LOCAL_TAX}>Local tax rates (state Revenue Department)</Src>
                <Src href={NBC_RESULTS}>Statewide results (NBC Boston)</Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="ayles"
          data-dek={"Bryant Ayles, Beverly's finance director and treasurer since 2014, starts November 16 as Ipswich's deputy town manager and finance director. The Council takes up a resolution honoring him tonight, and the city has posted the job."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; City Hall</Eyebrow>
          <H2>The city&apos;s finance director leaves for Ipswich</H2>
          <From>
            The Local News, and tonight&apos;s Council agenda &middot; Order #283
          </From>
          <p className={BODY}>
            Bryant Ayles, Beverly&apos;s Finance Director and Treasurer since January 2014, starts
            November 16 as Ipswich&apos;s first deputy town manager and finance director,{" "}
            <Src href={LOCAL_NEWS_AYLES}>The Local News reported</Src>.
          </p>
          <p className={BODY}>
            The Council takes up a resolution honoring him tonight. It credits him with the
            borrowing plan that paid for the Middle School, the police station, City Hall and the
            McPherson Youth Center, and with two increases in the city&apos;s bond rating{" "}
            <Src href={COUNCIL_1109}>(Council agenda)</Src>.
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}The city has posted the job, as Director of Municipal Finance, at
            $160,000 to $180,000 a year <Src href={FINANCE_JOB}>(job posting)</Src>. The Deficit
            Reduction Committee gets a city finance update on November 12.
          </p>
          <Refs
            sources={
              <>
                <Src href={COUNCIL_1109}>Council agenda and packet, Nov 9</Src>
              </>
            }
            more={
              <>
                <Earlier issue={2} slug="2026-09-21" id="pension" label="the pension payment" />
                <Earlier issue={2} slug="2026-09-21" id="insurance" label="the health insurance split" />
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="council"
          data-dek={"The Council holds its hearing on the data center pause tonight at 7:30pm. Also on the agenda: a $100,000 state grant to turn the city's yard waste site into a drop-off for hard-to-recycle items, and an update on the Varian site cleanup."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; City Council</Eyebrow>
          <H2>Tonight at the Council: the data center hearing and a recycling drop-off</H2>
          <From>City Council &middot; Monday, November 9 &middot; 7:00pm &middot; Middle School library</From>
          <ul className={LIST}>
            <li>
              <b>The data center pause, 7:30pm.</b>{" "}The public hearing on the Mayor&apos;s
              proposed pause on data center applications (Order #250), which the Planning Board
              recommended 7-0. Adopting it takes six of the nine councilors.{" "}
              <Earlier issue={8} slug="2026-11-02" id="datacenters" label="the Planning Board's vote" />
            </li>
            <li>
              <b>A drop-off for hard-to-recycle items.</b>{" "}The Mayor asks the Council to accept
              a $100,000 state grant (Order #286) to turn the yard waste site at 16 Standley St into
              a staffed drop-off for things like textiles, scrap metal, bulky plastics, Styrofoam and
              small electronics, open at least three days a week. No opening date yet{" "}
              <Src href={`${COUNCIL_1109}#page=21`}>(p. 21)</Src>.
            </li>
            <li>
              <b>The Varian site cleanup.</b>{" "}The contractor&apos;s November update (Order
              #300) says heating the ground under Building 3 has removed more than 12,000 pounds of
              chemicals, with treatment of the bedrock next, early in 2027{" "}
              <Src href={`${COUNCIL_1109}#page=84`}>(p. 84)</Src>.{" "}
              <Earlier issue={4} slug="2026-10-05" id="varian" label="the last public update" />
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={COUNCIL_1109}>Agenda and packet</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted:</b>{" "}
            the Parking and Traffic Commission and the Open Space and Recreation Committee
            (November 4), and the Design Review Board and the License Board (November 5). The
            commission and the Design Review Board both had 37 Enon St on their agendas; their
            reports go to the Planning Board, which takes the project up again November 17.{" "}
            <b className="text-ink">Cancelled:</b>{" "}the November 4 School Committee meeting and
            the November 5 Waste Reduction Committee. Parks and Recreation moved to November 12.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 05: how it works. A section, not an aside, so read_depth counts it. ---- */}
        <section
          id="zba"
          aria-labelledby="zba-title"
          data-dek={"The Zoning Board of Appeals says yes to a project in two main ways. A special permit allows a use the zoning lists for that district, if the board finds it fits. A variance relaxes the rules where something about the land itself makes them a hardship. Both take four of five votes and can be appealed to court."}
          className="mt-16 scroll-mt-24"
        >
          <div className="max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-6 sm:px-7">
            <Eyebrow>05 &middot; How it works</Eyebrow>
            <h2
              id="zba-title"
              className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight"
            >
              Special permits and variances
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              The Boulder Lane plan would need two kinds of approval from the Zoning Board of
              Appeals. Here is how each works.
            </p>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[1rem] leading-[1.7]">
              <li>
                <b>A special permit</b>{" "}is for a use the zoning already lists for that
                district, but only case by case. The board grants it after a public hearing if it
                finds, among other things, that the site suits the use, that it will not cause
                undue traffic or a nuisance, and that city services are adequate. It can attach
                conditions <Src href={ZBA_RULES}>(&sect; 300-91)</Src>.
              </li>
              <li>
                <b>A variance</b>{" "}relaxes a rule, such as a height limit or a setback, where
                something peculiar to the land, such as its shape or slopes, makes the rule a
                hardship. The board grants only the minimum needed, and only if it will not harm
                the neighborhood <Src href={ZBA_RULES}>(&sect; 300-92)</Src>.
              </li>
              <li>
                <b>A use variance</b>{" "}allows a use the district does not list at all. State law
                allows these only where a city&apos;s zoning says so{" "}
                <Src href={MGL_40A_10}>(c. 40A &sect; 10)</Src>. Beverly&apos;s has since 1992,
                in every district except residential ones.
              </li>
              <li>
                <b>Votes and appeals.</b>{" "}On a five-member board, a special permit or a
                variance takes four votes <Src href={MGL_40A_15}>(c. 40A &sect; 15)</Src>. A
                neighbor or anyone else harmed by a decision can appeal it to court within 20 days
                of its filing with the City Clerk <Src href={MGL_40A_17}>(&sect; 17)</Src>.
              </li>
            </ol>
          </div>
        </section>

        {/* ---- 07 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 23
            </span>
          </h2>
          <ul className="mt-5 max-w-[63ch]">
            {ahead.map((e) => (
              <li
                key={`${e.date}-${e.what}`}
                className="grid grid-cols-[4.5rem_1fr] gap-x-3 border-t border-rule py-3 first:border-t-0 sm:grid-cols-[5rem_1fr_auto]"
              >
                <span className="text-[0.82rem] font-bold uppercase tracking-wide text-debt">
                  {e.date}
                </span>
                <span className="col-start-2">
                  <span className="text-[1rem] font-semibold">{e.what}</span>
                  <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink-faint">
                    {e.detail}
                  </span>
                </span>
                {e.cal && (
                  <span className="col-start-2 mt-2 sm:col-start-3 sm:mt-0">
                    <AddToCalendar event={e.cal} label="+ calendar" compactStyle />
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.93rem]">
            <Src href={`${AIRPORT_1109}#page=1`}>Airport Commission notice (p. 1)</Src>
            <Src href={`${DRC_1112}#page=1`}>Deficit committee notice (p. 1)</Src>
            <Src href={`${PARKS_1112}#page=1`}>Parks and Recreation notice (p. 1)</Src>
            <Src href={`${CLERK_1116}#page=1`}>Tabulation notice (p. 1)</Src>
            <Src href={`${CPC_1119}#page=1`}>Community Preservation notice (p. 1)</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>

        <section id="corrections" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Correction
          </h2>
          <ul className={LIST}>
            <li>
              Issue 8 gave the location of the November 4 Parking and Traffic Commission meeting as
              195 Cabot St. The commission&apos;s amended agenda puts the temporary City Hall at
              175 Cabot St.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
