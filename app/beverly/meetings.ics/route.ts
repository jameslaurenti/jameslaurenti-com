import { meetings, type Meeting } from "@/data/beverly/meetings";

/**
 * A subscribable calendar of Beverly public meetings.
 *
 * The point is that a resident does this once. After that the meetings arrive in the
 * calendar they already look at, which is a much lower bar than remembering to check a
 * city website, and it is the same job the digest does, done ahead of time.
 *
 * Two parts of RFC 5545 break calendar clients quietly if you get them wrong, so both
 * are handled explicitly below: lines must be folded at 75 octets, and TEXT values must
 * escape backslash, semicolon, comma and newline. Everything is emitted with CRLF.
 */

const DOMAIN = "jameslaurenti.com";
const SITE = `https://www.${DOMAIN}`;

/** Escape a TEXT value per RFC 5545 section 3.3.11. Order matters: backslash first. */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * Fold to 75 OCTETS, not characters. A multi-byte character split across a fold is
 * corrupt, so this measures in UTF-8 bytes and never breaks one apart.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;

  const out: string[] = [];
  let start = 0;
  let limit = 75; // first line takes 75; continuations lose one octet to the leading space

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
const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
/** 2026-10-20 -> 20261020 */
const dateOnly = (iso: string) => iso.slice(0, 10).replace(/-/g, "");

/** All-day DTEND is exclusive, so a one-day event ends the following day. */
function nextDay(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function event(m: Meeting): string[] {
  const lines: string[] = ["BEGIN:VEVENT", `UID:${m.id}@${DOMAIN}`, `DTSTAMP:${stamp(m.updated)}`];

  if (m.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${dateOnly(m.start)}`);
    lines.push(`DTEND;VALUE=DATE:${nextDay(m.start)}`);
  } else {
    lines.push(`DTSTART:${stamp(m.start)}`);
    if (m.end) lines.push(`DTEND:${stamp(m.end)}`);
  }

  lines.push(`SUMMARY:${esc(m.title)}`);
  if (m.location) lines.push(`LOCATION:${esc(m.location)}`);

  // The local time goes in the body too. If a client mishandles the timezone, the
  // reader can still see what the posted agenda actually said.
  const body = [m.detail, m.detail ? "" : null, `Posted time: ${m.local}`]
    .filter((v) => v !== null)
    .join("\n");
  lines.push(`DESCRIPTION:${esc(body)}`);

  if (m.url) lines.push(`URL:${esc(m.url)}`);
  lines.push(`STATUS:${(m.status ?? "confirmed").toUpperCase()}`);
  lines.push(`LAST-MODIFIED:${stamp(m.updated)}`);
  lines.push("END:VEVENT");
  return lines;
}

function calendar(): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//James Laurenti//Beverly Meeting Digest//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Beverly city meetings",
    `X-WR-CALDESC:${esc(
      "Public meetings of Beverly, Massachusetts boards and committees. Compiled independently; not a City of Beverly publication."
    )}`,
    "X-WR-TIMEZONE:America/New_York",
    // Ask clients to re-poll twice a day. Most treat this as a hint, not a rule.
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    `SOURCE;VALUE=URI:${SITE}/beverly/meetings.ics`,
  ];

  for (const m of meetings) lines.push(...event(m));
  lines.push("END:VCALENDAR");

  return lines.map(fold).join("\r\n") + "\r\n";
}

export const dynamic = "force-static";
export const revalidate = 3600;

export function GET() {
  return new Response(calendar(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="beverly-meetings.ics"',
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
