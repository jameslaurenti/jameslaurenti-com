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
const DRC20 = `${V}SB09OZ8Nitk`;
const FLOCK1019 = `${V}x_567bYRlvc`;
const CC1019 = `${V}Ior7anl4lY0`;
const COD22 = `${V}O4klnrQIlG4`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DRC_AGENDA_1020 = `${AGENDA}/ViewFile/Agenda/_10202026-2961`;
const FLOCK_AGENDA = `${AGENDA}/ViewFile/Agenda/_10192026-2927`;
const PACKET_1019 = `${AGENDA}/ViewFile/Agenda/_10192026-2958`;
const COD_AGENDA_1022 = `${AGENDA}/ViewFile/Agenda/_10222026-2962`;
const SPECIAL_1026 = `${AGENDA}/ViewFile/Agenda/_10262026-2970`;
const SPECIAL_1027 = `${AGENDA}/ViewFile/Agenda/_10272026-2971`;
const PB_1027 = `${AGENDA}/ViewFile/Agenda/_10272026-2973`;
const GSA_LISTING = "https://realestatesales.gov/asset-details/?property_id=79";
const BEAT = "https://thebeverlybeat.substack.com/p";
const BEAT_EMPTY = `${BEAT}/why-are-the-coast-guard-houses-in`;
const BEAT_JAN = `${BEAT}/the-coast-is-clear`;
const BEAT_AUG = `${BEAT}/city-submits-expression-of-interest`;
const ARMY_RECORD =
  "https://www.denix.osd.mil/armybrac/massachusetts-reserve-component/family-housing-beverly-15/";
