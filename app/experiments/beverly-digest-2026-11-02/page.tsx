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
const PB1027 = `${V}v40O_MuSb1A`;
const SC1028 = `${V}a_gkI2P7gwo`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DOC = "https://www.beverlyma.gov/DocumentCenter/View";
const PB_1027 = `${AGENDA}/ViewFile/Agenda/_10272026-2973`;
const DRB_1105 = `${AGENDA}/ViewFile/Agenda/_11052026-2980`;
const PARKS_1105 = `${AGENDA}/ViewFile/Agenda/_11052026-2979`;
const ZBA_0625_2025 = `${AGENDA}/ViewFile/Minutes/_06252025-2350`;
const ENON_PAGE = "https://www.beverlyma.gov/1311";
const ENON_ZBA = `${DOC}/7743`;
const LANDING_APP = `${DOC}/7718`;
const AFFORDABLE_PAGE = "https://www.beverlyma.gov/723";
const LYNCH_APP = `${DOC}/7742`;
const BEAT_BOULDER = "https://thebeverlybeat.substack.com/p/going-big-on-boulder-lane";
const CITY_MAP_BOULDER = "https://beverlyma.mapgeo.io/datasets/properties?previewId=73-8";
const H5708 = "https://malegislature.gov/Bills/194/H5708";
const H3713 = "https://malegislature.gov/Bills/194/H3713";
const DESE_ELA = "https://www.doe.mass.edu/mcas/tdd/ela-g3-8-faq.html";
const ELECTION = "https://www.beverlyma.gov/817/Upcoming-Election";
const SOS = "https://www.sec.state.ma.us";
const SOS_WHERE = `${SOS}/WhereDoIVoteMA/WhereDoIVote`;
const TRASH_CAL = "https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["enon", "Apartments at the Stop & Shop site: a first hearing, and a return November 17"],
  ["boulder", "Senior housing proposed off Boulder Lane, and a community meeting Thursday"],
  ["datacenters", "The Planning Board backs the data center pause, 7-0"],
  ["airport", "A Beverly Airport noise bill passes the House"],
  ["schools", "No essay on the elementary MCAS, and a rule for e-bikes on school grounds"],
  ["landing", "Nine affordable condos for buyers 55 and older on Balch Street"],
  ["lynch", "Lynch Park: the city asks for its share of the seawall design"],
  ["ahead", "Coming up, through November 23"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Nov 3",
    what: "State election",
    detail:
      "Tomorrow. Polls open 7:00am to 8:00pm. The superintendent said it is also a professional development day for the schools.",
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
    date: "Nov 5",
    what: "Design Review Board: 37 Enon St",
    detail:
      "6:30pm at the temporary City Hall, 175 Cabot St, first floor large conference room. Site plan review of the Stop & Shop site's apartment building, plus three sign applications.",
    cal: {
      id: "drb-2026-11-05",
      title: "Beverly Design Review Board: 37 Enon St",
      start: "2026-11-05T23:30:00Z",
      end: "2026-11-06T01:00:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 5",
    what: "Boulder Lane community meeting",
    detail:
      "At Centerville Elementary School, called by the Mayor's office on the 55-and-older proposal. No time has been posted yet.",
  },
  {
    date: "Nov 5",
    what: "Parks and Recreation Commission",
    detail:
      "7:00pm at the Senior Center, 90 Colon St. Updates on Community Preservation projects, among them Balch Playground phase 2, the Holcroft Park splash pad and the Gillis Park pavilion, and on this round's applications from Obear Park, Cooney Field and the McPherson Youth Center.",
    cal: {
      id: "parks-2026-11-05",
      title: "Beverly Parks and Recreation Commission",
      start: "2026-11-06T00:00:00Z",
      end: "2026-11-06T01:30:00Z",
      location: "Beverly Senior Center, 90 Colon St, Beverly, MA",
    },
  },
  {
    date: "Nov 9",
    what: "City Council: data center hearing",
    detail:
      "The Council's next regular meeting, a week later than usual because of the election. The public hearing on the proposed data center pause is set for 7:30pm.",
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
  {
    date: "Mid-Nov",
    what: "The city's Flock contract expires",
    detail: "Per the Mayor on October 19. No renewal decision had been announced.",
  },
  {
    date: "Nov 17",
    what: "Planning Board: 37 Enon St and Waring School",
    detail:
      "7:00pm in the Middle School library, 502 Cabot St. The 37 Enon St hearing continues, with the traffic study. Then a public hearing on Waring School's plan for 38 Standley St.",
    cal: {
      id: "planning-board-2026-11-17",
      title: "Beverly Planning Board: 37 Enon St, 38 Standley St",
      start: "2026-11-18T00:00:00Z",
      end: "2026-11-18T02:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 18",
    what: "School Committee: policy votes",
    detail:
      "Second reading of the policies on powered e-bikes and scooters and on school trips abroad. The Clean Energy Advisory Committee also meets this day.",
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

/* ---------------- page ---------------- */

export default function DigestIssue8() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 8. Set to
          "2026-11-02" when publishing. */}
      <PageTracking surface="digest" issue="2026-11-02-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 8 &middot; Week of November 2
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering October 26 to November 1, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            This week: the plan for 179 apartments at the Stop &amp; Shop site on Enon Street gets
            its first Planning Board hearing, and comes back November 17 for traffic. The
            Mayor&apos;s office calls a community meeting Thursday on a 55-and-older proposal off
            Boulder Lane. The Planning Board backs the data center pause, a Beverly Airport noise
            bill passes the House, and the elementary MCAS drops the essay. Tomorrow is Election
            Day.
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
            October 26 to November 1
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="enon"
          data-dek={"The plan to replace the Stop & Shop on Enon Street with 179 apartments had its first Planning Board hearing. About a dozen residents spoke, most about traffic. The board continued the hearing to November 17, when the applicant's traffic consultant presents."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Housing</Eyebrow>
          <H2>Apartments at the Stop &amp; Shop site: a first hearing, and a return November 17</H2>
          <From>Planning Board &middot; Tuesday, October 27 &middot; Middle School library</From>
          <Hear
            src={PB1027}
            s={1228}
            title="The chair on what the board can and can't decide"
            meeting="Planning Board, Oct 27"
          />
          <p className={BODY}>
            The owner of the Stop &amp; Shop property at 37 Enon St wants to replace the store with
            one building of 179 apartments and about 2,600 square feet of shops. On Tuesday the
            Planning Board opened its hearing on the plan, heard from about a dozen residents, and
            voted 7-0 to continue it to November 17, when the applicant&apos;s traffic consultant is
            due to present.{" "}
            <Moment src={PB1027} s={1115} /> <Moment src={PB1027} s={2148} />{" "}
            <Moment src={PB1027} s={6728} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What is proposed
          </h3>
          <ul className={LIST}>
            <li>
              <b>179 apartments,</b>{" "}60% one-bedroom and 40% two-bedroom. Twenty-two of them, or
              12%, would be affordable to households earning up to 60% of the area median income.{" "}
              <Moment src={PB1027} s={1115} />
            </li>
            <li>
              <b>Set back from the neighbors.</b>{" "}The building would sit more than 100 feet from
              the rear property line, where the store is now 20 feet away, and paving and roofs
              would cover just under 75% of the site, down from about 90%, the applicant said.{" "}
              <Moment src={PB1027} s={1539} /> <Moment src={PB1027} s={2482} />
            </li>
            <li>
              <b>Fewer parking spaces than zoning requires:</b>{" "}281, where 367 are required.
              That takes a special permit from the board.{" "}
              <Moment src={PB1027} s={2309} />
            </li>
            <li>
              <b>Height already allowed.</b>{" "}In September the Zoning Board of Appeals voted 5-0 to
              allow a sloped roof up to 46 feet 6 inches, where zoning allows 35 feet, according to
              its <Src href={`${ENON_ZBA}#page=4`}>decision (p. 4)</Src>.
            </li>
            <li>
              <b>The store&apos;s lease.</b>{" "}Stop &amp; Shop has an option to extend its lease, and
              whether it will use it is not known. The owner is seeking permits in case it does
              not.{" "}
              <Moment src={PB1027} s={1353} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            Traffic, the main question
          </h3>
          <p className={BODY}>
            The applicant&apos;s engineer gave the traffic study&apos;s figures, based on driveway
            counts taken at the store this summer. In the weekday evening peak hour, the study
            counts 190 cars at the store today and estimates 68 for the new building. The
            study&apos;s author was not at the meeting, and the board held its traffic questions for
            November 17.{" "}
            <Moment src={PB1027} s={2148} /> <Moment src={PB1027} s={2586} />{" "}
            <Moment src={PB1027} s={4327} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What residents said
          </h3>
          <ul className={LIST}>
            <li>
              Residents who opposed the plan or raised concerns named traffic on Enon Street and
              Route 1A and left turns out of the site, school buses and class sizes, unsafe crossings
              near the tracks, lights and noise behind the building, and where guests would park.{" "}
              <Moment src={PB1027} s={3949} /> <Moment src={PB1027} s={4222} />{" "}
              <Moment src={PB1027} s={4461} /> <Moment src={PB1027} s={4720} />{" "}
              <Moment src={PB1027} s={4765} /> <Moment src={PB1027} s={5549} />
            </li>
            <li>
              Supporters said a site next to the North Beverly train station suits housing for
              people who drive less, and backed the lower parking count. One supporter who lives
              across the street asked for lights shielded from the neighbors and good walking
              routes.{" "}
              <Moment src={PB1027} s={3714} /> <Moment src={PB1027} s={5071} />{" "}
              <Moment src={PB1027} s={5256} />
            </li>
            <li>
              A letter read into the record said redevelopment along this stretch should aim for a
              denser, walkable, village-like neighborhood, and that it was short-sighted not to
              consider the ideas the city&apos;s planning consultant put forward for it.{" "}
              <Moment src={PB1027} s={5606} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What the board decides
          </h3>
          <p className={BODY}>
            The chair laid out the three decisions in front of the board. Site plan review
            &ldquo;cannot be denied except under extraordinary circumstances,&rdquo; though the
            board can set conditions. The parking special permit is the board&apos;s judgment call.
            The affordable units are required by the city&apos;s housing ordinance, and the board
            checks that the plan complies.{" "}
            <Moment src={PB1027} s={1228} /> <Moment src={PB1027} s={1263} />
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}
            Before November 17, the plan goes back to the Parking and Traffic Commission and to the
            Design Review Board, which has it on Thursday&apos;s agenda. The board also voted 6-1 to
            ask the city&apos;s Clean Energy Advisory Committee to review the plan against the
            city&apos;s climate plan. That committee next meets November 18, the day after the
            hearing; the chair said its review would not stop the board from acting.{" "}
            <Moment src={PB1027} s={1492} /> <Moment src={PB1027} s={6403} />{" "}
            <Moment src={PB1027} s={6627} />
          </p>
          <Refs
            sources={
              <>
                <Src href={ENON_PAGE}>The city&apos;s project page, with the plans and studies</Src>
                <Src href={`${PB_1027}#page=1`}>Meeting notice (p. 1)</Src>
                <Src href={PB1027}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="boulder"
          data-dek={"A developer has proposed 250 to 300 units of 55-and-older housing, including assisted living, off Boulder Lane in Centerville, according to the Mayor's office. Nothing has been filed. The Mayor's office has called a community meeting for Thursday at Centerville Elementary."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Housing</Eyebrow>
          <H2>Senior housing proposed off Boulder Lane, and a community meeting Thursday</H2>
          <From>
            Not from a meeting: the Mayor&apos;s office, as reported by The Beverly Beat, and city
            records
          </From>
          <p className={BODY}>
            A developer has proposed a 55-and-older development off Boulder Lane in Centerville: a
            multi-story assisted-living building and a series of smaller two-story apartment
            buildings, 250 to 300 units in all, according to the Mayor&apos;s office, as{" "}
            <Src href={BEAT_BOULDER}>The Beverly Beat reported</Src>. The Mayor&apos;s office has
            called a community meeting at Centerville Elementary School for Thursday, November 5,
            moved from October 27. No time has been posted. The developer has not been named, and
            no plans or applications have been filed with a city board.
          </p>
          <p className={BODY}>
            <b>The land.</b>{" "}
            The property, 128 Boulder Lane, is 26 acres on the Beverly side,{" "}
            <Src href={CITY_MAP_BOULDER}>city records show</Src>; the sale listing says it continues
            into Wenham and shows it under agreement at $5.9 million. The Beat describes it as woods
            and wetlands. Other parcels on Boulder Lane include city land, conservation land and
            land held by the Essex County Greenbelt Association.
          </p>
          <p className={BODY}>
            <b>The zoning.</b>{" "}
            City records place it in the IR district, for offices, research and light industry.
            There, the only housing-type uses the zoning ordinance lists are subsidized elderly
            housing and a state-licensed skilled nursing facility, each by special permit from the
            Zoning Board of Appeals. With no plan filed, it is not yet known what approvals the
            developer would seek.
          </p>
          <p className={BODY}>
            <b>An earlier plan.</b>{" "}
            In 2025 the owner, Oak Forest Farm LLC, asked the Zoning Board of Appeals for a variance
            to build an outdoor golf driving range on the site. The applicant asked to delay the
            hearing to talk with neighbors who had raised concerns, and the board instead let it
            withdraw the application, with the right to refile. Thirty-six people signed a sheet
            opposing it, the board&apos;s <Src href={`${ZBA_0625_2025}#page=5`}>minutes (p. 5)</Src>{" "}
            show.
          </p>
          <p className={BODY}>
            Ward 6 Councilor Matt St. Hilaire told The Beverly Beat he had not seen plans, and named
            traffic, schools, and police and fire services as his concerns. The Beat said it had
            asked the Mayor about the proposal and had not heard back.
          </p>
          <Refs
            sources={
              <>
                <Src href={BEAT_BOULDER}>The Beverly Beat, Oct 27</Src>
                <Src href={`${ZBA_0625_2025}#page=5`}>Zoning Board minutes, June 2025 (p. 5)</Src>
                <Src href={CITY_MAP_BOULDER}>City property map</Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="datacenters"
          data-dek={"The Planning Board voted 7-0 to recommend that the Council adopt the proposed pause on data center applications, which would run through November 30, 2027, or end sooner if the city writes rules for them. The Council's hearing is November 9."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Follow-up</Eyebrow>
          <H2>The Planning Board backs the data center pause, 7-0</H2>
          <From>Planning Board &middot; Tuesday, October 27 &middot; Order #250</From>
          <p className={BODY}>
            The Planning Board voted 7-0 to recommend that the Council adopt the proposed pause on
            data center applications. The pause would run through November 30, 2027, or end sooner
            if the city adopts zoning rules for data centers, and it gives the city its first
            definition of one. Planning Director Darlene Wynne said she knows of no data center
            project proposed in Beverly.{" "}
            <Moment src={PB1027} s={7243} /> <Moment src={PB1027} s={547} />{" "}
            <Moment src={PB1027} s={413} /> <Moment src={PB1027} s={689} />{" "}
            <Earlier issue={5} slug="2026-10-12" id="datacenters" label="the pause and the state's order" />
          </p>
          <p className={BODY}>
            The Council holds its own hearing November 9 at 7:30pm in the Middle School library.
            Adopting the pause takes a two-thirds vote of the Council, six of nine. A resident at
            Tuesday&apos;s hearing asked the city to publicize that date widely.{" "}
            <Moment src={PB1027} s={916} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PB_1027}#page=1`}>Meeting notice (p. 1)</Src>
                <Src href={PB1027}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="airport"
          data-dek={"The state House passed a bill that would have the state post every noise complaint made to Beverly Regional Airport from April to October, and monthly counts of practice landings. It is now in the Senate."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; State House</Eyebrow>
          <H2>A Beverly Airport noise bill passes the House</H2>
          <From>Not from a city meeting: the Legislature&apos;s record &middot; House bill 5708</From>
          <p className={BODY}>
            The state House <Src href={H5708}>passed a bill</Src> on October 26 that would have the
            state publish noise complaints about Beverly Regional Airport and counts of training
            flights. The Senate sent it to its Rules Committee on October 29. If it becomes law, it
            takes effect January 1, 2027. What it would do:
          </p>
          <ul className={LIST}>
            <li>
              The state&apos;s aeronautics division would collect every noise complaint made to the
              airport from April 1 to October 1, whether by website, phone, email, letter or in
              person, and post them monthly with the day and hour of each.
            </li>
            <li>
              It would also post monthly counts and times of &ldquo;touch and go&rdquo; flights, the
              practice landings in which a plane touches down and takes off again without stopping.
            </li>
            <li>
              At the request of two airport commissioners, the commission would hold a public
              meeting on noise reports, where the commissioners and the airport manager would take
              questions.
            </li>
            <li>
              The state would give the airport yearly guidance on a &ldquo;Good Neighbor&rdquo;
              policy for pilots and flight schools. The airport would post the policy and give a copy
              to every pilot, student pilot and badge applicant.
            </li>
          </ul>
          <p className={BODY}>
            Representative Sally Kerans and Senator Joan Lovely{" "}
            <Src href={H3713}>filed the original bill</Src> in 2025. The Transportation Committee
            rewrote it in March, and the House passed a further version offered by Representative
            Thomas Walsh of Peabody.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${H5708}/BillHistory`}>The bill&apos;s history</Src>
                <Src href={H5708}>Bill text</Src>
              </>
            }
          />
        </section>

        {/* ---- 05 ---- */}
        <section
          id="schools"
          data-dek={"Students in grades 3 to 5 will no longer write an essay on the state's English test this spring, and no grade will be tested on narrative writing. A proposed policy on powered e-bikes and scooters on school grounds comes up for a vote November 18."}
          className={SECTION}
        >
          <Eyebrow>05 &middot; School Committee</Eyebrow>
          <H2>No essay on the elementary MCAS, and a rule for e-bikes on school grounds</H2>
          <From>
            School Committee: curriculum and student life subcommittee, and Committee of the Whole
            &middot; Wednesday, October 28
          </From>
          <p className={BODY}>
            <b>A shorter writing test.</b>{" "}
            Students in grades 3 to 5 will no longer write an essay on the state&apos;s English test
            this spring. They will write shorter and longer responses instead, and no grade will be
            tested on narrative writing, district staff told the committee. The state&apos;s{" "}
            <Src href={DESE_ELA}>education department confirms the change</Src>{" "}for the tests
            given in spring 2027. Principals also presented last spring&apos;s results school by school,
            and Cove Elementary&apos;s principal said the state named it a &ldquo;school of
            recognition.&rdquo;{" "}
            <Moment src={SC1028} s={2870} /> <Moment src={SC1028} s={1635} />
          </p>
          <p className={BODY}>
            <b>E-bikes and scooters.</b>{" "}
            A proposed policy on powered bikes, scooters, skateboards, hoverboards and similar
            devices would apply across school grounds, including athletic fields and tracks.
            Wheelchairs and other devices used by people with disabilities are excluded. Any
            discipline would need a separate change to the discipline code, staff said. One member
            asked for room for students who rely on a scooter to get to school. The subcommittee
            voted 7-0, with one abstention, to move it forward, and the full committee takes it up
            for a vote November 18, along with a policy for school trips abroad.{" "}
            <Moment src={SC1028} s={3621} /> <Moment src={SC1028} s={3674} />{" "}
            <Moment src={SC1028} s={3770} /> <Moment src={SC1028} s={3896} />{" "}
            <Moment src={SC1028} s={4003} /> <Moment src={SC1028} s={8175} />
          </p>
          <Refs
            sources={
              <>
                <Src href={DESE_ELA}>The state&apos;s notes on the new test</Src>
                <Src href={SC1028}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 06 ---- */}
        <section
          id="landing"
          data-dek={"Beverly Landing, a new condominium building for buyers 55 and older at 50 Balch St, is taking applications for nine affordable units, first come, first served, for households earning up to 80% of the Boston-area median."}
          className={SECTION}
        >
          <Eyebrow>06 &middot; Housing</Eyebrow>
          <H2>Nine affordable condos for buyers 55 and older on Balch Street</H2>
          <From>Not from a meeting: the city&apos;s affordable housing page</From>
          <p className={BODY}>
            Beverly Landing, a new 60-unit condominium building for buyers 55 and older at 50 Balch
            St, is taking applications for its nine affordable units: one one-bedroom at $333,400
            and eight two-bedrooms at $375,900. They go to the first eligible households to apply
            with a mortgage pre-approval. Household income can be at most 80% of the Boston-area
            median, assets at most $275,000, and at least one member must be 55 or older. Limits on
            the resale price keep the units affordable for future buyers. An affiliate of Cummings
            Properties is building it, and the Regional Housing Services Office handles the
            applications, according to the{" "}
            <Src href={`${LANDING_APP}#page=1`}>application (p. 1)</Src>.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${LANDING_APP}#page=1`}>Application and rules (p. 1)</Src>
                <Src href={AFFORDABLE_PAGE}>The city&apos;s affordable housing page</Src>
              </>
            }
          />
        </section>

        {/* ---- 07 ---- */}
        <section
          id="lynch"
          data-dek={"The city has applied to its Community Preservation Committee for $107,614, the city's 20% share of the cost to finish designing and permitting the Lynch Park seawall; a state grant covers the rest."}
          className={SECTION}
        >
          <Eyebrow>07 &middot; Follow-up</Eyebrow>
          <H2>Lynch Park: the city asks for its share of the seawall design</H2>
          <From>Not from a meeting: the city&apos;s Community Preservation application</From>
          <p className={BODY}>
            The state&apos;s $430,456 grant for the Lynch Park seawall covers 80% of the cost to
            finish its design and permits. The city has now applied to its Community Preservation
            Committee for the other 20%, $107,614, for a total of $538,070. The work takes the design
            of 2,000 feet of seawall and revetment, the sloped stone along the shore, from 50% to
            90% complete and secures the local, state and federal permits, through June 2028.{" "}
            <Earlier issue={5} slug="2026-10-12" id="lynchpark" label="the state grant" />
          </p>
          <Refs
            sources={
              <>
                <Src href={LYNCH_APP}>The city&apos;s application (zip file)</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted:</b>{" "}
            the Council committee meeting on Camp Paradise and the Council&apos;s special meetings to
            interview candidates for budget analyst (October 26 and 27), the School Committee&apos;s
            finance subcommittee, the Zoning Board of Appeals, the Conservation Commission, the
            Historic District Commission, the Library Trustees and the Retirement Board. Their
            outcomes are not posted yet; the record will be the minutes once they are approved.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 08 ---- */}
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
                Tomorrow: the state election
              </p>
              <p className="mt-2.5 text-[0.97rem] leading-[1.6]">
                Tuesday, November 3, with polls open 7:00am to 8:00pm.{" "}
                <Src href={SOS_WHERE}>Find your polling place</Src>{" "}
                <Src href={ELECTION}>The city&apos;s election page</Src>
              </p>
            </div>
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Leaf and yard waste pickup
              </p>
              <p className="mt-2.5 text-[0.97rem] leading-[1.6]">
                On your regular trash day this week and the weeks of November 16 and November 30.
                Paper bags or open barrels, at the curb by 7:00am, no limit. The yard waste site at
                16 Standley St is open Mondays, Thursdays and Saturdays, 7:00am to 3:30pm, through
                December 19.{" "}
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
            <Src href={`${DRB_1105}#page=1`}>Design Review Board notice (p. 1)</Src>
            <Src href={`${PARKS_1105}#page=1`}>Parks and Recreation notice (p. 1)</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>
      </div>
    </div>
  );
}
