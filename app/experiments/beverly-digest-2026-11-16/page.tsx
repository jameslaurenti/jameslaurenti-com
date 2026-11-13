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
const CC1109 = `${V}GEULSSsKS4U`;
const CC0623 = `${V}nlwByu273SM`;
const FLOCK1019 = `${V}x_567bYRlvc`;

const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DOC = "https://www.beverlyma.gov/DocumentCenter/View";
const COUNCIL_1109 = `${AGENDA}/ViewFile/Agenda/_11092026-2991`;
const DRC_1112 = `${AGENDA}/ViewFile/Agenda/_11122026-2992`;
const PB_1117 = `${AGENDA}/ViewFile/Agenda/_11172026-3000`;
const FP_1119 = `${AGENDA}/ViewFile/Agenda/_11192026-3005`;
const CEAC_1119 = `${AGENDA}/ViewFile/Agenda/_11192026-3003`;
const FFC_1117 = `${AGENDA}/ViewFile/Agenda/_11172026-2995`;
const FFC_1130 = `${AGENDA}/ViewFile/Agenda/_11302026-2996`;
const CPC_1119 = `${AGENDA}/ViewFile/Agenda/_11192026-2985`;
const CLERK_1116 = `${AGENDA}/ViewFile/Agenda/_11162026-2993`;
const PACKET_1005 = `${AGENDA}/ViewFile/Agenda/_10052026-2938`;
const PACKET_0908 = `${AGENDA}/ViewFile/Agenda/_09082026-2890`;
const OSRC_REPORT = `${DOC}/7789`;
const FORECAST =`${DOC}/6958/Financial-Forecast-Report-FY2026-2030`;
const ALPR_POLICY = "https://beverlypolice.org/wp-content/uploads/2026/04/ALPR-2026-GO-02.pdf";

const GLOBE_SUTTON =
  "https://www.bostonglobe.com/2026/11/10/business/kraft-group-data-centers-sutton-mass/";
const ML_SUTTON =
  "https://www.masslive.com/centralmass/2026/11/central-mass-residents-oppose-data-center-proposal-at-raucous-meeting-kill-it-now.html";
const ML_SOUTHBRIDGE =
  "https://www.masslive.com/centralmass/2026/11/central-mass-towns-data-center-moratorium-goes-into-effect-next-week-heres-what-to-know.html";
const ML_LEOMINSTER =
  "https://www.masslive.com/centralmass/2026/09/central-mass-city-approves-1-year-moratorium-on-data-centers-battery-storage-sites.html";

