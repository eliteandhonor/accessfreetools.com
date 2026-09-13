# Task Board

Review baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. Current task states below supersede the historical integration paragraphs. Tasks are assigned documentation, not newly scheduled jobs. Each task's precise acceptance rule, commands and evidence links live in [campaign.json](campaign.json). Report finding IDs keep the underlying proof traceable.

## Current Checkpoint: September 13

Security `18ebd554` is deployed on Node 24; Linux CI, live Ask/API/MCP and
663 sitemap URLs pass. Clean correctness candidate `0c78956b` has independent
local acceptance, 902 tests and 132 browser passes, but no push/deployment
approval. R passes 2,529 tests/audit zero and two 136-case browser runs; its
dirty source is not a release candidate. T passes 1,181 tests/audit zero, four
Chrome/Edge hour cases, fifteen-minute Firefox/WebKit cases, and independently
accepted local recorder privacy proof. No transcriber release or beta exit.

Current counts: 23 approved, zero evidence-ready, four in progress and three
blocked. [Local closeout](reports/local-verification-closeout-2026-09-13.md)
records the runner/admin regression fixes, exact receipts and remaining gates.
[Hour matrix](reports/transcriber-hour-matrix-2026-09-13.md) and
[recorder judgment](reports/transcriber-recorder-judge-2026-09-13.md) retain
their specific compatibility and privacy limits. No overall completion claim.

## Historical Checkpoints

Earlier "latest" paragraphs and counts below are dated history, not current status.

Latest transcriber checkpoint: [September 13 ownership and resume proof](reports/transcriber-checkpoint-ownership-2026-09-13.md).
The exact Edge join now passes the bounded test with all 14 word keys retained,
38 cues, zero overlaps and 19/19 intervals. Stop/edit/resume keeps the completed
prefix unchanged. September 9 full check passed 1,171 tests without skips;
all 32 selected sources still match. Fresh Edge hour MP4 now passes 240 cues,
zero overlaps and 120/120 intervals. September 13 audit nevertheless fails with
11 new dependency findings, including one critical; the older zero audit is stale.
Security remediation takes priority. Remaining matrix, languages, privacy,
memory, devices and beta gates stay open. No release approval.
Current counts: 23 approved, zero evidence-ready, four in progress, three blocked.
SEC-04 tracks the new dependency findings separately from the accepted historical
fast-uri/qs fix. Fresh clean install, full577-test check, smoke110, mobile,
Node runtime and audit0 pass. The independent judge accepts the exact local
patch; Linux CI/deployment and bounded live checks now pass. See [security remediation](reports/security-sep13-remediation.md).

Current TTS checkpoint: [September 9 cold retry](reports/tts-cold-retry-2026-09-09.md).
One actual Chrome cold-short Kokoro WebGPU generation/download is independently
accepted after QA-only CSP corrections. BR-04 remains blocked by its broader
inference, compatibility, memory and beta gates; older cold failures are historical.
The independent follow-on judge also accepts four specific Chrome/Edge tests
covering both models' short/warm chapter MP3/ZIP and synthetic 10,000-character
outputs. This is not the complete matrix, recovery, native-memory or beta proof.

Previous transcriber checkpoint: [September 8 boundary follow-up](reports/transcriber-boundary-followup-2026-09-08.md).
The [independent local judge](reports/transcriber-local-acceptance-2026-09-08.md)
approves TR-01/TR-02 and the bounded second-context helper. Current normal check
passes1,103tests, both compilers, build, all later gates and audit0 against31
unchanged selected hashes. The previously failing Chrome MP4 source295..890
now passes20/20intervals,40cues,zerooverlaps. Current full-hour EdgeMP4 retains
120/120intervals but fails14timing overlaps/255cues, improved from28, not fixed.
A centered-context experiment also failed and was not adopted. The paired
source-word retention regressions have independent approval. Firefox/WebKit,
the complete hour matrix, privacy, cold delivery and beta remain open;
no deployment or whole-goal approval.
Current totals:22approved,0evidence_ready,4in_progress,3blocked. Historical
counts and failed-hour results below remain dated evidence, not current states.

September 8 checkpoint: [admin and rate-limit resume](reports/admin-rate-resume-2026-09-08.md)
records independent local acceptance of both mitigations and a 2493-test,
zero-vulnerability normal full gate with bounded workers. Independent integration
judgment approves the local gate. SEC-03 remains in_progress for proxy proof; broader release
and transcriber gates remain open. Historical paragraphs below are not current
missing-owner-approval claims.

