"use client";

import { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Legend, ResponsiveContainer,
} from "recharts";
import { computeBridge } from "@/lib/beverly/bridgeModel";

// Chart marks are SVG; fill/stroke don't resolve CSS var(), so these mirror the
// @theme tokens in app/globals.css.
const C = {
  accent: "#2d6a4f",
  debt: "#b0562b",
  gold: "#b8923a",
  ink: "#1a1815",
  inkMid: "#4d4840",
  rule: "rgba(0,0,0,0.09)",
};

const TAX_PER_M = 53; // ~$50-55/yr on the median bill per $1M of override

const fmtSigned = (v: number) => `${v < 0 ? "-" : "+"}$${Math.abs(v).toFixed(1)}M`;
const fmtM = (v: number) => `$${v.toFixed(1)}M`;
const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;
const pts = (v: number) => (v * 100).toFixed(1);

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-rule bg-bg-card px-4 py-3">
      <div className="font-display text-2xl font-semibold text-accent leading-none">{value}</div>
      <div className="mt-1.5 text-ink-mid" style={{ fontSize: "0.8rem", lineHeight: 1.35 }}>{label}</div>
      {sub && <div className="mt-1 text-ink-faint" style={{ fontSize: "0.72rem" }}>{sub}</div>}
    </div>
  );
}

function Slider({ id, label, value, min, max, step, onChange, display, sub }: {
  id: string; label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; display: string; sub?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-semibold" style={{ fontSize: "0.85rem" }}>{label}</label>
        <span className="font-display font-semibold text-accent" style={{ fontSize: "1.05rem" }}>{display}</span>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full" />
      {sub && <div className="text-ink-faint" style={{ fontSize: "0.7rem" }}>{sub}</div>}
    </div>
  );
}

