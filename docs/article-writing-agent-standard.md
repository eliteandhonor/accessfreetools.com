# Article Writing Agent Standard

Reviewed: 2026-05-08

This standard applies to Access Free Tools blog guides, Medium companion posts, Pinterest descriptions that need longer context, and any future promotion article.

## Important Style Boundary

Do not copy the personality, voice, or exact style of Neil Patel or any other living writer. Use the useful public SEO lessons instead: clear promise, useful examples, skimmable structure, plain language, proof before claims, and a practical next step.

Our article voice is original to Access Free Tools:

- Smart 14-year-old explaining something clearly to a friend.
- Curious, direct, and practical.
- Simple words without baby talk.
- Confident, but not hypey.
- Helpful before promotional.
- Honest about limits, especially finance, health, tax, electrical, pregnancy, AI, and legal-adjacent topics.

## Sources Reviewed

- Neil Patel blog and SEO writing guidance: https://neilpatel.com/blog/
- Neil Patel SEO copywriting guidance: https://neilpatel.com/blog/seo-copywriting/
- Google Search Central helpful content guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- DataForSEO knowledge base notes for agent research workflow: `docs/dataforseo-knowledgebase-notes.md`

## Before Writing

1. Pick one job for the article. Do not mix calculators, AI tools, and unrelated site features unless the article is a broad site overview.
2. Open the actual Access Free Tools page and understand the tool, inputs, results, examples, FAQs, disclaimers, and related links.
3. Run a small SEO check:
   - `npm run dataforseo:account -- -- --min-balance=2`
   - `npm run dataforseo:status`
   - Use DataForSEO or Search Console only for the main topic, not broad paid research.
4. Identify the search intent in one sentence, such as: "The reader wants to calculate a discount quickly and understand what the result means."
5. Choose one primary phrase and two or three natural supporting phrases. Do not stuff them.
6. Check whether the topic is sensitive. If it touches money, health, taxes, electrical work, pregnancy, BAC, or AI, include clear limits and avoid promises.

## Recommended Article Shape

Use this shape unless the article needs something special:

1. Title: Clear, specific, and not clickbait.
2. Opening: State the problem and what the reader will learn in two to four short sentences.
3. Quick answer: Give the simple answer early.
4. What the inputs mean: Explain each important input in plain language.
5. How to use the tool: Walk through the actual Access Free Tools page.
6. Example: Use realistic numbers and show how to read the result.
7. Common mistakes: Name what people usually get wrong.
8. When not to rely on it: Explain limits without scaring the reader.
9. Try the tool: Add one useful link to the exact tool or guide.
10. FAQs: Add only real questions the reader would ask.

## Paragraph Rules

- Keep most paragraphs two to four sentences.
- Use headings that make sense even if someone is skimming.
- Use bullets for steps, mistakes, and checks.
- Define jargon once, then use the simple term.
- Put numbers in examples when possible.
- Prefer "here is what that means" over vague statements like "this is useful."
- Do not use giant intros, filler history, fake urgency, or "ultimate guide" language.
- Do not promise income, ranking, approval, medical outcomes, electrical safety, or AI accuracy.

## Smart 14-Year-Old Voice Examples

Use:

> A mortgage calculator does not tell you what the bank will approve. It gives you a quick estimate so you can see whether the monthly payment is even in the right ballpark.

Avoid:

> This revolutionary mortgage calculation framework empowers users to optimize home-buying decisions.

Use:

> Waste percent is extra wallpaper for cuts, pattern matching, corners, and mistakes. If you set it to zero, the math may look neat, but the room usually will not.

Avoid:

> Waste percentage is a strategic overage coefficient used to enhance material sufficiency.

## SEO Rules

- Match the article to one search intent.
- Put the primary phrase naturally in the title or first section if it fits.
- Use related phrases only where they make the article clearer.
- Answer the obvious question early.
- Link to the matching Access Free Tools page once near the end and again only if it genuinely helps.
- For Medium, set the canonical/source URL to the Access Free Tools page when available.
- Do not publish near-duplicate copies of our own blog guide on Medium. Medium posts should be shorter companion explanations.

## Quality Scorecard

Before approving an article, answer yes to all of these:

