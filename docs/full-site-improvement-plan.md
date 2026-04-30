# Full-Site Improvement Plan

This is the complete Access Free Tools improvement plan. It applies to every Access Free Tools page, not just the top 25 tools. It covers every tool, every guide, every category, every alias URL, every legal page, every future monetization surface, and every deployment. The current public library has 234 canonical tools and 4 alias URLs, for 238 public tool URLs.

Current library scope:

- Canonical tools: 234.
- Alias tool URLs: 4.
- Public tool URLs: 238.
- Blog guides: 234.
- Current manual deep-review records: 234.
- Current baseline-review records: 0.
- Current alias-review records: 4.

## Completion Truth

The plan is complete as an execution standard when it covers every quality area below, has a repeatable proof path, and keeps review status honest.

The current 234-tool canonical library has completed manual deep-review coverage, and the 4 alias URLs have alias review coverage. Do not mark future tools as `deep-reviewed` in one bulk edit; every new or reopened tool must be checked, tested, improved where needed, and promoted only when the review really happened.

No resend is needed for the plan itself. If work continues across more sessions, continue from this document, `docs/all-tools-review-register.md`, and `docs/manual-deep-review-plan.md`.

## Priority Order

Use this order when deciding what to improve next:

1. Legal, privacy, disclosure, and trust pages.
2. Finance, tax, credit, loan, mortgage, retirement, investment, and salary tools.
3. Health, pregnancy, nutrition, BAC, body measurement, and medical-adjacent tools.
4. Construction, home project, electrical, weather, materials, and safety-adjacent tools.
5. School, math, statistics, probability, date/time, and conversion tools.
6. Developer, text, image, random, everyday, entertainment utilities, and final GDP/height/sleep cleanup.
7. Alias pages, canonical relationships, category hubs, search surfaces, RSS, robots, sitemap, and footer/header surfaces.

## 1. Manual Deep Review

Goal: move every tool from baseline or alias review to true manual `deep-reviewed` status only after the work is actually done.

Every manual review must check:

- Formula, rule, parser, estimator, generator, or converter behavior.
- Official, primary, or reliable reference sources where the topic needs them.
- Input labels, units, defaults, optional fields, empty states, limits, and invalid entries.
- Output labels, rounding, units, copy text, history text, and interpretation.
- Edge cases, including zero values, negative values, huge values, dates, precision, and unsupported inputs.
- Examples against the actual calculator behavior.
- FAQ depth, especially input meaning, result meaning, and common mistakes.
- Blog guide clarity against the actual Access Free Tools version of the tool.
- Privacy behavior, including whether values stay in the browser and whether copy actions are user-triggered.
- Accessibility basics, including keyboard path, labels, focus, errors, contrast, and mobile target size.
- Related tools, category placement, search terms, title, description, canonical URL, and sitemap coverage.
- Visual layout on mobile and desktop.

Manual review output for each tool:

- Update tool data or calculator behavior when the review finds a gap.
- Update blog guide content when wording is vague or generic.
- Update FAQ content when users would still be confused.
- Update `src/data/toolDeepAudit.ts` only when the exact tool was manually checked.
- Keep a short note about sources and remaining follow-up items.

## 2. SEO

Goal: each page should be useful, unique, crawlable, indexable, and understandable.

Requirements:

- Keep one canonical URL per real search intent.
- Use descriptive URLs with plain words.
- Avoid near-duplicate thin tool pages.
- Keep alias pages useful and canonical-aware.
- Keep titles unique, concise, and matched to the page.
- Keep meta descriptions unique, plain, and honest.
- Keep headings natural and visible.
- Keep category pages as topical hubs with helpful grouping and links.
- Keep blog pages tied to the actual tool, not generic filler.
- Keep internal links descriptive and task-based.
- Keep sitemap coverage complete and fresh.
- Keep robots.txt open unless there is a clear reason to block something.
- Submit `https://accessfreetools.com/sitemap.xml` in Google Search Console after production deploys.
- Use URL Inspection for important pages after major changes.
- Avoid keyword stuffing, copied competitor wording, and content made only for search engines.

Proof:

- `npm run audit:site`
- `npm run check:links`
- Production Search Console sitemap submission.
- Manual review of title links and snippets for high-value pages.

## 3. Content Quality

Goal: every tool should answer what a real person needs before, during, and after using the calculator.

Every tool page needs:

- Plain-language summary.
- What the calculator does.
- What each main input means.
- Formula, method, or logic explanation.
- How to read the result.
- What to double-check before trusting the result.
- Real examples with realistic numbers.
- FAQ answers written in understandable language.
- Privacy note.
- Related tools that continue the same task.
- Clear limitations, especially for estimates.

Every blog guide needs:

