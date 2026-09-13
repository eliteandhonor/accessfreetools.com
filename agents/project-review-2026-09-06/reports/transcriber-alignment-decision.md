# TR-01 Alignment Decision

September 6, 2026. Investigation only; no model, worker, merge function, public
feature, indexability or task acceptance changed.

## Why The Existing Match Cannot Prove The Result

The failing fixture supplies two coarse captions: `Yes. Yes.` at 293-299 seconds,
then `Yes. Yes.` at 298-304 seconds. The known synthetic recording has three
utterances, but individual word positions are not inputs to the current merge.
An intersecting caption interval proves neither that every word overlaps nor
which identical word belongs to the shared source. Returning three merely
because it matches this example would introduce another unsupported heuristic.

Current behavior retains uncertain speech and a review warning. This avoids the
original deletion but does not meet exact overlap acceptance. Original failing
assertions remain intact. No success or narrowed owner contract is claimed.

## Verified Existing Capabilities

The installed Transformers.js 4.2.0 source explicitly supports
`return_timestamps: 'word'` in its ASR pipeline. That option requests token
timestamps and attention output, then groups tokens into timed words. The
current worker requests `return_timestamps: true` and receives only coarse
caption spans. It does not retain finer alignment evidence.

Read-only HTTPS requests to the exact pinned generation configurations returned
200 on September 6:

| Model | Revision | Alignment Heads | Metadata Bytes |
| --- | --- | ---: | ---: |
| English Tiny | aeaa13760958b03fac5062f457d317d3319c3168 | 8 | 1,646 |
| Multilingual Tiny | 517244293732ee2d58139af5814231b7e6830a0d | 6 | 3,772 |

These small configuration reads are not inference, decoder-output compatibility,
memory, timing-accuracy or full-hour proof. No ONNX model was downloaded, no
recording was sent, and no paid service was used for this investigation.

Local source inspected in the transcriber checkout:

- `src/workers/transcriber-asr.worker.ts`: current pinned configuration and
  coarse caption conversion.
- `src/lib/browserTranscriber.ts`: generation options and overlap matching.
- `node_modules/@huggingface/transformers/src/pipelines/automatic-speech-recognition.js`:
  word option, chunk generation, and tokenizer output.
- `node_modules/@huggingface/transformers/src/models/whisper/modeling_whisper.js`:
  alignment-head prerequisite, attentions and token timestamps.
- `node_modules/@huggingface/transformers/src/models/whisper/tokenization_whisper.js`:
  internal word collation and coarse/word output distinction.

Primary references: [English model configuration](https://huggingface.co/onnx-community/whisper-tiny.en_timestamped/blob/main/generation_config.json),
[multilingual model configuration](https://huggingface.co/onnx-community/whisper-tiny_timestamped/blob/main/generation_config.json),
and [Transformers.js ASR source](https://github.com/huggingface/transformers.js/blob/main/src/pipelines/automatic-speech-recognition.js).
The web configuration views use main; the separate read-only requests above used
the exact revisions, not an assumed latest-model substitution.

## Owner Decision And Required Proof

The original product plan excludes word-level timestamps. The coordinator asked
whether they may be computed internally for matching while the visible captions
remain sentence-level. That question is unanswered; internal alignment was not
silently enabled or described as an approved public feature.

If authorized, verify the exact pinned decoder's real word-alignment output
before integrating it. Preserve the mapping from word evidence to original
caption text, including CJK, punctuation, invalid/missing timing, retries and
user edits. Resolve overlap only from that evidence; do not use user-edited text
as recognition evidence. Keep uncertain evidence explicit instead of deleting
unproven speech. Retest the exact grouped counterexamples through actual worker,
two-block, cancellation and retry flows, then independently judge the task.

The additional attention work changes inference cost and may affect memory.
Measure it under the existing deadlines and real-browser gates. Do not extend
timeouts, change models, expose word-level UI, upload media or shrink the
60-minute limit to obtain a pass. No gate is waived by the presence of alignment
configuration alone. TR-01 remains in_progress.
