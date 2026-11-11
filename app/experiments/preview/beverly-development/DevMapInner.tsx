"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { COLOR, type MapEarlier, type MapSite } from "./DevMap";

/**
 * The Leaflet map for the development map. Loaded only in the browser (see DevMap.tsx). Pins are circles
 * colored by map group and sized by homes; each opens a short summary with a link to the site's page.
 */

const BEVERLY = L.latLngBounds([42.5385, -70.9235], [42.592, -70.7925]);
const BASE_URL = "/experiments/beverly-zoning/districts.geojson";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Radius by homes, on an area scale so a 440-home site doesn't swamp the map. */
const radius = (homes: number | null) => (homes && homes > 0 ? Math.max(6, Math.min(22, 4 + Math.sqrt(homes) * 0.9)) : 6);

function popup(s: MapSite) {
  const lines = [
    `<div style="font-family:inherit;max-width:240px">`,
    `<div style="font-weight:700;font-size:15px;line-height:1.3">${esc(s.name)}</div>`,
    `<div style="font-size:12px;color:#6b6055;margin-top:2px">Ward ${s.ward}${s.neighborhood ? ` · ${esc(s.neighborhood)}` : ""}</div>`,
    `<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:8px">${esc(s.chip)}</div>`,
    `<div style="font-size:13px;line-height:1.45;margin-top:4px">${esc(s.what)}</div>`,
    `<div style="font-size:12px;color:#6b6055;margin-top:6px">${s.decided ? `Decided ${esc(s.decided)}` : "Not decided"}${s.last ? ` · Last heard ${esc(s.last)}` : ""}</div>`,
    s.permit?.passed ? `<div style="font-size:12px;color:#9c4a24;margin-top:2px">Permit extension ran to ${esc(s.permit.label)}</div>` : "",
    `<a href="/experiments/preview/beverly-development/${encodeURIComponent(s.id)}" style="display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#2d6a4f">The record and sources →</a>`,
    `</div>`,
  ];
  return lines.join("");
}

function earlierPopup(b: MapEarlier) {
  const year = b.yearBasis === "assessor" ? `${b.year} (assessor's year built)` : `${b.year}: ${esc(b.yearBasis)}`;
  return [
    `<div style="font-family:inherit;max-width:240px">`,
    `<div style="font-weight:700;font-size:15px;line-height:1.3">${esc(b.name)}</div>`,
    `<div style="font-size:12px;color:#6b6055;margin-top:2px">${esc(b.address)} · Ward ${b.ward}</div>`,
    `<div style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:8px">Finished before 2021</div>`,
    `<div style="font-size:13px;line-height:1.45;margin-top:4px">${b.homes} homes · ${year}</div>`,
    b.who ? `<div style="font-size:12px;color:#6b6055;margin-top:2px">${esc(b.who)}</div>` : "",
    b.affordable ? `<div style="font-size:12px;color:#6b6055;margin-top:2px">Affordable: ${esc(b.affordable)}</div>` : "",
    `<div style="font-size:12px;margin-top:6px">${b.sources.map((s) => `<a href="${esc(s.href)}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join(" · ")}</div>`,
    b.story ? `<a href="${esc(b.story.href)}" style="display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#2d6a4f">${esc(b.story.label)} →</a>` : "",
    `</div>`,
  ].join("");
}

export default function DevMapInner({
  sites,
  colors,
  earlier,
}: {
  sites: MapSite[];
  colors: Record<string, string>;
  earlier: MapEarlier[];
}) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!box.current || map.current) return;
    const m = L.map(box.current, { zoomSnap: 0.25, scrollWheelZoom: false, maxBounds: BEVERLY.pad(0.6) });
    m.attributionControl.setPrefix(false);
    m.on("click focus", () => m.scrollWheelZoom.enable());
    // A self-hosted base: the zoning guide's district shapes, built from parcels, drawn in one quiet color. Streets
    // show as the gaps between them. (CARTO's basemaps now ask for an API key, so no third-party tiles here.)
    m.attributionControl.addAttribution(
      'Sites: city records · Base: parcels from <a href="https://www.mass.gov/info-details/massgis-data-property-tax-parcels">MassGIS</a>',
    );
    fetch(BASE_URL)
      .then((r) => r.json())
      .then((geo: GeoJSON.FeatureCollection) => {
        if (!map.current) return;
        L.geoJSON(geo, {
          interactive: false,
          style: { fillColor: "#e6e0d6", fillOpacity: 1, color: "#ffffff", weight: 0.5 },
        })
          .addTo(map.current)
          .bringToBack();
      })
      .catch(() => {});
    m.fitBounds(BEVERLY);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    const lg = layer.current;
    if (!m || !lg) return;
    lg.clearLayers();
    // The "Before 2021" lens: finished buildings, in the Built color. Largest first, so small ones stay clickable.
    [...earlier].sort((a, b) => b.homes - a.homes).forEach((b) => {
      L.circleMarker([b.lat, b.lng], {
        radius: radius(b.homes),
        color: "#ffffff",
        weight: 1.5,
        fillColor: COLOR.Built,
        fillOpacity: 0.9,
      })
        .bindPopup(earlierPopup(b))
        .bindTooltip(`${b.name} (${b.year})`, { direction: "top", offset: [0, -6] })
        .addTo(lg);
    });
    const color = (g: string) => colors[g] ?? "#b9b1a5";
    // Largest first, so small sites draw on top and stay clickable.
    [...sites]
      .sort((a, b) => (b.homes ?? 0) - (a.homes ?? 0))
      .forEach((s) => {
        const quiet = s.group === "Quiet or ended";
        L.circleMarker([s.lat, s.lng], {
          radius: radius(s.homes),
          color: quiet ? "#8a8178" : "#ffffff",
          weight: 1.5,
          fillColor: color(s.group),
          fillOpacity: quiet ? 0.35 : 0.9,
        })
          .bindPopup(popup(s))
          .bindTooltip(s.name, { direction: "top", offset: [0, -6] })
          .addTo(lg);
      });
    const pts = [...sites, ...earlier].map((s) => [s.lat, s.lng] as [number, number]);
    if (pts.length) m.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 15 });
    else m.fitBounds(BEVERLY);
  }, [sites, colors, earlier]);

  return (
    <div
      ref={box}
      className="h-full w-full"
      style={{ background: "#f7f5f1" }}
      role="application"
      aria-label="Map of development sites in Beverly"
    />
  );
}
