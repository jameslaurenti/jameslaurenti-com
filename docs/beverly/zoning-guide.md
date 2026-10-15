# Zoning guide (experiment): build notes and verification checklist

Unlisted draft at `/experiments/beverly-zoning`. Route code in `app/experiments/beverly-zoning/`;
figures in `data/beverly/zoning-districts.json`, `zoning-guide.json`, `zoning-parcels.json` and
`zoning-minimap.json`; map files in `public/experiments/beverly-zoning/`.

## Where the numbers come from

- **Parcel data (confirmed source, modeled figures).** MassGIS Level 3 assessor parcels for
  Beverly, FY2027 (`L3_SHP_M030_BEVERLY.zip`). `scripts/beverly-zoning/build_zoning_data.py`
  joins the parcel map to the assessor table and writes the district shapes, the address index
  (no owner names, values or sale data), per-district stats and the thumbnail outlines. Re-run it
  when MassGIS publishes the next fiscal year:

  ```
  pip install pyshp shapely pyproj
  python3 scripts/beverly-zoning/build_zoning_data.py        # downloads the zip itself
  ```

  The ZONING field is the assessor's base district, not the official map, and carries no
  overlays. CC2 (the Cabot Street subdistrict) is not recorded there; the page infers it for CC
  addresses on Cabot Street and flags that as unverified.

- **Ordinance, statute and state facts (mostly unverified).** Built while ecode360.com,
  beverlyma.gov, malegislature.gov and mass.gov were blocked from the build environment, and after
  the session's web-search budget ran out. Those facts come from search-engine excerpts and carry
  `status: "excerpt"` / `"unverified"` in the data files and an Unverified badge on the page.
  Facts the Beverly Meeting Digest already reported from primary documents are marked confirmed.

## Verification checklist, highest value first

1. **Ballot Question 7 (November 3, 2026).** The page describes it from the campaign's wording as
   reported in local coverage (single-family lot minimums capped at 5,000 sq ft, frontage at
   50 ft). Check the official summary in the Secretary of the Commonwealth's voter guide before
   sharing the page further, and fix or cut the box.
2. **District rules**, Article VII (https://ecode360.com/29283605), §§ 300-30 to 300-47: purpose
   statements (quoted from excerpts), housing allowed, minimum lot, frontage, height, and the
   by-right and special-permit use lists. Fill the nulls in `zoning-districts.json`. The
   Attachment 2 "Table of Dimensional Requirements" on the Chapter 300 page
   (https://ecode360.com/29283330) may cover most of it at once.
3. **Ord. No. 119-2026 (June 15, 2026)**, listed on eCode360 as adopted but not codified. Find its
   subject; it may be the ADU update heard May 4, 2026.
4. **G.L. c. 40A** §§ 3, 3A, 5, 6, 9, 10, 11, 15, 17
   (https://malegislature.gov/Laws/GeneralLaws/PartI/TitleVII/Chapter40A/Section5, swap the
   number): the 14/21/65/90-day clocks, notice rules, protest petitions after the Housing Choice
   Act, the simple-majority list, the zoning freeze, variance lapse, appeal period.
5. **Beverly Charter** § 3-7 (veto) and the ordinance-adoption section
   (https://ecode360.com/29281568); whether zoning orders pass in two readings.
6. **MBTA Communities**: the City page (https://www.beverlyma.gov/1105/MBTA-Communities-Multifamily-Zoning)
   for the 2,013 offset figure, and EOHLC's compliance letter for the exact date (reported as
   April 25, 2025).
7. **Tax**: the FY2026 commercial rate ($20.98) and the December 1, 2025 classification vote
   (City Assessors page and Council minutes); FY2027 rates once set in December.
8. **SHI**: EOHLC Subsidized Housing Inventory (as of September 30, 2025) for 2,017 of 17,754,
   11.36 percent.
9. **Comparisons**: every row in `zoning-guide.json` `compare`, plus the Dain 2019 figures.

When an item checks out, change its status in the data file to `confirmed` (or move the note to
`level: "confirmed"` in `page.tsx`) and the badge disappears.

## Known gaps

- The ZBA's size, the Planning Board's size, and which board grants which special permits.
- Whether Beverly's ordinance allows use variances.
- How the 2013 Brimbal Avenue rezoning referendum worked under the Charter.
- Overlay boundaries (floodplain, MBTA district, Depot Parking) are not on the map.
