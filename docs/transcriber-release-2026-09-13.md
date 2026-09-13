# Browser Transcriber Release

Owner authorized a complete reviewed project release and searchable audio tools
on September 13, 2026, superseding the earlier transcriber-only noindex proposal.
Keep Astro 7 and Node 24 on the existing Hostinger plan. No purchases, server media
processing, upload endpoint, or new API/MCP method.

## Usable Scope

One local audio/video file, up to 60 minutes and 250 MB. Inspect its audio tracks
before loading a model, select a supported track and language, then generate an
editable draft. Download TXT, SRT or WebVTT, including completed partial work.
Stop/resume retains completed text in the current tab; download before closing.
Whisper may omit, repeat, mistranscribe or invent speech. Human review is required.

Whisper Tiny English/multilingual revisions and Mediabunny 1.55.5 remain pinned.
WASM is the default; WebGPU is optional. The recording, decoded audio, transcript,
filename and language are not sent to a transcription server. Private workspace
surfaces remain Clarity-masked and inside INFOLINKS_OFF boundaries. Only anonymous
action events may be recorded; no media/text/filename/language payloads.

## Initial Release Evidence

Source-equivalent local work passed 1,181 tests and audit zero. Four synthetic
60-minute MP3/MP4 cases passed in actual Chrome 153 and Edge 153. Fifteen-minute
Firefox 153 MP3 and Windows WebKit 26.5 PCM cases also passed. Windows WebKit MP3
decoding was unavailable and correctly rejected before model loading. This is
not Safari/iOS/Android or general transcription-accuracy certification.

Two actual-recorder masked cases plus a deliberately broken-boundary positive
control passed independent local review. This is a bounded local test, not a
claim of production-wide telemetry auditing. Existing warnings and unsupported
combinations remain explicit; the free price is not a reason to waive privacy.

The clean release starts from main18ebd554 and retains its security patches.
The original transfer receipt binds 63 transcriber files to reviewed source;
the project integration manifest adds the reviewed correctness, privacy, runtime,
frontend, evidence and release-tooling changes without editing their worktrees.
Fresh release build/tests, browser checks, Linux CI and live generation/download
verification are required before recording publication.

## Search And Follow-Up

The owner explicitly requested indexability rather than another timed beta hold.
TTS, the transcriber, and both guides use the ordinary indexable page policy and
join the XML sitemaps. Privacy, support, feed and admin exclusions are unchanged.
Submit the four newly eligible URLs only after live robots/canonical/sitemap and
functional checks pass. Eligibility and submission do not prove Google indexing.
The earlier seven-day hold is superseded as a release requirement, not recorded
as a test that passed. Further language, codec, physical-device and performance
measurements remain follow-up work, with no universal compatibility claim.

Google's noindex documentation confirms this is a per-page indexing restriction:
https://developers.google.com/search/docs/crawling-indexing/block-indexing

Rollback: revert this bounded release on main and redeploy the previous known
good security version if new runtime, privacy, sitemap or critical tool failures
are confirmed. Preserve unrelated dirty worktrees and user data.
