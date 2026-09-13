# Transcriber Core Task Fixes

Implementation handoff, September 6, 2026. **No self-approval. Erdos retains independent judgment.**

## Outcome And Remaining Gap

- **CJ-TR01-01:** the reproduced later-speech deletion is prevented with a loss-averse ambiguity guard. If coarse segment timing permits more than one repeated-prefix alignment, the incoming words and original span are kept and marked for review. Exact/prefix English and spaced/unspaced CJK work through the actual mounted two-block flow and an edited checkpoint/retry. The four original exact-three assertions remain failing, now with **four retained occurrences instead of two**, not silently deleted speech. Exact automatic deduplication of these ambiguous grouped captions is NOT claimed fixed.
- **CJ-TR02-01:** minimal and full SRT fixtures now pass the unchanged independent FFmpeg 7.1 importer. Native Chromium WebVTT, FFmpeg WebVTT, TXT, and the existing HTML-decoding SRT test remain passing. Twelve additional format-specific FFmpeg checks pass. No reader-side repair or narrowed product contract was introduced.

Coordinator authorized the bounded loss-averse implementation as an improvement pending independent acceptance; owner did not change the task contract. That is the behavior implemented for ambiguous repetitions, not an alteration of the exact task's original acceptance criterion. The original red assertions and the remaining four post-fix failures are preserved for the judge.