- Does it explain one clear topic?
- Would a smart 14-year-old understand it?
- Does it use the actual Access Free Tools page as the example?
- Does it explain inputs and results, not just say "use this tool"?
- Does it include one realistic example?
- Does it name common mistakes?
- Does it explain when not to rely on the result?
- Is the link useful and disclosed when needed?
- Is there no copied living-writer style?
- Is there no keyword stuffing, filler, or off-topic promotion?

## Medium Quality Gate

Medium drafts must pass the automated writing-quality check before public
posting or live edits:

```bash
npm run promotion:medium:quality
```

The gate checks for the basics that usually separate a useful article from a
generic one: one clear topic, the main search phrase, realistic numbers, a real
example, readable paragraphs, a direct reader voice, disclosure, source link,
canonical/source URL metadata, 3-5 focused tags, a branded hero image with alt
text, limits, no generic hype phrases, no off-topic AI drift, and a reading
level that fits the Access Free Tools voice. It also requires the Medium hero
asset layout QA report to pass, so title/detail text must stay inside the safe
text column and cannot overlap the calculator artwork.

Medium articles should not go live as text-only posts. Use
`npm run promotion:medium:images` or the full quality command to generate the
matching `public/medium/{slug}.jpg` image, then upload or import that image
before the first paragraph and set the alt text from the draft metadata.
If the image layout check fails or the visual preview shows text crossing the
artwork, do not publish. Fix the source hero layout, regenerate the assets, and
rerun `npm run promotion:medium:quality`.

Live Medium formatting must be checked in the public article, not only in the
draft file. After publishing or editing, open the live Medium URL in the
external browser and verify:

- The hero image appears near the top of the article.
- The hero image has no text crossing the calculator artwork or cropped text.
- The image alt text was saved.
- The article title renders as the large story heading.
- Each `##` section heading renders as a bold Medium heading, not a plain
  paragraph.
- Story Settings contain the SEO title, SEO description, reader interests, and
  canonical/source URL when Medium exposes that field.
- The live URL and checked items are recorded in `docs/promotion-queue.md`.

If Medium turns Markdown headings into normal text, do not mark the post fixed.
Re-apply the article with rich HTML or Medium's heading controls, republish,
and screenshot-check the public page again.

If Medium blocks publishing because the account has reached a 24-hour story
limit, do not mark the post live. Keep the prepared draft, record the block in
`docs/promotion-queue.md`, and retry only after the waiting window. A post is
`posted` only after the public URL is visible and checked.

The checker also acts as an article reviewer and writes a score report to
`output/promotion/medium-quality-report.json`. Minimum scores:

- SEO: 80/100
- Originality: 75/100
- Human interest: 75/100
- Overall: 80/100

Reviewer scoring is a practical heuristic, not a plagiarism checker or a Google
ranking promise. It checks whether the article has useful search alignment,
specific examples, non-generic language, direct reader voice, and a headline
that gives people a real reason to keep reading.

## Hook And Power Word Rules

Power words are allowed when they make the title clearer and more useful. Do
not use fake drama. Pair curiosity with a real answer.

Use these groups carefully:

- Curiosity: `secret`, `surprising`, `hidden`, `unknown`, `unexpected`,
  `strange`, `shocking`, `mystery`, `revealed`, `overlooked`, `little-known`.
- Useful: `how`, `guide`, `tips`, `steps`, `ways`, `methods`, `strategies`,
  `checklist`, `formula`, `solution`, `explained`.
- Urgency: `now`, `today`, `before`, `urgent`, `important`, `don't miss`,
  `warning`, `must-know`, `last chance`.
- Emotional: `powerful`, `inspiring`, `heartbreaking`, `exciting`,
  `frustrating`, `fearless`, `honest`, `life-changing`, `unforgettable`.
- Problem: `mistakes`, `problems`, `risks`, `struggles`, `failure`, `danger`,
  `confusion`, `myths`, `traps`.

Strong headline starters:

- `How to...`
- `Why...`
- `The truth about...`
- `What no one tells you about...`
- `Things you should know before...`
- `The biggest mistake...`
- `Simple ways to...`
- `The real reason...`

Good pattern: curiosity plus usefulness, such as `The biggest mistake people
make with BMI calculator results` or `Things you should know before trusting a
mortgage payment estimate`.
