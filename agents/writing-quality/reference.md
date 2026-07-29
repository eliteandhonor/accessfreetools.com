# Writing Quality Rule Reference

## Precedence

| Order | Layer | Deterministic role |
| --- | --- | --- |
| 1 | Factual accuracy | Hard error for defined false-certainty wording |
| 2 | Brand code | Hard error for defined hype wording |
| 3 | Reader-first | Hard error for internal agent or approval text |
| 4 | Stop Slop | Hard error for em dashes |
| 5 | Clarity | Warning-only mechanical diagnostics |

The engine does not prove factual accuracy. Source review remains required.

## Mode Thresholds

| Check | Editorial | Technical |
| --- | ---: | ---: |
| Sentence length | More than 34 words | More than 20 words |
| Paragraph length | More than 120 words | More than 80 words |
| Paragraph sentences | More than 6 | More than 4 |
| Contractions | Preserved | Warning |

Passive wording, semicolons, and the curated nominalization list produce
warnings in both modes.

## Rule IDs

Hard errors:

- `factual.false-certainty`
- `brand.hype`
- `reader-first.agent-facing-text`
- `stop-slop.em-dash`

Warnings:

- `clarity.long-sentence`
- `clarity.passive-wording`
- `clarity.semicolon`
- `clarity.nominalization`
- `clarity.long-paragraph`
- `clarity.technical-contraction`

## Input Rules

An explicit file is read as UTF-8. A directory scan includes:

- `.astro`
- `.htm`
- `.html`
- `.md`
- `.mdx`
- `.txt`

The scanner masks front matter, fenced code, inline code, HTML comments,
scripts, styles, preformatted blocks, code blocks, and HTML tags before it
checks prose.

## Result Rules

- `pass`: no findings.
- `pass-with-warnings`: one or more warnings and no hard errors.
- `fail`: one or more hard errors.

Only hard errors produce a nonzero quality result. Invalid input is treated as
an audit execution failure.
