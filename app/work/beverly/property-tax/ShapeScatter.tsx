"use client";

import { useMemo, useRef, useState } from "react";
import { useChartScale } from "@/lib/beverly/useChartScale";
import { type ShapeLabel, SHAPE_COLORS, SHAPE_DISPLAY } from "@/lib/beverly/taxData";

export type ScatterPoint = {
  name: string;
  county: string | null;
  shape: ShapeLabel;
  x: number;
  y: number;
};

const W = 360;
const H = 344;
const M = { top: 16, right: 14, bottom: 40, left: 48 };
const PX1 = W - M.right;
const PY0 = M.top;
const PY1 = H - M.bottom;

type Scale = "lin" | "log";

function niceTicks(min: number, max: number, n = 5): number[] {
  const span = max - min || 1;
  const step0 = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag;
  const step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(+v.toFixed(6));
  return out;
}
function logTicks(min: number, max: number): number[] {
  const out: number[] = [];
  const lo = Math.floor(Math.log10(min));
  const hi = Math.ceil(Math.log10(max));
  for (let e = lo; e <= hi; e++) for (const m of [1, 2, 5]) {
    const v = m * Math.pow(10, e);
    if (v >= min * 0.9 && v <= max * 1.1) out.push(v);
  }
  return out;
}

type Props = {
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  xFmt: (v: number) => string;
  yFmt: (v: number) => string;
  xScale?: Scale;
  yScale?: Scale;
  selected: string[];
  focused: string;
  onFocus: (name: string) => void;
  diagonal?: boolean; // y = x reference line (drift lens); forces a shared domain
  // Trim the axes to the 2nd-98th percentile. A handful of towns (Monterey's +152% income
  // growth, Chilmark's +98%) sit so far out that they squash everyone else into a corner.
  // Off-scale towns are pinned to the edge and marked, not dropped.
  robust?: boolean;
  reducedMotion: boolean;
};

