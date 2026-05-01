# Manual Deep Review Plan

This plan keeps manual review honest. Every canonical tool and every alias must eventually receive manual review. The full-library tracker lives in `docs/all-tools-review-register.md`; this file keeps the manual review rubric and first priority queue. A tool should only be marked `deep-reviewed` after a person has checked the formula, examples, FAQ explanations, guide article, UI behavior, SEO fields, privacy behavior, accessibility basics, and source notes for that exact tool.

Generated baseline checks are useful, but they are not the same thing as manual review.

## Review Rubric

Each manual review should confirm:

- The formula or rule is correct for the tool's stated scope.
- Inputs explain units, allowed values, defaults, and common wrong entries.
- Output labels are easy to understand without reading the code.
- Examples match the actual tool behavior.
- FAQs answer real confusion in clear language, with the tone of a smart 14-year-old explaining it to a friend.
- The blog guide includes a quick start, a real worked example, mistakes to avoid, and source notes.
- Related tools help users continue the task.
- SEO title, description, canonical URL, structured data, and sitemap behavior are correct.
- The tool runs locally in the browser when practical and does not send private inputs to a server.
- Desktop and mobile layouts do not overflow, hide controls, or make text awkwardly wrap.

## Top 25 Manual Queue

The top 25 list is the first priority batch, not the whole job. Priority is based on likely search demand, money/health sensitivity, evergreen value, and usefulness to the full site.

| Priority | Tool | Slug | Status | Next manual focus |
| --- | --- | --- | --- | --- |
| 1 | Mortgage Calculator | `mortgage-calculator` | deep-reviewed | 2026-04-30: Checked payment formula, escrow-style cost wording, guide, examples, privacy note, and source coverage. |
| 2 | Loan Calculator | `loan-calculator` | deep-reviewed | 2026-04-30: Checked amortized payment formula, zero-rate behavior, APR caveat, guide, examples, and source coverage. |
| 3 | Percentage Calculator | `percentage-calculator` | deep-reviewed | Keep examples fresh and add long-tail FAQ ideas from search data. |
| 4 | BMI Calculator | `bmi-calculator` | deep-reviewed | 2026-04-30: Checked adult screening language, BMI formula, health cautions, guide, examples, and source coverage. |
| 5 | Calorie Calculator | `calorie-calculator` | deep-reviewed | 2026-04-30: Checked Mifflin-St Jeor/TDEE flow, activity assumptions, health cautions, guide, and examples. |
| 6 | Scientific Calculator | `scientific-calculator` | deep-reviewed | Keep trig angle mode and scientific notation explanations clear. |
| 7 | Fraction Calculator | `fraction-calculator` | deep-reviewed | Keep simplification and mixed-number wording clear. |
| 8 | Salary Calculator | `salary-calculator` | deep-reviewed | 2026-04-30: Checked gross pay conversions, simple tax estimate boundaries, guide, examples, and source coverage. |
| 9 | Income Tax Calculator | `income-tax-calculator` | deep-reviewed | 2026-04-30: Checked 2026 federal bracket wording, deduction behavior, jurisdiction limits, guide, and source coverage. |
| 10 | Compound Interest Calculator | `compound-interest-calculator` | deep-reviewed | 2026-04-30: Checked compounding frequency, monthly deposits, interest/principal split, guide, and risk caveats. |
| 11 | Auto Loan Calculator | `auto-loan-calculator` | deep-reviewed | 2026-04-30: Checked amount-financed math, trade-in/tax/fee caveats, guide, examples, and source coverage. |
| 12 | Interest Calculator | `interest-calculator` | deep-reviewed | 2026-04-30: Checked simple/compound paths, rate/time wording, examples, guide, and source coverage. |
| 13 | Sales Tax Calculator | `sales-tax-calculator` | deep-reviewed | 2026-04-30: Checked subtotal/rate/total math, manual-rate caveats, IRS source coverage, guide, and examples. |
| 14 | Password Generator | `password-generator` | deep-reviewed | 2026-04-30: Checked crypto-random generation, no-history behavior, entropy wording, guide, and privacy cautions. |
| 15 | Subnet Calculator | `subnet-calculator` | deep-reviewed | 2026-04-30: Checked IPv4 CIDR math, /31 and /32 host counts, guide, alias coverage, and source references. |
| 16 | GPA Calculator | `gpa-calculator` | deep-reviewed | 2026-04-30: Checked credit-weighted GPA math, school-policy caveats, guide, examples, and related tools. |
| 17 | Due Date Calculator | `due-date-calculator` | deep-reviewed | 2026-04-30: Checked LMP/cycle-length math, conception estimate wording, medical cautions, guide, and sources. |
| 18 | Pregnancy Calculator | `pregnancy-calculator` | deep-reviewed | 2026-04-30: Checked LMP dating, gestational age, trimester labels, clinician-dating caution, guide, and sources. |
| 19 | GFR Calculator | `gfr-calculator` | deep-reviewed | 2026-04-30: Checked 2021 CKD-EPI scope, lab units, no-race-coefficient wording, clinician cautions, and guide. |
| 20 | Concrete Calculator | `concrete-calculator` | deep-reviewed | 2026-04-30: Checked slab volume math, waste percent, bag estimates, guide, examples, and source coverage. |
| 21 | Wallpaper Calculator | `wallpaper-calculator` | deep-reviewed | 2026-04-30: Checked waste percent, roll coverage, pattern repeat, dye lot/batch risk, detailed FAQ, and guide. |
| 22 | Paint Calculator | `paint-calculator` | deep-reviewed | 2026-04-30: Checked coats, coverage, openings, extra percent, product-label caveats, guide, and sources. |
| 23 | Tile Calculator | `tile-calculator` | deep-reviewed | 2026-04-30: Checked tile-area math, waste percent, grout/layout caveats, expanded guide, and source coverage. |
| 24 | Time Calculator | `time-calculator` | deep-reviewed | 2026-04-30: Checked duration math, seconds normalization, clock/time-zone boundary, guide, and source coverage. |
| 25 | Random Number Generator | `random-number-generator` | deep-reviewed | 2026-04-30: Checked inclusive ranges, exclusions, unique/sorted lists, randomness caveats, FAQ, and guide. |

## Done Rule

When a queued tool is manually reviewed:

- Update the tool content if the review finds confusion.
- Update or add source notes in `src/data/toolDeepAudit.ts`.
- Change only that tool's audit status to `deep-reviewed`.
- Add a short note here with the date and the main improvement.
- Run `npm run check`.

## Full-Library Rule

The manual review program does not stop at the top 25. The top 25 are the first pass because they are the most important and sensitive. After that, review the remaining tools in batches:

1. Finance, tax, credit, loan, and investment calculators.
2. Health, pregnancy, nutrition, BAC, and body measurement calculators.
3. Home, project, construction, electrical, weather, and science calculators.
4. School, statistics, math, date/time, and converter tools.
5. Developer, image, text, random, everyday utilities, and final GDP/height/sleep cleanup.
6. Alias pages, to confirm canonical tags, search terms, and redirect-like user guidance.

Batch 1, Batch 2, Batch 3, Batch 4, Batch 5, and Batch 6 are complete as of 2026-04-30. Batch 7 for browser-only AI tools is complete as of 2026-05-01. The current 242-tool canonical library has no remaining baseline-reviewed tools.

Every future batch should update tool content, FAQ detail, guide clarity, source notes, privacy notes, and visual checks before records are promoted from `baseline-reviewed` or `alias-reviewed` to `deep-reviewed`. New tools reopen the manual queue until their exact page, guide, examples, and tool behavior are checked.
