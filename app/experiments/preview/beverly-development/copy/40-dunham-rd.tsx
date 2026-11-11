import { BODY, Cite } from "../parts";
import type { CopyContext, SiteCopy } from "./index";

export default function copy({ status }: CopyContext): SiteCopy {
  const current = status.current;
  return {
    from: <>From the 2022 application and the Planning Board&apos;s minutes, linked under Sources.</>,
    lead: (
      <>
        {current.homes}{" "}apartments for older residents were approved in 2022 for a vacant part of the Dunham Ridge
        office campus. In 2024 the owner said the project was on hold while it looked for financing, and the Planning
        Board extended its parking permit to November 4, 2026. No further extension has been posted.
      </>
    ),
    sections: [
      {
        title: "The permit clock",
        body: (
          <>
            <p className={BODY}>
              Approvals like these expire if the work doesn&apos;t start in time, unless the board extends them. In
              October 2024 the owner&apos;s attorney asked for two more years, saying the project was approved just as
              costs and interest rates rose and had been put on hold indefinitely while the owner looks for financing.
              The Planning Board agreed, 7-0, extending the parking special permit to November 4, 2026 (
              <Cite source="pb-2024-10-29 pp. 1-2" page="comma" />
              ).
            </p>
            <p className={BODY}>
              No further extension appears on Planning Board agendas posted through October 27, and the city&apos;s own
              page for the project no longer loads. Whether the permits lapsed, were extended again, or are kept alive
              some other way is a question for the Planning Department; this page will say when the answer is on the
              record.
            </p>
          </>
        ),
      },
    ],
    fits: (
      <>
        <p className={BODY}>
          The campus is zoned for offices, research labs and light industry. Housing for older residents of the kind the
          zoning calls subsidized elderly housing is allowed there with a special permit from the Zoning Board, which the
          board granted 4-1. The Planning Board then allowed 1.33 parking spaces per apartment where zoning asks for 2,
          6-1, and approved the site plan, 7-0.
        </p>
        <p className={BODY}>
          PlanBeverly, the city&apos;s long-range plan, marks this area for growth and names Dunham Road among the places
          it wants to keep for offices, research and manufacturing. What it says is set out under{" "}
          <a href="#land" className="rlink">
            The land
          </a>
          .
        </p>
      </>
    ),
  };
}
