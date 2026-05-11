# Automation Environment Review

Last reviewed: 2026-05-11

## Current Environment Status

The shared check command is:

```powershell
npm run automation:env-check
```

Latest verified result:

- Status: ok
- Repo cwd: `C:\Users\chamb\OneDrive\Desktop\accessfreetools.com`
- Git branch: `main`
- Node: `v24.14.1`
- npm: `11.2.0`
- DataForSEO: healthy
- DataForSEO balance: `45.77 USD`
- Search Console token: refreshable
- Search Console client secret: present

## Active Automation Rule

Every active automation should run `npm run automation:env-check` before reporting environment failures. If the environment check says DataForSEO is healthy, agents should not repeat stale `fetch failed` claims from older memory files. If Search Console needs OAuth, agents should use the latest saved Search Console reports and ask Brendan for a manual OAuth refresh only when fresh data is needed.

## Reviewed Automations

| Automation | Status | Environment |
| --- | --- | --- |
| Access Free Tools Daily SEO Promotion Review | Active | Local cwd set; prompt starts with env-check. |
| AFT Monthly OnPage Crawl | Active | Local cwd set; prompt starts with env-check and uses `npm run automation:monthly-onpage`. |
| AFT Weekly QA Audit | Active | Local cwd set; prompt starts with env-check and separates environment failures from QA failures. |
| Weekly SEO Agent Self-Evaluation | Active | Local cwd set; prompt starts with env-check and handles OAuth separately. |
| AFT Weekly Promotion Draft Review | Active | Local cwd set; prompt starts with env-check. |
| Medium Promotion Agent | Active | Local cwd set; prompt starts with env-check and stays report-only. |
| Pinterest Promotion Agent | Active | Local cwd set; prompt starts with env-check and stays Pinterest-specific. |
| AFT Reddit Promotion Agent | Active | Local cwd set; prompt starts with env-check and stays draft-only. |
| AFT Daily SEO Pulse | Paused | Local cwd set; intentionally paused to avoid duplicate daily SEO reports. |
| Daily Promotion Agent | Paused | Local cwd set; intentionally paused to avoid duplicate daily promotion reports. |
| Weekly Content Promotion Agent | Paused | Local cwd set; intentionally paused to avoid duplicate weekly promotion reports. |

## What Changed

- Added `scripts/automation-environment-check.mjs`.
- Added `npm run automation:env-check`.
- Updated active Codex automation prompts to start from environment proof.
- Updated automation memory for active agents so stale network failures do not override fresh proof.
- Kept duplicate agents paused.
