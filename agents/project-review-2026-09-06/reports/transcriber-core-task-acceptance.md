# TR-01 And TR-02 Independent Core Acceptance

Date: September 6, 2026. Independent Release Judge. **Neither exact task is locally approved.** These decisions concern the frozen unpublished implementation, not production or the parent runner's current Chrome experiment.

| Task | Decision | Blocking Acceptance Failure |
| --- | --- | --- |
| TR-01 | **NOT APPROVE** | Partial source overlap still permits deletion of a later, separate repeated utterance, including unspaced Chinese. Both exact-duplicate and prefix matching paths reproduce it. |
| TR-02 | **NOT APPROVE** | Exported SRT does not preserve ordinary literal text through the independent FFmpeg 7.1 subtitle importer. WebVTT passes the equivalent import. |

TR-02 is judged separately on its own subtitle failure, not rejected merely because it depends on TR-01. Existing cancellation/watchdog fixes receive credit below. No manifest, task, worklog, application, existing test, runner, dependency or indexability change was made.

## Source And Contract

- Implementation root T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus its preserved dirty/untracked draft. HEAD alone is not the implementation identity.
- Campaign root R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Read both root AGENTS, campaign AGENTS and the exact TR-01/TR-02 contracts in [campaign.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/campaign.json), transcriber assignment/worklog, implementation/judge/fix reports, and runtime/fixture/download reports.
- Inspected the component, core/lifecycle/language/protocol modules, both workers, all five transcriber test files, local test configuration and the read-only freeze comparison script. Followed code-review/TDD evidence discipline; no production fix was attempted.
- Fresh `capture-fixture-proof-source.mjs --download-progress --compare` returned **506 files, HEAD matches, zero drift** before reliance on historical results. Independent before/after inventories likewise match all 506 hashes; the dirty status is unchanged. The snapshots also bind inspected campaign contracts and reports.
- Evidence directory E: [core-task-judge](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge). All judge helpers and generated test evidence are confined here. The only authored R file is this report.

## Findings

### CJ-TR01-01 [P1] Segment Intersection Is Not Proof Of Repeated Speech

Locations: [exact-duplicate deletion](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:284), [boundary-token matching](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:247), [prefix removal](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:289), and the [actual component merge call](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:409).

The exact-duplicate path removes a whole incoming segment when normalized text equals any intersecting completed segment. The prefix path similarly assigns every word the entire segment interval. Neither establishes that each removed word belongs to the actual shared source interval. The fix correctly protects completely separated segment intervals, but not separated utterances grouped into partially overlapping segments.

Minimal synthetic source: three utterances, each saying `Yes.`, at 293-294, 298-299 and 303-304 seconds. Block 0 (0-300) groups the first two into one caption. Block 1 (295-595) groups the last two. These are valid segment spans for that known source:

```js
const completed = [{ start: 293, end: 299, text: 'Yes. Yes.' }];
const incoming = [{ start: 298, end: 304, text: 'Yes. Yes.' }];
mergeTranscriptSegments(completed, incoming);
// Actual: [{ start: 293, end: 299, text: 'Yes. Yes.' }]
// Expected source speech: three occurrences, including the one at 303-304.
```

Only the utterance at 298-299 is duplicate source. The third occurs after the completed block and is silently lost. Adding `Continue.` to the incoming segment avoids the exact-text branch but still loses that third `Yes.` through prefix stripping; actual appended text is only `Continue.`. Unspaced Chinese using `\u662f\u7684\u3002` repeated twice per segment also returns two occurrences instead of three.

