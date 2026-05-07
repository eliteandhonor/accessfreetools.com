import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const DEFAULT_PROFILE_DIR = resolve('.local', 'reddit-browser-profile');
const DEFAULT_DRAFT = resolve('output', 'promotion', 'reddit', 'drafts', 'percentage-calculator-profile-post.md');
const REPORT_PATH = resolve('output', 'promotion', 'reddit', 'reddit-profile-publish-report.json');
const PROFILE_SUBMIT_URL = 'https://www.reddit.com/user/accessfreetools/submit?type=TEXT';
const PUBLIC_PROFILE_URL = 'https://www.reddit.com/user/accessfreetools/';

const args = process.argv.slice(2);
const draftPath = resolve(args.find((arg) => arg.startsWith('--draft='))?.slice('--draft='.length) ?? DEFAULT_DRAFT);
const confirmed = args.includes('--confirm-public-post');
const keepOpen = args.includes('--keep-open');
const headless = args.includes('--headless');
const manualWaitMs = Number(args.find((arg) => arg.startsWith('--manual-wait-ms='))?.slice('--manual-wait-ms='.length) ?? 0);

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function extractDraft(markdown) {
  const title = markdown.match(/## Draft Title\s+([\s\S]*?)\n## Draft Body/)?.[1]?.trim();
  const body = markdown.match(/## Draft Body\s+([\s\S]*)/)?.[1]?.trim();

  if (!title || !body) {
    throw new Error(`Could not find Draft Title and Draft Body in ${draftPath}`);
  }

  if (!body.includes('Disclosure: this is my own project')) {
    throw new Error('Draft is missing ownership disclosure.');
  }

  return { title, body };
}

async function firstVisible(locatorFactories) {
  for (const createLocator of locatorFactories) {
    const locator = createLocator();
    try {
      if ((await locator.count()) > 0 && (await locator.first().isVisible({ timeout: 1500 }))) {
        return locator.first();
      }
    } catch {
      // Try the next selector.
    }
  }
  return null;
}

async function fillField(page, value, factories) {
  const field = await firstVisible(factories);
  if (!field) {
    return false;
  }

  await field.click();
  await field.fill(value);
  return true;
}

async function run() {
  if (!confirmed) {
    throw new Error('Refusing to publish without --confirm-public-post.');
  }
  if (!existsSync(draftPath)) {
    throw new Error(`Draft not found: ${draftPath}. Run npm run promotion:reddit:quality first.`);
  }

  const draft = extractDraft(readFileSync(draftPath, 'utf8'));
  const browser = await chromium.launchPersistentContext(DEFAULT_PROFILE_DIR, {
    channel: 'msedge',
    headless,
    viewport: { width: 1366, height: 900 },
  });
  const page = browser.pages()[0] ?? (await browser.newPage());
  const report = {
    generatedAt: new Date().toISOString(),
    draftPath,
    target: PROFILE_SUBMIT_URL,
    publicProfile: PUBLIC_PROFILE_URL,
    confirmed,
    passwordStored: false,
    posted: false,
  };

  try {
    await page.goto(PROFILE_SUBMIT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (manualWaitMs > 0) {
      await page.waitForTimeout(manualWaitMs);
    }

    const currentUrl = page.url();
    const titleText = await page.title();
    const bodyText = (await page.locator('body').innerText({ timeout: 10000 }).catch(() => '')).slice(0, 2000);
    const hardManualGate = /js_challenge|captcha|prove-your-humanity/i.test(currentUrl);
    const needsManual =
      hardManualGate ||
      (/login|log in|sign in|prove your humanity|captcha|verify|challenge/i.test(`${currentUrl} ${titleText} ${bodyText}`) &&
        !/Create post|Post to profile|Title/i.test(bodyText));

    if (needsManual) {
      Object.assign(report, {
        currentUrl,
        title: titleText,
        needsManual: true,
        action: 'Manual Reddit login, email verification, CAPTCHA, or human check is required in the external Edge profile.',
      });
      writeJson(REPORT_PATH, report);
      console.log(report.action);
      return;
    }

    const titleFilled = await fillField(page, draft.title, [
      () => page.locator('textarea[name="title"]'),
      () => page.locator('input[name="title"]'),
      () => page.getByPlaceholder(/title/i),
      () => page.getByLabel(/title/i),
    ]);
    const bodyFilled = await fillField(page, draft.body, [
      () => page.locator('textarea[name="text"]'),
      () => page.locator('textarea[name="body"]'),
      () => page.getByPlaceholder(/body text|text/i),
      () => page.getByLabel(/body text|text/i),
      () => page.locator('[contenteditable="true"]').last(),
    ]);

    if (!titleFilled || !bodyFilled) {
      Object.assign(report, {
        currentUrl: page.url(),
        title: await page.title(),
        needsManual: true,
        titleFilled,
        bodyFilled,
        action: 'Could not find Reddit title/body fields. Finish the profile post manually in the opened external browser.',
      });
      writeJson(REPORT_PATH, report);
      console.log(report.action);
      if (keepOpen) {
        await page.pause();
      }
      return;
    }

    const postButton = await firstVisible([
      () => page.getByRole('button', { name: /^post$/i }),
      () => page.getByRole('button', { name: /post|publish/i }),
      () => page.locator('button[type="submit"]'),
    ]);

    if (!postButton) {
      Object.assign(report, {
        currentUrl: page.url(),
        title: await page.title(),
        needsManual: true,
        action: 'Draft filled, but the final Reddit Post button was not found. Review and publish manually in the external browser.',
      });
      writeJson(REPORT_PATH, report);
      console.log(report.action);
      if (keepOpen) {
        await page.pause();
      }
      return;
    }

    await postButton.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => undefined);
    await page.waitForTimeout(3000);

    Object.assign(report, {
      currentUrl: page.url(),
      title: await page.title(),
      posted: true,
      action: 'Reddit profile post was submitted from the external Edge profile.',
    });
    writeJson(REPORT_PATH, report);
    console.log(report.action);
  } finally {
    if (!keepOpen) {
      await browser.close();
    }
  }
}

run().catch((error) => {
  writeJson(REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    draftPath,
    target: PROFILE_SUBMIT_URL,
    publicProfile: PUBLIC_PROFILE_URL,
    confirmed,
    passwordStored: false,
    posted: false,
    error: error instanceof Error ? error.message : String(error),
  });
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
