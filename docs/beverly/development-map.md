# Development map: spec

Agreed with James on November 9, 2026. This replaces the beta map at `/beverly/development-map`, an iframe of the
June 2026 tracker app (`beverly-property-dev-tracker`, 16 projects, four statuses).

One register, `data/beverly/development-register.json`, feeds the map, a page per site, and the digest's links.
`node scripts/check-development-register.mjs` checks it and works out each site's place on the map. The status
rules (map groups, last heard, quiet) live once, in `lib/beverly/development.mjs`, which both the checker and the
pages import. `lib/beverly/developmentRegister.ts` types the register and turns a source reference into a link.

## What it is for

A bird's-eye view of where Beverly is changing, with each property's history one click away. At a glance it has
to answer two questions: what is being talked about or decided now, and when the thing going up today was decided.

## The rules (agreed Nov 9, 2026)

1. **The digest's rules apply.** This is a neutral, public part of the civic hub.
   - Every fact has a source a reader can open. Applicants' figures and claims are attributed to them.
   - Facts can come in from James's private research notes: dates, case numbers, unit counts, what a filing says.
     Estimates of a project's fiscal effect, judgments of whether it fits PlanBeverly, and opinions stay out.
   - How a proposal lines up with the rules, with no verdict: the proposal section ends with a short, factual
     account of the relief it needs and why. The land section sets out what the zoning allows (the ordinance
     section, read in the official text) and what PlanBeverly says about the area (quoted, with the page).
   - Name the ward, from the city's ward layer. Call the plan PlanBeverly or the city's long-range plan.
   - No owner names from assessor data. Residents go by street or ward. Applicants named in a filing, a public
     presentation or the news are fine.
   - No insinuation. Each chapter says what was proposed, what happened and the source. Earlier proposals on a
     site are listed plainly, never stacked into a pattern.
   - Disclosure follows the digest's threshold. Once it is met for a project, the site page gets a disclosure
     line, and the line stays.
2. **What puts an unfiled idea on the map.** A specific site and a described use, on the public record: an
   official meeting, a statement by the city or the Mayor's office, a developer's presentation at a public meeting,
   a filing, or a named news outlet. Social posts, real estate listings and private email are tips. They can send
   us looking; they can't put a pin down.
3. **Quiet.** Automatic, and only before a decision (talked about, under review): **12 months** with no public
   activity. A scheduled next step, such as a posted hearing, counts as activity. The label gives the date: "No
   public activity since March 2026", never "dead" or "abandoned". A formal ending (withdrawn, denied, lapsed)
   replaces it, and any new activity removes it. Approved projects aren't timed this way. They show their permit
   date instead, and a passed permit date is a prompt to check, not a finding that the permit lapsed.
4. **Scope.** New homes or new buildings that need Planning Board or ZBA approval (site plan review, special
   permit, subdivision, variance), plus public land changing hands (city sales and requests for proposals, federal
   sales). Built projects count if they were finished on or after January 1, 2021, when PlanBeverly took effect,
   however long ago they were approved. Not pins: rezonings and overlays (a later layer), additions to existing
   homes, lot-line changes, changes to hours or signs, and deed histories.
5. **Home.** Inside jameslaurenti.com: the map at `/beverly/development` (redirecting `/beverly/development-map`
   and `/beverly-development`) and a page per site at `/beverly/development/<id>`. Built as one template
   that renders every site in the register. Hidden `/experiments` copies
   first, as with digest issues. The beta iframe retires once the register is complete and the four prototype
   pages read well.

## The model

- **Site**: a piece of land, and one pin. Name, address, parcels, ward, zoning, a point (`location.basis` says how
  it was found), neighborhood when a source names one, depth, and the city's page. Zoning, parcels and the point
  come from the city GIS unless noted.
