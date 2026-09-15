import type { ReactNode } from "react";
import Link from "next/link";

/**
 * A digest of Beverly city meetings for a fixed two-week window.
 *
 * Unlike the other pieces in this collection it has no data layer. The window is closed
 * and the figures were read out of agendas, minutes and meeting recordings by hand.
 *
 * Provenance is carried in plain words, not a badge system: the source line under each
 * heading says whether the section rests on a filed document or on a meeting recording
 * nobody has checked against the audio. An earlier version used colour-coded DOCUMENT
 * and RECORDING tags with a key at the foot of the page. It asked the reader to learn a
 * legend they would never scroll down to find.
 *
 * Deliberately not linked from the section index: shared by direct link while it is a
 * prototype. Adding a `piece` entry to app/beverly/page.tsx is what would put it
 * in the nav.
 */

/* ---------------- building blocks ---------------- */

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener" className="rlink">
    {children}
  </a>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-debt">
    {children}
  </span>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{children}</h2>
);

const Source = ({ children }: { children: ReactNode }) => (
  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-mid">{children}</p>
);

const Fig = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold tabular-nums">{children}</span>
);

const More = ({ children }: { children: ReactNode }) => (
  <p className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-1.5 border-t border-rule pt-3 text-[1rem]">
    <span className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink-mid">
      More on this
    </span>
    {children}
  </p>
);

const SECTION = "scroll-mt-24 border-b border-rule py-14";
const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";
const LIST = "mt-4 max-w-[63ch] list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.75]";
const TH = "px-4 py-2.5 text-left text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-mid";

/* ---------------- calendar ---------------- */

const CAL = "https://calendar.google.com/calendar/render?action=TEMPLATE";

const DATES: { when: string; what: ReactNode; cal: string; label: string }[] = [
  {
    when: "Sep 14 · 6:00pm",
    what: (
      <>
        <b className="font-semibold">Deficit Reduction Committee</b>, City Council Chambers. Q and A
        with the City Finance Director, and a state funding update from Rep. Bowen.
      </>
    ),
    label: "Deficit Reduction Committee, September 14",
    cal:
      CAL +
      "&text=Beverly%20Deficit%20Reduction%20Committee&dates=20260914T220000Z/20260915T000000Z&location=City%20Council%20Chambers%2C%20191%20Cabot%20St%2C%20Beverly%2C%20MA&details=Q%20and%20A%20with%20the%20City%20Finance%20Director%20and%20a%20state%20funding%20update%20from%20Rep.%20Bowen.",
  },
  {
    when: "Sep 21 · 7:00pm",
    what: (
      <>
        <b className="font-semibold">City Council</b>, six public hearings between 7:45 and 8:45, and
        the final passage vote on the crypto kiosk ordinance.
      </>
    ),
    label: "Beverly City Council, September 21",
    cal:
      CAL +
      "&text=Beverly%20City%20Council&dates=20260921T230000Z/20260922T020000Z&location=City%20Council%20Chambers%2C%20191%20Cabot%20St%2C%20Beverly%2C%20MA&details=Six%20public%20hearings%207%3A45-8%3A45pm.%20Final%20passage%20vote%20on%20the%20cryptocurrency%20kiosk%20ordinance.",
  },
  {
    when: "Sep 23 · 6:00 and 7:15pm",
    what: (
      <>
        <b className="font-semibold">School Committee.</b> Subcommittees meet at 6:00, full committee
        at 7:15. Spring sports recognition, the student representative report, and a backlog of
        meeting minutes were all moved to this date.
      </>
    ),
    label: "Beverly School Committee, September 23",
    cal:
      CAL +
      "&text=Beverly%20School%20Committee&dates=20260923T220000Z/20260924T010000Z&location=Beverly%20Middle%20School%20Library%2C%20502%20Cabot%20St%2C%20Beverly%2C%20MA&details=Finance%20and%20Facilities%20and%20Curriculum%20subcommittees%20at%206%3A00pm.%20Full%20committee%20at%207%3A15pm.",
  },
  {
    when: "Sep 29 · 6:00pm",
    what: (
      <>
        <b className="font-semibold">State Aid Community Conversation</b> hosted by Rep. Bowen, Farms
        branch library.
      </>
    ),
    label: "State Aid Community Conversation, September 29",
    cal:
      CAL +
      "&text=State%20Aid%20Community%20Conversation%20with%20Rep.%20Bowen&dates=20260929T220000Z/20260930T000000Z&location=Beverly%20Public%20Library%2C%20Farms%20Branch%2C%20Beverly%2C%20MA",
  },
  {
    when: "Oct 19 · 6:00pm",
    what: (
      <>
        <b className="font-semibold">Flock cameras</b>, joint Legal Affairs and Public Services
        meeting, held before the regular Council meeting.
      </>
    ),
    label: "Flock cameras joint committee, October 19",
    cal:
      CAL +
      "&text=Beverly%20Council%3A%20Flock%20Cameras%20Joint%20Committee&dates=20261019T220000Z/20261019T225500Z&location=Beverly%2C%20MA.%20Check%20the%20posted%20agenda%20for%20the%20venue.&details=Joint%20meeting%20of%20Legal%20Affairs%20and%20Public%20Services%2C%206%3A00-6%3A55pm%2C%20before%20the%20regular%20Council%20meeting.",
  },
  {
    when: "Oct 20",
    what: (
      <>
        <b className="font-semibold">Deficit Reduction Committee&apos;s first public presentation</b>{" "}
        of its research. Time and location not yet set.
      </>
    ),
    label: "Deficit Reduction Committee presentation, October 20",
    cal:
      CAL +
      "&text=Beverly%20DRC%3A%20First%20Public%20Presentation&dates=20261020/20261021&location=Beverly%2C%20MA.%20Venue%20to%20be%20confirmed.&details=First%20public%20presentation%20of%20the%20committee%27s%20research.%20Time%20and%20location%20not%20yet%20announced.",
  },
  {
    when: "Oct 26",
    what: (
      <>
        Committee&apos;s <b className="font-semibold">FY2028 budget recommendations due</b>, per its
        own published timeline.
      </>
    ),
    label: "FY2028 recommendations due, October 26",
    cal:
      CAL +
      "&text=Beverly%20DRC%3A%20FY2028%20Recommendations%20Due&dates=20261026/20261027&location=Beverly%2C%20MA&details=Deadline%20on%20the%20committee%27s%20own%20published%20timeline%20for%20its%20list%20of%20FY2028%20budget%20recommendations.",
  },
];

