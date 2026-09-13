# Transcriber Alignment: Independent Source Review

Date: 2026-09-08. Verdict: **Request changes for the narrow alignment merge.** Three reproducible findings; no new concrete frame-adapter defect found. This is not product, mounted-component, browser, TR01/TR03, or release approval.

Workspace reviewed: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber` (T). Only this report was written. Parent source, tests, runtime outputs, and processes were not changed.

## Findings

### 1. [P1] An unrelated unaligned segment re-enables destructive coarse deduplication

Locations: [browserTranscriberAlignment.ts:62](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:62), lines 62-66; [browserTranscriber.ts:297](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:297), lines 297-320, especially 305-307 and 311-314.

The aligned fast path is all-or-nothing across the incoming batch and relevant completed segments. A missing/invalid word list or `overlapNeedsReview` flag sends every candidate through coarse text matching. That fallback neither preserves valid word evidence nor propagates uncertainty from the previous segment. It can delete a word even when available word intervals prove the two occurrences do not overlap.

Executed reproducer, using `w(text,start,end)` and `s(...words)` as defined below:

```js
const prior = s(w('Try', 290, 291), w(' again.', 299, 300));
const next = s(w('Again.', 295, 296));
const unknown = { start: 302, end: 303, text: 'Tail.', overlapNeedsReview: true };
merge([prior], [next]).map(x => x.text);
// ['Try again.', 'Again.']
merge([prior], [next, unknown]).map(x => x.text);
// ['Try again.', 'Tail.'] -- the distinct 295-296 utterance disappears.
```

This requires no malformed caption bounds. A second executed case extends the existing coarse-caption/disjoint-word regression: previous `Again.` at 290-291, incoming `Again.` with words at 294-295 and caption bounds 290-296. Adding an unrelated tail whose word end is `NaN` deletes the incoming `Again.`; without the tail both are retained. The invalid tail also loses its word metadata without gaining a review flag.

The reverse mixed boundary is reachable from the current worker's whole-block fallback: previous `{start:290,end:300,text:'Again.',overlapNeedsReview:true}`, incoming `s(w('Again.',298,299))` returns only the uncertain previous segment. Unknown previous timing is being treated as sufficient duplicate evidence despite its flag.

Required direction: retain word-level matching where that evidence is valid; isolate unaligned regions. Do not let unavailable/invalid timing or an uncertain previous span authorize coarse deletion of a valid incoming word. Preserve review status when evidence is degraded. Add the control/one-extra-unaligned-segment pair as a regression.

### 2. [P2] Conflicting aligned hypotheses produce backward, unflagged cue starts

Location: [browserTranscriberAlignment.ts:80](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:80), lines 80-90; returned directly by [browserTranscriber.ts:298](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:298).

When overlapping words disagree, `match` remains zero and `ambiguous` remains false. Incoming segments are appended after completed ones using their original start times, without global ordering or an unresolved-overlap flag. Sorting only the incoming batch does not order the combined transcript.

Executed reproducer:

```js
merge([s(w('Yes.', 298.58, 299.98))], [s(w('Yeah.', 298.46, 301.26))]);
// [{ start:298.58, end:299.98, text:'Yes.', words:[...] },
//  { start:298.46, end:301.26, text:'Yeah.', words:[...] }]
// Neither segment has overlapNeedsReview.
```

`createTranscriptDownloads(...).vtt` preserves that order: the 00:04:58.580 cue precedes the 00:04:58.460 cue. Thus a plausible boundary hypothesis change escapes both chronology handling and review signaling. This is separate from deliberately preserving source overlaps: the defect is backward cue ordering plus silent unresolved conflict, not a demand to fabricate nonoverlapping word times.

Required direction: preserve original word timestamps, flag unresolved overlapping hypotheses, and ensure deterministic chronological cue output. Do not fix this by moving source word times to the previous caption's end. Add a no-match overlap regression and check exported cue ordering.

### 3. [P2] Removing internal punctuation makes different words deduplicate

Location: [browserTranscriberAlignment.ts:57](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:57), used at lines 72-75.

The normalizer deletes all non-letter/number/mark characters, not just surrounding punctuation. `Well` and `We'll` both become `well`. On intersecting source intervals, the unique-match path silently deletes the contraction rather than retaining the differing hypothesis for review.

Executed reproducer:

```js
merge([s(w(' Well', 298, 299))], [s(w(" We'll", 298.5, 299.5), w(' go.', 299.5, 300))])
  .map(x => x.text);
// ['Well', 'go.'] -- "We'll" is deleted without a review flag.
```

Required direction: distinguish lexical apostrophes/hyphens and internal separators from harmless surrounding punctuation; normalize equivalent apostrophe forms without removing the contraction boundary. A differing lexical hypothesis must not become a proven duplicate merely through punctuation stripping. Add contraction/non-contraction and hyphenated-word controls.

## Verification And Controls

