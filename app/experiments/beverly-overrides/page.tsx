import {
  BODY,
  Colophon,
  Compare,
  DraftBar,
  DraftNote,
  H2,
  LIST,
  More,
  Src,
  Stats,
  Timeline,
  type TimelineRow,
} from "@/components/beverly/HistoryParts";

/**
 * Beverly and Proposition 2½: every push for an override or debt exclusion in the city's records since 1992.
 * Ported Nov 20, 2026 from the shareable Claude Doc of the same name (rev 17, with James's edits). The research
 * record, with every source tagged, is research/2026-11_override-history.md in the meeting-digest folder;
 * change facts there first.
 *
 * Rules: neutral like the digest; citizen organizers named by group, not by person; individual votes only on
 * roll calls; Deficit Reduction Committee ideas labeled as ideas, not recommendations.
 */

const LF = (id: number) => `https://lfserver.beverlyma.gov/WebLink/DocView.aspx?id=${id}&dbid=0&repo=BPL`;
const SALEM_2008 =
  "https://www.salemnews.com/archives/beverly-override-crushed-tax-limits-upheld-but-mckeown-school-will-close-at-months-end/article_0c5f3d52-d46a-58f7-98f8-7ae74e560fb2.html";

const PUSHES: TimelineRow[] = [
  { key: "y1992", when: "1992", label: "Override for the deficit", sub: "Alderman's order; went no further", start: "1992-07-07" },
  { key: "y2003", when: "2003", label: "High school debt exclusion", sub: "Filed away 8 to 0; no ballot", start: "2003-04-22" },
  { key: "y2004", when: "2004", label: "Override study", sub: "Study approved 9 to 0; no ballot", start: "2004-06-21" },
  { key: "y2006a", when: "2006", label: "Academic wing debt exclusion", sub: "Citizens' group asked; no order filed", start: "2006-04-28" },
  { key: "y2006b", when: "2006", label: "School operating override", sub: "Filed away 9 to 0; no ballot", start: "2006-05-15" },
  { key: "y2008", when: "2008", label: "$2.5 million school override", sub: "On the ballot: failed, 3,846 to 6,686", start: "2008-06-03", tone: "key" },
  { key: "quiet", when: "2009 to 2021", label: "Quiet years", sub: "No proposals found", start: "2009-01-01", end: "2021-12-31", tone: "quiet" },
  { key: "now", when: "2024 to now", label: "Override back in discussion", sub: "Discussion only so far", start: "2024-12-04", end: "2026-11-17" },
];

