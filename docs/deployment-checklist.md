# Deployment Checklist

Use this checklist before pushing a new batch to GitHub or asking Hostinger to rebuild the Node.js Web App.

## Local Proof

Run the full local check:

```bash
npm run check
```

Run the browser smoke lane for larger UI, navigation, or accessibility-sensitive changes:

```bash
npm run test:smoke
```

Run the mobile-first SEO audit after layout, metadata, sitemap, or deployment
changes:

```bash
npm run audit:mobile-seo
```

This must pass before release:

- TypeScript check.
- Vitest suite, including the site-content audit guardrails.
- Astro production build.
- Internal link validation across built HTML.
- Built-site metadata, canonical, sitemap, social tag, image alt, and affiliate `rel` validation.
- Mobile-first SEO validation with no AMP tags, no m-dot/mobile alternates, viewport metadata, canonical URLs, and mobile/tablet Playwright proof.
- Semantic JSON-LD validation across built HTML.
- Performance budget and AI lazy-asset validation.
- Dependency vulnerability audit.
- Optional Playwright desktop/mobile smoke and accessibility checks for representative pages.
- Regenerate PNG social preview cards with `npm run assets:social` after changing major category, blog, or homepage positioning.

## Browser Proof

Open the local preview and check these pages:

- `/` loads without console errors.
- `/tools/` shows the correct total, search works, and the "Show all" button appears only for the full unfiltered tool list.
- `/tools/` loads the first tool batch quickly, then loads `/tool-search-index.json` only when users search, filter, or show all tools.
- `/blog/` search works and real guides are visible.
- `/free-calculator-resources/` loads, links to the main hubs, and has no mobile overflow.
- A high-value finance tool, health tool, project estimator, developer tool, and calculator render their inputs, examples, FAQs, related tools, and guide links.
- `/sitemap.xml`, `/sitemap-pages.xml`, `/sitemap-tools.xml`, `/sitemap-blog.xml`, `/sitemap-categories.xml`, `/robots.txt`, `/feed.xml`, and `/pinterest-feed.xml` load.
- Footer text and links wrap normally on desktop and mobile widths.
- The mobile SEO screenshots in `output/mobile-seo-audit/screenshots/` show visible H1/tool content and no horizontal overflow for representative phone and tablet widths.

## Production Proof

After Hostinger deploys the latest GitHub commit:

- Visit `https://accessfreetools.com/tools/` and confirm the tool count matches the local build.
- Search for a recent tool by name and by a keyword synonym.
- Open at least one recent blog guide from `/blog/`.
- Open `https://accessfreetools.com/free-calculator-resources/` and confirm it links to the main calculator, finance, health, home, AI, school, and developer hubs.
- Check browser console for errors.
- Check page source for one canonical tag, one main heading, and expected structured data.
- Confirm `/tool-search-index.json` returns the searchable tool list and is not blocking the initial `/tools/` page.
- Confirm no fake ad boxes or affiliate links appear before accounts and disclosures are ready.
- Confirm `/privacy-policy/`, `/terms/`, `/advertising-disclosure/`, and `/contact/` are live.
- Confirm private analytics has a server-only token at `/home/u726893900/.local/accessfreetools-analytics.env`, Hostinger environment variables, or the fallback `public_html/.analytics/config.env`, then open `/admin/` or `/private-analytics/` and enter the token through the form. Do not put the token in the URL.
- Confirm representative pages include a 1200x630 PNG `og:image` from `/social/` and that the image URL returns 200.
- If production shows `403 Forbidden`, check the Hostinger deployment root. The build mirrors the public site into `dist`, keeps the Node server at `dist/server/entry.mjs`, and writes `dist/app.js` for output-directory starts.
- For the live contact form, `https://accessfreetools.com/api/contact` must return JSON from the Astro Node route.
- Hostinger build settings should use server-side Astro: build command `npm run build`, start command `npm run start`, entry file `app.js`, and output directory `dist` if an output field is shown. The root and generated `dist/app.js` wrappers guard invalid Hostinger `PORT` values and fall back to port `3000`, which Hostinger currently documents for Node.js web apps. Keep those wrappers free of top-level `await`, because Hostinger loads the entry through a CommonJS wrapper.
- For Ask/API/MCP, production must be real Node data only. Run `npm run hostinger:deploy-node` after major API changes, then run `npm run check:live-ask`. The live check must show `/api/v1/ask` using `route.source: "parser"` or `route.source: "ollama"` and must not show `php-router`.
- Confirm Hostinger has the contact form environment variables set and send one test message from `/contact/`.
- Confirm old indexed URLs such as `/calculators`, `/deep-research`, and `/advanced-age-calculator` return 301 redirects. Keep those redirect rules in `public/.htaccess`, but do not add PHP API or MCP rewrites.

