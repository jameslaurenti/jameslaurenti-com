import type { ReactNode } from "react";
import PageTracking from "@/components/PageTracking";
import AddToCalendar, { type CalendarEvent } from "@/components/beverly/AddToCalendar";

const Src = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className="rlink"
    data-track="source_opened"
    data-placement="sources-row"
  >
    {children}
  </a>
);

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <span className="block text-[0.72rem] font-bold uppercase tracking-[0.16em] text-debt">
    {children}
  </span>
);

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-1 max-w-[63ch] font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
    {children}
  </h2>
);

/** Which meeting an item came from. Thematic items can name more than one. */
const From = ({ children }: { children: ReactNode }) => (
  <p className="mt-2.5 max-w-[63ch] text-[0.9rem] leading-relaxed text-ink-mid">{children}</p>
);

const Fig = ({ children }: { children: ReactNode }) => (
  <span className="font-bold tabular-nums">{children}</span>
);

const Note = ({ children }: { children: ReactNode }) => (
  <div className="mt-5 max-w-[63ch] rounded-r border-l-[3px] border-accent bg-accent-glow px-4 py-3 text-[1rem] leading-[1.7]">
    {children}
  </div>
);

/** Recording time as people read it: 4:39, 46:49, 1:33:54. */
function clock(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/**
 * The one moment in an item most worth hearing, as a button above the text. The printed
 * time is derived from `s`, so the label and the link cannot disagree.
 */
const Hear = ({
  src,
  s,
  title,
  meeting,
}: {
  src: string;
  s: number;
  title: string;
  meeting: string;
}) => (
  <a
    href={at(src, s)}
    target="_blank"
    rel="noopener"
    className="mb-2.5 flex max-w-[63ch] items-center gap-3 rounded-md border border-accent/30 bg-accent-glow px-3.5 py-3 no-underline transition-colors hover:border-accent hover:bg-white"
    data-track="source_opened"
    data-placement="hear-button"
    data-seconds={s}
    data-moment={clock(s)}
  >
    <span
      aria-hidden
      className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-accent pl-0.5 text-[0.7rem] text-white"
    >
      &#9654;
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[0.95rem] font-bold text-accent-deep">{title}</span>
      <span className="text-[0.83rem] tabular-nums text-ink-mid">
        {meeting} &middot; from {clock(s)}
      </span>
    </span>
  </a>
);

/**
 * Every other moment, set inline right after the sentence it backs up. Keeping these next
 * to their claims, rather than in the footer, is what lets the footer be for documents.
 */
const Moment = ({ src, s }: { src: string; s: number }) => (
  <a
    href={at(src, s)}
    target="_blank"
    rel="noopener"
    aria-label={`Hear this in the recording, from ${clock(s)}`}
    className="inline-flex translate-y-[-1px] items-center gap-1 whitespace-nowrap rounded-full bg-accent-glow px-2 py-px align-middle text-[0.74rem] font-semibold leading-snug tabular-nums text-accent no-underline transition-colors hover:bg-accent hover:text-white"
    data-track="source_opened"
    data-placement="inline-moment"
    data-seconds={s}
    data-moment={clock(s)}
  >
    <span aria-hidden className="text-[0.55rem]">
      &#9654;
    </span>
    {clock(s)}
  </a>
);

const Refs = ({ sources, more }: { sources: ReactNode; more?: ReactNode }) => (
  <div className="mt-5 grid max-w-[63ch] gap-1.5 border-t border-rule pt-3">
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.93rem]">
      <span className="min-w-[5.5rem] text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
        Go deeper
      </span>
      {sources}
    </p>
    {more && (
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[0.93rem]">
        <span className="min-w-[5.5rem] text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
          Read more
        </span>
        {more}
      </p>
    )}
  </div>
);

const SECTION = "mt-14 scroll-mt-24";
const BODY = "mt-4 max-w-[63ch] text-[1.0625rem] leading-[1.75]";
const LIST = "mt-4 max-w-[63ch] list-disc space-y-3 pl-5 text-[1.0625rem] leading-[1.7]";

/**
 * A pointer back to the issue where a story was told in full. Follow-ups stay short by
 * linking to the earlier item instead of retelling it.
 */
const Earlier = ({ issue, slug, id, label }: { issue: number; slug: string; id: string; label: string }) => (
  <a
    href={`/beverly/digest/${slug}#${id}`}
    className="rlink"
    data-track="read_more_clicked"
    data-placement="earlier-issue"
  >
    Issue {issue}: {label}
  </a>
);


/* ---------------- sources ---------------- */

const V = "https://www.youtube.com/watch?v=";
const DRC20 = `${V}SB09OZ8Nitk`;
const FLOCK1019 = `${V}x_567bYRlvc`;
const CC1019 = `${V}Ior7anl4lY0`;
const AGENDA = "https://www.beverlyma.gov/AgendaCenter";
const DRC_AGENDA_1020 = `${AGENDA}/ViewFile/Agenda/_10202026-2961`;
const FLOCK_AGENDA = `${AGENDA}/ViewFile/Agenda/_10192026-2927`;
const PACKET_1019 = `${AGENDA}/ViewFile/Agenda/_10192026-2958`;
const SPECIAL_1026 = `${AGENDA}/ViewFile/Agenda/_10262026-2970`;
const SPECIAL_1027 = `${AGENDA}/ViewFile/Agenda/_10272026-2971`;
const PB_1027 = `${AGENDA}/ViewFile/Agenda/_10272026-2973`;
const GSA_LISTING = "https://realestatesales.gov/asset-details/?property_id=79";
const BEAT = "https://thebeverlybeat.substack.com/p";
const BEAT_JAN = `${BEAT}/the-coast-is-clear`;
const BEAT_AUG = `${BEAT}/city-submits-expression-of-interest`;
const ARMY_RECORD =
  "https://www.denix.osd.mil/armybrac/massachusetts-reserve-component/family-housing-beverly-15/";