- Evidence: four failing named probes across [independent-probes.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/independent-probes.json) and [minimal-reproducers.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/minimal-reproducers.json). Same-timed duplicates collapse correctly; completely separated English/Chinese/Japanese/Korean repetitions remain. Those positive controls pass.
- Confidence/consequence: high for this deterministic merge defect. The actual component directly consumes this merge result and appends only its new tail, so no later recovery restores the deleted occurrence. This is a synthetic known-transcript counterexample with source-reviewed UI integration, not measured real-ASR accuracy or a freshly mounted UI run.
- Required task: retain/use enough source-overlap and alignment evidence to distinguish duplicate tokens from the later repeated utterance. Do not infer full textual duplication from any positive segment intersection. Ambiguous alignment must not silently discard unproven speech.
- Acceptance: run these exact grouped-caption cases through the actual component's two-block result flow, including exact and prefix variants, unspaced CJK, and a retry checkpoint. Verify three original source utterances, one copy of the shared utterance, preserved later text, and defensible timing. Keep the existing split-boundary and separated-repeat tests green. A same-interval helper positive alone cannot close this gap.

### CJ-TR02-01 [P2] SRT HTML Escaping Fails An Independent Reader

Locations: [shared caption escaping](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:316), [SRT serialization](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:335), and the [existing SRT test's HTML decoder](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:414).

The exporter applies WebVTT-style HTML entity escaping to SRT too. The existing test-side SRT importer explicitly passes caption markup through `DOMParser(..., 'text/html')`; it therefore assumes the HTML decoding behavior that makes this exporter pass. It is not evidence that a real SRT import path supplies those semantics.

Fresh independent FFmpeg 7.1 import, using only owned synthetic subtitle files, reproduces:

| Item | Text |
| --- | --- |
| Editable caption | `A & B --> C` |
| Exported SRT payload | `A &amp; B --&gt; C` |
| FFmpeg SubRip decoder's ASS dialogue text | `A &amp; B --&gt; C` |
| Equivalent WebVTT import | `A & B --> C` |
| Raw-SRT positive control import | `A & B --> C` |

The minimal case contains no blank lines, cue-like text, styling, Unicode or ASS control sequences. This isolates literal-text corruption from the larger fixture and from the judge's ASS text extraction. The full SRT fixture also leaves literal tags/entities encoded and loses indentation; its blank lines and Arabic/Hebrew survive. The equivalent full WebVTT import preserves both cues, exact text/blank lines/RTL and centisecond-representable times. TXT is exact too.

- Evidence: two failing SRT probes, with passing WebVTT/raw-SRT controls, retained in the two JSON probe reports. Raw `.srt`, `.vtt` and FFmpeg `.ass` outputs plus executable/arguments/PID/exit status are all in E. FFmpeg commands exit 0; the text-equality assertions correctly exit 1. No screenshot or inferred player rendering substitutes for decoded subtitle text.
- Confidence/consequence: high for FFmpeg 7.1's actual SubRip import. Captions intended as ordinary ampersands/arrows become entity spellings in this real import path. This is an SRT interoperability failure, not a claim that every SRT reader fails or that SRT has universal HTML semantics.
- Required task: establish and verify format-specific SRT literal/blank-line behavior with a named real independent import implementation. Keep WebVTT escaping and its passing literal-text behavior. Do not restore lossy arrow replacement or make the test decoder repair the result to obtain a pass.
- Acceptance: these minimal/full exported fixtures round-trip through the supported independent SRT reader with cue count, literal text, blanks and RTL intact, plus a real WebVTT importer positive. If support is intentionally restricted to HTML-decoding SRT readers, that requires an explicit narrowed product/task contract and honest limitations; the present unqualified acceptance is not satisfied by the bespoke HTML decoder alone.

## Acceptance Evidence

| Contract Area | Judge Assessment |
| --- | --- |
| TR-01 separated repetitions, punctuation and CJK | Existing cases and new fully separated controls pass, but the grouped partial-overlap counterexamples above fail. |
| TR-01 fractional phase/packetization | Fresh actual helper and fake-decoder/actual-media-worker tests pass at 44.1/48 kHz, mono/stereo, fractional block clipping, quantized timestamps, gaps, overlaps, rate changes and tails. Independent whole/split PCM outputs agree exactly and agree with an absolute-grid interpolation oracle within `2.98e-8` amplitude. |
| TR-01 hour markers | Fresh synthetic 60-minute tests cover 13 blocks and 26 markers per source rate. Maximum marker errors: 0.36281179200159386 samples at 44.1 kHz; 0.33333333340124227 at 48 kHz. Block-length error is 0. These are PCM timing results, not ASR alignment or a real-hour browser run. |
| TR-01 null ends | Fresh tests execute the actual ASR handler with synthetic model results. Null/invalid ends use a later valid start or block end. Independent final-block probe produces 3545.125-3598 and 3598-3600, with no out-of-block or 1 ms manufactured end. This does not measure recognition alignment. |
| TR-02 cancel/stale/fallback ownership | Supported by current source and matched prior whole-component tests: Stop/Reset/replacement/unmount across download/decode/inference/fallback, same-turn reset/error races, source-evidence retry, worker-originated control errors, and ordinary GPU failure retrying once. The 38-case Chromium-mounted file was deliberately NOT rerun. Fresh 15-case waiter and 3-case actual-worker protocol suites pass; six independent actual-ASR-handler-to-waiter cases pass. Those helper/protocol results alone are not whole-UI ownership proof. |
| TR-02 subtitle round trips | Fresh independent WebVTT/TXT checks pass. Fresh independent SRT import fails as detailed above. Prior native Chromium VTT and bespoke SRT test evidence is preserved, not relabeled as a universal pass. |
| TR-02 watchdog UI recovery/partial blocks | The matched prior mounted tests at lines 238, 249 and 280 of `browserTranscriber.tr02.test.ts` exercise actual React controls with a fake browser clock: exit busy, terminate workers, expose retry, retain/edit completed text, retry only the failed block and complete. Fresh helper tests measure 120,000 ms load idle, 300,000 ms inference idle and 600,000/1,200,000 ms absolute caps. No newly observed watchdog defect; no fresh mounted execution or healthy-device calibration is claimed. |

The prior [judge-fix report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-judge-fixes.md) records 99 passing focused cases after the earlier fixes, including 38 mounted cases. The [download follow-up](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-download-fixture-followup.md) and its current log record **711 passing tests in 74 files**. All relevant source/test hashes match the frozen snapshot. Those are verified retained results, not a fresh full-suite run by this judge, and neither catches these counterexamples.

## Fresh Commands And Counts

All commands below ran from T. Helpers are `.mjs`, outside the existing test globs. No TypeScript source was created under output, and no application build or dependency installation ran.

```powershell
node output/browser-transcriber-pilot/capture-fixture-proof-source.mjs --download-progress --compare
node output/browser-transcriber-pilot/core-task-judge/judge-run.mjs snapshot before
node output/browser-transcriber-pilot/core-task-judge/judge-run.mjs tests
node output/browser-transcriber-pilot/core-task-judge/independent-probes.mjs
node output/browser-transcriber-pilot/core-task-judge/minimal-reproducers.mjs
node output/browser-transcriber-pilot/core-task-judge/judge-run.mjs snapshot after
```

| Fresh Check | Result |
| --- | --- |
| Freeze comparisons | 506/506 match, identical HEAD, no source/built drift; dirty status unchanged. |
| Frozen focused Vitest, 20:23:04 +10:00 | **61 passed, 0 failed, 0 skipped, 4 files**, 2.90 s; exit 0. Files: core 31, DSP 12, lifecycle 15, protocol 3. |
| Independent probes, 20:26:52 +10:00 | **14 passed, 3 failed, 17 named probes**; exit 1. |
| Minimal reproducers, 20:28:22 +10:00 | **2 passed, 3 failed, 5 named probes**; exit 1. |
| Independent probe total | **16 passed, 6 failed, 22 named probes**. Six failing assertions reproduce two distinct task defects; they are not six different defects. |

The focused wrapper records its full invocation in [focused-tests-command.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/focused-tests-command.json) and full named output in [focused-tests.log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/focused-tests.log). It uses the installed Vitest 4.1.10/Node v24.20.0, `--maxWorkers=1 --no-file-parallelism --no-cache --configLoader runner`, a 120-second supervisor bound, and a no-network preload propagated to its child. Only the four inspected browser-free files are selected.

Independent worker probes strip types and execute the actual ASR handler body with synthetic dependencies in a bounded VM; they do not run a model or claim mounted UI coverage. FFmpeg 7.1 is the already-installed `C:/Users/chamb/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe`. Each subtitle invocation has `-nostdin -threads 1 -protocol_whitelist file,pipe`, local synthetic input and a 10-second process bound. Its version and exact five import commands are retained. The obsolete FFmpeg on PATH was version-inspected only and was not used as the acceptance reader.

The owned processes and children had all exited at the 20:29:53 +10:00 cleanup check. Queried only owned PIDs/parent PIDs: 28880, 35508, 32992, 12064, 4612, 11960, 35256, 22372; **no remaining processes**. No kill or interaction with the parent's runner was necessary.

## Frozen Source Hashes

Full 506-file SHA-256 inventories, contract/report hashes and prior full-suite log text/hash are retained in [source-before.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/source-before.json) and [source-after.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/core-task-judge/source-after.json). Principal T identities:

| File | SHA-256 |
| --- | --- |
| src/components/AudioVideoTranscriber.tsx | 2c14ef4979407d4b60e6c19a7fde8fb763eba86fbb58b8bd6918f7c799612257 |
| src/lib/browserTranscriber.ts | 32ec534bf214d8c25ed34a15a87eff0cfbef9ae7510de76837e460b0df066b16 |
| src/lib/browserTranscriberLifecycle.ts | 214865c82f7ea374cb5c404a881c3dbb00bf2b8b0d46fc561aaa31fb54695851 |
| src/lib/browserTranscriberWorkerTypes.ts | 217719bdc453c039b901652b74108a20131b801e70d1415d9b20c588fcd521fb |
| src/workers/transcriber-asr.worker.ts | 613a21d90e64101004c1f7a233e91b747ef5ff3e0b242361b4d1ed1162007167 |
| src/workers/transcriber-media.worker.ts | 8b5fd689cbb1ff06fcf63fd14825ce921febccb350542104d16539e3a0b46c28 |
| src/lib/browserTranscriber.test.ts | a32b2a24ebab6db8954c3a8106ce5701240c8a4dcd57785c6cb44977df1533ad |
| src/lib/browserTranscriber.dsp.test.ts | 09022ae65c04ab957e64e850a8fe65e22af999491f244ba6a116edaa3916ebb7 |
| src/lib/browserTranscriber.tr02.test.ts | f514bb5b28a14e5cfdda87baf0d0b2507c9fb704380b5db1d612ae7451771052 |
| src/lib/browserTranscriberLifecycle.tr02.test.ts | 2138ce62257f56ad85c1aac216ecd87322c3bfa7cbe81ecdf7851858e92fc8ae |
| src/lib/browserTranscriberProtocol.tr02.test.ts | c3381c40585ff45f8d035f7a6803dad803dc92598263e50535e597c4f6476a0b |

## Explicit Exclusions

TR-03, production/privacy/telemetry proof, real-hour ASR/browser/device/codec/language coverage, native memory, beta days, indexability and deployment are **not part of these decisions**. Linear-resampler aliasing and healthy-device watchdog calibration remain documented limitations, not invented failures of this local timing contract. No browser, inference, network request, account tab, user media, paid call, provider, credential, public action, shared build/install or parent artifact was used or modified. Existing runtime/download failures and earlier red logs remain untouched. No provenance service or cleaning was invoked for this private report; required disclosures were preserved.

Next acceptance action is limited to the two reproduced gaps and whole-behavior regressions above under separately assigned implementation ownership. This judge leaves the app and existing tests frozen and does not change campaign statuses.
