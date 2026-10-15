import { BUSINESS_FILL, DENSITY_STEPS, INDUSTRIAL_FILL, displayCode } from "./zoning";

/** The legend under the big map. Swatches carry identity; every label is plain ink. */
export function MapLegend() {
  return (
    <div className="mt-3 grid gap-4 text-[0.8125rem] text-ink-mid sm:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="font-semibold text-ink">Homes, from fewest to most per acre</p>
        <div className="mt-1.5 flex">
          {DENSITY_STEPS.map((s) => (
            <div key={s.fill} className="flex-1">
              <div className="h-3.5 border-y border-l border-black/15 last:border-r" style={{ background: s.fill }} />
              <p className="mt-1 text-center text-[0.6875rem] leading-tight">{s.zones.map(displayCode).join(" ")}</p>
            </div>
          ))}
        </div>
      </div>
      <ul className="space-y-1.5">
        <li className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 rounded-sm" style={{ background: BUSINESS_FILL }} aria-hidden />
          Business: CN, CC, CG
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-5 rounded-sm" style={{ background: INDUSTRIAL_FILL }} aria-hidden />
          Industrial and office parks: IR, IG
        </li>
        <li className="flex items-center gap-2">
          <svg width="20" height="14" aria-hidden className="rounded-sm">
            <defs>
              <pattern id="bz-legend-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="#8a8175" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#d8d2c8" strokeWidth="2.5" />
              </pattern>
            </defs>
            <rect width="20" height="14" fill="url(#bz-legend-hatch)" />
          </svg>
          Special: HD, BHD, WDR, MOSR
        </li>
        <li className="text-[0.75rem] text-ink-faint">White gaps are streets, railroad and water, which are not parcels.</li>
      </ul>
    </div>
  );
}
