"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";

export type MapSite = {
  id: string;
  name: string;
  ward: number;
  neighborhood: string | null;
  lat: number;
  lng: number;
  group: string;
  chip: string;
  stage: string;
  decided: string | null;
  last: string | null;
  active: boolean;
  homes: number | null;
  what: string;
  permit: { label: string; passed: boolean } | null;
};

/** A building finished before 2021: the "Before 2021" lens. No page of its own. */
export type MapEarlier = {
  id: string;
  name: string;
  address: string;
  ward: number;
  homes: number;
  year: number;
  yearBasis: string;
  who: string | null;
  affordable: string | null;
  note: string | null;
  /** An explainer that tells this building's story, if one does. */
  story: { href: string; label: string } | null;
  lat: number;
  lng: number;
  sources: { label: string; href: string }[];
};

/**
 * Map colors, one per group (docs/beverly/development-map.md). Checked with the dataviz palette validator:
 * each lens's colors stay apart for color-blind readers. Gray is the recessive "quiet" state and is also
 * drawn faded with a gray edge, so it never relies on color alone.
 */
export const COLOR: Record<string, string> = {
  "Talked about": "#b8923a",
  "Under review": "#9c4a24",
  Approved: "#2d6a4f",
  Built: "#5b6ea8",
  Waiting: "#c47f5a",
  "Quiet or ended": "#b9b1a5",
};

const HINT: Record<string, string> = {
  "Talked about": "On the record, nothing filed",
  "Under review": "Filed, hearings under way",
  Approved: "Decided; may be under construction",
  Built: "Finished since 2021",
  Waiting: "Not decided, and no public step in the last 90 days",
  "Quiet or ended": "Withdrawn, denied, lapsed or silent a year",
};

const PRE_DECISION = ["Talked about", "Under review"];

/**
 * The three lenses. Each one picks its sites and the groups its key offers:
 * - Active lately: what is moving now (talked about, under review, approved, with a public step in the window).
 * - Since 2021: the longer view. Approved and built projects, and undecided ones with no public step in the active window.
 * - Before 2021: buildings finished 2005 to 2020, for context. No key.
 */
type Lens = "active" | "since" | "before";

function lensGroup(s: MapSite, lens: Lens): string | null {
  if (lens === "active") return s.active && (PRE_DECISION.includes(s.group) || s.group === "Approved") ? s.group : null;
  if (lens === "since") {
    if (PRE_DECISION.includes(s.group)) return s.active ? null : "Waiting";
    return s.group;
  }
  return null;
}

const LENS_GROUPS: Record<Lens, string[]> = {
  active: ["Talked about", "Under review", "Approved"],
  since: ["Approved", "Built", "Waiting", "Quiet or ended"],
  before: [],
};

const MapInner = dynamic(() => import("./DevMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-bg-card text-[0.875rem] text-ink-faint">
      Loading the map…
    </div>
  ),
});

