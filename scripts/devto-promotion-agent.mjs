import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { assertPublicPromotionChannel } from './lib/promotion-channel-policy.mjs';

const SITE = 'https://accessfreetools.com';
const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'devto', 'drafts');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'devto', 'devto-promotion-report.json');
const DEVTO_API = 'https://dev.to/api/articles';
const LOCAL_ENV_PATH = resolve('.local', 'devto.env');

const targets = [
  {
    slug: 'codex-build-utility-website',
    title: 'How I Am Using Codex To Build A Free Utility Website',
    description:
      'A build-in-public look at using Codex to grow Access Free Tools with calculators, browser AI tools, guides, audits, and promotion checks.',
    tags: ['ai', 'webdev', 'productivity', 'tools'],
    sourceUrl: `${SITE}/why-access-free-tools/`,
    canonicalUrl: `${SITE}/why-access-free-tools/`,
    coverImage: `${SITE}/social/tools-library.png`,
    risk: 'build-in-public',
    body: [
      'A mistake I see with AI coding is treating it like one giant magic button. That is fun for a demo, but it starts to fail when the project has hundreds of pages, search indexing, promotion notes, and real users who just want a tool that works.',
      'Access Free Tools is my build-in-public example. The site is growing into a free utility website with calculators, converters, browser AI tools, developer helpers, and plain guides. The big goal is simple: make the site useful enough that a normal person can open it, solve the problem, understand the answer, and leave without signing up.',
      'Codex helps because the work is not only writing code. A single calculator page needs the tool, examples, FAQs, related links, a guide, metadata, sitemap coverage, and checks so the page does not turn into thin content. If we add 10 tools and skip those steps, the library gets bigger but not better.',
      'The project page explains the bigger mission here: https://accessfreetools.com/why-access-free-tools/',
      'Here is a real example. If we add a percentage calculator, the job is not just one input and one answer. People need percent-off, percent increase, tips, markups, and reverse percent help. A useful page explains what each input means, shows a 20 percent discount example, links to related tools, and warns when the answer is only a quick estimate.',
      'That is where Codex is useful. It can scan the repo, add the tool, update the guide, run checks, and catch boring mistakes like a missing sitemap entry or a broken related-tool link. The boring checks matter because boring mistakes are what make a big utility site feel messy.',
      'The other useful habit is making the website browser-first when possible. A calculator should usually run on the page, not require an account. A text helper should be clear about privacy. An AI helper should say when it downloads a model and when the result is only a guess. That honesty matters more than pretending every tool is perfect.',
      'The risk with AI building is also real. If you let it write every article without review, the site starts sounding generic. If you let it mark every task complete without proof, the project lies to itself. So the workflow has to include checks: does the page help a real reader, do the links work, does the public post actually exist, and does the tool explain its limits?',
      'The public tool library is here: https://accessfreetools.com/tools/',
      'My favorite part is that the plan scales one small win at a time. One tool becomes 10. Ten tools become a category. Categories become a library. The hard part is keeping each page understandable while the site grows.',
      'Disclosure: I work on Access Free Tools. This post is about the build process and the site we are creating, not a promise that Codex or any AI tool can replace careful review.',
    ],
  },
  {
    slug: 'markdown-table-generator',
    title: 'The Tiny Markdown Table Mistake That Breaks README Files',
    description:
      'A practical guide to fixing broken Markdown tables, uneven rows, missing separators, and copy-paste table mistakes.',
    tags: ['markdown', 'webdev', 'productivity', 'beginners'],
    sourceUrl: `${SITE}/tools/markdown-table-generator/`,
    canonicalUrl: `${SITE}/blog/how-to-use-markdown-table-generator/`,
    coverImage: `${SITE}/pinterest/markdown-table-generator.jpg`,
    risk: 'low',
    body: [
      'A Markdown table usually breaks for a boring reason: one row has 3 cells, another row has 4 cells, or the separator line does not match the header. It looks tiny, but it can make a README, GitHub issue, or docs page look messy fast.',
      'The annoying part is that Markdown tables are not hard math. They are just strict formatting. If the header has two columns, every data row needs two cells. If the separator line is missing, the table becomes plain text. If a cell contains a pipe character, the table can split in the wrong place.',
      'A simple fix is to stop hand-spacing the table and let a formatter rebuild it. I use the Access Free Tools Markdown Table Generator when I want to paste rows, add headers, and copy a clean table back into docs: https://accessfreetools.com/tools/markdown-table-generator/',
      'Here is a small example. Suppose your list is this: Tool, Use, JSON Formatter, clean pasted JSON, Word Counter, estimate reading length. The table should turn into three clean rows with the same number of columns each time.',
      'The first thing to check is the header. A table with headers `Tool` and `Use` needs the separator row `| --- | --- |`. That row tells Markdown where the header ends and the body begins. Without it, many renderers will not treat the text as a table at all.',
      'The second check is row width. If one row has an extra pipe at the end, some renderers ignore it, while others make the table look uneven. A generator helps because it builds the rows from the same structure instead of guessing from spaces.',
      'The third check is copy safety. If you are moving a table from a spreadsheet, notes app, or chat output, invisible spacing can sneak in. Paste the data into the generator, preview it, then copy the Markdown once it is stable.',
      'I also like checking the table in the place where it will actually live. GitHub, a documentation site, and a note app can render small Markdown details a little differently. After copying the table, preview the README or issue before you send it. That extra 10 seconds catches the row that looked fine in your editor but wrapped strangely on the real page.',
      'This is not about making docs fancy. It is about removing small friction. A clean table helps someone compare options without reading a wall of text. That matters in READMEs, classroom notes, project specs, and support replies.',
      'The full guide walks through the same tool with a clearer example and common mistakes: https://accessfreetools.com/blog/how-to-use-markdown-table-generator/',
      'Disclosure: I work on Access Free Tools. The link is to our free browser tool, and the point here is the method, not pretending one formatter can fix bad source data automatically.',
    ],
  },
  {
    slug: 'json-formatter',
    title: 'How To Spot Broken JSON Before It Wastes Your Debug Time',
    description:
      'Use a JSON formatter to catch missing commas, bad quotes, and nested object mistakes before they slow down debugging.',
    tags: ['javascript', 'webdev', 'debugging', 'beginners'],
    sourceUrl: `${SITE}/tools/json-formatter/`,
    canonicalUrl: `${SITE}/blog/how-to-use-json-formatter/`,
    coverImage: `${SITE}/social/developer-tools.png`,
    risk: 'developer',
    body: [
      'Broken JSON can waste way more time than it deserves. One missing comma, one smart quote, or one extra bracket can make an API response, config file, or browser snippet fail with a message that barely explains the real problem.',
      'The trick is not to stare harder. The trick is to format the JSON so the shape becomes obvious. When the indentation is clean, nested objects line up, arrays are easier to scan, and the error is usually closer to the exact place where the structure breaks.',
      'The Access Free Tools JSON Formatter is built for that quick check: https://accessfreetools.com/tools/json-formatter/',
      'Try a simple example. If you paste `{ "name": "Access Free Tools" "type": "utility site" }`, the missing comma between the two fields is easy to miss in one line. After a formatter tries to parse it, the problem becomes much easier to find.',
      'A second example is an array with 3 items where the last item has a trailing comma: `[1, 2, 3,]`. Some JavaScript tools allow that, but strict JSON does not. If an API expects strict JSON, that one comma can stop the whole request.',
      'The first thing to check is quotes. JSON needs double quotes around keys and string values. JavaScript lets you do more flexible things in code, but JSON is stricter. That is why `{ name: "tool" }` can look normal and still fail as JSON.',
      'The second thing to check is commas. A comma separates values, but the final value in an object or array should not have a trailing comma in strict JSON. This is one of the most common copy-paste mistakes from JavaScript examples.',
      'The third thing to check is bracket balance. Every `{` needs a matching `}`, and every `[` needs a matching `]`. When JSON is formatted across lines, the nesting level shows you which section is still open.',
      'A formatter does not know whether the data is correct for your app. It only knows whether the JSON is valid and readable. For example, it cannot tell you whether `price: 0` is a real price or a bug. It can tell you whether the structure can be parsed.',
      'That is why I treat formatting as step 1, not the finish line. First make the JSON valid, then check whether the values make sense for the job you are doing.',
      'The full guide on Access Free Tools explains the same workflow in plain language: https://accessfreetools.com/blog/how-to-use-json-formatter/',
      'Disclosure: I work on Access Free Tools. Use the formatter for public or non-sensitive snippets. Do not paste secrets, tokens, private customer data, or anything you would not want handled by a browser tool.',
    ],
  },
  {
    slug: 'image-to-text-ocr-tool',
    title: 'Why Screenshot Text Copying Fails And How OCR Helps',
    description:
      'A plain guide to OCR, screenshot quality, privacy limits, and why image-to-text tools can still make mistakes.',
    tags: ['ai', 'productivity', 'webdev', 'beginners'],
    sourceUrl: `${SITE}/tools/image-to-text-ocr-tool/`,
    canonicalUrl: `${SITE}/blog/how-to-use-image-to-text-ocr-tool/`,
    coverImage: `${SITE}/pinterest/image-to-text-ocr.jpg`,
    risk: 'ai/privacy',
    body: [
      'Copying text from a screenshot feels like it should be easy. The words are right there on the screen. But to a computer, that screenshot is usually just pixels until OCR tries to recognize the letters.',
      'OCR means optical character recognition. It looks at the image, guesses which shapes are letters, then turns those guesses into selectable text. That is powerful, but it is not magic. Blurry images, tilted photos, tiny fonts, and low contrast can all make the result worse.',
      'The Access Free Tools Image to Text OCR Tool runs in the browser and is meant for quick screenshot text extraction: https://accessfreetools.com/tools/image-to-text-ocr-tool/',
      'Here is the realistic workflow. Upload or select a screenshot, pick the language if the tool offers it, run OCR, then read the output before using it. If the screenshot has a serial number like `O0I1`, check it carefully because those characters are easy to confuse.',
      'For example, a screenshot might show invoice number `10018`, but OCR could read it as `I0018` if the font is narrow or blurry. That is a tiny change, but it matters if you paste the result into a search box or a form.',
      'The first quality rule is contrast. Dark text on a light background is easier than pale gray text on a patterned image. If possible, crop the screenshot around the text and avoid extra clutter.',
      'The second rule is size. A tiny compressed image gives OCR less information. If the original screen has zoom controls, zoom in before taking the screenshot. This can make a bigger difference than people expect.',
      'The third rule is proofreading. OCR can be 95 percent right and still ruin the one number you actually needed. Always check names, dates, totals, codes, and anything you plan to paste into a form.',
      'If the first pass is messy, try 2 quick fixes before giving up: crop tighter around the text and retake the screenshot at a larger zoom level. Those simple changes often beat running the same blurry image again.',
      'Privacy matters too. Browser-side tools can reduce upload risk, but some tools may download model files or run third-party libraries. Do not use any OCR tool for private IDs, medical records, banking screenshots, passwords, or sensitive work documents unless you understand the privacy path.',
      'The full guide for our OCR tool explains the image-quality checks and privacy limits in more detail: https://accessfreetools.com/blog/how-to-use-image-to-text-ocr-tool/',
      'Disclosure: I work on Access Free Tools. The OCR tool is useful for normal screenshots and notes, not for legal, medical, identity, or high-stakes transcription.',
    ],
  },
  {
    slug: 'prompt-token-estimator',
    title: 'The Hidden Cost In Long AI Prompts Is Usually Tokens',
    description:
      'A simple explanation of tokens, prompt length, rough AI cost estimates, and why pasted context can get expensive.',
    tags: ['ai', 'webdev', 'productivity', 'tools'],
    sourceUrl: `${SITE}/tools/prompt-token-estimator/`,
    canonicalUrl: `${SITE}/blog/how-to-use-prompt-token-estimator/`,
    coverImage: `${SITE}/social/browser-ai-tools.png`,
    risk: 'ai/cost',
    body: [
      'AI prompts can feel free until you paste a giant wall of context. Then the hidden cost shows up: tokens. A token is a small chunk of text that a model reads or writes. More tokens usually means more cost, more latency, and a higher chance you are feeding the model extra noise.',
      'A token is not exactly a word. Short common words may be one token. Longer words, code, symbols, and weird formatting can split into more pieces. That is why a 1,000 word article and a 1,000 line code dump do not always behave the same way.',
      'The Access Free Tools Prompt Token Estimator is a rough browser helper for checking prompt size before you send huge text somewhere else: https://accessfreetools.com/tools/prompt-token-estimator/',
      'Here is a normal example. Say you paste a 1,200 word brief, a 600 word email thread, and a 300 word instruction block. That is 2,100 words before the model even replies. If you only needed two sections from the brief, you may be paying for context that does not help.',
      'The first thing to check is duplicate context. If the same instructions appear three times, remove the repeats. Models do not need the same rule shouted over and over. Clear instructions usually beat long instructions.',
      'The second thing to check is source material. Paste only the parts that matter. If you want a meta description, the model probably needs the title, the page topic, and the important facts, not the entire website export.',
      'The third thing to check is output length. A short answer costs less than a long answer. If you only need 5 bullet points, say that. If you need a full article, expect a larger output token count.',
      'The useful habit is to estimate before sending the prompt. If the prompt is already huge, split the job. Ask for a summary of one section first, then use that smaller summary in the next step. That can make the answer easier to control because the model is not trying to juggle every detail at once.',
      'A token estimator is still an estimate. Different models tokenize text differently, and final billing depends on the actual provider, model, input, output, cached tokens, and pricing rules. The estimate is best for planning, not accounting.',
      'The full guide walks through the tool and explains how to read the result: https://accessfreetools.com/blog/how-to-use-prompt-token-estimator/',
      'Disclosure: I work on Access Free Tools. Do not paste private keys, client secrets, private customer data, or sensitive internal documents into token tools unless you know exactly where the text goes.',
    ],
  },
];

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const slugArg = process.argv.find((arg) => arg.startsWith('--slug='));
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const reportArg = process.argv.find((arg) => arg.startsWith('--report='));
  const slugs = slugArg
    ? slugArg
        .slice('--slug='.length)
        .split(',')
        .map((slug) => slug.trim())
        .filter(Boolean)
    : targets.map((target) => target.slug);

  return {
    slugs,
    outputDir: resolve(outputArg?.slice('--output='.length) ?? DEFAULT_OUTPUT_DIR),
    reportPath: resolve(reportArg?.slice('--report='.length) ?? DEFAULT_REPORT_PATH),
    publish: args.has('--publish'),
    confirmPublicPost: args.has('--confirm-public-post'),
  };
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function loadLocalEnv(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  }
}

