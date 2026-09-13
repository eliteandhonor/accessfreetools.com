# TR-01 And TR-02 Frozen Source Rejudge

September 6, 2026. Independent Release Judge. Execution and source-preservation checks are complete. **Dependency/install lock released at 21:13:10 AEST (11:13:10 UTC).** No further judge execution against T or its dependencies is planned for this review.

| Exact Task | Independent Decision | Reason |
| --- | --- | --- |
| TR-01 | **NOT APPROVE** | The loss-averse change improves the reproduced deletion, but four unchanged exact-three probes still return four retained, flagged occurrences. Exact source-overlap reconstruction remains unproven. |
| TR-02 | **NOT APPROVE** | The original SRT literal failures are fixed, and cancellation/watchdog regressions pass. A newly confirmed source-line-width case still corrupts an actual UI SRT download through the same FFmpeg 7.1 reader. |

Neither decision waives or narrows the campaign contract. TR-02 is judged on its own remaining literal-preservation failure, not merely its dependency on TR-01. No task approval, source fix or dependency change was recorded by this judge.

## Frozen Identity

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus the preserved unpublished draft.
- R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. This report is the only R write. All new helpers, supplemental tests and evidence are in [core-task-rejudge](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge), referred to below as E.
- Read the current [implementation handoff](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-core-task-fixes.md), [original independent decision](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-core-task-acceptance.md), root/campaign instructions and exact current [task contracts](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/campaign.json). Reviewed the five changed files, scoped diffs, unchanged lifecycle/workers and independent readers.
- All five declared hashes match. The 438 source/config entries match the previous source baseline plus exactly four declared replacements and one new test. Before/after source drift is zero; all dirty-file hashes and status are unchanged. The original judge evidence tree is byte-identical before/after.
- Historical built artifacts are not this source freeze: one old component bundle is absent and the old built tool HTML differs. These two differences are recorded separately from source. The initial snapshot diagnostic is preserved; no build repair was attempted. Parent subsequently reported its T build/full-check run. No blanket unchanged-506 or independently verified current-build claim is made here.

| Frozen T File | SHA-256 |
| --- | --- |
| src/lib/browserTranscriber.ts | 6c64e766a597ac3d9950efdd1cf91f9130832c6578925b2e045dc2a88a788a17 |
| src/components/AudioVideoTranscriber.tsx | d03f2ab8007a9cac2e1f1162a61b15a3d6a5c86d9be4b824bdd7a174afe319c8 |
| src/lib/browserTranscriber.test.ts | bb9c02ca737aa04418336333f4f870cbaf5c3ecf5a90069e2bf487aaf07e7dbd |
| src/lib/browserTranscriber.tr02.test.ts | 3601020d314b8d4bd065a0694fd0a63d38113d1ae6da385f000851e28d2d5f19 |
| src/lib/browserTranscriber.coreFixes.test.ts | 57db38ee4bf38ac3725fddbb8f265261f62629684c395e0e67e79edc2de7f6b9 |

Complete identities, including package/lock and unchanged workers/lifecycle modules, are in [before.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/before.json) and [after.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/after.json). Subsequent parent dependency work is outside this frozen decision and requires its own verification.

## TR-01: Improvement, Not Exact Acceptance

The guard at [browserTranscriber.ts:254](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:254) detects a second text alignment and preserves ambiguous incoming text/span, setting `overlapNeedsReview`. The [component warning](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:694) is visible and connected to the textarea through `aria-describedby`. It does not fabricate word timestamps or silently substitute user-edited text as recognition evidence.

Fresh mounted direct/retry cases preserve English and spaced/unspaced Chinese captions, original incoming timing, edited completed text and the warning, with zero remaining fixture workers. The [fresh mobile CJK retry screenshot](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted/unspaced-cjk-retry-prefix.png) was visually inspected: the two captions, timestamps, warning and export controls are readable. Explicitly timed shared-cue controls produce exactly three utterances.

The original grouped counterexample remains unresolved:

```js
completed = [{ start: 293, end: 299, text: 'Yes. Yes.' }];
incoming = [{ start: 298, end: 304, text: 'Yes. Yes.' }];
// Known synthetic source: Yes at 293-294, 298-299 and 303-304.
// Current result: both captions retained; incoming.overlapNeedsReview === true.
// Four retained occurrences, not the required three with one shared copy.
```

This is preferable to the prior silent deletion, but not evidence of exact reconstruction. Coarse segment spans do not establish which repeated word is shared. Choosing a shortest/longest text match or treating a warning as completion would waive the remaining contract. The original four English/CJK exact/prefix assertions are unchanged and still fail; their original red results remain untouched. Current results are in [independent-probes.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/independent-probes.json) and [minimal-reproducers.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/minimal-reproducers.json).

