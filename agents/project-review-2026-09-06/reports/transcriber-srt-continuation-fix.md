# SRT Continuation Fix

September 6, 2026. **Source frozen; source/dependency lock released. No implementation or test commands remain pending.** Coordinator-authorized bounded implementation only, not independent approval. The owner contract remains unchanged.

## Changes And Identity

T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, branch `codex/browser-transcriber-pilot`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus preserved dirty work.

| Authorized File | Change | Frozen SHA-256 |
| --- | --- | --- |
| [browserTranscriber.ts:327](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.ts:327) | Small local SRT line serializer; only SRT region changed. | `132a633067b774150b2ac08bb12d305bc0d6a60d7fa109667ac8330c5d5f1c23` |
| [browserTranscriber.srt.test.ts](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.srt.test.ts) | Six portable regressions using the existing investigated fixtures. | `191ce913bc9d8337f915995d0e2f3b5f0e4b395269f010609f8e45f9f3cdb66e` |
| [browserTranscriber.tr02.test.ts:480](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:480) | One actual mounted five-cue edit/download regression, with optional ignored artifacts. Existing tests/assertions retained. | `735cf296de6942c53393c5f3c57a9a16028898534784811368f211f9df952fce` |

The serializer counts UTF-8 bytes with TextEncoder and iterates Unicode code points. Each literal character and its markup guard remain one atom. Before an atom would exceed the 1,000-byte physical-line margin, it emits `<font SPACE LF></font>`, reserving six bytes for the first marker half and counting the eight-byte second half on the next line. This is not an input cap. Original text line breaks and blank/trailing-space guards remain. No truncation, displayed reflow, cue splitting, invisible Unicode marker or decoder dependency was added.

The parser basis and standards limitations are documented in the [source-backed investigation](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/agents/project-review-2026-09-06/reports/transcriber-srt-line-investigation.md). The tested LF is consumed inside FFmpeg's recognized font start tag, not by an invented continuation decoder. [Official FFmpeg 7.1 markup parser](https://github.com/FFmpeg/FFmpeg/blob/n7.1/libavcodec/htmlsubtitles.c#L95).

## Exact Results

E: [output/browser-transcriber-pilot/srt-continuation-fix](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/srt-continuation-fix).

| Check | Before Fix | After Fix |
| --- | --- | --- |
| Seven focused files, maxWorkers=1 | Verified RED: 126 pass / 6 fail, 132 total; no skips or harness errors. | 132/132 pass, no failures/skips/todo; 22.49 seconds, started 11:40:38 UTC. |
| Existing independent width/semantic script | 36/48 pass; 12 SRT failures. | 48/48 pass, including all existing SRT/VTT widths. |
| Actual mounted five-cue SRT download through FFmpeg | FAIL: imported lengths 300, 4097, 5129, 4137, 4637. | PASS: exact lengths 292, 4096, 5120, 4136, 4620, five cues and original times. |
| Actual mounted five-cue WebVTT through FFmpeg | PASS. | PASS; same exact texts and times. |
| Original independent mounted 291/292-amp download tests | Original failing evidence preserved, not overwritten. | 2/2 pass; started 11:42:17 UTC, 1.81 seconds. |
| Original minimal and independent probes | 18/22 pass; four TR-01 alignment failures. | Same 18/22; all subtitle imports pass. Four unchanged TR-01 failures remain. |

The mounted test edits five real caption textareas, clicks the real SRT/WebVTT/TXT buttons, and captures download events. Text includes the exact 292-amp and 4096-ASCII gaps plus the already-investigated long markup/UTF-8, whitespace/blank-line and literal-tag fixtures. Native imports preserve times 0-1, 2-3, 4-5, 6-7 and 8-9 seconds. The component/serialization is actual code; workers and media are synthetic. The retained screenshot is an unstyled functional harness, not production visual approval.

Native proof uses the existing `ffmpeg-win-x86_64-v7.1.exe` under the local imageio_ffmpeg installation, executable SHA-256 `2ce797a0f88d7f067180338fb227f7b1928ea727bd9a4d7a1d022f7c52af71a3`. Arguments remain `-hide_banner -loglevel error -nostdin -threads 1 -protocol_whitelist file,pipe -i INPUT -map 0:s:0 -c:s ass -f ass pipe:1`, with the original 10-second bound. The exact existing ASS comparator is applied to each cue; no reader repair or comparator change. Portable structural assertions are not presented as independent import proof.

## Commands And Preserved Evidence

From T, using the single owned `run.mjs` wrapper:

```powershell
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs before
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs focused red
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs focused red-verified
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs native-ui red-verified
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs originals red
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs focused green
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs native-ui green
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs originals green
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs mounted-original
node output/browser-transcriber-pilot/srt-continuation-fix/run.mjs freeze
```

The first RED run retained five genuine unit failures but its new mounted case used the wrong `VTT` button label and timed out. That diagnostic and unhandled rejection are preserved under `E/red/`, not counted as a mounted product reproducer. Correcting only the locator to `WebVTT` produced the clean pre-fix six-failure run under `E/red-verified/`; no timeout/assertion was relaxed. Its actual downloaded SRT then failed native import. All production edits followed this verified RED evidence.

Original scripts were copied only into E. Independent scripts change only owned/root output bindings; the original mounted wrapper changes only its generated config include path. Reader commands/assertions are unchanged; original/executed hashes are recorded. `E/green/focused-command.json`, `E/green/originals/`, `E/green/ui/native-imports.json` and `E/mounted-width-tests.json` retain complete results. The original 292-amp/4096-ASCII failures and all 289 prior proof files remain byte-identical.

## Freeze, Cleanup And Limits

The retained [freeze record](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/srt-continuation-fix/freeze.json) compares 276 pre-existing source/package/dirty paths: only the two authorized existing files changed, plus the separately hashed new SRT test. Zero unexpected drift; zero prior-evidence drift. Scoped diffs are under `E/diffs/`. Merge, ASR, component, noindex/indexation, TXT/VTT implementation, model pins, deadlines, dependencies and unrelated dirty work are untouched. The coordinator's earlier 739-test full check is not new-patch proof.

All test/FFmpeg commands exited; owned Chromium closes in awaited afterAll hooks and mounted flows end with zero live fake workers. No server was started. Final cleanup has zero unresolved owned processes. Its raw PID query also found an unrelated setup process created at 11:39:27 UTC whose parent PID was reused by an FFmpeg child from the 11:42:17 UTC mounted run. Creation time proves it predates this harness; it was not touched. The initial cleanup diagnostic is preserved separately. No owned execution was abandoned.

No full check, build, installation, full typecheck, inference, user media/browser, package change, commit or deployment was performed. No new arbitrary fixture matrix was added. Other readers, exhaustive arbitrary accepted text/control sequences and full application integration remain outside this bounded proof; the owner exact literal/blank/RTL contract is not narrowed. The four original TR-01 exact-alignment failures remain real and separately recorded. **No independent approval is claimed. Source is frozen and available to the waiting judge; no further source/test execution is planned.**
