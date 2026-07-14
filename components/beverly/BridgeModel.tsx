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

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-rule bg-bg-card px-4 py-3">
      <div className="font-display text-2xl font-semibold text-accent leading-none">{value}</div>
      <div className="mt-1.5 text-ink-mid" style={{ fontSize: "0.8rem", lineHeight: 1.35 }}>{label}</div>
      {sub && <div className="mt-1 text-ink-faint" style={{ fontSize: "0.72rem" }}>{sub}</div>}
    </div>
  );
}

export default function BridgeModel() {
  const [override, setOverride] = useState(0);
  const result = useMemo(() => computeBridge({ overrideAmount: override }), [override]);
  const { rows, peak, breachBaseFy, breachOverrideFy, smallestOverrideToHold } = result;

  const overrideHolds = breachOverrideFy === null;
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
        adopted PERAC pension schedule on top, extends the picture to FY40, and lets you add a
        permanent operating override to see whether reserves survive the peak years. Drag the
        override and watch the reserve line.
      </p>

      {/* Control */}
      <div className="rounded-xl border border-rule bg-bg-card p-5 mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="override" className="font-semibold" style={{ fontSize: "0.9rem" }}>
            Permanent operating override
          </label>
          <span className="font-display text-2xl font-semibold text-accent">{fmtM(override)}</span>
        </div>
        <input
          id="override"
          type="range"
          min={0}
          max={15}
          step={0.5}
          value={override}
          onChange={(e) => setOverride(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-ink-faint mt-1" style={{ fontSize: "0.72rem" }}>
          <span>$0</span>
          <span>{taxImpact > 0 ? `≈ $${taxImpact}/yr on the median bill` : "drag to add an override"}</span>
          <span>$15M</span>
        </div>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <Stat label={`Peak bridge-year deficit (${peak.fyLabel}), before any override`} value={fmtSigned(peak.deficit)} />
        <Stat
          label="With this override, reserves…"
          value={overrideHolds ? "hold to FY40" : `dip below floor ${breachOverrideFy}`}
          sub={`Without any override: below floor ${breachBaseFy ?? "never"}`}
        />
        <Stat
          label="Smallest override that holds reserves above the floor through FY33"
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
            <Line type="monotone" dataKey="deficitBase" name="No override" stroke={C.debt} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="deficitWithOverride" name="With override" stroke={C.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
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
            <Line type="monotone" dataKey="reserveBase" name="No override" stroke={C.debt} strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="reserveWithOverride" name="With override" stroke={C.accent} strokeWidth={2} dot={false} isAnimationActive={false} />
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
          ex-pension (~4.4%/yr) slopes. The override grows at 2.5%/yr from FY28.
        </p>
        <p>
          Reserves assume gaps are absorbed by the undesignated fund balance with no service cuts
          modeled, so a balance below the floor marks where cuts would be forced. Lever ramps (new
          growth, PILOT), a cliff-date toggle, and pension re-amortization arrive in later stages.
        </p>
      </div>
    </div>
  );
}
