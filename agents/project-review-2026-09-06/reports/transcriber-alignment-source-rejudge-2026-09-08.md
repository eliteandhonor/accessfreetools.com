# Transcriber Alignment: Independent Source Rejudge

Date: 2026-09-08. Workspace: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber` (T).

**Judgment:** All three original findings are closed at the original source-reproducer scope. Independently executed 25 pure checks passed. One new, closely related P2 remains: Copy text does not use the chronological order now used by the caption list and downloads. Request that scoped follow-up before claiming all presentation/export paths are aligned.

This is not mounted-component, browser, real-model, full-check, product, TR01/TR03, or release approval. Only this new report was written; the original review was preserved.

## New Scoped Finding

### [P2] Copy text still exports checkpoint order instead of displayed chronology

Location: [AudioVideoTranscriber.tsx:149](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:149), lines 149-152; consumed at [AudioVideoTranscriber.tsx:497](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:497).

The updated merge intentionally preserves the completed prefix for checkpoint/edit identities. The visible caption list sorts an indexed projection at lines 684-686, and `createTranscriptDownloads` sorts a copied array. However, `transcriptText` still directly joins `segments`, and `copyTranscript` sends it to the clipboard unchanged. Consequently Copy text differs from both the visible transcript and TXT export whenever incoming source time precedes a completed cue.

Executed the original conflicting-hypothesis input against current source:

```js
merge([s(w('Yes.', 298.58, 299.98))], [s(w('Yeah.', 298.46, 301.26))]);
```

Observed using the component's actual source expressions/functions extracted with the TypeScript AST, not a mounted component:

```text
Checkpoint order: Yes. / Yeah.
Visible projection: Yeah. (original index 1) / Yes. (original index 0)
TXT download: "Yeah.\n\nYes.\n"
Copy text:    "Yes.\n\nYeah."
```

The callback ran with a local stub clipboard and captured the wrong-order string. No system clipboard, browser, or React mount was used. The visible projection and actual `editSegment` function were also evaluated: editing the first displayed item correctly changed original index 1, leaving index 0 unchanged.

Required direction: derive `transcriptText` from a copied chronological projection using the same comparator, without sorting or mutating the checkpoint array. Add a Copy text assertion alongside the existing conflicting-hypothesis ordering regression. Preserve the established clipboard newline convention; the discrepancy here is order, not formatting.

## Original Finding Closure

### 1. [P1] Mixed metadata deletes distinct speech: Closed

Fix inspected at [browserTranscriberAlignment.ts:71](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:71), lines 71-86 and 97-112. Any actual word/review metadata selects the loss-averse path. Incoming known evidence stops at the first uncertain segment; completed evidence resets at uncertain segments, with an additional overlapping-unknown guard. The matching suffix remains contiguous instead of filtering out unmatched interior words.

Fresh source results:

- Previous `Try` at 290-291 plus ` again.` at 299-300; incoming `Again.` at 295-296: retained with and without the unrelated uncertain tail at 302-303. The added tail no longer changes whether the distinct utterance survives.
- Original coarse-caption/disjoint-word case plus a tail word whose end is `NaN`: both `Again.` utterances and `Tail.` retained; tail word metadata discarded and review flag set. Valid word evidence remains intact.
- Previous uncertain `Again.` at 290-300 plus valid incoming `Again.` at 298-299: both retained, incoming conflict flagged.
- Unknown incoming prefix/middle, unknown completed suffix, and overlapping unknown previous regions blocked cross-boundary inference. A genuine known duplicate before an unrelated unknown tail still deduplicated correctly.

No surviving text-loss reproduction found within these cases.

### 2. [P2] Backward, unflagged cue starts: Closed For Original Cue/UI/Download Reproducer

Fix inspected at [browserTranscriberAlignment.ts:108](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:108), [browserTranscriber.ts:47](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:47), [browserTranscriber.ts:387](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:387), and [AudioVideoTranscriber.tsx:684](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:684).

The original `Yes.` / `Yeah.` example now flags the incoming conflict and retains its exact 298.46-301.26 word interval. Completed source order and indices remain stable, while TXT, SRT, VTT, and the evaluated UI projection put 298.46 before 298.58. Equal-start neighbors order by end, with stable order for exact ties. No word timestamps were shifted to fabricate nonoverlapping spans.

The component's append/checkpoint path at lines 410-415 remains consistent with a stable completed prefix, and its sorted UI projection retains original indices for edits and labels. The separate Copy text omission above prevents broader closure of every text-export path, but does not invalidate the original cue-order/source-time fix.

### 3. [P2] Lexical punctuation conflates different words: Closed

Fix inspected at [browserTranscriberAlignment.ts:57](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberAlignment.ts:57), lines 57-60 and 89-93.

Fresh source results retained the complete incoming hypothesis and flagged the conflict for `Well` / `We'll`, `re-sign` / `resign`, and `ice cream` / `icecream`. Both U+2018 and U+2019 apostrophe forms normalized to the straight apostrophe and still matched the equivalent contraction despite surrounding punctuation. The original `Well` / `We'll go.` reproducer now returns `Well` and `We'll go.`, not `Well` and `go.`.