## Roots And Ownership

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus the pre-existing unpublished dirty draft.
- R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`; this named campaign report is the only R write.
- Read the independent `transcriber-core-task-acceptance.md` and exact TR-01/TR-02 task contracts first, then root/campaign AGENTS, implementation/tests, original independent probes and brand guidance for the new warning.
- Owned generated evidence E: `T/output/browser-transcriber-pilot/core-task-fixes/`. Judge-owned original evidence remains untouched. Snapshot before edits matched all 506 frozen hashes; after edits, only four existing owned source/test files differ, plus one new owned test file. No other dirty file was changed.

## Production Changes

### CJ-TR01-01: Keep Uncertain Speech

[browserTranscriber.ts:239](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:239) still matches temporally intersecting previous-block suffixes to incoming prefixes. It now detects a second valid text alignment instead of always choosing the longest. In that case, neither the whole-segment duplicate path nor prefix stripping deletes the uncertain incoming text. Exactly same-timed, same-text captions can still collapse; uniquely matched split boundaries retain their existing behavior.

`TranscriptSegment.overlapNeedsReview` is an optional local result flag. Flagged captions retain the incoming start/end rather than shifting unaligned words to the previous caption's end. The flag survives later merges and checkpoint source evidence. No word timestamp, inferred token duration, model change, or fabricated alignment was added.

[AudioVideoTranscriber.tsx:694](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:694) connects the caption textarea to a visible warning: "Overlap needs review. Repeated words were kept because their timing is uncertain." It uses the existing notice styling and stays within the masked result section. The existing distinction between original recognition evidence and edited completed captions remains intact.

**Why not force three?** The merge input provides only `293-299: Yes. Yes.` and `298-304: Yes. Yes.`, not the judge's source utterance intervals or word alignment. The current text matcher admits both one-token and two-token alignments because each token inherits the same coarse caption interval. Choosing the longest loses later speech; choosing the shortest would merely assume which token is shared. The revised behavior retains both uncertain captions for comparison with the recording. It does not assert that four utterances were spoken. Obtaining exact automatic alignment would need trustworthy finer-grained source evidence or a separately authorized alignment change; ASR changes are outside this assignment.

With an explicitly timed shared cue (`298-299: Yes.`) and a separate later cue (`303-304: Yes.`), the actual mounted flow yields exactly three original utterances with one shared copy, in English and CJK, both directly and after Stop/retry. Existing same-interval, split-boundary, punctuation and separated-repeat tests still pass.

### CJ-TR02-01: Separate SRT And WebVTT Encoding

[browserTranscriber.ts:327](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:327) retains WebVTT entity escaping unchanged and gives SRT its own path. SRT uses literal characters separated by empty neutral font tags so FFmpeg does not display entity spellings, while HTML-decoding readers cannot reinterpret literal user tags/entities. A neutral prefix protects indentation and cue-like text lines. Empty bold tags protect blank lines and trailing whitespace from FFmpeg trimming without adding visible characters.

The exact minimal payload `A & B --> C` imports through FFmpeg as `A & B --> C`, without ASS style cleanup being needed in the original minimal comparator. The original full fixture preserves both cues, literal tags/entities, indentation, blank lines, Arabic/Hebrew and its centisecond-representable times. Extra fixtures cover trailing spaces, comma-style timestamp text inside a caption, literal numeric entities, CJK and nested-looking font markup. The test importer is unchanged; raw `.srt`, `.vtt` and `.ass` artifacts show the actual reader output.

No universal SRT-reader guarantee is inferred. The named independent reader required for this fix is FFmpeg 7.1; native Chromium supplies the separate WebVTT reader regression. TXT remains exact and no export timing logic changed.

## Changed Files

| T File | Change |
| --- | --- |
| `src/lib/browserTranscriber.ts` | Repeated-alignment ambiguity guard, optional review flag, preserve uncertain spans, format-specific SRT literal serialization. |
| `src/components/AudioVideoTranscriber.tsx` | Accessible per-caption ambiguity warning, using existing styling. No worker/lifecycle changes. |
| `src/lib/browserTranscriber.coreFixes.test.ts` | Ten new regression tests: six grouped exact/prefix loss-averse cases, two timed shared-cue controls, same-interval control, and format-specific serialization. |
| `src/lib/browserTranscriber.tr02.test.ts` | Sixteen new mounted flows: twelve grouped exact/prefix direct/retry cases and four explicitly timed shared-cue direct/retry controls. Optional owned screenshots/JSON. Existing tests/assertions unchanged. |
| `src/lib/browserTranscriber.test.ts` | One serialization expectation now requires the literal SRT arrow instead of the erroneous entity spelling. The assertion was corrected to the fixed format, not removed; the WebVTT entity assertion remains. |

No worker types were needed. DSP, workers, ASR options, model/revision pins, deadlines, package/lock, indexability, stylesheets, task contracts, campaign state, boards and worklogs are unchanged. Source changes are additive/scoped on the dirty draft, not a revert or replacement of other work.

## RED And GREEN Evidence

All commands ran from T, with no model/decoder network or owner Chrome interaction. Copies of the exact independent scripts alter only their output/root bindings; their assertions and FFmpeg arguments are unchanged. Source originals are retained as text under `E/originals/`.

```powershell
node output/browser-transcriber-pilot/core-task-fixes/run-independent.mjs red
node output/browser-transcriber-pilot/core-task-fixes/snapshot.mjs before
node output/browser-transcriber-pilot/core-task-fixes/run-focused.mjs red
node output/browser-transcriber-pilot/core-task-fixes/run-independent.mjs green
node output/browser-transcriber-pilot/core-task-fixes/run-focused.mjs green
node output/browser-transcriber-pilot/core-task-fixes/format-regressions.mjs
node output/browser-transcriber-pilot/core-task-fixes/snapshot.mjs after
node output/browser-transcriber-pilot/core-task-fixes/finalize.mjs
```

The exploratory `srt-reader-experiment.mjs` also ran before production edits. Its raw input/output matrix is retained; it is not counted as regression-test approval evidence.

| Evidence | Result |
| --- | --- |
| Exact independent RED, before source changes | **22 named probes: 16 pass, 6 fail**, exit 1. Four overlap count failures and two SRT reader failures. `E/red-independent/` contains scripts, hashes, logs, JSON, subtitle files, real FFmpeg arguments/PIDs/exit status. |
| Added focused RED, 20:45:40 AEST | **125 tests: 106 pass, 19 fail**, six files, exit 1. The six loss-averse helper cases, twelve mounted grouped cases and SRT serialization regression fail before production edits. All other tests pass. No import/harness failure was used as the RED signal. |
| Exact independent post-fix | **22 named probes: 18 pass, 4 fail**, exit 1. Both SRT failures are fixed. The four unchanged exact-three overlap assertions still fail at four retained occurrences, with `overlapNeedsReview:true` and original incoming spans. `E/green-independent/` is a post-fix directory name, not an all-green claim. |
| Focused GREEN, 20:47:17 AEST | **125 pass, 0 fail, 0 skipped/pending, 0 todo**, six files, exit 0; 23.77 seconds. Core 31, DSP 12, lifecycle 15, worker protocol 3, mounted/export file 54, new focused file 10. This is 99 existing plus 26 new tests, not a full suite. |
| Additional real FFmpeg format matrix | **12/12 pass**, six fixture texts through both SRT and VTT. Cue count, literal text including whitespace/RTL and representable times compare exactly. `E/format-regressions/results.json` and raw artifacts. |
| Frozen-file comparison | 506/506 matched before; exactly four allowed existing-file changes afterward; zero unexpected drift. New test file is separately hashed. Built files remain unchanged and are therefore stale relative to these source fixes. |

The focused wrapper invokes installed Vitest with `--configLoader runner --maxWorkers=1 --no-file-parallelism --no-cache`, all six named files, verbose/JSON reporters, a 120-second supervisor bound, and the existing no-network preload inherited by children. No application/test deadline was raised or assertion removed. The complete executable/arguments are in [green-focused-command.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-fixes/green-focused-command.json); [green-focused.log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-fixes/green-focused.log) and [green-focused.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-fixes/green-focused.json) record every named result. Red counterparts remain intact. No filtered/skipped test is counted as passing.

FFmpeg executable: `C:/Users/chamb/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe`. Import uses `-nostdin -threads 1 -protocol_whitelist file,pipe`, owned synthetic input, ASS output, and the original 10-second process bound. No download or dependency addition.

## Mounted Proof

The actual React component and its merge/export code are bundled in memory with esbuild `write:false`. Worker transport and media are synthetic; ASR/model providers and analytics are stubbed. Tests exercise the real UI's inspection, consent, two 300-second/5-second-overlap blocks, errors/Stop, edited checkpoint, retry of block 1 only, completion, editable captions and warning. This is mounted component proof, not real recognition accuracy or a new full Astro build.

The grouped flows preserve source and later text, report the uncertainty, and expose the original `4:58` incoming start. The completed edited caption is not used as recognition evidence. Each flow ends with zero fake workers. Existing unmount/cancellation/fallback/watchdog tests remain unchanged and pass.

Twelve screenshots plus sixteen flow JSON files are under `E/green-ui/`. Visually inspected [mobile CJK checkpoint/prefix](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-fixes/green-ui/unspaced-cjk-retry-prefix.png) and [desktop English exact overlap](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-fixes/green-ui/english-direct-exact.png): both captions, timestamps, warning and export controls are readable with no overlap. The files explicitly distinguish expected source count three, retained ambiguous count four, and `exactAlignmentClaimed:false`. Timed controls separately record count three.

## Final Source Identity

| T File | Final SHA-256 |
| --- | --- |
| `src/lib/browserTranscriber.ts` | `6c64e766a597ac3d9950efdd1cf91f9130832c6578925b2e045dc2a88a788a17` |
| `src/components/AudioVideoTranscriber.tsx` | `d03f2ab8007a9cac2e1f1162a61b15a3d6a5c86d9be4b824bdd7a174afe319c8` |
| `src/lib/browserTranscriber.test.ts` | `bb9c02ca737aa04418336333f4f870cbaf5c3ecf5a90069e2bf487aaf07e7dbd` |
| `src/lib/browserTranscriber.tr02.test.ts` | `3601020d314b8d4bd065a0694fd0a63d38113d1ae6da385f000851e28d2d5f19` |
| `src/lib/browserTranscriber.coreFixes.test.ts` | `57db38ee4bf38ac3725fddbb8f265261f62629684c395e0e67e79edc2de7f6b9` |

Original core/component hashes were `32ec534bf214d8c25ed34a15a87eff0cfbef9ae7510de76837e460b0df066b16` and `2c14ef4979407d4b60e6c19a7fde8fb763eba86fbb58b8bd6918f7c799612257`. Complete before/after inventories, baseline status and original source bytes are retained in E. `final-verification.json` records source/proof/report hashes, scoped diffs and owned-process cleanup.

Final verification exited 0: all five current source/test hashes still match the tested snapshot, the 506-file comparison has zero unexpected changes, all sixteen mounted flows record zero live fake workers, and queries restricted to recorded owned PIDs/direct children return zero processes. The proof index retains all red failures and all four unresolved post-fix exact-count failures. The parent's separately reported R full check (2424 tests) is not used to claim verification of this T source snapshot.

## Limits And Handoff

No build, npm ci/install, full check, full typecheck, commit, push, deployment, indexability change, network inference, user recording, credential or owner browser was used. The parent's closed Chrome experiment was not touched or repeated. Existing 711-test/74-file and built-runtime evidence predates these changes and is not represented as verification of this new snapshot. No media/ASR/model/watchdog contract was narrowed to claim success.

SRT serialization adds supported empty formatting tags, not invisible Unicode characters. Reader comparisons use FFmpeg's actual subtitle import output, not a custom inverse of the serializer. Other SRT readers can differ in markup/whitespace treatment and remain unproven; exact arbitrary-text portability across every SRT reader is not claimed.

Owned Chromium closes in the existing test afterAll hook; native fixture workers are terminated by their owners, and all test/FFmpeg invocations have exited. No server was started. Final cleanup queries only recorded owned PIDs/parent PIDs, not user browser sessions. Short new warning/report text was kept ASCII; no provenance service, mark removal, disclosure removal or external rewrite was used.

**For Erdos:** rejudge the SRT literal fix and the bounded loss-averse behavior independently. The remaining exact-three grouped-caption failures are deliberately visible, not waived or relabeled as passed. This implementation supplies preserved text and an honest review path; it does not claim the unavailable exact alignment or grant TR-01/TR-02 approval.
