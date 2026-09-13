# Runtime And Evidence Integration

Date: 2026-09-06. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Branch: `codex/gpt6-review-implementation`; HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted implementation. This follows the earlier 1441-test integration snapshot; it does not replace the historical failed or successful logs. No release approval, commit, push or deployment.

## Scope

- COR-06: shared REST/Ask/MCP header authentication and quota, bounded provider and browser request/body waits, cancellation, retry, sanitized errors, early-error cleanup, and explicit rejection of MCP batches. Independent review reproduced and closed two follow-up defects. Task is evidence_ready, not production-approved.
- BR-03: bounded PNG/JPEG/WebP OCR input preparation, owned native Tesseract worker lifecycle, file/language operation identity, cancel/unmount/watchdog settlement, and stale-result rejection. Existing six-language selection routing remains; real inference proof is English only. No additional model or asset download was introduced.
- EV-02: cached account observations retain original dates and source paths, current check state is separate, failures are sanitized/classified, and independent daily refresh steps no longer stop after the first provider failure. The npm entry runs the tested daily coordinator. No paid research or indexing submission was added.
- Integration repair: the SEO queue reads its five priority evidence sources once per invocation instead of for every tool. Scores, queue policy, historical approvals and the five-second test timeout are unchanged. A fresh invocation rereads changed or missing sources; there is no process-wide cache.

## Current Proof

All paths below are relative to this worktree. Runtime: Node 24.20.0, Astro 7.1.5, TypeScript 7 CLI and TypeScript 6 compatibility/API.

| Command / Evidence | Result And Scope |
| --- | --- |
| `npm.cmd run check`, `output/project-review-followup/integration/check-runtime-evidence-judge-final.log` | Exit 0. **1665 tests / 85 files**; both typechecks; build; every subsequent required gate, including zero dependency vulnerabilities. Unit phase 75.70 seconds. |
| `node scripts/run-playwright-smoke.mjs`, `smoke-runtime-evidence-judge-final.log` | Exit 0; **136 desktop/mobile cases**, 30.1 seconds, after the final build. Owned preview stopped. |
| Full built-site checks | 674 HTML pages, 1253 images with zero missing alt; 7 editorial articles x 4 viewports; 15 key-page pairs; 27 accessibility pairs with zero blocking failures; image/gallery/schema/lazy-asset checks pass. Automated checks are not full accessibility conformance or real-device certification. |
| `queue-inputs-red.log` / `queue-inputs-green.log` | New two tests failed on repeated reads (15 rather than 5; 30 rather than 10). After the per-report snapshot fix, both new and all nine existing queue tests pass. No timeout increase. |
| `output/project-review-followup/COR-06/local-runtime.json` | Built loopback Astro runtime, parser forced: 34 tools, four Ask audit cases and three MCP smoke checks, all pass. Preview stopped. Not production or real Ollama. |
| OCR specialist test report | 83 OCR tests plus 54 shared content-audit tests; real cached English Tesseract 7.0.0 recognition, exact byte/version guards, and no pre-action model loads. Other language recognition and device/memory behavior remain unverified. |
| `output/project-review-followup/integration/ocr-built-visual-consent/latest.json` | Actual built OCR page at widths 1365, 768 and 390: cancel during deliberately stalled startup, then retry using real self-hosted cached worker/core/English data; exact output `ACCESS FREE TOOLS 12345`; no page errors or horizontal overflow, reachable Cancel, explicit DOM masking. Initial ad-choice state captured separately, then visible Keep ads off chosen. |
| `output/automation-environment.json`, observed `2026-09-06T04:27:39.857Z` | Actual DataForSEO account access healthy, about USD 10.92. Isolated-worktree GSC/Hostinger credentials absent and cwd not approved for standing automation; not evidence of broken accounts. No paid research. |
| `aft status` and `output/marketing-orchestrator/daily-plan.json` | The saved account observation is correctly labeled cached/fresh/age 0; current check not run; latest saved attempt success with the original environment-report timestamp. Marketing generated at `2026-09-06T04:39:26.167Z`. No approved promotion rows and no public action. |

