# Transcriber Compatibility Export Fix

2026-09-08. Bounded implementation complete; code/tests ready for parent integration. No TR task approval, release approval, or release action. All child test processes exited before readiness was reported. No additional test, npm, build, model, or browser runs are planned by this child.

## Scope And Identity

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5`, preserved dirty draft.
- R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`, preserved dirty work.
- Child writes: T `scripts/lib/transcriber-compatibility-exports.mjs`, T adjacent `transcriber-compatibility-exports.test.mjs`, and this R report only. No existing source, helper, runner, package, task, manifest, or judgment was edited.
- Read the root/campaign instructions, current serializer, `src/lib/browserTranscriber.srt.test.ts`, existing proof helper/tests, Vitest configuration/package test command, R `transcriber-srt-continuation-judge.md` and fix report, and the retained independent reader/comparator sources listed below.

## Confirmed Finding

High confidence: the compatibility runner at `scripts/transcriber-browser-compatibility.mjs:260` (inspected cached-model revision) uses the old shared `unescape`, removing empty bold/class tags and decoding HTML entities. Current `src/lib/browserTranscriber.ts:343` guards SRT literals with `<font></font>` and inserts `<font SPACE LF></font>` at atom boundaries for byte-bounded continuation. `createTranscriptDownloads` is at line 382. A real current plain-text SRT body is `<font></font>plain`; the old predicate rejects it although its VTT counterpart and transcript both contain `plain`. Decoding HTML entities is also inappropriate for literal SRT content.

The existing `parseSubtitleCues` at `scripts/lib/transcriber-browser-proof.mjs:82` trims the entire file. Its timing/framing checks remain useful, but using its final VTT text directly would lose accepted trailing whitespace. The new helper recovers bodies from the actual export without that trim; it does not modify the parser or weaken its checks.

Parent's existing Chrome report was read, not regenerated: T `output/browser-transcriber-pilot/compatibility/2026-09-08T10-16-57-190Z-chrome-short/report.json`. It records Chrome 152.0.7977.83, verified-model-cache mode, duration 5.544 seconds, 77 transcript characters, TXT/SRT/VTT sizes 78/123/116 bytes, one bounded cue, and only `validExports: false` among checks. No raw transcript is retained there, so this child cannot replay those exact downloads from their hashes. That report corroborates the local source reproduction; it is not a new green browser result. Parent's subsequent Edge success was reported by the parent, not independently inspected here.

## API And Checks

`validateTranscriberExports({ txt, srt, vtt, transcriptValues, duration })` returns a boolean for the supplied export-proof object. Pass strings read from the three actual downloads and the displayed/export-ordered textarea strings, including blank edits. The helper is pure, has no I/O, and imports only the existing proof helper.

- Requires all three nonempty strings, finite positive duration, a string array, and at least one nonblank subtitle cue.
- Verifies exact TXT parity, including blank segments, CR/CRLF and final LF. Subtitle comparisons alone normalize CR/CRLF to LF, matching the current serializer.
- Uses the existing parser and `summarizeSubtitleProof` for numbering/framing, positive bounded times, non-overlap and the existing duration +0.1-second tolerance. Checks exact start/end equality between SRT and VTT and exact cue count/content/order against nonblank transcript entries.
- SRT comparison consumes expected literal code-point/guard atoms and whitespace guards. Only the exact existing continuation marker is allowed between complete atoms. No user tags or entities are stripped/decoded. The existing 1,000-byte physical-line bound is checked, not a new caption-length limit.
- VTT comparison uses the expected escaped representation and existing blank-line class guards; it neither strips literal tags nor decodes nested entities. Actual final-cue whitespace is retained.
- This is deliberately validation of current generated exports, not a new general subtitle protocol. It requires the export's terminating LF. It does not change the independent reader contract.

Minimal parent integration, retaining the runner's actual-download evidence checks:

```js
import { validateTranscriberExports } from './lib/transcriber-compatibility-exports.mjs';

report.checks.validExports = report.exports.length === 3
  && report.exports.every((item) => item.bytes > 0)
  && validateTranscriberExports({ ...exportText, transcriptValues, duration });
```

Keep `srtCues` and `report.subtitles` where required by the separate hour speech-coverage checks. Parent owns the runner edit and real browser/hour integration. The supplied interface has no original segment timestamps: identical wrong but valid timestamps in both exports cannot be detected here. It also cannot prove speech alignment or inference correctness from subtitle validity.

## Tests-First Evidence

The new test file was written first and initially bound `validateTranscriberExports` to a frozen copy of the old predicate. That copy remains as a regression witness, but the final tests import the new helper. Both executions used the actual current `createTranscriptDownloads`; no serializer mock, browser, model, or network was used.

Exact command, from T, executed twice:

```powershell
$env:TRANSCRIBER_EXPORT_FFMPEG='C:/Users/chamb/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
node node_modules/vitest/vitest.mjs run scripts/lib/transcriber-compatibility-exports.test.mjs src/lib/browserTranscriber.srt.test.ts --configLoader runner --maxWorkers=1 --no-file-parallelism --no-cache --reporter=dot
```

| Run | Result |
| --- | --- |
| RED, 10:18:57 UTC / 20:18:57 AEST | Exit 1, 23 failed / 48 passed, 71 total, 1.18 seconds. Nineteen acceptance assertions rejected valid exports; four malformed-input tests exposed legacy throws. The six existing SRT tests and four native-reader tests passed. |
| GREEN, 10:20:07 UTC / 20:20:07 AEST | Exit 0, 71/71 passed across two files, zero skipped/todo, 514 ms. New suite: 61 helper/regression cases plus four independent-reader cases. Existing SRT suite: six unchanged cases. |

