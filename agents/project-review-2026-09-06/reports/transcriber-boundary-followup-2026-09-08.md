# Transcriber Boundary Follow-Up

September 8, 2026. T is the unpublished `accessfreetools-browser-transcriber`
worktree, not deployed main. R is the separate review campaign. No public or
hosting action occurred. Previous reports remain historical evidence.

## Verified Progress

- The rejected extended-right-context observer retained the 960-second conflict
  and introduced another at 1110. It was not copied into product code.
- With raw final-frame provenance, actual Chrome hour receipt
  `compatibility/2026-09-08T12-40-06-948Z-chrome-hour-mp3/report.json` retained
  120/120 speech intervals in 320,263ms. Four overlapping cues remained at two
  outer boundaries, 1770 and 3540 seconds. This was still a failed export gate.
- That run sampled 13 whole-browser working sets: peak 1,501,102,080 bytes,
  last 942,817,280 bytes. These are process working sets, not precise retained
  model allocations, a device-support guarantee or a bounded-memory approval.
- A smaller decoder-lookahead implementation was chosen before the larger
  provisional-tail protocol. Each logical block can use up to 25 seconds of
  extra real audio; maximum mono PCM is 325 seconds / 20.8 MB before model and
  decoder overhead. Each recognition input remains at most 30 seconds.
- Ownership is the original logical end, not end minus five seconds. Whole
  crossing and uncertain captions remain. Source/edited checkpoint prefixes,
  logical nextBlock, cancellation and genuine GPU fallback remain separate
  from sourceEnd. No persistent PCM tail or retroactive edit replacement.
- Source-window tests first failed seven new assertions, then passed. The
  window/protocol/component/lifecycle selection passed 100 tests. This is not
  actual long-recording acceptance.

## Bounded Actual Browser Proof

All paths below are relative to T/output/browser-transcriber-pilot. Both probes
use named Chrome, actual built workers, hash-verified cached original pinned
model URLs and synthetic audio. The harness selects two source blocks before
their first checkpoint and stops before a third. These are not full-hour runs.

| Receipt | Result | Exact Scope |
| --- | --- | --- |
| outer-boundary-5/2026-09-08T12-49-55-914Z-chrome-hour-mp3/report.json | PASS, 57,016ms, 38 cues, 19/19 intervals | Source 1475..2070; before one-frame tightening |
| outer-boundary-11/2026-09-08T12-55-44-197Z-chrome-hour-mp3/report.json | PASS, 34,513ms, 23 cues, 11/11 intervals | Source 3245..3600; one-frame whole-candidate implementation |

Both have zero timing conflicts, valid TXT/SRT/WebVTT, no overflow, masked
surfaces, no unexpected requests, unchanged selected source/built hashes and
cleanup of all three workers and object URLs. Cold remote delivery, actual
language accuracy, other browser/codec/track support and beta remain separate.

## Adversarial Findings

The specialist identified an unbounded terminal-word displacement in the first
frame-provenance branch. A complete agreeing hypothesis alone is insufficient.
The first tightening limits the adjacent gap to one verified 20ms Whisper frame
and may retain one whole original only if every lexical word is positively
corroborated by the independent retry. It never creates hybrid word timings.
An unmocked repair regression first failed, then passed. Focused tests: 111.

The specialist then found a stretched-predecessor variant and fractional-sample
rounding issue. The ignored `check-frame-boundary-counterexamples.mjs` reproduced
both against current source: expected false, actual true, exit 1. These are
synthetic code-level counterexamples, not observed acoustic loss. Required fix:
also bound onset to the actual source end plus one frame and reject genuinely
off-grid endpoints. The active frozen hour must end before that source changes.

See [the independent report](transcriber-cross-block-design-2026-09-08.md).
No reviewer acceptance, task-status advancement, current full-check pass or
release readiness is claimed by this checkpoint. TR-01 remains in_progress.

## 13:10 UTC: Full-Hour Pass And Exact P2 Closure

