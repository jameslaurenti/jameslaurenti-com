"use client";

import { type TaxData, type Town, levyView, yearRecord, fmtMillions, fmtPct } from "@/lib/beverly/taxData";

const W = 360;
const H = 210;
const M = { top: 10, right: 8, bottom: 24, left: 44 };
const PL = M.left;
const PR = W - M.right;
const PT = M.top;
const PB = H - M.bottom;

type Props = {
  data: TaxData;
  town: Town;
  year: number;
  color: string;
};

export default function LevyHeadroom({ data, town, year, color }: Props) {
  const fys = data.meta.fiscal_years;
  const bars = fys
    .map((fy) => ({ fy, lv: levyView(yearRecord(town, fy)) }))
    .filter((b) => b.lv) as { fy: number; lv: NonNullable<ReturnType<typeof levyView>> }[];

  if (bars.length === 0) return null;

  const maxCeiling = Math.max(...bars.map((b) => b.lv.ceiling)) * 1.04;
  const n = fys.length;
  const slot = (PR - PL) / n;
  const barW = slot * 0.62;
  const xAt = (fy: number) => PL + slot * fys.indexOf(fy) + (slot - barW) / 2;
  const yAt = (v: number) => PB - (v / maxCeiling) * (PB - PT);

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * maxCeiling);
  const sel = levyView(yearRecord(town, year));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`Stacked bars of ${town.name}'s levy ceiling by fiscal year, split into tax levied, unused capacity, and override capacity. Values in the panel below.`}>
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
            <rect width="4" height="4" fill={color} opacity="0.06" />
            <line x1="0" y1="0" x2="0" y2="4" stroke={color} strokeWidth="1" opacity="0.28" />
          </pattern>
        </defs>

        {/* y gridlines + $M labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PL} x2={PR} y1={yAt(t)} y2={yAt(t)} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={PL - 4} y={yAt(t) + 3} textAnchor="end" fontSize={7.5} fill="var(--color-ink-faint)">
              {fmtMillions(t)}
            </text>
          </g>
        ))}

        {bars.map(({ fy, lv }) => {
          const x = xAt(fy);
          const hRaised = (lv.actual / maxCeiling) * (PB - PT);
          const hExcess = (lv.excess / maxCeiling) * (PB - PT);
          const overrideHeight = Math.max(0, lv.ceiling - Math.max(lv.actual, lv.limit));
          const hOverride = (overrideHeight / maxCeiling) * (PB - PT);
          const isSel = fy === year;
          const dim = isSel ? 1 : 0.72;
          const yRaisedTop = PB - hRaised;
          const yExcessTop = yRaisedTop - hExcess;
          const yOverrideTop = yExcessTop - hOverride;
          return (
            <g key={fy} opacity={dim}>
              {/* override capacity (needs vote) */}
              <rect x={x} y={yOverrideTop} width={barW} height={hOverride} fill="url(#hatch)" />
              {/* excess capacity (no vote) */}
              {hExcess > 0.4 && <rect x={x} y={yExcessTop} width={barW} height={hExcess} fill={color} opacity={0.42} />}
              {/* tax actually levied */}
              <rect x={x} y={yRaisedTop} width={barW} height={hRaised} fill={color} />
              {isSel && (
                <rect x={x - 1} y={yOverrideTop - 1} width={barW + 2} height={PB - yOverrideTop + 1}
                  fill="none" stroke="var(--color-ink)" strokeWidth={1} />
              )}
              <text x={x + barW / 2} y={PB + 9} textAnchor="middle" fontSize={6.5}
                fill={isSel ? "var(--color-ink)" : "var(--color-ink-faint)"} fontWeight={isSel ? 600 : 400}>
                ’{String(fy).slice(2)}
              </text>
            </g>
          );
        })}
        {/* baseline */}
        <line x1={PL} x2={PR} y1={PB} y2={PB} stroke="var(--color-rule)" />
      </svg>

      {/* legend */}
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-mid">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color }} /> Tax levied
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: color, opacity: 0.42 }} /> Unused (no vote)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm border border-rule"
            style={{ background: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${color} 2px, ${color} 3px)`, opacity: 0.6 }} />
          Override capacity — needs a vote
        </span>
      </div>

      {/* headline stats for the selected year */}
      {sel && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label={`Ceiling used · FY${year}`} value={fmtPct(sel.pctOfCeiling, 0)} sub={`${fmtMillions(sel.actual)} of ${fmtMillions(sel.ceiling)}`} />
          <Stat label="Override capacity" value={fmtPct(sel.overridePct, 0)} sub={`${fmtMillions(sel.override)} — needs a vote`} />
          <Stat label="Status" value={sel.atCeiling ? "At ceiling" : "Has headroom"} sub={sel.atCeiling ? "limit ≈ ceiling" : "levy well below ceiling"} />
        </div>
      )}

      <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
        The full bar is the levy ceiling (2.5% of assessed value). It rises with home values, while the tax
        actually levied grows only ~2.5% a year — so the hatched “override capacity” slab widens. That gap is
        real but not spendable: reaching it takes override votes, not a rate change. Copy here is a working draft.
      </p>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-md border border-rule bg-bg p-2.5">
      <div className="text-[10px] font-medium uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="font-display text-xl font-semibold tabular-nums text-ink">{value}</div>
      <div className="text-[10px] text-ink-faint">{sub}</div>
    </div>
  );
}
