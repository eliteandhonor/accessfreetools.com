# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions. States below are initial allocation, not completed work.

## OP-01: Bind release proof and automation handoffs to current source

Priority: P2. Status: in_progress. Lane: operations.
Depends on: EV-01, PR-01.

Completion: Record tested GitSHA and verify non-sensitive deployed build identity; stale mismatch fails. Reconcile existing tasks with currentmain/live routes and approved rows; update schedules only through automation tool, preserve pauses/notifications. Do not create duplicate campaign or delete dirty worktrees.

Evidence command(s): `git worktree list --porcelain; npm run hostinger:status; npm run aft -- proof-check`.
Evidence output: `output/project-review-followup/OP-01/`.

September 13: security18ebd554 is deployed; the current clean correctness
candidate0c78956b passes its full902-test and132-browser local gates with
independent acceptance, but requested deployment approval is unanswered.
R's owned-preview runner has26focused passes, a full2529-test check and two
136-case actual smoke passes. Three active/two paused automations were read
and already correct. No schedule mutation. Exact reports and remaining live
identity gate: ../../reports/local-verification-closeout-2026-09-13.md.

Historical September 6: release identity and test-receipt implementation is under focused
review. Three active automation prompts reconciled through the app tool, with
schedules, models and prior pauses preserved. Chrome proves the current live
deployment is still main `90d6dcab` on Node 24; it does not prove the local review
changes are deployed. Full integration and live identity acceptance remain open.
