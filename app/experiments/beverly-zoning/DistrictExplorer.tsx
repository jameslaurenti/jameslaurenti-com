"use client";

import guide from "@/data/beverly/zoning-guide.json";
import { MiniMap } from "./MiniMap";
import { Unchecked } from "./ui";
import { useZoning } from "./ZoningState";
import {
  DISTRICTS,
  FAMILIES,
  RULES_META,
  STATS,
  USE_SHORT,
  ZONE_FILL,
  HATCHED,
  displayCode,
  familyOf,
  fmt,
  formatSqft,
  likelyCC2,
  pct,
  type Sourced,
} from "./zoning";

/**
 * Pick a district (or arrive with one from the address lookup) and see what the ordinance says
 * about it next to what the assessor’s records say is actually there. The two columns are
 * deliberately separate: rules on the left, the ground on the right.
 */

const BELOW = guide.parcels.singleFamilyLotsBelowMin.byDistrict as Record<string, { lots: number; below: number }>;
const DEFAULT = "R10";

function needsCheck(s: { status: string } | null | undefined) {
  return !!s && s.status !== "confirmed" && s.status !== "digest" && s.status !== "assessor";
}

function Rule({ label, field, render }: { label: string; field: Sourced<string | number> | null; render?: (v: string | number) => string }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-x-3 border-t border-rule py-2 text-[0.9375rem]">
      <dt className="text-ink-mid">{label}</dt>
      <dd className="text-ink">
        {field ? (
          <>
            {render ? render(field.value) : String(field.value)}
            {needsCheck(field) && <Unchecked />}
            {field.status === "name" && <span className="ml-1.5 text-[0.75rem] text-ink-faint">(from the district’s name)</span>}
          </>
        ) : (
          <span className="text-ink-faint">Not yet checked</span>
        )}
      </dd>
    </div>
  );
}

