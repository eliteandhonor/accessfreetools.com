# All-Tools Review Register

This register is the work tracker for the whole library. It exists so the top 25 priority list never gets mistaken for the full review scope.

## Scope

- Canonical tools: 242.
- Alias URLs: 4.
- Public tool URLs: 246.
- Blog guides: 242.
- Current manual deep-review records: 242.
- Current baseline-review records: 0.
- Current alias-review records: 4.

The source of truth for review status is `src/data/toolDeepAudit.ts`. The site audit tests require one audit record for every canonical tool and every alias URL.

## Current Truthful Status

Manual review completion status: complete for the current canonical library.

- Deep-reviewed canonical tools: 242 of 242.
- Baseline-reviewed canonical tools still needing individual manual review: 0 of 242.
- Alias-reviewed public URLs: 4 of 4.

Do not mark a future full-library manual review complete while any canonical tool remains `baseline-reviewed`. A tool can only move from `baseline-reviewed` to `deep-reviewed` after that exact tool has been opened, tested, read, improved where needed, and checked against its guide, FAQ, examples, sources, SEO, privacy behavior, and layout.

## Status Meanings

- `deep-reviewed`: manually checked tool-specific formula, inputs, outputs, FAQs, guide, UI, SEO, privacy, accessibility, and source notes.
- `baseline-reviewed`: automated and structured content checks have passed, but the tool still needs manual review.
- `alias-reviewed`: alias URL and canonical relationship checked, but the target tool owns the deeper formula and UX review.

## Full-Library Batch Order

| Batch | Scope | Why it matters |
| --- | --- | --- |
| 1 | Top 25 priority tools | Highest likely impact, sensitivity, and user trust risk. |
| 2 | Remaining finance, loan, tax, credit, and investment tools | Money decisions need extra clarity, caveats, and source checks. |
| 3 | Remaining health, pregnancy, nutrition, BAC, and body measurement tools | Health-adjacent pages need careful language and disclaimers. |
| 4 | Home, project, construction, electrical, weather, and science tools | Units, waste factors, safety boundaries, and material assumptions matter. |
| 5 | School, statistics, math, date/time, and converter tools | Formula accuracy, step wording, and examples matter most. |
| 6 | Developer, image, text, random, everyday utilities, and final GDP/height/sleep cleanup | Privacy, clipboard behavior, browser-only handling, UX speed, and leftover category coverage matter most. |
| 7 | AI tools | Browser-only model loading, no-upload privacy wording, source-backed model limits, and readable AI guide content matter most. |
| 8 | Alias pages | Confirm canonical links, search intent, non-duplication, and user routing. |

## Batch 2 Finance Progress

Batch 2 is complete. The following finance tools have now been individually checked and promoted after the top 25 queue: Payment Calculator, Retirement Calculator, Amortization Calculator, Investment Calculator, Inflation Calculator, Finance Calculator, Currency Calculator, Mortgage Payoff Calculator, 401K Calculator, House Affordability Calculator, Savings Calculator, Rent Calculator, Annuity Calculator, Credit Card Calculator, Pension Calculator, Annuity Payout Calculator, Credit Cards Payoff Calculator, Debt Payoff Calculator, Debt Consolidation Calculator, Repayment Calculator, Student Loan Calculator, College Cost Calculator, Simple Interest Calculator, CD Calculator, Bond Calculator, Mutual Fund Calculator, Roth IRA Calculator, IRA Calculator, VAT Calculator, Cash Back or Low Interest Calculator, Auto Lease Calculator, Depreciation Calculator, Average Return Calculator, Margin Calculator, Discount Calculator, Business Loan Calculator, Debt-to-Income Ratio Calculator, Personal Loan Calculator, Boat Loan Calculator, Lease Calculator, Refinance Calculator, Budget Calculator, Marriage Tax Calculator, Estate Tax Calculator, Social Security Calculator, RMD Calculator, Real Estate Calculator, Take-Home-Paycheck Calculator, Rental Property Calculator, IRR Calculator, ROI Calculator, APR Calculator, FHA Loan Calculator, VA Mortgage Calculator, Home Equity Loan Calculator, HELOC Calculator, Down Payment Calculator, Rent vs. Buy Calculator, Payback Period Calculator, Present Value Calculator, Future Value Calculator, Commission Calculator, Mortgage Calculator UK, Canadian Mortgage Calculator, Percent Off Calculator, and Interest Rate Calculator.

Batch 2 main finance queue is complete as of this register update. GDP Calculator was completed in Batch 6 final cleanup.

## Batch 3 Health Progress

Batch 3 is complete. The health tools individually checked and promoted after the top 25 queue are: Underweight BMI Calculator, Overweight Calculator, Nutrition Points Calculator, Body Fat Calculator, BMR Calculator, Ideal Weight Calculator, Pace Calculator, Army Body Fat Calculator, Lean Body Mass Calculator, Healthy Weight Calculator, Calories Burned Calculator, One Rep Max Calculator, Target Heart Rate Calculator, Pregnancy Weight Gain Calculator, Pregnancy Conception Calculator, Ovulation Calculator, Conception Calculator, Period Calculator, Macro Calculator, Carbohydrate Calculator, Protein Calculator, Fat Intake Calculator, TDEE Calculator, Body Type Calculator, Body Surface Area Calculator, and BAC Calculator.

Batch 3 main health queue is complete as of this register update. Height Calculator and Sleep Calculator were completed in Batch 6 final cleanup. Batch 4 home, project, construction, electrical, weather, and science tools is also complete.

