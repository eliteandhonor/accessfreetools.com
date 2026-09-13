# Transcriber Fixture And Download Follow-Up

September 6, 2026. Scope: local proof in `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus the preserved unpublished draft. TR-03 is not approved. No application, model revision, dependency, limit, privacy policy or indexability change was made during these runs.

## Fixture Correction

The original synthetic `hour.mp3` is preserved at 3,600.072 seconds. It was not a valid maximum-duration positive test. A sibling `hour-bounded.mp3` now probes at exactly 3,600.000 seconds, SHA-256 `7ba26f1a5282d710374e8e4838c8b03a7366b9732d10d519ae72f7681ac85b45`. The source is the existing owned synthetic hour MP4, with a 5.544-second voice sample every 30 seconds. The final 0.2 seconds of source audio were measured as silence; the encoding adjustment does not remove a speech burst. This is not varied dialogue or multilingual accuracy evidence.

The proof runner now rejects invalid fixture duration before opening its server/browser. Nine new tests failed before the helper was implemented, then passed. The exact FFmpeg command, hashes and source-silence check are in `output/browser-transcriber-pilot/fixtures/hour-bounded-provenance.md` in the transcriber checkout. No product limit or tolerance was relaxed.

## Real Browser Results

| Run | Result | Limits |
| --- | --- | --- |
| Edge 152.0.4191.62, short MP3, 08:15-08:25 UTC | Failed during model download | Final report records an HTTP/2 protocol error. Screenshot shows the model-download error and retry/reset controls, with zero captions. Earlier progress output lacked that final error; use the completed report. |
| Chrome 152.0.7977.83, corrected hour MP3, 08:27-08:37 UTC | Failed at the download watchdog | Fixture inspection succeeded at exactly 3,600 seconds. The encoder reached 4,974,394 of 10,097,112 bytes and decoder 4,797,875 of 30,729,881 bytes. The model never finished loading, so no hour transcription or export was tested. |

Evidence directories under `output/browser-transcriber-pilot/compatibility/`:

- `2026-09-06T08-15-29-775Z-msedge-short/`
- `2026-09-06T08-27-37-773Z-chrome-hour-mp3/`

Both completed reports record `browserStopped: true` and `serverStopped: true`. Both retain noindex, model-lazy and workspace-mask checks. Those individual checks are not a full privacy pass. No raw user media was used. The Chrome run reports `ERR_FAILED` and `ERR_ABORTED`, not the Edge HTTP/2 error. A successful read-only HEAD request for the pinned encoder separately established reachability only, not a reliable complete browser download.

These results do not establish that Edge is unsupported, that request interception caused the failure, or that any network/security product is responsible. The diagnostic runner still has Playwright routes enabled. No security control was disabled or bypassed, and no proxy/model revision was substituted.

## Bounded Diagnostics And Verification

The proof-only worker observer accepts numeric byte counters for exactly two public model filenames. It ignores other worker messages and retains current/max/total counts only. It does not persist text, audio, user filenames, cookies or signed download URLs. Two new regression tests failed before implementation and passed afterward.

- Fixture preflight focused suite: 43 passed after the nine additions.
- Download diagnostics focused suite: 45 passed after the two additions.
- Full transcriber suite after both changes: **711 tests in 74 files passed**, exit 0, `output/browser-transcriber-pilot/transcriber-download-diagnostics-full-tests.log`.
- Both TypeScript checks passed after the fixture change. Later changes affect proof `.mjs` only; no application TypeScript changed.
- Fresh build before the Edge/Chrome runs passed: `output/browser-transcriber-pilot/fixture-proof-build.log`.
- `download-progress-source.json` contains 437 source/config hashes and 69 built-artifact hashes. All 506 still matched after the Chrome run, with identical HEAD. Compare command: `node output/browser-transcriber-pilot/capture-fixture-proof-source.mjs --download-progress --compare`.

The snapshot proves no observed source/artifact drift during this specific run, not a deployed build identity. The earlier 709-test fixture-only suite and all red/failed logs are preserved separately.

## Next Gate

Do not repeat identical full-hour attempts while model loading remains the known failure stage. Isolate download reliability with a short owned fixture and an explicitly controlled, documented browser/network comparison first. Preserve cold-download evidence separately from any later warm-cache diagnostic. Keep the existing deadlines unless a separately reviewed product change is justified; do not increase a timeout merely to obtain a pass.

After reliable loading, rerun the strict whole-hour Chrome/Edge MP3/MP4 tests, then the remaining Firefox/WebKit, language/codec/track, silence/music, cancellation, bounded-memory and actual telemetry privacy gates. The previous older-predicate hour-MP4 completion is historical, not a substitute. Both routes remain `noindex,follow`; no beta clock, deployment, publication, purchase or discovery submission began.