const contents: [string, string][] = [
  ["datacenters", "The data center pause passes its first vote, 8-0, as councilors ask what its wording would catch"],
  ["flock", "The city lets its Flock camera contract lapse"],
  ["deficit", "Next year's projected deficit is about $1.6 million, before the forecast committee's review"],
  ["humanrights", "The Council splits 4-4 on restoring the diversity director, then asks the Mayor for $20,000"],
  ["ahead", "Coming up, through December 10"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Nov 16",
    what: "Post-election tabulation",
    detail: "8:00am at the City Clerk's office, temporary City Hall, 175 Cabot St.",
  },
  {
    date: "Nov 17",
    what: "Financial Forecast Committee",
    detail:
      "6:30pm in the Police Station community room, 175 Elliott St. The first of three meetings that produce the forecast next year's budget starts from. The Council's budget analyst, Gerry Perry, presents proposed city revenues and spending.",
    cal: {
      id: "forecast-2026-11-17",
      title: "Beverly Financial Forecast Committee",
      start: "2026-11-17T23:30:00Z",
      end: "2026-11-18T01:00:00Z",
      location: "Beverly Police Station, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Nov 17",
    what: "Planning Board: 37 Enon St and Waring School",
    detail:
      "7:00pm in the Middle School library, 502 Cabot St, and online. The hearing on 179 apartments at 37 Enon St, the Stop & Shop site in Ward 5, continues. Then a hearing on Waring School's plan to divide its 4.38-acre lot at 38 Standley St for four single-family homes.",
    cal: {
      id: "planning-2026-11-17",
      title: "Beverly Planning Board",
      start: "2026-11-18T00:00:00Z",
      end: "2026-11-18T02:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 18",
    what: "School Committee: policy votes",
    detail:
      "Subcommittees at 6:00pm, then the Committee of the Whole at 7:15pm, in the Middle School library. Second reading of the policies on powered e-bikes and scooters and on school trips abroad.",
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
    date: "Nov 19",
    what: "Clean Energy Advisory Committee, with the Council's Finance and Property committee",
    detail:
      "6:30pm in the Sohier Room at the Beverly Public Library, 32 Essex St, and online. Both posted notices for the same time and room. The advisory committee's agenda includes its input on the 37 Enon St proposal and its December 7 update to the Council.",
    cal: {
      id: "ceac-fp-2026-11-19",
      title: "Beverly Clean Energy Advisory Committee and Council Finance and Property",
      start: "2026-11-19T23:30:00Z",
      end: "2026-11-20T00:30:00Z",
      location: "Beverly Public Library, Sohier Room, 32 Essex St, Beverly, MA",
    },
  },
  {
    date: "Nov 23",
    what: "City Council: final vote on the data center pause",
    detail:
      "The agenda is not posted yet. Set so far: the final vote on the data center pause; hearings on National Grid's petitions for underground lines on Woodbury Street, 7:30pm, and Dane Street, 7:40pm; and a hearing on Lynch Park's next phase, 7:50pm.",
  },
  {
    date: "Nov 30",
    what: "Financial Forecast Committee",
    detail: "6:30pm in the Police Station community room, 175 Elliott St. School and vocational school spending, then a scheduled vote to approve the forecast.",
  },
  {
    date: "Dec 7",
    what: "City Council: the tax rate, and the Human Rights Committee money",
    detail:
      "The tax rate is projected to be set this night. If the Mayor sends the $20,000 request, its hearing and final vote would be the same night, on Councilor Houseman's timeline.",
  },
  {
    date: "Dec 10",
    what: "Financial Forecast Committee",
    detail: "6:30pm in the Police Station community room, 175 Elliott St. The last of three meetings.",
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue10() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 10. Set to
          "2026-11-16" when publishing. */}
      <PageTracking surface="digest" issue="2026-11-16-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 10 &middot; Week of November 16
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering November 9 to November 15, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The Council voted 8-0 for the data center pause, with questions about what its wording
            would catch, and the final vote is November 23. The city is letting its Flock camera
            contract lapse. Next year&apos;s projected deficit is about $1.6 million, before the
            forecast committee&apos;s review. And the Council split 4-4 on bringing back the
            diversity director, then asked the Mayor for $20,000 for the Human Rights Committee.
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
            November 9 to November 15
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="datacenters"
          data-dek={"The Council voted 8-0 for the Mayor's one-year pause on data center applications, the first of two votes; the final vote is November 23 and needs six of nine. Councilors asked whether the definition could catch ordinary businesses with servers. The Planning Director said the words \"primary use\" keep those out and existing businesses are not affected, and the wording was not changed."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Data centers</Eyebrow>
          <H2>The data center pause passes its first vote, 8-0, as councilors ask what its wording would catch</H2>
          <From>
            City Council &middot; Monday, November 9 &middot; Order #250, submitted by the Mayor
          </From>
          <Hear
            src={CC1109}
            s={2224}
            title="The Planning Director on why the definition needs care"
            meeting="City Council, Nov 9"
          />
          <p className={BODY}>
            The Council voted 8-0 for the Mayor&apos;s proposed pause on data center applications.
            It was the first of two votes. The final vote is set for November 23, and adoption takes
            six of the nine councilors. The pause would run through November 30, 2027, or end
            sooner if the city adopts rules for data centers.{" "}
            <Moment src={CC1109} s={5927} />{" "}
            <Earlier issue={8} slug="2026-11-02" id="datacenters" label="the Planning Board's 7-0 vote" />
          </p>
          <p className={BODY}>
            <b>The question was the wording.</b>{" "}
            No councilor spoke against pausing. The questions were about what the definition
            would catch. The order defines a data center as a building or group of buildings
            &ldquo;the primary use of which is to house computer systems, servers, data storage
            equipment, networking equipment,&rdquo; with no minimum size{" "}
            <Src href={`${PACKET_1005}#page=40`}>(p. 40)</Src>.
          </p>
          <ul className={LIST}>
            <li>
              <b>Does anything here count today?</b>{" "}Councilor St. Hilaire asked. Planning
              Director Darlene Wynne said servers and networking equipment &ldquo;are just in all of
              our office spaces. But that&apos;s why we have to come up with this careful
              definition.&rdquo; She repeated a Planning Board member&apos;s remark that &ldquo;we
              all have little data centers in our hands.&rdquo;{" "}
              <Moment src={CC1109} s={2224} /> <Moment src={CC1109} s={2262} />
            </li>
            <li>
              <b>What about part of a building?</b>{" "}Councilor Houseman pointed to a case in Salem,
              where a proposal would have used only part of a building, and said the city might
              &ldquo;look into possible refinement.&rdquo; Wynne said the wording came from
              Stoneham&apos;s and Lowell&apos;s pauses, and that if there were a recommendation to
              change it, &ldquo;we could do that.&rdquo;{" "}
              <Moment src={CC1109} s={2292} /> <Moment src={CC1109} s={2382} />{" "}
              <Moment src={CC1109} s={2423} />
            </li>
            <li>
              <b>Could it catch the wrong business?</b>{" "}At the Council&apos;s Legal Affairs
              committee, one member said, &ldquo;I think we&apos;re all for what ... the intent
              is,&rdquo; and asked, &ldquo;do we unintentionally do something we don&apos;t want to
              do.&rdquo; Wynne said she had checked with the City Solicitor. The words &ldquo;primary
              use&rdquo; keep out businesses that run their own servers to operate. And the pause
              &ldquo;wouldn&apos;t change any existing uses for sure ... it would just be new
              buildings, new uses.&rdquo;{" "}
              <Moment src={CC1109} s={4574} /> <Moment src={CC1109} s={4611} />{" "}
              <Moment src={CC1109} s={4741} />
            </li>
          </ul>
          <p className={BODY}>
            The committee recommended the order 3-0 as written, and no one moved to change it at the
            full Council.{" "}
            <Moment src={CC1109} s={4778} /> <Moment src={CC1109} s={5885} />
          </p>
          <p className={BODY}>
            <b>Why a year.</b>{" "}
            One resident at the hearing asked the Council to consider making the pause permanent.
            Wynne said the pause is there &ldquo;in order to craft better regulation&rdquo;: what
            reviews and mitigation to require, and &ldquo;whether or not we want to allow them, what
            scale we want to allow them at and in which locations.&rdquo; State guidance is expected
            at the end of the year, which she called another reason to wait. Asked by Councilor
            Spang whether a year is enough, she said yes, and that the Council can extend it. Work
            on the rules starts in the new year.{" "}
            <Moment src={CC1109} s={2003} /> <Moment src={CC1109} s={2074} />{" "}
            <Moment src={CC1109} s={2196} /> <Moment src={CC1109} s={2449} />{" "}
            <Moment src={CC1109} s={4680} />{" "}
            <Earlier issue={5} slug="2026-10-12" id="datacenters" label="the pause and the state's order" />
          </p>
          <p className={BODY}>
            <b>Elsewhere in Massachusetts.</b>{" "}
            The same week, the Kraft Group and Unified Global Packaging Group&apos;s plan for a
            10-building data center campus in Sutton, south of Worcester, went before that
            town&apos;s Select Board, which took no action,{" "}
            <Src href={GLOBE_SUTTON}>The Boston Globe reported</Src>. Nothing has been filed there.
            Southbridge&apos;s one-year pause takes effect November 17, and Leominster passed one in
            September, <Src href={ML_SOUTHBRIDGE}>MassLive</Src>{" "}
            <Src href={ML_LEOMINSTER}>reported</Src>. More than 30 Massachusetts communities have
            passed or are discussing pauses or bans,{" "}
            <Src href={ML_SUTTON}>according to MassLive</Src>.
          </p>
          <Refs
            sources={
              <>
                <Src href={COUNCIL_1109}>Council agenda and packet, Nov 9</Src>
                <Src href={`${PACKET_1005}#page=39`}>Order #250, Council packet (p. 39)</Src>
                <Src href={CC1109}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="flock"
          data-dek={"The city is letting its contract with Flock Safety, the company behind its four license plate cameras, lapse \"while we spend more time figuring out the outstanding details,\" the Mayor's office told residents in a November 9 email, with more information promised in the coming weeks."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Flock cameras</Eyebrow>
          <H2>The city lets its Flock camera contract lapse</H2>
          <From>The Mayor&apos;s office, in an email to residents &middot; Monday, November 9</From>
          <p className={BODY}>
            Beverly is letting its contract with Flock Safety, the company behind the city&apos;s
            four license plate cameras, lapse. &ldquo;The City is choosing to let the current
            contract lapse while we spend more time figuring out the outstanding details,&rdquo; the
            Mayor&apos;s constituent services director wrote on November 9 to residents who had
            contacted the office about it. &ldquo;More information will be forthcoming in the coming
            weeks.&rdquo; A resident also read the news into the record at that night&apos;s Council
            meeting.
          </p>
          <p className={BODY}>
            The Mayor said in October that the contract would expire in mid-November. Councilor
            Rotondo said then that the decision is the Mayor&apos;s, as the city&apos;s chief
            procurement officer.{" "}
            <Moment src={FLOCK1019} s={1591} /> <Moment src={FLOCK1019} s={3237} />{" "}
            <Earlier issue={7} slug="2026-10-26" id="flock" label="the October meeting" />
          </p>
          <p className={BODY}>
            The email did not say whether the cameras have been switched off or what comes next.
            Police policy keeps plate data for{" "}
            <Src href={ALPR_POLICY}>30 days</Src>{" "}unless it is saved for an investigation. At Council meetings in
            April and October, police described cases the cameras helped solve,
            and most residents who spoke asked the city to end the contract. The Council&apos;s own
            review, Order #120, is still in committee.
          </p>
          <Refs
            sources={
              <>
                <Src href={ALPR_POLICY}>Police camera policy</Src>
              </>
            }
            more={
              <>
                <Earlier issue={6} slug="2026-10-19" id="flock" label="the cameras and the rules" />
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="deficit"
          data-dek={"The city's projected deficit for FY2028 is $1,560,000, Councilor Houseman told the Council, subject to the Financial Forecast Committee's work, which starts November 17. Last December's forecast put the FY2028 gap at $7.1 million, but that figure carried FY2027's $3.9 million gap, which the city closed in this year's budget."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; City budget</Eyebrow>
          <H2>Next year&apos;s projected deficit is about $1.6 million, before the forecast committee&apos;s review</H2>
          <From>
            City Council &middot; Monday, November 9. Deficit Reduction Committee &middot; Thursday,
            November 12, online
          </From>
          <p className={BODY}>
            The city&apos;s projected deficit for next year&apos;s budget, FY2028, is{" "}
            <Fig>$1,560,000</Fig>, Councilor Houseman told the Council, &ldquo;subject to the work of
            the financial forecasting committee.&rdquo;{" "}
            <Moment src={CC1109} s={8545} /> <Moment src={CC1109} s={8586} />{" "}Three days later the
            Deficit Reduction Committee&apos;s chair, Councilor Kathleen Feldman, gave the committee
            the same figure, about $1.5 million. Neither figure has been published in a city
            document yet. The Financial Forecast Committee, which writes that document, starts
            meeting November 17.
          </p>
          <p className={BODY}>
            <b>Why it is lower than last year&apos;s forecast.</b>{" "}
            Last December&apos;s{" "}
            <Src href={`${FORECAST}#page=12`}>forecast (p. 12)</Src>{" "}put the FY2028 gap at{" "}
            <Fig>$7.1 million</Fig>. That figure carried the FY2027 gap of <Fig>$3.9 million</Fig>,
            which the city closed with cuts and new fees before the budget passed in June. Feldman
            told the committee the old figure no longer applies, and that there is almost always a
            projected deficit at this point in the year.
          </p>
          <p className={BODY}>
            That forecast also assumed the city&apos;s pension payment would keep rising 4.5% a
            year. In September, the finance director told the deficit committee the city can ease
            off that increase.{" "}
            <Earlier issue={2} slug="2026-09-21" id="pension" label="the pension payment" />
          </p>
          <p className={BODY}>
            <b>What&apos;s next.</b>{" "}
            The Financial Forecast Committee meets November 17, November 30 and December 10, each at
            6:30pm in the Police Station community room. Its report sets the starting point for the
            FY2028 budget.{" "}
            <Moment src={CC1109} s={10268} />{" "}On November 17, the Council&apos;s budget analyst, Gerry
            Perry, presents proposed city revenues and spending{" "}
            <Src href={`${FFC_1117}#page=1`}>agenda (p. 1)</Src>. On November 30, school officials
            present school spending, followed by vocational school costs, and the committee is
            scheduled to vote to approve the forecast{" "}
            <Src href={`${FFC_1130}#page=1`}>agenda (p. 1)</Src>.
          </p>
          <p className={BODY}>
            <b>The deficit committee&apos;s next steps.</b>{" "}
            Feldman plans a January meeting of the Council&apos;s Finance and Property committee,
            open to every councilor, so councilors can ask about the committee&apos;s October 20
            presentation. So many councilors attended that night that they could not discuss it
            among themselves. Feldman and Councilor Mullady will also ask for a standing committee
            on PILOTs, the payments some tax-exempt owners make in place of property taxes.
            Bigger questions, such as zoning, new growth and an override, move to late winter or
            spring, when the Planning Director will be invited. These are topics the committee is
            studying, not recommendations.{" "}
            <Src href={DRC_1112}>(Committee agenda)</Src>
          </p>
          <Refs
            sources={
              <>
                <Src href={`${FORECAST}#page=12`}>Financial forecast, FY2026 to FY2030 (p. 12)</Src>
                <Src href={DRC_1112}>Deficit committee agenda, Nov 12</Src>
                <Src href={CC1109}>Council recording, Nov 9</Src>
              </>
            }
            more={
              <>
                <Earlier issue={7} slug="2026-10-26" id="deficit" label="the committee's ideas" />
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section
          id="humanrights"
          data-dek={"An amendment asking the Mayor for the full $62,621 cut in June, enough to bring back the part-time diversity, equity, inclusion and belonging director, failed 4-4. The Council then voted 5-3 to ask him for $20,000 for the volunteer Human Rights Committee, which he had said in advance he would send. A hearing and final vote would come December 7."}
          className={SECTION}
        >
          <Eyebrow>04 &middot; City Council</Eyebrow>
          <H2>The Council splits 4-4 on restoring the diversity director, then asks the Mayor for $20,000</H2>
          <From>
            City Council &middot; Monday, November 9 &middot; Order #213, filed by Councilor Houseman
          </From>
          <Hear
            src={CC1109}
            s={9437}
            title="The debate before the 4-4 vote"
            meeting="City Council, Nov 9"
          />
          <p className={BODY}>
            The Council voted 5-3 to ask the Mayor for <Fig>$20,000</Fig>{" "}for the city&apos;s
            volunteer Human Rights Committee. Before that, an amendment to ask instead for the full{" "}
            <Fig>$62,621</Fig>{" "}cut from the budget in June, enough to bring back the part-time
            diversity, equity, inclusion and belonging (DEIB) director, failed 4-4. Councilor Sonia
            was absent, which left the tie.{" "}
            <Moment src={CC1109} s={7376} /> <Moment src={CC1109} s={9489} />{" "}
            <Moment src={CC1109} s={10175} />
          </p>
          <p className={BODY}>
            <b>The amendment, 4-4.</b>{" "}
            For: Councilors Flowers, Houseman, Mullady and Spang. Against: Councilors Crowley,
            Feldman, Rotondo and St. Hilaire.
          </p>
          <p className={BODY}>
            <b>What the vote does.</b>{" "}
            It is a request, not spending. The Council cannot add money to the budget on its own; it
            asks the Mayor to send an appropriation.{" "}
            <Moment src={CC1109} s={10064} />{" "}Houseman said the Mayor authorized him to tell the
            Council he would send one for the $20,000 if it passed the order as written. On
            Houseman&apos;s timeline, the Council sets a hearing on November 23 and takes the final
            vote December 7, the night the tax rate is projected to be set.{" "}
            <Moment src={CC1109} s={7217} /> <Moment src={CC1109} s={7259} />
          </p>
          <p className={BODY}>
            <b>From June to November.</b>{" "}
            In the June 23 budget vote, the Council cut the director&apos;s position 5-4 on
            Councilor St. Hilaire&apos;s motion. For the cut: Councilors St. Hilaire, Houseman,
            Feldman, Rotondo and Crowley. Against: Councilors Flowers, Sonia, Mullady and Spang.{" "}
            <Moment src={CC0623} s={3285} />{" "}On November 9, councilors explained where they stood.
          </p>
          <ul className={LIST}>
            <li>
              <b>Houseman</b>{" "}filed #213 and voted for both the June cut and the amendment. In
              June he said his objection was &ldquo;not with the position, but with the mayor&apos;s
              administration of this position.&rdquo; On November 9: &ldquo;my vote against this
              really was not against DEI, was not against the work.&rdquo; He called the $20,000 a
              &ldquo;different business model&rdquo; given the deficit.{" "}
              <Moment src={CC0623} s={3150} /> <Moment src={CC1109} s={9638} />{" "}
              <Moment src={CC1109} s={8596} />
            </li>
            <li>
              <b>Feldman</b>{" "}said her June vote reflected &ldquo;frustration with the
              administration ... of this position itself and the way it was structured.&rdquo; She
              wants it back &ldquo;under HR in a different form&rdquo; in the next budget, and
              supported the $20,000 meanwhile.{" "}
              <Moment src={CC1109} s={7774} /> <Moment src={CC1109} s={7830} />
            </li>
            <li>
              <b>Crowley</b>{" "}agreed, citing &ldquo;the lack of results,&rdquo; and said he could
              support &ldquo;the lesser of two.&rdquo;{" "}
              <Moment src={CC1109} s={7935} />
            </li>
            <li>
              <b>St. Hilaire</b>{" "}said he regrets that the June cut &ldquo;sent a bad message. But
              to me, the fundamental position hasn&apos;t changed. We&apos;ve got a budget deficit
              again.&rdquo;{" "}
              <Moment src={CC1109} s={7596} />
            </li>
            <li>
              <b>Mullady</b>{" "}moved the amendment. He said he would not support #213 as written
              &ldquo;because I think we should be doing more,&rdquo; and that &ldquo;this could have
              and should have happened in June.&rdquo;{" "}
              <Moment src={CC1109} s={8394} />
            </li>
            <li>
              <b>Flowers,</b>{" "}stepping out of the chair to speak, said the difference between
              the two amounts is so small that &ldquo;this is not a financial argument at this
              point.&rdquo;{" "}
              <Moment src={CC1109} s={9437} />
            </li>
            <li>
              <b>Spang and Rotondo</b>{" "}asked questions and did not state a position.
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={COUNCIL_1109}>Council agenda and packet, Nov 9</Src>
                <Src href={`${PACKET_0908}#page=121`}>Houseman&apos;s letter on #213 (p. 121)</Src>
                <Src href={CC1109}>Full recording, Nov 9</Src>
                <Src href={CC0623}>Full recording, June 23</Src>
              </>
            }
            more={
              <>
                <Earlier issue={3} slug="2026-09-28" id="humanrights" label="the Human Rights Committee" />
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also at the Council, November 9:</b>{" "}
            it accepted the $100,000 state grant for a drop-off for hard-to-recycle items at the
            yard waste site, 8-0 <Moment src={CC1109} s={6895} />, and set the hearing on Lynch
            Park&apos;s next phase for November 23 at 7:50pm.{" "}
            <Earlier issue={9} slug="2026-11-09" id="council" label="the grant" />
          </p>
          <p className="mt-2.5 text-[0.93rem] leading-relaxed text-ink-mid">
            The Open Space and Recreation Committee gave its{" "}
            <Src href={OSRC_REPORT}>annual report</Src>: new volunteer-built bridges and a boardwalk
            at Norwood Pond, and talks to link city trails to neighboring land. The committee has
            open seats for Ward 2 and Ward 4; the Planning Department staffs it.{" "}
            <Moment src={CC1109} s={1057} />
          </p>
        </div>

        {/* ---- ahead ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through December 10
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
            <Src href={`${CLERK_1116}#page=1`}>Tabulation notice (p. 1)</Src>
            <Src href={`${PB_1117}#page=1`}>Planning Board notice (p. 1)</Src>
            <Src href={`${CPC_1119}#page=1`}>Community Preservation notice (p. 1)</Src>
            <Src href={`${FFC_1117}#page=1`}>Forecast Committee notice, Nov 17 (p. 1)</Src>
            <Src href={`${FFC_1130}#page=1`}>Forecast Committee notice, Nov 30 (p. 1)</Src>
            <Src href={`${FP_1119}#page=1`}>Finance and Property notice (p. 1)</Src>
            <Src href={`${CEAC_1119}#page=1`}>Clean Energy Advisory notice (p. 1)</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>
      </div>
    </div>
  );
}
