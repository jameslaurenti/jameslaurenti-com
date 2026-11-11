import { BODY, Cite, H3 } from "../parts";
import type { SiteCopy } from "./index";

/**
 * 218-226 Cabot Street. A city-owned building with no proposal on the table, so the page is mostly the record:
 * what the city bought and why, what it tried, and what people said at each step. Residents are named by street,
 * officials by name, as in the digest.
 */
export default function copy(): SiteCopy {
  return {
    labels: { section: "The sale", shows: "What the first request offered", current: "The next request", history: "The record" },
    from: (
      <>
        The second request has not been issued. What follows is what the first one offered (
        <Cite source="rfp-26-007" page="comma" />
        ); the city has not said what will change.
      </>
    ),
    lead: (
      <>
        The city owns the Rogers Building, the former Family Dollar block on Cabot Street, and the public parking lot
        behind it. It took the property by eminent domain in 2023, a year after a developer proposed 113 apartments on
        the lot. A plan to use the building as temporary City Hall offices was dropped in 2025, and in September 2026 the
        city rejected the one response to its first request to sell the building. It plans a second request, with help
        from state agencies.
      </>
    ),
    fits: (
      <>
        <p className={BODY}>
          The building sits in the CC2 district on Cabot Street, where new buildings can be at most 45 feet and four
          stories (<Cite source="deck-2025-09 p. 3" page="comma" />
          ). The city&apos;s first request asked for the same limits, and said a hotel would also need a special permit
          from the Planning Board (<Cite source="rfp-26-007" page="comma" />
          ).
        </p>
        <p className={BODY}>
          Because the city owns the land, a sale follows the state law for selling public property, chapter 30B: a
          public request for proposals, scored against criteria set in advance, with the city choosing the &ldquo;most
          advantageous&rdquo; proposal. The Mayor makes the final decision and may reject all of them. Whoever buys the
          building would then need the usual permits for what they build.
        </p>
      </>
    ),
    afterHistory: [
      {
        id: "comment",
        title: "What people said",
        body: (
          <>
            <p className={BODY}>
              Public comment from the meetings, in order. Residents are named by street. Where a summary comes from a
              news report rather than the city&apos;s minutes, it says so.
            </p>

            <H3>The apartment plan, 2022</H3>
            <p className={BODY}>
              At the Planning Board&apos;s July 2022 hearing, residents raised the loss of the public parking, the
              artists&apos; studios in the building, and the dollar store as a low-cost place to buy food. The
              board&apos;s chair called the building too large but said the zoning allowed it, and the project&apos;s
              architect said it would add needed housing and help downtown, the{" "}
              <Cite source="salem-2022-07-21">Salem News reported</Cite>.
            </p>

            <H3>The purchase hearing, May 1, 2023</H3>
            <p className={BODY}>
              Seven people spoke at the Council&apos;s public hearing on the $8 million order (
              <Cite source="cc-m-2023-05-01 pp. 3-7" page="none">minutes, pp. 3-7</Cite>
              ):
            </p>
            <ul className="mt-3 max-w-[63ch] list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.75]">
              <li>
                The executive directors of the Greater Beverly Chamber of Commerce and of Beverly Main Streets spoke in
                support. The Main Streets director named parking and affordable housing as downtown&apos;s biggest
                issues and said the timeline left room to find the right developer.
              </li>
              <li>A Butman Street resident called it an incredible opportunity.</li>
              <li>
                A Hale Street resident supported it as long as the public and the Council were closely involved in
                writing the request to sell the building, with affordable housing and downtown&apos;s character as his
                concerns.
              </li>
              <li>
                A Mulberry Street resident said the developer had every right to build and that the project would add
                housing and customers, but that losing more than 100 parking spaces would hurt downtown businesses. He
                asked the Council to think it through.
              </li>
              <li>
                A Bridge Street resident asked the Council to vote no, on three grounds: cost, since leasing offices
                would be cheaper and the city was paying a high price per parking space; the environment, since the
                money went to parking; and housing, since 113 apartments, 12 of them affordable, would give way to up to
                50 that might never be built.
              </li>
              <li>
                An Eastern Avenue resident asked what parking studies showed, said the lot was empty, and asked whether
                the money could go to bike lanes, buses or publicly built low-income housing instead.
              </li>
            </ul>
            <p className={BODY}>
              Councilors Hannah Bowen and Scott Houseman said they were frustrated that the Council was brought in only
              when the deal was ready for a yes or no, and the Mayor said other downtown sites, including church
              properties, did not meet the city&apos;s parking, office and housing needs,{" "}
              <Cite source="patch-2023-05-01">Patch reported</Cite>. All eight councilors present voted for both orders.
            </p>

            <H3>Since then</H3>
            <p className={BODY}>
              In June 2025, a Vine Street resident told the Council he hoped the building could help people
              experiencing homelessness, through shelter or services (<Cite source="cc-m-2025-06-02 p. 6" page="comma" />
              ).
            </p>
            <p className={BODY}>
              At the first public meeting on reuse, in September 2025, ideas included housing and artist studios from
              former tenants of the building, a grocery, a co-op, a boutique hotel and splitting the parcel,{" "}
              <Cite source="patch-2025-09-09">Patch reported</Cite>. The city&apos;s December presentation listed the
              priorities it heard as keeping the public parking, returning the property to the tax rolls, and uses with
              a community benefit (<Cite source="deck-2025-12 p. 2" page="comma" />
              ). A city survey drew more than 1,000 responses, with a grocery getting the most votes and a hotel also
              favored (<Cite source="rfp-26-007 p. 4" page="comma" />
              ).
            </p>
          </>
        ),
      },
    ],
  };
}
