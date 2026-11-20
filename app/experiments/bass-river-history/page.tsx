import {
  BODY,
  Cards,
  Colophon,
  Compare,
  DraftBar,
  DraftNote,
  H2,
  H3,
  LIST,
  More,
  Src,
  Stats,
  Timeline,
  type TimelineRow,
} from "@/components/beverly/HistoryParts";

/**
 * Bass River: the story so far. A neutral history of the city's efforts to rezone the industrial land on River
 * Street, and of the Hall-Whitaker Bridge closure that put the latest one on hold. Written Nov 2026 as a step
 * toward a fuller piece once the rezoning comes back. Facts come from the research record in the private
 * development folder (projects/bass-river/history.md); change them there first.
 *
 * Rules: neutral like the digest; public comment described in prose, never linked to a speaker; "PlanBeverly,
 * the city's long-range plan", with "master plan" only once; ward named.
 */

const LF = (id: number) => `https://lfserver.beverlyma.gov/WebLink/DocView.aspx?id=${id}&dbid=0&repo=BPL`;
const MINUTES = (slug: string) => `https://www.beverlyma.gov/AgendaCenter/ViewFile/Minutes/${slug}`;
const PLAN = "https://www.beverlyma.gov/DocumentCenter/View/5450#page=32";
const FAQ = "https://www.beverlyma.gov/DocumentCenter/View/2710/Bass-River-Area-Rezoning-FAQ-PDF";
const FORUM = (t: number) => `https://youtu.be/m-N2ydZ5kFE?t=${t}`;

const TRIES: TimelineRow[] = [
  { key: "plan", when: "2002", label: "The city's long-range plan calls for rezoning", start: "2002-06-01" },
  { key: "t1", when: "2005 to 2007", label: "First try: a consultant drafts zoning", sub: "No zoning filed", start: "2005-06-01", end: "2007-06-30" },
  { key: "t2", when: "2014 to 2017", label: "Second try: a regional plan, then an overlay", sub: "No zoning filed", start: "2014-01-01", end: "2017-02-28" },
  { key: "t3", when: "2020 to 2022", label: "Third try: PlanBeverly, then a draft overlay", sub: "Paused March 2022", start: "2020-12-01", end: "2022-03-28" },
  {
    key: "bridge",
    when: "2022 to 2027",
    label: "On hold while the Hall-Whitaker Bridge is closed",
    sub: "Temporary bridge due in 2027",
    start: "2022-06-17",
    end: "2027-07-27",
    tone: "wait",
  },
];

