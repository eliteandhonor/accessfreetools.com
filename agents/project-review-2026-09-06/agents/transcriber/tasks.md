# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions. The local implementation and [runtime evidence](../../reports/transcriber-runtime-evidence.md) do not establish release readiness.

Current checkpoint: [September 13 hour matrix](../../reports/transcriber-hour-matrix-2026-09-13.md).
After the security refresh, the check passes 1,181 tests/audit0 and all four
actual Chrome/Edge hour MP3/MP4 cases pass: 240 cues, zero overlaps and 120/120
intervals each. Earlier bounded Stop/edit/resume proof remains valid for its
exact scope. Windows WebKit MP3 is correctly rejected before model download.
Firefox 15-minute MP3 and Windows WebKit 15-minute PCM WAV now also pass: 60
cues, zero overlaps, 30/30 intervals, valid exports and cleanup each. These use
verified cached models and do not prove cold delivery or Safari/iOS support.
Broader language/codec/track, privacy/device/memory and beta gates remain open.
No TR-03, transcriber deployment or indexability approval.
Historical checkpoints follow and do not supersede this entry.

Earlier checkpoint: [September 9 browser preflight and downloads](../../reports/transcriber-browser-preflight-2026-09-09.md).
TR-01/TR-02 are locally approved. Current normal check passes 1,109 tests and
zero audit findings. Built WebKit has corrected unsupported-MP3 guidance and
retains PCM readiness. Fresh Chrome/Edge short inference downloads and exports
pass. Firefox's 15-minute run fails six timing overlaps; hour MP4 is still red.
The new Chrome hour MP3 retains 120/120 intervals but fails 26 overlaps across
267 cues. TR-03 and release remain blocked. Paragraphs
before the individual task definitions below are retained historical checkpoints.

Latest [independent SRT judgment](../../reports/transcriber-srt-continuation-judge.md)
approves TR-02's own exact acceptance locally and closes the source-line defect.
TR-02 is evidence_ready, not campaign-approved, because its declared TR-01
dependency remains open. TR-01 preserves uncertain speech with a warning, but
exact source-overlap reconstruction is not proven. The original failures remain
recorded. No truncation, reflow, smaller input cap or task-contract waiver occurred.
The historical [cold Chrome download probe](../../reports/task-acceptance-and-download-followup.md)
failed its unchanged model-load deadline. September8 pinned English/multilingual
test caches are now complete. The [initial offline decoder failures](../../reports/transcriber-alignment-outcome-2026-09-08.md)
are historical. The [new frame-bound and word-evidence implementation](../../reports/transcriber-word-alignment-implementation-2026-09-08.md)
passes actual isolated English boundary and English/multilingual-model samples.
Three independently found merge edge cases plus a Copy-order omission now have
regression fixes and [scoped independent closure](../../reports/transcriber-alignment-source-rejudge-2026-09-08.md).
Neither full task acceptance nor product release is claimed.
That earlier empty204 response is historical. The newer
[current browser integration](../../reports/transcriber-current-browser-integration-2026-09-08.md)
uses verified cached models without changing the product worker. Named Chrome
and Edge completed short inference. A Chrome hour MP3 completed but failed
caption timing and speech coverage. Point-alignment and independent recognition
windows recover all 10/10 first-block speech intervals, but conflicting overlap
hypotheses still fail subtitle timing. The final local check passes 968 tests,
both compiler lanes and all later gates with zero vulnerabilities. Both scoped
source judges have completed; neither approves full TR-01. Resolve the saved
150-second first-block case before another full-hour run.
No task, download-delivery or beta gate is waived.

## TR-01: Preserve repeated speech and source timing

Priority: P1. Status: approved. Lane: unreleased-transcriber.
Depends on: none.

Completion: Deduplicate only actual source overlap; preserve separated repeated words and CJK. Resampling maintains fractional phase/timestamp gaps and is packetization-invariant within1sample. Null end timestamps use a bounded defensible interval. Full-hour marker error separated from ASR alignment.

Evidence command(s): `npm test; npm run transcriber:browser-check`.
Evidence output: `output/project-review-followup/TR-01/`.

## TR-02: Fix cancellation, subtitle round trips and stalled-job recovery

Priority: P2. Status: approved. Lane: unreleased-transcriber.
Depends on: TR-01.

Completion: Abort/stale operation never spawns fallback workers; Stop/Reset/replacement/unmount leave no workers or stale state. Real WebGPU failure retries once. Independent SRT/VTT import preserves literal text/blank lines/RTL; no-progress state has measured recovery and retains completed blocks.

Evidence command(s): `npm test; npm run transcriber:browser-check`.
Evidence output: `output/project-review-followup/TR-02/`.

## TR-03: Complete privacy and real-browser beta gates

Priority: P1. Status: blocked. Lane: unreleased-transcriber.
Depends on: TR-01, TR-02, SEC-01.

Completion: Mutation tests detect synthetic GET/body/beacon/worker/telemetry leaks without saving sensitive strings. Named real Chrome/Edge finish60min MP3/MP4; Firefox/WebKit10-15min checked; languages, codecs, tracks, exports and memory measured. Noindex remains until all gates plus7stable beta days and separate authorized indexability release.

Evidence command(s): `npm run transcriber:browser-check; npm run check; node scripts/seo-agent-workbench.mjs all audio-video-transcriber tool; node scripts/seo-agent-workbench.mjs all audio-video-transcriber blog`.
Evidence output: `output/project-review-followup/TR-03/`.

Current gate, September 13: the independent checkpoint judge accepts the normal
Edge hour MP4 (240 cues, zero overlaps, 120/120 intervals) and bounded join
Stop/edit/resume proof within their recorded scopes. See
../../reports/transcriber-checkpoint-judge-2026-09-13.md. September 9 full check
passed1,171 tests with all32 selected hashes still matching; its audit0 is stale.
SEC-04 handles11 fresh advisories before more transcriber runs. Complete
browser/file matrix, language/codec/track, memory, production privacy, physical
devices and7stable beta days remain open. TR-03 stays blocked.

Historical gate: ../../reports/transcriber-quiet-cuts-2026-09-09.md supersedes
the historical test/failure details below, not acceptance rules. Current full
check passes1154 tests/audit0; normal cold Chrome hour MP3 passes120/120 known
intervals,240cues,zerooverlaps. Current Edge hour MP4 fails four overlaps at joins
1770 and3540seconds despite120/120intervals; next is a bounded raw-word diagnosis.
Independent scoped
source/first-block review is complete; no TR-03 or deployment approval follows.
See ../../reports/transcriber-boundary-followup-2026-09-08.md and the
independent transcriber-local-acceptance-2026-09-08.md. TR-01/TR-02 have local
approval on strict-point and optional-context source; fullcheck1,103tests/audit0
passes. Current bounded Chrome video passes20/20intervals/zerooverlaps, but
current hourEdgeMP4 still fails14overlaps/255cues despite120/120coverage.
Centered-context diagnosis failed and remains output-only. Paired source-word
retention tests are independently accepted. Full current compatibility,
privacy, cold delivery, memory and beta remain open.
No deployment approval; local task approval does not waive TR-03.
