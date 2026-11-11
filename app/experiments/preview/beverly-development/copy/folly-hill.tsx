import { BODY, Cite } from "../parts";
import type { CopyContext, SiteCopy } from "./index";

export default function copy({ status }: CopyContext): SiteCopy {
  const current = status.current;
  return {
    from: (
      <>
        From the Planning Board&apos;s decisions and the filings on <Cite source="folly-page" />.
      </>
    ),
    lead: (
      <>
        {current.who}{" "}has approval to build {current.homes}{" "}apartments in six buildings on undeveloped land off
        Trask Lane, with about 61 acres of the site kept as open space. The approvals came in 2025, under zoning locked in
        by a subdivision plan the land&apos;s owners filed in 2016, the year the city changed that zoning.
      </>
    ),
    afterApprovals: (
      <p className={BODY}>
        The developer has not secured an easement across the neighboring Apple Village property for a second entrance, so
        the approved plan sends all traffic by Trask Lane and Manor Road. The decision requires the developer to keep
        trying for the easement before it applies for a building permit (
        <Cite source="folly-spr-decision p. 6" page="comma" />
        ).
      </p>
    ),
    fits: (
      <>
        <p className={BODY}>
          The land is zoned for housing at high density, apartments included, so the project needed no zoning change and
          no permission for the use. The city&apos;s approvals came from the Planning Board: site plan review, the
          affordable housing plan, and a special permit to build 1.7 parking spaces per apartment where zoning asks for 2.
          The size of the project also required the state&apos;s full environmental review.
        </p>
        <p className={BODY}>
          Which zoning applied is the center of the story. State law lets a subdivision plan hold land to the zoning in
          place when the plan was first filed (<Cite source="mgl-40a-6" />). The owners filed a preliminary plan in 2016,
          and the city did not dispute in court that it froze the zoning (<Cite source="appeals-2019" />). The same year
          the City Council changed the zoning to require more land per home, which the Mayor later wrote would have cut
          the site&apos;s potential to about 100 to 200 units (<Cite source="folly-mepa-enf pp. 20-25" page="comma" />).
          The city&apos;s project page describes the subdivision plan as filed &ldquo;in order to effectuate a zoning
          freeze&rdquo;; the Planning Board&apos;s minutes say the freeze &ldquo;was thus perfected&rdquo; when the plan
          was endorsed in February 2025 (<Cite source="pb-2025-02-12" />).
        </p>
        <p className={BODY}>
          PlanBeverly, the city&apos;s long-range plan, dated January 2021, shades most of this land as a priority
          preservation area. What it says is set out under{" "}
          <a href="#land" className="rlink">
            The land
          </a>
          .
        </p>
      </>
    ),
  };
}