- **Chapter**: one proposal or process for the site: who (only as named in a filing, presentation or the news),
  what, homes, stage, decided date, and optionally `ending`, `next` (a scheduled step), `permit_until` and
  `status_note` (the city's current wording, which is not an event).
- **Event**: a dated public step with a source, and `digest` when an issue reported it. Dates can be a year, a
  month or a day. Sources are ids in `sources`, or `digest:<issue>#<id>` for our own reporting, which links the
  primary record.
- **History**: dated context that isn't a proposal, such as a feasibility study.
- **Facts** (`facts`, on a site or a chapter): labeled values, each with a source. Numbers a page shows live here,
  not in the page's copy.
- **Statements** by officials or reported in the news are events in the chapter's timeline, attributed in the
  sentence. The applicant's own estimates (traffic, students) are facts, labeled as the applicant's estimate.
  There is no separate "on the record" list (dropped Nov 9, 2026: it read as a for-and-against tally).
- **Approvals** (`approvals`, on a chapter): each board's step, with a status: `needed` (nothing filed),
  `open`, `granted`, `denied`, `withdrawn` or `done` (a finding that isn't a grant). Settled ones carry a date,
  and a vote when there was one.
- **Page sources** (`page_sources`, on a site): sources a page cites in its own copy, such as zoning sections or
  PlanBeverly, so the checker and the page's source list include them.
- **Page data on a site**: `figures` (file, alt text, caption, and the section it goes in), `land_notes` and
  `zoning_notes` (short sourced statements; `more` folds one behind a toggle), `plan` (the map placement, an
  optional definition, and the passages), `digest_extra` (digest explainers to list), and a `title` on a history
  item that needs a heading. On a chapter, `section_sources` names the documents its From line covers.
- **Recordings** (`recordings`, on a site): BevCam meetings where the site came up, oldest first, each with a title,
  a sentence on what happens in it, and optional `moments` (a time and a label) taken from the recording's own
  chapter list or from a digest deep link that `qa-issue` checked. A page with recordings gets a "Watch the
  meetings" section. Only list what a minutes page, chapter list, digest or news report ties to the meeting, and
  say so in the sentence when the tie comes from the news.
- **Digest coverage** on a page is every digest link in the site's timeline plus `digest_extra`, listed by the
  headline stored once in the register's `digest_headlines`.
- **Before 2021** (`earlier.buildings`): buildings and subdivisions of 10 or more homes finished 2005 to 2020,
  citywide (begun Nov 9, 2026 around the Depot for the Rantoul Street wave; widened to the whole city Nov 10). No
  pages, no status. Each has homes, a year with `year_basis` (what a source says, or "assessor"), sources, and an
  optional `story`: the key of an explainer that tells its story (the Rantoul buildings point to `rantoul-street`).
  They are the map's "Before 2021" lens.
- **Explainers** (`explainers`): for each explainer page, the sources it cites in its own copy, so the checker
  counts them.
- **Candidates**: sites found but not yet in scope or not yet understood. **Left out**: things checked and
  excluded, with the reason.

Sources are register ids with an optional page (`"boulder-deck p. 9"`) or, for a YouTube recording, a time
(`"bevcam-cc-2026-09-08 at 34:15"`), which links to that second. Page references are PDF pages, not the
document's printed numbers, so links to city PDFs get a `#page=` anchor that matches the label. (The 2015 study,
an archived copy, is the exception: printed pages, label only.) Every source has a `kind`
(developer, rules, minutes, filing, government, news, study; the list is `SOURCE_KINDS` in
`lib/beverly/development.mjs`), and meeting records a `date`, so pages can group and sort them.

## A site page (agreed Nov 9, 2026, on the Boulder Lane draft)

1. **Header**: neighborhood and ward, name, status chip, decided and last-heard dates, the next scheduled step
   when there is one, a two-sentence lead.
2. **The proposal**, as one section: what it shows (facts), what it would need (approvals, each with where it
   stands), and how it fits the rules, in a few plain sentences. When the section draws on one document, or one
   set of filings on the city's project page, link it once at the top; facts from those carry no link of their
   own.
3. **The land**: map, facts, then what the zoning allows and what PlanBeverly says about the area, in detail.
4. **Earlier ideas for this land**: the history, for deeper reading. Titled "The record so far" when the land
   has no earlier proposal or study.
5. **Sources**, grouped: the digest's coverage first, then by kind, meeting records oldest first.

**One template renders every site** (decided Nov 9, 2026, at the checkpoint):
`app/experiments/preview/beverly-development/[id]/page.tsx`, one page per register site, with the shared pieces in
`parts.tsx`. Section titles come from `pageLabels()` in `lib/beverly/development.mjs`, by stage: before a decision
"The proposal", "What it shows", "What it would need", "This proposal"; after, "The project", "What was
approved", "The approvals", "This project"; the timeline is "Earlier ideas for this land" (earlier proposal or
study, no decision yet), "How it got here" (decided) or "The record so far". The permit clock shows on its own for
an approved project with `permit_until`.