const CITY_MAP =
  "https://beverlyma.mapgeo.io/datasets/properties?latlng=42.579983%2C-70.88197&previewId=68-56&zoom=18";
const ZONING_R10 = "https://ecode360.com/29283734";
const IFV_2026 =
  "https://www.sec.state.ma.us/divisions/elections/download/information-for-voters/archive/IFV_2026%20English.pdf";
const WBUR_Q7 =
  "https://www.wbur.org/news/2026/10/07/massachusetts-election-ballot-question-7-starter-homes-small-lots";
const OIL_THEFT = "https://www.bostonglobe.com/2026/10/10/metro/beverly-cooking-oil-theft/";
const FLOCK_PORTAL = "https://transparency.flocksafety.com/beverly-ma-pd";
const ELECTION = "https://www.beverlyma.gov/817/Upcoming-Election";
const SOS = "https://www.sec.state.ma.us";
const SOS_MAIL = `${SOS}/divisions/elections/voting-information/vote-by-mail.htm`;
const SOS_WHERE = `${SOS}/WhereDoIVoteMA/WhereDoIVote`;
const TRASH_CAL = "https://www.beverlyma.gov/DocumentCenter/View/6972/2026-Calendar-July--December-PDF";

const at = (src: string, seconds: number) => `${src}&t=${seconds}s`;

const contents: [string, string][] = [
  ["coastguard", "The Coast Guard houses on Laurel Street are headed to auction"],
  ["deficit", "What was new at the deficit committee's community meeting"],
  ["flock", "A month before the Flock contract expires, the decision is the Mayor's"],
  ["ahead", "Coming up, through November 23"],
  ["corrections", "Corrections"],
];

type Ev = { date: string; what: string; detail: string; cal?: CalendarEvent };

