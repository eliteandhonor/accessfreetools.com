# English Decoder Alignment Runtime: September 8

## Final Handoff: Stopped

**Both attempts are preserved as failed, with no model execution. Parent now owns further harness debugging. No additional source changes or runs will be made by this assignment.**

| Attempt | Duration | Result | Report SHA-256 |
| --- | --- | --- | --- |
| `attempt` | 1,203 ms | Blocked `GET http://local.adguard.org/` before fixture/model loading | `e74d36c3e11bbf79a59971b6e84611c04dbafff8953140ba097a4ced809a6f6d` |
| `attempt-02` | 896 ms | Same pre-runtime blocker; environment count remained zero | `7e68fcffef5f70dee8003d4b4f4814b648c89a11127ab6872ef3be2afaae35cf` |

**Classifier defect:** the attempt-02 predicate unnecessarily required `!url.search && !url.hash && !url.username && !url.password`, in addition to matching the known HTTP origin, `/` path and GET method. The retained origin/path/method all matched, so at least one of those extra conditions rejected the original URL. The compact request log did not retain those components or their presence flags. Therefore the exact failing component cannot be recovered from this evidence; claiming a confirmed query string would be an inference. This is a harness classification/logging defect, not Whisper or ONNX capability evidence. The network guard correctly kept the request blocked throughout.

Before the stop/handoff instruction, the current source predicate was adjusted to permit query/fragment variation **for classification only**, and presence-only diagnostics plus 18 passing helper assertions were added. That source-only correction was **not rebuilt or run**. The actual executed sources are archived under `source-01/` and `source-02/`; the original `prepared/`, second `prepared-02/`, both reports and both attempt sentinels are intact. The current `run.mjs` still targets consumed `attempt-02`, so a third run is neither prepared nor silently enabled. Runtime bundle bytes, models, CSP, finite request allowlist and timeout values were unchanged for attempt-02. No app/worker production source, fixtures or campaign files were edited.

**Cleanup confirmed again at handoff:** Chrome PIDs **28840** and **37220** are absent; native probe PIDs **2580** and **13376** are absent. Both attempts recorded browser exit code 0 and stopped loopback servers. Both command processes returned exit 1 and no owned command remains running. No inference worker was created; there are no actual session outputs, token IDs, timings or transcript results. The parent's known-three-Yes fixtures and multilingual assets were not used.

[Attempt-02 report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/attempt-02/report.json). Decoder alignment, repeated-utterance reconstruction and all broader TR01/TR03/public-release gates remain unproven.

## First Attempt Record

**Source harness implemented; one real Chrome attempt failed before model loading. Decoder capability remains unproven.** No application, test, package, configuration, campaign or model-cache files were edited. Writes were limited to the assigned ignored harness directory and this report.

## Exact Blocker

The parent explicitly authorized one run after verifying the complete English cache. The attempt ran at **2026-09-08T08:42:29.101Z**, finishing at **08:42:30.219Z**; the complete runner measured **1,203 ms**. Isolated Chrome **152.0.7977.83** attempted `GET http://local.adguard.org/`. The finite request allowlist denied this non-loopback request and failed closed with `Unexpected browser request denied`.

This origin is already classified as environment-related in the existing `scripts/lib/transcriber-browser-proof.mjs`; that context does not authorize allowing it. The observation establishes an environment/request-policy gate, **not unsupported Whisper alignment**, failed inference, a missing model file, or successful browser processing. The application was not loaded by this harness. The two verified responses were its own HTML and `page.mjs` only. The deny-only proxy separately rejected nine background requests without an upstream connection. No third-party destination content was fetched by the harness.

The screenshot shows the proof page still waiting for its start signal. There is no fixture decode event, inference worker event, model request, session output, token ID, timestamp or transcription result. Empty checks are not passes. No retry, Chromium substitution, network exception, security disablement or timeout increase was made.

## Implemented Harness

T directory: [alignment-runtime-2026-09-08](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/).

