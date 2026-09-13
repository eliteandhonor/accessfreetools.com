# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions and current task states. Local approval does not establish production deployment.

## SEC-04: Remediate September 13 Dependency Advisories

Priority P1, status approved locally by the independent Release Judge, parent
task SEC-01. Use the isolated
`accessfreetools-sep13-security` branch from fresh main. Preserve the older
fast-uri/qs acceptance as historical proof, not current zero-audit clearance.
See [current evidence](../../reports/security-sep13-remediation.md).
Completion requires narrow pins, clean Node24 install, current zero audit,
archive/image regressions, full check and independent source-bound judgment.
Commit/deploy and live confirmation remain separate. No broad audit fix.

September 13 local judgment: [accepted exact patch](../../reports/security-sep13-patch-judge.md).
Commit18ebd554703667decfea3ae16301029467721693, PR56 awaits Linux quality.
No production or whole-goal acceptance follows from this local approval.

## SEC-01: Patch fast-uri and qs narrowly

Priority: P1. Status: approved. Lane: main. Independent Release Judge: [local acceptance](../../reports/security-dependencies-task-acceptance.md).
Depends on: none.

Completion: Resolve fast-uri >=4.1.3 and qs >=6.16.0 within tested compatible releases; clean Node24 npm ci and audit show zero moderate/high/critical findings; both typechecks, API/MCP regressions and full check pass. No broad audit fix or waiver.

Evidence command(s): `npm audit --json; npm run check`.
Evidence output: `output/project-review-followup/SEC-01/`.

September 6: clean lifecycle-enabled Node 24 installation, both compiler lanes,
74 independently rerun dependency/API/MCP tests, zero audit findings and the
final 2,405-test full check pass. Source and lock hashes are bound in the judge
report. No production dependency patch or deployment approval is claimed.

## SEC-02: Mask private OCR, text and Ask outputs explicitly

Priority: P1. Status: approved. Lane: main.
Depends on: none.

Completion: Mask user-controlled input/output/history/errors under explicit Clarity ancestors. Synthetic alphabetic sentinels remain masked after hydration and rerenders; no marker reaches captured telemetry. Read-only Clarity configuration evidence before claiming live closure. Missing mask is conditional exposure, not a proven leak.

Evidence command(s): `npm run check:accessibility; npm run check:ai-assets; npm test`.
Evidence output: `output/project-review-followup/SEC-02/`.

September 6: the official Clarity recorder/decoder now passes 14 source-bound
cases, including 12 masked workflows and two deliberately exposed controls.
No telemetry was forwarded. SDK source isolation restored both typecheck lanes
without changing their configuration. The independent Release Judge reran and
approved the local implementation in `../../reports/clarity-recorder-judge.md`.
Full integration passed 2,210 tests. Deployment and live privacy closure remain
separate, unapproved gates; this is not production-wide privacy assurance.

## SEC-03: Threat-model admin storage and proxy limits before broader ad exposure

Priority: P2. Status: in_progress. Lane: design.
Depends on: SEC-02.

Completion: Document same-origin session-token risk and trusted forwarding headers. Choose a bounded mitigation with owner approval; test authorization, logout/expiry, CSRF if cookies are chosen, and bounded rate buckets with synthetic identities. Do not claim theft, hostile traffic or a required architecture rewrite.

Evidence command(s): `npm test; npm run monetization:browser-check`.
Evidence output: `output/project-review-followup/SEC-03/`.

September 6: [scoped threat model](../../reports/admin-proxy-threat-model.md) and synthetic browser/Map/adapter proof recorded. No auth, proxy or quota changes. Owner mitigation choice and independent review remain open; observed does not mean fixed.

September 8 supersedes that historical checkpoint: the owner-selected
no-persistence admin flow and bounded rate maps are implemented and independently
approved within their local scopes. [Resume evidence](../../reports/admin-rate-resume-2026-09-08.md)
records both decisions. Forwarding trust remains unverified, so SEC-03 stays
in_progress; no deployment or full security approval is implied.
