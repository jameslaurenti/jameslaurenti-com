"use client";

import { useMemo, useState } from "react";
import {
  type TaxData,
  type Town,
  yearRecord,
  fmtPct,
  fmtUSD,
} from "@/lib/beverly/taxData";

type Basis = "value" | "income" | "type" | "county";
const K = 12; // cohort size for value/income bases

type Metrics = { eff: number; value: number; income: number; burden: number };

function metrics(town: Town, year: number): Metrics | null {
  const s = yearRecord(town, year);
  if (!s || s.effective_rate == null || s.avg_value == null || s.income == null || s.burden == null) return null;
  return { eff: s.effective_rate, value: s.avg_value, income: s.income, burden: s.burden };
}

const median = (xs: number[]) => {
  const a = [...xs].sort((p, q) => p - q);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

const signedPct = (ratio: number) => `${ratio >= 1 ? "+" : "−"}${Math.abs((ratio - 1) * 100).toFixed(0)}%`;

export default function PeerCohort({
  data,
  town,
  year,
  color,
}: {
  data: TaxData;
  town: Town;
  year: number;
  color: string;
}) {
  const [basis, setBasis] = useState<Basis>("value");
  const focus = metrics(town, year);

  const cohort = useMemo(() => {
    if (!focus) return [];
    const pool = data.towns
      .filter((t) => t.name !== town.name)
      .map((t) => ({ t, m: metrics(t, year) }))
      .filter((x): x is { t: Town; m: Metrics } => x.m != null);
    if (basis === "county") return pool.filter((x) => x.t.county === town.county);
    if (basis === "type") return pool.filter((x) => x.t.type && x.t.type === town.type);
    const key = basis === "value" ? "value" : "income";
    return [...pool].sort((a, b) => Math.abs(a.m[key] - focus[key]) - Math.abs(b.m[key] - focus[key])).slice(0, K);
  }, [data, town, year, basis, focus]);

  if (!focus) {
    return <p className="text-sm text-ink-mid">No burden data for {town.name} in FY{year}.</p>;
  }
  if (cohort.length < 3) {
    return <p className="text-sm text-ink-mid">Not enough comparable towns for FY{year}.</p>;
  }

  const med: Metrics = {
    eff: median(cohort.map((c) => c.m.eff)),
    value: median(cohort.map((c) => c.m.value)),
    income: median(cohort.map((c) => c.m.income)),
    burden: median(cohort.map((c) => c.m.burden)),
  };

  // Additive (log) decomposition of the burden gap vs. the peer median.
  const contrib = {
    rate: Math.log(focus.eff / med.eff),
    value: Math.log(focus.value / med.value),
    income: -Math.log(focus.income / med.income),
  };
  const dominant = (["income", "rate", "value"] as const).reduce((a, b) =>
    Math.abs(contrib[b]) > Math.abs(contrib[a]) ? b : a
  );
  const higher = focus.burden > med.burden;

  const typePlural =
    town.type === "Gateway City" ? "Gateway Cities" : town.type === "Coastal" ? "coastal towns" : "inland towns";
  // Self-contained phrase that reads after "…is higher/lower than ___".
  const basisLabel =
    basis === "value"
      ? "towns with similar home values"
      : basis === "income"
        ? "towns with similar incomes"
        : basis === "type"
          ? `other ${typePlural}`
          : `other towns in ${town.county} County`;

  const domPhrase = {
    income: `${town.name}'s median household income (${signedPct(focus.income / med.income)} vs. peers) — the same-size bill lands ${higher ? "harder" : "softer"} on ${focus.income < med.income ? "lower" : "higher"} incomes`,
    rate: `its effective tax rate (${signedPct(focus.eff / med.eff)} vs. peers) — the tax levied per dollar of home value`,
    value: `its home values (${signedPct(focus.value / med.value)} vs. peers)`,
  }[dominant];

  // burden strip geometry
  const W = 340, H = 52, PL = 8, PR = W - 8, cy = 24;
  const bs = [...cohort.map((c) => c.m.burden), focus.burden];
  const lo = Math.min(...bs), hi = Math.max(...bs);
  const pad = (hi - lo) * 0.12 || 0.005;
  const x = (b: number) => PL + ((b - (lo - pad)) / (hi - lo + 2 * pad)) * (PR - PL);

  const rows: { label: string; f: number; m: number; fmt: (v: number) => string }[] = [
    { label: "Effective rate", f: focus.eff, m: med.eff, fmt: (v) => fmtPct(v, 2) },
    { label: "Avg home value", f: focus.value, m: med.value, fmt: (v) => fmtUSD(v) },
    { label: "Median income", f: focus.income, m: med.income, fmt: (v) => fmtUSD(v) },
  ];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {town.type && (
          <span
            className="rounded-full border border-rule bg-bg px-2 py-0.5 text-[11px] font-medium text-ink-mid"
            title={town.gateway && town.coastal ? "Statutory Gateway City; also coastal" : undefined}
          >
            {town.type}
            {town.gateway && town.coastal ? " · coastal" : ""}
          </span>
        )}
        <span className="text-xs text-ink-faint">Compare with towns of</span>
        <div className="inline-flex rounded-md border border-rule p-0.5 text-xs">
          {([["value", "similar value"], ["income", "similar income"], ["type", "same type"], ["county", "same county"]] as [Basis, string][]).map(
            ([b, lbl]) => (
              <button
                key={b}
                type="button"
                onClick={() => setBasis(b)}
                aria-pressed={basis === b}
                className={`rounded px-2.5 py-1 transition-colors ${basis === b ? "bg-accent text-white" : "text-ink-mid hover:text-ink"}`}
              >
                {lbl}
              </button>
            )
          )}
        </div>
        <span className="text-xs text-ink-faint">· {cohort.length} towns · FY{year}</span>
      </div>

      {/* burden strip */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
        aria-label={`${town.name}'s tax burden is ${fmtPct(focus.burden, 1)}, versus a peer median of ${fmtPct(med.burden, 1)}.`}>
        <line x1={PL} x2={PR} y1={cy} y2={cy} stroke="var(--color-rule)" />
        {/* peer median tick */}
        <line x1={x(med.burden)} x2={x(med.burden)} y1={cy - 8} y2={cy + 8} stroke="var(--color-ink-faint)" strokeDasharray="2 2" />
        <text x={x(med.burden)} y={cy + 20} textAnchor="middle" fontSize={7.5} fill="var(--color-ink-faint)">
          peer median {fmtPct(med.burden, 1)}
        </text>
        {cohort.map((c) => (
          <circle key={c.t.name} cx={x(c.m.burden)} cy={cy} r={3} fill="var(--color-ink)" opacity={0.18} />
        ))}
        <circle cx={x(focus.burden)} cy={cy} r={5} fill={color} stroke="var(--color-bg)" strokeWidth={1.5} />
        <text x={x(focus.burden)} y={cy - 10} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--color-ink)">
          {town.name} {fmtPct(focus.burden, 1)}
        </text>
      </svg>

      {/* driver breakdown */}
      <div className="mt-3 space-y-1.5">
        {rows.map((r) => {
          const ratio = r.m ? r.f / r.m : 1;
          const above = ratio >= 1;
          const w = Math.min(50, Math.abs(ratio - 1) * 100);
          return (
            <div key={r.label} className="grid grid-cols-[92px_1fr_auto] items-center gap-2 text-xs">
              <span className="text-ink-faint">{r.label}</span>
              <div className="relative h-4">
                <div className="absolute left-1/2 top-0 h-full w-px bg-rule" />
                <div
                  className="absolute top-1/2 h-2 -translate-y-1/2 rounded-sm"
                  style={{
                    background: color,
                    opacity: 0.55,
                    width: `${w}%`,
                    left: above ? "50%" : `${50 - w}%`,
                  }}
                />
              </div>
              <span className="whitespace-nowrap text-right tabular-nums text-ink">
                {r.fmt(r.f)} <span className="text-ink-faint">vs {r.fmt(r.m)} · {signedPct(ratio)}</span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 rounded-md bg-bg p-3 text-xs leading-relaxed text-ink-mid">
        {town.name}’s tax burden ({fmtPct(focus.burden, 1)}) is {higher ? "higher" : "lower"} than{" "}
        {basisLabel} (median {fmtPct(med.burden, 1)}). The biggest factor is {domPhrase}. Burden is
        effective&nbsp;rate&nbsp;×&nbsp;(home&nbsp;value&nbsp;÷&nbsp;income): rate reflects tax the town levies; value
        and income are set by the market. <span className="text-ink-faint">Working draft.</span>
      </p>
    </div>
  );
}
