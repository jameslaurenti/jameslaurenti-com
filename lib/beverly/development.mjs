// Shared rules for the development register (data/beverly/development-register.json): partial
// dates, map groups, "last heard", and the automatic quiet rule from docs/beverly/development-map.md.
//
// Plain JavaScript with JSDoc so the same file runs in the site (imported from TypeScript) and in
// scripts/check-development-register.mjs (plain Node, no build step). Keep it free of imports.

export const STAGES = ["talked-about", "under-review", "approved", "under-construction", "built"];
export const ENDINGS = ["withdrawn", "denied", "lapsed", "dropped", "rejected"];
export const GROUPS = ["Talked about", "Under review", "Approved", "Built", "Quiet or ended"];

const DECIDED = ["approved", "under-construction", "built"];

/**
 * The words a site page uses, by stage: one table, so every page reads the same way at the same stage.
 * @param {any} site
 * @param {any} current the site's current chapter
 */
export function pageLabels(site, current) {
  const decided = DECIDED.includes(current.stage);
  const earlier = (site.history?.length ?? 0) > 0 || (site.chapters?.length ?? 0) > 1;
  return {
    section: decided ? "The project" : "The proposal",
    shows: decided ? "What was approved" : "What it shows",
    needs: decided ? "The approvals" : "What it would need",
    current: decided ? "This project" : "This proposal",
    history: decided ? "How it got here" : earlier ? "Earlier ideas for this land" : "The record so far",
  };
}

/**
 * An approval's state: "needed" (nothing filed yet), "open" (filed, hearing open), "granted", "denied",
 * "withdrawn", or "done" (a review or finding that isn't a grant, such as a wetlands determination).
 */
export const APPROVAL_STATUSES = ["needed", "open", "granted", "denied", "withdrawn", "done"];

/** How a page groups its sources, in this order. Every register source has one of these kinds. */
export const SOURCE_KINDS = [
  { kind: "developer", label: "From the developer" },
  { kind: "rules", label: "Zoning, wetland rules and PlanBeverly" },
  { kind: "minutes", label: "Decisions, minutes, agendas and recordings" },
  { kind: "filing", label: "Filings" },
  { kind: "government", label: "City and state pages, maps and data" },
  { kind: "news", label: "News reports" },
  { kind: "study", label: "Studies" },
];

/** @type {Record<string, string>} */
const GROUP_OF_STAGE = {
  "talked-about": "Talked about",
  "under-review": "Under review",
  approved: "Approved",
  "under-construction": "Approved",
  built: "Built",
};

/** @type {Record<string, string>} */
export const STAGE_LABEL = {
  "talked-about": "Talked about",
  "under-review": "Under review",
  approved: "Approved",
  "under-construction": "Under construction",
  built: "Built",
};

/** @type {Record<string, string>} */
export const ENDING_LABEL = { withdrawn: "Withdrawn", denied: "Denied", lapsed: "Lapsed", dropped: "Dropped", rejected: "Rejected" };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PRE_DECISION = ["talked-about", "under-review"];

/**
 * @typedef {{ raw: string, start: Date, end: Date, label: string, short: string }} PartialDate
 * `end` is the last day of the period, so a year-only date never makes something look quiet early.
 */

/**
 * Dates in the register may be "2023", "2023-06" or "2023-06-14".
 * @param {unknown} s
 * @returns {PartialDate | null}
 */
export function parseDate(s) {
  const m = typeof s === "string" ? s.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/) : null;
  if (!m) return null;
  const y = +m[1];
  const mo = m[2] ? +m[2] : null;
  const d = m[3] ? +m[3] : null;
  if ((mo && (mo < 1 || mo > 12)) || (d && (d < 1 || d > 31))) return null;
  const start = new Date(Date.UTC(y, (mo ?? 1) - 1, d ?? 1));
  const end = d ? start : mo ? new Date(Date.UTC(y, mo, 0)) : new Date(Date.UTC(y, 11, 31));
  const month = mo ? MONTHS[mo - 1] : "";
  return {
    raw: s,
    start,
    end,
    label: d ? `${month} ${d}, ${y}` : mo ? `${month} ${y}` : `${y}`,
    short: mo ? `${month.slice(0, 3)} ${y}` : `${y}`,
  };
}

