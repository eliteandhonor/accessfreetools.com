# Independent TR-01/TR-02 Implementation Judge

Reviewed 2026-09-06, 13:36 +10:00. **Request changes to TR-02 for two reproduced code defects. TR-01 synthetic contracts are supported; neither task nor release receives blanket approval.** The coordinator's obsolete-arrow assertion is resolved, not a remaining blocker.

## Remaining Code Bugs

### IJ-TR-01 [P2] Retry reintroduces corrected or deleted boundary speech

- Location: [resume state](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:325) and [merge input](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:405). Retry uses editable `segments` as its only previous-block deduplication evidence. The checkpoint stores no original recognition text. Editing the overlap therefore changes the evidence used to identify the same source speech.
- Reproduced in the actual React component with synthetic workers: block 0 ends with `{start:295,end:300,text:'We approved fifty.'}`; block 1 fails. Correct Caption 1 to `We approved fifteen.`, retry, then return the original overlap plus `{start:300,end:305,text:'Continue here.'}`. Actual captions are `['We approved fifteen.', 'We approved fifty.', 'Continue here.']`; expected are `['We approved fifteen.', 'Continue here.']`. Deleting Caption 1 also resurrects `We approved fifty.`. With unedited source evidence, the actual merge helper correctly removes that overlap.
- Consequence/confidence: high-confidence duplicate source speech and resurrection of a corrected number during an ordinary recovery workflow. Existing retry coverage edits a 0-2-second caption, outside the 295-300-second overlap, so it misses this interaction.
- Minimal task/acceptance: retain unedited recognition evidence for boundary matching separately from editable output, bound to the same operation/checkpoint. Add actual-component failure/Stop -> edit/delete final overlap caption -> retry tests. Corrected text and whitespace must remain exact, deleted text must not return, repeated overlap must appear once, and genuinely later repeated speech must remain.

### IJ-TR-02 [P2] ASR-worker AbortError loses its type and triggers fallback

- Location: [ASR error serialization](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:142), [reply rejection](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.ts:88), and [fallback classification](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:340). The worker sends only a sanitized message/stage; the receiver constructs plain `Error`. `isTranscriberControlError` consequently cannot recognize a worker-originated AbortError.
- Reproduced by executing the actual ASR worker handler with a fake pipeline that throws `new DOMException('Synthetic worker load aborted', 'AbortError')`. Its emitted event contains no error name. Feeding that real event into the actual component's live WebGPU load creates ASR backends `['webgpu','wasm']` instead of settling without fallback. No model ran or downloaded.
- Consequence/confidence: high-confidence protocol/control-classification defect for worker-originated aborts. This is **not** a recurrence of the verified Stop/Reset/replacement/unmount race, and does not establish how often a real model raises this error.
- Minimal task/acceptance: serialize a narrowly allowed control-error kind/name while retaining sanitized messages; reconstruct that control outcome in the waiter. Inject worker-originated AbortError during load and inference, asserting settlement, disposal, no backend switch and no replacement worker. Keep ordinary GPU failure's exactly-one WASM retry green. Apply the same contract to TimeoutError if transported.

## Verified Implementation Evidence

- Fresh independent command in T at 13:33:14: **5 files, 86 tests passed**, none skipped, 9.22 s; Vitest 4.1.10, Node v24.20.0, installed Chromium 151.0.7922.34. Cache disabled and config runner used; no dependency installation or site build.

```powershell
node node_modules/vitest/vitest.mjs run src/lib/browserTranscriber.test.ts src/lib/browserTranscriber.dsp.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts --reporter=dot --no-cache --configLoader runner
```