The intermediate actual Chrome hour passed in 355,481ms: 120/120 expected
speech intervals, 241 cues, zero timing issues and valid literal TXT/SRT/WebVTT.
Receipt: `compatibility/2026-09-08T12-56-45-123Z-chrome-hour-mp3/report.json`.
All thirteen checks passed, including source/build identity, private masking,
request policy and three-worker/object-URL cleanup. Peak sampled whole-browser
working set was 1,472,761,856 bytes; final sample 882,511,872 bytes. The result
screenshot was visually inspected; caption fields, timestamps and exports are
readable without collisions. This receipt predates only the final guard hardening.

The source-end-plus-one-frame and integer-grid fixes now reject both reproduced
counterexamples. A real-validator integration test also rejects the stretched
fallback candidate. The independent specialist reran 101 tests in three files,
verified unchanged hashes and closed the exact P2. Ordinary uncertainty,
cross-context acoustic accuracy and whole-task approval were not inferred.

The first final full check stopped at one stale source-shape assertion, with
1,077 other tests passing. Receipt: `integration/2026-09-08T13-04-39.649Z/report.json`.
The assertion now checks the actual bounded source span; five worker-protocol
regressions prove ownership, sourceEnd propagation and invalid-span rejection.
No acceptance threshold was lowered or failed stage omitted.

The subsequent normal `npm run check` PASSED at 13:09:32.991Z, Node 24.20.0,
1,083 tests / 85 files, both TypeScript lanes, build and every later gate;
dependency audit zero. Receipt: `integration/2026-09-08T13-06-27.003Z/report.json`.
All 31 selected source/test/config hashes remained unchanged. Log SHA256:
`94d7ab9d22258d528d3ae4e9faba7a80e5588fe4732cecfd3ce4d4f1fbb1e198`.
Six soft asset warnings remain: four PNGs, shared CSS and the 517.4 KB ASR
worker. There are no hard performance failures. AI lazy-load, article visual,
accessibility, schema, image, image sitemap, gallery and secret checks all pass.

A post-hardening actual Chrome hour is now running against the final built
source. Its result and the broader local acceptance judge remain pending.
The full goal, TR statuses, deployment and beta gates are not changed here.

## 13:29 UTC: Final Chrome Proof, Edge Failure And Ordinary-Point Fix

The final post-frame-hardening Chrome hour completed in 370,980ms with
120/120 speech intervals, 241 cues, zero timing conflicts and valid exports.
Receipt: `compatibility/2026-09-08T13-09-53-973Z-chrome-hour-mp3/report.json`.
All thirteen checks pass; three workers terminated, no tracked worker/object
URL remains, and browser/server cleanup completed. The 13:17 readiness receipt
also passes its explicitly no-model layout/accessibility/privacy scope.
Neither receipt proves cold delivery, physical devices or production behavior.

The actual Edge 152.0.4191.66 hour-MP4 run completed in 383,877ms but FAILED:
120/120 intervals retained, 269 cues, 28 timing overlaps. TXT/SRT/VTT files
were produced, but the strict export gate rejects the overlapping captions.
Receipt: `compatibility/2026-09-08T13-18-03-579Z-msedge-hour-mp4/report.json`.
All other checks pass, source/build hashes remained unchanged, and all three
workers, object URLs, browser and server were cleaned up. This synthetic cached
model/video result must not be generalized to other codecs or browser support.

The broader [local acceptance judge](transcriber-local-acceptance-2026-09-08.md)
confirmed an additional ordinary-point correspondence defect: an agreeing
predecessor stretched from 29.64 to 40 could move a source point at 29.98 or
29.8 to a target word at 40..41. The no-gap rule admitted it even after the
source-proven censored branch rejected it. English and CJK real-window/repair
reproductions remove observed evidence. TR-01 therefore remains unapproved;
TR-02's own local acceptance stands but its dependency remains held.

After Edge stopped, permanent tests reproduced eight failures with 96 controls
passing. Ordinary point coverage now also requires a positive target interval
that actually contains the source point. Adjacent anchor, no-gap and unique
lexical matching remain mandatory; no arbitrary time tolerance was introduced.
The narrow source-proven one-frame branch is unchanged. The old 154.98-to-155.12
no-provenance positive is explicitly retained as a rejection regression;
legitimate point-inside-target and both-endpoint controls pass. The specialist
agreed with this evidence-based correction before implementation.