**The written part of a page** lives in `app/experiments/preview/beverly-development/copy/<id>.tsx`, registered in
`copy/index.tsx`: the From line, the lead, a line before and after the approvals, any story-specific subsection,
and "How it fits the rules". Two more, for sites whose record outgrows the stage template (218-226 Cabot, the
first, Nov 9, 2026): `labels` replaces the stage headings (a city sale isn't "The proposal"), and `afterHistory`
adds whole sections after the timeline, such as "What people said" (public comment from minutes, residents by
street, news-sourced summaries saying so). A site with no copy file still gets its page, built from data: the lead is its
`what` plus the city's status line, and the land section falls back to parcels and zoning.

**Site maps** come from `python -I scripts/beverly-development/site_maps.py` (city parcel and street layers,
cached in `scripts/beverly-development/cache/`, not committed), written to
`public/beverly/development/maps/<id>.svg`. A site's own `figures` with `section: "land"` take the map's place
when the digest has drawn a better one.

**Choosing PlanBeverly passages** (the rule): say where the plan's growth map puts the site, with the page, and
say when the placement is ours; then three or four passages, quoted exactly with their pages, covering the
plan's guidance on the questions the site raises, including guidance that points each way. No verdict.

Stages in the data: `talked-about`, `under-review`, `approved`, `under-construction`, `built`. Endings:
`withdrawn`, `denied`, `lapsed`, `dropped` (the proponent stopped, or the land changed hands), `rejected` (the
city turned down the responses to its own request). Quiet is worked out, never stored.

Map groups:

| Group | Stages | Color | Notes |
|---|---|---|---|
| Talked about | talked-about | #b8923a | |
| Under review | under-review | #9c4a24 | |
| Approved | approved, under-construction | #2d6a4f | The pop-up says whether building has started |
| Built | built | #5b6ea8 | Slate blue, Nov 10, 2026: the earlier brown was hard to tell from Approved green for color-blind readers |
| Waiting | talked-about or under-review, not active lately, not yet quiet | #c47f5a | Since 2021 lens only |
| Quiet or ended | any ending, or quiet | #b9b1a5 | Also drawn faded with a gray edge |

The map has three lenses (James, Nov 10, 2026), each with its own key:

| Lens | Shows | Key |
|---|---|---|
| Active lately (opens here) | Talked about, under review and approved sites with an event in the last 90 days or a step scheduled | Talked about, Under review, Approved |
| Since 2021 | Every approved, built, quiet or ended site, plus undecided sites that aren't active lately (as Waiting) | Approved, Built, Waiting, Quiet or ended |
| Before 2021 | `earlier.buildings` | None |

So a finished project never shows under Active lately, and a proposal that's moving shows only there. An approved
project with recent news shows in both. Every site shows two dates: when it was decided ("not decided" before then)
and when it was last heard about (its latest event). The pin follows the site's current chapter, the one heard
about most recently; earlier chapters are its history.

## Depth

Every site gets a page (decided Nov 9, 2026, at the checkpoint). Depth decides how much is written for it, not
whether it has a page:

- **Row**: data only. The page is built from the register: header, facts, approvals, map, timeline, sources.
- **Page**: a copy file with the lead and "How it fits the rules". Talked-about and under-review sites with five
  or more new homes, public land changing hands, and any site the digest runs as a story.
- **Deep**: a page plus a researched history (earlier proposals, old studies, court cases), as for Boulder Lane
  and Folly Hill.

## Upkeep, weekly with the digest

1. When an issue covers a site, add an event with the issue link (`"digest": "2026-11-09#boulder"`), and add the
   site if it's new.
2. Read the land-use watcher's weekly report (`beverly_landuse.mjs` in the digest's ingest folder) for new
   project pages and filings.
3. Run the checker. It lists sites that went quiet, passed permit dates, passed "next" dates, open checks, and
   sources that still need a public link. Fix errors before publishing anything that reads the register.

## Build order

1. This spec. Done Nov 9, 2026.
2. The register, first pass. Done Nov 9, 2026: 23 sites (3 talked about, 3 under review, 11 approved, 6 built)
   and 17 candidates. About 30 open checks, mostly approval and completion dates.
3. Four prototype pages: Boulder Lane (talked about, with two ended chapters), 37 Enon St (under review), Folly
   Hill (approved years after the conversation began) and 40 Dunham Ridge (approved, not built, permit date
   passed Nov 4, 2026). Boulder Lane drafted Nov 9, 2026 at `/experiments/preview/beverly-development/boulder-lane`
   (`app/experiments/preview/beverly-development/boulder-lane/page.tsx`); the others reuse its pieces. 37 Enon St
   drafted Nov 9, 2026 at `/experiments/preview/beverly-development/37-enon-st`, Folly Hill at
   `/experiments/preview/beverly-development/folly-hill` and 40 Dunham Ridge at `/experiments/preview/beverly-development/40-dunham-rd`.
   All four done Nov 9, 2026; the checkpoint is next.
