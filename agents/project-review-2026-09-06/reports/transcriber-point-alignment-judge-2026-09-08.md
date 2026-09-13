# Transcriber Point Alignment: Bounded Release Judge

Date: 2026-09-08 (Australia/Brisbane). Independent source review.
Product worktree (T): `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
Campaign (R): `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06`.

**Verdict: Request changes for the narrow point-alignment change. One confirmed P2 finding, high confidence.** The builder now preserves the supplied diagnostic's point anchor, but partial deduplication can produce a caption containing only point words, invalid export timing, and loss of observed word metadata on the next merge. No TR task is approved. This is not release or full-hour proof.

## Finding

### [P2] Recheck positive-duration support after stripping duplicate words

Required change at [browserTranscriberAlignment.ts:114](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:114), lines 114-121. Related new validity contract: lines 5-8; metadata loss: lines 60-74. Export interaction: [browserTranscriber.ts:390](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:390), lines 390-402.

The new builder correctly requires at least one positive-duration word and joins point-only sentence groups to positive captions. However, merge checks that invariant only on the original incoming caption. After removing a matched positive prefix, it checks only whether any words remain. A retained point-only suffix becomes its own caption with no positive-duration support.

Reproduced using inputs produced by the current builder, not malformed hand-crafted captions:

- Completed: `Go [1,2]`.
- Incoming: `Go [1,2] now. [2,2]`.
- Merge result: completed `Go [1,2]` unchanged; appended `now. [2,2]`, with its word array and no review flag.
- SRT: `00:00:02,000 --> 00:00:02,000` for `now.`.
- VTT: `00:00:02.000 --> 00:00:02.000` for `now.`.
- The existing pure `validateTranscriberExports` returns false; `summarizeSubtitleProof` reports two cues and `valid: false`. Changing the incoming suffix to `now. [2,3]` makes the same validation pass.
- Merging a later `Next. [3,4]` caption strips the suffix's `words` and sets `overlapNeedsReview: true`, because the copied point-only list no longer satisfies `validWords`.

A second variation leaves two point words at different times: after stripping `Go [1,2]`, `now [2,2] please. [3,3]` gets a positive *cue span* of 2-3 but still has no positive-duration word. Its metadata is also discarded on the next merge. Checking only `cue.end > cue.start` is therefore insufficient.

**Consequence:** exported text strings survive, but the first case has no positive display interval and fails the existing export gate. The next checkpoint merge loses the observed point anchors. No actual player's omission was tested or claimed. These are three manifestations of one missing post-deduplication invariant, not three independent findings.

**Minimal proposed task:** the transcriber owner should validate the retained suffix before committing a partial match. If all remaining words are points, retain a positive-supported incoming caption and mark the unresolved overlap, or join the suffix to a suitable positive caption within the newly appended incoming portion. Keep observed point times exact. Do not delete point text, invent a word duration, or simply mutate the completed caption to absorb it.

The completed-prefix constraint matters: [AudioVideoTranscriber.tsx:410](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:410), lines 410-415, appends only `merged.slice(sourceSegments.length)` to the editable presentation and advances the separate source checkpoint. Changing the old prefix to fix this could hide new text from the displayed/exported transcript and overwrite edit identity.

Acceptance criteria:

1. Builder -> merge -> TXT/SRT/VTT preserves unmatched point text and exact point anchors when deduplication consumes all positive words in its caption.
2. Every retained aligned caption still has at least one positive-duration word, including the two-separated-points variation. Serialized cues have positive duration without fabricated word intervals.
3. The next merge/checkpoint retains valid observed word metadata and the already completed prefix. Applying the component's append-only projection does not lose new text or alter prior user edits.
4. Cover a trailing point-only suffix both at the end of the batch and before a later positive caption; retain the existing positive-suffix and English/CJK duplicate controls.
5. Point-to-point and point-to-positive intersections still cannot authorize deletion.

## Tests And Evidence

Executed short Node v24.20.0 processes only. The actual TypeScript source was transpiled to CommonJS in memory with the locally installed TypeScript package and loaded through relative imports. No replacement implementation, emitted test file, browser, worker, model, build, or dependency installation was used.

Main adversarial run: **36 checks passed, 3 regression assertions failed**, process exit 1. The 36 include two generated-case matrix checks and a source-hash stability check. The matrices contain **2,880 builder cases total**, not 2,880 additional named tests. **5,805 successful guarded calls** verified recursively frozen inputs against deep snapshots. Initial reproduction and supplemental validator probes are separate executions, not additional unique suite counts.

| Coverage | Fresh result |
| --- | --- |
| Diagnostic's 14 numeric intervals, synthetic placeholder word text | All intervals preserved, first start 0.76, last end 5, positive cue and export spans |
| Leading/interior/trailing point-only sentence groups | Preserved and attached; no builder crash |
| Widely separated tail point; exact block-start/end points; offset ending at 3600 | Original anchors retained within supplied block; no out-of-block expansion |
| Same-time and separated all-point inputs | Explicit fallback, no false word evidence |
| Before/after block, backward point, null, NaN, Infinity, reversed duration | Full fallback text retained; no crash |
| Empty input/fallback and text mismatch | Expected empty/fallback behavior |
| Point/point, point/positive, positive/point, touching positive intervals | No deletion authorized |
| Genuine positive duplicate with positive suffix; interior point followed by positive word | Correct dedupe and retained positive support |
| English/CJK repetition, uncertain tail, edited text, lexical apostrophe distinction | Expected text retained or proven duplicate removed |
| Conflicting hypotheses with point tail | Review flag and chronological downloads; original timestamps unchanged |
| Ordinary positive-plus-point checkpoint and editable append projection | Completed prefix, point metadata, and prior edit preserved |
| Retained suffix after all positive words are deduped | **FAIL:** nonpositive caption |
| Same suffix exported | **FAIL:** positive subtitle duration assertion |
| Same suffix on next checkpoint merge | **FAIL:** word metadata becomes undefined |
| Source hashes before/after run | Unchanged for both target files and core/component interaction files |

Each matrix enumerated lengths 1-6, every nonempty positive-duration bitmask, gaps of 0 or 0.25 seconds, three sentence-punctuation patterns, and English-like or CJK text. One matrix ran with native Intl.Segmenter; one temporarily disabled it inside that short-lived Node process. Assertions checked exact flattened word preservation, positive-supported captions, block bounds, positive serialized cue spans, and input immutability. This is synthetic combinatorial coverage, not a language-quality or large-recording claim.

Supplemental pure execution confirmed: current structural export validator rejects the zero-suffix reproduction; its positive-duration control passes; two separated retained point words lose metadata at the next merge. No new independent root cause was found.

The current `browserTranscriberAlignment.test.ts` was read first. Its point-only-match test never strips a positive prefix leaving only points, so it does not exercise the failing transition. The current test file was **not run as a Vitest suite**; no parent test totals are claimed.

### Reproducer

Run this JavaScript on Node standard input from T. It transpiles current source in memory and prints the defect without modifying files:

```js
const fs = require('node:fs'), vm = require('node:vm');
const ts = require('typescript');
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
const { buildWordAlignedSegments: build } = load('browserTranscriberAlignment');
const { mergeTranscriptSegments: merge, createTranscriptDownloads: downloads }
  = load('browserTranscriber');
