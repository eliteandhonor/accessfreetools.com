# September 13 Smoke Follow-Up Judge

Scope: independent read-only review of the one admin smoke-test hunk against
`admin-no-persistence-judge.md` and current admin source, plus runner receipt
verification. No app/config/test edits, tests, browsers, builds or fullchecks run.
R = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.

## Required Fix

**P2: destination token label is wrong for Analytics.**
`tests/site-smoke.spec.ts:204` and `:205` use `getByLabel('Admin token')` for
both destinations. The actual unchanged `src/pages/admin/analytics.astro:32`
labels its password input `Analytics token`; Agent Tools uses `Admin token`.
The first loop iteration therefore fails instead of verifying the blank input.
Use each destination's actual label for the visibility/value assertions. This
requires only a test locator correction, not a product or contract change.

Reviewed test SHA256:
`428ad2de7d10305f27a5f9445894ee084921a912114a3167e2ce7b7adfcae945`.
Verdict on this exact hunk: request the concrete correction above. Otherwise the
composition is appropriate: seed synthetic legacy credentials in both stores,
verify hub clearing while retaining opt-out, require a credential-free hub with
real destination links, and preserve noindex/blank destination-form coverage.
The init script reseeds on each navigation; this is not a logged-in lifecycle,
cross-page authority, bfcache or server authorization test. The accepted mounted
and real-handler coverage remains the stronger evidence for those behaviors.

All three current admin-page SHA256 values exactly match the prior independent
judge's accepted source table. The hub clears only the legacy key, and both
destination pages start with blank password forms and retain noindex. Replacing
the old shared-login assertions implements the accepted no-persistence contract;
restoring storage or changing product labels to satisfy stale tests is unwarranted.
Git diff shows only this one bounded admin test hunk in `site-smoke.spec.ts`.

## Verified Runner Receipts

Focused receipt: `output/security-sep13/2026-09-13T05-20-57-088Z-smoke-runner-parent-focused/report.json`.
SHA256: `e11791484bafbad33ce33cec960c85812f07d1314776af8e6caed18128cd8c0e`.
Parent command runs `scripts/lib/playwright-smoke-runner.test.mjs`: exit0,
26/26 tests, one file, Node24.20.0 / Vitest4.1.11, 2.05s reported duration.
Both stdout/stderr hashes independently match the receipt; stderr is empty.
Current runner/test hashes remain the frozen implementation handoff values:
- Runner: `0174c2a3a884192a81c99e894a126ea35841e8e076caf822f6853dbc937798ed`
- Test: `9c114f753965523ab1d26b299212dbe13c2b34b95489b13f16a303f69f77d9e5`
The receipt's own before/after map binds three security files, not these two
runner files. Source association also relies on the separate frozen hashes;
do not describe this generic receipt alone as a runner source snapshot. This
is receipt verification, not an independent final code approval of my own runner.

Actual failed smoke: `output/security-sep13/2026-09-13T05-25-09-040Z-review-owned-smoke-final/report.json`.
SHA256: `5312921de2b90cf9904f48f55c8b4e1954e25d5e5eacc399da141171c94ed364`.
Both log hashes match: 133 passed / 3 failed, actual exit1, followed by
`Smoke cleanup: owned preview stopped.` This agrees with awaited stop/closed
in the frozen runner. No separate process inventory was performed by this judge.
The two admin failures target the removed `Private Admin Login` heading.
The third records mobile JSON rejection eventLoopMs7522.9 against budget5000ms;
it remains a failed measurement, not an accepted result or established cause.

## Pending Parent Evidence

Parent owns the locator correction, isolated timing diagnostics and final normal
fullcheck/actual smoke receipts. No timing budget, app behavior or concurrency
change is recommended or approved by this review. Await supplied final proof
before integrated acceptance; this report grants no release/deployment approval.

## Follow-Up: Corrected Locators And Four-Worker Smoke

ACCEPT the corrected admin test and bounded concurrency configuration in this
local scope. The initial review/failure above is preserved; its P2 is now resolved.
Analytics uses exact label `Analytics token`, Agent Tools uses exact `Admin token`;
both retain visibility, blank-value and noindex assertions. Current SHA256:
- `tests/site-smoke.spec.ts`: `c91394e6412deaf1c1b39984ed53c496de123331a848443da55a541bad605240`
- `playwright.config.ts`: `0f02dcb026ae8b257fe6085e52fa5f2c26166ff00b165b5c486b8270b7718475`

The config diff adds only `workers: 4` and its orienting comment. Test selection,
desktop/mobile projects, 45s test timeout, 8s expectations and failure traces are
unchanged. JSON still asserts the same finite, nonnegative, at-most5000ms values
for rejection and successful recalculation event-loop/outcome/after-frame phases.
Current JSON spec SHA256 is `d4b52596e35935daa1fff113f905bb6a0898ef0644ae5510bb58e3bbb30d725f`.
This bounds competing browser work; it is not a product fix, deadline relaxation,
skip/retry waiver, or assurance of equivalent performance under arbitrary load.

Read the one-worker diagnostic receipt and all three round summaries:
`output/security-sep13/2026-09-13T05-31-52-505Z-json-timing-workers-1/report.json`,
SHA256 `f28ce8a7a4d9416cb1c26bfd2125d4db390f191d967b764d05102b680ece49be`.
Three rounds, both widths, six passes, exit0 each; identical5000ms budget and
927781-byte/50000-row/2.5-billion-implied-cell fixture. Rejection event-loop
measurements span30.4-31.8ms; positive controls also pass; previewClosed is true.

