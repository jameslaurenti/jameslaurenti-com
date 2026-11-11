import type { Metadata } from "next";
import Link from "next/link";
import { getSite, register } from "@/lib/beverly/developmentRegister";
import { BODY, Cite, DraftBar, H2, More, SMALL } from "../parts";

/**
 * How Rantoul Street changed: the context for the "Before 2021" lens on the development map. What was
 * built near the Depot from 2005 to 2025, the rules that allowed it, what was said on the record, and how the
 * rules changed in 2023 and 2024. Neutral, like the digest. Buildings come from the register's `earlier` list plus
 * the two register sites finished since 2021; the sources this page cites are listed under `explainers` in the
 * register so the checker counts them.
 */

export const metadata: Metadata = {
  title: "How Rantoul Street changed (draft) — James Laurenti",
  description:
    "The apartment buildings that went up near the Beverly Depot from 2005 to 2025, the zoning that allowed them, the debate on the record, and how the rules changed in 2023 and 2024.",
  robots: { index: false, follow: false },
};

type Row = { name: string; address: string; homes: number; year: number; basis: string; href?: string };

function rows(): Row[] {
  const earlier: Row[] = (register.earlier?.buildings ?? []).filter((b) => b.story === "rantoul-street").map((b) => ({
    name: b.name,
    address: b.address,
    homes: b.homes,
    year: b.year,
    basis: b.year_basis === "assessor" ? "assessor's year built" : b.year_basis,
  }));
  // The two finished since 2021 have pages of their own.
  const recent: Row[] = [
    { id: "140-rantoul-st", year: 2023, basis: "completed October 2023" },
    { id: "southwest-rantoul-gateway", year: 2025, basis: "leasing began June 2025" },
  ].flatMap(({ id, year, basis }) => {
    const s = getSite(id);
    if (!s) return [];
    const homes = s.chapters[s.chapters.length - 1].homes ?? 0;
    return [{ name: s.name, address: s.address, homes, year, basis, href: `/experiments/preview/beverly-development/${id}` }];
  });
  return [...earlier, ...recent].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
}

const BAR = "#6b6055";

