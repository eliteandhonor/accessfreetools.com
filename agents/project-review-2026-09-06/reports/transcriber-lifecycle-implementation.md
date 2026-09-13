# TR-02 Transcriber Lifecycle Implementation

Recorded: 2026-09-06 13:24 +10:00 (Australia/Brisbane).
Disposition: source implementation and focused evidence ready for independent review; NOT approved, integrated, deployed, or a TR-03/beta completion claim. No campaign status or global files were edited.

## Source And Scope

- T = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
- R = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06`.
- T branch: `codex/browser-transcriber-pilot`; HEAD unchanged at `90d6dcab0580a91ca66382f2414d95e8817469e5`. The intentional dirty/untracked draft is identified by the content hashes below, NOT by HEAD alone.
- Read T/AGENTS.md, R/AGENTS.md, campaign.json TR-02 conditions, transcriber task definitions/AGENT.md/reference.md/latest worklog, and reports/browser-products.md. Read the component, helpers/types, both workers, focused TR-01 tests, Vitest/package settings, local Mediabunny subtitle source and brand code. Consulted TDD, incremental implementation, Git workflow, code review, Playwright and provenance-hygiene skills. The quick memory search found no relevant transcriber entry.
- Continued the latest TR-01 source, not the historical browser-products report's old hashes. Did not access or mutate the main promotion checkout.
- All commands used T's own existing Node v24.20.0 and node_modules. Get-Item confirmed node_modules has no LinkType or Target (not a junction/symlink). Vitest 4.1.10, TypeScript 6.0.3 and the already-installed Playwright Chromium 151.0.7922.34 were used. No installation or dependency edit.
- Five pre-existing draft files changed: the owned component, export helper region, and the minimal request-ID protocol in the types/two workers. Four new files: one narrow lifecycle helper and three TR-02 test files. Only this new report and an append to R/agents/transcriber/worklog.md were written in R.

## Confirmed Findings And Changes

Confidence: high for the synthetic operation/serialization contracts below; real-device model speed, ASR quality and production privacy remain unproven.

| Finding And Consequence | Source Change | Acceptance Evidence |
| --- | --- | --- |
| Abort during WebGPU load/inference spawned a new fallback worker after Stop, Reset, replacement or unmount. | T/src/components/AudioVideoTranscriber.tsx:194, :284, :292, :340: operation identity plus AbortSignal before creation/post/retry and after awaits; AbortError/TimeoutError are control outcomes, not GPU fallback triggers. Non-abort GPU error permits one WASM transition per operation, including a GPU recycle failure. | T/src/lib/browserTranscriber.tr02.test.ts:128: four cancellation phases by four actions, 16 cases. Same-turn GPU error/Stop at :210. Non-abort inference failure retries once, then WASM error settles at :255. |
| Already-resolved promises could publish stale results after Reset; invalid replacement did not stop the existing operation. | T/src/components/AudioVideoTranscriber.tsx:207, :403, :420: replacement invalidates first; state writes after awaits are identity guarded. Cleanup is conditional on ownership, so an old finally cannot terminate a new job. Unmount/Stop/Reset synchronously abort and terminate both refs. Inspection, completion and failure also dispose workers. | Actual React tests at :159, :170, :176; delayed old worker progress/error/result cannot change state or worker counts. |
| Listener cleanup alone could not distinguish delayed replies from a prior request on a reused worker. | T/src/lib/browserTranscriberLifecycle.ts:42, :86 and T/src/lib/browserTranscriberWorkerTypes.ts:23: unique request IDs plus expected type/stage/block. Both worker handlers capture a per-request reply closure (media :146, ASR :128); late model callbacks keep the original ID. IDs remain optional for existing direct-worker fixtures, but the UI sends and requires matching IDs. Cancellation uses termination, not a cooperative cancel command that inference could ignore. | T/src/lib/browserTranscriberLifecycle.tr02.test.ts:39; actual worker tests in T/src/lib/browserTranscriberProtocol.tr02.test.ts:54, :65, :73 use fake model/decoder imports and verify progress/result/error IDs and unchanged synthetic PCM. |
| Loading/inference could wait indefinitely; completed output was cleared on retry. | T/src/lib/browserTranscriberLifecycle.ts:12, :62: monotonic idle and absolute deadlines, exactly-once settlement, abort/error/messageerror/post-failure cleanup. T/src/components/AudioVideoTranscriber.tsx:327, :405, :650: file/track/language-bound next-block checkpoint; retry retains completed edited text, including whitespace, and begins at the failed block. No persistence or server APIs. | Unit fake-clock measurements at lifecycle test :52, :74, :98. Actual React model/inference timeout tests at browser test :189, :200. Two-block inference-timeout/edit/retry/completion at :231. |
| Busy replacement reused the old elapsed clock. | T/src/components/AudioVideoTranscriber.tsx:132, :174, :197: operation-local start timestamp; timer reads only the live controller. Pending clipboard completion is also guarded against Reset/replacement/unmount at :489. | Browser clock replacement regression at T/src/lib/browserTranscriber.tr02.test.ts:222. Clipboard race guard is source-reviewed, not independently clipboard-tested. |
| Subtitle export changed arrows, interpreted literal tags/entities, and allowed blank lines to terminate cues. TXT trimmed editable text. | T/src/lib/browserTranscriber.ts:316, :331: escape ampersand first, then angle brackets; protect blank/whitespace-only physical lines with empty supported tags (`<b></b>` in SRT, `<c></c>` in VTT). Arrows become `--&gt;` in serialized text and import as literal `-->`. Subtitle CR/CRLF normalizes to LF. TXT uses original segment strings with only the document's existing inter-segment separators/final newline. | T/src/lib/browserTranscriber.tr02.test.ts:269, :289, :294, :300: independent strict SRT cue/time importer plus browser DOMParser for SRT HTML entities; native Chromium Blob-backed text track load and VTTCue.getCueAsHTML(). Exact times/text asserted against synthetic inputs, not a second invocation of the exporter. |

Subtitle fixtures include literal markup, literal entity spellings, ampersand, greater-than, inline timestamp-like tags, a numeric cue identifier followed by timestamp-like text, NOTE/STYLE text, multiple leading/interior/trailing blank lines, and Arabic/Hebrew. Native import retained exactly two cues with the original synthetic text and times. These tests do not claim every SRT player treats entities/empty tags identically. The independent SRT importer is test-only, not a shipped parser or third-party-player compatibility claim.

The in-memory React test bundle includes the actual component and lifecycle helper. Worker transport, the WebGPU adapter and analytics are explicitly faked; all page requests are aborted. The native subtitle text-track parser is real. No site build, dev server, model, media decoder, real recording, saved transcript or external request is needed by these tests. This is not a privacy capture or styled-page visual audit.

## Bounded Recovery Policy

These are defensive unpublished-beta policy caps, NOT timings calibrated against real devices. The current ASR worker emits no inference-progress callback; a silent real inference therefore hits its five-minute idle cap. A slow but healthy device may require a measured policy adjustment before release.

| Stage | No New Progress | Absolute Deadline |
| --- | --- | --- |
| Inspect | 30 seconds | 120 seconds |
| Decode | 60 seconds | 300 seconds |
| Model load | 120 seconds | 600 seconds |
| Generation | 300 seconds | 1,200 seconds |

Only finite increasing progress (per model-file message or phase) refreshes idle time. Repeated status text, repeated byte counts and missing progress cannot extend it. Continuous numeric progress cannot extend the absolute deadline. Checks run on timer wake and message delivery; browser suspension can delay execution until the page wakes. Loading/inference/inspection are exposed as indeterminate rather than claiming a fabricated completion percentage.

Measured with fake monotonic clocks: load idle settles at exactly 120,000 ms; generation idle at 300,000 ms; advancing load settles at its 600,000 ms deadline; advancing generation at 1,200,000 ms. React browser-clock tests verify timeout exits busy state, terminates workers, offers retry, and retains completed edited blocks. These are simulated elapsed-time assertions, not a timed model run or measured CPU/GPU throughput.

## Commands And Results

All test commands below ran in T. No test source was disabled. Narrow `-t` red probes intentionally selected one test; other tests were reported skipped by the name filter, not edited or suppressed.

| Local Time (+10:00) | Exact Command | Result |
| --- | --- | --- |
| 13:08:44 | `npm.cmd test -- src/lib/browserTranscriber.tr02.test.ts --reporter=dot` | RED: 14 failed, 8 passed, 15.18 s. Reproduced fallback after cancellation, stale reset result, invalid replacement workers, terminal worker retention and three export failures. |
| 13:10:23 | `npm.cmd test -- src/lib/browserTranscriberLifecycle.tr02.test.ts --reporter=dot` | RED contract setup: helper module not yet created; suite import failed, no tests executed. |
| 13:14:00 | `npm.cmd test -- src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriber.test.ts src/lib/browserTranscriber.dsp.test.ts --reporter=dot` | 72 passed, 1 failed, 7.55 s. Only the legacy lossy-arrow assertion failed. |
| 13:15:04 | `npm.cmd test -- src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts --reporter=dot` | RED: 32 passed, 1 failed, 8.27 s. Strengthened settlement-time measurement caught byte-only progress incorrectly timing out at 120 s instead of reaching the 600 s deadline. Fixed event narrowing, not the deadline assertion. |
| 13:16:37 | `npm.cmd test -- src/lib/browserTranscriber.tr02.test.ts -t "inference timeout" --reporter=dot` | RED: 1 failed, 24 name-filtered, 1.13 s. Retry trimmed prior edits via the existing merge helper. Fixed preservation in the component; TR-01 merge unchanged. |
| 13:17:37 | `npm.cmd test -- src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts --reporter=dot` | GREEN: 36 passed, 3 files, 8.30 s. |
| 13:19:37 | `npm.cmd test -- src/lib/browserTranscriber.tr02.test.ts -t "replacement during a busy" --reporter=dot` | RED: 1 failed, 27 name-filtered; stale elapsed clock did not reach the expected new-job display before the 5 s test deadline. |
| 13:20:08 | `npm.cmd test -- src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts src/lib/browserTranscriber.dsp.test.ts --reporter=dot` | FINAL GREEN: 55 passed, 4 files, 13.30 s. All 43 NEW TR-02 tests plus 12 unchanged DSP/media-worker tests. No skipped tests in this final file-filtered run. |
| 13:22:20 | `npm.cmd test -- src/lib/browserTranscriber.test.ts --reporter=dot` | Legacy cross-check: 30 passed, 1 failed, 220 ms. Unchanged export test at line 231 demands `Second line - -> checked`; the lossless exporter emits `Second line --&gt; checked`. |

The remaining legacy assertion is an explicit integration blocker for a wholly green suite. It encodes the lossy behavior TR-02 replaces. It was not changed because the owner authorized NEW TR-02 test files only and required preservation of non-owned draft files. Minimal coordinator follow-up: update only that obsolete assertion under its file ownership, retaining the timestamp checks and the new independent round-trip tests. Do not restore lossy arrow rewriting to satisfy it.

Final scoped type-check command, exit 0 with no diagnostics (also passed before the final test additions):

```powershell
node node_modules/typescript/lib/tsc.js --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --module ESNext --moduleResolution Bundler --lib ES2022,DOM --types node,vitest/globals --jsx react-jsx src/components/AudioVideoTranscriber.tsx src/lib/browserTranscriber.ts src/lib/browserTranscriberLifecycle.ts src/lib/browserTranscriberWorkerTypes.ts src/lib/browserTranscriberLifecycle.tr02.test.ts src/lib/browserTranscriber.tr02.test.ts src/lib/browserTranscriberProtocol.tr02.test.ts src/workers/transcriber-media.worker.ts src/workers/transcriber-asr.worker.ts
```

Other executed checks:
- `git status --short --untracked-files=all`, `git rev-parse HEAD`, `git branch --show-current`, Get-Item node_modules, targeted Get-Content/rg reads, and before/after Get-FileHash SHA-256 inventories. No Git writes.
- `git diff --check`: exit 0, with pre-existing unrelated tracked-file LF-to-CRLF warnings. Since the transcriber source remains untracked, a separate inline Node read asserted no trailing whitespace in all nine owned source/test files.
- In-session string equality: browserTranscriber.ts before safeCueText and after createTranscriptDownloads exactly match the pre-TR-02 draft after line-ending normalization. This covers TR-01 resampler/dedupe and all non-export helpers.
- Inline read-only Node audit: reverse ONLY the request-ID sendReply plumbing in memory and hash reconstructed workers. It matched the exact pre-TR-02 SHA-256 for media `fdcc3f73bd65bdee1f5df11f55c980cde9f03410853458543c228c3e5cc8a975` and ASR `f49a2ff0fc8eb04d989e4f7c91ee2aad3d6c7ef0f81f942fe2c3c642eb8aadd1`. Thus decoder/DSP, generation/timestamp logic and model pins did not change.
- A first oversized source-embedding audit command was rejected by the command runner before execution. The smaller audit read these local worker files directly, performed the same in-memory protocol-only reversal, and passed. No files were rewritten by either audit.
- The unchanged DSP tests still measured 26 synthetic hour markers per rate: maximum error 0.36281179200159386 samples at 44.1 kHz and 0.33333333340124227 at 48 kHz; block-length error 0. This remains synthetic timing evidence, not real-hour transcription.

## Stable Source Handoff

These nine files are the complete TR-02 source/test handoff in T. Keep them with the existing TR-01 draft; do not identify or transfer this work from HEAD alone.

| File In T | Final SHA-256 |
| --- | --- |
| src/components/AudioVideoTranscriber.tsx | 4f3b4ac0e6346b4dbe44c94bd8542c4564449ee9fffde65216f1a462a1c93d53 |
| src/lib/browserTranscriber.ts | 32ec534bf214d8c25ed34a15a87eff0cfbef9ae7510de76837e460b0df066b16 |
| src/lib/browserTranscriberLifecycle.ts | 2ac48bb428246f3b52919a4751982f160b04e2e9e2edb6b737e52adead86a120 |
| src/lib/browserTranscriberWorkerTypes.ts | 1fdf71c80e9c3965115423bf76057ab61fa73b4c94f71cc34b1231b09ba5ba18 |
| src/workers/transcriber-media.worker.ts | 8b5fd689cbb1ff06fcf63fd14825ce921febccb350542104d16539e3a0b46c28 |
| src/workers/transcriber-asr.worker.ts | e53776c8238f8fe9cd82c0567070184ecf4836121db1ead4087603a2bfd28f23 |
| src/lib/browserTranscriber.tr02.test.ts | 757045352fc0f3decfd5e8d6614445e072d53d4cb5134d45f1705571a993e6d7 |
| src/lib/browserTranscriberLifecycle.tr02.test.ts | 72e9d2f926c3da6c83b8d579b5436853352314c711704f9c4c37a6fa282d2827 |
| src/lib/browserTranscriberProtocol.tr02.test.ts | c3381c40585ff45f8d035f7a6803dad803dc92598263e50535e597c4f6476a0b |

The original inventory had 36 dirty/untracked files; the final inventory has 40. All original files remain. Only the five explicitly described source/protocol files changed. The 31 files below are byte-identical before/after, including both existing TR-01 tests, model/language metadata, package files, registrations, noindex policy, artwork and the untouched browser/privacy pilot.

| Preserved File In T | SHA-256 Before = After |
| --- | --- |
| astro.config.mjs | 536d4fe0b43c669012fd75495643eba1285e2d2582657a806dd4a8ced593ad75 |
| docs/all-tools-review-register.md | 803fe7b07ade7022da3c7823a934ad3e631a95a539649401256ec959f8a13287 |
| docs/calculator-net-roadmap.md | ff0cabbdf33fb0dee9432430932c8650a49c57c3c4c157837bd628628ec2b13e |
| docs/full-site-improvement-plan.md | a4640ead5aa6c9882a11ff035285f2de0d28b3b8bff18fb07714182b67e23b4c |
| package-lock.json | 24d9b97127c5b1fe47dde1ed4efe1d008f18771f6829540d4f44955509ed866c |
| package.json | 6c574cde39e72c88f10a3877173e1c704b115585b429d8602ca9182ca6325def |
| public/tool-art/audio-video-transcriber-guide.webp | ef96a8c9135d22a3d4ece4e778d4201ede0cc14346a4d002fb440002912d2eb6 |
| public/tool-art/audio-video-transcriber-tool.webp | b47fe3e9e7339ca6cd12e6b2e50afae1cee9ecdc5e6c6ebd720813af329d4fd4 |
| public/tool-art/thumbs/audio-video-transcriber-guide.webp | c8952eeb5be2db00e4b3509399b8164a1c6ccc8a81e35192f045d37e12c3990c |
| public/tool-art/thumbs/audio-video-transcriber-tool.webp | ef4801d3a5f80542f906fded8f9f0b4a6e184d6cf0058d33b80ab1ffa5c9ae62 |
| scripts/check-ai-lazy-assets.mjs | 81f04d3b83b962c3ef652097c8415a6fd2b4097df583f9f454fe8cf713a20224 |
| scripts/lib/indexation-policy-source.test.mjs | 8dfe7f7cebe26994834aa19de03cd23cd04f9d565f174b350a607410e3917806 |
| scripts/lib/tool-art-manifest.mjs | ef77c7e8015f34e9151f9e9ca89324236ea4c40167f5c7d2ba0931fa06083e4c |
| scripts/transcriber-browser-pilot.mjs | 01fb80d13d2e2efc167c54580f8ba03af2e26a124370c6121e7b9a9fc7430170 |
| src/components/CalculatorGuideArticle.astro | a391fe7bb643c9e947c99adbd1e2d85bdd740bc91e27cae418d21a7b76118125 |
| src/data/aiBlogGuides.ts | ed32cb3024bf9724899f56090faa940336dc2b5ff3b2026662f2f762d2b4f09d |
| src/data/aiTools.ts | 08649061b4a00a6d4a9b894f9330ff4eba0cfd84d2401afe6de3f10b23297a46 |
| src/data/indexationPolicy.test.ts | 0dd0d3212ab346ef786388895f82238e668d41c4f963e1370ff8c7de66fdc871 |
| src/data/indexationPolicy.ts | 8cadf55d7d4d9e66d97c5ab6ead948e034100e003bd0b83e61ad2b77e6934b48 |
| src/data/siteContentAudit.test.ts | 9c1f47566bff3c92ebc9e39c3f7ef0c43761c626cf42c130123d1a2c6f7e109a |
| src/data/siteDates.ts | 3cfa6b3cffa47835688810c7c66bfa173edc2750b93e958429ea76be33337696 |
| src/data/toolArtApprovals.json | 994270ab94cae9831484241e42710e6fda3ca54909141864cc6faefa51c4be32 |
| src/data/toolArtManifest.ts | 8a2336d32ee3ecbda03643c1579510d337be72c98dcc6ba95d68b4ebf3a4dd60 |
| src/data/toolDeepAudit.ts | 478ad6b1eb3a923a89966006e44c310fc60b154e7087497ef68559e28f8a112c |
| src/data/toolIcons.ts | 63492978c848ab8cfb5160a60c1ff6f46c306173f440444472e3501cbeaef75d |
| src/data/tools.ts | c84d110b476ecd037c811427da8c8b64950a8ce9d9718541dffcb274aeeeb1de |
| src/lib/browserTranscriber.dsp.test.ts | 09022ae65c04ab957e64e850a8fe65e22af999491f244ba6a116edaa3916ebb7 |
| src/lib/browserTranscriber.test.ts | 0ccfb093a0df4ea19444c7bfdeaf2bc359188438d97fb0a894726b0f1bf6959a |
| src/lib/browserTranscriberLanguages.ts | 959d4244db50f8a5feca8f0ba8bab6dc561c60064fcea7b8cc7c4607cbb6d833 |
| src/pages/tools/[slug].astro | 9394f0ad50d2be64df22e9da109918b53a7a262897d65b6111f9e6acbf2be324 |
| src/styles/global.css | b40033a31850a4ffb0fb5f2bfb6c8d0855e5a73e1f296697812f65494e561258 |

## Unperformed Gates And Handoff Decision

- No install, full repository test suite, full typecheck/check, Astro build, transcriber:browser-check/pilot, model smoke, real model, real-media decoding, network research, server fallback, deployment, Git commit/push, publication, indexing submission, campaign status/global edit, or main promotion change.
- No production privacy approval: network/storage/telemetry leak-mutation gates remain TR-03/SEC-01 work. Analytics and workers are fake in the React fixture; this cannot prove the real pipeline never sends private material.
- No real Chrome/Edge 60-minute MP3/MP4 runs, Firefox/WebKit 10-15-minute runs, WASM/WebGPU device throughput, codec/track/language matrix, memory peaks/recovery, styled-page screenshots/accessibility, physical mobile or actual SRT-player compatibility claim.
- Request-ID plumbing uses the actual worker handlers under synthetic imports, but delivery through real built worker assets and real-model cancellation still needs the authorized browser gates. Frozen-page timer latency and performance-cap calibration remain explicit limitations.
- Preserve model pins/noindex and the separate seven-stable-beta-day/indexability release gate. TR-01 anti-aliasing/recognition-quality limitations remain as recorded in the previous worklog.
- Minimal next task: independent Release Judge reviews these exact nine hashes and focused evidence; coordinator reconciles the single legacy assertion under its ownership, then runs broader gates only when authorized. This report does not approve itself or change task status.
- Provenance hygiene was considered, but no private source/report was sent to a cleaning service, no metadata was removed, and required authorship/AI-assistance/legal disclosures were preserved.

