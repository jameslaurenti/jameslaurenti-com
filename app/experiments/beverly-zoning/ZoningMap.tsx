"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useZoning } from "./ZoningState";
import { DISTRICT_ORDER, displayCode, districtName } from "./zoning";
import { MapLegend } from "./MapLegend";

// Leaflet touches window on import, so the map itself never renders on the server.
const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => <MapPlaceholder text="Loading the map…" />,
});

function MapPlaceholder({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-bg-card text-[0.875rem] text-ink-faint">{text}</div>
  );
}

/**
 * The full map, mounted only when it scrolls near the viewport so readers who never get this
 * far never download Leaflet or the district shapes.
 */
export default function ZoningMap() {
  const { selected, hit, select } = useZoning();
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el || near) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [near]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <label className="flex w-full min-w-0 flex-col gap-1 text-[0.8125rem] font-semibold text-ink-mid sm:w-auto">
          Highlight a district
          <select
            value={selected ?? ""}
            onChange={(e) => select(e.target.value || null, "map-district-select")}
            className="w-full min-w-0 max-w-full rounded-md border border-ink-faint/40 bg-white px-3 py-2 text-[0.9375rem] font-normal text-ink sm:w-auto"
          >
            <option value="">All districts</option>
            {DISTRICT_ORDER.map((z) => (
              <option key={z} value={z}>
                {displayCode(z)} · {districtName(z, true)}
              </option>
            ))}
          </select>
        </label>
        {selected && (
          <button
            type="button"
            onClick={() => select(null, "map-clear")}
            className="rounded-md border border-ink-faint/40 px-3 py-2 text-[0.8125rem] text-ink-mid hover:bg-bg-card"
          >
            Clear highlight
          </button>
        )}
      </div>

      <div
        ref={box}
        className="relative isolate mt-3 overflow-hidden rounded-lg border border-rule"
        style={{ height: "clamp(360px, 64vh, 640px)" }}
      >
        {near ? (
          <MapInner selected={selected} hit={hit} onSelect={(z) => select(z, "map-click")} />
        ) : (
          <MapPlaceholder text="The map loads as you scroll to it." />
        )}
      </div>
      <MapLegend />
    </div>
  );
}
