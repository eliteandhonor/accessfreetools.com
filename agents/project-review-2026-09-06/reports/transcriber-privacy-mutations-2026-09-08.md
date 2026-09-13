# Transcriber Privacy Detector Follow-up: September 8

Scope: the unpublished transcriber worktree's network-proof helper, not a public
release, model inference result, or complete production Clarity payload audit.

## Finding And Fix

The request classifier previously stopped URI decoding when any malformed escape
occurred in the concatenated URL, headers or body. A pinned model GET with encoded
synthetic private text in one header and `%broken`, `%FF` or `%E2%82` elsewhere was
incorrectly classified `model`. The same issue occurs inside a single header.
This was a false-negative in the test helper, not proof that application code
actually transmitted private data.

Use the platform's forgiving `URLSearchParams` decoder while protecting literal
ampersands and plus signs. The existing bounded decoding passes, origin allowlist,
model pins and start-action checks are unchanged. No request bodies or headers
are written to reports by this change.

## Executed Proof

Commands ran in
`C:/Users/chamb/OneDrive/Desktop/accessfreetools-browser-transcriber` on Node 24.

- RED at 08:45:10 UTC: `npx vitest run scripts/lib/transcriber-browser-proof.test.mjs`
  failed all three new malformed-escape cases: expected `blocked-private-data`,
  received `model`; 45 existing cases passed.
- GREEN at 08:45:33 UTC: the same command passed all 48 cases after the fix.
- Real browser proof at 08:48:55 UTC:
  `npx vitest run scripts/lib/transcriber-browser-privacy.test.mjs scripts/lib/transcriber-browser-proof.test.mjs`
  passed 55 tests across two files in 1.84 seconds.
- The seven real isolated Chromium mutations cover query text, POST body,
  `sendBeacon`, dedicated-worker fetch, synthetic recorder JSON, a private header,
  and percent-encoded private header mixed with an invalid escape.
- Every mutation is observed as exactly one `blocked-private-data` result. The
  local receiver count remains unchanged after each attempted leak. Contexts,
  the synthetic worker and its blob URL, browser, and loopback server are closed.
- No speech model, real recording, user browser profile, telemetry service,
  advertising service or production endpoint participates in these tests.

## Exact Files

SHA-256 values after the passing combined run:

| File (relative to transcriber worktree) | SHA-256 |
| --- | --- |
| `scripts/lib/transcriber-browser-proof.mjs` | `a25b843900bd2d1ad2987c520e8464c3f5eacb3abff25441a45be918244ae62d` |
| `scripts/lib/transcriber-browser-proof.test.mjs` | `6012fcf920b17b93bd031239b8e9ae2ea9b82c4e87d6d5659efd0d5c873af385` |
| `scripts/lib/transcriber-browser-privacy.test.mjs` | `1d33a88f5909bd9b8929b787df8dec360cb98d66ca233b186a23f857511125e5` |

## Remaining Gates

This establishes the synthetic mutation subcheck, not whole TR-03 approval.
Actual application privacy behavior, model compatibility, repeated-speech
alignment, complete long-file matrix, memory bounds and seven stable beta days
still require their own fresh proof. The new test remains separate from the
runtime alignment experiment. No task status, noindex setting or deployment
changed. Full integrated checks and independent review remain pending for this
increment.

## Independent Findings And Closure

The independent reviewer identified two additional bounded issues: the third
decoded representation was discarded without checking, and rejected browser
shutdown could skip server cleanup. The triple-encoded pinned-request regression
failed at09:07:51UTC (1/49failed). The loop now checks raw plus three decoded
forms while still performing only three decoding passes. This is not an
arbitrary-encoding detection guarantee. Server shutdown now runs in `finally`.

At09:08:19UTC the combined command passed56tests/2files, including all seven
actual Chromium mutations. Final helper SHA256:
`cc95bebcd8b008b484949f4e541f3e082c06dd29070bf25846e16102e43c03ef`;
unit test SHA256 `42b7b5aa21fd2e61c458bbbf317662f192d29f5476106b464af5382a416801de`;
browser test SHA256
`eaeaeccded9e4eb5df6b871b921382ad627f116dc0818ed823331581922bf82d`.

The uncapped full check failed two unrelated five-second SEO/API test timeouts.
Applying the previously independently reviewed four-worker configuration from R
made all756tests/77files and every later gate pass, with zero audit findings.
That report is T/output/browser-transcriber-pilot/integration/
2026-09-08T09-04-02.903Z/report.json. It precedes the final two helper hardening
changes above, so it is not the final revision's full-check receipt.

## Final Integrated Check

The final revision passed `npm run check` at09:14:46.795UTC:757tests/77files,
both TypeScript lanes, build, later visual/accessibility/schema/image/AI-asset
checks, secret redaction, and zero audit findings. Nine selected source/config
hashes stayed unchanged throughout. This is local dirty-branch verification,
not deployment approval. Six existing soft image/CSS/worker-size warnings remain.

Report: T/output/browser-transcriber-pilot/integration/
2026-09-08T09-11-54.973Z/report.json.
Raw log SHA256:
`c17568000b5c0304da9cb809dde23ae616493880513897aaa5a205c78f1d66c9`.
Earlier failed and intermediate passing receipts remain preserved.
