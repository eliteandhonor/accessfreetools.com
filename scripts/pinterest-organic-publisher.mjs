import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const PROFILE_URL = 'https://au.pinterest.com/accessfreetools/';
const PIN_CREATION_URL = 'https://au.pinterest.com/pin-creation-tool/';
const DEFAULT_PROFILE_DIR = resolve('.local', 'pinterest-browser-profile');
const DEFAULT_OUTPUT_PATH = resolve('output', 'promotion', 'pinterest-publish-report.json');
const DEFAULT_BROWSER_CHANNEL = 'chrome';

const pins = [
  {
    slug: 'tools',
    asset: 'free-online-tools-library.png',
    title: 'Free Online Tools For Calculators, Converters, And AI Tasks',
    description:
      'Browse free calculators, converters, text tools, browser AI tools, and clear guides without signup. Built for quick everyday answers.',
    url: 'https://accessfreetools.com/tools/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'free-calculator-resources',
    asset: 'free-calculator-resources.png',
    title: 'Free Calculator Resources For Everyday Math',
    description:
      'Browse free calculators for percentages, mortgage payments, BMI, home projects, finance estimates, school math, and practical browser tasks.',
    url: 'https://accessfreetools.com/free-calculator-resources/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'percentage-calculator',
    asset: 'percentage-calculator.png',
    title: 'Free Percentage Calculator For Discounts And Percent Change',
    description:
      'Quickly calculate discounts, percent increase, percent decrease, markups, tips, and reverse percentages with a free browser calculator.',
    url: 'https://accessfreetools.com/tools/percentage-calculator/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'basic-calculator',
    asset: 'basic-calculator.png',
    title: 'Basic Calculator For Quick Everyday Math',
    description:
      'Use a free basic calculator for everyday arithmetic, percentages, keyboard input, and a clear guide to common calculator mistakes.',
    url: 'https://accessfreetools.com/tools/basic-calculator/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'mortgage-calculator',
    asset: 'mortgage-calculator.png',
    title: 'Mortgage Calculator With Monthly Payment Guide',
    description:
      'Estimate mortgage payments, interest, taxes, and amortization with plain-language notes before comparing loan options.',
    url: 'https://accessfreetools.com/tools/mortgage-calculator/',
    board: 'Finance Calculators',
    boardSlug: 'finance-calculators',
  },
  {
    slug: 'bmi-calculator',
    asset: 'bmi-calculator.png',
    title: 'BMI Calculator With Clear Result Notes',
    description:
      'Estimate BMI and read what the range can and cannot tell you. Educational only, with health limits explained clearly.',
    url: 'https://accessfreetools.com/tools/bmi-calculator/',
    board: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
  },
  {
    slug: 'wallpaper-calculator',
    asset: 'wallpaper-calculator.png',
    title: 'Wallpaper Calculator That Explains Waste Percent',
    description:
      'Estimate wallpaper rolls using wall size, roll coverage, pattern repeat, and a waste percent so you do not undercount cuts and matching.',
    url: 'https://accessfreetools.com/tools/wallpaper-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'ai-tools',
    asset: 'browser-ai-tools.png',
    title: 'Browser AI Tools With Privacy Notes',
    description:
      'Try browser-side OCR, language detection, tone checking, reading level, keyword extraction, and summaries with clear model limits.',
    url: 'https://accessfreetools.com/categories/ai-tools/',
    board: 'AI Browser Tools',
    boardSlug: 'ai-browser-tools',
  },
  {
    slug: 'image-to-text-ocr-tool',
    asset: 'image-to-text-ocr.png',
    title: 'Free Image To Text OCR Tool In Your Browser',
    description:
      'Extract text from screenshots, notes, receipts, and images. The tool runs in the browser and explains OCR limits clearly.',
    url: 'https://accessfreetools.com/tools/image-to-text-ocr-tool/',
    board: 'AI Browser Tools',
    boardSlug: 'ai-browser-tools',
  },
  {
    slug: 'voltage-drop-calculator',
    asset: 'voltage-drop-calculator.png',
    title: 'Voltage Drop Calculator For Wire Length Checks',
    description:
      'Estimate voltage drop from wire length, current, voltage, wire size, and material. Use it as a planning clue, not electrical approval.',
    url: 'https://accessfreetools.com/tools/voltage-drop-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'sand-calculator',
    asset: 'sand-calculator.png',
    title: 'Sand Calculator For Pavers, Bases, And Landscaping',
    description:
      'Estimate sand volume and weight from area and depth before planning a small home project or garden job.',
    url: 'https://accessfreetools.com/tools/sand-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'markdown-table-generator',
    asset: 'markdown-table-generator.png',
    title: 'Markdown Table Generator For Clean Rows And Columns',
    description:
      'Build clean Markdown tables with headers, rows, alignment, preview, and copy-ready output for docs, notes, and READMEs.',
    url: 'https://accessfreetools.com/tools/markdown-table-generator/',
    board: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
  },
  {
    slug: 'body-surface-area-calculator',
    asset: 'body-surface-area-calculator.png',
    title: 'Body Surface Area Calculator With Plain Result Notes',
    description:
      'Estimate body surface area from height and weight with simple explanations and health-result limits. Educational only.',
    url: 'https://accessfreetools.com/tools/body-surface-area-calculator/',
    board: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
  },
  {
    slug: 'speed-calculator',
    asset: 'speed-calculator.png',
    title: 'Speed Calculator For Distance, Time, And Pace Questions',
    description:
      'Calculate speed, distance, or time for travel, school math, pacing, and simple motion examples.',
    url: 'https://accessfreetools.com/tools/speed-calculator/',
    board: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
  },
  {
    slug: 'payment-calculator',
    asset: 'payment-calculator.png',
    title: 'Payment Calculator For Quick Loan Estimates',
    description:
      'Estimate a loan payment from principal, interest rate, and term, then read the finance limits before using the number.',
    url: 'https://accessfreetools.com/tools/payment-calculator/',
    board: 'Finance Calculators',
    boardSlug: 'finance-calculators',
  },
  {
    slug: 'hex-calculator',
    asset: 'hex-calculator.png',
    title: 'Hex Calculator For Binary, Decimal, And Code Checks',
    description:
      'Convert and calculate hexadecimal values for learning number bases, checking code examples, and comparing binary or decimal values.',
    url: 'https://accessfreetools.com/tools/hex-calculator/',
    board: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
  },
  {
    slug: 'amp-hours-to-watt-hours-calculator',
    asset: 'amp-hours-to-watt-hours.png',
    title: 'Amp Hours To Watt Hours Calculator For Batteries',
    description:
      'Convert battery amp-hours to watt-hours with voltage so capacity is easier to compare. Use estimates carefully for real electrical setups.',
    url: 'https://accessfreetools.com/tools/amp-hours-to-watt-hours-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'watts-to-amps-before-you-convert',
    asset: 'watts-to-amps-before-you-convert.png',
    title: 'Before You Convert Watts To Amps',
    description:
      'Watts alone is not enough. Use watts, volts, phase, and power factor for a quick current estimate, then treat it as education, not wiring approval.',
    url: 'https://accessfreetools.com/tools/watts-to-amps-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'unit-price-calculator',
    asset: 'unit-price-calculator.png',
    title: 'Unit Price Calculator For Comparing Deals',
    description:
      'Compare price per ounce, pound, item, or package so sale tags and bulk sizes are easier to judge before you shop.',
    url: 'https://accessfreetools.com/tools/unit-price-calculator/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'sales-tax-calculator',
    asset: 'sales-tax-calculator.png',
    title: 'Sales Tax Calculator For Price And Total Checks',
    description:
      'Check the tax amount, final price, or pre-tax price before comparing a receipt or checkout. I built this free browser calculator for quick estimates; local tax rules and exemptions can still differ.',
    url: 'https://accessfreetools.com/tools/sales-tax-calculator/',
    board: 'Finance Calculators',
    boardSlug: 'finance-calculators',
  },
  {
    slug: 'kawaii-calculator',
    asset: 'kawaii-calculator.png',
    title: 'Kawaii Calculator For Cute Everyday Math',
    description:
      'A cute calculator for everyday arithmetic, percentages, memory, and keyboard-friendly checks. I built it for people who want practical math without a dull screen or signup.',
    url: 'https://accessfreetools.com/tools/kawaii-calculator/',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'concrete-block-calculator',
    asset: 'concrete-block-calculator.png',
    title: 'Concrete Block Calculator For Wall Estimates',
    description:
      'Estimate concrete blocks from wall width, height, block size, openings, and waste allowance. I built this for early project planning; check local requirements and your supplier before ordering.',
    url: 'https://accessfreetools.com/tools/concrete-block-calculator/',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'interest-rate-calculator',
    asset: 'interest-rate-calculator.png',
    title: 'Interest Rate Calculator For Loans And Savings',
    description:
      'Compare interest estimates from a starting amount, rate, time, and compounding choice. I built this free calculator for planning checks, not financial advice.',
    url: 'https://accessfreetools.com/tools/interest-rate-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'Finance Calculators',
    boardSlug: 'finance-calculators',
  },
  {
    slug: 'date-calculator',
    asset: 'date-calculator.png',
    title: 'Date Calculator For Adding Or Counting Days',
    description:
      'Add or subtract days from a date, or count the time between two dates. Use it for deadlines, trips, study plans, and quick calendar checks.',
    url: 'https://accessfreetools.com/tools/date-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'fraction-calculator',
    asset: 'fraction-calculator.png',
    title: 'Fraction Calculator For Adding And Simplifying',
    description:
      'Add, subtract, multiply, or divide fractions, then reduce the result and follow the working. Use it for homework checks and everyday measurements.',
    url: 'https://accessfreetools.com/tools/fraction-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
  },
  {
    slug: 'gas-mileage-calculator',
    asset: 'gas-mileage-calculator.png',
    title: 'Gas Mileage Calculator For Fuel Cost Checks',
    description:
      'Estimate MPG, litres per 100 km, fuel used, and trip cost from distance, fuel, and price. Use it to compare journeys or check a fill-up.',
    url: 'https://accessfreetools.com/tools/gas-mileage-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'oven-temperature-converter',
    asset: 'oven-temperature-converter.png',
    title: 'Oven Temperature Converter For Celsius And Fahrenheit',
    description:
      'Convert oven temperatures between Celsius, Fahrenheit, and gas mark before following a recipe. Check your oven and recipe notes when precision matters.',
    url: 'https://accessfreetools.com/tools/oven-temperature-converter/?utm_source=Pinterest&utm_medium=organic',
    board: 'Free Online Calculators',
    boardSlug: 'free-online-calculators',
  },
  {
    slug: 'golf-handicap-calculator',
    asset: 'golf-handicap-calculator.png',
    title: 'Golf Handicap Calculator For Round Estimates',
    description:
      'Estimate a golf handicap from scores, course rating, slope, and round data. Use it for practice tracking; official handicaps follow governing rules.',
    url: 'https://accessfreetools.com/tools/golf-handicap-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'Health And Fitness Calculators',
    boardSlug: 'health-and-fitness-calculators',
  },
  {
    slug: 'flooring-calculator',
    asset: 'flooring-calculator.png',
    title: 'Flooring Calculator For Room Area And Waste',
    description:
      'Estimate flooring from room size, pack coverage, and a waste allowance. Use the result for planning, then confirm pack coverage before buying.',
    url: 'https://accessfreetools.com/tools/flooring-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'Home Project Calculators',
    boardSlug: 'home-project-calculators',
  },
  {
    slug: 'area-calculator',
    asset: 'area-calculator.png',
    title: 'Area Calculator For Common Shapes',
    description:
      'Calculate area for rectangles, triangles, circles, trapezoids, and more, with units and formulas shown. Use it for study checks or early project planning.',
    url: 'https://accessfreetools.com/tools/area-calculator/?utm_source=Pinterest&utm_medium=organic',
    board: 'School And Study Tools',
    boardSlug: 'school-and-study-tools',
  },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const slugs = args
    .filter((arg) => arg.startsWith('--slug='))
    .flatMap((arg) => arg.slice('--slug='.length).split(','))
    .map((slug) => slug.trim())
    .filter(Boolean);

  return {
    publish: args.includes('--publish'),
    confirmPublicPost: args.includes('--confirm-public-post'),
    all: args.includes('--all'),
    cleanupOnly: args.includes('--cleanup-drafts'),
    force: args.includes('--force'),
    slugs,
    limit: Number(args.find((arg) => arg.startsWith('--limit='))?.slice('--limit='.length) ?? Number.POSITIVE_INFINITY),
    channel: args.find((arg) => arg.startsWith('--channel='))?.slice('--channel='.length) ?? DEFAULT_BROWSER_CHANNEL,
    profileDir: resolve(args.find((arg) => arg.startsWith('--profile-dir='))?.slice('--profile-dir='.length) ?? DEFAULT_PROFILE_DIR),
    reportPath: resolve(args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length) ?? DEFAULT_OUTPUT_PATH),
  };
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function assetPath(pin) {
  return resolve('output', 'promotion', 'pinterest', pin.asset);
}