Used the installed `code-review-and-quality` skill. Read the two requested tests, all alignment and adapter source, worker load/transcribe/error paths, generation options and merge logic. Also read the existing merge/worker tests and the installed Transformers 4.2.0 ASR/Whisper seek implementation to verify the private adapter's immediate contract.

Executed only short Node v24.20.0 processes. Current TypeScript source was transpiled in memory with the local `typescript` package and evaluated as CommonJS; no copied implementation was substituted. No files were emitted. Exact loader used for the merge reproducers:

```js
const fs = require('node:fs'), vm = require('node:vm'), ts = require('typescript');
const cache = {};
function load(name) {
  if (cache[name]) return cache[name].exports;
  const source = fs.readFileSync('src/lib/' + name + '.ts', 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  } }).outputText;
  const module = cache[name] = { exports: {} };
  vm.runInThisContext('(function(require,module,exports){' + code + '\n})')(
    path => load(path.replace('./', '')), module, module.exports);
  return module.exports;
}
const { mergeTranscriptSegments: merge, createTranscriptDownloads } = load('browserTranscriber');
const w = (text, start, end) => ({ text, start, end });
const s = (...words) => ({ start: words[0].start, end: words.at(-1).end,
  text: words.map(word => word.text).join('').trim(), words });
// Execute the findings' snippets here, from T, with node on standard input.
```

Observed controls:

- The explicit two-possible-match repeated-word case retained all incoming words and set `overlapNeedsReview`: previous `Yes.` at 296-298 and 298-300, next at 297-299 and 299-301. The ambiguity detector works for this case.
- Mixed valid/null word chunks retained full fallback text and marked the block uncertain, without fabricated word metadata. The text-loss finding occurs later at the merge boundary.
- Input snapshots remained deep-equal after all six initial merge probes, including the mixed-invalid, uncertain-previous, conflicting-overlap, contraction, and repeated-ambiguity cases.
- Separate pure adapter assertions passed: Callable invocation unchanged, preserved `this`, frame-only cropping, full-length options identity, frozen caller inputs/config preserved, eight invalid frame counts rejected before slicing/delegation, untouched peer methods and Object/Function prototypes, and original thrown error identity.
- The inspected adapter unit tests additionally cover asynchronous result/error identity, slice failure, version/shape rejection, per-call cropping, Callable support, and warmed global-descriptor controls. Those Vitest tests were read, not rerun in this review. The fake adapter assertions do not claim that upstream seek itself never mutates its processor objects.
- No new concrete defect found in the 4.2.0 Callable adapter or the reviewed English/multilingual generation-option selection. The installed seek implementation reads input frame length and performs its own encoder padding, consistent with the adapter's crop.

## Existing Runtime Evidence

Read, but did not rerun, these exact parent-owned reports under `T/output/browser-transcriber-pilot/alignment-runtime-2026-09-08/`:

- `source-callable-english-boundary/report.json`: generated 2026-09-08T09:39:11.419Z, `capability-observed`; all recorded checks true, including source caption alignment and three merged utterances. `sourceDrift: []`; cleanup reports worker/browser/servers/audio context released.
- `source-callable-english-bella/report.json`: generated 2026-09-08T09:39:28.910Z, `capability-observed`; all recorded checks true, including source caption alignment. `sourceDrift: []`; cleanup recorded as complete.
- `source-english-boundary/report.json`: preserved failed attempt, generated 2026-09-08T09:38:11.076Z; error was the old adapter shape rejection. This is historical failure evidence, not evidence that the current Callable-compatible adapter still fails. The current Callable regression test was inspected; its earlier RED execution was not independently rerun.

These reports support only their stated isolated source-helper capability claims. They do not cover the adversarial merge cases above, mounted component integration, broader languages/recordings, or release gates.

## Reviewed Source Identity And Limits

SHA-256 of the files exercised/read in this review:

| File under T | SHA-256 |
| --- | --- |
| `src/lib/browserTranscriber.ts` | `9995e73e6b1ee2c7a3d434771c69729fa0ca62dfe03293e539ff7671e1758d6d` |
| `src/lib/browserTranscriberAlignment.ts` | `15ffb2d2a5ef1a30f929d8677a210bc6f0c378b07b852d425be74a6108dd01e8` |
| `src/lib/whisperFrameBounds.ts` | `bd3338911fa2d21746e49a091b46d34eff729d2fce5e74ceab9622a239633f5a` |
| `src/workers/transcriber-asr.worker.ts` | `69ae642390491363f37e314d740f928d137ff806483fbe3f42c4c8c467efe9ce` |
| `src/lib/browserTranscriberAlignment.test.ts` | `b1bdb156aa9bc47c678dd1879986cbf46a6b8472f522e02af22fe6f9be73c905` |
| `src/lib/whisperFrameBounds.test.ts` | `97c13d3527ecadfb8f3fae9ad75d13f8e1d985292e49b68bf2ed6b30d9411395` |

No browser, network request, ONNX import/inference, full check/build, mounted-component test, dependency audit, or release action was run. No parent source/tests were edited. No open command sessions remain. Findings apply to this source snapshot; later parent integration changes require targeted re-verification.
