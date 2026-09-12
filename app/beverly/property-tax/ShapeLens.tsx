"use client";

import { useMemo, useState } from "react";
import { type TownShapeData, type TownShape, SHAPE_ORDER, SHAPE_COLORS, SHAPE_DISPLAY } from "@/lib/beverly/taxData";
import ShapeScatter, { type ScatterPoint } from "./ShapeScatter";
import FingerprintPanel from "./FingerprintPanel";

type AxisKey = "wealth" | "aid" | "develop" | "override";

const AXES: Record<AxisKey, { label: string; short: string; scale: "lin" | "log"; get: (s: TownShape) => number; fmt: (v: number) => string }> = {
  wealth: {
    label: "Property value per resident",
    short: "Property value",
    scale: "log",
    get: (s) => s.levers.wealth.eqvPerCapita,
    fmt: (v) => `$${v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 0 : 1) + "M" : Math.round(v / 1e3) + "k"}`,
  },
  aid: {
    label: "State aid, share of revenue",
    short: "State aid",
    scale: "lin",
    get: (s) => s.levers.aid.stateShareOfRevenue,
    fmt: (v) => `${v.toFixed(0)}%`,
  },
  develop: {
    label: "New growth, % of levy per year",
    short: "New growth",
    scale: "lin",
    get: (s) => s.levers.develop.newGrowthPctOfLevy,
    fmt: (v) => `${v.toFixed(1)}%`,
  },
  override: {
    label: "Operating overrides passed",
    short: "Overrides",
    scale: "lin",
    get: (s) => s.levers.override.operatingOverridesPassed,
    fmt: (v) => `${Math.round(v)}`,
  },
};

export default function ShapeLens({
  shapeData,
  selected,
  focused,
  onFocus,
  reducedMotion,
}: {
  shapeData: TownShapeData;
  selected: string[];
  focused: string;
  onFocus: (n: string) => void;
  reducedMotion: boolean;
}) {
  const [xKey, setXKey] = useState<AxisKey>("wealth");
  const [yKey, setYKey] = useState<AxisKey>("aid");

  const points: ScatterPoint[] = useMemo(() => {
    const xa = AXES[xKey], ya = AXES[yKey];
    return Object.entries(shapeData.towns).map(([name, s]) => ({
      name,
      county: null,
      shape: s.shape,
      x: xa.get(s),
      y: ya.get(s),
    }));
  }, [shapeData, xKey, yKey]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const s of Object.values(shapeData.towns)) c[s.shape] = (c[s.shape] ?? 0) + 1;
    return c;
  }, [shapeData]);

  const focusedShape = shapeData.towns[focused];

  return (
    <div>
      {/* axis controls */}
      <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-3">
        <AxisSelect label="Horizontal" value={xKey} onChange={setXKey} />
        <AxisSelect label="Vertical" value={yKey} onChange={setYKey} />
      </div>

      {/* legend */}
      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.6875rem] text-ink-mid">
        {SHAPE_ORDER.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: SHAPE_COLORS[s] }} />
            {SHAPE_DISPLAY[s]} <span className="tabular-nums text-ink-faint">{counts[s] ?? 0}</span>
          </span>
        ))}
      </div>

      <ShapeScatter
        points={points}
        xLabel={AXES[xKey].label}
        yLabel={AXES[yKey].label}
        xFmt={AXES[xKey].fmt}
        yFmt={AXES[yKey].fmt}
        xScale={AXES[xKey].scale}
        yScale={AXES[yKey].scale}
        selected={selected}
        focused={focused}
        onFocus={onFocus}
        reducedMotion={reducedMotion}
      />
      <p className="mt-1 text-center text-[0.6875rem] text-ink-faint">
        Each dot is one municipality, colored by its fiscal shape. Tap a dot to see its fingerprint.
      </p>

      <div className="mt-5 border-t border-rule pt-5">
        {focusedShape ? (
          <FingerprintPanel name={focused} county={null} town={focusedShape} onFocus={onFocus} />
        ) : (
          <p className="text-sm text-ink-mid">No fiscal-shape data for {focused} (a few very small towns are excluded).</p>
        )}
      </div>
    </div>
  );
}

function AxisSelect({ label, value, onChange }: { label: string; value: AxisKey; onChange: (v: AxisKey) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">{label} axis</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AxisKey)}
        className="rounded-md border border-rule bg-bg-card px-2.5 py-1.5 text-[0.8125rem] text-ink"
      >
        {(Object.keys(AXES) as AxisKey[]).map((k) => (
          <option key={k} value={k}>
            {AXES[k].short}
          </option>
        ))}
      </select>
    </label>
  );
}
