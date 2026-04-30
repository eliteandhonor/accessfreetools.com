# All-Tools Review Register

This register is the work tracker for the whole library. It exists so the top 25 priority list never gets mistaken for the full review scope.

## Scope

- Canonical tools: 234.
- Alias URLs: 4.
- Public tool URLs: 238.
- Blog guides: 234.
- Current manual deep-review records: 10.
- Current baseline-review records: 224.
- Current alias-review records: 4.

The source of truth for review status is `src/data/toolDeepAudit.ts`. The site audit tests require one audit record for every canonical tool and every alias URL.

## Status Meanings

- `deep-reviewed`: manually checked tool-specific formula, inputs, outputs, FAQs, guide, UI, SEO, privacy, accessibility, and source notes.
- `baseline-reviewed`: automated and structured content checks have passed, but the tool still needs manual review.
- `alias-reviewed`: alias URL and canonical relationship checked, but the target tool owns the deeper formula and UX review.

## Full-Library Batch Order

| Batch | Scope | Why it matters |
| --- | --- | --- |
| 1 | Top 25 priority tools | Highest likely impact, sensitivity, and user trust risk. |
| 2 | Remaining finance, loan, tax, credit, and investment tools | Money decisions need extra clarity, caveats, and source checks. |
| 3 | Remaining health, pregnancy, nutrition, BAC, and body measurement tools | Health-adjacent pages need careful language and disclaimers. |
| 4 | Home, project, construction, electrical, weather, and science tools | Units, waste factors, safety boundaries, and material assumptions matter. |
| 5 | School, statistics, math, date/time, and converter tools | Formula accuracy, step wording, and examples matter most. |
| 6 | Developer, image, text, random, and everyday utilities | Privacy, clipboard behavior, browser-only handling, and UX speed matter most. |
| 7 | Alias pages | Confirm canonical links, search intent, non-duplication, and user routing. |

## Per-Tool Checklist

Each tool must eventually pass this manual checklist:

- Formula or rule confirmed.
- Input labels and units confirmed.
- Edge cases tested.
- Output explanation checked.
- Examples recalculated.
- FAQs rewritten if vague.
- Blog guide checked for plain-language clarity.
- Related tools checked.
- Category and search terms checked.
- Privacy behavior checked.
- Accessibility and mobile layout checked.
- Source notes updated.
- Audit status promoted only when all checks are actually complete.

## Progress Rule

Do not change a generated or baseline record to `deep-reviewed` in bulk. Promotion must happen one tool at a time or in a clearly reviewed batch where each tool was actually opened, tested, and read.
