# TR-02 SRT Line Investigation

September 6, 2026. Bounded read-only-source investigation, not implementation or acceptance. **A viable named-reader encoding was found. The frozen application still has CR-TR02-02; no task contract changed.**

## Finding

An empty supported font start tag can contain a physical newline without adding a decoded subtitle newline:

```js
const continuation = '<font \n></font>'; // ASCII space BEFORE the LF is essential for FFmpeg 7.1.
```

Insert this marker only between complete encoded literal atoms, before a source line exceeds a conservative UTF-8 byte width. The experiment uses 1,000 bytes including marker overhead, not a caption input limit. Literal text, original text line breaks, cue count and times remain unchanged. There is no truncation, displayed-text reflow, cue splitting, invisible Unicode character, custom inverse decoder or comparator alteration.

Five long-text candidates and the direct syntax control pass through the exact named FFmpeg 7.1 importer. Both original counterexamples remain byte-identical and failing in separate retained cases. Therefore an unconditional claim that this named-reader width problem is impossible would be incorrect. Conversely, these experiments do not prove universal SRT-reader portability or the entire arbitrary accepted-input contract.

## Parser And Standards Basis

FFmpeg n7.1 `libavformat/srtdec.c`, source lines 127 and 145-169, uses 4,096-byte line buffers and appends LF after the chunks it reads. `libavformat/subtitles.c`, lines 423-442, reads at most buffer size minus one, leaving the rest for another call. Thus one physical source line longer than 4,095 UTF-8 bytes becomes multiple payload lines. This explains both a neutral tag split into visible fragments and an extra newline in plain ASCII. It is a reader implementation limit, not a universal SRT limit. [Official SRT demuxer](https://github.com/FFmpeg/FFmpeg/blob/n7.1/libavformat/srtdec.c#L127), [official line reader](https://github.com/FFmpeg/FFmpeg/blob/n7.1/libavformat/subtitles.c#L423).

FFmpeg n7.1 `libavcodec/htmlsubtitles.c`, lines 95-113, scans short tag contents through LF until `>`. Lines 198-199 separate the tag name at an ASCII space; lines 211-262 recognize `font` and consume that complete tag. An empty attribute-free font push/pop adds no output. Consequently the embedded LF never reaches the ordinary newline branch at lines 155-162. This is the recognized font path, not an invented tag relying on the unsupported-tag discard branch. Without the ASCII space, FFmpeg treats the newline as part of the tag name and the control fails. [Official markup decoder](https://github.com/FFmpeg/FFmpeg/blob/n7.1/libavcodec/htmlsubtitles.c#L95).

The continuation is compatible with HTML tag syntax: whitespace is allowed after an attribute-free tag name before `>`. FONT is a historical, deprecated HTML formatting element, not a newly proposed SRT extension. That establishes legitimate markup syntax, **not a normative SRT continuation guarantee**. [HTML start-tag syntax](https://html.spec.whatwg.org/multipage/syntax.html#start-tags), [W3C historical FONT definition](https://www.w3.org/TR/html401/present/graphics.html#edef-FONT).

SRT supports limited HTML-derived formatting with reader-dependent rendering. No reviewed authoritative source establishes that every SRT reader must carry a tag across physical lines. The exact claim here is **HTML-syntax-compatible continuation using a tag explicitly supported by the named FFmpeg reader**. A requirement for universal standards-mandated SRT continuation remains unproven and must not be silently substituted for, or assumed from, this result. [Library of Congress format description](https://www.loc.gov/preservation/digital/formats/fdd/fdd000569.shtml).

## Twelve Purposeful Cases

One helper, one execution, exactly twelve import cases; no sweep or retries. All FFmpeg invocations return exit 0 and one cue with the expected timestamps. PASS additionally requires exact literal text using the retained judge comparator. Expected-failing controls remain labeled FAIL, not counted as passing tests.

| Case | Exact Text Result | Maximum SRT Source-Line Bytes | Purpose |
| --- | --- | ---: | --- |
| 01 Original actual UI download, 292 ampersands | FAIL: 300 instead of 292 characters | 4,101 | Preserved exact mounted counterexample. |
| 02 Original 4,096 ASCII export | FAIL: 4,097 instead of 4,096 | 4,109 | Preserved exact long-ASCII counterexample. |
| 03 Raw 4,096 ASCII without neutral expansion | FAIL: 4,097 instead of 4,096 | 4,096 | Proves expansion removal alone cannot solve long lines. |
| 04 Continued 292 ampersands | PASS: 292/292 | 999 | Original failing text, candidate encoding. |
| 05 Continued 4,096 ASCII | PASS: 4,096/4,096 | 1,000 | Original failing text, candidate encoding. |
| 06 Continued long markup/entities/Arabic/CJK/emoji | PASS: 5,120/5,120 UTF-16 code units | 998 | UTF-8 byte accounting and intact code points. |
| 07 Continued long text, indentation, trailing spaces, blank lines and timestamp-like text | PASS: 4,136/4,136 | 1,000 | Original meaningful whitespace/lines retained. |
| 08 Continued literal neutral tags and entity spellings | PASS: 4,620/4,620 | 1,000 | Literal marker-like content remains literal. |
| 09 `A<font SPACE LF></font>B` | PASS: `AB` | 29 including header | Recognized neutral start-tag semantics. |
| 10 `'A<font></font>\nB'` | FAIL: `A` LF `B` | 29 including header | LF outside the tag is a displayed line break. |
| 11 `'A<font\n></font>B'` | FAIL: 9 instead of 2 characters | 29 including header | Without SPACE before LF, the tag is not recognized. |
| 12 Original WebVTT 4,096 ASCII | PASS: 4,096/4,096 | 4,096 (VTT) | Same reader, unchanged VTT regression control. |

Summary: **7 exact round trips pass, 5 baseline/negative cases fail; helper exit 1 deliberately retains those failures.** The five long candidate fixtures plus the recognized-marker control are 6/6 exact passes. All fixtures are synthetic text, not recordings.

The original mounted ampersand file has times 0-1 seconds. Other experiment inputs use 1.12-4.87 seconds, including the candidate for the same ampersand text; each import is checked against its own unchanged input times. This is serializer experimentation, not a fresh mounted candidate download or UI acceptance claim.

## Evidence And Reproduction

- T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5` plus preserved dirty source.
- Read the rejudge report, current TR-02 campaign doneRule, root/campaign instructions, production serializer and exact retained reader/comparator. TR-01 was not investigated.
- Installed package versions were read locally: `fast-uri 4.1.3`, `qs 6.16.0`. The coordinator's reported 739-test full check is not independent defect closure.
- Only the named R report and ignored [investigation directory](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/srt-line-investigation) were written. All manual helper/report edits used apply_patch.

Command, from T:

```powershell
node output/browser-transcriber-pilot/srt-line-investigation/investigate.mjs
```

Executed at **11:26:53.843-11:26:55.104 UTC** with Node v24.20.0. [The helper](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/srt-line-investigation/investigate.mjs) imports the current production leaf via in-memory type stripping and changes no source. It verifies that the unwrapped experimental atoms equal the existing serialization. Every case retains its raw input, expected text, raw ASS output and imported text. [results.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/srt-line-investigation/results.json) includes exact arguments, hashes, cue counts/times, differences, all child PIDs/statuses and cleanup.

The executable is `C:/Users/chamb/AppData/Roaming/Python/Python313/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe`, reporting `7.1-essentials_build-www.gyan.dev`. Each importer retains the judge arguments:

```text
-hide_banner -loglevel error -nostdin -threads 1 -protocol_whitelist file,pipe
-i OWNED_INPUT -map 0:s:0 -c:s ass -f ass pipe:1
```

The same 10-second process bound and existing ASS comparator are used. No decoder option, style-removal rule, newline conversion or expected text was changed to admit continuation. Node network access is blocked by the existing read-only no-network preload; FFmpeg permits only file/pipe protocols. Official documentation/source browsing was the only external access, with no assets or executables downloaded.

| Identity | SHA-256 |
| --- | --- |
| Frozen `src/lib/browserTranscriber.ts` | `6c64e766a597ac3d9950efdd1cf91f9130832c6578925b2e045dc2a88a788a17` |
| Current `package.json` | `661307ba26dd5672d57840cbd0bd54039916feeb3bcc945917ac19db3e8d42b2` |
| Current `package-lock.json` | `300d08394c840f51bbf04dfc34ce61578f40064af24158590c9cf3d02ac7cbba` |
| Named FFmpeg executable | `2ce797a0f88d7f067180338fb227f7b1928ea727bd9a4d7a1d022f7c52af71a3` |
| Owned helper | `00b8fb902cedb06921a648e04f775d860f804b5707e787e47bc5c73c4f2107ec` |
| Original mounted 292-amp SRT, byte-identical copy | `0e1364e7594b2f32bd89664e262da3cb40d932f9c012f17475e0a4d0183cfbe2` |
| Original 4,096-ASCII SRT, byte-identical copy | `82b33897e520e644d6897a23f04589438f18cc3840f8c65603c6f1005fec93e4` |

## Next Decision And Limits

**Recommended next bounded decision:** authorize implementing UTF-8-byte-bounded serialization with the tested empty-font continuation, preserving complete escape atoms, all actual text line breaks and existing blank/trailing-space guards. This addresses the confirmed width mechanism without an input cap or displayed reflow. Keep the original failures and unchanged reader assertions, then obtain actual mounted download proof for the candidate and independent rejudgment. No implementation authorization or acceptance is inferred from this investigation.

The 1,000-byte value is an internal source-line margin, not a maximum caption length. The approach emits more markup as input grows. It does not require compressing text, deleting tokens or selecting new timestamps. A production implementation must count encoded UTF-8 bytes, reserve both sides of the marker, and avoid cutting Unicode code points or literal-escape atoms. Arbitrary string slicing or merely placing empty tags beside a normal line break is not equivalent.

Untested here: other SRT readers, fresh mounted candidate UI exports, multiple-cue candidate files, exhaustive accepted Unicode/control/ASS-like input, pathological allocation limits, CRLF-specific candidate files, and whole-task/full-suite regression. No universal lossless SRT assertion follows from these twelve cases. The owner's literal-preservation contract remains unchanged, and TR-02 remains unclosed until implementation and independent acceptance evidence exist.

## Stopped Resources

The helper's `finally` snapshot compared **260 source/package paths with zero drift**. Its thirteen synchronous FFmpeg children (one version query plus twelve imports) all exited 0. A restricted CIM query for those exact owned PIDs and direct children returned **zero processes**, exit 0, at completion; no process was killed. The Node helper itself returned exit 1 after writing evidence because the five failures remain recorded. No browser or server was started. No user Chrome, media, inference, dependency install, application/test edit, build, full check, campaign-state edit, commit, deployment or secret access occurred.

**Source lock: none held.** Investigation execution is finished; report writing does not hold a source or dependency lock. No additional probes are planned or running. The continuation is a viable bounded implementation candidate for the named reader, not self-authorization to edit production. Any implementation awaits a separate parent/coordinator assignment, with the owner task contract and independent acceptance gate unchanged.