The intermediate full four-worker receipt at
`output/security-sep13/2026-09-13T05-32-51-571Z-review-smoke-four-workers/report.json`
has SHA256 `e13e81bb6d70d2ec603ed1662bbd302b0762430608934388129766b4779f37f1`.
Both log hashes match; 134 pass, only the two predicted admin-label failures,
exit1 and owned-preview cleanup. Both JSON projects pass. Parent additionally
reports59ms desktop/32ms mobile; those exact values are not in this wrapper receipt.
Compared with the original ten-worker7522.9ms failure, these observations support
contention/load sensitivity, but do not isolate CPU contention as the unique cause.
The original failed measurement remains valid evidence, not erased by later passes.

Final actual smoke receipt:
`output/security-sep13/2026-09-13T05-35-26-310Z-review-smoke-admin-current-contract/report.json`.
SHA256 `2d997bec7cfbf5e7ad25c59b252f7e7bbcd953f3673910cc2d87da97f25ffed6`.
Both log hashes independently match; stdout SHA256 is
`d405e0a41feedb57c67d21d0409c9d1737ef23038e99b256a73075a1d6280fdb`.
Verified136/136 pass using four workers, including corrected admin and JSON cases
at both widths; exit0, 47.8s suite duration, owned-preview stopped message.
Runner/test hashes still match the frozen values above. Generic wrapper source-map
limitations above still apply. No independent browser rerun or process scan made.

No required fix remains in the reviewed admin/config diff. This accepts the local
smoke evidence, not the still-running normal fullcheck, clean-commit identity,
Linux/hosting proof, production release or whole campaign. Parent owns those gates.

## Follow-Up: Final Development Fullcheck Verified

Accepted as completed local development gate evidence, not clean-release proof.
Read `output/security-sep13/2026-09-13T05-36-37-720Z-review-final-admin-smoke-contract/report.json`:
SHA256 `dc1c147106ad844797d5e0e44d7a2877bb1901dd89860e8118d7ce2af622f454`.
Normal `npm.cmd run check`, Node24.20.0, 05:36:37.720Z to05:40:10.658Z,
exit0, no signal. Independently verified stdout SHA256
`318627f50a6ad8ba17cec2212ab376189403f40f688acc201c0ecdf30bba8220`
and matching stderr hash; all three wrapper-bound files match before/after/current.

Logs confirm both `tsc --noEmit` and `tsc6 --noEmit`, 2529/2529 tests in109/109
files, successful Astro/Node build, every subsequent ordered gate and audit0.
Later gates include674-page links/site checks, visual/editorial/accessibility,
1984 semantic JSON-LD blocks, performance/lazy-AI assets, image/sitemap/gallery,
and secret checks. Five soft asset-budget warnings remain. Automated accessibility
passes27 checks while55 manual findings remain unresolved; no conformance claim.

`output/release/full-check.json` SHA256:
`06dfab2b66da8a8d9e9f97007b447ea8cadefa8dbb35b6752ec0e9ace4f44313`.
It correctly records exit0 but `clean: false`, `verified: false`, commit243d71d1...
and Node major24. Its embedded build identity exactly matches the current
`dist/client/_build.json`, built05:38:19.488Z, also dirty. Passing commands do not
turn this into a verified clean commit or deployed-server identity.

Read the initial `output/security-sep13/final-smoke-binding-2026-09-13.json`:
it currently provides the12-file pre-run snapshot, including the frozen runner,
corrected admin test, config, JSON and admin source, package and lock. The rebuilt
smoke/post-run comparison is still pending at this review; no pass or unchanged
post-run claim is inferred. Parent owns that terminal proof and final docs.
Only this report was appended; no additional commands executing tests/builds ran.

## Final Follow-Up: Rebuilt Smoke And Source Binding Accepted

ACCEPT the final rebuilt local smoke receipt, closing the pending smoke evidence
above without changing the earlier failed findings/receipts or release boundaries.
Receipt: `output/security-sep13/2026-09-13T05-40-56-345Z-review-final-rebuilt-smoke/report.json`.
SHA256 `e9b3865245cb9ca2d807d718f62317c90bcd325cb32b498f63bb7d930a442233`.
Verified actual exit0, no signal, 136/136 passes using four workers, 45.5s suite
duration, both corrected admin cases and JSON cases, and owned-preview stopped.
Both log hashes match; stdout SHA256:
`7cd8f4e2bf38f575da79d333edfcdf0111a7cf5dfa0e53cee5fdf0e2cb678481`.

Completed `output/security-sep13/final-smoke-binding-2026-09-13.json` SHA256:
`fa87d40ee94225e174c44a6a645f9bd664862c1ccf9dfa7e6bba099eb979b4f8`.
Independently verified12 before/after entries, zero pre/post mismatches and zero
current-file mismatches. Snapshot times enclose the complete smoke run. This
adds explicit selected-source binding for runner/tests/config/JSON/admin/package
and lock; it does not establish a clean commit or a whole-built-tree digest.

Final JSON rejection phases peak at55.0ms desktop and34.1ms mobile; positive
controls peak at11.1ms and11.9ms, all within the unchanged5000ms in-page budget.
Preserve the observed whole-test times: desktop44.7s and mobile30.1s. They include
other test activity and are not conversion latency; no unique delay cause is
proven. The44.7s desktop observation is close to the unchanged45s test deadline,
so this is a passing run, not a claim of abundant whole-test timing margin.

Cleanup stdout follows awaited owned preview stop/close. Coordinator additionally
reports OS port4363 absent and intentional T port4359 still PID24376; this judge
did not repeat the OS inventory or stop any process. Local fullcheck/smoke evidence
is accepted within the stated dirty-source limits. Goal remains open; no clean
release, production, whole-campaign or additional task approval is granted.
Only this existing report was appended. No app/test edits or additional runs.
