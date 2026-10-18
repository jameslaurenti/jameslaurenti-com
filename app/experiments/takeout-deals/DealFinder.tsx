"use client";

import { useState, useSyncExternalStore } from "react";
import { DAYS, DAY_LABEL, TOWN_ORDER, type Day, type Deal } from "./types";

type Meal = "any" | "lunch" | "dinner";

const MEAL_MATCH: Record<Meal, Deal["meal"][]> = {
  any: ["lunch", "dinner", "all-day", "late-night"],
  lunch: ["lunch", "all-day"],
  dinner: ["dinner", "all-day", "late-night"],
};

/** The weekday in Beverly, whatever time zone the phone is set to. */
function todayInBeverly(): Day {
  const wd = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "America/New_York" })
    .format(new Date())
    .toLowerCase()
    .slice(0, 3);
  return (DAYS as readonly string[]).includes(wd) ? (wd as Day) : "mon";
}
const noSubscribe = () => () => {};

function townRank(town: string) {
  const i = (TOWN_ORDER as readonly string[]).indexOf(town);
  return i === -1 ? TOWN_ORDER.length : i;
}

function byPriority(a: Deal, b: Deal) {
  return (
    Number(!!b.standout) - Number(!!a.standout) ||
    Number(b.healthy) - Number(a.healthy) ||
    townRank(a.town) - townRank(b.town) ||
    a.restaurant.localeCompare(b.restaurant)
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatSourceDate(d: string) {
  const m = /^(\d{4})-(\d{2})/.exec(d);
  return m ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "undated";
}

/** "Every day", "Tue–Fri", "Mon, Wed": the days a deal runs, as compactly as reads well. */
function dayRange(days: Day[]) {
  if (days.length === DAYS.length) return "Every day";
  const idx = days.map((d) => DAYS.indexOf(d)).sort((a, b) => a - b);
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && idx.length > 2) return `${DAY_LABEL[DAYS[idx[0]]].short}–${DAY_LABEL[DAYS[idx.at(-1)!]].short}`;
  return idx.map((i) => DAY_LABEL[DAYS[i]].short).join(", ");
}

/** Deals on three days a week or fewer are the night-specific ones; the rest are standing menus. */
const isNightly = (d: Deal) => d.days.length <= 3;

function directions(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

const pressed = "border-accent bg-accent text-white";
const unpressed = "border-rule bg-bg-card text-ink hover:border-ink-faint/50";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Tag({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "accent" | "warn" }) {
  const tones = {
    plain: "border-rule text-ink-mid",
    accent: "border-accent/40 text-accent-deep bg-accent-glow",
    warn: "border-gold/60 text-gold-strong",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.75rem] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const pickup = deal.takeout === "yes";
  const delivery = deal.delivery === "yes";
  const unsure = !pickup && !delivery;
  return (
    <li className="rounded-lg border border-rule bg-white/60 px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-display text-[1.125rem] font-bold leading-tight tracking-tight">{deal.restaurant}</h3>
        <p className="text-[0.8125rem] text-ink-faint">
          {deal.town} &middot; {deal.cuisine}
        </p>
      </div>

      <p className="mt-2 text-[1rem] leading-relaxed">
        {deal.price && <strong className="font-semibold text-accent-deep">{deal.price}: </strong>}
        {deal.deal}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {deal.standout && <Tag tone="accent">Standout</Tag>}
        {deal.healthy && <Tag tone="accent">Healthier</Tag>}
        {!isNightly(deal) && <Tag>{dayRange(deal.days)}</Tag>}
        {deal.time && <Tag>{deal.time}</Tag>}
        {pickup && <Tag>Pickup</Tag>}
        {delivery && <Tag>Delivery</Tag>}
        {unsure && <Tag tone="warn">Takeout unconfirmed: call first</Tag>}
        {deal.confidence === "low" && <Tag tone="warn">Unverified</Tag>}
      </div>

      {deal.how && <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-mid">{deal.how}</p>}

      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem]">
        <a href={deal.source} className={`rlink ${focus}`} target="_blank" rel="noopener noreferrer">
          Source ({formatSourceDate(deal.sourceDate)})
        </a>
        <a href={directions(deal.address)} className={`rlink ${focus}`} target="_blank" rel="noopener noreferrer">
          Directions
        </a>
      </p>

      {deal.notes && (
        <details className="mt-2 text-[0.8125rem] text-ink-mid">
          <summary className={`cursor-pointer select-none text-ink-faint ${focus}`}>Research notes</summary>
          <p className="mt-1.5 leading-relaxed">{deal.notes}</p>
        </details>
      )}
    </li>
  );
}

function Section({ title, note, deals }: { title: string; note?: string; deals: Deal[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold tracking-tight">
        {title} <span className="font-sans text-[0.9rem] font-normal text-ink-faint">({deals.length})</span>
      </h2>
      {note && <p className="mt-1 text-[0.875rem] text-ink-mid">{note}</p>}
      {deals.length === 0 ? (
        <p className="mt-4 text-[0.9375rem] text-ink-mid">Nothing matches. Try loosening the filters.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {deals.map((d) => (
            <DealCard key={`${d.restaurant}|${d.deal}`} deal={d} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default function DealFinder({ deals }: { deals: Deal[] }) {
  // null on the server, where "today" isn't known yet; the real day on the phone.
  const today = useSyncExternalStore(noSubscribe, todayInBeverly, () => null);
  const [picked, setPicked] = useState<Day | null>(null);
  const [meal, setMeal] = useState<Meal>("any");
  const [healthyOnly, setHealthyOnly] = useState(false);
  const [localOnly, setLocalOnly] = useState(false);

  const day = picked ?? today;

  const shown = deals.filter(
    (d) =>
      (d.takeout !== "no" || d.delivery !== "no") &&
      MEAL_MATCH[meal].includes(d.meal) &&
      (!healthyOnly || d.healthy) &&
      (!localOnly || !d.chain),
  );
  const nightly = shown.filter(isNightly);
  const standing = shown.filter((d) => !isNightly(d));
  const countFor = (d: Day) => nightly.filter((x) => x.days.includes(d)).length;

  return (
    <div>
      <div className="sticky top-14 z-10 -mx-6 border-b border-rule bg-bg px-6 pb-4 pt-4">
        <div role="group" aria-label="Day of the week" className="grid grid-cols-7 gap-1.5">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={day === d}
              onClick={() => setPicked(d)}
              className={`rounded-md border px-0 py-1.5 text-center leading-tight ${focus} ${day === d ? pressed : unpressed}`}
            >
              <span className="block text-[0.875rem] font-semibold">{DAY_LABEL[d].short}</span>
              <span className={`block text-[0.75rem] ${day === d ? "text-white/85" : "text-ink-faint"}`}>
                {countFor(d)}
                <span className="sr-only"> day specials</span>
              </span>
              {today === d && <span className="sr-only"> (today)</span>}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
          <div role="group" aria-label="Meal" className="inline-flex overflow-hidden rounded-md border border-rule">
            {(["any", "lunch", "dinner"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={meal === m}
                onClick={() => setMeal(m)}
                className={`px-3 py-1.5 text-[0.8125rem] font-medium ${focus} ${meal === m ? "bg-ink text-bg" : "bg-bg-card text-ink"}`}
              >
                {m === "any" ? "Any meal" : m === "lunch" ? "Lunch" : "Dinner"}
              </button>
            ))}
          </div>
          <label className="inline-flex items-center gap-2 text-[0.875rem]">
            <input
              type="checkbox"
              checked={healthyOnly}
              onChange={(e) => setHealthyOnly(e.target.checked)}
              className={`h-4 w-4 accent-accent ${focus}`}
            />
            Healthier only
          </label>
          <label className="inline-flex items-center gap-2 text-[0.875rem]">
            <input
              type="checkbox"
              checked={localOnly}
              onChange={(e) => setLocalOnly(e.target.checked)}
              className={`h-4 w-4 accent-accent ${focus}`}
            />
            Hide chains
          </label>
        </div>
      </div>

      {day === null ? (
        <p className="mt-10 text-ink-mid">Loading today&rsquo;s deals&hellip;</p>
      ) : (
        <>
          <Section
            title={`${today === day ? "Today, " : ""}${DAY_LABEL[day].long}`}
            note={`Specials tied to ${DAY_LABEL[day].long}s.`}
            deals={nightly.filter((d) => d.days.includes(day)).sort(byPriority)}
          />
          <Section
            title={today === day ? "Also available today" : `Also available ${DAY_LABEL[day].long}`}
            note="Lunch specials, bundles and app deals that run most or all of the week."
            deals={standing.filter((d) => d.days.includes(day)).sort(byPriority)}
          />
        </>
      )}
    </div>
  );
}
