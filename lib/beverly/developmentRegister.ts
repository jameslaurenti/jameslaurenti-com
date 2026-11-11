import registerJson from "@/data/beverly/development-register.json";
import { issues } from "@/data/beverly/digestIssues";
import { SOURCE_KINDS, siteStatus } from "@/lib/beverly/development.mjs";

/**
 * Typed access to data/beverly/development-register.json, plus the one place that turns a source
 * reference ("boulder-deck p. 6", "digest:2026-11-09#boulder") into a link. The status rules
 * (map groups, last heard, quiet) and the source kinds live in lib/beverly/development.mjs,
 * shared with the checker.
 */

/** "<id>", "<id> p. 6", "<id> pp. 2-16", or "digest:<issue slug>#<section id>". */
export type SourceRef = string;
export type Stage = "talked-about" | "under-review" | "approved" | "under-construction" | "built";
export type SourceKind = "developer" | "rules" | "minutes" | "filing" | "government" | "news" | "study";

export type DevSource = {
  title: string;
  short?: string;
  kind?: SourceKind;
  /** Meeting date, for records that sort by date. */
  date?: string;
  url: string | null;
  note?: string;
  retrieved?: string;
};
export type DevFact = { label: string; value: string; source: SourceRef };
export type DevEvent = { date: string; what: string; detail?: string; title?: string; source: SourceRef; digest?: string };
export type DevNote = { text: string; source: SourceRef; more?: string };
export type DevFigure = { section: "proposal" | "land"; src: string; w: number; h: number; alt: string; caption: string };
export type DevPlan = {
  map: { text: string; source: SourceRef; placed?: boolean };
  definition?: { text: string; source: SourceRef };
  passages: { topic: string; quote: string; source: SourceRef }[];
};
export type DevApproval = {
  board: string;
  what: string;
  status: "needed" | "open" | "granted" | "denied" | "withdrawn" | "done";
  date?: string;
  vote?: string;
  source: SourceRef;
};

export type DevChapter = {
  id: string;
  title: string;
  who?: string;
  what: string;
  homes: number | null;
  stage: Stage;
  decided: string | null;
  ending?: DevEvent & { type: "withdrawn" | "denied" | "lapsed" | "dropped" | "rejected" };
  next?: DevEvent;
  permit_until?: { date: string; source: SourceRef };
  status_note?: { text: string; source: SourceRef; checked: string };
  facts?: DevFact[];
  approvals?: DevApproval[];
  /** The documents the proposal section draws on, named once in its From line; facts from them carry no link. */
  section_sources?: string[];
  events: DevEvent[];
};

/** A meeting recording about the site, with the moments worth jumping to. */
export type DevRecording = {
  date: string;
  title: string;
  what: string;
  /** A YouTube source id. */
  source: SourceRef;
  moments?: { at: string; label: string }[];
};

export type DevSite = {
  id: string;
  name: string;
  address: string;
  neighborhood: string | null;
  ward: number;
  parcels: string[];
  acres?: number;
  zoning: string[];
  location: { lat: number; lng: number; basis: string; source: SourceRef };
  depth: "row" | "page" | "deep";
  city_page?: string;
  notes?: string;
  facts?: DevFact[];
  history?: DevEvent[];
  figures?: DevFigure[];
  land_notes?: DevNote[];
  zoning_notes?: DevNote[];
  plan?: DevPlan;
  /** Digest explainers to list beside the coverage the timeline already links. */
  digest_extra?: string[];
  page_sources?: string[];
  /** Meeting recordings, oldest first, for sites whose record is worth watching. */
  recordings?: DevRecording[];
  chapters: DevChapter[];
  check?: string[];
};

/** A building finished before the register's scope begins: a context pin on the map, with no page. */
export type DevEarlier = {
  id: string;
  name: string;
  address: string;
  ward: number;
  homes: number;
  year: number;
  /** Where the year comes from: "assessor", or what a source says ("completed November 2018"). */
  year_basis: string;
  who?: string;
  affordable?: string;
  note?: string;
  /** An explainer that tells this building's story: a key of `explainers`. */
  story?: string;
  location: { lat: number; lng: number };
  sources: SourceRef[];
};

export type DevRegister = {
  schema: string;
  updated: string;
  rules: { quiet_after_days: number; active_window_days: number; built_since: string };
  sites: DevSite[];
  sources: Record<string, DevSource>;
  digest_headlines: Record<string, string>;
  earlier?: { about: string; buildings: DevEarlier[] };
  /** Sources each explainer page cites, so the checker counts them. */
  explainers?: Record<string, string[]>;
};

/** Every digest story that covered a site: its timeline's digest links, then its extra explainers. */
export function digestCoverage(site: DevSite): { ref: string; title: string }[] {
  const refs = [
    ...site.chapters.flatMap((c) => [...c.events, ...(c.ending ? [c.ending] : [])].map((e) => e.digest)),
    ...(site.digest_extra ?? []),
  ].filter((r): r is string => Boolean(r));
  return [...new Set(refs)]
    .filter((r) => register.digest_headlines[r])
    .sort()
    .map((ref) => ({ ref, title: register.digest_headlines[ref] }));
}

