import Link from "next/link";
import type { ReactNode } from "react";
import { parseDate } from "@/lib/beverly/development.mjs";
import {
  register,
  resolveSource,
  sourceGroups,
  type DevApproval,
  type DevChapter,
  type DevEvent,
  type DevFact,
  type DevNote,
  type DevPlan,
  type DevRecording,
  type DevSite,
  type SiteStatus,
  type SourceRef,
} from "@/lib/beverly/developmentRegister";

/**
 * Shared pieces for the development site pages (docs/beverly/development-map.md, "A site page").
 * Pages compose these and supply only their connecting copy; facts, dates, statuses, approvals,
 * history and sources come from the register.
 */

export const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";
export const SMALL = "text-[0.85rem] leading-snug text-ink-faint";
const LIST = "mt-4 max-w-[63ch] space-y-3 text-[1.0625rem] leading-[1.7]";

const GROUP_STYLE: Record<string, string> = {
  "Talked about": "border-gold text-gold-strong",
  "Under review": "border-debt text-debt",
  Approved: "border-accent text-accent",
  Built: "border-ink-mid text-ink-mid",
  "Quiet or ended": "border-ink-faint/50 text-ink-faint",
};

export function Chip({ group, children }: { group: string; children: ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.66rem] font-bold uppercase leading-5 tracking-[0.12em] ${GROUP_STYLE[group] ?? GROUP_STYLE["Quiet or ended"]}`}
    >
      {children}
    </span>
  );
}

/**
 * A link to a source by its register id: its short name, plus the page when there is one.
 * `page`: "parens" gives "Site plans (p. 8)"; "comma" gives "Site plans, p. 8" for use inside
 * parentheses; "none" when the link text already names the page.
 */
export function Cite({
  source,
  children,
  page = "parens",
}: {
  source: SourceRef;
  children?: ReactNode;
  page?: "parens" | "comma" | "none";
}) {
  const r = resolveSource(source);
  if (!r) return <>{children}</>;
  const pageText = !r.page || page === "none" ? "" : page === "comma" ? `, ${r.page}` : ` (${r.page})`;
  return (
    <a
      href={r.href}
      {...(r.internal ? {} : { target: "_blank", rel: "noopener" })}
      className="rlink"
      data-track="source_opened"
      data-placement="development-page"
    >
      {children ?? r.short}
      {pageText}
    </a>
  );
}

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

/** The line under a section heading that names the section's documents, linked once. */
export function From({ children }: { children: ReactNode }) {
  return <p className="mt-2.5 max-w-[63ch] text-[0.9rem] leading-relaxed text-ink-mid">{children}</p>;
}

const idOf = (ref: SourceRef) => ref.split(" ")[0];

/**
 * Labeled facts. A fact whose source is one of the section's own documents (`shared`, named once in
 * its From line) carries no link of its own.
 */
export function Facts({ facts, shared = [] }: { facts: DevFact[]; shared?: string[] }) {
  return (
    <dl className="mt-5 max-w-[63ch] divide-y divide-rule border-y border-rule">
      {facts.map((f) => (
        <div key={f.label} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink-mid sm:pt-1">{f.label}</dt>
          <dd className="text-[1rem] leading-relaxed">
            {f.value}
            {!shared.includes(idOf(f.source)) && (
              <span className={`block ${SMALL}`}>
                <Cite source={f.source} />
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const APPROVAL_STYLE: Record<DevApproval["status"], string> = {
  needed: "",
  open: "Under review",
  granted: "Granted",
  denied: "Denied",
  withdrawn: "Withdrawn",
  done: "Done",
};

/** The approvals a proposal needs, each with where it stands. */
export function Approvals({ approvals, shared = [] }: { approvals: DevApproval[]; shared?: string[] }) {
  return (
    <ol className="mt-4 max-w-[63ch] list-decimal space-y-3 pl-5 text-[1.0625rem] leading-[1.7]">
      {approvals.map((a) => {
        const date = a.date ? parseDate(a.date)?.label : null;
        const state = [APPROVAL_STYLE[a.status], a.vote, date].filter(Boolean).join(" ");
        const settled = ["granted", "done"].includes(a.status);
        return (
          <li key={`${a.board}-${a.what}`}>
            <b>{a.board}:</b>{" "}
            {a.what}.{" "}
            {state && (
              <span
                className={`ml-1 whitespace-nowrap text-[0.78rem] font-bold uppercase tracking-[0.08em] ${settled ? "text-accent" : "text-ink-faint"}`}
              >
                {state}
              </span>
            )}
            {!shared.includes(idOf(a.source)) && (
              <span className={`block ${SMALL}`}>
                <Cite source={a.source} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** A picture with a caption. Tapping it opens the full-size file. */
export function Figure({
  src,
  alt,
  w,
  h,
  children,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  children: ReactNode;
}) {
  return (
    <figure className="mt-6 max-w-[63ch]">
      <a href={src} target="_blank" rel="noopener" data-track="figure_opened">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} width={w} height={h} loading="lazy" className="h-auto w-full rounded border border-rule" />
      </a>
      <figcaption className={`mt-2 ${SMALL}`}>{children}</figcaption>
    </figure>
  );
}

export function More({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-3 max-w-[63ch]">
      <summary className="cursor-pointer text-[0.9rem] font-semibold text-accent">{label}</summary>
      <div className="mt-2 text-[0.97rem] leading-relaxed text-ink-mid">{children}</div>
    </details>
  );
}

/** Quoted passages, each with a topic label and a page link. */
export function Passages({ items }: { items: { topic: string; quote: ReactNode; source: SourceRef }[] }) {
  return (
    <ul className={LIST}>
      {items.map((p) => (
        <li key={p.topic}>
          <b>{p.topic}:</b>{" "}
          {p.quote} (
          <Cite source={p.source} page="none">
            {resolveSource(p.source)?.page ?? "source"}
          </Cite>
          ).
        </li>
      ))}
    </ul>
  );
}

export const sentence = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

/** Sourced statements from the register, one paragraph each; a note with `more` folds behind a toggle. */
export function Notes({ notes }: { notes: DevNote[] }) {
  return (
    <>
      {notes.map((n) => {
        const ends = n.text.endsWith(".");
        const body = (
          <>
            {ends ? n.text.slice(0, -1) : n.text}
            {" ("}
            <Cite source={n.source} page="comma" />
            {")"}
            {ends ? "." : ""}
          </>
        );
        return n.more ? (
          <More key={n.text} label={n.more}>
            {body}
          </More>
        ) : (
          <p key={n.text} className={BODY}>
            {body}
          </p>
        );
      })}
    </>
  );
}

/** What PlanBeverly says about a site: where its map puts it, then quoted passages with pages. */
export function PlanReading({ plan }: { plan: DevPlan }) {
  const def = plan.definition;
  return (
    <>
      <p className={BODY}>
        {plan.map.text}
        {" ("}
        <Cite source={plan.map.source} page="comma" />
        {")"}
        {def && (
          <>
            {", "}
            {def.text}
            {" ("}
            <Cite source={def.source} page="none">
              {resolveSource(def.source)?.page}
            </Cite>
            {")"}
          </>
        )}
        {". "}
        {plan.map.placed && "The map is drawn for the whole city; we placed the site on it by matching the map's train stations. "}
        Passages that bear on it:
      </p>
      <Passages items={plan.passages} />
      <p className={`mt-4 max-w-[63ch] ${SMALL}`}>
        The plan guides changes to zoning; it is not law itself.{" "}
        <Cite source="digest:2026-11-02#plan">How PlanBeverly works</Cite>.
      </p>
    </>
  );
}

function Events({ events }: { events: DevEvent[] }) {
  return (
    <ol className="mt-3 space-y-2.5 border-l border-rule pl-4">
      {events.map((e) => (
        <li key={`${e.date}-${e.what.slice(0, 24)}`} className="text-[0.97rem] leading-relaxed">
          <span className="font-semibold text-ink-mid">{parseDate(e.date)?.label}.</span> {sentence(e.what)}{" "}
          <span className={SMALL}>
            <Cite source={e.source} />
            {e.digest && (
              <>
                {" · "}
                <Cite source={`digest:${e.digest}`} />
              </>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Meeting recordings for a site, oldest first. Each links to the whole meeting; the moments jump to the
 * point in the recording where the site comes up (from the recording's own chapter list or the digest's).
 */
export function Recordings({ recordings }: { recordings: DevRecording[] }) {
  return (
    <ol className="mt-5 max-w-[63ch] space-y-5">
      {recordings.map((r) => {
        const link = resolveSource(r.source);
        return (
          <li key={`${r.date}-${r.source}`} className="grid gap-x-5 sm:grid-cols-[7.5rem_1fr]">
            <div className="text-[0.9rem] font-semibold text-ink-mid">{parseDate(r.date)?.label}</div>
            <div>
              <a
                href={link?.href}
                target="_blank"
                rel="noopener"
                className="rlink font-semibold"
                data-track="source_opened"
                data-placement="development-recordings"
              >
                {r.title}
              </a>
              <p className="mt-1 text-[0.97rem] leading-relaxed">{sentence(r.what)}</p>
              {r.moments && r.moments.length > 0 && (
                <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.9rem]">
                  {r.moments.map((m) => (
                    <li key={m.at}>
                      <Cite source={`${r.source} at ${m.at}`} page="none">
                        {m.at}
                      </Cite>{" "}
                      <span className="text-ink-mid">{m.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The draft bar at the top of a prototype page. */
export function DraftBar({ back = { href: "/beverly", label: "Beverly" } }: { back?: { href: string; label: string } }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3 text-[0.85rem]">
      <Link href={back.href} className="font-medium text-accent hover:text-accent-lt">
        ← {back.label}
      </Link>
      <span className="rounded-full border border-ink-faint/40 px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.12em] text-ink-faint">
        Preview, work in progress
      </span>
    </div>
  );
}

/** The note on the map page while it is a shared preview: what this is, and who wrote the words. */
export function PreviewNote() {
  return (
    <aside
      aria-label="About this preview"
      className="mt-5 rounded-md border border-l-4 border-rule border-l-gold bg-bg-card/50 px-5 py-4 text-[0.95rem] leading-relaxed"
    >
      <p>
        <strong>Work in progress.</strong>{" "}I&apos;m sharing this map with a few people for feedback before it goes
        public. It&apos;s an experiment, not a finished product.
      </p>
      <p className="mt-2">
        All of the writing here was drafted by AI, and I haven&apos;t finished checking it. Treat the summaries as a
        starting point and lean on the linked sources. Corrections and gaps are welcome.
      </p>
    </aside>
  );
}

/** Name, status chip, the two dates, the next scheduled step, the lead and the section links. */
export function SiteHeader({
  site,
  status,
  lead,
  sections,
}: {
  site: DevSite;
  status: SiteStatus;
  lead: ReactNode;
  sections: [string, string][];
}) {
  const next = status.upcoming ? status.current.next : undefined;
  const permit = status.permit;
  return (
    <header className="mt-8">
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">
        Development · {site.neighborhood ? `${site.neighborhood} · ` : ""}Ward {site.ward}
      </p>
      <h1 className="mt-1 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{site.name}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.92rem] text-ink-mid">
        <Chip group={status.group}>{status.note || status.group}</Chip>
        <span>Decided: {status.decided?.label ?? "not yet"}</span>
        <span>Last heard: {status.last?.label ?? "no dated record"}</span>
        {next && (
          <span>
            Next: {next.what}, {parseDate(next.date)?.label}
          </span>
        )}
        {permit && (
          <span className={permit.passed ? "font-semibold text-debt" : undefined}>
            {permit.passed ? "Permit extension ran to" : "Permit runs to"} {permit.date.label}
          </span>
        )}
      </div>
      <p className="mt-6 max-w-[63ch] text-[1.2rem] leading-[1.65]">{lead}</p>
      <nav aria-label="On this page" className={`mt-5 flex flex-wrap gap-x-4 gap-y-1 ${SMALL}`}>
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="rlink">
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

/* ---------------- the timeline ---------------- */

type Row =
  | { kind: "history"; sort: number; year: string; event: DevEvent }
  | { kind: "chapter"; sort: number; year: string; chapter: DevChapter };

function chapterSpan(ch: DevChapter) {
  const dates = [...ch.events.map((e) => e.date), ch.ending?.date, ch.decided]
    .map((d) => parseDate(d))
    .filter((d) => d !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime());
  const y1 = dates[0]?.raw.slice(0, 4) ?? "";
  const y2 = dates.at(-1)?.raw.slice(0, 4) ?? "";
  return { sort: dates[0]?.start.getTime() ?? 0, year: y1 === y2 ? y1 : `${y1} to ${y2}` };
}

/** True when the land has a past worth its own heading: a study, or more than one proposal. */
export const hasHistory = (site: DevSite) => (site.history?.length ?? 0) > 0 || site.chapters.length > 1;

/**
 * The record for the land, oldest first: context items (studies) and every proposal, each with its
 * status chip. The current proposal shows its steps; earlier ones fold theirs away.
 */
export function Timeline({
  site,
  status,
  currentLabel = "This proposal",
}: {
  site: DevSite;
  status: SiteStatus;
  /** What to call the current chapter: "This proposal" before a decision, "This project" after. */
  currentLabel?: string;
}) {
  const current = status.current;
  const rows: Row[] = [
    ...(site.history ?? []).map((e): Row => ({
      kind: "history",
      sort: parseDate(e.date)?.start.getTime() ?? 0,
      year: e.date.slice(0, 4),
      event: e,
    })),
    ...site.chapters.map((ch): Row => ({ kind: "chapter", ...chapterSpan(ch), chapter: ch })),
  ].sort((a, b) => a.sort - b.sort);

  const chipFor = (ch: DevChapter) => {
    if (ch === current) return { group: status.group, text: status.note || status.group };
    const s = status.earlier.find((e) => e.chapter === ch);
    return { group: s?.group ?? "Quiet or ended", text: s?.note || s?.stageLabel || "" };
  };

  return (
    <ol className="mt-6 max-w-[63ch] space-y-8">
      {rows.map((r) =>
        r.kind === "history" ? (
          <li key={`h-${r.event.date}`} className="grid gap-x-5 sm:grid-cols-[5.5rem_1fr]">
            <div className="font-display text-lg font-bold text-ink-mid">{r.year}</div>
            <div>
              {r.event.title && <h3 className="font-display text-lg font-bold leading-snug">{r.event.title}</h3>}
              <p className="mt-1.5 text-[1rem] leading-relaxed">
                {sentence(r.event.what)} {r.event.detail}{" "}
                <span className={SMALL}>
                  <Cite source={r.event.source} />
                </span>
              </p>
            </div>
          </li>
        ) : (
          <li key={r.chapter.id} className="grid gap-x-5 sm:grid-cols-[5.5rem_1fr]">
            <div className="font-display text-lg font-bold text-ink-mid">{r.year}</div>
            <div>
              <h3 className="flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-lg font-bold leading-snug">
                {r.chapter === current ? currentLabel : r.chapter.title}
                <Chip group={chipFor(r.chapter).group}>{chipFor(r.chapter).text}</Chip>
              </h3>
              <p className="mt-1.5 text-[1rem] leading-relaxed">{sentence(r.chapter.what)}</p>
              {r.chapter.ending && (
                <p className="mt-1.5 text-[1rem] leading-relaxed">
                  {sentence(r.chapter.ending.what)}{" "}
                  <span className={SMALL}>
                    <Cite source={r.chapter.ending.source} />
                  </span>
                </p>
              )}
              {r.chapter.events.length > 0 &&
                (r.chapter === current ? (
                  <Events events={r.chapter.events} />
                ) : (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-[0.85rem] font-semibold text-accent">
                      {r.chapter.events.length} {r.chapter.events.length === 1 ? "step" : "steps"} on the record
                    </summary>
                    <Events events={r.chapter.events} />
                  </details>
                ))}
            </div>
          </li>
        ),
      )}
    </ol>
  );
}

/* ---------------- sources ---------------- */

/**
 * The sources section: the digest's coverage first, then every outside source the page cites,
 * grouped by kind, then the page's standing note.
 */
export function Sources({ site, digest }: { site: DevSite; digest: { ref: string; title: string }[] }) {
  const quietMonths = Math.round(register.rules.quiet_after_days / 30.4);
  return (
    <section aria-labelledby="sources">
      <H2 id="sources">Sources</H2>
      <div className="mt-6 max-w-[63ch] space-y-7">
        {digest.length > 0 && (
          <div>
            <h3 className="text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink-mid">In the digest</h3>
            <ul className="mt-2 space-y-1.5 text-[0.97rem] leading-relaxed">
              {digest.map((d) => (
                <li key={d.ref}>
                  <Cite source={`digest:${d.ref}`}>{d.title}</Cite>{" "}
                  <span className={SMALL}>{resolveSource(`digest:${d.ref}`)?.short.replace("Digest, i", "I")}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {sourceGroups(site).map((g) => (
          <div key={g.kind}>
            <h3 className="text-[0.74rem] font-bold uppercase tracking-[0.1em] text-ink-mid">{g.label}</h3>
            <ul className="mt-2 space-y-1.5 text-[0.97rem] leading-relaxed">
              {g.sources.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener"
                    className="rlink"
                    data-track="source_opened"
                    data-placement="development-sources"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className={`mt-10 max-w-[63ch] ${SMALL}`}>
        Checked {parseDate(register.updated)?.label}. A draft page for a map of development in Beverly. Every fact links
        to where it comes from, and the page takes no position on the proposal. Its status updates on its own: a
        proposal that has not been decided shows as quiet after {quietMonths} months with no public activity.
      </p>
    </section>
  );
}
