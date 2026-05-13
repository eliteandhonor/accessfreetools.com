import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'reddit');
const SITE = 'https://accessfreetools.com';

const account = {
  username: 'accessfreetools',
  profileUrl: 'https://www.reddit.com/user/accessfreetools/',
  displayName: 'Access Free Tools',
  bio:
    'Free browser calculators, converters, and practical guides. I share helpful explanations and only link to Access Free Tools when it fits the question.',
  website: SITE,
};

const targets = [
  {
    slug: 'percentage-calculator',
    priority: 'High',
    page: '/tools/percentage-calculator/',
    title: 'How to calculate a discount without guessing',
    intent: 'Answer questions about sale discounts, tips, markups, and percent change.',
    communityTypes: ['math help communities', 'shopping/frugal communities that allow tool links'],
    avoid: ['investment advice threads', 'communities that ban calculators or self-links'],
    risk: 'Low',
    question:
      'Someone asks how to work out a discount, tip, markup, or percent change and needs the formula explained.',
    answer:
      'The clean way is to name the original number first, then the new number. For percent change, subtract original from new, divide by original, then multiply by 100. For a discount, multiply the price by the discount percent, then subtract that amount from the price.',
    example: 'Example: 25% off $80 means 80 x 0.25 = 20, so the sale price is $60.',
    linkText: 'percentage calculator',
    url: `${SITE}/tools/percentage-calculator/`,
    disclaimer: 'This is normal math, not financial advice.',
  },
  {
    slug: 'wallpaper-calculator',
    priority: 'Medium',
    page: '/tools/wallpaper-calculator/',
    title: 'What waste percent means in a wallpaper project',
    intent: 'Help DIY users understand wallpaper rolls, pattern repeat, openings, and waste.',
    communityTypes: ['DIY communities', 'home improvement communities that allow helpful resources'],
    avoid: ['professional contractor quote threads', 'communities with no self-promotion rules'],
    risk: 'Home project',
    question:
      'Someone is confused about wallpaper roll count or why a calculator asks for waste percent.',
    answer:
      'Waste percent is extra wallpaper for cuts, trimming, corners, pattern matching, and mistakes. Patterned wallpaper usually needs more extra material than plain wallpaper because matching the design can create offcuts.',
    example:
      'Example: if the walls need 5 rolls before waste, 10% waste means planning for about 5.5 rolls, which rounds up to 6 rolls.',
    linkText: 'wallpaper calculator',
    url: `${SITE}/tools/wallpaper-calculator/`,
    disclaimer: 'Real rooms can need more material if walls are uneven or the pattern repeat is large.',
  },
  {
    slug: 'watts-to-amps-calculator',
    priority: 'Medium',
    page: '/tools/watts-to-amps-calculator/',
    title: 'Watts to amps is simple math, but voltage matters',
    intent: 'Explain watts, volts, amps, and why electrical results need caution.',
    communityTypes: ['electronics learning communities', 'DIY communities only when safety rules allow'],
    avoid: ['code or electrical safety approval threads', 'mains wiring advice threads'],
    risk: 'Electrical',
    question: 'Someone asks how to convert watts to amps or why their answer changes with voltage.',
    answer:
      'For DC or a simple single-phase estimate, amps usually means watts divided by volts. The part people miss is that voltage changes the answer, so 1200 watts is 10 amps at 120 volts but 5 amps at 240 volts.',
    example: 'Example: 600 W / 120 V = 5 A. The same 600 W / 12 V = 50 A.',
    linkText: 'watts to amps calculator',
    url: `${SITE}/tools/watts-to-amps-calculator/`,
    disclaimer: 'Use this as a learning estimate only. Real wiring and breaker choices need a qualified person and local code.',
  },
  {
    slug: 'markdown-table-generator',
    priority: 'Medium',
    page: '/tools/markdown-table-generator/',
    title: 'How to fix a messy Markdown table quickly',
    intent: 'Help people make clean Markdown tables for docs, READMEs, notes, and tickets.',
    communityTypes: ['programming help communities', 'documentation and note-taking communities'],
    avoid: ['showcase-only communities', 'threads that ask for code review rather than tooling'],
    risk: 'Low',
    question: 'Someone is hand-spacing Markdown table rows and the preview keeps breaking.',
    answer:
      'Markdown tables break when headers, separators, and row cells do not line up logically. You do not need perfect spacing, but you do need the same number of cells in each row and a separator row under the header.',
    example: 'Example: `| Name | Score |` then `| --- | ---: |` sets a text column and a right-aligned number column.',
    linkText: 'Markdown table generator',
    url: `${SITE}/tools/markdown-table-generator/`,
    disclaimer: 'Always preview the table in the app where it will be used because Markdown flavors vary.',
  },
  {
    slug: 'concrete-calculator',
    priority: 'Medium',
    page: '/tools/concrete-calculator/',
    title: 'Concrete calculators help you avoid under-ordering',
    intent: 'Explain slab, footing, post hole, and waste estimates for home projects.',
    communityTypes: ['DIY communities', 'home improvement communities'],
    avoid: ['structural engineering decisions', 'permit or code approval threads'],
    risk: 'Construction',
    question: 'Someone needs a rough concrete estimate for a slab, post hole, or footing.',
    answer:
      'Concrete volume is length x width x depth, but the units must match. The mistake is often entering depth in inches while the length and width are in feet without converting.',
    example: 'Example: a 10 ft by 8 ft slab at 4 inches deep is 10 x 8 x 0.333 = about 26.6 cubic feet before waste.',
    linkText: 'concrete calculator',
    url: `${SITE}/tools/concrete-calculator/`,
    disclaimer: 'This is a quantity estimate, not a structural design or building approval.',
  },
  {
    slug: 'ad-revenue-calculator',
    priority: 'High',
    page: '/tools/ad-revenue-calculator/',
    title: 'Ad revenue math before a site has big traffic',
    intent: 'Explain RPM, pageviews, CTR, CPC, and estimate limits for creators.',
    communityTypes: ['blogging communities', 'website owner communities', 'creator business communities'],
    avoid: ['income guarantee threads', 'affiliate link-dump communities', 'paid ad campaign threads'],
    risk: 'Money',
    question: 'Someone wants to estimate possible display ad revenue from traffic numbers.',
    answer:
      'The simple way is to start with RPM, which means estimated revenue per 1000 pageviews. Revenue estimate is pageviews divided by 1000, then multiplied by RPM.',
    example: 'Example: 50,000 pageviews at a $5 RPM is 50 x 5 = about $250 before platform limits, taxes, and traffic quality changes.',
    linkText: 'ad revenue calculator',
    url: `${SITE}/tools/ad-revenue-calculator/`,
    disclaimer: 'This is only an estimate. It does not promise earnings, approval, ad fill, or stable RPM.',
  },
  {
    slug: 'image-to-text-ocr-tool',
    priority: 'Medium',
    page: '/tools/image-to-text-ocr-tool/',
    title: 'OCR works better when the image is clean',
    intent: 'Help people understand browser OCR quality and privacy limits.',
    communityTypes: ['productivity communities', 'study communities', 'note-taking communities'],
    avoid: ['privacy-sensitive document threads', 'legal or medical records threads'],
    risk: 'AI/privacy',
    question: 'Someone asks how to copy text out of a screenshot, receipt, or photo.',
    answer:
      'OCR is best when the image is sharp, straight, high contrast, and not too tiny. It can misread handwriting, glare, logos, decorative fonts, or rotated text.',
    example: 'Example: a flat screenshot of typed text usually works better than a tilted phone photo of a crumpled receipt.',
    linkText: 'browser OCR tool',
    url: `${SITE}/tools/image-to-text-ocr-tool/`,
    disclaimer:
      'Do not paste or upload sensitive records into random tools. This tool runs OCR in the browser, but model files may still download first.',
  },
  {
    slug: 'mortgage-calculator',
    priority: 'High',
    page: '/tools/mortgage-calculator/',
    title: 'Mortgage calculators give a ballpark, not approval',
    intent: 'Explain monthly payment estimates, taxes, insurance, and lender limits.',
    communityTypes: ['home buying communities where resources are allowed', 'personal finance communities only when rules allow'],
    avoid: ['loan approval advice', 'tax advice', 'communities that ban calculators or self-links'],
    risk: 'Finance',
    question: 'Someone asks how to estimate a monthly mortgage payment before talking to a lender.',
    answer:
      'A mortgage calculator is useful for a first ballpark. It usually starts with price, down payment, interest rate, loan term, taxes, and insurance. The result helps you compare scenarios, not prove what a lender will approve.',
    example:
      'Example: changing the interest rate by even 1 point can move the monthly payment a lot, so compare a low, middle, and high rate.',
    linkText: 'mortgage calculator',
    url: `${SITE}/tools/mortgage-calculator/`,
    disclaimer:
      'This is educational only. It does not include lender rules, closing costs, credit approval, local taxes, or personal financial advice.',
  },
];

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  const outputArg = process.argv.find((arg) => arg.startsWith('--output='));
  const slugArg = process.argv.find((arg) => arg.startsWith('--slug='));

  return {
    all: args.has('--all') || !slugArg,
    outputDir: resolve(outputArg?.slice('--output='.length) ?? DEFAULT_OUTPUT_DIR),
    slugs: slugArg
      ? slugArg
          .slice('--slug='.length)
          .split(',')
          .map((slug) => slug.trim())
          .filter(Boolean)
      : targets.map((target) => target.slug),
  };
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function frontmatter(target, type) {
  return [
    '---',
    `channel: reddit`,
    `type: ${type}`,
    `slug: ${target.slug}`,
    `priority: ${target.priority}`,
    `risk: ${target.risk}`,
    `source: ${target.url}`,
    `status: draft`,
    '---',
    '',
  ].join('\n');
}

