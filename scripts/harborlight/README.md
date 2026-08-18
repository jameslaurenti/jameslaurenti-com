# Harborlight parent digest — runbook

A light, gated digest of Harborlight Montessori school notes, published at
`/harborlight` on jameslaurenti.com with an RSS feed. New school email is read,
summarized, categorized, and pushed to the site automatically.

## Pieces

| Piece | Where |
| --- | --- |
| Data | `data/harborlight/{digest,events,state}.json` |
| Page | `app/harborlight/page.tsx` (client), `app/harborlight/layout.tsx` (noindex) |
| Gate | `proxy.ts` + `lib/harborlightGate.ts` + `app/harborlight/enter/page.tsx` |
| RSS | `app/harborlight/feed/[token]/route.ts` |
| Pipeline | `scripts/harborlight/PROMPT.md` (the brain), `run.ps1` (the runner) |

## How the gate works

`proxy.ts` gates `/harborlight` only. Without the `hl_parent_access` cookie the
request redirects to `/harborlight/enter`, which asks for a shared word and sets
the cookie for 120 days. This is friction, not security: the fallback word is in
the repo. The RSS feed is not cookie-gated (readers cannot log in); it sits behind
an unguessable token path instead.

## Environment variables (set in Vercel, Production + Preview)

| Var | Purpose | Fallback in repo |
| --- | --- | --- |
| `HARBORLIGHT_PASSWORD` | The shared word parents type at `/harborlight/enter` | `seahorse` |
| `HARBORLIGHT_FEED_TOKEN` | The path segment for the RSS feed | `seahorse-feed` |

Set both to real values before sharing the link, so the working values are not the
ones printed here. The feed URL is then
`https://www.jameslaurenti.com/harborlight/feed/<HARBORLIGHT_FEED_TOKEN>`.

To share with parents: send them `https://www.jameslaurenti.com/harborlight` and
the shared word. Rotating `HARBORLIGHT_PASSWORD` re-locks everyone on next visit.

## The automated run

`run.ps1` runs Claude headless against `PROMPT.md`. The prompt reads the watermark
in `state.json`, finds new school mail via the Gmail tools, un-wraps "Notes from
Marcy/Dorah" podium links, extracts records (with a privacy pass that keeps
children to first names), dedupes, updates the three JSON files, and commits +
pushes. Vercel redeploys on push.

Requirement: the Gmail connector must be authenticated in this Windows user's
Claude session. That is why the run is local rather than cloud (an interactively
authenticated connector is not available in a headless cloud runner).

### Register the daily Scheduled Task (run once, in an elevated PowerShell)

```powershell
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"C:\Laurenti-Claude\jameslaurentiweb\scripts\harborlight\run.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 7:30am
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -WakeToRun `
  -DontStopOnIdleEnd -RunOnlyIfNetworkAvailable
Register-ScheduledTask -TaskName "Harborlight digest" -Action $action `
  -Trigger $trigger -Settings $settings -Description "Update the Harborlight parent digest"
```

`-StartWhenAvailable` catches up if the PC was asleep at 7:30. Marcy posts Sunday
afternoons; a daily run also catches same-day items like closures. Run it by hand
to test: `powershell -File scripts\harborlight\run.ps1`. Logs land in
`scripts/harborlight/logs/`.

### Kill switch

Create an empty file `scripts/harborlight/PAUSED` to skip runs. Delete it to
resume. Nothing is published while it exists.

## Later: run without the PC on (cloud upgrade)

The local task only runs when the machine is on. To make it PC-independent:
1. Add a Gmail filter that auto-forwards Harborlight mail to a dedicated address,
   or forwards via a Google Apps Script.
2. Read that mailbox from a cloud cron using a stored Gmail API token (service
   account or saved OAuth), which does not need the interactive connector.
3. Keep the same `PROMPT.md` logic; only the mail-fetch step changes.

## Adjusting scope

- Add or drop source senders, or change exclusion rules, in `PROMPT.md` Step 2-3.
- The classroom filter chips on the page are derived from the data; no code change
  is needed when a new room appears.
- To reset the backfill, edit `state.json` (`lastProcessedDate`, `processedThreadIds`).
