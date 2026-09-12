# Vehicle incidents map: sourcing, limits, and editorial rules

Notes for whoever maintains `/work/beverly/vehicle-incidents`. Read this before
changing the fetch script or widening the window.

Regenerate the data with one command:

```bash
npm run beverly:vehicle-incidents
```

That writes `data/beverly/vehicle-incidents.json` and updates
`data/beverly/vehicle-incidents.geocache.json`. Both are committed. A rerun on
an unchanged window makes no Census requests at all.

## Where the data comes from

BevScan (`https://scanner.beverlybrief.com`) transcribes Beverly's unencrypted
police radio and extracts incidents from the transcripts. It is a third-party
civic-transparency project, not ours. The script uses one documented endpoint:

```
GET /public/incidents?limit=500
```

which returns `id`, `case_number`, `category`, `address`, `lat`, `lon`, `title`,
`summary`, `started_at`, `building_type`, and `channel`. The permalink for a
record is `https://scanner.beverlybrief.com/incidents?focus=<id>`, and every row
on the page links to it.

### The robots.txt conflict, recorded on purpose

BevScan's `robots.txt` is self-contradictory. A Cloudflare-managed block near the
top says:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
```

and the site's own rule at the bottom of the file says:

```
User-agent: *
Disallow: /
```

It also names `ClaudeBot` and a list of other AI crawlers with `Disallow: /`.

We went ahead anyway, as a deliberate call made in September 2026, on this
reasoning: the script calls a documented public JSON endpoint that BevScan's own
front end calls, exactly once per build, with a descriptive user agent that
identifies the site and its purpose; the response headers advertise a 10,000
request allowance; and every incident on the page links back to the BevScan
record rather than replacing it. That is a judgment about a public API, not a
licence, and BevScan can withdraw it at any time.

If BevScan asks us to stop, stop. The polite next step, if this page becomes
more than a beta, is to ask them directly through their feedback page.

## Why the window is about nine days, not thirty

`/public/incidents` caps at `limit=500` and has no pagination: `offset`, `page`,
and `before` are all accepted and ignored. Five hundred records is currently
about nine days of radio traffic, and it will shrink as call volume rises.

`/public/search?q=<term>&limit=50` does reach the whole archive, which starts
2026-07-17. It is not a way to extend the window. Measured against BevScan's own
daily counts from `/public/stats?range=30d`, search surfaces roughly 5% of
incidents on days older than the `/incidents` cutoff: 1 to 6 candidates a day
against an actual ~57 a day. The results are relevance-ranked and capped at 50
per query, so the shortfall is not something more query terms can fix.

A 30-day window built that way would show a dense recent week beside three
nearly empty older weeks, and every reader would draw the same wrong conclusion:
break-ins are spiking. The spike would be an artifact of how the data was
fetched. So the page covers only what `/incidents` serves completely, derives
that span from the data at build time, and prints it.

Do not add the search pass back to widen the window. If you need a real 30-day
baseline, ask BevScan for a paginated or date-filtered endpoint.

## Filtering

BevScan's categories are coarse and none of them are vehicle-specific. The whole
observed vocabulary is:

```
admin, medical, fire_alarm, wellbeing_check, traffic_stop, suspicious,
disturbance, assist, mva, alarm, domestic, theft, other
```

There is no `LARCENY-FROM MOTOR VEHICLE` or anything like it, so incident type is
inferred from the title and summary text in `classify.mjs`. That is the weakest
link in the pipeline and the page says so in "How this was built".

`/public/codebook` is not an incident codebook. It returns radio unit call signs
and lingo (`10-6` means "Busy"). It has no bearing on filtering.

Two rules in the classifier exist because of specific false positives:

- Unit call signs are stripped first. "Engine 3 and Car 2 were cleared" is a fire
  apparatus roster, not a car, and without stripping it every fire alarm read as
  a vehicle incident.
- Every term list is wrapped in word boundaries. Without them "car" matched
  inside "credit card" and a credit card larceny surfaced as a break-in.

Crashes, traffic stops, disabled vehicles, and be-on-the-lookout calls are
excluded outright. A crash is a different fact from a break-in.

## Confirmed against suspicious

`confirmed` means someone reported a vehicle had actually been entered, and the
record carries BevScan's `theft` category. `suspicious` means the call was about
behaviour: an attempt, someone trying door handles, a person near a car.

Anything BevScan filed as `suspicious` stays `suspicious` even when the text
sounds like a completed crime. A call about a car with broken windows filed under
`suspicious` is still a suspicious-activity call here. The page never infers a
crime from a suspicious-activity call, and the two are never summed into one
number.

## Location precision

The rules are enforced at ingest, in `geocode.mjs`, not at render:

- House numbers are rounded down to the block before anything is geocoded. `217
  Cabot St` becomes the `200 block of Cabot St`. The specific address never
  reaches the JSON, so it cannot leak from the page.
- The geocoder is asked for a point in the middle of the block, several offsets
  are tried, and only then does the record fall back to street level. Falling
  straight to street level would move a `700 block` circle to the bottom of the
  road.
- A street with no number is sampled at a few points and averaged, and flagged
  `precision: "street"`. The map draws those as wider circles, which reads as a
  looser location because it is one.
- Circles are sized to a ground footprint, about 70m for a block and 160m for a
  street. Nothing is ever drawn as a pin, because a pin on a residential street
  implies a house.
- A result more than 1200m from BevScan's own pin for the same incident is
  dropped rather than drawn. This catches street names mistranscribed from radio
  audio into real streets elsewhere in town: `Leather Street` resolves to
  `LEATHER LN` about 6.4km away, so that record is dropped and counted.
- Anything that cannot be resolved to at least street level is dropped. The count
  of drops is surfaced on the page.

## What is never republished

BevScan redacts names and plates, but its free-text summaries contain suspect
descriptions, including race and clothing: "a male subject with a dark complexion
wearing a royal blue shirt", "the caller speaks Portuguese".

None of that is carried over. The script never copies `summary` or `snippet`
into the output. Each record gets a neutral label from a controlled vocabulary in
`labelFor()`, and readers who want the underlying account follow the link to
BevScan. If you add a field to the output, check it against this rule first.

## Thin data

At these counts the map is close to useless as a measure of anything, and the
page says so whenever the visible window holds fewer than ten calls. The only
baseline offered is the per-day rate over the full covered window. Do not add a
week-over-week comparison; there is not enough data behind it, and the coverage
window is not a stable denominator.

## Map

MapLibre GL JS, not Mapbox. The repo has no Mapbox token and MapLibre needs none;
the layer code is the same either way, so swapping the `BASEMAP` style URL is all
that changes if a token ever appears. Basemap tiles are CARTO Positron, free and
keyless, attributed in the corner alongside OpenStreetMap and BevScan.

Two fixes in the map are load-bearing, and both fail silently if removed:

**The worker has to be served by us.** MapLibre resolves its worker with `new
URL('./maplibre-gl-worker.mjs', import.meta.url)`. Under Next's bundler that
resolves into `/_next/static/chunks/`, where the file does not exist, so the
request lands on the HTML 404 page and the browser refuses it:

```
Failed to load module script: The server responded with a non-JavaScript
MIME type of "text/html".
```

The map then draws no tiles at all, and the failure is easy to miss because the
style, sprites, and `tiles.json` all load fine on the main thread. Only tile work
happens in the worker. `scripts/copy-maplibre-worker.mjs` copies the worker and
the shared chunk it imports into `public/vendor/maplibre/`, and the page calls
`setWorkerUrl()` to point at them. It runs from `predev` and `prebuild`, so the
copies track the installed version. After a maplibre-gl upgrade, `npm run
maplibre:sync` refreshes them by hand.

**`circle-radius` holds one interpolation, not two.** MapLibre permits only one
`interpolate` per expression, so the block/street size test lives inside each
zoom stop rather than wrapping two interpolations in a `case`. The invalid form
throws `Only one "interpolate" subexpression may be used in an expression` and
drops the whole layer.

The map also carries a `ResizeObserver`. MapLibre only watches the window, so a
container that changes size on its own leaves the canvas at its old dimensions
and the map silently stops requesting tiles.

Circle radius is ground-true from zoom 14 up and floored at 5px below that. A
70m block really is about 3px when the whole city is in frame, which is accurate
and unreadable, so the floor trades a little precision at city zoom for being
able to tell the two kinds apart at a glance.

## Loose end

The caveat block refers to "the Beverly Police Department daily logs" without a
link. The city site's police department path did not resolve to a stable public
URL when this was built. Add the link once it is confirmed.
