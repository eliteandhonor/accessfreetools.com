# Append-Only Worklog

## 2026-09-06: Assignment Created

Created from the GPT-6 project review at 90d6dcab0580a91ca66382f2414d95e8817469e5. Read-only specialist findings are in ../../reports/. Assigned tasks: BR-01, BR-02, BR-03. No implementation, publication or deployment has been performed by this assignment. Await task selection and acceptance proof; no approval claimed.

Append later entries with timestamp, task ID, source revision, files changed, exact commands/results, safe evidence paths, blockers and next action. Do not replace earlier entries or put secrets/media/transcripts here.

## 2026-09-06: Judge-Requested Readiness Assignment

Added BR-04 for real TTS inference/device and separate beta-exit proof. Source-only checks and mock soak cannot approve it. Status blocked; no benchmark or implementation claimed. See campaign.json for the full gate.

## 2026-09-06: BR-01 Implementation Started

Coordinator implemented sparse preflight bounds in jsonToCsv.ts with six failing regression cases followed by 21 passing tests. Added desktop/mobile rejection-and-recovery browser coverage, pending the rebuilt site. Detailed evidence and remaining gates: ../../reports/browser-runtime-json-implementation.md. BR-02 is assigned separately; full model/device gates remain open.

## 2026-09-06 14:27 +10:00: BR-03 OCR Lifecycle And Input Bounds

Implemented in `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review` at start/final HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Changed only OCR portions of `src/components/AiBrowserTool.tsx`, new `src/lib/browserOcrInput.ts`, `src/lib/browserOcrWorker.ts`, `src/lib/browserOcrInput.test.ts`, `src/components/BrowserOcrLifecycle.test.ts`, report `../../reports/ocr-lifecycle-implementation.md`, and this append. Existing shared work preserved; no TTS/Ask/API/provider/package/global-policy/campaign edits or approval claimed.

Operation identity now invalidates stale progress/result/error/history/finalization on replacement, cancellation and unmount. Native Tesseract workers are owned before model loading, terminated once on all tested exits, and bounded by a 90-second watchdog. The four adapter packets are checked against installed Tesseract v7. OCR byte cap 10,485,760, pixel cap 8,000,000, edge cap 8192 are checked from PNG/JPEG/static-WebP headers before browser decoding; bounded images are decoded/validated and normalized to PNG before worker startup. Other formats/animation are explicitly rejected. All six existing language values and retry remain.

RED: `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts --maxWorkers=1` at 14:13:09: 22 failed, 6 passed, exit 1; stale A visible after B/language changes, no cancel, unmount termination count 0, missing input bounds. New helper contract initially failed missing-module, not a behavioral proof. Final GREEN: `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` at 14:25:03: 80 passed (39 mounted Chromium + 41 parser/input tests), exit 0, 71.41 s. Both focused TS6/TS7 checks in the report exited 0, including coordinator-reported worker callback typings. Extra non-default noUncheckedIndexedAccess trial reported an existing out-of-scope tone expression and is recorded, not silently fixed. Scoped diff whitespace check passed.

Exact final source/test SHA-256 hashes, command strings, red-green details, intermediate harness fixes and source-line references are in `../../reports/ocr-lifecycle-implementation.md`. No shared install/fullcheck/build/commit/public action/model download was run. Actual OCR inference for all six languages, self-hosted worker/core compatibility, cold/warm real asset loading, real device/8-MP memory, production privacy trace and full-site visual acceptance remain unverified. No local implementation blocker; source stable for coordinator integration and independent judgment. All owned test/browser processes exited; no task status or approval changed.

## 2026-09-06 14:38 +10:00: BR-03 Offline Native Smoke, Legacy Audit And Freeze

Follow-up explicitly requested by the coordinator: added `src/components/BrowserOcrOffline.test.ts` with exact Tesseract/client/core **7.0.0** version and SHA-256 contract pins, plus actual cached native-worker recognition through the mounted component. No production OCR source changed. Cached public worker/core match installed v7.0.0 bytes. A synthesized 1200 x 220 English image returned `ACCESS FREE TOOLS 12345`; first smoke 1890 ms, rerun 1909 ms. Only whitelisted local worker, relaxed-SIMD LSTM core and English traineddata were served by context routes; no external downloads, unexpected requests or page errors. Real progress outer jobId matched recognition while nested data.jobId retained the initial load identity; both native packet assertions and a mounted UI progress case pass. Native worker terminated once with callbacks cleared. This supersedes the earlier no-real-inference gap for ONE local synthetic English image only, not other languages/device/production/memory gates.

