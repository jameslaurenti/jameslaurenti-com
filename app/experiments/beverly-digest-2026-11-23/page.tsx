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
const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;
/* BevCam's public copy of the Nov 17 forecast meeting. The first upload (3hMTOz6bOaU)
   went private; this one starts 31 seconds later, so timestamps are 31s earlier than the
   vault transcript's. */
const FFC1117 = `${V}-lvDkqE3Tls`;
const PB1117 = `${V}Jit2sKWagGI`;
const SC1118 = `${V}9ZdbtjyMF0M`;
const COD1112 = `${V}z25KLRqt9gI`;

const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DOC = "https://www.beverlyma.gov/DocumentCenter/View";
const FFC_1117 = `${AGENDA}/ViewFile/Agenda/_11172026-2995`;
const FFC_1130 = `${AGENDA}/ViewFile/Agenda/_11302026-2996`;
const PB_1117 = `${AGENDA}/ViewFile/Agenda/_11172026-3000`;
const CONCOM_1117 = `${AGENDA}/ViewFile/Agenda/_11172026-3001`;
const COUNCIL_1123 = `${AGENDA}/ViewFile/Agenda/_11232026-3016`;
const COUNCIL_1123_SPECIAL = `${AGENDA}/ViewFile/Agenda/_11232026-3014`;
const ZBA_1124 = `${AGENDA}/ViewFile/Agenda/_11242026-3015`;
const FORECAST = `${DOC}/6958/Financial-Forecast-Report-FY2026-2030`;
const ENON_PAGE = "https://www.beverlyma.gov/1311";
const FIGS = "/beverly/digest/2026-11-23";
const CEAC_1119 = "https://www.beverlyma.gov/AgendaCenter/ViewFile/Agenda/_11192026-3003";
const SC_FF_PACKET =
  "https://4.files.edl.io/4717/11/19/26/164356-cfd58abc-6d6d-4934-872e-f2c6866ac460.pdf";
const SC_COTW_PACKET =
  "https://4.files.edl.io/a720/11/19/26/162300-d19fb2ee-05b8-4bf1-8426-05af90bf6739.pdf";
const DRC_1112 = `${AGENDA}/ViewFile/Agenda/_11122026-2992`;
const MASC_FY27 = "https://www.masc.org/fy27-budget-what-it-means-for-k-12-education/";
const FEMA_HOLYOKE = "https://www.fema.gov/appeal/immediate-threat-force-account-labor-equipment-costs-10";
const CHELSEA = "http://chelsearecord.com/2025/09/18/city-appeals-fema-ruling-on-food-distribution-reimbursement/";
const FEMA_POLICY = "https://www.fema.gov/sites/default/files/2020-09/fema_policy_104-009-19_PA-eligibility-policy-covid.pdf";
const DESE_CB = "https://www.doe.mass.edu/finance/circuitbreaker/faq.html";
const DANVERS =
  "https://www.salemnews.com/news/local_news/danvers-bans-e-bikes-on-school-grounds/article_7e99bae2-ccae-4c06-a6c3-a974575bfda2.html";
const SN_STANDLEY =
  "https://www.salemnews.com/news/local_news/beverly-first-period-home-again-facing-demolition/article_9ad86334-c279-4f39-8c84-73bfff1b04b4.html";
const SN_STANDLEY_JAN =
  "https://www.salemnews.com/news/local_news/city-issues-waring-school-demo-delay-on-historic-home-10-footer/article_420b6184-dac2-4c66-b405-c82419982b04.html";
const BEAT_STANDLEY = "https://thebeverlybeat.substack.com/p/headed-for-the-wrecking-ball";
const HAVERHILL =
  "https://www.eagletribune.com/news/haverhill/haverhill-bans-e-bikes-e-scooters-on-school-property/article_7b10a9f1-ce7e-432f-b032-a2547634eea8.html";

const contents: [string, string][] = [
  ["deficit", "The FY2028 budget gap: $1.63 million, down from last December's $7.1 million forecast"],
  ["standley", "Waring School's plan for 38 Standley St would take down a house from about 1700"],
  ["schools", "The school budget is on track so far, with $837,000 more in state special education money than planned"],
  ["ebikes", "The School Committee puts off its e-bike vote"],
  ["enon", "37 Enon St: the hearing closes, and a vote is set for December 15"],
  ["ahead", "Coming up, through December 15"],
];

