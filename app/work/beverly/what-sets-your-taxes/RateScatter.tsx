"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Town = { n: string; v: number; r: number; d: number; role: "cohort" | "other"; lab: string | null };

const W = 720, H = 430, M = { l: 62, r: 18, t: 16, b: 46 };
const PX0 = M.l, PX1 = W - M.r, PY0 = M.t, PY1 = H - M.b;

const kfmt = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M` : v >= 1e3 ? `${Math.round(v / 1e3)}k` : `${Math.round(v)}`);

function niceTicks(min: number, max: number, n = 5): number[] {
  const step0 = (max - min) / n, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const norm = step0 / mag, step = (norm >= 5 ? 5 : norm >= 2 ? 2 : 1) * mag;
  const t: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) t.push(+v.toFixed(6));
  return t;
}
function logTicks(min: number, max: number): number[] {
  const out: number[] = [];
  for (let e = 4; e <= 7; e++) for (const m of [1, 2, 5]) {
    const v = m * Math.pow(10, e);
    if (v >= min * 0.9 && v <= max * 1.1) out.push(v);
  }
  return out;
}

export default function RateScatter() {
  const [towns, setTowns] = useState<Town[] | null>(null);
  const [mode, setMode] = useState<"rate" | "dollars">("rate");
  const [hover, setHover] = useState<{ t: Town; left: number; top: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/ma-rate-scatter.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Town[] | null) => setTowns(d))
      .catch(() => setTowns(null));
  }, []);

  const geom = useMemo(() => {
    if (!towns) return null;
    const acc = mode === "rate" ? (t: Town) => t.r : (t: Town) => t.d;
    const xs = towns.map((t) => t.v);
    const xmin = Math.min(...xs), xmax = Math.max(...xs);
    const X = (v: number) => {
      const a = Math.log10(xmin * 0.85), b = Math.log10(xmax * 1.15);
      return PX0 + ((Math.log10(v) - a) / (b - a)) * (PX1 - PX0);
    };
    const ys = towns.map(acc);
    const ymax = Math.max(...ys) * 1.06;
    const Y = (v: number) => PY1 - (v / ymax) * (PY1 - PY0);
    // least-squares trend on log10(x)
    const lx = towns.map((t) => Math.log10(t.v)), ly = towns.map(acc), n = lx.length;
    const mx = lx.reduce((s, v) => s + v, 0) / n, my = ly.reduce((s, v) => s + v, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) { num += (lx[i] - mx) * (ly[i] - my); den += (lx[i] - mx) ** 2; }
    const slope = num / den, icpt = my - slope * mx;
    const tx0 = xmin * 0.9, tx1 = xmax * 1.1;
    return {
      X, Y, acc,
      xTicks: logTicks(xmin, xmax),
      yTicks: niceTicks(0, ymax, 5),
      trend: { x1: X(tx0), y1: Y(Math.max(slope * Math.log10(tx0) + icpt, 0)), x2: X(tx1), y2: Y(Math.max(slope * Math.log10(tx1) + icpt, 0)) },
    };
  }, [towns, mode]);

  if (!towns || !geom) return <div className="h-[300px] animate-pulse rounded-md border border-rule bg-bg-card" aria-hidden />;
  const { X, Y, acc, xTicks, yTicks, trend } = geom;
  const yFmt = mode === "rate" ? (v: number) => `${v.toFixed(1)}%` : (v: number) => `$${kfmt(v)}`;

  function onMove(e: React.PointerEvent) {
    const svg = svgRef.current, wrap = wrapRef.current;
    if (!svg || !wrap || !towns) return;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPointReadOnly(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    let best: { t: Town; d2: number; cx: number; cy: number } | null = null;
    for (const t of towns) {
      const cx = X(t.v), cy = Y(acc(t)), d2 = (cx - p.x) ** 2 + (cy - p.y) ** 2;
      if (!best || d2 < best.d2) best = { t, d2, cx, cy };
    }
    if (best && best.d2 <= 14 * 14) {
      const rect = wrap.getBoundingClientRect(), scale = rect.width / W;
      setHover({ t: best.t, left: best.cx * scale, top: best.cy * scale });
    } else setHover(null);
  }

  return (
    <figure className="my-8">
      <div className="mb-3 inline-flex rounded-md border border-rule p-0.5 text-xs">
        {(["rate", "dollars"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`rounded px-3 py-1 transition-colors ${mode === m ? "bg-accent text-white" : "text-ink-mid hover:text-ink"}`}
          >
            {m === "rate" ? "How hard you're taxed" : "What you pay"}
          </button>
        ))}
      </div>
      <div ref={wrapRef} className="relative w-full select-none" style={{ touchAction: "pan-y" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="Massachusetts municipalities: property value per resident on the horizontal axis, effective tax rate or dollars per resident on the vertical axis."
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={PX0} x2={PX1} y1={Y(t)} y2={Y(t)} stroke="var(--color-rule)" strokeWidth={0.5} />
              <text x={PX0 - 6} y={Y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--color-ink-faint)">{yFmt(t)}</text>
            </g>
          ))}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={X(t)} x2={X(t)} y1={PY0} y2={PY1} stroke="var(--color-rule)" strokeWidth={0.5} />
              <text x={X(t)} y={PY1 + 16} textAnchor="middle" fontSize={10} fill="var(--color-ink-faint)">${kfmt(t)}</text>
            </g>
          ))}
          <text x={(PX0 + PX1) / 2} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--color-ink-mid)">Property value per resident</text>
          <text x={14} y={(PY0 + PY1) / 2} textAnchor="middle" fontSize={11} fill="var(--color-ink-mid)" transform={`rotate(-90 14 ${(PY0 + PY1) / 2})`}>
            {mode === "rate" ? "Effective tax rate" : "Tax dollars per resident"}
          </text>
          <line x1={trend.x1} y1={trend.y1} x2={trend.x2} y2={trend.y2} stroke="var(--color-debt)" strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
          {towns.map((t) => {
            const isC = t.role === "cohort";
            return (
              <circle key={t.n} cx={X(t.v)} cy={Y(acc(t))} r={isC ? 5 : 3.3} fill={isC ? "var(--color-accent)" : "var(--color-ink-faint)"} fillOpacity={isC ? 1 : 0.5} stroke="var(--color-bg)" strokeWidth={0.5} />
            );
          })}
          {towns.filter((t) => t.lab).map((t) => {
            const x = X(t.v), y = Y(acc(t)), left = x > PX1 - 90;
            return (
              <text
                key={`l${t.n}`}
                x={left ? x - 8 : x + 8}
                y={y - 8 < PY0 + 4 ? y + 15 : y - 7}
                textAnchor={left ? "end" : "start"}
                fontSize={t.role === "cohort" ? 11 : 10}
                fontWeight={t.role === "cohort" ? 700 : 400}
                fill={t.role === "cohort" ? "var(--color-ink)" : "var(--color-ink-mid)"}
                style={{ paintOrder: "stroke", stroke: "var(--color-bg)", strokeWidth: 3 }}
              >
                {t.lab}
              </text>
            );
          })}
          {hover && <circle cx={X(hover.t.v)} cy={Y(acc(hover.t))} r={8} fill="none" stroke="var(--color-ink)" strokeWidth={1} />}
        </svg>
        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-md border border-rule bg-bg-card px-3 py-2 text-xs shadow-sm"
            style={{ left: hover.left, top: hover.top, transform: `translate(${hover.left > (wrapRef.current?.clientWidth ?? 0) / 2 ? "-108%" : "8%"}, -50%)`, minWidth: 150 }}
          >
            <div className="font-display font-semibold text-ink">{hover.t.n}</div>
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 tabular-nums">
              <dt className="text-ink-faint">Value/resident</dt><dd className="text-right text-ink">${kfmt(hover.t.v)}</dd>
              <dt className="text-ink-faint">Rate</dt><dd className="text-right text-ink">{hover.t.r}%</dd>
              <dt className="text-ink-faint">Bill/resident</dt><dd className="text-right text-ink">${hover.t.d.toLocaleString("en-US")}</dd>
            </dl>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-[0.84375rem] leading-relaxed text-ink-mid">
        {mode === "rate" ? (
          <>Each dot is one of 345 towns. The line slopes <b className="text-ink">down</b>: the more valuable a town&apos;s property, the <b className="text-ink">lower</b>{" "}its tax rate. The rate just traces property wealth, upside down.</>
        ) : (
          <>Same 345 towns, one axis flipped. Now the line slopes <b className="text-ink">up</b>: the wealthiest towns pay the <b className="text-ink">biggest</b>{" "}bills while charging the lowest rates. That contradiction is the whole myth.</>
        )}
      </figcaption>
    </figure>
  );
}
