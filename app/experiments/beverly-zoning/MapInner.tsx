"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import styles from "./map.module.css";
import type { AddressHit } from "./ZoningState";
import { HATCHED, ZONE_FILL, displayCode, districtName } from "./zoning";

/**
 * The Leaflet map. Loaded only in the browser (see ZoningMap.tsx), so it can touch window.
 *
 * Fills are opaque on purpose: the district shapes are built from parcels, so streets are
 * gaps between them, and the basemap's streets show through those gaps while its labels draw
 * on top in their own pane. If the tiles fail to load, the parcel fabric still reads as a map.
 */

const DATA_URL = "/experiments/beverly-zoning/districts.geojson";
const INK = "#1a1815";
const BOUNDS = L.latLngBounds([42.5385, -70.9235], [42.592, -70.7925]);

type Props = {
  selected: string | null;
  hit: AddressHit | null;
  onSelect: (zone: string) => void;
};

type DistrictsFile = GeoJSON.FeatureCollection & { labels: [string, number, number, number][] };

function styleFor(zone: string, selected: string | null): L.PathOptions {
  const isSel = selected === zone;
  const dim = selected !== null && !isSel;
  return {
    fillColor: HATCHED.has(zone) ? "url(#bz-hatch)" : ZONE_FILL[zone] ?? "#cfc8bc",
    fillOpacity: dim ? 0.28 : 0.9,
    color: isSel ? INK : "#ffffff",
    weight: isSel ? 2.5 : 0.6,
    opacity: 1,
  };
}

export default function MapInner({ selected, hit, onSelect }: Props) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.GeoJSON | null>(null);
  const pin = useRef<L.CircleMarker | null>(null);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    selectedRef.current = selected;
    onSelectRef.current = onSelect;
  });

  // ---- create the map once
  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      minZoom: 12,
      maxZoom: 19,
      zoomSnap: 0.5,
      maxBounds: BOUNDS.pad(0.5),
    });
    map.current = m;
    m.fitBounds(BOUNDS, { padding: [6, 6] });
    L.control.zoom({ position: "topright" }).addTo(m);
    m.attributionControl.setPrefix(false);

    // Scroll-wheel zoom only once the reader has clicked into the map, so scrolling the page
    // past it never gets hijacked.
    m.on("click focus", () => m.scrollWheelZoom.enable());
    m.on("blur mouseout", () => m.scrollWheelZoom.disable());

    m.createPane("zoneLabels").style.zIndex = "620";
    m.createPane("pin").style.zIndex = "630";
    m.createPane("baseLabels").style.zIndex = "640";
    for (const pane of ["zoneLabels", "pin", "baseLabels"]) m.getPane(pane)!.style.pointerEvents = "none";

    const tileOpts = {
      subdomains: "abcd",
      maxZoom: 19,
      detectRetina: true,
    };
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      ...tileOpts,
      attribution:
        'Zoning: assessor records via <a href="https://www.mass.gov/info-details/massgis-data-property-tax-parcels">MassGIS</a> &middot; Basemap &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(m);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png", {
      ...tileOpts,
      pane: "baseLabels",
    }).addTo(m);

    let cancelled = false;
    fetch(DATA_URL)
      .then((r) => r.json() as Promise<DistrictsFile>)
      .then((gj) => {
        if (cancelled) return;

        // A hatch for the special-purpose districts, so they read as "different kind of thing"
        // without spending a fourth hue. Injected into the overlay SVG that Leaflet draws into.
        const gjLayer = L.geoJSON(gj, {
          style: (f) => styleFor(f?.properties?.zone, selectedRef.current),
          onEachFeature: (f, lyr) => {
            const zone: string = f.properties.zone;
            lyr.bindTooltip(`<strong>${displayCode(zone)}</strong> &middot; ${districtName(zone, true)}`, {
              sticky: true,
              direction: "top",
              className: styles.tip,
            });
            lyr.on("click", () => onSelectRef.current(zone));
          },
        }).addTo(m);
        layer.current = gjLayer;
        const svg = m.getPanes().overlayPane.querySelector("svg");
        if (svg && !svg.querySelector("#bz-hatch")) {
          const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
          defs.innerHTML =
            '<pattern id="bz-hatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">' +
            '<rect width="7" height="7" fill="#8a8175"/><line x1="0" y1="0" x2="0" y2="7" stroke="#d8d2c8" stroke-width="2.5"/></pattern>';
          svg.prepend(defs);
        }

        // District codes printed on the map, so identity never rests on color alone. Larger
        // areas get a label sooner as you zoom in; small blocks only up close.
        const byZoom = new Map<number, L.LayerGroup>();
        for (const [zone, lat, lon, minZoom] of gj.labels) {
          if (!byZoom.has(minZoom)) byZoom.set(minZoom, L.layerGroup());
          L.marker([lat, lon], {
            pane: "zoneLabels",
            interactive: false,
            keyboard: false,
            icon: L.divIcon({ className: styles.label, html: `<span>${displayCode(zone)}</span>`, iconSize: [0, 0] }),
          }).addTo(byZoom.get(minZoom)!);
        }
        const syncLabels = () => {
          const z = m.getZoom();
          byZoom.forEach((group, minZoom) => {
            if (z >= minZoom) group.addTo(m);
            else group.remove();
          });
        };
        m.on("zoomend", syncLabels);
        syncLabels();
      })
      .catch(() => {
        if (!cancelled && el.current) el.current.dataset.failed = "true";
      });

    return () => {
      cancelled = true;
      m.remove();
      map.current = null;
      layer.current = null;
      pin.current = null;
    };
  }, []);

  // ---- restyle when the selected district changes
  useEffect(() => {
    const gj = layer.current;
    if (!gj) return;
    gj.eachLayer((lyr) => {
      const path = lyr as L.Path & { feature?: GeoJSON.Feature };
      const zone = path.feature?.properties?.zone as string;
      path.setStyle(styleFor(zone, selected));
      if (zone === selected) path.bringToFront();
    });
  }, [selected]);

  // ---- drop a pin and fly to a looked-up address
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (!hit) {
      pin.current?.remove();
      pin.current = null;
      return;
    }
    const ll = L.latLng(hit.lat, hit.lon);
    if (!pin.current) {
      pin.current = L.circleMarker(ll, {
        radius: 8,
        color: INK,
        weight: 3,
        fillColor: "#ffffff",
        fillOpacity: 1,
        pane: "pin",
      }).addTo(m);
    } else {
      pin.current.setLatLng(ll);
    }
    pin.current
      .bindTooltip(`${hit.address}<br><strong>${displayCode(hit.zone)}</strong> &middot; ${districtName(hit.zone, true)}`, {
        permanent: true,
        direction: "top",
        offset: [0, -8],
        className: styles.tip,
      })
      .openTooltip();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) m.setView(ll, 17);
    else m.flyTo(ll, 17, { duration: 0.8 });
  }, [hit]);

  return (
    <div
      ref={el}
      className={`${styles.map} h-full w-full`}
      role="region"
      aria-label="Map of Beverly's zoning districts. Use the district list or the address search above it for a text version."
    />
  );
}
