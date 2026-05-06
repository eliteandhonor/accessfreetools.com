import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SITE_ORIGIN = 'https://accessfreetools.com';
const DEFAULT_OUTPUT_DIR = resolve('output', 'promotion', 'medium');
const DEFAULT_REPORT_PATH = resolve('output', 'promotion', 'medium-promotion-report.json');

const publicationOrder = [
  'right-free-online-calculator',
  'percentage-calculator-discounts',
  'wallpaper-waste-percent',
  'browser-only-ai-tools-privacy',
  'mortgage-payment-before-shopping',
  'bmi-result-limits',
  'watts-to-amps-safety',
  'ad-revenue-calculator-creator',
];

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
          'A good online calculator starts by matching the question you actually have. If you are checking a sale price, you probably need a percentage calculator. If you are doing quick addition, subtraction, multiplication, or division, a basic calculator is enough.',
          'The fastest trick is to write the question in one normal sentence: "What is 25 percent off 48?", "What is 18 divided by 3?", or "How much does the total change after a 10 percent increase?" Then pick the calculator built for that exact sentence.',
        ],
      },
      {
        heading: 'Look for input explanations',
        paragraphs: [
          'The calculator should explain what each box means before you trust the answer. A percent tool should label the original value and the percent rate. A finance tool should say whether a number is monthly or yearly. A project calculator should say whether it uses feet, inches, square feet, or another unit.',
          'If a page only gives a number with no example, it is way easier to type the right-looking number into the wrong box and still get an answer that seems believable.',
        ],
      },
      {
        heading: 'Use the result notes',
        paragraphs: [
          'A useful calculator result tells you what the answer means and what it leaves out. That matters for anything with money, health, tax, dates, home projects, or electrical math because a simple estimate can still affect a real choice.',
          'The best result pages do not act like one number explains everything. They show the answer, explain the inputs, and tell you when the result is only a rough estimate.',
        ],
      },
    ],
    callout:
      'Try the Access Free Tools calculator library if you want free online calculators with plain-language examples and result notes.',
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

