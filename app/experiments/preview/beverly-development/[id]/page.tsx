import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import zoningDistricts from "@/data/beverly/zoning-districts.json";
import { dayOf, pageLabels } from "@/lib/beverly/development.mjs";
import { digestCoverage, getSite, register, statusOf, type DevFact, type DevSite } from "@/lib/beverly/developmentRegister";
import { COPY } from "../copy";
import {
  Approvals,
  BODY,
  Cite,
  DraftBar,
  Facts,
  Figure,
  From,
  H2,
  H3,
  Notes,
  PlanReading,
  Recordings,
  SiteHeader,
  Sources,
  Timeline,
  sentence,
} from "../parts";

/**
 * One template for every site in data/beverly/development-register.json (docs/beverly/development-map.md,
 * "A site page"). Facts, approvals, figures, zoning, PlanBeverly, history and sources come from the register;
 * the written prose for a site, when it has any, comes from ../copy. A site with no copy renders from its data.
 */

// The status depends on today's date (the quiet rule and permit clocks), so pages rebuild daily.
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return register.sites.map((s) => ({ id: s.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = getSite((await params).id);
  if (!site) return {};
  const current = statusOf(site, dayOf()).current;
  return {
    title: `${site.name} (draft) — James Laurenti`,
    description: `${sentence(current.what)} Ward ${site.ward}, Beverly: the record, the rules and the sources.`,
    robots: { index: false, follow: false },
  };
}

/** A generated parcel map (scripts/beverly-development/site_maps.py), when one has been drawn. */
function siteMap(site: DevSite) {
  const src = `/beverly/development/maps/${site.id}.svg`;
  const file = path.join(process.cwd(), "public", src);
  if (!existsSync(file)) return null;
  const h = Number(readFileSync(file, "utf8").match(/height="(\d+)"/)?.[1] ?? 480);
  return { src, h };
}

const DISTRICTS = (zoningDistricts as { districts: Record<string, { name: string }> }).districts;

/** For a site with no written facts about its land, the basics from the city's parcel layer. */
function basicLandFacts(site: DevSite): DevFact[] {
  return [
    {
      label: site.parcels.length > 1 ? "Parcels" : "Parcel",
      value: `${site.parcels.join(", ")}${site.acres ? `, about ${site.acres} acres` : ""}`,
      source: "city-gis",
    },
    {
      label: "Zoning",
      value: site.zoning.map((z) => (DISTRICTS[z] ? `${z}, ${DISTRICTS[z].name}` : z)).join("; "),
      source: "city-gis",
    },
  ];
}

export default async function SitePage({ params }: Props) {
  const site = getSite((await params).id);
  if (!site) notFound();
  const status = statusOf(site, dayOf());
  const current = status.current;
  const copy = COPY[site.id]?.({ site, status });
  const L = { ...pageLabels(site, current), ...copy?.labels };
  const shared = current.section_sources ?? [];
  const figure = (section: "proposal" | "land") => site.figures?.filter((f) => f.section === section) ?? [];
  const map = siteMap(site);

  const showProposal = Boolean(copy || current.facts?.length || current.approvals?.length);
  const sections: [string, string][] = [
    ...(showProposal ? [["proposal", L.section] as [string, string]] : []),
    ["land", "The land"],
    ["history", L.history],
    ...(copy?.afterHistory ?? []).map((s) => [s.id, s.title] as [string, string]),
    ...(site.recordings?.length ? [["recordings", "Watch the meetings"] as [string, string]] : []),
    ["sources", "Sources"],
  ];

  const lead = copy?.lead ?? (
    <>
      {sentence(current.what)}
      {current.status_note && (
        <>
          {" "}
          <Cite source={current.status_note.source}>The city&apos;s project list</Cite>
          {` says: ${current.status_note.text.charAt(0).toLowerCase()}${current.status_note.text.slice(1)}.`}
        </>
      )}
    </>
  );

  return (
    <main className="mx-auto w-full max-w-[72rem] px-4 pb-24 pt-6 sm:px-6">
      <DraftBar back={{ href: "/experiments/preview/beverly-development", label: "Development map" }} />
      <SiteHeader site={site} status={status} sections={sections} lead={lead} />

      {showProposal && (
        <section aria-labelledby="proposal">
          <H2 id="proposal">{L.section}</H2>
          {copy?.from && <From>{copy.from}</From>}

          {current.facts && current.facts.length > 0 && (
            <>
              <H3>{L.shows}</H3>
              <Facts facts={current.facts} shared={shared} />
            </>
          )}
          {figure("proposal").map((f) => (
            <Figure key={f.src} src={f.src} alt={f.alt} w={f.w} h={f.h}>
              {f.caption} Tap to enlarge.
            </Figure>
          ))}

          {current.approvals && current.approvals.length > 0 && (
            <>
              <H3>{L.needs}</H3>
              {copy?.approvalsIntro && <p className={BODY}>{copy.approvalsIntro}</p>}
              <Approvals approvals={current.approvals} shared={shared} />
            </>
          )}
          {copy?.afterApprovals}

          {copy?.sections?.map((s) => (
            <div key={s.title}>
              <H3>{s.title}</H3>
              {s.body}
            </div>
          ))}

          {copy?.fits && (
            <>
              <H3>How it fits the rules</H3>
              {copy.fits}
            </>
          )}
        </section>
      )}

      <section aria-labelledby="land">
        <H2 id="land">The land</H2>
        {figure("land").length > 0
          ? figure("land").map((f) => (
              <Figure key={f.src} src={f.src} alt={f.alt} w={f.w} h={f.h}>
                {f.caption}
              </Figure>
            ))
          : map && (
              <Figure
                src={map.src}
                alt={`Map of ${site.name}: the site's parcel${site.parcels.length > 1 ? "s" : ""} shaded, with neighboring lots and streets. North is up.`}
                w={640}
                h={map.h}
              >
                The site, shaded, on the city&apos;s parcel map. North is up.
              </Figure>
            )}
        <Facts facts={site.facts?.length ? site.facts : basicLandFacts(site)} />
        {site.land_notes && <Notes notes={site.land_notes} />}

        {site.zoning_notes && site.zoning_notes.length > 0 && (
          <>
            <H3>What the zoning allows</H3>
            <Notes notes={site.zoning_notes} />
          </>
        )}
        {site.plan && (
          <>
            <H3>What PlanBeverly says about this area</H3>
            <PlanReading plan={site.plan} />
          </>
        )}
      </section>

      <section aria-labelledby="history">
        <H2 id="history">{L.history}</H2>
        <Timeline site={site} status={status} currentLabel={L.current} />
      </section>

      {copy?.afterHistory?.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <H2 id={s.id}>{s.title}</H2>
          {s.body}
        </section>
      ))}

      {site.recordings && site.recordings.length > 0 && (
        <section aria-labelledby="recordings">
          <H2 id="recordings">Watch the meetings</H2>
          <p className={BODY}>
            BevCam records the city&apos;s meetings. These are the ones where this site came up, oldest first. A time
            jumps to the moment in the recording.
          </p>
          <Recordings recordings={site.recordings} />
        </section>
      )}

      <Sources site={site} digest={digestCoverage(site)} />
    </main>
  );
}
