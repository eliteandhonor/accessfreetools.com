# September 13 Transcriber Hour Matrix

T = `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`.
These four cases ran after the reviewed dependency refresh on the current built
app. No checkpoint, overlap, word-retention or export tolerance was weakened.

| Actual Browser | Synthetic File | Processing | Cues | Speech Intervals | Timing Issues |
| --- | --- | --- | --- | --- | --- |
| Chrome 153.0.8010.36 | 60-minute MP3 | 314,627 ms | 240 | 120/120 | 0 |
| Edge 153.0.4234.32 | 60-minute MP3 | 307,905 ms | 240 | 120/120 | 0 |
| Chrome 153.0.8010.36 | 60-minute MP4 | 296,886 ms | 240 | 120/120 | 0 |
| Edge 153.0.4234.32 | 60-minute MP4 | 292,291 ms | 240 | 120/120 | 0 |

All use normal fresh remote model delivery, the normal compatibility runner and
unchanged application workers. No cached response fulfillment, source-offset
wrapper, recognition mock or shortened fixture was used. All 13 checks in each
receipt pass; all TXT/SRT/WebVTT exports pass validation. Each closes its three
tracked workers and leaves zero tracked workers/object URLs, then stops the
owned browser and server. The separate user preview at port 4359 remains open.

Summary with exact receipt paths, fixture/export/source hashes and current
reverification: `T/output/browser-transcriber-pilot/hour-matrix-2026-09-13.json`.
Regenerate with `node output/browser-transcriber-pilot/summarize-sep13-matrix.mjs`.
It requires all 120 observed intervals and rehashes 10 source, five harness and
68 built files for each case. Package and lock hashes are included separately.
The full-check receipt is
`T/output/browser-transcriber-pilot/integration/2026-09-13T04-13-23.618Z/report.json`:
1,181 tests, no skips, audit0 and 32 unchanged selected source hashes.

Whole-browser working-set peaks ranged from 1,289,695,232 to 1,376,788,480 bytes.
These samples are not native allocation/leak proof, throughput promises or a
mobile memory guarantee. The fixture repeats known owned speech; interval
coverage does not establish word accuracy for arbitrary recordings.

## Remaining Gates

The current Windows WebKit 26.5 MP3 preflight correctly rejects its missing
native decoder before model download, with no page errors and unchanged source.
Receipt `T/output/browser-transcriber-pilot/webkit-preflight-mp3-2026-09-13T04-34-21-737Z/report.json`.
This is an unsupported combination, not Safari or iOS testing.

### Firefox And WebKit Follow-Up

Both additional full 900-second tests now pass all 13 checks on unchanged
application source and built assets. Each retains 30/30 expected speech intervals
in 60 cues, with zero timing issues and valid TXT/SRT/WebVTT exports. Three tracked
workers terminate, zero tracked workers/object URLs remain, and the owned browser
and local server close. Both use verified cached responses at the original pinned
model URLs, so they are not cold external-download proof.

| Browser | File | Processing | Receipt Directory Under T/output/browser-transcriber-pilot/compatibility/ |
| --- | --- | --- | --- |
| Firefox 153.0 | 15-minute MP3 | 506,462 ms | 2026-09-13T04-54-30-809Z-firefox-quarter-hour-mp3/ |
| Windows Playwright WebKit 26.5 | 15-minute PCM WAV | 91,154 ms | 2026-09-13T05-03-39-616Z-webkit-quarter-hour-wav/ |

Receipt SHA256 values respectively:
`c69fbd070b236af324e4ebe0fa07f2923d8aa29be42fd0196483ab6abc5388f8`
and `d2d5dabbd382365cb3f10ed1b4a63df5a5eb133996073580f1a36c02da8cf545`.
These engines have no CDP process memory samples in this harness. Do not interpret
the timing difference as a benchmark between equivalent codecs or cold states.
The WebKit screenshot was visually checked: readable captions, seek controls and
download actions. The scrollable caption pane is not the complete exported file.

WAV provenance is retained in
`T/output/browser-transcriber-pilot/fixtures/quarter-hour-wav-provenance.md`.
It decodes the owned MP3 to mono 16 kHz PCM and adds only 72 ms of terminal silence
to reach exactly 900 seconds; all 30 speech bursts remain. The output-only harness
keeps the strict 30-interval predicate and changes only fixture/container scope.
This closes the local named-engine duration checks, not real Safari/iOS support.
Multilingual, broader codec/track cases, recorder/production privacy, native
memory, physical devices and the beta interval remain separate gates.

TR-03 remains blocked and the tool/guide remain unpublished, noindex beta work.
Seven stable beta days cannot begin or be inferred from these local checks.
No Hostinger transcriber deployment, model change or indexing submission occurred.
