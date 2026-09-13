# Transcriber Quiet Cuts And Sentence Marks

September 9, 2026 AEST. Executions use September 8 UTC paths. T means
`C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`; R is the
review checkout containing this report. Local, unreleased work only. No model,
dependency, public copy, indexability, Hostinger, account or promotion change.

## Implemented

- Plan initial recognition windows on integer PCM samples. Prefer a nearby
  200 ms quiet neighborhood, with a 20-second minimum and 30-second maximum;
  keep exact five-second overlap, every original sample, and exact EOF.
  Missing right-hand quiet context retains the nominal cut. This is a cut
  preference, not voice-activity detection, silence removal or new ASR retries.
- Exclude a whole ASR result only when both fallback and raw chunk text consist
  entirely of whitespace and the explicit sentence-mark family `. ! ?`, Arabic
  question mark, ellipsis and CJK equivalents. Never strip marks from a sentence.
  Keep operators, other punctuation, letters, numbers, marks, emoji and music.
  This deliberately omits standalone sentence marks, not arbitrary text, and
  is not a claim of universally lossless character preservation.
- Preserve invalid-timed lexical chunks through the cleanup decision. Invalid
  word times retain the existing uncertain whole-window fallback. Uninspectable
  chunk text fails closed. No overlap/point/corroboration guard was relaxed.

The independent reviewer found and rechecked the near-EOF boundary regression,
the originally non-discriminating NaN test, the broad punctuation candidate,
and the raw-timestamp filtering gap. Earlier candidates are superseded, not
accepted from their passing test counts. Current focused suite: **211/211**
across Windows, Alignment, Coverage, Repair and real-repair coverage tests.
RED failures were observed before each corresponding fix.

The [independent scoped judge](transcriber-quiet-boundaries-judge-2026-09-09.md)
has closed all four required findings for the final identities below and
verified the final check receipt. This is local source/bounded-proof acceptance,
not approval of the running hour, TR-03, deployment or indexability.

## Evidence

All paths below are relative to `T/output/browser-transcriber-pilot/`.

| Receipt | Result and limit |
| --- | --- |
| `quiet-window-plan/2026-09-08T15-31-14.051Z/report.json` | First 325 seconds decoded with native FFmpeg: two shortened windows, full sample coverage, exact overlap. Planner only; earlier selector before the EOF fix. |
| `first-block-check/2026-09-08T15-42-49-253Z-chrome-hour-mp3/report.json` | Before cleanup: 10/10 known speech intervals, 22 cues, one overlap. Final-cue booleans show two punctuation-only results, not raw recognizer proof. |
| `raw-quiet-output/2026-09-08T15-54-45-384Z-chrome-hour-mp3/report.json` | Explicit instrumented-worker diagnosis: raw fallback and every raw chunk are sentence-marks-only for the short outputs at source starts 125, 245.22 and 315.22 seconds. Numeric booleans/counts only. 20 cues, no overlap, 10/10 intervals; not unchanged-worker acceptance. |
| `first-block-check/2026-09-08T15-55-42-887Z-chrome-hour-mp3/report.json` | Normal built app, unchanged worker: Chrome, 25.008 seconds, 20 cues, zero overlaps, 10/10 expected intervals, valid TXT/SRT/VTT. Stopped after one completed five-minute block, not an hour. |

Both final bounded runs use verified pinned model-cache responses at the original
URLs, not cold external downloads. They report source/build unchanged, three
workers terminated, zero tracked live workers/object URLs, and browser/server
stopped. Raw diagnostic worker SHA256:
`7647e05e5515041eade5a0e46a21823c28db59d5b3d03d4b244c0ae9f976f5b9`.
The diagnostic helper is ignored and must never be deployed or called production
privacy evidence. Interval coverage is not full word-accuracy measurement.

## Source Binding

| T file | SHA256 |
| --- | --- |
| `src/lib/browserTranscriberWindows.ts` | `eb711ca9188e7ebc8203b18d3007142b99a69c086f5b76aa9b418cbe56a3d1c2` |
| `src/lib/browserTranscriberWindows.test.ts` | `f24db2d10dbed1a3ef342f64336b705abbdddf68a01c9cc42112253bab6b2dd9` |
| `src/lib/browserTranscriberAlignment.ts` | `f3ff3ff703c5b86721be890c81ea0e828b1ebdfc1492cf46dacd3883e3083480` |
| `src/lib/browserTranscriberAlignment.test.ts` | `a66a9c40fd6420a46af579a2eb40607e73340d419272f04f49b35cbfaa7c61db` |

