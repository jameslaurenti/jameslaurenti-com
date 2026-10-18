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

const Note = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 max-w-[63ch] rounded-r border-l-[3px] border-accent bg-accent-glow px-4 py-3 text-[1rem] leading-[1.7]">
    {children}
  </div>
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
const DRC15 = `${V}lYnHXAjyqxE`;
const DRC14 = `${V}O8Kxggwls3A`;
const FLOCK0421 = `${V}9O_ifUaTQJs`;
const FLOCK1019 = `${V}x_567bYRlvc`;
const CC1019 = `${V}Oh_fs6QibXs`;
const MGL = "https://malegislature.gov/Laws/GeneralLaws";
const CH70_FY27 = "https://www.doe.mass.edu/finance/chapter70/fy2027/chapter-2027.html";
const SC14 = `${V}x_MrkYQd68M`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DRC_AGENDA_1015 = `${AGENDA}/ViewFile/Agenda/_10152026-2953`;
const DRC_AGENDA_1020 = `${AGENDA}/ViewFile/Agenda/_10202026-2961`;
const FLOCK_AGENDA = `${AGENDA}/ViewFile/Agenda/_10192026-2927`;
const PACKET_1019 = `${AGENDA}/ViewFile/Agenda/_10192026-2958`;
const FLOCK_MINUTES_0421 = `${AGENDA}/ViewFile/Minutes/_04212026-2720`;
const ALPR_POLICY = "https://beverlypolice.org/wp-content/uploads/2026/04/ALPR-2026-GO-02.pdf";
const SC_AGENDA_1014 =
  "https://4.files.edl.io/7a24/10/09/26/180350-bf4a8e99-1149-46ac-83b1-580eab12abc8.pdf";
