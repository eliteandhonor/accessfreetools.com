import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const DEFAULT_PROFILE_DIR = resolve('.local', 'reddit-browser-profile');
const DEFAULT_DRAFT = resolve('output', 'promotion', 'reddit', 'drafts', 'percentage-calculator-profile-post.md');
const REPORT_PATH = resolve('output', 'promotion', 'reddit', 'reddit-profile-publish-report.json');
const PROFILE_SUBMIT_URL = 'https://www.reddit.com/user/accessfreetools/submit?type=TEXT';
const PUBLIC_PROFILE_URL = 'https://www.reddit.com/user/accessfreetools/';
const PUBLISHED_PROFILE_POSTS = [
  {
    title: 'How to calculate a discount without guessing',
    sourcePath: '/tools/percentage-calculator/',
    postUrl: 'https://www.reddit.com/r/u_accessfreetools/comments/1t61gx6/how_to_calculate_a_discount_without_guessing/',
  },
];

const args = process.argv.slice(2);
const draftPath = resolve(args.find((arg) => arg.startsWith('--draft='))?.slice('--draft='.length) ?? DEFAULT_DRAFT);
const confirmed = args.includes('--confirm-public-post');
const keepOpen = args.includes('--keep-open');
const headless = args.includes('--headless');
const manualWaitMs = Number(args.find((arg) => arg.startsWith('--manual-wait-ms='))?.slice('--manual-wait-ms='.length) ?? 0);

function manualGateMessage(currentUrl, titleText = '', bodyText = '') {
  if (/js_challenge|captcha|prove-your-humanity/i.test(`${currentUrl} ${titleText} ${bodyText}`)) {
    return 'Reddit is requiring a human check before the profile post can be published. Complete the Reddit challenge in the external browser, then rerun this command.';
  }

  if (/login|log in|sign in|verify|challenge/i.test(`${currentUrl} ${titleText} ${bodyText}`)) {
    return 'Manual Reddit login, email verification, CAPTCHA, or account verification is required in the external browser.';
  }

  return '';
}

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

async function findMatchingProfilePost(draft) {
  const listingUrl = `${PUBLIC_PROFILE_URL}submitted/.json?limit=10`;
  const sourceUrl = draft.body.match(/https:\/\/accessfreetools\.com\/\S+/)?.[0]?.replace(/[).,]+$/, '');
  const knownPost = PUBLISHED_PROFILE_POSTS.find(
    (post) => post.title === draft.title && (!sourceUrl || sourceUrl.includes(post.sourcePath)),
  );

  if (knownPost) {
    return {
      title: knownPost.title,
      postUrl: knownPost.postUrl,
      createdUtc: null,
    };
  }

  function parseListing(text) {
    const data = JSON.parse(text);
    const children = Array.isArray(data?.data?.children) ? data.data.children : [];
    const match = children
      .map((child) => child?.data)
      .find((post) => post?.title === draft.title && (!sourceUrl || post?.selftext?.includes(sourceUrl)));

    if (!match) {
      return null;
    }

    return {
      title: match.title,
      postUrl: match.url ?? (match.permalink ? new URL(match.permalink, 'https://www.reddit.com').toString() : ''),
      createdUtc: match.created_utc,
    };
  }

  try {
    const response = await fetch(listingUrl, {
      headers: {
        'user-agent': 'Access Free Tools promotion audit/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    return parseListing(await response.text());
  } catch {
    // Reddit can return different bot-protection behavior to Node fetch than
    // to a normal browser-like request. Use curl as a duplicate-check fallback.
    try {
      const curl = process.platform === 'win32' ? 'curl.exe' : 'curl';
      const text = execFileSync(curl, ['-L', '-s', '-A', 'Mozilla/5.0 accessfreetools audit', listingUrl], {
        encoding: 'utf8',
        timeout: 15000,
        maxBuffer: 1024 * 1024,
      });
      return parseListing(text);
    } catch {
      return null;
    }
  }
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

  try {
    await field.click();
    await field.fill(value);
    return true;
  } catch {
    // Reddit's current body editor is a custom <shreddit-composer> element.
    // Clicking it focuses the internal rich-text editor even though fill() is unsupported.
    await field.click();
    await page.keyboard.press('ControlOrMeta+A').catch(() => undefined);
    await page.keyboard.insertText(value);
    const pageText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
    return pageText.includes(value.slice(0, 80));
  }
}

async function run() {
  if (!confirmed) {
    throw new Error('Refusing to publish without --confirm-public-post.');
  }
  if (!existsSync(draftPath)) {
    throw new Error(`Draft not found: ${draftPath}. Run npm run promotion:reddit:quality first.`);
  }

  const draft = extractDraft(readFileSync(draftPath, 'utf8'));
  const existingPost = await findMatchingProfilePost(draft);
  if (existingPost) {
    writeJson(REPORT_PATH, {
      generatedAt: new Date().toISOString(),
      draftPath,
      target: PROFILE_SUBMIT_URL,
      publicProfile: PUBLIC_PROFILE_URL,
      confirmed,
      passwordStored: false,
      posted: true,
      duplicateSkipped: true,
      postUrl: existingPost.postUrl,
      action: 'Matching Reddit profile post already exists, so duplicate publishing was skipped.',
    });
    console.log('Matching Reddit profile post already exists, so duplicate publishing was skipped.');
    return;
  }

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
    const manualGate = manualGateMessage(currentUrl, titleText, bodyText);
    const needsManual =
      Boolean(manualGate) ||
      (/login|log in|sign in|prove your humanity|captcha|verify|challenge/i.test(`${currentUrl} ${titleText} ${bodyText}`) &&
        !/Create post|Post to profile|Title/i.test(bodyText));

    if (needsManual) {
      Object.assign(report, {
        currentUrl,
        title: titleText,
        needsManual: true,
        action: manualGate || 'Manual Reddit login, email verification, CAPTCHA, or human check is required in the external Edge profile.',
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
      () => page.locator('shreddit-composer[name="body"]'),
      () => page.locator('shreddit-composer#post-composer_bodytext'),
      () => page.getByPlaceholder(/body text|text/i),
      () => page.getByLabel(/body text|text/i),
      () => page.locator('[contenteditable="true"]').last(),
    ]);

    if (!titleFilled || !bodyFilled) {
      const blockedUrl = page.url();
      const blockedTitle = await page.title();
      const blockedText = (await page.locator('body').innerText({ timeout: 5000 }).catch(() => '')).slice(0, 2000);
      const blockedGate = manualGateMessage(blockedUrl, blockedTitle, blockedText);
      Object.assign(report, {
        currentUrl: blockedUrl,
        title: blockedTitle,
        needsManual: true,
        titleFilled,
        bodyFilled,
        action: blockedGate || 'Could not find Reddit title/body fields. Finish the profile post manually in the opened external browser.',
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
    const publishedPost = await findMatchingProfilePost(draft);

    Object.assign(report, {
      currentUrl: page.url(),
      title: await page.title(),
      posted: true,
      postUrl: publishedPost?.postUrl,
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
