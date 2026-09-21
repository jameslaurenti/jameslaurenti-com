import type { ReactNode } from "react";
import PageTracking from "@/components/PageTracking";
import AddToCalendar, { type CalendarEvent } from "@/components/beverly/AddToCalendar";

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener" className="rlink" data-track="read_more_clicked">
    {children}
  </a>
);

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

/** Where a decision was made that leaves no readable public record. */
const Gap = ({ children }: { children: ReactNode }) => (
  <div className="mt-4 max-w-[63ch] rounded-r border-l-[3px] border-gold-strong bg-gold-strong/[0.07] px-4 py-3">
    {children}
  </div>
);

const SECTION = "mt-14 scroll-mt-24";
const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";

/* ---------------- sources ---------------- */

const V = "https://www.youtube.com/watch?v=";
const DRC14 = `${V}O8Kxggwls3A`;
const SC16 = `${V}93D60e4K1Ig`;
const CC8 = `${V}ZcGKpUHCLdM`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["pension", "Beverly can stop raising its pension payment"],
  ["utility", "What a city-run electric utility would involve"],
  ["parking", "Paid parking, and the range it might raise"],
  ["insurance", "What changing the health insurance split would save"],
  ["dispatch", "Regional dispatch, and an argument for going the other way"],
  ["contracts", "Two union agreements ratified, by name"],
  ["planning", "Planning Board takes up a 24-hour McDonald's"],
  ["thisweek", "Tonight: a crypto vote, and $20,000 for the Human Rights Committee"],
  ["analyst", "The Council is hiring its own budget analyst"],
  ["ahead", "Further out, through October 26"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Sep 23",
    what: "School Committee",
    detail:
      "Finance and Facilities, then Committee of the Whole. A heavy agenda: business was pushed here to make room for last week's special meeting.",
    cal: {
      id: "school-2026-09-23",
      title: "Beverly School Committee",
      start: "2026-09-23T22:00:00Z",
      end: "2026-09-24T01:00:00Z",
      location: "Beverly Middle School Library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Sep 24",
    what: "Contributory Retirement Board",
    detail:
      "Carried over from August: review of additional pension funding schedules from the board's actuary. The board's own notice calls this date tentative.",
    cal: {
      id: "retirement-2026-09-24",
      title: "Beverly Contributory Retirement Board",
      start: "2026-09-24T22:00:00Z",
      end: "2026-09-24T23:30:00Z",
      location: "275 Rantoul St, Beverly, MA",
    },
  },
  {
    date: "Sep 28",
    what: "Budget analyst interviews, then finalists",
    detail:
      "The Council's screening committee interviews candidates 9am to 3pm, and reconvenes at 6pm to identify finalists. Both sessions are closed.",
  },
  {
    date: "Sep 29",
    what: "How state money reaches Beverly",
    detail:
      "Rep. Bowen, 6 to 8pm at the Farms branch library. Hosted by the representative's office rather than the city, so it will not appear on the city calendar.",
    cal: {
      id: "state-aid-2026-09-29",
      title: "State Aid Community Conversation, with Rep. Bowen",
      start: "2026-09-29T22:00:00Z",
      end: "2026-09-30T00:00:00Z",
      location: "Beverly Public Library, Farms branch, 24 Vine St, Beverly, MA",
    },
  },
  {
    date: "Oct 5",
    what: "City Council",
    detail: "First Monday.",
    cal: {
      id: "council-2026-10-05",
      title: "Beverly City Council",
      start: "2026-10-05T23:00:00Z",
      end: "2026-10-06T02:00:00Z",
      location: "City Council Chambers, 191 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 19",
    what: "Flock cameras: Legal Affairs and Public Services, joint",
    detail:
      "The joint committee meeting on the city's automated license plate readers, 6:00 to 6:55pm, before the regular Council meeting. Venue may change because of the City Hall move.",
    cal: {
      id: "flock-joint-2026-10-19",
      title: "Beverly: Flock cameras joint committee meeting",
      start: "2026-10-19T22:00:00Z",
      end: "2026-10-19T22:55:00Z",
      location: "Beverly, MA",
    },
  },
  {
    date: "Oct 20",
    what: "Deficit Reduction Committee, first public presentation",
    detail:
      "The committee presents the full list of revenue and savings ideas it has researched since July, and opens public input. Time and place not yet set.",
    cal: {
      id: "drc-public-2026-10-20",
      title: "Deficit Reduction Committee: first public presentation",
      start: "2026-10-20",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Oct 26",
    what: "FY2028 budget recommendations due",
    detail: "Per the Deficit Reduction Committee's own published timeline.",
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue2() {
  return (
    <div className="bg-bg text-ink">
      <PageTracking surface="digest" issue="2026-09-21" depth />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 2 &middot; Week of September 21
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering September 10 to 20, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The Council votes tonight on whether to ban crypto kiosks for good, and decides
            whether to send $20,000 to the Human Rights Committee. The deficit reduction committee
            spent Monday bringing in outside experts to stress-test its ideas, among them a
            city-owned electric utility, and came away with the best budget news of the year,
            which is about pensions. The School Committee ratified two union agreements at an
            extra meeting on Wednesday. And the Council has started hiring a budget analyst of
            its own.
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
            September 10 to 20
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section id="pension" className={SECTION}>
          <Eyebrow>01 &middot; Pensions</Eyebrow>
          <H2>Beverly can stop raising its pension payment</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 14</From>
          <p className={BODY}>
            Beverly has been putting an extra <Fig>4.5 percent</Fig>{" "}
            into its pension fund every
            year, closing the gap between what it owes retirees and what it has set aside. That
            increase is one of the real structural pressures on the city budget, and it was
            scheduled to keep climbing.
          </p>
          <p className={BODY}>
            Massachusetts requires every municipal retirement system to be fully funded by{" "}
            <Fig>2040</Fig>. Beverly is not aiming for that. Its own schedule, approved by the
            state and reset every two years, gets there around <Fig>2032</Fig>, well ahead of the
            deadline.
          </p>
          <p className={BODY}>
            Strong investment returns over the past two years mean the city can now ease off that
            yearly increase and still hit its own target. The finance director described it as
            significant relief in the budget every year from here on.
          </p>
          <p className={BODY}>
            It is worth putting a rough size on that. Under the current schedule, the step up from
            this year to FY2028 is about <Fig>$700,000</Fig>. If the increase stops, that is
            broadly what the city does not have to find next year, while revenue carries on
            growing. The exact figure depends on the revised schedule the Retirement Board is
            still working through with its actuary, so treat it as an order of magnitude rather
            than a number the city has committed to. In a year with very little good budget news,
            it is one of the more consequential things to come out of this meeting.
          </p>
          <div className="mt-5">
            <Hear
              href={at(DRC14, 5889)}
              title="Hear the pension update"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 1:38:09"
            />
          </div>
          <Refs sources={<Src href={DRC14}>Full recording, Sep 14</Src>} />
        </section>

        {/* ---- 02 ---- */}
        <section id="utility" className={SECTION}>
          <Eyebrow>02 &middot; Revenue ideas</Eyebrow>
          <H2>What a city-run electric utility would involve</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 14</From>
          <p className={BODY}>
            The reason this is on the table at all is rates. Municipal light plants across
            Massachusetts generally charge residents less for electricity than the investor-owned
            utilities do, and one councilor has been asking neighboring towns that run their own
            about a feasibility study. The appeal is savings for the city, and possibly for the
            household bill as well.
          </p>
          <p className={BODY}>
            Most of Monday went to an invited guest from Marblehead, which has owned its own
            electric utility since <Fig>1894</Fig>. He walked the committee through what running
            one actually takes: about <Fig>20</Fig>{" "}
            staff, <Fig>10,800</Fig>{" "}
            meters, a{" "}
            <Fig>$20 million</Fig>{" "}
            budget split evenly between buying power and capital work, and
            around <Fig>21 cents</Fig>{" "}
            a kilowatt-hour on the full bill.
          </p>
          <p className={BODY}>
            Asked what it would cost Beverly to build its own, he was blunt that nobody could say
            without a study, then scaled Marblehead&apos;s system up to a city Beverly&apos;s
            size and landed on <Fig>$100 million to $150 million</Fig>, which he described as a very
            rough calculation. The precise number is unknown. The order of magnitude is not: this
            would be a project north of a hundred million dollars.
          </p>
          <p className={BODY}>
            No proposal is on the table. The committee was gathering the sizing and feasibility it
            would need before one could be.
          </p>
          <div className="mt-5">
            <Hear
              href={at(DRC14, 2700)}
              title="Hear how the utility is staffed"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 45:00"
            />
            <Hear
              href={at(DRC14, 2436)}
              title="Hear what it would cost to start one"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 40:36"
            />
          </div>
          <Refs sources={<Src href={DRC14}>Full recording, Sep 14</Src>} />
        </section>

        {/* ---- 03 ---- */}
        <section id="parking" className={SECTION}>
          <Eyebrow>03 &middot; Revenue ideas</Eyebrow>
          <H2>Paid parking, and the range it might raise</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 14</From>
          <p className={BODY}>
            A member of the committee has been working through what paid parking could raise, and
            came back with two versions. The simpler one costs the city almost nothing: doubling
            the existing dollar-an-hour downtown rate, using what is already in place, would bring
            in roughly <Fig>$400,000</Fig>{" "}
            a year. Start charging on Lothrop Street as well, at{" "}
            <Fig>$3 or $4</Fig>{" "}
            an hour, and the total climbs toward <Fig>$1.5 million</Fig>.
            Which number the city lands on is a question of what it decides to charge, not of what
            is possible.
          </p>
          <p className={BODY}>
            What it costs to set up depends on how far the city goes. Sticking with the phone app
            already in use would, he told the committee, cost very little and be enforced
            relatively simply. Adding the kind of kiosks that stand downtown is a different proposition:
            those run about <Fig>$14,000 to $15,000</Fig>{" "}
            each.
          </p>
          <p className={BODY}>
            One practical wrinkle came up. Charging residents less than visitors would mean
            issuing stickers and having somebody walk the street checking for them, which the
            committee thought clumsy.
          </p>
          <div className="mt-5">
            <Hear
              href={at(DRC14, 830)}
              title="Hear the parking report"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 13:50"
            />
          </div>
          <Refs sources={<Src href={DRC14}>Full recording, Sep 14</Src>} />
        </section>

        {/* ---- 04 ---- */}
        <section id="insurance" className={SECTION}>
          <Eyebrow>04 &middot; Savings ideas</Eyebrow>
          <H2>What changing the health insurance split would save</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 14</From>
          <p className={BODY}>
            Beverly pays <Fig>80 percent</Fig>{" "}
            of employee and retiree health premiums. Moving to{" "}
            <Fig>75</Fig>{" "}
            would save about <Fig>$1.4 million</Fig>, shared between the city and
            school budgets. Moving to <Fig>70</Fig>{" "}
            would save <Fig>$2.8 million</Fig>, and
            increase what plan members pay by <Fig>50 percent</Fig>.
          </p>
          <p className={BODY}>
            It is not a switch the city can simply throw. The finance director explained that
            contribution splits are not covered by the section of state law Beverly normally
            operates under. Changing them would mean adopting a different section, which brings
            with it a committee made up of representatives from every union, bargaining as a
            single bloc. That is a negotiation with trade-offs, and he was careful to say it does
            not necessarily arrive as pure savings.
          </p>
          <p className={BODY}>
            Members also pushed back on what a change would mean for people who have already
            retired, most of whom are on the current split. One member argued it would break an
            understanding those retirees made their plans around.
          </p>
          <p className={BODY}>
            Worth knowing alongside all of this: Beverly insures itself rather than joining the
            state pool, and the finance director defended that choice at length. Holding its own
            reserves has let the city cushion the sort of premium jumps that have hit state-pool
            communities by fifteen or twenty percent in a single year.
          </p>
          <div className="mt-5">
            <Hear
              href={at(DRC14, 5550)}
              title="Hear the savings figures"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 1:32:30"
            />
            <Hear
              href={at(DRC14, 5708)}
              title="Hear how a change would actually have to happen"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 1:35:08"
            />
            <Hear
              href={at(DRC14, 4630)}
              title="Hear why Beverly insures itself rather than joining the state pool"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 1:17:10"
            />
          </div>
          <Refs sources={<Src href={DRC14}>Full recording, Sep 14</Src>} />
        </section>

        {/* ---- 05 ---- */}
        <section id="dispatch" className={SECTION}>
          <Eyebrow>05 &middot; Savings ideas</Eyebrow>
          <H2>Regional dispatch, and an argument for going the other way</H2>
          <From>Deficit Reduction Committee &middot; Monday, September 14</From>
          <p className={BODY}>
            Regional dispatch means routing a city&apos;s 911 and emergency calls through a center
            shared with neighboring towns, rather than each community staffing its own around the
            clock. The argument for it is straightforward: several towns splitting one operation
            costs each of them less than running their own.
          </p>
          <p className={BODY}>
            Beverly looked at it and concluded it does not work here. The regional center has no
            room to take a city this size, and moving would mean giving up locally staffed
            dispatch, a difference councilors measured in seconds of response time.
          </p>
          <p className={BODY}>
            A councilor made the opposite case instead. Beverly&apos;s own dispatch center was
            built with capacity for a smaller community, which could be sold as a service rather
            than bought from somebody else. Another member pointed out that capacity has never
            actually been used.
          </p>
          <div className="mt-5">
            <Hear
              href={at(DRC14, 7946)}
              title="Hear the dispatch discussion"
              meta="Deficit Reduction Committee, Sep 14 &middot; from 2:12:26"
            />
          </div>
          <Refs sources={<Src href={DRC14}>Full recording, Sep 14</Src>} />
        </section>

        {/* ---- 06 ---- */}
        <section id="contracts" className={SECTION}>
          <Eyebrow>06 &middot; Schools</Eyebrow>
          <H2>Two union agreements ratified, by name</H2>
          <From>School Committee, special meeting &middot; Wednesday, September 16</From>
          <p className={BODY}>
            The School Committee held an extra meeting on Wednesday evening, fully remote, lasting
            eighteen minutes. Ten of those were in executive session. It came back into open
            session and ratified agreements with two groups of staff, the clerks and the cafeteria
            workers, each by a roll call vote of <Fig>seven to nothing</Fig>.
          </p>
          <p className={BODY}>
            Because the meeting was remote, every vote had to be a roll call, so the record is
            unusually clear about who voted. Voting yes on both: Mayor Michael Cahill, Geraldine
            Cahill, Catherine Frost, Madeline Lennox, Kimberley Coelho, Kaarin Robinson and
            president Lorinda Visnick. Lindsay Harnden and John Taylor were not present.
          </p>
          <Gap>
            <p className="text-[0.95rem] leading-relaxed">
              <b>The terms are not public yet, and that is the normal course.</b>{" "}
            The Open Meeting
              Law specifically allows a public body to go behind closed doors for collective
              bargaining, and it lets one approve contract terms there too, without ever
              returning to open session.
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed">
              Beverly did more than that. It came back out and took the votes in public, on the
              record, by name. The agreements themselves become public documents once executed, so
              the terms will surface; the vote is simply ahead of the paperwork.
            </p>
          </Gap>
          <p className={BODY}>
            The chair also explained why the meeting existed at all: business had been moved off
            an earlier agenda and had to be squeezed in, which is why next week&apos;s meeting is
            a heavy one.
          </p>
          <div className="mt-5">
            <Hear
              href={at(SC16, 908)}
              title="Hear the clerks agreement vote"
              meta="School Committee, Sep 16 &middot; from 15:08"
            />
            <Hear
              href={at(SC16, 988)}
              title="Hear the cafeteria workers vote"
              meta="School Committee, Sep 16 &middot; from 16:28"
            />
          </div>
          <Refs
            sources={
              <>
                <Src href={SC16}>Full recording, Sep 16</Src>
                <Src href={`${AGENDA}/City-Council-49`}>City agenda center</Src>
              </>
            }
          />
        </section>

        {/* ---- 07 ---- */}
        <section id="planning" className={SECTION}>
          <Eyebrow>07 &middot; Development</Eyebrow>
          <H2>Planning Board takes up a 24-hour McDonald&apos;s</H2>
          <From>Planning Board &middot; Tuesday, September 15</From>
          <p className={BODY}>
            The board was scheduled to consider a change to a 1998 site plan decision that would
            let the McDonald&apos;s at 230 Elliott Street operate 24 hours a day, up from its
            current 6am to midnight.
          </p>
          <Gap>
            <p className="text-[0.95rem] leading-relaxed">
              We cannot tell you what the board decided. The Planning Board is not filmed, and its
              written minutes run behind. The most recent set posted covers a meeting in May.
            </p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-mid">
              <b className="text-ink">Were you there?</b>{" "}
            If you know how this went,{" "}
              <A href="/contact">tell me</A>{" "}
            and I will update this item.
            </p>
          </Gap>
          <Refs
            sources={
              <Src href={`${AGENDA}/Planning-Board-16`}>Planning Board agenda, Sep 15</Src>
            }
          />
        </section>

        {/* ---- also met ---- */}
        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, with no public record available:</b>{" "}
            Conservation Commission and Golf &amp; Tennis on the 15th, Historic District Commission
            and Board of Health on the 16th, and on the 17th both the Community Preservation
            Committee and the Human Rights Committee, which had a pending funding proposal on its
            agenda. None are recorded by BevCam.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        <h2 className="mt-16 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          This week{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            September 21 to 27
          </span>
        </h2>

        {/* ---- 08 ---- */}
        <section id="thisweek" className={SECTION}>
          <Eyebrow>08 &middot; Tonight</Eyebrow>
          <H2>A crypto vote, and $20,000 for the Human Rights Committee</H2>
          <From>
            City Council &middot; Monday, September 21, 7:00pm &middot; City Council Chambers, 191
            Cabot Street &middot; carried on BevCam
          </From>
          <p className={BODY}>
            The ordinance banning cryptocurrency kiosks passed first reading nine to nothing on
            September 8. Massachusetts ordinances need two readings, so tonight is the one that
            settles it. It sits on the agenda as Order #187, under Motions and Orders, marked
            final passage.
          </p>
          <p className={BODY}>
            Two committee reports also come up, and both carry items residents have already
            turned up to speak about. Committees can step out to confer, but they report back in
            the chamber and any vote is taken there, in front of the room and on the recording.
            The agenda says the Council is likely to act on what they report, unless a matter is
            held in committee.
          </p>
          <p className={BODY}>
            <b>Finance and Property</b>{" "}
            takes up <b>Order #213</b>, Councilor Houseman&apos;s
            request that the Mayor raise and appropriate <Fig>$20,000</Fig>{" "}
            for the Beverly Human Rights Committee. He filed it on September 8 and it went
            straight to committee, which is where it has been since. Two of the three residents
            who spoke that night argued for it, framing it as a way to carry on the work of the
            city&apos;s diversity, equity and inclusion director post, which was cut earlier in
            the year.
          </p>
          <p className={BODY}>
            Councilor Feldman chairs the committee it goes to. Council President Flowers sits on
            it, and so does Houseman, who filed the order.
          </p>
          <p className={BODY}>
            <b>Legal Affairs</b>{" "}
            reports on the <b>Flock camera</b>{" "}
            order, which asked two
            committees to meet jointly and examine the city&apos;s contracts for automated license
            plate readers. Tonight is procedural. The review itself is on October 19.
          </p>
          <p className={BODY}>
            On top of that, six public hearings run back to back from 7:45 to 8:45, covering a
            $25,000 transfer to replace the motors on a harbor patrol boat, the Community
            Preservation Committee&apos;s proposed budget for the year, and four National Grid
            petitions. Four of the five public comment slots were taken by the time the agenda was
            posted. Public comment comes near the start of the meeting and is not set up for
            back and forth with councilors; the committee reports come later.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <AddToCalendar
              event={{
                id: "council-2026-09-21",
                title: "Beverly City Council",
                start: "2026-09-21T23:00:00Z",
                end: "2026-09-22T02:00:00Z",
                location: "City Council Chambers, 191 Cabot St, Beverly, MA",
                details:
                  "Final passage of the cryptocurrency machine ordinance (Order #187). Finance and Property takes up Order #213, $20,000 for the Human Rights Committee. Legal Affairs takes up Order #120, on Flock cameras.",
              }}
            />
            <a
              href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
              data-track="source_opened"
              data-placement="agenda-button"
            >
              Tonight&apos;s agenda
            </a>
          </div>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Agenda, Sep 21</Src>
                <Src href={CC8}>First reading, Sep 8</Src>
              </>
            }
          />
        </section>

        <section id="analyst" className={SECTION}>
          <Eyebrow>09 &middot; Hiring</Eyebrow>
          <H2>The Council is hiring its own budget analyst</H2>
          <From>
            Budget and Management Analyst Screening Committee &middot; met Sept 14 and 16, meets
            again Thursday and twice on Monday the 28th
          </From>
          <p className={BODY}>
            The Council is replacing its budget and management analyst, a post it has had for
            about thirty years. It was created after a stretch of financial trouble, on the
            reasoning that councilors are not trained in municipal finance and needed someone
            reading the numbers for them rather than for the administration. The charter protects
            the job from exactly the pressure you would expect: the line can never fall below half
            of what the city provides for the finance director&apos;s office, because the mayor
            writes the budget and a future mayor might be tempted.
          </p>
          <p className={BODY}>
            It is paid out of the Council&apos;s own budget, and that line was cut in June. On a
            motion from Councilor Houseman, seconded by Rotondo, the Council voted nine to nothing
            to reduce it from <Fig>$79,869.75</Fig> to <Fig>$59,869.75</Fig>. The outgoing analyst
            backed the cut and said he could make it work. The city solicitor advised it was within
            the charter because he is paid per diem rather than on salary, and his rate, treated as
            an annual figure, already clears the fifty percent floor. Whoever takes the job next
            starts from the smaller number.
          </p>
          <p className={BODY}>
            The committee is Councilors Rotondo, Spang and Houseman, and it has been working
            since last Monday. Its first meeting, on the 14th, was largely in the open: it elected
            officers, settled how many candidates to put in front of the full Council, and agreed
            confidentiality rules and a common set of interview questions. On the 16th it began
            reading applications.
          </p>
          <p className={BODY}>
            From here it moves quickly. Thursday morning it finalises the questions and fixes
            interview dates. On Monday the 28th it interviews from nine until three, breaks for
            lunch, and reconvenes that evening to choose finalists.
          </p>
          <p className={BODY}>
            Most of that happens in executive session, which the Open Meeting Law specifically
            allows for considering and interviewing job applicants, and three of the five
            meetings will not return to open session at all. There is nothing irregular in that.
            It does mean that for most residents, the first news of this hire will be the
            appointment itself.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09142026-2893`}>First meeting, Sep 14</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09242026-2915`}>Agenda, Sep 24</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09282026-2919`}>Interviews, Sep 28</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09282026-2918`}>Finalists, Sep 28</Src>
              </>
            }
          />
        </section>

        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also meeting this week:</b>{" "}
            Library Trustees on Tuesday, the Zoning Board of Appeals and the School Committee on
            Wednesday, and the Economic and Community Development Council on Thursday morning
            which takes up the economic development action plan, the Planning
            Department&apos;s priorities for the autumn, and a set of proposed Health Department
            fee changes. None of those are recorded by BevCam.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 09 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Further out{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through October 26
            </span>
          </h2>
          <ul className="mt-5 max-w-[63ch]">
            {ahead.map((e) => (
              <li
                key={e.date}
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
        </section>
      </div>
    </div>
  );
}