## Final Local Check

Full `npm run check` passes **1,154/1,154 tests in 85 files**, with no skipped
native subtitle tests, both TypeScript lanes, build, accessibility, article and
key-page visuals, schema/image/lazy-asset checks, and zero vulnerabilities.
All 32 selected source hashes remain unchanged. Existing six soft asset
warnings remain; the ASR worker is 517.7 KB against a 500 KB soft threshold.
No hard performance failure or budget waiver was introduced.

- Receipt: `integration/2026-09-08T15-57-11.292Z/report.json`.
- Log SHA256: `233063c757c09d4585d202fd8dfeb85ca98c13ec0f859e9d86f7ff75e10e1c41`.
- Native subtitle decoder SHA256:
  `2ce797a0f88d7f067180338fb227f7b1928ea727bd9a4d7a1d022f7c52af71a3`.
- The ignored check wrapper now requires the FFmpeg environment path and
  records its hash instead of allowing the optional decoder cases to skip.

## Full-Hour Chrome Result

Normal actual Chrome 152.0.7977.83 completed the exact 3,600-second synthetic
MP3 in **301,450 ms**. All **120/120** known speech intervals are present in
**240 cues with zero timestamp overlaps**; TXT, SRT and WebVTT checks pass.
The prior fresh Chrome result had 267 cues and 26 overlaps. This is a measured
fix on this fixture, not a general word-accuracy or comparative-speed claim.

- Receipt: `compatibility/2026-09-08T16-00-52-444Z-chrome-hour-mp3/report.json`.
- Receipt SHA256: `92df526705cf7910a21dd73206238463a5b1ca57d9da6246ced55a4e1a4b2105`.
- Standard harness and app worker, no diagnostic replacement or cached-model
  fulfillment. Fresh model downloads complete: encoder 10,097,112 bytes and
  decoder 30,729,881 bytes. The existing request allowlist remains enforced.
- All reported checks pass, source/build remain unchanged, three tracked
  workers terminate, and zero tracked workers/object URLs remain. Owned
  browser/server are closed. Thirteen working-set samples are not a native
  allocation leak test or complete memory acceptance.
- Existing blocked environment and failed/aborted network counts remain in the
  report; this is not a claim that every external request was error-free.

## Edge Video Failure Is Still A Release Blocker

Normal actual Edge 152.0.4191.66 completed the exact hour-long MP4 in
**290,247 ms**, retaining **120/120** known speech intervals. However, its
**244 cues contain four overlaps**, so `validExports` fails. Every other
reported check passes, including source/build identity and tracked cleanup;
the browser/server are stopped. The earlier Edge run had 14 overlaps, but
improvement is not acceptance.

- Receipt: `compatibility/2026-09-08T16-06-34-528Z-msedge-hour-mp4/report.json`.
- Receipt SHA256: `03e0bafdd391c6020c3c9ad153b3808cc3e3a3ff7de2dbff9fcd7ac876680c9c`.
- Overlapping cue starts: 1770.76, 1772.80, 3540.76 and 3542.80 seconds.
  These are at the two logical block joins beginning at 1770 and 3540 seconds.
  Final cue timings localize the problem but do not prove its raw-word cause.
- Next diagnostic: inspect the original per-window words and the completed/
  incoming captions for a bounded adjacent-block pair around 1770 seconds,
  preserving the actual video decode and lookahead. Do not rerun an unchanged
  hour, drop uncertain lexical text or loosen timing guards to force a pass.

Independent scoped source and Chrome-hour acceptance do not approve this Edge
case. The pilot remains noindex; TR-03 remains blocked by this failure and the
remaining browser/file matrix, multilingual, codec/track, production privacy,
memory, device and seven-stable-beta-day contract. Campaign counts remain 22
approved, zero evidence-ready, four in progress and three blocked. The existing
owner preview at `http://127.0.0.1:4359/tools/audio-video-transcriber/` returns
200 with `noindex,follow`; it is intentionally left available. No deployment.
