import type { ReactNode } from "react";
import Link from "next/link";
import PageTracking from "@/components/PageTracking";

/**
 * Issue 1 of the weekly digest, covering Aug 26 to Sep 9, 2026.
 *
 * Two things carry the design. Provenance is stated in plain words under each heading
 * rather than as colour-coded badges with a key at the foot of the page, because a
 * legend the reader has to scroll past the whole article to find is a legend nobody
 * learns. And where a claim rests on a recording there is one control per continuous
 * discussion that drops you in at the moment it starts, which does two jobs at once:
 * check the figure, or just hear the tone of an argument this summary had to compress.
 * One per discussion, never one per sentence.
 *
 * The standing note about what this is lives on /beverly/digest, not in every issue.
 */

/* ---------------- building blocks ---------------- */

/** Background reading. Deliberately a different event from a primary source. */
const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className="rlink"
    data-track="read_more_clicked"
  >
    {children}
  </a>
);

/** A primary source: the recording, the filed ordinance, the committee's own minutes. */
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

const Source = ({ children }: { children: ReactNode }) => (
  <p className="mt-2.5 max-w-[63ch] text-[0.9rem] leading-relaxed text-ink-mid">{children}</p>
);

const Fig = ({ children }: { children: ReactNode }) => (
  <span className="font-bold tabular-nums">{children}</span>
);

