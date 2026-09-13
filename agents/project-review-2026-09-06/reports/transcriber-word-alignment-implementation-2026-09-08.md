# Transcriber Word Alignment Implementation

September 8, 2026. Parent implementation evidence, not task or release approval.
T is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch
`codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5`
plus its preserved unpublished changes. No commit, push, deployment, indexing,
purchase, user-media processing, or promotion occurred in this increment.

## Source Change

- Transformers.js 4.2.0's Whisper seek implementation iterates padded feature
  length, not the pipeline's actual `num_frames`. A version-guarded instance
  adapter bounds real mel frames before delegating to the original seek method,
  which still performs encoder padding. No model weights, generated token IDs,
  session results, global prototypes, or dependency versions are replaced.
- The first production adapter attempt rejected Transformers' Callable model
  shape. The real failure and a new failing unit test were retained; the guard
  now accepts callable instances with the verified private method. Its suite
  passes 67 cases. The independent test author also fixed a proven test-only
  lazy-Undici snapshot effect, retaining every global key in mutation checks.
- The ASR worker requests word timestamps and retains them privately as merge
  evidence. `Intl.Segmenter` groups whole observed words into sentence captions.
  Unknown, invalid, or inconsistent alignment retains transcript text with a
  bounded block interval and a review flag, not fabricated word timestamps.
- Matching requires a unique source-overlapping word prefix/suffix. Uncertain
  or invalid regions cannot re-enable coarse deletion of valid word evidence.
  Internal apostrophes, hyphens, and separators remain significant.
- Conflicting hypotheses remain visible with a review notice. Completed source
  records stay stable for retry/edit identity; display and downloads sort by
  original start/end times. No source word timestamp is shifted to hide a conflict.
- The warning was made applicable to both repetition and conflicting hypotheses.
  The local `remove-ai-marks` inspection service found zero deterministic Unicode
  carriers in that notice. No cleaning or disclosure removal was needed; this
  is not a human-authorship or statistical-watermark claim.

## Regression Evidence

Initial alignment and adapter test collection failed because implementation
modules did not exist. Parent then integrated the modules and actual worker.
The historical coarse-only grouped repeated-speech cases remain unchanged:
without timing evidence they retain four flagged occurrences, not an invented
exact reconstruction. The richer word protocol addresses the source ambiguity.

The [independent source review](transcriber-alignment-source-judge-2026-09-08.md)
found three real defects in the initial merge: mixed-metadata deletion, backward
unflagged captions, and contraction conflation. Added regressions reproduced
seven failures in 21 alignment tests before their fixes. Current pure selection
passes 62 tests across alignment, core, and prior core-fix files.

Actual mounted React/worker-transport tests pass 62 cases, including direct,
Stop, failure/retry, corrected/deleted captions, three retained source
utterances, chronological presentation, edit identity, and actual TXT/VTT
downloads. Model/decoder outputs are synthetic in this mounted suite. The
separate actual-model evidence below must not be conflated with it.

The targeted visual case passed separately and its screenshot was inspected:
caption order, warning, text fields, filename, and exports are readable without
overlap. Proof: `T/output/browser-transcriber-pilot/aligned-ui-2026-09-08/aligned-conflict-order.png`.
This is one styled desktop component state, not a full responsive or accessibility pass.

## Actual Pinned Model Evidence

All paths below are under
`T/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/`.
Models come from the fully verified pinned cache. The browser is isolated
bundled Chromium, q8 WASM, with local verified assets and external requests
denied. It is not named Chrome/Edge or a real mobile device.

| Report | Result | Elapsed |
| --- | --- | --- |
| `source-reviewed-english-boundary/report.json` | Both independently inferred windows contain two Yes utterances; merge contains exactly three | 4,521 ms |
| `source-reviewed-english-bella/report.json` | English model: 14 bounded words grouped into two sentences | 3,428 ms |
| `source-reviewed-multilingual-bella/report.json` | Multilingual model, English input: 14 bounded words grouped into two sentences | 3,390 ms |

Every recorded check passes, including actual decoder cross-attention, token
timing, caption alignment, verified served bytes, no remote application
requests, no selected-source drift, and completed worker/browser/server cleanup.
The two boundary audio windows are byte-identical by construction but represent
different positions in the documented three-utterance source recording.