OCR final focused suite: `npm.cmd test -- src/components/BrowserOcrLifecycle.test.ts src/components/BrowserOcrOffline.test.ts src/lib/browserOcrInput.test.ts --maxWorkers=1` at 14:34:18: **83 passed**, exit 0, 79.12 s. TS6/TS7 scoped to the six OCR files including the new offline fixture both passed before the last lazy-load assertions.

Coordinator expressly extended ownership to ONLY OCR expectations in `src/data/siteContentAudit.test.ts`. Reproduced the old `await import('tesseract.js')` assertion failure using `npm.cmd test -- src/data/siteContentAudit.test.ts -t 'keeps browser AI tools private, lazy loaded, and fully documented' --maxWorkers=1` (14:36:37: 1 failed, 53 skipped). Replaced it with native-adapter click/preflight/function-scope/local-path/cancel/no-upload checks, preserving all existing privacy/docs/language/non-OCR assertions. Same focused audit passed at 14:37:27. Strengthened actual offline smoke to require no worker/assets at mount or file selection before clicking. `npm.cmd test -- src/data/siteContentAudit.test.ts src/components/BrowserOcrOffline.test.ts --maxWorkers=1 --reporter=verbose` at 14:37:30: **56 passed**, exit 0, 4.04 s. Combined unique coverage is 137 tests, not double-counted reruns. No separate typecheck was rerun for these last assertion-only edits after freeze; coordinator owns integrated checks.

Source/test freeze sent at 14:38. All owned test/browser processes have exited; no server was started and no further source/test run or edit is active. No unrelated SEO test timeout/budget was changed. Report `../../reports/ocr-lifecycle-implementation.md` contains the seven final raw-file SHA-256 hashes, exact commands, cache pins, actual native packet evidence and remaining unverified language/device/8-MP memory/production limits. Only report/worklog finalized after freeze. Ready for coordinator's non-concurrent integration snapshot and independent judgment; NOT approved.

## 2026-09-06: Coordinator Built-Page OCR Proof

Independent source review found no new scoped OCR defect and recommended evidence_ready for consideration with limits intact. The 1658-test snapshot and 136 browser smoke cases passed. Additional actual built-page proof at 1365/768/390 widths cancelled deliberately stalled startup, retried through real cached Tesseract English inference, and obtained exact synthetic text with no model load before user action, page errors or horizontal overflow. Explicit DOM masking and Cancel hit testing passed. Original consent-overlay captures were retained; follow-up used the visible Keep ads off choice and saved both states separately. See `../../reports/runtime-evidence-integration-2026-09-06.md` and ignored `output/project-review-followup/integration/ocr-built-visual-consent/latest.json`.

Task is evidence_ready, not broad BP-08, SEC-02 or deployment approval. Actual non-English inference, physical devices, real memory/large-image behavior and production Clarity payloads remain open. All owned previews/browser contexts were stopped. OCR source remains frozen; the final full gate reruns for the later provider-only correction.

## 2026-09-06: Coordinator Records Independent BR-01/02 Approval

Judge `../../reports/json-tts-task-acceptance.md` explicitly approves local BR-01
and BR-02 after 106 focused tests and two source-matched built-page JSON tests.
The sparse 50,000-key input rejects before dense allocation and permits valid
CSV recovery/download afterward. Desktop and mobile rejection outcomes are
about 28 ms in these cases, not a field performance claim. TTS testing uses
the mounted component and real import/queue paths with simulated worker events;
it does not establish real model, physical-device or beta-exit readiness.

Coordinator records only these exact approvals. Browser/server resources were
closed by the judge; no source was changed by it. The final fresh-install full
check passes 2,405 tests. BR-03/04 and production release retain their own gates.

## 2026-09-06: Exact OCR Task Approval

