# Transcriber Runtime Evidence, September 6

Scope: coordinator-owned local verification of the existing unpublished browser-transcriber worktree at `90d6dcab0580a91ca66382f2414d95e8817469e5`. No production deployment, indexability change, user media, paid inference, purchases or model revision changes. This report does not approve TR-03.

## Confirmed Results

- The existing bundled Chromium model-smoke runner passed at 05:16 UTC using the owned 5.544-second Bella sample. It generated non-empty TXT, SRT and WebVTT. Preserve `output/browser-transcriber-pilot/latest.json` as this specific historical artifact.
- Installed Chrome 152.0.7977.83 completed that short sample in the new runner's `observe-models` diagnostic mode in 37.5 seconds, including model loading. Its three export hashes matched the earlier smoke output.
- The same installed Chrome completed a synthetic 3,600-second MP4 in 822,104 ms, approximately 13 minutes 42 seconds including model loading. It processed 13 blocks, returned 9,472 transcript characters and 132 subtitle cues, and downloaded TXT (9,604 bytes), SRT (13,984 bytes) and WebVTT (13,572 bytes). The browser and loopback server stopped afterward.
- The hour MP4 SHA-256 is `ad1e1182755729174d8eecc12156d42df9ca18eaae5d5e94023e8aab260af250`. Its source is the owned Bella sample padded to a 30-second interval and repeated 120 times, combined with a plain synthetic video frame. It is not evidence for arbitrary speech, continuous dialogue or multilingual accuracy.
- Manual inspection of the hour result screenshot found readable controls and no visible overlap. Some phrases repeat or span separate speech bursts. Successful processing/export is not proof of accurate wording or speech alignment.
- The seven-case synthetic network mutation run detected GET query, POST body, beacon, worker request, telemetry-shaped JSON, custom header and encoded-path markers. This is scoped test sensitivity, not verification of production Clarity recorder payloads.
- The latest focused suite passed 133 tests in six files: 99 existing DSP/lifecycle/protocol tests plus 34 proof-helper tests. Log: `output/browser-transcriber-pilot/tr03-focused-final.log`.

All paths in this section are relative to `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`. Exact browser reports and screenshots:

| Test | Evidence directory | Result |
| --- | --- | --- |
| Chrome short | `output/browser-transcriber-pilot/compatibility/2026-09-06T05-35-50-668Z-chrome-short/` | Scoped inference pass |
| Chrome hour MP4 | `output/browser-transcriber-pilot/compatibility/2026-09-06T05-41-44-112Z-chrome-hour-mp4/` | Scoped inference pass, older proof predicates |
| Chrome seven mutations | `output/browser-transcriber-pilot/compatibility/2026-09-06T05-45-27-270Z-chrome-short-mutations/` | Seven detections, no inference |

## Failed Or Incomplete Evidence

- Installed Edge 152.0.4191.62 did not complete the short inference checks in either diagnostic mode. One intercepted run recorded HTTP/2 protocol errors; the available evidence does not establish their cause. Edge is not marked compatible.
- Initial `intercept-all` short runs stalled or failed in Chrome and bundled Chromium too. A later `observe-models` Chrome success does not prove request interception was the cause. Playwright still enables CDP Fetch when routes are present in that mode.
- The synthetic MP3 encoded to 3,600.072 seconds, beyond the application's hour limit and tolerance. Inspection did not reach model loading. Preserve that failed fixture and its hash; create a correctly bounded fixture rather than weakening the product limit.
- The hour MP4 run began before subsequent strict whole-subtitle/parity, distinct-worker and one-cue-per-speech-interval proof changes. Its recorded `pass` is not a pass of the latest harness. Only hashes/counts were saved by that runner, so the exported bodies cannot now be independently re-parsed from that report.
- Summed browser-process working-set samples reached about 1.37 GB and later fell to about 0.85 GB. These are intermittent whole-browser diagnostics, not a measured peak, proven memory ceiling or native-resource-release guarantee. One sample failed.
- Default routing has a documented redirect-observation gap; callback-filtered mode observes rather than prevents arbitrary remote egress. Supplied-header checks do not prove all cookies/security headers were examined. Reports retain these limits.

## Implementation And Remaining Gates

The coordinator added only `scripts/transcriber-browser-compatibility.mjs`, `scripts/lib/transcriber-browser-proof.mjs` and its test in the transcriber worktree. Existing application, worker, dependency, model, artwork and indexation files were not changed in this verification pass. The helper now rejects malformed subtitle bodies, compares generated formats and editable text, counts distinct live workers, detects the bounded synthetic marker channels and prevents one long cue from representing 120 separate speech bursts. See the independent [proof judge](transcriber-browser-proof-judge.md) for exact reviewed scope and limits.

TR-03 stays blocked on the complete browser matrix, correct one-hour MP3 fixtures, meaningful speech/marker alignment evidence, multilingual/codecs/multiple tracks, measured memory and interruption recovery, actual telemetry/privacy proof, built-artifact provenance and seven stable beta days. The tool and guide remain `noindex,follow`. No completion or release claim follows from this report.

September 6 later evidence: the [fixture and download follow-up](transcriber-download-fixture-followup.md) corrects the synthetic MP3 to exactly one hour, adds tested preflight and bounded download diagnostics, and records 711 passing tests. Fresh Edge-short and Chrome-hour runs failed during model loading. The fixture gate is repaired; strict hour/browser/privacy/beta acceptance is still open. Preserve this report's older results as historical rather than replacing them with a blanket pass.
