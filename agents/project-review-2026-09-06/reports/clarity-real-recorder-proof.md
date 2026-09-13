# SEC-02 Real Clarity Recorder Proof

Date: 2026-09-06. Specialist implementation/evidence only; no task, manifest or release approval.

## Result

**Local real-recorder gate passed: 14/14 cases.** Twelve masked cases cover six actual React workflows at 1365x900 and 390x844. Two deliberately broken-boundary cases prove that the same detector catches exposed alphabetic content. This is recorder payload evidence, not a DOM-attribute-only result or a claim based on the earlier full check.

Final post-isolation run: `2026-09-06T09:14:13.579Z` through `2026-09-06T09:15:21.711Z`, Node `v24.20.0`. It captured and decoded **77 real SDK uploads: 63 gzip and 14 plaintext final uploads**, with **0 decode failures**, **0 private-marker hits in the 12 masked cases**, and **62 decoded masked-surface checkpoints**. Every case observed discovery, later mutations, readable public DOM controls, hydration and two result runs. All 14 contexts and the owned browser closed.

| Workflow | Masked desktop/mobile | Decoded checks per viewport | Coverage |
| --- | --- | --- | --- |
| OCR | Pass / Pass | 6 | Real image preparation and UI; synthetic recognizer output, second output, error, retained history |
| Summary | Pass / Pass | 4 | Synthetic model response through actual summary renderer; second result and history |
| Keywords | Pass / Pass | 4 | Actual local keyword logic, outputs and history |
| Text Case Converter | Pass / Pass | 4 | Actual converter, outputs and history |
| Password Generator | Pass / Pass | 2 | Actual generator with temporary deterministic alphabetic RNG; two synthetic values, never credentials |
| Ask | Pass / Pass | 11 | Locally fulfilled response; answer, inputs/results, assumptions, steps, warnings, second result and error |

Negative controls use the same actual Text Case Converter and Ask components, with only the source-derived wrapper mask omitted from the **ephemeral fixture**, before recorder discovery. They detect **3/3** and **4/4** private markers respectively, including the hydration probe and both result values; Ask also detects the error marker. These are expected positive detections of deliberately unmasked data. No source mask was removed. Ordinary public controls are not force-unmasked: they remain alphabetic text outside the workspace under the SDK's sensitive-content default.

## Source And Scope

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, branch `codex/gpt6-review-implementation`, with coordinator/specialist changes already present. HEAD alone does not identify this dirty source: the final JSON binds the component bundle and 16 inspected source/test/helper files to SHA256 and verifies them unchanged after the run.

Read root and campaign `AGENTS.md`, `campaign.json` SEC-02, `reports/clarity-settings-verification.md`, `scripts/check-clarity-masking.mjs`, `scripts/lib/clarity-masking-fixture.mjs`, `scripts/lib/clarity-masking.test.mjs`, `tests/clarity-boundaries.spec.ts`, package/test setup and the current component renderers/logic. The existing boundary is `src/pages/tools/[slug].astro:4106`; Ask's wrapper is `src/pages/ask.astro:37`. `src/components/BaseLayout.astro:136` loads the hosted tag in the actual app; that account-specific loader is not executed here.

Owned implementation:

- `scripts/check-clarity-recorder.mjs:36`: separate, explicitly invoked exact-SDK acquisition; no install scripts or package manager invocation.
- `scripts/check-clarity-recorder.mjs:97`: adaptation of the existing in-memory component harness. Real React `renderToString` then `hydrateRoot`; the official recorder starts before hydration. Wrappers come from the existing Astro AST helper, not copied mask assertions. A supplemental alphabetic paragraph inside the wrapper tests initial discovery; result/error markers go through the actual components.
- `scripts/check-clarity-recorder.mjs:239`: catch-all request interception; official recorder POST bodies are decoded before a local synthetic success response. No request is continued or fetched upstream.
- `scripts/check-clarity-recorder.mjs:289`: fake project, full playback, `content: true`, no selector overrides, no persistent tracking; real SDK masking/encoding/compression/transport code remains unmodified.
- `scripts/lib/clarity-recorder-proof.mjs:6`: bounded gzip/plain transport decoding, JSON/version checks and the injected official decoder. Raw wire and decoded objects are transient memory only.
- `scripts/lib/clarity-recorder-proof.mjs:68`: decoded masked text is traced through recorder node ancestry to the workspace and output classes; history checks additionally require an `OL` ancestor. These checks examine the decoded recording, not live `data-clarity-mask` attributes.
- `scripts/lib/clarity-recorder-proof.mjs:94`: fail-closed evidence decision. Empty/inactive capture, missing controls, decode failures, absent discovery/mutation, lack of hydration/rerender, and unexpected private-marker hits cannot pass. Broken-boundary mode instead requires every private marker to be detected.
- `scripts/lib/clarity-recorder-proof.test.mjs`: two focused tests covering transport limits, malformed/gzip input, decoded masking, redacted summaries, missing capture/controls, wrong versions, decoder errors and positive leak detection.

No application, component, layout, security logic, package/lock, campaign/task/approval, shared `node_modules` or shared `dist` edits. No full check, site build or install was run by this specialist. The parent may rebuild `dist` independently: this proof does not consume it.