Independent ../../reports/ocr-task-acceptance.md explicitly approves BR-03 after
73 distinct passing input/mounted cases, including three new adversarial tests.
The first focused filter intentionally skipped15; a separate four-case run
closes the parameter-label miss. No skipped cases are counted as passing.
Eleven bound source files remain unchanged and owned processes are stopped.
Coordinator records only the exact local approval. The current full check now
passes2,424 tests after the separate indexing fix. BR-04 and deployment remain
open; no fresh native OCR/language accuracy or real-device claim is made.

## 2026-09-06: Actual TTS Attempt And Pinned Metadata Correction

The coordinator's bounded real Chrome cold attempt ended after five minutes
while model.onnx remained loading at 2%; it produced no MP3 and did not prove
an application timeout. Independent ../../reports/tts-real-chrome-smoke-judge.md
keeps BR-04 held. A traced mutable tokenizer existence probe was corrected in
the dedicated Kokoro worker without changing model or watchdog settings.

Independent ../../reports/tts-revision-boundary-judge.md approves only that
source fix and real-library regression. Current full check passes 2,425 tests
in 104 files with zero dependency findings. A separate rebuilt Chrome request
check confirms the pinned metadata path while deliberately blocking ONNX.
See ../../reports/tts-readiness-followup.md for frozen proof and limitations.
Browser/server sessions are closed. No deployment, account mutation, new model
or beta/indexability approval occurred. BR-04's contract and status stay held.

## 2026-09-09: Cold Kokoro MP3 And QA Capability Corrections

The prior failed cold state was retried on the current 2,145-file full-check
baseline. Two local harness omissions were isolated: the exact nested ORT
runtime directory and the MP3 encoder's embedded data-URI fetch. Preserved the
failed receipts; corrected only QA CSP, with an encoder-only paired RED/GREEN.
Actual isolated Chrome then generated a 4.656-second non-silent MP3 in45.123s,
with no autoplay and matching selected source/build hashes. Owned browser/server
stopped. No product, dependency, model or production mutation was needed.

The separate bounded judge accepts that scope; see the September9 cold-retry
report and its judge for hashes and limitations. BR-04 stays blocked; the
remaining model/device/long-text/chapter/memory/privacy/beta gates still apply.
An additional isolated Edge cold-short and warm two-voice chapter test has begun;
it is not counted as completed in this entry. No release or public action.

## 2026-09-09: Both Models Complete Chapters And Input-Limit Probes

The Edge Kokoro cold-short and warm Bella/Adam chapters pass. Both individual
MP3s natively decode and byte-match the ordered ZIP entries. Only Adam's pinned
voice file is newly requested in the warm phase; no new weights request occurs.
Chrome Kokoro also accepts10000synthetic characters and produces595.176seconds
of non-silent MP3 in75.179seconds including fresh model loading.

Chrome Supertonic cold-short and warm F1/M1 chapter MP3/ZIP checks then pass.
Edge Supertonic accepts10000synthetic characters and produces623.725708seconds
of non-silent MP3 in70.155seconds including loading. Both models preserve paused
playback. The four receipts record no selected source/build drift and close
their browsers/servers. All2145baseline source files still match after testing.

The follow-on judge is reviewing these exact receipts. The text is deliberately
synthetic/repetitive; non-silence does not prove spoken accuracy or word retention.
Only QA options/assertions and ignored proof files changed, not product/model
code. Real device, repeat-switch, recovery, memory, full matrix, privacy and beta
gates remain open. No deployment, purchase, indexing or publishing action.

## 2026-09-09: Bounded Four-Receipt Judge Closed

The independent follow-on judge accepts all four new named-browser receipts,
with saved MP3/ZIP and selected source/served hashes independently verified.
No required source correction was found. The first two follow-ups retain their
historical harness hashes without complete snapshots; the latter two archive
the exact script. This limitation is explicit and no identical retest is needed.

Only the local evidence scope is accepted. BR-04 stays blocked behind its
remaining matrix, switching/failure/recovery, native-memory, production-privacy,
physical-device and beta gates. Owned browsers/servers and reviewer are closed;
the unrelated owner transcriber preview remains intentional. No product edit,
commit, deployment, paid action or public mutation occurred in this TTS follow-up.
