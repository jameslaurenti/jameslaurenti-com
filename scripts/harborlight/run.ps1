# Harborlight digest runner. Invoked by a Windows Scheduled Task (see README.md).
# Runs Claude headless against PROMPT.md, which reads new school email, updates
# data/harborlight/*.json, and commits + pushes. Logs to scripts/harborlight/logs.
#
# Kill switch: create an empty file named PAUSED in this folder to skip runs.

$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Resolve-Path (Join-Path $here "..\..")
$logDir = Join-Path $here "logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$log = Join-Path $logDir "run_$stamp.log"

if (Test-Path (Join-Path $here "PAUSED")) {
  "[$stamp] PAUSED file present, skipping run." | Tee-Object -FilePath $log
  exit 0
}

Set-Location $repo
"[$stamp] starting harborlight digest run in $repo" | Tee-Object -FilePath $log

# claude reads the prompt from stdin. bypassPermissions lets the unattended run use
# Gmail, WebFetch, Edit/Write, and git without prompting. The Gmail connector must be
# authenticated in this Windows user's Claude session for the run to see mail.
$prompt = Get-Content (Join-Path $here "PROMPT.md") -Raw
$prompt | claude -p --permission-mode bypassPermissions 2>&1 | Tee-Object -FilePath $log -Append

"[$stamp] run finished with exit code $LASTEXITCODE" | Tee-Object -FilePath $log -Append

# Keep only the 30 most recent logs.
Get-ChildItem $logDir -Filter "run_*.log" | Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 30 | Remove-Item -Force -ErrorAction SilentlyContinue