const publishEnhancements = {
  'right-free-online-calculator': {
    preview:
      'Use the question you actually need answered to choose the right free calculator, then check the inputs, result notes, and limits.',
    seoReview:
      'DataForSEO reviewed on 2026-05-06: use "free online calculator" as the main phrase, support it with "basic calculator online free", "online calculator", and natural mentions of percentage calculator examples. Keep this post calculator-only.',
    hook: [
      'A calculator page can look useful and still be the wrong calculator. The easy way to avoid that is to start with the question, not the tool name.',
      'A good free online calculator should explain the input boxes, show a clear result, and tell you what the answer does not cover.',
    ],
    bestUse: [
      'Use this when you are not sure whether a basic calculator, percentage calculator, scientific calculator, finance calculator, or project calculator is the right one.',
      'The point is simple: choose the calculator that matches the job, then sanity-check the result before you act on it.',
    ],
    example: {
      heading: 'A quick example',
      paragraphs: [
        'Say a hoodie is $48 and the store says it is 25 percent off. A basic calculator can do 48 x 0.25 and show 12, but that is only the savings. The final price is 48 - 12 = $36 before tax.',
        'A percentage calculator is clearer because it labels the original price, percent off, savings, and final price. That is the difference between getting a number and understanding the answer.',
      ],
    },
    limits: [
      'Do not use a general calculator when a tool needs special assumptions, like tax, loan interest, pregnancy dates, electrical phase, or construction waste.',
      'Check whether the page explains units. Feet, inches, dollars, months, years, volts, and percentages are easy to mix up.',
      'For high-stakes decisions, treat the calculator as planning help, not professional advice.',
    ],
  },
  'percentage-calculator-discounts': {
    preview:
      'Percent math gets easier when you separate percent-of, percent change, discounts, markups, and reverse percentages.',
    hook: [
      'Most percentage mistakes happen because different percent questions look almost the same. "What is 20 percent of 80?" is not the same as "80 is 20 percent of what?"',
      'A good percentage calculator should make the question type obvious before it shows the answer.',
    ],
    bestUse: [
      'This is a strong Medium post for shoppers, students, creators, and small business owners because percentages show up everywhere.',
      'It connects naturally to discounts, tips, sales tax estimates, growth, fees, and markup checks.',
    ],
    example: {
      heading: 'A quick discount example',
      paragraphs: [
        'If a $60 item is 15 percent off, the savings are $9 because 60 x 0.15 = 9. The final price is $51 before any tax or extra fees.',
        'If the item later rises from $51 back to $60, that increase is not 15 percent. It is about 17.65 percent because the starting number changed.',
      ],
    },
    limits: [
      'Use the original value as the base for percent change unless the calculator asks for a different setup.',
      'Remember that a discount and a later increase by the same percent do not cancel out perfectly.',
      'For taxes, fees, and business pricing, use the percentage result as a math estimate and check the actual rules that apply.',
    ],
  },
  'wallpaper-waste-percent': {
    preview:
      'Waste percent is extra wallpaper for trimming, pattern matching, corners, openings, and mistakes. It is not random padding.',
    hook: [
      'Wallpaper math can look neat on paper, but rooms are not perfect rectangles. Corners, doors, windows, outlets, sloped ceilings, and pattern repeats all create waste.',
      'That is why a wallpaper calculator should explain waste percent instead of leaving it as a mystery box.',
    ],
    bestUse: [
      'This post is useful for DIY readers because it answers a real question people ask before buying rolls.',
      'It also shows that Access Free Tools can explain small inputs that other calculators often leave unexplained.',
    ],
    example: {
      heading: 'A quick room example',
      paragraphs: [
        'Suppose your room needs 7.4 rolls before waste. With 10 percent waste, the estimate becomes 8.14 rolls. Since wallpaper is bought in whole rolls, that usually means 9 rolls.',
        'A plain wallpaper in a simple room may need less extra. A bold pattern with a large repeat may need more.',
      ],
    },
    limits: [
      'Waste percent does not replace measuring each wall.',
      'Pattern repeat can change how much usable wallpaper comes from each roll.',
      'If the wallpaper is expensive, discontinued, or hard to match later, ordering a little extra can be smarter than running short.',
    ],
  },
  'browser-only-ai-tools-privacy': {
    preview:
      'Browser-only AI tools can help with quick OCR, language, tone, and reading tasks without uploading user input to Access Free Tools.',
    hook: [
      'Not every AI tool needs a server, account, or file upload. Some small AI and text-analysis tasks can run inside the browser after the page loads the model or analysis code.',
      'That is useful for privacy-minded quick tasks, but it is still important to explain model downloads, uncertainty, and limits.',
    ],
    bestUse: [
      'This is a good Medium post to introduce the new AI Tools category without promising too much.',
      'It should be framed as practical browser utilities, not magic AI or professional judgment.',
    ],
    example: {
      heading: 'A quick OCR example',
      paragraphs: [
        'If you have a screenshot of a short note, an OCR tool can try to pull the text out of the image. A clear image with high contrast usually works better than a blurry, angled, tiny screenshot.',
        'The result still needs checking because OCR can confuse similar characters, spacing, punctuation, and columns.',
      ],
    },
    limits: [
      'Browser-only does not mean no download. Some tools may download model files from a model host unless they are self-hosted later.',
      'Short text, blurry images, mixed languages, and unusual formatting can lower accuracy.',
      'Do not use these AI tools for legal, medical, financial, safety, or identity decisions.',
    ],
  },
  'mortgage-payment-before-shopping': {
    preview:
      'A mortgage calculator can ground the early home-search conversation, but it is not a lender quote or approval.',
    hook: [
      'House shopping can get emotional quickly. A mortgage estimate helps slow the moment down and turn a dream price into a rough monthly number.',
      'The calculator is not there to approve you. It is there to help you ask better questions before the serious lender conversation.',
    ],
    bestUse: [
      'This Medium post should stay careful because finance pages need extra trust and plain-language limits.',
      'It is best for early planning, not loan advice.',
    ],
    example: {
      heading: 'A quick planning example',
      paragraphs: [
        'Try the same home price with a 10 percent down payment, then a 20 percent down payment. Then keep the down payment the same and change the interest rate.',
        'This shows which input changes the monthly estimate the most, without pretending the estimate is a final offer.',
      ],
    },
    limits: [
      'A calculator does not check credit, local taxes, lender fees, insurance, HOA costs, repairs, or approval rules.',
      'Rates and fees change, so saved examples can get stale.',
      'Use the result for planning and then confirm real numbers with a qualified lender or financial professional.',
    ],
  },
  'bmi-result-limits': {
    preview:
      'BMI is a fast height-and-weight screening estimate, not a full health score or diagnosis.',
    hook: [
      'BMI is popular because it is quick. It only needs height and weight, so it is easy to calculate and easy to compare.',
      'That speed is also why it has limits. A simple number cannot understand muscle, age, pregnancy, medical history, or the reason behind someone\'s weight.',
    ],
    bestUse: [
      'This post should be careful and supportive because health topics can affect real decisions.',
      'The goal is to explain what BMI is useful for and where it stops being enough.',
    ],
    example: {
      heading: 'A quick reading example',
      paragraphs: [
        'If two people have the same BMI, they may still have very different bodies, training levels, ages, and health situations.',
        'That is why BMI is better as a rough screening estimate than as a personal judgment.',
      ],
    },
    limits: [
      'BMI does not directly measure body fat, muscle, bone density, pregnancy, or fitness.',
      'It can be less useful for athletes, children, older adults, pregnant people, and anyone outside average body-composition assumptions.',
      'Use the result as a conversation starter, not medical advice.',
    ],
  },
  'ad-revenue-calculator-creator': {
    preview:
      'Ad revenue estimates are scenario planning tools. They should not be treated as guaranteed income.',
    hook: [
      'Ad revenue calculators are tempting because they turn traffic into a money number. That number can be useful, but only if you treat it as a scenario.',
      'A new site should build useful pages, trust, indexing, and repeat visitors before ads become the main conversation.',
    ],
    bestUse: [
      'This post is useful for creators and small site owners, but it must avoid income promises.',
      'It also supports the Access Free Tools story because the site is building tools first and monetization later.',
    ],
    example: {
      heading: 'A quick RPM example',
      paragraphs: [
        'If a page gets 20,000 ad impressions and the RPM is $4, the estimate is 20 x 4 = $80. That is simple math, not a guarantee.',
        'The real result can change because of audience country, page topic, season, ad viewability, policy rules, traffic quality, and advertiser demand.',
      ],
    },
    limits: [
      'Do not promise revenue from a calculator result.',
      'Do not add fake ad boxes before AdSense or another ad system is actually approved and connected.',
      'Use revenue estimates to plan traffic goals, not to replace useful content.',
    ],
  },
  'watts-to-amps-safety': {
    preview:
      'Watts to amps is easy math only when voltage, phase, and power factor are understood.',
    hook: [
      'The formula can be short, but electrical context matters. Watts, volts, amps, phase, power factor, continuous load, and local code are not the same thing.',
      'A calculator can help with education and rough planning. It should not be treated like wiring permission.',
    ],
    bestUse: [
      'This post should be published with a strong safety note because electrical content can affect real-world risk.',
      'It is useful because it explains why the same watts can mean different amps at different voltages.',
    ],
    example: {
      heading: 'A quick voltage example',
      paragraphs: [
        'A 1200 watt load at 120 volts is 10 amps. The same 1200 watt load at 240 volts is 5 amps in a simple single-phase estimate.',
        'That does not automatically mean either setup is safe. Wire size, breaker size, continuous load rules, device ratings, and local code still matter.',
      ],
    },
    limits: [
      'Do not use a calculator alone to size wiring, breakers, extension cords, or circuits.',
      'Check whether the load is DC, single-phase AC, or three-phase AC.',
      'Ask a qualified electrician or official code source before doing real electrical work.',
    ],
  },
};

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