function frontmatter(target, published = false) {
  return [
    '---',
    `title: "${target.title}"`,
    `published: ${published ? 'true' : 'false'}`,
    `description: "${target.description}"`,
    `tags: ${target.tags.join(', ')}`,
    `canonical_url: ${target.canonicalUrl}`,
    `cover_image: ${target.coverImage}`,
    '---',
  ].join('\n');
}

function makeDraft(target, published = false) {
  return `${frontmatter(target, published)}

# ${target.title}

${target.body.join('\n\n')}
`;
}

function publicBodyMarkdown(target) {
  return target.body.join('\n\n');
}

function apiPayload(target, published) {
  return {
    article: {
      title: target.title,
      published,
      body_markdown: publicBodyMarkdown(target),
      tags: target.tags,
      canonical_url: target.canonicalUrl,
      main_image: target.coverImage,
      description: target.description,
    },
  };
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'AccessFreeTools-Codex-Agent/1.0',
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function publishTarget(target) {
  loadLocalEnv(LOCAL_ENV_PATH);
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    throw new Error('Set DEVTO_API_KEY in .local/devto.env before publishing to DEV Community.');
  }

  const article = await requestJson(DEVTO_API, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
    },
    body: JSON.stringify(apiPayload(target, true)),
  });

  const publicUrl = article.url ?? '';
  let verified = false;
  if (publicUrl) {
    const response = await fetch(publicUrl, {
      headers: { 'user-agent': 'AccessFreeTools-Codex-Agent/1.0' },
    }).catch(() => null);
    verified = Boolean(response?.ok);
  }

  return {
    id: article.id ?? null,
    url: publicUrl,
    canonicalUrl: article.canonical_url ?? target.canonicalUrl,
    verified,
  };
}

