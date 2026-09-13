# TTS Real Chrome Smoke: Independent Evidence Review

September 6, 2026. **Credible incomplete cold smoke; no completed inference proof. BR-04 remains NOT APPROVED/held.** The harness exit 1 and `passed: false` mean its completion criterion was not reached within this bounded attempt. They do not establish an application inference failure, product timeout or no-progress event.

## Observed Result

Reviewed the [harness](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke.mjs), relevant component/Kokoro worker/model source, exact BR-04 contract, full-check receipt/manifest, [raw report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke/2026-09-06T12-28-18.744Z/report.json) and [final screenshot](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke/2026-09-06T12-28-18.744Z/final-viewport.png). No second execution or download was performed.

The parent run used Node v24.20.0 and isolated installed Chrome **152.0.7977.83**, not account Chrome, with one short synthetic English sentence and voice `af_bella`. Page HTTP 200, noindex true, zero model requests before Generate. The actual built component and worker initiated real Hugging Face requests without request interception or a mocked model.

There are **60 samples**, ending at **300,537 ms**, still `Loading model.onnx`, `complete: false`. Rounded UI progress first reaches 2% at 255,461 ms and remains 2% at the end. The screenshot shows the same loading state and 300 seconds elapsed. The config-file 100% at five seconds is not whole-model readiness. No application alert or page error is recorded; request-failure list is empty. HTTP response statuses do not prove completed response bodies. No byte-throughput instrumentation exists, so neither the long 1% interval nor this bounded stop proves stalled transport or its cause.

The only output files are `report.json` and `final-viewport.png`: **no generated MP3, native decode, playback, voice-quality or successful unload evidence**. Those harness branches were not reached. WebGPU adapter readiness and the displayed fallback description do not prove a selected, initialized or successful inference backend. The 300-second sampling budget is a harness bound, not an application deadline; completedAt is **12:33:21.761 UTC**.

## Concrete Findings And Limits

**[P2] Mutable initial tokenizer configuration request, confirmed.** The trace begins its model requests with `huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/tokenizer_config.json`, returning 307 to the cache path containing `1939ad2a8e416c0acfeecc08a694d14ef25f2231`. Later tokenizer/config/model requests use that commit. The [worker](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/workers/kokoro.worker.ts:98) supplies `revision` to `AutoTokenizer.from_pretrained`, but the observed initial lookup is nevertheless mutable. This run's redirect match cannot establish future configuration identity or fully pinned asset retrieval. **Whether that lookup is only a configuration probe or can affect tokenizer/model selection is unresolved by this smoke.** Parent is inspecting the installed library; this review neither assumes harmlessness nor claims wrong model selection occurred. Preserve the request/redirect chain and resolve its role through that source review before any all-assets-pinned claim. No further network run is requested here.

**Privacy evidence is limited to this modified QA environment and loading phase.** The [harness](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke.mjs:30) applies restrictive QA CSP and owner analytics opt-out. All **33 observed requests** are GET with zero recorded body bytes; **14 model-host responses** are recorded. The exact sentence sentinel is absent from inspected URLs/bodies. Signed model paths and URL queries are redacted in retained logs. This supports no observed exact-sentence disclosure during this attempt, not a complete production privacy assessment: [the sentinel predicate](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke.mjs:73) does not cover every encoding, text fragment or derived representation, and generation never began.

A `local.adguard.org` script request and one CSP `script-src`/`eval` event attributed to that hostname are recorded. Therefore do not describe the environment as free of external injection or all requests as application/model assets. There is **no causal evidence here that AdGuard caused slow loading**; no protection was disabled. The final screenshot also retains the advertising-choice overlay: `overflow: false` is not comprehensive UI/accessibility approval.

**Build-provenance boundary:** the full-check manifest hashes source/public inputs but contains no `dist` entries. It demonstrates matching recorded inputs, while served hashes independently identify the built files actually observed. Those two records alone are not a hash mapping from each served bundle to that particular full-check build. The earlier receipt records a build at 10:50:31.555 UTC on revision `243d71d1d832b398cba86d5c7fcc70deefa25f25`; this review did not rebuild. No stale-bundle defect is established, but source equality must not be overstated as independently reproduced build provenance.

## Fresh Source Binding

R: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Independently rehashed all **2,137 non-agent manifest entries** at 12:33:05 UTC: zero drift. At 12:34:33 UTC, the six report source hashes and **17 served-file hashes** still matched; the current harness matches its recorded hash. The raw report also records zero source/served drift across its run.

| Evidence | SHA-256 |
| --- | --- |
| Raw smoke report | `6ad531bcc808cb6fcf06305835f322035a298e63e7e71e8991f4bbea511f2c18` |
| Harness | `699658aaebdb8b871e6dc3b1fe9885805013848a360008a74c26d75c4c1c4c56` |
| Full-check source manifest | `fccf5da7b384ee2b9feb67ea88199a393f032563e586b4c52cc55f2b6385878c` |
| Final screenshot | `0823148bebf83c80e0005ba3583c81d68ed9180702788cf2568b558a55d642a8` |
| TextToSpeechAudiobookGenerator.tsx | `c0c9522fb1225aac334f11beb6613a857a06404069d06b5a5fb361eeeab0d8df` |
| kokoro.worker.ts | `e5f4e5c24e697d77cbfb0dd372cf9d627b8815ae0a5910ab5eb5b69cfe4a6f6d` |
| browserTtsModels.ts | `b36da5c97d415ee040c78b3f16215567b710cf14e1d13f49774539ab8271cdff` |
| kokoroBrowserText.ts | `e6a236fe45ffea8c8a69d97f63eb905609766a6d306825c7e193bca3ba877843` |
| mp3Encoder.ts | `5d7188fac28f416ca2ed5c25534ae4edf865cb3277141b53b86015dccf9003a5` |
| package-lock.json | `8a11c438dc8ec46a6d288dc63ecc753d7f7375d20bbc2d55ed2a61f9c47bc48b` |

Commands were read-only PowerShell `Get-Content`, `Get-ChildItem`, `Get-FileHash`, targeted `rg`, and local screenshot inspection. Full hashes of served HTML/component/worker and other assets remain in the bound raw report. No harness or implementation artifact was modified by this judge.

## Acceptance And Cleanup

BR-04 still requires its existing real Chrome/Edge cold/warm Supertonic and Kokoro, 10,000-character jobs, chapter MP3/ZIP, repeated model switches, load failure/watchdog/cancel-retry, memory/recovery and network-sentinel evidence, plus explicit browser/device statuses, seven stable beta days and separate indexability judgment. This attempt closes none of the missing completed-inference/compatibility gates. No task state, requirement, timeout or deadline was changed, and TTS noindex stays required.

The harness [finally block](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/tts-audiobook-pilot/real-chrome-smoke.mjs:147) awaits context/browser and local-server closure; the completed report records `browserStopped: true` and `serverStopped: true`, consistent with the parent's exit-1 completion. This is cleanup evidence, not a worker-memory recovery measurement. The judge started no browser, server, inference or download; all read-only shell processes completed. **Only this named report was written.** No campaign/taskboard/worklog/product edits, account access, public actions or further probes occurred.
