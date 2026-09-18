import { singleEventIcs, type IcsEvent } from "@/lib/ics";

/**
 * One affordance, three destinations.
 *
 * The old buttons were a single calendar.google.com URL, which is one click for Google
 * users and a sign-in wall for everyone else. An Outlook or Apple Calendar user landed on
 * a Google page and got nothing. This keeps the one-click path for Google, adds the
 * equivalent for Outlook, and falls back to a downloaded .ics file, which every calendar
 * application on every platform opens natively.
 *
 * Deliberately a SERVER component. A native <details> gives the disclosure behaviour and
 * the keyboard semantics for free, and all three URLs are deterministic from the props,
 * so this ships no JavaScript at all. Click tracking still works: the delegated listener
 * in PageTracking is on document in the capture phase, so it sees these like any link.
 */

const DOMAIN = "jameslaurenti.com";

export type CalendarEvent = {
  /** Stable forever. Becomes the .ics UID. */
  id: string;
  title: string;
  /** UTC instant ("2026-09-21T23:00:00Z"), or a bare date ("2026-10-20") when allDay. */
  start: string;
  end?: string;
  allDay?: boolean;
  location?: string;
  details?: string;
  /** For DTSTAMP. Stable, not "now", or clients see the event as edited on every load. */
  updated?: string;
};

/** Google wants compact UTC; a date-only pair for all-day. */
const googleDates = (e: CalendarEvent) =>
  e.allDay
    ? `${e.start.replace(/-/g, "")}/${bumpDate(e.start)}`
    : `${compact(e.start)}/${compact(e.end ?? e.start)}`;

const compact = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function bumpDate(iso: string) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10).replace(/-/g, "");
}

function googleUrl(e: CalendarEvent) {
  const p = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: googleDates(e) });
  if (e.location) p.set("location", e.location);
  if (e.details) p.set("details", e.details);
  return `https://calendar.google.com/calendar/render?${p}`;
}

/**
 * outlook.live.com is the personal Outlook. Work and school accounts live on
 * outlook.office.com, which refuses a personal sign-in and vice versa; personal is the
 * right default for a residents' newsletter.
 */
function outlookUrl(e: CalendarEvent) {
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.title,
    startdt: e.allDay ? e.start.slice(0, 10) : e.start,
    enddt: e.allDay ? bumpIso(e.start) : (e.end ?? e.start),
  });
  if (e.allDay) p.set("allday", "true");
  if (e.location) p.set("location", e.location);
  if (e.details) p.set("body", e.details);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p}`;
}

function bumpIso(iso: string) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * A data: URI rather than a route, so an issue stays a self-contained record. A published
 * issue should not start reading from a live data module: editing that module would
 * silently rewrite what a back issue says.
 */
function icsHref(e: CalendarEvent) {
  const event: IcsEvent = {
    uid: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    allDay: e.allDay,
    location: e.location,
    description: e.details,
    updated: e.updated ?? "2026-09-21T00:00:00Z",
  };
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(singleEventIcs(event, DOMAIN))}`;
}

const ITEM =
  "block px-3 py-2 text-[0.85rem] font-medium text-ink no-underline hover:bg-accent-glow hover:text-accent-deep";

export default function AddToCalendar({
  event,
  label = "Add to calendar",
  compactStyle = false,
}: {
  event: CalendarEvent;
  label?: string;
  /** The tighter treatment used in the dated list at the foot of an issue. */
  compactStyle?: boolean;
}) {
  const summaryClass = compactStyle
    ? "inline-flex cursor-pointer list-none items-center rounded border border-rule bg-white px-2.5 py-1 text-[0.78rem] text-accent hover:border-accent"
    : "inline-flex min-h-10 cursor-pointer list-none items-center rounded border border-rule bg-white px-3.5 text-[0.88rem] font-semibold text-accent hover:border-accent hover:bg-accent-glow";

  return (
    <details className="group relative inline-block [&_summary::-webkit-details-marker]:hidden">
      <summary className={summaryClass}>
        {label}
        <span aria-hidden className="ml-1.5 text-[0.7em] transition-transform group-open:rotate-180">
          &#9660;
        </span>
      </summary>
      <div className="absolute left-0 z-20 mt-1 w-48 overflow-hidden rounded border border-rule bg-white py-1 shadow-md">
        <a
          href={googleUrl(event)}
          target="_blank"
          rel="noopener"
          className={ITEM}
          data-track="calendar_added"
          data-placement="google"
          data-meeting={event.title}
          data-meeting-date={event.start.slice(0, 10)}
        >
          Google Calendar
        </a>
        <a
          href={outlookUrl(event)}
          target="_blank"
          rel="noopener"
          className={ITEM}
          data-track="calendar_added"
          data-placement="outlook"
          data-meeting={event.title}
          data-meeting-date={event.start.slice(0, 10)}
        >
          Outlook
        </a>
        <a
          href={icsHref(event)}
          download={`${event.id}.ics`}
          className={ITEM}
          data-track="calendar_added"
          data-placement="ics"
          data-meeting={event.title}
          data-meeting-date={event.start.slice(0, 10)}
        >
          Apple, or download
        </a>
      </div>
    </details>
  );
}
