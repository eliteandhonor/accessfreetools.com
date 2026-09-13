# September 13 Local Verification Closeout

Coordinator checkpoint, 05:43 UTC. This is completed local work and a release
handoff, not completion of the overall goal or authorization to deploy R/T.
The existing campaign remains 23 approved, zero evidence-ready, four in progress
and three blocked. No duplicate campaign, purchase, advertisement, promotion,
indexing request or automation mutation was made in this closeout.

## Release State

- Security `18ebd554` is already live on Hostinger Node 24/Astro 7 after Linux
  CI and independent review. Ask/API/MCP and 663 sitemap URLs pass. Three client
  assets match local bytes; no exact server-source attestation is claimed.
  See [security evidence](security-sep13-remediation.md).
- N, `C:/Users/chamb/OneDrive/Desktop/accessfreetools-review-correctness`, is
  clean at `0c78956b6a4b25a15bcb4b5398461e0ff14d7c00`. Its 22-file calculator,
  JSON safety and release-identity candidate passes 902 tests and 132 browser
  cases with independent local acceptance. It remains unpushed and undeployed;
  the requested bounded owner approval is unanswered. See
  [candidate judge](review-release-scope-2026-09-13.md). R's new test-runner
  correction has not been silently copied into that frozen candidate.
- R, `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, remains a
  dirty integration checkout, not a wholesale release. Original promotion
  work and N/T source were not edited during the smoke follow-up.
- T, `C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber`,
  remains unpublished/noindex. Four Chrome/Edge hour MP3/MP4 cases and two
  fifteen-minute Firefox/WebKit cases pass. Its real recorder has independent
  acceptance for two masked cases and a detected broken-boundary control.
  See [duration matrix](transcriber-hour-matrix-2026-09-13.md) and
  [recorder judge](transcriber-recorder-judge-2026-09-13.md). Model pins and app
  behavior were unchanged during these checks. Local preview 4359 remains open.

## Smoke Findings And Fixes

The inherited Astro CLI smoke launcher could exit while its detached preview
continued running. Only the identified owned N preview PID 6976 was stopped.
R now uses Astro's public in-process preview API, awaits actual Playwright
close, and bounds owned-process cleanup on errors/signals. Twenty-six focused
tests include real preview exit-0/exit-7 port-release checks. Parent reviewed
the runner and independently executed the focused suite; the implementer did
not independently approve their own runner code.

The first actual suite correctly failed: 133 passed, three failed. Two failures
were obsolete shared-token admin expectations, contrary to the independently
accepted no-persistence implementation. The replacement test seeds synthetic
legacy credentials, verifies hub clearing without losing owner opt-out, checks
real destination links, and requires blank password forms and noindex. An
intermediate new test incorrectly called Analytics token "Admin token";
its failed receipt is retained and the locator now matches the actual label.
No product auth behavior or existing server authorization test was changed.

The remaining failure measured a mobile JSON event-loop delay of 7,522.9 ms
against the unchanged 5,000 ms limit under ten concurrent browser workers.
Three isolated runs at both widths passed with approximately 31 ms rejection.
Default Playwright workers are now bounded to four; two full 136-case runs pass.
This supports resource contention but does not establish a unique root cause
or promise performance on other hardware. No timing threshold, assertion,
test selection, JSON logic or privacy check was relaxed. Final in-page rejection
and post-frame response were at most 55 ms desktop and 34.1 ms mobile. Full
test wall times were 44.7 and 30.1 seconds, including automation and screenshots;
those are not conversion latency and remain a suite-runtime observation.

## Final Receipts

All following paths are under R/output/security-sep13/.

| Evidence | Directory | Outcome |
| --- | --- | --- |
| Focused runner | 2026-09-13T05-20-57-088Z-smoke-runner-parent-focused/ | 26/26 pass |
| Original smoke | 2026-09-13T05-25-09-040Z-review-owned-smoke-final/ | 133 pass / 3 fail; owned preview closed |
| Isolated JSON | 2026-09-13T05-31-52-505Z-json-timing-workers-1/ | 3 rounds, both widths, all pass |
| Corrected smoke | 2026-09-13T05-35-26-310Z-review-smoke-admin-current-contract/ | 136/136 pass |
| Final normal full check | 2026-09-13T05-36-37-720Z-review-final-admin-smoke-contract/ | 2,529 tests / 109 files, both TypeScript lanes, build, later gates, audit zero |
| Final rebuilt smoke | 2026-09-13T05-40-56-345Z-review-final-rebuilt-smoke/ | 136/136 pass, exit 0, owned preview stopped |

Final full-check stdout SHA256:
`318627f50a6ad8ba17cec2212ab376189403f40f688acc201c0ecdf30bba8220`.
Final rebuilt-smoke stdout SHA256:
`7cd8f4e2bf38f575da79d333edfcdf0111a7cf5dfa0e53cee5fdf0e2cb678481`.
`final-smoke-binding-2026-09-13.json` captures 12 source/config hashes before
and after the final smoke, all unchanged, plus separate prior/final timing
records. This is a bounded snapshot, not a whole-worktree source attestation.
The generic command receipts alone bind three dependency files, not every source.

R/output/release/full-check.json correctly records exit 0, Node 24, clean false
and verified false. Five inherited PNG/CSS soft-budget warnings and 55 manual
accessibility checks remain; automated passes are not conformance certification.
[Independent follow-up judgment](smoke-followup-judge-2026-09-13.md) accepts the
corrected admin/config scope and local smoke evidence. Current port inspection
shows no 4363 listener; the intended user preview 4359 still belongs to PID24376.
All required command sessions completed. No user browser was stopped.

## Remaining Work

- RJ-02 / OP-01: obtain the bounded correctness-release approval, then run its
  Linux CI and verify Hostinger runtime/source identity and affected live flows.
  Security-only approval does not authorize every dirty product patch.
- SEC-03: local admin/rate-bucket mitigations are accepted; production forwarding
  trust remains unproven. Do not infer an attack or expand ad exposure.
- BR-04: complete the remaining TTS recovery, model-switch, memory and device
  checks, followed by its own stable beta interval and indexability judgment.
- TR-03: complete multilingual and broader codec/track fixtures, production-tag
  and pre-hydration privacy, memory/device checks and seven stable beta days.
  Windows WebKit PCM is not Safari/iOS proof; its MP3 decoder is unsupported.
- EV-04: verify a durable production analytics interval before trend claims.
- EV-05: obtain current event-definition coverage, owner exclusion and at least
  100 real starts before considering another game. Local tests are not demand.

These are retained acceptance gates, not failed work hidden by passing local
checks. No whole-goal completion or beta/indexability claim is made.
