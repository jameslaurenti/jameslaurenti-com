/**
 * Beverly public meetings, as a live forward-looking list.
 *
 * This is deliberately NOT the source for any published digest issue. An issue is a
 * dated record of what was known the morning it went out; if it read from here, editing
 * this file would silently rewrite history. Issues keep their own inline copies.
 *
 * What this feeds is `/beverly/meetings.ics`, which residents subscribe to once and then
 * stop having to think about.
 *
 * Times are UTC. Beverly is UTC-4 on daylight time and UTC-5 on standard time, and the
 * switch is 2026-11-01, so a 7:00pm meeting is 23:00Z before that date and 00:00Z (next
 * day) after it. Getting this wrong by an hour is the obvious failure mode here, so each
 * entry carries the local time it was derived from.
 */

export type Meeting = {
  /** Stable forever. It becomes the calendar UID, so never reuse or renumber one. */
  id: string;
  /** What the calendar entry is called. */
  title: string;
  /** Local wall-clock time, for humans checking this file against a posted agenda. */
  local: string;
  /** UTC start. Omit time for an all-day entry and set `allDay`. */
  start: string;
  /** UTC end. Ignored when `allDay`. */
  end?: string;
  allDay?: boolean;
  location?: string;
  detail?: string;
  /** Agenda, recording, or the issue that covered it. */
  url?: string;
  /**
   * `tentative` when the body's own notice says so, or when time or place is unset.
   * Calendar clients show these differently, which is exactly the honesty we want:
   * a date the city has not committed to should not look committed in someone's week.
   */
  status?: "confirmed" | "tentative";
  /** When this entry was last touched. Drives DTSTAMP, so it must not be "now". */
  updated: string;
};

const AGENDA = "https://www.beverlyma.gov/AgendaCenter";

export const meetings: Meeting[] = [
  {
    id: "drc-2026-09-14",
    title: "Deficit Reduction Committee",
    local: "Mon 14 Sep 2026, 6:00pm",
    start: "2026-09-14T22:00:00Z",
    end: "2026-09-15T00:20:00Z",
    location: "City Council Chambers, 191 Cabot St, Beverly, MA",
    detail:
      "Q and A with the City Finance Director, a state funding update from Rep. Bowen, and member research on parking, a municipal electric utility, and regional dispatch.",
    url: "https://www.youtube.com/watch?v=O8Kxggwls3A",
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "planning-2026-09-15",
    title: "Planning Board",
    local: "Tue 15 Sep 2026, 7:00pm",
    start: "2026-09-15T23:00:00Z",
    end: "2026-09-16T02:00:00Z",
    location: "Police Department Community Room, 175 Elliott St, Beverly, MA",
    detail:
      "Special permit at 4 Linden Ave, and a site plan modification to let the McDonald's at 230 Elliott St open 24 hours. Not recorded by BevCam.",
    url: `${AGENDA}/Planning-Board-16`,
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "council-2026-09-21",
    title: "City Council",
    local: "Mon 21 Sep 2026, 7:00pm",
    start: "2026-09-21T23:00:00Z",
    end: "2026-09-22T02:00:00Z",
    location: "City Council Chambers, 191 Cabot St, Beverly, MA",
    detail:
      "Six public hearings between 7:45 and 8:45, and the final passage vote on the crypto kiosk ordinance.",
    url: `${AGENDA}/City-Council-49`,
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "school-2026-09-23",
    title: "School Committee",
    local: "Wed 23 Sep 2026, 6:00pm subcommittees, 7:15pm full committee",
    start: "2026-09-23T22:00:00Z",
    end: "2026-09-24T01:00:00Z",
    location: "Beverly Middle School Library, 502 Cabot St, Beverly, MA",
    detail:
      "Subcommittees at 6:00, full committee at 7:15. Spring sports recognition, the student representative report, and a backlog of meeting minutes.",
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "retirement-2026-09-24",
    title: "Contributory Retirement Board",
    local: "Thu 24 Sep 2026, 6:00pm",
    start: "2026-09-24T22:00:00Z",
    end: "2026-09-24T23:30:00Z",
    location: "275 Rantoul St, Beverly, MA",
    detail:
      "Carried over from August: review of additional pension funding schedules from the board's actuary. The board's own notice lists this date as tentative.",
    url: `${AGENDA}/Contributory-Retirement-Board-3`,
    status: "tentative",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "state-aid-2026-09-29",
    title: "State Aid Community Conversation, with Rep. Bowen",
    local: "Tue 29 Sep 2026, 6:00pm to 8:00pm",
    start: "2026-09-29T22:00:00Z",
    end: "2026-09-30T00:00:00Z",
    location: "Beverly Public Library, Farms branch, 24 Vine St, Beverly, MA",
    detail:
      "How the state budget process works and how state funding reaches cities. Hosted by the representative's office rather than the city, so it does not appear on the city calendar.",
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "council-2026-10-05",
    title: "City Council",
    local: "Mon 5 Oct 2026, 7:00pm",
    start: "2026-10-05T23:00:00Z",
    end: "2026-10-06T02:00:00Z",
    location: "City Council Chambers, 191 Cabot St, Beverly, MA",
    detail: "First Monday.",
    url: `${AGENDA}/City-Council-49`,
    status: "confirmed",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "flock-joint-2026-10-19",
    title: "Flock cameras: Legal Affairs and Public Services, joint",
    local: "Mon 19 Oct 2026, 6:00pm",
    start: "2026-10-19T22:00:00Z",
    end: "2026-10-19T22:55:00Z",
    location: "Venue may change because of the City Hall renovation",
    detail: "Meeting jointly, before the regular Council meeting.",
    status: "tentative",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "drc-public-2026-10-20",
    title: "Deficit Reduction Committee: first public presentation",
    local: "Tue 20 Oct 2026, time not yet set",
    start: "2026-10-20",
    allDay: true,
    location: "Location not yet set",
    detail:
      "The committee presents the list of revenue and savings ideas it has researched since July, and opens public input.",
    status: "tentative",
    updated: "2026-09-16T12:00:00Z",
  },
  {
    id: "fy28-recs-due-2026-10-26",
    title: "FY2028 budget recommendations due",
    local: "Mon 26 Oct 2026, deadline",
    start: "2026-10-26",
    allDay: true,
    location: "Deficit Reduction Committee",
    detail: "Per the committee's own published timeline.",
    status: "tentative",
    updated: "2026-09-16T12:00:00Z",
  },
];