## Official SDK Provenance

The exact published pair is **Microsoft `clarity-js` and `clarity-decode` 0.8.68**, MIT license, publication git head `ff66ffc1cce7f60e8be2a32866f13505b89e5f07`. The browser executes the unmodified official `build/clarity.min.js`. Node runs the matching official `build/clarity.decode.js` in a bounded VM with diagnostic output reduced to counters. No fake recorder or hand-rolled Clarity decoder is used in real mode. Unit tests use injected fixtures to test failure handling only.

Recorder SHA256:
`84e72e402c83dea9d77a81089113a0342d185649ac9fb5088cdadae99c346996`

Decoder SHA256:
`eb5ccdfb750c9645e7833ab1f98db576f5247a6d096fd462be7ec7a949762cad`

Both archive SHA512 integrity values are pinned in the runner and verified before extracting fixed members. Every run rechecks archive integrity, executable hashes, package name/version/repository/license, and retained LICENSE/NOTICE hashes. `sdk-provenance.json` records URLs, archive SHA256/SHA512, executable hashes and notice hashes. SDK archives/builds/notices remain under ignored `output/project-review-followup/SEC-02/recorder/sdk/`. Executable/package files are under its **output-only nested `node_modules/<package>/`**, never the shared root dependencies. They are not production dependencies. The initial GitHub master package version was 0.8.69, unavailable from the registry; it was not substituted or claimed as executed. The actual registry pair acquired was 0.8.68.

Primary sources checked:

