"use client";

import {
  type TaxData,
  type Town,
  type TownYear,
  SELECT_COLORS,
  fmtRate,
  fmtUSD,
  fmtPct,
  firstLast,
} from "@/lib/beverly/taxData";
import Sparkline from "./Sparkline";

type Props = {
  data: TaxData;
  selected: string[];
  focused: string;
  onFocus: (name: string) => void;
};

type Metric = {
  key: keyof TownYear;
  label: string;
  suffix: string;
  fmt: (v: number | null | undefined) => string;
  // 10-yr change rendering: percent for rate/bill, percentage-points for burden
  changeMode: "pct" | "points";
};

const METRICS: Metric[] = [
  { key: "rate", label: "Posted rate", suffix: "per $1,000", fmt: fmtRate, changeMode: "pct" },
  { key: "avg_bill", label: "Average bill", suffix: "single-family", fmt: fmtUSD, changeMode: "pct" },
  { key: "burden", label: "Burden", suffix: "of median income", fmt: (v) => fmtPct(v, 1), changeMode: "points" },
];

function changeLabel(town: Town, m: Metric): { text: string; dir: "up" | "down" | "flat" } {
  const { first, last } = firstLast(town, m.key);
  if (!first || !last || first.fy === last.fy) return { text: "—", dir: "flat" };
  const delta = last.v - first.v;
  const dir = delta > 0 ? "up" : delta < 0 ? "down" : "flat";
  if (m.changeMode === "points") {
    const pts = delta * 100;
    return { text: `${pts >= 0 ? "+" : "−"}${Math.abs(pts).toFixed(1)} pts since FY${first.fy}`, dir };
  }
  const pct = (delta / first.v) * 100;
  return { text: `${pct >= 0 ? "+" : "−"}${Math.abs(pct).toFixed(0)}% since FY${first.fy}`, dir };
}

export default function TownDetail({ data, selected, focused, onFocus }: Props) {
  const town = data.towns.find((t) => t.name === focused) ?? data.towns.find((t) => t.name === selected[0]);
  if (!town) {
    return (
      <p className="text-sm text-ink-mid">Add a town above to see its ten-year detail.</p>
    );
  }
  const focusColor = SELECT_COLORS[Math.max(0, selected.indexOf(town.name)) % SELECT_COLORS.length];
  const fys = data.meta.fiscal_years;
  const latest = [...town.series].reverse().find((s) => s.rate != null || s.avg_bill != null);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg font-semibold text-ink">
          {town.name}
          {town.county ? <span className="ml-2 text-sm font-normal text-ink-faint">{town.county} County</span> : null}
        </h3>
        {selected.length > 1 && (
          <div className="ml-auto flex flex-wrap gap-1">
            {selected.map((name, i) => (
              <button
                key={name}
                type="button"
                onClick={() => onFocus(name)}
                aria-pressed={name === town.name}
                className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ${
                  name === town.name ? "text-white" : "border border-rule text-ink-mid hover:text-ink"
                }`}
                style={name === town.name ? { backgroundColor: SELECT_COLORS[i % SELECT_COLORS.length] } : undefined}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {METRICS.map((m) => {
          const points = fys.map((fy) => ({ fy, v: (town.series.find((s) => s.fy === fy)?.[m.key] ?? null) as number | null }));
          const latestVal = (latest?.[m.key] ?? null) as number | null;
          const chg = changeLabel(town, m);
          return (
            <div key={m.key} className="rounded-md border border-rule bg-bg p-3">
              <div className="text-xs font-medium uppercase tracking-wide text-ink-faint">{m.label}</div>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-2xl font-semibold tabular-nums text-ink">{m.fmt(latestVal)}</span>
                <span className="text-[0.6875rem] text-ink-faint">{m.suffix}</span>
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs tabular-nums text-ink-mid">
                <span aria-hidden>{chg.dir === "up" ? "↑" : chg.dir === "down" ? "↓" : "→"}</span>
                {chg.text}
              </div>
              <div className="mt-2">
                <Sparkline points={points} color={focusColor} />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[0.6875rem] text-ink-faint">
        Sparklines span FY{fys[0]}–FY{fys[fys.length - 1]}; each is scaled to its own range. Gaps are years without a
        published figure.
      </p>
    </div>
  );
}
