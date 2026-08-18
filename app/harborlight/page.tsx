"use client";

// This page sits behind the parent gate in proxy.ts (redirects to
// /harborlight/enter without the cookie), so no in-page gate is needed here.

import { useMemo, useState } from "react";
import digestData from "@/data/harborlight/digest.json";
import eventsData from "@/data/harborlight/events.json";
import type { DigestItem, UpcomingEvent } from "@/lib/harborlight/types";

const ITEMS = digestData.items as DigestItem[];
const EVENTS = eventsData.events as UpcomingEvent[];

function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmtLong(s: string): string {
  return parseDate(s).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function todayKey(): string {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`;
}

// ---- Pieces ----------------------------------------------------------------

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-accent-glow px-2.5 py-0.5 text-xs font-medium text-accent">
      {children}
    </span>
  );
}

function Upcoming() {
  const today = todayKey();
  const upcoming = EVENTS.filter((e) => e.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (upcoming.length === 0) return null;

  return (
    <section className="rounded-[12px] border border-rule bg-bg-card p-5">
      <h2 className="font-display text-lg font-bold text-ink">Upcoming dates</h2>
      <ul className="mt-3 flex flex-col gap-2.5">
        {upcoming.map((e, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span
              className={`w-28 shrink-0 font-medium ${
                e.date === today ? "text-accent" : "text-ink-mid"
              }`}
            >
              {fmtLong(e.date)}
              {e.date === today ? " (today)" : ""}
            </span>
            <span className="text-ink">{e.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ItemCard({ item }: { item: DigestItem }) {
  return (
    <article className="border-b border-rule py-6 last:border-0">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{item.categoryLabel}</Badge>
        {item.classroom && (
          <span className="rounded-full border border-rule px-2.5 py-0.5 text-xs font-medium text-ink-mid">
            {item.classroom}
          </span>
        )}
        <span className="text-xs text-ink-faint">{fmtLong(item.date)}</span>
      </div>

      <h3 className="mt-2 font-display text-xl font-semibold text-ink">
        {item.title}
      </h3>
      <p className="mt-2 leading-relaxed text-ink-mid">{item.summary}</p>

      {item.actionItems.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            What to do
          </p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {item.actionItems.map((a, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {item.keyDates.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Dates in this note
          </p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {item.keyDates.map((k, i) => (
              <li key={i} className="text-sm text-ink-mid">
                <span className="font-medium text-ink">{fmtLong(k.date)}</span>
                {"  "}
                {k.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {item.links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rlink text-sm"
          >
            {l.label}
          </a>
        ))}
        <span className="text-xs text-ink-faint">
          {item.source}
          {item.confidence === "partial" && " (source not fully verified)"}
        </span>
      </div>
    </article>
  );
}

// ---- Digest ----------------------------------------------------------------

function Digest() {
  const [filter, setFilter] = useState("all");

  const rooms = useMemo(
    () =>
      [
        ...new Set(
          ITEMS.filter((i) => i.classroom).map((i) => i.classroom as string),
        ),
      ].sort(),
    [],
  );

  const filters = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "cat:childrens_house_weekly", label: "Notes from Marcy" },
      { key: "cat:it_weekly", label: "Notes from Dorah" },
      { key: "cat:school_wide", label: "School-wide" },
      ...rooms.map((r) => ({ key: `room:${r}`, label: r })),
    ],
    [rooms],
  );

  const items = useMemo(() => {
    if (filter === "all") return ITEMS;
    if (filter.startsWith("cat:"))
      return ITEMS.filter((i) => i.category === filter.slice(4));
    if (filter.startsWith("room:"))
      return ITEMS.filter((i) => i.classroom === filter.slice(5));
    return ITEMS;
  }, [filter]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <header>
        <h1 className="font-display text-3xl font-bold text-ink">
          Harborlight parent digest
        </h1>
        <p className="mt-2 text-ink-mid">
          The important bits from the school notes, in one place. Summarized from
          Harborlight emails. Children are named by first name only.
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-8">
        <Upcoming />

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                filter === f.key
                  ? "bg-accent text-white"
                  : "border border-rule text-ink-mid hover:bg-bg-card hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section>
          {items.length === 0 ? (
            <p className="py-8 text-ink-faint">Nothing under this filter yet.</p>
          ) : (
            items.map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </section>
      </div>
    </div>
  );
}

// ---- Root ------------------------------------------------------------------

export default function HarborlightPage() {
  return <Digest />;
}
