import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SITE = 'https://accessfreetools.com';
const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'quora');

const account = {
  displayName: 'Access Free Tools',
  email: 'contact@accessfreetools.com',
  website: SITE,
  bio:
    'Access Free Tools shares free browser calculators, converters, AI text tools, and practical guides for everyday math, home projects, finance, school, and browser tasks.',
};

const targets = [
  {
    slug: 'percentage-calculator',
    priority: 'High',
    risk: 'low',
    page: '/tools/percentage-calculator/',
    title: 'How do I calculate percent off without guessing?',
    searchQueries: ['how to calculate percent off', 'how do I calculate a discount', 'percent change formula'],
    shortAnswer:
      'Percent off means you multiply the original price by the discount rate, then subtract that discount amount from the original price.',
    example: 'If something costs $80 and it is 25% off, the discount is 80 x 0.25 = 20, so the sale price is $60.',
    mistake:
      'The common mistake is mixing up the discount amount and the final sale price. A 25% discount on $80 is $20 off, not a final price of $20.',
    linkText: 'percentage calculator',
    url: `${SITE}/tools/percentage-calculator/`,
    limitation: 'This is normal math, not financial advice.',
  },
  {
    slug: 'wallpaper-calculator',
    priority: 'Medium',
    risk: 'home project',
    page: '/tools/wallpaper-calculator/',
    title: 'What does waste percent mean when estimating wallpaper rolls?',
    searchQueries: ['wallpaper waste percent', 'how many wallpaper rolls do I need', 'wallpaper roll calculator'],
    shortAnswer:
      'Waste percent is extra wallpaper for trimming, corners, pattern matching, damaged pieces, and small measuring mistakes.',
    example:
      'If your room needs about 5 rolls before waste and you add 10% waste, that becomes 5.5 rolls, which usually rounds up to 6 rolls.',
    mistake:
      'The common mistake is treating wall area like every piece fits perfectly. Patterned wallpaper usually needs more extra material than plain wallpaper.',
    linkText: 'wallpaper calculator',
    url: `${SITE}/tools/wallpaper-calculator/`,
    limitation: 'Real rooms can need more material if walls are uneven, openings are tricky, or the pattern repeat is large.',
  },
  {
    slug: 'watts-to-amps-calculator',
    priority: 'Medium',
    risk: 'electrical',
    page: '/tools/watts-to-amps-calculator/',
    title: 'How do I convert watts to amps?',
    searchQueries: ['convert watts to amps', 'watts amps volts formula', 'why does voltage change amps'],
    shortAnswer:
      'For a simple DC or single-phase estimate, amps equals watts divided by volts. Voltage matters because the same wattage can need very different current at different voltages.',
    example: '600 watts at 120 volts is 600 / 120 = 5 amps. The same 600 watts at 12 volts is 50 amps.',
    mistake:
      'The common mistake is asking for amps without giving voltage. Watts alone is not enough information.',
    linkText: 'watts to amps calculator',
    url: `${SITE}/tools/watts-to-amps-calculator/`,
    limitation:
      'Use this as a learning estimate only. Real wiring, breakers, and code decisions need a qualified person and local electrical rules.',
  },
  {
    slug: 'markdown-table-generator',
    priority: 'Medium',
    risk: 'low',
    page: '/tools/markdown-table-generator/',
    title: 'Why does my Markdown table keep breaking?',
    searchQueries: ['markdown table not working', 'make markdown table', 'markdown table generator'],
    shortAnswer:
      'A Markdown table needs a header row, a separator row, and the same number of cells in each row. The spacing does not have to be perfect, but the structure does.',
    example: '`| Name | Score |` followed by `| --- | ---: |` creates a text column and a right-aligned number column.',
    mistake:
      'The common mistake is adding three cells in one row and two in another. Many Markdown renderers will then display the table strangely.',
    linkText: 'Markdown table generator',
    url: `${SITE}/tools/markdown-table-generator/`,
    limitation: 'Always preview the table in the app where it will be used because Markdown flavors vary.',
  },
  {
    slug: 'image-to-text-ocr-tool',
    priority: 'Medium',
    risk: 'ai/privacy',
    page: '/tools/image-to-text-ocr-tool/',
    title: 'How can I copy text from an image or screenshot?',
    searchQueries: ['copy text from image', 'image to text OCR', 'extract text from screenshot'],
    shortAnswer:
      'Use OCR, which means optical character recognition. It works best on sharp, straight, high-contrast images with typed text.',
    example:
      'A clean screenshot of a paragraph usually works better than a tilted photo of a wrinkled receipt with glare on it.',
    mistake:
      'The common mistake is trusting OCR output without checking it. OCR can confuse similar letters, numbers, handwriting, and decorative fonts.',
    linkText: 'browser OCR tool',
    url: `${SITE}/tools/image-to-text-ocr-tool/`,
    limitation:
      'Do not use random tools for sensitive records. This Access Free Tools OCR page runs in the browser, though model files may download before the tool works.',
  },
  {
    slug: 'concrete-calculator',
    priority: 'Medium',
    risk: 'construction',
    page: '/tools/concrete-calculator/',
    title: 'How do I estimate concrete for a small slab?',
    searchQueries: ['concrete slab calculator', 'estimate concrete volume', 'how much concrete do I need'],
    shortAnswer:
      'Concrete volume is length times width times depth. The important part is making sure all the units match before multiplying.',
    example:
      'A 10 ft by 8 ft slab at 4 inches deep is 10 x 8 x 0.333 = about 26.6 cubic feet before waste.',
    mistake:
      'The common mistake is entering depth in inches while length and width are in feet without converting the depth.',
    linkText: 'concrete calculator',
    url: `${SITE}/tools/concrete-calculator/`,
    limitation: 'This is a quantity estimate, not a structural design, contractor quote, or building approval.',
  },
  {
    slug: 'ad-revenue-calculator',
    priority: 'High',
    risk: 'money',
    page: '/tools/ad-revenue-calculator/',
    title: 'How do I estimate website ad revenue from pageviews?',
    searchQueries: ['estimate website ad revenue', 'RPM pageviews calculator', 'what is RPM ad revenue'],
    shortAnswer:
      'A simple ad revenue estimate uses RPM, which means revenue per 1,000 pageviews. Divide pageviews by 1,000, then multiply by RPM.',
    example: '50,000 pageviews at a $5 RPM is 50 x 5 = about $250 before platform limits, taxes, ad fill, and traffic quality changes.',
    mistake:
      'The common mistake is treating RPM like a promise. RPM changes by country, niche, ad placement, season, traffic quality, and ad approval status.',
    linkText: 'ad revenue calculator',
    url: `${SITE}/tools/ad-revenue-calculator/`,
    limitation: 'This is only an estimate. It does not promise earnings, approval, ad fill, or stable RPM.',
  },
  {
    slug: 'mortgage-calculator',
    priority: 'High',
    risk: 'finance',
    page: '/tools/mortgage-calculator/',
    title: 'What should I know before using a mortgage calculator?',
    searchQueries: ['mortgage calculator monthly payment', 'estimate mortgage payment', 'mortgage payment formula'],
    shortAnswer:
      'A mortgage calculator is good for a first payment estimate. It usually uses home price, down payment, interest rate, loan term, taxes, and insurance.',
    example:
      'Try a low, middle, and high interest rate instead of one perfect number. Even a 1 point rate change can move the payment a lot.',
    mistake:
      'The common mistake is treating the payment estimate like lender approval. A real lender also looks at income, credit, debts, fees, and local rules.',
    linkText: 'mortgage calculator',
    url: `${SITE}/tools/mortgage-calculator/`,
    limitation:
      'This is educational only, not financial advice or loan approval. It may not include closing costs, lender rules, or local tax details.',
  },
];