const CONTENTS: [string, string, string][] = [
  ["dates", "Dates to calendar", "seven, through October 26"],
  ["dollar", "Dollar store site proposals rejected", "back out to market"],
  ["crypto", "Crypto kiosk ban passes first reading", "final vote Sep 21"],
  ["cityhall", "City Hall relocating in October", "and Council meetings with it"],
  ["buses", "Late school buses in the first week", ""],
  ["drc", "Deficit Reduction Committee moves into research", ""],
  ["pilot", "Why PILOT payments keep coming up", ""],
  ["council", "Two items pending before the Council", "Human Rights funding, Flock cameras"],
  ["horizon", "On the horizon", "school redistricting, e-bikes"],
  ["method", "Ground rules and sources", ""],
];

const VOTE: [string, string][] = [
  ["First reading", "9–0"],
  ["Final passage", "Sep 21"],
  ["Proposed penalty", "$300 / day / device"],
  ["Removal window", "30 days"],
];

const PILOT_COUNTS: [string, string][] = [
  ["Committee minutes, Aug 18", "Three, named with amounts"],
  ["School Committee, Aug 26", "Four"],
  ["City Council, Sep 8", "“Four… okay, three”"],
];

const SOURCES: { head: string; links: { href: string; label: string }[] }[] = [
  {
    head: "Watch the meetings",
    links: [
      {
        href: "https://www.youtube.com/channel/UCsloEZrieQqRUqra1diSk1w",
        label: "BevCam on YouTube",
      },
      { href: "https://bevcam.org/video/live-stream/", label: "BevCam live stream" },
      { href: "https://www.youtube.com/watch?v=ZcGKpUHCLdM", label: "City Council, Sep 8" },
      { href: "https://www.youtube.com/watch?v=aO3GZE4uYMs", label: "School Committee, Aug 26" },
      {
        href: "https://www.youtube.com/watch?v=sRZFAZM5wBg",
        label: "Deficit Reduction Cttee, Aug 31",
      },
    ],
  },
  {
    head: "Read the documents",
    links: [
      { href: "https://beverlyma.gov/AgendaCenter/City-Council-49/", label: "City Council agendas" },
      {
        href: "https://beverlyma.gov/AgendaCenter/Deficit-Reduction-Committee-65/",
        label: "Deficit Reduction Cttee minutes",
      },
      {
        href: "https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083160&type=d&pREC_ID=2756436",
        label: "School Committee agendas",
      },
      {
        href: "https://beverlyma.gov/DocumentCenter/View/7440/Proposed-FY-2027-City-Budget",
        label: "Proposed FY2027 City Budget",
      },
    ],
  },
  {
    head: "Contact your representatives",
    links: [
      { href: "https://beverlyma.gov/429/City-Council", label: "City Council, members and wards" },
      {
        href: "https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083091&type=d&pREC_ID=2133565",
        label: "School Committee, contact info",
      },
      { href: "https://beverlyma.gov/", label: "City of Beverly, departments" },
    ],
  },
];