const Hear = ({ href, title, meta }: { href: string; title: string; meta: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className="mb-2.5 flex max-w-[63ch] items-center gap-3 rounded-md border border-accent/30 bg-accent-glow px-3.5 py-3 no-underline transition-colors hover:border-accent hover:bg-white"
    data-track="source_opened"
    data-placement="hear-button"
    data-seconds={href.match(/[?&]t=(\d+)s/)?.[1] ?? ""}
  >
    <span
      aria-hidden
      className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent pl-0.5 text-[0.7rem] text-white"
    >
      &#9654;
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[0.95rem] font-bold text-accent-deep">{title}</span>
      <span className="text-[0.83rem] tabular-nums text-ink-mid">{meta}</span>
    </span>
  </a>
);

const Refs = ({ sources, more }: { sources: ReactNode; more?: ReactNode }) => (
  <div className="mt-5 grid max-w-[63ch] gap-1.5 border-t border-rule pt-3">
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
const LIST = "mt-4 max-w-[63ch] list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.75]";

/* ---------------- data ---------------- */

const V = "https://www.youtube.com/watch?v=";
const CC8 = `${V}ZcGKpUHCLdM`;
const SC9 = `${V}49owpMykroE`;
const SC2 = `${V}Hn10BJb8GgM`;
const DRC31 = `${V}sRZFAZM5wBg`;
const SC26 = `${V}aO3GZE4uYMs`;
const CAL = "https://calendar.google.com/calendar/render?action=TEMPLATE";

type Ev = { day: string; date: string; time: string; what: string; where: string; detail: string; cal: string };

const events: Ev[] = [
  {
    day: "Mon", date: "Sep 14", time: "6:00pm",
    what: "Deficit Reduction Committee",
    where: "City Council Chambers, 191 Cabot St",
    detail: "Q and A with the City Finance Director, and a state funding update from Rep. Bowen.",
    cal: `${CAL}&text=Beverly%20Deficit%20Reduction%20Committee&dates=20260914T220000Z/20260915T000000Z&location=City%20Council%20Chambers%2C%20191%20Cabot%20St%2C%20Beverly%2C%20MA`,
  },
  {
    day: "Mon", date: "Sep 21", time: "7:00pm",
    what: "City Council",
    where: "City Council Chambers, 191 Cabot St",
    detail: "Six public hearings between 7:45 and 8:45, and the final passage vote on the crypto kiosk ordinance.",
    cal: `${CAL}&text=Beverly%20City%20Council&dates=20260921T230000Z/20260922T020000Z&location=City%20Council%20Chambers%2C%20191%20Cabot%20St%2C%20Beverly%2C%20MA`,
  },
  {
    day: "Wed", date: "Sep 23", time: "6:00 & 7:15pm",
    what: "School Committee",
    where: "Beverly Middle School Library, 502 Cabot St",
    detail: "Subcommittees at 6:00, full committee at 7:15. Spring sports recognition, the student representative report, and a backlog of meeting minutes were all moved to this date.",
    cal: `${CAL}&text=Beverly%20School%20Committee&dates=20260923T220000Z/20260924T010000Z&location=Beverly%20Middle%20School%20Library%2C%20502%20Cabot%20St%2C%20Beverly%2C%20MA`,
  },
  {
    day: "Tue", date: "Sep 29", time: "6:00pm",
    what: "State Aid Community Conversation",
    where: "Beverly Public Library, Farms branch",
    detail: "Hosted by Rep. Bowen.",
    cal: `${CAL}&text=State%20Aid%20Community%20Conversation%20with%20Rep.%20Bowen&dates=20260929T220000Z/20260930T000000Z&location=Beverly%20Public%20Library%2C%20Farms%20Branch%2C%20Beverly%2C%20MA`,
  },
  {
    day: "Mon", date: "Oct 19", time: "6:00pm",
    what: "Flock cameras: joint committee meeting",
    where: "Venue may change because of the City Hall renovation",
    detail: "Legal Affairs and Public Services meeting jointly, before the regular Council meeting.",
    cal: `${CAL}&text=Beverly%20Council%3A%20Flock%20Cameras%20Joint%20Committee&dates=20261019T220000Z/20261019T225500Z&location=Beverly%2C%20MA`,
  },
  {
    day: "Tue", date: "Oct 20", time: "time TBC",
    what: "Deficit Reduction Committee: first public presentation",
    where: "Location not yet set",
    detail: "The committee presents the research it has been doing since July.",
    cal: `${CAL}&text=Beverly%20DRC%3A%20First%20Public%20Presentation&dates=20261020/20261021&location=Beverly%2C%20MA`,
  },
  {
    day: "Mon", date: "Oct 26", time: "deadline",
    what: "FY2028 budget recommendations due",
    where: "Deficit Reduction Committee",
    detail: "Per the committee's own published timeline.",
    cal: `${CAL}&text=Beverly%20DRC%3A%20FY2028%20Recommendations%20Due&dates=20261026/20261027&location=Beverly%2C%20MA`,
  },
];

const contents: [string, string, string][] = [
  ["dates", "Dates to calendar", "seven, through October 26"],
  ["dollar", "Dollar store site proposals rejected", ""],
  ["crypto", "Crypto kiosk ban passes first reading", ""],
  ["cityhall", "City Hall relocating in October", ""],
  ["buses", "Late school buses in the first week", ""],
  ["schools", "Two positions and a state-mandated policy", ""],
  ["drc", "Deficit Reduction Committee moves into research", ""],
  ["pilot", "Why PILOT payments keep coming up", ""],
  ["council", "Two items pending before the Council", ""],
  ["horizon", "On the horizon", ""],
];

const drewOn: [string, string, string][] = [
  ["Aug 26", "School Committee, Committee of the Whole", SC26],
  ["Aug 31", "Deficit Reduction Committee", DRC31],
  ["Sep 2", "School Committee, remote only", SC2],
  ["Sep 8", "City Council", CC8],
  ["Sep 9", "School Committee, regular", SC9],
];

/* ---------------- page ---------------- */

export default function DigestIssue1() {
  return (
    <div className="bg-bg text-ink">
      <PageTracking surface="digest" issue="2026-09-11" depth />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 1 &middot; Week of September 14
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering August 26 to September 9, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The Council rejected every proposal for the former dollar store site and is
            starting over with the state. A ban on crypto kiosks passed first reading nine to
            nothing and gets its final vote on the 21st. City Hall moves across the street in
            October, and Council meetings move with it.
          </p>
        </header>

        <nav aria-label="In this issue" className="mt-8 border-l-2 border-accent pl-5">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            In this issue
          </h2>
          <ol className="mt-2.5 space-y-1.5">
            {contents.map(([id, label, sub], i) => (
              <li key={id} className="text-[0.97rem] leading-snug">
                <span className="mr-2 tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={`#${id}`} className="font-medium text-accent hover:underline">
                  {label}
                </a>
                {sub && <span className="text-ink-faint"> ({sub})</span>}
              </li>
            ))}
          </ol>
        </nav>

        {/* A list, not a table. A table forces sideways scroll on a phone, and a calendar
            is a list of things with attributes rather than a matrix. */}
        <section id="dates" className={SECTION}>
          <Eyebrow>01 &middot; Calendar</Eyebrow>
          <H2>Dates to calendar</H2>
          <Source>From posted agendas and meeting notices.</Source>

          <ul className="mt-6 list-none border-t border-rule p-0">
            {events.map((e) => (
              <li
                key={e.date}
                className="grid gap-1.5 border-b border-rule py-4 sm:grid-cols-[9.5rem_1fr] sm:gap-x-6"
              >
                <div className="flex flex-wrap items-baseline gap-2 sm:row-span-4 sm:flex-col sm:gap-0.5">
                  <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-debt">
                    {e.day}
                  </span>
                  <span className="font-bold tabular-nums">{e.date}</span>
                  <span className="text-[0.93rem] tabular-nums text-ink-mid">{e.time}</span>
                </div>
                <h3 className="text-[1.06rem] font-bold leading-tight sm:col-start-2">{e.what}</h3>
                <p className="text-[0.9rem] text-ink-faint sm:col-start-2">{e.where}</p>
                <p className="max-w-[60ch] text-[0.95rem] leading-relaxed text-ink-mid sm:col-start-2">
                  {e.detail}
                </p>
                <p className="mt-1 sm:col-start-2">
                  <a
                    href={e.cal}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex min-h-10 items-center justify-center rounded border border-rule bg-white px-3.5 text-[0.85rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
                    data-track="calendar_added"
                    data-meeting={e.what}
                    data-meeting-date={e.date}
                  >
                    Add to calendar
                  </a>
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-[63ch] text-[0.9rem] leading-relaxed text-ink-faint">
            Times are as posted and can change. Venues for October and later may shift because
            of the City Hall renovation, so check the posted agenda before you go.
          </p>
        </section>

        <section id="dollar" className={SECTION}>
          <Eyebrow>02 &middot; Development</Eyebrow>
          <H2>Dollar store site proposals rejected, going back to market</H2>
          <Source>
            From the recording of the Mayor&apos;s quarterly update to Council, September 8.
          </Source>

          <p className={BODY}>
            Mayor Cahill reported that the city has{" "}
            <b className="font-bold">rejected the proposals it received</b> through its request
            for proposals on the former dollar store site, describing a two-part proposal from
            a single respondent and saying neither part met the community&apos;s needs.
          </p>
          <p className={BODY}>
            He said the city had expected stronger interest, and had anticipated responses
            covering a boutique-style hotel and several affordable housing options.
          </p>
          <p className={BODY}>
            The city has since met with the state&apos;s economic development office, which
            brought in <b className="font-bold">MassDevelopment</b> and the state housing
            office. A site visit by those agencies is being scheduled. The goal is to get the
            property back on the market quickly, working with the state on how to structure a
            second RFP.
          </p>
          <p className={BODY}>
            On timeline, he noted that across two administrations it took three rounds of RFPs
            to develop the waterfront restaurant and public spaces, and about three rounds to
            sell the McKay School. He said he hoped this site would be resolved in two rounds
            rather than three.
          </p>
          <p className={BODY}>
            The city&apos;s{" "}
            <b className="font-bold">Economic and Community Development Council</b>, a volunteer
            body advising the Mayor and Council, worked on the first RFP and will be involved in
            the next one.
          </p>

          <div className="mt-6">
            <Hear
              href={`${CC8}&t=2055s`}
              title="Hear the Mayor&rsquo;s report on the site"
              meta="City Council, Sep 8 &middot; from 34:15 &middot; about 3 minutes"
            />
          </div>
          <Refs
            sources={
              <>
                <Src href={CC8}>Full Sep 8 meeting</Src>
                <Src href="https://beverlyma.gov/AgendaCenter/City-Council-49/">Council agendas</Src>
              </>
            }
            more={<A href="https://www.massdevelopment.com/">What MassDevelopment does</A>}
          />
        </section>

        <section id="crypto" className={SECTION}>
          <Eyebrow>03 &middot; Returns Sep 21</Eyebrow>
          <H2>Crypto kiosk ban passes first reading</H2>
          <Source>
            From the ordinance text filed in the September 8 Council agenda packet. Figures are
            as written in the ordinance.
          </Source>

          <p className={BODY}>
            Order #187 would add a new section to Chapter 215 of the city ordinances,
            prohibiting any store, business or property owner in Beverly from installing,
            operating or allowing a cryptocurrency kiosk. The change requires two readings. This
            was the first, and it passed unanimously. Final passage is scheduled for{" "}
            <b className="font-bold">September 21</b>.
          </p>
          <p className={BODY}>The findings written into the ordinance state:</p>
          <ul className={LIST}>
            <li>
              Approximately <Fig>13</Fig> active kiosks operate in Beverly, plus two locations
              offering crypto purchase at the register.
            </li>
            <li>
              The Police Department reports at least <Fig>$195,029</Fig> in local fraud losses
              involving these machines since 2024.
            </li>
            <li>
              Department data indicates the majority of local victims are{" "}
              <b className="font-bold">67 or older</b>.
            </li>
            <li>
              The FBI recorded <Fig>$388,981,267</Fig> in kiosk scam losses nationally in 2025,
              including <Fig>$6,834,561</Fig> in Massachusetts.
            </li>
          </ul>
          <p className={BODY}>
            The ordinance notes that funds deposited into these machines are converted and
            transmitted to a third-party wallet almost immediately, which is why they are
            generally unrecoverable. Enforcement would fall to the Police Department. Proposed
            penalty is <Fig>$300</Fig> per day per device, with a 30-day removal window.
          </p>

          <div className="mt-6">
            <Hear
              href={`${CC8}&t=6700s`}
              title="Hear the Council read the ordinance and vote"
              meta="City Council, Sep 8 &middot; from 1:51:40 &middot; about 5 minutes"
            />
          </div>
          <Refs
            sources={
              <>
                <Src href="https://beverlyma.gov/AgendaCenter/ViewFile/Agenda/_09082026-2890">
                  Ordinance text, Sep 8 packet
                </Src>
                <Src href={CC8}>Full Sep 8 meeting</Src>
              </>
            }
            more={
              <>
                <A href="https://www.ic3.gov/">Report a scam to the FBI</A>
                <A href="https://www.mass.gov/how-to/file-a-consumer-complaint">
                  File a consumer complaint
                </A>
              </>
            }
          />
        </section>

        <section id="cityhall" className={SECTION}>
          <Eyebrow>04 &middot; Practical</Eyebrow>
          <H2>City Hall relocating in October</H2>
          <Source>
            From the recording of the Mayor&apos;s quarterly update to Council, September 8.
          </Source>

          <p className={BODY}>
            City staff will move from 191 Cabot Street to the{" "}
            <b className="font-bold">TD Bank building across Thorndike Street</b> during the
            first week of October, timed so departments are settled before early voting opens
            for the general election.
          </p>
          <p className={BODY}>
            City Council meetings are expected to move to{" "}
            <b className="font-bold">Beverly Middle School</b> while City Hall is renovated. The
            School Committee already meets there and BevCam is installed in that space. Mayor
            Cahill described the arrangements as still being finalized.
          </p>
          <p className={BODY}>
            On the renovation itself, abatement costs for demolishing the former police station
            annex came in more than <Fig>$2 million</Fig> above the carried estimate. Rather
            than draw on project contingency, the design was reduced by about <Fig>3,050</Fig>{" "}
            square feet of new construction, removing the planned Inspectional Services and
            Health Department suites from the new section. Both are to be accommodated in the
            renovated portion instead. Exterior brick on the new rear elevation was also
            dropped, at a reported saving of about <Fig>$250,000</Fig>.
          </p>

          <div className="mt-6">
            <Hear
              href={`${CC8}&t=430s`}
              title="Hear the renovation and relocation update"
              meta="City Council, Sep 8 &middot; from 7:10 &middot; about 7 minutes"
            />
            <Hear
              href={`${CC8}&t=7250s`}
              title="Hear where Council will meet during the work"
              meta="City Council, Sep 8 &middot; from 2:00:50 &middot; about 1 minute"
            />
          </div>
          <Refs
            sources={<Src href={CC8}>Full Sep 8 meeting</Src>}
            more={<A href="https://beverlyma.gov/">City department directory</A>}
          />
        </section>

        <section id="buses" className={SECTION}>
          <Eyebrow>05 &middot; Schools</Eyebrow>
          <H2>Late buses in the first week of school</H2>
          <Source>From the recording of the School Committee meeting, September 9.</Source>

          <p className={BODY}>
            Committee members reported hearing from families whose children arrived at school up
            to an hour late during the opening days. Superintendent Cushing reported three bus
            breakdowns: an air brake pressure issue, a coolant leak, and one bus that failed mid
            route while the transportation director was driving it.
          </p>
          <p className={BODY}>
            He noted pointedly that all three were{" "}
            <b className="font-bold">diesel buses, not the electric fleet</b>, and said the
            district currently has enough drivers. He cited citywide traffic and construction as
            contributing factors while stating this was not offered as an excuse.
          </p>
          <p className={BODY}>
            The district&apos;s electric buses were delayed by a federal grant freeze in January
            2025. Mayor Cahill said it took roughly two months to reach a federal contact and
            additional months to confirm the district&apos;s EPA grants would not be withdrawn.
            Charging infrastructure was finalized with National Grid in June 2026. Eight buses
            were purchased using EPA and state grant funds, which he estimated saved the city
            about <Fig>$1 million</Fig> against diesel replacements.
          </p>
          <p className={BODY}>
            Measures discussed: re-examining the school start times changed two years ago, which
            members noted may involve collective bargaining; a bus tracking application, which
            the Superintendent has reservations about on child safety grounds; and route change
            notifications through the district&apos;s mass communication system, expected within
            about a week. Crossing guard positions remain open.
          </p>

          <div className="mt-6">
            <Hear
              href={`${SC9}&t=919s`}
              title="Hear the transportation report and the discussion that followed"
              meta="School Committee, Sep 9 &middot; from 15:19 &middot; about 20 minutes"
            />
          </div>
          <Refs
            sources={<Src href={SC9}>Full Sep 9 meeting</Src>}
            more={
              <A href="https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083091&type=d&pREC_ID=2133565">
                Contact your School Committee member
              </A>
            }
          />
        </section>

        <section id="schools" className={SECTION}>
          <Eyebrow>06 &middot; Schools</Eyebrow>
          <H2>Two positions and a state-mandated policy, approved unanimously</H2>
          <Source>
            From the recording of the School Committee&apos;s remote-only meeting, September 2.
            Every vote that night was a roll call.
          </Source>

          <p className={BODY}>
            The Committee met on Zoom on September 2 and, because the meeting was remote, took
            every vote by roll call. Three things passed, all without dissent.
          </p>
          <p className={BODY}>
            <b className="font-bold">Two new positions</b>, approved as a single package: a
            one-to-one paraprofessional supporting a student at the high school, and a special
            services teacher covering a maternity leave into January before transferring to the
            middle school mid-year. Both are funded from revolving accounts.
          </p>
          <p className={BODY}>
            <b className="font-bold">A DESE-mandated policy</b> under the PROTECT Act, governing
            how district staff interact with law enforcement engaged in civil enforcement. The
            state required it in place before school started, so the Committee voted to waive
            its own two-reading procedure and adopt it in one sitting. The version adopted
            follows the state template with the district name inserted and &ldquo;executive
            director&rdquo; changed to &ldquo;superintendent&rdquo;.
          </p>
          <p className={BODY}>
            The Committee also adopted its new meeting schedule, which is why subcommittees now
            meet at 6:00 and the full committee at 7:15 on the fourth Wednesday.
          </p>

          <div className="mt-6">
            <Hear
              href={`${SC2}&t=276s`}
              title="Hear the PROTECT Act discussion and vote"
              meta="School Committee, Sep 2 &middot; from 4:36 &middot; about 10 minutes"
            />
            <Hear
              href={`${SC2}&t=890s`}
              title="Hear the discussion on the two positions"
              meta="School Committee, Sep 2 &middot; from 14:50 &middot; about 13 minutes"
            />
          </div>
          <Refs
            sources={
              <>
                <Src href={SC2}>Full Sep 2 meeting</Src>
                <Src href="https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083160&type=d&pREC_ID=2756436">
                  School Committee agendas
                </Src>
              </>
            }
          />
        </section>

        <section id="drc" className={SECTION}>
          <Eyebrow>07 &middot; Deficit Reduction Committee</Eyebrow>
          <H2>From brainstorming into research</H2>
          <Source>
            From the committee&apos;s posted minutes and agendas, July 20 to September 14.
          </Source>

          <p className={BODY}>
            The committee was formed this summer at the request of two city councillors. It
            includes those two councillors, two School Committee members and four residents, and
            met four times between July 20 and August 31.
          </p>
          <p className={BODY}>
            On terminology, Mayor Cahill offered a clarification at the August 26 School
            Committee meeting. The city balances its budget every year, as it is required to do,
            and is not in deficit within a fiscal year. The committee&apos;s subject is the
            forward-looking gap in financial forecasting, where projected expenses grow faster
            than projected revenue.
          </p>
          <p className={BODY}>
            The committee&apos;s own timeline, attached to its August 18 minutes: research and
            presentations complete by September 30, FY2028 budget recommendations by October 26,
            stakeholder presentations and public outreach through December, ward-by-ward
            community meetings and surveys in January 2027, and long-term recommendations in
            April 2027.
          </p>
          <p className={BODY}>
            Areas under research include employee health insurance, regionalizing 911 dispatch,
            payments in lieu of taxes, parking and beach fees, recreation and camp fees,
            enterprise funds covering the harbor, airport and golf course, a hard-to-recycle
            materials facility, and municipal power.
          </p>
          <p className={BODY}>
            Working papers containing preliminary cost modeling by individual members are
            attached to the minutes.{" "}
            <b className="font-bold">
              These are research documents, not committee findings, and no savings figure has
              been proposed, adopted or endorsed by the committee or the city.
            </b>{" "}
            Anyone citing a number should read it in the context of the document it appears in,
            which is why the minutes are linked below rather than summarized here.
          </p>
          <p className={BODY}>
            One figure that is a city budget number rather than a projection: the FY2027 line for
            Public Safety Dispatch is <Fig>$1,292,017</Fig>, up from <Fig>$1,079,750</Fig> in
            FY2026.
          </p>

          <Refs
            sources={
              <>
                <Src href="https://beverlyma.gov/AgendaCenter/Deficit-Reduction-Committee-65/">
                  Committee agendas and minutes
                </Src>
                <Src href="https://beverlyma.gov/DocumentCenter/View/7440/Proposed-FY-2027-City-Budget">
                  Proposed FY2027 budget
                </Src>
              </>
            }
          />
        </section>

        <section id="pilot" className={SECTION}>
          <Eyebrow>08 &middot; Tax-exempt property</Eyebrow>
          <H2>Why PILOT payments keep coming up</H2>
          <Source>
            From the Deficit Reduction Committee&apos;s posted minutes of August 18, with two
            figures from meeting recordings.
          </Source>

          <p className={BODY}>
            The subject surfaced at all three bodies during these two weeks, which is less of a
            coincidence than it looks. PILOTs are one of roughly nine research areas assigned to
            the Deficit Reduction Committee, and the two members leading that research also sit
            on the School Committee.
          </p>
          <p className={BODY}>
            A short definition, since the term gets used at meetings without one. Colleges,
            hospitals, housing authorities and similar nonprofits pay no property tax. A{" "}
            <b className="font-bold">payment in lieu of taxes</b> is a voluntary, negotiated
            contribution some make instead. It is not required, and the amount is not set by any
            formula unless state law provides one.
          </p>
          <p className={BODY}>
            The committee&apos;s August 18 minutes record roughly <Fig>81</Fig> tax-exempt
            properties in Beverly, with a small number making payments:
          </p>
          <ul className={LIST}>
            <li>
              <b className="font-bold">Endicott College</b>, <Fig>$167,000</Fig> a year, recorded
              in the minutes as a donation
            </li>
            <li>
              <b className="font-bold">Montserrat College of Art</b>, <Fig>$15,000</Fig> a year
            </li>
            <li>
              <b className="font-bold">Beverly Housing Authority</b>, <Fig>$60,000</Fig> to{" "}
              <Fig>$80,000</Fig> a year, set by state formula
            </li>
          </ul>
          <p className={BODY}>
            At the committee&apos;s August 31 meeting a member cited research putting
            Lahey&apos;s annual payment to the Town of Burlington at approximately{" "}
            <Fig>$500,000</Fig>, and noted that is{" "}
            <b className="font-bold">
              more than double what Beverly currently receives from all of its payers combined
            </b>
            .
          </p>

          <div className="mt-6 max-w-[63ch] rounded-md border border-rule bg-bg-card px-5 py-4">
            <h3 className="text-[0.76rem] font-bold uppercase tracking-[0.1em] text-gold-strong">
              One number is stated inconsistently
            </h3>
            <dl className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr] sm:gap-x-5">
              <dt className="text-[0.9rem] font-bold">Committee minutes, Aug 18</dt>
              <dd className="m-0 text-[0.93rem] text-ink-mid">Three payers, named with amounts</dd>
              <dt className="text-[0.9rem] font-bold">School Committee, Aug 26</dt>
              <dd className="m-0 text-[0.93rem] text-ink-mid">Four</dd>
              <dt className="text-[0.9rem] font-bold">City Council, Sep 8</dt>
              <dd className="m-0 text-[0.93rem] text-ink-mid">
                &ldquo;Four&hellip; okay, three&rdquo;
              </dd>
            </dl>
            <p className="mt-3 text-[0.93rem] leading-relaxed">
              The count of 81 exempt properties is consistent across all three. The number of
              payers is not. This page shows the disagreement rather than picking one.
            </p>
          </div>

          <p className={BODY}>
            Two councillors have indicated they intend to ask the Council to establish a{" "}
            <b className="font-bold">standing PILOT committee</b>, which would give the city an
            annual process rather than case-by-case conversations. Beverly last had one in 2008.
          </p>

          <div className="mt-6">
            <Hear
              href={`${DRC31}&t=2482s`}
              title="Hear the Lahey comparison"
              meta="Deficit Reduction Committee, Aug 31 &middot; from 41:22 &middot; about 2 minutes"
            />
            <Hear
              href={`${SC26}&t=5484s`}
              title="Hear the four-payer claim made to the School Committee"
              meta="School Committee, Aug 26 &middot; from 1:31:24 &middot; about 2 minutes"
            />
          </div>
          <Refs
            sources={
              <Src href="https://beverlyma.gov/AgendaCenter/Deficit-Reduction-Committee-65/">
                Aug 18 minutes, with the payer list
              </Src>
            }
            more={
              <A href="https://www.lincolninst.edu/publications/policy-focus-reports/payments-in-lieu-taxes/">
                What PILOTs are, plain-language explainer
              </A>
            }
          />
        </section>

        <section id="council" className={SECTION}>
          <Eyebrow>09 &middot; In committee</Eyebrow>
          <H2>Two items pending before the Council</H2>
          <Source>From the posted Council agenda of September 8.</Source>

          <p className={BODY}>
            <b className="font-bold">Order #213, Human Rights Committee funding.</b> Councilor
            Houseman has filed a formal request that the Mayor raise and appropriate{" "}
            <Fig>$20,000</Fig> for the Beverly Human Rights Committee. The city&apos;s DEIB
            Director position was not funded in the FY27 budget. The order is being held in the
            Finance and Property committee at the sponsor&apos;s request while discussions with
            the Mayor continue.
          </p>
          <p className={BODY}>
            <b className="font-bold">Flock cameras.</b> The Legal Affairs and Public Services
            committees have scheduled a joint meeting for{" "}
            <b className="font-bold">October 19, 6:00 to 6:55pm</b>, immediately before the
            regular Council meeting. The scheduling followed a request made during public
            comment for a format allowing questions and discussion.
          </p>

          <Refs
            sources={
              <>
                <Src href="https://beverlyma.gov/AgendaCenter/City-Council-49/">
                  Agendas and committee reports
                </Src>
                <Src href="https://beverlyma.gov/429/City-Council">Council members and wards</Src>
              </>
            }
          />
        </section>

        <section id="horizon" className={SECTION}>
          <Eyebrow>10 &middot; On the horizon</Eyebrow>
          <H2>Redistricting and e-bikes at the schools</H2>
          <Source>From the recording of the School Committee meeting, September 9.</Source>

          <p className={BODY}>
            <b className="font-bold">School district lines.</b> Committee President Visnick noted
            that the city charter provides for reviewing the districting plan every ten years,
            and said the Committee expects to discuss enrollment data and move-in patterns this
            year. She also noted two potential housing developments on the near horizon, which
            bear on any redraw. No redistricting process has been started.
          </p>
          <p className={BODY}>
            <b className="font-bold">E-bikes and e-scooters.</b> Superintendent Cushing said he
            is seriously considering a district ban through grade eight, citing injury reports
            and state legislation awaiting the Governor&apos;s signature that would sort these
            vehicles into four classes and require registration and licensing. A member asked
            what mechanism would be used, noting that either a handbook change or a policy change
            would require Committee action. Nothing has been filed.
          </p>

          <div className="mt-6">
            <Hear
              href={`${SC9}&t=610s`}
              title="Hear the districting discussion"
              meta="School Committee, Sep 9 &middot; from 10:10 &middot; about 3 minutes"
            />
            <Hear
              href={`${SC9}&t=1137s`}
              title="Hear the e-bike proposal"
              meta="School Committee, Sep 9 &middot; from 18:57 &middot; about 3 minutes"
            />
          </div>
          <Refs
            sources={<Src href={SC9}>Full Sep 9 meeting</Src>}
            more={<A href="https://malegislature.gov/">Track the state bill</A>}
          />
        </section>

        {/* Makes an omission visible rather than silent. */}
        <div className="mt-14 rounded-md border border-rule bg-bg-card p-5">
          <h2 className="font-display text-[1.05rem] font-bold">What this issue drew on</h2>
          <ul className="mt-2.5 list-none p-0 text-[0.93rem]">
            {drewOn.map(([date, label, href]) => (
              <li key={date} className="mb-1.5 flex flex-wrap gap-2">
                <span className="min-w-[5.5rem] tabular-nums text-ink-faint">{date}</span>
                <Src href={href}>{label}</Src>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-mid">
            Five meetings, three bodies. Plus posted agendas, ordinance text and committee
            minutes from the city website. If a Beverly public body met in this window and is not
            on this list, it was not recorded.
          </p>
        </div>

        <section id="corrections" className="mt-14">
          <Eyebrow>Corrections</Eyebrow>
          <H2>Corrections</H2>
          <p className={BODY}>
            None. This is the first issue. Corrections to previous issues will appear here,
            whether caught in the next week&apos;s reporting or reported by a reader.
          </p>
        </section>

        <footer className="mt-14 border-t border-rule pt-5 text-[0.9rem] leading-relaxed text-ink-faint">
          <p className="max-w-[63ch]">
            <b className="font-bold">About the green buttons.</b> Each one drops you into the
            recording at the moment that discussion starts, so you can hear what was actually
            said without scrubbing through a two-hour meeting. Use them to check a figure, or
            just to hear the tone of an argument this summary had to compress.
          </p>
          <p className="mt-2 max-w-[63ch]">
            <b className="font-bold">Sources</b> are the primary record: the recording itself,
            the filed ordinance, the committee&apos;s own minutes.{" "}
            <b className="font-bold">Read more</b> is background. The recordings are transcribed
            automatically and those transcripts get names and numbers wrong, which is why the
            links are there rather than asking you to take my word for it.
          </p>
          <p className="mt-2 max-w-[63ch]">
            Compiled from public meeting recordings and city records. Not affiliated with,
            endorsed by, or speaking for the City of Beverly, Beverly Public Schools, or any city
            body. Residents who speak during public comment are not named or quoted.{" "}
            <Link href="/beverly/digest" className="rlink">
              All issues
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
