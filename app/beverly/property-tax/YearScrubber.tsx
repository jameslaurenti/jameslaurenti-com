"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  years: number[];
  value: number;
  onChange: (fy: number) => void;
};

export default function YearScrubber({ years, value, onChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const min = years[0];
  const max = years[years.length - 1];

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      onChange(value >= max ? min : value + 1);
    }, 900);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, value]);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause year animation" : "Play year animation"}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-lt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <rect x="2" y="1.5" width="3.5" height="11" rx="1" />
            <rect x="8.5" y="1.5" width="3.5" height="11" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
            <path d="M3 1.8v10.4a1 1 0 0 0 1.53.85l8.2-5.2a1 1 0 0 0 0-1.7l-8.2-5.2A1 1 0 0 0 3 1.8Z" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="font-display text-lg font-semibold tabular-nums text-ink">FY{value}</span>
          <span className="text-xs text-ink-faint">
            FY{min}–FY{max}
          </span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => {
            setPlaying(false);
            onChange(Number(e.target.value));
          }}
          aria-label="Fiscal year"
          className="w-full accent-accent"
        />
      </div>
    </div>
  );
}
