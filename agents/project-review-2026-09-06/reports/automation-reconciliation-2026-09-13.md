# September 13 Automation Recheck

Read-only review of all five existing automation files under
`C:/Users/chamb/.codex/automations/`. No schedule, notification, model, account,
queue or publication changes were made.

The three active jobs already contain the September 6 reconciliation:

- `brendan-editorial-release` selects only an exactly approved release-ready row
  from verified current main. It names OCR and Writing Tells as published and
  Playwright/Vitest as deferred; it cannot publish them from old calendar dates.
- `daily-promotion-agent` allows only the four active channels and one due
  approved row. It requires current source, duplicate checks and public proof.
- `weekly-seo-recrawl-review` uses newest exact inspections, treats July 29 as
  historical, preserves submission deduplication and requires real production
  coverage. The game and transcriber retain their independent evidence gates.

The daily SEO pulse and old weekly content promotion jobs are paused. Their old
platform descriptions are inactive historical instructions, not recommendations
or authorization to restore them. Preserve both pauses.

Current main `18ebd554`'s editorial registry agrees with the active editorial
instruction. This is configuration and registry agreement, not proof of a new
public post, a successful future run or deployed review-source identity.

## Source Fingerprints

SHA256 of the five `automation.toml` files at review:

| Job | SHA256 |
| --- | --- |
| aft-daily-seo-pulse | dc17af2a795b3c77cb3824e79d60f3069281db24faff65d56cedc79995890b77 |
| brendan-editorial-release | 0b18a69f6a76a7654b8654fa0ccc7ec486de534cff40a36a8f07bc5f2e8fb842 |
| daily-promotion-agent | 165a8a9f7d33f2581c4e8300375e0b96953d3ecfe0e3c9cd66ebc02f7d443d40 |
| weekly-content-promotion-agent | aeee7c5d0079c93221b627b48db1fbd88d96cb165671ba1c701efae0fb7aedf7 |
| weekly-seo-recrawl-review | 779c3bde9b2a180dea8975c45bd01b6a56806e27387cdb38dbce30792b603f8f |

The earlier OPS-3 request to correct these active prompts is already satisfied
in the current files. No duplicate automation or prompt-only rewrite is needed.
OP-01 still requires its separate tested/deployed identity evidence.
