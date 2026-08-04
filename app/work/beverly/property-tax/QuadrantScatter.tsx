"use client";

import { useMemo, useRef, useState } from "react";
import { useChartScale } from "@/lib/beverly/useChartScale";
import {
  type TaxData,
  type Town,
  DEFAULT_COUNTY,
  SELECT_COLORS,
  TIER_ESSEX,
  TIER_REST,
  normEff,
  normBurden,
  yearRecord,
  stateMedian,
  fmtPct,
  fmtUSD,
  fmtRate,
} from "@/lib/beverly/taxData";

// SVG geometry (viewBox units). Rendered responsively at width:100%.
const W = 360;
const H = 360;
const M = { top: 20, right: 14, bottom: 40, left: 44 };
const PX0 = M.left;
const PX1 = W - M.right;
const PY0 = M.top;
const PY1 = H - M.bottom;

const px = (t: number) => PX0 + t * (PX1 - PX0);
const py = (t: number) => PY1 - t * (PY1 - PY0);

const X_TICKS = [0.005, 0.01, 0.015, 0.02, 0.025];
const Y_TICKS = [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14];

type Props = {
  data: TaxData;
  year: number;
  view: "state" | "essex";
  selected: string[]; // town names, in selection order (index -> color)
  reducedMotion: boolean;
};

type Pt = { x: number; y: number };

function townXY(town: Town, fy: number): Pt | null {
  const r = yearRecord(town, fy);
  if (!r || r.effective_rate == null || r.burden == null) return null;
  return { x: px(normEff(r.effective_rate)), y: py(normBurden(r.burden)) };
}