function Bars({ list }: { list: Row[] }) {
  const max = Math.max(...list.map((r) => r.homes));
  return (
    <ol className="mt-6 max-w-[44rem] space-y-3" aria-label="Buildings by year, with the number of homes in each">
      {list.map((r) => (
        <li key={r.name} className="grid grid-cols-[3.25rem_1fr] items-start gap-x-3">
          <span className="pt-0.5 text-[0.9rem] font-semibold tabular-nums text-ink-mid">{r.year}</span>
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2 text-[0.95rem] leading-snug">
              {r.href ? (
                <Link href={r.href} className="rlink font-semibold">
                  {r.name}
                </Link>
              ) : (
                <span className="font-semibold">{r.name}</span>
              )}
              <span className="text-[0.82rem] text-ink-faint">{r.address}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span
                aria-hidden
                className="block h-2.5 rounded-r"
                style={{ width: `${Math.max(2, (r.homes / max) * 100) * 0.8}%`, background: BAR }}
              />
              <span className="text-[0.85rem] tabular-nums text-ink-mid">{r.homes} homes</span>
            </div>
            <div className="mt-0.5 text-[0.75rem] text-ink-faint">{r.basis}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function RantoulStreetPage() {
  const list = rows();
  const total = list.reduce((n, r) => n + r.homes, 0);
  const since2016 = list.filter((r) => r.year >= 2016).reduce((n, r) => n + r.homes, 0);

  return (
    <main className="mx-auto w-full max-w-[72rem] px-4 pb-24 pt-6 sm:px-6">
      <DraftBar back={{ href: "/experiments/preview/beverly-development", label: "Development map" }} />
      <header className="mt-8">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">Development · How it happened</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          How Rantoul Street changed
        </h1>
        <p className="mt-5 max-w-[63ch] text-[1.15rem] leading-[1.65]">
          From 2005 to 2025, {list.length} apartment and condo buildings with about {total.toLocaleString("en-US")}{" "}
          homes went up within half a mile of the Beverly Depot, most of them on Rantoul Street. Here is what was built,
          the rules that allowed it, what was said about it on the record, and how the city changed those rules in 2023
          and 2024.
        </p>
      </header>

      <section aria-labelledby="built">
        <H2 id="built">What was built</H2>
        <p className={BODY}>
          Buildings of 10 or more homes, oldest first. About {since2016.toLocaleString("en-US")}{" "}of the homes came in
          2016 or later. Across the whole city, Beverly built 168 homes from 2010 to 2014 and then built or permitted
          nearly 1,400 after 2014, according to figures the city&apos;s planning department gave the{" "}
          <Cite source="globe-2023-01-20">Boston Globe</Cite>.
        </p>
        <Bars list={list} />
        <p className={`mt-4 max-w-[63ch] ${SMALL}`}>
          The year is when a source says a building opened or was finished; otherwise it is the assessor&apos;s year
          built, which can be a year or two off. Home counts come from the approval or the building&apos;s owner where
          we have them, and otherwise from the assessor. The two linked buildings were finished after 2021 and have
          pages of their own.
        </p>
      </section>

      <section aria-labelledby="rules">
        <H2 id="rules">What the rules allowed</H2>
        <p className={BODY}>
          Downtown Beverly is zoned CC, the Central Business District, where buildings could be up to 55 feet tall (
          <Cite source="cc-m-2023-02-13 p. 5" page="comma" />
          ). Along part of Rantoul Street, a <b className="font-bold">Tall Building Overlay</b> allowed up to 75 feet
          for some uses, with a special permit from the Planning Board and a review against design guidelines for tall
          buildings (<Cite source="planbeverly p. 28" page="comma" />
          ).
        </p>
        <p className={BODY}>
          Two other rules near the station mattered. A parking overlay lowered the number of spaces new homes needed
          close to the Depot (<Cite source="planbeverly p. 28" page="comma" />
          ), and the MBTA opened a 500-car garage at the Depot in August 2014 (
          <Cite source="patch-2014-08-01" page="comma" />
          ).
        </p>
        <More label="When the overlay began, and an example">
          <p className={BODY}>
            The overlay predates PlanBeverly. The zoning code shows the downtown district&apos;s rules amended in June
            2007 (<Cite source="city-redline-2022 p. 3" page="comma" />
            ), and the city&apos;s planning department wrote in 2022 that the design guidelines for tall buildings were
            created in 2007 to support the overlay (<Cite source="city-memo-2022-11 p. 1" page="comma" />
            ). In January 2023 the city&apos;s planning director called it a 15-year-old allowance (
            <Cite source="patch-2023-01-26" page="comma" />
            ).
          </p>
          <p className={BODY}>
            One building that used it:{" "}
            <Link href="/experiments/preview/beverly-development/140-rantoul-st" className="rlink">
              Depot II at 140 Rantoul Street
            </Link>
            , approved in 2020 at 72.5 feet and six stories by special permit.
          </p>
        </More>
      </section>

      <section aria-labelledby="debate">
        <H2 id="debate">What was said on the record</H2>
        <p className={BODY}>
          The pace of building drew both support and objection, in hearings and in the news. A few moments:
        </p>
        <ul className="mt-3 max-w-[63ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-[1.75]">
          <li>
            <b className="font-bold">January 2020.</b> Over the past ten years, city officials had approved more than
            700 new homes, <Cite source="patch-2020-01-13">Patch reported</Cite>. At the Planning Board&apos;s hearing
            on Depot II, its chair said about 2,000 people had signed a petition and 78 letters had been submitted (
            <Cite source="pb-2020-01-28 p. 12" page="comma" />
            ). Mayor Cahill supported the project, pointing to the block&apos;s closeness to the train (
            <Cite source="pb-2020-01-28 p. 6" page="comma" />
            ). The board approved it 7-1.
          </li>
          <li>
            <b className="font-bold">October 2022.</b> Councilor Matt St. Hilaire proposed limiting new buildings to
            three stories, saying he was concerned about the pace and scale of development. Mayor Cahill said he
            supported ending the height overlay on Rantoul Street and limiting heights on Cabot Street, and the planning
            director said the city had moved away from case-by-case special permits toward consistent rules,{" "}
            <Cite source="patch-2022-10-25">Patch reported</Cite>. St. Hilaire later said he filed it after a five-story project
            was announced that June for the lot behind{" "}
            <Link href="/experiments/preview/beverly-development/218-226-cabot-st" className="rlink">
              218-226 Cabot Street
            </Link>{" "}
            (<Cite source="cc-m-2023-02-13 p. 1" page="comma" />
            ).
          </li>
          <li>
            <b className="font-bold">December 2022.</b>{" "}At a joint hearing, Ward 2 Councilor Estelle Rand said the
            changes addressed fatigue with height and development in Ward 2 over the last decade, and that housing should
            also be added in other wards. The planning director called the package a quick fix for what residents had
            said, that they did not want Rantoul Street&apos;s heights on Cabot Street,{" "}
            <Cite source="patch-2022-12-06">Patch reported</Cite>.
          </li>
          <li>
            <b className="font-bold">January 2023.</b> The{" "}
            <Cite source="globe-2023-01-20">Boston Globe</Cite> reported both sides: Councilor St. Hilaire asked
            whether the city had the resources to support its pace of growth, and housing advocates, including the
            director of Family Promise North Shore, worried that limits would push rents higher. The planning director told a council committee the overlay had
            met its goals (<Cite source="patch-2023-01-26" page="comma" />
            ).
          </li>
          <li>
            <b className="font-bold">February 2023.</b> Before the vote, Councilor St. Hilaire cited the condition of
            major roads and the capacity of public safety and schools, and Councilor Hannah Bowen argued that height limits would cut housing without solving
            the problems residents raised (<Cite source="cc-m-2023-02-13 pp. 1-4" page="comma" />
            ).
          </li>
        </ul>
      </section>

      <section aria-labelledby="changed">
        <H2 id="changed">How the rules changed</H2>
        <p className={BODY}>
          PlanBeverly, the city&apos;s long-range plan adopted in January 2021, recommended removing the Tall Building
          Overlay and relying instead on dimensional and design standards in a new mixed-use district along Rantoul Street
          near the Depot (<Cite source="planbeverly p. 42" page="comma" />
          ).
        </p>
        <p className={BODY}>
          On <b className="font-bold">February 13, 2023</b>, the City Council voted (
          <Cite source="cc-m-2023-02-13 pp. 5-9" page="comma" />
          ):
        </p>
        <ul className="mt-3 max-w-[63ch] list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.75]">
          <li>to remove the Tall Building Overlay, 7-2, with Councilors Bowen and Scott Houseman opposed;</li>
          <li>to create a Cabot Street subdistrict, CC2, capped at 45 feet and four stories, 8-1;</li>
          <li>to lower the height limit in the residential district between Cabot and Rantoul streets from 55 to 40 feet, 7-2;</li>
          <li>and to price required affordable homes for households at 60% of the area median income instead of 80%, 9-0.</li>
        </ul>
        <p className={BODY}>
          The new Rantoul Street district that PlanBeverly described was not created then. In November 2024 the Council
          adopted MBTA Communities zoning, which state law requires: an overlay of about 98 acres near the Depot,
          including a mixed-use overlay on Rantoul Street from about Bow Street to Edwards Street, with no change to
          heights (<Cite source="city-mbta-communities" page="comma" />
          ).
        </p>
        <p className={BODY}>
          What has been proposed on Rantoul Street since is on the{" "}
          <Link href="/experiments/preview/beverly-development" className="rlink">
            development map
          </Link>
          , with the buildings on this page under &ldquo;Before 2021.&rdquo;
        </p>
      </section>

      <p className="mt-12 max-w-[63ch] text-[0.85rem] leading-snug text-ink-faint">
        A draft, checked November 9, 2026. Every fact links to where it comes from, and the page takes no position on
        how much Beverly should build or where. Building sources are on the map&apos;s list of buildings built before
        2021. Older Planning Board records, before 2020, sit on a city archive server whose security certificate had
        expired when we checked, so approval dates for the earlier buildings are not here yet.
      </p>
    </main>
  );
}
