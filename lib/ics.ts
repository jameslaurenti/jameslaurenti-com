/**
 * iCalendar helpers, shared by the meetings feed and the per-event calendar buttons.
 *
 * Two parts of RFC 5545 break calendar clients quietly if you get them wrong, so both
 * live here rather than being written twice: lines must be folded at 75 OCTETS, and TEXT
 * values must escape backslash, semicolon, comma and newline.
 */

/** Escape a TEXT value per RFC 5545 section 3.3.11. Order matters: backslash first. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Fold to 75 octets, not characters. A multi-byte character split across a fold is
 * corrupt, so this measures in UTF-8 bytes and never breaks one apart.
 */
export function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let start = 0;
  let limit = 75; // continuations lose one octet to the leading space

  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // Never split a UTF-8 continuation byte (10xxxxxx) from its leader.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
    limit = 74;
  }
  return out.join("\r\n ");
}

/** 2026-09-14T22:00:00Z -> 20260914T220000Z */
export const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/** 2026-10-20 -> 20261020 */
export const dateOnly = (iso: string) => iso.slice(0, 10).replace(/-/g, "");

/** All-day DTEND is exclusive, so a one-day event ends the following day. */
export function nextDay(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

export type IcsEvent = {
  /** Stable forever: it becomes the UID, so never reuse or renumber one. */
  uid: string;
  title: string;
  /** UTC instant, or a bare date when allDay. */
  start: string;
  end?: string;
  allDay?: boolean;
  location?: string;
  description?: string;
  url?: string;
  status?: "confirmed" | "tentative";
  /** Drives DTSTAMP, so it must be stable rather than "now". */
  updated: string;
};

export function eventLines(e: IcsEvent, domain: string): string[] {
  const lines = ["BEGIN:VEVENT", `UID:${e.uid}@${domain}`, `DTSTAMP:${stamp(e.updated)}`];

  if (e.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dateOnly(e.start)}`);
    lines.push(`DTEND;VALUE=DATE:${nextDay(e.start)}`);
  } else {
    lines.push(`DTSTART:${stamp(e.start)}`);
    if (e.end) lines.push(`DTEND:${stamp(e.end)}`);
  }

  lines.push(`SUMMARY:${escapeText(e.title)}`);
  if (e.location) lines.push(`LOCATION:${escapeText(e.location)}`);
  if (e.description) lines.push(`DESCRIPTION:${escapeText(e.description)}`);
  if (e.url) lines.push(`URL:${escapeText(e.url)}`);
  lines.push(`STATUS:${(e.status ?? "confirmed").toUpperCase()}`);
  lines.push(`LAST-MODIFIED:${stamp(e.updated)}`);
  lines.push("END:VEVENT");
  return lines;
}

const PRODID = "-//James Laurenti//Beverly Meeting Digest//EN";

/** A complete single-event calendar, for a download link. */
export function singleEventIcs(e: IcsEvent, domain: string): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventLines(e, domain),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export { PRODID };
