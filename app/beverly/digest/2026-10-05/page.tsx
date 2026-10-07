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
 * A note the reader should not skip: here, that a list is a draft. Accent rather than gold,
 * because it is guidance about how to read the item, not a gap in the record.
 */
const Note = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 max-w-[63ch] rounded-r border-l-[3px] border-accent bg-accent-glow px-4 py-3 text-[1rem] leading-[1.7]">
    {children}
  </div>
);

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

/* ---------------- sources ---------------- */

const V = "https://www.youtube.com/watch?v=";
const DRC28 = `${V}VHlM49JcQts`;
const VAR30 = `${V}mgzRfcfQBtA`;
const CISL23 = `${V}raCv_1lA-Uc`;
const BUD23 = `${V}nlwByu273SM`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const PACKET_1005 = `${AGENDA}/ViewFile/Agenda/_10052026-2938`;
const PB_1006 = `${AGENDA}/ViewFile/Agenda/_10062026-2935`;
const MGL = "https://malegislature.gov/Laws/GeneralLaws";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["deficit", "The deficit committee makes a first pass at its list"],
  ["varian", "The Varian cleanup, and where it stands"],
  ["mcas", "This year's MCAS, and how to read it"],
  ["enon", "Stop & Shop site: the Planning Board takes it up"],
  ["datacenters", "Tonight: a proposed pause on data centers"],
  ["trees", "Tonight: overgrown trees and shrubs on private property, final vote"],
  ["oversight", "Tonight: two proposals for more Council say over travel and long contracts"],
  ["agenda", "Tonight: also on the agenda"],
  ["ahead", "Further out, through November 3"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Oct 6",
    what: "Planning Board",
    detail:
      "7:00pm in the Police Department community room, 175 Elliott St. Sets hearing dates for the Stop & Shop site and the data center pause, and adopts this year's fee in lieu of affordable units.",
    cal: {
      id: "planning-2026-10-06",
      title: "Beverly Planning Board",
      start: "2026-10-06T23:00:00Z",
      end: "2026-10-07T01:00:00Z",
      location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Oct 8",
    what: "Community Preservation pre-applications due",
    detail:
      "By noon, for grant round 14, about $2.46 million across historic preservation, housing, open space and recreation. Full applications are due January 13.",
    cal: {
      id: "cpa-preapp-2026-10-08",
      title: "Beverly CPA grant round 14: pre-applications due",
      start: "2026-10-08",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Oct 8",
    what: "Parks and Recreation Commission",
    detail:
      "7:00pm at the Senior Center, 90 Colon St. Updates on Balch Playground phase 2, the Holcroft Park splash pad and the Gillis Park pavilion, plus the parks budget and enterprise fund.",
    cal: {
      id: "parks-2026-10-08",
      title: "Beverly Parks and Recreation Commission",
      start: "2026-10-08T23:00:00Z",
      end: "2026-10-09T01:00:00Z",
      location: "Beverly Senior Center, 90 Colon St, Beverly, MA",
    },
  },
  {
    date: "Oct 19",
    what: "Flock cameras: joint committee meeting",
    detail:
      "Legal Affairs and Public Services review the city's license plate reader cameras together, 6:00pm at the Middle School library, before the regular Council meeting.",
    cal: {
      id: "flock-joint-2026-10-19",
      title: "Beverly: Flock cameras joint committee meeting",
      start: "2026-10-19T22:00:00Z",
      end: "2026-10-19T22:55:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 20",
    what: "Deficit Reduction Committee: first public presentation",
    detail:
      "Planned for 6:00 to 7:30pm, and BevCam is set to carry it. The committee has asked the Senior Center to host; the city calendar does not list it yet. A first pass, with time for questions.",
    cal: {
      id: "drc-public-2026-10-20",
      title: "Deficit Reduction Committee: first public presentation",
      start: "2026-10-20T22:00:00Z",
      end: "2026-10-20T23:30:00Z",
      location: "Beverly, MA (location to be confirmed)",
    },
  },
  {
    date: "Oct 29",
    what: "Retirement Board",
    detail: "Tentative, 6:00pm. The board that sets the city's pension funding schedule.",
    cal: {
      id: "retirement-2026-10-29",
      title: "Beverly Contributory Retirement Board",
      start: "2026-10-29T22:00:00Z",
      end: "2026-10-29T23:30:00Z",
      location: "275 Rantoul St, Beverly, MA",
    },
  },
  {
    date: "Nov 3",
    what: "State election, with 14 days of early voting",
    detail:
      "The city clerk sets the early voting dates and locations.",
    cal: {
      id: "state-election-2026-11-03",
      title: "Massachusetts state election",
      start: "2026-11-03",
      allDay: true,
      location: "Beverly, MA",
    },
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue4() {
  return (
    <div className="bg-bg text-ink">
      <PageTracking surface="digest" issue="2026-10-05" depth />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 4 &middot; Week of October 5
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering September 28 to October 4, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The deficit committee made a first pass at its ideas, three weeks before presenting
            them. The Varian site cleanup gave its first public update since its main treatment
            began, and this year&apos;s MCAS results are out. Tonight&apos;s Council agenda is a
            full one: a proposed pause on data centers, a final vote on fines for private trees
            and shrubs that block the sidewalk, and two proposals for more Council say over
            travel and long contracts.
          </p>
        </header>

        {/* ---- corrections and clarifications, up top this week ---- */}
        <aside
          aria-labelledby="corrections-title"
          className="mt-8 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-4"
        >
          <h2
            id="corrections-title"
            className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-debt"
          >
            Corrections and clarifications
          </h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Committee minutes.</b>{" "}
            Issue 3 first said the Finance and Property committee&apos;s discussion of the $20,000
            Human Rights Committee request was not on the record. Committee meetings are public
            and minuted; this one was not on BevCam. Its minutes will be posted once the Council
            approves them.{" "}
            <a href="/beverly/digest/2026-09-28#humanrights" className="rlink">
              Issue 3
            </a>{" "}
            has been updated.
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-mid">
            <b className="text-ink">The budget analyst.</b>{" "}
            Issues 2 and 3 said the Council&apos;s budget analyst, Gerry Perry, had not said he
            was leaving, and issue 2 guessed the search might be routine. A City Hall official
            told the digest that Perry plans to retire fully by the end of this year, with a
            formal letter to come. The Council&apos;s screening committee is interviewing
            candidates now.
          </p>
        </aside>

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
            September 28 to October 4
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section id="deficit" data-dek={"For the first time, the Deficit Reduction Committee sorted its ideas into yes, maybe, no and exploring. It's a work in progress ahead of its Oct. 20 presentation."} className={SECTION}>
          <Eyebrow>01 &middot; A first pass, not a final list</Eyebrow>
          <H2>The deficit committee makes a first pass at its list</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 28</From>
          <Hear
            src={DRC28}
            s={4700}
            title="The committee starts sorting its list"
            meeting="Deficit Reduction Committee, Sep 28"
          />
          <p className={BODY}>
            On September 28 the Deficit Reduction Committee went through the ideas it has
            gathered since July and put each one into one of four groups: yes, maybe, no and
            exploring. It is the first time the committee has sorted its full list.{" "}
            <Moment src={DRC28} s={7230} />
          </p>
          <Note>
            <b>Read this as a draft.</b>{" "}
            &ldquo;Yes&rdquo; means feasible, possibly with more research needed, not a final
            recommendation.{" "}
            <Moment src={DRC28} s={4993} />{" "}The list is a work in progress and can change
            before October 20, and after.{" "}
            <Moment src={DRC28} s={7090} />{" "}The committee does not vote or set policy: the
            Mayor writes the budget and the Council votes on it.{" "}
            <Moment src={DRC28} s={94} />
          </Note>
          <p className={BODY}>Here is where things stood when the meeting ended.</p>
          <ul className="mt-3 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>Yes, for now.</b>
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  Expanding the areas with paid parking, and raising parking fees generally.{" "}
                  <Moment src={DRC28} s={5030} />
                </li>
                <li>
                  Parks and recreation fees, such as online sign-up with a fee for the summer program, and possibly more parks day camps, which have waiting lists.{" "}
                  <Moment src={DRC28} s={5238} />
                </li>
                <li>
                  Forming a committee to seek more payments in lieu of taxes (PILOTs) from tax-exempt institutions. The recommendation is the committee, not a dollar figure.{" "}
                  <Moment src={DRC28} s={1227} /> <Moment src={DRC28} s={5365} />
                </li>
                <li>
                  Reviewing every city fee every year or two, so fees keep pace with costs in small steps instead of falling behind. It grew out of the trash fee, which members said nearly quadrupled after years without an increase.{" "}
                  <Moment src={DRC28} s={5329} />
                </li>
              </ul>
            </li>
            <li>
              <b>Maybe.</b>
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  The share of health insurance premiums paid by employees and by retirees. Employees&apos; share is negotiated with their unions.{" "}
                  <Moment src={DRC28} s={6030} />
                </li>
                <li>
                  Sharing services with other communities, such as out-of-district school transportation.{" "}
                  <Moment src={DRC28} s={5501} />
                </li>
              </ul>
            </li>
            <li>
              <b>No, with an explanation.</b>
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  Changing the pension funding schedule to lower the city&apos;s yearly contribution. Members said there is no need: the city can already hold that contribution flat instead of raising it each year.{" "}
                  <Moment src={DRC28} s={5980} />
                </li>
                <li>
                  More cannabis revenue: there is room for one more license and the market is crowded, with members noting the city should be easier to work with in general.{" "}
                  <Moment src={DRC28} s={6843} />
                </li>
                <li>
                  Closing Beverly&apos;s own dispatch center to join a regional one, which has no room for Beverly.{" "}
                  <Moment src={DRC28} s={7090} />
                </li>
                <li>
                  Selling the Farms branch library, whose land, a member said, can only be used for a library.{" "}
                  <Moment src={DRC28} s={284} />
                </li>
              </ul>
            </li>
            <li>
              <b>Exploring.</b> Longer-term ideas that need more research and public input.
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  Joining the state&apos;s health insurance program for public employees.{" "}
                  <Moment src={DRC28} s={6366} />
                </li>
                <li>
                  A city-run electric utility, and the future of the golf course, the harbor, and Hurd Stadium with Cooney Field.{" "}
                  <Moment src={DRC28} s={7188} />
                </li>
                <li>
                  An audit of non-health insurance, and personal use of city vehicles.{" "}
                  <Moment src={DRC28} s={7047} /> <Moment src={DRC28} s={7090} />
                </li>
              </ul>
            </li>
          </ul>
          <p className={BODY}>
            The list carries no dollar figures. Members said bigger and harder choices need more
            research and public input, and that they expect to come back to them in the spring,
            after the city&apos;s financial forecast in November.{" "}
            <Moment src={DRC28} s={1090} />
          </p>
          <p className={BODY}>
            The first public presentation is planned for Tuesday, October 20, from 6:00 to
            7:30pm, and BevCam is set to carry it. The committee has asked the Senior Center to host; the
            city calendar does not list it yet. Members talked about a short presentation
            followed by questions from a sign-up sheet, and about smaller listening sessions
            around the city, possibly starting in early November.{" "}
            <Moment src={DRC28} s={7605} /> <Moment src={DRC28} s={2386} />
          </p>
          <p className="mt-4 max-w-[63ch] text-[0.9rem] italic leading-relaxed text-ink-mid">
            Disclosure: James Laurenti, who writes this digest, came up at this meeting. A member
            said she had met with him about the committee&apos;s benchmarking work and that he
            sent her information afterward, and another mentioned research he had shared.{" "}
            <Moment src={DRC28} s={2964} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09282026-2926`}>Committee agenda, Sep 28</Src>
                <Src href={DRC28}>Full recording</Src>
              </>
            }
            more={
              <>
                <a href="/beverly/digest/2026-09-21" className="rlink" data-track="read_more_clicked" data-placement="earlier-issue">
                  Issue 2: the pension payment, and a city-run utility
                </a>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section id="varian" data-dek={"The cleanup at the former Varian plant gave its first public update since heating began under Building 3."} className={SECTION}>
          <Eyebrow>02 &middot; Environment</Eyebrow>
          <H2>The Varian cleanup, and where it stands</H2>
          <From>
            Varian site public meeting &middot; Wednesday, September 30 &middot; not a city
            meeting
          </From>
          <Hear
            src={VAR30}
            s={3645}
            title="Where the heating stands, and what has come out"
            meeting="Varian site public meeting, Sep 30"
          />
          <p className={BODY}>
            For decades the plant at 150 Sohier Road used industrial solvents for cleaning and
            degreasing, and some got into the ground: TCE, PCE and TCA, which evaporate easily and
            sink in water. They were found in 1986. Varian, now part of Siemens Healthineers, sold
            the plant in 1995 and remains responsible for the cleanup; another company still makes
            microwave and radar products there.
          </p>
          <p className={BODY}>
            The state environmental agency oversees the work, and residents petitioned in 1992
            for public meetings like this one. The chemicals have moved west in groundwater toward
            Tozer Road. The cleanup&apos;s 2023 risk assessment, filed with the state, found no significant
            risk to residents or workers. A vapor removal system runs at one nearby home.
          </p>
          <p className={BODY}>
            Heating under Building 3 began in late July, to turn the chemicals into vapor and
            catch them in carbon filters. By September 30 the ground averaged about{" "}
            <Fig>50°C</Fig>, halfway to its{" "}
            <Fig>100°C</Fig>{" "}
            target, and a little over{" "}
            <Fig>3,200 pounds</Fig>{" "}
            had come out, up from about 850 in August. The heating is slow on purpose because
            people work in the building above; the team says the result is the same, just later.{" "}
            <Moment src={VAR30} s={3434} /> <Moment src={VAR30} s={3751} />{" "}
            <Moment src={VAR30} s={3840} />
          </p>
          <p className={BODY}>
            <b>Is it on schedule?</b>{" "}
            It is running behind the original plan. The first schedule, in June 2023, had heating starting that
            winter. Buried asbestos debris, contamination at the edge of the work area and extra
            vapor protections for the occupied building pushed it back. The most recent schedule,
            published in May 2026, had heating starting that month; it started in late July.
            All were labeled estimates.
          </p>
          <p className={BODY}>
            <b>When will it be done?</b>{" "}
            No end date has been published. The 2023 cleanup plan estimated about a year and a
            half of heating, three years of biological treatment and two of natural breakdown for
            the Building 3 area, about six and a half years in all.{" "}
            <Moment src={VAR30} s={3876} />
          </p>
          <p className={BODY}>
            <b>What comes next.</b>{" "}
            February&apos;s Phase IV completion statement is not the finish line. It certifies
            that the systems are built and opens a public comment period. Years of running them
            and testing groundwater follow, until the state&apos;s standard for a permanent
            solution is met. The next public meeting is expected in April or May.{" "}
            <Moment src={VAR30} s={5482} />
          </p>
          <Refs
            sources={
              <>
                <Src href="https://beverlysitecleanup.com/">Project website</Src>
                <Src href="https://beverlysitecleanup.com/wp-content/uploads/2026/10/Varian_Fact_Sheet_Fall_2026.pdf">
                  Fall 2026 fact sheet
                </Src>
                <Src href="https://beverlysitecleanup.com/wp-content/uploads/2025/04/Revised-Phase-III.pdf#page=48">
                  2023 cleanup plan (p. 48)
                </Src>
                <Src href={VAR30}>Full recording</Src>
              </>
            }
            more={
              <>
                <Src href="https://beverlysitecleanup.com/more-information/">Monthly email updates</Src>
                <Src href="https://beverlysitecleanup.com/public-involvement/">Past schedules and slides</Src>
                <Src href="https://eeaonline.eea.state.ma.us/portal/dep/wastesite/detailviewer/3-0000485">
                  State file, 3-0000485
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section id="mcas" data-dek={"Beverly's grades 3 to 8 stayed 5 to 10 points above the state, and grade 10 is close to it. The state flagged Beverly High because too few students in one group took the test."} className={SECTION}>
          <Eyebrow>03 &middot; Schools</Eyebrow>
          <H2>This year&apos;s MCAS, and how to read it</H2>
          <From>
            State results, released September 22 &middot; School Committee curriculum
            subcommittee, Wednesday, September 23, posted September 28
          </From>
          <p className={BODY}>
            This is the second spring of MCAS since Question 2 ended the requirement to pass it
            to graduate; students still take it, and the state still uses it to rate schools.
            Statewide, grades 3 to 8 held roughly steady and grade 10 fell, and experts disagree
            about how much of that is effort rather than learning.
          </p>
          <p className={BODY}>
            Beverly&apos;s grades 3 to 8 held or rose and stayed 5 to 10 points above the state. Grade 10
            is close to the state, with math up four points and science down eight. The share of
            students meeting or exceeding expectations:
          </p>
          <div className="mt-4 max-w-[63ch] overflow-x-auto">
            <table className="w-full border-collapse text-left text-[0.93rem] tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink text-[0.72rem] uppercase tracking-wide text-ink-faint">
                  <th className="py-1.5 pr-2 font-bold">Test</th>
                  <th className="py-1.5 pr-2 text-right font-bold">Beverly 2025</th>
                  <th className="py-1.5 pr-2 text-right font-bold">Beverly 2026</th>
                  <th className="py-1.5 pr-2 text-right font-bold">Change</th>
                  <th className="py-1.5 text-right font-bold">State 2026</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Grades 3–8 English", 45, 45, 40],
                  ["Grades 3–8 math", 51, 51, 41],
                  ["Grades 5 and 8 science", 43, 48, 41],
                  ["Grade 10 English", 45, 43, 45],
                  ["Grade 10 math", 39, 43, 44],
                  ["Grade 10 science", 49, 41, 41],
                ].map(([test, b25, b26, st]) => {
                  const d = Number(b26) - Number(b25);
                  return (
                    <tr key={test} className="border-b border-rule">
                      <td className="py-1.5 pr-2">{test}</td>
                      <td className="py-1.5 pr-2 text-right text-ink-mid">{b25}%</td>
                      <td className="py-1.5 pr-2 text-right font-bold">{b26}%</td>
                      <td
                        className={`py-1.5 pr-2 text-right font-semibold ${
                          d > 0 ? "text-accent" : d < 0 ? "text-debt" : "text-ink-faint"
                        }`}
                      >
                        {d > 0 ? `+${d}` : d < 0 ? `−${-d}` : "0"}
                      </td>
                      <td className="py-1.5 text-right text-ink-mid">{st}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={BODY}>
            The state also rates each school on progress toward its own targets. The district
            and the Middle School made moderate progress. All five elementary schools made
            substantial progress, and Cove Elementary was named one of the state&apos;s 2026
            Schools of Recognition.
          </p>
          <p className={BODY}>
            Beverly High is listed as requiring assistance or intervention for one reason:
            students with disabilities took{" "}
            <Fig>165</Fig>{" "}
            of their{" "}
            <Fig>177</Fig>{" "}
            tests, 93%, short of the 95% every group must reach. The state requires a school
            flagged this way to identify the causes and address them this school year. Students
            with disabilities can take MCAS with accommodations or in an alternate form, and the
            state&apos;s guidance says each student&apos;s education plan should spell out how,
            not whether, the student is tested.
          </p>
          <p className={BODY}>
            The district presents its own results to the School Committee&apos;s curriculum
            subcommittee: the elementary schools in October, the middle and high schools in
            November.{" "}
            <Moment src={CISL23} s={2721} />
          </p>
          <Refs
            sources={
              <>
                <Src href="https://profiles.doe.mass.edu/mcas/achievement_level.aspx?linkid=32&orgcode=00300000&orgtypecode=5&fycode=2026">
                  Beverly results, 2026
                </Src>
                <Src href="https://profiles.doe.mass.edu/accountability/report/district.aspx?linkid=30&orgcode=00300000&orgtypecode=5&fycode=2026">
                  Beverly accountability report
                </Src>
                <Src href="https://www.doe.mass.edu/accountability/lists-tools/low-participation-guidance.docx">
                  State guidance on low participation
                </Src>
                <Src href={CISL23}>Subcommittee recording</Src>
              </>
            }
            more={
              <>
                <Src href="https://www.wbur.org/news/2026/09/22/massachusetts-mcas-test-exam-results-reading-math">
                  WBUR on the state results
                </Src>
                <Src href="https://www.doe.mass.edu/accountability/recognition.html">
                  Schools of Recognition
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section id="enon" data-dek={"The Planning Board sets hearing dates for the 179 apartments proposed for the Stop & Shop site, including 22 affordable units and fewer parking spaces than zoning requires."} className={SECTION}>
          <Eyebrow>04 &middot; Development</Eyebrow>
          <H2>Stop &amp; Shop site: the Planning Board takes it up</H2>
          <From>Planning Board agenda, Tuesday, October 6</From>
          <p className={BODY}>
            The proposal for 37 Enon Street,{" "}
            <Fig>179</Fig>{" "}
            apartments and about 2,600 square feet of retail in place of the North Beverly Stop
            &amp; Shop if the store does not renew its lease, is now before the Planning Board,
            which sets its hearing dates on October 6. The board&apos;s agenda adds detail: 60%
            of the apartments would have one bedroom and 40% two, and{" "}
            <Fig>22</Fig>, or 12%, would be affordable to households at or below 60% of the area
            median income. The developer is asking for a special permit to build{" "}
            <Fig>281</Fig>{" "}
            parking spaces where zoning requires{" "}
            <Fig>367</Fig>, or 1.5 per apartment. The Zoning Board of Appeals&apos; decision on
            the building&apos;s height has not been posted yet.{" "}
            <Earlier issue={3} slug="2026-09-28" id="enon" />.
          </p>
          <Refs
            sources={
              <>
                <Src href={PB_1006}>Planning Board agenda, Oct 6</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, without video:</b>{" "}
            the Council&apos;s budget analyst screening committee, in closed session to interview
            candidates, on Monday; an Airport Commission subcommittee on its rules of order,
            online, on Tuesday; the Open Space and Recreation Committee on Wednesday; and the
            License Board on Thursday. For those, the record is the posted agenda now and the
            minutes once they are approved.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        <h2 className="mt-16 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          Tonight{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            Monday, October 5
          </span>
        </h2>

        <p className={BODY}>
          The City Council meets at 7:00pm in the Beverly Middle School library, 502 Cabot St,
          its first meeting there while City Hall is renovated. To speak at public comment, sign up with the city clerk by 9:30 the morning of the
          meeting.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <AddToCalendar
            event={{
              id: "council-2026-10-05",
              title: "Beverly City Council",
              start: "2026-10-05T23:00:00Z",
              end: "2026-10-06T02:00:00Z",
              location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
            }}
          />
          <a
            href={PACKET_1005}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
            data-track="source_opened"
            data-placement="agenda-button"
          >
            Tonight&apos;s agenda and packet
          </a>
        </div>

        {/* ---- 05 ---- */}
        <section id="datacenters" data-dek={"The Mayor proposed pausing data center applications until the city writes zoning rules for them. Tonight starts the process; adoption takes public hearings and a two-thirds Council vote."} className={SECTION}>
          <Eyebrow>05 &middot; Tonight &middot; New</Eyebrow>
          <H2>A proposed pause on data centers</H2>
          <From>
            City Council, tonight &middot; Order #250, submitted by the Mayor and Planning
            Director Darlene Wynne
          </From>
          <p className={BODY}>
            Beverly&apos;s zoning code does not list data centers as an allowed use or restrict
            them.{" "}
            <b>Order #250</b>{" "}
            would pause them while the city writes rules. Until the Council adopts a zoning
            ordinance for data centers, or through November 30, 2027, whichever comes first, the
            city would not accept, process or approve any application for one, from building
            permits to special permits and site plan approval.
          </p>
          <p className={BODY}>
            The draft defines a data center as a building whose main use is housing servers,
            storage and networking equipment. The letter says the time would go to studying the
            effects on public safety, electrical demand, water, sewer, roads, noise, the
            environment and the character of the community, with the draft adding the school
            district, and then to writing rules. It does not mention any specific proposal.
          </p>
          <p className={BODY}>
            Tonight is a first step, not the vote. A zoning change goes to the Planning Board,
            and both the board and the Council must hold a public hearing within 65 days; the
            board&apos;s October 6 agenda already lists setting a date. Adopting it takes a
            two-thirds vote of the full Council, six of nine.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=37`}>Letter and draft (p. 37)</Src>
                <Src href={PB_1006}>Planning Board agenda, Oct 6</Src>
                <Src href={`${MGL}/PartI/TitleVII/Chapter40A/Section5`}>State zoning law, c. 40A &sect;5</Src>
              </>
            }
          />
        </section>

        {/* ---- 06 ---- */}
        <section id="trees" data-dek={"The Council takes its final vote on fines for private trees and shrubs that block the sidewalk. Street trees between the curb and the sidewalk are the city's to maintain."} className={SECTION}>
          <Eyebrow>06 &middot; Tonight &middot; Final vote</Eyebrow>
          <H2>Overgrown trees and shrubs on private property: the final vote</H2>
          <From>
            City Council, tonight &middot; Order #221, final passage, submitted by the Mayor
          </From>
          <p className={BODY}>
            Tonight is the final vote on the ordinance about trees and shrubs that block a street
            or sidewalk, unchanged since its first vote. An owner would get a warning, then a{" "}
            <Fig>$100</Fig>-a-day fine. If the growth still is not cut back, the city could trim it
            and bill the owner, with a lien if the bill goes unpaid for 60 days.{" "}
            <Earlier issue={3} slug="2026-09-28" id="sidewalks" />.
          </p>
          <p className={BODY}>
            The question readers asked most was about trees along the sidewalk that may belong to
            the city. The bill and the lien apply only to vegetation on private property. Trees in
            the strip between the curb and the sidewalk are street trees: public, and cared for
            by the city at its own cost. If one is causing a problem, report it on the{" "}
            <a href="https://beverlyma.qscend.com/311" target="_blank" rel="noopener" className="rlink">
              MyBeverly website
            </a>{" "}
            (it asks you to create a login) or call Public Services at 978-921-6053.
          </p>
          <p className={BODY}>
            For trees and shrubs on your own land, the standard is{" "}
            <Fig>8 feet</Fig>{" "}
            of clear space above the sidewalk and{" "}
            <Fig>14 feet</Fig>{" "}
            above the street, and nothing taller than 30 inches within 30 feet of a corner, where
            drivers need to see.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=113`}>Letter and ordinance (p. 113)</Src>
                <Src href="https://ecode360.com/29321368">Beverly tree ordinance, ch. 261</Src>
                <Src href={`${MGL}/PartI/TitleXIV/Chapter87/Section1`}>State shade tree law, c. 87</Src>
              </>
            }
          />
        </section>

        {/* ---- 07 ---- */}
        <section id="oversight" data-dek={"Councilor St. Hilaire proposed requiring Council approval for out-of-state travel by the administration and for contracts longer than three years."} className={SECTION}>
          <Eyebrow>07 &middot; Tonight &middot; New</Eyebrow>
          <H2>Two proposals for more Council say over travel and long contracts</H2>
          <From>City Council, tonight &middot; Orders #259 and #260, filed by Councilor St. Hilaire</From>
          <p className={BODY}>
            Councilor Matthew St. Hilaire, who represents Ward 6 and is the Council&apos;s vice
            president, filed two draft ordinances. Under the Council&apos;s rules, new business
            goes to a committee before any vote.
          </p>
          <p className={BODY}>
            <b>Order #259</b>{" "}
            would require a Council vote, requested 14 business days ahead, before city money
            pays for out-of-state travel by the Mayor or anyone in the executive branch. Each
            person would be capped at two trips a year and would report back after each one.
            Emergencies are exempt.
          </p>
          <p className={BODY}>
            It follows June&apos;s budget votes. St. Hilaire moved to zero out the Mayor&apos;s
            office expense line,{" "}
            <Fig>$13,500</Fig>{" "}
            that pays for travel among other things, saying the Mayor should not travel out of
            state while police, fire and school jobs were being cut.{" "}
            <Moment src={BUD23} s={1441} />{" "}The Council instead adopted Councilor
            Houseman&apos;s amendment cutting the line to{" "}
            <Fig>$10,000</Fig>, 9 to 0.{" "}
            <Moment src={BUD23} s={2114} />{" "}The Mayor said conferences bring value home, and
            that the same line also paid this year for a restroom trailer at the high school field
            and for a nonprofit program whose participants painted about 300 fire hydrants.{" "}
            <Moment src={BUD23} s={1678} />{" "}
            <Moment src={BUD23} s={1832} />
          </p>
          <p className={BODY}>
            <b>Order #260</b>{" "}
            would require a majority vote of the Council before any city official, including the
            Mayor, signs a contract, lease or agreement for services, supplies or equipment that
            could run longer than three years, counting renewal options. St. Hilaire writes that
            it mirrors state procurement law. His letter points to the five-year trash and
            recycling contract with Casella that the Mayor announced in June, which he says was
            signed without the Council&apos;s approval.
          </p>
          <p className={BODY}>
            Today, Beverly&apos;s charter makes the Mayor the city&apos;s chief procurement
            officer, and we found no rule on contract length in the city&apos;s own code.
          </p>
          <p className={BODY}>
            Nearby communities handle it differently. Salem writes a council-vote rule for contracts
            over three years into its ordinances, as #260 would, and used it in 2024 to approve a
            20-year energy contract. Peabody and Gloucester vote on each long contract as it comes up; Peabody did so in
            2023 for a fire engine lease. Ipswich goes the other way: in 2025 its Town Meeting
            gave the town manager blanket permission for contracts of up to five years. Those are
            four communities we checked, not a survey.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=74`}>Travel letter and draft (p. 74)</Src>
                <Src href={`${PACKET_1005}#page=78`}>Contracts letter and draft (p. 78)</Src>
                <Src href={BUD23}>June 23 budget vote, recording</Src>
              </>
            }
            more={
              <>
                <Src href={`${MGL}/PartI/TitleIII/Chapter30B/Section12`}>State procurement law, c. 30B &sect;12</Src>
                <Src href="https://www.salemma.gov/ArchiveCenter/ViewFile/Item/1237">Salem&apos;s 2024 vote</Src>
                <Src href="https://peabody-ma.gov/pdf_minutes/city_council/071323%20REG.%20MEETING%20MINS.pdf">
                  Peabody&apos;s 2023 vote
                </Src>
                <Src href="https://www.ipswichma.gov/DocumentCenter/View/18424/2025-10-28-Special-Town-Meeting-Record-of-Action#page=8">
                  Ipswich&apos;s 2025 vote (p. 8)
                </Src>
              </>
            }
          />
        </section>

        {/* ---- 08 ---- */}
        <section id="agenda" data-dek={"The rest of tonight's agenda, including a city program that helps low-income homeowners with repairs."} className={SECTION}>
          <Eyebrow>08 &middot; Tonight</Eyebrow>
          <H2>Also on the agenda</H2>
          <ul className="mt-4 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>Human Rights Committee quorum, final vote.</b>{" "}
              Order #222 would let the committee count a quorum from the members it has,
              rather than from its eleven seats.{" "}
              <Earlier issue={3} slug="2026-09-28" id="humanrights" />.
            </li>
            <li>
              <b>$20,000 for the Human Rights Committee.</b>{" "}
              Councilor Houseman&apos;s request, Order #213, is still in Finance and Property.{" "}
              <Earlier issue={3} slug="2026-09-28" id="humanrights" />.
            </li>
            <li>
              <b>Flock cameras.</b>{" "}
              The review of the city&apos;s license plate reader cameras, Order #120, stays in
              committee ahead of the joint meeting on October 19.
            </li>
            <li>
              <b>Help with home repairs.</b>{" "}
              The city&apos;s Homeowner Rehabilitation Program, run with Essex County Habitat for
              Humanity, offers no-interest, no-payment 15-year forgivable loans to low-income
              owners for code and accessibility repairs, on one- to four-unit homes they live in.
              The program says funds remain. Call 978-605-2346 or see{" "}
              <a
                href="https://www.essexcountyhabitat.org/beverly-housing-rehab/"
                target="_blank"
                rel="noopener"
                className="rlink"
              >
                Habitat&apos;s page
              </a>
              .
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_1005}#page=1`}>Council agenda (p. 1)</Src>
                <Src href={`${PACKET_1005}#page=72`}>Home repair letter (p. 72)</Src>
              </>
            }
          />
        </section>

        {/* ---- 09 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Further out{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 3
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

      </div>
    </div>
  );
}