Authorization clarification: the coordinator instructed the bounded loss-averse implementation. **The owner did not narrow TR-01 or authorize approximate reconstruction as task acceptance.** The handoff as read now correctly says this; any earlier wording that the user explicitly permitted a contract change must not be relied upon.

Fresh DSP, packetization/gaps/tails, bounded null-end and synthetic-hour marker tests remain passing. Marker error is 0.36281179200159386 samples at 44.1 kHz and 0.33333333340124227 at 48 kHz, across 13 blocks/26 markers per rate, with zero block-length error. These remain PCM measurements, separate from ASR alignment. They do not close the text-alignment gap.

**Required acceptance:** retain the exact grouped-source assertions and exercise trustworthy alignment through the actual two-block/retry flow. If exact reconstruction is not provable from available evidence, keep this task unapproved. No additional ASR/model requirement or owner waiver is invented by this report.

## TR-02: New Bounded SRT Failure

### CR-TR02-02 [P2] Encoding Expansion Breaks Literal Text At The Reader's Line Boundary

Locations: [neutral-tag expansion](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:334), [SRT output](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:354), and [editable caption field](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:689).

The new SRT path prefixes every physical line with `<font></font>` and appends another such tag after each `<` or `&`. For a nonblank line without trailing whitespace, encoded width is `input width + 13 + 13 * count(< or &)`. There is no caption content-length/encoded-width guard at the textarea or serializer; the filename limit does not bound caption text.

**Whole-behavior reproducer:** use the actual mounted component with synthetic workers, complete one caption, edit Caption 1 to `'&'.repeat(292)`, and click the actual SRT download button. Feed that downloaded file to the unchanged FFmpeg 7.1 import command. No exporter helper is substituted for the UI download in this check.

| Actual UI Case | SRT Physical Line | Imported Text | Outcome |
| --- | ---: | --- | --- |
| 291 literal ampersands | 4,087 characters | Exactly 291 ampersands | PASS |
| 292 literal ampersands | 4,101 characters | 292 ampersands followed by `<`, LF, `/font>`; 300 characters total | FAIL |

Both cases return one cue, FFmpeg exit 0, exact input text still present in the UI, and zero live fixture workers. The raw ASS dialogue contains `<\N/font>` after the expected text. The extra fragment is present in the independent reader's output before judge comparison, not created by a repair parser. This demonstrates the generated tag splitting across the reader's observed roughly-4-KiB line handling boundary. It does not assert a universal SRT line limit.

Evidence: [mounted-width-292.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted-width-292.json), [actual SRT download](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted-width-292.srt), [raw FFmpeg ASS output](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted-width-292.ass), [291-character control](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted-width-291.json), and [final mounted test log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/mounted-width.log).

Independent width probes also fail for 512-8,192 repeated `<` or `&` characters and for 4,096/8,192 ordinary ASCII characters in SRT. Matching WebVTT probes pass. Inputs were bounded synthetic text, at most 8 KiB before encoding, not large allocations or user media. The 292-character UI reproducer alone establishes the blocker; the broader sweep is supporting evidence, not an expanded release matrix.

- Confidence: high, fresh actual download plus independent native subtitle decoder and adjacent passing control.
- Consequence: accepted caption text gains visible tag fragments/newlines during import through the very same named reader used to accept the original fix.
- Required acceptance: account for encoded source width and demonstrate exact text/cue preservation for these accepted inputs with unchanged reader semantics, through the actual export path. Do not silently truncate, reflow, split cues or change the comparator to pass. A smaller supported-input cap or other contract narrowing is not approved here. If exact preservation across the accepted input range is unprovable, retain the explicit gap for the owner.
- Scope: this uses FFmpeg 7.1 already selected for the task. It introduces neither another reader requirement nor a universal-reader portability claim.

### What Is Fixed Or Verified

The two original SRT failures now pass with byte-identical copies of the original independent scripts and unchanged FFmpeg arguments/comparators. Twelve implementation format checks also pass. New short semantic probes preserve nested-looking user tags, comments/doctype-like text, literal neutral tags, numeric/named entities, blank lines/indentation, Arabic/Hebrew direction text, emoji and CJK. WebVTT escaping and TXT remain intact. Neutral tags therefore solve the original short-fixture problem, but are not a general literal-preservation proof at longer encoded widths.