const SC_FEES = "https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2088421&type=d";
const ELECTION = "https://www.beverlyma.gov/817/Upcoming-Election";
const SOS = "https://www.sec.state.ma.us";
const SOS_CHECK = `${SOS}/VoterRegistrationSearch/MyVoterRegStatus.aspx`;
const SOS_REGISTER = `${SOS}/ovr/`;
const SOS_MAIL = `${SOS}/divisions/elections/voting-information/vote-by-mail.htm`;
const SOS_WHERE = `${SOS}/WhereDoIVoteMA/WhereDoIVote`;
const TRASH_CAL = "https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["deficit", "What the deficit committee plans to present Tuesday"],
  ["lockdown", "After an accidental lockdown, a fix at the Middle School"],
  ["finance", "The schools hire an interim finance director"],
  ["fees", "The schools are looking for residents to help review fees"],
  ["flock", "Tonight: the city's Flock cameras, back before the Council"],
  ["ahead", "Coming up, through November 16"],
  ["corrections", "Corrections"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Oct 20",
    what: "Deficit Reduction Committee: first public presentation",
    detail:
      "6:00pm at the Council on Aging (the Senior Center), 90 Colon St. About half an hour of slides, then questions from the public.",
    cal: {
      id: "drc-public-2026-10-20",
      title: "Deficit Reduction Committee: first public presentation",
      start: "2026-10-20T22:00:00Z",
      end: "2026-10-20T23:30:00Z",
      location: "Beverly Council on Aging (Senior Center), 90 Colon St, Beverly, MA",
    },
  },
  {
    date: "Oct 21",
    what: "Board of Health",
    detail:
      "6:30pm at the Council on Aging, 90 Colon St. A proposal from Councilor Sonia to bar construction on state holidays through the city's noise rules, and an update on opioid settlement money.",
    cal: {
      id: "boh-2026-10-21",
      title: "Beverly Board of Health",
      start: "2026-10-21T22:30:00Z",
      end: "2026-10-22T00:00:00Z",
      location: "Beverly Council on Aging, 90 Colon St, Beverly, MA",
    },
  },
  {
    date: "Oct 21",
    what: "Clean Energy Advisory Committee",
    detail:
      "6:30pm in the library's Sohier Room, 32 Essex St, and online. City updates include the proposed data center pause.",
    cal: {
      id: "clean-energy-2026-10-21",
      title: "Beverly Clean Energy Advisory Committee",
      start: "2026-10-21T22:30:00Z",
      end: "2026-10-22T00:00:00Z",
      location: "Beverly Public Library, Sohier Room, 32 Essex St, Beverly, MA",
    },
  },
  {
    date: "Oct 22",
    what: "Economic and Community Development Council",
    detail:
      "8:30am at the temporary City Hall, 175 Cabot St. The Rogers Building on Cabot Street; a state presentation on a tax break cities can offer for downtown housing (urban center housing TIF); and the Bass River Overlay District.",
    cal: {
      id: "ecdc-2026-10-22",
      title: "Beverly Economic and Community Development Council",
      start: "2026-10-22T12:30:00Z",
      end: "2026-10-22T14:00:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 26",
    what: "Camp Paradise public meeting",
    detail:
      "6:00pm in the Barnet Gallery at the library, 32 Essex St. A Council committee meeting on the city's use of and plans for Camp Paradise, 44 Cole St, requested by Councilors Mullady and St. Hilaire.",
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
    what: "Planning Board and Conservation Commission",
    detail:
      "Planning Board 7:00pm at the Police Department, 175 Elliott St; Conservation Commission 6:30pm online. Agendas not posted yet.",
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
    date: "Oct 28",
    what: "School Committee subcommittees",
    detail:
      "6:00pm at the Middle School: Finance and Facilities, with the athletic department report, and Curriculum, Instruction and Student Life. Committee of the Whole at 7:15pm.",
  },
  {
    date: "Nov 3",
    what: "State election",
    detail: "Polls open 7:00am to 8:00pm. The city's election page lists each ward's polling place.",
    cal: {
      id: "state-election-2026-11-03",
      title: "Massachusetts state election",
      start: "2026-11-03",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Nov 4",
    what: "School Committee",
    detail: "6:00pm in the Middle School library, 502 Cabot St, and online.",
  },
  {
    date: "Nov 9",
    what: "City Council: data center hearing",
    detail:
      "Regular meeting. The public hearing on the proposed data center pause is set for 7:30pm.",
    cal: {
      id: "council-2026-11-09",
      title: "Beverly City Council: data center pause hearing",
      start: "2026-11-10T00:30:00Z",
      end: "2026-11-10T02:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 11",
    what: "Veterans Day",
    detail: "Trash and recycling run one day late for the rest of the week.",
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue6() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 6. Set to
          "2026-10-19" when publishing. */}
      <PageTracking surface="digest" issue="2026-10-19-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 6 &middot; Week of October 19
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering October 12 to 18, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            This issue is mostly a preview of the week ahead. Tonight two Council committees
            take a second look at the city&apos;s Flock cameras. Tomorrow night the Deficit
            Reduction Committee presents its ideas to the public for the first time; members
            worked through that presentation together last Thursday, and the recording shows
            what to expect. From the schools: an interim finance director, a fix after an accidental
            lockdown at the Middle School, and a call for residents to serve on a committee that
            will review school fees.
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
            October 12 to 18
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="deficit"
          data-dek={"The Deficit Reduction Committee presents to the public for the first time Tuesday at 6pm at the Senior Center. Its run-through last Thursday shows what to expect: research on fees, health insurance, payments from tax-exempt institutions and longer-term ideas, with some ideas already set aside, then questions."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Deficit Reduction Committee</Eyebrow>
          <H2>What the deficit committee plans to present Tuesday</H2>
          <From>Deficit Reduction Committee &middot; Thursday, October 15, a run-through for Tuesday</From>
          <Hear
            src={DRC15}
            s={15}
            title="The committee discusses its plan for Tuesday"
            meeting="Deficit Reduction Committee, Oct 15"
          />
          <p className={BODY}>
            The Deficit Reduction Committee presents to the public for the first time Tuesday at
            6:00pm at the Council on Aging (the Senior Center), 90 Colon St: about half an hour of
            slides, then questions. Raise a hand to ask, or send questions ahead to the chair,
            Councilor Kathleen Feldman. The committee plans to post the slides afterward.{" "}
            <Moment src={DRC15} s={944} /> <Moment src={DRC15} s={166} />{" "}
            <Moment src={DRC15} s={3361} /> <Moment src={DRC15} s={759} />
          </p>
          <Note>
            <b>Not a plan.</b>{" "}
            The committee researches and advises; the Mayor and the Council decide the budget. A
            topic below is not a recommendation, and the slides could still change. Where the
            committee sorted an idea on September 28, we say where it landed.{" "}
            <Moment src={DRC15} s={2694} />{" "}
            <Earlier issue={5} slug="2026-10-12" id="how-it-works" label="who controls the city budget" />
          </Note>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Ideas for saving money or raising revenue
          </h3>
          <ul className={LIST}>
            <li>
              <b>Health insurance.</b>{" "}Two ideas:
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  <b>Who pays the premiums.</b>{" "}
                  Shifting more of the cost from the city to employees and retirees. For
                  employees, that must be negotiated with their unions.{" "}
                  <Moment src={DRC15} s={433} />
                </li>
                <li>
                  <b>A larger insurance pool.</b>{" "}
                  Joining the state&apos;s Group Insurance Commission instead of running the
                  city&apos;s own plan. In September the finance director told the committee a
                  comparable state plan costs slightly less today, but that running its own plan,
                  with its own trust fund, lets the city cushion premium increases in rough years;
                  the state plan has at times raised premiums by double digits.{" "}
                  <Moment src={DRC14} s={4553} /> <Moment src={DRC14} s={4659} />{" "}A member
                  said last Thursday that a middle option, the Massachusetts Municipal
                  Association&apos;s pooled health plan for cities and towns, would save less than
                  the state plan but leave the city more control.{" "}
                  <Moment src={DRC15} s={497} />{" "}So the trade-off is a somewhat lower price
                  against less room to soften bad years, with a possible middle ground; what the
                  committee will suggest is not yet clear.
                </li>
              </ul>
            </li>
            <li>
              <b>Payments from tax-exempt institutions.</b>{" "}
              PILOTs and SILOTs: money, or services, that colleges, schools and other tax-exempt
              owners give the city in place of property taxes. Payments add revenue; services
              cover something the city would otherwise pay for. On September 28, members backed
              forming a committee to seek more of them; the recommendation is the committee, not
              a dollar figure.{" "}
              <Moment src={DRC15} s={655} /> <Moment src={DRC15} s={790} />
            </li>
            <li>
              <b>Fees.</b>{" "}Two ideas members saw as workable on September 28:
              <ul className="mt-1.5 list-[circle] space-y-1.5 pl-5">
                <li>
                  Registration fees for the summer drop-off program and day camps.{" "}
                  <Moment src={DRC15} s={1241} />
                </li>
                <li>
                  Higher parking rates, or paid parking in more areas.{" "}
                  <Moment src={DRC15} s={1642} />
                </li>
              </ul>
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Longer-term investments
          </h3>
          <p className={BODY}>
            Two ideas that would cost money up front, with any savings coming over years: a
            city-run electric utility, and a recycling center for hard-to-recycle items. Members
            acknowledged the timing; one said it is hard to consider that kind of upfront cost
            during a deficit.{" "}
            <Moment src={DRC15} s={2043} /> <Moment src={DRC15} s={2480} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Early ideas, not ready to present
          </h3>
          <p className={BODY}>
            One slide lists ideas members said they have only started to look at: sharing
            services with other communities; audits of non-health insurance and of school
            efficiency; the future of Hurd Stadium and Cooney Field; and a policy on personal use
            of city vehicles.{" "}
            <Moment src={DRC15} s={2588} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Looked at and set aside
          </h3>
          <ul className={LIST}>
            <li>
              <b>Pension payments.</b>{" "}
              The city&apos;s yearly payment into its pension fund had been rising 4.5% a year, a
              step of roughly{" "}
              <Fig>$700,000</Fig>{" "}
              next year. In September the finance director, who chairs the retirement board, told
              the committee the board had adopted a new schedule that holds the payment at its
              current level and still reaches full funding by 2032.{" "}
              <Moment src={DRC14} s={5889} /> <Moment src={DRC14} s={5974} />{" "}So on September
              28, members set aside changing the pension schedule as unnecessary.{" "}
              <Moment src={DRC15} s={306} />
            </li>
            <li>
              <b>Regional dispatch.</b>{" "}
              Beverly runs its own emergency dispatch center. One idea was to save money by
              joining Middleton&apos;s regional center instead, but members learned it has no room
              for Beverly. That research led to a different idea, still being studied:
              Beverly&apos;s center taking on a smaller town&apos;s calls for a fee.{" "}
              <Moment src={DRC15} s={386} /> <Moment src={DRC15} s={420} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Background on how the budget works
          </h3>
          <p className={BODY}>
            Slides meant to explain rather than propose. None is presented as a fix for next
            year&apos;s budget, but members want residents to understand them.
          </p>
          <ul className={LIST}>
            <li>
              <b>Enterprise funds.</b>{" "}
              City operations, such as the golf course and the airport, that are meant to pay for
              themselves from their own fees rather than from the general budget. Slides on the
              golf course, the harbor and the airport look at their fees.{" "}
              <Moment src={DRC15} s={1913} /> <Moment src={DRC15} s={1813} />
            </li>
            <li>
              <b>Overrides.</b>{" "}
              A local vote that lets the city raise more in property taxes than Proposition
              2&frac12;, the state&apos;s tax limit, otherwise allows. The City Council, with the
              Mayor&apos;s approval, decides whether to put one on the ballot, and voters decide
              whether it passes. A member said nearby communities have used overrides to cover
              deficits, that an override would not necessarily be something the committee
              promotes, and that looking at it is part of the committee&apos;s job.{" "}
              <Moment src={DRC15} s={2156} />
            </li>
            <li>
              <b>Chapter 70.</b>{" "}
              The state&apos;s main formula for school aid. This year Beverly received the
              smallest increase the formula guarantees, $160 per student, as most districts in
              the state did. The slide&apos;s author called it an explanation rather than a
              proposal, with one suggested next step: the city pressing state leaders for more
              school aid.{" "}
              <Moment src={DRC15} s={1145} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            How Beverly compares
          </h3>
          <p className={BODY}>
            A first look at how Beverly compares with 26 communities chosen by city staff, which
            members said are not all direct peers.{" "}
            <Moment src={DRC15} s={2626} />
          </p>

          <p className={BODY}>
            <b>After Tuesday.</b>{" "}
            The committee&apos;s draft schedule has two tracks. For next year&apos;s budget, which
            starts in July: in December, alongside the city&apos;s financial forecast, more
            presentations to people inside and outside city government and public input on
            recommendations. For the longer term: in January, a list of bigger changes for the
            year after; ward-by-ward meetings on it in February and March; and in April, the
            committee&apos;s long-term recommendations to the City Council. Members also plan
            smaller listening sessions; no dates are set.{" "}
            <Moment src={DRC15} s={3520} /> <Moment src={DRC15} s={3560} />{" "}
            <Moment src={DRC15} s={3069} />
          </p>
          <Refs
            sources={
              <>
                <Src href={DRC_AGENDA_1020}>Tuesday&apos;s agenda</Src>
                <Src href={DRC_AGENDA_1015}>Committee agenda, Oct 15</Src>
                <Src href={DRC15}>Full recording, Oct 15</Src>
                <Src href={DRC14}>Full recording, Sep 14</Src>
              </>
            }
            more={
              <>
                <Earlier issue={4} slug="2026-10-05" id="deficit" label="the September 28 sort" />
                <Earlier issue={2} slug="2026-09-21" id="pension" label="the pension payment" />
                <Src href={`${MGL}/PartI/TitleIX/Chapter59/Section21C`}>
                  Override law, c. 59 &sect;21C
                </Src>
                <Src href={CH70_FY27}>State school aid, FY2027</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="lockdown"
          data-dek={"Beverly Middle School went into lockdown by accident. Staff carried out the full protocol on purpose, and a review led the district to limit a backup alarm that was easy to set off by mistake."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Schools</Eyebrow>
          <H2>After an accidental lockdown, a fix at the Middle School</H2>
          <From>School Committee &middot; Wednesday, October 14 &middot; Superintendent&apos;s report</From>
          <Hear
            src={SC14}
            s={860}
            title="The superintendent on the lockdown"
            meeting="School Committee, Oct 14"
          />
          <p className={BODY}>
            Beverly Middle School recently went into lockdown by accident, Superintendent Peter
            Cushing told the School Committee. Staff carried the lockdown through to the end
            instead of calling it off over the loudspeaker. Announcing a mistake, he said, would
            teach people that any lockdown might not be real.{" "}
            <Moment src={SC14} s={860} />
          </p>
          <p className={BODY}>
            A review by school leaders, security staff, the school resource officer and building
            staff found the cause: a backup alarm system that was easy to trigger by pressing the
            wrong button, for instance out of habit when meaning to page the building. The
            district has limited that backup system. He did not say how, to avoid giving out
            details of the school&apos;s security, and offered to discuss them in a closed
            session.{" "}
            <Moment src={SC14} s={898} /> <Moment src={SC14} s={944} />
          </p>
          <p className={BODY}>
            He then met with the police chief, the Mayor, the head of the city&apos;s public
            services department and building staff, with a last meeting set for Friday to close
            out the review and line up procedures at the other schools. About four parents
            contacted him, and he sent families a memo.{" "}
            <Moment src={SC14} s={944} /> <Moment src={SC14} s={981} />
          </p>
          <Refs
            sources={
              <>
                <Src href={SC_AGENDA_1014}>Committee agenda, Oct 14 (item 5E)</Src>
                <Src href={SC14}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="finance"
          data-dek={"The schools' director of finance job is open. The School Committee hired a former Beverly schools finance director as a part-time interim and set up the search for a permanent hire."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Schools</Eyebrow>
          <H2>The schools hire an interim finance director</H2>
          <From>School Committee &middot; Wednesday, October 14</From>
          <Hear
            src={SC14}
            s={4113}
            title="The superintendent introduces the interim director"
            meeting="School Committee, Oct 14"
          />
          <p className={BODY}>
            The schools&apos; director of finance job is open, and the School Committee voted
            8-0 to fill it in the meantime.{" "}
            <Moment src={SC14} s={4272} />{" "}The interim director worked in Beverly&apos;s
            schools for about 20 years, rising to finance director, then spent about 16 years in
            Amesbury&apos;s schools before retiring, Superintendent Peter Cushing said. She works
            two and a half days a week under a contract that took effect October 15.{" "}
            <Moment src={SC14} s={4113} /> <Moment src={SC14} s={4190} />
          </p>
          <p className={BODY}>
            <b>The permanent job.</b>{" "}
            The committee also approved a new job description, focused on finance alone, with
            more weight on internal controls and on forecasting three to five years ahead, and a
            plan that splits the office&apos;s duties among other staff until the job is filled.{" "}
            <Moment src={SC14} s={3564} /> <Moment src={SC14} s={4732} />{" "}The superintendent
            said the district will actively recruit rather than only post the job, since
            several nearby districts are hiring for the same role.{" "}
            <Moment src={SC14} s={3927} /> <Moment src={SC14} s={3967} />
          </p>
          <Refs
            sources={
              <>
                <Src href={SC_AGENDA_1014}>Committee agenda, Oct 14 (items 5H to 5K)</Src>
                <Src href={SC14}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="fees"
          data-dek={"The schools are forming a committee to review the fees families pay, such as athletic and bus fees, starting in November. The superintendent is looking for residents and a city councilor to serve."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; Schools</Eyebrow>
          <H2>The schools are looking for residents to help review fees</H2>
          <From>School Committee &middot; Wednesday, October 14 &middot; Superintendent&apos;s report</From>
          <Hear
            src={SC14}
            s={3221}
            title="The superintendent on the fee review committee"
            meeting="School Committee, Oct 14"
          />
          <p className={BODY}>
            The schools are forming a committee to review the fees families pay, Superintendent
            Peter Cushing said. The district&apos;s finance director would normally lead it; with
            that job open, its start was pushed to November. He is looking for residents and a
            city councilor to serve, and one parent has volunteered so far. He said the call for
            members would go out in the district&apos;s newsletter.{" "}
            <Moment src={SC14} s={3221} /> <Moment src={SC14} s={3259} />{" "}
            <Moment src={SC14} s={3298} />
          </p>
          <p className={BODY}>
            <b>What it reviews.</b>{" "}
            This school year&apos;s fees are already set. They include{" "}
            <Fig>$115 to $350</Fig>{" "}
            per sport for athletics and{" "}
            <Fig>$346.50</Fig>{" "}
            for bus transportation, with a family maximum of{" "}
            <Fig>$693</Fig>, and need-based help is available for each. The committee looks at
            fees going forward, and the superintendent tied its work to the district&apos;s
            coming budget discussions.{" "}
            <Moment src={SC14} s={3259} />{" "}Athletic fees come up at the School
            Committee&apos;s Finance and Facilities subcommittee on October 28, with the athletic
            department&apos;s report, the chair said.{" "}
            <Moment src={SC14} s={1537} />
          </p>
          <Refs
            sources={
              <>
                <Src href={SC_FEES}>The district&apos;s fees and scholarships</Src>
                <Src href={SC14}>Full recording</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted yet:</b>{" "}
            the Parking and Traffic Commission on Tuesday; the Council&apos;s budget analyst
            screening committee on Wednesday; the Community Preservation Committee on Thursday;
            and the Airport Commission, the Golf and Tennis Commission, the Council on Aging board
            and the Housing Authority. For those, the record is the posted agenda now and the
            minutes once they are approved.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        <h2 className="mt-16 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          Tonight{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            Monday, October 19
          </span>
        </h2>

        <p className={BODY}>
          Two meetings, back to back, in the Beverly Middle School library, 502 Cabot St: two
          Council committees on the Flock cameras at 6:00pm, then the City Council at
          7:00pm. BevCam carries both live:{" "}
          <Src href={FLOCK1019}>the 6:00pm meeting</Src>,{" "}
          <Src href={CC1019}>the 7:00pm meeting</Src>.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <AddToCalendar
            event={{
              id: "flock-joint-2026-10-19",
              title: "Beverly: Flock cameras joint committee meeting",
              start: "2026-10-19T22:00:00Z",
              end: "2026-10-19T22:55:00Z",
              location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
            }}
          />
          <a
            href={PACKET_1019}
            target="_blank"
            rel="noopener"
            className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
            data-track="source_opened"
            data-placement="agenda-button"
          >
            Tonight&apos;s Council agenda and packet
          </a>
        </div>

        {/* ---- 05 ---- */}
        <section
          id="flock"
          data-dek={"Two Council committees review the city's four Flock cameras and its contract with Flock Safety tonight at 6pm, their second look since April. What the cameras do, the rules for using them, and what was said in April."}
          className={SECTION}
        >
          <Eyebrow>05 &middot; Tonight, 6:00pm</Eyebrow>
          <H2>The city&apos;s Flock cameras, back before the Council</H2>
          <From>
            Legal Affairs and Public Services committees, with the Committee of the Whole &middot;
            Order #120, filed by Councilors Rotondo and Spang
          </From>
          <Hear
            src={FLOCK0421}
            s={853}
            title="Police in April on where the cameras are, and why"
            meeting="Joint committee meeting, Apr 21"
          />
          <p className={BODY}>
            Two Council committees meet at 6:00pm to review the city&apos;s Flock cameras, the
            license plate readers the police department uses, and the city&apos;s contract with
            Flock Safety. It is their second meeting on the cameras; the first was on April 21.
            The agenda lists no vote and does not mention public comment. At the April meeting
            the chair took one-minute comments from anyone who came to the podium, with no
            sign-up, and questions to the police came from councilors, some sent ahead of time.{" "}
            <Moment src={FLOCK0421} s={2069} /> <Moment src={FLOCK0421} s={53} />
          </p>
          <p className={BODY}>
            <b>What Beverly has.</b>{" "}
            Four cameras on city property: on Rantoul Street near School Street, Cabot Street at
            Beckford Street, Brimbal Avenue near Otis Road, and Elliott Street at McKay Street.{" "}
            <Moment src={FLOCK0421} s={853} />{" "}Police said the first two began as a trial;
            the Elliott Street camera went up in September 2024 and the Brimbal Avenue one in May
            2025.{" "}
            <Moment src={FLOCK0421} s={1008} /> <Moment src={FLOCK0421} s={1056} />{" "}
            <Moment src={FLOCK0421} s={1095} />{" "}They cost{" "}
            <Fig>$3,000</Fig>{" "}
            each a year,{" "}
            <Fig>$12,000</Fig>{" "}
            in all, paid from drug forfeiture money and the police department&apos;s technology
            budget.{" "}
            <Moment src={FLOCK0421} s={3068} /> <Moment src={FLOCK0421} s={3109} />{" "}The
            cameras take still pictures of the backs of vehicles, reading the plate and details
            such as the type of vehicle, not faces, and check plates against lists such as stolen
            cars, warrants and Amber Alerts. Officers must confirm a match before acting on it.{" "}
            <Moment src={FLOCK0421} s={740} /> <Moment src={FLOCK0421} s={823} />{" "}
            <Moment src={FLOCK0421} s={1421} />
          </p>
          <p className={BODY}>
            <b>The rules.</b>{" "}
            The police department&apos;s policy, in effect since April 15, keeps the data for 30
            days unless it is saved for an investigation, limits access to trained officers and
            dispatchers, and requires monthly audits. It bars using the cameras for civil traffic
            violations or matters of reproductive health, and bars sharing the data for civil
            immigration enforcement, naming ICE and Customs and Border Protection. In April,
            police said the city owns the data under its contract, Flock stores it, and no federal
            agency had access.{" "}
            <Moment src={FLOCK0421} s={1732} /> <Moment src={FLOCK0421} s={1972} />
          </p>
          <p className={BODY}>
            <b>What was said in April.</b>
          </p>
          <ul className={LIST}>
            <li>
              <b>Police</b>{" "}called the cameras one investigative tool among many and described
              cases they helped solve, including a Cabot Street arson, using Salem&apos;s cameras,
              and a home invasion in Prides Crossing.{" "}
              <Moment src={FLOCK0421} s={122} /> <Moment src={FLOCK0421} s={190} />{" "}
              <Moment src={FLOCK0421} s={445} />
            </li>
            <li>
              <b>Residents.</b>{" "}
              Most who spoke raised concerns about privacy, data sharing or the company; one
              argued that drivers can avoid the cameras by not driving past them.{" "}
              <Moment src={FLOCK0421} s={2104} /> <Moment src={FLOCK0421} s={2582} />
            </li>
            <li>
              <b>Councilor Sonia</b>{" "}asked about other vendors with stronger privacy protections
              and said he would support looking at them. The police chief replied that Flock is
              the system most nearby departments use, which is what lets them share information.{" "}
              <Moment src={FLOCK0421} s={2784} /> <Moment src={FLOCK0421} s={2849} />{" "}
              <Moment src={FLOCK0421} s={2914} />
            </li>
            <li>
              <b>Council President Flowers</b>{" "}said she has confidence in the police department
              but concerns about Flock as a company.{" "}
              <Moment src={FLOCK0421} s={2947} /> <Moment src={FLOCK0421} s={3014} />
            </li>
            <li>
              <b>Councilor Feldman</b>{" "}asked why the price was so low and said she would support
              paying more for a system that better protects privacy.{" "}
              <Moment src={FLOCK0421} s={3131} /> <Moment src={FLOCK0421} s={3175} />
            </li>
            <li>
              <b>Councilor St. Hilaire</b>{" "}asked how often use of the system is audited. At least
              monthly, police said, and the audit records have been released through public
              records requests.{" "}
              <Moment src={FLOCK0421} s={2691} /> <Moment src={FLOCK0421} s={2744} />
            </li>
            <li>
              <b>Representative Hannah Bowen</b>{" "}described state legislation that would add
              privacy protections without taking the tool away.{" "}
              <Moment src={FLOCK0421} s={3263} />
            </li>
            <li>
              <b>The Mayor</b>{" "}said the city was arranging a meeting with Flock&apos;s leadership
              on the concerns raised and whether to continue with the company.{" "}
              <Moment src={FLOCK0421} s={3348} />
            </li>
          </ul>
          <p className={BODY}>
            <b>Since then.</b>{" "}
            The order has stayed in committee since April, and we found no public account of the
            meeting with Flock. In July, Salem decided not to renew its Flock contract and to
            replace those cameras with other units. At the State House, a bill on driver privacy,
            H.3755, has been with the House Ways and Means Committee since March.
          </p>
          <Refs
            sources={
              <>
                <Src href={FLOCK_AGENDA}>Tonight&apos;s committee agenda</Src>
                <Src href={FLOCK0421}>April 21 recording</Src>
                <Src href={`${FLOCK_MINUTES_0421}#page=1`}>April 21 minutes (p. 1)</Src>
                <Src href={ALPR_POLICY}>Police policy, GO 2026-02</Src>
                <Src href="https://malegislature.gov/Bills/194/H3755/BillHistory">H.3755 history</Src>
              </>
            }
            more={
              <>
                <Src href="https://www.boston.com/news/local-news/2026/07/26/salem-joins-list-of-mass-communities-to-reject-surveillance-company-over-data-concerns/">
                  Boston.com on Salem&apos;s decision
                </Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also tonight, 7:00pm, the City Council.</b>{" "}
            No public hearings. The agenda includes making the private stretch of Millbrook Road,
            past Hickory Lane, a public street, with its owners donating the easements, submitted
            by the Mayor; six appointments to city boards; and the Varian cleanup&apos;s monthly
            update. Councilor St. Hilaire&apos;s proposals for Council approval of out-of-state
            travel and of contracts longer than three years are on the Legal Affairs
            committee&apos;s list. The data center pause is not on tonight&apos;s agenda; its
            hearing is November 9.{" "}
            <Src href={`${PACKET_1019}#page=1`}>Agenda (p. 1)</Src>{" "}
            <Src href={`${PACKET_1019}#page=38`}>Millbrook letter (p. 38)</Src>
          </p>
        </div>

        {/* ---- 06 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 16
            </span>
          </h2>
          <div className="mt-5 grid max-w-[63ch] gap-3">
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Voting in the November 3 election
              </p>
              <ul className="mt-2.5 space-y-2 text-[0.97rem] leading-[1.6]">
                <li>
                  <b>Not sure you&apos;re registered?</b>{" "}
                  <Src href={SOS_CHECK}>Check your registration</Src> or{" "}
                  <Src href={SOS_REGISTER}>register online</Src>. The deadline is Saturday,
                  October 24.
                </li>
                <li>
                  <b>Early voting</b>{" "}runs through Friday, October 30, at the temporary City Hall,
                  175 Cabot St, first floor (the former TD Bank). Mondays to Wednesdays 8:30am to
                  4:30pm, Thursdays to 7:30pm, Fridays to 1:00pm; Saturdays 9:00am to 5:00pm,
                  Sundays 9:00am to 1:00pm.
                </li>
                <li>
                  <b>Voting by mail?</b>{" "}Applications must reach the city clerk by 5:00pm on
                  Tuesday, October 27.{" "}
                  <Src href={SOS_MAIL}>How to vote by mail</Src>
                </li>
                <li>
                  <b>Election Day</b>{" "}is Tuesday, November 3, with polls open 7:00am to 8:00pm.{" "}
                  <Src href={SOS_WHERE}>Find your polling place</Src>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Leaf and yard waste pickup
              </p>
              <p className="mt-2.5 text-[0.97rem] leading-[1.6]">
                On your regular trash day the weeks of October 19, November 2, November 16 and
                November 30. Paper bags or open barrels, at the curb by 7:00am, no limit. The yard
                waste site at 16 Standley St is open Mondays, Thursdays and Saturdays, 7:00am to
                3:30pm, through December 19.{" "}
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
            <Src href={ELECTION}>The city&apos;s election page</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>

        {/* ---- 07 ---- */}
        <section id="corrections" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Corrections
          </h2>
          <ul className={LIST}>
            <li>
              Issue 5 gave the temporary City Hall&apos;s address as 195 Cabot St, from a meeting
              agenda. It is 175 Cabot St, the former TD Bank.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
