# Transcriber Contextual Overlap Repair

September 8, 2026. Local unpublished product work only. This report supersedes
the 968-test checkpoint for the changed repair source, not its retained history.
No commit, push, deployment, index request, purchase or public promotion.

## Scope And Decisions

Product checkout T is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
Review checkout R is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
The original dirty promotion checkout and deployed security-only checkout were
not edited. Node24, Astro7, both model revisions and input limits stay unchanged.
The transcriber tool/guide remain unpublished and `noindex,follow`.

Independent recognition windows recovered all repeated synthetic speech, but
some boundary windows still supplied conflicting captions. A bounded repair now
re-recognizes actual PCM around a conflict before the five-minute checkpoint:

- Retain raw window hypotheses only for the current block.
- Include whole captions and five seconds of context, never more than 30 seconds.
- Require one complete original hypothesis to corroborate every retry lexical word.
- Require a unique ordered correspondence for every other original candidate.
- Keep originals if alignment, coverage or outside-collision checks fail.
- Preserve the existing completed-prefix/edit projection and source timestamps.
- Propagate abort/timeout; ordinary optional retry failure retains prior text.
- Record no text, media, filename or transcript in diagnostics/analytics.

This is conservative ASR hypothesis reconciliation, not proof that a retry is
acoustically correct. It does not broadly loosen the general duplicate matcher.

## Reproductions And Corrections

The independent reviewer found that sample floor/ceil can catch a new caption
after whole-caption closure. All selected and original captions must now be
fully inside the final rounded PCM bounds before recognition. Right/left/point
regressions failed before the fix; all 20 orchestration tests pass afterward.
The bounded independent rejudge passes 70 tests and closes that specific P2.

The first actual full-hour retry retained 120/120 speech intervals but failed
subtitle exports. Download bodies were not retained, only hashes. Numeric-only
timing diagnostics were added without changing the export validator. The next
hour reproduced 14 overlapping cues in seven source intervals: 690, 960, 1380,
1770, 2460, 2880 and 3540 seconds. The fixture contains 120 separate speech bursts; coverage
is not an accuracy score or evidence of professional transcription quality.

An isolated source 590..890 diagnostic identified why the 690-second repair failed:
the retry contained the same 14 lexical tokens plus a standalone final sentence
mark at a point timestamp. The lexical validator treated it as a new word.
Only a terminal replacement-only zero-duration sentence mark is now exempt
from lexical corroboration. Actual punctuation remains in the caption. Original
evidence stays strict; interior/positive-duration punctuation, symbols, omitted
words, changed tokenization and ambiguous repeated words are not exempt.
Six positive regressions failed before this change. The focused suite then
passed 177 tests in five files, including unchanged general-alignment cases.

## Browser Evidence

All paths below are relative to T/output/browser-transcriber-pilot/.
Model and ORT responses use hash-verified cached bytes at their original pinned
URLs. They do not prove cold external delivery. No source/build changes occurred
inside these actual-browser runs. Chrome was the installed named browser, not
viewport emulation or a substituted Node inference engine.

| Evidence | Result | Limits |
| --- | --- | --- |
| first-block-check/2026-09-08T11-43-48-715Z-chrome-hour-mp3/report.json | PASS25,862ms,10/10intervals,21cues | Actual first block; before rounding/punctuation corrections |
| compatibility/2026-09-08T11-44-54-862Z-chrome-hour-mp3/report.json | FAIL319,114ms,120/120intervals,257cues | Invalid exports; saved hashes only |
| compatibility/2026-09-08T11-58-36-682Z-chrome-hour-mp3/report.json | FAIL314,929ms,120/120intervals,14timing issues | Numeric issue locations; strict export gate unchanged |
| overlap-context-diagnostic/2026-09-08T12-05-49-364Z-chrome-hour-mp3/report.json | Reproduces two overlaps at690seconds | Rebuilt observer worker and selected source590..890; diagnostic, not release proof |
| bounded-source-check/2026-09-08T12-09-56-314Z-chrome-hour-mp3/report.json | PASS29,309ms,10/10intervals,20cues,zero timing issues | Actual built workers; harness selects590..890, not a whole-hour pass |
| compatibility/2026-09-08T12-10-57-415Z-chrome-hour-mp3/report.json | FAIL314,880ms,120/120intervals,251cues,8timing issues | Three repaired intervals; four unresolved intervals remain |
| overlap-context-diagnostic/2026-09-08T12-17-39-001Z-chrome-hour-mp3/report.json | Reproduces the remaining960second conflict | Numeric observer on885..1185; not release acceptance |

The bounded pass verifies all three exports, masked private surfaces, no
unexpected network requests, no overflow, source/build identity and reset
cleanup:3workers created/terminated,0liveworkers and0objectURLs. Real memory,
multilingual/codec/track/browser coverage and seven stable beta days are separate
acceptance gates. The earlier experimental re-decode probe is not product proof.

## Current Gates

The final normal check below passes, but the actual hour still fails exports.
Historical 968-test evidence is not approval of this patch.
TR-01 remains in_progress, TR-02 evidence_ready behind TR-01, TR-03 blocked.
The whole review goal remains active. No indexability or deployment approval.