/* ---------------- page ---------------- */

export default function MeetingDigest() {
  return (
    <div className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        {/* hero */}
        <header className="border-b border-rule py-14 sm:py-20">
          <Eyebrow>Beverly, Massachusetts · Aug 26 to Sep 9, 2026</Eyebrow>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-5 max-w-[60ch] text-xl leading-snug text-ink-mid sm:text-[1.5625rem]">
            What the City Council, School Committee and Deficit Reduction Committee took up between
            August 26 and September 9, plus the dates coming next.
          </p>
          <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-mid">
            Four meetings, three bodies. Independent, and not a City of Beverly publication.
          </p>

          {/* the note */}
          <div className="mt-8 rounded-lg border border-rule bg-bg-card/60 px-6 py-6 shadow-sm">
            {/* h2, not h3: this card sits directly under the h1, before any section heading. */}
            <h2 className="font-display text-lg font-semibold">A note on what this is</h2>
            <p className="mt-2.5 max-w-[63ch] text-[1.0625rem] leading-[1.75]">
              This is a prototype. I built it for myself first.
            </p>
            <p className="mt-3 max-w-[63ch] text-[1.0625rem] leading-[1.75]">
              Keeping up with what the city is actually doing has become a bit of a thing for me
              lately. But I have small kids, so I am not getting to meetings in person, and BevCam
              runs to hours of video a week. That is a real commitment for anyone.
            </p>
            <p className="mt-3 max-w-[63ch] text-[1.0625rem] leading-[1.75]">
              So: take the recordings, turn them into transcripts, clean those up, and pull out what
              is worth knowing for the week ahead. Ten minutes with a coffee instead of three hours
              on the couch.
            </p>
            <p className="mt-3 max-w-[63ch] text-[1.0625rem] leading-[1.75]">
              One caveat, and it matters. This starts from automatic transcripts, and they get names
              and numbers wrong. I check what I can against the city&apos;s posted agendas and
              minutes, and I say underneath each item below which of the two it came from.
              Everything is linked so you can check me. If I have something wrong,{" "}
              <Link href="/contact" className="rlink">
                tell me
              </Link>{" "}
              and I will fix it.
            </p>
          </div>

          {/* contents */}
          <nav aria-label="In this issue" className="mt-8 border-l-2 border-accent pl-5">
            <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-ink-mid">
              In this issue
            </h2>
            <ol className="mt-2.5 space-y-1.5">
              {CONTENTS.map(([id, label, sub], i) => (
                <li key={id} className="text-[1rem] leading-snug">
                  <span className="mr-2 tabular-nums text-ink-mid">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a href={"#" + id} className="font-medium text-accent hover:underline">
                    {label}
                  </a>
                  {sub ? <span className="text-ink-mid"> ({sub})</span> : null}
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* 01 dates */}
        <section id="dates" className={SECTION}>
          <Eyebrow>01 · Calendar</Eyebrow>
          <H2>Dates to calendar</H2>
          <Source>From posted agendas and meeting notices.</Source>

          <div className="mt-6 overflow-x-auto rounded-lg border border-rule bg-bg-card/50">
            <table className="w-full min-w-[38rem] border-collapse text-[1rem]">
              <thead>
                <tr className="border-b border-rule">
                  <th scope="col" className={TH}>
                    When
                  </th>
                  <th scope="col" className={TH}>
                    What
                  </th>
                  <th scope="col" className={TH}>
                    Add
                  </th>
                </tr>
              </thead>
              <tbody>
                {DATES.map((d) => (
                  <tr key={d.when} className="border-b border-rule/60 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3.5 align-top text-[0.9375rem] font-semibold tabular-nums text-accent">
                      {d.when}
                    </td>
                    <td className="px-4 py-3.5 align-top leading-relaxed">{d.what}</td>
                    <td className="w-px whitespace-nowrap px-4 py-3.5 align-top">
                      <a
                        href={d.cal}
                        target="_blank"
                        rel="noopener"
                        aria-label={"Add " + d.label + " to Google Calendar"}
                        className="inline-block rounded border border-rule bg-bg px-2.5 py-1.5 text-[0.75rem] font-semibold text-accent transition-colors hover:border-accent hover:bg-accent-glow"
                      >
                        + Cal
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[63ch] text-[0.9375rem] leading-relaxed text-ink-mid">
            Times are as posted and can change. Venues for October and later may shift because of the
            City Hall renovation, so check the posted agenda before you go.
          </p>
        </section>

        {/* 02 dollar store */}
        <section id="dollar" className={SECTION}>
          <Eyebrow>02 · Development</Eyebrow>
          <H2>Dollar store site proposals rejected, going back to market</H2>
          <Source>
            From the recording of the Mayor&apos;s quarterly update to Council, September 8. Not
            checked against the audio.
          </Source>

          <p className={BODY}>
            The Mayor reported that the city has{" "}
            <b className="font-semibold">rejected the proposals it received</b>{" "}
            through its request for proposals on the former dollar store site. He described a
            two-part proposal from a single respondent and said neither part met the
            community&apos;s needs.
          </p>
          <p className={BODY}>
            He said the city had expected stronger interest, and had anticipated responses covering a
            boutique-style hotel and several affordable housing options.
          </p>
          <p className={BODY}>
            The city has since met with the state&apos;s economic development office, which brought
            in <b className="font-semibold">MassDevelopment</b> and the state housing office. A site
            visit by those agencies is being scheduled. The Mayor said the goal is to get the
            property back on the market quickly, working with state agencies on how to structure a
            second RFP.
          </p>
          <p className={BODY}>
            On timeline, he noted that across two administrations it took three rounds of RFPs to
            develop the waterfront restaurant and public spaces, and about three rounds to sell the
            McKay School. He said he hoped this site would be resolved in two rounds rather than
            three.
          </p>
          <p className={BODY}>
            The city&apos;s{" "}
            <b className="font-semibold">Economic and Community Development Council</b>, a volunteer
            body advising the Mayor and Council, worked on the first RFP alongside the planning
            department and will be involved in the next one.
          </p>

          <More>
            <A href="https://www.youtube.com/watch?v=ZcGKpUHCLdM">Sep 8 meeting video</A>
            <A href="https://beverlyma.gov/AgendaCenter/City-Council-49/">Council agendas</A>
            <A href="https://www.massdevelopment.com/">MassDevelopment</A>
          </More>
        </section>

        {/* 03 crypto */}
        <section id="crypto" className={SECTION}>
          <Eyebrow>03 · Returns Sep 21</Eyebrow>
          <H2>Crypto kiosk ban passes first reading</H2>
          <Source>
            From the ordinance text filed in the September 8 Council agenda packet. Quoted figures
            are as written in the ordinance.
          </Source>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-rule py-4">
            {VOTE.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-mid">
                  {k}
                </dt>
                <dd className="mt-1 font-display text-xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <p className={BODY}>
            Order #187 would add a new section to Chapter 215 of the city ordinances, prohibiting any
            store, business or property owner in Beverly from installing, operating or allowing a
            cryptocurrency kiosk. The change requires two readings. This was the first, and it passed
            unanimously.
          </p>
          <p className={BODY}>The findings written into the ordinance state:</p>
          <ul className={LIST}>
            <li>
              Approximately <Fig>13</Fig> active kiosks operate in Beverly, plus two locations
              offering crypto purchase at the register.
            </li>
            <li>
              The Beverly Police Department reports at least <Fig>$195,029</Fig> in local fraud
              losses involving these machines since 2024.
            </li>
            <li>
              Department data indicates the majority of local victims are{" "}
              <b className="font-semibold">67 or older</b>.
            </li>
            <li>
              The FBI recorded <Fig>$388,981,267</Fig> in kiosk scam losses nationally in 2025,
              including <Fig>$6,834,561</Fig> in Massachusetts.
            </li>
          </ul>
          <p className={BODY}>
            The ordinance notes that funds deposited into these machines are converted and
            transmitted to a third-party wallet almost immediately, which is why they are generally
            unrecoverable. Enforcement would fall to the Police Department.
          </p>

          <More>
            <A href="https://beverlyma.gov/AgendaCenter/ViewFile/Agenda/_09082026-2890">
              Sep 8 agenda packet
            </A>
            <A href="https://www.ic3.gov/">FBI IC3, report a scam</A>
            <A href="https://www.mass.gov/how-to/file-a-consumer-complaint">
              File a consumer complaint
            </A>
          </More>
        </section>

        {/* 04 city hall */}
        <section id="cityhall" className={SECTION}>
          <Eyebrow>04 · Practical</Eyebrow>
          <H2>City Hall relocating in October</H2>
          <Source>
            From the recording of the Mayor&apos;s quarterly update to Council, September 8. Not
            checked against the audio.
          </Source>

          <p className={BODY}>
            City staff will move from 191 Cabot Street to the{" "}
            <b className="font-semibold">TD Bank building across Thorndike Street</b> during the
            first week of October. The Mayor said the timing was chosen so departments are settled
            before early voting opens for the general election.
          </p>
          <p className={BODY}>
            City Council meetings are expected to move to{" "}
            <b className="font-semibold">Beverly Middle School</b> while City Hall is renovated. The
            School Committee already meets there and BevCam is installed in that space. Arrangements
            were described as still being finalized.
          </p>
          <p className={BODY}>
            On the renovation itself, the Mayor reported that abatement costs for demolishing the
            former police station annex came in more than <Fig>$2 million</Fig> above the carried
            estimate. Rather than draw on project contingency, the design was reduced by about{" "}
            <Fig>3,050</Fig> square feet of new construction. That removed the planned Inspectional
            Services and Health Department suites from the new section, and both departments are to
            be accommodated in the renovated portion instead. Exterior brick on the new rear
            elevation was also dropped, at a reported saving of about <Fig>$250,000</Fig>. Total
            building area was described as going from roughly <Fig>35,400</Fig> square feet to{" "}
            <Fig>37,000</Fig> when complete.
          </p>

          <More>
            <A href="https://beverlyma.gov/AgendaCenter/City-Council-49/">Council agendas</A>
            <A href="https://www.youtube.com/watch?v=ZcGKpUHCLdM">Sep 8 meeting video</A>
            <A href="https://beverlyma.gov/">City department directory</A>
          </More>
        </section>

        {/* 05 buses */}
        <section id="buses" className={SECTION}>
          <Eyebrow>05 · School transportation</Eyebrow>
          <H2>Late buses in the first week of school</H2>
          <Source>
            From the recording of the School Committee meeting, September 9. Not checked against the
            audio.
          </Source>

          <p className={BODY}>
            Committee members reported hearing from families whose children arrived at school up to
            an hour late during the opening days. The Superintendent reported three bus breakdowns:
            an air brake pressure issue, a coolant leak, and one bus that failed mid route.
          </p>
          <p className={BODY}>
            He noted that all three were diesel buses rather than electric ones, and said the
            district currently has enough drivers. He cited citywide traffic and construction as
            contributing factors, while stating this was not offered as an excuse.
          </p>
          <p className={BODY}>
            The district&apos;s electric buses were delayed by a federal grant freeze in January
            2025. The Mayor said it took approximately two months to reach a federal contact, and
            additional months to confirm the district&apos;s EPA grants would not be withdrawn.
            Charging infrastructure was finalized with National Grid in June 2026. He said eight
            buses were purchased using EPA and state grant funds, which he estimated saved the city
            about <Fig>$1 million</Fig> compared with buying diesel replacements.
          </p>
          <p className={BODY}>
            Measures discussed included re-examining the school start times changed two years ago,
            which members noted may involve collective bargaining, a bus tracking application, and
            route change notifications through the district&apos;s mass communication system, which
            the Superintendent said would be operational within about a week. Crossing guard
            positions remain open.
          </p>

          <More>
            <A href="https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083160&type=d&pREC_ID=2756436">
              School Committee agendas
            </A>
            <A href="https://www.beverlyschools.org/">Beverly Public Schools</A>
            <A href="https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083091&type=d&pREC_ID=2133565">
              Contact your member
            </A>
          </More>
        </section>

        {/* 06 drc */}
        <section id="drc" className={SECTION}>
          <Eyebrow>06 · Deficit Reduction Committee</Eyebrow>
          <H2>From brainstorming into research</H2>
          <Source>From the committee&apos;s posted minutes and agendas, July 20 to September 14.</Source>

          <p className={BODY}>
            The committee was formed this summer at the request of two city councillors. It includes
            those two councillors, two School Committee members and four residents, and met four
            times between July 20 and August 31.
          </p>
          <p className={BODY}>
            On terminology, the Mayor offered a clarification at the August 26 School Committee
            meeting. The city balances its budget every year, as it is required to do, and is not in
            deficit within a fiscal year. The committee&apos;s subject is the forward looking gap
            that appears in financial forecasting, where projected expenses grow faster than
            projected revenue.
          </p>
          <p className={BODY}>
            The committee&apos;s own timeline, attached to its August 18 minutes, runs: research and
            presentations complete by September 30, a list of FY2028 budget recommendations by
            October 26, stakeholder presentations and public outreach through December, ward by ward
            community meetings and surveys in January 2027, and long term recommendations in April
            2027.
          </p>
          <p className={BODY}>
            Areas members are currently researching include employee health insurance, regionalizing
            911 dispatch, payments in lieu of taxes, parking and beach fees, recreation and camp
            fees, enterprise funds covering the harbor, airport and golf course, a hard to recycle
            materials facility, and municipal power.
          </p>
          <p className={BODY}>
            Working papers containing preliminary cost modeling by individual members are attached to
            the committee&apos;s minutes.{" "}
            <b className="font-semibold">
              These are research documents, not committee findings, and no savings figure has been
              proposed, adopted or endorsed by the committee or the city.
            </b>{" "}
            Anyone citing a number should read it in the context of the document it appears in, which
            is why the minutes are linked below rather than summarized here.
          </p>
          <p className={BODY}>
            One figure that is a city budget number rather than a projection: the FY2027 line for
            Public Safety Dispatch is <Fig>$1,292,017</Fig>, up from <Fig>$1,079,750</Fig> in FY2026.
          </p>

          <More>
            <A href="https://beverlyma.gov/AgendaCenter/Deficit-Reduction-Committee-65/">
              Agendas and minutes
            </A>
            <A href="https://beverlyma.gov/DocumentCenter/View/7440/Proposed-FY-2027-City-Budget">
              Proposed FY2027 City Budget
            </A>
            <A href="https://www.youtube.com/watch?v=sRZFAZM5wBg">Aug 31 meeting video</A>
          </More>
        </section>

        {/* 07 pilots */}
        <section id="pilot" className={SECTION}>
          <Eyebrow>07 · Tax-exempt property</Eyebrow>
          <H2>Why PILOT payments keep coming up</H2>
          <Source>From the Deficit Reduction Committee&apos;s posted minutes of August 18.</Source>

          <p className={BODY}>
            The subject surfaced at all three bodies during these two weeks, which is less of a
            coincidence than it looks. PILOTs are one of the Deficit Reduction Committee&apos;s
            assigned research areas, and the two members leading that research are also School
            Committee members. They reported back to the School Committee on August 26, while the two
            councillors on the committee raised it at the Council on September 8.
          </p>
          <p className={BODY}>
            A short definition, since the term gets used at meetings without one. Colleges,
            hospitals, housing authorities and similar nonprofit institutions pay no property tax. A{" "}
            <b className="font-semibold">payment in lieu of taxes</b> is a voluntary, negotiated
            contribution some make instead. It is not required, and the amount is not set by any
            formula unless state law provides one.
          </p>
          <p className={BODY}>
            The committee&apos;s August 18 minutes record roughly <Fig>81</Fig> tax-exempt properties
            in Beverly, with a small number making payments:
          </p>
          <ul className={LIST}>
            <li>
              <b className="font-semibold">Endicott College</b>, <Fig>$167,000</Fig> a year, recorded
              in the minutes as a donation
            </li>
            <li>
              <b className="font-semibold">Montserrat College of Art</b>, <Fig>$15,000</Fig> a year
            </li>
            <li>
              <b className="font-semibold">Beverly Housing Authority</b>, <Fig>$60,000</Fig> to{" "}
              <Fig>$80,000</Fig> a year, set by state formula
            </li>
          </ul>
          <p className={BODY}>
            Members researching the topic reported that Boston weighs three questions in its formula:
            the value of the property occupied, the city services the institution uses, and what it
            contributes back to the community.
          </p>
          <p className={BODY}>
            At the committee&apos;s August 31 meeting, a member cited research putting Lahey&apos;s
            annual payment to the Town of Burlington at approximately <Fig>$500,000</Fig>. That one
            comes from the meeting recording rather than the minutes, and has not been checked
            against the audio.
          </p>
          <p className={BODY}>
            Two councillors indicated they intend to request that the Council establish a{" "}
            <b className="font-semibold">standing PILOT committee</b>, which would give the city an
            annual process rather than case by case conversations. Beverly last had such a committee
            in 2008.
          </p>

          {/* contested count */}
          <div className="mt-8 max-w-[63ch] rounded-lg border border-rule bg-bg-card/60 px-6 py-5">
            <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-debt">
              One number is stated inconsistently
            </h3>
            <p className="mt-2.5 text-[1.0625rem] leading-[1.75]">
              How many exempt properties currently pay is given differently in three places within
              two weeks:
            </p>
            <table className="mt-3 w-full border-collapse text-[0.9375rem]">
              <thead>
                <tr className="border-b border-rule">
                  <th
                    scope="col"
                    className="py-2 pr-4 text-left text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-mid"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-left text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-mid"
                  >
                    Says
                  </th>
                </tr>
              </thead>
              <tbody>
                {PILOT_COUNTS.map(([src, says]) => (
                  <tr key={src} className="border-b border-rule/50 last:border-0">
                    <td className="py-2 pr-4 align-top">{src}</td>
                    <td className="py-2 align-top">{says}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              The count of 81 exempt properties is consistent across all three. The number of payers
              is not. This page shows the disagreement rather than picking one.
            </p>
          </div>

          <More>
            <A href="https://beverlyma.gov/AgendaCenter/Deficit-Reduction-Committee-65/">
              Aug 18 minutes
            </A>
            <A href="https://www.lincolninst.edu/publications/policy-focus-reports/payments-in-lieu-taxes/">
              What PILOTs are
            </A>
          </More>
        </section>

        {/* 08 council */}
        <section id="council" className={SECTION}>
          <Eyebrow>08 · In committee</Eyebrow>
          <H2>Two items pending before the Council</H2>
          <Source>From the posted Council agenda of September 8.</Source>

          <p className={BODY}>
            <b className="font-semibold">Order #213, Human Rights Committee funding.</b> Councilor
            Houseman has filed a formal request that the Mayor raise and appropriate{" "}
            <Fig>$20,000</Fig>{" "}
            for the Beverly Human Rights Committee. The city&apos;s DEIB Director
            position was not funded in the FY27 budget. The order is being held in the Finance and
            Property committee at the sponsor&apos;s request while discussions with the Mayor
            continue.
          </p>
          <p className={BODY}>
            <b className="font-semibold">Flock cameras.</b> The Legal Affairs and Public Services
            committees have scheduled a joint meeting for{" "}
            <b className="font-semibold">October 19, 6:00 to 6:55pm</b>, immediately before the
            regular Council meeting. The scheduling followed a request made during public comment for
            a format allowing questions and discussion.
          </p>

          <More>
            <A href="https://beverlyma.gov/AgendaCenter/City-Council-49/">
              Agendas and committee reports
            </A>
            <A href="https://beverlyma.gov/429/City-Council">Council members and wards</A>
          </More>
        </section>

        {/* 09 horizon */}
        <section id="horizon" className={SECTION}>
          <Eyebrow>09 · On the horizon</Eyebrow>
          <H2>Redistricting and e-bikes at the schools</H2>
          <Source>
            From the recordings of the School Committee meetings of August 26 and September 9. Not
            checked against the audio.
          </Source>

          <p className={BODY}>
            <b className="font-semibold">School district lines.</b> The Committee President noted
            that the city charter provides for reviewing the districting plan every ten years, and
            said the Committee expects to discuss enrollment data and move in patterns this year. She
            also noted two potential housing developments on the near horizon, which bear on any
            redraw. No redistricting process has been started.
          </p>
          <p className={BODY}>
            <b className="font-semibold">E-bikes and e-scooters.</b>{" "}
            The Superintendent said he is considering a district ban through grade eight, citing
            injury reports and state
            legislation awaiting the Governor&apos;s signature that would classify these vehicles and
            require registration and licensing. A member asked what mechanism would be used, noting
            that either a handbook change or a policy change would require School Committee action.
            The Superintendent said he would research how another district has handled it. Nothing
            has been filed.
          </p>

          <More>
            <A href="https://www.beverlyschools.org/apps/pages/index.jsp?uREC_ID=2083160&type=d&pREC_ID=2756436">
              School Committee agendas
            </A>
            <A href="https://malegislature.gov/">Track the state bill</A>
            <A href="https://www.youtube.com/watch?v=aO3GZE4uYMs">Aug 26 meeting video</A>
          </More>
        </section>

        {/* 10 ground rules */}
        <section id="method" className="scroll-mt-24 py-14">
          <Eyebrow>10 · Ground rules</Eyebrow>
          <H2>Ground rules and sources</H2>

          <p className={BODY}>
            Four things I hold to, so you know what is not here.
          </p>
          <ul className={LIST}>
            <li>
              <b className="font-semibold">Members of the public are not named or quoted.</b> Several
              comments at these meetings involved family or medical details.
            </li>
            <li>
              <b className="font-semibold">
                Individual votes are attributed only where a roll call was taken.
              </b>{" "}
              Most Council votes are voice votes, where the tally is the only fact on the record.
            </li>
            <li>
              <b className="font-semibold">
                Research figures produced by individual committee members are linked, not
                reproduced.
              </b>{" "}
              Preliminary modeling reads as a proposal once it is separated from the document it sits
              in.
            </li>
            <li>
              <b className="font-semibold">The respondent to the dollar store RFP is not named.</b>{" "}
              That detail comes from an unverified recording and the substance does not depend on it.
            </li>
          </ul>

          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {SOURCES.map((col) => (
              <div key={col.head}>
                <h3 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-ink-mid">
                  {col.head}
                </h3>
                <ul className="mt-2.5 space-y-2 text-[1rem] leading-snug">
                  {col.links.map((l) => (
                    <li key={l.href + l.label}>
                      <A href={l.href}>{l.label}</A>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-rule pt-6 text-[0.9375rem] leading-relaxed text-ink-mid">
          <p className="max-w-[63ch]">
            I compile this from public meeting recordings and city records. It is not affiliated
            with, endorsed by, or speaking for the City of Beverly, Beverly Public Schools, or any
            city body.
          </p>
          <p className="mt-2 max-w-[63ch]">
            Corrections are welcome. Every source is linked so you can check the work yourself.
          </p>
        </footer>
      </div>
    </div>
  );
}
