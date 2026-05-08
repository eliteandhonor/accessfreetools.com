import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SITE = 'https://accessfreetools.com';
const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'bluesky', 'drafts');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'bluesky', 'bluesky-promotion-report.json');
const BSKY_SERVICE = 'https://bsky.social';

const targets = [
  {
    slug: 'ad-revenue-calculator',
    priority: 'High',
    risk: 'money',
    page: '/tools/ad-revenue-calculator/',
    title: 'Ad Revenue Calculator',
    text:
      'Ad revenue estimates get clearer when you separate pageviews, RPM, CTR, and CPC. This free calculator helps test scenarios without treating them like promised income.',
    tags: ['#Websites', '#AdSense'],
    url: `${SITE}/tools/ad-revenue-calculator/`,
  },
  {
    slug: 'percentage-calculator',
    priority: 'High',
    risk: 'low',
    page: '/tools/percentage-calculator/',
    title: 'Percentage Calculator',
    text:
      'Discounts, tips, markups, and percent change are easier when the original number is labeled clearly. This calculator keeps the math in plain language.',
    tags: ['#Math', '#Calculators'],
    url: `${SITE}/tools/percentage-calculator/`,
  },
  {
    slug: 'mortgage-calculator',
    priority: 'High',
    risk: 'finance',
    page: '/tools/mortgage-calculator/',
    title: 'Mortgage Calculator',
    text:
      'A mortgage calculator should be a planning estimate, not a promise. This one helps compare price, down payment, rate, term, taxes, and insurance.',
    tags: ['#Finance', '#HomeBuying'],
    url: `${SITE}/tools/mortgage-calculator/`,
  },
  {
    slug: 'wallpaper-calculator',
    priority: 'Medium',
    risk: 'home project',
    page: '/tools/wallpaper-calculator/',
    title: 'Wallpaper Calculator',
    text:
      'Waste percent is extra wallpaper for cuts, corners, pattern matching, and mistakes. This calculator explains that before estimating rolls.',
    tags: ['#DIY', '#HomeProjects'],
    url: `${SITE}/tools/wallpaper-calculator/`,
  },
  {
    slug: 'watts-to-amps-calculator',
    priority: 'Medium',
    risk: 'electrical',
    page: '/tools/watts-to-amps-calculator/',
    title: 'Watts To Amps Calculator',
    text:
      'Watts to amps is simple math, but voltage and phase matter. Use this as a learning estimate, not electrical code or wiring approval.',
    tags: ['#Electrical', '#DIY'],
    url: `${SITE}/tools/watts-to-amps-calculator/`,
  },
  {
    slug: 'image-to-text-ocr-tool',
    priority: 'Medium',
    risk: 'ai/privacy',
    page: '/tools/image-to-text-ocr-tool/',
    title: 'Image To Text OCR Tool',
    text:
      'OCR works best with sharp, high-contrast images. This browser OCR tool explains privacy limits and why blurry screenshots can still cause mistakes.',
    tags: ['#AI', '#Productivity'],
    url: `${SITE}/tools/image-to-text-ocr-tool/`,
  },
  {
    slug: 'markdown-table-generator',
    priority: 'Medium',
    risk: 'low',
    page: '/tools/markdown-table-generator/',
    title: 'Markdown Table Generator',
    text:
      'Markdown tables break when rows have uneven cells. This free generator helps make clean tables for READMEs, docs, notes, and tickets.',
    tags: ['#Markdown', '#DevTools'],
    url: `${SITE}/tools/markdown-table-generator/`,
  },
  {
    slug: 'concrete-calculator',
    priority: 'Medium',
    risk: 'construction',
    page: '/tools/concrete-calculator/',
    title: 'Concrete Calculator',
    text:
      'Concrete estimates start with volume, but unit mistakes can throw the result off fast. This calculator helps plan slabs, footings, posts, and waste, not structural approval.',
    tags: ['#DIY', '#Construction'],
    url: `${SITE}/tools/concrete-calculator/`,
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

function postText(target) {
  return `${target.text}\n\n${target.url}\n\n${target.tags.join(' ')}`;
}

function makeDraft(target) {
  const text = postText(target);

  return `---
channel: bluesky
slug: ${target.slug}
priority: ${target.priority}
risk: ${target.risk}
source: ${target.url}
status: draft
---

# ${target.title}

Disclosure: this is for the official Access Free Tools Bluesky account.

## Post Text

${text}

## Quality Notes

- Keep the post useful without hype.
- Use one Access Free Tools link.
- Do not promise income, health outcomes, or electrical/construction safety.
- After posting, verify the public Bluesky URL before marking it posted.
`;
}

function byteLength(text) {
  return Buffer.byteLength(text, 'utf8');
}

function linkFacets(text) {
  const facets = [];
  const urlRegex = /https?:\/\/[^\s]+/g;
  for (const match of text.matchAll(urlRegex)) {
    const uri = match[0];
    const start = byteLength(text.slice(0, match.index));
    const end = start + byteLength(uri);
    facets.push({
      index: {
        byteStart: start,
        byteEnd: end,
      },
      features: [
        {
          $type: 'app.bsky.richtext.facet#link',
          uri,
        },
      ],
    });
  }
  return facets;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function createSession() {
  const identifier = process.env.BLUESKY_HANDLE;
  const password = process.env.BLUESKY_APP_PASSWORD;
  if (!identifier || !password) {
    throw new Error('Set BLUESKY_HANDLE and BLUESKY_APP_PASSWORD before publishing.');
  }

  return requestJson(`${BSKY_SERVICE}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

async function fetchCard(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const html = await response.text();
    const meta = (property) => {
      const pattern = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
      return html.match(pattern)?.[1]?.trim() ?? '';
    };
    const title = meta('og:title') || url;
    const description = meta('og:description') || '';
    return {
      $type: 'app.bsky.embed.external',
      external: {
        uri: url,
        title: title.slice(0, 300),
        description: description.slice(0, 1000),
      },
    };
  } catch {
    return null;
  }
}

async function publishTarget(session, target) {
  const text = postText(target);
  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
    langs: ['en'],
    facets: linkFacets(text),
  };
  const embed = await fetchCard(target.url);
  if (embed) {
    record.embed = embed;
  }

  const result = await requestJson(`${BSKY_SERVICE}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  });
  const rkey = result.uri.split('/').pop();
  return {
    uri: result.uri,
    cid: result.cid,
    publicUrl: `https://bsky.app/profile/${process.env.BLUESKY_HANDLE}/post/${rkey}`,
  };
}

async function main() {
  const options = parseArgs();
  if (options.publish && !options.confirmPublicPost) {
    throw new Error('Publishing requires --confirm-public-post so accidental public posts do not happen.');
  }

  const selected = options.slugs.map((slug) => {
    const target = targets.find((item) => item.slug === slug);
    if (!target) {
      throw new Error(`Unknown Bluesky promotion slug: ${slug}`);
    }
    return target;
  });

  ensureDir(options.outputDir);
  ensureDir(dirname(options.reportPath));

  const session = options.publish ? await createSession() : null;
  const results = [];

  for (const target of selected) {
    const draftPath = join(options.outputDir, `${target.slug}.md`);
    const text = postText(target);
    writeFileSync(draftPath, makeDraft(target));

    const result = {
      slug: target.slug,
      title: target.title,
      page: target.page,
      url: target.url,
      draftPath,
      characters: [...text].length,
      status: options.publish ? 'pending-publish' : 'draft',
    };

    if (options.publish) {
      result.publish = await publishTarget(session, target);
      result.status = 'submitted';
    }

    results.push(result);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    channel: 'bluesky',
    mode: options.publish ? 'publish' : 'draft',
    total: results.length,
    results,
  };
  writeFileSync(options.reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Generated ${results.length} Bluesky promotion draft(s).`);
  if (options.publish) {
    console.log('Submitted Bluesky posts. Verify each public URL before marking posted.');
  }
  console.log(`Saved report to ${options.reportPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