/** @param {Date} a @param {Date} b */
export const daysBetween = (a, b) => Math.floor((a.getTime() - b.getTime()) / 86400000);

/** Midnight UTC today, or a given YYYY-MM-DD. @param {string} [iso] */
export function dayOf(iso) {
  return new Date(`${iso ?? new Date().toISOString().slice(0, 10)}T00:00:00Z`);
}

/**
 * The latest dated step in a chapter: its events, its ending, its decision. Status notes and
 * site history don't count.
 * @param {any} ch
 * @returns {PartialDate | null}
 */
export function lastHeard(ch) {
  const dates = [...(ch.events ?? []).map((/** @type {any} */ e) => e.date), ch.ending?.date, ch.decided]
    .map(parseDate)
    .filter((d) => d !== null)
    .sort((a, b) => a.end.getTime() - b.end.getTime());
  return dates.at(-1) ?? null;
}

/** A scheduled next step (a posted hearing) on or after today. @param {any} ch @param {Date} today */
export function hasUpcoming(ch, today) {
  const n = ch.next ? parseDate(ch.next.date) : null;
  return Boolean(n && n.end.getTime() >= today.getTime());
}

/**
 * Where one chapter sits on the map, with the reason when it's quiet or ended.
 * @param {any} ch
 * @param {Date} today
 * @param {{ quiet_after_days?: number, active_window_days?: number }} [rules]
 */
export function chapterStatus(ch, today, rules = {}) {
  const quietDays = rules.quiet_after_days ?? 365;
  const activeDays = rules.active_window_days ?? 90;
  const last = lastHeard(ch);
  const upcoming = hasUpcoming(ch, today);
  const ending = ch.ending ? parseDate(ch.ending.date) : null;
  let group = GROUP_OF_STAGE[ch.stage] ?? "Talked about";
  let note = "";
  let quiet = false;
  if (ch.ending) {
    group = "Quiet or ended";
    note = `${ENDING_LABEL[ch.ending.type] ?? ch.ending.type} ${ending?.label ?? ""}`.trim();
  } else if (!upcoming && PRE_DECISION.includes(ch.stage) && last && daysBetween(today, last.end) > quietDays) {
    group = "Quiet or ended";
    quiet = true;
    note = `No public activity since ${last.short}`;
  }
  // An approved project that hasn't started is on a permit clock; a passed date is a prompt to check.
  const permitDate = ch.stage === "approved" && ch.permit_until ? parseDate(ch.permit_until.date) : null;
  return {
    group,
    note,
    quiet,
    permit: permitDate ? { date: permitDate, passed: permitDate.end.getTime() < today.getTime() } : null,
    stage: ch.stage,
    stageLabel: STAGE_LABEL[ch.stage] ?? ch.stage,
    decided: ch.decided ? parseDate(ch.decided) : null,
    last,
    upcoming,
    active: upcoming || (last ? daysBetween(today, last.end) <= activeDays : false),
  };
}

/**
 * The pin follows the current chapter: the one heard about most recently. The others are history.
 * @param {any} site
 * @param {Date} today
 * @param {{ quiet_after_days?: number, active_window_days?: number }} [rules]
 */
export function siteStatus(site, today, rules = {}) {
  const chapters = site.chapters ?? [];
  let current = chapters[0];
  for (const ch of chapters) {
    const a = lastHeard(ch);
    const b = lastHeard(current);
    if (a && (!b || a.end.getTime() >= b.end.getTime())) current = ch;
  }
  return {
    current,
    ...chapterStatus(current, today, rules),
    earlier: chapters.filter((/** @type {any} */ c) => c !== current).map((/** @type {any} */ c) => ({ chapter: c, ...chapterStatus(c, today, rules) })),
  };
}
