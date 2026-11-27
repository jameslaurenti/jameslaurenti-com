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

/** Which meeting or record an item came from. Thematic items can name more than one. */
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
const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;
const COUNCIL1123 = `${V}8UNrJ6qQFcY`;
/* Last year's classification hearing (FY2026 tax split), Dec 1, 2025. */
const COUNCIL1201_2025 = `${V}2rfObRriL0c`;

const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DOC = "https://www.beverlyma.gov/DocumentCenter/View";
const COUNCIL_1123 = `${AGENDA}/ViewFile/Agenda/_11232026-3016`;
const COUNCIL_1123_SPECIAL = `${AGENDA}/ViewFile/Agenda/_11232026-3014`;
const FFC_1130 = `${AGENDA}/ViewFile/Agenda/_11302026-2996`;
const PT_1201 = `${AGENDA}/ViewFile/Agenda/_12012026-3018`;
const PARKS_1203 = `${AGENDA}/ViewFile/Agenda/_12032026-3017`;
const LEGAL_1207 = `${AGENDA}/ViewFile/Agenda/_12072026-3020`;
const SC_POLICY_1207 =
  "https://4.files.edl.io/5f93/11/23/26/203249-b21d5236-65b1-4a8b-9f63-dd9547e452b7.pdf";
const PB_ENON_NOTICE = `${DOC}/7830`;
const PB_STANDLEY_NOTICE = `${DOC}/7831`;
const AUDIT_ADDENDUM = `${DOC}/7833`;
const ABATEMENT_FORM = `${DOC}/5816/FY-2026-Real-Estate-Abatement`;
const COLLECTOR_FAQ = "https://www.beverlyma.gov/faq.aspx?TID=17";
const DLS_RATES =
  "https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=PropertyTaxInformation.taxratesbyclass.taxratesbyclass_main";
const DLS_BILLS =
  "https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=AverageSingleTaxBill.SingleFamTaxBill_wRange";
const DLS_GUIDE =
  "https://www.mass.gov/info-details/understanding-the-classification-hearing-process-in-local-taxation-and-tax-policy";
/* Proposition 2½ itself: (f) holds the levy to 102.5% of last year's plus new growth. */
const PROP212_LAW = "https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter59/Section21C";

const contents: [string, string][] = [
  ["taxbill", "Your tax bill gets decided in the next nine days"],
  ["council", "The data center pause is final, and the Mayor's update on the FEMA appeal"],
  ["ahead", "Coming up, through December 21"],
];

/* Beverly's average single-family home, from the state Division of Local Services
   (Average Single Family Tax Bill and Tax Rates by Class, data current as of Nov 27, 2026).
   The FY2027 row is blank there until the rate is approved. */
const BILLS: { year: string; rate: string; value: string; bill: string }[] = [
  { year: "FY2024", rate: "$11.23", value: "$720,562", bill: "$8,092" },
  { year: "FY2025", rate: "$10.99", value: "$766,766", bill: "$8,427" },
  { year: "FY2026", rate: "$10.81", value: "$817,185", bill: "$8,834" },
];

