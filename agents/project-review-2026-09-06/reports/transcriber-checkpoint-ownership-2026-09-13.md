# Transcriber Checkpoint Ownership

September 13, 2026 AEST. T is `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
This is local, unreleased work. No public copy, model revision, dependency,
worker protocol, hosting, promotion or indexability change.

## Finding And Change

The September 9 numeric two-section probe reproduced the Edge join failure.
Both hypotheses contained the same 14 ordered word keys. Thirteen word pairs
positively intersected, but the final incoming word was a point at 1775 seconds;
the completed counterpart began at 1775.06. Strict matching correctly refused
to treat those times as equivalent. A five-second pre-roll experiment failed
and was not adopted. No timestamp tolerance or word-coverage rule changed.

Before publishing a checkpoint, select a quiet cut within its existing final
five seconds of overlap. The next scheduled section already decodes all audio
after that cut. Keep a caption that starts before the cut whole, even if it
crosses the cut or has uncertain timing. Leave EOF and continuous-audio cuts
unchanged. Recognition receives the same original PCM and has no added retry.

The production caller uses `buildTranscriptionBlocks` with the default five-second
overlap. Standalone callers must preserve that next-owner precondition; lookahead
alone does not establish it. Source coverage supplies another recognition
opportunity, not a guarantee of identical words. Stop can expose up to five
seconds less committed text; the unchanged next-block resume handles that audio.

Only `src/lib/browserTranscriberWindows.ts` and its test file changed. Seventeen
new regressions cover finite quiet samples, integer sample bounds, view offsets,
EOF, unchanged PCM, consecutive scheduled coverage, exact-cut deferral and whole
crossing/uncertain captions. Initial RED failures preceded the implementation.
One test's slow multi-million-element assertion was replaced by a linear equality
check, not a higher timeout. Focused result: 207/207 across four files.

## Completed Evidence

Paths below are relative to `T/output/browser-transcriber-pilot/`.

| Receipt | Result | Limit |
| --- | --- | --- |
| `join-words-1770/2026-09-08T16-22-06-657Z-msedge-hour-mp4/report.json` | 19/19 intervals, 40 cues, two overlaps | Numeric diagnosis before the ownership change |
| `join-preroll-1770/2026-09-08T16-29-22-154Z-msedge-hour-mp4/report.json` | Same two overlaps | Rejected acoustic-context experiment, not product code |
| `integration/2026-09-08T16-40-02.098Z/report.json` | Full check: 1,171/1,171 tests in 85 files, no skips, both TypeScript lanes, build, audit zero | Local source and QA gates, not production acceptance |
| `join-resume-1770/2026-09-08T16-43-33-282Z-msedge-hour-mp4/report.json` | Actual Edge worker: 48.685 seconds, 38 cues, zero overlaps, 19/19 intervals, valid TXT/SRT/VTT | Bounded original source 1475..2070 with lookahead, mapped by the QA harness; verified model cache |

The bounded test stops after the first checkpoint, edits a synthetic caption,
then resumes only section two. All 18 previously published captions remain in
place with the edit preserved. Published block IDs are exactly `[0,1]`; all 14
join word keys are present in the second block. Five workers terminate, tracked
workers/object URLs return to zero, and the browser/server close. A screenshot
confirms the edited caption and partial-download controls. This does not prove
native allocation release, arbitrary-language accuracy or physical-device support.

September 13 rehash: all 32 source files in the full-check receipt still match.
Six existing soft asset warnings remain; ASR worker is 518.0 KB against a 500 KB
soft threshold. No hard budget was waived. Initial non-AI/AI loads remain lazy.

## Source And Receipt Hashes

- Windows source: `a1fc6e280f5295d8f6b369e903f6b35a22ea90e7077250da4050d1ffe503ab3b`.
- Windows tests: `50b1a9bfee03ba08361d15ba4cd9852e1db5e53bf56fdefb20a2d844daae5768`.
- Full-check receipt: `e2ecc8cc953557b11dddb643f450410dafcab1cbc5a5d0b58c522dc12c63ddd9`.
- Full-check log: `211dacf9f417d760760ad416a7079e229523d81afff3e273c1cc6a9f8b37200e`.
- Stop/resume receipt: `d2e09bc475124e183437934b1bcc0c6e4c9f9f576ceb386598f971536aef1e7d`.

## Current Gate

Fresh normal Edge 153.0.4234.32 completes the exact 3,600-second MP4 in 292.397
seconds: 240 cues, zero overlaps, 120/120 known speech intervals and valid
TXT/SRT/VTT. All reported checks pass; three workers terminate, tracked workers
and URLs return to zero, and the browser/server close. Source/build hashes are
unchanged. This uses fresh remote model downloads, not cached responses or
mapped source blocks. Receipt: `compatibility/2026-09-13T03-34-10-280Z-msedge-hour-mp4/report.json`,
SHA256 `d6f99d79c9353a338ab1450d7843daf796e31b44812221f900383cd4ce12f56f`.
The previous four-overlap Edge receipt is superseded for this exact case.

However, a fresh September 13 dependency audit now fails with 11 findings:
five moderate, five high and one critical. The September 9 zero-audit result
is historical, not a current release pass. A clean security-only worktree at
`C:/Users/chamb/OneDrive/Desktop/accessfreetools-sep13-security` is being tested
before further compatibility work. No deployment is permitted from this result.

Current Chrome hour regression, remaining browser/file combinations,
language/codec/track coverage, production privacy, native memory, physical
devices and seven stable beta days remain open.
The tool and guide remain noindex. TR-03 and the whole goal are not complete.
