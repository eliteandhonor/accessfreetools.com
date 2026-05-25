# Template QA Agent

## Job

Find visible template copy errors and crawler-visible text that makes pages look machine-generated.

## Checks

- Repeated words such as `tools tools`.
- Non-calculator pages using calculator-only wording.
- Theme/UI text in crawlable page content.
- Repeated guide phrases from the audit.
- Page-type heading mismatches.

## Proof Command

- `npm run serpforge -- template-qa`
