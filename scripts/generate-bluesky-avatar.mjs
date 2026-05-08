import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DEFAULT_OUTPUT = resolve('public', 'bluesky', 'access-free-tools-avatar.png');

function parseArgs() {
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  return {
    output: resolve(outputArg?.slice('--output='.length) ?? DEFAULT_OUTPUT),
  };
}

function avatarHtml() {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      * {
        box-sizing: border-box;
      }

      html,
      body {
        width: 1024px;
        height: 1024px;
        margin: 0;
        overflow: hidden;
        background: #f8fbff;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .avatar {
        position: relative;
        width: 1024px;
        height: 1024px;
        display: grid;
        place-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 26% 24%, rgba(255, 255, 255, 0.88) 0 9%, transparent 28%),
          radial-gradient(circle at 82% 18%, rgba(255, 213, 74, 0.95) 0 5%, transparent 16%),
          linear-gradient(135deg, #0f8f8a 0%, #2f6df6 52%, #8a5cf6 100%);
      }

      .grid {
        position: absolute;
        inset: -3px;
        opacity: 0.2;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.72) 2px, transparent 2px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.72) 2px, transparent 2px);
        background-size: 86px 86px;
      }

      .ring {
        position: absolute;
        inset: 94px;
        border: 18px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        box-shadow:
          inset 0 0 80px rgba(255, 255, 255, 0.18),
          0 28px 70px rgba(16, 37, 84, 0.28);
      }

      .panel {
        position: relative;
        width: 620px;
        height: 620px;
        border-radius: 172px;
        display: grid;
        place-items: center;
        background:
          linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(233, 248, 255, 0.9));
        border: 18px solid rgba(255, 255, 255, 0.88);
        box-shadow:
          0 44px 120px rgba(11, 30, 74, 0.38),
          inset 0 -28px 60px rgba(13, 142, 138, 0.14);
      }

      .letter {
        color: #101827;
        font-size: 430px;
        line-height: 0.82;
        font-weight: 950;
        letter-spacing: 0;
        transform: translateY(-6px);
        text-shadow: 0 8px 0 rgba(77, 235, 221, 0.45);
      }

      .tool-mark {
        position: absolute;
        right: 116px;
        bottom: 124px;
        width: 150px;
        height: 150px;
        border-radius: 42px;
        display: grid;
        place-items: center;
        color: #ffffff;
        background: linear-gradient(135deg, #0b7f79, #1f68e8);
        border: 10px solid #ffffff;
        box-shadow: 0 22px 42px rgba(11, 30, 74, 0.32);
      }

      .tool-mark svg {
        width: 90px;
        height: 90px;
      }

      .spark {
        position: absolute;
        width: 70px;
        height: 70px;
        color: #ffffff;
        filter: drop-shadow(0 12px 16px rgba(11, 30, 74, 0.22));
      }

      .spark.one {
        left: 152px;
        top: 150px;
      }

      .spark.two {
        right: 150px;
        top: 238px;
        width: 52px;
        height: 52px;
        color: #ffdf56;
      }

      .dot {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.8);
      }

      .dot.a {
        width: 34px;
        height: 34px;
        left: 230px;
        bottom: 164px;
      }

      .dot.b {
        width: 48px;
        height: 48px;
        right: 206px;
        bottom: 198px;
        background: rgba(255, 223, 86, 0.9);
      }
    </style>
  </head>
  <body>
    <main class="avatar" aria-label="Access Free Tools avatar">
      <div class="grid"></div>
      <div class="ring"></div>
      <svg class="spark one" viewBox="0 0 64 64" aria-hidden="true">
        <path fill="currentColor" d="M32 3l7.7 20.3L60 31l-20.3 7.7L32 59l-7.7-20.3L4 31l20.3-7.7L32 3z"/>
      </svg>
      <svg class="spark two" viewBox="0 0 64 64" aria-hidden="true">
        <path fill="currentColor" d="M32 5l6.1 16.1L54 27l-15.9 5.9L32 59l-6.1-26.1L10 27l15.9-5.9L32 5z"/>
      </svg>
      <section class="panel">
        <div class="letter">A</div>
        <div class="tool-mark" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none">
            <rect x="14" y="6" width="36" height="52" rx="9" stroke="currentColor" stroke-width="5"/>
            <rect x="22" y="15" width="20" height="10" rx="3" fill="currentColor"/>
            <circle cx="24" cy="36" r="4" fill="currentColor"/>
            <circle cx="40" cy="36" r="4" fill="currentColor"/>
            <circle cx="24" cy="49" r="4" fill="currentColor"/>
            <path d="M36 49h9" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
          </svg>
        </div>
      </section>
      <span class="dot a"></span>
      <span class="dot b"></span>
    </main>
  </body>
</html>`;
}

async function main() {
  const options = parseArgs();
  if (!existsSync(dirname(options.output))) {
    mkdirSync(dirname(options.output), { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1024 }, deviceScaleFactor: 1 });
  await page.setContent(avatarHtml(), { waitUntil: 'networkidle' });
  await page.screenshot({ path: options.output, type: 'png' });
  await browser.close();

  console.log(`Generated Bluesky avatar: ${options.output}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