function makeCommentDraft(target) {
  return `${frontmatter(target, 'helpful-reply')}# ${target.title}

Use this only when:

- The community rules allow helpful self-links.
- The question matches this intent: ${target.intent}
- The answer is useful even if the reader ignores the link.
- You disclose that Access Free Tools is your own project.

Avoid:

${target.avoid.map((item) => `- ${item}`).join('\n')}

Candidate community types to research first:

${target.communityTypes.map((item) => `- ${item}`).join('\n')}

## Draft Reply

You can think about it this way:

${target.answer}

${target.example}

${target.disclaimer}

I work on Access Free Tools, so this is my own project, but the explanation above should still help without the link. If you want to check the numbers, here is the ${target.linkText}: ${target.url}

## Posting Checklist

- Read the community rules first.
- Do not post if the community bans self-promotion or calculators.
- Keep at most one Access Free Tools link.
- Answer the question before linking.
- Do not argue if a moderator removes it.
`;
}

function makeProfilePostDraft(target) {
  return `${frontmatter(target, 'profile-post')}# ${target.title}

This is a safe profile-post draft for the Access Free Tools Reddit profile. It is not meant for random subreddit posting.

If you ever share this outside the profile, read the community rules first and only use it where the answer is welcome.

## Draft Title

${target.title}

## Draft Body

I am building Access Free Tools one useful page at a time. The goal is simple: calculators and browser tools that explain what the inputs mean, what the result means, and when not to rely on it.

The practical problem: ${target.question}

${target.answer}

${target.example}

${target.disclaimer}

Tool page: ${target.url}

Disclosure: this is my own project. I am sharing it from the Access Free Tools account, not pretending to be an unrelated user.

The explanation above should still help without the link. The link is only there so people can check the numbers if they want to.
`;
}