export default function BassRiverHistoryPage() {
  return (
    <main className="mx-auto w-full max-w-[72rem] px-4 pb-24 pt-6 sm:px-6">
      <DraftBar />
      <header className="mt-8">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">Development · How it happened</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Bass River: the story so far
        </h1>
        <p className="mt-5 max-w-[63ch] text-[1.15rem] leading-[1.65]">
          For more than 20 years, Beverly has talked about turning the industrial land on River Street, between the
          Beverly Depot and the Bass River, into a neighborhood with homes, shops and a public path along the water. The
          city has drafted zoning for it three times. None of the drafts reached a City Council vote. The last one paused
          in 2022, a few months before the Hall-Whitaker Bridge closed, and the city has said it will wait for the bridge.
        </p>
        <Stats
          items={[
            { big: "3", label: "tries to rezone the area since 2005" },
            { big: "0", label: "City Council votes on any of them" },
            { big: "2027", label: "target year for the temporary bridge to open" },
          ]}
        />
        <DraftNote>
          Quotes from meetings come from YouTube&apos;s automatic captions of BevCam&apos;s recordings, and from city
          minutes, which summarize what was said.
        </DraftNote>
      </header>

      <section aria-labelledby="place">
        <H2 id="place">The place</H2>
        <p className={BODY}>
          The area runs along River Street, a short walk from the Depot, and most of it is in Ward 2. PlanBeverly, the
          city&apos;s long-range plan, describes it as zoned for industry and business, with car-oriented businesses,
          industrial lots that are &ldquo;vacant or underutilized,&rdquo; and a riverfront where public access is
          &ldquo;extremely limited&rdquo; (<Src href={PLAN}>PlanBeverly, p. 32</Src>).
        </p>
        <p className={BODY}>
          Across the river is Ryal Side, in Ward 1. The Hall-Whitaker Bridge, which carries Bridge Street over the river,
          is the most direct road between the two.
        </p>
        <More label="A developer's purchase">
          <p>
            In June 2021, before any new zoning, a company formed by Gables Residential, an Atlanta apartment developer, bought two River Street
            properties, including the former Bowl-O-Mat (
            <Src href="https://www.yahoo.com/news/apartment-developer-buys-bowl-o-134800924.html">Salem News</Src>). That
            September, Mayor Cahill said the city had met with Gables several times and that the proposal
            &ldquo;is not about zoning for any developer&rdquo; (
            <Src href="https://youtu.be/i2bdvMT0QtI?t=6788">video, 1:53:08</Src>). The Bowl-O-Mat was still empty in
            October 2025 (<Src href="https://thebeverlybeat.substack.com/p/from-pins-to-pigeons">The Beverly Beat</Src>
            ).
          </p>
          <p>A corner of the 2022 study area, at Margin Street, is in Ward 3.</p>
        </More>
      </section>

      <section aria-labelledby="tries">
        <H2 id="tries">Three tries</H2>
        <p className={BODY}>
          The idea goes back to at least 2000, when Mayor William Scanlon hoped for &ldquo;a public walkway along the
          entire perimeter&rdquo; of the river (<Src href={LF(537)}>minutes</Src>). The city&apos;s 2002 long-range plan
          (its master plan, in the words of state law) picked out the area for rezoning (
          <Src href={PLAN}>PlanBeverly, p. 32</Src>). Since then, three efforts got as far as draft rules.
        </p>
        <Timeline rows={TRIES} from={2000} to={2028} every={4} label="Efforts to rezone the Bass River area, 2002 to 2027" />

        <H3>2005 to 2007: a consultant drafts zoning</H3>
        <p className={BODY}>
          The city&apos;s Economic and Community Development Council, an advisory board, took up rezoning the river
          and the harbor. In October 2006 it funded a consultant to draft zoning (<Src href={LF(6178)}>minutes</Src>).
          Members argued over a new district versus an overlay, and over where displaced auto body and glass shops would
          go (<Src href={LF(6447)}>minutes, April 2007</Src>). No zoning was filed.
        </p>
        <More label="What an overlay is">
          <p>
            An overlay adds new options on top of the zoning a property already has. Owners can keep doing what they do
            today, or build under the new rules. That way, businesses already there still fit the rules. Every later
            draft for this area was an overlay.
          </p>
        </More>

        <H3>2014 to 2017: a regional plan, then an overlay</H3>
        <p className={BODY}>
          The Metropolitan Area Planning Council, a regional planning agency, wrote a{" "}
          <Src href="https://www.beverlyma.gov/DocumentCenter/View/406/Beverly-Bass-River-District-Visioning-Report-PDF">
            vision for the district
          </Src>{" "}
          in 2014. In February 2016, Mayor Michael Cahill called mixed use on River Street &ldquo;perhaps the greatest transit
          oriented development opportunity in New England&rdquo; and said the city planned to bring zoning to the Council
          by April (<Src href={LF(8806)}>minutes</Src>).
        </p>
        <p className={BODY}>
          In January 2017 the planning director showed the Planning Board a &ldquo;Bass River Neighborhood
          District,&rdquo; an overlay with heights up to 60 feet, lower near the water (
          <Src href={LF(9135)}>minutes</Src>). It was never filed. Looking back in 2022, Planning Director Darlene Wynne
          said that when the city talked about 60 to 75 feet, &ldquo;we heard some of the numbers were a little too
          much&rdquo; (<Src href={FORUM(1113)}>video, 18:33</Src>).
        </p>

        <H3>2020 to 2022: PlanBeverly, then a draft overlay</H3>
        <p className={BODY}>
          PlanBeverly, adopted in January 2021, made Bass River &ldquo;the City&apos;s near-term focus for transit
          oriented development&rdquo; and recommended allowing apartments and mixed-use buildings there, up to five
          stories on River Street (<Src href={PLAN}>p. 32</Src>). Community meetings began in September 2021, and in April 2022 the
          city posted answers to common questions about its draft.
        </p>
      </section>

      <section aria-labelledby="draft">
        <H2 id="draft">What the 2022 draft proposed</H2>
        <p className={BODY}>
          An overlay on about 14 acres, from the city&apos;s <Src href={FAQ}>frequently asked questions</Src>:
        </p>
        <Compare
          caption="The 2022 draft Bass River overlay"
          head={["2022 draft"]}
          rows={[
            { label: "Existing businesses", cells: ["Could stay and expand"] },
            { label: "Height", cells: ["3 to 5 stories, with five on River Street, stepping down toward the river"] },
            { label: "Riverfront", cells: ["A public open space at least 50 feet wide along the water"] },
            { label: "Parking", cells: ["One space per home"] },
          ]}
        />
        <More label="More from the draft">
          <ul className="list-disc space-y-2 pl-5">
            <li>At least 12% of new homes affordable, under the city&apos;s existing rule; the city was considering more.</li>
            <li>Open space of 10% of each site, with the riverfront strip counting toward it.</li>
            <li>Buildings designed for flooding projected for 2070, so ground floors might have to be floodable.</li>
            <li>The number of homes was &ldquo;not yet determined.&rdquo;</li>
          </ul>
          <p>
            The city&apos;s <Src href="https://beverlyma.gov/270/Bass-River-Area-Study-New-Zoning">Bass River page</Src>{" "}
            hasn&apos;t been updated since that April.
          </p>
        </More>
      </section>

      <section aria-labelledby="pause">
        <H2 id="pause">Why it paused</H2>
        <p className={BODY}>
          The meetings drew crowds and pushback. Residents raised traffic on River and Bridge Streets, the height of the
          buildings and the number of homes, whether the homes would be affordable, the developer&apos;s purchase before
          any rezoning, and what would happen to the lumber yard, the boatyard and the River Street shelter. The first
          meeting, on Zoom, was capped at about 100 people.
        </p>
        <p className={BODY}>
          At a Ward 2 Civic Association forum on March 28, 2022, Mayor Cahill slowed the schedule. The city had hoped to
          go to the Council that spring, he said, but &ldquo;we&apos;re not going to try to put anything in front of them
          this spring&rdquo; (<Src href={FORUM(781)}>video, 13:01</Src>). On the number of homes, he said one early sketch
          had topped out at 1,400 and a later one at 1,000, and &ldquo;we&apos;ve agreed that 1,000 is too high&rdquo; (
          <Src href={FORUM(6560)}>video, 1:49:20</Src>).
        </p>
      </section>

      <section aria-labelledby="closed">
        <H2 id="closed">Then the bridge closed</H2>
        <p className={BODY}>
          On June 17, 2022, MassDOT closed the Hall-Whitaker Bridge to cars because of structural deterioration (
          <Src href="https://patch.com/massachusetts/beverly/deficient-beverly-drawbridge-close-replacement">Patch</Src>
          ). That October, the minutes record the Mayor telling the City Council: &ldquo;We are not looking to do anything with the Bass River
          overlay as long as we do not have the Hall-Whitaker Bridge open and operational&rdquo; (
          <Src href={MINUTES("_10242022-1019")}>minutes</Src>).
        </p>
        <p className={BODY}>
          In August 2024, Assistant Planning Director Ken Clawson named a second condition. The minutes record him saying
          the overlay was on hold until the bridge reopened &ldquo;and there is electrified rail service,&rdquo; meaning electric trains on
          the commuter rail line (<Src href={LF(392892)}>minutes, p. 5</Src>).
        </p>
        <p className={BODY}>
          Not everyone wanted to wait. At the Council&apos;s February 2024 retreat, the Chamber of Commerce asked
          councilors to revisit the zoning, noting that a zoning change takes about as long to produce projects ready to
          build as the temporary bridge would take to open (
          <Src href={MINUTES("_02102024-1657")}>minutes</Src>).
        </p>
        <More label="Timeline of the closure">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <b>October 2022.</b> MassDOT&apos;s first schedule: a temporary bridge in 2026, a permanent one in 2035 (
              <Src href="https://patch.com/massachusetts/beverly/beverlys-hall-whitaker-bridge-temporary-fix-take-4-years">
                Patch
              </Src>
              ). City officials pushed for faster work (
              <Src href="https://patch.com/massachusetts/beverly/beverly-officials-push-changes-hall-whitaker-bridge-plan">
                Patch
              </Src>
              ).
            </li>
            <li>
              <b>March 2024.</b> The targets moved to late summer 2027 for the temporary bridge and 2032 for the permanent
              one (
              <Src href="https://patch.com/massachusetts/beverly/beverly-temporary-hall-whitaker-bridge-open-2027-massdot">
                Patch
              </Src>
              ).
            </li>
            <li>
              <b>October 2025.</b> The old drawbridge stopped opening for boats (
              <Src href="https://patch.com/massachusetts/beverly/when-will-beverlys-temporary-hall-whitaker-bridge-finally-open">
                Patch
              </Src>
              ).
            </li>
          </ul>
        </More>
      </section>

      <section aria-labelledby="now">
        <H2 id="now">Where the bridge stands</H2>
        <p className={BODY}>Two bridges are in the works: a temporary one now, and a permanent one later.</p>
        <Cards
          items={[
            {
              title: "Temporary bridge",
              body: (
                <>
                  <p>A fixed bridge, just south of the old drawbridge. Its deck was in place by September 2026.</p>
                  <p>
                    The Mayor gave April 2027 to open it to traffic (
                    <Src href="https://www.youtube.com/watch?v=ZcGKpUHCLdM&t=1608s">video, 26:48</Src>). MassDOT&apos;s
                    target is July 27, 2027 (
                    <Src href="https://patch.com/massachusetts/beverly/new-pedestrian-crossing-closed-beverly-hall-whitaker-drawbridge">
                      Patch
                    </Src>
                    ).
                  </p>
                </>
              ),
            },
            {
              title: "Permanent bridge",
              body: (
                <>
                  <p>
                    Planned as a drawbridge, then switched to a fixed bridge in 2026 (
                    <Src href="https://www.salemnews.com/news/local_news/state-changes-course-on-hall-whitaker-bridge-plan/article_652ca222-44c9-4ccf-bc35-46172be635c5.html">
                      Salem News
                    </Src>
                    ). No opening date found; the earlier 2032 target was for the drawbridge.
                  </p>
                  <p>
                    Bass Haven Yacht Club, upriver, asked the Coast Guard to reject a fixed bridge (
                    <Src href="https://www.salemnews.com/news/local_news/yacht-club-opposes-fixed-bridge-plan-for-hall-whitaker/article_3a355ddd-f4cf-4149-bbfd-34b4a0f24350.html">
                      Salem News
                    </Src>
                    ). In September, State Rep. Hannah Bowen said a Coast Guard comment period was open (
                    <Src href="https://www.youtube.com/watch?v=O8Kxggwls3A&t=7689s">video, 2:08:09</Src>).
                  </p>
                </>
              ),
            },
          ]}
        />
      </section>

      <section aria-labelledby="next">
        <H2 id="next">What comes next</H2>
        <p className={BODY}>
          The city hasn&apos;t set a date to restart. In October 2026 the Economic and Community Development Council had
          a &ldquo;Bass River Overlay District - Status update&rdquo; on its agenda (
          <Src href="https://www.beverlyma.gov/AgendaCenter/ViewFile/Agenda/_10222026-2957">agenda</Src>). Its minutes
          aren&apos;t posted yet.
        </p>
        <p className={BODY}>Questions from the earlier tries are still open:</p>
        <ul className={LIST}>
          <li>Does a restart wait for the temporary bridge, the permanent one, or electric trains as well?</li>
          <li>Would it start from the 2022 draft, or from scratch?</li>
          <li>How tall, and how many homes?</li>
          <li>How would traffic on River and Bridge Streets be handled?</li>
        </ul>
      </section>

      <Colophon>
        <p>
          A working draft, November 20, 2026. It takes no position on whether or how the area should change. Built from
          city minutes, BevCam recordings, PlanBeverly, the city&apos;s 2022 FAQ and news reports, each linked where
          it&apos;s used.
        </p>
        <p>
          Not yet reviewed: the 2014 regional plan, the consultant&apos;s January 2022 design presentation and the 2023
          Bass River resilience study. Minutes before 2020 are on the city&apos;s archive server, whose security
          certificate expired June 1, 2026, so browsers may warn before opening them.
        </p>
      </Colophon>
    </main>
  );
}
