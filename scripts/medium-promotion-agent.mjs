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
  'voltage-drop-wire-length',
  'markdown-table-cleanup',
];

const posts = [
  {
    slug: 'right-free-online-calculator',
    title: 'How To Pick The Right Free Online Calculator Without Wasting Time',
    subtitle: 'Start with the question you need answered, then choose the calculator that explains the boxes, the result, and the limits.',
    sourceUrl: `${SITE_ORIGIN}/tools/`,
    canonicalUrl: `${SITE_ORIGIN}/free-calculator-resources/`,
    tags: ['Calculators', 'Math', 'Productivity', 'Tools', 'Education'],
    audience: 'Students, shoppers, DIY planners, and anyone comparing calculator pages.',
    sections: [
      {
        heading: 'Start with the question, not the calculator name',
        paragraphs: [
          'Calculator pages can look almost the same from far away. They have boxes, buttons, and a result. The problem is that the wrong calculator can still give you a clean-looking answer.',
          'The easy fix is to write your question as one normal sentence first. For example: "What is 25 percent off $48?", "What is 18 divided by 3?", or "How much would a $250,000 loan cost each month?" Once the question is clear, the right calculator is usually obvious.',
        ],
      },
      {
        heading: 'Pick the page that explains the boxes',
        paragraphs: [
          'A good free online calculator should not make you guess what the input boxes mean. A percentage calculator should tell you which number is the original price and which number is the percent. A mortgage calculator should say whether the rate is yearly and whether taxes or insurance are included.',
          'This matters because the worst mistakes do not always look dramatic. You can type a yearly number into a monthly box, mix up feet and inches, or use the new price where the old price belongs. The answer may still look neat, but it is solving the wrong problem.',
        ],
      },
      {
        heading: 'Read the result like a clue, not a final verdict',
        paragraphs: [
          'For simple math, the answer can be final. If 18 divided by 3 equals 6, that is the job. For money, health, taxes, dates, home projects, and electrical math, the answer is more like a clue.',
          'A mortgage estimate does not approve a loan. A BMI result does not diagnose health. A wallpaper estimate does not know every weird corner in your room. The useful calculator is the one that gives the number and tells you what the number leaves out.',
        ],
      },
      {
        heading: 'Use examples to catch mistakes fast',
        paragraphs: [
          'If a calculator has examples, use them. Examples show the shape of the math before you trust your own numbers. They also reveal whether the page understands the real task or just throws a formula at you.',
          'This is why Access Free Tools pages keep adding plain-language examples and result notes. The goal is not just to produce a number. The goal is to make the number easier to understand.',
        ],
      },
    ],
    callout:
      'Try the Access Free Tools calculator library if you want free online calculators with plain-language examples, result notes, and tool-specific limits.',
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
    title: 'What No One Tells You About Browser-Only AI Tools And Privacy',
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
    title: 'Things You Should Know Before Trusting A Mortgage Payment Estimate',
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
    title: 'The Biggest Mistake People Make With BMI Calculator Results',
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
  {
    slug: 'voltage-drop-wire-length',
    title: 'Why Voltage Drop Matters Before You Choose Wire Length',
    subtitle: 'Long wire runs can lose voltage. A calculator helps you test the numbers before you treat the plan as finished.',
    sourceUrl: `${SITE_ORIGIN}/tools/voltage-drop-calculator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-voltage-drop-calculator/`,
    tags: ['Electrical', 'DIY', 'Calculators', 'Safety', 'Home'],
    audience: 'DIY planners and learners checking simple voltage drop estimates.',
    sections: [
      {
        heading: 'The basic formula idea',
        paragraphs: [
          'Voltage drop is the voltage lost as current moves through wire. A longer wire run, higher current, or smaller wire can increase the drop.',
          'That is why the same device can behave differently when it is close to the panel compared with a long run across a garage, shed, or yard.',
        ],
      },
      {
        heading: 'The inputs that change the answer',
        paragraphs: [
          'A useful voltage drop calculator should make wire length, current, voltage, material, and wire size easy to see. If one of those inputs is wrong, the result can look precise but still be off.',
          'The result is normally shown as volts lost and percent voltage drop. The percent matters because it helps compare a small circuit and a larger circuit in a fairer way.',
        ],
      },
      {
        heading: 'The safety line',
        paragraphs: [
          'Voltage drop math is not the same as permission to wire something. Real electrical work also depends on breaker size, insulation rating, temperature, conduit, code rules, and whether the load is continuous.',
          'Use the number as a planning clue. For actual wiring decisions, check official electrical code or a qualified electrician.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Voltage Drop Calculator explains wire length, current, voltage, wire size, and result limits in plain language.',
  },
  {
    slug: 'markdown-table-cleanup',
    title: 'How To Make A Markdown Table Without Fighting The Spacing',
    subtitle: 'Markdown tables are simple when the rows are lined up, but annoying when you build them by hand.',
    sourceUrl: `${SITE_ORIGIN}/tools/markdown-table-generator/`,
    canonicalUrl: `${SITE_ORIGIN}/blog/how-to-use-markdown-table-generator/`,
    tags: ['Markdown', 'Writing', 'Developer Tools', 'Productivity', 'Guides'],
    audience: 'Students, writers, developers, and documentation editors making quick Markdown tables.',
    sections: [
      {
        heading: 'Why Markdown tables get messy',
        paragraphs: [
          'A Markdown table is just text, so tiny spacing mistakes can make it hard to read while editing. The final page may still render, but the source can become painful fast.',
          'A table generator helps by letting you think about the rows and columns first, then copying clean Markdown when the structure is ready.',
        ],
      },
      {
        heading: 'The parts that matter',
        paragraphs: [
          'A basic Markdown table needs a header row, a separator row, and the body rows. The separator row is the line with dashes that tells Markdown where the headers end.',
          'If you want alignment, colons can tell Markdown whether a column should be left, center, or right aligned. That is useful for numbers, prices, scores, and short labels.',
        ],
      },
      {
        heading: 'A better workflow',
        paragraphs: [
          'Start with the column names, add the rows, preview the result, and copy the final Markdown. If a row needs more detail, keep the cell short or link to another section instead of stuffing a paragraph into the table.',
          'That keeps the table useful for readers and easier to maintain later.',
        ],
      },
    ],
    callout:
      'The Access Free Tools Markdown Table Generator helps create clean Markdown tables with rows, columns, alignment, preview, and copy-ready output.',
  },
];

const heroAltText = {
  'right-free-online-calculator':
    'Branded calculator graphic for choosing the right free online calculator by checking the question, inputs, and result.',
  'percentage-calculator-discounts':
    'Branded percentage calculator graphic showing discounts, tips, markups, and percent-change checks.',
  'wallpaper-waste-percent':
    'Branded wallpaper calculator graphic explaining waste percent for trimming, pattern matching, corners, and mistakes.',
  'browser-only-ai-tools-privacy':
    'Branded browser-side AI tools graphic showing private OCR, language, tone, and reading checks.',
  'mortgage-payment-before-shopping':
    'Branded mortgage calculator graphic for estimating monthly payments before home shopping.',
  'bmi-result-limits':
    'Branded BMI calculator graphic explaining that BMI is a quick height-and-weight screening estimate.',
  'watts-to-amps-safety':
    'Branded watts-to-amps calculator graphic reminding readers to check voltage, phase, and electrical safety limits.',
  'ad-revenue-calculator-creator':
    'Branded ad revenue calculator graphic showing RPM, impressions, and traffic scenarios without income promises.',
  'voltage-drop-wire-length':
    'Branded voltage drop calculator graphic showing wire length, current, voltage, and percent drop.',
  'markdown-table-cleanup':
    'Branded Markdown table generator graphic showing clean headers, rows, preview, and copy-ready output.',
};

const publishEnhancements = {
  'right-free-online-calculator': {
    preview:
      'A better free online calculator article: start with the question, choose the page that explains the boxes, then sanity-check the result.',
    seoReview:
      'DataForSEO reviewed on 2026-05-06: "free online calculator" has the strongest related-keyword volume among this topic set. Support naturally with "basic calculator online free", "best free online calculator", and "online calculator". Keep this post calculator-only.',
    hook: [
      'A calculator page can look useful and still waste your time. That sounds weird, because calculators are supposed to be simple. But the wrong calculator can give you a perfect-looking number for the wrong question.',
      'The best free online calculator is not always the fanciest one. It is the one that matches your question, explains the input boxes, and tells you when the result is only an estimate.',
    ],
    quickAnswer: [
      'Pick a free online calculator by matching it to the job first. If your question is simple arithmetic, use a basic calculator. If your question has rules, units, rates, dates, safety notes, or assumptions, use a specific calculator that explains those details.',
      'A good page should make you feel less confused after the answer appears. You should know what you entered, what the result means, and what the calculator did not include.',
    ],
    whyItMatters: [
      'This matters because most calculator mistakes are not typing mistakes. They are meaning mistakes. You entered the wrong base number, skipped a unit, or trusted an estimate as if it was a decision. A clearer calculator helps you catch that before the number gets used.',
    ],
    bestUse: [
      'Use this guide when you are staring at a calculator page and thinking, "Is this even the right tool?" That happens with discounts, loan estimates, school math, project materials, dates, tips, and unit conversions.',
      'The short version is: name the job, check the input boxes, read the result note, and do one quick reality check before you trust the number.',
    ],
    example: {
      heading: 'A quick shopping example',
      paragraphs: [
        'Say a hoodie costs $48 and the store says it is 25 percent off. A basic calculator can do 48 x 0.25 and show 12. That is useful, but it is only the savings. The final price is $48 - $12 = $36 before tax.',
        'A percentage calculator is clearer because it labels the original price, the percent off, the amount saved, and the final price. That is the difference between getting a number and understanding the answer.',
        'Now imagine doing the same thing with mortgage payments, BMI, wallpaper rolls, or watts to amps. The more real-world assumptions a calculator has, the more important the labels and notes become.',
      ],
    },
    limits: [
      'Use a basic calculator for simple arithmetic, but switch to a specific calculator when the task has special assumptions, like loan interest, tax, pregnancy dates, electrical phase, or construction waste.',
      'Check the units before trusting the result. Feet, inches, dollars, months, years, volts, and percentages are easy to mix up.',
      'If the result could affect money, health, safety, taxes, electrical work, or a real purchase, treat the calculator as planning help, not professional advice.',
      'Be suspicious of any calculator that gives a serious-looking result without explaining what went into it.',
    ],
  },
  'percentage-calculator-discounts': {
    preview:
      'Percent math gets easier when you separate percent-of, percent change, discounts, markups, and reverse percentages.',
    hook: [
      'A sale sign can look simple until you try to work out the final price in your head. Is the calculator finding the discount amount, the final price, the markup, or the percent change?',
      'Most percentage mistakes happen because different percent questions look almost the same. "What is 20 percent of 80?" is not the same as "80 is 20 percent of what?"',
    ],
    quickAnswer: [
      'Use a percentage calculator when you need to know the percent of a number, the discount amount, the final price, the percent change between two values, or the original number before a percent was added or removed.',
      'The key is to choose the right percent question before typing numbers. If you are checking a sale price, your original price is the starting number. If you are checking growth, your old value is the base. That one choice changes the answer.',
    ],
    whyItMatters: [
      'This matters because percent math shows up in places where small errors feel bigger than they look: shopping, tips, fees, markups, grades, traffic growth, and budgets. When the calculator labels the question type, you are less likely to mix up savings, final price, and percent change.',
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
    quickAnswer: [
      'Waste percent is the extra wallpaper you plan for before buying. It covers trimming, pattern matching, awkward corners, damaged strips, and small measuring mistakes.',
      'A plain room with plain wallpaper might need a smaller waste percent. A room with lots of openings, a bold pattern, or a large repeat usually needs more. If you set waste to 0, the estimate can look tidy while your project runs short.',
    ],
    whyItMatters: [
      'This matters because running short on wallpaper can be more annoying than buying one extra roll. Dye lots can change, patterns can sell out, and a half-finished wall is not much fun. Waste percent is not random padding. It is a planning buffer for the messy parts of a real room.',
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
      'Uploading a screenshot or private note to an AI tool can feel like a bigger step than the job deserves. Not every quick AI task needs a server, account, or file upload.',
      'Some small AI and text-analysis tasks can run inside the browser after the page loads the model or analysis code. That helps privacy, but it still needs clear limits because the result can be wrong.',
    ],
    quickAnswer: [
      'Browser-only AI means the task runs in your browser tab after the page loads the code or model it needs. Your text or image does not need to be uploaded to Access Free Tools for the result to appear.',
      'That does not make every result correct. A 5-line note can be summarized badly, a blurry screenshot can confuse OCR, and short text can be hard to classify. Treat the result like a helpful first pass, then check it yourself.',
    ],
    whyItMatters: [
      'This matters because privacy wording around AI is easy to overdo. A useful AI tool should say what runs in the browser, what may download from a model host, and what mistakes the result can make. Clear limits make the tool more trustworthy, not less useful.',
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
      'House shopping can get emotional quickly. One minute you are looking at photos, and the next minute a pretty listing starts feeling like a plan. A mortgage estimate helps slow that down and turn a dream price into a rough monthly number.',
      'The scary part is not the calculator math. It is trusting a payment before you know what the payment leaves out.',
    ],
    quickAnswer: [
      'Use a mortgage calculator before shopping seriously so you can test a price range. Enter the home price, down payment, loan term, and interest rate, then see whether the monthly estimate feels realistic.',
      'For example, a $350,000 home with 10 percent down means a $315,000 loan before fees. At 6.5 percent for 30 years, principal and interest is about $1,991 a month. At 7.5 percent, it is about $2,203. That $212 jump can matter before tax, insurance, repairs, and moving costs even show up.',
    ],
    whyItMatters: [
      'This matters because the monthly payment is only one part of home cost, but it is the part most people feel first. A clear estimate helps you notice when a price range is already tight before taxes, insurance, repairs, moving costs, and lender fees join the party.',
    ],
    bestUse: [
      'Use the estimate when you are deciding whether a listing belongs in your search at all. If the calculator already feels uncomfortable, that is a useful warning before you book inspections, compare suburbs, or ask a lender for real numbers.',
      'It is best for early planning, not loan approval. The win is leaving the page with better questions, not pretending a quick estimate is a bank decision.',
    ],
    example: {
      heading: 'A quick planning example',
      paragraphs: [
        'Say you are comparing the same $350,000 home with 10 percent down and 20 percent down. With 10 percent down, the loan amount is about $315,000. With 20 percent down, the loan amount is about $280,000.',
        'That smaller loan can lower the monthly principal and interest estimate, but it may also mean saving longer before buying. The point is not that one option is always better. The point is that the calculator shows the tradeoff before you fall in love with a number.',
        'Now change only the interest rate. If the payment jumps enough to stress your budget, the next step is to ask a lender about rate ranges, fees, and approval limits before treating the listing as realistic.',
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
      'BMI can feel personal even though it only sees height and weight. That is the trap: the calculator gives a clean number, but the number does not know your body.',
      'It cannot understand muscle, age, pregnancy, medical history, training, or why someone\'s weight is where it is. That is why the result needs context before you treat it like a judgment.',
    ],
    quickAnswer: [
      'Use a BMI calculator when you want a fast height-and-weight screening estimate. It can show the category connected to your height and weight, but it cannot explain your whole health situation.',
      'For example, someone who is 5 feet 9 inches and 170 pounds gets a different result from someone who is 5 feet 9 inches and 210 pounds. That comparison can be useful, but it still does not measure muscle, fitness, pregnancy, or medical history.',
    ],
    whyItMatters: [
      'This matters because BMI gets used like it is more personal than it really is. The number can help you understand a standard chart, but it should not become a label for your body or a reason to ignore better medical context.',
    ],
    bestUse: [
      'Use the result when you want a quick screening number or a starting point for a health conversation. Do not use it as a label for your body.',
      'The goal is to understand what BMI is useful for and where it stops being enough.',
    ],
    example: {
      heading: 'A quick reading example',
      paragraphs: [
        'If two people have the same BMI, they may still have very different bodies, training levels, ages, and health situations.',
        'That is why BMI is better as a rough screening estimate than as a personal judgment.',
        'If your result is 24.9 or 25.1, do not treat the tiny line between categories like a cliff. Look at the number as a prompt to get more context, especially if you are training, pregnant, growing, or managing a health condition.',
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
    quickAnswer: [
      'Use an ad revenue calculator to test traffic scenarios, not to promise income. You enter impressions, RPM, CTR, CPC, or other ad assumptions, and the calculator turns those inputs into a rough estimate.',
      'If your site has 5,000 monthly pageviews, the estimate will look very different from 50,000 or 500,000. That gap is useful because it shows whether the problem is ad math, traffic, content quality, or all three.',
    ],
    whyItMatters: [
      'This matters because revenue math can make a new site owner chase ads too early. If the traffic is tiny, better content and indexing usually matter more than tweaking ad assumptions. The calculator is there to keep the plan realistic.',
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
        'That is why a tiny site should use the result as a planning range, not a scoreboard. If the estimate is low, the better next move is usually more useful pages, cleaner internal links, and stronger search intent match.',
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
      'Electrical math can look harmless on a screen and still matter in the real world. A heater, charger, tool, or appliance is not just "some watts" once it connects to a circuit.',
      'The formula can be short, but watts, volts, amps, phase, power factor, continuous load, and local code are not the same thing. A calculator helps with education and rough planning, not wiring permission.',
    ],
    quickAnswer: [
      'Use a watts-to-amps calculator when you know the power in watts and the voltage, and you want a quick current estimate. For simple DC math, amps are watts divided by volts.',
      'The danger is thinking the answer tells you what wire, breaker, extension cord, or circuit is safe. It does not. If your result affects real electrical work, you need the right electrical rules and a qualified person, not just a calculator.',
    ],
    whyItMatters: [
      'This matters because electrical numbers can look simple while the real-world rules are not. A calculator can teach the relationship between watts, volts, and amps, but it cannot see your wiring, breaker panel, device rating, load duration, or local code.',
    ],
    bestUse: [
      'Use it when you are trying to understand why the same watts can mean different amps at different voltages.',
      'If the answer affects a real wire, breaker, extension cord, or installation, stop at the estimate and check proper electrical guidance.',
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
  'voltage-drop-wire-length': {
    preview:
      'Voltage drop is easy to ignore until a long wire run changes the result. This post explains the inputs, the percent result, and the safety limits.',
    seoReview:
      'DataForSEO reviewed on 2026-05-07: "voltage drop calculator" is informational intent. Keep the post educational, safety-aware, and tightly matched to wire length, current, voltage, and percent drop.',
    hook: [
      'Voltage drop sounds like a tiny detail until the wire run gets long. Then the same load can become a different planning problem.',
      'The useful question is not just "will the device turn on?" It is "how much voltage could be lost before the power reaches the load?"',
    ],
    quickAnswer: [
      'Voltage drop is the voltage lost in the wire between the power source and the load. A voltage drop calculator estimates that loss from wire length, current, voltage, wire size, and wire material.',
      'For example, a 60 foot run with a higher current will usually lose more voltage than a 10 foot run at the same wire size. The result is usually easier to read as both volts lost and percent drop.',
    ],
    whyItMatters: [
      'This matters because a low-looking number can still be important on a sensitive or long run. Voltage drop can affect performance, heat, efficiency, and whether the setup is a good idea.',
    ],
    bestUse: [
      'Use this as an early planning check before comparing wire sizes or asking a professional for help.',
      'It is especially useful for sheds, garages, outdoor runs, low-voltage lighting, and battery setups where distance changes the math.',
    ],
    example: {
      heading: 'A quick wire run example',
      paragraphs: [
        'Suppose you compare a 20 foot run and an 80 foot run with the same current and wire size. The longer run usually has more resistance, so the voltage drop estimate goes up.',
        'If the percent drop looks high, the next step is not guessing. It is checking wire size, current, distance, and code guidance before treating the plan as ready.',
      ],
    },
    limits: [
      'A voltage drop calculator is not a wiring permit or a code check.',
      'Breaker size, wire ampacity, insulation, conduit, temperature, and local rules still matter.',
      'If the result affects real electrical work, use qualified advice and official code guidance.',
    ],
  },
  'markdown-table-cleanup': {
    preview:
      'A practical guide to making Markdown tables without hand-spacing every row. Useful for docs, school notes, GitHub READMEs, and quick comparisons.',
    seoReview:
      'DataForSEO reviewed on 2026-05-07: "markdown table generator" is informational intent. Keep this post practical and tool-focused for writers, students, and developers.',
    hook: [
      'Markdown tables look easy until one row has a longer word than the others. Then the neat little table starts looking like homework from a printer that gave up.',
      'A table generator fixes the boring part so you can focus on what the table is supposed to explain.',
    ],
    quickAnswer: [
      'A Markdown table generator lets you enter headers, rows, and alignment choices, then copy clean Markdown. You do not have to count spaces or rebuild the separator row by hand.',
      'For example, a 3-column table for Tool, Use, and Link can be built once, previewed, and copied into a README, blog draft, issue, or school note.',
    ],
    whyItMatters: [
      'This matters because tables are supposed to make information easier to scan. If the source table is messy, it becomes harder to update, and small mistakes are easier to miss.',
    ],
    bestUse: [
      'Use it when you need a quick comparison table, checklist table, pricing table, tool list, or documentation table.',
      'It is best for short cells. If a cell needs a whole paragraph, the table is probably trying to do too much.',
    ],
    example: {
      heading: 'A quick table example',
      paragraphs: [
        'Say you want 3 columns: Calculator, Best for, and Link. Add those as headers, then add 3 rows: Percentage Calculator, Mortgage Calculator, and BMI Calculator.',
        'The generator can turn that into a clean Markdown table with 1 header row, 1 separator row, and 3 body rows that you can paste without fixing every pipe symbol yourself.',
      ],
    },
    limits: [
      'Markdown table support can vary a little between editors.',
      'Very wide tables may still be hard to read on mobile screens.',
      'Keep cell text short, preview before posting, and link out when a row needs more detail.',
    ],
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const publicDirArg = args.find((arg) => arg.startsWith('--public-dir='));
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
    publicDir: publicDirArg ? resolve(publicDirArg.slice('--public-dir='.length)) : resolve(DEFAULT_OUTPUT_DIR, 'public'),
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
  const heroImageUrl = `${SITE_ORIGIN}/medium/${post.slug}.jpg`;
  const heroImagePath = `public/medium/${post.slug}.jpg`;
  const heroAlt = heroAltText[post.slug] ?? `Branded Access Free Tools hero image for ${post.title}.`;
  const sections = post.sections
    .map(
      (section) => `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}`,
    )
    .join('\n\n');

const articleBody = `# ${post.title}

${post.subtitle}

![${heroAlt}](${heroImageUrl})

${renderParagraphs(extra.hook)}

Disclosure: This companion post is from Access Free Tools. The original tool and full guide live on AccessFreeTools.com.

## Quick answer

${renderParagraphs(extra.quickAnswer)}

## Why this matters

${renderParagraphs(extra.whyItMatters)}

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
hero_image_url: "${heroImageUrl}"
hero_image_path: "${heroImagePath}"
hero_alt: "${escapeYaml(heroAlt)}"
recommended_preview: "${escapeYaml(extra.preview)}"
tags: "${tags}"
word_count_estimate: ${wordCount}
reading_time_minutes_estimate: ${readingTime}
---

<!--
Publisher notes:
- Approval required before posting publicly.
- Recommended Medium preview: ${extra.preview}
- Hero image to upload or import: ${heroImagePath}
- Hero image URL: ${heroImageUrl}
- Hero alt text: ${heroAlt}
- Audience: ${post.audience}
- Set Medium canonical/source URL to: ${post.canonicalUrl}
- Suggested tags: ${tags}
- SEO review: ${extra.seoReview ?? 'Run DataForSEO or Search Console intent review before public publishing.'}
- Article standard: follow docs/article-writing-agent-standard.md. Use the original Access Free Tools voice, not a copied living-writer style.
- Live formatting: use rich HTML paste or Medium heading controls, then verify the public article shows the hero image, large title, and bold H2 section headings.
- Keep this starter post free, not paywalled.
- Do not add affiliate links unless a disclosure is placed next to the link.
-->

${articleBody}

## Publisher checklist

- Owner approved this exact article.
- Hero image uploaded or imported, with alt text checked.
- Canonical/source URL set to ${post.canonicalUrl}.
- Link tested: ${post.sourceUrl}.
- Tags set: ${tags}.
- Public Medium URL opened after publish or edit; hero image, alt text, large title, bold H2 headings, SEO settings, and canonical/source URL visibly checked.
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
- Follow docs/article-writing-agent-standard.md before publishing. Keep the voice clear enough for a smart 14-year-old without copying a living writer.
- Keep the canonical/source URL set to the matching Access Free Tools page.
- Upload or import the matching hero image from public/medium and set the alt
  text before publishing.
- Use rich HTML paste or Medium heading controls when rewriting live posts, then
  open the public URL and verify the hero image plus bold H2 headings.
- Keep posts free and useful. Do not run paid promotion.
- Do not add affiliate links until there is a nearby disclosure and a clear reason for the link.
- After publishing, add the public Medium URL and verification notes to
  docs/promotion-queue.md before marking the item posted.
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
    const publicPath = resolve(args.publicDir, `${safeFileName(post.slug)}.md`);
    const publicContent = publicArticleContent(content);
    writeText(path, content);
    writeText(publicPath, publicContent);
    const wordCount = estimateWordCount(publicArticleContent(content));
    report.drafts.push({
      slug: post.slug,
      title: post.title,
      path,
      publicPath,
      sourceUrl: post.sourceUrl,
      canonicalUrl: post.canonicalUrl,
      heroImageUrl: `${SITE_ORIGIN}/medium/${post.slug}.jpg`,
      heroImagePath: `public/medium/${post.slug}.jpg`,
      heroAlt: heroAltText[post.slug],
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