Independent scoped reasoning and P2 closure:
[Overlap design and rejudge](transcriber-overlap-design-2026-09-08.md).

## Remaining Exact Failure

The final actual hour run reduced 14 overlapping cues to 8, at 960, 1770, 2880
and 3540 seconds. It still fails exports. The 1770 and 3540 intervals straddle outer block
boundaries; provisional repair does not rewrite a completed prior checkpoint.
The isolated 960-second diagnostic returns the same 14 lexical tokens on retry,
but its last positive words have a 0.12-second gap. The original truncated final point
does not satisfy the strict no-gap correspondence condition, so both candidate
captions remain. Do not remove this guard merely to get a green fixture.

The next work is a bounded cross-block/context design that preserves spoken
repetitions and user edits, with this exact raw-timing case as a regression.
Do not repeat another full-hour run until the smaller cases are resolved.
These synthetic diagnostics do not establish word-level acoustic accuracy.

After that frozen run, the reviewer's optional alias hardening was implemented:
final-token checks now use array positions, not object identity. A reused-point
object test first returned true incorrectly; the positional fix rejects it.
Additional NaN, infinite, negative and backward final-point cases pass. The
focused coverage and orchestration suite passes 79 tests. This strengthens the pure helper
against malformed callers; current builder-created objects were already distinct.
Earlier actual browser receipts precede only this final positional correction.

## Final Local Verification

The normal `npm run check` passed at 2026-09-08T12:22:51.441Z on Node 24.20.0:
1,048 tests in 84 files, both compilers, build and every later gate. Dependency
audit found zero vulnerabilities. All 29 selected source/test/config hashes are
unchanged through the run. Receipt in T:
`output/browser-transcriber-pilot/integration/2026-09-08T12-19-52.459Z/report.json`.
Log SHA256: `eec8337b8f13cc3803f5776394c0a3008fbbb5827fa1e0d636ae07ea3d7556d5`.

The six soft asset warnings remain documented: four PNGs, shared CSS and the
516.5 KB ASR worker. No hard performance-budget failure. AI lazy-load checks pass
666 non-AI pages and 10 AI initial loads without pre-action model requests. Image
QA, image sitemap, gallery, article visual and structured-data gates all pass.
No test assertion, deadline, worker isolation, input limit or model pin changed.

`npm run transcriber:browser-check` passed at 12:23:53.813Z for its actual limited
scope: layout, tap targets, axe, reduced motion, masking, lazy loading and
noindex. Its optional model smoke values are explicitly null/not-run, not an
inference claim. The failed hour and bounded inference receipts above supply
the separate model evidence. The bounded result screenshot was visually checked:
caption fields, timestamps and download controls are readable and non-overlapping.

The independent positional rejudge passed 79 tests and closed its precise note.
Neither it nor the local full check approves TR-01 or the whole release.
Raw diagnostic outputs and model caches remain ignored. Required user privacy
and AI/model disclosures are unchanged. Original promotion and deployed narrow
security worktrees were not edited; no unrelated work was reverted.

## Handoff

The final independent design note recommends evaluating more right-side context
inside the existing single, at-most-30-second provisional retry. It explicitly
does not prove a fix or authorize weaker coverage rules. Completed-boundary
conflicts need a separate design that preserves edited/checkpointed captions.
All four remaining regions stay uncertain until bounded reproductions pass.

All owned test/diagnostic processes and the reviewer have ended. A separate,
hidden local Astro preview was intentionally left running for the owner at
`http://127.0.0.1:4359/tools/audio-video-transcriber/` (launcher PID9388).
Its HTTP200, transcriber markup and noindex directive were verified. This is
local preview only, not Hostinger deployment or server-side speech inference.
Logs remain ignored under T/output/browser-transcriber-pilot/preview-4359*.

## 12:40 UTC Follow-Up: Rejected Experiment And Frame Provenance

The proposed extra right-side context was tested, not adopted. Ignored observer
receipt `overlap-context-diagnostic-extended/2026-09-08T12-31-04-640Z-chrome-hour-mp3/report.json`
records 29,488ms, four timing issues at 960 and 1110 seconds. The longer
954.84..984.84 crop still left the 0.12-second final-word gap and introduced
another unresolved region. No experimental worker was copied into product code.

Local pinned Transformers.js 4.2.0 source confirms a full 30-second window has
1,500 encoder frames at 20ms; DTW's final available frame is 29.98 seconds.
The new narrow coverage branch requires the actual final raw caption from that
full window, an exact final-frame point, a complete same-length corroborating
hypothesis, two preceding positive lexical/time anchors and the point inside
the preceding retry word. Normal point/no-gap and repetition rules remain.
Partial windows, detached provenance, later raw words, extra later repetitions
and short unanchored phrases cannot use this branch. No timestamps are invented.

Seven new tests first reproduced one failure; the focused coverage, repair,
window and alignment run now passes 123 tests. Build passes. A frozen actual
Chrome hour run is in progress; this paragraph is not a browser or release pass.
The preceding full-check receipt predates these source changes. TR statuses
are unchanged. The separate cross-block design is recorded in
[the specialist report](transcriber-cross-block-design-2026-09-08.md); it is not implemented.