Latest local integration: [indexing and analytics proof](reports/indexing-analytics-integration-2026-09-06.md), with 1915 unit tests and 136 smoke cases against a 91-file source snapshot. EV-03 is locally evidence-ready; EV-04 has reviewed local fixes but still needs durable production interval proof. [Transcriber inference](reports/transcriber-runtime-evidence.md) includes a scoped Chrome hour-MP4 completion, not full compatibility/privacy/beta acceptance. No implementation is release-approved or deployed.

Newer local integration: [game and frontend proof](reports/game-frontend-integration-2026-09-06.md), with 2050 tests, 136 smoke cases, 90 selected-theme checks and 72 cold/warm loads against 108 source/test/config hashes. UX-01/02/03 are evidence-ready; independent Release Judge approval remains pending. EV-05 has local fixes but still needs production definition/coverage proof. The full objective remains open.

Latest local integration: [promotion and security follow-up](reports/promotion-security-integration-2026-09-06.md), with 2,111 passing tests and a zero-vulnerability full check against 119 unchanged source/test/config hashes. Pinterest's scan is explicitly missing destination proof; three direct browser-verified Pins are recorded separately. PR-01/02 and SEC-03 remain in progress, not approved. The transcriber and release gates remain open.

Latest decisions supersede those historical paragraphs: [promotion corrections](reports/promotion-corrections-integration-2026-09-06.md) pass 2,146 tests and all full-check stages against 121 unchanged source hashes. Independent Release Judges approve exact PR-01/02 and [COR-03/04/05](reports/correctness-numeric-task-rejudge.md). This is five task approvals, not deployment, publication or whole-goal approval. The [transcriber fixture/download follow-up](reports/transcriber-download-fixture-followup.md) has 711 passing tests but failed fresh browser model downloads; real-hour/privacy/beta gates remain open.

| Task | Priority | Owner | Status | Work | Depends On |
| --- | --- | --- | --- | --- | --- |
| SEC-01 | P1 | security | approved | Patch fast-uri and qs narrowly | None |
| SEC-02 | P1 | security | approved | Mask private OCR, text and Ask outputs explicitly | None |
| SEC-03 | P2 | security | in_progress | Threat-model admin storage and proxy limits before broader ad exposure | SEC-02 |
| SEC-04 | P1 | security | approved | Remediate September 13 dependency advisories | SEC-01 |
| COR-01 | P1 | correctness | approved | Preserve Ask units and explicit qualifiers | None |
| COR-02 | P1 | correctness | approved | Reject partial numeric and date-question matches | COR-01 |
| COR-03 | P2 | correctness | approved | Fix month-end age and date decomposition | None |
| COR-04 | P2 | correctness | approved | Return explicit errors for non-finite tool results | None |
| COR-05 | P2 | correctness | approved | Stabilize near-zero loan-rate mathematics | COR-04 |
| COR-06 | P2 | correctness | approved | Align REST/MCP execution policy and bound Ask waits | COR-02, SEC-01 |
| BR-01 | P1 | browser-runtime | approved | Bound JSON-to-CSV output before dense allocation | None |
| BR-02 | P2 | browser-runtime | approved | Settle TTS failures and validate files before reading | None |
| BR-03 | P2 | browser-runtime | approved | Give OCR operation identity, cancellation and input bounds | SEC-02 |
| BR-04 | P2 | browser-runtime | blocked | Verify real TTS model and device readiness before beta exit | BR-02, SEC-01, SEC-02 |
| TR-01 | P1 | transcriber | approved | Preserve repeated speech and source timing | None |
| TR-02 | P2 | transcriber | approved | Fix cancellation, subtitle round trips and stalled-job recovery | TR-01 |
| TR-03 | P1 | transcriber | blocked | Complete privacy and real-browser beta gates | TR-01, TR-02, SEC-01 |
| EV-01 | P2 | evidence | approved | Unify observation provenance across SEO and pilot consumers | None |
| EV-02 | P2 | evidence | approved | Make provider status and independent refreshes truthful | None |
| EV-03 | P2 | evidence | approved | Respect successful and intentionally excluded indexing states | EV-01 |
| EV-04 | P2 | evidence | in_progress | Report analytics coverage and exclude private dashboard traffic | None |
| EV-05 | P2 | evidence | in_progress | Make game lifecycle events and pilot decisions valid | EV-01, EV-04 |
| UX-01 | P2 | frontend | approved | Preserve keyboard position in reveals, themes and game board | None |
| UX-02 | P2 | frontend | approved | Shorten mobile/tablet path from tool search to results | UX-01 |
| UX-03 | P2 | frontend | approved | Keep unresolved accessibility checks and measure route costs | UX-01 |
| PR-01 | P1 | promotion | approved | Enforce four-channel policy at every public-action boundary | None |
| PR-02 | P2 | promotion | approved | Make four-channel health and source review evidence explicit | PR-01 |
| OP-01 | P2 | operations | in_progress | Bind release proof and automation handoffs to current source | EV-01, PR-01 |
| RJ-01 | P1 | release-judge | approved | Judge review completeness and task traceability | None |
| RJ-02 | P1 | release-judge | blocked | Approve each future release only after its selected tasks pass | Per-release selected scope; see plan |

