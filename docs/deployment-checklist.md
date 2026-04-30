# Deployment Checklist

Use this checklist before pushing a new batch to GitHub or asking Hostinger to rebuild the Node.js Web App.

## Local Proof

Run the full local check:

```bash
npm run check
```

This must pass before release:

- TypeScript check.
- Vitest suite, including the site-content audit guardrails.
- Astro production build.

## Browser Proof

Open the local preview and check these pages:

- `/` loads without console errors.
- `/tools/` shows the correct total, search works, and the "Show all" button appears only for the full unfiltered tool list.
- `/blog/` search works and real guides are visible.
- A high-value finance tool, health tool, project estimator, developer tool, and calculator render their inputs, examples, FAQs, related tools, and guide links.
- `/sitemap.xml`, `/robots.txt`, and `/feed.xml` load.
- Footer text and links wrap normally on desktop and mobile widths.

## Production Proof

After Hostinger deploys the latest GitHub commit:

- Visit `https://accessfreetools.com/tools/` and confirm the tool count matches the local build.
- Search for a recent tool by name and by a keyword synonym.
- Open at least one recent blog guide from `/blog/`.
- Check browser console for errors.
- Check page source for one canonical tag, one main heading, and expected structured data.
- Confirm no fake ad boxes or affiliate links appear before accounts and disclosures are ready.

## Search Console

These steps need the site owner account:

- Verify the domain property for `accessfreetools.com`.
- Submit `https://accessfreetools.com/sitemap.xml`.
- Inspect a new tool URL after deployment.
- Watch indexing, query, and Core Web Vitals reports after Google recrawls the site.

## Monetization Readiness

Do not add ad or affiliate placements until these are ready:

- AdSense approval and site connection.
- Affiliate program approval.
- Visible affiliate disclosure on pages that contain affiliate links.
- Product popups tested for mobile usability and not blocking the tool.
- Privacy page updated for ads, cookies, and affiliate tracking.

## Rollback

If production looks wrong:

- Do not keep adding fixes blindly.
- Compare production to the local preview at the same route.
- Check Hostinger build logs.
- Revert only the offending commit or deploy the previous known-good commit.
- Re-run `npm run check` before pushing the fix.