export default function DevMap({
  sites,
  earlier,
  activeWindow,
}: {
  sites: MapSite[];
  earlier: MapEarlier[];
  activeWindow: number;
}) {
  const [lens, setLens] = useState<Lens>("active");
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());

  // Each site carries the group it shows under in this lens, so the key, the map and the list agree.
  const inLens = useMemo(
    () =>
      lens === "before"
        ? []
        : sites.flatMap((s) => {
            const g = lensGroup(s, lens);
            return g ? [{ ...s, group: g }] : [];
          }),
    [sites, lens],
  );
  const shown = useMemo(() => inLens.filter((s) => !hidden.has(s.group)), [inLens, hidden]);
  const count = (g: string) => inLens.filter((s) => s.group === g).length;
  const lensCount = (l: Lens) => (l === "before" ? earlier.length : sites.filter((s) => lensGroup(s, l)).length);
  const groups = LENS_GROUPS[lens].map((name) => ({ name, color: COLOR[name], hint: HINT[name] }));

  const pick = (l: Lens) => {
    setLens(l);
    setHidden(new Set());
  };
  const toggle = (g: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });

  // The count leads the lens's one-line description, not its button, so "2021" and a number never sit side by side.
  const n = lensCount(lens);
  const about: Record<Lens, string> = {
    active: `${n} ${n === 1 ? "site" : "sites"}: proposals and approved projects in the last ${activeWindow} days.`,
    since: `${n} ${n === 1 ? "site" : "sites"}: approved and finished projects since 2021, and proposals still waiting on a decision with no public step in the last ${activeWindow} days.`,
    before: `${n} buildings and subdivisions finished from 2005 through 2020 (10 or more homes each).`,
  };

  return (
    <section aria-label="Map of development sites" className="mt-8">
      <div role="group" aria-label="Which sites" className="inline-flex flex-wrap rounded-full border border-rule p-0.5 text-[0.85rem]">
        {(
          [
            ["active", "Active lately"],
            ["since", "Since 2021"],
            ["before", "Before 2021"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={lens === key}
            onClick={() => pick(key)}
            className={`rounded-full px-3 py-1 font-semibold transition-colors ${lens === key ? "bg-accent text-white" : "text-ink-mid hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 max-w-[63ch] text-[0.85rem] text-ink-faint">{about[lens]}</p>

      {groups.length > 0 && (
        <ul aria-label="Map key: tap to show or hide" className="mt-4 flex flex-wrap gap-2">
          {groups.map((g) => {
            const off = hidden.has(g.name);
            return (
              <li key={g.name}>
                <button
                  type="button"
                  aria-pressed={!off}
                  onClick={() => toggle(g.name)}
                  title={g.hint}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[0.82rem] transition-opacity ${off ? "border-rule opacity-50" : "border-ink-faint/40"}`}
                >
                  <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: g.color }} />
                  {g.name}
                  <span className="text-ink-faint">{count(g.name)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p className="mt-4 max-w-[63ch] text-[0.9rem] text-ink-mid">
        <strong className="font-semibold text-ink">How to use it:</strong>{" "}
        {lens === "before" ? "tap a circle for a summary and its sources." : "tap a circle for a summary and a link to its page."}{" "}
        Bigger circles mean more homes.{groups.length > 0 ? " Tap a key item to hide or show that group." : ""}
      </p>
      <div className="mt-3 h-[62vh] min-h-[360px] w-full overflow-hidden rounded-lg border border-rule sm:h-[70vh]">
        <MapInner sites={shown} colors={COLOR} earlier={lens === "before" ? earlier : []} />
      </div>

      {lens === "before" ? <EarlierList earlier={earlier} /> : <SiteList sites={shown} groups={groups} lens={lens} />}
    </section>
  );
}

/** The pre-2021 buildings as a list, oldest first. They have no pages; an explainer tells some of their story. */
function EarlierList({ earlier }: { earlier: MapEarlier[] }) {
  const list = [...earlier].sort((a, b) => a.year - b.year || a.name.localeCompare(b.name));
  const stories = [...new Map(earlier.flatMap((b) => (b.story ? [[b.story.href, b.story] as const] : []))).values()];
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-bold tracking-tight">Before 2021, as a list</h2>
      <p className="mt-2 max-w-[63ch] text-[0.95rem] text-ink-mid">
        These come before the map&apos;s scope begins, so they have no pages of their own. The year is when a source
        says the building opened, or else the assessor&apos;s year built.
        {stories.map((s) => (
          <span key={s.href}>
            {" "}
            <Link href={s.href} className="rlink">
              {s.label}
            </Link>{" "}
            tells part of their story.
          </span>
        ))}
      </p>
      <ul className="mt-4 divide-y divide-rule border-y border-rule">
        {list.map((b) => (
          <li key={b.id} className="py-3">
            <span className="font-semibold">{b.name}</span>
            <span className="ml-2 text-[0.85rem] text-ink-faint">
              {b.address} · Ward {b.ward}
            </span>
            <p className="mt-0.5 text-[0.95rem] text-ink-mid">
              {b.homes} homes · {b.year}
              {b.yearBasis === "assessor" ? " (assessor's year built)" : ` (${b.yearBasis})`}
              {b.who ? ` · ${b.who}` : ""}
              {b.affordable ? ` · Affordable: ${b.affordable}` : ""}
            </p>
            {b.note && <p className="mt-0.5 text-[0.85rem] text-ink-faint">{b.note}</p>}
            <p className="mt-0.5 text-[0.82rem] text-ink-faint">
              {b.sources.map((s, i) => (
                <span key={s.href}>
                  {i > 0 && " · "}
                  <a href={s.href} target="_blank" rel="noopener" className="rlink">
                    {s.label}
                  </a>
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The same sites as the map, as a list: readable without the map, and by screen readers. */
function SiteList({ sites, groups, lens }: { sites: MapSite[]; groups: { name: string; color: string }[]; lens: Lens }) {
  return (
    <div className="mt-12">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        {lens === "active" ? "Active lately" : "Since 2021"}, as a list
      </h2>
      {sites.length === 0 && <p className="mt-4 text-ink-mid">No sites match. Turn a group back on in the key.</p>}
      {groups.map((g) => {
        const list = sites.filter((s) => s.group === g.name).sort((a, b) => a.ward - b.ward || a.name.localeCompare(b.name));
        if (!list.length) return null;
        return (
          <div key={g.name} className="mt-8">
            <h3 className="flex items-center gap-2 text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink-mid">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
              {g.name}
            </h3>
            <ul className="mt-2 divide-y divide-rule border-y border-rule">
              {list.map((s) => (
                <li key={s.id} className="py-3">
                  <Link href={`/experiments/preview/beverly-development/${s.id}`} className="rlink font-semibold">
                    {s.name}
                  </Link>
                  <span className="ml-2 text-[0.85rem] text-ink-faint">
                    Ward {s.ward}
                    {s.neighborhood ? ` · ${s.neighborhood}` : ""}
                  </span>
                  <p className="mt-0.5 max-w-[63ch] text-[0.95rem] leading-relaxed text-ink-mid">{s.what}</p>
                  <p className="mt-0.5 text-[0.82rem] text-ink-faint">
                    {s.group === "Waiting" ? `${s.stage} · ` : s.chip !== s.group ? `${s.chip} · ` : ""}
                    {s.decided ? `Decided ${s.decided}` : "Not decided"}
                    {s.last ? ` · Last heard ${s.last}` : ""}
                    {s.permit?.passed ? ` · Permit extension ran to ${s.permit.label}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