Fresh whole-component tests pass Stop/Reset/replacement/unmount during load/decode/inference/fallback, stale result and same-turn races, exactly-one ordinary GPU-to-WASM fallback, worker-originated AbortError/TimeoutError, retry checkpoints, and watchdog UI recovery retaining completed/edited blocks. Workers/models are synthetic; actual component/worker-handler code and native Blob-backed worker transport are exercised where the existing fixtures specify them. No new cancellation/stale/watchdog defect was found. Helper timeout assertions are not being substituted for the mounted UI recovery tests.

## Executed Evidence

All executions were bounded, sequential at the command level, with `maxWorkers=1`, no shared build/install/full check, no inference and no user Chrome. Mounted tests used a separate headless Chromium 151.0.7922.34 and blocked page requests. Node was v24.20.0 and Vitest 4.1.10.

| Check | Fresh Result |
| --- | --- |
| Six frozen focused files, 21:04:20 AEST | **125 passed, 0 failed/skipped**, 24.01 s. Core 31, DSP 12, lifecycle 15, worker protocol 3, mounted/export 54, core fixes 10. |
| Original independent scripts, byte-identical copies in E | **22 named probes: 18 passed, 4 failed**. All four failures are the retained exact-three TR-01 contract. |
| Unchanged implementation FFmpeg matrix | **12/12 passed**. |
| Independent semantic/encoded-width sweep | **48 probes: 36 passed, 12 failed**. All 24 WebVTT cases pass; 12 SRT width cases fail. |
| Final supplemental actual mounted export | **2 tests: 1 passed, 1 failed**, 1.80 s at 21:11:19 AEST. 291-character control passes; 292-character exact-text assertion fails. |
| Source preservation and cleanup | Five declared hashes match; no source/dirty-file drift; original judge artifacts unchanged; zero remaining owned processes at lock release. |

Commands, from T:

```powershell
node output/browser-transcriber-pilot/core-task-rejudge/rejudge.mjs before
node output/browser-transcriber-pilot/core-task-rejudge/rejudge.mjs focused
node output/browser-transcriber-pilot/core-task-rejudge/rejudge.mjs originals
node output/browser-transcriber-pilot/core-task-rejudge/rejudge.mjs format-regressions
node output/browser-transcriber-pilot/core-task-rejudge/reader-edges.mjs
node output/browser-transcriber-pilot/core-task-rejudge/mounted-width.mjs comparator-recovery
node output/browser-transcriber-pilot/core-task-rejudge/rejudge.mjs after
node output/browser-transcriber-pilot/core-task-rejudge/cleanup.mjs
```

Exact test invocations, JSON/verbose results, input/output fixtures and child PIDs are retained in E. The supplemental `.mjs` test reuses only frozen mount/transport helpers and hooks; it adds two judge-owned assertions without editing existing tests. The original independent scripts and the implementation format matrix were copied byte-for-byte into E, so their output location changes naturally while assertions/readers do not.

Harness diagnostics remain separately retained: the first snapshot tried an absent historical build artifact; the first supplemental test invocation had a generated Windows-path escaping error; the next had a comparator-escaping diagnostic. Those are **not product acceptance evidence**. The final supplemental run uses the original independent ASS comparator semantics and reproduces the same native-output defect. `snapshot-diagnostic.json`, `path-error-*` and `comparator-error-*` preserve these attempts; no original failure was overwritten.

## Cleanup And Boundaries

[cleanup.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-rejudge/cleanup.json) records the 21:13:10 AEST check of 80 recorded owned PIDs/direct-parent IDs, with zero remaining processes. Existing and supplemental fixture cleanup awaited page/browser close. No user browser or parent process was targeted or killed. **The dependency/install lock is released; report writing does not hold it.**

The parent-reported R 2,424-test run is not T proof. The parent's later T full check reportedly passed both typechecks, tests, build and checks through secrets, then failed its existing fast-uri 4.1.2 / qs 6.15.3 audit findings. This judge did not rerun or independently validate that full check; it neither overrides these exact task failures nor approves the planned dependency changes.

TR-03, privacy/telemetry, real ASR/hour/device/browser compatibility, memory, beta, indexing and deployment remain excluded. The parent's 600-second actual Chrome failure supplies no model/deadline waiver. No provider, paid call, credential, user recording, source/test edit, task-state edit, package/lock write, installation, shared build or public action occurred in this rejudge. No provenance cleaning or required-disclosure removal was performed.

The next source decision remains with the owner/coordinator: retain the explicit TR-01 exact-alignment gap and address the confirmed TR-02 accepted-input/source-width gap without weakening either contract. These findings are now handed off; the judge remains independent.
