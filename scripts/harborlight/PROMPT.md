# Harborlight digest pipeline

You are updating the Harborlight parent digest that powers `/harborlight` on
jameslaurenti.com. Read new Harborlight Montessori school email, extract the
relevant bits, and update three JSON data files, then commit and push. Work only
inside the repo you are launched in. Touch only files under `data/harborlight/`.

If anything is ambiguous, prefer leaving an item OUT over guessing. Never invent
dates or facts. This runs unattended, so do not ask questions; make the safe call
and note it in the run summary you print at the end.

## Step 1 — Read the watermark

Read `data/harborlight/state.json`. Note:
- `lastProcessedDate` (ISO): only consider email newer than this.
- `processedThreadIds` and `excludedThreadIds`: skip these threads entirely.

## Step 2 — Find new mail

Use the Gmail tools. Search these, newest first, and keep anything dated after
`lastProcessedDate` whose thread id is not already in state:
- `from:h-sms@myschoolemails.com newer_than:30d` (Notes from Marcy/Dorah, school-wide)
- `from:h-sms@myschoolapp.com newer_than:30d` (teacher relays)
- `from:harborlight.net newer_than:30d` (direct teacher notes)

Hard-exclude and never include:
- Billing/payment: senders `JDickman`, `AR@harborlight.net`, subjects with
  "Payment", "Invoice", "Past Due".
- Health/admin: sender `SDuncan`, vaccine/immunization threads.
- Any address at `harborlighthomes.org` / `harborlighthomes.ccsend.com` (a
  different nonprofit, not the school), and `rocketmoney.com`.

## Step 3 — Classify each candidate

Assign one category:
- `childrens_house_weekly` — "Notes from Marcy". categoryLabel "Notes from Marcy".
- `it_weekly` — "Notes from Dorah". categoryLabel "Notes from Dorah".
- `school_wide` — all-community announcements (closures, air quality, events like
  MomBall or the Pride Parade, whole-school ceremonies). categoryLabel "School-wide".
- `classroom` — a single classroom's note (subject or body names a room like CH5,
  or is a "New message from <Teacher>" relay to one class). categoryLabel
  "Classroom note". Set `classroom` to the room code (e.g. "CH5").
- Otherwise `exclude` (do not output; add its thread id to excludedThreadIds).

Exclude, in addition to Step 2: individual one-family updates (a note about one
named child sent only to that family, e.g. "Highlights of Jo's day"), and
parent-to-parent social threads (birthday invites, lost-and-found chatter).

## Step 4 — Get the full content

"Notes from Marcy/Dorah" and some school-wide emails from
`h-sms@myschoolemails.com` are only a "click here to view" wrapper. To read them:
1. `get_thread` with `messageFormat: "PLAIN_TEXT"`.
2. In `plaintextBody`, find the URL like
   `https://h-sms.myschoolapp.com/podium/push/default.aspx?i=...&s=...&snd=...`
   (inside parentheses). Use the whole URL, including the `snd` token.
3. `WebFetch` that URL asking for the full text: every announcement, the weekly
   theme, all dates, and every "what to bring" or action item. It opens without a
   login. If the fetch fails, emit the record from the snippet and set
   `confidence: "partial"`.

Teacher relays and direct notes usually carry the text in `plaintextBody`; just
read the thread.

## Step 5 — Build one record per kept email

Match `data/harborlight/digest.json`'s item shape EXACTLY:

```json
{
  "id": "<gmail thread id>",
  "category": "childrens_house_weekly | it_weekly | school_wide | classroom",
  "categoryLabel": "Notes from Marcy | Notes from Dorah | School-wide | Classroom note",
  "classroom": null | "CH5",
  "title": "<short specific title, no em-dashes>",
  "date": "<YYYY-MM-DD of the email>",
  "summary": "<2 to 4 sentences, plain factual recap>",
  "keyDates": [ { "date": "YYYY-MM-DD", "label": "<what happens>" } ],
  "actionItems": [ "<thing a parent must do or bring>" ],
  "links": [ { "label": "Full note", "url": "<podium or resource url>" } ],
  "confidence": "confirmed | partial",
  "source": "<e.g. 'Notes from Marcy, 8/16/2026' or 'CH5 note from Adam, 7/14/2026'>"
}
```

Use `[]` for empty arrays and `null` for no classroom. If a date's year is not
stated, assume the current year.

### Voice (strict)
No em-dashes anywhere; use commas, periods, or restructure. Lead with the answer.
No filler intensifiers (actually, really, simply, truly, genuinely). Credential
unfamiliar terms briefly. Keep summaries concrete.

### Privacy (strict)
Refer to any child by FIRST NAME ONLY. Remove last names, home addresses, phone
numbers, payment/invoice details, and other families' email addresses. For a
classroom note that lists many children, describe the activity without naming
children. Never include a class roster. A staff contact address that the note
itself gives for a task (e.g. the director's for garden donations) may stay.

## Step 6 — Dedupe

Drop any new record whose thread id already appears in `digest.json`. The school
often sends the same note twice (once from `myschoolemails.com`, once as a
"New message" relay from `myschoolapp.com`); if two kept candidates are the same
content on the same day from the same author, keep one (prefer the one with the
podium link).

## Step 7 — Write the three files

- `digest.json`: prepend the new records to `items` so the array stays newest
  first (sort by `date` descending). Keep `_meta`; update `_meta.retrieved` to
  today and `_meta.generator` to "harborlight digest pipeline".
- `events.json`: rebuild `events` from the `keyDates` of the two or three most
  recent `childrens_house_weekly` / `it_weekly` notes plus any `school_wide`
  items, keeping only dates on or after today. Dedupe near-identical entries.
  When notes disagree on a calendar, the most recent note wins. Sort ascending.
  Each event: `{ date, label, category, source }`.
- `state.json`: set `lastProcessedDate` to the newest kept email's date/time,
  append every evaluated thread id to `processedThreadIds` (kept) or
  `excludedThreadIds` (dropped), and set `lastRun` to the current time.

Validate that all three files are still valid JSON.

## Step 8 — Commit and push

If there are new items or changed files:
```
git add data/harborlight/
git commit -m "harborlight digest: <N> new item(s) through <date>"
git push
```
If nothing new, update only `state.json.lastRun`, commit "harborlight digest:
no new items <date>", and push. Vercel redeploys from the push.

## Step 9 — Print a run summary

End with a short summary: how many emails seen, kept per category, excluded (with
one-line reasons), any `partial` records, and the commit hash. This is the log.