function BillTable() {
  return (
    <figure className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-4 py-4">
      <figcaption className="text-[0.95rem] font-semibold leading-snug text-ink">
        Beverly&apos;s average single-family home
      </figcaption>
      <table className="mt-3 w-full text-left text-[0.9rem] tabular-nums">
        <thead>
          <tr className="border-b border-rule text-[0.75rem] uppercase tracking-wide text-ink-faint">
            <th className="py-1.5 pr-3 font-semibold">Year</th>
            <th className="py-1.5 pr-3 font-semibold">Rate per $1,000</th>
            <th className="py-1.5 pr-3 font-semibold">Value</th>
            <th className="py-1.5 font-semibold">Tax bill</th>
          </tr>
        </thead>
        <tbody>
          {BILLS.map((r) => (
            <tr key={r.year} className="border-b border-rule last:border-b-0">
              <td className="py-1.5 pr-3">{r.year}</td>
              <td className="py-1.5 pr-3">{r.rate}</td>
              <td className="py-1.5 pr-3">{r.value}</td>
              <td className="py-1.5 font-semibold">{r.bill}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
        The state&apos;s figures. A fiscal year runs July 1 to June 30 and takes the name of the
        year it ends in, so FY2026 ended this June.{" "}
        <Src href={DLS_BILLS}>(State data)</Src>
      </p>
    </figure>
  );
}

/* The five steps from the budget to the bill, with where each one stands. "now" is the
   one decision still open; the rest are either settled or follow from it. */
type Step = { what: string; when: string; state: "done" | "now" | "next"; body: ReactNode };

const STEPS: Step[] = [
  {
    what: "The total",
    when: "Settled in June",
    state: "done",
    body: (
      <>
        The budget the Council passed set how much the city collects in property taxes. A state
        law, Proposition 2&frac12;, caps that total, not any one bill.
      </>
    ),
  },
  {
    what: "Your property's value",
    when: "Settled",
    state: "done",
    body: (
      <>
        The assessors estimate what each property would sell for, and the state approves the
        values <Src href={DLS_GUIDE}>(state guide)</Src>.
      </>
    ),
  },
  {
    what: "The split",
    when: "Monday, Dec 7 · still open",
    state: "now",
    body: (
      <>
        The Council holds a hearing, then votes on how the total is divided between homes and
        businesses <Src href={`${COUNCIL_1123}#page=57`}>(p. 57)</Src>.
      </>
    ),
  },
  {
    what: "The rates",
    when: "From Dec 8",
    state: "next",
    body: (
      <>
        The split sets one rate for homes and one for business property. The city sends them to
        the state for approval <Src href={`${COUNCIL_1123}#page=47`}>(p. 47)</Src>.
      </>
    ),
  },
  {
    what: "Your bill",
    when: "Due Feb 1",
    state: "next",
    body: (
      <>
        Your value, divided by 1,000, times the rate. Last year&apos;s average single-family home:
        $817,185 &divide; 1,000 &times; $10.81 = $8,834{" "}
        <Src href={DLS_BILLS}>(state data)</Src>.
      </>
    ),
  },
];

function BillSteps() {
  return (
    <figure className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-3 py-4 sm:px-4">
      <figcaption className="px-1 text-[0.95rem] font-semibold leading-snug text-ink">
        How your tax bill gets made
      </figcaption>
      <ol className="mt-2 grid gap-1">
        {STEPS.map((s, i) => (
          <li
            key={s.what}
            className={`flex gap-3 rounded-md px-2 py-2.5 ${
              s.state === "now" ? "bg-accent-glow ring-1 ring-accent/40" : ""
            }`}
          >
            <span
              aria-hidden
              className={`mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full text-[0.8rem] font-bold tabular-nums ${
                s.state === "done"
                  ? "bg-rule text-ink-mid"
                  : s.state === "now"
                    ? "bg-accent text-white"
                    : "border border-accent/50 text-accent"
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <span className="font-semibold text-ink">{s.what}</span>
                <span
                  className={`text-[0.72rem] font-bold uppercase tracking-[0.1em] ${
                    s.state === "now" ? "text-accent-deep" : "text-ink-faint"
                  }`}
                >
                  {s.when}
                </span>
              </p>
              <p className="mt-0.5 text-[0.92rem] leading-relaxed text-ink-mid">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* Last year's split next to the single rate the Council could have used instead. The
   single rate is the chief assessor's figure from the Dec 1, 2025 hearing (35:57 and
   41:00); the chosen rates match the state's Tax Rates by Class. */
function SplitTable() {
  return (
    <figure className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-4 py-4">
      <figcaption className="text-[0.95rem] font-semibold leading-snug text-ink">
        Last year&apos;s choice, in tax per $1,000 of value
      </figcaption>
      <table className="mt-3 w-full text-left text-[0.9rem] tabular-nums">
        <thead>
          <tr className="border-b border-rule text-[0.75rem] uppercase tracking-wide text-ink-faint">
            <th className="py-1.5 pr-3 font-semibold">
              <span className="sr-only">Option</span>
            </th>
            <th className="py-1.5 pr-3 font-semibold">Homes</th>
            <th className="py-1.5 font-semibold">Business property</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-rule">
            <td className="py-1.5 pr-3 text-ink-mid">One rate for everyone</td>
            <td className="py-1.5 pr-3 text-ink-mid">$11.99</td>
            <td className="py-1.5 text-ink-mid">$11.99</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-semibold">The split the Council chose</td>
            <td className="py-1.5 pr-3 font-semibold">$10.81</td>
            <td className="py-1.5 font-semibold">$20.98</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
        The Council approved the split 8-0 on December 1, 2025.{" "}
        <Moment src={COUNCIL1201_2025} s={3907} />{" "}
        The single rate is the chief assessor&apos;s figure; the chosen rates are the state&apos;s{" "}
        <Src href={DLS_RATES}>(state data)</Src>.
      </p>
    </figure>
  );
}

type Ev = { date: string; what: string; detail: ReactNode; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Nov 30",
    what: "Financial Forecast Committee",
    detail:
      "6:30pm in the Police Station community room, 175 Elliott St. The forecast for FY2028, the budget year that starts next July: school and vocational school spending, then a scheduled vote on the forecast numbers.",
    cal: {
      id: "forecast-2026-11-30",
      title: "Beverly Financial Forecast Committee",
      start: "2026-11-30T23:30:00Z",
      end: "2026-12-01T01:30:00Z",
      location: "Beverly Police Station, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Dec 1",
    what: "Parking and Traffic Commission: 38 Standley St",
    detail:
      "8:30am in the first-floor conference room of the temporary City Hall, 175 Cabot St, or online (link on the agenda). A recommendation to the Planning Board on Waring School's plan for 38 Standley St, and safety reviews at two Ward 4 intersections: Peabody, Larcom and Sargent avenues, and Hale and Corning streets.",
    cal: {
      id: "parking-traffic-2026-12-01",
      title: "Beverly Parking and Traffic Commission",
      start: "2026-12-01T13:30:00Z",
      end: "2026-12-01T15:30:00Z",
      location: "Temporary Beverly City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Dec 3",
    what: "Parks and Recreation Commission",
    detail:
      "6:30pm at the Beverly Depot Restaurant, 10 Park St. Updates on parks and playgrounds paid for with Community Preservation money, this year's applications, and Lynch Park.",
  },
  {
    date: "Dec 7",
    what: "City Council: the tax split",
    detail: (
      <>
        7:15pm hearing on how this year&apos;s property taxes are divided between homes and
        businesses (see <a href="#taxbill" className="rlink">story 1</a>), in the Middle School
        library, 502 Cabot St. At 8:30pm, a hearing on the Mayor&apos;s request for $20,000
        &ldquo;to support the City&apos;s DEIB and other initiatives within the Executive
        office.&rdquo; Four more hearings are set for 7:30, 7:45, 8:00 and 8:15. Before the
        meeting, at 6pm, the Legal Affairs committee takes up seven lodging house license
        renewals.
      </>
    ),
    cal: {
      id: "council-2026-12-07",
      title: "Beverly City Council",
      start: "2026-12-08T00:00:00Z",
      end: "2026-12-08T03:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Dec 7",
    what: "School Committee policy subcommittee",
    detail:
      "6:00pm in the Middle School library. A vote to send the revised e-bike and scooter policy to the full School Committee, and drafts of policies grouped under \"Freedom to Read.\"",
  },
  {
    date: "Dec 8",
    what: "Conservation Commission",
    detail: "The golf course permit and the Endicott seawall both return.",
  },
  {
    date: "Dec 9",
    what: "Historic District Commission: 38 Standley St",
    detail: "The city has asked the commission to review Waring School's plan for the house.",
  },
  {
    date: "Dec 10",
    what: "Financial Forecast Committee",
    detail: "6:30pm in the Police Station community room. The last of three meetings.",
  },
  {
    date: "Dec 15",
    what: "Planning Board: 37 Enon St and 38 Standley St",
    detail:
      "7:00pm in the Middle School library. The hearing on 37 Enon St is closed, and the board takes it up again. The Waring School hearing on 38 Standley St continues.",
  },
  {
    date: "Dec 21",
    what: "City Council: utility hearings",
    detail:
      "National Grid's Woodbury St hearing resumes at 7:50pm. Hearings on National Grid poles on Balch St (7:30pm) and Independence Circle (7:40pm), and on GoNetSpeed fiber lines starting at Charles St (8:10pm) and New Balch St (8:20pm).",
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue12() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 12. Set to
          "2026-11-30" when publishing. */}
      <PageTracking surface="digest" issue="2026-11-30-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 12 &middot; Week of November 30
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering November 23 to November 29, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            On December 7 the City Council decides how this year&apos;s property taxes are split
            between homes and businesses, and the next day the city plans to send its tax rate to the
            state. Here is what is already settled, what is left to decide, and how to read the bill
            due February 1. Also from the Council: the data center pause passed its final vote, the
            Mayor gave an update on the FEMA appeal, and the city&apos;s share of the Lynch Park
            seawall design was approved.
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
          What&apos;s next{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            November 30 to December 8
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="taxbill"
          data-dek={"On December 7 the City Council decides how this year's property taxes are split between homes and businesses, and the next day the city plans to send its tax rate to the state; the total was set with the budget in June. Last year homes paid $10.81 per $1,000 of value and business property $20.98, the largest split state law allows Beverly."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Property taxes</Eyebrow>
          <H2>Your tax bill gets decided in the next nine days</H2>
          <From>
            The assessors&apos; request for a December 7 hearing &middot; Last year&apos;s hearing,
            December 1, 2025 &middot; The state&apos;s tax data
          </From>
          <Hear
            src={COUNCIL1201_2025}
            s={3325}
            title="Gerry Perry on what the Council's vote does"
            meeting="City Council, Dec 1, 2025"
          />
          <p className={BODY}>
            A property tax bill comes out of five steps. Two are done. The next one belongs to the City
            Council: on Monday, December 7, it holds its yearly hearing and vote on how this
            year&apos;s taxes are divided between homes and businesses.
          </p>
          <BillSteps />
          <p className={BODY}>
            <b>The vote moves money; it doesn&apos;t change the total.</b>{" "}
            &ldquo;All you&apos;re doing is shifting the money,&rdquo; the Council&apos;s budget analyst,
            Gerry Perry, told councilors at last year&apos;s hearing.
          </p>
          <p className={BODY}>
            <b>The split.</b>{" "}
            Business property (commercial and industrial buildings, and business equipment such as
            utility lines) can be taxed at a higher rate than homes, up to a limit in state law. Last
            year the Mayor recommended going to the limit, and the Council has done that every year
            since 2021, the chief assessor, Francis Golden, said.{" "}
            <Moment src={COUNCIL1201_2025} s={2157} />
          </p>
          <SplitTable />
          <p className={BODY}>
            That split moved about <Fig>$11.75 million</Fig>{" "}of the total off homes and onto business
            property, Golden said. A smaller split would lower the business rate and raise the rate
            for homes. <Moment src={COUNCIL1201_2025} s={2336} />
          </p>
          <p className={BODY}>
            <b>Why a lower rate can still mean a higher bill.</b>{" "}
            The rate for homes went down each of the last two years, and the average bill still went
            up.
          </p>
          <BillTable />
          <p className={BODY}>
            When values rise, the rate comes down to fit, because the state caps the total, not the
            rate. So what moves the bill is the total, which can grow 2.5 percent a year plus taxes on
            new construction <Src href={PROP212_LAW}>(state law)</Src>, and the share of it that
            homes carry. Home values are rising faster than
            business values, so homes carry more of the total each year. &ldquo;It&apos;s the
            residential driving the bus,&rdquo; Golden said.{" "}
            <Moment src={COUNCIL1201_2025} s={3083} /> Our explainer,{" "}
            <a
              href="/beverly/what-sets-your-taxes"
              className="rlink"
              data-track="read_more_clicked"
              data-placement="explainer-inline"
            >
              What sets your property taxes
            </a>
            , walks through why.
          </p>
          <p className={BODY}>
            <b>When you&apos;ll see it.</b>{" "}
            The August and November bills were estimates based on last year. The bill due February 1
            is the first at the new rate, and any change from last year shows up in that bill and the
            one due May 1, Golden said. <Moment src={COUNCIL1201_2025} s={3511} /> Bills are mailed
            about 30 days before they are due <Src href={COLLECTOR_FAQ}>(Collector of Taxes)</Src>.
          </p>
          <details className="mt-5 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-3">
            <summary className="cursor-pointer text-[0.95rem] font-semibold text-accent">
              More: three optional discounts the Council could also vote on
            </summary>
            <p className="mt-2 text-[0.95rem] leading-relaxed">
              State law offers three more choices <Src href={DLS_GUIDE}>(state guide)</Src>. A
              residential exemption lowers the taxable value of owner-occupied homes, which shifts more
              of the total onto rentals and higher-value homes. A small business exemption shifts taxes
              within the business class, from small businesses to larger ones. An open space discount
              shifts taxes from open land onto homes. Beverly has never granted any of them. The first
              two can come up only if the Mayor recommends them, and last year the Mayor did not, Golden
              said. <Moment src={COUNCIL1201_2025} s={1979} />
            </p>
          </details>
          <p className={BODY}>
            <b>If you think your value is wrong.</b>{" "}
            You can ask the assessors for an abatement, a reduction. The deadline is the due date of
            the first bill at the new rate. Last year it was February 2, according to the city&apos;s form{" "}
            <Src href={`${ABATEMENT_FORM}#page=1`}>(p. 1)</Src>.
          </p>
          <p className={BODY}>
            <b>How to take part.</b>{" "}
            The hearing is Monday, December 7, at 7:15pm in the Beverly Middle School library, 502
            Cabot St, and anyone can speak. The assessors present this year&apos;s figures that night.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${COUNCIL_1123}#page=57`}>The assessors&apos; request (p. 57)</Src>
                <Src href={COUNCIL1201_2025}>Last year&apos;s hearing, full recording</Src>
              </>
            }
            more={
              <a
                href="/beverly/what-sets-your-taxes"
                className="rlink"
                data-track="read_more_clicked"
                data-placement="explainer-refs"
              >
                What sets your property taxes, and what doesn&apos;t
              </a>
            }
          />
        </section>

        <h2 className="mt-16 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          What happened{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            November 23 to November 29
          </span>
        </h2>

        {/* ---- 02 ---- */}
        <section
          id="council"
          data-dek={"The City Council gave the data center pause its final vote, 8-0, and approved $107,614 for the city's share of the Lynch Park seawall design, 8-0. The Mayor said about $1.2 million in COVID-era costs is still in dispute with FEMA, with a ruling that could come at any time. Catherine Foster starts as the Council's budget analyst on November 30."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; City Council</Eyebrow>
          <H2>The data center pause is final, and the Mayor&apos;s update on the FEMA appeal</H2>
          <From>City Council &middot; Monday, November 23 &middot; Special meeting and regular meeting</From>
          <Hear
            src={COUNCIL1123}
            s={3798}
            title="Mayor Cahill on the FEMA appeal"
            meeting="City Council, Nov 23"
          />
          <p className={BODY}>
            <b>The data center pause.</b>{" "}
            The Council gave the pause its final vote, 8-0, with no discussion. It bars applications
            for data centers until the Council adopts zoning rules for them, or through November 30,
            2027, whichever comes first, according to the order{" "}
            <Src href={`${COUNCIL_1123}#page=139`}>(p. 139)</Src>.{" "}
            <Moment src={COUNCIL1123} s={7936} />{" "}
            <Earlier issue={10} slug="2026-11-16" id="datacenters" label="the first vote" />
          </p>
          <p className={BODY}>
            <b>The FEMA appeal.</b>{" "}
            About <Fig>$1.2 million</Fig>{" "}in COVID-era costs is still in dispute with FEMA, the Mayor
            said, after an appeal hearing in August. The ruling &ldquo;may come tomorrow, it may come a
            month from now, two months from now.&rdquo; <Moment src={COUNCIL1123} s={3928} />{" "}
            <Earlier issue={11} slug="2026-11-23" id="deficit" label="the appeal" />
          </p>
          <p className={BODY}>
            <b>If the city loses.</b>{" "}
            The state Department of Revenue first wanted the disputed amount dealt with in this
            year&apos;s tax rate, the Mayor said, then agreed to wait, after the Mayor promised in
            writing to ask the Council to cover any shortfall from the stabilization fund, a city
            reserve fund. &ldquo;It doesn&apos;t commit you to voting for it,&rdquo; the
            Mayor told councilors. <Moment src={COUNCIL1123} s={3874} />
          </p>
          <p className={BODY}>
            <b>Lynch Park.</b>{" "}
            The Council approved <Fig>$107,614</Fig>{" "}from the city&apos;s Community Preservation fund,
            8-0. It is the city&apos;s share of finishing the design and permits for the Lynch Park
            seawall; a $430,456 state grant pays the rest{" "}
            <Src href={`${COUNCIL_1123}#page=33`}>(p. 33)</Src>.{" "}
            <Moment src={COUNCIL1123} s={9239} />{" "}
            <Earlier issue={8} slug="2026-11-02" id="lynch" label="the application" />
          </p>
          <p className={BODY}>
            <b>The budget analyst.</b>{" "}
            At a special meeting before the regular one, councilors set November 30 as Catherine
            Foster&apos;s first day as the Council&apos;s budget analyst and December 31 as Gerry
            Perry&apos;s last, 6-0. Without a vote, they agreed to ask Perry to see the Financial
            Forecast Committee through its last meeting on December 10, and to be available as
            needed after that, as a contractor. <Moment src={COUNCIL1123} s={1101} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${COUNCIL_1123}#page=1`}>Agenda and packet (p. 1)</Src>
                <Src href={`${COUNCIL_1123_SPECIAL}#page=1`}>Special meeting notice (p. 1)</Src>
                <Src href={COUNCIL1123}>Full recording</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also at the Council, November 23:</b>{" "}
            The hearing on National Grid&apos;s new underground lines on Woodbury St, in Ward 4, was
            continued to December 21, 8-0. Councilors asked the company to come back with details on a
            power outage its representative put at about eight hours, and on repaving.{" "}
            <Moment src={COUNCIL1123} s={6233} />
          </p>
          <p className="mt-2.5 text-[0.93rem] leading-relaxed text-ink-mid">
            The 2027 golf and tennis club rates were approved, 8-0. <Moment src={COUNCIL1123} s={9694} />
          </p>
          <p className="mt-2.5 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Schools:</b>{" "}
            The district&apos;s outside review of special education, student support teams and its
            system of extra help for students who are struggling now starts in January, with a final
            report due August 31, 2027 and presentations to the School Committee that September. The
            original plan had the work starting this September, according to the city&apos;s bid
            addendum <Src href={`${AUDIT_ADDENDUM}#page=2`}>(p. 2)</Src>.
          </p>
        </div>

        {/* ---- ahead ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through December 21
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
            <Src href={`${FFC_1130}#page=1`}>Forecast Committee notice, Nov 30 (p. 1)</Src>
            <Src href={`${PT_1201}#page=1`}>Parking and Traffic agenda, Dec 1 (p. 1)</Src>
            <Src href={`${PARKS_1203}#page=1`}>Parks and Recreation agenda, Dec 3 (p. 1)</Src>
            <Src href={`${LEGAL_1207}#page=1`}>Legal Affairs agenda, Dec 7 (p. 1)</Src>
            <Src href={`${SC_POLICY_1207}#page=1`}>School policy subcommittee agenda, Dec 7 (p. 1)</Src>
            <Src href={PB_ENON_NOTICE}>Planning Board notice, 37 Enon St</Src>
            <Src href={PB_STANDLEY_NOTICE}>Planning Board notice, 38 Standley St</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>
      </div>
    </div>
  );
}