4. **Checkpoint: is the page design modular?** Done Nov 9, 2026: yes; all six recommendations below adopted and
   built the same day. Once the other three prototypes exist beside Boulder Lane, review
   all four together before building the map. Questions: does the layout above hold for each stage (unfiled,
   under review, approved, stalled), or does a stage need its own sections? Which parts of the page should move
   from page copy into the register or shared components, so a new site page is mostly data? Does the row tier
   need a lighter page at all? Decide, then extract the shared page pieces.
5. The map, reading the register. Drafted Nov 9, 2026 at `/experiments/preview/beverly-development`
   (`app/experiments/preview/beverly-development/page.tsx`, `DevMap.tsx`, `DevMapInner.tsx`): Leaflet pins colored by map
   group and sized by homes, three lenses (Active lately, Since 2021, Before 2021; see Map groups) each with its own
   clickable key, pop-ups linking to each site's page, and the same sites as a list below. The base is
   self-hosted: the zoning guide's district shapes in one quiet color, streets showing as gaps. CARTO's basemap
   tiles now return "API KEY REQUIRED", which also affects the zoning guide's map at `/experiments/beverly-zoning`.
6. Go public: move the map and pages from `/experiments/preview/beverly-development` to `/beverly/development`, redirect
   `/beverly/development-map` and `/beverly-development` there, point the hub's card at it, and retire the beta
   iframe and the June tracker app. James's call, after reviewing the drafts.

### Checkpoint review, Nov 9, 2026 (James adopted all six)

**Verdict: the design is modular enough.** All four stages (unfiled, under review, approved long after the
conversation began, approved and stalled) fit the same five sections and the same shared parts. Shared code is
459 lines; each page is 186 to 230, and everything a page writes itself falls into six slots: the lead, how it
fits the rules, the zoning paragraph, the PlanBeverly passages, figures, and the list of digest coverage. Nothing
a stage needed broke the layout; the differences are labels by stage plus one stage-only subsection (the permit
clock).

Recommended next steps:

1. **One page template instead of one file per site.** A single route, `/beverly/development/[id]`, renders any
   site from the register. Labels come from a table by stage:
   - before a decision: "The proposal", "What it shows", "What it would need", "This proposal";
   - after: "The project", "What was approved", "The approvals", "This project";
   - timeline title: "Earlier ideas for this land" when there's an earlier proposal or study and no decision
     yet, "How it got here" once decided, "The record so far" otherwise;
   - the permit clock appears on its own for an approved project with `permit_until`.
2. **Move four of the six slots into the register:** figures (`figures`: file, alt text, caption), the PlanBeverly
   reading (`plan`: the map placement and three or four passages, each with topic, quote and page), the digest
   coverage (taken from the events' digest links, with each story's headline stored once in a small
   `digest_headlines` list), and the zoning statements (a list of short sourced sentences, like facts).
3. **Keep two slots as written prose,** in a small copy file per site: the lead and "How it fits the rules",
   plus any extra subsection a story needs (Folly Hill's access easement, 40 Dunham's permit clock text). That is
   where judgment and clarity matter most, and where the neutrality pass happens.
4. **Every site gets a page.** With the template, a site with no copy file still renders from data alone (header,
   facts, approvals, timeline, sources) behind a lead built from its fields. The depth tiers then decide how much
   writing a site gets, not whether it has a page. This changes the agreed tiers, so it's James's call.
5. **A site map for every page,** drawn by a script from the city's parcel geometry (already fetched for every
   site) into a small SVG per site, the way the digest's maps are made. Folly Hill and 40 Dunham have none today,
   and the map stage needs the same geometry.
6. **A written rule for choosing PlanBeverly passages:** three or four, covering what the plan's map says about
   the spot and the plan's guidance pointing each way on the questions the site raises, each quoted exactly with
   its page. Today the choice is by hand and undocumented.

Risks to carry forward: OCR'd figures (check each against the scan, as done for Folly Hill and 40 Dunham), dated
steps going stale (the checker flags passed "next" and permit dates), and the hub's analysis creeping in (none
has so far).

### Notes for the checkpoint, as pages are built

- **37 Enon St (under review), Nov 9.** The layout held with no new sections. What changed to fit it: approvals
  became data with a status each (one done, one granted, three open); the header shows the next scheduled step;
  the history section is titled "The record so far", since the site has no earlier proposal. The shared pieces
  moved into `parts.tsx` at this point, so the second page is about 250 lines, most of it copy.