## Independent Execution Evidence

Used the installed `code-review-and-quality` skill. Read the changed alignment helper and its targeted tests, merge dispatch, shared comparator, chronological exports, and the component's checkpoint, indexed presentation, edit, and copy/download paths. The frame adapter and worker wiring were also inspected without running their runtime.

Node v24.20.0; local `typescript.transpileModule` compiled the actual helper files to CommonJS in memory. A small local loader resolved only their relative helper imports. No implementation was copied into a replacement algorithm and no files were emitted.

**25/25 pure checks passed:**

| Group | Executed Cases |
| --- | --- |
| Original mixed evidence | Control; uncertain tail; malformed tail; uncertain previous caption |
| Original chronology | Conflict preserves words/prefix and flags review; chronological TXT/SRT/VTT without mutation |
| Lexical distinctions | Contraction; hyphenated word; internal word separator |
| Equivalent punctuation | Left curly apostrophe; right curly apostrophe |
| Repetition | Two possible alignments retained; unique English boundary; unique CJK boundary; touching timestamps; incoming self-repetition |
| Unknown boundaries | Incoming prefix; incoming middle; completed suffix; overlapping earlier completed unknown |
| Contiguous evidence | Genuine duplicate before unknown tail; interior previous word not used as suffix; known match across sentence boundaries |
| Additional controls | Mixed valid/null builder retains full text; equal-start/end stable ordering |

Every merge call used recursively frozen inputs and verified deep equality against pre-call snapshots. Download generation was checked against a frozen conflict result and left source timing/order unchanged. A separate AST execution verified chronological UI indices and the edit-index mapping, and **reproduced** the Copy text bug with the actual memo/callback and a stub clipboard.

Original snippets use these definitions:

```js
const w = (text, start, end) => ({ text, start, end });
const s = (...words) => ({
  start: words[0].start, end: words.at(-1).end,
  text: words.map(word => word.text).join('').trim(), words,
});
// merge = current source mergeTranscriptSegments
```

The parent reports RED 7/21 followed by fixes and 62 focused passes. Those suite totals are parent-provided evidence, not independently rerun or claimed here. The independently executed count is 25 pure probes plus the component-AST check above. No Vitest suite, mounted test, or full check was run by this reviewer.

## Source Identity

SHA-256 of the current files exercised or inspected:

| File under T | SHA-256 |
| --- | --- |
| `src/lib/browserTranscriberAlignment.ts` | `b1badba32549987ace48dfd94a9e6f0e9a1b6e437127b5724b808b6e266d50e0` |
| `src/lib/browserTranscriber.ts` | `c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84` |
| `src/lib/browserTranscriberAlignment.test.ts` | `3eda60d403361af88f6ab3595e37c2edf7731cfc1efeed35765a66cb872b425d` |
| `src/components/AudioVideoTranscriber.tsx` | `15c2a3619930630e4e200b34673201a100d655af6c65911c58ed09eed751e73a` |
| `src/lib/whisperFrameBounds.ts` | `bd3338911fa2d21746e49a091b46d34eff729d2fce5e74ceab9622a239633f5a` |
| `src/workers/transcriber-asr.worker.ts` | `69ae642390491363f37e314d740f928d137ff806483fbe3f42c4c8c467efe9ce` |

Original report preserved at `reports/transcriber-alignment-source-judge-2026-09-08.md`; SHA-256 `fac75f1a964b82340e2971e91666673faf146c2d4d16e2024a97b01e4c36e83c`.

## Exact Proof Limits

- No browser, real clipboard, model, ONNX inference/import, network request, mounted React test, full check/build, or release action ran.
- Source-expression evaluation proves the pure projection and callback behavior with supplied state; it is not React lifecycle, DOM, or browser integration proof. Parent owns mounted tests and fullcheck.
- No new runtime capability claim was made from the earlier passing source-callable reports. The adapter and worker hashes remain the same as in the original review; their previous scoped evidence was not rerun here.
- No new backend or subtitle-reader acceptance requirements were introduced. Review stays within the three fixes and their immediate chronological UI/export paths.
- Only this new report was written. Parent source/tests and the original review remain untouched. Findings and closures apply to the hashes above; later edits need targeted verification.

## Final Addendum: Copy Closure (2026-09-08)

**All three original findings plus the Copy text finding are now closed within this source/pure review scope.** The earlier finding above is preserved as historical evidence; its request for a copy-order follow-up is satisfied by the verified change.

