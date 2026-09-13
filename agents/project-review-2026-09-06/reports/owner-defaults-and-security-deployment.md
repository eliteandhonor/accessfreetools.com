# Owner Defaults And Security Deployment

September 6, 2026. This checkpoint supersedes earlier unanswered-decision notes,
without changing their historical evidence or accepting unproven work.

## Authorized Decisions

The owner answered the bounded security release request with: "Yes Please make
all assumptions for best recommendations". The coordinator selected:

- Deploy only the independently reviewed dependency commit now. Keep Astro 7
  and Node 24. Do not include dirty promotion, transcriber or broader review work.
- Remove reusable admin tokens from browser persistence. Require explicit entry
  in each private workflow, with closure-local memory cleared on logout/navigation.
  Do not introduce cookies, a new origin, DNS changes or a paid service.
- Bound each existing server rate-limit map to 4,096 active keys. Preserve the
  existing per-key allowances/windows and active buckets. At capacity, reject new
  keys with 429 and Retry-After until a slot expires. Limit stored keys to 256
  characters; do not add a background timer or assume proxy trust.
- Use internal word timing as the candidate transcription overlap approach, but
  retain sentence-level captions. Require real pinned decoder proof before
  integrating or enabling it. No new model, invented timing or relaxed timeout.
- No purchases, VPS, server inference, ads, promotion, content/indexing changes,
  or automatic waiver of device, privacy, beta and production measurement gates.

Admin and rate-limit changes are a separate local implementation and review.
This authorization does not say they were included in the dependency release.

## Dependency Release Facts

Clean release checkout:
`C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-security-release`.

Commit `b4fffbc40ac4896d9168512638da1ea26fd053c9` changes only `package.json`,
`package-lock.json` and the dependency override regression test. It pins
fast-uri 4.1.3 and qs 6.16.0. The original dirty promotion checkout was preserved.

The post-commit candidate check at 12:51:53 UTC recorded 2,325 tracked file hashes,
zero source drift and a stable clean HEAD. Focused tests and the full check passed:
567 tests in 68 files, both TypeScript lanes, build and zero audit findings.
Evidence: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-security-release/output/sec01-candidate/2026-09-06T12-51-53.950Z/report.json`.
Its earlier generic `deploymentApproved: false` field predates the owner's
authorization and is preserved rather than retroactively modified.

The branch was pushed, then `main` fast-forwarded without force from
`90d6dcab0580a91ca66382f2414d95e8817469e5` to this exact commit.
[GitHub Quality run 34034590676](https://github.com/eliteandhonor/accessfreetools.com/actions/runs/34034590676)
passed on that SHA, using Node 24.

Hostinger automatically created Git build
`01a076ca-b9a4-720d-9750-51ede0875ea3` at 12:56:32 UTC. At 13:09:04 UTC its status
was completed, with Node 24, `app.js` and `dist`. No duplicate manual build,
restart, DNS, billing or infrastructure change was performed.

## Live Checks And Limits

Fresh command evidence is under the clean checkout's
`output/sec01-release/2026-09-06T13-05-02.945Z/`:

- Live Ask returned 43.2 for 18% of 240 through the Astro parser, not PHP.
- REST tool registry returned 34 tools. Four Ask/REST/MCP audit examples had no
  API issues. Three dedicated MCP smoke checks passed.
- Production sitemap: 663 OK, zero hard failures. Four legacy redirect checks
  were recorded separately, not introduced as sitemap members.
- Hostinger status passed through the existing authenticated API. Credentials
  were read in memory from the original checkout and were not copied to reports.

Chrome's connected Hostinger tab returned `Debugger unattached` twice. Edge was
not opened. An isolated Chrome 152 test, with owner ads/analytics suppression and
external requests blocked, received HTTP 403 and Hostinger's "Checking your
browser" page on four calculator routes. It closed normally. This is a failed
rendered verification attempt, not proof of broken calculators or a visual pass.
No protection was bypassed or disabled.

Browser evidence:
`C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-security-release/output/sec01-release/browser-2026-09-06T13-07-46.995Z/report.json`.
That run replaced `output/agent-tools/ask-audit/latest.json`; the earlier API-only
result remains separately recorded in its timestamped command log. Do not hide
the failed rendered check with a later API-only refresh.

The provider logs endpoint returned HTTP 200 but included neither the full nor
short Git SHA. The build record also lacks a source SHA. Correct Git/CI identity,
the subsequent completed Git build and live API health are confirmed; independent
deployed-revision attestation and full live browser acceptance remain missing.
Do not describe the entire release-judge gate as approved on these observations.

There is no observed production outage, bad sitemap or runtime mismatch to
justify rolling back the dependency fix. No Search Console or IndexNow submission
was made because no public URL or page content changed.

## Other Work

[Alignment readiness](transcriber-alignment-readiness-followup.md) found no complete
pinned model artifact set in the bounded test-owned output inventory. No model
download or inference retry was performed. Actual decoder alignment, repeated
speech, multilingual and two-block/edit/cancel evidence still gate integration.

The independent judge owns acceptance decisions. Whole-goal completion, SEC-03,
BR-04, TR-01/02/03, EV-04/05 and OP-01 are not established by this checkpoint.
