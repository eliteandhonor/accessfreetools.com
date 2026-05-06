import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'medium');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'medium-promotion-report.json');

const posts = [
  {
    slug: 'right-free-online-calculator',
    title: 'How To Pick The Right Free Online Calculator',
    subtitle: 'A short guide to choosing a calculator that explains the answer, not just the number.',
    sourceUrl: `${SITE_ORIGIN}/tools/`,
    canonicalUrl: `${SITE_ORIGIN}/free-calculator-resources/`,
    tags: ['Calculators', 'Math', 'Productivity', 'Tools', 'Education'],
    audience: 'Students, shoppers, DIY planners, and anyone comparing calculator pages.',
    sections: [
      {
        heading: 'Start with the job, not the calculator name',
        paragraphs: [
          'A good calculator starts by matching the question you actually have. If you are checking a discount, you probably need a percentage calculator. If you are checking a home payment, a mortgage calculator is a better fit than a plain arithmetic calculator.',
          'The fastest way to choose is to write the sentence you are trying to answer: "What is 20 percent off 80?", "How many wallpaper rolls do I need?", or "What is my monthly loan payment?" Then pick the tool built for that exact sentence.',
        ],
      },
      {
        heading: 'Look for input explanations',
        paragraphs: [
          'The calculator should explain what each field means. Finance tools should say whether a number is monthly or yearly. Home project tools should say whether they use feet, inches, square feet, rolls, or waste percent.',
          'If a page only gives an answer with no examples, it is easier to use the wrong input and still get a number that looks believable.',
        ],
      },
      {
        heading: 'Use the result notes',
        paragraphs: [
          'A useful result tells you what the answer means and what it leaves out. This matters most for finance, health, tax, pregnancy, construction, electrical, and AI tools because those answers can affect real choices.',
          'Access Free Tools pages are built around that idea: quick browser tools, plain-language examples, and notes about when not to rely on a simple estimate.',
        ],
      },
    ],
    callout:
      'Try the Access Free Tools library if you want calculators, converters, browser AI tools, and guides in one place.',
  },
  {
    slug: 'percentage-calculator-discounts',
    title: 'How Percentage Calculators Help With Discounts, Tips, And Markups',
    subtitle: 'Percent questions are easier when you separate the original number, the new number, and the rate.',
    sourceUrl: `${SITE_ORIGIN}/tools/percentage-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-percentage-calculator/`,
    tags: ['Percentages', 'Math', 'Shopping', 'Education', 'Calculators'],
    audience: 'People checking discounts, markups, tips, growth, and percent change.',
    sections: [
      {
        heading: 'Percent of a number',
        paragraphs: [
          'This is the everyday sale-price question. If you want 20 percent of 80, convert 20 percent to 0.20 and multiply 80 by 0.20. The answer is 16.',
          'That same pattern works for tips, tax estimates, fees, and markups.',
        ],
      },
      {
        heading: 'Percent change',
        paragraphs: [
          'Percent change compares an old value with a new value. The formula is: new value minus old value, divided by the old value, then multiplied by 100.',
          'If a price moves from 80 to 100, the change is 20. Divide 20 by 80 and multiply by 100. That is a 25 percent increase.',
        ],
      },
      {
        heading: 'Reverse percentages',
        paragraphs: [
          'Reverse percentage problems work backward from a known result. These are easy to mix up, especially after discounts or tax.',
          'A calculator helps because it labels the type of question before it shows the answer.',
        ],
      },
    ],
    callout:
      'The free Percentage Calculator on Access Free Tools includes percent-of, percent change, discounts, markups, and reverse percentages.',
  },
  {
    slug: 'wallpaper-waste-percent',
    title: 'What Waste Percent Means In A Wallpaper Calculator',
    subtitle: 'Waste percent is extra material for trimming, pattern matching, mistakes, corners, and repeat alignment.',
    sourceUrl: `${SITE_ORIGIN}/tools/wallpaper-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-wallpaper-calculator/`,
    tags: ['DIY', 'Home Improvement', 'Wallpaper', 'Calculators', 'Planning'],
    audience: 'Home project planners estimating wallpaper rolls.',
    sections: [
      {
        heading: 'Why waste exists',
        paragraphs: [
          'Wallpaper is not used like perfect graph paper. You cut around windows, doors, corners, outlets, uneven walls, and trims. If the wallpaper has a repeating pattern, you may also need extra length so the design lines up from one strip to the next.',
          'That extra material is what waste percent tries to cover.',
        ],
      },
      {
        heading: 'A simple example',
        paragraphs: [
          'If the wall area needs about 8 rolls before waste and you add 10 percent waste, the calculator plans for 8.8 rolls. Since rolls are bought as whole rolls, that usually rounds up to 9 rolls.',
          'For a simple plain wallpaper, the waste percent can be lower. For a bold pattern or tricky room, it usually needs to be higher.',
        ],
      },
      {
        heading: 'Common mistake',
        paragraphs: [
          'The common mistake is setting waste to 0 because the wall area math looks clean. Real walls are not that clean.',
          'The other mistake is forgetting pattern repeat. A small repeat may not change much, but a large repeat can affect how each strip is cut.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Wallpaper Calculator explains wall area, roll coverage, pattern repeat, openings, and waste percent in one place.',
  },
  {
    slug: 'browser-only-ai-tools-privacy',
    title: 'Browser-Only AI Tools: What They Are Good For',
    subtitle: 'Browser-side AI can be useful for quick private tasks, but it still has limits.',
    sourceUrl: `${SITE_ORIGIN}/categories/ai-tools/`,
    canonicalUrl: `${SITE_ORIGIN}/categories/ai-tools/`,
    tags: ['AI', 'Privacy', 'Tools', 'OCR', 'Productivity'],
    audience: 'People curious about OCR, tone checking, summaries, language detection, and privacy.',
    sections: [
      {
        heading: 'What browser-only means',
        paragraphs: [
          'Browser-only AI tools run the task in your browser tab after the model or analysis code loads. That can be useful for quick jobs like OCR, language detection, keyword extraction, tone checking, and reading-level estimates.',
          'It does not mean magic privacy. Some model files may still download first, and results can still be wrong. The important part is that your text or image does not need to be uploaded to the site server for the tool to work.',
        ],
      },
      {
        heading: 'Where it helps',
        paragraphs: [
          'Browser AI is good for first-pass tasks: extracting text from an image, checking whether text sounds too formal, estimating reading level, or summarizing short notes.',
          'It is not good for legal, medical, financial, or high-stakes decisions. Use it as a helper, not an authority.',
        ],
      },
      {
        heading: 'Read the limits',
        paragraphs: [
          'Short text can be hard to classify. Blurry images can break OCR. Mixed-language text can confuse language detection. Summaries can leave out details.',
          'That is why each AI tool should explain what the input means, how to read the result, and when not to rely on it.',
        ],
      },
    ],
    callout:
      'Access Free Tools has a starter AI Tools section with OCR, sentiment, language, summarizer, keyword, image, tone, and reading-level tools.',
  },
  {
    slug: 'mortgage-payment-before-shopping',
    title: 'Estimate A Mortgage Payment Before You Fall In Love With A House',
    subtitle: 'A mortgage calculator is a planning tool, not a loan offer, but it can keep the first conversation grounded.',
    sourceUrl: `${SITE_ORIGIN}/tools/mortgage-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-mortgage-calculator/`,
    tags: ['Mortgage', 'Finance', 'Home Buying', 'Budgeting', 'Calculators'],
    audience: 'Early-stage home shoppers comparing rough monthly payment ranges.',
    sections: [
      {
        heading: 'Start with the big pieces',
        paragraphs: [
          'A mortgage payment estimate usually starts with home price, down payment, interest rate, and loan term. Those inputs create the principal and interest part of the monthly payment.',
          'Real housing cost can also include property tax, insurance, HOA fees, PMI, repairs, and moving costs, so the calculator result should be treated as a planning estimate.',
        ],
      },
      {
        heading: 'Change one number at a time',
        paragraphs: [
          'Try the same home price with different down payments, rates, or loan terms. This shows which input moves the monthly payment most.',
          'For many buyers, interest rate and down payment make the estimate move more than expected.',
        ],
      },
      {
        heading: 'Do not treat it like approval',
        paragraphs: [
          'A calculator cannot approve a loan, check your credit, quote lender fees, or confirm local taxes. It is still useful because it helps you ask better questions before talking to a lender.',
          'If a number feels tight in the calculator, it will probably feel tighter in real life.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Mortgage Calculator includes payment estimates, plain-language notes, and a guide to reading the result.',
  },
  {
    slug: 'bmi-result-limits',
    title: 'What A BMI Calculator Can And Cannot Tell You',
    subtitle: 'BMI is a quick screening estimate, not a full health judgment.',
    sourceUrl: `${SITE_ORIGIN}/tools/bmi-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-bmi-calculator/`,
    tags: ['Health', 'BMI', 'Fitness', 'Calculators', 'Wellness'],
    audience: 'People checking BMI and wanting plain-language limits.',
    sections: [
      {
        heading: 'What BMI uses',
        paragraphs: [
          'BMI uses height and weight to estimate a weight category. That makes it quick and easy, but also limited.',
          'It does not directly measure body fat, muscle, bone density, fitness, age, pregnancy, ethnicity, or medical history.',
        ],
      },
      {
        heading: 'How to read it',
        paragraphs: [
          'The result is best read as a rough screening number. It can be useful for noticing patterns, comparing ranges, or preparing questions for a health professional.',
          'It should not be used as a diagnosis or as the only measure of health.',
        ],
      },
      {
        heading: 'When to be extra careful',
        paragraphs: [
          'BMI can be less useful for athletes, growing children, pregnant people, older adults, and anyone whose body composition does not match average assumptions.',
          'If the number worries you, the next step is not panic. The next step is better context.',
        ],
      },
    ],
    callout:
      'The Access Free Tools BMI Calculator includes clear result notes and health disclaimers so the number is not over-sold.',
  },
  {
    slug: 'ad-revenue-calculator-creator',
    title: 'How To Think About Ad Revenue Before Your Site Has Big Traffic',
    subtitle: 'RPM, CTR, CPC, and impressions are planning numbers, not guaranteed income.',
    sourceUrl: `${SITE_ORIGIN}/tools/ad-revenue-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-ad-revenue-calculator/`,
    tags: ['Websites', 'Adsense', 'Creators', 'Finance', 'Calculators'],
    audience: 'Small site owners estimating ad revenue before monetization is stable.',
    sections: [
      {
        heading: 'The simplest ad math',
        paragraphs: [
          'Ad revenue estimates often start with impressions and RPM. RPM means revenue per 1,000 impressions. If a page has 10,000 impressions and a $5 RPM, the rough estimate is $50.',
          'That number is only a model. Actual revenue depends on country, topic, ad quality, viewability, season, traffic source, and policy compliance.',
        ],
      },
      {
        heading: 'Do not build the site around ads first',
        paragraphs: [
          'A new site usually needs useful pages, clean navigation, trust pages, and indexing before ads matter. Fake ad boxes or thin content can hurt the experience before revenue even exists.',
          'For Access Free Tools, the better order is tools first, helpful guides second, monetization later.',
        ],
      },
      {
        heading: 'Use estimates to plan, not promise',
        paragraphs: [
          'Ad calculators are useful for scenarios. They can show how much traffic is needed before a revenue goal becomes realistic.',
          'They should not be used to promise income or compare sites without context.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Ad Revenue Calculator helps estimate RPM, CTR, CPC, impressions, and revenue scenarios in plain language.',
  },
  {
    slug: 'watts-to-amps-safety',
    title: 'Watts To Amps Is Simple Math, But Electrical Context Matters',
    subtitle: 'The formula is short. Choosing the right voltage, phase, and safety margin is the part to respect.',
    sourceUrl: `${SITE_ORIGIN}/tools/watts-to-amps-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-watts-to-amps-calculator/`,
    tags: ['Electrical', 'DIY', 'Calculators', 'Safety', 'Home'],
    audience: 'People checking simple electrical conversions for planning and education.',
    sections: [
      {
        heading: 'The basic idea',
        paragraphs: [
          'For simple DC or single-phase estimates, amps are often calculated from watts divided by volts. For example, 1200 watts divided by 120 volts is 10 amps.',
          'That is the easy part. The harder part is knowing whether your situation is DC, single-phase AC, or three-phase AC, and whether power factor matters.',
        ],
      },
      {
        heading: 'Why voltage matters',
        paragraphs: [
          'The same wattage can use different current at different voltages. A 1200 watt load at 120 volts is different from a 1200 watt load at 240 volts.',
          'That is why a watts-to-amps calculator should make voltage obvious instead of hiding it.',
        ],
      },
      {
        heading: 'When not to rely on a calculator',
        paragraphs: [
          'Do not use a simple calculator as wiring advice. Circuit sizing, breaker selection, wire gauge, continuous loads, local code, and safety rules need proper electrical guidance.',
          'Use the calculator for education and rough planning, then check real work with a qualified person or official code guidance.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Watts To Amps Calculator explains voltage, phase, power factor, and safety limits in the tool notes.',
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
    all: args.includes('--all'),
    slugs,
    limit: Number(args.find((arg) => arg.startsWith('--limit='))?.slice('--limit='.length) ?? Number.POSITIVE_INFINITY),
    outputDir: resolve(args.find((arg) => arg.startsWith('--output-dir='))?.slice('--output-dir='.length) ?? DEFAULT_OUTPUT_DIR),
    reportPath: resolve(args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length) ?? DEFAULT_REPORT_PATH),
  };
}

function safeFileName(slug) {
  return slug.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
}

function writeText(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function writeJson(path, value) {
  writeText(path, `${JSON.stringify(value, null, 2)}\n`);
}

function markdown(post) {
  const tags = post.tags.join(', ');
  const sections = post.sections
    .map(
      (section) => `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`,
    )
    .join('\n\n');

  return `---
title: "${post.title.replace(/"/g, '\\"')}"
status: "needs approval"
channel: "Medium"
source_url: "${post.sourceUrl}"
canonical_url_to_set: "${post.canonicalUrl}"
tags: "${tags}"
---

# ${post.title}

${post.subtitle}

Audience: ${post.audience}

Disclosure: This companion post is from Access Free Tools. The original tool and full guide live on AccessFreeTools.com.

${sections}

## Try the tool

${post.callout}

Tool or guide: ${post.sourceUrl}

Canonical URL to set in Medium advanced settings: ${post.canonicalUrl}

Suggested tags: ${tags}

Publishing note: Do not paywall this starter post. Keep the canonical/source link visible and do not add affiliate links unless a disclosure is placed next to the link.
`;
}

function main() {
  const args = parseArgs();
  const selected = posts
    .filter((post) => args.all || args.slugs.includes(post.slug))
    .slice(0, Number.isFinite(args.limit) ? args.limit : posts.length);

  const report = {
    generatedAt: new Date().toISOString(),
    safety: [
      'draft generation only',
      'no Medium password storage',
      'no public posting',
      'no paid promotion',
      'canonical/source URL included',
    ],
    status: selected.length ? 'drafts-generated' : 'no-selected-posts',
    selectedCount: selected.length,
    availableSlugs: posts.map((post) => post.slug),
    drafts: [],
  };

  if (!selected.length) {
    console.log('No Medium posts selected. Use --slug=wallpaper-waste-percent or --all.');
    writeJson(args.reportPath, report);
    return;
  }

  mkdirSync(args.outputDir, { recursive: true });

  for (const post of selected) {
    const path = resolve(args.outputDir, `${safeFileName(post.slug)}.md`);
    writeText(path, markdown(post));
    report.drafts.push({
      slug: post.slug,
      title: post.title,
      path,
      sourceUrl: post.sourceUrl,
      canonicalUrl: post.canonicalUrl,
      tags: post.tags,
      status: 'needs approval',
    });
  }

  writeJson(args.reportPath, report);
  console.log(`Generated ${selected.length} Medium draft(s).`);
  console.log(`Saved report to ${args.reportPath}`);
}

main();
