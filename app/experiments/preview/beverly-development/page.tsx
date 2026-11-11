import type { Metadata } from "next";
import { dayOf, parseDate } from "@/lib/beverly/development.mjs";
import { register, resolveSource, statusOf } from "@/lib/beverly/developmentRegister";
import DevMap, { type MapEarlier, type MapSite } from "./DevMap";
import { DraftBar, PreviewNote } from "./parts";

/**
 * The development map: every site in data/beverly/development-register.json, colored by where it stands,
 * opening on what has been active lately, with each site's page one click away. Replaces the beta map at
 * /beverly/development-map once it moves out of /experiments. Spec: docs/beverly/development-map.md.
 */

export const metadata: Metadata = {
  title: "Development in Beverly (draft) — James Laurenti",
  description:
    "A map of every development proposal, approval and recent project on the city's record, with each site's history and sources one click away.",
  robots: { index: false, follow: false },
};

// Statuses depend on today's date (the quiet rule, the active window), so the map rebuilds daily.
export const revalidate = 86400;

/** Explainers a pre-2021 building can point to. */
const STORIES: Record<string, { href: string; label: string }> = {
  "rantoul-street": { href: "/experiments/preview/beverly-development/rantoul-street", label: "How Rantoul Street changed" },
};

export default function DevelopmentMapPage() {
  const today = dayOf();
  const sites: MapSite[] = register.sites.map((s) => {
    const st = statusOf(s, today);
    return {
      id: s.id,
      name: s.name,
      ward: s.ward,
      neighborhood: s.neighborhood,
      lat: s.location.lat,
      lng: s.location.lng,
      group: st.group,
      chip: st.note || st.group,
      stage: st.stageLabel,
      decided: st.decided?.label ?? null,
      last: st.last?.label ?? null,
      active: st.active,
      homes: st.current.homes,
      what: st.current.what,
      permit: st.permit ? { label: st.permit.date.label, passed: st.permit.passed } : null,
    };
  });
  const activeWindow = register.rules.active_window_days;
  const earlier: MapEarlier[] = (register.earlier?.buildings ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    address: b.address,
    ward: b.ward,
    homes: b.homes,
    year: b.year,
    yearBasis: b.year_basis,
    who: b.who ?? null,
    affordable: b.affordable ?? null,
    note: b.note ?? null,
    story: b.story ? (STORIES[b.story] ?? null) : null,
    lat: b.location.lat,
    lng: b.location.lng,
    sources: b.sources.flatMap((ref) => {
      const r = resolveSource(ref);
      return r ? [{ label: r.short, href: r.href }] : [];
    }),
  }));

  return (
    <main className="mx-auto w-full max-w-[72rem] px-4 pb-24 pt-6 sm:px-6">
      <DraftBar />
      <PreviewNote />
      <header className="mt-8">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">Development</p>
        <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Development in Beverly
        </h1>
        <p className="mt-5 max-w-[63ch] text-[1.15rem] leading-[1.65]">
          Proposals, approvals and recent projects on the city&apos;s record, each with its history and sources. The
          map opens on what is moving now: proposals and approved projects with a public step in the last{" "}
          {activeWindow} days, or one scheduled. Since 2021 shows what was approved and built, and proposals that have
          gone still. Before 2021 shows the larger buildings that came earlier.
        </p>
      </header>
      <DevMap sites={sites} earlier={earlier} activeWindow={activeWindow} />
      <p className="mt-12 max-w-[63ch] text-[0.85rem] leading-snug text-ink-faint">
        Checked against the city&apos;s records {parseDate(register.updated)?.label}. A draft. Sites are new homes or buildings that need
        Planning Board or ZBA approval, public land changing hands, and projects finished since January 2021. A
        proposal that hasn&apos;t been decided turns gray after 12 months with no public activity.
      </p>
    </main>
  );
}