export default function ShapeScatter({
  points,
  xLabel,
  yLabel,
  xFmt,
  yFmt,
  xScale = "lin",
  yScale = "lin",
  selected,
  focused,
  onFocus,
  diagonal = false,
  robust = false,
  reducedMotion,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Keeps SVG labels at a readable on-screen size when the chart is scaled down.
  const { u, fs } = useChartScale(svgRef, W);
  // Scaled-up tick labels need a wider gutter, or they walk into the rotated axis title.
  const PX0 = M.left + (u > 1 ? 12 : 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tip, setTip] = useState<{ left: number; top: number } | null>(null);

  const { X, Y, xTicks, yTicks, diag } = useMemo(() => {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const pct = (arr: number[], p: number) => {
      const a = [...arr].sort((q, r) => q - r);
      return a[Math.max(0, Math.min(a.length - 1, Math.round((a.length - 1) * p)))];
    };
    const ext = (arr: number[], scale: Scale): [number, number] => {
      const mn = robust ? pct(arr, 0.02) : Math.min(...arr);
      const mx = robust ? pct(arr, 0.98) : Math.max(...arr);
      if (scale === "log") {
        const pos = Math.min(...arr.filter((v) => v > 0));
        return [pos / 1.12, mx * 1.12];
      }
      const pad = (mx - mn) * 0.06 || Math.abs(mx) * 0.1 || 1;
      return [mn === 0 ? 0 : mn - pad, mx + pad];
    };
    let xd = ext(xs, xScale);
    let yd = ext(ys, yScale);
    if (diagonal) {
      // shared domain so the 45° reference line reads true
      const lo = Math.min(xd[0], yd[0]);
      const hi = Math.max(xd[1], yd[1]);
      xd = [lo, hi];
      yd = [lo, hi];
    }
    const mk = (scale: Scale, dom: [number, number], rng: [number, number]) =>
      scale === "log"
        ? (v: number) => {
            const a = Math.log10(dom[0]), b = Math.log10(dom[1]);
            return rng[0] + (Math.log10(Math.max(v, dom[0] * 0.5)) - a) / (b - a) * (rng[1] - rng[0]);
          }
        : (v: number) => rng[0] + (v - dom[0]) / (dom[1] - dom[0]) * (rng[1] - rng[0]);
    const X = mk(xScale, xd, [PX0, PX1]);
    const Y = mk(yScale, yd, [PY1, PY0]);
    // Labels scale up on narrow screens, so half as many ticks fit. Keeping every other one
    // from index 0 preserves the zero line, which the drift diagonal is read against.
    const thin = (t: number[]) => (PX0 > M.left && t.length > 5 ? t.filter((_, i) => i % 2 === 0) : t);
    const xTicks = thin(xScale === "log" ? logTicks(xd[0], xd[1]) : niceTicks(xd[0], xd[1], 5));
    const yTicks = thin(yScale === "log" ? logTicks(yd[0], yd[1]) : niceTicks(yd[0], yd[1], 5));
    let diag: { x1: number; y1: number; x2: number; y2: number } | null = null;
    if (diagonal) {
      const v0 = Math.max(xd[0], yd[0]), v1 = Math.min(xd[1], yd[1]);
      diag = { x1: X(v0), y1: Y(v0), x2: X(v1), y2: Y(v1) };
    }
    return { X, Y, xTicks, yTicks, diag };
  }, [points, xScale, yScale, diagonal, robust, PX0]);

  // Draw every town inside the plot even when its value falls outside a trimmed axis.
  const cx = (v: number) => Math.max(PX0, Math.min(PX1, X(v)));
  const cy = (v: number) => Math.max(PY0, Math.min(PY1, Y(v)));
  const offScale = (p: ScatterPoint) =>
    X(p.x) < PX0 - 0.5 || X(p.x) > PX1 + 0.5 || Y(p.y) < PY0 - 0.5 || Y(p.y) > PY1 + 0.5;
  const offCount = robust ? points.filter(offScale).length : 0;

  const dotTransition = reducedMotion ? "none" : "transform 0.5s cubic-bezier(0.4,0,0.2,1)";
  const selSet = new Set(selected);

  function handlePointer(clientX: number, clientY: number) {
    const svg = svgRef.current, wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPointReadOnly(clientX, clientY).matrixTransform(ctm.inverse());
    let best: { name: string; d2: number; cx: number; cy: number } | null = null;
    for (const pt of points) {
      const px = cx(pt.x), py = cy(pt.y);
      const d2 = (px - p.x) ** 2 + (py - p.y) ** 2;
      if (!best || d2 < best.d2) best = { name: pt.name, d2, cx: px, cy: py };
    }
    if (best && best.d2 <= 15 * 15) {
      setHovered(best.name);
      const rect = wrap.getBoundingClientRect();
      const scale = rect.width / W;
      setTip({ left: best.cx * scale, top: best.cy * scale });
    } else {
      setHovered(null);
      setTip(null);
    }
  }

  const hoveredPt = hovered ? points.find((p) => p.name === hovered) : null;

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ touchAction: "pan-y" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Scatter of Massachusetts municipalities: ${xLabel} on the horizontal axis, ${yLabel} on the vertical axis, colored by fiscal shape. See the table below for the underlying values.`}
        onPointerMove={(e) => handlePointer(e.clientX, e.clientY)}
        onPointerDown={(e) => handlePointer(e.clientX, e.clientY)}
        onPointerLeave={() => {
          setHovered(null);
          setTip(null);
        }}
      >
        <rect x={PX0} y={PY0} width={PX1 - PX0} height={PY1 - PY0} fill="none" stroke="var(--color-rule)" />

        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={PX0} x2={PX1} y1={Y(t)} y2={Y(t)} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={PX0 - 5} y={Y(t) + 3} textAnchor="end" fontSize={fs(8)} fill="var(--color-ink-faint)">
              {yFmt(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line x1={X(t)} x2={X(t)} y1={PY0} y2={PY1} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={X(t)} y={PY1 + 12} textAnchor="middle" fontSize={fs(8)} fill="var(--color-ink-faint)">
              {xFmt(t)}
            </text>
          </g>
        ))}

        <text x={(PX0 + PX1) / 2} y={H - 4} textAnchor="middle" fontSize={fs(9)} fill="var(--color-ink-mid)">
          {xLabel}
        </text>
        <text
          x={13}
          y={(PY0 + PY1) / 2}
          textAnchor="middle"
          fontSize={fs(9)}
          fill="var(--color-ink-mid)"
          transform={`rotate(-90 13 ${(PY0 + PY1) / 2})`}
        >
          {yLabel}
        </text>

        {diag && (
          <>
            <line x1={diag.x1} y1={diag.y1} x2={diag.x2} y2={diag.y2} stroke="var(--color-ink-faint)" strokeWidth={1.25} strokeDasharray="5 4" opacity={0.7} />
            <text x={PX0 + 6} y={PY0 + 11} fontSize={fs(7.5)} fontStyle="italic" fill="var(--color-ink-faint)">
              values outran incomes
            </text>
            <text x={PX1 - 4} y={PY1 - 6} textAnchor="end" fontSize={fs(7.5)} fontStyle="italic" fill="var(--color-ink-faint)">
              incomes kept pace
            </text>
          </>
        )}

        {/* dots: unselected first, then selected/focused on top */}
        {points.map((pt) => {
          const isSel = selSet.has(pt.name);
          const isFoc = pt.name === focused;
          if (isSel || isFoc) return null;
          return (
            <circle
              key={pt.name}
              r={3}
              cx={0}
              cy={0}
              fill={SHAPE_COLORS[pt.shape]}
              fillOpacity={0.5}
              stroke={robust && offScale(pt) ? "var(--color-ink)" : "none"}
              strokeWidth={robust && offScale(pt) ? 1 : 0}
              strokeDasharray={robust && offScale(pt) ? "1.5 1.5" : undefined}
              style={{ transform: `translate(${cx(pt.x)}px,${cy(pt.y)}px)`, transition: dotTransition, cursor: "pointer" }}
              onClick={() => onFocus(pt.name)}
            />
          );
        })}
        {points.map((pt) => {
          const isSel = selSet.has(pt.name);
          const isFoc = pt.name === focused;
          if (!isSel && !isFoc) return null;
          return (
            <circle
              key={`sel-${pt.name}`}
              r={isFoc ? 6 : 4.5}
              cx={0}
              cy={0}
              fill={SHAPE_COLORS[pt.shape]}
              stroke={isFoc ? "var(--color-ink)" : "var(--color-bg)"}
              strokeWidth={isFoc ? 1.5 : 1.25}
              style={{ transform: `translate(${cx(pt.x)}px,${cy(pt.y)}px)`, transition: dotTransition, cursor: "pointer" }}
              onClick={() => onFocus(pt.name)}
            />
          );
        })}

        {hoveredPt && <circle cx={cx(hoveredPt.x)} cy={cy(hoveredPt.y)} r={8} fill="none" stroke="var(--color-ink)" strokeWidth={1} />}
      </svg>

      {offCount > 0 && (
        <p className="mt-1.5 text-[0.6875rem] leading-snug text-ink-faint">
          {offCount === 1 ? "One town sits" : `${offCount} towns sit`} beyond this range and{" "}
          {offCount === 1 ? "is" : "are"} pinned to the edge, ringed in a dashed outline. Trimming the axes
          keeps the other {points.length - offCount} readable. Hover a pinned dot for its real numbers.
        </p>
      )}

      {hoveredPt && tip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-rule bg-bg-card px-3 py-2 text-xs shadow-sm"
          style={{
            left: tip.left,
            top: tip.top,
            transform: `translate(${tip.left > (wrapRef.current?.clientWidth ?? 0) / 2 ? "-108%" : "8%"}, -50%)`,
            minWidth: 150,
          }}
        >
          <div className="font-display font-semibold text-ink">
            {hoveredPt.name}
            {hoveredPt.county ? <span className="ml-1 font-sans font-normal text-ink-faint">· {hoveredPt.county}</span> : null}
          </div>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 tabular-nums">
            <dt className="text-ink-faint">{xLabel}</dt>
            <dd className="text-right text-ink">{xFmt(hoveredPt.x)}</dd>
            <dt className="text-ink-faint">{yLabel}</dt>
            <dd className="text-right text-ink">{yFmt(hoveredPt.y)}</dd>
          </dl>
          <div className="mt-1 flex items-center gap-1.5 text-[0.6875rem]">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: SHAPE_COLORS[hoveredPt.shape] }} />
            <span className="text-ink-mid">{SHAPE_DISPLAY[hoveredPt.shape]}</span>
          </div>
          {robust && offScale(hoveredPt) && (
            <div className="mt-1.5 border-t border-rule pt-1.5 text-[0.6875rem] leading-snug text-ink-faint">
              Beyond the chart&apos;s range, so the dot sits at the edge. The figures above are the real ones.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