Verified [AudioVideoTranscriber.tsx:150](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/components/AudioVideoTranscriber.tsx:150): the memo now uses `[...segments].sort(compareTranscriptTimes)` before joining text. Independently extracted and executed the actual memo, UI projection, and `copyTranscript` callback via TypeScript AST with a local stub clipboard. Five cases passed: original conflicting hypotheses, Later/Earlier, equal-start/end ties, one segment, and empty input. Copy matched UI and TXT order in every case; recursively frozen checkpoint arrays remained unchanged, and the existing no-added-trailing-newline clipboard convention was preserved. The original conflict now copies `Yeah.\n\nYes.`; Later/Earlier copies `Earlier.\n\nLater.`.

Also reran the original mixed-tail text-loss, conflicting timing/review, and contraction reproducers against current helpers: all passed. The helper hashes are unchanged from the rejudge, so the earlier 25-probe evidence still applies to those same helper bytes.

| Verified Source | Current SHA-256 |
| --- | --- |
| `src/components/AudioVideoTranscriber.tsx` | `b17278f3f5e6e3ee0b784e80364c682c40f5942177d778b8675d870c6493876b` |
| `src/lib/browserTranscriberAlignment.ts` | `b1badba32549987ace48dfd94a9e6f0e9a1b6e437127b5724b808b6e266d50e0` |
| `src/lib/browserTranscriber.ts` | `c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84` |

Proof limits are unchanged: no browser, real clipboard, mounted test, model, network, or fullcheck was run. The parent-reported mounted Copy assertion and stale boolean-timestamp/source-shape test updates were not independently executed or judged here; no product failure or fullcheck success is inferred from them. Parent owns that verification. This addendum closes only the three original findings and their Copy text follow-up, not product/release gates. Earlier report content and the original review were preserved.

## Report-Scope Addendum: Optional Model-Smoke Evidence (2026-09-08)

**Findings: none in the requested evidence-report change. Independent pure probes: 40/40 passed.**

Reviewed the new [summarizeModelSmoke](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/lib/transcriber-browser-proof.mjs:11), the 16 new cases at the start of its adjacent test file, and the pilot's caller/report serialization at [transcriber-browser-pilot.mjs:301](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/scripts/transcriber-browser-pilot.mjs:301). The button check at line 330 states only `selectedFixtureEnablesTranscribeButton`; it does not substitute for generation evidence. Skipped generation reports `not_run`, null model, and two null model-smoke checks. Requested smoke needs positive integer transcript/download evidence, distinct TXT/SRT/VTT exports, and nonempty requests for the selected pinned repository. Empty or runtime-only requests cannot vacuously prove the pin.

Executed the actual pure helper with frozen inputs, plus the pilot's actual status expression extracted through the TypeScript AST, without importing/executing the browser pilot. Probe breakdown: 31 helper cases, 7 aggregate-status cases, and 2 checks against the supplied report. Covered skipped/stale evidence; English/multilingual selection; wrong/empty/mixed pins; transcript/export counter failures; malformed, HTTP, credentialed, query/fragment, wrong-host, and unapproved-file URLs; and optional-null versus required-null/false/error handling. Input snapshots were preserved. The new Vitest cases were inspected, not run through Vitest.

Read the exact [2026-09-08T10-06-41-894Z report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/2026-09-08T10-06-41-894Z/report.json), generated at 2026-09-08T10:06:47.128Z. Its overall `pass` is explicitly scoped to readiness. `modelSmoke.status` is `not_run`, `model` is null, both smoke checks are null, and recorded smoke transcript characters/downloads/post-start requests are respectively 0/empty/empty. The readiness button check is true. This is internally consistent with the current summary and aggregate expression, not independent proof that browser generation occurred.

| Bound Evidence | SHA-256 |
| --- | --- |
| `scripts/lib/transcriber-browser-proof.mjs` | `27b17c43aba4118665f80e6ae8f6bf34644c40ab89462dd694a27ccdeb2819b7` |
| `scripts/lib/transcriber-browser-proof.test.mjs` | `49847059cc05c4c9d2b73854d9e568f578c9857762ce4fe0f982df55a380cad4` |
| `scripts/transcriber-browser-pilot.mjs` | `891aee4aa09b3011e1bbd476681bbba012b68c2e966ad68ae41cb62ddc3ddb60` |
| `output/browser-transcriber-pilot/2026-09-08T10-06-41-894Z/report.json` | `7f87efac153fb1e6023d167f239acd2cfe72b8ccbdf25c56044557d8c5bde158` |

Limits: source/report inspection and small local Node probes only. No npm, Vitest, build, browser, model, network, or fullcheck was run; no T source or output was changed. Preexisting compatibility-harness behavior and wider approval/status judgments were outside scope. Only this separately titled addendum was appended, preserving the prior report content.
