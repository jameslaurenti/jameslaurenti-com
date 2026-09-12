"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapLibreMap,
  NavigationControl,
  AttributionControl,
  GeoJSONSource,
  setWorkerUrl,
  type MapLayerMouseEvent,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import data from "@/data/beverly/vehicle-incidents.json";

type Incident = (typeof data)["incidents"][number];

const META = data._meta;
const ALL: Incident[] = data.incidents;

const BEVERLY = { lon: -70.8801, lat: 42.5584, zoom: 13 };

// Free vector basemap, no API key. Swap the style URL if the site ever gets a
// Mapbox token; the layer code below is the same either way.
const BASEMAP = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// MapLibre would otherwise look for its worker next to its own bundle, which
// under Next's bundler is a hashed chunk path where the file does not exist.
// The request lands on the HTML 404 page, the worker never starts, and the map
// draws no tiles while style and sprites load normally. scripts/copy-maplibre-
// worker.mjs puts the worker here on predev and prebuild.
setWorkerUrl("/vendor/maplibre/maplibre-gl-worker.mjs");

// Ground radius the circles stand for. A block is drawn as an area, never as a
// pin, because the underlying location is a block and not a house.
const BLOCK_M = 70;
const STREET_M = 160;
const M_PER_PX_Z12 = 115430 / 2 ** 12; // at Beverly's latitude

// A 70m block is only about 3px across when the whole city is in frame, which
// is honest and unreadable. Circles get a floor at low zoom so the two kinds
// stay tellable apart, and are ground-true from zoom 14 up where a reader is
// actually judging location.
const MIN_PX = 5;

