# Transcriber Browser Preflight And Download Follow-Up

September 9, 2026 AEST; executions below are September 8 UTC. Local, unreleased
work in `accessfreetools-browser-transcriber` (T). No Hostinger, production,
indexability, account, promotion or dependency changes were made.

## Implemented And Verified

Windows Playwright WebKit 26.5 could inspect an MP3 container but lacked the
native audio decoder. The old error told users to convert that MP3 to MP3 or WAV.
An optional worker-reply field now reports native decoder availability. Only
when no track is decodable and the field is explicitly false, the page says:

> This browser is missing the audio-decoding support this file needs. Try a current desktop version of Chrome or Edge.

The heading is `Audio decoding unavailable`. A decodable PCM track still wins
over the diagnostic flag; this is not a global WebKit or API-presence block.
The old codec guidance remains for a present or unknown native API. Exceptional
worker decoding errors are outside this narrow no-decodable-track fix.

Four mounted React cases and two actual-worker protocol cases cover missing,
present and absent metadata, retained PCM support, request identity, no ASR
worker and inspection-worker cleanup. Expected RED was observed before edits;
the two focused files subsequently passed **79/79 tests**. Independent static
review found no required-change issue. The inspect-only provenance service found
zero suspicious Unicode characters in the new copy; no cleanup was performed.

Full `npm run check` passed **1,109 tests in 85 files**, both TypeScript lanes,
build, all later gates and **zero vulnerabilities** on Node 24.20.0. It completed
at 14:34:44.374 UTC with all 32 selected source hashes unchanged. This is not a
full-worktree or deployment approval. Six existing soft asset warnings remain.

- Receipt: `T/output/browser-transcriber-pilot/integration/2026-09-08T14-31-33.237Z/report.json`.
- Log SHA-256: `2ea245177bbf93d31e44b15a8e887a0c407639f6fb6d6d5317dd56a6311bf2ef`.
- `npm run transcriber:browser-check` passed at 14:35:32.870 UTC; its model-smoke
  status is `not_run`, not inferred inference proof.

## Actual Built Browser Evidence

Paths below are relative to `T/output/browser-transcriber-pilot/`.

| Evidence | Result | Boundary |
| --- | --- | --- |
| `webkit-preflight-mp3-2026-09-08T14-35-05-603Z/report.json` | Corrected heading and message, disabled start, no model request or page error; source/build unchanged; browser closed | Inspection only in Windows WebKit 26.5, not Safari or iOS support |
| `webkit-preflight-wav-2026-09-08T14-35-24-725Z/report.json` | Same missing API, but PCM WAV reaches Ready; no model request or page error; source/build unchanged; browser closed | File preflight, not completed PCM inference |
| `compatibility/2026-09-08T14-35-52-160Z-chrome-short/report.json` | Chrome 152.0.7977.83: fresh download, 5.544-second synthetic MP3, 14,449 ms processing, two valid cues and TXT/SRT/VTT | One short cold-download success, not reliable service or hour acceptance |
| `compatibility/2026-09-08T14-37-30-801Z-msedge-short/report.json` | Edge 152.0.4191.66: fresh download, same short fixture, 18,538 ms processing, two valid cues and TXT/SRT/VTT | Same scoped limitation |

Both new Chrome/Edge runs used a fresh isolated browser context and the standard
request policy, without `--verified-model-cache`, model fulfillment or an altered
worker. Each records completed encoder (10,097,112 bytes) and decoder (30,729,881
bytes) downloads. The reports retain one blocked environment request and
`ERR_FAILED`/`ERR_ABORTED` counts, so they are not described as error-free networks.
They pass the harness's request-policy, masking, lazy-load, export, source/build
and cleanup checks. Three tracked workers terminate, no tracked workers or object
URLs remain, and the owned browser and server are stopped.

The post-fix MP3 error screenshot was visually checked: complete readable text,
no heading/control overlap. This does not replace the separate mobile/device gate.

## Failed Compatibility Results Remain Visible

- Firefox 153.0 completed the 900-second synthetic MP3 in 656,799 ms, retaining
  all 30 known speech intervals, but **67 cues contain six timing overlaps**.
  `compatibility/2026-09-08T14-08-51-908Z-firefox-quarter-hour-mp3/report.json`
  fails `validExports`; other recorded checks and cleanup pass. There is no
  sampled-memory proof for that run. This is not an approved 15-minute limit.
- The initial WebKit quarter-hour run could not begin inference. The follow-up
  preflight diagnosis establishes the missing decoder in that environment;
  the corrected message is not 15-minute transcription proof.
- The earlier current-ASR Edge hour MP4 retains 120/120 speech intervals but has
  **14 overlaps across 255 cues**. Its receipt predates only the new preflight
  field/message and tests; it is not relabeled a current-build pass.
- The centered-context experiment remains rejected. Do not add more ASR context
  searches, delete uncertain words, shift source timestamps or relax export
  assertions to turn these failures green.

## Next Gates

The fresh current-build Chrome hour MP3 completed at 14:44:50.295 UTC, using
remote model downloads with no local model fulfillment. It **failed validExports**:
267 cues contain 26 overlaps, while all 120 known speech intervals remain.
Processing took 368,948 ms. All other recorded checks pass, with unchanged
selected source/build hashes, three terminated workers, zero tracked live
workers/object URLs, and owned browser/server stopped. Receipt:
`compatibility/2026-09-08T14-38-38-623Z-chrome-hour-mp3/report.json`.
Neither successful network delivery nor preserved interval coverage fixes
subtitle timing or proves every spoken word was transcribed correctly. Do not
repeat another unchanged hour run until a supported implementation change exists.

TR-01/TR-02 local acceptance stands; TR-03 is blocked. Current counts remain
22 approved, zero evidence-ready, four in progress and three blocked.

Complete the outstanding named-browser hour matrix, non-English/codec/track
fixtures, memory/privacy proof and seven stable beta days before release or
indexability. The separate [TTS cold retry](tts-cold-retry-2026-09-09.md) now
passes one actual Chrome short Kokoro generation and non-silent MP3 download.
Two QA-only CSP omissions were corrected; the product code was unchanged.
The independent judge accepts that scoped receipt, not broader Kokoro/Supertonic
readiness or BR-04 completion.
Production coverage and independent deployed-source proof remain separate tasks.

Source review: [Independent local judge](transcriber-local-acceptance-2026-09-08.md).
Earlier inference details: [Boundary follow-up](transcriber-boundary-followup-2026-09-08.md).