- **Still copy on both pages, and candidates for the register:** the PlanBeverly passages (topic, quote, page),
  the list of digest coverage (it could come from the events' digest links plus each story's headline), and
  the zoning paragraph. "How it fits the rules" reads best as written prose and may stay that way.
- **The single From line** worked for both a one-document section (Boulder Lane's slides) and a set of filings
  (37 Enon's project page). Facts from anywhere else keep their own link.
- **Under review means dated steps run out fast.** A "next" date that passes needs an update, or the checker
  flags it; the Nov 17 hearing will be the first test.
- **The hub's analysis stayed out.** Neither page uses the fiscal check, the traffic study brief or the plan
  ledger's verdicts. Disclosure for 37 Enon was considered and isn't needed under the current threshold.
- **Folly Hill (approved), Nov 9.** The layout held, with words changed for a decided project: "The project",
  "What was approved", "The approvals" (all settled, with votes), "How it got here", and "This project" for the
  current chapter (a `currentLabel` option on the timeline). Section titles look like they follow the stage, which
  suggests a small table of labels by stage rather than per-page choices.
- **Two chapters can be one story.** The 2017 to 2024 subdivision plan (lots and a road, no buildings) is its own
  filing with its own decisions, and it set up the apartments. The chapter model holds it, but "Earlier ideas for
  this land" is the wrong title for that; "How it got here" fits.
- **Context goes inside the chapter it explains.** A long chapter (Folly Hill's subdivision plan runs 2016 to 2025)
  sorts by its start, so stand-alone history items dated inside its span read out of order. Items that belong to
  that story (the 2016 information session, the 2019 court case) are events in the chapter; only context that
  stands apart (the 1982 plan, the 2016 rezoning) stays in `history`.
- **Pages need their own site map.** The digest had drawn maps for Boulder Lane and 37 Enon; Folly Hill has none,
  so its page goes without. A map drawn from the register's parcels would fix this for every site, and the map
  stage can supply it.
- **Placing a site on PlanBeverly's map** is now done by fitting the map to its five train stations (largest
  error about 7 pixels on a 1,320-pixel render) and drawing the parcel on it. That check confirmed the Boulder Lane
  and 37 Enon statements and showed most of Folly Hill inside a priority preservation area. The page says the
  placement is ours.
- **40 Dunham Ridge (approved, stalled), Nov 9.** The layout held again. New: a "permit clock" shown in the
  header (worked out in `lib/beverly/development.mjs`, so a passed date shows on the page and in the checker the
  same way), and a short "The permit clock" subsection, because for a stalled project the open question is the
  story. The page states what's on the record (extended to Nov 4, 2026; no further extension posted; the city's
  project page gone) and leaves "lapsed" unsaid until Planning answers.
- **What the four pages share and where they differ.** All four use the same five sections and the same parts.
  The differences are all wording by stage (section titles, "This proposal" or "This project") and one
  stage-specific subsection (the permit clock). Story-specific copy runs two to four short paragraphs a page.
- **Scanned decisions need OCR.** All four Folly Hill decisions are scans. Figures were read from OCR text and
  then checked against crops of the scanned lines (440 apartments, 748 spaces, 61.25 acres, 57 and 56 comments,
  the 7-1, 5-3 and 7-0 votes). Keep doing that check for every OCR'd figure.

Gotcha for page copy: write `{" "}` after a bold run or an inserted value (`{current.homes}`) when the text
that follows on the line holds an HTML entity (`&ldquo;`, `&amp;`, `&apos;`). Without it the compiler drops the
space and the words run together.

## What the first pass found in the beta map

Checked against the city's parcel layer on Nov 9, 2026:

- Three pins are well off their parcels: Briscoe (about 870 m away, on Balch St; the school is parcel 31-13 off
  Sohier Rd), 218-226 Cabot St (about 480 m) and 50 Balch St (about 190 m). Folly Hill and 40 Dunham Ridge sit 540
  to 660 m from their parcels' centers, but both parcels are large, so their pins need the building site from the
  plans.
- Several statuses have moved since June. 108 Sohier Rd and Southwest Rantoul Gateway are now occupied. The city
  lists 397 Cabot St and 20-22 Oak St as approved, where the tracker said complete, and 119 and 478 Rantoul St as
  approved, where it said under construction. The register marks each one to check.
- The tracker has none of the 2025 and 2026 approvals and filings (37 Enon St, 46 Federal St, 4 Linden Ave, the
  OSRD plans on Hart St and Standley St, 115 Cross Ln, 14 Greenwood Ave) or the unfiled sites (Boulder Lane, the
  Coast Guard houses).
