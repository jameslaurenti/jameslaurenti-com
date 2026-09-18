import { meetings, type Meeting } from "@/data/beverly/meetings";
import { escapeText as esc, fold, stamp, dateOnly, nextDay, PRODID } from "@/lib/ics";

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
    `PRODID:${PRODID}`,
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