## Latest Local Acceptance

Latest owner/deployment checkpoint, September 6 13:09 UTC: the owner authorized
the narrow dependency release and conservative admin/alignment defaults.
`b4fffbc4` is on `origin/main`; Hostinger's Git build completed on Node 24 and
GitHub Quality passed the exact SHA. Live API/MCP and 663 sitemap URLs pass.
Complete live visual verification is blocked by a 403 browser challenge; the
provider evidence does not attest the deployed SHA. RJ-02 remains blocked for
those proof requirements, not missing owner authorization. Other task counts
remain **20 approved, 1 evidence_ready, 5 in_progress and 3 blocked**.
See [owner defaults and deployment](reports/owner-defaults-and-security-deployment.md).
Admin persistence and bounded rate records are separate local work, not deployed.

September 6, 10:05 UTC evidence supersedes earlier totals: **12 approved,
8 evidence_ready, 6 in_progress, 0 planned and 3 blocked**. These include the
historical RJ-01 review decision, not twelve deployed implementations. The
[clean-install follow-up](reports/clean-install-and-routing-followup.md) binds
the passing full check, 2,405 tests and zero audit findings to 2,506 file hashes.
Independent judges approve exact SEC-01, COR-01/02 and BR-01/02. Later campaign
documentation updates are not part of that frozen source snapshot. The release
receipt remains unverified; no deployment or whole-goal approval is granted.

## Working Rules

Latest checkpoint after the SRT judgment: **20 approved, 1 evidence_ready,
5 in_progress and 3 blocked**. The [SRT judge](reports/transcriber-srt-continuation-judge.md)
approves TR-02's own acceptance, but campaign approval is held by its open TR-01
dependency. The [current-source integration](reports/task-acceptance-and-download-followup.md)
records the review checkout's 2,424 tests and the separate transcriber checkout's
746 tests, each with zero audit findings. These are distinct source states.
Earlier checkpoints below remain historical. No deployment or whole-goal approval.

The later [TTS follow-up](reports/tts-readiness-followup.md) raises the review
checkout's full-check total to 2,425 tests after the independently approved
Kokoro metadata-probe pin. The actual cold attempt did not complete, so BR-04
and all task counts remain unchanged. This is not a deployment approval.

September 6 post-commit checkpoint: **18 approved, 2 evidence_ready,
6 in_progress and 3 blocked**. The [six additional task approvals](reports/task-acceptance-and-download-followup.md)
cover COR-06, EV-01/02 and UX-01/02/03. EV-03's new serialization fix is awaiting
rejudge; TR-01/02 remain open after two concrete independent failures. The narrow
security commit is locally clean and reviewed, but not pushed or deployed.

Use one bounded task branch/worktree at a time per shared module; rebase/inspect before another owner edits the same file. No broad refactor. Main findings and unpublished-transcriber findings are deliberately separate. Partial evidence is not success. The release judge may approve RJ-01 as a review deliverable without marking the implementation goals complete.

## Deferred Rather Than Forgotten

- Correctness report's OpenAPI consumer/schema typing opportunities: defer until COR-01 through COR-06 pass; no demonstrated external-client failure yet. Validate a consumer before changing the contract.
- New model families, another game, Games category, meeting planner and QR release: held behind existing demand/pilot gates; a passing code review does not supply market evidence.
- Bulk SEO rewrites, new backlink profiles and inactive social platforms: not authorized or justified. Keep Kawaii untouched.
- All-theme contrast, actual mobile-device testing and model quality measurements: explicit evidence tasks, not automatic passes from viewport emulation.
- Global skill changes, cleanups and new automations: outside this review. Use existing roles/campaigns and preserve proof.
