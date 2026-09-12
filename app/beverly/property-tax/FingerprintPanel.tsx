"use client";

import { type TownShape, type ShapeLabel, SHAPE_COLORS, SHAPE_BADGE_COLORS, SHAPE_DISPLAY } from "@/lib/beverly/taxData";

const SHAPE_DESC: Record<ShapeLabel, string> = {
  Develops:
    "Grows its tax base through new construction. That is how it funds itself above the 2.5% floor, without a vote.",
  Overrides:
    "Its voters have approved raising taxes past the 2.5% cap for services, more than once.",
  "Aid-reliant":
    "A large share of its budget comes from the state, not the local tax levy.",
  "Banks within the cap":
    "Funds itself inside the 2.5% cap. It neither overrides nor grows its base quickly.",
};

const usd = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;

function Bar({ label, value, pctile, note, color }: { label: string; value: string; pctile: number; note: string; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[0.8125rem] font-medium text-ink">{label}</span>
        <span className="text-[0.6875rem] tabular-nums text-ink-mid">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-sm border border-rule bg-bg">
        <div className="h-full rounded-sm" style={{ width: `${Math.max(pctile, 1.5)}%`, background: color }} />
      </div>
      <div className="mt-1 text-[0.6875rem] text-ink-faint">{note}</div>
    </div>
  );
}

export default function FingerprintPanel({
  name,
  county,
  town,
  onFocus,
}: {
  name: string;
  county: string | null;
  town: TownShape;
  onFocus: (n: string) => void;
}) {
  const { levers } = town;
  const overrideNote =
    levers.override.operatingOverridesPassed > 0
      ? `${levers.override.operatingOverridesPassed} operating override${levers.override.operatingOverridesPassed > 1 ? "s" : ""} passed · ${levers.override.pctile}th percentile`
      : "never passed an operating override";

  return (
    <div>
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
        {county && <span className="text-sm text-ink-faint">{county} County</span>}
        <span
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold text-white"
          style={{ background: SHAPE_BADGE_COLORS[town.shape] }}
        >
          {SHAPE_DISPLAY[town.shape]}
        </span>
      </div>
      <p className="mb-4 text-[0.8125rem] leading-relaxed text-ink-mid">{SHAPE_DESC[town.shape]}</p>

      <div className="flex flex-col gap-3">
        <Bar
          label="Develops"
          value={`${levers.develop.newGrowthPctOfLevy.toFixed(2)}% of levy/yr`}
          pctile={levers.develop.pctile}
          note={`${levers.develop.pctile}th percentile · ${levers.develop.commercialShare}% commercial`}
          color={SHAPE_COLORS["Develops"]}
        />
        <Bar
          label="Overrides"
          value={`${levers.override.operatingOverridesPassed} passed`}
          pctile={levers.override.pctile}
          note={overrideNote}
          color={SHAPE_COLORS["Overrides"]}
        />
        <Bar
          label="State aid"
          value={`${levers.aid.stateShareOfRevenue.toFixed(1)}% of revenue`}
          pctile={levers.aid.pctile}
          note={`${levers.aid.pctile}th percentile statewide`}
          color={SHAPE_COLORS["Aid-reliant"]}
        />
        <Bar
          label="Property wealth"
          value={usd(levers.wealth.eqvPerCapita)}
          pctile={levers.wealth.pctile}
          note={`${levers.wealth.pctile}th percentile · value per resident`}
          color={SHAPE_COLORS["Banks within the cap"]}
        />
      </div>

      <div className="mt-5">
        <h4 className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">Towns with the most similar shape</h4>
        <div className="flex flex-wrap gap-1.5">
          {town.neighbors.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onFocus(n)}
              className="rounded-full border border-rule bg-bg px-2.5 py-1 text-[0.75rem] text-ink-mid transition-colors hover:border-accent hover:text-accent"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