Focused verification passes 140 tests in five files. Independent fix acceptance
and the updated normal full check are pending. All earlier browser receipts
precede this final ordinary-point tightening and are labeled accordingly.
No source/build changes occurred during either hour. No deployment, publication,
purchase, indexing submission, or task approval is inferred from these results.

## 13:34 UTC: Two Independent Local Task Approvals

The specialist independently passed157 tests in five files and closed the
ordinary-point P2. Combined with prior DSP, lifecycle and literal-reader proof,
the final judgment is TR-01 LOCAL APPROVE and TR-02 LOCAL APPROVE, including
its TR-01 dependency. This is an explicit Release Judge decision, not approval
inferred from a green test count. Campaign records now reflect22approved,
0evidence_ready,4in_progress,3blocked; the full objective remains active.

The current normal fullcheck completed at13:29:54.156UTC:1,094tests/85files,
both compilers, build, all later checks and audit0;31selected hashes unchanged.
Receipt: `integration/2026-09-08T13-26-29.580Z/report.json`. Log SHA256:
`8b25ae944c5abe2a1ec5ecebf8cd77b801d9d0647cb44aa8266aa624059c1878`.
The specialist independently verified this receipt and all31current hashes.
The same six soft performance warnings remain; no hard failure or waiver.

Current named Chrome short model inference passes in4,181ms, two valid cues,
all downloads, request/masking gates and resource cleanup. Receipt:
`compatibility/2026-09-08T13-30-34-620Z-chrome-short/report.json`.
The result screenshot was visually inspected: readable editable text,
timestamps and export buttons, with no collisions. This uses verified cached
model assets and is not a current-hour, cold-download or physical-device pass.

The unchanged built source's bounded Edge-MP4 follow-up at source295..890
retains20/20 intervals but fails six overlapping cues at570/690/840. Receipt:
`outer-boundary-1/2026-09-08T13-31-49-903Z-msedge-hour-mp4/report.json`.
The harness maps two logical block bounds and their25second lookahead, then
stops after two acknowledged checkpoints; application worker bytes are unchanged.
All other checks and cleanup pass. Numeric-only observations show preserved
conflicting hypotheses, not proven deleted speech. A same-input Chrome comparison
is pending to distinguish browser-specific behavior from encoded-source effects.
TR-03 remains blocked; there is no release or indexability approval.

## 13:37 UTC: Shared Video Reproduction, Not Edge-Specific

The same bounded source295..890from the exact same MP4 was processed by Chrome
152.0.7977.83 against unchanged current source/build. It also FAILED:
20/20speech intervals,46cues,six overlaps at570/690/840,62,139ms.
Receipt: `outer-boundary-1/2026-09-08T13-33-55-224Z-chrome-hour-mp4/report.json`.
Its transcript hash and complete subtitle timing summary are identical to the
Edge result. All other checks and cleanup pass. Therefore this observed failure
is reproducible in both browsers and cannot be attributed to Edge alone. This
comparison does not establish a universal codec cause or a lexical error rate.

Next bounded TR-03 work: inspect the two raw30second hypotheses and one repair
around570..575on this synthetic MP4. Current numeric evidence retains a point
tail at574.98 and a conflicting reviewed caption ending575; stable preceding
captions are duplicated rather than silently discarded. Determine whether the
unknown-end/lexical-evidence branch prevents a legitimate whole-caption repair.
Do not relax point locality, invent timestamps, omit uncertain words or weaken
the strict export comparator to make this fixture pass. Confirm the root cause
with a permanent focused regression before another full-hour compatibility run.
The bounded harness is generated by `prepare-first-block-check.mjs` then
`prepare-outer-boundary-check.mjs 1` under ignored
`T/output/browser-transcriber-pilot/`; run `outer-boundary-1.mjs` with
`--browser=chrome|msedge --fixture=hour-mp4 --verified-model-cache`.
No product worker is replaced in this comparison, only source-block bounds.

