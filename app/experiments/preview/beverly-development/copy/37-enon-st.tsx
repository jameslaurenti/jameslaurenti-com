import { parseDate } from "@/lib/beverly/development.mjs";
import { BODY, Cite } from "../parts";
import type { CopyContext, SiteCopy } from "./index";

export default function copy({ status }: CopyContext): SiteCopy {
  const current = status.current;
  const next = current.next ? parseDate(current.next.date)?.label : null;
  return {
    from: (
      <>
        From the applications, plans and decisions on <Cite source="enon-page" />.
      </>
    ),
    lead: (
      <>
        {current.who}{" "}wants to replace the Stop &amp; Shop on Enon Street, next to the North Beverly train station,
        with one building of {current.homes}{" "}apartments and a small amount of shop space. The Zoning Board has allowed
        the extra height it needs, and the Planning Board&apos;s hearing continues{next ? ` ${next}` : ""}.
      </>
    ),
    approvalsIntro: "Five steps with city boards, and where each stands:",
    afterApprovals: (
      <p className={BODY}>
        Before the Planning Board votes, the Parking and Traffic Commission and the Design Review Board review the plan
        and report back. Both had it on their agendas, November 4 and 5 (<Cite source="digest:2026-11-09" />).
      </p>
    ),
    fits: (
      <>
        <p className={BODY}>
          Apartments are allowed on this land: the applications ask for no permission for the use itself, only for height
          and parking. Zoning allows 35 feet here, and the Zoning Board allowed 46.5 feet in September for a sloped roof
          that the developer says would hide rooftop equipment.
        </p>
        <p className={BODY}>
          Zoning requires 367 parking spaces for this mix of apartments, about 2 per apartment, and the plan has 281.
          Building fewer takes the Planning Board&apos;s special permit, the one decision where the board has latitude,
          its chair said at the October 27 hearing. Site plan review, the chair said, &ldquo;cannot be denied except under
          extraordinary circumstances,&rdquo; though the board can attach conditions. The affordable homes are required by
          the city&apos;s inclusionary housing ordinance, and the board checks that the plan complies (
          <Cite source="digest:2026-11-02#enon" />).
        </p>
        <p className={BODY}>
          PlanBeverly, the city&apos;s long-range plan, marks the area around the North Beverly station for growth and
          recommends a neighborhood planning study there. What it says is set out under{" "}
          <a href="#land" className="rlink">
            The land
          </a>
          .
        </p>
      </>
    ),
  };
}