The first combined check (`check-runtime-evidence-followup.log`) had 1654 passes and two failures: the obsolete Tesseract dynamic-import source assertion and a 5000-ms queue timeout. Only OCR-specific expectations were updated to match the owned native worker, with real lazy-load behavior separately tested. A second full run (`check-runtime-evidence-followup-final.log`) had 1655 passes and only the same queue timeout (5258 ms). The performance fix followed that repeatable result. These failures remain saved; they are not represented as passing runs.

The independent reviewer subsequently found J-EV-01: fresh successful low-balance warnings were missing from daily JSON/CLI. Six new threshold fixtures failed before correction; the provider suite then passed 70 cases, and its package-entry check made 71 focused passes. The independent provider-only rejudge also passed all 70 tests. The daily step now preserves only sanitized current account balance/status and warning information, without forwarding raw child output or using saved low balances after failures. All five steps continue. This is a synthetic regression, not a present low balance; the actual account observation above is healthy. The initial green 1658-test log (`check-runtime-evidence-optimized.log`) remains historical. The final 1665-test run includes this correction.

The production-independent source snapshot is `output/project-review-followup/integration/source-snapshot-runtime-evidence-followup.json`, refreshed `2026-09-06T05:03:10.457Z`: **71 source/test/config hashes** plus HEAD. Comparisons after the final full check and smoke report no drift. The prior built-page OCR visual proof is still scoped to unchanged application files; the final source correction touches only the provider runner/test. Documentation changed afterward to record evidence. `runtime-evidence-final.json` binds current source, command outcomes and saved proof artifact hashes. This is not a deployable Git revision claim.

## Visual And Privacy Limits

The first OCR captures retain the initial advertising-choice panel, which occupies a substantial part of the mobile viewport and covers part of the workspace until dismissed. The follow-up saves this initial state separately, uses the actual Keep ads off control, and verifies the subsequent Cancel control by hit testing as well as screenshots. No consent setting or advertising source code was changed. Screenshots for both runs remain under ignored `output/project-review-followup/integration/ocr-built-visual*/`.

The coordinator visually inspected mobile Cancel, tablet result and desktop result screenshots. After the visible choice, control text and results fit without overlap. The initial consent overlay is not claimed to be an unobstructed workspace. The cancelled first worker is deliberately inert for stable visual capture; the retry uses actual Tesseract inference. These are Chromium viewport tests, not physical Android/iOS or Edge/Firefox acceptance.

The OCR output is under an explicit Clarity DOM mask; external requests are blocked and none were attempted during these local runs. That does **not** prove actual production Clarity payload masking. Source/media are synthetic, there are no visitor recordings or personal files in these fixtures, and source text/worker output are not sent externally.

## Preservation And Open Work

- The original dirty promotion checkout has the same status inventory as the earlier snapshot. No file there was edited in this batch.
- All 40 saved transcriber draft file hashes still match `transcriber-final-snapshot.json` from `2026-09-06T04:02:15.221Z`. That draft's earlier 99 tests/build are historical proof, not real recognition/full-hour acceptance. No transcriber file was edited in this batch.
- Only isolated local preview/test processes were started, and each was stopped. No production deployment, indexing request, social publication, paid call, purchase, automation reconfiguration or memory edit.
- Independent review/rejudge recommends scoped COR-06, BR-03 and EV-02 evidence_ready; those states are recorded. No task or deployment approval is implied by test counts. Remaining actual multilingual OCR, TTS/transcriber inference, device/long-duration/memory/beta, Clarity payload and Hostinger release checks stay open. Other campaign tasks remain active or planned under their existing owners.
- Existing soft budget warnings remain: four public PNG assets and the shared BaseLayout CSS. There are no hard performance failures; this batch does not alter artwork, Kawaii search content, or shared CSS to erase those warnings.

The whole-project goal is still active. The next batch should use the existing task board and independent judge, not treat these local passes as completion of all 29 tasks.
