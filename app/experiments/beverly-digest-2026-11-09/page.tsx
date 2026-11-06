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



/** Recording time as people read it: 4:39, 46:49, 1:33:54. */
function clock(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/**
 * Every other moment, set inline right after the sentence it backs up. Keeping these next
 * to their claims, rather than in the footer, is what lets the footer be for documents.
 */
const Moment = ({ src, s }: { src: string; s: number }) => (
  <a
    href={at(src, s)}
    target="_blank"
    rel="noopener"
    aria-label={`Hear this in the recording, from ${clock(s)}`}
    className="inline-flex translate-y-[-1px] items-center gap-1 whitespace-nowrap rounded-full bg-accent-glow px-2 py-px align-middle text-[0.74rem] font-semibold leading-snug tabular-nums text-accent no-underline transition-colors hover:bg-accent hover:text-white"
    data-track="source_opened"
    data-placement="inline-moment"
    data-seconds={s}
    data-moment={clock(s)}
  >
    <span aria-hidden className="text-[0.55rem]">
      &#9654;
    </span>
    {clock(s)}
  </a>
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

const V = "https://www.youtube.com/watch?v=";
const DRC0914 = `${V}O8Kxggwls3A`;
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
const ZONING_DEFS = "https://ecode360.com/29283349";
const MGL_40A = "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A";
const MGL_40A_10 = `${MGL_40A}/Section10`;
const MGL_40A_15 = `${MGL_40A}/Section15`;
const MGL_40A_17 = `${MGL_40A}/Section17`;
const RESULTS = `${DOC}/7770/November-3-2026-State-Election-Unofficial-Result-PDF`;
const NBC_RESULTS =
  "https://www.nbcboston.com/news/local/massachusetts-election-results-ballot-questions-2026/4043419/";
const VOTER_GUIDE =
  "https://www.sec.state.ma.us/divisions/elections/download/information-for-voters/archive/IFV_2026%20English.pdf";
const ELECTIONSTATS = "https://electionstats.state.ma.us/";
const LOCAL_NEWS_AYLES = "https://thelocalnews.news/2026/10/22/ipswich-hires-first-deputy-town-manager/";
const FINANCE_JOB = `${DOC}/7752`;
const VARIAN_SITE = "https://beverlysitecleanup.com";
const BEAT_TRAPS = "https://thebeverlybeat.substack.com/p/searching-for-ghosts-not-those-kind";
const TRASH_CAL = "https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["boulder", "Boulder Lane: the developer's plan is 200 units, and it would need a use variance"],
  ["election", "How Beverly voted on the nine ballot questions, next to the state"],
  ["ayles", "The city's finance director leaves for Ipswich"],
  ["council", "Tonight at the Council: the data center hearing, a recycling drop-off, Lynch Park"],
  ["traps", "Divers start clearing lost lobster traps from the harbor"],
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
      "Tonight, 7:00pm in the Middle School library, 502 Cabot St. The data center hearing is set for 7:30pm. To speak in public comment, register with the City Clerk by 9:30am.",
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
  { n: 7, what: "Single-family homes on smaller lots", bev: 52.5, state: 49.3, result: "Not called" },
  { n: 8, what: "Repeal retail marijuana sales", bev: 21.5, state: 24.4, result: "Failed" },
  { n: 9, what: "Keep the 2024 gun law", bev: 75.0, state: 67.0, result: "Passed" },
];
const gap = (q: Q) => {
  const g = Math.round((q.bev - q.state) * 10) / 10;
  return `${g > 0 ? "+" : g < 0 ? "−" : ""}${Math.abs(g).toFixed(1)}`;
};

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
            The developer behind the Boulder Lane proposal showed residents a 200-unit plan, and
            its slides list the approvals it would need, starting with a zoning variance. Beverly
            voted with the state on eight of nine ballot questions, with starter homes still
            uncalled. The finance director leaves for Ipswich, and the Council holds its data
            center hearing tonight.
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
          data-dek={"Waverly Development's slides for the November 5 community meeting show 200 units off Boulder Lane: 40 townhomes for buyers 55 and older and a 160-unit assisted living and memory care building. They list four approvals it would need, starting with a Zoning Board use variance. Nothing has been filed."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Housing</Eyebrow>
          <H2>Boulder Lane: the developer&apos;s plan is 200 units, and it would need a use variance</H2>
          <From>
            Mayor&apos;s community meeting &middot; Thursday, November 5 &middot; Centerville
            Elementary. Not recorded; from the developer&apos;s slides and reports.
          </From>
          <p className={BODY}>
            The developer behind the 55-and-older proposal off Boulder Lane in Centerville, in Ward
            6, is Waverly Development. Its{" "}
            <Src href={SLIDES}>slides for the Mayor&apos;s November 5 community meeting</Src>{" "}
            show 200 units on the 26-acre Beverly parcel at 128 Boulder Lane. Issue 8 reported 250
            to 300, the figure the Mayor&apos;s office gave before the meeting.{" "}
            <Earlier issue={8} slug="2026-11-02" id="boulder" label="the proposal and the land" />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What the slides show
          </h3>
          <ul className={LIST}>
            <li>
              <b>40 townhomes</b>{" "}for buyers 55 and older, 2&frac12; stories and up to 32 feet
              tall, on the side of the site nearest the Kennel Hill Drive neighborhood.
            </li>
            <li>
              <b>A 160-unit assisted living and memory care building,</b>{" "}four stories, at the
              Route 128 end of the site.
            </li>
            <li>
              <b>268 parking spaces,</b>{" "}and a driveway from Boulder Lane at the Route 128 end.
              The site plan in the slides shows no road to Kennel Hill Drive.
            </li>
            <li>
              <b>The wetlands and woods.</b>{" "}The plan keeps the wetlands and 75% of the wooded
              area, the slides say. A map in the slides puts the closest buildable point 300 feet
              or more from the nearest houses.
            </li>
            <li>
              <b>An earlier version.</b>{" "}A January plan had two five-story buildings with 205
              units for residents 55 and older, sited closer to the neighborhood. The slides say
              that plan fit the uses and building dimensions the zoning allows, and that the
              October plan was redesigned &ldquo;based on feedback from the City&rdquo; and needs
              zoning relief.
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What it would need
          </h3>
          <p className={BODY}>
            The slides list four approvals, each from a city board after a public hearing:
          </p>
          <ol className="mt-4 max-w-[63ch] list-decimal space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>A use variance from the Zoning Board of Appeals</b>{" "}for the assisted living
              building. The land is in the IR district, meant mainly for offices, research and
              light industry, and assisted living is not a use it allows.
            </li>
            <li>
              <b>A special permit from the Zoning Board</b>{" "}for the townhomes, as what the
              zoning calls &ldquo;subsidized elderly housing,&rdquo; the one 55-and-older housing
              use the district allows. The zoning&apos;s{" "}
              <Src href={ZONING_DEFS}>definition</Src>{" "}requires at least 15% of those units to be
              permanently affordable. The slides say &ldquo;a share of homes&rdquo; would be.
            </li>
            <li>
              <b>An order of conditions from the Conservation Commission,</b>{" "}setting the terms
              for any work near the wetlands.
            </li>
            <li>
              <b>Site plan review by the Planning Board,</b>{" "}with the Design Review Board,
              including the permit the water supply protection district requires.
            </li>
          </ol>
          <p className={BODY}>
            None of the four is a City Council vote. Beverly&apos;s zoning lets the Zoning Board
            grant a use variance outside residential districts, but only if it finds conditions
            peculiar to the land, such as its shape or topography, that would otherwise deprive the
            owner of a reasonable use, and that the variance is the minimum needed and will not
            harm the neighborhood <Src href={ZBA_RULES}>(zoning &sect; 300-92)</Src>. Four of the
            board&apos;s five members must agree. More in{" "}
            <a href="#zba" className="underline">
              How it works
            </a>
            , below.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Where it stands
          </h3>
          <p className={BODY}>
            Nothing has been filed with the city. Residents at the meeting opposed the project,{" "}
            <Src href={SALEM_NEWS_BOULDER}>The Salem News reported</Src>. Ward 6 Councilor Matt
            St. Hilaire, who posted the slides, wrote on Facebook the next day that &ldquo;no
            project has been officially filed, and serious challenges exist with building on this
            site,&rdquo; and that a filing would bring a public process before the Planning Board
            and the Conservation Commission. The Mayor&apos;s office called the meeting; it was not
            a board meeting, so there is no recording or official record of it.
          </p>
          <Refs
            sources={
              <>
                <Src href={SLIDES}>The developer&apos;s slides</Src>
                <Src href={ZBA_RULES}>Zoning Board rules (&sect;&sect; 300-89 to 300-95)</Src>
                <Src href={SALEM_NEWS_BOULDER}>The Salem News, Nov 6</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="election"
          data-dek={"Beverly voted on the same side as the state on eight of the nine ballot questions, mostly within about 3 points. Question 7, on smaller lots for single-family homes, passed in Beverly and was trailing statewide, uncalled, with 99% counted. About 19,200 residents voted, 62% of those registered."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Election</Eyebrow>
          <H2>How Beverly voted on the nine ballot questions, next to the state</H2>
          <From>Not from a meeting: the city&apos;s unofficial results and the Associated Press count</From>
          <p className={BODY}>
            About 19,200 Beverly residents voted on November 3, 62% of those registered, according
            to the city&apos;s <Src href={RESULTS}>unofficial results</Src>. That is the most
            ballots in a midterm election here since at least 2010: about 1,300 more than in 2022
            and about 200 more than in 2018.
          </p>
          <p className={BODY}>
            The ballot carried nine statewide questions, the most since 1994. Beverly landed on the
            same side as the state on eight, in most cases within about 3 points. From 2018 to 2024
            it was on the same side on all 13 statewide questions, by an average of under 3
            points, according to the state&apos;s{" "}
            <Src href={ELECTIONSTATS}>certified results</Src>.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            The questions that change things here
          </h3>
          <ul className={LIST}>
            <li>
              <b>Question 7, single-family homes on smaller lots: not called.</b>{" "}Beverly voted
              yes, 52.5%. Statewide, No led 50.7% to 49.3% with 99% of the expected vote counted
              Thursday evening, and the Associated Press had not called it,{" "}
              <Src href={NBC_RESULTS}>NBC Boston reported</Src>. If passed, it would bar local
              zoning from prohibiting a single-family home on a lot of at least 5,000 square feet
              with 50 feet of frontage and public water and sewer, while letting cities keep
              reasonable rules on setbacks, height and size{" "}
              <Src href={VOTER_GUIDE}>(state voter guide)</Src>. If No holds, it is the one
              question this year where Beverly and the state landed on opposite sides.
            </li>
            <li>
              <b>Question 8, marijuana: retail sales continue.</b>{" "}Beverly voted no on the
              repeal, 78.5%, compared with about 75.6% statewide. Retail sales stay legal, and so
              does the city&apos;s local tax on them, which Finance Director Bryant Ayles told the
              Deficit Reduction Committee in September is 3%.{" "}
              <Moment src={DRC0914} s={3261} />
            </li>
            <li>
              <b>Question 4, Election Day registration: passed.</b>{" "}Beverly 59.1% yes, the
              state 56.4%. Starting in 2028, voters can register at their polling place on
              Election Day, with proof of residency.
            </li>
            <li>
              <b>Question 6, Nature for All Fund: passed.</b>{" "}Beverly 65.0% yes, the state
              60.9%. From July 2027, part of the state sales tax on sporting goods, recreational
              vehicles and golf courses goes to a fund for conservation and parks, subject to the
              Legislature&apos;s yearly budget. Cities and towns can apply for the money.
            </li>
            <li>
              <b>Question 5, state revenue limit: failed.</b>{" "}Beverly 44.8% yes, the state
              47.9%. Nothing changes, including local aid to cities and towns.
            </li>
          </ul>
          <p className={BODY}>
            On the other four, Beverly voted with the state. The widest gap of the nine was on
            Question 9, keeping the 2024 gun law: 75% yes in Beverly, 67% statewide. Wenham and
            Salem were similarly above the state.
          </p>
          <details className="mt-5 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-3">
            <summary className="cursor-pointer text-[0.95rem] font-semibold text-accent">
              More: all nine questions, Beverly next to the state
            </summary>
            <table className="mt-3 w-full text-left text-[0.9rem] tabular-nums">
              <thead>
                <tr className="border-b border-rule text-[0.72rem] uppercase tracking-[0.1em] text-ink-faint">
                  <th className="py-1.5 pr-2 font-bold">Question</th>
                  <th className="py-1.5 pr-2 text-right font-bold">Beverly yes</th>
                  <th className="py-1.5 pr-2 text-right font-bold">State yes</th>
                  <th className="py-1.5 pr-2 text-right font-bold">Gap</th>
                  <th className="py-1.5 font-bold">Result</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.n} className="border-b border-rule last:border-b-0">
                    <td className="py-1.5 pr-2">
                      {q.n}. {q.what}
                    </td>
                    <td className="py-1.5 pr-2 text-right">{q.bev.toFixed(1)}%</td>
                    <td className="py-1.5 pr-2 text-right">{q.state.toFixed(1)}%</td>
                    <td className="py-1.5 pr-2 text-right">{gap(q)}</td>
                    <td className="py-1.5">{q.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[0.83rem] leading-snug text-ink-faint">
              Yes as a share of yes and no votes, with blank ballots left out. Gap is Beverly minus
              the state, in percentage points. State figures are the Associated Press count on
              November 4, at about 91% of the expected vote, except Question 7, at 99% on November
              5. All figures are unofficial.
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
            Not from a meeting: The Local News, and tonight&apos;s Council agenda &middot; Order
            #283
          </From>
          <p className={BODY}>
            Bryant Ayles, Beverly&apos;s Finance Director and Treasurer since January 2014, starts
            November 16 as Ipswich&apos;s first deputy town manager and finance director,{" "}
            <Src href={LOCAL_NEWS_AYLES}>The Local News reported</Src>, citing a release from
            Ipswich Town Manager Brendan Sweeney, a former Beverly city councilor.
          </p>
          <p className={BODY}>
            The Council takes up a resolution honoring him tonight, filed by Councilors Houseman,
            Rotondo and Spang. It credits him with the borrowing plan that paid for the Middle
            School, the police station, City Hall and the McPherson Youth Center, and with two
            increases in the city&apos;s bond rating. Before Beverly he was a budget supervisor at
            the state Department of Revenue{" "}
            <Src href={COUNCIL_1109}>(Council agenda)</Src>.
          </p>
          <p className={BODY}>
            This year he walked the Deficit Reduction Committee through the city&apos;s pension
            payments and health insurance costs.{" "}
            <Earlier issue={2} slug="2026-09-21" id="pension" label="the pension payment" />{" "}
            <Earlier issue={2} slug="2026-09-21" id="insurance" label="the health insurance split" />
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}
            The city has posted the job, as Director of Municipal Finance, at $160,000 to $180,000
            a year, reporting to the Mayor <Src href={FINANCE_JOB}>(job posting)</Src>. The
            Deficit Reduction Committee&apos;s November 12 agenda includes a city finance and
            forecast update.
          </p>
          <Refs
            sources={
              <>
                <Src href={COUNCIL_1109}>Council agenda and packet, Nov 9</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="council"
          data-dek={"The Council holds its hearing on the data center pause tonight at 7:30pm. Also on the agenda: a $100,000 state grant to turn the city's yard waste site into a drop-off for hard-to-recycle items, the Community Preservation Committee's Lynch Park recommendation, and an update on the Varian site cleanup."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; City Council</Eyebrow>
          <H2>Tonight at the Council: the data center hearing, a recycling drop-off, Lynch Park</H2>
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
              a $100,000 state grant (Order #286) to turn the city&apos;s yard waste site at 16
              Standley St into a staffed drop-off open to all residents at least three days a week.
              The plan lists materials such as textiles, scrap metal, bulky plastics, Styrofoam,
              books, small electronics and mercury-containing items, plus a yearly shredding day.
              The Mayor&apos;s letter gives no opening date{" "}
              <Src href={`${COUNCIL_1109}#page=21`}>(p. 21)</Src>.
            </li>
            <li>
              <b>Lynch Park.</b>{" "}The Community Preservation Committee recommends $107,614, the
              city&apos;s share of the seawall design and permits (Order #290). The Council sets a
              date for a public hearing.{" "}
              <Earlier issue={8} slug="2026-11-02" id="lynch" label="the request" />
            </li>
            <li>
              <b>The Varian site cleanup.</b>{" "}The cleanup contractor&apos;s November update
              (Order #300) says heating the ground under Building 3 had removed more than 12,000
              pounds of volatile compounds by the end of October, with the next round of treatment
              in the bedrock expected early in 2027{" "}
              <Src href={`${COUNCIL_1109}#page=84`}>(p. 84)</Src>.{" "}
              <Src href={VARIAN_SITE}>The cleanup&apos;s site</Src>{" "}
              <Earlier issue={4} slug="2026-10-05" id="varian" label="the last public update" />
            </li>
            <li>
              <b>To speak.</b>{" "}Register with the City Clerk by 9:30am. Up to five speakers,
              three minutes each.
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

        {/* ---- 05 ---- */}
        <section
          id="traps"
          data-dek={"The Harbormaster's office began a grant-funded effort on Halloween to find and remove lost lobster traps from Beverly Harbor, with volunteer divers pulling 15 the first morning and monthly dives planned through April, The Beverly Beat reported."}
          className={SECTION}
        >
          <Eyebrow>05 &middot; Harbor</Eyebrow>
          <H2>Divers start clearing lost lobster traps from the harbor</H2>
          <From>Not from a meeting: The Beverly Beat</From>
          <p className={BODY}>
            The Harbormaster&apos;s office started a project on Halloween morning to find and
            remove lost lobster traps from the harbor, paid for with a $124,700 grant. Eight
            volunteer divers pulled 15 traps off Glover Wharf the first morning. State Police, Fire
            Department and Environmental Police divers were set to join, with monthly dives
            planned through April, <Src href={BEAT_TRAPS}>The Beverly Beat reported</Src>.
          </p>
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

        {/* ---- 06: how it works. A section, not an aside, so read_depth counts it. ---- */}
        <section
          id="zba"
          aria-labelledby="zba-title"
          data-dek={"The Zoning Board of Appeals says yes to a project in two main ways. A special permit allows a use the zoning lists for that district, if the board finds it fits. A variance relaxes the rules where something about the land itself makes them a hardship. Both take four of five votes and can be appealed to court."}
          className="mt-16 scroll-mt-24"
        >
          <div className="max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-6 sm:px-7">
            <Eyebrow>06 &middot; How it works</Eyebrow>
            <h2
              id="zba-title"
              className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight"
            >
              Special permits and variances
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              The Boulder Lane slides ask the Zoning Board of Appeals for one of each. They are
              different tests.
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
          <div className="mt-5 grid max-w-[63ch] gap-3">
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Leaf and yard waste pickup
              </p>
              <p className="mt-2.5 text-[0.97rem] leading-[1.6]">
                On your regular trash day the weeks of November 16 and November 30. Paper bags or
                open barrels, at the curb by 7:00am. The yard waste site at 16 Standley St is open
                Mondays, Thursdays and Saturdays, 7:00am to 3:30pm, through December 19.{" "}
                <Src href={TRASH_CAL}>The city&apos;s pickup calendar</Src>
              </p>
            </div>
          </div>
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