const fmtDay = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
});
const fmtTime = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
});
const fmtStamp = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** Read a palette token so the canvas and the CSS never drift apart. */
function token(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export default function VehicleIncidentsPage() {
  const [windowDays, setWindowDays] = useState(META.defaultWindowDays);
  const [selected, setSelected] = useState<string | null>(null);

  const coverageDays = META.coverageDays;
  const fullWindowDays = Math.floor(coverageDays);

  const shown = useMemo(() => {
    const cutoff = Date.parse(META.coverageEnd) - windowDays * 86400000;
    return ALL.filter((i) => Date.parse(i.at) >= cutoff);
  }, [windowDays]);

  const confirmed = shown.filter((i) => i.kind === "confirmed").length;
  const suspicious = shown.length - confirmed;

  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: shown.map((i) => ({
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [i.lon, i.lat] },
        properties: { id: i.id, kind: i.kind, precision: i.precision },
      })),
    }),
    [shown],
  );

  // Build the map once.
  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: mapNode.current,
      style: BASEMAP,
      center: [BEVERLY.lon, BEVERLY.lat],
      zoom: BEVERLY.zoom,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution:
          '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attributions">CARTO</a>, incidents from <a href="https://scanner.beverlybrief.com">BevScan</a>',
      }),
      "bottom-right",
    );

    map.on("load", () => {
      const debt = token("--color-debt", "#9c4a24");
      const gold = token("--color-gold", "#b8923a");
      const goldStrong = token("--color-gold-strong", "#7e6120");

      map.addSource("incidents", { type: "geojson", data: geojson });

      // Radius doubles per zoom level so the circle keeps a constant footprint
      // on the ground: BLOCK_M for a block, STREET_M when only the street is
      // known. A wider circle reads as a looser location, which is the truth.
      //
      // The precision test lives inside each zoom stop rather than wrapping two
      // interpolations in a `case`: MapLibre permits only one `interpolate` per
      // expression and rejects the whole layer otherwise.
      const px = (metres: number, zoom: number) =>
        Math.max((metres / M_PER_PX_Z12) * 2 ** (zoom - 12), MIN_PX);
      const atZoom = (zoom: number) => [
        "case",
        ["==", ["get", "precision"], "street"],
        px(STREET_M, zoom),
        px(BLOCK_M, zoom),
      ];
      const radius = [
        "interpolate",
        ["exponential", 2],
        ["zoom"],
        11,
        atZoom(11),
        14,
        atZoom(14),
        18,
        atZoom(18),
      ];

      map.addLayer({
        id: "incident-fill",
        type: "circle",
        source: "incidents",
        paint: {
          "circle-radius": radius as never,
          "circle-color": ["case", ["==", ["get", "kind"], "confirmed"], debt, gold] as never,
          "circle-opacity": ["case", ["==", ["get", "kind"], "confirmed"], 0.34, 0.26] as never,
          "circle-stroke-width": 1.5,
          "circle-stroke-color": [
            "case",
            ["==", ["get", "kind"], "confirmed"],
            debt,
            goldStrong,
          ] as never,
          "circle-stroke-opacity": 0.85,
        },
      });

      map.on("click", "incident-fill", (e: MapLayerMouseEvent) => {
        const f = e.features?.[0];
        if (f) setSelected(String(f.properties?.id));
      });
      map.on("mouseenter", "incident-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "incident-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      setMapReady(true);
    });

    // MapLibre only watches the window, so a container that changes size on its
    // own leaves the canvas at its old dimensions and the map never requests
    // tiles for the area now on screen. That happens whenever the map mounts
    // inside a hidden or zero-height parent and is revealed afterwards.
    const ro = new ResizeObserver(() => map.resize());
    ro.observe(mapNode.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // geojson is intentionally not a dependency: the source is updated below
    // rather than rebuilding the whole map when the window changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push new data when the window toggles.
  useEffect(() => {
    if (!mapReady) return;
    const src = mapRef.current?.getSource("incidents");
    if (src && "setData" in src) (src as GeoJSONSource).setData(geojson);
  }, [geojson, mapReady]);

  const focus = useCallback((i: Incident) => {
    setSelected(i.id);
    const map = mapRef.current;
    if (!map) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opts = { center: [i.lon, i.lat] as [number, number], zoom: Math.max(map.getZoom(), 15) };
    if (reduce) map.jumpTo(opts);
    else map.flyTo({ ...opts, speed: 0.9 });
  }, []);

  const selectedIncident = shown.find((i) => i.id === selected) ?? null;
  const thin = shown.length < 10;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="max-w-3xl">
        <h1 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Vehicle break-ins on the police scanner
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-mid">
          Where Beverly&rsquo;s vehicle break-in and car-check calls went out over the police radio,
          shown at block level. Two different things are on this map, kept apart: calls where someone
          reported a car actually broken into, and calls about suspicious behaviour near a car.
        </p>
      </header>

      {/* Caveats sit above the map on purpose. A reader meets the limits of this
          data before they meet a single circle. */}
      <section
        aria-labelledby="caveat-heading"
        className="mt-8 rounded border border-accent/30 bg-accent-glow p-5"
      >
        <h2
          id="caveat-heading"
          className="font-display text-sm uppercase tracking-wider text-accent-deep"
        >
          Read this first
        </h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-mid">
          This map is built from public safety radio traffic, not from police reports. It shows the
          location a call was dispatched to, which is not always where an incident occurred. Most
          vehicle break-ins are discovered the next morning and reported by phone or in person, and
          those never go out over the radio, so this map undercounts. Locations are shown at block
          level. Street names transcribed from radio audio contain errors. This is not an official
          record. For the authoritative account, see the Beverly Police Department daily logs.
        </p>
      </section>

      {/* Counts, window, and what was lost getting here. */}
      <section className="mt-8 border-t border-rule pt-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-4xl leading-none text-ink">{shown.length}</p>
            <p className="mt-1.5 text-sm text-ink-mid">
              {shown.length === 1 ? "call" : "calls"} in the last {windowDays} days
            </p>
          </div>

          <div
            className="flex overflow-hidden rounded border border-rule"
            role="group"
            aria-label="Time window"
          >
            {[META.defaultWindowDays, fullWindowDays].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setWindowDays(d)}
                aria-pressed={windowDays === d}
                className={`px-3.5 py-2 text-sm transition-colors ${
                  windowDays === d
                    ? "bg-accent text-white"
                    : "bg-bg-card text-ink-mid hover:text-accent"
                }`}
              >
                {d === META.defaultWindowDays ? "7 days" : `Full window (${d} days)`}
              </button>
            ))}
          </div>
        </div>

        <dl className="mt-5 grid gap-x-8 gap-y-3 text-[0.875rem] sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="text-ink-faint">Reported break-ins</dt>
            <dd className="font-medium text-debt">{confirmed}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-faint">Suspicious-activity calls</dt>
            <dd className="font-medium text-gold-strong">{suspicious}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-faint">Window covered</dt>
            <dd className="text-ink-mid">
              {fmtStamp.format(new Date(META.coverageStart))} to{" "}
              {fmtStamp.format(new Date(META.coverageEnd))}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-faint">Data pulled</dt>
            <dd className="text-ink-mid">{fmtStamp.format(new Date(META.retrieved))}</dd>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <dt className="text-ink-faint">Dropped for unresolvable locations</dt>
            <dd className="text-ink-mid">
              {META.counts.droppedUnresolvable} over the full window
              {META.counts.duplicatesMerged > 0 &&
                `, plus ${META.counts.duplicatesMerged} merged as the same call heard twice`}
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-faint">
          A reported break-in is a call where someone said a vehicle had been entered. A
          suspicious-activity call is a call about behaviour, someone trying door handles or standing
          near a car. The second is not evidence of the first, and the map keeps them apart.
        </p>

        {thin && (
          <p className="mt-3 border-l-2 border-gold pl-3 text-[0.875rem] leading-relaxed text-ink-mid">
            At {shown.length} {shown.length === 1 ? "call" : "calls"}, this is too little data to
            show a pattern. A week that runs a call or two above or below another week is noise, not
            a trend. Over the full {coverageDays.toFixed(1)} days covered here the rate is{" "}
            {META.counts.perDayOverCoverage} calls a day, and that is the only baseline this page can
            honestly offer.
          </p>
        )}
      </section>

      {/* Map */}
      <section className="mt-8" aria-label="Map of vehicle incident calls">
        <div
          ref={mapNode}
          className="h-[26rem] w-full overflow-hidden rounded border border-rule sm:h-[32rem]"
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] text-ink-mid">
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-3.5 w-3.5 rounded-full border border-debt bg-debt/35"
            />
            Reported break-in
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-3.5 w-3.5 rounded-full border border-gold-strong bg-gold/30"
            />
            Suspicious-activity call
          </span>
          <span className="text-ink-faint">
            A wider circle means only the street was known, not the block.
          </span>
        </div>
      </section>

      {selectedIncident && (
        <aside className="mt-5 rounded border border-accent/40 bg-bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-lg text-ink">{selectedIncident.label}</p>
              <p className="mt-1 text-sm text-ink-mid">
                {selectedIncident.location} &middot; {fmtDay.format(new Date(selectedIncident.at))},{" "}
                {fmtTime.format(new Date(selectedIncident.at))}
              </p>
              {selectedIncident.precision === "street" && (
                <p className="mt-1 text-[0.8125rem] text-ink-faint">
                  Street level only. The block was not resolvable.
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="shrink-0 text-sm text-ink-faint transition-colors hover:text-accent"
              aria-label="Close incident detail"
            >
              Close
            </button>
          </div>
          <a
            href={selectedIncident.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-accent underline underline-offset-2 hover:text-accent-deep"
          >
            The record on BevScan
          </a>
        </aside>
      )}

      {/* The list is not a secondary view. At these counts it carries more than
          the map does. */}
      <section className="mt-10" aria-labelledby="list-heading">
        <h2 id="list-heading" className="font-display text-xl text-ink">
          Every call, newest first
        </h2>
        {shown.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] text-ink-mid">
            No vehicle calls went out over the radio in this window.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-rule border-y border-rule">
            {shown.map((i) => {
              const isSel = i.id === selected;
              return (
                <li key={i.id}>
                  <div
                    className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1 py-3 transition-colors ${
                      isSel ? "bg-accent-glow" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => focus(i)}
                      className="text-left font-medium text-ink underline-offset-2 hover:underline"
                      aria-label={`Show ${i.location} on the map`}
                    >
                      {i.location}
                    </button>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.6875rem] uppercase tracking-wide ${
                        i.kind === "confirmed"
                          ? "bg-debt/12 text-debt"
                          : "bg-gold/20 text-gold-strong"
                      }`}
                    >
                      {i.kind === "confirmed" ? "Reported" : "Suspicious"}
                    </span>
                    <span className="text-sm text-ink-mid">{i.label}</span>
                    <span className="ml-auto whitespace-nowrap text-sm text-ink-faint">
                      {fmtDay.format(new Date(i.at))}, {fmtTime.format(new Date(i.at))}
                    </span>
                    <a
                      href={i.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap text-sm text-accent underline underline-offset-2 hover:text-accent-deep"
                    >
                      BevScan
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10 border-t border-rule pt-6 text-[0.8125rem] leading-relaxed text-ink-faint">
        <h2 className="font-display text-sm uppercase tracking-wider text-ink-mid">
          How this was built
        </h2>
        <p className="mt-3">
          Incidents come from{" "}
          <a
            href="https://scanner.beverlybrief.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            BevScan
          </a>
          , which transcribes Beverly&rsquo;s unencrypted police radio and extracts incidents from
          it. Its categories have no vehicle-specific value, so incident type here is inferred from
          the transcript text and will miss calls and mislabel some. House numbers are rounded down
          to the block before anything is geocoded, so no specific address is stored. Locations come
          from the US Census Bureau geocoder. Descriptions of people are never carried over from the
          source.
        </p>
        <p className="mt-3">
          The window is {coverageDays.toFixed(1)}{" "}
          days because that is what BevScan&rsquo;s API
          serves completely. Older weeks are reachable only through search, which returns a small
          and relevance-ranked sample, so including them would make recent weeks look busier than
          older ones for no reason other than how the data was fetched.
        </p>
      </section>
    </main>
  );
}