type Ev = { date: string; what: string; detail: ReactNode; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Nov 23",
    what: "City Council: the budget analyst handoff",
    detail:
      "6:00pm special meeting in the Middle School library, 502 Cabot St. Next steps in hiring the Council's budget analyst, and the transition from the current analyst.",
  },
  {
    date: "Nov 23",
    what: "City Council: final vote on the data center pause",
    detail:
      "7:00pm in the Middle School library. Register to speak by 9:30am with the City Clerk. Final passage of the data center pause, which needs six of nine votes. The Mayor's update on the FEMA appeal. Hearings on National Grid's underground lines on Woodbury Street (7:30pm) and Dane Street (7:40pm), and on $107,614 in Community Preservation money for the design and permitting of Lynch Park's phase III (7:50pm). Also: 2027 golf and tennis club rates (memberships up $100, greens fees up $2), and setting hearings on how the tax levy is split among property types and on the Mayor's request for $20,000 \"to support the City's DEIB and other initiatives within the Executive office.\"",
    cal: {
      id: "council-2026-11-23",
      title: "Beverly City Council",
      start: "2026-11-24T00:00:00Z",
      end: "2026-11-24T03:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 24",
    what: "Zoning Board of Appeals",
    detail:
      "7:00pm in the Police Station community room, 175 Elliott St. Requests include an addition with four apartments on a commercial building at 386 Cabot St, a new three-family house on Gage St, two accessory apartments, and several home additions.",
    cal: {
      id: "zba-2026-11-24",
      title: "Beverly Zoning Board of Appeals",
      start: "2026-11-25T00:00:00Z",
      end: "2026-11-25T02:30:00Z",
      location: "Beverly Police Station, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Nov 28",
    what: "Conservation Commission site visit: Endicott seawall",
    detail: "8:00am at low tide, 385 and 407 Hale St.",
  },
  {
    date: "Nov 30",
    what: "Financial Forecast Committee",
    detail:
      "6:30pm in the Police Station community room, 175 Elliott St. School and vocational school spending, then a scheduled vote on the forecast numbers.",
    cal: {
      id: "forecast-2026-11-30",
      title: "Beverly Financial Forecast Committee",
      start: "2026-11-30T23:30:00Z",
      end: "2026-12-01T01:30:00Z",
      location: "Beverly Police Station, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Dec 7",
    what: "City Council: the tax rate split",
    detail:
      "The assessors' hearing on how the FY2027 tax levy is divided among property types, and on the residential, small business and open space exemptions. The Mayor plans to send the tax rate to the state the Tuesday after.",
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
      "The board's chair intends to vote on 37 Enon St. The Waring School hearing on 38 Standley St continues.",
  },
];

/* ---------------- page ---------------- */

/* FY2028 gap walk, Dec 2025 forecast to Nov 2026 estimate. Figures from Perry's presentation
   (Nov 17) and the Dec 2025 forecast, p. 11. The cost line is derived: what's left to reach
   $1,628,672. Colors validated for color-vision deficiency (dataviz validator, all checks pass). */
const GAP_STEPS: { label: string; note?: string; kind: "total" | "down" | "up"; value: number }[] = [
  { label: "Forecast, Dec 2025", kind: "total", value: 7107323 },
  { label: "Trash fee increase", note: "FY2027 budget", kind: "down", value: -2407096 },
  { label: "Department cuts", note: "FY2027 budget", kind: "down", value: -1750711 },
  { label: "State aid above estimate", note: "Revenue", kind: "down", value: -1480060 },
  { label: "New growth above estimate", note: "Revenue", kind: "down", value: -700000 },
  { label: "Higher cost estimates, net", note: "derived", kind: "up", value: 859216 },
  { label: "Estimate, Nov 2026", kind: "total", value: 1628672 },
];
const GAP_COLOR = { total: "var(--color-ink-mid)", down: "#2f6fa8", up: "#b0562b" };
const GAP_MAX = 7500000;

function money(n: number) {
  const m = Math.abs(n) / 1e6;
  return `${n < 0 ? "\u2212" : ""}$${m.toFixed(2)}M`;
}

function GapWaterfall() {
  let running = 0;
  const rows = GAP_STEPS.map((st) => {
    const from = st.kind === "total" ? 0 : running;
    const to = st.kind === "total" ? st.value : running + st.value;
    running = to;
    return { ...st, from: st.kind === "total" ? to : from, lo: Math.min(from, to), hi: Math.max(from, to), end: to };
  });
  const pct = (n: number) => `${(n / GAP_MAX) * 100}%`;
  return (
    <figure className="mt-6 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-4 py-4">
      <figcaption className="text-[0.95rem] font-semibold leading-snug text-ink">
        How the FY2028 gap went from $7.1 million to $1.63 million
      </figcaption>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-ink-mid">
        {(["down", "up", "total"] as const).map((k) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: GAP_COLOR[k] }} />
            {k === "down" ? "Lowers the gap" : k === "up" ? "Raises the gap" : "Gap"}
          </span>
        ))}
      </div>
      <div className="mt-3" role="list">
        {rows.map((r, i) => (
          <div
            key={r.label}
            role="listitem"
            className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-center gap-x-3 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
          >
            <div className="py-1.5 text-[0.82rem] leading-tight">
              <div className={r.kind === "total" ? "font-semibold text-ink" : "text-ink"}>{r.label}</div>
              <div className="text-ink-faint">
                {r.kind === "total" ? money(r.value) : `${r.value > 0 ? "+" : ""}${money(r.value)}`}
                {r.note ? ` \u00b7 ${r.note}` : ""}
              </div>
            </div>
            <div className="relative self-stretch min-h-12">
              <div className="absolute inset-y-0 left-0 w-px bg-[var(--color-rule)]" />
              {i > 0 && (
                <div
                  className="absolute top-0 h-[calc(50%-10px)] border-l border-dashed border-ink-faint/60"
                  style={{ left: pct(r.from) }}
                />
              )}
              <div
                className="absolute top-[calc(50%-10px)] h-5 rounded-[3px]"
                style={{ left: pct(r.lo), width: pct(r.hi - r.lo), background: GAP_COLOR[r.kind] }}
              />
              {i < rows.length - 1 && (
                <div
                  className="absolute bottom-0 h-[calc(50%-10px)] border-l border-dashed border-ink-faint/60"
                  style={{ left: pct(r.end) }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-faint">
        Perry&apos;s figures, Financial Forecast Committee, Nov 17, and the Dec 2025 forecast (p. 11).
        The higher-cost line is the digest&apos;s arithmetic: the amount that takes Perry&apos;s
        figures to his $1,628,672 total.
      </p>
    </figure>
  );
}

export default function DigestIssue11() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 11. Set to
          "2026-11-23" when publishing. */}
      <PageTracking surface="digest" issue="2026-11-23-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 11 &middot; Week of November 23
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering November 16 to November 22, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            A year ago the city forecast a $7.1 million gap in its FY2028 budget, which starts next
            July. This week the
            Council&apos;s budget analyst put it at $1.63 million and walked through what changed.
            Waring School&apos;s plan for four homes at
            38 Standley St, which would take down a house dating to about 1700, drew calls to save
            it, including a letter from two councilors. The school budget is on track so far, bolstered
            by $837,000 in extra state special education money, while the School Committee put off
            its e-bike vote. And the Planning Board closed the hearing on 37
            Enon St, with a vote set for December 15.
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
            November 16 to November 22
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="deficit"
          data-dek={"The city's FY2027 budget, which runs through June 2027, is balanced. The Council's budget analyst put the FY2028 gap at $1,628,672, down from last December's $7.1 million forecast, mostly because the FY2027 budget closed a gap that forecast had carried forward. The figure leaves out the FEMA appeal, new union contracts and every Deficit Reduction Committee idea."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; City budget</Eyebrow>
          <H2>The FY2028 budget gap: $1.63 million, down from last December&apos;s $7.1 million forecast</H2>
          <From>Financial Forecast Committee &middot; Tuesday, November 17</From>
          <Hear
            src={FFC1117}
            s={1149}
            title="Gerry Perry walks through how the gap closed"
            meeting="Financial Forecast Committee, Nov 17"
          />
          <p className={BODY}>
            <b>How the budget year works.</b>{" "}
            Beverly&apos;s budget year, or fiscal year, runs from July 1 to June 30 and takes the
            name of the year it ends in. The current one, FY2027, runs from July 1, 2026 to June 30,
            2027. It started with a balanced budget: the Council closed its projected gap in June.{" "}
            <Moment src={FFC1117} s={788} /> Each fall the Financial Forecast Committee looks one year
            ahead, to FY2028, which starts July 1, 2027, and estimates the gap the Mayor will have to
            close before presenting the FY2028 budget to the Council in June 2027.
          </p>
          <p className={BODY}>
            <b>The new estimate.</b>{" "}
            That gap is now <Fig>$1,628,672</Fig>, the Council&apos;s budget analyst, Gerry Perry,
            told the committee. It is up from the $1.56 million councilors cited November 9, because
            the bill from the regional vocational school came in higher.{" "}
            <Moment src={FFC1117} s={1316} />{" "}
            <Earlier issue={10} slug="2026-11-16" id="deficit" label="the $1.56 million estimate" />
          </p>
          <p className={BODY}>
            <b>Why it isn&apos;t $7.1 million.</b>{" "}
            Last December&apos;s forecast put the FY2028 gap at <Fig>$7.1 million</Fig>{" "}
            <Src href={`${FORECAST}#page=11`}>(p. 11)</Src>. That forecast stacks each year&apos;s
            unclosed gap onto the next, so its $7.1 million was built on FY2027&apos;s own forecast
            gap of $3.9 million. That gap arrived as predicted, and the FY2027 budget, passed in June,
            closed it. <Moment src={FFC1117} s={1186} />
          </p>
          <p className={BODY}>
            Perry then walked through what has changed for FY2028 since last December, about $5.5
            million in all. He measures each change by its effect on the FY2028 budget, so these
            figures don&apos;t match FY2027&apos;s $3.9 million dollar for dollar:
          </p>
          <GapWaterfall />
          <ul className={LIST}>
            <li>
              <b>Decisions in the FY2027 budget (about $4.16 million):</b>{" "}The trash fee
              increase as proposed by the Mayor and modified by the Council (<Fig>$2,407,096</Fig>)
              and department cuts of 18.82 full-time positions affecting 26 employees
              (<Fig>$1,750,711</Fig>). <Moment src={FFC1117} s={1387} />
            </li>
            <li>
              <b>Revenue that beat last December&apos;s estimates (about $2.18 million):</b>{" "}State aid
              came in <Fig>$1,480,060</Fig>{" "}above projections, and new growth (taxes from new
              construction and newly taxable property) hit $1.95 million against the $1.25 million
              assumed (<Fig>$700,000</Fig>). <Moment src={FFC1117} s={1350} />
            </li>
            <li>
              <b>Higher cost estimates, adding back about $860,000:</b>{" "}Health insurance, state
              assessments and the vocational school went up; retirement costs went down. The net is
              the digest&apos;s arithmetic from Perry&apos;s totals. <Moment src={FFC1117} s={1524} />
            </li>
          </ul>
          <p className={BODY}>
            Perry said <Fig>$1.63 million</Fig>{" "}is about 16 or 17 employees at about $100,000
            each with benefits, and it &ldquo;does not restore any of those 18 employees&rdquo; cut
            in the FY2027 budget. <Moment src={FFC1117} s={7489} />
          </p>
          <p className={BODY}>
            <b>What the number leaves out.</b>{" "}
            New union contracts: the city&apos;s agreements end June 30, 2027, and the forecast assumes 3%
            raises. It also leaves out a final pension figure; keeping that payment level at about
            $15 million depends on a state letter due in December or January.{" "}
            <Moment src={FFC1117} s={2579} />
          </p>
          <p className={BODY}>
            <b>The FEMA appeal.</b>{" "}
            During COVID, the city billed FEMA for costs it expected to be reimbursed, mostly public
            safety: police who went with health inspectors to check
            masks and distancing in stores, and covering the shifts of police and firefighters who
            had symptoms. FEMA turned down about <Fig>$1.2 million</Fig>. The city&apos;s appeal was
            heard late this summer, and a decision is expected soon; the Mayor briefs the Council on
            Monday. <Moment src={FFC1117} s={1909} />
          </p>
          <p className={BODY}>
            Beverly isn&apos;t alone. FEMA turned down Holyoke&apos;s final appeal over about
            $218,000 in COVID-era costs in May{" "}
            <Src href={FEMA_HOLYOKE}>(FEMA)</Src>, and Chelsea is appealing a $3.2 million denial
            for food distribution <Src href={CHELSEA}>(Chelsea Record)</Src>. Since September 2020,
            FEMA&apos;s pandemic rules have covered police and security costs only when they
            supported a short list of eligible work, such as medical care, food and shelter{" "}
            <Src href={FEMA_POLICY}>(FEMA policy)</Src>.
          </p>
          <p className={BODY}>
            If the city loses, Perry said the money must come from one of two reserves: free cash
            (money left over when a year&apos;s books close; this fall&apos;s amount is down $1.5
            million and already set aside for roads and sidewalks) or the stabilization fund, which he likened to a
            savings account. The Mayor said he has committed to the state to ask the Council for
            a stabilization transfer, which takes six of nine votes.{" "}
            <Moment src={FFC1117} s={2104} />{" "}The two reserves together are about 17% of the
            operating budget, within the city&apos;s policy of 13 to 23%, the Mayor said.
          </p>
          <p className={BODY}>
            <b>The bill after that: school roofs.</b>{" "}
            Six elementary schools have roofs and heating systems near the end of their life, the
            committee heard. They were renovated one a year starting with McKeown in 1998, so they
            are coming due together, and Centerville&apos;s roof is in the worst shape. Perry said
            some of those roofs could cost as much as $15 million each.{" "}
            <Moment src={FFC1117} s={6179} />
          </p>
          <p className={BODY}>
            Paying for projects that size usually means borrowing. The city spends about 4.8% of its
            budget on debt payments, Perry said, down from where it was about ten years ago. His own
            view is that it should be closer to 7%, though he acknowledged that money would come out
            of day-to-day services, and he worries there won&apos;t be room to borrow for the roofs
            and heating systems in the next three to five years. The state School Building Authority
            can pay a share of school repairs, and the superintendent plans to apply (see story 3).{" "}
            <Moment src={FFC1117} s={5983} />
          </p>
          <p className={BODY}>
            <b>Where the Deficit Reduction Committee fits.</b>{" "}
            None of its ideas is in the $1.63 million. In October members sorted them by timing. Some
            could take effect within about a year: changing how much of health premiums the city
            pays for its workers and retirees, a different health plan, higher parking rates and new
            meters, and program fees. Others would take longer.{" "}
            <Earlier issue={7} slug="2026-10-26" id="deficit" label="the ideas, by timing" />
          </p>
          <p className={BODY}>
            Changing the employee premium share has to be negotiated with the unions, whose
            contracts end as FY2028 begins. Members plan to bring their ideas to the full Council in
            January; the bigger ones (zoning, new growth, an override, selling city property) moved
            to late winter or spring <Src href={DRC_1112}>(agenda)</Src>. The Mayor builds the
            FY2028 budget over the spring and presents it in June. And new growth is certified by the
            state each fall, so &ldquo;you&apos;re not going to know until next September what next
            year&apos;s growth is,&rdquo; Perry said. <Moment src={FFC1117} s={3128} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${FORECAST}#page=11`}>Financial forecast, FY2026 to FY2030 (p. 11)</Src>
                <Src href={FFC_1117}>Committee agenda, Nov 17</Src>
                <Src href={FFC1117}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="standley"
          data-dek={"Waring School's plan to divide 4.38 acres at 38 Standley St into four house lots would take down a First Period house dating to 1700 to 1720. Waring's engineer put restoration at about $3.5 million. Two Historic Beverly board members, speaking for themselves, showed an alternative that keeps the house, and Councilors St. Hilaire and Houseman wrote asking the board to save it. The hearing continues December 15."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Planning Board</Eyebrow>
          <H2>Waring School&apos;s plan for 38 Standley St would take down a house from about 1700</H2>
          <From>Planning Board &middot; Tuesday, November 17 &middot; OSRD site plan #13-25, Ward 6</From>
          <Hear
            src={PB1117}
            s={8182}
            title="Waring's engineer on the cost of restoring the house"
            meeting="Planning Board, Nov 17"
          />
          <p className={BODY}>
            Waring School wants to divide its 4.38-acre lot at 38 Standley St, take down the house and
            outbuildings, and build four single-family homes facing Standley St. About 2.2 acres would
            stay open space next to more than 50 acres of city land. The plan uses the city&apos;s open
            space residential design rules (OSRD), which cluster homes in exchange for protected land.{" "}
            <Moment src={PB1117} s={7188} />
          </p>
          <p className={BODY}>
            <b>The house.</b>{" "}
            It is a First Period house, meaning one built before 1725. The Historic District
            Commission&apos;s chair, Bill Finch, has said its core was probably built between 1700
            and 1720 <Src href={BEAT_STANDLEY}>(Beverly Beat)</Src>. Harvard zoologist Harold
            Jefferson Coolidge and his wife moved in in 1976 and added on to it; the property later
            went to Waring, and the house has been empty and unheated for more than ten years{" "}
            <Src href={SN_STANDLEY}>(Salem News)</Src>. An early 1800s shoe shop, known as a
            &ldquo;ten-footer,&rdquo; stands on the lot. <Moment src={PB1117} s={7511} />
          </p>
          <figure className="mt-6 max-w-[63ch]">
            <div className="grid gap-2 sm:grid-cols-[3fr_2fr]">
              <a href={`${FIGS}/standley-house-wide.jpg`} target="_blank" rel="noopener" data-track="figure_opened">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${FIGS}/standley-house-wide.jpg`}
                  alt="The house at 38 Standley St in late fall: a long white clapboard house behind a large bare tree and a leaf-covered lawn. At left, a wing with a broad dark roof, a skylight and tall windows; at right, a gambrel-roofed section with a dormer, a white brick chimney and a covered porch."
                  width={1600}
                  height={900}
                  loading="lazy"
                  className="h-full w-full rounded border border-rule object-cover"
                />
              </a>
              <a href={`${FIGS}/standley-house-porch-end.jpg`} target="_blank" rel="noopener" data-track="figure_opened">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${FIGS}/standley-house-porch-end.jpg`}
                  alt="A closer view of the porch end of the house: peeling white clapboards, a gambrel roof, a tall white brick chimney, and a porch with the number 38 over the steps."
                  width={1400}
                  height={1054}
                  loading="lazy"
                  className="h-full w-full rounded border border-rule object-cover object-top"
                />
              </a>
            </div>
            <figcaption className="mt-2 text-[0.85rem] leading-snug text-ink-faint">
              The house on November 22, and its porch end with the large chimney. Waring&apos;s engineer described a core from about 1700 to 1720,
              a large addition to the west built around 1978, and possibly 1800s additions in
              between. <Moment src={PB1117} s={7548} /> Photos by James Laurenti.
            </figcaption>
          </figure>
          <p className={BODY}>
            <b>The delay.</b>{" "}
            In January the commission voted unanimously to declare the house and the shoe shop
            historically significant, which delays demolition by one year{" "}
            <Src href={SN_STANDLEY_JAN}>(Salem News, January)</Src>.
          </p>
          <p className={BODY}>
            <b>Waring&apos;s case.</b>{" "}
            A restoration contractor put the work at more than $3 million to make the house livable,
            Waring&apos;s engineer said, and with costs that estimate leaves out, such as mold, pests
            and possible asbestos, &ldquo;it&apos;s easily a $3.5 million project.&rdquo; Waring
            &ldquo;doesn&apos;t have $3 million of slop in its budget,&rdquo; he said. The school is
            still open to a reasonable offer and would move the shoe shop to its campus.{" "}
            <Moment src={PB1117} s={8218} />
          </p>
          <p className={BODY}>
            <b>Calls to keep it.</b>{" "}
            The board received a letter ahead of the meeting from Councilors Matt St. Hilaire (Ward 6) and Scott
            Houseman (Ward 4) asking it to find a way to preserve the house. <Moment src={PB1117} s={8428} />
          </p>
          <p className={BODY}>
            Two board members of Historic Beverly, speaking for
            themselves, showed an alternative that keeps the house while still creating four lots to
            sell.
            They said their builders&apos; figures were well under $3 million. Neither estimate has
            been made public. <Moment src={PB1117} s={9027} />
          </p>
          <p className={BODY}>
            <b>What the board can do.</b>{" "}
            The chair said he &ldquo;was not aware&rdquo; of the house&apos;s history when the board
            backed the current layout earlier in the process, and noted that the board&apos;s legal
            powers have limits. <Moment src={PB1117} s={9408} />{" "}The board chose that layout in
            the spring of 2025, before the commission&apos;s January vote. The commission
            wasn&apos;t consulted then and wasn&apos;t required to be, Planning Director Darlene
            Wynne told the <Src href={SN_STANDLEY}>Salem News</Src>.
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}
            Members asked to see Waring&apos;s contractor estimate and the alternative plan. City
            departments have until about December 3 to comment, and the board can&apos;t act before
            then. The city has also asked the Historic District Commission to review the plan at its
            December 9 meeting <Src href={SN_STANDLEY}>(Salem News)</Src>. The hearing continues
            December 15. <Moment src={PB1117} s={9566} />
          </p>
          <Refs
            sources={
              <>
                <Src href={PB_1117}>Planning Board agenda, Nov 17</Src>
                <Src href={SN_STANDLEY}>Salem News, Nov 19</Src>
                <Src href={BEAT_STANDLEY}>Beverly Beat, Jan 8</Src>
                <Src href={PB1117}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="schools"
          data-dek={"Almost five months into the school year's budget, revenue and spending are on target, the district's interim finance director told the School Committee's finance subcommittee. State reimbursement for the costliest special education came in about $837,000, or 22%, above budget; it goes into a revolving special education account used to offset the following year's costs. The superintendent plans to seek state repair money starting with Centerville, one of six elementary schools whose roofs are coming due."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Schools</Eyebrow>
          <H2>The school budget is on track so far, with $837,000 more in state special education money than planned</H2>
          <From>School Committee, Finance and Facilities &middot; Wednesday, November 18</From>
          <p className={BODY}>
            Almost five months into the school budget year, which runs July to June, revenue is
            &ldquo;running right on target,&rdquo; the district&apos;s interim finance director, Joan
            Liporto, told the School Committee&apos;s finance subcommittee at its monthly review. On
            spending, &ldquo;I don&apos;t see any areas yet in November where I would be
            concerned.&rdquo; <Moment src={SC1118} s={1561} />
          </p>
          <p className={BODY}>
            <b>$837,000 more from the state.</b>{" "}
            The state&apos;s &ldquo;circuit breaker&rdquo; program pays back part of what a district
            spent the year before on its costliest special education services, mostly tuition at outside
            schools and the buses to get there <Src href={DESE_CB}>(DESE)</Src>. Beverly budgeted{" "}
            <Fig>$3,822,975</Fig>{" "}<Src href={`${SC_FF_PACKET}#page=9`}>(p. 9)</Src>{" "}and now
            expects about <Fig>$4.6 million</Fig>, about 22% more. Part of the jump is higher
            transportation costs being reimbursed. <Moment src={SC1118} s={969} />
          </p>
          <p className={BODY}>
            <b>Not something to count on.</b>{" "}
            The amount depends on what the Legislature puts into the program each year. For FY2027,
            lawmakers added $152 million in one-time money{" "}
            <Src href={MASC_FY27}>(MASC)</Src>. Two years ago the state covered only 44% of the
            transportation costs Beverly expected, according to the city forecast committee&apos;s
            December 2024 minutes.
          </p>
          <p className={BODY}>
            <b>What it&apos;s for.</b>{" "}
            The money stays in a special education account. Beverly has used each year&apos;s
            reimbursement toward the following year&apos;s special education tuition, which lowers
            what the school budget needs. Whether this extra reimbursement will ease the FY2028
            school budget (and, in turn, help close the city&apos;s $1.63 million gap)
            didn&apos;t come up. The schools present their FY2028 numbers to the Financial Forecast Committee on November 30.
          </p>
          <p className={BODY}>
            <b>Going the other way: electricity.</b>{" "}
            Solar credits that used to cover part of the high school&apos;s electric bills ended, so
            that line is already over budget. The city is paying those bills in FY2027 from a
            one-time solar payout, but the FY2028 budget will have to plan for the full cost,
            Liporto said. <Moment src={SC1118} s={1442} />
          </p>
          <p className={BODY}>
            <b>The roofs.</b>{" "}
            The superintendent plans to apply this winter to the state School Building
            Authority&apos;s repair program, which shares the cost of roofs, windows, doors and
            heating. He would start with Centerville, whose roof is in the worst shape of the six
            elementary schools needing replacement (see story 1), and look at the district&apos;s other needs.
            Applying takes School Committee and Council votes. <Moment src={SC1118} s={1693} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${SC_FF_PACKET}#page=9`}>Finance packet, Nov 18 (p. 9)</Src>
                <Src href={DESE_CB}>DESE circuit breaker FAQ</Src>
                <Src href={SC1118}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="ebikes"
          data-dek={"The School Committee voted 7-0 to put off its final vote on rules for e-bikes and scooters to its next meeting. Two members were absent, the draft bars every powered device from school property without separating pedal-assist bikes from throttle bikes, and three versions of the draft were in circulation. The superintendent will post the draft with a feedback form."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; Schools</Eyebrow>
          <H2>The School Committee puts off its e-bike vote</H2>
          <From>School Committee &middot; Wednesday, November 18 &middot; Policy JLIDA</From>
          <Hear
            src={SC1118}
            s={8979}
            title="Why the committee held off"
            meeting="School Committee, Nov 18"
          />
          <p className={BODY}>
            The School Committee was set to take its final vote on rules for e-bikes, scooters and
            similar devices on school property. Instead it voted 7-0 to table the policy &ldquo;until
            our next meeting.&rdquo; Nothing is in effect. <Moment src={SC1118} s={9954} />{" "}
            <Earlier issue={8} slug="2026-11-02" id="schools" label="the first reading" />
          </p>
          <p className={BODY}>
            <b>Why.</b>{" "}Members gave three reasons.
          </p>
          <ul className={LIST}>
            <li>
              <b>Two members were absent,</b>{" "}and one had told the chair, Lorinda Visnick, that she
              heard from several constituents about the policy. <Moment src={SC1118} s={8979} />
            </li>
            <li>
              <b>The draft treats every device the same.</b>{" "}As written, the policy bars electric or
              motorized bikes, scooters, skateboards, hoverboards and similar devices anywhere on
              school property, from parking lots to bus loops, with exemptions for disability
              devices, police, on-duty staff and approved school activities{" "}
              <Src href={`${SC_COTW_PACKET}#page=21`}>(p. 21)</Src>. Mayor Cahill said it does not
              separate pedal-assist bikes from throttle bikes. The policy chair, Catherine Frost, said
              the first version was &ldquo;intentionally big. And that&apos;s not what folks
              want.&rdquo; <Moment src={SC1118} s={9168} />
            </li>
            <li>
              <b>Three drafts were in circulation.</b>{" "}The version in the packet differed from the
              one a subcommittee approved. &ldquo;How did that happen?&rdquo; the chair asked.{" "}
              <Moment src={SC1118} s={9293} />
            </li>
          </ul>
          <p className={BODY}>
            <b>What&apos;s next.</b>{" "}
            Frost will reconcile the drafts, with input from the city&apos;s Bicycle and Pedestrian
            Advisory Committee and the police. Superintendent Peter Cushing will post the updated draft
            on the district&apos;s Facebook page and in his weekly memo, with a feedback form shared
            with members. <Moment src={SC1118} s={9020} />
          </p>
          <p className={BODY}>
            <b>Nearby.</b>{" "}
            Danvers&apos; School Committee voted November 9 to allow ordinary bikes and pedal-assist
            e-bikes, provided riders walk them on school grounds, while banning throttle e-bikes,
            motorized scooters and similar devices, the <Src href={DANVERS}>Salem News reported</Src>. Haverhill
            banned e-bikes and e-scooters from school property outright in August, the{" "}
            <Src href={HAVERHILL}>Eagle-Tribune reported</Src>.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${SC_COTW_PACKET}#page=21`}>The draft policy (p. 21)</Src>
                <Src href={SC1118}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 05 ---- */}
        <section
          id="enon"
          data-dek={"The Planning Board closed its public hearing on 179 apartments at 37 Enon St, the Stop & Shop site in Ward 5, after the Parking and Traffic Commission and the Design Review Board both recommended approval. The board continued the matter to December 15, when its chair expects to hold a vote."}
          className={SECTION}
        >
          <Eyebrow>05 &middot; Planning Board</Eyebrow>
          <H2>37 Enon St: the hearing closes, and a vote is set for December 15</H2>
          <From>Planning Board &middot; Tuesday, November 17 &middot; Ward 5</From>
          <p className={BODY}>
            The Planning Board closed its public hearing on the plan for 179 apartments at 37 Enon
            St, the Stop &amp; Shop site, on a 7-0 roll call. The board&apos;s chair said his
            &ldquo;strong intention&rdquo; is to vote at the next meeting, December 15, after hearing
            from the Clean Energy Advisory Committee. <Moment src={PB1117} s={6302} /> That
            committee had the project on its November 19 agenda{" "}
            <Src href={`${CEAC_1119}#page=1`}>(p. 1)</Src>; nothing from the meeting has been posted
            yet.{" "}
            <Earlier issue={8} slug="2026-11-02" id="enon" label="the October hearing" />
          </p>
          <p className={BODY}>
            <b>What&apos;s new.</b>{" "}
            Both advisory boards recommended approval. <Moment src={PB1117} s={390} /> The Parking
            and Traffic Commission voted 6-0 with 10 conditions, among them new traffic counts at the
            driveways while school is in session, and working with the city and the MBTA on moving
            the 451 bus stop and turnaround <Src href={`${DOC}/7826#page=3`}>(pp. 3-4)</Src>. The
            Design Review Board voted 5-0, with five suggestions on roofing, plantings, the dog run
            and paths that it said &ldquo;are not conditions of approval&rdquo;{" "}
            <Src href={`${DOC}/7827#page=2`}>(p. 2)</Src>.
          </p>
          <p className={BODY}>
            <b>What to expect.</b>{" "}
            With the hearing closed, there is no more public testimony. The board has 90 days to decide
            on the special permits (including inclusionary housing) and 65 days for site plan review.{" "}
            <Moment src={PB1117} s={6383} />
          </p>
          <Refs
            sources={
              <>
                <Src href={ENON_PAGE}>The city&apos;s project page</Src>
                <Src href={PB1117}>Full recording</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also at the Conservation Commission, November 17:</b>{" "}
            Endicott College plans to replace about 100 feet of the concrete base under the slope that
            holds up Hale St, and build a new 175-foot seawall at its Misselwood property, 385 and 407
            Hale St, in Ward 6. A site visit is set for November 28 at 8am; the hearing continues
            December 8. The commission also named Greg Power its representative to the Open Space and
            Recreation Committee, 5-0. <Src href={CONCOM_1117}>(Agenda)</Src>
          </p>
          <p className="mt-2.5 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Commission on Disabilities, November 12:</b>{" "}
            A deaf resident asked again for sign language interpreters at North Shore Music
            Theatre&apos;s A Christmas Carol. The commissioner who has worked on it since May said the
            city cannot require a private business to provide them, and pointed to state and federal
            enforcement of the Americans with Disabilities Act. <Moment src={COD1112} s={560} />
          </p>
        </div>

        {/* ---- ahead ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through December 15
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
            <Src href={`${COUNCIL_1123_SPECIAL}#page=1`}>Council special meeting notice (p. 1)</Src>
            <Src href={`${COUNCIL_1123}#page=1`}>Council agenda and packet, Nov 23 (p. 1)</Src>
            <Src href={`${ZBA_1124}#page=1`}>ZBA notice (p. 1)</Src>
            <Src href={`${FFC_1130}#page=1`}>Forecast Committee notice, Nov 30 (p. 1)</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>
      </div>
    </div>
  );
}
