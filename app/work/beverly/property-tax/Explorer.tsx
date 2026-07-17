"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type TaxData,
  DATA_URL,
  HOME_TOWN,
  DEFAULT_COUNTY,
  TIER_ESSEX,
  TIER_REST,
  SELECT_COLORS,
} from "@/lib/beverly/taxData";
import QuadrantScatter from "./QuadrantScatter";
import YearScrubber from "./YearScrubber";
import TownSearch from "./TownSearch";
import TownDetail from "./TownDetail";
import PeerCohort from "./PeerCohort";
import LevyHeadroom from "./LevyHeadroom";
import TaxTable from "./TaxTable";

type View = "state" | "essex";

export default function Explorer() {
  const [data, setData] = useState<TaxData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(0);
  const [view, setView] = useState<View>("state");
  const [selected, setSelected] = useState<string[]>([HOME_TOWN]);
  const [focused, setFocused] = useState<string>(HOME_TOWN);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Keep the detail-panel focus valid as the selection changes.
  useEffect(() => {
    if (selected.length && !selected.includes(focused)) setFocused(selected[0]);
  }, [selected, focused]);

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: TaxData) => {
        setData(d);
        setYear(d.meta.fiscal_years[d.meta.fiscal_years.length - 1]);
      })
      .catch((e) => setError(String(e)));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const essexCount = useMemo(
    () => (data ? data.towns.filter((t) => t.county === DEFAULT_COUNTY).length : 0),
    [data]
  );

  if (error) {
    return (
      <div className="rounded-md border border-rule bg-bg-card p-6 text-sm text-ink-mid">
        Couldn’t load the data ({error}). Try refreshing.
      </div>
    );
  }
  if (!data || !year) {
    return <div className="h-[420px] animate-pulse rounded-md border border-rule bg-bg-card" aria-hidden />;
  }

  return (
    <div className="rounded-lg border border-rule bg-bg-card/40 p-4 sm:p-5">
      {/* view toggle */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-md border border-rule p-0.5 text-xs">
          {(["essex", "state"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded px-3 py-1 transition-colors ${
                view === v ? "bg-accent text-white" : "text-ink-mid hover:text-ink"
              }`}
            >
              {v === "essex" ? `Essex County (${essexCount})` : "Statewide (351)"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-ink-faint">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: TIER_ESSEX }} /> Essex
          </span>
          {view === "state" && (
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: TIER_REST }} /> Other MA
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" /> Selected
          </span>
        </div>
      </div>

      <QuadrantScatter data={data} year={year} view={view} selected={selected} reducedMotion={reducedMotion} />

      <p className="mt-1 text-center text-[11px] text-ink-faint">
        Dashed lines mark the statewide median for FY{year}. Drag the slider or press play to move through years.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1.1fr] sm:items-start">
        <YearScrubber years={data.meta.fiscal_years} value={year} onChange={setYear} />
        <TownSearch data={data} selected={selected} onChange={setSelected} />
      </div>

      <div className="mt-6 border-t border-rule pt-5">
        <TownDetail data={data} selected={selected} focused={focused} onFocus={setFocused} />
      </div>

      {(() => {
        const ft = data.towns.find((t) => t.name === focused) ?? data.towns.find((t) => t.name === selected[0]);
        if (!ft) return null;
        const color = SELECT_COLORS[Math.max(0, selected.indexOf(ft.name)) % SELECT_COLORS.length];
        return (
          <div className="mt-6 border-t border-rule pt-5">
            <h3 className="mb-1 font-display text-lg font-semibold text-ink">How {ft.name} compares</h3>
            <p className="mb-3 text-xs text-ink-faint">
              Where {ft.name} sits among similar towns — and which factor explains the gap.
            </p>
            <PeerCohort data={data} town={ft} year={year} color={color} />
          </div>
        );
      })()}

      {(() => {
        const ft = data.towns.find((t) => t.name === focused) ?? data.towns.find((t) => t.name === selected[0]);
        const hasLevy = ft?.series.some((s) => s.levy_ceiling != null);
        if (!ft || !hasLevy) return null;
        const color = SELECT_COLORS[Math.max(0, selected.indexOf(ft.name)) % SELECT_COLORS.length];
        return (
          <div className="mt-6 border-t border-rule pt-5">
            <h3 className="mb-1 font-display text-lg font-semibold text-ink">
              Levy headroom — Proposition 2½
            </h3>
            <p className="mb-3 text-xs text-ink-faint">
              Why {ft.name}’s rate sits far below the 2.5% ceiling — and why that gap can’t close a budget deficit.
            </p>
            <LevyHeadroom data={data} town={ft} year={year} color={color} />
          </div>
        );
      })()}

      <div className="mt-6 border-t border-rule pt-5">
        <h3 className="mb-1 font-display text-lg font-semibold text-ink">All towns</h3>
        <p className="mb-3 text-xs text-ink-faint">
          The same figures behind the chart, for the year on the slider. Sortable and searchable; this table is the
          text alternative to the scatter above.
        </p>
        <TaxTable data={data} year={year} selected={selected} />
      </div>
    </div>
  );
}