function estimateWordCount(value) {
  return value
    .replace(/https?:\/\/\S+/g, '')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean).length;
}

function estimateReadingTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 220));
}

function publicArticleContent(content) {
  const start = content.indexOf('\n# ');
  const end = content.indexOf('\n## Publisher checklist');
  if (start === -1 || end === -1 || end <= start) {
    return content;
  }

  return content.slice(start + 1, end);
}

function escapeYaml(value) {
  return String(value).replace(/"/g, '\\"');
}

function renderParagraphs(paragraphs) {
  return paragraphs.join('\n\n');
}

function renderBullets(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function markdown(post) {
  const extra = publishEnhancements[post.slug];
  const tags = post.tags.join(', ');
  const sections = post.sections
    .map(
      (section) => `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`,
    )
    .join('\n\n');

  const articleBody = `# ${post.title}

${post.subtitle}

${renderParagraphs(extra.hook)}

Disclosure: This companion post is from Access Free Tools. The original tool and full guide live on AccessFreeTools.com.

## Best quick use case

${renderParagraphs(extra.bestUse)}

${sections}

## ${extra.example.heading}

${renderParagraphs(extra.example.paragraphs)}

## What to check before trusting the result

${renderBullets(extra.limits)}

## Try the original tool

${post.callout}

Tool or guide: ${post.sourceUrl}
`;

  const wordCount = estimateWordCount(articleBody);
  const readingTime = estimateReadingTime(wordCount);

  return `---
title: "${escapeYaml(post.title)}"
status: "needs approval"
publish_ready: true
approval_required: true
channel: "Medium"
source_url: "${post.sourceUrl}"
canonical_url_to_set: "${post.canonicalUrl}"
recommended_preview: "${escapeYaml(extra.preview)}"
tags: "${tags}"
word_count_estimate: ${wordCount}
reading_time_minutes_estimate: ${readingTime}
---

<!--
Publisher notes:
- Approval required before posting publicly.
- Recommended Medium preview: ${extra.preview}
- Audience: ${post.audience}
- Set Medium canonical/source URL to: ${post.canonicalUrl}
- Suggested tags: ${tags}
- SEO review: ${extra.seoReview ?? 'Run DataForSEO or Search Console intent review before public publishing.'}
- Keep this starter post free, not paywalled.
- Do not add affiliate links unless a disclosure is placed next to the link.
-->

${articleBody}

## Publisher checklist

- Owner approved this exact article.
- Canonical/source URL set to ${post.canonicalUrl}.
- Link tested: ${post.sourceUrl}.
- Tags set: ${tags}.
- Post is not paywalled.
- No affiliate links or paid promotion added.

Publishing note: Remove this checklist before pasting into Medium if you want the public article to be shorter.
`;
}

function queueIndex(drafts) {
  const rows = drafts
    .slice()
    .sort((a, b) => publicationOrder.indexOf(a.slug) - publicationOrder.indexOf(b.slug))
    .map(
      (draft, index) =>
        `| ${index + 1} | ${draft.title} | ${draft.slug} | ${draft.status} | ${draft.wordCount} | ${draft.readingTimeMinutes} min | ${draft.canonicalUrl} |`,
    )
    .join('\n');

  return `# Medium Draft Publishing Queue

Generated: ${new Date().toISOString()}

These are publish-ready drafts, but they still need owner approval before posting publicly. Medium posts should be useful companion pieces, not duplicate copies of the Access Free Tools blog guides.

## Recommended Order

| Order | Draft | Slug | Status | Words | Read | Canonical/source URL |
| --- | --- | --- | --- | ---: | ---: | --- |
${rows}

## Approval Rules

- Publish one article at a time at first so we can watch indexing, clicks, and audience response.
- Keep the canonical/source URL set to the matching Access Free Tools page.
- Keep posts free and useful. Do not run paid promotion.
- Do not add affiliate links until there is a nearby disclosure and a clear reason for the link.
- After publishing, add the public Medium URL to docs/promotion-queue.md and mark the item posted.
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
    const content = markdown(post);
    writeText(path, content);
    const wordCount = estimateWordCount(publicArticleContent(content));
    report.drafts.push({
      slug: post.slug,
      title: post.title,
      path,
      sourceUrl: post.sourceUrl,
      canonicalUrl: post.canonicalUrl,
      tags: post.tags,
      status: 'needs approval',
      wordCount,
      readingTimeMinutes: estimateReadingTime(wordCount),
      recommendedPreview: publishEnhancements[post.slug].preview,
    });
  }

  writeText(resolve(args.outputDir, '_publishing-queue.md'), queueIndex(report.drafts));
  writeJson(args.reportPath, report);
  console.log(`Generated ${selected.length} Medium draft(s).`);
  console.log(`Saved report to ${args.reportPath}`);
}

main();
