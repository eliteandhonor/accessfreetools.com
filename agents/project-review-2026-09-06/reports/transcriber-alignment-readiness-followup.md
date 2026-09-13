# Alignment Readiness Follow-Up

September 6, 2026. **Cached readiness is insufficient: no actual pinned decoder alignment proof can be run from the verified local artifacts found.** No inference, download or application integration was attempted. No source/dependency lock is held; no resource or command remains running.

## Selected Default

The latest coordinator direction selects internal word-timing evidence for overlap while visible captions remain sentence-level. That supersedes the historical unanswered-authorization paragraph in [transcriber-alignment-decision.md](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-alignment-decision.md); it does not waive actual decoder proof or task acceptance. Keep existing models, revisions, display, timeouts and loss-averse behavior unchanged until that proof exists. Do not infer which identical word overlaps or enable alignment by default from metadata alone.

## Bounded Local Check

T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus existing dirty source. Installed Transformers.js is **4.2.0**.

One bounded names/size inventory inspected **1,079 files** only under the explicitly test-owned `output/browser-transcriber-pilot/` tree, with a 2,500-file/six-level ceiling and exclusions for profiles, browser storage, credentials, symlinks and dependency trees. It found **zero ONNX/partial-weight candidates, zero model configuration sets, and zero explicit model-cache locations**. This is not a claim that no cache exists elsewhere on the computer. User Chrome, global caches and unproven cache locations were not inspected.

Existing test fixtures are available, but are not model weights or alignment proof. The bounded hour MP3 and MP4 hashes match their retained synthetic provenance. The existing compatibility harness explicitly identifies the short owned Bella sample; its file was only statted/hashed, not played or decoded:

| Fixture | SHA-256 |
| --- | --- |
| `public/audio/tts-voice-samples/kokoro-82m/af_bella.mp3` | `b8daf9928a1a23d083496d9bd572d2ee2cb82a7b2de1b0d1ef118ad913158adb` |
| `output/browser-transcriber-pilot/fixtures/hour-bounded.mp3` | `7ba26f1a5282d710374e8e4838c8b03a7366b9732d10d519ae72f7681ac85b45` |
| `output/browser-transcriber-pilot/fixtures/hour.mp4` | `ad1e1182755729174d8eecc12156d42df9ca18eaae5d5e94023e8aab260af250` |

The retained actual Chrome run ended at 10:32:34 UTC after the ten-minute experiment cap. Encoder progress reached 10,097,112/10,097,112 bytes, but decoder progress only reached **12,826,755/30,729,881 bytes**. Those are historical transport counters, not retained complete file bytes, load success or inference. The later no-model CSP diagnosis explicitly labels its transport data as historical. No unchanged cold-download retry is justified by these reports.

## Installed Decoder Requirements

- [ASR pipeline:204](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/node_modules/@huggingface/transformers/src/pipelines/automatic-speech-recognition.js:204) maps `return_timestamps: 'word'` to token-timestamp generation; lines 275 onward consume actual `token_timestamps`.
- [Whisper generation:137](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/node_modules/@huggingface/transformers/src/models/whisper/modeling_whisper.js:137) requires alignment heads and requests attention output. [Extraction:388](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/node_modules/@huggingface/transformers/src/models/whisper/modeling_whisper.js:388) throws when cross-attentions are absent; metadata cannot establish that the pinned ONNX export supplies them.
- [Model output handling:1220](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/node_modules/@huggingface/transformers/src/models/modeling_utils.js:1220) collects actual attention outputs by name. Tokenizer word collation exists, but does not prove timing accuracy or the original three-utterance reconstruction.
- [Current worker:14](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/workers/transcriber-asr.worker.ts:14) still pins English `aeaa13760958b03fac5062f457d317d3319c3168` and multilingual `517244293732ee2d58139af5814231b7e6830a0d`, with q8 loading. [Current generation options:66](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:66) still request coarse timestamps. Nothing was changed.

The decision report's previously fetched alignment-head counts, eight English and six multilingual, remain metadata-only evidence. No network verification was repeated. No runtime model or inference library was imported by this sidecar.

## Missing Proof And Next Bound

1. **Artifact prerequisite:** parent supplies or identifies an explicitly test-owned offline artifact set for the exact pinned repository/revision: complete q8 encoder and merged decoder, required configuration/tokenizer/processor files and any external tensor data. Verify a provenance manifest with expected sizes and SHA-256 hashes before loading. Partial progress and cache/config records are insufficient. No remote acquisition is authorized here; any new acquisition condition requires parent confirmation.
2. **First decoder experiment after that prerequisite:** one offline attempt on the existing short Bella fixture, verify its local duration is at most ten seconds, English pinned Tiny q8 on the existing compatibility/WASM path. Request word timestamps only in the ignored harness, deny all network and require local-files-only model loading. Capture real decoder output names/shapes, attention availability, generated token IDs/token timestamps, timed word output, elapsed time and cleanup. Do not treat graph/config metadata as generation output.
3. **Bound and stop rule:** reuse existing stage limits: load idle 120 seconds/deadline 600 seconds; inference idle 300 seconds/deadline 1,200 seconds. Retain the existing short harness's ten-minute absolute cap, with no extension or retry loop. A missing local file, missing attention output, invalid timing, timeout or resource failure ends the attempt with retained failure evidence. No cold download is part of this test.
4. **Do not enable from that one run:** English short-fixture success would establish only initial decoder capability. Multilingual/CJK evidence, known repeated-speech alignment, unchanged sentence-level grouping and actual two-block/edit/retry/cancellation mapping still need their own bounded proof before integration/default enablement and independent task acceptance. Parent owns subsequent assignment and document decisions.

## Evidence, Identity And Cleanup

Command, from T: `node output/browser-transcriber-pilot/alignment-readiness-followup/readiness.mjs`.

Completed locally at **12:57:22 UTC**, exit 0. [readiness.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-readiness-followup/readiness.json) records exact source/library/fixture hashes, retained-report references and the bounded outcome; [inventory.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/alignment-readiness-followup/inventory.json) retains the filenames/sizes. Fifteen inspected source/library/package files had zero before/after drift.

| Current Source | SHA-256 |
| --- | --- |
| `src/lib/browserTranscriber.ts` | `132a633067b774150b2ac08bb12d305bc0d6a60d7fa109667ac8330c5d5f1c23` |
| `src/workers/transcriber-asr.worker.ts` | `613a21d90e64101004c1f7a233e91b747ef5ff3e0b242361b4d1ed1162007167` |
| `src/components/AudioVideoTranscriber.tsx` | `d03f2ab8007a9cac2e1f1162a61b15a3d6a5c86d9be4b824bdd7a174afe319c8` |

**Zero inference runs, remote requests, model imports, browser/server starts or background jobs.** Only synchronous reads/hashes and an exited git identity command ran. No cleanup target was created or abandoned. Original four failures, tests, SRT, production source, models/revisions/timeouts, campaign/boards/worklogs, credentials and deployment were untouched. This report and its ignored proof directory are the only writes. No approval or owner-contract narrowing is claimed.
