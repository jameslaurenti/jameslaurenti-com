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

const Fig = ({ children }: { children: ReactNode }) => (
  <span className="font-bold tabular-nums">{children}</span>
);

/** Recording time as people read it: 4:39, 46:49, 1:33:54. */
function clock(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/**
 * The one moment in an item most worth hearing, as a button above the text. The printed
 * time is derived from `s`, so the label and the link cannot disagree.
 */
const Hear = ({
  src,
  s,
  title,
  meeting,
}: {
  src: string;
  s: number;
  title: string;
  meeting: string;
}) => (
  <a
    href={at(src, s)}
    target="_blank"
    rel="noopener"
    className="mb-2.5 flex max-w-[63ch] items-center gap-3 rounded-md border border-accent/30 bg-accent-glow px-3.5 py-3 no-underline transition-colors hover:border-accent hover:bg-white"
    data-track="source_opened"
    data-placement="hear-button"
    data-seconds={s}
    data-moment={clock(s)}
  >
    <span
      aria-hidden
      className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent pl-0.5 text-[0.7rem] text-white"
    >
      &#9654;
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[0.95rem] font-bold text-accent-deep">{title}</span>
      <span className="text-[0.83rem] tabular-nums text-ink-mid">
        {meeting} &middot; from {clock(s)}
      </span>
    </span>
  </a>
);

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

/**
 * A pointer back to the issue where a story was told in full. Follow-ups stay short by
 * linking to the earlier item instead of retelling it.
 */
const Earlier = ({ issue, slug, id }: { issue: number; slug: string; id: string }) => (
  <a
    href={`/beverly/digest/${slug}#${id}`}
    className="rlink whitespace-nowrap"
    data-track="read_more_clicked"
    data-placement="earlier-issue"
  >
    Issue {issue} has the full story
  </a>
);

/**
 * The affected stretch of downtown, drawn from National Grid's petition plan. Schematic on
 * purpose: the plan fixes the route, but the Mayor's description of where the four street
 * crossings fall does not line up exactly with it, so the crossings are described in the
 * text and not drawn. Colors come from the theme tokens.
 */
function CabotMap() {
  const ink = "var(--color-ink)";
  const faint = "var(--color-ink-faint)";
  const accent = "var(--color-accent)";
  const street = { stroke: "var(--color-rule)", strokeWidth: 12, strokeLinecap: "round" as const };
  const label = { fontSize: 13, fill: faint, fontFamily: "var(--font-sans), system-ui, sans-serif" };
  const strong = { ...label, fill: ink, fontWeight: 700 };
  return (
    <figure className="mt-6 max-w-[63ch]">
      <svg
        viewBox="0 0 520 440"
        role="img"
        aria-labelledby="cabot-map-title"
        className="w-full rounded-lg border border-rule bg-white/70"
      >
        <title id="cabot-map-title">
          Schematic map of the work area: Cabot Street from Wallis Street north to Federal and
          Church Streets at Ellis Square, plus short stretches of Bow Street and Abbott Street.
          City Hall, 191 Cabot Street, is on the route.
        </title>
        {/* streets */}
        <line x1="260" y1="30" x2="260" y2="420" {...street} />
        <line x1="90" y1="380" x2="260" y2="380" {...street} />
        <line x1="130" y1="320" x2="260" y2="320" {...street} />
        <line x1="90" y1="225" x2="260" y2="240" {...street} />
        <line x1="260" y1="245" x2="440" y2="262" {...street} />
        <line x1="260" y1="140" x2="430" y2="140" {...street} />
        <line x1="90" y1="70" x2="260" y2="80" {...street} />
        <line x1="260" y1="80" x2="430" y2="70" {...street} />
        {/* the work: Cabot from Wallis to Ellis Square, with Bow and Abbott */}
        <g stroke={accent} strokeWidth="6" strokeLinecap="round" fill="none">
          <line x1="260" y1="322" x2="260" y2="78" />
          <line x1="165" y1="231" x2="260" y2="240" />
          <line x1="260" y1="245" x2="380" y2="256" />
          <line x1="225" y1="320" x2="260" y2="320" />
        </g>
        {/* labels */}
        <text x="272" y="410" style={strong}>Cabot St</text>
        <text x="96" y="370" style={label}>Broadway</text>
        <text x="136" y="310" style={label}>Wallis St</text>
        <text x="96" y="214" style={label}>Bow St</text>
        <text x="372" y="280" style={label}>Abbott St</text>
        <text x="352" y="130" style={label}>Hale St</text>
        <text x="96" y="60" style={label}>Federal St</text>
        <text x="352" y="62" style={label}>Church St</text>
        <text x="272" y="100" style={strong}>Ellis Square</text>
        {/* City Hall */}
        <rect x="276" y="282" width="12" height="12" fill={ink} />
        <text x="296" y="293" style={strong}>City Hall, 191 Cabot</text>
        {/* north arrow */}
        <g transform="translate(470 40)">
          <path d="M0 -14 L7 8 L0 3 L-7 8 Z" fill={faint} />
          <text x="-4" y="24" style={label}>N</text>
        </g>
        {/* key */}
        <line x1="40" y1="420" x2="70" y2="420" stroke={accent} strokeWidth="6" strokeLinecap="round" />
        <text x="78" y="424" style={label}>New underground lines</text>
      </svg>
      <figcaption className="mt-2 text-[0.85rem] leading-relaxed text-ink-faint">
        Not to scale. Route from National Grid&apos;s petition plan; four trenches will cross
        Cabot Street within the highlighted stretch.
      </figcaption>
    </figure>
  );
}

/* ---------------- sources ---------------- */

const V = "https://www.youtube.com/watch?v=";
const CC05 = `${V}pW5B7LiTPtM`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const PACKET_1005 = `${AGENDA}/ViewFile/Agenda/_10052026-2938`;
const PB_1006 = `${AGENDA}/ViewFile/Agenda/_10062026-2935`;
const CPC_1015 = `${AGENDA}/ViewFile/Agenda/_10152026-2949`;
const MGL = "https://malegislature.gov/Laws/GeneralLaws";
const CHARTER_FIN = "https://ecode360.com/44825953";
const MALEG = "https://malegislature.gov";
const EO658 =
  "https://www.mass.gov/executive-orders/no-658-establishing-requirements-for-responsible-data-center-development-and-operations-in-massachusetts-to-protect-and-support-ratepayers-communities-and-the-environment";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["lynchpark", "Lynch Park gets the money to finish its seawall permits"],
  ["datacenters", "Data centers: Beverly's pause, the state's new rule and Salem's ban"],
  ["cabot", "Cabot Street electric work, planned for after New Year's"],
  ["decided", "Also decided: shrubs and trees, a quorum fix, and grants"],
  ["statehouse", "From the State House: two Beverly laws signed"],
  ["how-it-works", "How it works: who controls the city budget"],
  ["ahead", "Coming up, through November 9"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Oct 13",
    what: "Parking and Traffic Commission",
    detail:
      "8:30am at the temporary City Hall, 195 Cabot St, and online. A proposal to make Chase Street one-way, safety reviews near Pickett Street and Baker Avenue and around Peabody, Larcom and Sargent Avenues, and a recommendation to the Planning Board on the Stop & Shop site.",
    cal: {
      id: "parking-2026-10-13",
      title: "Beverly Parking and Traffic Commission",
      start: "2026-10-13T12:30:00Z",
      end: "2026-10-13T14:00:00Z",
      location: "Temporary City Hall, 195 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 15",
    what: "Community Preservation Committee",
    detail:
      "7:00pm at the Police Department community room, 175 Elliott St. The Lynch Park match, the seven pre-applications for this year's grants, and 15 minutes for public questions.",
    cal: {
      id: "cpc-2026-10-15",
      title: "Beverly Community Preservation Committee",
      start: "2026-10-15T23:00:00Z",
      end: "2026-10-16T01:00:00Z",
      location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Oct 19",
    what: "Flock cameras: joint committee meeting",
    detail:
      "6:00pm at the Middle School library. Two Council committees review the city's license plate reader cameras and contracts, the second meeting on it since April.",
    cal: {
      id: "flock-joint-2026-10-19",
      title: "Beverly: Flock cameras joint committee meeting",
      start: "2026-10-19T22:00:00Z",
      end: "2026-10-19T22:55:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 19",
    what: "City Council",
    detail: "7:00pm, after the Flock meeting. The agenda is not posted yet.",
    cal: {
      id: "council-2026-10-19",
      title: "Beverly City Council",
      start: "2026-10-19T23:00:00Z",
      end: "2026-10-20T02:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 20",
    what: "Deficit Reduction Committee: first public presentation",
    detail:
      "Planned for the evening; the committee spent its October 8 meeting preparing it. The time and place have not been posted yet.",
    cal: {
      id: "drc-public-2026-10-20",
      title: "Deficit Reduction Committee: first public presentation",
      start: "2026-10-20T22:00:00Z",
      end: "2026-10-20T23:30:00Z",
      location: "Beverly, MA (location to be confirmed)",
    },
  },
  {
    date: "Oct 26",
    what: "Camp Paradise public meeting",
    detail:
      "6:00pm in the Barnet Gallery at the library, 32 Essex St. A Council committee meeting on the city's use of and plans for Camp Paradise, 44 Cole St, requested by Councilors Mullady and St. Hilaire in February.",
    cal: {
      id: "camp-paradise-2026-10-26",
      title: "Beverly: Camp Paradise public meeting",
      start: "2026-10-26T22:00:00Z",
      end: "2026-10-26T23:30:00Z",
      location: "Beverly Public Library, Barnet Gallery, 32 Essex St, Beverly, MA",
    },
  },
  {
    date: "Oct 27",
    what: "Planning Board",
    detail: "7:00pm at the Police Department. The agenda is not posted yet.",
  },
  {
    date: "Oct 28",
    what: "Zoning Board of Appeals",
    detail:
      "7:00pm at the Police Department community room. Includes a change to the design of the City Hall addition, and the continued hearing on a 124-foot Verizon cell tower at 12 Tozer Road.",
    cal: {
      id: "zba-2026-10-28",
      title: "Beverly Zoning Board of Appeals",
      start: "2026-10-28T23:00:00Z",
      end: "2026-10-29T01:00:00Z",
      location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Oct 29",
    what: "Retirement Board",
    detail: "Tentative, 6:00pm. The board that sets the city's pension funding schedule.",
  },
  {
    date: "Nov 3",
    what: "State election",
    detail: "The city clerk sets the early voting dates and locations.",
    cal: {
      id: "state-election-2026-11-03",
      title: "Massachusetts state election",
      start: "2026-11-03",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Nov 9",
    what: "City Council: data center hearing",
    detail: "The public hearing on the proposed data center pause is set for 7:30pm.",
    cal: {
      id: "council-2026-11-09",
      title: "Beverly City Council: data center pause hearing",
      start: "2026-11-10T00:30:00Z",
      end: "2026-11-10T02:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue5() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 5. Set to
          "2026-10-12" when publishing. */}
      <PageTracking surface="digest" issue="2026-10-12-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 5 &middot; Week of October 12
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering October 5 to 11, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            A quieter week, with no Council meeting until October 19. Lynch Park has the money to
            finish its seawall permits, and two state laws Beverly asked for were signed. The data center pause has a hearing date, and here is how
            it fits with the governor&apos;s new order and Salem&apos;s ban. National Grid plans
            its Cabot Street electric work for after New Year&apos;s. And before the deficit
            committee presents on October 20, a short guide to who controls the city budget.
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

        <div className="mt-8 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-4">
          <p className="text-[0.95rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Holiday week.</b>{" "}
            Monday is a holiday, so trash and recycling run a day late all week, through
            Saturday. There is no leaf pickup this week; the next leaf week is October 19 to 23.{" "}
            <Src href="https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF">
              Collection calendar
            </Src>
          </p>
        </div>

        <h2 className="mt-14 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          What happened{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            October 5 to 11
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="lynchpark"
          data-dek={"The Council accepted a $430,456 state grant to finish the design and permits for repairing Lynch Park's seawalls, after earlier state applications fell short."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Parks</Eyebrow>
          <H2>Lynch Park gets the money to finish its seawall permits</H2>
          <From>
            City Council &middot; Monday, October 5 &middot; Order #252, submitted by the Mayor
          </From>
          <Hear
            src={CC05}
            s={3572}
            title="The Mayor on how the grant came through"
            meeting="City Council, Oct 5"
          />
          <p className={BODY}>
            The Council accepted a{" "}
            <Fig>$430,456</Fig>{" "}
            grant from the state&apos;s Seaport Economic Council to finish the design and
            permits for repairing Lynch Park&apos;s seawalls, so construction can be put out to
            bid.{" "}
            <Moment src={CC05} s={4267} />
          </p>
          <p className={BODY}>
            <b>What it pays for.</b>{" "}
            The project still needs permits from the city&apos;s Conservation Commission, from
            the state (a waterfront license and a water quality certification) and from the U.S.
            Army Corps of Engineers, and plans detailed enough to build from.{" "}
            <Moment src={CC05} s={3492} />{" "}The grant covers 80% of that work. The city plans
            to ask the Community Preservation Committee for the other 20%, and the committee has
            Lynch Park on its agenda October 15.{" "}
            <Moment src={CC05} s={3533} />
          </p>
          <p className={BODY}>
            <b>Why the seawalls.</b>{" "}
            The project, the Lynch Park Resilient Seawall Restoration, has been in state
            environmental review since May. The December 2022 nor&apos;easter flooded the park,
            and the city says a January 2024 storm damaged park infrastructure. The Carriage
            House basement floods in heavy rain, and its foundation is part of the seawall. The
            only construction estimate on record is from 2024: about{" "}
            <Fig>$5 million</Fig>{" "}
            for the Rose Garden section alone. There is no total yet.
          </p>
          <p className={BODY}>
            <b>Why it took this long.</b>{" "}
            City records show a 2024 state coastal grant application was not funded, and that a
            state seawall repair program was not a fit because it ranks projects by risk to
            people. On October 5 the Mayor said the city had applied two years in a row to the
            state&apos;s main grant program and was turned down for two reasons: no homes flood
            when Lynch Park floods, unlike projects elsewhere, and the state weighs how much a
            community has to work with.{" "}
            <Moment src={CC05} s={3636} />{" "}He said he then called Lieutenant Governor Kim
            Driscoll, a former Salem mayor, and the money came through the Seaport Economic
            Council instead.{" "}
            <Moment src={CC05} s={3678} />
          </p>
          <p className={BODY}>
            <b>The money so far.</b>{" "}
            A{" "}
            <Fig>$325,375</Fig>{" "}
            state coastal grant in 2023 for the flood study and early designs;{" "}
            <Fig>$179,385</Fig>{" "}
            in Community Preservation funds in 2024 for design and permits; a request in June for{" "}
            <Fig>$45,000</Fig>{" "}
            of the city&apos;s free cash, its surplus from past years, to keep the permitting
            going over the summer; and now this grant. After the permits, the plans go to the
            Conservation Commission for review.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=52`}>Mayor&apos;s letter (p. 52)</Src>
                <Src href="https://eeaonline.eea.state.ma.us/EEA/MEPA-eMonitor/project/8777258b-e43e-4bd6-a4d1-aa0b3c51ca21">
                  State review file
                </Src>
                <Src href={CPC_1015}>Preservation Committee agenda, Oct 15</Src>
                <Src href={CC05}>Full recording</Src>
              </>
            }
            more={
              <>
                <Src href="https://www.beverlyma.gov/1057/2024-Lynch-Park-Resilient-Design">
                  The city&apos;s project page
                </Src>
                <Src href={`${AGENDA}/ViewFile/Minutes/_10172024-1970`}>
                  Preservation Committee minutes, Oct 2024
                </Src>
                <Src href={`${AGENDA}/ViewFile/Minutes/_11212024-2036`}>
                  Its 2024 funding vote
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="datacenters"
          data-dek={"Beverly's proposed pause on data centers has a November 9 hearing. The governor's new order covers only large projects and works through state permits, and Salem is weighing a permanent ban."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Follow-up</Eyebrow>
          <H2>Data centers: Beverly&apos;s pause, the state&apos;s new rule and Salem&apos;s ban</H2>
          <From>City Council &middot; Monday, October 5 &middot; Order #250</From>
          <p className={BODY}>
            The Council sent the Mayor&apos;s proposed pause on data centers to the Planning
            Board and set its own public hearing for its November 9 meeting, at 7:30pm.{" "}
            <Moment src={CC05} s={4089} />{" "}The Planning Board set its hearing date on October
            6; the date has not been posted. The pause would stop the city from accepting or
            approving an application for any data center, of any size, until the Council writes
            zoning rules for them or through November 30, 2027.{" "}
            <Earlier issue={4} slug="2026-10-05" id="datacenters" />.
          </p>
          <p className={BODY}>
            <b>Where the state comes in.</b>{" "}
            In September, Governor Healey signed Executive Order 658. It covers only large data
            centers, those that would draw more than{" "}
            <Fig>25 megawatts</Fig>{" "}
            at peak. State agencies cannot issue such a project permits until the developer shows
            it meets the state&apos;s energy expectations and files a community benefits
            agreement, which a state office, the Office of Environmental Justice and Equity,
            reviews against state standards. The governor&apos;s announcement described it as an
            agreement with the host community. The order itself does not change local zoning.
          </p>
          <p className={BODY}>
            So the two work on different things. The state order applies to state permits for
            big projects. Beverly&apos;s pause would apply to local permits for any data center.
            A project could face both.
          </p>
          <p className={BODY}>
            <b>Salem went further.</b>{" "}
            Mayor Dominick Pangallo proposed in July a permanent zoning ban on data centers in
            every part of the city, with no end date. Salem&apos;s Planning Board recommended it
            6 to 0 in September, and the final Council vote was on the October 8 agenda; the
            result had not been posted when this issue went out. Salem had a real case: the city
            revoked a permit for a 6-megawatt facility at the Shetland complex, and its Zoning
            Board upheld that in September. The developer says it is not a data center. At
            Salem&apos;s hearing, its special counsel said the governor&apos;s order
            &ldquo;doesn&apos;t have any impact&rdquo; on the ban, because the order is aimed at
            much larger facilities.
          </p>
          <p className={BODY}>
            Elsewhere, Lowell and Westfield adopted one-year pauses this year, and Peabody is
            discussing rules; its community development director said no projects are proposed
            there. Beverly&apos;s proposal does not mention any pending project.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=37`}>Beverly&apos;s proposal (p. 37)</Src>
                <Src href={PB_1006}>Planning Board agenda, Oct 6</Src>
                <Src href={EO658}>Executive Order 658</Src>
                <Src href="https://www.mass.gov/news/governor-healey-no-data-centers-without-local-approval">
                  Governor&apos;s announcement
                </Src>
                <Src href="https://www.salemma.gov/AgendaCenter/ViewFile/Minutes/_09092026-8385">
                  Salem hearing minutes, Sep 9
                </Src>
                <Src href="https://www.salemma.gov/AgendaCenter/ViewFile/Agenda/_10082026-8449">
                  Salem Council agenda, Oct 8
                </Src>
              </>
            }
            more={
              <>
                <Src href="https://www.wgbh.org/news/local/2026-09-16/its-not-the-right-fit-salem-mayor-urges-denial-of-permit-for-data-center">
                  GBH on the Salem project
                </Src>
                <Src href="https://www.salemnews.com/news/local_news/peabody-to-discuss-data-center-regs-thursday-no-projects-currently-proposed/article_929eee70-5927-487f-a3bf-54931b10dca4.html">
                  Salem News on Peabody
                </Src>
                <Src href="https://www.bisnow.com/boston/news/data-center-development/massachusetts-city-imposes-one-year-moratorium-on-data-centers-133606">
                  Bisnow on Lowell
                </Src>
                <Src href="https://www.wamc.org/news/2026-07-13/communities-in-pioneer-valley-continue-to-rally-against-data-centers">
                  WAMC on Westfield
                </Src>
                <Src href={`${MGL}/PartI/TitleVII/Chapter40A/Section5`}>
                  State zoning law, c. 40A &sect;5
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="cabot"
          data-dek={"National Grid plans new underground electric lines on Cabot Street after New Year's, for up to three months, with detours while it digs across the street."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Downtown</Eyebrow>
          <H2>Cabot Street electric work, planned for after New Year&apos;s</H2>
          <From>
            City Council public hearing &middot; Monday, October 5 &middot; Order #219, a
            National Grid petition
          </From>
          <Hear
            src={CC05}
            s={2052}
            title="The Mayor describes the plan"
            meeting="City Council, Oct 5"
          />
          <p className={BODY}>
            National Grid wants to lay new underground electric lines along Cabot, Bow, Abbott
            and Wallis Streets, which its representative said is to improve reliability and
            reduce outages.{" "}
            <Moment src={CC05} s={1854} />{" "}The Mayor said downtown has had a number of
            outages in recent years, and that the city met with the company about timing.{" "}
            <Moment src={CC05} s={2090} />
          </p>
          <CabotMap />
          <div className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-4">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
              What to expect, as described at the hearing
            </p>
            <ul className="mt-2.5 space-y-2.5 text-[1rem] leading-[1.65]">
              <li>
                <b>When.</b>{" "}
                After New Year&apos;s, weather permitting. The city asked for January and
                February because the businesses on that stretch have been through a lot, with
                new sidewalks and new utilities.{" "}
                <Moment src={CC05} s={2052} />
              </li>
              <li>
                <b>How long.</b>{" "}
                Up to three months.{" "}
                <Moment src={CC05} s={2126} />
              </li>
              <li>
                <b>Crossing Cabot.</b>{" "}
                Four trenches will cross the street. Three will be dug at the same time by
                separate crews, with detours; the fourth, near Ellis Square, will be done
                separately, with detours from as far as Dane Street.{" "}
                <Moment src={CC05} s={2164} />
              </li>
              <li>
                <b>Depth.</b>{" "}
                Up to 12 feet in places. Crews may hit old trolley rails and cobblestones.{" "}
                <Moment src={CC05} s={2206} /> <Moment src={CC05} s={2273} />
              </li>
              <li>
                <b>Nights.</b>{" "}
                The goal is no night work; there are apartments above some of the buildings.{" "}
                <Moment src={CC05} s={2401} />
              </li>
              <li>
                <b>Sidewalks.</b>{" "}
                Blocked while conduit goes in, then covered with steel plates or patched so
                people can walk over them at the end of each day.{" "}
                <Moment src={CC05} s={1922} />
              </li>
              <li>
                <b>School bus stops.</b>{" "}
                Two stops, at Cabot and Abbott and at Cabot and Bow, will have to move while the
                crossings are dug. The Mayor said the city will set a plan with the schools&apos;
                transportation department before work starts.{" "}
                <Moment src={CC05} s={2340} />
              </li>
            </ul>
          </div>
          <p className={BODY}>
            No one from the public spoke at the hearing. The petition goes back to the
            Council&apos;s Public Services committee, then to a Council vote.{" "}
            <Moment src={CC05} s={2464} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=10`}>Petition (p. 10)</Src>
                <Src href={`${PACKET_1005}#page=14`}>Route plan (p. 14)</Src>
                <Src href={CC05}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="decided"
          data-dek={"The ordinance on private trees and shrubs that block sidewalks passed its final vote, the Human Rights Committee can now meet with open seats, and the Council accepted several grants."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; Decided</Eyebrow>
          <H2>Also decided: shrubs and trees, a quorum fix, and grants</H2>
          <From>City Council &middot; Monday, October 5</From>
          <ul className="mt-4 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>Overgrown trees and shrubs.</b>{" "}
              The ordinance passed its final vote. Owners whose trees or shrubs block a street or
              sidewalk can be warned, fined, and billed if the city trims them, with a lien if
              the bill goes unpaid for 60 days. Asked how it will be enforced, the city solicitor
              said mostly on complaints, with the building inspector or tree warden sometimes
              going street by street.{" "}
              <Moment src={CC05} s={2575} /> <Moment src={CC05} s={2622} />{" "}
              <Earlier issue={4} slug="2026-10-05" id="trees" />.
            </li>
            <li>
              <b>Human Rights Committee quorum.</b>{" "}
              Also passed: the committee can now count its quorum from the members it has rather
              than its eleven seats, so open seats no longer count against it.{" "}
              <Moment src={CC05} s={2662} />{" "}Councilor Houseman&apos;s request for{" "}
              <Fig>$20,000</Fig>{" "}
              for the committee stayed in the Finance and Property committee.{" "}
              <Moment src={CC05} s={2834} />
            </li>
            <li>
              <b>Grants.</b>{" "}
              The Council accepted{" "}
              <Fig>$2,143,333</Fig>{" "}
              in federal money for Massachusetts Task Force 1, the urban search and rescue team
              based in Beverly, about $600,000 more than last year, the city&apos;s grants
              director said.{" "}
              <Moment src={CC05} s={3077} />{" "}Also: exhaust systems for all three fire
              stations, new motors for the fire department&apos;s rescue and dive boat, the
              police department&apos;s yearly traffic safety grant, and{" "}
              <Fig>$25,300</Fig>{" "}
              for Beverly&apos;s local cultural council, which passes it on as small arts grants.{" "}
              <Moment src={CC05} s={4201} />
            </li>
            <li>
              <b>Where the Council meets now.</b>{" "}
              With City Hall closed for its renovation, and no room for Council meetings in the
              temporary City Hall next door, the Council meets in the Beverly Middle School
              library, 502 Cabot St, until further notice.{" "}
              <Moment src={CC05} s={4519} />
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=1`}>Council agenda (p. 1)</Src>
                <Src href={CC05}>Full recording</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted yet:</b>{" "}
            the Planning Board and the Conservation Commission on Tuesday; and on Thursday the
            Deficit Reduction Committee, preparing its October 20 presentation, the Parks and
            Recreation Commission, the Design Review Board and the Human Rights Committee. For
            those, the record is the posted agenda now and the minutes once they are approved.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 05 ---- */}
        <section
          id="statehouse"
          data-dek={"Two state laws Beverly asked for were signed: one moves fire alarm operators hired by 2006 into a different retirement group, and one lets the police chief serve until 70."}
          className={SECTION}
        >
          <Eyebrow>05 &middot; From the State House</Eyebrow>
          <H2>Two Beverly laws signed</H2>
          <From>
            Massachusetts Legislature &middot; home rule petitions, filed with the approval of the
            Mayor and City Council
          </From>
          <p className={BODY}>
            Some changes the city wants need a state law. Beverly asks for one with a home rule
            petition, approved by the Mayor and Council and filed by its legislators. Governor
            Healey signed two in the past three weeks.
          </p>
          <ul className="mt-4 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>Fire alarm operators&apos; retirement (Chapter 233, signed October 5).</b>{" "}
              Fire alarm operators hired by the city on or before January 26, 2006, including
              those who later moved to joint civilian dispatcher, are now classified in Group 2
              for retirement. For employees hired before 2012, Group 2 reaches the maximum
              pension rate at age 60 rather than 65. Filed by Senator Joan Lovely.
            </li>
            <li>
              <b>The police chief (Chapter 218, signed September 22).</b>{" "}
              Police Chief John LeLacheur may serve past 65, the usual mandatory retirement age,
              until he turns 70, retires or is relieved by the Mayor, whichever comes first, as
              long as he is physically and mentally able to do the job. The city may require an
              exam, at its expense, by an impartial physician it designates. He stops paying into
              the pension system at 65, and his pension will be what it would have been had he
              retired then. Filed by Representative Hannah Bowen and Senator Lovely. The
              digest missed this one when it was signed; it now checks the Legislature each week.
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={`${MALEG}/Bills/194/S1876/BillHistory`}>S.1876 history</Src>
                <Src href={`${MALEG}/Laws/SessionLaws/Acts/2026/Chapter233`}>Chapter 233</Src>
                <Src href={`${MALEG}/Bills/194/H5248/BillHistory`}>H.5248 history</Src>
                <Src href={`${MALEG}/Laws/SessionLaws/Acts/2026/Chapter218`}>Chapter 218</Src>
              </>
            }
            more={
              <>
                <Src href={`${MGL}/PartI/TitleIV/Chapter32/Section5`}>
                  Retirement ages and rates, c. 32 &sect;5
                </Src>
                <Src href="https://www.mass.gov/service-details/group-classification-faqs-msrb">
                  Group classification, explained
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 06: how it works. A section, not an aside, so read_depth counts it. ---- */}
        <section
          id="how-it-works"
          aria-labelledby="budget-title"
          data-dek={"How the city charter and state law split budget power: the Mayor writes the budget, and the Council can cut it but not add to it, with an exception for schools."}
          className="mt-16 scroll-mt-24"
        >
          <div className="max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-6 sm:px-7">
            <Eyebrow>06 &middot; How it works</Eyebrow>
            <h2
              id="budget-title"
              className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight"
            >
              Who controls the city budget
            </h2>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              The Deficit Reduction Committee presents its first ideas on October 20. The
              committee advises; any idea that changes spending would reach the budget through
              the Mayor and the Council. Here is how the city charter and state law split that
              work.
            </p>
            <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[1rem] leading-[1.7]">
              <li>
                <b>The School Committee goes first.</b>{" "}
                It holds a public hearing, votes its budget request and sends it to the Mayor at
                least 21 days before the city budget is due.
              </li>
              <li>
                <b>The Mayor writes the budget.</b>{" "}
                The Mayor submits the whole operating budget to the Council, with a budget
                message, and publishes a summary.
              </li>
              <li>
                <b>The Council can cut, not add.</b>{" "}
                After its own public hearing, the Council can approve, reduce or reject any
                amount. It cannot raise an amount or add a new item unless the Mayor recommends
                it, and it cannot cut debt service or spending the law requires.
              </li>
              <li>
                <b>Schools.</b>{" "}
                The School Committee decides how school money is spent; the Council votes only
                the total, and its views on particular lines are advisory. A 1987 state law lets
                a city council raise the school total above the Mayor&apos;s figure by a
                two-thirds vote, on the School Committee&apos;s recommendation and within
                Proposition 2½, but only in cities that have adopted it. We have not found that
                Beverly has.
              </li>
              <li>
                <b>The clock.</b>{" "}
                Any amount the Council has not acted on within 45 days takes effect as the Mayor
                proposed it.
              </li>
              <li>
                <b>During the year.</b>{" "}
                Moving money from one department to another takes a written request from the
                Mayor and a Council vote, after two readings and a public hearing. Moving money
                between lines inside one department needs only the Mayor&apos;s approval.
              </li>
            </ol>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              In short, the Mayor&apos;s budget is the ceiling. The Council can approve it or go
              lower, line by line, but it cannot go higher or move money between departments on
              its own.
            </p>
            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.93rem]">
              <Src href={CHARTER_FIN}>City charter, Article 6</Src>
              <Src href={`${MGL}/PartI/TitleVII/Chapter44/Section32`}>State law, c. 44 &sect;32</Src>
              <Src href={`${MGL}/PartI/TitleXII/Chapter71/Section34`}>School budgets, c. 71 &sect;34</Src>
              <Src href="https://www.amesburyma.gov/DocumentCenter/View/3700/2023-051-An-Order-for-the-Amesbury-City-Council-to-vote-to-accept-the-provisions-of-Chapter-329-of-the-Acts-of-1987pdf">
                The 1987 law (Acts 1987, c. 329)
              </Src>
            </p>
          </div>
        </section>

        {/* ---- 07 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 9
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
        </section>

        {/* The closing note. An aside, not a section, so it stays out of the story feed. */}
        <aside className="mt-14 max-w-[63ch] border-t border-rule pt-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            One more thing
          </p>
          <p className="mt-2 text-[1rem] leading-[1.7] text-ink-mid">
            The Council opened its meeting by honoring Beverly&apos;s 2026 Senior of the Year,
            Gail Dionne: a Ward 3 resident for more than 50 years who worked in the Beverly
            Public Schools, plays on the Senior Center&apos;s bocce team, leads an exercise class
            and is, in the resolution&apos;s words, always the first to offer a ride to an
            appointment or the grocery store.{" "}
            <Moment src={CC05} s={273} />
          </p>
        </aside>
      </div>
    </div>
  );
}
