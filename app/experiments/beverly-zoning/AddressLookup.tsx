"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { type AddressHit, useZoning } from "./ZoningState";
import { Unchecked } from "./ui";
import { displayCode, districtName, familyOf, formatSqft, likelyCC2, titleCase, USE_LABEL } from "./zoning";

/**
 * "What zone am I in?" Searches the assessor’s street addresses entirely in the browser. The
 * address file (about 130 KB compressed) loads the first time the box gets focus, and no
 * search ever leaves the reader’s device.
 */

const DATA_URL = "/experiments/beverly-zoning/addresses.json";
type Row = [string, string, number, number, number, string];

// Readers type "Street" and "Avenue"; the assessor writes ST and AVE.
const ABBREV: Record<string, string> = {
  STREET: "ST",
  AVENUE: "AVE",
  AV: "AVE",
  ROAD: "RD",
  DRIVE: "DR",
  LANE: "LN",
  COURT: "CT",
  PLACE: "PL",
  TERRACE: "TER",
  CIRCLE: "CIR",
  PARKWAY: "PKWY",
  BOULEVARD: "BLVD",
  SQUARE: "SQ",
  HIGHWAY: "HWY",
  EXTENSION: "EXT",
  POINT: "PT",
  NORTH: "N",
  SOUTH: "S",
  EAST: "E",
  WEST: "W",
};

function normalize(q: string): string {
  return q
    .toUpperCase()
    .replace(/[.,#]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ABBREV[w] ?? w)
    .join(" ");
}

let cache: Promise<Row[]> | null = null;
function loadRows(): Promise<Row[]> {
  cache ??= fetch(DATA_URL)
    .then((r) => r.json())
    .then((d: { rows: Row[] }) => d.rows)
    .catch((e) => {
      cache = null;
      throw e;
    });
  return cache;
}

export default function AddressLookup({ id = "lookup" }: { id?: string }) {
  const { hit, lookUp } = useZoning();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);

  const ensureLoaded = useCallback(() => {
    if (rows || failed) return;
    loadRows()
      .then(setRows)
      .catch(() => setFailed(true));
  }, [rows, failed]);

  const results = useMemo(() => {
    if (!rows) return [];
    const nq = normalize(q);
    if (nq.length < 3) return [];
    const starts: Row[] = [];
    const contains: Row[] = [];
    const tokens = nq.split(" ");
    for (const r of rows) {
      if (r[0].startsWith(nq)) starts.push(r);
      else if (tokens.every((t) => r[0].includes(t))) contains.push(r);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [rows, q]);

  const choose = (r: Row) => {
    const h: AddressHit = { address: titleCase(r[0]), zone: r[1], lat: r[2], lon: r[3], lotSqft: r[4], use: r[5] };
    lookUp(h);
    setQ(titleCase(r[0]));
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && results.length > 0;
  const nq = normalize(q);

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-[0.8125rem] font-semibold text-ink-mid">
        Your street address in Beverly
      </label>
      <input
        ref={input}
        id={id}
        type="text"
        inputMode="search"
        autoComplete="off"
        spellCheck={false}
        placeholder="e.g. 191 Cabot St"
        value={q}
        onFocus={() => {
          ensureLoaded();
          setOpen(true);
        }}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKey}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? `${listId}-${active}` : undefined}
        className="mt-1 w-full rounded-md border border-ink-faint/50 bg-white px-3 py-2.5 text-[1rem] text-ink placeholder:text-ink-faint"
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Matching addresses"
        className={`absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-rule bg-white shadow-lg ${
          showList ? "" : "hidden"
        }`}
      >
        {results.map((r, i) => (
          <li
            key={r[0]}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              e.preventDefault();
              choose(r);
            }}
            onMouseEnter={() => setActive(i)}
            className={`flex cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-[0.9375rem] ${
              i === active ? "bg-accent-glow" : ""
            }`}
          >
            <span>{titleCase(r[0])}</span>
            <span className="shrink-0 text-[0.75rem] font-semibold text-ink-faint">{displayCode(r[1])}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-[0.75rem] text-ink-faint" aria-live="polite">
        {failed
          ? "The address list did not load. Try again in a moment."
          : rows && nq.length >= 3 && results.length === 0
            ? "No match. Try just the number and street name, like 12 Hale St."
            : "Searches happen in your browser. Nothing you type is sent anywhere."}
      </p>

      {hit && <HitCard hit={hit} />}
    </div>
  );
}

function HitCard({ hit }: { hit: AddressHit }) {
  const fam = familyOf(hit.zone);
  return (
    <div className="mt-4 rounded-lg border border-accent/35 bg-accent-glow px-4 py-4" aria-live="polite">
      <p className="text-[0.9375rem] leading-relaxed">
        <b>{hit.address}</b> is in <b>{displayCode(hit.zone)}</b>, the {districtName(hit.zone, true)}
        {fam ? <>, one of Beverly’s {fam.label.toLowerCase()} districts</> : null}.
      </p>
      <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mid">
        The assessor lists it as {USE_LABEL[hit.use]?.toLowerCase() ?? "a property"} on a lot of about{" "}
        {formatSqft(hit.lotSqft)}.
      </p>
      {likelyCC2(hit.zone, hit.address) && (
        <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mid">
          Because it fronts Cabot Street, it is likely in the CC2 subdistrict, where buildings are capped at 45 feet and four
          stories.
          <Unchecked />
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem]">
        <a href="#districts" className="rlink">
          What {displayCode(hit.zone)} allows
        </a>
        <a href="#map" className="rlink">
          See it on the map
        </a>
      </div>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-faint">
        From the assessor’s records, not the official zoning map. A lot near a district line, or covered by an
        overlay, can have rules this does not show. The Building Department makes the official call.
      </p>
    </div>
  );
}