These bounded results do not prove precise word-level ASR accuracy, non-English
language coverage, long-recording reliability, production loading, or a beta
period. The original failures, experimental attempt07, Callable shape failure,
and pre-review runtime reports remain preserved in separate directories.

## Remaining Gates

The [independent rejudge](transcriber-alignment-source-rejudge-2026-09-08.md)
closed the three original findings after 25 pure checks. It then identified
Copy text still using checkpoint order. An actual mounted Copy-button test
reproduced that failure; the memo now sorts a copy with the common comparator.
Five additional independent copy/projection cases and the original reproducers
passed, closing the scoped follow-up. Checkpoint state and clipboard newline
conventions remain unchanged.

The first current full check stopped at two stale test fixtures: a source check
still expected boolean timestamps and a request-identity model mock omitted the
new version/private Callable contract. Both now represent the real protocol;
the readiness assertion was strengthened. All 120 selected mounted, protocol,
and site-content cases pass. The subsequent complete check passed 852 tests in
79 files, both compiler lanes, build and all later gates with zero dependency
findings. Its 17 selected files were unchanged during execution. Receipt:
`T/output/browser-transcriber-pilot/integration/2026-09-08T09-56-42.566Z/report.json`.
This supersedes the earlier 757-test receipt for those implementation bytes.

## Readiness Report Correction

The default `transcriber:browser-check` exercises inspection and layout, not
inference. Its initial report incorrectly marked optional model checks true
when skipped. The runner now emits `modelSmoke.status: not_run`, a null model,
null skipped checks, and `NOT RUN` in Markdown. An enabled button is named
`selectedFixtureEnablesTranscribeButton`, not proof that inference succeeds.
Opted-in smoke checks require non-empty text, distinct non-empty TXT/SRT/VTT
downloads, and observed requests for the selected model's exact pinned revision.
Empty request lists cannot pass revision proof by vacuous aggregation. The
timestamped evidence directory now retains its JSON alongside the screenshots.

Sixteen new cases first failed for the missing helper. A parameterized-test
array shape error was fixed without changing any expected outcome. All 65
proof-helper cases then passed. The optional-report changes do not modify the
application bundle, model protocol, or runtime evidence recorded above.

Fresh default readiness proof:
`T/output/browser-transcriber-pilot/2026-09-08T10-06-41-894Z/report.json`.
Desktop and 390x844 layout checks passed with zero automated axe findings in
the tested workspace, zero console errors, no model requests, and a 44px
minimum active button height on desktop. Desktop/mobile fold screenshots were
manually inspected for readable text and non-overlapping controls. This remains
local Chromium viewport evidence, not mobile-device or WCAG conformance proof.
Two aborted local media blob reads are recorded; no remote application request
was attempted. The report explicitly makes no generation/download claim.

The final full check including the report correction passed 868 tests in 79
files, both compiler lanes, build and every later gate with zero dependency
findings. The 18 selected files were unchanged during execution. Receipt:
`T/output/browser-transcriber-pilot/integration/2026-09-08T10-06-47.517Z/report.json`.
Raw log SHA-256:
`2a4db8085123486d5272df43086b5ecc4efd8f18c065afc9b5947c7306e65942`.
It completed at 10:09:43.964 UTC on Node 24.20.0. Six soft asset warnings remain
(four PNGs, shared CSS, and the 509.2KB ASR worker), with no hard budget failure.
`git diff --check` also passed; existing LF/CRLF warnings did not trigger edits.

The independent report-scope addendum completed with no findings after 40 pure
probes. It verified skipped/selected-model proof, the runner's actual aggregate
expression, and the exact timestamped JSON, bound to the current source hashes.
This supplements the earlier alignment/Copy closures, not browser or release
acceptance. All parent test sessions and reviewer agents are now closed.

## Product Gates Still Open

TR-01 remains in progress; TR-02 remains evidence_ready with its TR-01 dependency.
TR-03 retains full-hour named-browser, language/codec/track, full-product privacy,
memory, and seven stable beta-day gates. The prior named Chrome empty204 fixture
response is not diagnosed by switching to bundled Chromium. Tool and guide
remain unpublished and noindex. Broader GPT-6 review goals remain active.
