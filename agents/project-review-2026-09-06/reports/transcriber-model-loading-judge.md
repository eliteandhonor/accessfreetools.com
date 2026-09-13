# Model Loading Help: Independent Amendment

September 6, 2026. **LOCAL APPROVE for this three-file correction. No new defect found.** This preserves the prior TR-02 local acceptance and SRT finding closure; campaign TR-02 approval remains held by **TR-01 NOT APPROVE**. Its four original grouped-timing failures are not waived or rerun here.

## Review

The load-timeout message now says: "Check your connection and retry. Shortening the recording does not reduce the model download." This is phase-appropriate recovery advice, not a diagnosis of why loading was slow. Other phases retain their previous advice. The local `recovery` string keeps the change readable and confined to error presentation.

Only [lifecycle error copy](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.ts:71), [idle/deadline assertions](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriberLifecycle.tr02.test.ts:51) and [mounted alert assertions](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/src/lib/browserTranscriber.tr02.test.ts:241) changed. Reversing exactly those additions **in memory** reproduces all three prior independently frozen SHA-256 values. No application/test file was edited by the judge. Load idle/deadline limits remain 120,000/600,000 ms; all other limits, progress accounting, timers and control paths are unchanged.

## Frozen Evidence

T: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`. [Before/reverse-diff proof](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/timeout-help-judge/before.json) and [after snapshot](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/timeout-help-judge/after.json) bind the correction against the preceding SRT judge freeze across 277 source/package/dirty paths. Exactly the three declared files differ from that freeze; zero drift occurred during this run. Original RED/GREEN reports remain unchanged.

| File | Fresh SHA-256 |
| --- | --- |
| src/lib/browserTranscriberLifecycle.ts | `462369fbe194164e92483f3fed568c9ff8883125557db3ab10a401511b89e179` |
| src/lib/browserTranscriberLifecycle.tr02.test.ts | `b5f1cfd38fa57e393cc794077d2c68651a76ce4849ea5928273c464c0d4c2843` |
| src/lib/browserTranscriber.tr02.test.ts | `3a3731f6bf01cf6167dc83569398c4c254efabd0d7403da9e8e0e4b8f4687109` |
| Unchanged src/lib/browserTranscriber.ts | `132a633067b774150b2ac08bb12d305bc0d6a60d7fa109667ac8330c5d5f1c23` |
| Unchanged src/workers/transcriber-asr.worker.ts | `613a21d90e64101004c1f7a233e91b747ef5ff3e0b242361b4d1ed1162007167` |

Saved RED evidence is **67 passed / 3 failed / 70 total**: load idle help, load deadline help and actual mounted alert. Fresh independent execution is **70/70 passed, two files, zero failures**, 22.36 seconds starting **12:12:39 UTC**. It includes 15 lifecycle tests and 55 actual mounted/export tests, retaining worker termination/no-fallback and retry checks. Source-only in-memory fixtures use synthetic media/model outcomes, not user Chrome or inference. The parent GREEN claim is not substituted for this fresh run.

Command from T: `node output/browser-transcriber-pilot/timeout-help-judge/judge.mjs`. The retained [command](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/timeout-help-judge/command.json) invokes only the two named files with `--maxWorkers=1 --no-file-parallelism --no-cache --configLoader runner`; [results](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/timeout-help-judge/focused.json) and verbose log are preserved. Node networking and mounted page requests are blocked.

## Cleanup And Limits

[Cleanup proof](C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber/output/browser-transcriber-pilot/timeout-help-judge/cleanup.json) records zero remaining traced test/browser child processes, query exit 0 and **dependency/install lock released**. All execution is complete. Only this report and ignored `timeout-help-judge/` evidence were written; no source edits, new matrix, model download, shared build/install/full check, timeout changes or acceptance changes occurred.

The parent's four-second CSP probe and saved 600-second loading report were not independently rerun. This amendment makes no causal claim that AdGuard caused slow loading, no claim that the absolute cap was a no-progress event, and no inference/device/beta approval. Parent full-check work remains separate and cannot override the retained TR-01 failures.
