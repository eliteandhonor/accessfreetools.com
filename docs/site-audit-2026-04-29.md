# Site Audit: 2026-04-29

Audit scope: Access Free Tools source, built static output, live local preview, sitemap coverage, metadata, structured data, internal discovery, and content scale readiness.

References checked:

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data introduction: https://developers.google.com/search/docs/guides/intro-structured-data
- Google FAQ structured data guidance: https://developers.google.com/search/docs/appearance/structured-data/faqpage
- Google sitelinks search box deprecation: https://developers.google.com/search/blog/2024/10/sitelinks-search-box

## Improvements Made In This Pass

- Added RSS discovery at `/feed.xml` and linked it in the HTML head and footer.
- Added `llms.txt` as a crawler-readable site guide for AI and answer-engine discovery.
- Added collection/item-list structured data to the tools index, blog index, categories index, and category pages.
- Updated shared metadata so blog guide pages use article Open Graph type automatically.
- Added Twitter title and description metadata to all pages.
- Removed outdated sitelinks-search-box `SearchAction` markup from the global WebSite schema. Google retired that search result feature in 2024; site-name WebSite schema remains.
- Made blog search support `?q=` query URLs, matching the tools search behavior.
- Made tools search update `?q=` as visitors type, so filtered searches are shareable and crawl-friendly as navigational URLs.
- Added dev-server log ignore coverage so local preview logs do not get committed.

## Current Expansion Update

- Added the next finance roadmap batch: VAT, Cash Back or Low Interest, Auto Lease, Depreciation, Average Return, Margin, Discount, Business Loan, Debt-to-Income Ratio, Personal Loan, Boat Loan, Lease, Refinance, and Budget calculators.
- Added a matching guide page for each new calculator through the shared finance guide system.
- Added official-source links where useful for context, including European Commission VAT, CFPB APR and debt-to-income references, FTC car financing/leasing guidance, and IRS depreciation guidance.
- Added a homepage "Recently added tools" section so new tools are discoverable without relying only on search.
- Updated the calculator.net roadmap counts to 133 local tools and 133 local guide pages.
- Added the everyday utility roadmap batch: Dice Roller, Fuel Cost, Square Footage, Time Card, Time Zone, Gas Mileage, Tip, Mileage, Density, Mass, Weight, Speed, Roman Numeral, Base64, URL Encode/Decode, and Day of the Week tools.
- Added matching guide pages for the everyday utility batch through the shared utility guide system.
- Added source-backed notes for IETF Base64 and URI percent-encoding, IANA time zones, U.S. DOL hours recordkeeping, U.S. EPA fuel economy context, IRS 2026 mileage rate context, and NIST unit guidance.
- Updated the calculator.net roadmap counts to 149 local tools and 149 local guide pages.

## Audit Findings

### Technical SEO

- Canonicals are present through `BaseLayout`.
- XML sitemap is generated and includes live tools, live blog guides, live categories, and static pages.
- Robots.txt allows crawling and points to the sitemap.
- Blog article pages now expose article social metadata.
- RSS feed was missing before this pass; fixed.
- Collection structured data was missing for large library pages; fixed.
- FAQ structured data should not be added broadly. Google currently limits FAQ rich result eligibility mainly to well-known government or health-focused sites, and broad calculator FAQ markup would add noise.

### Site Architecture

- Category pages are generated only for categories with live tools, which avoids thin empty category pages.
- Tools and blog pages have search, but blog search did not support URL query state before this pass; fixed.
- Footer and header provide broad internal links to core hubs.
- The calculator.net roadmap now exists at `docs/calculator-net-roadmap.md`, keeping future batches grouped and safer.

### Content Quality

- The strongest pages have tool, FAQ, examples, related tools, and a blog guide.
- Some older static blog pages are still more template-like than the newer finance, health, utility, and math-expansion guides.
- Best next editorial improvement: pick one category per pass and rewrite guides into clearer "what to enter / how to read / common mistake" sections.

### Performance And UX

- Astro static output is a good fit for a utility site.
- React hydration is limited to interactive tools and search widgets.
- The theme picker is useful, but all pages should keep strong contrast across every look option as the palette grows.
- The largest future performance risk is adding too many client-heavy calculators without shared component patterns.

### Trust And Safety

- Finance and health pages now use estimate/disclaimer patterns.
- Sensitive future tools need special handling before implementation, especially medical/body-image topics, taxes, gambling-like random draws, and financial decision tools.
- Password and subnet tools should remain local-first and explicit about privacy.

## Next Recommended Batches

1. Start Batch 3 from the roadmap: construction, home, weather, practical science, and networking tools with clear unit assumptions.
2. Rewrite older static math blogs to match the newer plain-language standard.
3. Add a compact compare/related-tools block for large categories once each category passes 30 tools.
4. Add automated internal-link and metadata checks as a test script when the page count gets larger.
5. Review sensitive future health/entertainment topics before creating one-to-one competitor pages.
