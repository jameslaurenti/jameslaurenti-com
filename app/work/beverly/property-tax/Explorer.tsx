"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type TaxData,
  type TownShapeData,
  DATA_URL,
  SHAPE_DATA_URL,
  HOME_TOWN,
  DEFAULT_COUNTY,
  MAX_SELECTED,
  TIER_ESSEX,
  TIER_REST,
  SELECT_COLORS,
} from "@/lib/beverly/taxData";
import QuadrantScatter from "./QuadrantScatter";
import YearScrubber from "./YearScrubber";
import TownSearch from "./TownSearch";
import TownDetail from "./TownDetail";
import PeerCohort from "./PeerCohort";
import TaxTable from "./TaxTable";
import ShapeLens from "./ShapeLens";
import DriftLens from "./DriftLens";

type View = "state" | "essex";

const SECTIONS: { id: string; label: string }[] = [
  { id: "bill", label: "Your bill" },
  { id: "shape", label: "Town's shape" },
  { id: "drift", label: "Drift" },
];

// One independent town selection per section, so searching in Town's shape or
// Drift doesn't disturb Your bill (and vice versa). Each keeps a small list of
// selected towns plus the one currently in focus.
function useTownSelection() {
  const [selected, setSelected] = useState<string[]>([HOME_TOWN]);
  const [focused, setFocused] = useState<string>(HOME_TOWN);
  useEffect(() => {
    if (selected.length && !selected.includes(focused)) setFocused(selected[0]);
  }, [selected, focused]);
  // Focusing a town from a scatter also selects it (capped), so it survives the effect above.
  const focusTown = useCallback((name: string) => {
    setFocused(name);
    setSelected((prev) => (prev.includes(name) ? prev : [...prev, name].slice(-MAX_SELECTED)));
  }, []);
  return { selected, focused, setSelected, setFocused, focusTown };
}

function SectionHeading({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-1 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-faint">{desc}</p>
    </div>
  );
}

export default function Explorer() {
  const [data, setData] = useState<TaxData | null>(null);
  const [shapeData, setShapeData] = useState<TownShapeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState<number>(0);
  const [view, setView] = useState<View>("state");
  const [reducedMotion, setReducedMotion] = useState(false);

  // Independent selection per section.
  const bill = useTownSelection();
  const shape = useTownSelection();
  const drift = useTownSelection();

  const scrollTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    },
    [reducedMotion]
  );

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
    fetch(SHAPE_DATA_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: TownShapeData | null) => setShapeData(d))
      .catch(() => setShapeData(null));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Deep link: /property-tax?lens=shape|drift|bill scrolls to that section on load
  // (the views are stacked now, not toggled).
  useEffect(() => {
    if (!data) return;
    const p = new URLSearchParams(window.location.search).get("lens");
    if (p !== "shape" && p !== "drift" && p !== "bill") return;
    const raf = window.requestAnimationFrame(() => {
      document.getElementById(p)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [data]);

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

  const loadingLens = <div className="h-[360px] animate-pulse rounded-md border border-rule bg-bg-card" aria-hidden />;
  const ft = data.towns.find((t) => t.name === bill.focused) ?? data.towns.find((t) => t.name === bill.selected[0]);
  const ftColor = ft ? SELECT_COLORS[Math.max(0, bill.selected.indexOf(ft.name)) % SELECT_COLORS.length] : SELECT_COLORS[0];

  return (
    <div className="rounded-lg border border-rule bg-bg-card/40 p-4 sm:p-5">
      {/* jump nav — the three views are all on the page; this scrolls between them */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs" aria-label="Jump to a view">
        <span className="mr-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">Jump to</span>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => scrollTo(s.id)}
            className="rounded-md border border-rule px-3 py-1 text-ink-mid transition-colors hover:border-accent hover:text-accent"
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* ---- YOUR BILL ---- */}
      <section id="bill" className="scroll-mt-24">
        <SectionHeading
          title="Your bill"
          desc="The rate, the average bill, and how hard that bill lands on local incomes, across the decade and against similar towns. The year slider below controls this section."
        />
        <div className="mb-4">
          <TownSearch data={data} selected={bill.selected} onChange={bill.setSelected} />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-md border border-rule p-0.5 text-xs">
            {(["essex", "state"] as View[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`rounded px-3 py-1 transition-colors ${view === v ? "bg-accent text-white" : "text-ink-mid hover:text-ink"}`}
              >
                {v === "essex" ? `Essex County (${essexCount})` : "Statewide (351)"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[0.6875rem] text-ink-faint">
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

        <QuadrantScatter data={data} year={year} view={view} selected={bill.selected} reducedMotion={reducedMotion} />

        <p className="mt-1 text-center text-[0.6875rem] text-ink-faint">
          Dashed lines mark the statewide median for FY{year}. Drag the slider or press play to move through years.
        </p>

        <div className="mt-4">
          <YearScrubber years={data.meta.fiscal_years} value={year} onChange={setYear} />
        </div>

        {/* Year-dependent: sits with the year-scrubbed chart above. */}
        {ft && (
          <div className="mt-6 border-t border-rule pt-5">
            <h3 className="mb-1 font-display text-lg font-semibold text-ink">How {ft.name} compares</h3>
            <p className="mb-3 text-xs text-ink-faint">
              Where {ft.name} sits among similar towns in FY{year}, and which factor explains the gap.
            </p>
            <PeerCohort data={data} town={ft} year={year} color={ftColor} />
          </div>
        )}

        {/* Decade view: does not change with the year slider. */}
        <div className="mt-6 border-t border-rule pt-5">
          <TownDetail data={data} selected={bill.selected} focused={bill.focused} onFocus={bill.setFocused} />
        </div>
      </section>

      {/* ---- TOWN'S SHAPE ---- */}
      <section id="shape" className="mt-10 scroll-mt-24 border-t border-rule pt-8">
        <SectionHeading
          title="Town's shape"
          desc="How each town funds itself, by growing its base, voting past the cap, or leaning on state aid, and which towns share its shape. A decade-level view; it does not use the year slider."
        />
        <div className="mb-4">
          <TownSearch data={data} selected={shape.selected} onChange={shape.setSelected} />
        </div>
        {shapeData ? (
          <ShapeLens shapeData={shapeData} selected={shape.selected} focused={shape.focused} onFocus={shape.focusTown} reducedMotion={reducedMotion} />
        ) : (
          loadingLens
        )}
      </section>

      {/* ---- DRIFT ---- */}
      <section id="drift" className="mt-10 scroll-mt-24 border-t border-rule pt-8">
        <SectionHeading
          title="Drift"
          desc="Whether a town's property values have outrun its residents' incomes over the last decade, with inflation stripped out."
        />
        <div className="mb-4">
          <TownSearch data={data} selected={drift.selected} onChange={drift.setSelected} />
        </div>
        {shapeData ? (
          <DriftLens shapeData={shapeData} selected={drift.selected} focused={drift.focused} onFocus={drift.focusTown} reducedMotion={reducedMotion} />
        ) : (
          loadingLens
        )}
      </section>

      {/* ---- ALL TOWNS (data appendix) ---- */}
      <section className="mt-10 border-t border-rule pt-8">
        <h2 className="mb-1 font-display text-xl font-semibold text-ink">All towns</h2>
        <p className="mb-3 max-w-[60ch] text-[0.8125rem] leading-relaxed text-ink-faint">
          The figures behind the Your bill chart, for the fiscal year set on that slider. Sortable and searchable, and the
          text alternative to the scatter. Highlights follow the Your bill selection.
        </p>
        <TaxTable data={data} year={year} selected={bill.selected} />
      </section>
    </div>
  );
}
