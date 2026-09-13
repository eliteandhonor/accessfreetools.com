# Current Browser Integration

September 8, 2026. Product worktree: `accessfreetools-browser-transcriber`,
branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab` plus preserved local
work. All evidence paths below are relative to that worktree. No deployment,
indexability change, purchase or public action is authorized by this report.

## Deterministic Browser Tests

`scripts/transcriber-browser-compatibility.mjs --verified-model-cache` now
serves verified model bytes at the original pinned URLs. Before launching a
browser, it validates the pinned manifest hash, repository, revision, regular
confined files, sizes and individual hashes. Buffered snapshots prevent later
file replacement from changing the served responses. Missing entries fail
closed. Runtime files are recorded separately against the installed, locked
ORT 1.27.0 package. The normal remote mode is unchanged.

This mode proves browser computation, integration and synthetic request
boundaries. It does not prove cold external downloads. It neither replaces the
application worker nor changes the selected Chrome/Edge channel. Reports bind
selected source, harness and 68 built-file hashes before and after execution.
Cleanup records page-created workers/object URLs plus browser/server shutdown.
Whole-process memory samples are not equivalent to native-allocation proof.

The [independent cache review](transcriber-compatibility-cache-judge-2026-09-08.md)
found no issues in its bounded review and passed 57 independent pure probes.
It reviewed an earlier short run, not the later hour run or timing change.

## Export Validator Correction

The previous browser harness stripped arbitrary tags/entities before comparing
SRT text. That rejected the current literal-text serializer's safeguards.
The new pure helper consumes the serializer's exact atoms and validates TXT,
SRT and VTT content, count, order and cross-format timing. It does not relax
the existing non-overlap or duration requirements. It is not a general reader.

The [implementation report](transcriber-compatibility-exports-2026-09-08.md)
records tests-first failure and 71 focused passes, including four independent
FFmpeg 7.1 imports. Native imports require `TRANSCRIBER_EXPORT_FFMPEG`; a normal
test run without this explicit executable records those four as skipped.

## Preserved Real Failures

All directories in this table are under
`output/browser-transcriber-pilot/compatibility/`, each with `report.json`.

| Run | Observed Result |
| --- | --- |
| `2026-09-08T10-15-59-469Z-chrome-short` | Missing separately cached runtime responses; no inference. Fixed only in the harness. |
| `2026-09-08T10-16-57-190Z-chrome-short` | Inference and three downloads completed; legacy export validator rejected them. |
| `2026-09-08T10-19-53-594Z-msedge-short` | Named Edge inference and downloads completed; same legacy validator failure. |
| `2026-09-08T10-21-27-048Z-chrome-short` | Corrected validator passed; broad fallback caption still present. Structural pass was not alignment acceptance. |
| `2026-09-08T10-21-49-671Z-chrome-hour-mp3` | All 13 blocks completed in 455445 ms without a crash. Exports failed timing validation and only 40/120 synthetic speech intervals matched. |
| `2026-09-08T10-40-39-258Z-chrome-hour-mp3` | After the point fix, completed in 391332 ms with 124 cues and 56/120 matched intervals. Timing and coverage still failed. |

The failed hour run used an exact 3600-second synthetic MP3. It produced 8544
characters and 89 cues, including overlapping five-minute fallback captions.
All three workers terminated and object URLs were revoked. Peak sampled browser
working set was about 1355 MiB. Neither completion nor cleanup overrules its
failed content/timing gates. This repeated short voice sample is not a general
speech-accuracy benchmark.

## Root Cause And Narrow Regression Fix

The numeric-only synthetic diagnostic at
`output/browser-transcriber-pilot/diagnostic-alignment/2026-09-08T10-37-23-921Z-chrome-short/report.json`
showed matching text and 14 ordered word chunks. The last word had the reported
point timestamp `[5, 5]`. The previous validator required every word to have
positive duration and consequently replaced the entire block with a fallback.

`browserTranscriberAlignment.ts` now retains monotonic point anchors alongside
positive-duration words. Point-only sentence groups attach to a positive
caption, preserving the original word times without making up duration. An
entirely point-only, invalid or missing alignment still falls back. Point
intersections are not used as evidence for deleting boundary text.

Five new regressions include trailing, leading and interior points, point-only
sentences and boundary retention. Four failed before the change; the focused
alignment/core/TR-02 run now passes 119 tests. Rebuilt actual Chrome short run
`2026-09-08T10-40-19-155Z-chrome-short/report.json` passes all 12 checks with
valid split captions and actual TXT/SRT/VTT downloads.

The first diagnostic builds used nested ORT 1.26.0 and failed before inference.
They are retained, not counted as product failures. The successful diagnostic
explicitly matches Vite's top-level `onnxruntime-web` dedupe to 1.27.0. Earlier
isolated esbuild results must not be described as runtime-identical production
bundle proof. Diagnostic bundles contain a numeric observer and are not release
artifacts; normal compatibility runs use the unchanged built worker.

The independent point judge found that partial deduplication could strip all
positive-duration words and leave a point-only caption. Two failing regressions
reproduced this. The merge now retains the original positive-supported incoming
caption with a review flag when that would occur, without changing the completed
prefix. The [scoped rejudge](transcriber-point-alignment-judge-2026-09-08.md)
closes this P2 after 26 independent checks. It explicitly does not certify the
non-overlap export gate: unresolved hypotheses remain overlapping and visible.

## Independent Recognition Windows

The first-block numeric diagnostic at
`output/browser-transcriber-pilot/diagnostic-alignment/2026-09-08T10-49-20-090Z-chrome-hour-mp3/report.json`
stopped after the first 300-second block. Its first three word intervals were
at 0.82-1.78 seconds, followed by the fourth at 31.76 seconds. The upstream
multi-chunk result had already merged separate repeated speech before the
application received it. Installed Transformers.js 4.2.0 pipeline and tokenizer
source confirm the cross-chunk longest-common-sequence stage.

`browserTranscriberWindows.ts` now recognizes individual windows of at most
30 seconds with five seconds of overlap and merges observed absolute word times.
It reuses the pinned pipeline; it does not add a model or rewrite the tokenizer.
Window progress carries the originating request ID and completed five-minute
blocks keep the existing checkpoint behavior. Nine pure tests cover window
lengths, source offsets, repeated speech, bounds, uncertain fallback and failure.
The existing protocol fixture now supplies 16000 samples for its one-second
claim and explicitly checks the progress response. No assertion was removed.

Actual built-app check:
`output/browser-transcriber-pilot/first-block-check/2026-09-08T10-55-45-536Z-chrome-hour-mp3/report.json`.
This intentionally stops after the first completed block, not the full hour.
It recovered all 10/10 expected speech intervals in 26396 ms and released all
workers/object URLs. It still fails export timing: 23 cues include conflicting
hypotheses around 150 seconds. The source word data show both a point anchor
and a different lexical hypothesis, so blind string deletion is not justified.
This is concrete remaining work, not a passed release or a reason to relax the
non-overlap gate. No further hour run is warranted before resolving that case.

## Open Gates

The first current full check stopped at five test failures: one outdated static
worker-call assertion and four native-worker fixture failures. Its immutable
receipt is `output/browser-transcriber-pilot/integration/2026-09-08T10-58-54.892Z/report.json`.
The mounted fixture supplied only 160 samples while claiming up to 10 seconds,
and delivered one reply without forwarding the newly emitted progress event.
It now allocates the requested sample interval and forwards progress until the
terminal reply. Static checks follow the worker-to-window-to-alignment path.
All 117 mounted/content tests pass. The final complete gate passed with all
four FFmpeg imports enabled: **965 tests in 82 files**, both TypeScript lanes,
build, every later check and **zero dependency vulnerabilities**. Its receipt is
`output/browser-transcriber-pilot/integration/2026-09-08T11-02-14.322Z/report.json`,
completed at 11:05:09.778 UTC. All 25 selected source/test/harness/config hashes
remained unchanged. Log SHA-256:
`4776fb93be6f0335000adc157ff5b5d000fa61ba5f498159f03114897db2eda1`.

The gate checked 676 HTML pages, 1990 JSON-LD blocks, 27 automated accessibility
page/viewport pairs, image/gallery coverage and no initial model requests on
666 non-AI and ten AI pages. Six soft asset warnings remain, including the
513.3 KB lazy ASR bundle and 179.8 KB shared stylesheet. These are not hard
budget failures or a waiver of manual accessibility/browser acceptance.

The [independent source-window review](transcriber-source-window-judge-2026-09-08.md)
found no required source changes. Its bounded probes cover sample boundaries,
serial inference, progress identity, failed windows and cancellation. It does
not approve whole TR-01, full-hour accuracy or browser compatibility. Three
suggested permanent regressions now prove that Error, AbortError and TimeoutError
on the second recognition window halt inference, retain the failed request ID,
omit private error detail and never report a completed block.

The final full check including those regressions passes **968 tests in 82 files**,
both TypeScript lanes, build and all later gates, with **zero vulnerabilities**.
Receipt: `output/browser-transcriber-pilot/integration/2026-09-08T11-09-25.408Z/report.json`.
Completed at 11:12:17.884 UTC; all 25 selected hashes remained unchanged.
Log SHA-256: `9de136bed624db1cb4005872068eb231bf549a2316a319461b5ffa83004d829c`.
This supersedes the 965-test checkpoint above, not the failed audio evidence.

Readiness at `output/browser-transcriber-pilot/2026-09-08T11-07-35-355Z/report.json`
passes layout, control sizing, automated axe, masking, lazy loading and noindex
checks. Model inference and pinned network-request checks are explicitly null/NOT
RUN in that command. Real-audio results are the separate reports above.

TR-01 remains in_progress, TR-02 remains evidence_ready behind TR-01, and TR-03
remains blocked by its real-browser, privacy, model-delivery and beta requirements.
Seven stable beta days cannot be replaced with a fast synthetic test. No additional
hour run was launched after the known first-block overlap failure. All owned
test commands and both scoped reviewer agents have ended. No commit, push,
deployment, purchase, public promotion or indexing submission occurred.

## Next Reproduction

Resolve the conflicting 150-second hypotheses in the saved first-block case
without deleting separate repeated speech, inventing word duration or weakening
the subtitle non-overlap gate. Add a minimal failing test before another source
change and obtain an independent judgment of the chosen reconciliation rule.
First re-run the same five-minute actual built-app check. Only after that passes
should the unchanged full-hour Chrome/Edge MP3/MP4 matrix resume. Cold model
delivery remains a separate requirement from verified-cache compute tests.