- `proof.mjs` verifies the exact 13-file manifest, sizes, hashes, complete flags, non-LFS Git blob IDs and the two parent-provided pinned weight hashes. It also checks real output timing when present.
- `prepare.mjs` uses installed esbuild to bundle the actual browser Transformers entry and installed ONNX Web, explicitly rejecting a native Node inference entry. It hashes all 22 build inputs plus package/runtime identities, eight protected app/config files, seven harness sources and the generated bundle. Preparation performs no inference or downloads.
- `worker.mjs` is an actual browser worker. It requests `return_timestamps: 'word'` only here, with WASM q8 and one runtime thread. Original session/model/extractor calls and their return values remain intact. Observers record actual session outputs and cross-attention names/shapes/finite populated tensors, raw token IDs/timestamps, and returned word spans. Config alignment heads alone never satisfy the checks.
- `run.mjs` starts an isolated Playwright Chrome server and two loopback servers, with no user profile/session, extensions, credentials, remote cache, remote models or network forwarder. A finite HTTP asset allowlist, same-origin CSP, blocked service workers/WebSockets, resolver restriction and deny-only proxy constrain traffic. Served bytes are hashed against the verified local artifacts.
- `page.mjs` verifies decoded duration and 16 kHz PCM before model loading, with browser-native MP3 decoding/downmixing. It records only the owned synthetic fixture's signal statistics/hash, not audio samples. The current attempt never reached this stage.
- `self-check.mjs` passed eight deterministic validator assertions, including missing-attention, null/out-of-range word timing and non-finite token timing controls. Those fabricated objects are clearly labeled helper tests, not model proof.

The 600-second total experiment cap is unchanged, with ten seconds reserved for cleanup. Load idle/absolute remains 120/600 seconds; inference idle/absolute remains 300/1200 seconds, constrained by the overall cap. There is no fake progress heartbeat. An exclusive sentinel forbids accidental second attempts. Worker/session disposal, owned browser exit, server shutdown, manifest and protected-file identity checks are recorded separately.

## Verified Inputs

| Input | Verified Value |
| --- | --- |
| Transformers.js | Installed 4.2.0, browser bundle entry |
| ONNX Runtime Web / Common | Installed 1.27.0 / 1.27.0; not loaded into a model session in this attempt |
| Playwright / esbuild | Installed 1.62.0 / 0.28.1 |
| English repository | `onnx-community/whisper-tiny.en_timestamped` |
| Revision | `aeaa13760958b03fac5062f457d317d3319c3168` |
| Manifest SHA-256 | `b56f41d191489804a50dc78b0ce6f81848767d977549f7c4442750bba1df6611` |
| Encoder | 10,097,112 bytes; `697eaa5668bb13343965f423d6002273479b8508f592bd26970735516ed5039e` |
| Decoder | 30,729,881 bytes; `f2df67fbe1cf39c9b050d05029b55e217a9467f3453ae5110e2bcc0f5ba73652` |
| Existing Bella MP3 | Native ffprobe duration **5.544 seconds**, 24 kHz mono |
| Bella SHA-256 | `b8daf9928a1a23d083496d9bd572d2ee2cb82a7b2de1b0d1ef118ad913158adb` |
| Prepared worker bundle | `31e809e9359a048d7c0dc0018db4258d2fd7d6cf3e266c4e49a11fabd454b8c4` |

The existing native ffprobe executable was hashed and exited successfully. No FFmpeg conversion, installation or model acquisition was performed by this assignment. Acquisition remains the parent's separate proof under `output/browser-transcriber-pilot/model-acquisition/2026-09-08T08-32-42.296Z/`.

## Evidence And Cleanup

- [Source readiness](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/prepared/source-readiness.json), SHA-256 `1889e024a5316d346938fb4d6f8bfdbf032f7cc1ef29f0c6c7676b8a02fbb046`.
- [First attempt report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/attempt/report.json), SHA-256 `e74d36c3e11bbf79a59971b6e84611c04dbafff8953140ba097a4ced809a6f6d`.
- [Actual Chrome screenshot](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/attempt/final.png).
- [Commands, controls and scope](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/README.md).

Chrome PID **28840** exited with code **0**. A follow-up PID liveness probe confirmed it absent. Both loopback servers stopped; no retained socket remains. `workerTerminated: false` means no worker termination was acknowledged in this pre-start failure, not proof of a running inference worker: neither fixture nor worker started. Browser exit bounds any renderer that existed. Manifest verification passed again, and all snapshotted protected/harness/library files had **zero drift**. The source and output report paths are Git-ignored. No owned process remains running.

## Parent Handoff

The exact immediate blocker was surfaced as soon as observed. The original three-utterance overlap failures remain untouched. The parent's later multilingual cache and known-three-Yes fixtures were not used or expanded into this attempt.

Next action requires a **separate, explicit changed-experiment authorization**, because the one-attempt allowance is consumed. A candidate is installed isolated Chromium with the same offline controls, or a separately reviewed policy that continues to deny known injected traffic without mistaking its blocked attempt for an application request. Neither option has been implemented, run or approved here. Do not allow the external endpoint, disable host protection, discard this failure, or expand timeouts to obtain green evidence.

Even a later positive Bella run would prove only initial English decoder capability and timing sanity. It would not establish repeated-speech boundary alignment, multilingual/CJK timing, whole TR01/TR03 acceptance, sentence-level UI integration, full-hour support, beta exit or public release.
