import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared pieces for the Beverly history explainers under /experiments (Bass River, Proposition 2½).
 * Plain server components. The look follows the development map's Rantoul Street explainer: one idea per
 * section, a simple visual where it helps, detail behind "More", sources linked in the sentence that leans
 * on them.
 */

export const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";
export const SMALL = "text-[0.85rem] leading-snug text-ink-faint";
export const LIST = "mt-4 max-w-[63ch] list-disc space-y-3 pl-6 text-[1.0625rem] leading-[1.7]";

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-16 max-w-[63ch] scroll-mt-24 font-display text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]"
    >
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-9 max-w-[63ch] font-display text-lg font-bold leading-snug">{children}</h3>;
}

/** A source link, opened in a new tab. */
export function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="rlink" data-track="source_opened" data-placement="history-page">
      {children}
    </a>
  );
}

export function More({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-3 max-w-[63ch]">
      <summary className="cursor-pointer text-[0.9rem] font-semibold text-accent">{label}</summary>
      <div className="mt-2 space-y-3 text-[0.97rem] leading-relaxed text-ink-mid">{children}</div>
    </details>
  );
}

export function DraftBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 text-[0.85rem]">
      <Link href="/beverly" className="font-medium text-accent hover:text-accent-lt">
        ← Beverly
      </Link>
      <span className="rounded-full border border-ink-faint/40 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint">
        Draft, work in progress
      </span>
    </div>
  );
}

/** The note under the header while a page is a draft: what it is, and who wrote the words. */
export function DraftNote({ children }: { children?: ReactNode }) {
  return (
    <aside
      aria-label="About this draft"
      className="mt-6 max-w-[63ch] rounded-md border border-l-4 border-rule border-l-gold bg-bg-card/50 px-5 py-4 text-[0.95rem] leading-relaxed"
    >
      <p>
        <strong>A working draft.</strong>{" "}The writing was drafted with AI from the public record and hasn&apos;t been
        fully checked. Every fact links to where it comes from, so lean on the sources. Corrections are welcome.
      </p>
      {children ? <p className="mt-2">{children}</p> : null}
    </aside>
  );
}

/** Two to four headline numbers in a row. */
export function Stats({ items }: { items: { big: string; label: string }[] }) {
  return (
    <dl className="mt-8 grid max-w-[44rem] grid-cols-1 gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.label} className="bg-bg px-4 py-3">
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="block font-display text-[1.75rem] font-bold leading-none tracking-tight text-accent-deep">
              {s.big}
            </span>
            <span className="mt-1.5 block text-[0.88rem] leading-snug text-ink-mid">{s.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A small side-by-side table: a label column plus one or two value columns. */
export function Compare({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: { label: string; cells: ReactNode[] }[];
  caption?: string;
}) {
  return (
    <div className="mt-6 max-w-[44rem] overflow-hidden rounded-md border border-rule">
      <table className="w-full border-collapse text-left text-[0.95rem] leading-snug">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-bg-card/70">
            <th scope="col" className="w-[30%] px-4 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-ink-faint">
              <span className="sr-only">Item</span>
            </th>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-display text-[1rem] font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-rule align-top">
              <th scope="row" className="px-4 py-3 text-[0.88rem] font-semibold text-ink-mid">
                {r.label}
              </th>
              {r.cells.map((c, i) => (
                <td key={i} className="px-4 py-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type TimelineRow = {
  key: string;
  /** Shown as the row's date, e.g. "2005 to 2007". */
  when: string;
  label: string;
  sub?: string;
  /** YYYY-MM-DD. */
  start: string;
  /** YYYY-MM-DD. Leave out for a single moment. */
  end?: string;
  /** "try" a muted band or dot; "key" the highlighted moment; "wait" a hatched band for a hold. */
  tone?: "try" | "key" | "wait" | "quiet";
};

const day = (d: string) => Date.parse(`${d}T00:00:00Z`) / 864e5;

/**
 * A simple timeline: each row is a dated band or dot on a shared axis of years. Labels sit above the
 * track, so it reads the same on a phone. The text carries the dates; the bars only show the shape.
 */
export function Timeline({
  rows,
  from,
  to,
  every,
  label,
}: {
  rows: TimelineRow[];
  from: number;
  to: number;
  every: number;
  label: string;
}) {
  const lo = day(`${from}-01-01`);
  const hi = day(`${to}-01-01`);
  const pct = (d: string) => Math.min(100, Math.max(0, ((day(d) - lo) / (hi - lo)) * 100));
  const ticks: number[] = [];
  for (let y = from; y <= to; y += every) ticks.push(y);

  return (
    <figure className="mt-8 max-w-[44rem]">
      <div aria-hidden className="relative mb-2 h-5 border-b border-ink-faint/40 text-[0.72rem] tabular-nums text-ink-faint">
        {ticks.map((y) => {
          const left = ((day(`${y}-01-01`) - lo) / (hi - lo)) * 100;
          return (
            <span
              key={y}
              className="absolute top-0 -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${left}%` }}
            >
              {y}
            </span>
          );
        })}
      </div>
      <ol aria-label={label} className="space-y-4">
        {rows.map((r) => {
          const a = pct(r.start);
          const b = r.end ? pct(r.end) : a;
          const tone = r.tone ?? "try";
          return (
            <li key={r.key}>
              <div className="flex flex-wrap items-baseline gap-x-2 text-[0.95rem] leading-snug">
                <span className="font-semibold tabular-nums text-ink-mid">{r.when}</span>
                <span className={tone === "key" ? "font-bold" : "font-semibold"}>{r.label}</span>
              </div>
              {r.sub ? (
                <div className={`text-[0.82rem] ${tone === "key" ? "font-semibold text-ink" : "text-ink-faint"}`}>{r.sub}</div>
              ) : null}
              <div aria-hidden className="relative mt-1.5 h-3 rounded-full bg-bg-card">
                {r.end ? (
                  <span
                    className={`absolute top-0 h-3 rounded-full ${
                      tone === "wait"
                        ? "border border-debt/60 bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(156,74,36,0.28)_4px_7px)]"
                        : tone === "key"
                          ? "bg-accent"
                          : tone === "quiet"
                            ? "border border-ink-faint/40 bg-transparent"
                            : "bg-ink-faint/55"
                    }`}
                    style={{ left: `${a}%`, width: `${Math.max(1.2, b - a)}%` }}
                  />
                ) : (
                  <span
                    className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 ${
                      tone === "key" ? "h-3.5 w-3.5 bg-accent" : "h-2.5 w-2.5 border-2 border-ink-mid bg-bg"
                    }`}
                    style={{ left: `${a}%` }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/** Two or three side-by-side cards that stack on a phone. */
export function Cards({ items }: { items: { title: string; body: ReactNode }[] }) {
  return (
    <div className="mt-6 grid max-w-[44rem] gap-4 sm:grid-cols-2">
      {items.map((c) => (
        <section key={c.title} className="rounded-md border border-rule bg-bg-card/40 px-5 py-4">
          <h3 className="font-display text-lg font-bold leading-snug">{c.title}</h3>
          <div className="mt-2 space-y-2 text-[0.97rem] leading-relaxed">{c.body}</div>
        </section>
      ))}
    </div>
  );
}

/** The closing note: how the page was built, and what it doesn't cover yet. */
export function Colophon({ children }: { children: ReactNode }) {
  return <div className="mt-14 max-w-[63ch] space-y-2 border-t border-rule pt-5 text-[0.85rem] leading-snug text-ink-faint">{children}</div>;
}
