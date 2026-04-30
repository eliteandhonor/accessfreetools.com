# Full-Site Improvement Plan

This plan applies to every Access Free Tools page, not just the top 25 tools. The current public library has 234 canonical tools and 4 alias URLs, for 238 public tool URLs. Every canonical tool, alias, guide, category page, legal page, and index surface should be covered by this plan over time.

## 1. Manual Deep Review

Goal: move every tool from baseline or alias review to true manual `deep-reviewed` status only after the work is actually done.

Requirements for every tool:

- Formula, rule, or generator behavior checked against reliable references.
- Inputs checked for units, limits, defaults, empty states, and common wrong entries.
- Outputs checked for labels, rounding, copy behavior, and user interpretation.
- Examples checked against the actual calculator behavior.
- FAQs checked for real user confusion, not filler.
- Blog guide checked against the Access Free Tools version of the tool.
- Source notes, privacy notes, related tools, and visual layout checked.

Execution order:

1. Review the top 25 priority tools first because they are sensitive or high-value.
2. Continue through all remaining finance and health tools.
3. Continue through home, project, construction, science, school, statistics, math, date/time, converter, developer, image, text, random, and everyday tools.
4. Finish alias pages by checking canonical tags, search terms, user guidance, and duplicate-content handling.

## 2. SEO

Goal: each page should be useful, unique, crawlable, and understandable.

Requirements:

- Keep descriptive URLs and one canonical URL per real page.
- Avoid thin duplicate tools; use alias pages only when they point to a stronger canonical tool.
- Keep unique titles and meta descriptions.
- Keep sitemap coverage fresh.
- Keep category pages useful as topical hubs, not only card dumps.
- Keep internal links descriptive, especially from guides to tools and related tools.
- Submit `sitemap.xml` in Google Search Console after production deploys.

## 3. Content Quality

Goal: every tool should answer the questions a real user has before, during, and after calculation.

Requirements:

- Plain-language formula or method explanation.
- "What inputs mean" FAQ.
- "How to read the result" FAQ.
- "What to double-check" FAQ.
- At least three realistic examples.
- A guide that uses the Access Free Tools version of the tool.
- Higher-trust language for finance, tax, credit, health, pregnancy, BAC, nutrition, medical-adjacent, and safety-adjacent tools.
- Tone should be clear enough for a smart 14-year-old to follow without sounding childish.

## 4. Structured Data

Goal: JSON-LD should help search engines understand the visible page without exaggeration.

Requirements:

- Structured data must match visible page content.
- No hidden, fake, misleading, or irrelevant schema claims.
- Collection pages should not overload item lists as the tool library grows.
- Blog articles should keep article metadata accurate.
- Breadcrumbs should match page hierarchy.
- Built JSON-LD must parse cleanly.

## 5. Performance

Goal: keep the site fast as it grows past 500 and 1000 tools.

Targets:

- LCP: 2.5 seconds or faster for most real users.
- INP: 200 ms or faster for most real users.
- CLS: 0.1 or lower for most real users.

Requirements:

- Keep `/tools/` initially limited and searchable.
- Split search data or paginate when the library gets heavier.
- Lazy-load heavy calculators or optional panels.
- Keep generated images optimized.
- Add bundle-size checks before the 500-tool mark.
- Use Search Console and PageSpeed Insights after real traffic exists.

## 6. Accessibility

Goal: target WCAG 2.2 AA across tools and content.

Requirements:

- Keyboard access for calculator controls, search, filters, menus, and copy buttons.
- Visible focus states.
- Labels for inputs and controls.
- Error messages that explain what to fix.
- Good contrast across every "Choose look" theme.
- No overlapping text at mobile or desktop widths.
- Tap targets large enough for mobile.
- No result updates that confuse assistive technology.

## 7. Trust and Legal

Goal: users and ad/affiliate partners should understand how the site works.

Requirements:

- Keep Privacy, Terms, Contact, and Advertising Disclosure pages live.
- Add clear disclaimers for finance, health, pregnancy, BAC, tax, construction, safety, and medical-adjacent tools.
- No fake ad boxes.
- Add affiliate disclosures near affiliate links and product previews.
- Update privacy language before adding analytics, AdSense, affiliate tracking, accounts, forms, or checkout.
- Configure a Google-certified CMP before serving ads in regions where Google requires it.

## 8. Security

Goal: keep the static app simple, private, and hard to misuse.

Requirements:

- Keep calculators browser-first where practical.
- Do not log sensitive inputs.
- Do not transmit calculator inputs unless a future feature clearly says it will.
- Run dependency audits.
- Plan security headers and CSP before production monetization scripts are added.
- Keep copy-to-clipboard actions user-triggered.
- Avoid unsafe HTML injection in generated content.

## 9. UX

Goal: every tool should feel clear, quick, and trustworthy.

Requirements:

- Results should be easy to scan.
- Copy and reset controls should be available where useful.
- Examples should help users fill real inputs.
- Related tools should continue the same task.
- Blog search should stay fast as guides grow.
- Mobile layouts should prioritize the calculator first, then explanation.
- Empty/error states should tell users exactly what happened.

## 10. QA System

Goal: prevent regressions before a GitHub push or Hostinger deploy.

Implemented checks:

- TypeScript check.
- Vitest formula/content guardrails.
- Site audit guardrails.
- Astro production build.
- Internal link check across built HTML.
- JSON-LD parse check across built HTML.
- Dependency audit.

Planned browser checks:

- Playwright visual smoke tests for home, tools, blog, legal pages, and representative calculator categories.
- Mobile and desktop screenshots for pages most likely to break.
- Console error checks on key workflows.
- Search, filter, show-all, copy, reset, and example-fill interactions.

## Current Definition of Done

For any future batch, done means:

1. Tool works.
2. Tool has real FAQs and examples.
3. Blog guide exists and explains our tool.
4. Legal/trust notes are correct for the tool category.
5. Tool is included in sitemap/search/category surfaces.
6. Manual review status is honest.
7. `npm run check` passes.
8. Browser preview is checked before production deploy.