All owned fullcheck/model/compatibility processes have finished. The intentional
owner preview at127.0.0.1:4359is separate from those ephemeral test servers.
No code or build changed after the1094-test fullcheck. The review worktree's
structure validator passes9agents/9goals/29tasks; that is not factual approval.
The narrow security-release worktree remains clean; original promotion work
was not edited. Local TR-01/TR-02 approvals stand; TR-03 and the goal remain open.

## 13:48 UTC: Raw Evidence And Bounded Additional Context

Previous goal turn classification: progress. It fixed ordinary-point matching,
obtained two explicit local task approvals, and isolated the shared MP4 failure.
Current source and saved receipts were inspected before this continuation.

An isolated numeric/token-ID observer traced the actual synthetic MP4 around
570..575. Raw545..575ends with a point at574.98; raw570..600places the last word
at574.96..575. The short repair starts565.6599375and places that word from
575.0199375, so positive corroboration fails. All14 normalized token identities
agree. The code correctly preserves uncertainty rather than deleting a passage.
Receipt: `video-window-diagnostic/2026-09-08T13-38-23-727Z-chrome-hour-mp4/report.json`.
These reports contain token IDs/counts/times, not raw transcript strings.

An output-only experiment extended that repair's right context to30seconds,
leaving the same raw hypotheses and all acceptance guards intact. It passed
10/10speech intervals,20cues,zero timing issues and all exports in32,573ms.
Receipt: `video-window-diagnostic-long/2026-09-08T13-41-15-638Z-chrome-hour-mp4/report.json`.
Both experiments used an instrumented worker bundle and are diagnosis only,
not unchanged-built, conditional-scheduler or release proof. Model/runtime pins
and application source were unchanged during the experiments.

The specialist supported bounded TDD. Product repair now preserves its first
attempt and whole-original fallback. Only an aligned but uncorroborated result
can try once more with strictly more right context, at most30seconds/validPCM.
Each attempt recomputes raw contributors, whole-caption containment and outside
collisions; a rejected retry never becomes source evidence. Errors, invalid
alignment, oversized regions and cancellation cannot trigger further work.
All coverage/frame/locality rules and completed edit/checkpoint logic are unchanged.

Tests first reproduced10failures/41passes, then147 focused tests pass after the
implementation and expanded-contributor regressions. They cover at most two
attempts, first-success one call, whole30second no-repeat, EOF bounds, partially
captured captions, retained extra source words, and both second-attempt control
errors. Updated fullcheck and independent source rejudge are running. Prior
local approvals bind their earlier snapshot until the new helper is rejudged.
No public release, index-policy, account, dependency or model changes occurred.

## 13:56 UTC: Current Local Acceptance And Bounded Built Pass

The full check completed at13:49:18UTC: 1,101tests/85files, both TypeScript
checks, build, image/schema/accessibility/performance checks and zero dependency
findings. The31selected source hashes are unchanged. Receipt:
`integration/2026-09-08T13-46-10.558Z/report.json`; log SHA256
`3b7fd19f72cd268a0ed42ed1931845855769f0d46918bcafd58413ee78c2014e`.
Six documented soft page-weight warnings remain; they are not hard failures.

The independent Release Judge approved the optional second-context helper and
maintained TR-01/TR-02 local acceptance after164focused tests and eight extra
real-validator controls. See `transcriber-local-acceptance-2026-09-08.md`.
The paired expanded-caption controls reject a retry omitting newly included
source words and accept the same retry when those words are present. No coverage
guard, source timestamp, model pin or language assumption was relaxed.

Unchanged built Chrome152.0.7977.83 passed the previously failing synthetic MP4
source295..890: 20/20speech intervals,40cues,zero timing issues,validTXT/SRT/VTT,
66,005ms. Receipt: `outer-boundary-1/2026-09-08T13-49-32-278Z-chrome-hour-mp4/report.json`.
All15source/harness and68built hashes match; three tracked workers terminated,
zero live workers/objectURLs,owned browser/server stopped. This is bounded
two-checkpoint proof, not a completed hour. The judge independently verified it.