## Mobile Performance Proof

For larger mobile, template, or deployment changes, run mobile Lighthouse on the
same representative live URLs used by `npm run audit:mobile-seo`:

```bash
npm run serpforge -- lighthouse https://accessfreetools.com/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/tools/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/free-calculator-resources/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/tools/percentage-calculator/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/blog/how-to-use-percentage-calculator/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/categories/calculators/ mobile
npm run serpforge -- lighthouse https://accessfreetools.com/gallery/finance/ mobile
```

Treat Lighthouse as lab evidence. Search Console and CrUX are the field sources
for Core Web Vitals. Targets are LCP at or below 2.5 seconds, INP at or below
200 ms, and CLS at or below 0.1. Do not add AMP as a workaround for normal
responsive performance work.

## Search Console

These steps need the site owner account:

- Verify the domain property for `accessfreetools.com`.
- Submit `https://accessfreetools.com/sitemap.xml`.
- Do not submit `https://accessfreetools.com/feed.xml` as a Google sitemap by default. It stays live for RSS readers and is intentionally `noindex,follow`; XML sitemaps are the Google discovery source. The Search Console helper prunes older feed sitemap submissions when it submits discovery.
- Do not submit `https://accessfreetools.com/pinterest-feed.xml` as the main Google discovery feed. It is a curated Pinterest auto-publish feed with Pin images, not the normal guide RSS feed.
- Inspect `https://accessfreetools.com/`, `https://accessfreetools.com/free-calculator-resources/`, one new tool URL, one new blog guide URL, and `https://accessfreetools.com/sitemap.xml` after deployment.
- Confirm URL Inspection says "Page fetch: Successful", "Indexing allowed", and the user-declared canonical matches the production URL.
- Do not use Google's old sitemap ping endpoint. Google deprecated it; use Search Console, robots.txt sitemap discovery, and accurate `lastmod` dates instead.
- If Google says "Discovered - currently not indexed" or "Crawled - currently not indexed", review the exact reason before resubmitting. A new domain can take days or weeks to be indexed even when the technical setup is correct.
- Watch indexing, query, and Core Web Vitals reports after Google recrawls the site.
- Local API helpers:
  - `npm run search-console:submit-discovery`
  - `npm run search-console:inspect-key-urls`
  - `npm run search-console`
  - `npm run check:production-sitemap`
- Keep the Google OAuth client JSON out of Git. Use `.local/google-search-console-client-secret.json`, `GSC_CLIENT_SECRET_PATH`, or `--client-secret=...`.

## Monetization Readiness

Do not add ad or affiliate placements until these are ready:

- AdSense approval and site connection.
- Affiliate program approval.
- Visible affiliate disclosure on pages that contain affiliate links.
- Product popups tested for mobile usability and not blocking the tool.
- Privacy page updated for ads, cookies, and affiliate tracking.
- Working `contact@accessfreetools.com` routing for all site, privacy, advertising, affiliate, and correction messages.
- Hostinger Node.js Web App environment variables set for `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO`.
- Google-certified CMP configured before serving ads to EEA, UK, or Switzerland users where required.

## Rollback

If production looks wrong:

- Do not keep adding fixes blindly.
- Compare production to the local preview at the same route.
- Check Hostinger build logs.
- Revert only the offending commit or deploy the previous known-good commit.
- Re-run `npm run check` before pushing the fix.
