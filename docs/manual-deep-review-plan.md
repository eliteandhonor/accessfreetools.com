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
| 1 | Mortgage Calculator | `mortgage-calculator` | queued | Payment formula, escrow wording, amortization link, examples. |
| 2 | Loan Calculator | `loan-calculator` | queued | APR versus rate wording, payoff math, monthly payment checks. |
| 3 | Percentage Calculator | `percentage-calculator` | deep-reviewed | Keep examples fresh and add long-tail FAQ ideas from search data. |
| 4 | BMI Calculator | `bmi-calculator` | queued | Adult screening language, metric/US units, safety notes. |
| 5 | Calorie Calculator | `calorie-calculator` | queued | BMR/TDEE assumptions, activity multipliers, health disclaimers. |
| 6 | Scientific Calculator | `scientific-calculator` | deep-reviewed | Keep trig angle mode and scientific notation explanations clear. |
| 7 | Fraction Calculator | `fraction-calculator` | deep-reviewed | Keep simplification and mixed-number wording clear. |
| 8 | Salary Calculator | `salary-calculator` | queued | Pay frequency, gross versus net boundaries, tax caveats. |
| 9 | Income Tax Calculator | `income-tax-calculator` | queued | Tax-year wording, jurisdiction limits, estimate disclaimers. |
| 10 | Compound Interest Calculator | `compound-interest-calculator` | queued | Compounding frequency, deposits, interest versus principal. |
| 11 | Auto Loan Calculator | `auto-loan-calculator` | queued | Down payment, trade-in, taxes/fees, total cost explanation. |
| 12 | Interest Calculator | `interest-calculator` | queued | Simple versus compound interest, time units, rate conversion. |
| 13 | Sales Tax Calculator | `sales-tax-calculator` | queued | Tax-inclusive versus add-on tax, local-rate caveats. |
| 14 | Password Generator | `password-generator` | queued | Browser-only privacy, randomness wording, strength explanation. |
| 15 | Subnet Calculator | `subnet-calculator` | queued | CIDR math, usable host counts, network/broadcast addresses. |
| 16 | GPA Calculator | `gpa-calculator` | queued | Weighted grades, credits, school policy caveats. |
| 17 | Due Date Calculator | `due-date-calculator` | queued | LMP versus conception estimate, medical disclaimer wording. |
| 18 | Pregnancy Calculator | `pregnancy-calculator` | queued | Week counting, trimester labels, medical advice boundaries. |
| 19 | GFR Calculator | `gfr-calculator` | queued | CKD-EPI scope, lab units, clinician-use safety note. |
| 20 | Concrete Calculator | `concrete-calculator` | queued | Shape formulas, waste percent, bag versus volume estimates. |
| 21 | Wallpaper Calculator | `wallpaper-calculator` | queued | Waste percent, roll coverage, repeat pattern, lot/batch risk. |
| 22 | Paint Calculator | `paint-calculator` | queued | Coats, coverage, porous surfaces, waste allowance. |
| 23 | Tile Calculator | `tile-calculator` | queued | Grout spacing, cut waste, layout pattern risk. |
| 24 | Time Calculator | `time-calculator` | queued | Time duration versus clock time, overnight spans, time zones. |
| 25 | Random Number Generator | `random-number-generator` | queued | Inclusive ranges, repeats, fairness, cryptographic limits. |

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
5. Developer, image, text, random, and everyday utilities.
6. Alias pages, to confirm canonical tags, search terms, and redirect-like user guidance.

Every batch should update tool content, FAQ detail, guide clarity, source notes, privacy notes, and visual checks before records are promoted from `baseline-reviewed` or `alias-reviewed` to `deep-reviewed`.
