import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const DEFAULT_PROFILE_DIR = resolve('.local', 'reddit-browser-profile');
const DEFAULT_OUTPUT_PATH = resolve('output', 'promotion', 'reddit', 'reddit-external-setup-report.json');
const PROFILE_SETTINGS_URL = 'https://www.reddit.com/settings/profile';
const PROFILE_URL = 'https://www.reddit.com/user/accessfreetools/';

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function parseArgs() {
  const args = new Set(process.argv.slice(2));

  return {
    headless: args.has('--headless'),
    keepOpen: args.has('--keep-open'),
    profileDir: resolve(
      process.argv.find((arg) => arg.startsWith('--profile-dir='))?.slice('--profile-dir='.length) ??
        DEFAULT_PROFILE_DIR,
    ),
    outputPath: resolve(
      process.argv.find((arg) => arg.startsWith('--output='))?.slice('--output='.length) ?? DEFAULT_OUTPUT_PATH,
    ),
  };
}

async function main() {
  const options = parseArgs();
  ensureDir(options.profileDir);
  ensureDir(dirname(options.outputPath));

  const context = await chromium.launchPersistentContext(options.profileDir, {
    channel: 'msedge',
    headless: options.headless,
    viewport: { width: 1440, height: 980 },
  });

  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto(PROFILE_SETTINGS_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  const url = page.url();
  const title = await page.title().catch(() => '');
  const needsHumanCheck =
    /prove your humanity|captcha|human verification/i.test(title) ||
    /js_challenge|captcha|prove-your-humanity/i.test(url);
  const loggedIn = !needsHumanCheck && !/login|register|account\/login/i.test(url);
  const report = {
    generatedAt: new Date().toISOString(),
    profileDir: options.profileDir,
    target: PROFILE_SETTINGS_URL,
    publicProfile: PROFILE_URL,
    currentUrl: url,
    title,
    loggedIn,
    needsHumanCheck,
    action:
      loggedIn
        ? 'Review the visible Reddit profile settings and apply the Access Free Tools display name, bio, website, and avatar.'
        : 'Manual login or verification is required in this external Edge profile before setup can continue.',
    passwordStored: false,
  };

  writeFileSync(options.outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Opened external Reddit setup browser. Report: ${options.outputPath}`);
  console.log(loggedIn ? 'Reddit appears logged in.' : 'Reddit needs manual login or verification in the opened browser.');

  if (!options.keepOpen) {
    await context.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
