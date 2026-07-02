# Automation Environment Review

Last reviewed: 2026-05-11

## Current Environment Status

The shared check command is:

```powershell
npm run automation:env-check
```

Latest verified result:

- Status: ok
- Primary repo cwd: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-main-live`
- Legacy repo cwd still accepted while older automation records are migrated: `C:\Users\chamb\OneDrive\Desktop\accessfreetools.com`
- Git branch: `main`
- Node: `v24.14.1`
- npm: `11.2.0`
- DataForSEO: healthy
- DataForSEO balance: `37.21 USD`
- Search Console token: refreshable
- Search Console client secret: present

## Active Automation Rule

Every active automation should run `npm run automation:env-check` and `npm run aft -- status` before reporting environment failures. If the environment check says DataForSEO is healthy, agents should not repeat stale `fetch failed` claims from older memory files. If Search Console needs OAuth, agents should use the latest saved Search Console reports and ask Brendan for a manual OAuth refresh only when fresh data is needed.

Agents should use the CLI for focused proof:

- `npm run aft -- marketing` for the deduped daily plan.
- `npm run aft -- indexing-gaps` for the current Search Console gap list.
- `npm run aft -- proof-check` for promotion proof status.

## Reviewed Automations

| Automation | Status | Environment |
| --- | --- | --- |
| Access Free Tools Daily SEO Promotion Review | Active | Local cwd set; prompt starts with env-check and AFT CLI status/marketing/proof commands. |
| AFT Monthly OnPage Crawl | Active | Local cwd set; prompt starts with env-check/AFT status and uses `npm run automation:monthly-onpage`. |
| AFT Weekly QA Audit | Active | Local cwd set; prompt starts with env-check/AFT status and separates environment failures from QA failures. |
| Weekly SEO Agent Self-Evaluation | Active | Local cwd set; prompt starts with env-check/AFT status and handles OAuth separately. |
| AFT Weekly Promotion Draft Review | Active | Local cwd set; prompt starts with env-check/AFT status/proof-check. |
| Medium Promotion Agent | Active | Local cwd set; prompt starts with env-check/AFT status/proof-check and stays report-only. |
| Pinterest Promotion Agent | Active | Local cwd set; prompt starts with env-check/AFT status/proof-check and stays Pinterest-specific. |
| AFT Reddit Promotion Agent | Active | Local cwd set; prompt starts with env-check/AFT status/proof-check and stays draft-only. |
| AFT Daily SEO Pulse | Paused | Local cwd set; intentionally paused to avoid duplicate daily SEO reports. |
| Daily Promotion Agent | Paused | Local cwd set; intentionally paused to avoid duplicate daily promotion reports. |
| Weekly Content Promotion Agent | Paused | Local cwd set; intentionally paused to avoid duplicate weekly promotion reports. |

## What Changed

- Added `scripts/automation-environment-check.mjs`.
- Added `npm run automation:env-check`.
- Updated active Codex automation prompts to start from environment proof.
- Updated active Codex automation prompts to use the `aft` CLI for status, marketing, indexing-gap, and proof checks.
- Added `npm run automation:monthly-onpage:dry-run` and taught the monthly wrapper to detect npm-consumed dry-run flags so readiness checks cannot accidentally start a paid crawl.
- Updated automation memory for active agents so stale network failures do not override fresh proof.
- Kept duplicate agents paused.