function writeSetupGuide(outputDir, selectedTargets) {
  const path = join(outputDir, 'reddit-account-setup.md');
  const content = `# Reddit Account Setup

Generated for the Access Free Tools promotion agent.

## Account

- Username: ${account.username}
- Public profile: ${account.profileUrl}
- Display name: ${account.displayName}
- Website: ${account.website}
- Bio: ${account.bio}

## Best Setup Choices

1. Set the profile display name to \`${account.displayName}\`.
2. Set the about/bio text to the bio above.
3. Add \`${account.website}\` as the public website link if Reddit offers it.
4. Add the same Access Free Tools logo used on Pinterest and Medium.
5. Turn on email verification and two-factor authentication if available.
6. Use Reddit Pro if it is offered for the account, because it is the official organic business profile path.
7. Do not connect billing, ads, or paid campaigns.

## First Safe Actions

- Post one introduction on the Access Free Tools profile, not in a subreddit.
- Spend the first week answering questions only when the answer is useful without a link.
- Keep self-links rare and disclosed.
- Track every public link in \`docs/promotion-queue.md\`.

## Drafts Created

${selectedTargets.map((target) => `- ${target.title}: \`${target.slug}\``).join('\n')}
`;

  writeFileSync(path, content);
  return path;
}

function writeQueue(outputDir, selectedTargets) {
  const path = join(outputDir, '_reddit-queue.md');
  const rows = selectedTargets
    .map(
      (target) =>
        `| ${target.priority} | ${target.page} | ${target.title} | ${target.risk} | draft | Read community rules, then use the matching draft only when directly relevant. |`,
    )
    .join('\n');

  const content = `# Reddit Promotion Queue