async function main() {
  const options = parseArgs();
  if (options.publish) assertPublicPromotionChannel('devto');
  if (options.publish && !options.confirmPublicPost) {
    throw new Error('Publishing requires --confirm-public-post so accidental public posts do not happen.');
  }

  const selected = options.slugs.map((slug) => {
    const target = targets.find((item) => item.slug === slug);
    if (!target) {
      throw new Error(`Unknown DEV Community promotion slug: ${slug}`);
    }
    return target;
  });

  ensureDir(options.outputDir);
  ensureDir(dirname(options.reportPath));

  const results = [];
  for (const target of selected) {
    const draftPath = join(options.outputDir, `${target.slug}.md`);
    writeFileSync(draftPath, makeDraft(target, false));

    const result = {
      slug: target.slug,
      title: target.title,
      sourceUrl: target.sourceUrl,
      canonicalUrl: target.canonicalUrl,
      coverImage: target.coverImage,
      draftPath,
      status: options.publish ? 'pending-publish' : 'draft',
    };

    if (options.publish) {
      result.publish = await publishTarget(target);
      result.status = result.publish.verified ? 'verified-live' : 'submitted-needs-public-proof';
    }

    results.push(result);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    channel: 'devto',
    mode: options.publish ? 'publish' : 'draft',
    total: results.length,
    results,
  };
  writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Generated ${results.length} DEV Community draft(s).`);
  if (options.publish) {
    console.log('Submitted DEV Community article(s). Verify public URL proof before updating the promotion queue.');
  }
  console.log(`Saved report to ${options.reportPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
