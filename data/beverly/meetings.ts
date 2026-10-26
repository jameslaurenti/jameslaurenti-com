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
    id: "drc-2026-09-28",
    title: "Deficit Reduction Committee: first round recommendations",
    local: "Mon 28 Sep 2026, 6:00pm",
    start: "2026-09-28T22:00:00Z",
    end: "2026-09-29T00:00:00Z",
    location: "Listed for City Council Chambers, 191 Cabot St, Beverly, MA",
    detail:
      "Discussion of each idea for first round recommendations, benchmarking against comparable cities, and scheduling community outreach. City Hall is mid-move, so confirm the room before going. Carried live on BevCam.",
    url: "https://www.youtube.com/watch?v=VHlM49JcQts",
    status: "confirmed",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "state-aid-2026-09-29",
    title: "State Aid Community Conversation, with Rep. Bowen",
    local: "Tue 29 Sep 2026, 6:00pm to 8:00pm",
    start: "2026-09-29T22:00:00Z",
    end: "2026-09-30T00:00:00Z",
    location: "Conrad Room, Beverly Public Library, Farms branch, 24 Vine St, Beverly, MA",
    detail:
      "How the state budget process works and how state funding reaches cities. Hosted by the representative's office rather than the city, so it does not appear on the city calendar.",
    status: "confirmed",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "varian-pip-2026-09-30",
    title: "Varian site cleanup: public update",
    local: "Wed 30 Sep 2026, 7:00pm (doors 6:30pm)",
    start: "2026-09-30T23:00:00Z",
    end: "2026-10-01T01:00:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail:
      "Progress briefing on the state-supervised cleanup of the former Varian facility, 150 Sohier Road, covering January to June 2026. Online option available; carried live on BevCam. Not a city board.",
    url: "https://www.youtube.com/watch?v=mgzRfcfQBtA",
    status: "confirmed",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "council-2026-10-05",
    title: "City Council",
    local: "Mon 5 Oct 2026, 7:00pm",
    start: "2026-10-05T23:00:00Z",
    end: "2026-10-06T02:00:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail:
      "First Council meeting at the Middle School during the City Hall renovation. A proposed temporary pause on data centers (#250); final votes on the ordinance about overgrown trees and shrubs (#221) and the Human Rights Committee quorum (#222); and two ordinances from Councilor St. Hilaire on out-of-state travel (#259) and contracts longer than three years (#260).",
    url: `${AGENDA}/ViewFile/Agenda/_10052026-2938`,
    status: "confirmed",
    updated: "2026-10-04T12:00:00Z",
  },
  {
    id: "planning-2026-10-06",
    title: "Planning Board",
    local: "Tue 6 Oct 2026, 7:00pm",
    start: "2026-10-06T23:00:00Z",
    end: "2026-10-07T01:00:00Z",
    location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    detail:
      "Sets hearing dates for the 37 Enon Street proposal (179 apartments on the Stop & Shop site) and for the proposed data center pause, and adopts this year's fee in lieu of affordable units.",
    url: `${AGENDA}/ViewFile/Agenda/_10062026-2935`,
    status: "confirmed",
    updated: "2026-10-04T12:00:00Z",
  },
  {
    id: "cpa-preapp-2026-10-08",
    title: "Community Preservation grants: pre-applications due (noon)",
    local: "Thu 8 Oct 2026, noon deadline",
    start: "2026-10-08",
    allDay: true,
    location: "City of Beverly, Community Preservation Committee",
    detail:
      "Round 14, about $2.46 million for historic preservation, housing, open space and recreation. Full applications due January 13, 2027.",
    url: "https://www.beverlyma.gov/1307/Current-CPA-Funding-Round-Round-14",
    status: "confirmed",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "parks-2026-10-08",
    title: "Parks and Recreation Commission",
    local: "Thu 8 Oct 2026, 7:00pm",
    start: "2026-10-08T23:00:00Z",
    end: "2026-10-09T01:00:00Z",
    location: "Beverly Senior Center, 90 Colon St, Beverly, MA",
    detail:
      "Updates on Balch Playground phase 2, the Holcroft Park splash pad and the Gillis Park pavilion, plus the parks budget and enterprise fund.",
    url: `${AGENDA}/ViewFile/Agenda/_10082026-2939`,
    status: "confirmed",
    updated: "2026-10-04T12:00:00Z",
  },
  {
    id: "parking-2026-10-13",
    title: "Parking and Traffic Commission",
    local: "Tue 13 Oct 2026, 8:30am",
    start: "2026-10-13T12:30:00Z",
    end: "2026-10-13T14:00:00Z",
    location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    detail:
      "Chase Street one-way proposal, safety reviews near Pickett St and Baker Ave and around Peabody, Larcom and Sargent Aves, and a recommendation to the Planning Board on the Stop & Shop site.",
    url: `${AGENDA}/ViewFile/Agenda/_10132026-2947`,
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },
  {
    id: "analyst-screening-2026-10-14",
    title: "City Council budget analyst screening committee",
    local: "Wed 14 Oct 2026, 2:30pm",
    start: "2026-10-14T18:30:00Z",
    end: "2026-10-14T20:30:00Z",
    location: "Beverly Public Library, Fogg Room, 32 Essex St, Beverly, MA",
    detail:
      "Interviews in closed session, then announces its finalist and the dates for finalist interviews with the full Council.",
    url: `${AGENDA}/ViewFile/Agenda/_10142026-2952`,
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },
  {
    id: "drc-2026-10-15",
    title: "Deficit Reduction Committee",
    local: "Thu 15 Oct 2026, 6:00pm",
    start: "2026-10-15T22:00:00Z",
    end: "2026-10-15T23:30:00Z",
    location: "Location not listed on the agenda",
    detail: "Reviews its presentation for the October 20 community meeting.",
    url: `${AGENDA}/ViewFile/Agenda/_10152026-2953`,
    status: "tentative",
    updated: "2026-10-12T12:00:00Z",
  },
  {
    id: "cpc-2026-10-15",
    title: "Community Preservation Committee",
    local: "Thu 15 Oct 2026, 7:00pm",
    start: "2026-10-15T23:00:00Z",
    end: "2026-10-16T01:00:00Z",
    location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    detail:
      "The Lynch Park match, the seven pre-applications for round 14 grants, and 15 minutes for public questions.",
    url: `${AGENDA}/ViewFile/Agenda/_10152026-2949`,
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },
  {
    id: "flock-joint-2026-10-19",
    title: "Flock cameras: Legal Affairs and Public Services, joint",
    local: "Mon 19 Oct 2026, 6:00pm",
    start: "2026-10-19T22:00:00Z",
    end: "2026-10-19T22:55:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail: "The joint review of the city's license plate reader cameras (#120), before the regular Council meeting.",
    url: `${AGENDA}/ViewFile/Agenda/_10192026-2927`,
    status: "confirmed",
    updated: "2026-10-04T12:00:00Z",
  },
  {
    id: "council-2026-10-19",
    title: "City Council",
    local: "Mon 19 Oct 2026, 7:00pm",
    start: "2026-10-19T23:00:00Z",
    end: "2026-10-20T02:00:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail: "Regular meeting, after the Flock joint committee meeting. No public hearings.",
    url: `${AGENDA}/ViewFile/Agenda/_10192026-2958`,
    status: "confirmed",
    updated: "2026-10-19T12:00:00Z",
  },
  {
    id: "drc-public-2026-10-20",
    title: "Deficit Reduction Committee: community meeting",
    local: "Tue 20 Oct 2026, 6:00pm",
    start: "2026-10-20T22:00:00Z",
    end: "2026-10-20T23:30:00Z",
    location: "Beverly Council on Aging (Senior Center), 90 Colon St, Beverly, MA",
    detail:
      "The committee's slide presentation, then questions from the public.",
    url: `${AGENDA}/ViewFile/Agenda/_10202026-2961`,
    status: "confirmed",
    updated: "2026-10-17T12:00:00Z",
  },
  {
    id: "boh-2026-10-21",
    title: "Board of Health",
    local: "Wed 21 Oct 2026, 6:30pm",
    start: "2026-10-21T22:30:00Z",
    end: "2026-10-22T00:00:00Z",
    location: "Beverly Council on Aging, 90 Colon St, Beverly, MA",
    detail:
      "A proposal from Councilor Sonia to bar construction on state holidays through the noise rules, and an update on opioid settlement money.",
    url: `${AGENDA}/ViewFile/Agenda/_10212026-2959`,
    status: "confirmed",
    updated: "2026-10-19T12:00:00Z",
  },
  {
    id: "clean-energy-2026-10-21",
    title: "Clean Energy Advisory Committee",
    local: "Wed 21 Oct 2026, 6:30pm",
    start: "2026-10-21T22:30:00Z",
    end: "2026-10-22T00:00:00Z",
    location: "Beverly Public Library, Sohier Room, 32 Essex St, Beverly, MA, and online",
    detail: "City updates include the proposed data center pause.",
    url: `${AGENDA}/ViewFile/Agenda/_10212026-2956`,
    status: "confirmed",
    updated: "2026-10-19T12:00:00Z",
  },
  {
    id: "ecdc-2026-10-22",
    title: "Economic and Community Development Council",
    local: "Thu 22 Oct 2026, 8:30am",
    start: "2026-10-22T12:30:00Z",
    end: "2026-10-22T14:00:00Z",
    location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    detail:
      "The Rogers Building on Cabot Street, a state presentation on urban center housing tax breaks, and the Bass River Overlay District.",
    url: `${AGENDA}/ViewFile/Agenda/_10222026-2957`,
    status: "confirmed",
    updated: "2026-10-19T12:00:00Z",
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
  {
    id: "camp-paradise-2026-10-26",
    title: "Camp Paradise public meeting (Public Services, Committee of the Whole)",
    local: "Mon 26 Oct 2026, 6:00pm",
    start: "2026-10-26T22:00:00Z",
    end: "2026-10-26T23:30:00Z",
    location: "Beverly Public Library, Barnet Gallery, 32 Essex St, Beverly, MA",
    detail: "Order #61, from Councilors Mullady and St. Hilaire: the city's use of and plans for Camp Paradise, 44 Cole St.",
    url: `${AGENDA}/ViewFile/Agenda/_10262026-2941`,
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },  {
    id: "council-analyst-2026-10-26",
    title: "City Council: budget analyst screening report and interview",
    local: "Mon 26 Oct 2026, 7:15pm (interview 7:30pm)",
    start: "2026-10-26T23:15:00Z",
    end: "2026-10-27T00:30:00Z",
    location: "Temporary City Hall, 175 Cabot St, first floor conference room, Beverly, MA",
    detail: "Special meeting. The screening committee reports, and the Council interviews a candidate for budget/management analyst.",
    url: `${AGENDA}/ViewFile/Agenda/_10262026-2970`,
    status: "confirmed",
    updated: "2026-10-26T12:00:00Z",
  },
  {
    id: "council-analyst-2026-10-27",
    title: "City Council: budget analyst interviews and possible vote",
    local: "Tue 27 Oct 2026, 6:00pm",
    start: "2026-10-27T22:00:00Z",
    end: "2026-10-28T00:30:00Z",
    location: "Temporary City Hall, 175 Cabot St, first floor conference room, Beverly, MA",
    detail: "Special meeting. Two more interviews, then discussion and a possible vote to elect the Council's budget/management analyst.",
    url: `${AGENDA}/ViewFile/Agenda/_10272026-2971`,
    status: "confirmed",
    updated: "2026-10-26T12:00:00Z",
  },
  {
    id: "planning-2026-10-27",
    title: "Planning Board: data center pause hearing, 37 Enon St",
    local: "Tue 27 Oct 2026, 7:00pm",
    start: "2026-10-27T23:00:00Z",
    end: "2026-10-28T01:30:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA, and online",
    detail: "Public hearing on the proposed data center pause (#250), then 37 Enon St: 179 apartments on the Stop & Shop site.",
    url: `${AGENDA}/ViewFile/Agenda/_10272026-2973`,
    status: "confirmed",
    updated: "2026-10-26T12:00:00Z",
  },

  {
    id: "zba-2026-10-28",
    title: "Zoning Board of Appeals",
    local: "Wed 28 Oct 2026, 7:00pm",
    start: "2026-10-28T23:00:00Z",
    end: "2026-10-29T01:00:00Z",
    location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    detail: "Includes a change to the City Hall addition's design and the continued hearing on a 124-foot Verizon tower at 12 Tozer Rd.",
    url: `${AGENDA}/ViewFile/Agenda/_10282026-2945`,
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },
  {
    id: "retirement-2026-10-29",
    title: "Contributory Retirement Board",
    local: "Thu 29 Oct 2026, 6:00pm",
    start: "2026-10-29T22:00:00Z",
    end: "2026-10-29T23:30:00Z",
    location: "275 Rantoul St, Beverly, MA",
    detail: "The board that sets the city's pension funding schedule. Its own agenda lists this date as tentative.",
    status: "tentative",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "state-election-2026-11-03",
    title: "Massachusetts state election",
    local: "Tue 3 Nov 2026, all day",
    start: "2026-11-03",
    allDay: true,
    location: "Beverly polling places",
    detail:
      "The Council approved the warrant and 14 days of in-person early voting on September 21. The city clerk sets early voting dates and locations.",
    status: "confirmed",
    updated: "2026-09-28T12:00:00Z",
  },
  {
    id: "council-2026-11-09",
    title: "City Council, with the data center pause hearing",
    local: "Mon 9 Nov 2026, 7:00pm (hearing 7:30pm)",
    start: "2026-11-10T00:00:00Z",
    end: "2026-11-10T03:00:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail: "Regular meeting. The public hearing on the proposed data center pause (#250) is set for 7:30pm.",
    status: "confirmed",
    updated: "2026-10-12T12:00:00Z",
  },  {
    id: "council-2026-11-23",
    title: "City Council: National Grid hearings",
    local: "Mon 23 Nov 2026, 7:30pm and 7:40pm hearings",
    start: "2026-11-24T00:30:00Z",
    end: "2026-11-24T01:30:00Z",
    location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    detail: "Public hearings on National Grid's petitions for underground lines on Woodbury Street (7:30pm) and Dane Street (7:40pm). Set October 19.",
    status: "tentative",
    updated: "2026-10-26T12:00:00Z",
  },

];