export default function QuadrantScatter({ data, year, view, selected, reducedMotion }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  // Keeps SVG labels at a readable on-screen size when the chart is scaled down.
  const { fs } = useChartScale(svgRef, W);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tip, setTip] = useState<{ left: number; top: number } | null>(null);

  const selectColor = (name: string) => SELECT_COLORS[selected.indexOf(name) % SELECT_COLORS.length];

  // Partition towns into draw tiers for the current view.
  const { rest, essex } = useMemo(() => {
    const rest: Town[] = [];
    const essex: Town[] = [];
    for (const t of data.towns) {
      if (selected.includes(t.name)) continue;
      if (t.county === DEFAULT_COUNTY) essex.push(t);
      else if (view === "state") rest.push(t);
    }
    return { rest, essex };
  }, [data, selected, view]);

  const selectedTowns = useMemo(
    () => selected.map((n) => data.towns.find((t) => t.name === n)).filter(Boolean) as Town[],
    [selected, data]
  );

  const median = stateMedian(data, year);
  const medX = median?.effective_rate != null ? px(normEff(median.effective_rate)) : null;
  const medY = median?.burden != null ? py(normBurden(median.burden)) : null;

  const dotTransition = reducedMotion ? "none" : "transform 0.55s cubic-bezier(0.4,0,0.2,1)";

  // Pointer -> nearest visible dot (for hover/tap tooltips).
  function handlePointer(clientX: number, clientY: number) {
    const svg = svgRef.current;
    const wrap = wrapRef.current;
    if (!svg || !wrap) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPointReadOnly(clientX, clientY).matrixTransform(ctm.inverse());

    const candidates = [...selectedTowns, ...essex, ...(view === "state" ? rest : [])];
    let best: { name: string; d2: number; pt: Pt } | null = null;
    for (const t of candidates) {
      const xy = townXY(t, year);
      if (!xy) continue;
      const d2 = (xy.x - p.x) ** 2 + (xy.y - p.y) ** 2;
      if (!best || d2 < best.d2) best = { name: t.name, d2, pt: xy };
    }
    if (best && best.d2 <= 16 * 16) {
      setHovered(best.name);
      const wrapRect = wrap.getBoundingClientRect();
      const scale = wrapRect.width / W;
      setTip({ left: best.pt.x * scale, top: best.pt.y * scale });
    } else {
      setHovered(null);
      setTip(null);
    }
  }

  const hoveredTown = hovered ? data.towns.find((t) => t.name === hovered) : null;
  const hoveredRec = hoveredTown ? yearRecord(hoveredTown, year) : null;

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ touchAction: "pan-y" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Quadrant scatter of Massachusetts municipalities for fiscal year ${year}: effective tax rate on the horizontal axis, tax burden on the vertical axis. See the table below for the underlying values.`}
        onPointerMove={(e) => handlePointer(e.clientX, e.clientY)}
        onPointerDown={(e) => handlePointer(e.clientX, e.clientY)}
        onPointerLeave={() => {
          setHovered(null);
          setTip(null);
        }}
      >
        {/* axis frame */}
        <rect x={PX0} y={PY0} width={PX1 - PX0} height={PY1 - PY0} fill="none" stroke="var(--color-rule)" />

        {/* gridlines + tick labels */}
        {X_TICKS.map((t) => (
          <g key={`x${t}`}>
            <line x1={px(normEff(t))} x2={px(normEff(t))} y1={PY0} y2={PY1} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={px(normEff(t))} y={PY1 + 12} textAnchor="middle" fontSize={fs(8)} fill="var(--color-ink-faint)">
              {(t * 100).toFixed(1)}%
            </text>
          </g>
        ))}
        {Y_TICKS.map((t) => (
          <g key={`y${t}`}>
            <line x1={PX0} x2={PX1} y1={py(normBurden(t))} y2={py(normBurden(t))} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={PX0 - 5} y={py(normBurden(t)) + 3} textAnchor="end" fontSize={fs(8)} fill="var(--color-ink-faint)">
              {(t * 100).toFixed(0)}%
            </text>
          </g>
        ))}

        {/* axis titles */}
        <text x={(PX0 + PX1) / 2} y={H - 4} textAnchor="middle" fontSize={fs(9)} fill="var(--color-ink-mid)">
          Effective tax rate  (bill ÷ value)
        </text>
        <text
          x={12}
          y={(PY0 + PY1) / 2}
          textAnchor="middle"
          fontSize={fs(9)}
          fill="var(--color-ink-mid)"
          transform={`rotate(-90 12 ${(PY0 + PY1) / 2})`}
        >
          Tax burden  (bill ÷ income)
        </text>

        {/* quadrant median lines for the selected year */}
        {medX != null && (
          <line x1={medX} x2={medX} y1={PY0} y2={PY1} stroke="var(--color-ink-faint)" strokeWidth={1} strokeDasharray="3 3" />
        )}
        {medY != null && (
          <line x1={PX0} x2={PX1} y1={medY} y2={medY} stroke="var(--color-ink-faint)" strokeWidth={1} strokeDasharray="3 3" />
        )}

        {/* corner labels (neutral) */}
        <g fill="var(--color-ink-faint)" fontSize={fs(7)} opacity={0.85}>
          <text x={PX1 - 3} y={PY0 + 10} textAnchor="end">higher rate · higher burden</text>
          <text x={PX0 + 3} y={PY0 + 10} textAnchor="start">lower rate · higher burden</text>
          <text x={PX1 - 3} y={PY1 - 4} textAnchor="end">higher rate · lower burden</text>
          <text x={PX0 + 3} y={PY1 - 4} textAnchor="start">lower rate · lower burden</text>
        </g>

        {/* rest-of-state dots */}
        {view === "state" &&
          rest.map((t) => {
            const xy = townXY(t, year);
            if (!xy) return null;
            return (
              <circle
                key={t.name}
                r={2.2}
                cx={0}
                cy={0}
                fill={TIER_REST}
                style={{ transform: `translate(${xy.x}px,${xy.y}px)`, transition: dotTransition }}
              />
            );
          })}

        {/* Essex dots */}
        {essex.map((t) => {
          const xy = townXY(t, year);
          if (!xy) return null;
          return (
            <circle
              key={t.name}
              r={3}
              cx={0}
              cy={0}
              fill={TIER_ESSEX}
              style={{ transform: `translate(${xy.x}px,${xy.y}px)`, transition: dotTransition }}
            />
          );
        })}

        {/* trails for selected towns (full trajectory, faded oldest -> newest) */}
        {selectedTowns.map((t) => {
          const color = selectColor(t.name);
          const fys = data.meta.fiscal_years;
          const segs: { a: Pt; b: Pt; op: number }[] = [];
          let prev: Pt | null = null;
          fys.forEach((fy, i) => {
            const xy = townXY(t, fy);
            if (xy && prev) segs.push({ a: prev, b: xy, op: 0.15 + 0.55 * (i / (fys.length - 1)) });
            prev = xy ?? prev;
          });
          return (
            <g key={`trail-${t.name}`}>
              {segs.map((s, i) => (
                <line
                  key={i}
                  x1={s.a.x}
                  y1={s.a.y}
                  x2={s.b.x}
                  y2={s.b.y}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeOpacity={s.op}
                  strokeLinecap="round"
                />
              ))}
            </g>
          );
        })}

        {/* selected current-year dots */}
        {selectedTowns.map((t) => {
          const xy = townXY(t, year);
          if (!xy) return null;
          const color = selectColor(t.name);
          return (
            <g key={`sel-${t.name}`} style={{ transform: `translate(${xy.x}px,${xy.y}px)`, transition: dotTransition }}>
              <circle r={5.5} fill={color} stroke="var(--color-bg)" strokeWidth={1.5} />
            </g>
          );
        })}

        {/* hover ring */}
        {hoveredTown &&
          (() => {
            const xy = townXY(hoveredTown, year);
            if (!xy) return null;
            return <circle cx={xy.x} cy={xy.y} r={7.5} fill="none" stroke="var(--color-ink)" strokeWidth={1} />;
          })()}
      </svg>

      {/* tooltip */}
      {hoveredTown && hoveredRec && tip && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-rule bg-bg-card px-3 py-2 text-xs shadow-sm"
          style={{
            left: tip.left,
            top: tip.top,
            transform: `translate(${tip.left > (wrapRef.current?.clientWidth ?? 0) / 2 ? "-108%" : "8%"}, -50%)`,
            minWidth: 172,
          }}
        >
          <div className="font-display font-semibold text-ink">
            {hoveredTown.name}
            <span className="ml-1 font-sans font-normal text-ink-faint">
              {hoveredTown.county ? `· ${hoveredTown.county}` : ""} · FY{year}
            </span>
          </div>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 tabular-nums">
            <dt className="text-ink-faint">Posted rate</dt>
            <dd className="text-right text-ink">{fmtRate(hoveredRec.rate)}</dd>
            <dt className="text-ink-faint">Effective rate</dt>
            <dd className="text-right text-ink">{fmtPct(hoveredRec.effective_rate, 2)}</dd>
            <dt className="text-ink-faint">Avg bill</dt>
            <dd className="text-right text-ink">{fmtUSD(hoveredRec.avg_bill)}</dd>
            <dt className="text-ink-faint">Avg value</dt>
            <dd className="text-right text-ink">{fmtUSD(hoveredRec.avg_value)}</dd>
            <dt className="text-ink-faint">Median income</dt>
            <dd className="text-right text-ink">{fmtUSD(hoveredRec.income)}</dd>
            <dt className="text-ink-faint">Burden</dt>
            <dd className="text-right text-ink">{fmtPct(hoveredRec.burden, 1)}</dd>
            <dt className="text-ink-faint">Bill rank</dt>
            <dd className="text-right text-ink">{hoveredRec.rank ?? "—"}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
