# Release Identity And Automation Reconciliation

Date: September 6, 2026. Task: OP-01, in progress, not approved.
Source: `codex/gpt6-review-implementation` at
`243d71d1d832b398cba86d5c7fcc70deefa25f25` plus the preserved dirty review work.

## Implementation

- `scripts/lib/release-identity.mjs` captures actual Git source without paths,
  credentials or file contents. Missing Git and dirty source fail release proof.
- `scripts/build-site.mjs` wraps Astro and the existing static mirror, recording
  source before and after the build. Both static output trees receive `_build.json`.
- `scripts/run-verified-check.mjs` retains the full existing quality sequence as
  `check:steps`, invalidates any older receipt before starting, and records the
  exit status plus source identity. Dirty development checks can pass without
  generating a verified release receipt.
- The deploy runner requires a clean, matching receipt and remote main before
  an API write, and verifies requested build/runtime/live identity afterward.
  Automatic corrective rebuilds are removed. Reports stay pending until proven.
- Hostinger status distinguishes local test proof, account access, runtime
  configuration and live source identity. No credentials were moved between
  worktrees and no hosting writes were made.

Focused test evidence: new suite initially failed because its implementation was
absent. After implementation, 43 tests passed across release identity, Hostinger
runtime status and Node configuration. Cases include dirty/staged/untracked
source, malformed or stale receipts, runtime mismatch, source mismatch, invalid
JSON/oversized responses, no redirects, and the real deployment command refusing
to proceed before account access without test proof. Independent review and the
full integration gate are still pending at this entry.

## Fresh Hostinger Proof

The Hostinger MCP list-websites read did not return and was stopped. That is a
connector gate, not a production-outage finding. The owner confirmed that
Hostinger is logged into Chrome. Browser 3, tab 1185082651 displayed:

- `https://hpanel.hostinger.com/websites/accessfreetools.com`
- Last deployment: Current, Completed, September 2 at 20:03, duration 1m 21s.
- Branch main; commit `90d6dcab`, message `docs: record published Medium story`.
- Framework Astro; Node version 24.x; custom build/output settings.
- The dashboard warns hosting expires in 10 days. Owner notified; no billing action.

`git ls-remote --exit-code origin refs/heads/main` independently returned full
`90d6dcab0580a91ca66382f2414d95e8817469e5`. A Git fetch exited zero but printed
permission-denied warnings about old worktree administrative directories. No
worktree was removed or repaired. Remote main was therefore checked directly.
The Chrome observation does not show full entry/output settings or a deployed
`_build.json`, and cannot approve local changes as live.

## Automation Reconciliation

Read all five existing automation TOML files. Updated only these three prompts
using the app automation tool, then re-read the persisted configurations:

- `weekly-seo-recrawl-review`: newest exact inspection/date evidence; historical
  July 29 baseline labeled historical; no calendar-only rewrite authority;
  deduplicated approved requests; production-only analytics and game/beta gates.
- `brendan-editorial-release`: current main program governs release-ready rows;
  OCR and Writing Tells already published; Playwright/Vitest deferred. No stale
  scheduled republishing. Preserve source-matched release and duplicate checks.
- `daily-promotion-agent`: exact approved due row, source freshness, public
  duplicate/proof checks, incomplete Pinterest coverage kept unknown, Chrome only.

The first cron update attempts were rejected for an unsupported `cwds` parameter;
no mutation occurred. Updates succeeded with the existing project ID. Persisted
workspace, models, reasoning levels, schedules, ACTIVE states and creation times
remained unchanged. No explicit notification-policy field existed; none was added.
Unchanged/non-actionable runs are quiet in the updated prompts.

`aft-daily-seo-pulse` and `weekly-content-promotion-agent` remain PAUSED and
untouched. No duplicate automation was created. The editorial schedule's existing
finite count remains unchanged; no new article or revived deferred assignment was
authorized. Current main's editorial program is the authoritative source.

## Remaining Acceptance

- Independent implementation review and full checks for this exact patch.
- A clean committed source receipt, gated release decision and actual deployment.
- Live identity matches the tested commit with Node 24, app.js, dist and endpoint
  regressions passing. An old healthy deployment is not evidence of this change.
- No task approval, purchase, indexing request, public post, commit or push is
  claimed by this report.

## Independent Correction Pass

The independent judge added real-wrapper/temporary-Git regressions and found
eight failing cases across five issues. These were retained as failing tests,
not skipped. Fixes now reject index flags that hide tracked edits, foreign Git
directory/index selectors, mismatched repository roots, a missing client build,
and dirty/missing/mismatched build evidence in a check receipt. Status captures
source after the asynchronous live fetch. An additional aggregation regression
proved that a final failed source check could still leave overall status green;
overall status now requires that final check too.

The receipt binds both mirrored build files, clean source, Node 24 and build
time inside the full-check interval. The judge's seed fixture was updated only
to supply this newly required build identity; its eight assertions were preserved.
The full check intentionally remains usable on dirty development source while
the separate deploy boundary refuses any unverified receipt.

Integration run one passed 2,208 tests and failed the existing literal package
command guard. That guard now asserts both the exact wrapper and the unchanged
exact ordered check sequence. Run two passed 2,209 tests and caught the new final
source aggregation case. The third integration run is pending at this entry.
Both failed logs are preserved under `output/project-review-followup/OP-01/`.