export default function DistrictExplorer({ viewBox }: { viewBox: string }) {
  const { selected, select, hit } = useZoning();
  const zone = selected && DISTRICTS[selected] ? selected : DEFAULT;
  const d = DISTRICTS[zone];
  const s = STATS[zone];
  const fam = familyOf(zone);
  const below = BELOW[zone];
  const uses = Object.entries(s?.uses ?? {}).sort((a, b) => b[1] - a[1]);
  const topUses = uses.slice(0, 5);
  const restCount = uses.slice(5).reduce((n, [, c]) => n + c, 0);
  const myLot = hit && hit.zone === zone ? hit : null;
  const minLot = d.minLotSqft?.value;

  return (
    <div className="mt-8">
      {/* ---- picker */}
      <div role="group" aria-label="Choose a district" className="space-y-3">
        {FAMILIES.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="w-full text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-ink-faint sm:w-52">{f.label}</span>
            {f.zones.map((z) => {
              const on = z === zone;
              return (
                <button
                  key={z}
                  type="button"
                  aria-pressed={on}
                  onClick={() => select(z, "explorer-pick")}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.875rem] font-semibold transition-colors ${
                    on ? "border-accent bg-accent text-white" : "border-ink-faint/40 bg-white/60 text-ink hover:border-accent hover:text-accent"
                  }`}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full border border-black/20"
                    style={{ background: HATCHED.has(z) ? "#8a8175" : ZONE_FILL[z] }}
                    aria-hidden
                  />
                  {displayCode(z)}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ---- card */}
      <section aria-live="polite" className="mt-6 rounded-lg border border-rule bg-white/70 px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-3xl font-bold tracking-tight">{d.code}</h3>
          <p className="text-[1.0625rem] font-semibold text-ink">{d.name}</p>
        </div>
        <p className="mt-1 text-[0.8125rem] uppercase tracking-[0.08em] text-ink-faint">
          {fam?.label} · § {d.section}
        </p>
        <p className="mt-3 max-w-[60ch] text-[1.0625rem] leading-relaxed">{d.plain}</p>

        {d.purpose && (
          <blockquote className="mt-4 max-w-[60ch] border-l-[3px] border-accent/60 pl-4 text-[0.9375rem] leading-relaxed text-ink-mid">
            {d.purpose.quote ? <>“{d.purpose.quote}”</> : d.purpose.paraphrase}
            <span className="mt-1 block text-[0.75rem] text-ink-faint">
              {d.purpose.quote ? "The ordinance’s purpose statement" : "The ordinance’s purpose, paraphrased"}
              {needsCheck(d.purpose) && <Unchecked />}
            </span>
          </blockquote>
        )}

        {myLot && (
          <div className="mt-5 max-w-[60ch] rounded-md border border-accent/35 bg-accent-glow px-4 py-3 text-[0.9375rem] leading-relaxed">
            <b>Your lot.</b> The assessor lists {myLot.address} at {formatSqft(myLot.lotSqft)}.
            {likelyCC2(zone, myLot.address) && (
              <>
                {" "}
                It fronts Cabot Street, so it is likely in the CC2 subdistrict.
                <Unchecked />
              </>
            )}
            {minLot && myLot.use === "single" && myLot.lotSqft < minLot * 0.995 && (
              <>
                {" "}
                That is smaller than the {fmt(minLot)} square feet {d.code} requires for a new lot. That is common here and does
                not make the house illegal: a lot that met the rules when it was created is generally protected under state law,
                though an addition can need approval from the Zoning Board of Appeals.
              </>
            )}
            {minLot && myLot.use === "single" && myLot.lotSqft >= minLot * 0.995 && (
              <> That meets the {fmt(minLot)} square foot minimum for {d.code}. Lot size is one test of several; frontage and setbacks count too.</>
            )}
          </div>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* rules */}
          <div>
            <h4 className="font-display text-lg font-semibold">What the ordinance says</h4>
            <dl className="mt-2">
              <Rule label="Housing allowed" field={d.housing} />
              <Rule label="Minimum lot" field={d.minLotSqft} render={(v) => formatSqft(Number(v))} />
              <Rule label="Street frontage" field={d.frontageFt} render={(v) => `${fmt(Number(v))} feet`} />
              <Rule label="Height limit" field={d.heightFt} render={(v) => `${v} feet`} />
              <Rule label="Parking" field={d.parking} />
            </dl>
            {d.notes.length > 0 && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.875rem] leading-relaxed text-ink-mid marker:text-ink-faint">
                {d.notes.map((n) => (
                  <li key={n.text}>
                    {n.text}
                    {needsCheck(n) && <Unchecked />}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-[0.8125rem] text-ink-faint">
              Full text:{" "}
              <a href={RULES_META.articleUrl} target="_blank" rel="noopener noreferrer" className="rlink">
                § {d.section} on eCode360
              </a>
              . Uses not listed for a district are not allowed there.
            </p>
          </div>

          {/* ground truth */}
          <div>
            <h4 className="font-display text-lg font-semibold">What is there today</h4>
            {s ? (
              <>
                <p className="mt-2 text-[0.9375rem] leading-relaxed">
                  <b>{fmt(s.parcels)}</b> lots on <b>{fmt(Math.round(s.acres))}</b> acres, {s.shareOfZonedLand < 1 ? "under 1" : Math.round(s.shareOfZonedLand)}% of
                  the city’s land outside streets and water.
                </p>
                <ul className="mt-3 space-y-1.5" aria-label={`What the ${d.code} lots hold`}>
                  {topUses.map(([u, n]) => (
                    <li key={u} className="grid grid-cols-[9.5rem_1fr] items-center gap-2 text-[0.8125rem]">
                      <span className="text-ink-mid">{USE_SHORT[u] ?? u}</span>
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 rounded-r-[3px] bg-accent" style={{ width: `${Math.max(1.5, pct(n, s.parcels) * 0.8)}%` }} aria-hidden />
                        <span className="tabular-nums text-ink">
                          {fmt(n)} <span className="text-ink-faint">({pct(n, s.parcels)}%)</span>
                        </span>
                      </span>
                    </li>
                  ))}
                  {restCount > 0 && <li className="text-[0.75rem] text-ink-faint">Everything else: {fmt(restCount)} lots</li>}
                </ul>
                {below && minLot && (
                  <p className="mt-4 text-[0.9375rem] leading-relaxed">
                    <b>{pct(below.below, below.lots)}%</b> of the {fmt(below.lots)} single-family lots here are smaller than the{" "}
                    {fmt(minLot)} square foot minimum.
                    <span className="ml-1.5 text-[0.75rem] font-semibold uppercase tracking-wide text-gold-strong">Modeled</span>
                  </p>
                )}
                <MiniMap viewBox={viewBox} zones={[zone]} label={`Map of Beverly with the ${d.code} district highlighted`} className="mt-4 max-w-[420px]" />
                <p className="mt-2 text-[0.75rem] text-ink-faint">
                  From the FY2027 assessor records. A lot is counted by what most of its records say.
                </p>
              </>
            ) : (
              <p className="mt-2 text-ink-faint">No parcels carry this code in the assessor’s records.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