const ahead: Ev[] = [
  {
    date: "Oct 26",
    what: "Camp Paradise public meeting",
    detail:
      "6:00pm in the Barnet Gallery at the library, 32 Essex St. A Council committee meeting on the city's use of and plans for Camp Paradise, 44 Cole St, requested by Councilors Mullady and St. Hilaire.",
    cal: {
      id: "camp-paradise-2026-10-26",
      title: "Beverly: Camp Paradise public meeting",
      start: "2026-10-26T22:00:00Z",
      end: "2026-10-26T23:30:00Z",
      location: "Beverly Public Library, Barnet Gallery, 32 Essex St, Beverly, MA",
    },
  },
  {
    date: "Oct 26",
    what: "City Council: budget analyst search",
    detail:
      "Special meeting, 7:15pm at the temporary City Hall, 175 Cabot St, first floor. The screening committee reports, with a recommendation letter from Councilor Houseman, and the Council interviews a candidate at 7:30pm.",
    cal: {
      id: "council-analyst-2026-10-26",
      title: "Beverly City Council: budget analyst interview",
      start: "2026-10-26T23:15:00Z",
      end: "2026-10-27T00:30:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 27",
    what: "City Council: budget analyst vote",
    detail:
      "Special meeting, 6:00pm at 175 Cabot St, first floor. Two more interviews, then discussion and a possible vote to elect the Council's new budget analyst. The current analyst, Gerard Perry, retires by the end of the year.",
    cal: {
      id: "council-analyst-2026-10-27",
      title: "Beverly City Council: budget analyst interviews and possible vote",
      start: "2026-10-27T22:00:00Z",
      end: "2026-10-28T00:30:00Z",
      location: "Temporary City Hall, 175 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 27",
    what: "Planning Board: data center pause and 37 Enon St",
    detail:
      "7:00pm in the Middle School library, 502 Cabot St, and online. A public hearing on the proposed pause on data centers (#250). A zoning change gets a hearing before both the Planning Board and the Council; the Council's is November 9. Then the Stop & Shop site at 37 Enon St: 179 apartments, 22 of them affordable, about 2,600 square feet of retail, and a special permit for 281 parking spaces where 367 are required.",
    cal: {
      id: "planning-board-2026-10-27",
      title: "Beverly Planning Board: data center pause hearing, 37 Enon St",
      start: "2026-10-27T23:00:00Z",
      end: "2026-10-28T01:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Oct 28",
    what: "Zoning Board of Appeals",
    detail:
      "7:00pm at the Police Department community room. Includes a change to the design of the City Hall addition, and the continued hearing on a 124-foot Verizon cell tower at 12 Tozer Road.",
    cal: {
      id: "zba-2026-10-28",
      title: "Beverly Zoning Board of Appeals",
      start: "2026-10-28T23:00:00Z",
      end: "2026-10-29T01:00:00Z",
      location: "Beverly Police Department community room, 175 Elliott St, Beverly, MA",
    },
  },
  {
    date: "Oct 28",
    what: "School Committee subcommittees",
    detail:
      "6:00pm at the Middle School: Finance and Facilities, with the athletic department report, and Curriculum, Instruction and Student Life. Committee of the Whole at 7:15pm.",
  },
  {
    date: "Oct 29",
    what: "Downtown trick-or-treat",
    detail: "4:00 to 6:00pm downtown, Councilor Sonia announced at the Council.",
    cal: {
      id: "trick-or-treat-2026-10-29",
      title: "Beverly downtown trick-or-treat",
      start: "2026-10-29T20:00:00Z",
      end: "2026-10-29T22:00:00Z",
      location: "Downtown Beverly, MA",
    },
  },
  {
    date: "Nov 3",
    what: "State election",
    detail: "Polls open 7:00am to 8:00pm. The city's election page lists each ward's polling place.",
    cal: {
      id: "state-election-2026-11-03",
      title: "Massachusetts state election",
      start: "2026-11-03",
      allDay: true,
      location: "Beverly, MA",
    },
  },
  {
    date: "Nov 4",
    what: "School Committee",
    detail: "6:00pm in the Middle School library, 502 Cabot St, and online.",
  },
  {
    date: "Nov 9",
    what: "City Council: data center hearing",
    detail:
      "The Council's next regular meeting, a week later than usual because of the election. The public hearing on the proposed data center pause is set for 7:30pm.",
    cal: {
      id: "council-2026-11-09",
      title: "Beverly City Council: data center pause hearing",
      start: "2026-11-10T00:30:00Z",
      end: "2026-11-10T02:00:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
  {
    date: "Nov 11",
    what: "Veterans Day",
    detail: "Trash and recycling run one day late for the rest of the week.",
  },
  {
    date: "Mid-Nov",
    what: "The city's Flock contract expires",
    detail: "Per the Mayor on October 19. Whether to renew had not been decided.",
  },
  {
    date: "Nov 23",
    what: "City Council: National Grid hearings",
    detail:
      "Public hearings on National Grid's petitions for underground lines on Woodbury Street, 7:30pm, and Dane Street, 7:40pm.",
    cal: {
      id: "council-2026-11-23",
      title: "Beverly City Council: National Grid hearings",
      start: "2026-11-24T00:30:00Z",
      end: "2026-11-24T01:30:00Z",
      location: "Beverly Middle School library, 502 Cabot St, Beverly, MA",
    },
  },
];

/* Street lines projected from OpenStreetMap (ODbL), North Beverly around Laurel Street.
   Generated once for this issue; the property outline is approximate. */
const LAUREL_MINOR = ["335,-52 338,-52 342,-52 346,-53 354,-57 362,-64 381,-81","441,177 431,161","39,185 40,185 40,183 41,182 41,181 43,179 43,179 49,176 55,173 58,172 62,171 67,171 72,171 76,171 80,170 84,170 88,168","155,214 154,211 125,149","-181,402 -178,400 -163,392 -157,389 -152,389 -148,388 -141,387 -135,387 -132,387 -120,386 -117,386 -108,386 -103,386 -85,390 -71,393 -70,394 -66,395 -62,395 -50,398 -49,398 -41,400 -33,402 -25,403 -24,403 -20,404 -17,406","90,407 92,400 93,395 94,385 95,376 97,362 101,350 105,343 109,339 113,335 120,331 129,327 151,317","271,146 270,146 269,144 244,108 242,107","168,193 167,191 159,177 149,161 143,149 137,140 134,135 125,120 120,111 111,94 111,93","438,474 435,468 432,463 415,439 402,418","240,37 242,33 244,30 245,28 245,21 245,8 247,-18 248,-23 250,-26 253,-28 256,-30 263,-32","125,256 123,252 109,219","368,440 381,431 402,418 403,418 412,413 416,411 420,410 431,410","323,431 331,427 336,426 339,426 344,428 353,431 362,436 368,440 374,445 380,452 383,460 386,463 390,467 396,468 438,474 464,477 491,480 504,481 514,481 521,479 535,478 549,480 559,481 577,483 598,483 639,489 677,495 685,496 690,496 703,497 710,497","40,248 61,279 84,310 85,313","289,133 261,93 260,91","360,159 359,156 355,151 344,132 331,112 324,101 317,89 314,84 309,75 298,61 296,59","290,65 289,62 281,34 280,31 272,4 268,-11 263,-32","265,343 269,341 281,333 292,327 296,324 320,308","263,-32 259,-43 258,-50 259,-56 259,-61 260,-66 260,-70 268,-106 280,-159 281,-162 283,-163 286,-188","40,248 40,245 46,239 53,229 58,222","344,428 350,415 352,412 355,409 364,402 386,388 396,383","444,69 443,67 417,28 396,-6","166,351 164,353 162,356 160,360 158,363 155,366 150,370 143,373 137,375 129,379 126,381 124,384 124,385 124,387 124,390 126,394 128,397 130,400 131,402 133,403 136,405 138,407 140,410 140,414 139,418 139,419 137,423 135,427 134,429 133,430 130,432 128,432 125,430 123,427 122,425 124,421 128,412 129,409 130,405 131,402","215,260 267,227 288,214","292,327 294,330 312,359 314,360 316,360 318,359 334,349 340,344 342,342 354,335","305,404 309,400 312,396 315,393","97,297 95,293 73,252 58,222 49,204 39,185","464,8 462,0 460,-8 459,-11 459,-15 458,-23 458,-29","109,219 108,217 94,183 88,168 88,167 85,160","274,418 263,400 237,357","69,329 67,327 9,256","-133,451 -133,446 -133,445 -130,444 -121,441 -102,434 -89,430 -84,428 -79,423 -75,419 -77,434 -81,447 -83,451 -85,454 -87,457 -91,459 -100,463 -120,469 -123,469 -125,468 -127,466 -130,460 -133,451","-75,419 -72,415 -70,395 -70,394","87,225 109,219","136,241 135,238 103,165 102,162 103,160 125,149","228,361 206,328 198,317 198,317 197,312 196,310 194,309 193,309 191,309 190,310 189,311 189,313 189,315 190,317 191,317 192,317 198,317","109,279 108,276 95,244 87,225 75,197 75,194 75,191 78,189 82,187 94,183","420,-18 417,-31 414,-40 409,-48 403,-56 383,-80 381,-81 361,-106","429,102 420,84 418,83 399,54 372,9 371,7","178,217 166,201 164,199","111,93 127,90 140,88 143,88 160,85 178,82 181,82","302,121 308,128 322,151 338,176 339,177 341,177 345,175 351,173 357,168 359,166 360,164 360,162 360,159","420,84 421,85 423,85 425,83 441,73 443,72 444,71 444,69","268,-11 282,-23 297,-36","140,88 136,60 136,54","136,54 173,47 175,47","477,-35 470,-57 463,-79","407,175 431,161 425,151 399,110 380,78 365,52 363,49 360,48 357,47 355,48 352,49 348,52 346,53 341,54 340,53 336,46 327,34 326,33","281,34 306,12 307,10 307,9 306,7 295,-7 287,-16 282,-23","271,146 273,146 275,145 289,133 294,128 302,121 308,116 324,101","190,379 198,376 228,361 237,357 248,352 261,345 262,344 265,343","413,186 407,175 392,151 372,119 351,87 346,79 343,73 342,68 342,63 341,59 341,56 341,54","87,377 59,340 58,338","47,347 45,345 12,305 -1,289","315,393 322,389 357,365 390,343","315,393 312,393 309,393 306,394 300,396","34,242 37,245 40,248"];
const LAUREL_MAJOR = ["353,812 350,811 345,809 338,807 333,803 330,799 328,797 324,789 321,783 320,782 317,776 294,744 274,717 269,711 265,705 254,689 245,675 239,665 234,655 229,646 225,638 225,637 220,627 216,617 207,594 206,592 205,591 198,572 189,551 185,539 178,522 178,520 174,512 173,506 171,499 171,492 170,485 171,473 172,465 172,461 172,456 174,447 175,439 177,433 179,426 180,425 182,419 183,417 184,413 184,408 184,401 184,395 182,389 182,387 180,383 179,382 177,377 175,372 174,369 170,360 166,351 157,331 155,326 151,317 149,313 141,294 135,280 134,276 127,260 125,256","184,103 184,102 181,83 181,82 180,80 178,64 175,47 175,44 174,41 173,37 172,35 172,33 171,30 169,24 168,20 167,18 167,17 164,7 162,-2 159,-9 158,-12 158,-14 157,-16 152,-31","312,414 311,414 305,404 300,396 280,365 265,343 231,291 221,276 218,270 215,260","342,342 341,340 330,322 320,308 310,293 309,290 310,289 314,285 321,280 324,276 324,274 324,272 317,260 288,214","188,144 192,145 192,146 195,146 197,146 200,145","209,138 203,140 202,140 200,141","200,145 201,144 203,142 209,138","215,260 214,253 215,241 222,184 223,169 224,168 224,164 224,162","260,91 262,89 273,79 290,65 296,59 304,52 322,36 326,33 329,30 335,26 344,21 355,15 358,14 371,7 379,3 382,1 386,-1 394,-5 396,-6","47,347 33,358 25,364 14,373 -0,385 -1,386 -5,388 -5,389 -6,390 -7,390 -10,392 -14,396 -17,400 -18,401 -20,404 -22,407 -23,409 -30,425 -38,448","47,347 58,338 69,329 75,324 81,318 85,313 86,312 90,307 97,297 109,279 109,279 121,262 125,256 130,250 136,241 148,225 155,214 160,206 164,199 168,193","343,463 339,456","-38,448 -36,445 -27,425 -22,415 -21,413 -20,411 -19,411 -17,406 -14,403 -11,400 -6,397 -5,395 -3,393 -2,393 2,389 3,388 8,384 17,376 23,370 36,357 47,347","200,141 194,141","194,141 193,141 189,139","226,122 228,120 231,117 238,111 241,108 242,107 249,101 252,98 260,91","168,193 168,192 176,179 179,174 179,173 182,168 183,166 185,160 185,159 186,158","323,431 317,422","-41,458 -41,457 -38,448","-46,471 -41,458","317,422 312,414","339,456 331,444","331,444 323,431","152,-31 151,-37 147,-47 145,-55 144,-57 143,-60 142,-64 142,-65 142,-68 142,-71 142,-72 141,-83 141,-84 141,-111 140,-129 140,-139 140,-140 140,-167 140,-177 140,-184","209,138 220,127 226,122","288,214 280,202 279,201 279,200 245,150 227,123 226,122","396,-6 401,-9 412,-14 413,-15 419,-18 420,-18 430,-21 438,-24 440,-24 453,-28 458,-29 464,-31 477,-35 482,-36 494,-39 497,-40 502,-42 513,-45 517,-46 527,-48 539,-52 540,-52 545,-53 545,-54","188,144 188,142 189,139 188,136 188,135 188,133 187,126 187,123 185,111 185,108 184,103","186,158 187,150 188,148 188,146 188,144"];
const LAUREL_ST = ["224,162 222,158 220,155 217,150 211,141 210,139 209,138","267,227 232,172 228,167 224,162","292,327 269,292 267,287 266,283 268,279 272,272 278,263 280,260 281,257 281,253 281,249 279,245 267,227"];
const LAUREL_RAIL = ["273,-218 260,-167 245,-98 237,-61 232,-35 227,-7 224,7 218,45 204,128 202,139 202,140 201,144 201,146 196,181 191,213 187,246 183,278 179,314 174,369 170,411 167,440 165,475 162,514 160,549 159,579 158,605 157,631 156,689 155,737 156,767 157,850 157,883 158,908 158,954 159,990 159,1025 160,1064 160,1096 161,1125 161,1161 162,1208 162,1240 163,1285 163,1288 163,1291 163,1311 164,1332 164,1355 164,1377 164,1416 164,1429","273,-218 262,-169 248,-104 235,-39 219,46 219,47 204,139 203,140 203,142 203,145 193,208 188,250 175,372 170,424 166,474 160,603 157,686 157,774 159,910 161,990 164,1285 164,1289 165,1292 165,1310 166,1332 166,1355 166,1377 166,1399 166,1403 166,1408 166,1427"];

function LaurelMap() {
  const ink = "var(--color-ink)";
  const faint = "var(--color-ink-faint)";
  const accent = "var(--color-accent)";
  const label = { fontSize: 13, fill: faint, fontFamily: "var(--font-sans), system-ui, sans-serif" };
  const strong = { ...label, fill: ink, fontWeight: 700 };
  return (
    <figure className="mt-6 max-w-[63ch]">
      <svg
        viewBox="0 0 446 460"
        role="img"
        aria-labelledby="laurel-map-title"
        className="w-full rounded-lg border border-rule bg-white/70"
      >
        <title id="laurel-map-title">
          Map of North Beverly. The Coast Guard houses are at the south end of Laurel Street,
          near Brimbal Avenue, about half a mile south of the North Beverly train station at
          Enon and Dodge streets.
        </title>
        <defs>
          <clipPath id="laurel-clip">
            <rect width="446" height="460" rx="8" />
          </clipPath>
        </defs>
        <g clipPath="url(#laurel-clip)" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {LAUREL_MINOR.map((p, i) => (
            <polyline key={`m${i}`} points={p} stroke="var(--color-rule)" strokeWidth="3" />
          ))}
          {LAUREL_MAJOR.map((p, i) => (
            <polyline key={`M${i}`} points={p} stroke="var(--color-rule)" strokeWidth="8" />
          ))}
          {LAUREL_ST.map((p, i) => (
            <polyline key={`L${i}`} points={p} stroke={faint} strokeWidth="5" />
          ))}
          {LAUREL_RAIL.map((p, i) => (
            <polyline key={`r${i}`} points={p} stroke={faint} strokeWidth="2" strokeDasharray="6 4" />
          ))}
        </g>
        {/* the property, approximate */}
        <rect x="250" y="230" width="50" height="100" rx="10" fill={accent} fillOpacity="0.22" stroke={accent} strokeWidth="3" />
        {/* North Beverly station */}
        <circle cx="204" cy="106" r="8" fill={ink} />
        <text x="216" y="100" style={strong}>North Beverly</text>
        <text x="216" y="116" style={strong}>station</text>
        <text x="308" y="270" style={strong}>Coast Guard</text>
        <text x="308" y="286" style={strong}>houses</text>
        <text x="226" y="200" style={{ ...label, fill: ink }} textAnchor="end">Laurel St</text>
        <text x="110" y="60" style={label}>Enon St</text>
        <text x="40" y="290" style={label}>Dodge St</text>
        <text x="330" y="410" style={label}>Brimbal Ave</text>
        <text x="150" y="215" style={label} textAnchor="end">Commuter rail</text>
      </svg>
      <figcaption className="mt-2 text-[0.82rem] leading-relaxed text-ink-faint">
        Outline approximate, from the listed addresses, 40 to 55 Laurel St. Street data
        &copy; OpenStreetMap contributors.
      </figcaption>
    </figure>
  );
}

/* ---------------- page ---------------- */

export default function DigestIssue7() {
  return (
    <div className="bg-bg text-ink">
      {/* DRAFT: review views are tagged apart so they never count toward issue 7. Set to
          "2026-10-26" when publishing. */}
      <PageTracking surface="digest" issue="2026-10-26-preview" depth />
      {/* DRAFT: remove this banner before publishing. qa:issue fails while it is here. */}
      <div className="bg-gold-strong/20 px-6 py-2 text-center text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink">
        DRAFT, NOT PUBLISHED &middot; for review only
      </div>
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <header className="border-b border-rule pb-7 pt-14">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Issue No. 7 &middot; Week of October 26
          </p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
            Beverly Meeting Digest
          </h1>
          <p className="mt-3 text-[0.9rem] text-ink-faint">
            Covering October 19 to 25, 2026 &middot; Independent, not a City of Beverly
            publication
          </p>
          <p className="mt-5 max-w-[63ch] text-xl leading-snug text-ink-mid">
            The Coast Guard&apos;s 16 empty houses on Laurel Street are headed to auction; a
            city councilor says the city looked into buying them and is not moving forward. The
            deficit committee presented its research to the public for the first time. And with the
            city&apos;s Flock contract about a month from expiring, two Council committees took a
            second look at the cameras. Next week the Council picks its new budget analyst, and the Planning Board holds its
            hearing on the data center pause.
          </p>
        </header>

        <nav aria-label="In this issue" className="mt-8 border-l-2 border-accent pl-5">
          <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
            In this issue
          </h2>
          <ol className="mt-2.5 space-y-1.5">
            {contents.map(([id, label], i) => (
              <li key={id} className="text-[0.97rem] leading-snug">
                <span className="mr-2 tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={`#${id}`} className="font-medium text-accent hover:underline">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <h2 className="mt-14 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
          What happened{" "}
          <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
            October 19 to 25
          </span>
        </h2>

        {/* ---- 01 ---- */}
        <section
          id="coastguard"
          data-dek={"The 16 empty Coast Guard houses on Laurel Street are listed for online auction, with no dates set, after the state and the city passed on buying them. What a buyer could do with the land under today's zoning, and under Question 7 on the November 3 ballot."}
          className={SECTION}
        >
          <Eyebrow>01 &middot; Housing</Eyebrow>
          <H2>The Coast Guard houses on Laurel Street are headed to auction</H2>
          <From>Not from a meeting: a councilor&apos;s public post and the federal sale listing</From>
          <p className={BODY}>
            Sixteen houses on Laurel Street in North Beverly, owned by the Coast Guard and empty
            since about 2023, are headed to auction. Ward 5 Councilor Kathleen Feldman wrote on her
            public Facebook page this week that the city looked further into buying them and is
            &ldquo;not moving forward,&rdquo; so the General Services Administration (GSA), the
            agency that sells surplus federal property, is preparing the sale. GSA lists the
            property for online auction, marked &ldquo;Coming Soon.&rdquo; No auction dates or
            bidding documents are posted yet.
          </p>
          <LaurelMap />

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What is for sale
          </h3>
          <p className={BODY}>
            Sixteen detached one-story ranch houses, each with three bedrooms and one bath, half a
            mile from the North Beverly train station. GSA&apos;s listing describes them as one
            5.36-acre lot, sold together, not house by house. The city&apos;s assessing records show
            the houses on two parcels, one on each side of Laurel Street, of 4 acres and 2.4 acres.
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            How it got here
          </h3>
          <ul className={LIST}>
            <li>
              <b>Built for a missile battery.</b>{" "}
              The Army built the houses in 1958 for soldiers at Beverly&apos;s Nike missile sites,
              part of a national air-defense system. The missile site closed in 1963, but the
              housing stayed in use, and in 1990 it passed to the Coast Guard, which housed members
              stationed in Boston, Gloucester and Newburyport.
            </li>
            <li>
              <b>Empty since about 2023.</b>{" "}
              The Coast Guard moved its families out around then. It had an environmental review
              done before the sale, and in January it told The Beverly Beat the review found
              &ldquo;no concerns.&rdquo;
            </li>
            <li>
              <b>The state and the city passed.</b>{" "}
              Federal law gives state and local governments the first chance to buy surplus federal
              property. The state did not apply. The city filed an expression of interest in August,
              which gave it 60 days to look into a purchase; the Mayor said then that he did not
              expect the city to buy. Councilor Feldman&apos;s post this week says it is not moving
              forward. With no government buyer, the property goes to auction.
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What a buyer could do
          </h3>
          <p className={BODY}>
            GSA markets the property as a &ldquo;turnkey&rdquo; compound, 16 houses ready to use.
            A buyer who wanted to clear the land and build would work under the city&apos;s zoning.
            Both parcels are in the R-10 district, which allows only single-family houses. Today each new house would need its own
            lot of at least 10,000 square feet, with 100 feet of frontage on a street. Anything
            denser would need a special permit or other approval from the city.
          </p>
          <p className={BODY}>
            <b>Question 7.</b>{" "}
            A statewide question on the November 3 ballot would change those numbers. If it
            passes, a single-family house could be built on any residential lot of at least 5,000
            square feet with 50 feet of frontage and public water and sewer, without a special
            permit, even where local rules require more. Cities and towns would still set rules
            such as height, setbacks and parking. It would take effect about a month after the
            election, with state regulations to follow. GSA has not set an auction date, so it is
            not yet known which rules bidders would be weighing.
          </p>
          <Refs
            sources={
              <>
                <Src href={GSA_LISTING}>GSA sale listing</Src>
                <Src href={ARMY_RECORD}>Army record of the site</Src>
                <Src href={ZONING_R10}>Beverly zoning, R-10 rules (§ 300-34)</Src>
                <Src href={CITY_MAP}>City property map</Src>
                <Src href={IFV_2026}>State voter guide</Src>
              </>
            }
            more={
              <>
                <Src href={WBUR_Q7}>WBUR on Question 7</Src>
                <Src href={BEAT_AUG}>The Beverly Beat, Aug 20</Src>
                <Src href={BEAT_JAN}>The Beverly Beat, Jan 14</Src>
              </>
            }
          />
        </section>

        {/* ---- 02 ---- */}
        <section
          id="deficit"
          data-dek={"The Deficit Reduction Committee's first presentation to the public added ideas on retirees' health insurance, parking and moorings. Members' early estimates run from tens of thousands of dollars a year for some fees to $1 million to $2 million a year for each change to who pays health premiums. Four residents spoke."}
          className={SECTION}
        >
          <Eyebrow>02 &middot; Deficit Reduction Committee</Eyebrow>
          <H2>What was new at the deficit committee&apos;s community meeting</H2>
          <From>Deficit Reduction Committee &middot; Tuesday, October 20 &middot; Council on Aging</From>
          <Hear
            src={DRC20}
            s={288}
            title="The committee opens its first community meeting"
            meeting="Deficit Reduction Committee, Oct 20"
          />
          <p className={BODY}>
            The Deficit Reduction Committee, whose regular meetings have been public all along,
            presented its research to the public for the first time at a community meeting, then
            took questions. Most of the slides followed the run-through we described
            last week. Below is what was new.{" "}
            <Moment src={DRC20} s={314} />{" "}
            <Earlier issue={6} slug="2026-10-19" id="deficit" label="what the committee planned to present" />
          </p>
          <Note>
            <b>Not a plan.</b>{" "}
            Members said policy decisions belong to the city&apos;s elected officials. The chair, Councilor
            Kathleen Feldman, said no idea belongs to the member who presented it, and that some
            came from residents.{" "}
            <Moment src={DRC20} s={314} /> <Moment src={DRC20} s={3968} />
          </Note>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            New on Tuesday
          </h3>
          <ul className={LIST}>
            <li>
              <b>Retirees&apos; health insurance.</b>{" "}
              The city pays 80% of health premiums for retirees, as it does for employees. A
              member&apos;s research looked at moving retirees to the state minimum, 50%, alongside
              moving employees&apos; share from 20% to 30%. The employee change would have to be
              negotiated with the unions, most of whose contracts, the member said, are up in July 2027.{" "}
              <Moment src={DRC20} s={825} /> <Moment src={DRC20} s={892} />
            </li>
            <li>
              <b>Parking.</b>{" "}
              Doubling the meter rate from $1 to $2 an hour; meters on the roughly 180 free spaces
              along Lothrop Street from Independence Park to Dane Street Beach; and a &ldquo;parking
              benefit district,&rdquo; which returns part of an area&apos;s meter money to that
              area.{" "}
              <Moment src={DRC20} s={1595} /> <Moment src={DRC20} s={1669} />{" "}
              <Moment src={DRC20} s={1733} />
            </li>
            <li>
              <b>Moorings.</b>{" "}
              The fee is $7 a foot, raised from $5.50 last year after at least ten years unchanged.
              Salem charges $7, Danvers $5 and Marblehead $13. About 100 people are on the waiting
              list, and the wait is three to five years. Mooring fees go to the city&apos;s general
              budget.{" "}
              <Moment src={DRC20} s={2065} />
            </li>
            <li>
              <b>Not pursuing.</b>{" "}
              The golf course, whose fees stay with the course because it runs as a self-supporting
              fund; the Beverly Harbor Management Authority, which the state created and which sits
              outside city government; and airport fees.{" "}
              <Moment src={DRC20} s={1925} /> <Moment src={DRC20} s={2149} />{" "}
              <Moment src={DRC20} s={2202} />
            </li>
          </ul>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            How the ideas compare in size
          </h3>
          <p className={BODY}>
            Members&apos; early estimates, which they called preliminary, put each of the two
            changes to who pays health premiums at $1 million to $2 million a year, the parking ideas in the hundreds of
            thousands, and fees for the summer park program and moorings in the tens of
            thousands.{" "}
            <Moment src={DRC20} s={871} /> <Moment src={DRC20} s={1629} />{" "}
            <Moment src={DRC20} s={1399} />
          </p>

          <h3 className="mt-7 max-w-[63ch] font-display text-lg font-bold leading-snug">
            What residents said
          </h3>
          <ul className={LIST}>
            <li>
              One said cities that ask tax-exempt owners for payments usually ask for a quarter of
              what the property would pay in taxes, and receive far less; services in place of
              payments are the better prospect, the resident said.{" "}
              <Moment src={DRC20} s={3021} />
            </li>
            <li>
              One said meter enforcement ends in the evening, so theatergoers can park for free in
              permit areas downtown, and suggested wider permit parking and zoning changes, such as
              to parking minimums.{" "}
              <Moment src={DRC20} s={3240} />
            </li>
            <li>
              One asked whether these ideas fix a long-term gap or whether the city needs more
              tax revenue. A member answered that health insurance costs, up by double digits each
              of the last four years, are the largest driver.{" "}
              <Moment src={DRC20} s={3465} /> <Moment src={DRC20} s={3538} />
            </li>
            <li>
              A Lothrop Street resident asked that any rate increase be phased in, that beach
              parking fees fall on non-residents rather than residents, and that side streets be
              protected from overflow, and said the core of the deficit is salaries and benefits.{" "}
              <Moment src={DRC20} s={3661} />
            </li>
          </ul>
          <p className={BODY}>
            Four other councilors attended; with the two on the committee, that made a quorum of
            the Council, so they did not take part.{" "}
            <Moment src={DRC20} s={4122} />
          </p>
          <p className={BODY}>
            <b>Next.</b>{" "}
            More meetings this fall and winter, possibly focus groups or listening sessions, with
            dates to be posted, and recommendations to city leaders by spring 2027. Questions can
            go to any committee member or to Councilors Feldman and Mullady.{" "}
            <Moment src={DRC20} s={2866} /> <Moment src={DRC20} s={2988} />
          </p>
          <Refs
            sources={
              <>
                <Src href={DRC_AGENDA_1020}>Meeting notice</Src>
                <Src href={DRC20}>Full recording</Src>
              </>
            }
            more={
              <>
                <Earlier issue={6} slug="2026-10-19" id="deficit" label="the committee's research" />
              </>
            }
          />
        </section>

        {/* ---- 03 ---- */}
        <section
          id="flock"
          data-dek={"The city's Flock contract expires in mid-November, and whether to renew it is the Mayor's decision, councilors heard at their second meeting on the cameras. No decision has been made. About 14 residents spoke, all asking the city to end it."}
          className={SECTION}
        >
          <Eyebrow>03 &middot; Flock cameras</Eyebrow>
          <H2>A month before the Flock contract expires, the decision is the Mayor&apos;s</H2>
          <From>
            Legal Affairs and Public Services committees, with the Committee of the Whole &middot;
            Monday, October 19 &middot; Order #120, filed by Councilors Rotondo and Spang
          </From>
          <Hear
            src={FLOCK1019}
            s={3237}
            title="Councilor Rotondo on who decides"
            meeting="Joint committee meeting, Oct 19"
          />
          <p className={BODY}>
            Two Council committees took their second look at the city&apos;s Flock license plate
            cameras with about a month left on the contract with Flock Safety: it expires in the
            middle of November, the Mayor said. Whether to renew it has not been decided, the
            police chief said. Councilor Rotondo, who chaired the meeting, said the contract is the
            Mayor&apos;s decision as the city&apos;s chief procurement officer; the Council&apos;s
            role is to hear residents and press their concerns. The committees took no vote.{" "}
            <Moment src={FLOCK1019} s={1591} /> <Moment src={FLOCK1019} s={2865} />{" "}
            <Moment src={FLOCK1019} s={3237} />{" "}
            <Earlier issue={6} slug="2026-10-19" id="flock" label="the cameras and the rules" />
          </p>
          <p className={BODY}>
            <b>What police said.</b>
          </p>
          <ul className={LIST}>
            <li>
              In this month&apos;s <Src href={OIL_THEFT}>thefts of used cooking oil</Src> from two
              Cabot Street restaurants, police used the cameras to find a second vehicle acting as a
              lookout and alerted other departments, a lieutenant said.{" "}
              <Moment src={FLOCK1019} s={1420} />
            </li>
            <li>
              Still four cameras. The one on Brimbal Avenue has been down since the windstorms;
              Flock would replace it.{" "}
              <Moment src={FLOCK1019} s={1912} /> <Moment src={FLOCK1019} s={2024} />
            </li>
            <li>
              Data is shared only with Massachusetts law enforcement agencies. Federal or out-of-state
              agencies have to ask Beverly police directly.{" "}
              <Moment src={FLOCK1019} s={1461} />
            </li>
            <li>
              Data is kept 30 days, and the department is discussing cutting that to seven.{" "}
              <Moment src={FLOCK1019} s={2786} /> <Moment src={FLOCK1019} s={2881} />
            </li>
            <li>
              Flock&apos;s automated audit has flagged three or four searches, all within the
              department&apos;s policy, said a lieutenant who administers the system.{" "}
              <Moment src={FLOCK1019} s={2255} />
            </li>
            <li>
              The city has not priced running a similar system itself.{" "}
              <Moment src={FLOCK1019} s={2146} />
            </li>
          </ul>
          <p className={BODY}>
            <b>Public comment.</b>{" "}
            About 14 residents spoke, all asking the city to end the contract or let it lapse,
            citing privacy, constitutional concerns, data security and misuse elsewhere. One more
            spoke at the Council meeting that followed. Police described cases the cameras helped
            with, including a home invasion, a man who had threatened suicide, and a hit-and-run.
            Councilors&apos; questions came from a list residents submitted, put together by
            Councilor Spang.{" "}
            <Moment src={FLOCK1019} s={119} /> <Moment src={FLOCK1019} s={1110} />{" "}
            <Moment src={FLOCK1019} s={1874} /> <Moment src={CC1019} s={932} />
          </p>
          <Refs
            sources={
              <>
                <Src href={FLOCK_AGENDA}>Committee agenda</Src>
                <Src href={FLOCK1019}>Full recording</Src>
                <Src href={FLOCK_PORTAL}>Police transparency portal</Src>
              </>
            }
          />
        </section>


        <div className="mt-12 max-w-[63ch] border-y border-rule py-3.5">
          <p className="text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also at the Council, October 19.</b>{" "}
            The Council voted 8-0, with Councilor Spang absent, to accept the private stretch of
            Millbrook Road, past Hickory Lane, as a public street, submitted by the Mayor; its
            owners donated the easements.{" "}
            <Moment src={CC1019} s={3182} />{" "}
            Councilor Houseman&apos;s request that the Mayor fund the Human Rights Committee with
            $20,000 was put off until before November 9, so the Mayor and the committee&apos;s
            chair can meet first.{" "}
            <Moment src={CC1019} s={1550} />{" "}
            The Council&apos;s next regular meeting is November 9, and it set November 23 hearings on
            National Grid&apos;s petitions for underground lines on Woodbury and Dane streets.{" "}
            <Moment src={CC1019} s={1668} /> <Moment src={CC1019} s={3478} />{" "}
            <Src href={`${PACKET_1019}#page=38`}>Millbrook letter (p. 38)</Src>{" "}
            <Src href={CC1019}>Full recording</Src>
          </p>
          <p className="mt-3 text-[0.93rem] leading-relaxed text-ink-mid">
            <b className="text-ink">Also met, no video posted:</b>{" "}
            the Water Supply Board, the Board of Health, the Clean Energy Advisory Committee, the
            Harbor Management Authority, the Economic and Community Development Council and the
            Veterans Advisory Council. Issue 6 listed what was on their agendas. The record is the
            agenda now and the minutes once they are approved; no minutes have been posted for any
            city meeting since mid-September.{" "}
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </div>

        {/* ---- 04 ---- */}
        <section id="ahead" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Coming up{" "}
            <span className="float-right pt-1.5 text-[0.8rem] font-normal text-ink-faint">
              through November 23
            </span>
          </h2>
          <div className="mt-5 grid max-w-[63ch] gap-3">
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Voting in the November 3 election
              </p>
              <ul className="mt-2.5 space-y-2 text-[0.97rem] leading-[1.6]">
                <li>
                  <b>Early voting</b>{" "}runs through Friday, October 30, at the temporary City Hall,
                  175 Cabot St, first floor (the former TD Bank). Mondays to Wednesdays 8:30am to
                  4:30pm, Thursdays to 7:30pm, Fridays to 1:00pm.
                </li>
                <li>
                  <b>Voting by mail?</b>{" "}Applications must reach the city clerk by 5:00pm on
                  Tuesday, October 27.{" "}
                  <Src href={SOS_MAIL}>How to vote by mail</Src>
                </li>
                <li>
                  <b>Election Day</b>{" "}is Tuesday, November 3, with polls open 7:00am to 8:00pm.{" "}
                  <Src href={SOS_WHERE}>Find your polling place</Src>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-rule bg-white/70 px-5 py-4">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                Leaf and yard waste pickup
              </p>
              <p className="mt-2.5 text-[0.97rem] leading-[1.6]">
                On your regular trash day the weeks of November 2, November 16 and November 30.
                Paper bags or open barrels, at the curb by 7:00am, no limit. The yard waste site at
                16 Standley St is open Mondays, Thursdays and Saturdays, 7:00am to 3:30pm, through
                December 19.{" "}
                <Src href={TRASH_CAL}>The city&apos;s pickup calendar</Src>
              </p>
            </div>
          </div>
          <ul className="mt-5 max-w-[63ch]">
            {ahead.map((e) => (
              <li
                key={`${e.date}-${e.what}`}
                className="grid grid-cols-[4.5rem_1fr] gap-x-3 border-t border-rule py-3 first:border-t-0 sm:grid-cols-[5rem_1fr_auto]"
              >
                <span className="text-[0.82rem] font-bold uppercase tracking-wide text-debt">
                  {e.date}
                </span>
                <span className="col-start-2">
                  <span className="text-[1rem] font-semibold">{e.what}</span>
                  <span className="mt-0.5 block text-[0.88rem] leading-relaxed text-ink-faint">
                    {e.detail}
                  </span>
                </span>
                {e.cal && (
                  <span className="col-start-2 mt-2 sm:col-start-3 sm:mt-0">
                    <AddToCalendar event={e.cal} label="+ calendar" compactStyle />
                  </span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.93rem]">
            <Src href={`${SPECIAL_1026}#page=1`}>Oct 26 Council notice (p. 1)</Src>
            <Src href={`${SPECIAL_1027}#page=1`}>Oct 27 Council notice (p. 1)</Src>
            <Src href={`${PB_1027}#page=1`}>Planning Board notice (p. 1)</Src>
            <Src href={ELECTION}>The city&apos;s election page</Src>
            <Src href={AGENDA}>Agendas</Src>
          </p>
        </section>

        {/* ---- 05 ---- */}
        <section id="corrections" className={SECTION}>
          <h2 className="mt-4 border-b-2 border-ink pb-1.5 font-display text-xl font-bold tracking-tight">
            Corrections
          </h2>
          <ul className={LIST}>
            <li>
              Issue 6 linked to a BevCam video for the October 19 Council meeting that BevCam later
              made private. The meeting&apos;s recording is <Src href={CC1019}>here</Src>.
            </li>
            <li>
              Issue 6 listed the October 27 Planning Board meeting at the Police Department, before
              its notice was posted. The notice puts it in the Middle School library, 502 Cabot St.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