const FLOCK_PORTAL = "https://transparency.flocksafety.com/beverly-ma-pd";
const ELECTION = "https://www.beverlyma.gov/817/Upcoming-Election";
const SOS = "https://www.sec.state.ma.us";
const SOS_MAIL = `${SOS}/divisions/elections/voting-information/vote-by-mail.htm`;
const SOS_WHERE = `${SOS}/WhereDoIVoteMA/WhereDoIVote`;
const TRASH_CAL = "https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["coastguard", "The Coast Guard houses on Laurel Street are headed to auction"],
  ["deficit", "What was new at the deficit committee's community meeting"],
  ["flock", "Flock: the contract ends in mid-November, and the decision is the Mayor's"],
  ["disabilities", "Commission on Disabilities members can't ask businesses for money"],
  ["ahead", "Coming up, through November 23"],
  ["corrections", "Corrections"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
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
    date: "Oct 26",
    what: "City Council: budget analyst search",
    detail:
      "Special meeting, 7:15pm at the temporary City Hall, 175 Cabot St, first floor. The screening committee reports, with a recommendation letter from Councilor Houseman, and the Council interviews a candidate at 7:30pm.",
    cal: {
      id: "council-analyst-2026-10-26",
      title: "Beverly City Council: budget analyst interview",
      start: "2026-10-26T23:15:00Z",
      end: "2026-10-27T00:30:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 27",
    what: "City Council: budget analyst vote",
    detail:
      "Special meeting, 6:00pm at 175 Cabot St, first floor. Two more interviews, then discussion and a possible vote to elect the Council's new budget analyst. The current analyst, Gerard Perry, retires by the end of the year.",
    cal: {
      id: "council-analyst-2026-10-27",
      title: "Beverly City Council: budget analyst interviews and possible vote",
      start: "2026-10-27T22:00:00Z",
      end: "2026-10-28T00:30:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 27",
    what: "Planning Board: data center pause and 37 Enon St",
    detail:
      "7:00pm in the Middle School library, 502 Cabot St, and online. A public hearing on the proposed pause on data centers (#250). A zoning change gets a hearing before both the Planning Board and the Council; the Council's is November 9. Then the Stop & Shop site at 37 Enon St: 179 apartments, 22 of them affordable, about 2,600 square feet of retail, and a special permit for 281 parking spaces where 367 are required.",
    cal: {
      id: "planning-board-2026-10-27",
      title: "Beverly Planning Board: data center pause hearing, 37 Enon St",
      start: "2026-10-27T23:00:00Z",
      end: "2026-10-28T01:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
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
    date: "Oct 29",
    what: "Downtown trick-or-treat",
    detail: "4:00 to 6:00pm downtown, Councilor Sonia announced at the Council.",
    cal: {
      id: "trick-or-treat-2026-10-29",
      title: "Beverly downtown trick-or-treat",
      start: "2026-10-29T20:00:00Z",
      end: "2026-10-29T22:00:00Z",
      location: "Downtown Beverly, MA",
    },
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
    detail: "Per the Mayor on October 19. Whether to renew had not been decided.",
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

export default function DigestIssue7() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 7. Set to
          "2026-10-26" when publishing. */}
      <PageTracking surface="digest" issue="2026-10-26-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 7 &middot; Week of October 26
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering October 19 to 25, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The Coast Guard&apos;s 16 empty houses on Laurel Street are headed to a federal
            auction; a city councilor says the city looked into buying them and is not moving
            forward. The deficit committee met the public for the first time, and two Council
            committees took a second look at the Flock cameras; here is what was new at each.
            Next week the Council picks its new budget analyst, and the Planning Board holds its
            hearing on the data center pause.
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
            October 19 to 25
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="coastguard"
          data-dek={"The 16 empty Coast Guard houses on Laurel Street are listed for a federal online auction, with no dates set. Councilor Kathleen Feldman wrote that the city looked further into buying them and is not moving forward."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Federal property</Eyebrow>
          <H2>The Coast Guard houses on Laurel Street are headed to auction</H2>
          <From>Not from a meeting: a councilor&apos;s public post and the federal sale listing</From>
          <p className={BODY}>
            Sixteen houses on Laurel Street in North Beverly, owned by the Coast Guard and empty
            for about three years, are headed to a public auction run by the federal government.
            Ward 5 Councilor Kathleen Feldman wrote on her public Facebook page this week that the
            city did some additional exploration but is &ldquo;not moving forward,&rdquo; so the
            General Services Administration (GSA), the agency that sells surplus federal property,
            is preparing the sale. GSA&apos;s sale site lists the property for online auction,
            marked &ldquo;Coming Soon.&rdquo; No auction dates or bidding documents are posted
            yet.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What is for sale
          </h3>
          <p className={BODY}>
            Sixteen detached one-story ranch houses, each with three bedrooms and one bath, on a
            single lot of 5.36 acres, half a mile from the North Beverly train station, according
            to GSA&apos;s listing. They are sold together as one lot, not house by house. The
            neighborhood is zoned for single-family homes; any other use would need a special
            permit from the city.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            How it got here
          </h3>
          <ul className={LIST}>
            <li>
              <b>Built for a missile battery.</b>{" "}
              The Army built the houses in 1958 for soldiers at Beverly&apos;s Nike missile sites,
              part of a national air-defense system. The missile site closed in 1963, but the
              housing stayed in use, and in 1990 it passed to the Coast Guard, which housed members stationed in Boston, Gloucester and Newburyport.
            </li>
            <li>
              <b>Empty since about 2023.</b>{" "}
              The Coast Guard moved its families out without saying why. An environmental
              assessment it commissioned that year listed things to check, such as old heating oil
              tanks, septic systems, pesticides, lead paint, asbestos, and the capped former landfill
              on Brimbal Avenue nearby. In January the Coast Guard told The Beverly Beat its review
              was complete with &ldquo;no concerns.&rdquo; We did not find the review published.
            </li>
            <li>
              <b>The city&apos;s first option.</b>{" "}
              Federal law gives state and local governments the first chance to buy surplus federal
              property. The state did not apply. In August the Mayor sent GSA an expression of
              interest, which, with the state out, gave the city 60 days to look into a purchase, while saying he did
              not expect the city to buy and that the likeliest outcome was a buyer who would
              redevelop the houses for homes. If no government buys, the property goes to auction.
            </li>
            <li>
              <b>This week.</b>{" "}
              Councilor Feldman&apos;s post says the city is not moving forward. It gives no
              reason. She wrote that the neighborhood and the city would like the houses to become
              starter homes for essential workers, homes for local seniors or homes for local
              veterans. GSA has not yet posted the bidding terms, which would show any conditions
              on the sale.
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={GSA_LISTING}>GSA sale listing</Src>
                <Src href={ARMY_RECORD}>Army record of the site</Src>
              </>
            }
            more={
              <>
                <Src href={BEAT_AUG}>The Beverly Beat, Aug 20</Src>
                <Src href={BEAT_JAN}>The Beverly Beat, Jan 14</Src>
                <Src href={BEAT_EMPTY}>The Beverly Beat, Feb 2025</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="deficit"
          data-dek={"The Deficit Reduction Committee's first community meeting added ideas on retirees' health insurance, parking, moorings and a regular review of city fees. Members' early estimates run from tens of thousands of dollars a year for some fees to $1 million to $2 million a year for each change to who pays health premiums. Four residents spoke."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Deficit Reduction Committee</Eyebrow>
          <H2>What was new at the deficit committee&apos;s community meeting</H2>
          <From>Deficit Reduction Committee &middot; Tuesday, October 20 &middot; Council on Aging</From>
          <Hear
            src={DRC20}
            s={288}
            title="The committee opens its first community meeting"
            meeting="Deficit Reduction Committee, Oct 20"
          />
          <p className={BODY}>
            The Deficit Reduction Committee presented its research so far at its first community
            meeting, then took questions. Most of the slides followed the run-through we described
            last week. Below is what was new.{" "}
            <Moment src={DRC20} s={314} />{" "}
            <Earlier issue={6} slug="2026-10-19" id="deficit" label="what the committee planned to present" />
          </p>
          <Note>
            <b>Not a plan.</b>{" "}
            Members said policy decisions belong to the city&apos;s elected officials. The chair, Councilor
            Kathleen Feldman, said no idea belongs to the member who presented it, and that some
            came from residents.{" "}
            <Moment src={DRC20} s={314} /> <Moment src={DRC20} s={3968} />
          </Note>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            New on Tuesday
          </h3>
          <ul className={LIST}>
            <li>
              <b>Retirees&apos; health insurance.</b>{" "}
              The city pays 80% of health premiums for retirees, as it does for employees. A
              member&apos;s research looked at moving retirees to the state minimum, 50%, alongside
              moving employees&apos; share from 20% to 30%. The employee change would have to be
              negotiated with the unions, most of whose contracts, the member said, are up in July 2027.{" "}
              <Moment src={DRC20} s={825} /> <Moment src={DRC20} s={892} />
            </li>
            <li>
              <b>Parking.</b>{" "}
              Doubling the meter rate from $1 to $2 an hour; meters on the roughly 180 free spaces
              along Lothrop Street from Independence Park to Dane Street Beach; and a &ldquo;parking
              benefit district,&rdquo; which returns part of an area&apos;s meter money to that
              area.{" "}
              <Moment src={DRC20} s={1595} /> <Moment src={DRC20} s={1669} />{" "}
              <Moment src={DRC20} s={1733} />
            </li>
            <li>
              <b>Fees on a schedule.</b>{" "}
              Reviewing all city fees every year or two as a set process, instead of when one
              happens to come up.{" "}
              <Moment src={DRC20} s={1855} />
            </li>
            <li>
              <b>Moorings.</b>{" "}
              The fee is $7 a foot, raised from $5.50 last year after at least ten years unchanged.
              Salem charges $7, Danvers $5 and Marblehead $13. About 100 people are on the waiting
              list, and the wait is three to five years. Mooring fees go to the city&apos;s general
              budget.{" "}
              <Moment src={DRC20} s={2065} />
            </li>
            <li>
              <b>Not pursuing.</b>{" "}
              The golf course, whose fees stay with the course because it runs as a self-supporting
              fund; the Beverly Harbor Management Authority, which the state created and which sits
              outside city government; and airport fees.{" "}
              <Moment src={DRC20} s={1925} /> <Moment src={DRC20} s={2149} />{" "}
              <Moment src={DRC20} s={2202} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            How the ideas compare in size
          </h3>
          <p className={BODY}>
            Members&apos; early estimates, which they called preliminary, put each of the two
            changes to who pays health premiums at $1 million to $2 million a year, the parking ideas in the hundreds of
            thousands, and fees for the summer park program and moorings in the tens of
            thousands.{" "}
            <Moment src={DRC20} s={871} /> <Moment src={DRC20} s={1629} />{" "}
            <Moment src={DRC20} s={1399} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What residents said
          </h3>
          <ul className={LIST}>
            <li>
              One said cities that ask tax-exempt owners for payments usually ask for a quarter of
              what the property would pay in taxes, and receive far less; services in place of
              payments are the better prospect, the resident said.{" "}
              <Moment src={DRC20} s={3021} />
            </li>
            <li>
              One said meter enforcement ends in the evening, so theatergoers can park for free in
              permit areas downtown, and suggested wider permit parking and zoning changes, such as
              to parking minimums.{" "}
              <Moment src={DRC20} s={3240} />
            </li>
            <li>
              One asked whether these ideas fix a long-term gap or whether the city needs more
              tax revenue. A member answered that health insurance costs, up by double digits each
              of the last four years, are the largest driver.{" "}
              <Moment src={DRC20} s={3465} /> <Moment src={DRC20} s={3538} />
            </li>
            <li>
              A Lothrop Street resident asked that any rate increase be phased in, that beach
              parking fees fall on non-residents rather than residents, and that side streets be
              protected from overflow, and said the core of the deficit is salaries and benefits.{" "}
              <Moment src={DRC20} s={3661} />
            </li>
          </ul>
          <p className={BODY}>
            Four other councilors attended; with the two on the committee, that made a quorum of
            the Council, so they did not take part.{" "}
            <Moment src={DRC20} s={4122} />
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}
            More meetings this fall and winter, possibly focus groups or listening sessions, with
            dates to be posted, and recommendations to city leaders by spring 2027. Questions can
            go to any committee member or to Councilors Feldman and Mullady.{" "}
            <Moment src={DRC20} s={2866} /> <Moment src={DRC20} s={2988} />
          </p>
          <Refs
            sources={
              <>
                <Src href={DRC_AGENDA_1020}>Meeting notice</Src>
                <Src href={DRC20}>Full recording</Src>
              </>
            }
            more={
              <>
                <Earlier issue={6} slug="2026-10-19" id="deficit" label="the committee's research" />
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="flock"
          data-dek={"At their second meeting on the city's Flock cameras, councilors heard that the contract expires in mid-November, that no decision on renewing it has been made, and that the decision is the Mayor's. About 14 residents spoke, all asking the city to end it."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Flock cameras</Eyebrow>
          <H2>Flock: the contract ends in mid-November, and the decision is the Mayor&apos;s</H2>
          <From>
            Legal Affairs and Public Services committees, with the Committee of the Whole &middot;
            Monday, October 19 &middot; Order #120, filed by Councilors Rotondo and Spang
          </From>
          <Hear
            src={FLOCK1019}
            s={3237}
            title="Councilor Rotondo on who decides"
            meeting="Joint committee meeting, Oct 19"
          />
          <p className={BODY}>
            The city&apos;s contract with Flock Safety for its license plate cameras expires in the
            middle of November, the Mayor said. Whether to renew it has not been decided, the
            police chief said. Councilor Rotondo, who chaired the meeting, said the contract is the
            Mayor&apos;s decision as the city&apos;s chief procurement officer; the Council&apos;s
            role is to hear residents and press their concerns. The committees took no vote.{" "}
            <Moment src={FLOCK1019} s={1591} /> <Moment src={FLOCK1019} s={2865} />{" "}
            <Moment src={FLOCK1019} s={3237} />{" "}
            <Earlier issue={6} slug="2026-10-19" id="flock" label="the cameras and the rules" />
          </p>
          <p className={BODY}>
            <b>What police said.</b>
          </p>
          <ul className={LIST}>
            <li>
              Still four cameras. The one on Brimbal Avenue has been down since the windstorms;
              Flock would replace it.{" "}
              <Moment src={FLOCK1019} s={1912} /> <Moment src={FLOCK1019} s={2024} />
            </li>
            <li>
              Data is shared only with Massachusetts law enforcement agencies. Federal or out-of-state
              agencies have to ask Beverly police directly.{" "}
              <Moment src={FLOCK1019} s={1461} />
            </li>
            <li>
              Data is kept 30 days, and the department is discussing cutting that to seven.{" "}
              <Moment src={FLOCK1019} s={2786} /> <Moment src={FLOCK1019} s={2881} />
            </li>
            <li>
              Flock&apos;s automated audit has flagged three or four searches, all within the
              department&apos;s policy, said a lieutenant who administers the system.{" "}
              <Moment src={FLOCK1019} s={2255} />
            </li>
            <li>
              The city has not priced running a similar system itself.{" "}
              <Moment src={FLOCK1019} s={2146} />
            </li>
          </ul>
          <p className={BODY}>
            <b>An open question.</b>{" "}
            Whether Flock keeps Beverly&apos;s data after the city&apos;s 30 days. The chief did not
            know; the Mayor said the city will find out.{" "}
            <Moment src={FLOCK1019} s={2910} /> <Moment src={FLOCK1019} s={2971} />
          </p>
          <p className={BODY}>
            <b>Public comment.</b>{" "}
            About 14 residents spoke, all asking the city to end the contract or let it lapse,
            citing privacy, constitutional concerns, data security and misuse elsewhere. One more
            spoke at the Council meeting that followed. Police described cases the cameras helped
            with, including a home invasion, a man who had threatened suicide, and a hit-and-run.
            Councilors&apos; questions came from a list residents submitted, put together by
            Councilor Spang.{" "}
            <Moment src={FLOCK1019} s={119} /> <Moment src={FLOCK1019} s={1110} />{" "}
            <Moment src={FLOCK1019} s={1874} /> <Moment src={CC1019} s={932} />
          </p>
          <Refs
            sources={
              <>
                <Src href={FLOCK_AGENDA}>Committee agenda</Src>
                <Src href={FLOCK1019}>Full recording</Src>
                <Src href={FLOCK_PORTAL}>Police transparency portal</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="disabilities"
          data-dek={"Members of the Commission on Disabilities relayed advice from the city solicitor's office that, as city officials, they should not ask businesses for donations, which ends a plan to raise money for sign language interpreters at theater shows. A separate volunteer group could."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; Commission on Disabilities</Eyebrow>
          <H2>Commission on Disabilities members can&apos;t ask businesses for money</H2>
          <From>Commission on Disabilities &middot; Thursday, October 22</From>
          <Hear
            src={COD22}
            s={2670}
            title="A member reports the advice"
            meeting="Commission on Disabilities, Oct 22"
          />
          <p className={BODY}>
            Members had been working on a way to pay for sign language interpreters so that deaf
            residents could attend shows at North Shore Music Theatre. A member reported that the
            city solicitor&apos;s office advised that, as city officials, commission members should
            not ask private businesses for donations, because of conflict-of-interest rules and the
            risk that a donor expects something in return.{" "}
            <Moment src={COD22} s={2670} /> <Moment src={COD22} s={2746} />
          </p>
          <p className={BODY}>
            A volunteer group that is not part of the commission could raise the money, a recreation department official who
            sits on the commission said, as Friends of Beverly Recreation does for parks. Setting one up takes a lawyer and state approval as a nonprofit.
            Members are still asking whether the theater would provide an interpreter for a group
            booking.{" "}
            <Moment src={COD22} s={3304} /> <Moment src={COD22} s={2974} />
          </p>
          <p className={BODY}>
            For city meetings, the city books interpreters through the state&apos;s Commission for
            the Deaf and Hard of Hearing; one hour cost $273 last fiscal year, and interpreters are hard to
            book. Beach wheelchairs are at Dane Street Beach when lifeguards are on duty, Memorial
            Day to Labor Day. The commission voted to keep meeting in January and February.{" "}
            <Moment src={COD22} s={2572} /> <Moment src={COD22} s={2192} />{" "}
            <Moment src={COD22} s={3712} />
          </p>
          <Refs
            sources={
              <>
                <Src href={COD_AGENDA_1022}>Meeting agenda</Src>
                <Src href={COD22}>Full recording</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also at the Council, October 19.</b>{" "}
            The Council voted 8-0, with Councilor Spang absent, to accept the private stretch of
            Millbrook Road, past Hickory Lane, as a public street, submitted by the Mayor; its
            owners donated the easements.{" "}
            <Moment src={CC1019} s={3182} />{" "}
            Councilor Houseman&apos;s request that the Mayor fund the Human Rights Committee with
            $20,000 was put off until before November 9, so the Mayor and the committee&apos;s
            chair can meet first.{" "}
            <Moment src={CC1019} s={1550} />{" "}
            The Council&apos;s next regular meeting is November 9, and it set November 23 hearings on
            National Grid&apos;s petitions for underground lines on Woodbury and Dane streets.{" "}
            <Moment src={CC1019} s={1668} /> <Moment src={CC1019} s={3478} />{" "}
            <Src href={`${PACKET_1019}#page=38`}>Millbrook letter (p. 38)</Src>{" "}
            <Src href={CC1019}>Full recording</Src>
          </p>
          <p className="mt-3 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted:</b>{" "}
            the Water Supply Board, the Board of Health, the Clean Energy Advisory Committee, the
            Harbor Management Authority, the Economic and Community Development Council and the
            Veterans Advisory Council. Issue 6 listed what was on their agendas. The record is the
            agenda now and the minutes once they are approved; no minutes have been posted for any
            city meeting since mid-September.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 05 ---- */}
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
                Voting in the November 3 election
              </p>
              <ul className="mt-2.5 space-y-2 text-[0.97rem] leading-[1.6]">
                <li>
                  <b>Early voting</b>{" "}runs through Friday, October 30, at the temporary City Hall,
                  175 Cabot St, first floor (the former TD Bank). Mondays to Wednesdays 8:30am to
                  4:30pm, Thursdays to 7:30pm, Fridays to 1:00pm.
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
                On your regular trash day the weeks of November 2, November 16 and November 30.
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
            <Src href={`${SPECIAL_1026}#page=1`}>Oct 26 Council notice (p. 1)</Src>
            <Src href={`${SPECIAL_1027}#page=1`}>Oct 27 Council notice (p. 1)</Src>
            <Src href={`${PB_1027}#page=1`}>Planning Board notice (p. 1)</Src>
            <Src href={ELECTION}>The city&apos;s election page</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>

        {/* ---- 06 ---- */}
        <section id="corrections" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Corrections
          </h2>
          <ul className={LIST}>
            <li>
              Issue 6 linked to a BevCam video for the October 19 Council meeting that BevCam later
              made private. The meeting&apos;s recording is <Src href={CC1019}>here</Src>.
            </li>
            <li>
              Issue 6 listed the October 27 Planning Board meeting at the Police Department, before
              its notice was posted. The notice puts it in the Middle School library, 502 Cabot St.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
