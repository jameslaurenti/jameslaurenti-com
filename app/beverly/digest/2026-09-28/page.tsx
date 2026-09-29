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

/** A street or address, opened in Google Maps so readers can see where the work is. */
const MapLink = ({ q, children }: { q: string; children: ReactNode }) => (
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}
    target="_blank"
    rel="noopener"
    className="rlink"
    data-track="read_more_clicked"
    data-placement="map-link"
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
const CC21 = `${V}tNVhhgONCb0`;
const SC23 = `${V}9CEKkFRbIEg`;
const COD24 = `${V}-CClCziEWoo`;
const DRC28 = `${V}VHlM49JcQts`;
const CPC10 = `${V}RUqEZZ6DFSM`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const PACKET_0908 = `${AGENDA}/ViewFile/Agenda/_09082026-2890`;
const PACKET_0921 = `${AGENDA}/ViewFile/Agenda/_09212026-2914`;

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["crypto", "Crypto kiosks are banned, and a thirty-day clock is running"],
  ["sidewalks", "Let trees or shrubs block the sidewalk, and the city may bill you"],
  ["address", "Speakers at Council no longer have to say where they live"],
  ["humanrights", "Putting the Human Rights Committee back together"],
  ["cpa", "$2.46 million in preservation grants, first applications due October 8"],
  ["playgrounds", "Who pays for school playgrounds? So far, the PTOs"],
  ["enon", "179 units proposed for the Stop & Shop site on Enon Street"],
  ["streets", "Where crews want to dig next"],
  ["tonight", "Tonight: the deficit committee starts recommending"],
  ["ahead", "Further out, through November 3"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Sep 29",
    what: "How state money reaches Beverly, with Rep. Bowen",
    detail:
      "6 to 8pm in the Conrad Room at the Farms branch library. Rep. Hannah Bowen was the deficit committee's guest on September 14. Hosted by her office, so it is not on the city calendar.",
    cal: {
      id: "state-aid-2026-09-29",
      title: "State Aid Community Conversation, with Rep. Bowen",
      start: "2026-09-29T22:00:00Z",
      end: "2026-09-30T00:00:00Z",
      location: "Conrad Room, Farms branch library, Beverly, MA",
    },
  },
  {
    date: "Sep 30",
    what: "Update on the Varian site cleanup",
    detail:
      "The former Varian facility at 150 Sohier Road is being cleaned of chemical contamination in the ground, under state oversight, with public briefings on its progress. This one covers January to June. Since then, crews have started heating the ground under one building to draw the chemicals out, removing about 850 pounds by the end of August. 7:00pm (doors 6:30) at the Beverly Middle School library, 502 Cabot St, with an online option and a BevCam livestream. Not a city meeting, so it is not on the city calendar.",
    cal: {
      id: "varian-pip-2026-09-30",
      title: "Varian site cleanup: public update",
      start: "2026-09-30T23:00:00Z",
      end: "2026-10-01T01:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
      details:
        "Progress briefing on the environmental cleanup at the former Varian facility, 150 Sohier Road. Doors 6:30pm, presentation 7:00pm. Online option available. Live on BevCam: https://www.youtube.com/watch?v=mgzRfcfQBtA",
    },
  },
  {
    date: "Sep 30",
    what: "School Committee policy subcommittee",
    detail:
      "Planned for this date under its new chair, Catherine Frost. Topics she has raised for the year include e-bike safety, international travel and AI in the classroom. Time not yet posted.",
  },
  {
    date: "Oct 4",
    what: "Bark in the Park",
    detail:
      "A Beverly 400 event for the city's dogs, Sunday at Beverly High School, with a rain date.",
    cal: {
      id: "bark-park-2026-10-04",
      title: "Beverly 400: Bark in the Park",
      start: "2026-10-04",
      allDay: true,
      location: "Beverly High School, Beverly, MA",
    },
  },
  {
    date: "Oct 5",
    what: "City Council, first meeting at the Middle School",
    detail:
      "7:00pm in the Beverly Middle School library, where the Council meets for the length of the City Hall renovation. Final votes due on the ordinance about overgrown trees and shrubs, and on the Human Rights Committee quorum change. At 7:30, the continued hearing on National Grid's work under Bow, Wallis, Cabot and Abbott streets.",
    cal: {
      id: "council-2026-10-05",
      title: "Beverly City Council",
      start: "2026-10-05T23:00:00Z",
      end: "2026-10-06T02:00:00Z",
      location: "Beverly Middle School library, Beverly, MA",
    },
  },
  {
    date: "Oct 8",
    what: "Community Preservation pre-applications due",
    detail:
      "For grant round 14, about $2.46 million across historic preservation, housing and open space. Full applications are due January 13.",
    cal: {
      id: "cpa-preapp-2026-10-08",
      title: "Beverly CPA grant round 14: pre-applications due",
      start: "2026-10-08",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Oct 19",
    what: "Flock cameras: Legal Affairs and Public Services, joint",
    detail:
      "The joint review of the city's automated license plate reader contracts, 6:00 to 6:55pm, before the regular Council meeting.",
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
    what: "Deficit Reduction Committee: first public presentation",
    detail: "The full list of revenue and savings ideas, and public input.",
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
  {
    date: "Oct 29",
    what: "Retirement Board",
    detail: "Tentative, 6:00pm. The board that sets the city's pension funding schedule.",
    cal: {
      id: "retirement-2026-10-29",
      title: "Beverly Contributory Retirement Board",
      start: "2026-10-29T22:00:00Z",
      end: "2026-10-29T23:30:00Z",
      location: "275 Rantoul St, Beverly, MA",
    },
  },
  {
    date: "Nov 3",
    what: "State election, with 14 days of early voting",
    detail:
      "The Council approved the election warrant and 14 days of in-person early voting on September 21. The city clerk sets the early voting dates and locations.",
    cal: {
      id: "state-election-2026-11-03",
      title: "Massachusetts state election",
      start: "2026-11-03",
      allDay: true,
      location: "Beverly, MA",
    },
  },
];

/* ---------------- page ---------------- */

export default function DigestIssue3() {
  return (
    <div className="bg-bg text-ink">
      <PageTracking surface="digest" issue="2026-09-28" depth />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 3 &middot; Week of September 28
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering September 21 to 27, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            Beverly has banned cryptocurrency machines, and the ones already here have thirty
            days to go. Property owners whose trees or shrubs block the sidewalk could soon be
            billed for the city to cut them back, with a lien if the bill goes unpaid. People who speak at Council no longer have to say
            their home address out loud. A 179-unit building has been proposed for the Stop &amp;
            Shop site on Enon Street. And $2.46 million in preservation grants is open, with first
            applications due October 8.
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
            September 21 to 27
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section id="crypto" className={SECTION}>
          <Eyebrow>01 &middot; Now law</Eyebrow>
          <H2>Crypto kiosks are banned, and a thirty-day clock is running</H2>
          <From>
            City Council &middot; Monday, September 21 &middot; Order #187, final passage,
            submitted by the Mayor and Councilors Rotondo and Sonia
          </From>
          <Hear
            src={CC21}
            s={2752}
            title="Councilors Sonia and Rotondo, then the final vote"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            Beverly has banned cryptocurrency machines. The Council gave{" "}
            <b>Order #187</b>{" "}
            its second reading on September 21 and passed it, three weeks after the first.
          </p>
          <p className={BODY}>
            The ordinance has teeth. No store or place of business may install,
            operate or maintain one. Any machine already running has to be removed within{" "}
            <Fig>30 days</Fig>{" "}
            of the Council accepting the ordinance, and after that a business that keeps one faces
            a fine of <Fig>$300</Fig>{" "}
            a day, for every device.{" "}
            <Moment src={CC21} s={2615} />
          </p>
          <p className={BODY}>
            The kiosks turn cash into cryptocurrency, which is what makes them useful to scammers:
            once money goes in, it is effectively gone. Councilor Sonia called these
            sophisticated scams and said that ideally the state legislature would act, since some
            neighboring towns already have.{" "}
            <Moment src={CC21} s={2716} />{" "}By Councilor Rotondo&apos;s account the ordinance
            started with Councilor Crowley, and he credited the solicitor&apos;s office with the
            drafting and the police chief with his support.{" "}
            <Moment src={CC21} s={2752} />
          </p>
          <p className={BODY}>
            Rotondo and Sonia are also planning a morning presentation on scams in October, with
            the district attorney&apos;s office and the Council on Aging.{" "}
            <Moment src={CC21} s={2780} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_0908}#page=44`}>Filing letter (p. 44)</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Council agenda, Sep 21</Src>
                <Src href={CC21}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section id="sidewalks" className={SECTION}>
          <Eyebrow>02 &middot; First vote</Eyebrow>
          <H2>Let trees or shrubs block the sidewalk, and the city may bill you</H2>
          <From>
            City Council &middot; Monday, September 21 &middot; Order #221, first reading,
            submitted by the Mayor
          </From>
          <Hear
            src={CC21}
            s={5588}
            title="The vegetation ordinance, read into the record"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            Beverly already requires property owners to trim trees and bushes that obstruct the
            street or the sidewalk.{" "}
            <b>Order #221</b>{" "}
            sets out what happens when they do not.
          </p>
          <p className={BODY}>
            An owner who lets trees or shrubs block a street or sidewalk would face warnings and
            fines.
            If it still is not cut back, the Department of Public Services can remove it and send
            the owner the bill. If that bill is unpaid after <Fig>60 days</Fig>, the city can put
            a <b>lien</b>{" "}
            on the property.
          </p>
          <p className={BODY}>
            It passed its first reading without discussion.{" "}
            <Moment src={CC21} s={5634} />{" "}Ordinances need two, so the final vote is expected on
            October 5. If you have trees or shrubs along a sidewalk, now is a good time to look at
            them.
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_0921}#page=58`}>Mayor&apos;s letter (p. 58)</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Council agenda, Sep 21</Src>
                <Src href={CC21}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section id="address" className={SECTION}>
          <Eyebrow>03 &middot; Your seat at the podium</Eyebrow>
          <H2>Speakers at Council no longer have to say where they live</H2>
          <From>
            City Council &middot; Monday, September 21 &middot; Order #239, filed by Council
            President Flowers
          </From>
          <Hear
            src={CC21}
            s={7118}
            title="The president on why the rule changed"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            Until now, anyone speaking at public comment had to stand at the podium and give their
            name and home address for the record, on a meeting that is broadcast and archived on
            the internet. The Council changed that on the 21st.
          </p>
          <p className={BODY}>
            Under the new rule, you give your address to the city clerk when you sign up. At the
            podium you say only which ward you live or work in, and the posted agenda lists your
            ward rather than your street address. Flowers said the Council had been hearing for a
            while that saying a home address out loud does not feel safe for everyone, and that
            it wanted to lower that barrier. Because this changes the Council&apos;s own rules rather than a city
            ordinance, it needed a single two-thirds vote instead of two readings, and it passed.{" "}
            <Moment src={CC21} s={6065} />
          </p>
          <p className={BODY}>
            The rest works as before. There are five speaking slots at each regular meeting,
            three minutes each, first come, first served. You sign up with the city clerk by 9:30
            on the morning of the meeting.{" "}
            <Moment src={CC21} s={974} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${PACKET_0921}#page=127`}>Flowers&apos; letter (p. 127)</Src>
                <Src href={`${PACKET_0921}#page=140`}>The rule as amended (p. 140)</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Council agenda, Sep 21</Src>
                <Src href={CC21}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 04 ---- */}
        <section id="humanrights" className={SECTION}>
          <Eyebrow>04 &middot; Human Rights Committee</Eyebrow>
          <H2>Putting the Human Rights Committee back together</H2>
          <From>
            City Council, Monday, September 21 &middot; Commission on Disabilities, Thursday,
            September 24
          </From>
          <Hear
            src={CC21}
            s={5652}
            title="The quorum change, read into the record"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            The Human Rights Committee has eleven seats. Its own September agenda lists a
            chairperson and four members, and a committee that size, measured against a quorum
            calculated from eleven, has trouble doing anything at all.
          </p>
          <p className={BODY}>
            Two fixes are underway, in a sensible order. The Mayor and Council President Flowers
            jointly filed{" "}
            <b>Order #222</b>, which lets the committee count a quorum from the members actually
            seated rather than from the number of seats. It passed first reading and comes back
            on October 5.{" "}
            <Moment src={CC21} s={5688} />{" "}The money comes second.{" "}
            <b>Order #213</b>, Councilor Houseman&apos;s request that the Mayor put{" "}
            <Fig>$20,000</Fig>{" "}
            toward the committee, is still in Finance and Property. Houseman filed it after what
            his letter calls supportive discussions with the Mayor and the committee&apos;s chair,
            then asked that it wait until he knew how the Mayor wanted to structure it. He was not
            at the meeting on the 21st. Finance and Property met during the recess without a live
            microphone, so its discussion is not in the BevCam recording. Like every Council
            committee meeting, it was public, and a clerk took minutes. The full Council approves
            those minutes at a later meeting, and they are then posted online.
          </p>
          <p className={BODY}>
            All of this is live because of the budget. The city&apos;s diversity, equity and
            inclusion director post was cut in July, and all five residents who signed up for
            public comment on the 21st came to talk about it. Several said a volunteer committee
            cannot absorb what a staff position was doing, and asked who owns that work now.{" "}
            <Moment src={CC21} s={1066} />
          </p>
          <p className={BODY}>
            For one part of it, there is an answer on the record. The former director was also
            the city&apos;s ADA coordinator and held the seat on the Commission on Disabilities
            that goes with that work. Both have passed to Amelia Boivin, whose appointment to the
            commission the Council approved the same night.{" "}
            <Moment src={CC21} s={3290} /> <Moment src={COD24} s={770} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09172026-2907`}>
                  Committee agenda, Sep 17
                </Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914#page=61`}>
                  Mayor&apos;s letter on #222 (p. 61)
                </Src>
                <Src href={`${PACKET_0908}#page=121`}>Houseman&apos;s letter on #213 (p. 121)</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914#page=4`}>
                  Finance and Property sheet (p. 4)
                </Src>
                <Src href={`${PACKET_0921}#page=138`}>Council rules, Rule 22 (p. 138)</Src>
                <Src href={CC21}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 05 ---- */}
        <section id="cpa" className={SECTION}>
          <Eyebrow>05 &middot; Open for applications</Eyebrow>
          <H2>$2.46 million in preservation grants, first applications due October 8</H2>
          <From>
            City Council, Monday, September 21 &middot; Community Preservation Committee launch
            meeting, September 10
          </From>
          <Hear
            src={CC21}
            s={3945}
            title="What is in the pot for this round"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            Beverly joined the state&apos;s Community Preservation Act in 2012. It is a pot of
            money for four kinds of projects: affordable housing, open space, recreation and
            historic preservation. A nine-member Community Preservation Committee reviews
            applications and recommends grants, and the Council has the final vote.{" "}
            <Moment src={CPC10} s={234} />
          </p>
          <p className={BODY}>
            Most of the money comes from property owners, through a surcharge voters approved in
            2012 and that has been on tax bills ever since. It is{" "}
            <b>1 percent of your property tax, not 1 percentage point</b>. The tax on the first
            $100,000 of a home&apos;s value is left out, and the surcharge is 1 percent of the rest.
            In an example the city publishes using 2022 figures, a home that paid{" "}
            <Fig>$4,160</Fig>{" "}
            in property tax paid <Fig>$29.43</Fig>{" "}
            toward the CPA. It is not a new charge, and nothing about this year&apos;s grants changes
            what you pay.{" "}
            <Moment src={CPC10} s={1698} />
          </p>
          <p className={BODY}>
            The state then adds money of its own, from a statewide trust fund rather than from your
            bill. It is worked out as a share of the total Beverly raises: more than 20 cents on the
            dollar in the program&apos;s early years, about 7 cents now.{" "}
            <Moment src={CPC10} s={1735} />
          </p>
          <p className={BODY}>
            The upshot: about <Fig>$2.46 million</Fig>{" "}
            is available to award this year. That is this year&apos;s new money, about $1.34
            million, whose budget the Council approved on the 21st, plus what was left from
            earlier years. About $1.5 million of it can go to any eligible project; the rest is
            reserved by law for particular categories. This is the program&apos;s fourteenth
            yearly round, which is why you will see it called round 14.{" "}
            <Moment src={CPC10} s={1842} />
          </p>
          <p className={BODY}>
            In those fourteen years it has put about <Fig>$12 million</Fig>{" "}
            into 100 projects. Examples include{" "}
            <Fig>$825,000</Fig>{" "}
            to install fire sprinklers in Garden City Towers, a six-story housing authority
            building home to 130 people that had none; $1 million toward turning the old Briscoe
            school into housing, including homes for income-restricted seniors; work on the Cabot&apos;s lobby and
            the Larcom&apos;s marquee; and renovations at 20 city parks and playgrounds.{" "}
            <Moment src={CPC10} s={354} /> <Moment src={CPC10} s={593} />
          </p>
          <p className={BODY}>
            Anyone can apply. The city, nonprofits, and private and for-profit organizations have
            all won grants. The money is for capital projects, like buying, building or restoring
            something, not upkeep or programs, and projects that bring some funding of their own
            tend to do better.{" "}
            <Moment src={CPC10} s={2895} />{" "}
            <b>Pre-applications, a short form, are due at noon on October 8.</b>{" "}
            The form, instructions and schedule are on the city&apos;s{" "}
            <a
              href="https://www.beverlyma.gov/1307/Current-CPA-Funding-Round-Round-14"
              target="_blank"
              rel="noopener"
              className="rlink"
              data-track="read_more_clicked"
            >
              Round 14 page
            </a>
            . Those that pass are invited to apply in full by January 13, and the Council votes on
            the committee&apos;s picks around May.{" "}
            <Moment src={CPC10} s={3234} />{" "}The committee answers questions from would-be
            applicants at the start of every meeting.{" "}
            <Moment src={CPC10} s={3128} />{" "}One project that may apply is in the next item.
          </p>
          <Refs
            sources={
              <>
                <Src href="https://www.beverlyma.gov/1307/Current-CPA-Funding-Round-Round-14">
                  Round 14 forms
                </Src>
                <Src href="https://www.beverlyma.gov/DocumentCenter/View/7629/Beverly-CPA-Plan_2026-Revisions#page=6">
                  Beverly CPA plan (p. 6)
                </Src>
                <Src href={CPC10}>Launch meeting, Sep 10</Src>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Council agenda, Sep 21</Src>
                <Src href={CC21}>Council recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 06 ---- */}
        <section id="playgrounds" className={SECTION}>
          <Eyebrow>06 &middot; Schools</Eyebrow>
          <H2>Who pays for school playgrounds? So far, the PTOs</H2>
          <From>School Committee &middot; Wednesday, September 23</From>
          <Hear
            src={SC23}
            s={7261}
            title="A barrier-free playground for the McKeown preschool"
            meeting="School Committee, Sep 23"
          />
          <p className={BODY}>
            A barrier-free playground at the McKeown preschool, where the ground is now wood chips,
            may be among this round&apos;s preservation grant applications. Superintendent Cushing
            said he will more than likely ask the Community Preservation Committee for help, since
            recreation is an eligible use and Beverly&apos;s students are Beverly residents.{" "}
            <Moment src={SC23} s={7349} />
          </p>
          <p className={BODY}>
            It would not be the only source. Two staff members have already applied for a{" "}
            <a
              href="https://www.cummingsfoundation.org/grants/"
              target="_blank"
              rel="noopener"
              className="rlink"
              data-track="read_more_clicked"
            >
              Cummings Foundation
            </a>{" "}
            grant, and the superintendent thanked them by name. The Woburn-based foundation is
            giving out $35 million in its current round, mostly to local nonprofits, and it also
            funds public schools in communities where it owns commercial property.
          </p>
          <p className={BODY}>
            That one grant opened a bigger conversation. As far as she can remember, President
            Visnick said, the district has never bought a playground as a capital expense,
            because its PTOs have always raised the money.{" "}
            <Moment src={SC23} s={7788} />{" "}Capital planning for the schools sits with the city.
            And any new playground, even one a PTO pays for, has to come to the committee for a
            vote, because its long-term maintenance comes out of the school budget and its yearly
            safety inspection falls to the city&apos;s recreation department.{" "}
            <Moment src={SC23} s={7438} />
          </p>
          <p className={BODY}>
            Making them accessible would mean at least six playgrounds, at a cost described at the
            table as very high.{" "}
            <Moment src={SC23} s={7749} />{" "}The superintendent added that playground costs have
            risen sharply since the pandemic, and that he worries PTOs cannot keep covering them.{" "}
            <Moment src={SC23} s={7524} />{" "}Vice President Harnden put the point plainly: PTOs
            raise money for a lot of things people might expect the schools or the city to pay
            for.{" "}
            <Moment src={SC23} s={7868} />
          </p>
          <p className={BODY}>
            The committee also approved the high school music program&apos;s spring trip to
            Williamsburg, Virginia, its first five-day trip since 2019, at{" "}
            <Fig>$1,170</Fig>{" "}
            a student. It asked the music director to find out whether families can buy
            cancellation insurance, which the district has never offered.{" "}
            <Moment src={SC23} s={5965} />
          </p>
          <Refs
            sources={
              <>
                <Src href={SC23}>Full recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 07 ---- */}
        <section id="enon" className={SECTION}>
          <Eyebrow>07 &middot; Development</Eyebrow>
          <H2>179 units proposed for the Stop &amp; Shop site on Enon Street</H2>
          <From>
            Zoning Board of Appeals agenda, Wednesday, September 23 &middot; City Council, Monday,
            September 21
          </From>
          <Hear
            src={CC21}
            s={7252}
            title="Councilor Feldman on the Ward 5 zoning items"
            meeting="City Council, Sep 21"
          />
          <p className={BODY}>
            A company called Beverly Tre LLC has proposed <Fig>179</Fig>{" "}
            residential units and <Fig>2,600 square feet</Fig>{" "}
            of commercial space at 37 Enon Street, where the North Beverly Stop &amp; Shop is now.
            The store is not going anywhere yet: Stop &amp; Shop has until December to decide
            whether to renew its lease, the Salem News has reported. If it renews, the apartments
            wait; the owner is seeking approvals now so it is ready if not.
          </p>
          <p className={BODY}>
            The only question before the Zoning Board of Appeals on September 23 was height.
            Zoning there allows <Fig>35 feet</Fig>, and the developer wants{" "}
            <Fig>46.5</Fig>{" "}
            for a sloped roof that it says would hide rooftop equipment. The meeting was not
            televised, so the outcome will be reported once the board posts its decision or
            minutes. Councilor Feldman said the project goes to
            the Planning Board in October, with another neighborhood meeting to come.{" "}
            <Moment src={CC21} s={7301} />
          </p>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09232026-2908`}>ZBA agenda, Sep 23</Src>
                <Src href="https://www.salemnews.com/news/presentation-made-to-beverly-residents-regarding-enon-street-property/article_f6343c46-fd1e-4132-9c93-46a64d9db17f.html">
                  Salem News, Sep 4
                </Src>
                <Src href={CC21}>Council recording</Src>
              </>
            }
          />
        </section>

        {/* ---- 08 ---- */}
        <section id="streets" className={SECTION}>
          <Eyebrow>08 &middot; Street work</Eyebrow>
          <H2>Where crews want to dig next</H2>
          <From>
            City Council and its Public Services committee &middot; Monday, September 21
          </From>
          <p className={BODY}>
            Utilities need the Council&apos;s permission to dig under city streets, and several
            requests came up on the 21st. The Council usually attaches conditions: whoever digs
            repaves the street curb to curb, rebuilds any sidewalk it disturbs, and replaces any
            shade tree it damages.
          </p>
          <p className="mt-3 max-w-[63ch] text-[0.88rem] text-ink-faint">
            Street names open in Google Maps.
          </p>
          <ul className="mt-3 max-w-[63ch] list-disc space-y-2 pl-5 text-[1.0625rem] leading-[1.7]">
            <li>
              <b>
                <MapLink q="Bow St, Beverly, MA">Bow</MapLink>,{" "}
                <MapLink q="Wallis St, Beverly, MA">Wallis</MapLink>,{" "}
                <MapLink q="Cabot St, Beverly, MA">Cabot</MapLink>{" "}and{" "}
                <MapLink q="Abbott St, Beverly, MA">Abbott</MapLink>{" "}streets:
              </b>{" "}
              National Grid wants new conduit for new cable, to cut outages. The Council has not
              acted yet and continued the hearing to October 5 at 7:30pm, while the city sets up a
              meeting with National Grid about how long the work would take.{" "}
              <Moment src={CC21} s={6366} />
            </li>
            <li>
              <b>
                <MapLink q="1 School St, Beverly, MA">School Street</MapLink>:
              </b>{" "}
              new conduit to a property at One School Street. Approved. The street was repaved
              last year, and opening a newly repaved street carries a $5,000 fee.{" "}
              <Moment src={CC21} s={5269} />
            </li>
            <li>
              <b>
                <MapLink q="191 Cabot St, Beverly, MA">City Hall</MapLink>{" "}and{" "}
                <MapLink q="Bridge St & River St, Beverly, MA">Bridge Street</MapLink>:
              </b>{" "}
              temporary power for the City Hall renovation, and street lighting for the temporary
              bridge off Bridge and River streets. Both approved.{" "}
              <Moment src={CC21} s={4584} />
            </li>
            <li>
              <b>
                <MapLink q="Ashton St, Beverly, MA">Ashton Street</MapLink>, and more to come:
              </b>{" "}
              GoNetSpeed, a fiber internet company, was approved for Ashton Street. Four more of
              its requests, starting near{" "}
              <MapLink q="76 Colon St, Beverly, MA">76</MapLink>{" "}and{" "}
              <MapLink q="129 Colon St, Beverly, MA">129 Colon Street</MapLink>,{" "}
              <MapLink q="2 Balch St, Beverly, MA">2 Balch Street</MapLink>{" "}and{" "}
              <MapLink q="92 Boyles St, Beverly, MA">92 Boyles Street</MapLink>, are on hold until the city&apos;s engineers and the Mayor meet with the company about its
              plans across the city; they are expected in October.{" "}
              <Moment src={CC21} s={4888} />
            </li>
          </ul>
          <Refs
            sources={
              <>
                <Src href={`${AGENDA}/ViewFile/Agenda/_09212026-2914`}>Council agenda, Sep 21</Src>
                <Src href={CC21}>Full recording</Src>
              </>
            }
          />
        </section>


        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, without video:</b>{" "}
            Library Trustees on Tuesday; the Airport Commission, the Zoning Board of Appeals and
            the South Essex Sewerage Board on Wednesday; and on Thursday the Board of Assessors,
            the Housing Authority, the Economic and Community Development Council, the Veterans
            Advisory Committee and the Retirement Board. For those, the record is the posted
            agenda now and the minutes once they are approved.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- coda: the quilt ---- */}
        <aside id="quilt" aria-labelledby="quilt-title" className="mt-16 scroll-mt-24">
          {/* A patchwork block as the section break: the one ornament on the page. */}
          <div aria-hidden className="flex max-w-[63ch] items-center justify-center gap-1.5">
            {["bg-accent", "bg-debt", "bg-gold-strong", "bg-debt", "bg-accent"].map((c, i) => (
              <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
            ))}
          </div>
          <div className="mt-5 max-w-[63ch] rounded-lg border border-rule bg-white/70 px-5 py-6 sm:px-7">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">
              One more thing
            </p>
            <h3
              id="quilt-title"
              className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight"
            >
              A quilt for Beverly 400
            </h3>
            <p className="mt-3 text-[1.0625rem] leading-[1.75]">
              September 21 was the Council&apos;s last meeting in the council chamber before City
              Hall closes for renovation, and it opened with the Garden City Quilters presenting a
              quilt made for Beverly 400. It is pieced from old postcards of the city, and the
              quilters pointed out that most of the buildings pictured look very different today,
              and some no longer stand. The Council voted to accept it, and Historic Beverly will
              hang it while City Hall is closed.{" "}
              <Moment src={CC21} s={393} />
            </p>
            <div className="mt-4">
              <Hear
                src={CC21}
                s={279}
                title="The Garden City Quilters present the Beverly 400 quilt"
                meeting="City Council, Sep 21"
              />
            </div>
          </div>
        </aside>

        <h2 className="mt-16 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          Tonight{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            Monday, September 28
          </span>
        </h2>

        {/* ---- 09 ---- */}
        <section id="tonight" className={SECTION}>
          <Eyebrow>09 &middot; Tonight</Eyebrow>
          <H2>The deficit committee starts recommending</H2>
          <From>
            Deficit Reduction Committee &middot; Monday, September 28, 6:00pm &middot; carried
            live on BevCam
          </From>
          <p className={BODY}>
            Since the summer, the Deficit Reduction Committee has been gathering: members
            researching ideas on their own, and at its last meeting, questioning the finance
            director, the state representative and others about a city-run electric utility, paid
            parking, the health insurance split and regional dispatch.
          </p>
          <p className={BODY}>
            Tonight&apos;s agenda has a different verb in it. Item three reads{" "}
            <b>&ldquo;discussion on each idea as committee for first round
            recommendations.&rdquo;</b>{" "}
            This is where the committee starts saying what it thinks the city should do. Also on
            the agenda: benchmarking Beverly against comparable cities, and scheduling more
            community outreach meetings.
          </p>
          <p className={BODY}>
            &ldquo;First round&rdquo; is doing real work there. Nothing tonight is final and
            nothing the committee recommends is binding: the Mayor writes the budget and the
            Council votes on it. The agenda lists the meeting for Council Chambers, but the
            Council itself has moved to the Middle School while City Hall is renovated, so check
            the city calendar before you go. BevCam is carrying it live either way.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <AddToCalendar
              event={{
                id: "drc-2026-09-28",
                title: "Beverly Deficit Reduction Committee: first round recommendations",
                start: "2026-09-28T22:00:00Z",
                end: "2026-09-29T00:00:00Z",
                location: "Beverly, MA · streamed live by BevCam",
                details:
                  "First round recommendations on each idea the committee has researched. Watch live: https://www.youtube.com/watch?v=VHlM49JcQts",
              }}
            />
            <a
              href={DRC28}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
              data-track="source_opened"
              data-placement="watch-live-button"
            >
              Watch live on BevCam
            </a>
            <a
              href={`${AGENDA}/ViewFile/Agenda/_09282026-2926`}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-10 items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent no-underline transition-colors hover:border-accent hover:bg-accent-glow"
              data-track="source_opened"
              data-placement="agenda-button"
            >
              Tonight&apos;s agenda
            </a>
          </div>
        </section>

        {/* ---- 10 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Further out{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 3
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
        </section>

        <aside
          aria-labelledby="corrections-title"
          className="mt-14 max-w-[63ch] border-t border-rule pt-5"
        >
          <h2
            id="corrections-title"
            className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint"
          >
            Corrections
          </h2>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">To this issue:</b>{" "}
            An earlier version said the Finance and Property discussion of Order #213 was not on
            the record. Council committee meetings are public and minuted. What is missing is
            video, since the committee met without a live microphone. Its minutes will be posted
            once the Council approves them.
          </p>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">To issue 2:</b>{" "}
            The School Committee ratified three union agreements on September 16, not two; we left
            out the crossing guards&apos;. The $20,000 request for the Human Rights Committee was
            before a three-member Council committee, not the full Council. And the Council&apos;s
            budget analyst post is about thirty years old, not new, and the analyst has not said
            he is leaving.{" "}
            <a href="/beverly/digest/2026-09-21" className="rlink">
              Issue 2
            </a>{" "}
            has been updated.
          </p>
        </aside>
      </div>
    </div>
  );
}
