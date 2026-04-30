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

- April 30 tool-level audit pass: added repeatable guardrail tests that audit every tool for unique SEO titles, concise descriptions, category validity, icon mapping, guide coverage, useful examples, FAQ depth, related-tool integrity, placeholder/competitor wording, blog-card alignment, interactive route wiring, and generated guide structure.
- Fixed thin wording found by the audit in the Lean Body Mass Calculator description, Mass Calculator summary, density/mass/weight guide summaries, and three formula FAQ answers for Z-score, Area, and Right Triangle tools.
- Verified 110 tests pass and the full Astro build still generates 469 static pages.
- April 30 tool UX audit pass: improved shared finance, health, utility, geometry, and number-theory tool behavior so stale validation errors clear when inputs change, finance/health tools now show copy feedback, shared calculator errors are styled and announced, and Enter submits single-line shared tool inputs.
- Added the next finance roadmap batch: VAT, Cash Back or Low Interest, Auto Lease, Depreciation, Average Return, Margin, Discount, Business Loan, Debt-to-Income Ratio, Personal Loan, Boat Loan, Lease, Refinance, and Budget calculators.
- Added a matching guide page for each new calculator through the shared finance guide system.
- Added official-source links where useful for context, including European Commission VAT, CFPB APR and debt-to-income references, FTC car financing/leasing guidance, and IRS depreciation guidance.
- Added a homepage "Recently added tools" section so new tools are discoverable without relying only on search.
- Updated the calculator.net roadmap counts to 133 local tools and 133 local guide pages.
- Added the everyday utility roadmap batch: Dice Roller, Fuel Cost, Square Footage, Time Card, Time Zone, Gas Mileage, Tip, Mileage, Density, Mass, Weight, Speed, Roman Numeral, Base64, URL Encode/Decode, and Day of the Week tools.
- Added matching guide pages for the everyday utility batch through the shared utility guide system.
- Added source-backed notes for IETF Base64 and URI percent-encoding, IANA time zones, U.S. DOL hours recordkeeping, U.S. EPA fuel economy context, IRS 2026 mileage rate context, and NIST unit guidance.
- Updated the calculator.net roadmap counts to 149 local tools and 149 local guide pages.
- Fixed a hosted-footer layout gap where the navigation column could squeeze the brand text into a vertical stack on deployment. The footer now uses a stacked flex layout with wrapping links.
- Added the construction, home, weather, and practical science roadmap batch: Height, Bra Size, Voltage Drop, BTU, Stair, Resistor, Ohms Law, Electricity, Shoe Size Conversion, Molarity, Molecular Weight, Sleep, Tire Size, Roofing, Tile, Mulch, Gravel, Wind Chill, Heat Index, Dew Point, and Bandwidth tools.
- Added matching utility guide pages and clearer FAQ/content notes for the new batch with source-backed references where formulas or safety assumptions matter.
- Updated the calculator.net roadmap counts to 170 local tools and 170 local guide pages.
- Added the remaining finance roadmap tools: Marriage Tax, Estate Tax, Social Security, RMD, Real Estate, Take-Home Paycheck, Rental Property, IRR, ROI, APR, FHA Loan, VA Mortgage, Home Equity Loan, HELOC, Down Payment, Rent vs. Buy, Payback Period, Present Value, Future Value, Commission, Mortgage Calculator UK, Canadian Mortgage, and Percent Off calculators.
- Added matching finance guide pages through the shared guide system, with official-source references for IRS 2026 tax adjustments, IRS RMD tables, SSA claiming-age rules, IRS FICA withholding, HUD FHA MIP context, VA funding-fee rules, CFPB home-equity/HELOC explainers, Canada.ca mortgage amortization context, and GOV.UK mortgage calculator context.
- Updated the calculator.net roadmap counts to 193 local tools and 193 local guide pages.
- Added the safe Batch 5 roadmap tools: GDP, Horsepower, Engine Horsepower, and Golf Handicap calculators.
- Added matching guide pages with official-source references from BEA, NIST SP 811 conversion factors, and USGA handicap resources.
- Tightened the GDP calculator example so GDP-per-person uses a consistent billions scale instead of mixing billion-dollar inputs with raw population.
- Hardened the deployed footer again so the brand, tagline, links, and copyright cannot collapse into narrow vertical text columns on hosted pages.
- Updated the calculator.net roadmap counts to 197 local tools and 197 local guide pages, with 4 editorial-review items remaining.
- Completed the final editorial-review topics with safer framing: Underweight BMI, Overweight BMI, Nutrition Points, and Love calculators.
- The Underweight BMI page explicitly avoids "anorexic BMI" diagnosis language and links BMI screening to professional support boundaries.
- The Nutrition Points page avoids proprietary Weight Watchers formulas and uses an original transparent Nutrition Facts label score.
- Updated the calculator.net roadmap counts to 201 local tools and 201 local guide pages, with no direct action items remaining from the reviewed sitemap.
- Added canonical alias pages for duplicate search-intent names instead of creating thin duplicate calculators: Mortgage Amortization, Common Factor, IP Subnet, and Time Duration.
- Added those alias names to the tools search index and structured-data keywords on the canonical tool pages.
- Began the post-calculator.net expansion with a researched Home & Projects batch: Paint, Drywall, Carpet, Fence, Deck Cost, Paver, Board Foot, Cubic Yard, Pool Volume, Sand, Soil, and Asphalt calculators.
- Added a dedicated Home & Projects category so material takeoff tools no longer have to sit in generic everyday/math buckets.
- Added matching utility guide pages for the batch, with references for paint coverage, board-foot measurement, asphalt quantity estimating, and NIST unit conversions.
- Updated construction/material calculator tests and verified the site now builds 447 static pages.
- Added the next post-calculator.net browser utility batch: Word Counter, Character Counter, Text Case Converter, Slug Generator, JSON Formatter, UUID Generator, Hash Generator, Unix Timestamp Converter, Color Contrast Checker, and Aspect Ratio Calculator.
- Filled previously thin Text Tools and Image Tools category paths with real tools, clearer category guidance, icons, examples, FAQs, and matching guide pages.
- Added multiline text-output rendering to the shared utility interface so JSON, hashes, UUID lists, text stats, and generated slugs are easier to copy and read.
- Added source-backed guide references for Google helpful-content guidance, Google SEO basics, RFC 9562 UUIDs, MDN SubtleCrypto hashing, NIST FIPS 180-4 hash standards, WCAG 2.2 contrast guidance, ISO date formats, and MDN Date handling.
- Updated footer/category discovery for Text and Image hubs and verified the site now builds 469 static pages.
- Added the next researched post-calculator.net browser utility batch: UTM Builder, Query String Parser, HTML Entity Encoder/Decoder, CSS Clamp Calculator, and Markdown Table Generator.
- Added matching guide pages for the batch with references from Google Analytics campaign URL guidance, MDN URLSearchParams, MDN character references, MDN CSS clamp(), RFC 3986, and the GitHub Flavored Markdown table spec.
- Browser-preview audit found the running dev server had stale route state after new static paths were added, so the preview server was restarted on `127.0.0.1:4324` and the new tool pages were rechecked successfully.
- Verified 111 tests pass, the stricter site content audit passes, and the full Astro build now generates 479 static pages.

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
- The calculator.net roadmap now exists at `docs/calculator-net-roadmap.md`, keeping future batches grouped and safer. The reviewed competitor-inspired list is now complete, with sensitive/proprietary topics handled as safer alternatives and duplicate names handled through canonical alias pages.

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

1. Run one editorial rewrite pass over older static math blogs so their language matches the newer plain-English guide style.
2. Add a compact compare/related-tools block for large categories once each category passes 30 tools.
3. Add automated internal-link and metadata checks as a test script now that the site is over 200 tools.
4. Consider adding screenshots or small generated illustrations only where they clarify a tool, not as decorative filler.
5. Keep reviewing future health/body-image requests before implementation so the site stays useful and non-harmful.