const block = { start: 0, end: 4 };
const a = { text: ' Go', timestamp: [1, 2] };
const p = { text: ' now.', timestamp: [2, 2] };
const prior = build([a], block, 'Go');
const incoming = build([a, p], block, 'Go now.');
const merged = merge(prior, incoming);
console.log(JSON.stringify(merged));
console.log(downloads(merged).srt);
console.log(downloads(merged).vtt);
console.log(JSON.stringify(merge(merged, build(
  [{ text: ' Next.', timestamp: [3, 4] }], block, 'Next.'))));
```

Executed command forms were PowerShell here-string JavaScript piped to `node` (in-memory reproduction, adversarial run, supplemental pure validator probe), plus read-only `Get-Content`, `rg`, `Get-FileHash -Algorithm SHA256`, `git status --short`, and `git log -1 --format="%H %D"`. No npm command was run.

## Diagnostic Provenance

Read the supplied parent-owned report:
`T/output/browser-transcriber-pilot/diagnostic-alignment/2026-09-08T10-37-23-921Z-chrome-short/report.json`.

Its recorded generation time is 2026-09-08T10:37:24.025Z. It contains 14 intervals, `joinedTextMatches: true`, and a final start=end=5 interval. Its subtitle summary records a single whole-block cue from 0 to 5.5440000000000005. Its alignment-source hash is the earlier `b1badba32549987ace48dfd94a9e6f0e9a1b6e437127b5724b808b6e266d50e0`, not the reviewed hash below.

The report explicitly limits itself to short synthetic timing diagnosis with a numeric observer; its recorded pass is not unchanged-worker, current-source, full-hour, or release acceptance. The pure replay used only numeric timings and character counts with synthetic placeholder text, not recorded transcript content.

Parent-provided update received after this bounded review: the Chrome hour rerun completed in 391332 ms but still failed timing/coverage, with 56/120 versus 40/120 previously and 124 cues. These figures were not independently inspected or rerun by this judge. The parent reports unchanged point-alignment source and is diagnosing the first five-minute block with a numeric observer. That diagnostic remains outside this review. The update does not change the source finding or establish full-hour or TR-01 approval.

## Source Identity

T HEAD: `90d6dcab0580a91ca66382f2414d95e8817469e5`, branch `codex/browser-transcriber-pilot`.
Campaign worktree HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, branch `codex/gpt6-review-implementation`.

The target alignment files are untracked in T, so HEAD and an empty `git diff` do not identify their contents. This judgment is bound to these SHA-256 values, rechecked after the pure tests:

| File under T | SHA-256 |
| --- | --- |
| src/lib/browserTranscriberAlignment.ts | 385095047fcdfe7476a327d3a14d71201eb7a6909273e62265d377acb93e582b |
| src/lib/browserTranscriberAlignment.test.ts | b954c02e7b2802a09bfa1a38e953674ca6d194d6c8394ad1a86d7c0ee1b79ba8 |
| src/lib/browserTranscriber.ts | c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84 |
| src/components/AudioVideoTranscriber.tsx | b17278f3f5e6e3ee0b784e80364c682c40f5942177d778b8675d870c6493876b |
| scripts/lib/transcriber-compatibility-exports.mjs | 36e76ed9b846b2e7f604e34e0406c5d164f1c72250a12311d6dc5e4bef05ad21 |
| scripts/lib/transcriber-browser-proof.mjs | 27b17c43aba4118665f80e6ae8f6bf34644c40ab89462dd694a27ccdeb2819b7 |
| output/browser-transcriber-pilot/diagnostic-alignment/2026-09-08T10-37-23-921Z-chrome-short/report.json | 18025f38e82b7c0b1ea1ca0be52537b016f045f596bb3a8825ff3ea4b8227e12 |

## Scope And Limits

Read campaign AGENTS.md, README.md, plan.md, campaign.json, release-judge instructions/reference/tasks, transcriber task constraints, the prior alignment judgments, and the installed code-review-and-quality skill. Review target was only the current point-anchor change in the two requested alignment files. Core merge/export, component checkpoint code, and the existing pure export validator were inspected solely for direct interaction; unrelated product changes were not adjudicated.

No additional concrete crash or text-string deletion was found in the tested typed inputs. Point-only groups can span silence when attached to a positive caption; tested anchors remained bounded by the source block, but readability/max-cue-duration policy and real audio accuracy were not certified. No new external dependency, network surface, or separate security/performance finding was identified in this narrow change; no performance benchmark was run.

Intentionally unperformed: browser automation, browser/model inference, worker execution, Chrome/Edge hour runs, mounted component tests, actual subtitle-player rendering, npm fullcheck, build, dependency audit/install, production checks, deployment, publishing, and TR/campaign approval. Ordinary checkpoint behavior was exercised as pure array operations using the inspected component projection, not actual Stop/Resume interaction.

Only this exact report was written. No product source/tests, output artifacts, campaign manifest/task states, existing reports/worklogs, dependencies, or parent processes were modified. All unrelated dirty work was left alone. No command sessions were left running.

## P2 Rejudge: 2026-09-08

**Decision: the P2 above is closed at its bounded source-reproducer scope.** The historical request-changes verdict and failed executions above are preserved. No additional actionable finding remains within this P2 recheck. This is not TR-01, any other TR task, full-hour, full-export-gate, or product/release approval.

### Fix Inspected

At [browserTranscriberAlignment.ts:117](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:117), lines 117-120, merge now validates the nonempty retained word list before constructing a partial caption. If removing the duplicate prefix would eliminate all positive-duration support, it copies the original incoming caption and adds `overlapNeedsReview: true`. The existing empty-list path still removes a fully proven positive duplicate.

This implements the loss-averse direction proposed above. It preserves exact observed anchors, retains positive word support, and does not modify the completed prefix. The flagged caption keeps valid word metadata through `copySegment` but cannot authorize subsequent deduplication through `aligned`. No fabricated interval or point-based deletion was introduced in the checked cases.

### Fresh Results

Reran the exact JavaScript reproducer embedded earlier in this report against current source. It now produces:

```text
Completed: Go [1,2], unchanged.
Appended:  Go now. [1,2], overlapNeedsReview=true.
Words:     Go [1,2]; now. [2,2], unchanged.
SRT:       00:00:01,000 --> 00:00:02,000 for Go now.
VTT:       00:00:01.000 --> 00:00:02.000 for Go now.
Next merge: both existing captions and all word metadata remain intact.
```

Independent targeted run: **26/26 checks passed, 0 failed, exit 0**, Node v24.20.0. This rejudge did not rerun the earlier broad builder matrix. The two reported RED regressions and 28 focused passes are parent-provided execution history; their current test source was inspected, but their Vitest execution was not independently repeated.

| Rejudge Coverage | Result |
| --- | --- |
| Original builder -> merge reproduction, same-time point suffix | Entire incoming caption retained, review flagged, completed prefix unchanged |
| Separated point suffix at 2 and 3 | Entire incoming caption retains positive support and both exact point anchors |
| TXT/SRT/VTT for both variants | Exact expected text and source cue times; every serialized cue has positive duration |
| Later positive caption and empty incoming checkpoint merge | Existing captions, flags, and word metadata remain deep-equal |
| Component's append-only editable projection | Existing owner edit preserved; new retained text remains visible/exportable |
| Another overlapping incoming hypothesis after the flagged caption | Not deleted using the uncertain retained caption as evidence |
| Point suffix followed by positive caption in the same batch | Both new captions appended correctly |
| Match spanning multiple incoming captions | Fully duplicated caption removed; affected point-suffix caption retained; later text preserved |
| Positive suffix, interior point followed by positive word, complete positive duplicate | Existing valid deduplication still works |
| CJK suffix and point-bearing incoming repetition | Text/anchors retained; no self-deduplication |
| Point/point, point/positive, positive/point boundary matches | Still cannot authorize deletion |
| Six source/interaction hashes | Unchanged throughout the targeted run |

The main rejudge used the same in-memory TypeScript loader approach as the original review, with Node assertions and the existing pure subtitle parser. **47 guarded builder/merge/download calls** used recursively frozen inputs and deep pre/post equality checks. The editable checkpoint check executed the inspected append-only array projection, not a mounted component or browser clipboard.

**Export limit, not a recurrence of this P2:** retaining the original incoming caption intentionally preserves an overlapping uncertain duplicate. On both repaired reproductions, `validateTranscriberExports` and `summarizeSubtitleProof` still return false for the combined transcript because the existing proof contract rejects overlapping cues. The source times and individual cue durations are now correct for this fix; the same retained caption alone passes the validator, and the normal positive-suffix dedupe control passes the combined validator. No non-overlap rule was changed or waived, and no general export-gate pass is claimed. These observations distinguish the chosen uncertainty policy from the original zero-duration/metadata-loss defect.

### Rejudged Source Identity

SHA-256 values captured before and checked after the targeted run; paths are under T. The alignment source and its test changed since the original judgment; the direct interaction files below did not.

| File under T | SHA-256 |
| --- | --- |
| src/lib/browserTranscriberAlignment.ts | 6b8b598e12f1bbb2cf253bc69af72efd4b3443b6b49c1a17448b99022868ae2b |
| src/lib/browserTranscriberAlignment.test.ts | ce67a9ca5a3870b96494812148cf48504e327237e55183fb87dc545c49c03e57 |
| src/lib/browserTranscriber.ts | c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84 |
| src/components/AudioVideoTranscriber.tsx | b17278f3f5e6e3ee0b784e80364c682c40f5942177d778b8675d870c6493876b |
| scripts/lib/transcriber-compatibility-exports.mjs | 36e76ed9b846b2e7f604e34e0406c5d164f1c72250a12311d6dc5e4bef05ad21 |
| scripts/lib/transcriber-browser-proof.mjs | 27b17c43aba4118665f80e6ae8f6bf34644c40ab89462dd694a27ccdeb2819b7 |

Executed only read-only source/report/hash inspection, the original report reproducer on Node standard input, and a short independent P2/checkpoint/export assertion process. Before this append, this report's SHA-256 was `a5aef6351df33589541bb02aa865ac636a2247b4a8e1806402b67ae0581cdd05`; the earlier report content is preserved.

Only this rejudge section was appended. No product file, task/campaign state, other report, or worklog was edited. No npm command, browser/model inference, worker execution, build, fullcheck, real subtitle player, hour test, or release action was run. The parent's independent 30-second-window exploration and forthcoming helper/worker integration were explicitly excluded and receive no judgment here. No command sessions remain running.