- [Microsoft Clarity repository](https://github.com/microsoft/clarity): identifies recorder and decoder packages.
- [Microsoft masking documentation](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking): explicit descendant masking and default Balanced behavior. Alphabetic sentinels avoid relying on automatic number/email masking.
- [Pinned recorder defaults](https://github.com/microsoft/clarity/blob/ff66ffc1cce7f60e8be2a32866f13505b89e5f07/packages/clarity-js/src/core/config.ts), [DOM privacy selection](https://github.com/microsoft/clarity/blob/ff66ffc1cce7f60e8be2a32866f13505b89e5f07/packages/clarity-js/src/layout/dom.ts), [upload transport](https://github.com/microsoft/clarity/blob/ff66ffc1cce7f60e8be2a32866f13505b89e5f07/packages/clarity-js/src/data/upload.ts), and [decoder](https://github.com/microsoft/clarity/blob/ff66ffc1cce7f60e8be2a32866f13505b89e5f07/packages/clarity-decode/src/clarity.ts): inspected exact package sources locally from the integrity-checked archives. `content: true` selecting `Privacy.Sensitive` is a source-derived configuration match to Balanced, not a downloaded account configuration.
- [Published recorder archive](https://registry.npmjs.org/clarity-js/-/clarity-js-0.8.68.tgz) and [published decoder archive](https://registry.npmjs.org/clarity-decode/-/clarity-decode-0.8.68.tgz).

## Commands And Evidence

Run from the above worktree with default Node 24:

```powershell
.\node_modules\.bin\vitest.cmd run --configLoader runner scripts/lib/clarity-recorder-proof.test.mjs --maxWorkers=2 --reporter=default --reporter=json --outputFile=output/project-review-followup/SEC-02/recorder/unit-red.json
node scripts/check-clarity-recorder.mjs --acquire-sdk
node scripts/check-clarity-recorder.mjs --real
.\node_modules\.bin\vitest.cmd run --configLoader runner scripts/lib/clarity-recorder-proof.test.mjs --maxWorkers=2 --reporter=default --reporter=json --outputFile=output/project-review-followup/SEC-02/recorder/unit-green.json
node --check scripts/check-clarity-recorder.mjs
git diff --check -- scripts/check-clarity-recorder.mjs scripts/lib/clarity-recorder-proof.mjs scripts/lib/clarity-recorder-proof.test.mjs
```

RED was executed before the helper existed: exit 1, unresolved helper import, zero tests collected. GREEN: exit 0, **2 tests passed**, one file, two-worker cap. These were the only two focused unit-test invocations. Acquisition, final real mode, syntax and scoped diff checks exited 0. `--real` is offline and never acquires missing SDK files automatically; missing or mismatched SDK evidence blocks it.

Earlier setup attempts rejected the package metadata URL normalization and CommonJS/browser entrypoint assumptions before a successful recording run. The first complete matrix had 10 passes and four harness failures: the OCR helper had changed from the older fixture, and summary history contains status text rather than the private summary. Preserved count/hash-only artifact: `real-recorder-initial-failed.json`. The final fixture uses actual OCR image validation with a generated 8x8 PNG, stubs only the current recognition boundary, and tests actual summary-history rows. No product logic or privacy acceptance was weakened. Final evidence: `real-recorder-proof.json`, `sdk-provenance.json`, `unit-red.json`, `unit-green.json`, all under the ignored recorder directory.

### Integration Cleanup And Final Hashes

The initial manual SDK inspection extraction put vendor `src`/`types` trees under ordinary ignored output. Git ignore does not exclude TypeScript inputs: the parent reported approximately 1,000 TS7/TS6 diagnostics from those trees. This was harness pollution, not an application regression. Resolved absolute source/destination paths were checked to remain inside `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/SEC-02/recorder/sdk` before native PowerShell moves. No files were deleted, and no TypeScript configuration/assertions were changed.

Inspected source/type trees now live in `sdk/node_modules/clarity-js-inspection/` and `sdk/node_modules/clarity-decode-inspection/`; all executable package files live in `sdk/node_modules/clarity-js/` and `sdk/node_modules/clarity-decode/`. Archives remain in `sdk/<package>/package.tgz`, with LICENSE/NOTICE retained. The acquisition runner was changed to extract **only** the selected executable and `package.json` to nested `node_modules`; it never extracts TypeScript source members. `node scripts/check-clarity-recorder.mjs --acquire-sdk` was rerun successfully after isolation. Resolving the unchanged `tsconfig.json` with `typescript.readConfigFile` and `typescript.parseJsonConfigFileContent` reports **0 SDK project files and 0 configuration errors**; saved in `typescript-input-isolation.json`. Parent owns the actual TS7/TS6 full-check rerun.

The changed runner was verified with the final `node scripts/check-clarity-recorder.mjs --real` run above, exit 0, and a fresh syntax check. The preceding passing run is retained as `real-recorder-before-sdk-isolation.json`; it is not the final runner identity.

- Final runner SHA256: `137a470ee615e4dfd64e9b5aa5c7fefd62f03eca88b77bad3714616bf0ae339e`.
- Final `real-recorder-proof.json` SHA256: `7a0d49bf3a8de71275da96a9388d4e8fce88c0016f324c0af422d64838489e2e`.
- Official SDK executable hashes above remain unchanged. **Shared `dist` is unused and may be rebuilt now.** No owned recorder/browser process remains; no server was started.

## Privacy And Resource Bounds

- Each case owns a fresh nonpersistent browser context, no authenticated profile, real user input, media, credential, visitor recording or account configuration. Only alphabetic synthetic markers and an in-memory generated PNG are used.
- Every HTTP(S) request is fulfilled from memory or aborted. Collector/fallback points to reserved `collector.clarity.invalid`; collector POSTs receive empty synthetic responses locally. Unknown non-image/font traffic fails the run. WebSocket connections are closed without connecting to a server; service workers are blocked. Actual collector domains, APIs, model downloads, image/font beacons and unexpected endpoints have no forwarding path.
- A second browser barrier routes traffic through loopback-only `127.0.0.1:9`, with loopback bypass disabled, external DNS resolution disabled, background networking disabled, QUIC disabled and nonproxied WebRTC UDP disabled. Post-run listener check found no listener on that port. No server was started; virtual page origin is `http://127.0.0.1:43289` and does not require that port to be free.
- Public SDK/license acquisition uses bounded GETs only, in the separate `--acquire-sdk` command before recording. Real mode does not call Node fetch or any live service. No telemetry leaves the machine.
- Recorder bodies, decoded text, input values and console/error text are never written to disk or emitted. Saved recording evidence contains only booleans/counts/hashes plus fixed test labels, version/path/configuration metadata and timestamps. No screenshots, traces, HAR, videos or session replay files are produced. The retained SDK files are third-party source artifacts, not recordings; license and copyright notices are preserved.
- Capture limits: 64 accepted payloads / 16 MiB per case, 2 MiB compressed input / 8 MiB decompressed output per packet, 50,000 decoded nodes, 2-second VM decode deadline. Sequential contexts only, 8-second browser actions, bounded 12-second polling, 5-minute browser-run watchdog, context/browser cleanup in `finally` and interruption handling. Final JSON confirms every context closed and `browserClosed: true`; process inventory found no surviving owned runner/browser.

## Remaining Gates

Confidence is high for **this exact official SDK version and these current source-derived component cases**. This fills the missing bounded local recorder-payload evidence; it is not approval of SEC-02 or live closure.

1. Release Judge must independently review the implementation, controls, hashes, scope and campaign acceptance. No specialist task/manifest status was changed.
2. Coordinator owns current full check, integrated Astro loader/build evidence and exact release identity. Existing integrated/opt-out evidence is in `clarity-settings-verification.md`; this runner neither consumes nor refreshes it. Rerun the recorder proof if any bound app/helper/SDK source changes.
3. Production/project-tag SDK version, served configuration, deployment and post-deploy boundary/opt-out parity remain unverified here. The earlier read-only account report remains distinct evidence. The runner does not fetch or inspect account recordings, establish historical disclosure, or prove all production sessions private.
4. Real OCR/model inference, every tool variant, browser engines other than Chromium, real devices, media pixels/canvas, and all possible third-party scripts are outside this bounded text-recording proof. OCR/summary inference and Ask backend responses are explicit synthetic fixtures; their rendering/masking paths are real. No account/IP, billing, paid, public, deployment or automation changes were attempted.

Minimal next action: independent SEC-02 judgment using this report and the exact final JSON alongside the coordinator's integrated evidence. No new campaign or broader implementation task is needed.
