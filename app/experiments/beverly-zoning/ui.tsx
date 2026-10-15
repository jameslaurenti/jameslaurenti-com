import Link from "next/link";

/**
 * Presentational pieces shared by the zoning guide. No state, so server and client components
 * can both use them.
 */

export function SectionNum({ children }: { children: React.ReactNode }) {
  return <span className="mb-3 block font-display text-sm italic tracking-wide text-gold-strong">{children}</span>;
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{children}</h2>;
}

export function H3({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mt-10 scroll-mt-20 font-display text-xl font-semibold tracking-tight text-ink">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[64ch] text-[1.0625rem] leading-relaxed">{children}</p>;
}

/** Footnote marker. The first reference to a note gets the back-link target. */
export function Fn({ n, noId }: { n: number; noId?: boolean }) {
  return (
    <a
      href={`#fn-${n}`}
      {...(noId ? {} : { id: `fnref-${n}` })}
      className="ml-0.5 align-super text-[0.68em] font-bold text-accent no-underline hover:underline"
      aria-label={`Note ${n}`}
    >
      [{n}]
    </a>
  );
}

/** Links that leave the page open in a new tab; in-page anchors use a plain <a>. */
export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  return (
    <Link href={href} className="rlink" target="_blank" rel={external ? "noopener noreferrer" : "noopener"}>
      {children}
    </Link>
  );
}

export type Level = "confirmed" | "modeled" | "unverified" | "illustrative";

const LEVEL: Record<Level, { color: string; label: string; detail: string }> = {
  confirmed: { color: "var(--color-accent)", label: "Confirmed", detail: "Primary source" },
  modeled: { color: "var(--color-gold-strong)", label: "Modeled", detail: "Computed from the data, method stated" },
  unverified: { color: "var(--color-debt)", label: "Unverified", detail: "From a search summary of the source, not yet checked against its full text" },
  illustrative: { color: "var(--color-ink-faint)", label: "Illustrative", detail: "A sketch, not a source figure" },
};

/** The site’s confidence marker, with a fourth level for this draft: unverified. */
export function Confidence({ level, short }: { level: Level; short?: boolean }) {
  const m = LEVEL[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide"
      style={{ color: m.color }}
      title={m.detail}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: m.color }} aria-hidden />
      {m.label}
      {!short && <span className="font-normal normal-case tracking-normal text-ink-faint">· {m.detail}</span>}
    </span>
  );
}

/** Small inline flag for a single unverified figure inside a table or card. */
export function Unchecked() {
  return (
    <span
      className="ml-1.5 inline-block rounded-sm border border-debt/50 px-1 align-middle text-[0.6875rem] font-semibold uppercase leading-[1.35] tracking-wide text-debt"
      title="From a search summary of the ordinance or a City page. Not yet checked against the full text."
    >
      Unverified
    </span>
  );
}

/** A defined term. The definition sits in the glossary; the first use links to it. */
export function Term({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a href={`#g-${id}`} className="font-semibold text-ink underline decoration-accent/50 decoration-dotted underline-offset-4 hover:decoration-accent">
      {children}
    </a>
  );
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="mt-8 max-w-[64ch] rounded-lg border border-rule bg-bg-card px-5 py-4">
      <p className="font-display text-base font-semibold text-ink">{title}</p>
      <div className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-mid">{children}</div>
    </aside>
  );
}
