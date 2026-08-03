"use client";

import { useEffect, useRef, useState } from "react";

/*
  A fixed, self-consistent illustration of the reassessment "wash."
  The levy is held flat (the cap), the town revalues +20%, so the rate falls to
  fit, and a home that rises with the town sees no change in its bill:
    rate  = levy / town value          → falls when value rises, levy pinned
    bill  = your value × rate          → holds when your value rises in step
  Numbers are round and Beverly-scaled but illustrative, not a data series.
  User-triggered: it never autoplays. Speed chosen so the change is easy to follow.
*/
const LEVY = 140_000_000; // the capped levy, held flat here
const VAL0 = 11_380_000_000; // town's total assessed value, before
const REVAL = 0.2; // town-wide revaluation
const ASSESS0 = 500_000; // one home, before

const val1 = VAL0 * (1 + REVAL);
const rate0 = LEVY / VAL0; // ≈ 1.23%
const rate1 = LEVY / val1; // ≈ 1.03%
const assess1 = ASSESS0 * (1 + REVAL);
const bill0 = ASSESS0 * rate0;
const bill1 = assess1 * rate1; // === bill0

const DURATION = 1900; // ms

const fmtB = (v: number) => `$${(v / 1e9).toFixed(2)}B`;
const fmtM = (v: number) => `$${Math.round(v / 1e6)}M`;
const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;
const fmtBill = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

type Row = {
  key: string;
  label: string;
  before: number;
  after: number;
  fmt: (v: number) => string;
  color: string;
  note: string;
};

const ROWS: Row[] = [
  { key: "value", label: "Town's total value", before: VAL0, after: val1, fmt: fmtB, color: "var(--color-ink-faint)", note: "+20%" },
  { key: "levy", label: "The levy (the cap)", before: LEVY, after: LEVY, fmt: fmtM, color: "var(--color-gold-strong)", note: "pinned" },
  { key: "rate", label: "Tax rate", before: rate0, after: rate1, fmt: fmtPct, color: "var(--color-debt)", note: "−17%" },
  { key: "bill", label: "Your bill", before: bill0, after: bill1, fmt: fmtBill, color: "var(--color-accent)", note: "unchanged" },
];

// The track runs 0–140% of each figure's "before" level; the before tick sits at 100/140.
const SPAN = 140;
const BASE = (100 / SPAN) * 100;

export default function ReassessmentWash() {
  const raf = useRef<number | null>(null);
  const [t, setT] = useState(0);
  const [played, setPlayed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const run = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / DURATION);
      setT(1 - Math.pow(1 - p, 3)); // easeOutCubic
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  const trigger = () => {
    setPlayed(true);
    if (reduced) {
      setT(1);
      return;
    }
    run();
  };

  return (
    <figure className="rounded-md border border-rule bg-bg-card/50 p-5">
      {/* the formula */}
      <div className="rounded-md border border-rule bg-bg px-4 py-3.5 text-center">
        <div className="font-display text-[1.0625rem] font-semibold text-ink sm:text-[1.1875rem]">
          Rate <span className="text-ink-faint">=</span> Levy <span className="text-ink-faint">÷</span> Town&apos;s total value
        </div>
        <div className="mt-1.5 text-[0.9375rem] text-ink-mid">
          Your bill <span className="text-ink-faint">=</span> Your value <span className="text-ink-faint">×</span> Rate
        </div>
      </div>

      {/* state label */}
      <div className="mt-5 flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">
        <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: played ? "var(--color-accent)" : "var(--color-ink-faint)" }} />
        {played ? "After a 20% town-wide revaluation" : "Before the revaluation"}
      </div>

      {/* the wash */}
      <div className="mt-2.5 flex flex-col gap-3.5">
        {ROWS.map((row) => {
          const level = 100 + (row.after / row.before - 1) * 100 * t; // 100 → after-level
          const width = (level / SPAN) * 100;
          const val = row.before + (row.after - row.before) * t;
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.84375rem] font-medium text-ink">{row.label}</span>
                <span className="flex items-baseline gap-2">
                  <span className="text-[0.9375rem] font-bold tabular-nums text-ink">{row.fmt(val)}</span>
                  <span
                    className="w-[68px] text-right text-[0.75rem] font-semibold tabular-nums"
                    style={{ color: row.color, opacity: t }}
                  >
                    {row.note}
                  </span>
                </span>
              </div>
              <div className="relative mt-1 h-3 rounded-sm border border-rule bg-bg">
                <div className="h-full rounded-sm" style={{ width: `${width}%`, background: row.color }} />
                <span className="absolute inset-y-[-2px] w-px bg-ink-faint opacity-50" style={{ left: `${BASE}%` }} aria-hidden />
              </div>
            </div>
          );
        })}
      </div>

      {/* trigger */}
      <div className="mt-5 flex flex-col items-center gap-2">
        {!played ? (
          <>
            <button
              onClick={trigger}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-accent-deep"
            >
              <span aria-hidden className="text-[0.8125rem]">▶</span> Watch a 20% revaluation
            </button>
            <span className="text-[0.75rem] text-ink-faint">One town-wide revaluation. Press play to watch all four numbers move.</span>
          </>
        ) : (
          <button
            onClick={trigger}
            className="inline-flex items-center gap-1.5 rounded-sm border border-accent px-3 py-1 text-[0.75rem] font-semibold text-accent transition-colors hover:bg-accent/10"
          >
            <span aria-hidden>↻</span> {reduced ? "Show again" : "Replay"}
          </button>
        )}
      </div>

      <figcaption className="mt-4 text-[0.78125rem] leading-relaxed text-ink-faint">
        The tick marks each figure&apos;s level before the revaluation. The levy is held flat and your home rises with the town, to
        isolate what a revaluation alone does.
      </figcaption>
    </figure>
  );
}