Reddit work is draft-first. Public posting should stay helpful, disclosed, and community-specific.

| Priority | Page | Angle | Risk | Status | Next Action |
| --- | --- | --- | --- | --- | --- |
${rows}
`;

  writeFileSync(path, content);
  return path;
}

function main() {
  const options = parseArgs();
  const selectedTargets = targets.filter((target) => options.slugs.includes(target.slug));
  const missingSlugs = options.slugs.filter((slug) => !targets.some((target) => target.slug === slug));

  if (missingSlugs.length > 0) {
    throw new Error(`Unknown Reddit promotion slug(s): ${missingSlugs.join(', ')}`);
  }

  ensureDir(options.outputDir);
  const draftsDir = join(options.outputDir, 'drafts');
  ensureDir(draftsDir);

  const drafts = [];

  for (const target of selectedTargets) {
    const commentPath = join(draftsDir, `${target.slug}-reply.md`);
    const profilePath = join(draftsDir, `${target.slug}-profile-post.md`);
    writeFileSync(commentPath, makeCommentDraft(target));
    writeFileSync(profilePath, makeProfilePostDraft(target));
    drafts.push({ slug: target.slug, type: 'reply', path: commentPath });
    drafts.push({ slug: target.slug, type: 'profile-post', path: profilePath });
  }

  const setupPath = writeSetupGuide(options.outputDir, selectedTargets);
  const queuePath = writeQueue(options.outputDir, selectedTargets);
  const reportPath = join(options.outputDir, 'reddit-promotion-report.json');
  const report = {
    generatedAt: new Date().toISOString(),
    account: {
      username: account.username,
      profileUrl: account.profileUrl,
      displayName: account.displayName,
      website: account.website,
    },
    rules: {
      noMassPosting: true,
      discloseOwnership: true,
      readCommunityRulesFirst: true,
      noPaidAds: true,
      noCredentialStorage: true,
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

  console.log(`Generated Reddit setup guide: ${setupPath}`);
  console.log(`Generated Reddit queue: ${queuePath}`);
  console.log(`Generated ${drafts.length} Reddit drafts in ${draftsDir}`);
  console.log(`Generated report: ${reportPath}`);
}

main();
