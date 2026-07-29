# Writing Quality Agent Rules

This workspace owns repository-local writing clarity diagnostics. It does not
replace factual review, the Access Free Tools brand code, reader-first review,
or Stop Slop.

## Required Precedence

Apply checks in this order:

1. Factual accuracy and current source evidence.
2. `docs/brand-code.md`.
3. `docs/article-writing-agent-standard.md` and reader-first review.
4. Stop Slop.
5. This workspace's mechanical clarity diagnostics.

Never use a lower layer to override a higher layer. A short sentence is still
bad copy when the claim is false. A strict technical rewrite is still bad copy
when it removes Brendan's voice from an article.

## Modes

- `editorial`: Articles, guides, and promotion copy. Preserve useful
  contractions and natural rhythm. Treat mechanical clarity findings as
  warnings.
- `technical`: Procedures, warnings, errors, and safety instructions. Use
  shorter sentences and paragraphs. Spell out contractions.

## Hard Errors

The local engine fails on:

- Em dashes.
- Internal agent or approval language in public text.
- Defined hype phrases.
- Defined false-certainty claims.

Warnings do not make the CLI return a nonzero status.

## Source Boundary

The implementation is original and was conceptually informed by the MIT
source-code materials in `woosal1337/blog`, pinned to commit
`b912d5fa59f368253683af2ebfac64ad6d08312d`.

Do not copy protected blog prose or images. Do not describe this checker as an
official or certified ASD-STE100 checker.

## Work Records

- Read `reference.md` before changing rule behavior.
- Record proposed work in `tasks.md`.
- Append completed commands and results to `worklog.md`.
- Keep generated reports under ignored `output/writing-quality/`.
- Do not edit existing editorial or Medium quality scripts from this workspace
  unless a separate task explicitly authorizes integration.