Clarity's initial SDK extraction also exposed a test-environment problem:
unrelated vendor TypeScript under ignored output was picked up by the broad
project config. The specialist isolated those inspected sources in output-only
`node_modules`, retained pinned archives/licenses, and updated fixed-member
acquisition. The TypeScript config and its strict checks were not relaxed.
The real recorder matrix was rerun successfully after cleanup; see its own report.

Official reference: [Hostinger Node.js deployment](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/)
describes GitHub-based builds and configurable build/output settings. It does not
establish a guaranteed Git-SHA environment variable; this implementation does not
invent one.

## Final Local Integration

`npm run check` completed at `2026-09-06T09:26:33.636Z`, exit 0:

- Both TypeScript versions; 2,210 tests in 102 files; Astro build with 674 HTML
  pages; links/site checks; 1,984 semantic JSON-LD blocks.
- Seven editorials at four viewports, 15 key visual pairs, 27 automated axe
  checks. The 55 unresolved manual accessibility findings remain explicitly open.
- Performance, AI-asset, image, image-sitemap, gallery and secret checks; npm
  audit reports zero vulnerabilities.
- Source snapshot: 131 source/test/config hashes, no drift in the final comparison.

Evidence: `output/project-review-followup/OP-01/full-check.log`,
`source-snapshot.json`, and `output/release/full-check.json`.
The earlier failed logs are retained. Independent focused rejudge reports 69/69
passing cases with all six findings resolved in that scope.

An actual built Astro Node handler served `/_build.json` on a temporary loopback
port with HTTP 200 and `application/json; charset=utf-8`. The returned object
exactly matches `dist/client/_build.json`, source `243d71d1...`, Node major 24.
The owned HTTP server was closed in `finally`. This is real local serving proof,
not a Hostinger deployment claim.

The full-check receipt correctly records exit 0 but `verified: false` and
`clean: false`, including the matching dirty build identity from this run.
Committing reviewed source and rerunning the check on that clean SHA remain
required before a rebuild request. OP-01 stays in progress until its release
acceptance is actually proven. No commit, push, deployment or public-content
change was made.

## 2026-09-13: Owned Smoke Runner Implementation Handoff

Implementation only, for parent review; not an independent approval of this patch.
Changed only `scripts/run-playwright-smoke.mjs`, added
`scripts/lib/playwright-smoke-runner.test.mjs`, and appended this report/worklog.
No N/T changes, commit, fullcheck, smoke suite, build, inference, or deployment.
N remained clean when rechecked after implementation.

Installed Astro 7's CLI preview uses detached agent backgrounding. The runner now
calls public `astro.preview()` directly, sets explicit loopback/HOST and strict
port selection, owns `stop()`/`closed()`, and rejects an occupied port before
starting preview or Playwright. No private agent-detection environment bypass.
Only actual Playwright close determines its exit code; removed the summary-text
success timer. Startup (120s), inactivity (300s), and cleanup waits (10s each)
are bounded. Signals and failures close only the owned Playwright PID tree (or
new POSIX process group) and preview; cleanup failure returns nonzero. Public
preview has no startup cancellation API: a late handle is collected within the
cleanup budget, otherwise this owning process exits nonzero. OS tree-kill failure
is reported, not represented as successful cleanup.

Exact focused command, Node24.20.0 / Vitest4.1.11, one worker:
`node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/playwright-smoke-runner.test.mjs --maxWorkers=1 --no-cache --reporter=verbose`

- 05:07:53 UTC RED: original runner SHA256
  `070acc1eb7b2d5e5bea8c69fca6a0aa9ad89ab66a2ab72a8f651c6164c000030`;
  13/13 failed, exit1 (356ms). Reproduced early success, wrong tree ownership,
  missing public preview ownership, occupied-port reuse, and ignored cleanup failure.
- 05:10:23 UTC GREEN: 13/13 passed, exit0 (331ms).
- 05:13:10 UTC added-edge RED: 23/24 passed, exit1 (360ms); SIGTERM arriving
  during successful preview cleanup incorrectly returned0. Fixed final signal code.
- 05:13:25 UTC GREEN: 24/24 passed, exit0 (348ms, dot reporter).
- 05:17:18 UTC final GREEN: 26/26 passed, one file, exit0 (3.11s).
  The last two cases execute a byte-identical runner copy with actual installed
  Astro public preview, tiny prewritten static HTML, and fake Playwright CLI.
  Both child exit0 and exit7 propagate despite pass-looking output; `stop()`
  completes and the same loopback port can be rebound. No browser/build involved;
  generated temporary fixtures were removed. Signal/tree-kill failure cases use
  fake external boundaries, not claimed as real OS fault-injection proof.

Frozen SHA256:
- Runner: `0174c2a3a884192a81c99e894a126ea35841e8e076caf822f6853dbc937798ed`
- Focused test: `9c114f753965523ab1d26b299212dbe13c2b34b95489b13f16a303f69f77d9e5`

`git diff --check` passed for scoped tracked changes (existing CRLF conversion
warning only). Exact production diff is the single runner file against R HEAD;
the new focused test is untracked until the coordinator stages it. Terminal
evidence is recorded here; no additional raw log artifact was created under this
write scope. Parent owns independent patch review, fullcheck and actual smoke,
including the existing built Node-adapter path. The tiny proof covers actual
static preview, not a production or Linux lifecycle approval.
