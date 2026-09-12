"use client";

import { useMemo } from "react";
import { type TownShapeData, type TownDrift, driftVerdict } from "@/lib/beverly/taxData";
import ShapeScatter, { type ScatterPoint } from "./ShapeScatter";

const signPct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(0)}%`;
// shared -40%..+110% bar scale so a real decline reads as a decline; zero sits at 26.67%
const dscale = (v: number) => Math.min(Math.max((v + 40) / 1.5, 0), 100);
const ZERO = dscale(0);

function DriftBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[0.8125rem] font-medium text-ink">{label}</span>
        <span className="text-[0.75rem] font-semibold tabular-nums text-ink">{signPct(value)}</span>
      </div>
      {/* The bar runs from the zero line, not from the left edge, so its length is the real
          change and its direction is the sign. Filling from the edge made a town with no
          growth look like it had a quarter of a bar's worth. */}
      <div className="relative mt-1 h-2.5 rounded-sm border border-rule bg-bg">
        <div
          className="absolute inset-y-0 rounded-sm"
          style={{
            left: `${Math.min(dscale(value), ZERO)}%`,
            width: `${Math.max(Math.abs(dscale(value) - ZERO), 0.6)}%`,
            background: color,
          }}
        />
        {/* Drawn after the fill and in full-strength ink: as a faint tick it disappeared
            under the bar, which is the only place it matters. */}
        <span className="absolute inset-y-[-3px] w-px bg-ink" style={{ left: `${ZERO}%` }} />
      </div>
    </div>
  );
}

export default function DriftLens({
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
  const points: ScatterPoint[] = useMemo(
    () =>
      Object.entries(shapeData.towns)
        .filter(([, s]) => s.drift != null)
        .map(([name, s]) => ({
          name,
          county: null,
          shape: s.shape,
          x: (s.drift as TownDrift).incRealG_12_22,
          y: (s.drift as TownDrift).valRealG_12_22,
        })),
    [shapeData]
  );

  const fd = shapeData.towns[focused]?.drift ?? null;
  const verdict = fd ? driftVerdict(fd) : null;

  return (
    <div>
      <ShapeScatter
        points={points}
        xLabel="Real income growth, 2012–22"
        yLabel="Real value growth, 2012–22"
        xFmt={signPct}
        yFmt={signPct}
        selected={selected}
        focused={focused}
        onFocus={onFocus}
        diagonal
        robust
        reducedMotion={reducedMotion}
      />
      <p className="mt-1 text-center text-[0.6875rem] text-ink-faint">
        Real growth since 2012, inflation removed. Above the dashed line, values outran residents&apos; incomes.
      </p>

      <div className="mt-5 border-t border-rule pt-5">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">{focused}</h3>
        {fd && verdict ? (
          <>
            <div className="flex flex-col gap-3">
              <DriftBar label="Real property-value growth" value={fd.valRealG_12_22} color="var(--color-ink-faint)" />
              <DriftBar label="Real income growth" value={fd.incRealG_12_22} color="var(--color-accent)" />
            </div>
            <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-faint">
              Bars run from the vertical line, which is zero. To its right, growth beat inflation. To its left, it
              fell behind. Both bars cover 2012 to 2022, the years the chart above plots. Property values kept
              moving after that: measured through 2024 instead, the real change is {signPct(fd.valRealG_12_24)}.
            </p>
            <p className="mt-3 rounded-md bg-bg-card p-3 text-[0.8125rem] leading-relaxed text-ink">
              {verdict.headline} {verdict.detail}
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-mid">
            No value-and-income trend for {focused}: the Census median-income estimate is suppressed for very small places.
          </p>
        )}
      </div>
    </div>
  );
}