- Intro that names the exact Access Free Tools tool.
- Quick-start steps.
- Explanation of inputs and outputs.
- At least one worked example.
- Mistakes to avoid.
- When the tool is useful.
- When the tool is not enough.
- Link back to the tool.
- Links to related tools.
- Plain language suitable for a smart 14-year-old without sounding childish.

Higher-trust pages need extra care:

- Finance and tax: estimates, assumptions, local rules, rates, rounding, and not financial or tax advice.
- Health and pregnancy: education-only wording, medical caution, emergency limits, and no diagnosis.
- BAC: strong safety language and no driving reassurance.
- Construction and electrical: measurement assumptions, waste, code/safety caveats, and local professional checks.
- Developer and encoding tools: privacy, secrets, security limits, and syntax versus validation limits.

Proof:

- Site content audit tests.
- Manual read-through before promoting a tool to `deep-reviewed`.
- Spot checks in browser preview.

## 4. Structured Data

Goal: JSON-LD should describe the visible page without exaggeration.

Requirements:

- Use JSON-LD only for content visible or clearly represented on the page.
- Keep breadcrumbs matched to the page hierarchy.
- Keep article metadata accurate.
- Keep tool/software structured data honest.
- Limit collection structured data as the library grows so `/tools/` does not become bloated.
- Do not mark hidden, fake, irrelevant, or aspirational content.
- Do not use structured data to claim reviews, ratings, ads, products, or affiliate content that is not actually present.

Proof:

- `npm run check:structured-data`
- Google Rich Results Test for representative pages.
- Search Console URL Inspection after production deploys.

## 5. Performance

Goal: keep the site fast as it grows toward 500, 1000, and more tools.

Targets:

- LCP: 2.5 seconds or faster for most real users.
- INP: 200 ms or faster for most real users.
- CLS: 0.1 or lower for most real users.

Requirements:

- Keep `/tools/` initially limited and searchable.
- Split search data before the launchpad becomes too large.
- Add indexed pagination or segmented category pages before 1000+ tools.
- Lazy-load heavy calculator islands, examples, or visual panels where practical.
- Keep generated images optimized, compressed, and dimensioned.
- Avoid layout shifts from images, footer links, ads, theme picker, or dynamic result panels.
- Add bundle-size checks before the 500-tool mark.
- Avoid loading ad, affiliate, analytics, or product scripts until approved and disclosed.
- Measure production pages with PageSpeed Insights and Search Console Core Web Vitals after traffic exists.

Proof:

- `npm run build`
- Production Lighthouse/PageSpeed spot checks.
- Core Web Vitals monitoring when Search Console has field data.

## 6. Accessibility

Goal: target WCAG 2.2 AA for every page and tool.

Requirements:

- Keyboard access for tools, search, filters, theme picker, copy buttons, reset buttons, and examples.
- Visible focus that is not hidden by sticky or overlapping UI.
- Labels for every input and control.
- Error messages that say what to fix.
- Accessible result announcements where dynamic updates matter.
- Contrast checks for every "Choose look" theme.
- No overlapping text on mobile or desktop.
- Mobile target sizes that are easy to tap.
- No interaction that requires dragging only.
- Consistent help locations across tool pages.
- No repeated entry when a better default or example-fill pattern can help.

Proof:

- Browser keyboard pass.
- Mobile preview pass.
- Future automated accessibility scan.
- Manual contrast check for each theme.

## 7. Trust, Legal, And Monetization

Goal: users, Google, ad partners, affiliate partners, and the site owner should understand how the site works.

Requirements:

- Keep Privacy, Terms, Contact, and Advertising Disclosure pages live.
- Keep footer links to legal and disclosure pages visible.
- Keep working contact and privacy email inboxes.
- Keep no fake ad boxes before AdSense approval.
- Add affiliate disclosures near affiliate links and product previews, not only on the disclosure page.
- Update privacy language before adding analytics, AdSense, affiliate tracking, accounts, forms, checkout, email capture, or product embeds.
- Configure a Google-certified CMP before serving ads where Google requires it.
- Keep formulas and results independent from ads and affiliate revenue.
- Add professional-advice disclaimers to finance, tax, health, pregnancy, BAC, construction, electrical, legal-adjacent, and safety-adjacent tools.
- Have a qualified professional review legal pages before monetization scale-up or data collection.

Proof:

- Legal pages live in the production build.
- Footer includes disclosure link.
- `docs/legal-monetization-readiness.md` reviewed before monetization.
- Production check after adding any ad or affiliate script.

## 8. Security And Privacy

Goal: keep the static app private, simple, and difficult to misuse.

Requirements:

- Keep calculators browser-first where practical.
- Do not transmit calculator inputs unless a future feature clearly says it will.
- Do not log sensitive calculator inputs.
- Keep clipboard actions user-triggered.
- Avoid unsafe HTML injection.
- Treat developer tools as helpers, not security validators.
- Add dependency audit checks.
- Add CSP planning before third-party scripts.
- Add security headers through the host where possible.
- Keep external links reviewed.
- Add `rel` handling for affiliate, sponsored, and untrusted links where applicable.
- Review OWASP web and client-side risks before adding accounts, forms, APIs, ads, or analytics.

Proof:

- `npm run security:audit`
- Code review before third-party scripts.
- Hostinger header/CSP review before monetization scripts.

## 9. UX And Visual Design

Goal: every tool should feel clear, fast, modern, and trustworthy.

Requirements:

- Calculator first on mobile.
- Results easy to scan.
- Copy button where users naturally need to reuse results.
- Reset button where forms can become messy.
- Example-fill buttons for complex tools.
- Clear empty states.
- Clear invalid-input states.
- Related tools visible after the result or explanation.
- Blog link near explanation.
- Theme picker compact and not blocking content.
- Category and tools pages easy to scan with many tools.
- Header and footer wrap correctly at narrow widths.
- No bulky elements that steal space from the actual tool.
- Use GPT Image only when a visual asset truly improves the page, such as a logo, distinctive hero, mascot, product-style image, or affiliate product concept.

Proof:

- Browser preview on desktop and mobile widths.
- Console check for errors.
- Future Playwright screenshot smoke tests.

## 10. QA System

Goal: prevent regressions before GitHub pushes and Hostinger deploys.

Implemented checks:

- TypeScript check.
- Vitest formula and content guardrails.
- Site audit guardrails.
- Astro production build.
- Internal link check across built HTML.
- JSON-LD parse check across built HTML.
- Dependency vulnerability audit.

Required command before push:

```bash
npm run check
```

Focused commands:

```bash
npm run audit:site
npm run typecheck
npm run build
npm run check:links
npm run check:structured-data
npm run security:audit
```

Next QA upgrades:

- Playwright visual smoke tests.
- Console error checks for key pages.
- Mobile and desktop screenshot checks.
- Accessibility scan lane.
- External link checker.
- Formula-specific tests for high-risk tools.
- Bundle-size budget.
- Production deploy proof checklist.

## 11. Deployment And Production

Goal: every GitHub push and Hostinger deploy should have proof.

Requirements:

- Run local checks before push.
- Build cleanly before deploy.
- Confirm production routes after deploy.
- Compare the production page with the local preview for at least the changed routes.
- Submit or resubmit sitemap when major URL changes ship.
- Use Search Console URL Inspection for high-value changed pages.
- Keep deployment notes in `docs/deployment-checklist.md`.

Proof:

- Passing local check output.
- Git commit hash.
- Production URL checked.
- Search Console action noted when relevant.

## 12. Analytics And Measurement

Goal: measure what helps users without collecting more data than needed.

Requirements:

- Do not add analytics until privacy wording and consent expectations are ready.
- Track only useful aggregate data when analytics is added.
- Use Search Console for query and indexing clues.
- Use Core Web Vitals data for real performance signals.
- Use tool search data to decide future tools and deep-review priority.
- Do not store sensitive calculator inputs.

Proof:

- Privacy page updated before analytics.
- Consent setup reviewed where required.
- No input values logged.

## 13. Future Tool Creation Standard

Every new tool must follow the Access Free Tools build order:

1. Research the tool and the user problem.
2. Create or update the calculator.
3. Add examples.
4. Add at least six useful FAQs.
5. Add or update the blog guide.
6. Add related tools and category placement.
7. Add source, privacy, and disclaimer notes where needed.
8. Add tests for formulas or important behavior.
9. Add audit record.
10. Run `npm run check`.
11. Browser-preview the page.
12. Push only after validation passes.

## Complete Definition Of Done

The whole site improvement program is complete only when:

1. All 234 canonical tools have manual deep-review records.
2. All 4 alias URLs have alias review and correct canonical behavior.
3. All 234 blog guides are readable, specific, and tied to the actual tool.
4. Finance, health, tax, pregnancy, BAC, construction, electrical, and safety-adjacent pages have strong disclaimers.
5. Privacy, Terms, Contact, and Advertising Disclosure pages are production-ready.
6. AdSense and affiliate placements are absent until approved and disclosed.
7. SEO titles, descriptions, sitemap, robots, canonical links, and internal links pass checks.
8. Structured data validates and matches visible page content.
9. Core Web Vitals targets are monitored in production.
10. WCAG 2.2 AA is the accessibility target.
11. Security, dependency, and third-party-script review is part of release.
12. `npm run check` passes.
13. Browser preview and production spot checks pass.

The current status is: the plan is complete, the guardrails are in place, the current canonical library has full manual review coverage, and future tools must pass the same review gate before release.