function wait(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

async function pageText(page, limit = 5000) {
  return (await page.locator('body').innerText({ timeout: 8000 }).catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, limit);
}

async function clickVisible(locator, after = 900) {
  const count = await locator.count().catch(() => 0);

  for (let index = 0; index < count; index += 1) {
    const item = locator.nth(index);

    if (!(await item.isVisible({ timeout: 900 }).catch(() => false))) {
      continue;
    }

    await item.scrollIntoViewIfNeeded().catch(() => {});
    await item.click({ timeout: 4000 }).catch(async () => item.click({ force: true, timeout: 4000 }));
    await wait(after);
    return true;
  }

  return false;
}

async function assertNoUnsafePinterestFlow(page) {
  const text = await pageText(page);

  if (/billing|campaign|budget|ads manager|ad group|payment method|payment details/i.test(text)) {
    throw new Error('Pinterest opened an ad, billing, or campaign flow. Stopped before publishing.');
  }
}

async function assertExpectedPinterestAccount(page) {
  const profileHref = await page
    .locator('a[aria-label="Your profile"]')
    .first()
    .getAttribute('href', { timeout: 2500 })
    .catch(() => '');

  if (!profileHref || !/\/accessfreetools\/?$/i.test(profileHref)) {
    throw new Error(
      `Pinterest account proof failed (${profileHref || 'no active profile link found'}). Stop and switch to /accessfreetools/ before publishing.`,
    );
  }
}

async function openOrganicCreatePage(page) {
  await page.goto(PIN_CREATION_URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await wait(4000);
  await assertNoUnsafePinterestFlow(page);
  await assertExpectedPinterestAccount(page);
}

async function boardUrl(pin) {
  return `${PROFILE_URL}${pin.boardSlug}/`;
}

async function alreadyPublished(page, pin) {
  await page.goto(await boardUrl(pin), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await wait(6500);
  const text = await pageText(page);
  return text.includes(pin.title) || text.includes(pin.title.slice(0, 28));
}

async function selectOrCreateBoard(page, pin, report) {
  const boardButton = page.locator('[role="button"]').filter({ hasText: /Choose a board|Free Online|Finance|Home Project|Health And Fitness|AI Browser/i }).last();
  const box = await boardButton.boundingBox().catch(() => null);

  if (box) {
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  } else {
    await page.mouse.click(920, 594);
  }

  await wait(3500);

  let text = await pageText(page);

  if (text.includes(pin.board)) {
    const selected = await clickVisible(page.getByText(pin.board, { exact: true }), 2500);
    if (!selected) {
      await page.keyboard.type(pin.board, { delay: 5 });
      await wait(1500);
      await clickVisible(page.getByText(pin.board, { exact: true }), 2500);
    }
    report.steps.push(`selected-board:${pin.board}`);
    return;
  }

  const searchInput = page.locator('input[placeholder="Search"]').last();
  if (await searchInput.isVisible({ timeout: 1200 }).catch(() => false)) {
    await searchInput.fill(pin.board);
    await wait(2500);
    text = await pageText(page);

    if (text.includes(pin.board)) {
      const selected = await clickVisible(page.getByText(pin.board, { exact: true }), 2500);

      if (selected) {
        report.steps.push(`searched-and-selected-board:${pin.board}`);
        return;
      }
    }
  }

  const createClicked =
    (await clickVisible(page.getByText('Create board', { exact: true }), 1600)) ||
    (await clickVisible(page.locator('[role="button"]').filter({ hasText: 'Create board' }), 1600));

  if (!createClicked) {
    throw new Error(`Could not open Create board for "${pin.board}".`);
  }

  const input = page.locator('input[placeholder*="Places to Go"], input[placeholder*="Recipes to Make"]').last();
  await input.fill(pin.board);
  await wait(700);

  const created = await clickVisible(page.getByRole('button', { name: /^Create$/ }), 3500);

  if (!created) {
    throw new Error(`Could not create board "${pin.board}".`);
  }

  report.steps.push(`created-board:${pin.board}`);
  text = await pageText(page);

  if (!text.includes(pin.board)) {
    report.steps.push(`board-created-not-visible-yet:${pin.board}`);
  }
}

async function fillDescription(page, description) {
  const clicked =
    (await clickVisible(page.getByText('Add a detailed description', { exact: true }), 400)) ||
    (await clickVisible(page.locator('textarea'), 400));

  if (!clicked) {
    await page.mouse.click(912, 338);
    await wait(400);
  }

  await page.keyboard.type(description, { delay: 2 });
  await wait(500);
}

async function cleanupDrafts(page, report) {
  report.steps ??= [];
  await openOrganicCreatePage(page);

  let deleted = 0;

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const actions = page.locator('[aria-label="Pin draft actions"]');
    const count = await actions.count().catch(() => 0);

    if (count <= 0) {
      break;
    }

    await actions.first().click({ force: true });
    await wait(700);

    const menuDelete = await clickVisible(page.getByText('Delete', { exact: true }), 900);

    if (!menuDelete) {
      break;
    }

    const confirmDelete = await clickVisible(page.getByRole('button', { name: /^Delete$|^Discard$/ }), 1600);

    if (!confirmDelete) {
      break;
    }

    deleted += 1;
    await wait(1600);
  }

  report.draftsDeleted = deleted;
  report.steps.push(`cleanup-drafts:${deleted}`);
}

async function publishPin(page, pin, options = {}) {
  const report = {
    slug: pin.slug,
    title: pin.title,
    board: pin.board,
    url: pin.url,
    asset: assetPath(pin),
    status: 'pending',
    steps: [],
  };

  if (!existsSync(report.asset)) {
    report.status = 'missing-asset';
    report.reason = `Missing ${report.asset}. Run npm run promotion:pinterest-assets first.`;
    return report;
  }

  if (!options.force && (await alreadyPublished(page, pin))) {
    report.status = 'already-published';
    report.boardUrl = await boardUrl(pin);
    return report;
  }

  await openOrganicCreatePage(page);
  report.steps.push('opened-organic-create-page');

  await page.locator('input[type="file"]').first().setInputFiles(report.asset);
  await wait(4500);
  report.steps.push('uploaded-image');

  const titleInput = page
    .locator('input[placeholder="Add a title"], input[placeholder="Tell everyone what your Pin is about"]')
    .first();
  await titleInput.fill(pin.title);
  await fillDescription(page, pin.description);
  await page.locator('input[placeholder="Add a link"]').fill(pin.url);
  report.steps.push('filled-copy-and-link');

  await selectOrCreateBoard(page, pin, report);
  await wait(2500);

  await assertNoUnsafePinterestFlow(page);

  const published = await clickVisible(page.getByRole('button', { name: /^Publish$/ }), 12_000);

  if (!published) {
    throw new Error(`Publish button was not clickable for ${pin.slug}.`);
  }

  report.steps.push('clicked-publish');
  await wait(12_000);

  report.boardUrl = await boardUrl(pin);
  report.verifiedAfterPublish = await alreadyPublished(page, pin);
  report.status = report.verifiedAfterPublish ? 'published' : 'publish-clicked-unverified';

  await cleanupDrafts(page, report);

  return report;
}

async function main() {
  const args = parseArgs();
  const selectedPins = pins
    .filter((pin) => args.all || args.slugs.includes(pin.slug))
    .slice(0, Number.isFinite(args.limit) ? args.limit : pins.length);

  const report = {
    generatedAt: new Date().toISOString(),
    profileUrl: PROFILE_URL,
    profileDir: args.profileDir,
    channel: args.channel,
    publish: args.publish,
    confirmPublicPost: args.confirmPublicPost,
    cleanupOnly: args.cleanupOnly,
    force: args.force,
    safety: ['organic pin creation only', 'no ads', 'no billing', 'no campaign setup', 'no password entry'],
    selectedCount: selectedPins.length,
    availableSlugs: pins.map((pin) => pin.slug),
    results: [],
  };

  if (args.cleanupOnly) {
    const context = await chromium.launchPersistentContext(args.profileDir, {
      channel: args.channel,
      headless: false,
      viewport: { width: 1365, height: 900 },
    });
    const page = context.pages()[0] || (await context.newPage());
    await cleanupDrafts(page, report);
    await context.close();
    writeJson(args.reportPath, report);
    return;
  }

  if (!selectedPins.length) {
    report.status = 'no-selected-pins';
    console.log('No pins selected. Use --slug=percentage-calculator or --all.');
    writeJson(args.reportPath, report);
    return;
  }

  if (!args.publish) {
    report.status = 'dry-run';
    report.results = selectedPins.map((pin) => ({
      slug: pin.slug,
      title: pin.title,
      board: pin.board,
      url: pin.url,
      asset: assetPath(pin),
      assetExists: existsSync(assetPath(pin)),
    }));
    console.log(
      `Pinterest dry run: ${selectedPins.length} selected pin(s). Publishing requires both --publish and --confirm-public-post.`,
    );
    writeJson(args.reportPath, report);
    return;
  }

  if (!args.confirmPublicPost) {
    report.status = 'confirmation-required';
    console.log('Refusing to publish without --confirm-public-post. No browser was opened.');
    writeJson(args.reportPath, report);
    return;
  }

  const context = await chromium.launchPersistentContext(args.profileDir, {
    channel: args.channel,
    headless: false,
    viewport: { width: 1365, height: 900 },
  });
  const page = context.pages()[0] || (await context.newPage());
  page.setDefaultTimeout(16_000);

  try {
    for (const pin of selectedPins) {
      try {
        const result = await publishPin(page, pin, { force: args.force });
        report.results.push(result);
      } catch (error) {
        const failed = {
          slug: pin.slug,
          title: pin.title,
          status: 'failed',
          error: String(error?.message ?? error),
        };
        report.results.push(failed);
        await cleanupDrafts(page, failed).catch(() => {});
      }
    }
  } finally {
    await context.close().catch(() => {});
  }

  report.status = report.results.every((result) => ['published', 'already-published'].includes(result.status))
    ? 'complete'
    : 'needs-review';
  writeJson(args.reportPath, report);
  console.log(`Saved Pinterest publish report to ${args.reportPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