export const register = registerJson as unknown as DevRegister;

export function getSite(id: string): DevSite | undefined {
  return register.sites.find((s) => s.id === id);
}

export type PartialDate = { raw: string; start: Date; end: Date; label: string; short: string };
export type ChapterStatus = {
  group: string;
  note: string;
  quiet: boolean;
  stage: Stage;
  stageLabel: string;
  decided: PartialDate | null;
  last: PartialDate | null;
  upcoming: boolean;
  active: boolean;
  permit: { date: PartialDate; passed: boolean } | null;
};
export type SiteStatus = ChapterStatus & { current: DevChapter; earlier: (ChapterStatus & { chapter: DevChapter })[] };

/** The shared status rules (lib/beverly/development.mjs), typed for the site. */
export function statusOf(site: DevSite, today: Date): SiteStatus {
  return siteStatus(site, today, register.rules) as SiteStatus;
}

export type ResolvedSource = {
  id: string;
  href: string;
  title: string;
  /** A few words for an inline link ("Developer's slides"). */
  short: string;
  /** "p. 6" or "pp. 2-16", printed next to the link so phone readers can find the page. */
  page: string | null;
  kind: SourceKind | "digest";
  date: string | null;
  internal: boolean;
};

/** City PDFs number their pages the way they print, so a #page anchor lands in the right place. */
const ANCHORABLE = /beverlyma\.gov\/(DocumentCenter|AgendaCenter)\//;
const YOUTUBE = /^https:\/\/www\.youtube\.com\/watch\?v=/;

export function resolveSource(ref: SourceRef): ResolvedSource | null {
  if (ref.startsWith("digest:")) {
    const [slug, anchor] = ref.slice(7).split("#");
    const issue = issues.find((i) => i.slug === slug);
    return {
      id: ref,
      href: `/beverly/digest/${slug}${anchor ? `#${anchor}` : ""}`,
      title: issue ? `Issue ${issue.number} of the digest, ${issue.published}` : "The digest",
      short: issue ? `Digest, issue ${issue.number}` : "The digest",
      page: null,
      kind: "digest",
      date: slug,
      internal: true,
    };
  }
  const [id, ...rest] = ref.split(" ");
  const s = register.sources[id];
  if (!s?.url) return null;
  const page = rest.length ? rest.join(" ") : null;
  // "at 37:01" or "at 1:18:18" on a recording links to that moment.
  const at = page?.match(/^at ((?:\d+:)?\d{1,2}:\d{2})$/)?.[1];
  const first = at ? null : page?.match(/\d+/)?.[0];
  const href = at && YOUTUBE.test(s.url)
    ? `${s.url}&t=${at.split(":").reduce((t, n) => t * 60 + Number(n), 0)}s`
    : first && ANCHORABLE.test(s.url)
      ? `${s.url}#page=${first}`
      : s.url;
  return {
    id,
    href,
    title: s.title,
    short: s.short ?? s.title,
    page,
    kind: s.kind ?? "government",
    date: s.date ?? null,
    internal: false,
  };
}

/** Every outside source a site cites anywhere, in first-use order. */
export function sourcesOf(site: DevSite): ResolvedSource[] {
  const refs: SourceRef[] = [
    ...(site.facts ?? []).map((f) => f.source),
    ...(site.history ?? []).map((e) => e.source),
    ...site.chapters.flatMap((c) => [
      ...(c.facts ?? []).map((f) => f.source),
      ...(c.approvals ?? []).map((a) => a.source),
      ...c.events.map((e) => e.source),
      ...(c.ending ? [c.ending.source] : []),
      ...(c.next ? [c.next.source] : []),
    ]),
    ...(site.land_notes ?? []).map((n) => n.source),
    ...(site.zoning_notes ?? []).map((n) => n.source),
    ...(site.recordings ?? []).map((r) => r.source),
    ...(site.plan ? [site.plan.map.source, ...(site.plan.definition ? [site.plan.definition.source] : [])] : []),
    ...(site.plan?.passages ?? []).map((p) => p.source),
    ...(site.page_sources ?? []),
  ];
  const seen = new Set<string>();
  const out: ResolvedSource[] = [];
  for (const ref of refs) {
    const r = resolveSource(ref.split(" ")[0]);
    if (r && !r.internal && !seen.has(r.id)) {
      seen.add(r.id);
      out.push(r);
    }
  }
  return out;
}

/** A site's sources grouped by kind, in SOURCE_KINDS order; dated records run oldest first. */
export function sourceGroups(site: DevSite): { kind: SourceKind; label: string; sources: ResolvedSource[] }[] {
  const all = sourcesOf(site);
  return (SOURCE_KINDS as { kind: SourceKind; label: string }[])
    .map(({ kind, label }) => ({
      kind,
      label,
      sources: all
        .filter((s) => s.kind === kind)
        .sort((a, b) => (a.date && b.date ? a.date.localeCompare(b.date) : 0)),
    }))
    .filter((g) => g.sources.length > 0);
}
