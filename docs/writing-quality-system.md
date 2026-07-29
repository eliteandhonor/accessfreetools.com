# Writing Quality System

We apply the writing gate in layers. A mechanical checker cannot prove a claim or replace reader judgment.

## Precedence

1. Current source evidence and factual limits.
2. `docs/brand-code.md`.
3. `docs/article-writing-agent-standard.md` and reader-first review.
4. Stop Slop.
5. `npm run writing:quality`.

## Modes

Use editorial mode for articles, guides, Medium drafts, and promotion:

```powershell
npm run writing:quality -- --mode=editorial path\to\draft.md
```

Editorial mode preserves contractions and varied rhythm. Long sentences, passive wording, semicolons, nominalizations, and long paragraphs are warnings.

Use technical mode for procedures, errors, warnings, and safety instructions:

```powershell
npm run writing:quality -- --mode=technical path\to\procedure.md
```

Technical mode uses shorter sentence and paragraph targets and warns about contractions.

Both modes fail on defined false-certainty wording, hype, internal workflow notes in public copy, and em dashes. Git ignores reports under `output/writing-quality/`.

## Source Boundary

We based the original local checker on MIT-licensed source-code ideas in:

- Repository: `https://github.com/woosal1337/blog`
- Path: `videos/ep01-the-cure-for-ai-slop`
- Pinned commit: `b912d5fa59f368253683af2ebfac64ad6d08312d`

The upstream license reserves blog text and images. This project does not copy them. The local checker is not official or certified ASD-STE100 software and does not bundle the official standard.

## Agent Records

The Writing Quality Agent owns:

- `agents/writing-quality/AGENTS.md`
- `agents/writing-quality/reference.md`
- `agents/writing-quality/tasks.md`
- `agents/writing-quality/worklog.md`

Append completed commands and results to the worklog. Do not erase earlier decisions.
