import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const DEFAULT_PROFILE_DIR = resolve('.local', 'reddit-browser-profile');
const DEFAULT_DRAFT = resolve('output', 'promotion', 'reddit', 'drafts', 'percentage-calculator-profile-post.md');
const REPORT_PATH = resolve('output', 'promotion', 'reddit', 'reddit-profile-verification-report.json');
const PUBLIC_PROFILE_URL = 'https://www.reddit.com/user/accessfreetools/';
const PUBLIC_PROFILE_POSTS_URL = `${PUBLIC_PROFILE_URL}submitted/`;

const args = process.argv.slice(2);
const draftPath = resolve(args.find((arg) => arg.startsWith('--draft='))?.slice('--draft='.length) ?? DEFAULT_DRAFT);
const headless = args.includes('--headless');

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

  return { title, body };
}

function sourceUrlFromDraft(draft) {
  return draft.body.match(/https:\/\/accessfreetools\.com\/\S+/)?.[0]?.replace(/[).,]+$/, '') ?? '';
}

async function verifyMatchingProfilePost(page, draft) {
  const sourceUrl = sourceUrlFromDraft(draft);
  const checkedPages = [];

  for (const profileUrl of [PUBLIC_PROFILE_POSTS_URL, PUBLIC_PROFILE_URL]) {
    await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => undefined);
    await page.waitForTimeout(5000);

    const bodyText = await page.locator('body').innerText({ timeout: 15000 }).catch(() => '');
    const titleMatches = bodyText.toLowerCase().includes(draft.title.toLowerCase());
    const sourceMatches = !sourceUrl || bodyText.includes(sourceUrl);
    const screenshot = resolve(
      'output',
      'promotion',
      'reddit',
      `reddit-profile-verify-${checkedPages.length + 1}.png`,
    );
    await page.screenshot({ path: screenshot, fullPage: true }).catch(() => undefined);

    checkedPages.push({
      url: profileUrl,
      currentUrl: page.url(),
      title: await page.title().catch(() => ''),
      titleMatches,
      sourceMatches,
      screenshot,
      snippet: bodyText.slice(0, 1500),
    });

    if (titleMatches && sourceMatches) {
      return {
        verified: true,
        postUrl: page.url(),
        checkedPages,
      };
    }
  }

  return {
    verified: false,
    checkedPages,
  };
}

async function run() {
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

  try {
    const result = await verifyMatchingProfilePost(page, draft);
    writeJson(REPORT_PATH, {
      generatedAt: new Date().toISOString(),
      draftPath,
      targetProfile: PUBLIC_PROFILE_URL,
      passwordStored: false,
      ...result,
      action: result.verified
        ? 'Matching Reddit profile post is visible in the external Edge profile.'
        : 'Matching Reddit profile post is not visible in the external Edge profile.',
    });
    console.log(result.verified ? 'Reddit profile post verified.' : 'Reddit profile post not visible.');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  writeJson(REPORT_PATH, {
    generatedAt: new Date().toISOString(),
    draftPath,
    targetProfile: PUBLIC_PROFILE_URL,
    passwordStored: false,
    verified: false,
    error: error instanceof Error ? error.message : String(error),
  });
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
