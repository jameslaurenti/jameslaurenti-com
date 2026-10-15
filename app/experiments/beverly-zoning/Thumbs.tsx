import minimap from "@/data/beverly/zoning-minimap.json";
import { MiniMap } from "./MiniMap";
import { FAMILIES, STATS, displayCode, fmt } from "./zoning";

/**
 * Thumbnail maps of Beverly. The outlines are pre-projected in data/beverly/zoning-minimap.json
 * and written into the page once, as <defs>; every thumbnail, including the one in the district
 * explorer, draws them by reference. That keeps the outlines out of the JavaScript bundle and
 * stops the city silhouette being repeated for each small map.
 */

export const MINIMAP_VIEWBOX = `0 0 ${minimap.width} ${minimap.height}`;

export function ThumbDefs() {
  const zones = minimap.zones as Record<string, string>;
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        <path id="bz-city" d={minimap.city} />
        {Object.entries(zones).map(([z, d]) => (
          <path key={z} id={`bz-z-${z}`} d={d} />
        ))}
      </defs>
    </svg>
  );
}

/** One small map per family of districts: the shape of the city's zoning at a glance. */
export function FamilyMaps() {
  const total = Object.values(STATS).reduce((s, d) => s + d.acres, 0);
  return (
    <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
      {FAMILIES.map((f) => {
        const acres = f.zones.reduce((s, z) => s + (STATS[z]?.acres ?? 0), 0);
        const share = (100 * acres) / total;
        const shareText = share < 1 ? "under 1" : String(Math.round(share));
        return (
          <li key={f.id}>
            <p className="font-display text-base font-semibold leading-snug">{f.label}</p>
            <p className="text-[0.8125rem] text-ink-faint">
              {f.zones.map(displayCode).join(", ")}{" "}· {fmt(Math.round(acres))} acres, {shareText}% of the land
            </p>
            <MiniMap
              viewBox={MINIMAP_VIEWBOX}
              zones={f.zones}
              label={`Map of Beverly with the ${f.label.toLowerCase()} districts highlighted: ${shareText} percent of the city’s land.`}
              className="mt-2"
            />
          </li>
        );
      })}
    </ul>
  );
}
