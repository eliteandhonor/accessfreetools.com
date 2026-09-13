# Transcriber Alignment Outcome: September 8

**Do not enable internal word-timing deduplication yet.** Actual browser inference
is now proven to run against the exact verified English model, but its repeated
speech and timing output failed the bounded acceptance probes. No product source,
model pin, noindex policy, public route or deployment changed.

This supplements the specialist's first-two-attempt
[report](transcriber-alignment-runtime-2026-09-08.md). Those failures remain intact.

## Verified Assets And Ground Truth

Both fixed revisions are completely acquired under the transcriber worktree's
`output/browser-transcriber-pilot/pinned-model-cache/`. Each has 13 files verified
against its official pinned repository tree, Git blob IDs and ONNX LFS SHA-256.
The prior missing-artifact prerequisite is closed, not the public download gate.

The existing owned Bella MP3 remains unchanged. A separate offline Windows
`System.Speech` fixture says `Yes.` using Microsoft David Desktop. Three identical
trimmed PCM utterances occur at 293, 298 and 303 seconds in a synthetic master.
No microphone, upload, voice cloning, account or background service was used.
The 290-300 and 295-305 second slices intentionally have identical bytes: each
contains only two utterances at relative 3 and 8 seconds. Ground truth is not a
model-generated timestamp. Provenance SHA-256:
`9ea26f2b751f9086d19a45eba933ae416360e9971f08d334f65c8c6e3cd821c9`.

## Actual Experiments

All evidence below is under T's
`output/browser-transcriber-pilot/alignment-runtime-2026-09-08/`.
Each attempt has its own exclusive sentinel and report, unchanged 600-second
outer bound, finite local asset allowlist, deny-only proxy, blocked external
requests, and owned browser/server cleanup. No protection was disabled.

| Attempt | Actual Outcome |
| --- | --- |
| 03, isolated Chrome | Known environment request remained blocked and was classified separately. Audio decode failed before worker creation. |
| 04, isolated Chrome | Added response hash/status instrumentation. The local fixture fetch returned empty HTTP 204, not the verified MP3; refused to decode. No model executed. |
| 05, isolated bundled Chromium | Same network-deny policy; actual Bella bytes verified in browser, real WASM q8 model loaded, session cross-attentions, token IDs and timings captured. 3,582 ms; failed raw text-token bounds. |
| 06, isolated bundled Chromium | Known two-utterance 10-second WAV, unchanged inference worker/model/runtime. 4,728 ms; returned three `Yes.` words and out-of-range/overlapping timings. Failed. |

Chrome's empty response is an observed environment discrepancy. Its exact cause
has not been established; the earlier blocked AdGuard request alone does not
prove it caused the empty fetch. Bundled Chromium proof is not named Chrome or
Edge compatibility approval. No failed result was relabeled pass.

## Decoder Evidence

Attempt 05 returned 14 word chunks for the Bella sample. Those chunks were
bounded and monotonic, but a raw punctuation token aligned to 6.18 seconds in
5.544 seconds of audio. Real cross-attention tensors were populated, finite and
nonzero; the runtime's timestamp extractor actually executed. This proves
capability, not sufficient timing accuracy or adoption.

Attempt 06 returned these actual chunks for only two spoken words:

| Returned Text | Start | End |
| --- | ---: | ---: |
| Yes. | 3.50 | 6.32 |
| Yes. | 8.72 | 11.92 |
| Yes. | 9.00 | 15.94 |

Do not trim or invent replacement word times to make this pass. The original
three-utterance cross-block merge regression is still open. It would be unsafe
to use this output as evidence for automatically deleting repeated speech.

The installed Transformers 4.2.0 source explains a likely contributor to padded
tail alignment: the pipeline supplies the actual `num_frames`, but Whisper's
seek loop uses padded `input_features.dims[2]` and derives extraction length from
that span. Attempt 05's extractor received 1,500 attention frames even though the
audio was only 5.544 seconds. This observation does not prove the cause of all
recognition errors, and no private-library patch has been adopted.

Exact source locations in T:
`node_modules/@huggingface/transformers/src/pipelines/automatic-speech-recognition.js:266`
and `src/models/whisper/modeling_whisper.js:204` (within that package).

Runtime identity also needs care: the installed external ONNX Web package and
served WASM are 1.27.0, while the bundled runtime reports web
`1.26.0-dev.20260416-b7804b056c` and common `1.24.0-dev.20251116-b39e144322`.
Reports preserve these actual values; do not claim all runtime layers identify
as 1.27.0 merely from package metadata. No dependency was changed for this probe.

## Immutable Reports

| Report | SHA-256 |
| --- | --- |
| `attempt-03/report.json` | `2731e1995ad9b4b05dafcc718bd77cdc4b48a17fed540e4b8d7178ed70195082` |
| `attempt-04/report.json` | `463dc70e502dd6ebf1cf4615c12950c2f0e6da03e5999be20b1c1de10c4fccc9` |
| `attempt-05/report.json` | `2ce2ca9aae049eeb5f3eced36b2f10d069a7ea45a8b74d5a8c10a732c314290d` |
| `attempt-06/report.json` | `b244c837d0d17b39f09a8b2a7c19b16e92cd3bee5fcb25711bd079ddb27dbc74` |

All four reports confirm owned browsers exited, servers stopped, selected source
identities had zero drift and pinned manifests remained unchanged. The first
failed report hash is preserved. Prepared bundles/readiness snapshots and actual
session events are retained beside each attempt.

## Next Work

Review the padded-input seek behavior and JS/WASM identity mismatch before any
bounded compatibility fix. A changed candidate must rerun actual short and
repeated-speech fixtures, including multilingual/CJK, with no synthetic timing
substitution. Then test mounted worker reuse, editing, retry and cancellation.
Keep the existing loss-preserving fallback and review warning until independently
verified alignment supports a change. Full-hour, privacy, memory and beta gates
remain separate. No need to request new credentials or paid infrastructure.