Coverage includes exact literal tags/entities, literal continuation-looking text, original blank/cue-like/RTL fixtures, bidi controls, CRLF/CR, final VTT whitespace, blank edited segments, 292 ampersands, 4,096 ASCII characters and the original five long cues. Negative checks cover content/order/count/TXT mismatches, missing exports, malformed framing, changed milliseconds, invalid/reversed/overlapping/out-of-bounds times, missing literal/whitespace guards, split atoms, oversized uncontinued SRT source lines and malformed inputs.

Four fresh independent imports use the same installed FFmpeg 7.1 executable and unchanged ASS comparator from the retained judgment: original two-cue literal/blank/RTL contract in SRT and VTT, and original five-cue long-line contract in both formats. Only transport changes: `-f srt` or `-f webvtt`, `-i pipe:0`, actual generated export passed on stdin instead of writing an input file. Output remains `-map 0:s:0 -c:s ass -f ass pipe:1`, timeout 10 seconds, one thread, protocol whitelist `file,pipe`, hidden child window. Exact cue texts/order and original centisecond timestamps are asserted. No continuation repair, normalization of reader output beyond the retained ASS comparator, or weakened assertion was added. These native checks are opt-in via `TRANSCRIBER_EXPORT_FFMPEG`; they ran without skips here and would be skipped without that environment variable.

## Source Hashes

SHA-256 of the final implementation and inspected source/evidence. T-relative paths unless specified. The serializer, existing SRT tests and proof helpers matched the before-edit dirty snapshot through final focused testing. The old judgment's serializer hash is historical, not substituted for current source.

| Path | SHA-256 |
| --- | --- |
| `scripts/lib/transcriber-compatibility-exports.mjs` | `36e76ed9b846b2e7f604e34e0406c5d164f1c72250a12311d6dc5e4bef05ad21` |
| `scripts/lib/transcriber-compatibility-exports.test.mjs` | `5cf389fc2be2453058df4cd088bcb58cd6c19abc7e57b800f933ca2b5fd734c2` |
| `src/lib/browserTranscriber.ts` | `c0fb96417e6a4ad6e7719ed998fe162ae2f04fcb8465333644ed7ac5b9443f84` |
| `src/lib/browserTranscriber.srt.test.ts` | `191ce913bc9d8337f915995d0e2f3b5f0e4b395269f010609f8e45f9f3cdb66e` |
| `scripts/lib/transcriber-browser-proof.mjs` | `27b17c43aba4118665f80e6ae8f6bf34644c40ab89462dd694a27ccdeb2819b7` |
| `scripts/lib/transcriber-browser-proof.test.mjs` | `49847059cc05c4c9d2b73854d9e568f578c9857762ce4fe0f982df55a380cad4` |
| `scripts/transcriber-browser-compatibility.mjs`, parent cached-model revision | `3bf57c06fc007a28f64c44843884b0e5973fd986dfddfd4c3b8f27e3c41c933f` |
| `output/browser-transcriber-pilot/srt-continuation-judge/green/originals/independent-probes.mjs` | `50735d33fb11794b4ebe7ee7595ed87c61f7a7421148016a160b9c0a71830002` |
| `output/browser-transcriber-pilot/srt-continuation-judge/green/originals/reader-edges.mjs` | `d2d21d47b56e40a3739d337b828095534c5c13ee016b5cd4c70e892b4dc4b474` |
| R `agents/project-review-2026-09-06/reports/transcriber-srt-continuation-judge.md` | `f515631f2e494213811442483675d01b5747e1155a51b710197cb088473a307e` |
| Parent Chrome `2026-09-08T10-16-57-190Z-chrome-short/report.json` | `2fb6540b14c7006827e2704e48b04a3b179be47747bc3b6c1a4d20dc06d7e5f1` |
| Installed `ffmpeg-win-x86_64-v7.1.exe` at command path above | `2ce797a0f88d7f067180338fb227f7b1928ea727bd9a4d7a1d022f7c52af71a3` |

Before/after read-only snapshots covered 55 pre-existing dirty T files and 272 pre-existing dirty R files. Before this report, the only changed baseline file was the independently parent-owned compatibility runner (`7873089c943244ef48de6d1b16675826ea7b367a538f82e75863113df2c4f977` to the cached-model hash above); the two new helper/test files were the only additions. All other sampled dirty files matched. This is scoped dirty-file evidence, not a whole-repository freeze. The snapshots and complete test output are in this task's tool transcript; no extra artifact or temporary-file writes were made.

## Acceptance And Limits

The bounded helper acceptance is met: old false rejection reproduced, current real serializer output accepted, literal/blank/RTL semantics retained, corrupt export evidence rejected, existing tests unchanged, independent reader contract retained, and focused tests completed. Confidence is high for this scoped harness correction, not universal reader compatibility.

No whole suite, build, fullcheck, install, real browser, inference, model/runtime fetch, network command, user media, task approval, commit, merge, deployment or release was performed by this child. No live transcript text was stored. All FFmpeg and Vitest calls were synchronous/completed; no child server or browser was started. Arbitrary third-party subtitle dialects/readers, exhaustive control sequences, original-timestamp fidelity, real hour/media/device behavior, privacy acceptance, alignment and campaign approval remain separate parent/judge responsibilities. This report does not turn either parent legacy-red browser report green retroactively.