function parseArgs() {
  const slugArg = process.argv.find((arg) => arg.startsWith('--slug='));
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const slugs = slugArg
    ? slugArg
        .slice('--slug='.length)
        .split(',')
        .map((slug) => slug.trim())
        .filter(Boolean)
    : targets.map((target) => target.slug);

  return {
    outputDir: resolve(outputArg?.slice('--output='.length) ?? DEFAULT_OUTPUT_DIR),
    slugs,
  };
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function frontmatter(target) {
  return `---
channel: quora
type: answer-draft
slug: ${target.slug}
priority: ${target.priority}
risk: ${target.risk}
source: ${target.url}
status: draft
---

`;
}

function makeDraft(target) {
  return `${frontmatter(target)}# ${target.title}

Use this draft only when a Quora question clearly matches the topic. The answer must help even if the reader never clicks the link.

## Questions To Search

${target.searchQueries.map((query) => `- ${query}`).join('\n')}

## Draft Answer

Short answer: ${target.shortAnswer}

Here is a quick example. ${target.example}

The mistake to watch for is this: ${target.mistake}

${target.limitation}

I work on Access Free Tools, so this is my own project. The explanation above should still help without the link, but if you want to check the numbers, here is the ${target.linkText}: ${target.url}

## Posting Checklist

- Read the exact Quora question before answering.
- Do not paste this into unrelated questions.
- Keep one Access Free Tools link at most.
- Do not add affiliate links.
- Do not promise income, health outcomes, electrical safety, or construction approval.
- Verify the public Quora answer URL before marking this posted.
`;
}

function writeSetupGuide(outputDir, selectedTargets) {
  const path = join(outputDir, 'quora-account-setup.md');
  const content = `# Quora Account Setup

Generated for the Access Free Tools Quora promotion agent.

## Account

- Display name: ${account.displayName}
- Email: ${account.email}
- Website: ${account.website}
- Bio: ${account.bio}

## Best Setup Choices

1. Set the profile name to \`${account.displayName}\`.
2. Add the website URL if Quora exposes a public website/profile link field.
3. Add the same Access Free Tools avatar used on Pinterest, Medium, and Bluesky.
4. Add a credential such as "Free calculators, converters, and practical browser tools".
5. Do not connect ads, billing, or affiliate links.

## Drafts Created

${selectedTargets.map((target) => `- ${target.title}: \`${target.slug}\``).join('\n')}
`;

  writeFileSync(path, content);
  return path;
}

function writeQueue(outputDir, selectedTargets) {
  const path = join(outputDir, '_quora-queue.md');
  const rows = selectedTargets
    .map(
      (target) =>
        `| ${target.priority} | ${target.page} | ${target.title} | ${target.risk} | draft | Search Quora for an exact-match question, answer fully, disclose ownership, and use at most one link. |`,
    )
    .join('\n');

  const content = `# Quora Promotion Queue

