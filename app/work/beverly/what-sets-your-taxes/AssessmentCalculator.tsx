"use client";

import { useState } from "react";

const commas = (v: number) => Math.round(v).toLocaleString("en-US");
const parse = (s: string) => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(v) ? 0 : v;
};
const signPct = (v: number, d = 0) => `${v >= 0 ? "+" : ""}${v.toFixed(d)}%`;

export default function AssessmentCalculator() {
  const [assessment, setAssessment] = useState("500,000");
  const [bill, setBill] = useState("6,000");
  const [town, setTown] = useState(20);
  const [mine, setMine] = useState(20);
  const [linked, setLinked] = useState(true);

  const A = parse(assessment), B = parse(bill);
  const mg = linked ? town : mine;
  const newA = A * (1 + mg / 100);
  const newBill = B * 1.025 * (1 + mg / 100) / (1 + town / 100);
  const aPct = mg, bPct = B > 0 ? (newBill / B - 1) * 100 : 0;
  const scale = Math.max(Math.abs(aPct), Math.abs(bPct), 5);
  const gap = mg - town;

  const verdict =
    Math.abs(gap) < 0.5 ? (
      <>Your home rose the same as the town, so your bill rises only the <b>2.5 percent</b>{" "}the law lets the levy grow. Your assessment jumped <b>{aPct.toFixed(0)} percent</b>{" "}and your bill moved almost nothing.</>
    ) : gap > 0 ? (
      <>Your home rose <b>{gap.toFixed(0)} points</b>{" "}faster than the town, so your slice of the pie grew. Your bill rises <b>{bPct.toFixed(1)} percent</b>, still far less than your <b>{aPct.toFixed(0)} percent</b>{" "}assessment jump.</>
    ) : (
      <>Your home rose <b>{Math.abs(gap).toFixed(0)} points</b>{" "}slower than the town, so your slice shrank. Your bill actually <b>falls {Math.abs(bPct).toFixed(1)} percent</b>{" "}even as your assessment rose {aPct.toFixed(0)} percent.</>
    );

  return (
    <figure className="my-8 rounded-md border border-rule bg-bg-card/50 p-5">
      <div className="flex flex-wrap gap-5">
        <MoneyInput label="Your assessment" value={assessment} onChange={(v) => setAssessment(commas(parse(v)))} />
        <MoneyInput label="Your current tax bill" value={bill} onChange={(v) => setBill(commas(parse(v)))} />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <Slider label="The whole town's values rose by" value={town} onChange={setTown} />
        <Slider label="Your home rose by" value={linked ? town : mine} onChange={setMine} disabled={linked} />
      </div>
      <label className="mt-3.5 flex cursor-pointer items-center gap-2 text-[0.84375rem] text-ink-mid">
        <input type="checkbox" checked={linked} onChange={(e) => setLinked(e.target.checked)} className="h-4 w-4 accent-[var(--color-accent)]" />
        My home moved with the town (uncheck to set it yourself)
      </label>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <OutCard label="Your assessment" old={`$${commas(A)}`} nu={`$${commas(newA)}`} pct={signPct(aPct)} color="var(--color-debt)" />
        <OutCard label="Your tax bill" old={`$${commas(B)}`} nu={`$${commas(newBill)}`} pct={signPct(bPct, 1)} color="var(--color-accent)" />
      </div>

      <div className="mt-4">
        <CmpBar label="Assessment" pct={aPct} scale={scale} color="var(--color-debt)" fmt={signPct(aPct)} />
        <CmpBar label="Tax bill" pct={bPct} scale={scale} color="var(--color-accent)" fmt={signPct(bPct, 1)} />
      </div>

      <p className="mt-4 rounded-md border border-rule bg-bg px-4 py-3 text-[0.875rem] leading-relaxed text-ink">{verdict}</p>
      <figcaption className="mt-3 text-[0.78125rem] leading-relaxed text-ink-faint">
        The bill assumes the town&apos;s levy grows the full 2.5 percent the law allows, and sets aside new construction and any override. It isolates one thing: what a revaluation alone does to your bill.
      </figcaption>
    </figure>
  );
}

function MoneyInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">{label}</span>
      <span className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[150px] rounded-md border border-rule bg-bg py-2 pl-5 pr-3 text-[0.9375rem] tabular-nums text-ink"
        />
      </span>
    </label>
  );
}

function Slider({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[0.875rem] text-ink">{label}</span>
        <span className="text-[0.9375rem] font-bold tabular-nums text-ink">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(+e.target.value)}
        className="mt-1 w-full accent-[var(--color-accent)] disabled:opacity-40"
      />
    </div>
  );
}

function OutCard({ label, old, nu, pct, color }: { label: string; old: string; nu: string; pct: string; color: string }) {
  return (
    <div className="rounded-md border border-rule bg-bg px-4 py-3.5">
      <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
        <span className="text-[0.9375rem] text-ink-faint line-through tabular-nums">{old}</span>
        <span className="text-ink-faint">→</span>
        <span className="text-[1.375rem] font-extrabold tabular-nums" style={{ color }}>{nu}</span>
      </div>
      <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-[0.8125rem] font-bold tabular-nums" style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}>{pct}</span>
    </div>
  );
}

function CmpBar({ label, pct, scale, color, fmt }: { label: string; pct: number; scale: number; color: string; fmt: string }) {
  return (
    <div className="my-2 flex items-center gap-2.5">
      <div className="w-[84px] flex-none text-right text-[0.75rem] text-ink-mid">{label}</div>
      <div className="h-3.5 flex-1 overflow-hidden rounded-sm border border-rule bg-bg">
        <div className="h-full rounded-sm transition-[width] duration-300" style={{ width: `${Math.min((Math.abs(pct) / scale) * 100, 100)}%`, background: color }} />
      </div>
      <div className="w-[52px] flex-none text-[0.78125rem] font-bold tabular-nums" style={{ color }}>{fmt}</div>
    </div>
  );
}
