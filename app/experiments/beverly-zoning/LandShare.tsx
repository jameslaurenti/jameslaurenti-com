"use client";

import { useState } from "react";
import { FAMILIES, STATS, displayCode, fmt } from "./zoning";

/**
 * How Beverly’s land divides among the families of districts. One series, so one color; each
 * bar is labeled directly, and hovering or focusing a row shows its acres and lot count.
 */
export default function LandShare() {
  const total = Object.values(STATS).reduce((s, d) => s + d.acres, 0);
  const rows = FAMILIES.map((f) => {
    const acres = f.zones.reduce((s, z) => s + (STATS[z]?.acres ?? 0), 0);
    const lots = f.zones.reduce((s, z) => s + (STATS[z]?.parcels ?? 0), 0);
    return { id: f.id, label: f.label, zones: f.zones, acres, lots, share: (100 * acres) / total };
  }).sort((a, b) => b.acres - a.acres);
  const max = rows[0].share;
  const [active, setActive] = useState<string | null>(null);

  return (
    <figure className="mt-6">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Share of Beverly’s land in each family of zoning districts, from the FY2027 assessor records
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Kind of district</th>
            <th scope="col">Share of land</th>
            <th scope="col">Acres and lots</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const on = active === r.id;
            return (
              <tr
                key={r.id}
                tabIndex={0}
                onMouseEnter={() => setActive(r.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(r.id)}
                onBlur={() => setActive(null)}
                className="align-middle outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <th scope="row" className="w-[38%] py-1.5 pr-3 text-[0.875rem] font-normal leading-tight sm:w-[30%]">
                  <span className="block text-ink">{r.label}</span>
                  <span className="block text-[0.75rem] text-ink-faint">{r.zones.map(displayCode).join(", ")}</span>
                </th>
                <td className="py-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-5 rounded-r-[4px] bg-accent transition-opacity"
                      style={{ width: `${Math.max(0.6, (r.share / max) * 88)}%`, opacity: active && !on ? 0.45 : 1 }}
                      aria-hidden
                    />
                    <span className="shrink-0 text-[0.875rem] font-semibold tabular-nums text-ink">
                      {r.share < 1 ? r.share.toFixed(1) : Math.round(r.share)}%
                    </span>
                  </div>
                  <div className={`text-[0.75rem] text-ink-mid ${on ? "" : "sr-only"}`}>
                    {fmt(Math.round(r.acres))}{" "}acres · {fmt(r.lots)} lots
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </figure>
  );
}
