# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions. States below are initial allocation, not completed work.

## PR-01: Enforce four-channel policy at every public-action boundary

Priority: P1. Status: approved. Lane: main. Decision authority: Release Judge, September 6 at 08:44:54 UTC, [terminal decision](../../reports/promotion-pr02-correction-rejudge.md). Exact task only; no public or release approval.
Depends on: none.

Completion: Inactive/unknown channels cause zero credential reads/networkwrites even with publish flags. Exactly one channel per actionable row; reconcile mixed status from dated public proof, not assumptions. needsapproval never executable; leave historical files protected.

Evidence command(s): `npm test; npm run promotion:four-channel-review; npm run marketing:orchestrate`.
Evidence output: `output/project-review-followup/PR-01/`.

## PR-02: Make four-channel health and source review evidence explicit

Priority: P2. Status: approved. Lane: main. Decision authority: Release Judge, September 6 at 08:44:54 UTC, [terminal decision](../../reports/promotion-pr02-correction-rejudge.md). Exact task only; missing public proof remains missing.
Depends on: PR-01.

Completion: All4channels report passed/failed/missing/stale separately. Pinterest/sitefailure cannot hide behind Medium+Blueskypass. Primary-source presence not verification; future articles have dated claim-to-source and Brendan fact/approval notes. Preserve disclosures; no mass rewrite or posting.

Evidence command(s): `npm test; npm run promotion:four-channel-review; npm run check:editorial-quality; npm run marketing:orchestrate`.
Evidence output: `output/project-review-followup/PR-02/`.

September 6 follow-up: [integration report](../../reports/promotion-security-integration-2026-09-06.md) records 2,111 passing tests and a zero-vulnerability full check against 119 unchanged source/test/config hashes. Four-channel review and orchestrator now correctly return incomplete Pinterest evidence despite an exit-zero scan. [Three direct Chrome observations](../../reports/pinterest-live-sample-2026-09-06.md) prove existing destinations, not full account coverage or saved alt text. Both tasks remain in progress until independent Release Judge adjudication; no public mutation or approval is claimed.

Latest decision supersedes that historical paragraph: PR-01 and PR-02 are approved by the independent Release Judge after the two corrections and the [2,146-test integration](../../reports/promotion-corrections-integration-2026-09-06.md), against 121 unchanged source hashes. No G7, campaign, source-truth, whole-account Pinterest, publication or deployment approval was granted. Do not publish from these code-task statuses.