- Operation identity and abort checks protect creation/post/await continuations; old cleanup cannot dispose a replacement operation. The synthetic cancellation matrix, same-turn resolved-result/reset and GPU-error/Stop races, terminal disposal and one ordinary GPU-to-WASM retry passed. Request IDs survive actual worker handlers and late callbacks; stale IDs/stages/blocks are rejected. Workers/model/decoder are synthetic, not real built-worker/model integration proof.
- Watchdog fake-clock tests passed: load idle/absolute limits 120/600 seconds, inference 300/1,200 seconds; repeated progress cannot extend idle and advancing progress cannot defeat the absolute deadline. Completed edits outside the overlap survive timeout/retry. These are policy-limit measurements, not measured healthy-device throughput; current inference has no progress callback.
- DSP/dedupe/timestamp tests passed: separated repeated words, CJK, differently split overlap, null/invalid ends, packet phase, timestamp quantization, gaps/overlaps/tails and actual media-worker synthetic PCM. Both synthetic-hour fixtures cover 13 blocks/26 markers: maximum errors 0.3628117920 samples at 44.1 kHz and 0.3333333334 at 48 kHz; block-length error 0. Not real-hour decoder or ASR alignment evidence.
- TXT preservation and independent SRT import passed. Native Chromium Blob-backed WebVTT text-track import preserved exact fixture times and literal tags/entities/arrows, blank lines and RTL, without extra cues. This is genuine native VTT parsing, not an exporter self-comparison. The test-side SRT importer does not establish all third-party players' behavior.
- Additional read-only `node --input-type=module -e` probes produced the exact findings above; payloads remain in this task's tool history. They used in-memory esbuild bundles (`write:false`), the actual component/ASR handler, fake worker/model transport and blocked page requests. Exit 0 means both adverse behaviors were successfully reproduced; it is not a pass for their intended behavior. Browser page errors: 0.

## Source Identity And Preservation

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5`; its own node_modules is not a symlink. HEAD alone does not identify the unpublished draft.
- Read both AGENTS files; campaign TR-01/TR-02/TR-03 acceptance; transcriber AGENT/tasks/reference; the TR-01 implementation worklog and TR-02 worklog/report; historical browser-products findings; component/helper/lifecycle/types/both workers/all five focused tests; local test config and model/indexation declarations.
- All 40 file hashes in the [implementation handoff](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-lifecycle-implementation.md) were checked. The only difference is the coordinator-owned legacy test, now SHA-256 `a32b2a24ebab6db8954c3a8106ce5701240c8a4dcd57785c6cb44977df1533ad`. Reversing only its SRT arrow expectation and added escaped-VTT-arrow assertion **in memory** reproduces the previous `0ccfb093a0df4ea19444c7bfdeaf2bc359188438d97fb0a894726b0f1bf6959a` hash. TXT and timestamp assertions remain intact.
- Before/after judge inventories match: all 40 dirty/untracked draft files retained identical SHA-256 values. No T source edits, Git writes, task-state/worklog edits or main-promotion-checkout changes. This report is the only authored artifact, under R.
- Model pins remain `aeaa13760958b03fac5062f457d317d3319c3168` / `517244293732ee2d58139af5814231b7e6830a0d`. Tool and guide remain `index:false`, `includeInXmlSitemap:false` in indexationPolicy.ts:55/:62; that file's handoff hash is unchanged.

## Known Proof Gates, Not Newly Measured Failures

- TR-03/SEC-01 remain unperformed here: actual Chrome/Edge 60-minute MP3/MP4 jobs; Firefox/WebKit 10-15-minute checks; real WASM/WebGPU cold/warm operation, languages/codecs/tracks/limits; elapsed time, peak/recovered memory and real worker cleanup; mutation-sensitive GET/query/body/beacon/worker/telemetry/storage privacy proof. Synthetic request blocking is not confidentiality proof. No physical-device claims.
- The resampler remains linear, not band-limited. Anti-aliasing alternatives/recognition-quality evaluation and watchdog calibration remain explicit follow-ups, not failed synthetic timing tests or proven ASR-quality outcomes.
- No install, full suite/check, site build, model/provider call, privacy upload, server, browser pilot, deployment, live-site inspection or public action was performed. No provenance service/cleanup was used for this private report; disclosures remain untouched. Seven stable beta days and separately authorized indexability release remain independent gates. Campaign statuses are unchanged.