export default function BeverlyOverridesPage() {
  return (
    <main className="mx-auto w-full max-w-[72rem] px-4 pb-24 pt-6 sm:px-6">
      <DraftBar />
      <header className="mt-8">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">Budget · How it happened</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Beverly and Proposition 2½
        </h1>
        <p className="mt-5 max-w-[63ch] text-[1.15rem] leading-[1.65]">
          In city records from 1992 to today, Beverly voters have been asked to go above the state&apos;s property tax
          cap once: a $2.5 million school override on June 3, 2008. It failed, 3,846 to 6,686. At least five other pushes
          for an override or a debt exclusion stopped before reaching the ballot, and the idea is back in discussion now.
        </p>
        <Stats
          items={[
            { big: "1", label: "question on the ballot since 1992" },
            { big: "0", label: "passed" },
            { big: "5", label: "other pushes that stopped short of the ballot" },
          ]}
        />
        <DraftNote>
          Quotes from city minutes were checked against the page images. Minutes summarize what was said; recordings are
          quoted from YouTube&apos;s automatic captions.
        </DraftNote>
      </header>

      <section aria-labelledby="cap">
        <H2 id="cap">How the cap works</H2>
        <p className={BODY}>
          Proposition 2½ is a 1980 state law that caps property taxes in every Massachusetts city and town. A city&apos;s
          total property tax collection, called the levy, can grow 2.5% a year, plus taxes on new construction. Voters
          can go above the cap in two ways.
        </p>
        <Compare
          caption="Two ways to go above the cap"
          head={["Override", "Debt exclusion"]}
          rows={[
            {
              label: "What it pays for",
              cells: ["Anything, usually yearly costs like school staff", "One borrowing project, like a school building"],
            },
            {
              label: "How long it lasts",
              cells: ["Permanently: it raises the base that every later year grows from", "Only until that loan is paid off"],
            },
          ]}
        />
        <p className={BODY}>
          In Beverly, the City Council has to vote to put either question on the ballot. Then a majority of voters
          decides.
        </p>
      </section>

      <section aria-labelledby="glance">
        <H2 id="glance">At a glance</H2>
        <p className={BODY}>Each row is one push. Only the 2008 school override went to voters.</p>
        <Timeline
          rows={PUSHES}
          from={1992}
          to={2028}
          every={6}
          label="Pushes for an override or debt exclusion in Beverly's minutes, 1992 to 2026"
        />
      </section>

      <section aria-labelledby="y1992">
        <H2 id="y1992">1992: the first push on record</H2>
        <p className={BODY}>
          The city was short of money, and its legislature was then called the Board of Aldermen. On July 7, 1992,
          Alderman Battistelli filed an order to override Proposition 2½ &ldquo;in order to fully fund any deficit&rdquo;
          left in the next year&apos;s budget (<Src href={LF(4012)}>minutes</Src>). It went to the Committee of the
          Whole, a meeting of the full board.
        </p>
        <p className={BODY}>
          That fall Mayor F. John Monahan wrote that Moody&apos;s, the bond rating agency, and several School Committee
          members were suggesting an override. His answer: &ldquo;I reject and oppose any attempt to override 2 ½ as
          property taxes are still too high in Beverly and Massachusetts&rdquo; (
          <Src href={LF(4018)}>letter in the Oct 19 minutes, p. 3</Src>). The order does not come up again in the 1992
          minutes, and it never reached a ballot.
        </p>
      </section>

      <section aria-labelledby="y2003">
        <H2 id="y2003">2003 and 2004: a new high school, and a study</H2>
        <p className={BODY}>
          By 2003 the high school&apos;s accreditation agency had flagged the building&apos;s problems. In January, Mayor
          Thomas Crean asked the Council to approve borrowing $60 million for a new high school and $734,000 for its
          design. The building money depended on voters passing a debt exclusion; the design money would come from an
          exclusion or the school budget (<Src href={LF(600)}>request</Src>). In his State of the City address he said
          this &ldquo;puts the matter squarely in the hands of the taxpayers who will be paying the bill&rdquo; (
          <Src href={LF(599)}>minutes, p. 3</Src>).
        </p>
        <p className={BODY}>
          The design money came up first. On April 7 the Council&apos;s roll call split 4 to 5, and the money was not
          approved (<Src href={LF(596)}>minutes, p. 4</Src>).
        </p>
        <More label="The April 7 roll call">
          <p>
            Councilors Costa, Coughlin, Martin and Murray voted yes, and Councilors Flaherty, McGlynn, Morency,
            Troubetaris and Guanci voted no. The minutes word it as an order to &ldquo;deny&rdquo; the loan, which makes
            the sides hard to read, but borrowing needs six of nine votes and neither side had them.
          </p>
        </More>
        <p className={BODY}>
          Two weeks later Councilor John Murray filed an order to put a debt exclusion for the design money on the
          November 2003 ballot. On May 5 the Council voted 8 to 0 to file it away, so no question went to voters (
          <Src href={LF(595)}>minutes, p. 9</Src>).
        </p>
        <p className={BODY}>
          In March 2004 the School Committee asked for a study of putting an override on the ballot &ldquo;to address the
          future budget problems facing the City of Beverly.&rdquo; The Council approved the study 9 to 0 on June 21,
          2004 (<Src href={LF(602)}>minutes, p. 4</Src>). An Override Study Committee existed by that September, but the
          minutes on file don&apos;t say what it concluded.
        </p>
      </section>

      <section aria-labelledby="y2006">
        <H2 id="y2006">2006: two pushes in one spring</H2>
        <p className={BODY}>
          The Superintendent&apos;s first draft of the next school budget showed a $4.8 million gap. Superintendent James
          Hayes asked the Council for an override. At a joint meeting of the Council and School Committee on April 28, he
          said: &ldquo;We have a huge problem in front of us and we shouldn&apos;t be managers. We should be
          leaders&rdquo; (<Src href={LF(6105)}>minutes</Src>).
        </p>
        <p className={BODY}>
          A citizens&apos; group, YES, For Beverly, presented at the same meeting. It made the case for a debt exclusion
          to build the high school&apos;s new academic wing and asked for an election. The minutes record that Mayor
          William Scanlon speculated either kind of question &ldquo;may pit the people of lesser means against people of
          greater means.&rdquo; He offered the schools $800,000 a year for up to three years instead, if they held budget
          growth to 3%.
        </p>
        <p className={BODY}>
          On May 15 the Council voted 9 to 0 to file the Superintendent&apos;s request away (
          <Src href={LF(6058)}>minutes, p. 6</Src>). In his budget letter two weeks later, Scanlon wrote: &ldquo;While the
          City Council saw little enthusiasm for such an action, those favoring an operating budget override certainly
          have a right to be heard&rdquo; (<Src href={LF(6090)}>letter</Src>). No order for the academic wing exclusion
          appears in the Council minutes.
        </p>
      </section>

      <section aria-labelledby="y2008">
        <H2 id="y2008">2008: the one that reached the ballot</H2>
        <p className={BODY}>
          On April 7, 2008, Councilors Kevin Hobin, Patricia Grimes, Judith Cronin and D. Wesley Slate Jr. filed an order
          to ask voters: &ldquo;Shall the City of Beverly be allowed to assess an additional $2,500,000 in real estate and
          personal property taxes for the purposes of funding the operating budget of the Beverly Public Schools&rdquo;
          for the coming year? The Council voted 9 to 0 to hold the election (
          <Src href={LF(6517)}>minutes, pp. 10 and 13</Src>) and set it for June 3 (
          <Src href={LF(6564)}>election call</Src>). A citizens&apos; group, Yes for Beverly, campaigned for it.
        </p>
        <p className={BODY}>
          Mayor Scanlon opposed it. On April 14 he told the Council there were &ldquo;intelligent, sincere,
          well-intentioned people on both sides of this issue,&rdquo; and that without an override the schools would have
          to carry out the Superintendent&apos;s reconfiguration plan or some version of it. He argued the gap would come
          back: keeping current school staffing would mean voters &ldquo;will need to pass an override. Not just this
          year, but each and every year after this year as well. Override after override&rdquo; (
          <Src href={LF(6518)}>minutes, p. 3</Src>).
        </p>
        <p className={BODY}>
          <b className="font-bold">The override failed, 3,846 yes to 6,686 no.</b> &ldquo;No&rdquo; carried all 12
          precincts, and the McKeown School would close at the end of the month, the{" "}
          <Src href={SALEM_2008}>Salem News reported</Src> the next day.
        </p>
        <p className={BODY}>
          In February 2010 Scanlon told the Council: &ldquo;As we have seen, a strong majority of our citizens has little
          appetite for overrides&rdquo; (<Src href={LF(6880)}>minutes, p. 4</Src>).
        </p>
      </section>

      <section aria-labelledby="quiet">
        <H2 id="quiet">2009 to 2021: two schools built inside the cap</H2>
        <p className={BODY}>
          The Council and School Committee minutes from 2009 through 2021 show no override or debt exclusion proposals.
          The city built a new high school and a new middle school without either.
        </p>
        <ul className={LIST}>
          <li>
            <b className="font-bold">The high school</b> was paid for without one. In 2006 Scanlon told the Council the
            city expected to pay for it from its general budget, which would take &ldquo;identifiable new tax revenue
            growth for the foreseeable future&rdquo; (<Src href={LF(5838)}>letter</Src>), including about $800,000 a year
            from the Cummings Center once its tax break ended.
          </li>
          <li>
            <b className="font-bold">The middle school</b> was also built without one. In 2014 Mayor Michael Cahill moved
            $3.5 million into the city&apos;s reserve fund to cover &ldquo;our expected spike in debt service through
            2020&rdquo; (<Src href={LF(8147)}>minutes</Src>).
          </li>
        </ul>
        <p className={BODY}>
          In June 2020 the minutes record Finance Director Bryant Ayles telling the Council that the city &ldquo;always
          goes to 2 1/2 percent, we have never gone beyond that&rdquo; (<Src href={LF(29047)}>minutes, p. 2</Src>).
        </p>
      </section>

      <section aria-labelledby="now">
        <H2 id="now">2024 to now: the question returns</H2>
        <p className={BODY}>
          The city&apos;s Financial Forecast Committee, which projects the budget each year, took up the idea in December
          2024. With the schools needing about $3.5 million, its minutes say &ldquo;an override was discussed but the
          consensus was that voters wouldn&apos;t approve such a measure.&rdquo; They record Councilor Scott Houseman
          adding that &ldquo;last time around, even with the potential loss of a school, an override was not
          approved&rdquo; (<Src href={LF(392743)}>minutes, p. 3</Src>).
        </p>
        <p className={BODY}>
          A year later the committee voted unanimously on this wording for its report: &ldquo;The committee had an
          additional conversation whether the city of Beverly should consider an override of Proposition 2 ½ if the
          policy makers of the city wanted to retain existing services&rdquo; (<Src href={LF(393006)}>minutes, p. 5</Src>
          ).
        </p>
        <p className={BODY}>
          At the Council&apos;s final budget vote on June 23, 2026, it came up from both sides. Councilor Matt St. Hilaire
          said some colleagues were eager to propose an override, which in his opinion &ldquo;would just financially harm
          our residents even further&rdquo; (
          <Src href="https://www.youtube.com/watch?v=nlwByu273SM&t=899s">video, 14:59</Src>). Councilor John Mullady, a
          former School Committee member, said: &ldquo;I should have done a better job at advocating for an
          override&rdquo; (<Src href="https://www.youtube.com/watch?v=nlwByu273SM&t=11737s">video, 3:15:37</Src>).
        </p>
        <p className={BODY}>
          At the Deficit Reduction Committee&apos;s October 20 community meeting, members presenting ideas listed an
          override and said it could go on the November 2027 city ballot (
          <Src href="https://www.youtube.com/watch?v=SB09OZ8Nitk&t=2315s">video, 38:35</Src>). That is an idea under
          study, not a committee recommendation. At the Forecast Committee&apos;s November 17 meeting, one member opened
          by saying &ldquo;the budgetary table is set for a prospective proposition two and a half override at a time when
          affordability is near crisis point for many people, especially seniors&rdquo; (
          <Src href="https://www.youtube.com/watch?v=3hMTOz6bOaU&t=483s">video, 8:03</Src>).
        </p>
      </section>

      <section aria-labelledby="gaps">
        <H2 id="gaps">What the record doesn&apos;t show yet</H2>
        <ul className={LIST}>
          <li>
            <b className="font-bold">The early years.</b> The city&apos;s archive has no minutes from 1980, when
            Proposition 2½ passed, through 1991, and none for 1993, 1996, 1997 or 2019. Minutes for 2022 and 2023 were
            not searched. The City Clerk&apos;s election records would show whether any other question reached voters.
          </li>
          <li>
            <b className="font-bold">The 2008 count</b> comes from the Salem News. The city minutes on file don&apos;t
            record the result.
          </li>
          <li>
            <b className="font-bold">The state&apos;s list</b> of override and exclusion votes, kept by the Division of
            Local Services, has no Beverly entries at all, not even 2008. It can&apos;t confirm or rule out anything here.
          </li>
          <li>
            <b className="font-bold">Two loose ends.</b> The minutes on file don&apos;t say what became of the 1992 order
            or the 2004 study.
          </li>
        </ul>
      </section>

      <Colophon>
        <p>
          <b>City minutes and letters:</b> Beverly&apos;s{" "}
          <Src href="https://lfserver.beverlyma.gov/WebLink/Browse.aspx?id=9095&dbid=0&repo=BPL">Laserfiche archive</Src>,
          linked above at each quote. The server&apos;s security certificate expired June 1, 2026, so browsers may show a
          warning before opening it.
        </p>
        <p>
          <b>Recordings:</b> BevCam Government on YouTube, linked at the time of each quote.
        </p>
        <p>
          <b>2008 result:</b> <Src href={SALEM_2008}>Salem News, June 4, 2008</Src>; election date also in the{" "}
          <Src href="http://www.boston.com/bostonglobe/regional_editions/overridecentral/2008/04/_will_it_be_yes.html">
            Boston Globe, April 8, 2008
          </Src>
          .
        </p>
        <p>A working draft, November 20, 2026. It takes no position on whether Beverly should seek an override.</p>
      </Colophon>
    </main>
  );
}
