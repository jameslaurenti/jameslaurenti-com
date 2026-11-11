import { BODY, Cite, SMALL } from "../parts";
import type { CopyContext, SiteCopy } from "./index";

export default function copy({ status }: CopyContext): SiteCopy {
  const current = status.current;
  return {
    from: (
      <>
        From <Cite source="boulder-deck">Waverly Development&apos;s slides</Cite> for the November 5 community meeting,
        which the city posted on November 6.
      </>
    ),
    lead: (
      <>
        {current.who}{" "}has shown residents a plan for an age-restricted community of {current.homes}{" "}units on wooded
        land off Route 128 at the Wenham line: townhomes for buyers 55 and older, and an assisted living and memory care
        building. No formal application has been filed for it, <Cite source="city-projects">the city says</Cite>.
      </>
    ),
    approvalsIntro: "The slides list five approvals, each decided by a city board after a public hearing:",
    afterApprovals: (
      <p className={`mt-3 max-w-[63ch] ${SMALL}`}>
        An October version of the slides listed four, counting the last two as one.
      </p>
    ),
    fits: (
      <>
        <p className={BODY}>
          The land is zoned for offices, research and light industry. That zoning allows housing for people 55 and older
          with a special permit, which is the route the slides propose for the townhomes. It does not list assisted
          living, so that building needs a use variance: permission to use land in a way its zoning does not allow. The
          Zoning Board can grant one only for a hardship particular to the land, and four of its five members must agree
          (<Cite source="zoning-300-92" />). Because the whole site is in the water supply district, the Planning
          Board&apos;s permit is needed as well.
        </p>
        <p className={BODY}>
          The developer&apos;s <Cite source="boulder-deck-oct">October slides</Cite> say an earlier plan, two five-story
          buildings with 205 units, met the zoning but would have stood closer to the neighborhood.
        </p>
        <p className={BODY}>
          PlanBeverly, the city&apos;s long-range plan, does not name this land. The zoning and what the plan says about
          the area are set out under <a href="#land" className="rlink">The land</a>. More on variances and special
          permits in <Cite source="digest:2026-11-09#zba">the digest&apos;s explainer</Cite>.
        </p>
      </>
    ),
  };
}
