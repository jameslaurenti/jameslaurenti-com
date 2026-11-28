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

/**
 * What a story is built on, in five words or fewer. The records themselves are listed once,
 * with links, in the story's Sources row at the bottom, which the arrow jumps to. (New with
 * issue 12, from James's note on Nov 27: the full list up here read as crammed and unclear,
 * and it repeated the footer.)
 */
const From = ({ id, children }: { id: string; children: ReactNode }) => (
  <p className="mb-3 mt-2 flex max-w-[63ch] flex-wrap items-baseline gap-x-2 text-[0.88rem] leading-snug">
    <span className="text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
      From
    </span>
    <span className="text-ink-mid">{children}</span>
    <a href={`#${id}-sources`} className="rlink text-[0.8rem]">
      Sources&nbsp;&darr;
    </a>
  </p>
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

const Refs = ({ id, sources, more }: { id: string; sources: ReactNode; more?: ReactNode }) => (
  <div id={`${id}-sources`} className="mt-5 grid max-w-[63ch] scroll-mt-24 gap-1.5 border-t border-rule pt-3">
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.93rem]">
      <span className="min-w-[5.5rem] text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
        Sources
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
const DLS_LEVY =
  "https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=Dashboard.TrendAnalysisReports.TaxLevyByClass";
const DLS_VALUES =
  "https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=PropertyTaxInformation.AssessedValuesbyClass.assessedvaluesbyclass";
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
   The FY2027 row is blank there until the rate is approved. The changes from the year
   before are the digest's arithmetic (evals/numbers/derivations/2026-11-30.json). */
type Cell = { v: string; ch?: string };
const BILLS: { year: string; rate: Cell; value: Cell; bill: Cell }[] = [
  { year: "FY2024", rate: { v: "$11.23" }, value: { v: "$720,562" }, bill: { v: "$8,092" } },
  {
    year: "FY2025",
    rate: { v: "$10.99", ch: "−2.1%" },
    value: { v: "$766,766", ch: "+6.4%" },
    bill: { v: "$8,427", ch: "+4.1%" },
  },
  {
    year: "FY2026",
    rate: { v: "$10.81", ch: "−1.6%" },
    value: { v: "$817,185", ch: "+6.6%" },
    bill: { v: "$8,834", ch: "+4.8%" },
  },
];

const Num = ({ c, strong = false }: { c: Cell; strong?: boolean }) => (
  <>
    <span className={strong ? "font-semibold" : ""}>{c.v}</span>
    {c.ch && <span className="block text-[0.75rem] text-ink-faint">{c.ch}</span>}
  </>
);

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
            <th className="py-1.5 font-semibold">Tax for the year</th>
          </tr>
        </thead>
        <tbody>
          {BILLS.map((r) => (
            <tr key={r.year} className="border-b border-rule align-top last:border-b-0">
              <td className="py-1.5 pr-3">{r.year}</td>
              <td className="py-1.5 pr-3">
                <Num c={r.rate} />
              </td>
              <td className="py-1.5 pr-3">
                <Num c={r.value} />
              </td>
              <td className="py-1.5">
                <Num c={r.bill} strong />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
        The state&apos;s figures <Src href={DLS_BILLS}>(state data)</Src>. The changes from the
        year before are the digest&apos;s arithmetic. These are averages, which lean toward the
        most expensive homes; many homes are valued lower. Each tax year runs July to June and is named
        for the year it ends in: FY2026 is the bills from August 2025 to May 2026. The December 7
        vote sets FY2027.
      </p>
    </figure>
  );
}

/* The four steps from the budget to the bill, with where each one stands. "now" is the
   one decision still open; the rest are either settled or follow from it. The split and the
   rates were two steps until round 2 (James, Nov 27): the rates follow from the vote, so
   they read as one decision. */
type Step = { what: string; when: string; state: "done" | "now" | "next"; body: ReactNode };

const STEPS: Step[] = [
  {
    what: "The total",
    when: "Settled in June",
    state: "done",
    body: (
      <>
        The budget the Council passed set how much the city collects in property taxes for the
        year July 2026 to June 2027. A state law, Proposition 2&frac12;, caps that total, not any
        one bill.
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
    what: "The split, and with it the rates",
    when: "Monday, Dec 7 · still open",
    state: "now",
    body: (
      <>
        The Council holds a hearing, then votes on how the total is divided between homes and
        businesses <Src href={`${COUNCIL_1123}#page=57`}>(p. 57)</Src>. That sets one rate for
        homes and one for business property, which the city plans to send to the state for
        approval the next day <Src href={`${COUNCIL_1123}#page=47`}>(p. 47)</Src>.
      </>
    ),
  },
  {
    what: "Your tax for the year",
    when: "First bill due Feb 1",
    state: "next",
    body: (
      <>
        Your value, divided by 1,000, times the rate. Last year&apos;s average single-family home:
        $817,185 &divide; 1,000 &times; $10.81 = $8,834 for the year{" "}
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

/* Who paid last year's (FY2026) property taxes: one rate for everyone next to the split the
   Council chose. Replaces round 1's rate table (James, Nov 27: show what the split does to the
   whole city, not just the rate per $1,000).
   - The split: the state's Tax Levies by Class, FY2026. Homes are the residential class
     ($107,964,564) plus open space ($9,282) = $107,973,846, 79.75%; business property is
     commercial, industrial and personal property, $27,424,265, 20.25%; total $135,398,112.
   - One rate: each class pays its share of the city's value, 88.43% and 11.57% (the state's
     Assessed Values by Class, FY2026). Business property's $15,672,876 at one rate is the chief
     assessor's (Dec 1, 2025, 38:35, matching the 11.57% of the total); homes' $119.7 million
     is the total less that. The single rate and the moved $11,751,389 are his too (35:57,
     38:56); the chosen rates match the state's Tax Rates by Class.
   Colors: the two fills pass the dataviz validator (light surface); the gold is under 3:1, so
   every segment carries a printed label. */
type Share = { pct: number; amt: string };
/* Round 3 (James, Nov 27): it wasn't obvious which bar is what Beverly uses. Beverly's split now
   comes first, highlighted like the open step in the steps figure; one rate is marked as a
   comparison and its fills are faded. */
const WHO_PAYS: {
  tag: string;
  label: string;
  rates: string;
  inUse: boolean;
  homes: Share;
  biz: Share;
}[] = [
  {
    tag: "What Beverly uses",
    label: "The most state law allows",
    rates: "Homes $10.81, business $20.98 per $1,000",
    inUse: true,
    homes: { pct: 80, amt: "$108.0 million" },
    biz: { pct: 20, amt: "$27.4 million" },
  },
  {
    tag: "For comparison",
    label: "One rate for everyone",
    rates: "$11.99 per $1,000 for all property",
    inUse: false,
    homes: { pct: 88, amt: "$119.7 million" },
    biz: { pct: 12, amt: "$15.7 million" },
  },
];
const HOMES_FILL = "#0f7a45";
const BIZ_FILL = "#b8923a";

const Swatch = ({ fill }: { fill: string }) => (
  <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: fill }} />
);

function WhoPays() {
  return (
    <figure className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-4 py-4">
      <figcaption className="text-[0.95rem] font-semibold leading-snug text-ink">
        Who paid last year&apos;s $135.4 million in property taxes
        <span className="block text-[0.8rem] font-normal text-ink-faint">
          FY2026, the bills from August 2025 to May 2026
        </span>
      </figcaption>
      <p className="mt-1.5 flex flex-wrap gap-x-4 text-[0.8rem] text-ink-mid">
        <span className="inline-flex items-center gap-1.5">
          <Swatch fill={HOMES_FILL} />
          Homes
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Swatch fill={BIZ_FILL} />
          Business property
        </span>
      </p>
      {WHO_PAYS.map((b) => (
        <div
          key={b.label}
          className={`mt-3 rounded-md ${b.inUse ? "bg-accent-glow px-2.5 py-2.5 ring-1 ring-accent/40" : "px-2.5"}`}
        >
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.9rem]">
            <span
              className={`rounded-full px-2 py-0.5 text-[0.66rem] font-bold uppercase tracking-[0.1em] ${
                b.inUse ? "bg-accent text-white" : "border border-rule text-ink-faint"
              }`}
            >
              {b.tag}
            </span>
            <span className="font-semibold text-ink">{b.label}</span>
          </p>
          <p className="mt-0.5 text-[0.8rem] text-ink-faint">{b.rates}</p>
          <div
            role="img"
            aria-label={`${b.tag}, ${b.label}: homes ${b.homes.pct} percent, ${b.homes.amt}; business property ${b.biz.pct} percent, ${b.biz.amt}`}
            className="mt-1.5 flex h-6 gap-[2px]"
            style={b.inUse ? undefined : { opacity: 0.45 }}
          >
            <span className="rounded-l" style={{ width: `${b.homes.pct}%`, background: HOMES_FILL }} />
            <span className="rounded-r" style={{ width: `${b.biz.pct}%`, background: BIZ_FILL }} />
          </div>
          <div className="mt-1 flex justify-between gap-3 text-[0.8rem] leading-snug tabular-nums text-ink-mid">
            <span>
              <b className="text-ink">Homes {b.homes.pct}%</b>
              <span className="block">{b.homes.amt}</span>
            </span>
            <span className="text-right">
              <b className="text-ink">Business {b.biz.pct}%</b>
              <span className="block">{b.biz.amt}</span>
            </span>
          </div>
        </div>
      ))}
      <p className="mt-3 px-2.5 text-[0.88rem] leading-snug text-ink">
        <b>The difference:</b>{" "}Beverly&apos;s split moves $11.75 million from homes to business
        property.
      </p>
      <p className="mt-4 text-[0.78rem] leading-relaxed text-ink-faint">
        The split is the state&apos;s figures <Src href={DLS_LEVY}>(taxes by class)</Src>{" "}
        <Src href={DLS_RATES}>(rates)</Src>; one rate and
        the $11.75 million are the chief assessor&apos;s. <Moment src={COUNCIL1201_2025} s={2336} />{" "}
        Homes include apartments and condos.
      </p>
      <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-faint">
        The Council approved the split 8-0 on December 1, 2025.{" "}
        <Moment src={COUNCIL1201_2025} s={3907} />
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
        7:15pm hearing on how property taxes are divided between homes and businesses, which
        sets the rates on the bills due February 1 and May 1 (see <a href="#taxbill" className="rlink">story 1</a>), in the Middle School
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
            On December 7 the City Council makes the last open decision behind your next two
            property tax bills, due February 1 and May 1: how the total is divided between homes and businesses. Last
            year that vote moved about $11.75 million from homes to business property. It&apos;s a holiday
            week, so this issue takes a longer look at how your bill gets made and what the vote can
            and can&apos;t change. Also: the data center pause is final.
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
          data-dek={"On December 7 the City Council votes on how property taxes are divided between homes and businesses, which sets the rates on the bills due February 1 and May 1; the total was set with the budget in June. Last year the split moved about $11.75 million of the total from homes to business property, the most state law allows Beverly."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Property taxes</Eyebrow>
          <H2>Your tax bill gets decided in the next nine days</H2>
          <From id="taxbill">Last year&apos;s hearing, state data</From>
          <Hear
            src={COUNCIL1201_2025}
            s={2303}
            title="The chief assessor on what last year's split moved"
            meeting="City Council, Dec 1, 2025"
          />
          {/* Round 3 (James, Nov 27): readers' first question is what this does to their bills.
              Which bills, and what happens either way, before the how. The "When you'll see it"
              paragraph moved in here. Kept conditional: nothing on record says what the Mayor
              will recommend for FY2027.
              Round 5 (James, Nov 27): give the home value with the $960, and say the average runs
              above most homes. The state publishes only the average. The city's parcel map
              (ArcGIS Combined_gdb layer 5, LUC 101, queried Nov 27, 2026; last edited July 2025,
              so its year can't be pinned to the state's) has 8,580 single-family homes with a mean
              of $797,254 and a median of $680,350, so the copy says only that many homes are
              valued below the average, with no median figure. $118 per $100,000 and the $600,000
              example let readers scale it to their own home. */}
          <div className="mt-5 max-w-[63ch] rounded-lg border border-accent/40 bg-accent-glow px-5 py-4">
            <p className="text-[0.95rem] font-semibold text-accent-deep">What it means for your bill</p>
            <ul className="mt-2 grid gap-2.5 text-[0.95rem] leading-relaxed">
              <li>
                <b>Which bills.</b>{" "}
                The vote sets the rates for the tax year that began July 1 (the state calls it
                FY2027). Your August and November bills were estimates based on last year&apos;s tax.
                The bills due February 1 and May 1, mailed about a month ahead{" "}
                <Src href={COLLECTOR_FAQ}>(Collector of Taxes)</Src>, charge the new rates, and each
                carries half of the change for the year, the chief assessor said last year.{" "}
                <Moment src={COUNCIL1201_2025} s={3511} />
              </li>
              <li>
                <b>If the split stays where it is.</b>{" "}
                The Council has taxed business property at the most state law allows every year since
                2021. <Moment src={COUNCIL1201_2025} s={2157} />{" "}If it does again, the split works as it
                did last year, and the change in your bill comes from what is already settled: the
                total the city collects and your property&apos;s value.
              </li>
              <li>
                <b>If the split gets smaller.</b>{" "}
                Some of the tax moves from business property back onto homes, starting with the
                February bill. <Moment src={COUNCIL1201_2025} s={2264} />{" "}For scale: last year, one rate
                for everyone would have added about $118 a year for every $100,000 a home is valued
                at, and a smaller split would add part of that. On the average single-family home,
                valued at $817,185, that&apos;s about $960; on a $600,000 home, about $710. These are
                the digest&apos;s arithmetic. The average leans toward the most expensive homes, so
                many homes are valued below it.
              </li>
            </ul>
          </div>
          <p className={BODY}>
            A property tax bill comes out of four steps. Two are done. The third belongs to the City
            Council: on Monday, December 7, it holds its yearly hearing and vote on how taxes are
            divided between homes and businesses.
          </p>
          <BillSteps />
          <p className={BODY}>
            <b>The split.</b>{" "}
            The vote divides the total; it doesn&apos;t change it{" "}
            <Src href={DLS_GUIDE}>(state guide)</Src>. Business property (commercial and industrial
            buildings, and business equipment such as utility lines) can be taxed at a higher rate
            than homes, up to a limit in state law. Last year the Mayor recommended going to the
            limit, and the Council has done that every year since 2021, the chief assessor, Francis
            Golden, said. <Moment src={COUNCIL1201_2025} s={2157} />
          </p>
          <WhoPays />
          <p className={BODY}>
            Business property is about 12 percent of the city&apos;s value{" "}
            <Src href={DLS_VALUES}>(state data)</Src>, so taxing it at $20.98
            instead of $11.99 raised its share of the total from 12 percent to 20 percent. Spread
            across all homes, the <Fig>$11.75 million</Fig>{" "}it moved comes to $1.18 less per $1,000
            of value, or about <Fig>$960</Fig>{" "}on last year&apos;s average single-family home,
            valued at $817,185. The $960 is the digest&apos;s arithmetic from the state&apos;s
            average value.
          </p>
          <p className={BODY}>
            <b>Why a lower rate can still mean a higher bill.</b>{" "}
            The rate for homes went down each of the last two years, and the average bill still went
            up: values rose more than the rate fell.
          </p>
          <BillTable />
          <p className={BODY}>
            The rate comes down when values rise because the state caps the total, not the rate. So
            what moves the bill is the total, which can grow 2.5 percent a year plus taxes on new
            construction <Src href={PROP212_LAW}>(state law)</Src>, and the share of it that homes
            carry. Home values are rising faster than business values, so that share keeps growing:
            homes paid 78.1 percent of the total in FY2023 and 79.75 percent in FY2026{" "}
            <Src href={DLS_LEVY}>(state data)</Src>. The values for FY2027, already filed with the
            state, raise homes&apos; share of the city&apos;s value again, to 88.5 percent{" "}
            <Src href={DLS_VALUES}>(state data)</Src>. &ldquo;It&apos;s the residential driving the
            bus,&rdquo; Golden said. <Moment src={COUNCIL1201_2025} s={3083} /> Our explainer,{" "}
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
            the first bill at the new rate, the one due in February. Last year it was February 2, according to the city&apos;s form{" "}
            <Src href={`${ABATEMENT_FORM}#page=1`}>(p. 1)</Src>.
          </p>
          <p className={BODY}>
            <b>How to take part.</b>{" "}
            The hearing is Monday, December 7, at 7:15pm in the Beverly Middle School library, 502
            Cabot St, and anyone can speak. The assessors present the new figures that night.
          </p>
          <Refs
            id="taxbill"
            sources={
              <>
                <Src href={`${COUNCIL_1123}#page=57`}>
                  The assessors&apos; request for the Dec 7 hearing (p. 57)
                </Src>
                <Src href={COUNCIL1201_2025}>Last year&apos;s hearing, Dec 1, 2025, full recording</Src>
                <Src href={DLS_LEVY}>The state&apos;s tax data by class</Src>
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
          <From id="council">City Council, November 23</From>
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
            id="council"
            sources={
              <>
                <Src href={`${COUNCIL_1123}#page=1`}>Agenda and packet (p. 1)</Src>
                <Src href={`${COUNCIL_1123_SPECIAL}#page=1`}>Special meeting notice (p. 1)</Src>
                <Src href={COUNCIL1123}>Full recording, special and regular meetings</Src>
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