export default function BridgeModel() {
  const [override, setOverride] = useState(0);
  const [newGrowth, setNewGrowth] = useState(1.25);
  const [pilot, setPilot] = useState(0.25);
  const [health, setHealth] = useState(0);

  const result = useMemo(
    () => computeBridge({ overrideAmount: override, newGrowthTarget: newGrowth, pilotTarget: pilot, healthSavings: health }),
    [override, newGrowth, pilot, health],
  );
  const { rows, peak, breachBaseFy, breachStrategyFy, smallestOverrideToHold, scissors } = result;

  const strategyHolds = breachStrategyFy === null;
  const taxImpact = Math.round(override * TAX_PER_M);

  return (
    <div className="bm-root max-w-3xl mx-auto px-6 py-16 sm:py-20">
      <style>{`
        .bm-root svg text { font-family: var(--font-sans), system-ui, sans-serif; }
        .bm-root input[type="range"] { accent-color: var(--color-accent); }
      `}</style>

      <div className="mb-2 font-semibold uppercase text-accent" style={{ fontSize: "0.72rem", letterSpacing: "0.14em" }}>
        Beverly · Bridge model · Working tool
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-4">
        Can Beverly cross the bridge?
      </h1>
      <p className="text-ink-mid leading-relaxed mb-8" style={{ maxWidth: "60ch" }}>
        The city&apos;s own forecast shows the deficit widening to $13.7M by FY30. This layers the
        adopted PERAC pension schedule on top, extends the picture to FY40, and lets you work the
        levers: grow the tax base, negotiate PILOT payments, trim health costs, and add a permanent
        override. Watch which moves lift the line and which actually bend it.
      </p>

      {/* Controls */}
      <div className="rounded-xl border border-rule bg-bg-card p-5 mb-6 flex flex-col gap-5">
        <Slider id="override" label="Permanent operating override" value={override} min={0} max={15} step={0.5}
          onChange={setOverride} display={fmtM(override)}
          sub={taxImpact > 0 ? `≈ $${taxImpact}/yr on the median bill · a level shift, not a bend` : "a level shift, not a bend"} />
        <Slider id="newgrowth" label="Sustained new growth" value={newGrowth} min={1.25} max={3} step={0.05}
          onChange={setNewGrowth} display={`${fmtM(newGrowth)}/yr`}
          sub="City plans $1.25M · 11-yr actual ~$1.6M · target $2.5-3M. Compounds, so it bends the revenue line." />
        <Slider id="pilot" label="PILOT payments" value={pilot} min={0.25} max={1.25} step={0.05}
          onChange={setPilot} display={`${fmtM(pilot)}/yr`}
          sub="Now $0.25M · realistic band $0.6-1.25M. Endicott alone forgoes $2.16M." />
        <Slider id="health" label="Annual health-cost savings" value={health} min={0} max={0.5} step={0.05}
          onChange={setHealth} display={`${fmtM(health)}/yr`}
          sub="Plan design / GIC entry. Local ceiling ~$0.15-0.5M/yr." />
      </div>

      {/* Scissors callout */}
      <div className="rounded-xl p-5 mb-8" style={{ background: "var(--color-accent-glow)", border: "1px solid rgba(45,106,79,0.28)" }}>
        <div className="font-semibold uppercase text-accent mb-1.5" style={{ fontSize: "0.68rem", letterSpacing: "0.12em" }}>
          The structural scissors
        </div>
        <p className="text-ink leading-relaxed" style={{ fontSize: "0.92rem" }}>
          Ex-pension costs grow <b>{fmtPct(scissors.baseExpPct)}/yr</b> against{" "}
          <b>{fmtPct(scissors.baseRevPct)}/yr</b> revenue: a <b>{pts(scissors.baseGapPct)}-point</b> gap that
          compounds. Your levers bend it to <b>{pts(scissors.stratGapPct)} points</b>. The override isn&apos;t
          here, because it lifts the level without bending the slope.
        </p>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <Stat label={`Peak bridge-year deficit (${peak.fyLabel}), before any action`} value={fmtSigned(peak.deficit)} />
        <Stat
          label="With this strategy, reserves…"
          value={strategyHolds ? "hold to FY40" : `dip below floor ${breachStrategyFy}`}
          sub={`Do nothing: below floor ${breachBaseFy ?? "never"}`}
        />
        <Stat
          label="Smallest override that holds through FY33, given these levers"
          value={smallestOverrideToHold === null ? ">$20M" : fmtM(smallestOverrideToHold)}
        />
      </div>

      {/* Deficit chart */}
      <h2 className="font-display text-xl font-semibold tracking-tight mb-1">The deficit path</h2>
      <p className="text-ink-mid mb-3" style={{ fontSize: "0.9rem", maxWidth: "58ch" }}>
        Revenue minus expenditure by year. The dip at FY32-33 is the pension cliff. Note it does not
        last: left unaddressed, the structural gap keeps widening, to about{" "}
        {fmtSigned(rows[rows.length - 1].deficitBase)} a year by FY40. The cliff resets the level; it
        does not bend the slope.
      </p>
      <div className="rounded-xl border border-rule bg-bg-card p-4 mb-10" style={{ height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 2 }}>
            <CartesianGrid stroke={C.rule} strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="fyLabel" tick={{ fontSize: 11, fill: C.inkMid }} axisLine={{ stroke: C.rule }} tickLine={false} interval={1} />
            <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 11, fill: C.inkMid }} axisLine={false} tickLine={false} width={46} />
            <Tooltip formatter={(value) => fmtSigned(Number(value))} labelStyle={{ color: C.ink }} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.rule}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke={C.ink} strokeOpacity={0.4} />
            <ReferenceLine x="FY33" stroke={C.accent} strokeDasharray="4 4" strokeOpacity={0.5} />
            <Line type="monotone" dataKey="deficitBase" name="Do nothing" stroke={C.debt} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="deficitStrategy" name="With strategy" stroke={C.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reserve chart */}
      <h2 className="font-display text-xl font-semibold tracking-tight mb-1">Reserves against the floor</h2>
      <p className="text-ink-mid mb-3" style={{ fontSize: "0.9rem", maxWidth: "58ch" }}>
        The undesignated fund balance, drawn down or rebuilt each year. Below the dashed floor (5% of
        budget) is the danger zone; below zero means the gap must be closed by cuts.
      </p>
      <div className="rounded-xl border border-rule bg-bg-card p-4 mb-8" style={{ height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 4, left: 2 }}>
            <CartesianGrid stroke={C.rule} strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="fyLabel" tick={{ fontSize: 11, fill: C.inkMid }} axisLine={{ stroke: C.rule }} tickLine={false} interval={1} />
            <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 11, fill: C.inkMid }} axisLine={false} tickLine={false} width={46} />
            <Tooltip formatter={(value) => fmtM(Number(value))} labelStyle={{ color: C.ink }} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.rule}` }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke={C.ink} strokeOpacity={0.4} />
            <Line type="monotone" dataKey="reserveBase" name="Do nothing" stroke={C.debt} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="reserveStrategy" name="With strategy" stroke={C.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="reserveFloor" name="Reserve floor (5%)" stroke={C.gold} strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-ink-faint leading-relaxed" style={{ fontSize: "0.78rem", borderTop: "1px solid var(--color-rule)", paddingTop: "1rem" }}>
        <p className="mb-2">
          <b className="text-ink-mid">Fidelity.</b> FY27-FY30 use the city&apos;s confirmed forecast
          (Dec 2025 Financial Forecast Committee) with the authoritative PERAC pension schedule
          substituted, which runs ~$0.6M steeper than the forecast&apos;s own pension assumption.
          FY31-FY40 are a modeled extension on the forecast&apos;s FY27-30 revenue (~2.8%/yr) and
          ex-pension (~4.4%/yr) slopes. Lever ramps and the override are modeled: new growth compounds
          at 2.5% and ramps over 4 years; PILOT and health savings ramp over 3 years.
        </p>
        <p>
          Reserves assume gaps are absorbed by the undesignated fund balance with no service cuts
          modeled, so a balance below the floor marks where cuts would be forced. A cliff-date toggle
          and pension re-amortization arrive in stage 3.
        </p>
      </div>
    </div>
  );
}