## Batch 4 Home, Project, Electrical, Weather, And Science Progress

Batch 4 is complete as of this register update. The home/project portion individually checked and promoted is: Roofing Calculator, Mulch Calculator, Gravel Calculator, Drywall Calculator, Carpet Calculator, Flooring Calculator, Fence Calculator, Deck Cost Calculator, Paver Calculator, Siding Calculator, Brick Calculator, Concrete Block Calculator, Rebar Calculator, Board Foot Calculator, Cubic Yard Calculator, Pool Volume Calculator, Sand Calculator, Soil Calculator, and Asphalt Calculator.

The construction, electrical, weather, and science-style portion individually checked and promoted is: Stair Calculator, Voltage Drop Calculator, Resistor Calculator, Ohm's Law Calculator, Electricity Calculator, BTU Calculator, Wind Chill Calculator, Heat Index Calculator, Dew Point Calculator, Density Calculator, Mass Calculator, Weight Calculator, Speed Calculator, Molarity Calculator, and Molecular Weight Calculator.

## Batch 5 School, Math, Statistics, Date/Time, And Converter Progress

Batch 5 is complete as of this register update. The school, math, statistics, date/time, and converter tools individually checked and promoted are: Basic Calculator, Kawaii Calculator, Ratio Calculator, Half-Life Calculator, Least Common Multiple Calculator, Greatest Common Factor Calculator, Factor Calculator, Prime Factorization Calculator, Long Division Calculator, Rounding Calculator, Scientific Notation Calculator, Big Number Calculator, Matrix Calculator, Average Calculator, Standard Deviation Calculator, Statistics Calculator, Mean, Median, Mode, Range Calculator, Number Sequence Calculator, Probability Calculator, Sample Size Calculator, Permutation and Combination Calculator, Z-score Calculator, P-value Calculator, Confidence Interval Calculator, Triangle Calculator, Area Calculator, Circle Calculator, Distance Calculator, Slope Calculator, Pythagorean Theorem Calculator, Right Triangle Calculator, Volume Calculator, Surface Area Calculator, Square Footage Calculator, Conversion Calculator, Horsepower Calculator, Roman Numeral Converter, Shoe Size Conversion, Age Calculator, Date Calculator, Day of the Week Calculator, Hours Calculator, Time Card Calculator, Time Zone Calculator, Unix Timestamp Converter, and Grade Calculator.

## Batch 6 Developer, Image, Text, Everyday, And Final Cleanup Progress

Batch 6 is complete as of this register update. The developer, image, text, random, everyday, and final cleanup tools individually checked and promoted are: Dice Roller, Fuel Cost Calculator, Gas Mileage Calculator, Tip Calculator, Mileage Calculator, Bra Size Calculator, Tire Size Calculator, Engine Horsepower Calculator, Golf Handicap Calculator, Love Calculator, Base64 Encode / Decode, URL Encode / Decode, Bandwidth Calculator, JSON Formatter, UUID Generator, Hash Generator, UTM Builder, Query String Parser, HTML Entity Encoder / Decoder, CSS Clamp Calculator, Word Counter, Character Counter, Text Case Converter, Slug Generator, Markdown Table Generator, Color Contrast Checker, Aspect Ratio Calculator, GDP Calculator, Height Calculator, and Sleep Calculator.

## Batch 7 AI Tools Progress

Batch 7 is complete as of 2026-05-01. The AI tools individually checked and promoted are: Image to Text OCR Tool, Sentiment Analyzer, Language Detector, Text Summarizer, Keyword Extractor, Image Classifier, Tone Checker, and Reading Level Checker.

The AI review checked browser-only input handling, lazy model loading, no-upload wording, self-hosted OCR/starter text model assets, third-party model file disclosure for remaining heavier experimental tools, examples, FAQ depth, blog guides, related tools, source notes, and model-limit cautions.

No current canonical tool remains in the manual queue. Future tools must reopen this register and start as reviewed only after their exact page, FAQ, guide, examples, sources, privacy behavior, and layout have been checked.

## Per-Tool Checklist

Each tool must eventually pass this manual checklist:

- Formula or rule confirmed.
- Input labels and units confirmed.
- Edge cases tested.
- Output explanation checked.
- Examples recalculated.
- FAQs rewritten if vague.
- Blog guide checked for plain-language clarity.
- Related tools checked.
- Category and search terms checked.
- Privacy behavior checked.
- Accessibility and mobile layout checked.
- Source notes updated.
- Audit status promoted only when all checks are actually complete.

## Progress Rule

Do not change a generated or baseline record to `deep-reviewed` in bulk. Promotion must happen one tool at a time or in a clearly reviewed batch where each tool was actually opened, tested, and read. For the current 242-tool canonical library, the manual queue is complete; this rule applies to every future new tool or reopened tool.

## Completion Rule

Full-library review is complete only when:

- All 242 canonical tools are manually checked and truthfully marked `deep-reviewed`.
- All 4 alias URLs are checked for canonical routing, search intent, and duplicate-content risk.
- All 242 blog guides are read against the actual tool page.
- High-trust topics have clear limitations and professional-advice disclaimers.
- Every changed tool passes the per-tool checklist above.
- `npm run check` passes after the final batch.
- Browser preview and production spot checks pass for representative pages.

For the current canonical library, the correct public status is that Access Free Tools has complete manual deep-review coverage for 242 canonical tools, alias review coverage for 4 alias URLs, and a repeatable review program for future tools.