A current-built complete hour-MP4 Edge run is in progress. Product and build
remain frozen during inference. A separate synthetic15minuteMP3 fixture was
prepared from the first899.928seconds of the same hourMP4, matching the established
72msMP3 padding correction. ffprobe reports900.000000seconds/7,200,332bytes.
The ignored quarter-hour harness derives the existing compatibility runner,
requires all30known speech intervals and uses unchanged application workers.
Firefox/WebKit runs have not started; none of these pending gates is approved.

## 14:07 UTC: Full-Hour Outcome And Rejected Experiment

Current Edge152.0.4191.66 completed the full3600secondMP4 in384,128ms without
crash, but **FAILED validExports**. All120/120known speech intervals remain;
255cues contain14timing overlaps at1380,1770,1920,2340,3000,3420and3540.
Receipt: `compatibility/2026-09-08T13-52-56-983Z-msedge-hour-mp4/report.json`.
The prior28overlaps/269cues are not current. This is improvement, not acceptance.
Other checks pass: noindex, lazy model, explicit masking, no unexpected network,
no overflow, selected source/build identity and cleanup. Three tracked workers
terminate, zero live workers/objectURLs remain, browser/server are stopped.
Sampled whole-browser working sets peak at1,404,129,280bytes. This sampling
does not prove native allocation release or a maximum-device memory bound.

An output-only block1180..1480observer reproduces the first remaining case.
Raw1355..1385ends at point1384.98; raw1380..1410places its final word at
1384.96..1385. Both retries start that word at1385.02, outside the required
positive interval. All14normalized token identities agree; no raw text is saved
in the diagnostic receipt. Current strict guards correctly preserve uncertainty.
Receipt: `video-window-diagnostic-4/2026-09-08T14-00-50-163Z-chrome-hour-mp4/report.json`.

One ignored experiment centered the optional30second context instead of extending
only right. It still failed at the same two overlaps,10/10intervals/22cues.
Receipt: `video-window-diagnostic-centered-4/2026-09-08T14-02-30-998Z-chrome-hour-mp4/report.json`.
That experimental scheduler is **not adopted**. No product timing/coverage guard
or expected result was changed to force this synthetic recording through.

The independently requested paired expanded-caption controls are now permanent
tests: otherwise valid second result omitting49..49.6source words is rejected;
including them is accepted. Both keep inputs unchanged and cap recognition at
two calls. Nine real-validator repair tests pass. This is test-only hardening;
product source/build behavior is unchanged. Updated fullcheck and review pending.
Remaining compatibility/privacy/beta and release gates remain open.

## 14:16 UTC: Regression Proof And Full Check

The current full check completed at14:08:37.386UTC, exit0: **1,103 tests in
85 files**, both compilers, build and all later checks, zero vulnerabilities.
All31selected source hashes stayed unchanged. Receipt:
`integration/2026-09-08T14-04-54.948Z/report.json`; log SHA256
`f93ee011db61727a8423a755f6c26b0a85e039e48c6180757dfa3d8588502fd2`.
Only the paired test file changed since the1,101-test snapshot; application
source and the reviewed repair behavior did not change.

The independent judge separately ran all nine real-validator repair tests and
accepted the new pair with no finding. It also confirmed that the1380diagnostic
has only13of14positive word correspondences. Keep the current guards and do not
continue context-position search. Local approvals stand; the hour gate stays red.

An ignored deterministic probe now preserves the exact numeric1380case using
synthetic token-ID labels and the current real Alignment/Coverage/Repair code:
`T/output/browser-transcriber-pilot/verify-context-rejection.mjs` and
`context-rejection-proof.json`. Both observed retries are rejected in two calls,
retaining all four original captions. A genuinely positively corroborated
control is accepted in one call with two captions. Inputs are recursively frozen.
The initial lowercase placeholder labels did not preserve sentence segmentation;
capitalized synthetic labels corrected that probe-only fixture. No source guard
or assertion was removed. This is deterministic safety evidence, not a fix for
ASR timing or a new acoustic benchmark. Product source/build remain frozen while
the actual Firefox15minute run is in progress.