Quora work is question-match-first. Do not post these drafts to unrelated questions.

| Priority | Page | Question Angle | Risk | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
${rows}
`;

  writeFileSync(path, content);
  return path;
}

function main() {
  const options = parseArgs();
  const selectedTargets = options.slugs.map((slug) => {
    const target = targets.find((item) => item.slug === slug);
    if (!target) {
      throw new Error(`Unknown Quora promotion slug: ${slug}`);
    }
    return target;
  });

  ensureDir(options.outputDir);
  const draftsDir = join(options.outputDir, 'drafts');
  ensureDir(draftsDir);

  const drafts = [];
  for (const target of selectedTargets) {
    const path = join(draftsDir, `${target.slug}.md`);
    writeFileSync(path, makeDraft(target));
    drafts.push({ slug: target.slug, path });
  }

  const setupPath = writeSetupGuide(options.outputDir, selectedTargets);
  const queuePath = writeQueue(options.outputDir, selectedTargets);
  const reportPath = join(options.outputDir, 'quora-promotion-report.json');
  const report = {
    generatedAt: new Date().toISOString(),
    account: {
      displayName: account.displayName,
      email: account.email,
      website: account.website,
    },
    rules: {
      draftFirst: true,
      discloseOwnership: true,
      oneLinkMaximum: true,
      noAffiliateLinks: true,
      noCredentialStorage: true,
      publicProofRequired: true,
    },
    counts: {
      targets: selectedTargets.length,
      drafts: drafts.length,
    },
    setupPath,
    queuePath,
    drafts,
  };

  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log(`Generated Quora setup guide: ${setupPath}`);
  console.log(`Generated Quora queue: ${queuePath}`);
  console.log(`Generated ${drafts.length} Quora drafts in ${draftsDir}`);
  console.log(`Generated report: ${reportPath}`);
}

main();
