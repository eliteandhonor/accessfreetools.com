import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface UtilityToolSpec {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  icon: string;
  aliases?: string[];
  formula: string;
  limit: string;
  faqLanguage?: Partial<UtilityFaqLanguage>;
  inputExplanations?: Array<{
    term: string;
    meaning: string;
  }>;
  extraFaq?: ToolFaq[];
  useCases: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
}

interface UtilityFaqLanguage {
  expectedInputs: string;
  inputFallback: string;
  examplePhrase: string;
  doubleCheck: string;
  privacy: string;
}

function getUtilityFaqLanguage(spec: UtilityToolSpec): UtilityFaqLanguage {
  const isCalculator = spec.name.endsWith('Calculator');
  const pageNoun = isCalculator ? 'calculator' : 'tool';
  let language: UtilityFaqLanguage;

  switch (spec.category) {
    case 'text-tools':
      language = {
        expectedInputs: 'the exact text, spacing, line breaks, format, or platform rule the page asks for',
        inputFallback:
          'The main input is the text you want to count, clean, format, or rewrite. Paste the exact text you want to check, including spaces and line breaks when they matter.',
        examplePhrase: 'filled-out example',
        doubleCheck: 'Also check the target app limit, spacing, line breaks, emoji, and selected mode because small text changes can change the result.',
        privacy:
          'No. The tool runs in your browser tab. Your recent answers stay only on the page while you use it, and they are not sent to a server.',
      };
      break;
    case 'developer-tools':
      language = {
        expectedInputs: 'the text, code, URL, mode, format, or technical setting the page asks for',
        inputFallback:
          'The main inputs are usually text, code, a URL, a number base, or a mode setting. Paste only the part you want the tool to work on and compare the output with the examples.',
        examplePhrase: 'filled-out example',
        doubleCheck: 'Also check the selected mode, input format, encoding, and whether the text includes private keys, passwords, or sensitive data.',
        privacy:
          'No. The tool runs in your browser tab. Your recent answers stay only on the page while you use it, and they are not sent to a server.',
      };
      break;
    case 'converters':
      language = {
        expectedInputs: 'the value, source unit, target unit, format, or mode the page asks for',
        inputFallback:
          'The main inputs are the value you want to convert and the from/to units or formats. Keep the original value in the first field and choose the target unit carefully.',
        examplePhrase: 'filled-out example',
        doubleCheck: 'Also check the source unit, target unit, format, decimal places, and selected mode because small input changes can change the result.',
        privacy:
          'No. The tool runs in your browser tab. Your recent answers stay only on the page while you use it, and they are not sent to a server.',
      };
      break;
    default:
      language = {
        expectedInputs: 'the measurements, amounts, units, or options the page asks for',
        inputFallback:
          'The main inputs are the measurements, amounts, units, or options the tool needs before it can work. Read each field label, keep units consistent, and compare your entry with the examples if the answer looks strange.',
        examplePhrase: isCalculator ? 'worked example' : 'filled-out example',
        doubleCheck: 'Also check the unit, scale, mode, and result limit because small input changes can change the answer.',
        privacy: `No. The ${pageNoun} runs in your browser tab. Your recent answers stay only on the page while you use it, and they are not sent to a server.`,
      };
      break;
  }

  return spec.faqLanguage ? { ...language, ...spec.faqLanguage } : language;
}

function makeFaq(spec: UtilityToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');
  const faqLanguage = getUtilityFaqLanguage(spec);
  const inputExplanationFaq = {
    question: `What do the main ${spec.name} inputs mean?`,
    answer: spec.inputExplanations?.length
      ? spec.inputExplanations.map((item) => `${item.term}: ${item.meaning}`).join(' ')
      : faqLanguage.inputFallback,
  };

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it when your task matches one of these common needs: ${exampleUses} It works best when you already know ${faqLanguage.expectedInputs}.`,
    },
    {
      question: `What is the ${spec.name} doing with my inputs?`,
      answer: `In plain language: ${spec.formula} The examples on the page are there so you can compare your inputs with a ${faqLanguage.examplePhrase} before copying the answer.`,
    },
    inputExplanationFaq,
    {
      question: 'What should I double-check before trusting the answer?',
      answer: `${spec.limit} ${faqLanguage.doubleCheck}`,
    },
    ...(spec.extraFaq ?? []),
    {
      question: 'Does the site save what I enter?',
      answer: faqLanguage.privacy,
    },
  ];
}

function makeUtilityTool(spec: UtilityToolSpec): ToolDefinition {
  const titleType = spec.name.endsWith('Generator')
    ? 'Free Online Generator'
    : spec.name.endsWith('Calculator')
      ? 'Free Online Calculator'
      : 'Free Online Tool';

  return {
    slug: spec.slug,
    name: spec.name,
    category: spec.category,
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    aliases: spec.aliases,
    seoTitle: spec.seoTitle ?? `${spec.name} | ${titleType}`,
    seoDescription: spec.seoDescription ?? spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

export const utilityTools: ToolDefinition[] = [
  makeUtilityTool({
    slug: 'age-calculator',
    name: 'Age Calculator',
    category: 'date-time',
    summary: 'Calculate exact calendar age in years, months, days, and total days.',
    description:
      'Enter a birth date and an as-of date to get exact calendar age, total days lived, and the next birthday countdown.',
    icon: 'calculator-age',
    aliases: ['Birthday Calculator', 'Exact Age Calculator', 'Age Difference Calculator', 'Age in Days Calculator'],
    seoTitle: 'Age Calculator | Exact Age, Total Days, Next Birthday',
    seoDescription:
      'Calculate age from a birth date to any as-of date. See years, months, days, total days lived, and next birthday timing.',
    formula:
      'The calculator compares two valid calendar dates, subtracts full years, then remaining months and days. It also counts total days using UTC calendar dates.',
    limit:
      'Check the as-of date carefully. Legal, school, insurance, and age-restricted decisions can use their own cutoff rules.',
    faqLanguage: {
      expectedInputs: 'a real birth date and the exact as-of calendar date you want to check',
      inputFallback:
        'Birth date is the starting date. As-of date is the date you want to know the age on, such as today, a birthday, a school cutoff, or a future event.',
      doubleCheck:
        'Also check the birth date, as-of date, leap-day rule, and any official cutoff date because one day can change the answer.',
    },
    inputExplanations: [
      { term: 'Birth date', meaning: 'the birth or start date you want to compare, in YYYY-MM-DD form.' },
      { term: 'As-of date', meaning: 'the calendar date you want to calculate age on, not always today.' },
      { term: 'Total days', meaning: 'the full day count between those two dates, separate from calendar years and months.' },
      { term: 'Next birthday', meaning: 'the next matching month and day after the as-of date.' },
    ],
    extraFaq: [
      {
        question: 'Does the Age Calculator include today?',
        answer:
          'It compares date to date. If the birth date and as-of date are the same calendar day, age is 0 days. If the as-of date is tomorrow, it counts 1 full day.',
      },
      {
        question: 'Why can calendar age differ from total days lived?',
        answer:
          'Calendar age uses completed years, then months, then days. Total days is one continuous count. They differ because months and years do not all have the same number of days.',
      },
      {
        question: 'How are leap-day birthdays handled?',
        answer:
          'The calculator treats February 29 as the actual birth date. For official forms, schools, insurance, and age limits, check the rule that says whether a non-leap year uses February 28 or March 1.',
      },
      {
        question: 'Can I use this for legal age checks?',
        answer:
          'Use it as a quick check only. Legal age, school eligibility, sports groups, insurance, and age-restricted services may define their own cutoff date or leap-day rule.',
      },
      {
        question: 'What date format should I use?',
        answer:
          'Use the browser date picker when it appears. The stored value is a YYYY-MM-DD date, which keeps month and day order clear across different countries.',
      },
      {
        question: 'What does days until next birthday mean?',
        answer:
          'It is the number of days from the as-of date to the next birthday date. If the birthday is today, the countdown is 0 days.',
      },
    ],
    useCases: [
      'Find exact age today or on a future date.',
      'Calculate age for forms, school records, birthday planning, or quick checks.',
      'See total days lived and days until the next birthday.',
      'Compare leap-day birthdays with normal calendar dates.',
    ],
    examples: [
      { label: 'Born Jan 1, 2000', expression: '2000-01-01 to 2026-04-30', result: '26 years, 3 months, 29 days' },
      { label: 'Leap day birthday', expression: '2004-02-29 to 2026-04-30', result: '22 years, 2 months, 1 day' },
      { label: 'Birthday today', expression: '2010-04-30 to 2026-04-30', result: '16 years, 0 months, 0 days' },
    ],
    relatedSlugs: ['date-calculator', 'time-calculator', 'hours-calculator'],
  }),
  makeUtilityTool({
    slug: 'date-calculator',
    name: 'Date Calculator',
    category: 'date-time',
    summary: 'Count days between dates or move a calendar date forward or backward.',
    description:
      'Count full days between two dates, or add and subtract years, months, weeks, and days from one calendar date.',
    icon: 'calculator-date',
    aliases: [
      'Days Between Dates Calculator',
      'Date Difference Calculator',
      'Add Days to Date Calculator',
      'Subtract Days from Date Calculator',
    ],
    seoTitle: 'Date Calculator | Days Between Dates',
    seoDescription:
      'Count full days between two dates, add or subtract date offsets, and check month-end calendar shifts with clear examples.',
    formula:
      'Date difference counts full UTC calendar days between two YYYY-MM-DD dates. Add/subtract mode applies years and months first, clamps month-end dates when needed, then applies weeks and days.',
    limit:
      'Calendar-date math is not the same as time-zone scheduling. Confirm local deadlines, business days, holidays, and time zones separately.',
    inputExplanations: [
      { term: 'Start date', meaning: 'the first calendar date in YYYY-MM-DD format.' },
      { term: 'End date', meaning: 'the second calendar date for difference mode.' },
      { term: 'Direction', meaning: 'add moves the date forward; subtract moves it backward.' },
      { term: 'Years, months, weeks, days', meaning: 'the whole-number offset used in add or subtract mode.' },
    ],
    extraFaq: [
      {
        question: 'Does the Date Calculator include the start date?',
        answer:
          'No. Difference mode counts full days between the two dates. May 26, 2026 to June 10, 2026 is 15 days because May 26 is the starting point, not a completed day.',
      },
      {
        question: 'What happens when I add one month to a month-end date?',
        answer:
          'The calculator clamps to the last valid day when the target month is shorter. January 31, 2026 plus 1 month becomes February 28, 2026, then any week or day offset is added after that.',
      },
      {
        question: 'Can this count business days or holidays?',
        answer:
          'No. This page counts calendar days. If weekends, school breaks, bank holidays, or local public holidays matter, check those rules separately before using the result as a deadline.',
      },
    ],
    useCases: [
      'Count full days between deadlines, trips, projects, or events.',
      'Add or subtract offsets such as 45 days, 6 weeks, or 3 months.',
      'Check how many weeks and leftover days sit between two dates.',
      'Avoid daylight-saving surprises by using date-only calendar math.',
    ],
    examples: [
      { label: 'Two-week deadline', expression: '2026-05-26 to 2026-06-10', result: '15 days, or 2 weeks and 1 day' },
      { label: 'Add 45 days', expression: '2026-05-26 + 0y 0m 6w 3d', result: '2026-07-10' },
      { label: 'Month-end clamp', expression: '2026-01-31 + 0y 1m 0w 0d', result: '2026-02-28' },
    ],
    relatedSlugs: ['age-calculator', 'time-calculator', 'hours-calculator'],
  }),
  makeUtilityTool({
    slug: 'time-calculator',
    name: 'Time Calculator',
    category: 'date-time',
    summary: 'Add or subtract hours, minutes, and seconds with normalized results.',
    description:
      'Use this free time calculator to add or subtract durations and convert the result into hours, minutes, seconds, total seconds, and decimal hours.',
    icon: 'calculator-time',
    formula:
      'The calculator converts both durations to seconds, adds or subtracts them, then converts the result back to hours, minutes, and seconds.',
    limit:
      'This is duration math, not a time-zone or clock scheduling calculator. Use the Hours Calculator for start and end times.',
    useCases: [
      'Add workout, study, video, podcast, or task durations.',
      'Subtract elapsed time from a planned duration.',
      'Convert a duration into total seconds or decimal hours.',
      'Normalize minutes and seconds that roll over 60.',
    ],
    examples: [
      { label: 'Add two durations', expression: '2:45:30 + 1:20:45', result: '4h 6m 15s' },
      { label: 'Subtract time', expression: '5:00:00 - 1:35:15', result: '3h 24m 45s' },
      { label: 'Seconds cleanup', expression: '0:59:50 + 0:00:25', result: '1h 0m 15s' },
    ],
    relatedSlugs: ['hours-calculator', 'date-calculator', 'age-calculator'],
  }),
  makeUtilityTool({
    slug: 'hours-calculator',
    name: 'Hours Calculator',
    category: 'date-time',
    summary: 'Calculate hours worked between start and end times with breaks and optional pay.',
    description:
      'Use this free hours calculator to find shift length, decimal hours, overnight time, break deductions, and optional gross pay.',
    icon: 'calculator-hours',
    aliases: ['Time Duration Calculator', 'Duration Calculator', 'Time Difference Calculator'],
    formula:
      'The calculator converts start and end clock times into seconds, handles overnight shifts, subtracts break minutes, and converts the result to decimal hours.',
    limit:
      'This is simple time-card math. Payroll rounding, overtime, split shifts, local labor rules, and employer policies can change paid hours.',
    useCases: [
      'Calculate hours worked from start time, end time, and break minutes.',
      'Convert a shift into decimal hours for invoices or timesheets.',
      'Estimate gross pay from an hourly rate.',
      'Handle overnight shifts where the end time is after midnight.',
    ],
    examples: [
      { label: 'Day shift', expression: '9:00 AM to 5:30 PM, 30 min break', result: '8 hours' },
      { label: 'No break', expression: '8:15 AM to 4:00 PM', result: '7.75 hours' },
      { label: 'Overnight', expression: '10:00 PM to 6:30 AM, 45 min break', result: '7.75 hours' },
    ],
    relatedSlugs: ['time-calculator', 'date-calculator', 'salary-calculator'],
  }),
  makeUtilityTool({
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'school-study',
    summary: 'Estimate GPA from course credits and letter grades on a common 4.0 scale.',
    description:
      'Use this free GPA calculator to estimate total credits, quality points, and grade point average from course grades and credits.',
    icon: 'calculator-gpa',
    formula:
      'Each course grade is converted to grade points, multiplied by credits for quality points, then total quality points are divided by total credits.',
    limit:
      'Schools can use different grading scales, weighted courses, pass/fail rules, repeats, and plus/minus policies. Use your school scale for official GPA.',
    useCases: [
      'Estimate term GPA from several courses.',
      'Compare how credit hours change the GPA impact of each grade.',
      'Check quality points before planning future courses.',
      'Understand GPA math before using an official school transcript.',
    ],
    examples: [
      { label: 'Four classes', expression: '3cr A, 4cr B+, 3cr A-, 2cr B', result: 'Estimated 3.525 GPA' },
      { label: 'All A term', expression: '3cr A, 3cr A, 4cr A', result: '4.0 GPA on this scale' },
      { label: 'Mixed credits', expression: '4cr B, 4cr A-, 2cr C+, 1cr A', result: 'Credit-weighted GPA' },
    ],
    relatedSlugs: ['grade-calculator', 'mean-median-mode-range-calculator', 'percentage-calculator'],
  }),
  makeUtilityTool({
    slug: 'grade-calculator',
    name: 'Grade Calculator',
    category: 'school-study',
    summary: 'Find the final exam grade needed to reach a desired course grade.',
    description:
      'Use this free grade calculator to estimate what score you need on a final exam based on current grade, final weight, and target grade.',
    icon: 'calculator-grade',
    formula:
      'The calculator multiplies current grade by the non-final weight, then solves for the final exam score needed to reach the desired course grade.',
    limit:
      'Use the weights from your syllabus. Extra credit, dropped grades, category weighting, curves, and school policies can change the official result.',
    useCases: [
      'Find the final exam score needed for a target course grade.',
      'See whether a goal is possible without extra credit.',
      'Understand how final exam weight affects the course grade.',
      'Plan study priorities before a final assessment.',
    ],
    examples: [
      { label: 'Aim for A-', expression: '87 current, final 30%, target 90', result: 'Need 97% on final' },
      { label: 'Pass the class', expression: '62 current, final 40%, target 70', result: 'Need 82% on final' },
      { label: 'Small final', expression: '91 current, final 15%, target 90', result: 'Need about 84.33%' },
    ],
    relatedSlugs: ['gpa-calculator', 'percentage-calculator', 'mean-median-mode-range-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-calculator',
    name: 'Concrete Calculator',
    category: 'home-projects',
    summary: 'Estimate slab volume, cubic yards, cubic meters, and common 40, 60, and 80 lb bag counts.',
    description:
      'Use this free concrete calculator to estimate slab concrete volume, cubic yards, cubic meters, and common bag counts from length, width, depth, and waste.',
    seoTitle: 'Concrete Calculator | Cubic Yards And Bag Count',
    seoDescription:
      'Estimate concrete cubic yards, cubic feet, cubic meters, and 40 lb, 60 lb, and 80 lb bag counts from slab size, depth, and waste.',
    icon: 'calculator-concrete',
    aliases: [
      'Concrete Yard Calculator',
      'Concrete Slab Calculator',
      'Concrete Bag Calculator',
      'Cubic Yard Concrete Calculator',
      'Ready Mix Concrete Calculator',
    ],
    formula:
      'The calculator uses cubic feet = length x width x (depth inches / 12), adjusted cubic feet = cubic feet x (1 + waste percent / 100), cubic yards = adjusted cubic feet / 27, cubic meters = adjusted cubic feet x 0.0283168, and bag counts = adjusted cubic feet / bag yield rounded up.',
    limit:
      'This is a planning estimate, not structural design or a supplier order guarantee. Forms, uneven ground, compaction, reinforcement, base prep, spillage, waste, truck minimums, weather, and exact bag yield can change what you need.',
    faqLanguage: {
      expectedInputs: 'length, width, depth, and waste percent',
      examplePhrase: 'concrete slab example',
      doubleCheck:
        'Also check whether the depth is in inches, whether the slab shape is rectangular, whether the base is level, and whether you are ordering ready-mix cubic yards or buying bagged mix.',
    },
    inputExplanations: [
      { term: 'Length and width', meaning: 'the inside form dimensions of the slab, pad, or walkway in feet.' },
      { term: 'Depth', meaning: 'the average concrete thickness in inches, such as 4 for a common small slab.' },
      { term: 'Extra waste', meaning: 'a cushion for uneven base, spillage, low spots, and ordering a little more than the exact volume.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate cubic yards for concrete?',
        answer:
          'Multiply length by width by depth in feet to get cubic feet, then divide by 27 for cubic yards. For a 10 ft by 12 ft slab at 4 inches thick, the exact volume is 40 cubic feet before waste and about 1.63 cubic yards with 10% waste.',
      },
      {
        question: 'Why does the calculator show 40 lb, 60 lb, and 80 lb bags?',
        answer:
          'Small jobs often use bagged concrete instead of a ready-mix truck. The bag counts use common approximate yields, then round up because you cannot buy part of a bag. Always check the yield printed on the exact bag before buying.',
      },
      {
        question: 'How much concrete is needed for a 10 by 12 slab at 4 inches?',
        answer:
          'With 10% waste, a 10 ft by 12 ft slab at 4 inches thick is about 44 cubic feet, 1.63 cubic yards, or 74 common 80 lb bags using a 0.6 cubic foot yield.',
      },
      {
        question: 'Should I order extra concrete?',
        answer:
          'Usually yes, but do it carefully. A small waste buffer helps with uneven base, form loss, spillage, and low spots. For ready-mix delivery, ask the supplier or contractor how much extra makes sense before ordering.',
      },
      {
        question: 'Does this handle footings, posts, stairs, or round forms?',
        answer:
          'This page is for a simple rectangular slab, pad, or walkway. Use a footing, post-hole, column, or steps calculator when the shape is different, and get professional help for structural or code-sensitive work.',
      },
    ],
    useCases: [
      'Estimate concrete for a simple slab, pad, walkway, or small project.',
      'Convert cubic feet to cubic yards before ordering ready-mix.',
      'Estimate common 40 lb, 60 lb, and 80 lb bag counts.',
      'Add waste percentage before buying materials.',
      'Check whether a project is closer to bagged mix or ready-mix delivery.',
    ],
    examples: [
      { label: '10 x 12 slab', expression: '10 ft x 12 ft x 4 in, 10% extra', result: '1.63 yd3 and 74 80 lb bags' },
      { label: 'Walkway', expression: '24 ft x 3 ft x 4 in, 10% extra', result: '0.98 yd3 and 44 80 lb bags' },
      { label: 'Small pad', expression: '6 ft x 6 ft x 3.5 in, 5% extra', result: '0.41 yd3 and 19 80 lb bags' },
      { label: 'Driveway bay', expression: '20 ft x 10 ft x 4 in, 10% extra', result: '2.72 yd3 and 123 80 lb bags' },
    ],
    relatedSlugs: ['rebar-calculator', 'gravel-calculator', 'square-footage-calculator'],
  }),
  makeUtilityTool({
    slug: 'subnet-calculator',
    name: 'Subnet Calculator',
    category: 'developer-tools',
    summary: 'Calculate IPv4 CIDR network, broadcast, mask, wildcard, and usable host range.',
    description:
      'Use this free subnet calculator to convert an IPv4 address and CIDR prefix into subnet mask, wildcard mask, network, broadcast, and usable addresses.',
    icon: 'calculator-subnet',
    aliases: ['IP Subnet Calculator', 'IPv4 Subnet Calculator', 'CIDR Calculator'],
    formula:
      'The calculator converts IPv4 octets to a 32-bit number, builds the CIDR subnet mask, then uses bitwise network and wildcard math.',
    limit:
      'This tool covers IPv4 CIDR math. It does not configure routers, validate a live network, or handle IPv6 subnets.',
    useCases: [
      'Find the network and broadcast address for an IPv4 CIDR block.',
      'Convert a prefix length such as /24 into a dotted decimal subnet mask.',
      'Check usable host range and address count.',
      'Practice subnetting for networking, security, or developer work.',
    ],
    examples: [
      { label: 'Home LAN', expression: '192.168.1.10/24', result: 'Network 192.168.1.0, usable 192.168.1.1-192.168.1.254' },
      { label: 'Small subnet', expression: '10.0.5.17/28', result: '16 total addresses' },
      { label: 'Point-to-point', expression: '172.16.0.8/31', result: '2 usable /31 addresses' },
    ],
    relatedSlugs: ['binary-calculator', 'hex-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'password-generator',
    name: 'Password Generator',
    category: 'developer-tools',
    summary: 'Generate strong random passwords with length, character sets, and ambiguity controls.',
    description:
      'Use this free password generator to create strong browser-generated passwords with uppercase, lowercase, numbers, symbols, ambiguity controls, copy, and entropy estimate.',
    icon: 'password-key',
    formula:
      'The generator builds a character pool from your choices and uses browser cryptographic random values to choose each character.',
    limit:
      'Use a unique password for every account, store it in a trusted password manager, and follow the password rules for the service you are using.',
    useCases: [
      'Create a unique password for a new account.',
      'Generate longer passwords for password manager storage.',
      'Avoid ambiguous characters when reading a password aloud or typing it manually.',
      'Estimate password strength from length and character pool size.',
    ],
    examples: [
      { label: 'Strong default', expression: '20 characters, letters, numbers, symbols', result: 'Browser-generated random password' },
      { label: 'Long readable', expression: '24 characters, no symbols, avoid ambiguous', result: 'Readable password manager entry' },
      { label: 'Maximum mix', expression: '32 characters with full pool', result: 'Higher entropy estimate' },
    ],
    relatedSlugs: ['random-number-generator', 'subnet-calculator', 'big-number-calculator'],
  }),
  makeUtilityTool({
    slug: 'conversion-calculator',
    name: 'Conversion Calculator',
    category: 'converters',
    summary: 'Convert length, mass, volume, and temperature units with clear formula steps.',
    description:
      'Use this free conversion calculator to convert common length, mass, volume, and temperature units including metric and U.S. customary units.',
    icon: 'calculator-conversion',
    formula:
      'Most conversions multiply by a fixed factor to a base unit, then divide by the target factor. Temperature conversions use Celsius as the intermediate value.',
    limit:
      'Use exact professional references for regulated, medical, lab, engineering, or legal measurement work that requires a specified standard.',
    useCases: [
      'Convert between metric and U.S. customary length units.',
      'Convert weight or mass between grams, kilograms, ounces, pounds, and tons.',
      'Convert common cooking and liquid volume units.',
      'Convert Celsius, Fahrenheit, and Kelvin temperatures.',
    ],
    examples: [
      { label: 'Feet to meters', expression: '12 ft to m', result: '3.6576 meters' },
      { label: 'Pounds to kilograms', expression: '150 lb to kg', result: '68.0388555 kilograms' },
      { label: 'Fahrenheit to Celsius', expression: '72 F to C', result: '22.2222222 C' },
    ],
    relatedSlugs: ['concrete-calculator', 'volume-calculator', 'scientific-notation-calculator'],
  }),
  makeUtilityTool({
    slug: 'dice-roller',
    name: 'Dice Roller',
    category: 'everyday-tools',
    summary: 'Roll one or more virtual dice with custom sides and a modifier.',
    description:
      'Use this free dice roller to roll standard or custom dice, add a modifier, copy totals, and keep quick recent rolls in your browser tab.',
    icon: 'random-dice',
    formula:
      'The roller generates each die as a random whole number from 1 through the number of sides, adds the rolls together, then applies the modifier.',
    limit:
      'Use it for everyday games, teaching, and quick picks. Do not use it for gambling, legal drawings, security, or audited randomness.',
    useCases: [
      'Roll 1d6, 2d6, d20, percentile-style dice, or custom sided dice.',
      'Add a positive or negative modifier for tabletop game checks.',
      'Show each die roll and the final total.',
      'Keep recent rolls while comparing examples.',
    ],
    examples: [
      { label: 'Board game roll', expression: '2d6', result: 'Two rolls from 1 to 6, added together' },
      { label: 'Tabletop check', expression: '1d20 + 5', result: 'One d20 roll plus modifier 5' },
      { label: 'Custom dice', expression: '4d10', result: 'Four rolls from 1 to 10' },
    ],
    relatedSlugs: ['random-number-generator', 'probability-calculator', 'permutation-and-combination-calculator'],
  }),
  makeUtilityTool({
    slug: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    category: 'everyday-tools',
    summary: 'Estimate fuel cost from distance, MPG, fuel price, and round-trip setting.',
    description:
      'Estimate trip fuel cost from miles, MPG, fuel price, and the round-trip switch. See gallons needed, total fuel cost, and cost per mile.',
    seoTitle: 'Fuel Cost Calculator | Trip Gas Cost And MPG',
    seoDescription:
      'Estimate road trip gas cost from one-way miles, MPG, pump price, and round-trip choice. Shows gallons needed, total fuel cost, and cost per mile.',
    icon: 'calculator-fuel-cost',
    aliases: [
      'Gas Cost Calculator',
      'Trip Cost Calculator',
      'Road Trip Gas Calculator',
      'Gas Trip Calculator',
      'Fuel Cost Calculator Trip',
    ],
    formula:
      'The calculator divides trip miles by miles per gallon to estimate gallons needed, then multiplies gallons by the price per gallon.',
    limit:
      'Real fuel cost changes with traffic, speed, weather, terrain, vehicle load, maintenance, fuel blend, driving style, and the actual price you pay.',
    faqLanguage: {
      expectedInputs: 'your one-way miles, expected MPG, price per gallon, and whether the trip is round trip',
      doubleCheck:
        'Also check that the distance is one-way, the round-trip switch matches the trip, the MPG fits your actual driving, and the gas price is the price you expect to pay.',
    },
    inputExplanations: [
      {
        term: 'One-way distance',
        meaning: 'Enter the miles from start to destination once. Turn on round trip if you are coming back the same way.',
      },
      {
        term: 'Fuel economy',
        meaning: 'Use the MPG you expect for this trip. EPA label MPG is helpful, but traffic, speed, and load can move the real number.',
      },
      {
        term: 'Fuel price',
        meaning: 'Enter the price per gallon you expect to pay at the pump, not an old saved price.',
      },
      {
        term: 'Round trip',
        meaning: 'Leave it off for one-way driving. Turn it on to double the distance before the fuel cost is calculated.',
      },
    ],
    extraFaq: [
      {
        question: 'Is this a live gas price lookup?',
        answer:
          'No. You enter the fuel price yourself. Check a local station, a route app, or a current price source first, then put that price per gallon into the calculator.',
      },
      {
        question: 'Should I use EPA MPG or my real MPG?',
        answer:
          'Use your real MPG if you know it from recent driving. EPA MPG is a useful starting point, but hills, speed, traffic, weather, cargo, tires, and driving style can change the trip result.',
      },
      {
        question: 'Does this include tolls, parking, wear, or maintenance?',
        answer:
          'No. This is fuel-only. Add tolls, parking, rental fees, tire wear, maintenance, and other travel costs separately if you need the full trip budget.',
      },
      {
        question: 'Why is this different from the IRS mileage rate?',
        answer:
          'The IRS standard mileage rate is a broad tax or reimbursement rate. This calculator only estimates fuel cost from gallons and price per gallon, so it will usually be much lower.',
      },
      {
        question: 'What does cost per mile mean here?',
        answer:
          'Cost per mile is fuel price divided by MPG. For example, $3.75 per gallon at 28 MPG is about 13.4 cents of fuel per mile.',
      },
    ],
    useCases: [
      'Estimate fuel cost for a trip before driving.',
      'Compare one-way and round-trip fuel cost.',
      'See gallons needed and cost per mile.',
      'Plan quick travel budgets with your own MPG and fuel price.',
    ],
    examples: [
      { label: 'Weekend drive', expression: '120 mi, 28 MPG, $3.75/gal, round trip', result: 'About $32.14 fuel cost' },
      { label: 'Commute', expression: '18 mi, 31 MPG, $3.60/gal, round trip', result: 'About $4.18 per day' },
      { label: 'One-way move', expression: '450 mi, 22 MPG, $3.90/gal', result: 'About $79.77 fuel cost' },
    ],
    relatedSlugs: ['gas-mileage-calculator', 'mileage-calculator', 'budget-calculator'],
  }),
  makeUtilityTool({
    slug: 'square-footage-calculator',
    name: 'Square Footage Calculator',
    category: 'calculators',
    summary: 'Calculate square feet, square yards, and square meters from length, width, and quantity.',
    description:
      'Use this free square footage calculator to find rectangular area for rooms, panels, flooring, walls, and repeated sections.',
    icon: 'calculator-square-footage',
    formula:
      'The calculator multiplies length in feet by width in feet for one rectangle, then multiplies by quantity for repeated sections.',
    limit:
      'For real material orders, add waste and account for openings, cuts, pattern matching, irregular shapes, and product coverage rules.',
    extraFaq: [
      {
        question: 'Can I use square footage for wallpaper estimates?',
        answer:
          'Yes, square footage is a useful starting point for wallpaper, paint, flooring, and tile, but it is not the final buying number. Wallpaper still needs roll coverage, pattern repeat, openings, and waste percent, so use the Wallpaper Calculator after you know the wall area.',
      },
    ],
    useCases: [
      'Find the area of a room, wall, garden bed, panel, or floor section.',
      'Multiply one section by quantity for repeated panels or rooms.',
      'Convert square feet to square yards and square meters.',
      'Prepare numbers for flooring, paint, tile, or planning estimates.',
    ],
    examples: [
      { label: 'Bedroom', expression: '12 ft x 10 ft', result: '120 ft2' },
      { label: 'Three panels', expression: '8 ft x 4 ft x 3', result: '96 ft2' },
      { label: 'Flooring area', expression: '22.5 ft x 14 ft', result: '315 ft2' },
    ],
    relatedSlugs: ['area-calculator', 'wallpaper-calculator', 'concrete-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'time-card-calculator',
    name: 'Time Card Calculator',
    category: 'date-time',
    summary: 'Add weekday shifts, breaks, total hours, and optional gross pay.',
    description:
      'Use this free time card calculator to total work hours for a week from start times, end times, break minutes, and optional hourly rate.',
    icon: 'calculator-time-card',
    formula:
      'Each day is calculated like a shift: end time minus start time minus unpaid break minutes. The weekly total adds every worked day.',
    limit:
      'This is simple arithmetic, not payroll advice. Overtime, rounding, paid breaks, meal rules, and employer policies can change paid time.',
    useCases: [
      'Add weekday start and end times into a weekly total.',
      'Subtract unpaid break minutes for each day.',
      'Estimate gross pay from an hourly rate.',
      'Compare regular weeks, four-tens schedules, and partial weeks.',
    ],
    examples: [
      { label: 'Standard week', expression: 'Mon-Thu 9-5:30, Fri 9-4, 30 min breaks', result: '39.5 hours' },
      { label: 'Four tens', expression: 'Four 10-hour days', result: '40 hours' },
      { label: 'Part-time week', expression: 'Three 6-hour days', result: '18 hours' },
    ],
    relatedSlugs: ['hours-calculator', 'time-calculator', 'salary-calculator'],
  }),
  makeUtilityTool({
    slug: 'time-zone-calculator',
    name: 'Time Zone Calculator',
    category: 'date-time',
    summary: 'Convert a UTC date and time into a selected IANA time zone.',
    description:
      'Use this free time zone calculator to convert a UTC date and time into local date, local time, and UTC offset for common IANA time zones.',
    icon: 'calculator-time-zone',
    formula:
      'The calculator treats the entered date and time as a UTC instant, then formats that instant in the selected IANA time zone using browser time zone data.',
    limit:
      'Time zone rules change over time. Confirm critical meetings, travel, legal deadlines, and daylight-saving cases with an official calendar or scheduling system.',
    useCases: [
      'Convert a UTC timestamp into a local time zone.',
      'Check the UTC offset for a selected date.',
      'Compare daylight-saving behavior by choosing different dates.',
      'Plan simple cross-time-zone examples without sending data to a server.',
    ],
    examples: [
      { label: 'New York', expression: '2026-04-30 12:00 UTC', result: 'Local time in America/New_York' },
      { label: 'London', expression: '2026-04-30 12:00 UTC', result: 'Local time in Europe/London' },
      { label: 'Tokyo', expression: '2026-04-30 12:00 UTC', result: 'Local time in Asia/Tokyo' },
    ],
    relatedSlugs: ['time-calculator', 'date-calculator', 'day-of-the-week-calculator'],
  }),
  makeUtilityTool({
    slug: 'gas-mileage-calculator',
    name: 'Gas Mileage Calculator',
    category: 'everyday-tools',
    summary: 'Work out MPG from a real fill-up, plus gallons per 100 miles and L/100 km.',
    description:
      'Calculate gas mileage from miles driven and gallons used. See MPG, gallons per 100 miles, and liters per 100 km.',
    seoTitle: 'Gas Mileage Calculator | MPG And Gallons Per 100 Miles',
    seoDescription:
      'Calculate MPG from miles driven and gallons used. Includes gallons per 100 miles, L/100 km, fill-up tips, and clear limits.',
    icon: 'calculator-gas-mileage',
    aliases: ['MPG Calculator', 'Fuel Economy Calculator', 'Miles Per Gallon Calculator'],
    formula:
      'MPG = miles driven / gallons used. Gallons per 100 miles = gallons used / miles driven x 100. L/100 km uses the standard 235.214583 divided by MPG conversion.',
    limit:
      'One tank can be noisy. Pump shutoff, fill level, tire pressure, route, speed, weather, traffic, load, and driving style can all move the result.',
    faqLanguage: {
      expectedInputs: 'the miles driven and gallons used from the same fill-up, tank, or trip window',
      inputFallback:
        'Miles driven is the distance from the same tank or trip. Gallons used is the fuel added or measured for that exact distance. Do not mix miles from one fill-up with gallons from another.',
      examplePhrase: 'fill-up example',
      doubleCheck:
        'Also check that the odometer/trip meter and fuel amount cover the same window. For cleaner long-term MPG, average several tanks instead of trusting one unusual drive.',
      privacy:
        'No. The math runs in your browser tab. Your miles, gallons, and recent results are not sent to a server.',
    },
    useCases: [
      'Calculate MPG after filling a tank.',
      'Compare fuel use between trips or vehicles.',
      'Convert MPG into gallons per 100 miles or L/100 km.',
      'Use a real trip value inside the Fuel Cost Calculator.',
    ],
    examples: [
      { label: 'Road trip', expression: '350 miles, 12.5 gallons', result: '28 MPG, or about 3.57 gallons per 100 miles' },
      { label: 'Commute tank', expression: '275 miles, 9.8 gallons', result: 'About 28.06 MPG, useful for comparing your next tank' },
      { label: 'Truck tank', expression: '420 miles, 24 gallons', result: '17.5 MPG, which can feed a fuel-cost estimate' },
    ],
    relatedSlugs: ['fuel-cost-calculator', 'mileage-calculator', 'conversion-calculator'],
    inputExplanations: [
      { term: 'Miles driven', meaning: 'the odometer or trip-meter distance since the fill-up or route started.' },
      { term: 'Gallons used', meaning: 'the fuel used for those same miles, usually the gallons added at the next fill-up.' },
      { term: 'MPG', meaning: 'miles per gallon. Higher MPG means you went farther on each gallon.' },
      { term: 'Gallons per 100 miles', meaning: 'fuel used per distance. Lower is better, and it can make savings easier to compare.' },
      { term: 'L/100 km', meaning: 'the metric fuel-use version. Lower is better here too.' },
    ],
    extraFaq: [
      {
        question: 'Should I use a full tank or a single trip?',
        answer:
          'A full-tank fill-up is usually cleaner because the gallons added should match the miles driven since the last fill. A single trip can still work if you know the actual fuel used for that trip.',
      },
      {
        question: 'Why do I also see gallons per 100 miles and L/100 km?',
        answer:
          'MPG is common in the United States, but gallons per 100 miles and L/100 km make fuel used per distance easier to compare. Lower is better for those two outputs.',
      },
      {
        question: 'When should I use the Fuel Cost Calculator instead?',
        answer:
          'Use this page to find fuel economy. Use the Fuel Cost Calculator when you already know the trip distance, MPG, and fuel price and want the money estimate.',
      },
      {
        question: 'Why can one tank show weird MPG?',
        answer:
          'The pump may stop at a slightly different fill level, the route may have more traffic, or the car may be carrying more weight. If one tank looks strange, average several normal fill-ups before deciding your MPG changed.',
      },
      {
        question: 'Can this prove the EPA label is wrong?',
        answer:
          'No. EPA labels are standardized estimates for comparing vehicles. This calculator shows your real fill-up math, which can be higher or lower because your route, speed, weather, tires, and driving style are different.',
      },
    ],
  }),
  makeUtilityTool({
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    category: 'everyday-tools',
    summary: 'Calculate tip, tax, total bill, and per-person split.',
    description:
      'Use this free tip calculator to calculate a tip amount, optional tax, total bill, and per-person split from a subtotal.',
    icon: 'calculator-tip',
    formula:
      'The calculator multiplies subtotal by the tip percent and optional tax percent, adds the amounts, then divides by people for a split bill.',
    limit:
      'Restaurant tax, service charges, included gratuity, discounts, and local customs can change what you actually owe.',
    useCases: [
      'Calculate a restaurant tip quickly.',
      'Split a bill between people.',
      'Add optional tax to estimate the final total.',
      'Compare different tip percentages before paying.',
    ],
    examples: [
      { label: 'Dinner for two', expression: '$84.50, 20% tip, 8.25% tax, 2 people', result: 'About $54.20 each' },
      { label: 'Coffee tip', expression: '$18, 18% tip', result: '$21.24 total' },
      { label: 'Group split', expression: '$240, 20% tip, 8% tax, 6 people', result: '$51.20 each' },
    ],
    relatedSlugs: ['percentage-calculator', 'sales-tax-calculator', 'budget-calculator'],
  }),
  makeUtilityTool({
    slug: 'mileage-calculator',
    name: 'Mileage Calculator',
    category: 'everyday-tools',
    summary: 'Estimate mileage reimbursement from miles, rate per mile, parking, tolls, and extras.',
    description:
      'Work out a mileage total from miles driven, a rate per mile, and optional parking, tolls, or trip extras.',
    seoTitle: 'Mileage Calculator | Reimbursement And Trip Extras',
    seoDescription:
      'Calculate a mileage total from miles, rate per mile, parking, tolls, and extras. Includes 2026 IRS/GSA rate context and rate checks.',
    icon: 'calculator-mileage',
    aliases: ['Mileage Reimbursement Calculator', 'Miles To Dollars Calculator', 'Rate Per Mile Calculator'],
    formula:
      'Mileage amount = miles driven x rate per mile. Total = mileage amount + parking, tolls, or other entered extras.',
    limit:
      'The 2026 IRS business rate and the GSA rate for an authorized privately owned car are both $0.725 per mile, but your employer, client, contract, app, or tax situation may use a different rule.',
    faqLanguage: {
      expectedInputs: 'the miles driven, the rate per mile, and any parking, tolls, or extras that should be added',
      inputFallback:
        'Miles is the trip distance. Rate per mile is the reimbursement or allowance rate you are allowed to use. Extras are separate costs, such as parking or tolls, only when they belong in the same claim.',
      examplePhrase: 'reimbursement example',
      doubleCheck:
        'Check the rate source, the trip date, and whether parking or tolls should be added separately. Do not assume the example rate applies to every job or tax return.',
      privacy:
        'No. The math runs in your browser tab. Your miles, rate, extras, and recent totals are not sent to a server.',
    },
    useCases: [
      'Estimate mileage reimbursement from miles and rate.',
      'Add parking, tolls, or trip extras.',
      'Compare different mileage rates.',
      'Copy a quick total for an invoice draft or personal note.',
    ],
    examples: [
      { label: 'Client visit', expression: '125 miles x $0.725 + $12', result: '$102.63' },
      { label: 'Local errand', expression: '18.4 miles x $0.725', result: '$13.34' },
      { label: 'Delivery day', expression: '92 miles x $0.55 + $8', result: '$58.60' },
    ],
    relatedSlugs: ['fuel-cost-calculator', 'gas-mileage-calculator', 'auto-loan-calculator'],
    inputExplanations: [
      { term: 'Miles', meaning: 'the trip distance you are claiming or checking.' },
      { term: 'Rate per mile', meaning: 'the allowed dollar amount for each mile, such as 0.725 for 72.5 cents per mile.' },
      { term: 'Extras', meaning: 'parking, tolls, or other trip costs you are allowed to add separately.' },
      { term: 'Mileage only', meaning: 'miles multiplied by the rate, before extras.' },
      { term: 'Total', meaning: 'mileage only plus the extras you entered.' },
    ],
    extraFaq: [
      {
        question: 'What is the 2026 IRS business mileage rate?',
        answer:
          'The IRS announced 72.5 cents per mile for business use starting January 1, 2026. That is $0.725 in this calculator. It is optional for tax use, so check the rule that applies to your trip.',
      },
      {
        question: 'Is the GSA 2026 privately owned car rate also 72.5 cents?',
        answer:
          'Yes. GSA lists $0.725 per mile from January 1, 2026 when a privately owned automobile is authorized or no government-furnished automobile is available.',
      },
      {
        question: 'Should parking and tolls go in extras?',
        answer:
          'Only if your employer, client, app, or tax rule lets you add them separately. Some systems include those costs elsewhere, so check before adding them twice.',
      },
    ],
  }),
  makeUtilityTool({
    slug: 'density-calculator',
    name: 'Density Calculator',
    category: 'calculators',
    summary: 'Calculate density from mass and volume with a custom unit label.',
    description:
      'Use this free density calculator to divide mass by volume, show formula steps, and label the density unit for science or planning examples.',
    icon: 'calculator-density',
    formula:
      'The calculator uses density = mass / volume. The mass and volume units should match the density unit you want to read.',
    limit:
      'Use consistent units before calculating. Lab, engineering, and material decisions can require calibrated measurements and official standards.',
    inputExplanations: [
      { term: 'Mass', meaning: 'how much matter the sample has, such as grams, kilograms, pounds, or another mass unit.' },
      { term: 'Volume', meaning: 'how much space the sample takes up, such as mL, L, cm3, ft3, or another volume unit.' },
      { term: 'Unit label', meaning: 'plain text for the answer, like g/mL. The calculator does not convert units inside that label.' },
    ],
    extraFaq: [
      {
        question: 'Why do density units have to match?',
        answer:
          'Density is a ratio. If mass is in grams and volume is in milliliters, the answer is g/mL. If mass is in kilograms and volume is in cubic meters, the answer is kg/m3. Mixing units without converting first makes the label wrong even when the division is correct.',
      },
    ],
    useCases: [
      'Find density from a measured mass and volume.',
      'Check a classroom density formula.',
      'Label results in g/mL, kg/m3, lb/ft3, or another unit.',
      'Compare density with mass and weight tools.',
    ],
    examples: [
      { label: 'Lab sample', expression: '27 g / 10 mL', result: '2.7 g/mL' },
      { label: 'Box material', expression: '15 kg / 2 m3', result: '7.5 kg/m3' },
      { label: 'Liquid', expression: '997 g / 1000 mL', result: '0.997 g/mL' },
    ],
    relatedSlugs: ['mass-calculator', 'weight-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'mass-calculator',
    name: 'Mass Calculator',
    category: 'calculators',
    summary: 'Calculate mass from density and volume with unit-matching reminders.',
    description:
      'Use this free mass calculator to multiply density by volume, label the mass unit, and check exact formula examples for materials or classroom work.',
    seoTitle: 'Mass Calculator | Density x Volume',
    seoDescription:
      'Calculate mass from density and volume with exact examples. Learn when to use a scale, Weight Calculator, or Molecular Weight Calculator instead.',
    icon: 'calculator-mass',
    formula:
      'The calculator uses mass = density x volume. If density is in g/cm3 and volume is in cm3, the result is grams. If density is in kg/m3 and volume is in m3, the result is kilograms.',
    limit:
      'This is a density-and-volume formula helper, not a scale, chemistry molar-mass tool, monoisotopic-mass tool, body-mass calculator, or weight-to-mass converter. Material density, temperature, moisture, and measurement precision can change real mass.',
    inputExplanations: [
      { term: 'Density', meaning: 'mass per volume, such as g/cm3, g/mL, kg/m3, lb/ft3, or a supplier density.' },
      { term: 'Volume', meaning: 'the space the material fills, written in the matching volume unit for the density, such as cm3 when density is g/cm3.' },
      { term: 'Mass unit label', meaning: 'plain text printed beside the answer, such as g, kg, or lb. The calculator does not convert that label.' },
    ],
    extraFaq: [
      {
        question: 'Is this the same as weighing something on a scale?',
        answer:
          'No. This estimates mass from a density value and a volume value. A real scale measures the object directly, while this calculator is only as good as the density and volume you enter.',
      },
      {
        question: 'Can I calculate mass from weight instead?',
        answer:
          'This page does not convert force or scale weight into mass. For physics weight force, use the Weight Calculator, which separates kilograms, newtons, pounds-force, and pounds mass.',
      },
      {
        question: 'Is this a chemistry molar mass or monoisotopic mass calculator?',
        answer:
          'No. This page uses density times volume for physical samples. For chemical formulas, use the Molecular Weight Calculator instead; isotope-exact or monoisotopic mass needs a more specialized chemistry tool.',
      },
      {
        question: 'Why does the unit label matter?',
        answer:
          'The unit label is text only. If you enter 2.7 g/cm3 and 10 cm3, label the answer g because cubic centimeters cancel. If you enter 1600 kg/m3 and 0.5 m3, label the answer kg.',
      },
    ],
    useCases: [
      'Find mass when density and volume are known.',
      'Check science homework that rearranges density formulas.',
      'Estimate material mass before using a physics weight-force calculator.',
      'Compare density, mass, and volume relationships.',
      'Route chemistry molar-mass and monoisotopic-mass searches to the right specialized tool.',
    ],
    examples: [
      { label: 'Aluminum-like sample', expression: '2.7 g/cm3 x 10 cm3', result: '27 g' },
      { label: 'Water-like liquid', expression: '1 g/mL x 250 mL', result: '250 g' },
      { label: 'Bulk material', expression: '1600 kg/m3 x 0.5 m3', result: '800 kg' },
    ],
    relatedSlugs: ['density-calculator', 'volume-calculator', 'weight-calculator', 'molecular-weight-calculator'],
  }),
  makeUtilityTool({
    slug: 'weight-calculator',
    name: 'Weight Calculator',
    category: 'calculators',
    summary: 'Calculate physics weight force from mass and gravity in newtons and pounds-force.',
    description:
      'Use this free weight calculator to estimate physics weight force from mass in kilograms and gravity, with newtons, pounds-force, and mass pounds shown separately.',
    seoTitle: 'Weight Calculator | Mass x Gravity Force',
    seoDescription:
      'Calculate weight force from mass and gravity in newtons and pounds-force. Learn why this physics tool is different from BMI, ideal weight, or body-weight charts.',
    icon: 'calculator-weight',
    formula:
      'The calculator uses weight force = mass x gravity. It multiplies kilograms by m/s2 to get newtons, then converts newtons to pounds-force for comparison. Standard Earth gravity is about 9.80665 m/s2.',
    limit:
      'In everyday speech weight and mass are often mixed. This physics tool is not a BMI, ideal weight, height-weight, age-weight, or safety-rated load calculator.',
    inputExplanations: [
      { term: 'Mass kg', meaning: 'the amount of matter in kilograms. Mass does not change just because gravity changes.' },
      { term: 'Gravity m/s2', meaning: 'the gravitational acceleration at the location you want to model. Earth standard gravity is about 9.80665 m/s2, the Moon is about 1.62 m/s2, and Mars is about 3.71 m/s2.' },
      { term: 'Newtons', meaning: 'the SI force unit used for the main weight-force answer after mass is multiplied by gravity.' },
      { term: 'Pounds-force', meaning: 'a force-unit conversion from newtons. It is not the same idea as pounds of mass on a scale.' },
    ],
    extraFaq: [
      {
        question: 'Why is weight different from mass?',
        answer:
          'Mass is the amount of matter. Weight is the force gravity pulls on that mass. The same 70 kg mass has less weight force on the Moon because lunar gravity is smaller.',
      },
      {
        question: 'Is this a BMI or ideal weight calculator?',
        answer:
          'No. This Weight Calculator is for physics force: mass times gravity. If you want body-weight screening, use the BMI Calculator, Healthy Weight Calculator, or Ideal Weight Calculator instead.',
      },
      {
        question: 'Which gravity value should I enter?',
        answer:
          'Use 9.80665 m/s2 for standard Earth gravity. Use a different value only when you intentionally want another location, such as about 1.62 m/s2 for the Moon or about 3.71 m/s2 for Mars.',
      },
      {
        question: 'Why does the page show pounds-force and pounds mass?',
        answer:
          'Pounds-force is a force conversion from newtons. Pounds mass is a mass conversion from kilograms. They can look similar under standard Earth gravity, but they answer different questions.',
      },
    ],
    useCases: [
      'Calculate force in newtons from mass and gravity.',
      'Compare Earth and Moon gravity examples.',
      'Try a Mars gravity example without changing the object mass.',
      'Convert weight force into pounds-force for context.',
      'Understand why this page is different from BMI, ideal weight, and scale-weight tools.',
    ],
    examples: [
      { label: 'Earth standard', expression: '70 kg x 9.80665 m/s2', result: '686.4655 N, about 154.32 lbf' },
      { label: 'Moon example', expression: '70 kg x 1.62 m/s2', result: '113.4 N, about 25.49 lbf' },
      { label: 'Mars example', expression: '80 kg x 3.71 m/s2', result: '296.8 N, about 66.72 lbf' },
    ],
    relatedSlugs: ['mass-calculator', 'conversion-calculator', 'bmi-calculator', 'ideal-weight-calculator'],
  }),
  makeUtilityTool({
    slug: 'speed-calculator',
    name: 'Speed Calculator',
    category: 'calculators',
    summary: 'Calculate average speed from distance and time in mph, km/h, and m/s.',
    description:
      'Use this free speed calculator to divide distance by travel time and show average speed in miles per hour, kilometers per hour, and meters per second.',
    icon: 'calculator-speed',
    formula:
      'The calculator converts hours, minutes, and seconds into decimal hours, then divides distance by time.',
    limit:
      'This gives average speed over the whole distance. It does not show instant speed, stops, traffic, pace changes, or route conditions.',
    inputExplanations: [
      { term: 'Distance miles', meaning: 'the total distance covered across the whole trip or activity.' },
      { term: 'Hours, minutes, seconds', meaning: 'the full elapsed time for that same distance, including stops if you want whole-trip average speed.' },
      { term: 'Average speed', meaning: 'distance divided by total time, not the fastest speed reached.' },
    ],
    extraFaq: [
      {
        question: 'Why is my average speed lower than my fastest speed?',
        answer:
          'Average speed spreads the whole distance over the whole time. Stops, slower sections, and waiting time all lower the average even if you were moving faster for part of the trip.',
      },
    ],
    useCases: [
      'Find average speed for a drive, run, ride, or race.',
      'Convert the same speed into mph, km/h, and m/s.',
      'Check travel examples where total distance and time are known.',
      'Compare speed with pace and distance tools.',
    ],
    examples: [
      { label: 'Marathon', expression: '26.2 miles in 3h 45m', result: 'About 6.99 mph' },
      { label: 'Drive', expression: '180 miles in 3h', result: '60 mph' },
      { label: 'Sprint', expression: '100 m in 12 seconds', result: 'About 18.64 mph' },
    ],
    relatedSlugs: ['pace-calculator', 'distance-calculator', 'time-calculator'],
  }),
  makeUtilityTool({
    slug: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    category: 'converters',
    summary: 'Convert numbers to Roman numerals and Roman numerals back to numbers.',
    description:
      'Use this free Roman numeral converter to convert 1 through 3,999 into standard Roman numerals or decode standard Roman numerals.',
    icon: 'calculator-roman',
    formula:
      'The converter uses standard subtractive Roman numeral notation, including IV, IX, XL, XC, CD, and CM.',
    limit:
      'This tool supports standard modern Roman numerals from I to MMMCMXCIX. It does not support overline notation for 4,000 and above.',
    useCases: [
      'Convert a year or number into Roman numerals.',
      'Decode a standard Roman numeral into a number.',
      'Check subtractive notation examples.',
      'Create quick labels for outlines, dates, or study notes.',
    ],
    examples: [
      { label: 'Current year', expression: '2026', result: 'MMXXVI' },
      { label: 'Decode', expression: 'MMXXVI', result: '2026' },
      { label: 'Largest supported', expression: '3999', result: 'MMMCMXCIX' },
    ],
    relatedSlugs: ['number-sequence-calculator', 'conversion-calculator', 'day-of-the-week-calculator'],
  }),
  makeUtilityTool({
    slug: 'base64-encode-decode',
    name: 'Base64 Encode / Decode',
    category: 'developer-tools',
    summary: 'Encode UTF-8 text to Base64 or decode Base64 back to text.',
    description:
      'Use this free Base64 encode/decode tool to convert UTF-8 text to Base64, decode Base64 back to readable text, and check padding locally in your browser.',
    aliases: ['Base64 Encoder', 'Base64 Decoder', 'Base64 Converter', 'UTF-8 Base64 Tool'],
    seoTitle: 'Base64 Encode / Decode | UTF-8 Text Tool',
    seoDescription:
      'Encode UTF-8 text to Base64 or decode Base64 back to readable text locally in your browser. Check padding, invalid input, and why Base64 is not encryption.',
    icon: 'calculator-base64',
    formula:
      'Base64 takes bytes, groups them into 6-bit chunks, maps each chunk to the A-Z, a-z, 0-9, +, and / alphabet, and uses = padding when the byte length does not fill the last group. This page encodes text as UTF-8 bytes first and decodes Base64 back to UTF-8 text when the bytes are valid text.',
    limit:
      'Base64 is encoding, not encryption. Anyone can decode it, and invalid Base64 or binary-only bytes may not turn into readable UTF-8 text. Do not paste passwords, API keys, tokens, private files, or sensitive data.',
    inputExplanations: [
      {
        term: 'Mode',
        meaning: 'Choose Encode when you have readable text and want Base64. Choose Decode when you already have Base64 and want readable text.',
      },
      {
        term: 'Input text',
        meaning: 'Paste the exact text or Base64 string you want to convert. Spaces, line breaks, and punctuation count.',
      },
      {
        term: 'UTF-8 text',
        meaning: 'Normal browser text is turned into UTF-8 bytes before Base64 encoding, then decoded back to UTF-8 when possible.',
      },
      {
        term: 'Padding',
        meaning: 'Trailing = characters help finish the last Base64 group when the input byte count is not a perfect fit.',
      },
    ],
    useCases: [
      'Encode a short text value into Base64.',
      'Decode a Base64 string back to readable text.',
      'Check API examples, headers, payloads, and data snippets without pasting real secrets.',
      'Work locally without sending the text to a server.',
    ],
    examples: [
      { label: 'Encode text', expression: 'Hello tools', result: 'SGVsbG8gdG9vbHM=' },
      { label: 'Decode text', expression: 'SGVsbG8gdG9vbHM=', result: 'Hello tools' },
      { label: 'Padding check', expression: 'Hi', result: 'SGk=' },
    ],
    extraFaq: [
      {
        question: 'Is Base64 encryption?',
        answer:
          'No. Base64 only changes bytes into printable text. It does not use a key, and anyone with the Base64 string can decode it back unless the original bytes were already encrypted somewhere else.',
      },
      {
        question: 'Why does Base64 sometimes end with =?',
        answer:
          'The = sign is padding. It fills the final Base64 group when the input byte count does not line up cleanly with the 6-bit chunks Base64 uses.',
      },
      {
        question: 'Why did Base64 decoding fail?',
        answer:
          'Common causes include copied spaces, missing padding, URL-safe Base64 characters, invalid Base64 symbols, or bytes that are valid Base64 but not readable UTF-8 text.',
      },
      {
        question: 'Can I encode passwords, API keys, or tokens here?',
        answer:
          'Do not paste real secrets into any browser tool unless you understand the risk. Base64 does not protect passwords, API keys, tokens, cookies, private files, or authorization headers.',
      },
      {
        question: 'Does this Base64 tool support files?',
        answer:
          'This page is built for text. Binary files need a file-aware encoder with clear size limits, memory behavior, and privacy notes before the result is safe to trust.',
      },
      {
        question: 'What does UTF-8 change in Base64 encoding?',
        answer:
          'Base64 works on bytes, not ideas or letters. UTF-8 is the byte format this page uses before encoding text, so readable text can round-trip back to the same characters when the decoded bytes are valid UTF-8.',
      },
    ],
    relatedSlugs: ['url-encode-decode', 'hex-calculator', 'hash-generator'],
  }),
  makeUtilityTool({
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    category: 'developer-tools',
    summary: 'Percent-encode URL component text or decode percent-encoded text.',
    description:
      'Use this free URL encode/decode tool to percent-encode URL component text, decode percent-encoded values, and choose plus-for-spaces handling for form-style query data.',
    aliases: ['URL Encoder', 'URL Decoder', 'Percent Encoder', 'Percent Decoder', 'Query String Encoder'],
    seoTitle: 'URL Encode / Decode | Percent Encoding Tool',
    seoDescription:
      'Encode URL component text, decode percent-encoded strings, compare %20 versus plus spaces, and avoid common full-URL and double-encoding mistakes.',
    icon: 'calculator-url',
    formula:
      'The tool uses percent-encoding for URL components. Unsafe or reserved characters are converted to UTF-8 bytes, then each byte is written as a percent sign followed by two hexadecimal digits. Spaces can stay as %20 or become + when form-style plus-spaces mode is selected.',
    limit:
      'Encode complete URLs and individual URL components differently. This tool is best for component values such as query parameters, path pieces, and small text snippets, not for blindly encoding an entire URL, secret token, or already-encoded string.',
    inputExplanations: [
      {
        term: 'Mode',
        meaning: 'Choose Encode when you have readable text and want percent-encoded output. Choose Decode when you already have percent-encoded text.',
      },
      {
        term: 'Input text',
        meaning: 'Paste the exact value you want to convert. Ampersands, equals signs, spaces, slashes, and punctuation can change how a URL is read.',
      },
      {
        term: 'Plus-spaces',
        meaning: 'Turn this on for form-style query values where spaces are represented as + instead of %20.',
      },
      {
        term: 'Component value',
        meaning: 'A query value like price=10&tax=2 should be encoded differently from a complete URL such as https://example.com/?q=test.',
      },
    ],
    useCases: [
      'Encode a query value that contains &, =, spaces, or punctuation.',
      'Decode percent-encoded text back into readable text.',
      'Handle plus signs as spaces for form-style values.',
      'Check developer examples locally in the browser.',
    ],
    examples: [
      { label: 'Encode query value', expression: 'price=10&tax=2', result: 'price%3D10%26tax%3D2' },
      { label: 'Decode query value', expression: 'price%3D10%26tax%3D2', result: 'price=10&tax=2' },
      { label: 'Space handling', expression: 'hello tools', result: 'hello%20tools or hello+tools in plus mode' },
    ],
    extraFaq: [
      {
        question: 'Should I encode a whole URL or just one part?',
        answer:
          'Usually encode only the part you are inserting, such as a query value or path segment. Encoding a whole URL can turn ://, ?, &, and = into text, which may stop the URL from working.',
      },
      {
        question: 'Why do spaces sometimes become %20 and sometimes +?',
        answer:
          '%20 is normal percent-encoding for a space. A plus sign is common in form-style query strings. Use plus-spaces only when the target system expects form-style values.',
      },
      {
        question: 'What happens if I encode something twice?',
        answer:
          'Double-encoding changes percent signs too. For example, %20 can become %2520. Decode once and inspect the result before encoding again.',
      },
      {
        question: 'Why did decoding fail or look strange?',
        answer:
          'Common causes include a broken percent triplet, copied whitespace, text that was not URL-encoded, or a plus sign that should stay as + instead of becoming a space.',
      },
      {
        question: 'Can I paste login links, tokens, or private query strings?',
        answer:
          'Do not paste real secrets, access tokens, signed URLs, private query strings, or session links into any tool unless you fully understand the risk. Encoding does not make them safe.',
      },
      {
        question: 'Is URL encoding the same as Base64?',
        answer:
          'No. URL encoding protects characters so they can travel inside URLs. Base64 changes bytes into printable text for a different set of use cases.',
      },
    ],
    relatedSlugs: ['utm-builder', 'subnet-calculator', 'hex-calculator'],
  }),
  makeUtilityTool({
    slug: 'day-of-the-week-calculator',
    name: 'Day of the Week Calculator',
    category: 'date-time',
    summary: 'Find the weekday name and ISO weekday number for a calendar date.',
    description:
      'Use this free day of the week calculator to find whether a date falls on Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday.',
    icon: 'calculator-day-of-week',
    formula:
      'The calculator reads the date as a UTC calendar date and returns the weekday name, Sunday-based index, and ISO weekday number.',
    limit:
      'This uses calendar-date math only. Historical calendars, local calendar reforms, and time-zone-specific date changes can require specialized references.',
    useCases: [
      'Find the weekday for a birthday, deadline, holiday, or event date.',
      'Check ISO weekday numbers for scheduling notes.',
      'Compare leap-day and future date examples.',
      'Use date-only math without time-of-day confusion.',
    ],
    examples: [
      { label: 'Today', expression: '2026-04-30', result: 'Thursday' },
      { label: 'New Year 2027', expression: '2027-01-01', result: 'Friday' },
      { label: 'Leap day', expression: '2024-02-29', result: 'Thursday' },
    ],
    relatedSlugs: ['date-calculator', 'age-calculator', 'time-zone-calculator'],
  }),
  makeUtilityTool({
    slug: 'height-calculator',
    name: 'Height Calculator',
    category: 'health-fitness',
    summary: 'Estimate adult height from parent heights with a rough expected range.',
    description:
      'Use this free height calculator to estimate adult height from mother and father heights using a mid-parental height method and a clear rough range.',
    icon: 'calculator-height',
    aliases: ['Child Height Calculator', 'Adult Height Predictor', 'Mid-Parental Height Calculator'],
    seoTitle: 'Height Calculator | Child Adult Height Estimate',
    seoDescription:
      'Estimate child adult height from parent heights. See the mid-parental formula, feet/inches result, centimeter value, and rough 4-inch range.',
    formula:
      'The calculator converts both parent heights to inches. For a male estimate it adds 5 inches to the parent-height total before dividing by 2. For a female estimate it subtracts 5 inches before dividing by 2.',
    limit:
      'This is only a family-height estimate. Nutrition, health, puberty timing, genetics, and medical conditions can change growth.',
    faqLanguage: {
      expectedInputs: 'the child estimate type and both parent heights in feet plus extra inches',
      inputFallback:
        'Choose the child estimate type, then enter the mother and father heights as feet plus extra inches. Do not enter 5.8 when you mean 5 ft 8 in.',
      examplePhrase: 'parent-height example',
      doubleCheck:
        'Also check child estimate type, mother height, father height, feet, extra inches, and whether you need a growth chart instead of a rough family estimate.',
    },
    inputExplanations: [
      { term: 'Child estimate', meaning: 'the formula path for a male or female adult-height estimate.' },
      { term: 'Mother feet and extra inches', meaning: 'the mother height split into whole feet and leftover inches.' },
      { term: 'Father feet and extra inches', meaning: 'the father height split into whole feet and leftover inches.' },
      { term: 'Approximate range', meaning: 'the estimate plus or minus 4 inches, because real adult height can land above or below the midpoint.' },
    ],
    extraFaq: [
      {
        question: 'How should I read the Height Calculator answer?',
        answer:
          'Read the rounded feet-and-inches estimate first, then the centimeter value, then the rough plus-or-minus range. The range matters because real adult height can finish above or below the midpoint.',
      },
      {
        question: 'Is this the same as a growth chart?',
        answer:
          'No. This calculator only uses parent heights. A growth chart uses a child age, sex, height, weight, and past measurements to see how growth is tracking over time.',
      },
      {
        question: 'Why is there a plus-or-minus 4 inch range?',
        answer:
          'Mid-parental height is a rough target, not a promise. Pediatric references often use about 4 inches on each side as a target range because children can finish taller or shorter than the midpoint.',
      },
      {
        question: 'Can this predict height exactly?',
        answer:
          'No. It is a quick estimate from family heights only. Puberty timing, nutrition, health, genetics, and measurement error can all change the final adult height.',
      },
      {
        question: 'Why does the calculator ask for feet and extra inches?',
        answer:
          'It keeps mixed units clear. Enter 5 feet and 8 extra inches as 5 and 8, not 5.8, because 5.8 feet is a different number.',
      },
      {
        question: 'When should I ask a healthcare professional?',
        answer:
          'Ask a clinician if a child is crossing growth-chart lines, is much shorter or taller than expected, has puberty concerns, or if you are worried about nutrition, illness, or growth timing.',
      },
    ],
    useCases: [
      'Estimate a child adult height from parent heights.',
      'Compare the result in feet, inches, and centimeters.',
      'See an approximate plus-or-minus range instead of one exact promise.',
      'Understand why growth estimates are not medical predictions.',
    ],
    examples: [
      { label: 'Boy estimate', expression: 'Mother 5 ft 4 in, father 5 ft 10 in', result: 'About 5 ft 10 in' },
      { label: 'Girl estimate', expression: 'Mother 5 ft 3 in, father 6 ft 0 in', result: 'About 5 ft 5 in' },
      { label: 'Centimeter output', expression: 'Mother 5 ft 4 in, father 5 ft 10 in', result: 'About 176.5 cm' },
    ],
    relatedSlugs: ['healthy-weight-calculator', 'ideal-weight-calculator', 'bmi-calculator'],
  }),
  makeUtilityTool({
    slug: 'bra-size-calculator',
    name: 'Bra Size Calculator',
    category: 'everyday-tools',
    summary: 'Estimate a starting bra band and cup size from bust and underbust measurements.',
    description:
      'Use this free bra size calculator to estimate a US-style starting bra size from underbust and bust measurements in inches.',
    icon: 'calculator-bra-size',
    formula:
      'The calculator rounds underbust up to an even band size, subtracts band size from bust size, and maps the difference to an approximate cup label.',
    limit:
      'Bra sizing varies by brand, body shape, country, and style. Use this as a fitting starting point, not a guaranteed size.',
    useCases: [
      'Get a quick starting size before checking brand charts.',
      'Understand the difference between band size and cup difference.',
      'Compare nearby sizes before trying bras on.',
      'Avoid treating a single measurement as a final fit answer.',
    ],
    examples: [
      { label: 'Simple estimate', expression: '32 in underbust, 36 in bust', result: 'About 32D' },
      { label: 'Rounded band', expression: '33 in underbust, 36 in bust', result: 'About 34B' },
      { label: 'Cup difference', expression: '34 in underbust, 39 in bust', result: 'Starting size estimate' },
    ],
    relatedSlugs: ['body-type-calculator', 'body-surface-area-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'voltage-drop-calculator',
    name: 'Voltage Drop Calculator',
    category: 'calculators',
    summary: 'Estimate voltage drop from current, wire length, voltage, phase, and copper AWG size.',
    description:
      'Use this free voltage drop calculator to estimate voltage drop, percent drop, and load voltage for simple copper wire runs.',
    icon: 'calculator-voltage-drop',
    formula:
      'The calculator multiplies current by conductor resistance and one-way length. Single-phase/DC uses a 2x path factor; three-phase uses the square root of 3.',
    limit:
      'This is a simplified planning estimate. Real electrical work needs code checks, conductor temperature, material, installation method, and a qualified professional.',
    inputExplanations: [
      { term: 'Source voltage', meaning: 'the voltage at the supply side before the wire run loses voltage.' },
      { term: 'Current amps', meaning: 'the load current flowing through the conductor.' },
      { term: 'One-way length', meaning: 'the distance from source to load. The calculator applies the circuit-path factor for the selected phase.' },
      { term: 'Copper wire size', meaning: 'the AWG size used to look up approximate copper resistance.' },
    ],
    extraFaq: [
      {
        question: 'Why does circuit type change voltage drop?',
        answer:
          'A simple single-phase or DC run uses an out-and-back path, so the length factor is 2. A balanced three-phase estimate uses the square root of 3. Real installations can need more detailed impedance and code checks.',
      },
    ],
    useCases: [
      'Estimate voltage drop for a branch circuit run.',
      'Compare common copper AWG wire sizes.',
      'Check percent voltage drop from source voltage.',
      'See load voltage after the estimated drop.',
    ],
    examples: [
      { label: 'Branch run', expression: '120 V, 15 A, 75 ft, 12 AWG copper', result: 'Voltage drop estimate' },
      { label: 'Longer 240 V run', expression: '240 V, 30 A, 100 ft, 8 AWG copper', result: 'Percent drop estimate' },
      { label: 'Three-phase run', expression: '208 V, 20 A, 150 ft, 6 AWG copper', result: 'Load voltage estimate' },
    ],
    relatedSlugs: ['watts-to-amps-calculator', 'ohms-law-calculator', 'electricity-calculator', 'resistor-calculator'],
  }),
  makeUtilityTool({
    slug: 'watts-to-amps-calculator',
    name: 'Watts to Amps Calculator',
    category: 'calculators',
    summary: 'Convert watts to amps with voltage, phase type, and power factor.',
    description:
      'Use this free watts to amps calculator to estimate current draw from real power, supply voltage, phase type, and power factor.',
    seoTitle: 'Watts to Amps Calculator | W to A Current Estimate',
    seoDescription:
      'Convert watts to amps for DC, single-phase AC, and three-phase AC loads with voltage, power factor, formula steps, examples, and safety limits.',
    icon: 'calculator-watts-to-amps',
    aliases: [
      'W to A Calculator',
      'Watts to Amperes Calculator',
      'Current Draw Calculator',
      'Electrical Watts to Amps Calculator',
    ],
    formula:
      'For DC and single-phase AC, amps = watts / (volts x power factor). For three-phase AC, amps = watts / (volts x sqrt(3) x power factor).',
    limit:
      'This is formula math for learning and planning. Real electrical work needs the equipment nameplate, correct voltage, power factor, breaker, wire, code rules, and qualified review.',
    inputExplanations: [
      { term: 'Watts', meaning: 'real power used by the device or load.' },
      { term: 'Volts', meaning: 'the supply voltage feeding the load.' },
      { term: 'Phase', meaning: 'DC, single-phase AC, or three-phase AC changes the current formula.' },
      { term: 'Power factor', meaning: 'how efficiently AC current becomes real power. Use 1 for DC or resistive loads.' },
    ],
    extraFaq: [
      {
        question: 'Why does power factor matter?',
        answer:
          'Power factor matters for AC loads because not every amp becomes useful real power. A motor with 0.8 power factor needs more current than a resistive load using the same watts and volts.',
      },
      {
        question: 'Can I use this to choose a breaker size?',
        answer:
          'No. This helps you understand the math, but breaker and wire choices need code rules, equipment instructions, continuous-load rules, temperature, and qualified electrical review.',
      },
      {
        question: 'What formula should I use for three-phase watts to amps?',
        answer:
          'Use amps = watts / (volts x 1.732 x power factor). The 1.732 is the square root of 3, which is part of the three-phase power formula.',
      },
      {
        question: 'Should I use rated watts or starting watts?',
        answer:
          'Use the value that matches your question. Rated watts estimate normal running current. Starting watts or motor inrush can be much higher, so do not use this simple result as a final safety decision.',
      },
    ],
    useCases: [
      'Estimate current from a device watt rating.',
      'Compare 12 V DC, 120 V single-phase, 240 V single-phase, and 208 V three-phase examples.',
      'Understand why AC power factor changes the amp estimate.',
      'Check rough load math before using detailed tools such as voltage drop or Ohm\'s law.',
      'Read appliance or equipment labels more carefully before asking for qualified electrical help.',
    ],
    examples: [
      { label: '120 V heater', expression: '1,500 W, 120 V, power factor 1', result: '12.5 A' },
      { label: 'Single-phase motor', expression: '2,200 W, 240 V, PF 0.9', result: 'About 10.19 A' },
      { label: 'Three-phase load', expression: '5,000 W, 208 V, PF 0.85', result: 'About 16.34 A' },
      { label: '12 V DC device', expression: '60 W, 12 V, PF 1', result: '5 A' },
    ],
    relatedSlugs: ['amps-to-watts-calculator', 'voltage-drop-calculator', 'ohms-law-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'amps-to-watts-calculator',
    name: 'Amps to Watts Calculator',
    category: 'calculators',
    summary: 'Convert amps to watts for DC, single-phase AC, and three-phase AC loads.',
    description:
      'Use this free amps to watts calculator to estimate power from current, voltage, phase type, and power factor.',
    icon: 'calculator-amps-to-watts',
    formula:
      'The calculator multiplies amps by volts for DC/single-phase loads, or by volts x sqrt(3) for three-phase loads, then includes power factor.',
    limit:
      'This is a simplified electrical estimate. Use rated equipment data and qualified advice before sizing circuits or parts.',
    inputExplanations: [
      { term: 'Amps', meaning: 'current drawn by the device or circuit.' },
      { term: 'Volts', meaning: 'supply voltage.' },
      { term: 'Phase', meaning: 'DC, single-phase AC, or three-phase AC formula selection.' },
      { term: 'Power factor', meaning: 'AC correction factor used to estimate real watts.' },
    ],
    extraFaq: [
      {
        question: 'Is amps to watts always amps times volts?',
        answer:
          'For DC and simple single-phase estimates, watts are amps times volts, then power factor for AC. Three-phase estimates also multiply by the square root of 3.',
      },
      {
        question: 'Why does the same amperage give different watts?',
        answer:
          'Voltage, phase, and power factor all change the answer. Ten amps at 12 volts is very different from ten amps at 240 volts or 480 volt three-phase service.',
      },
    ],
    useCases: [
      'Estimate watts from a current draw.',
      'Convert a circuit amp value into rough power.',
      'Compare single-phase and three-phase examples.',
      'Understand when power factor changes AC watts.',
    ],
    examples: [
      { label: '120 V load', expression: '12.5 A, 120 V, PF 1', result: '1,500 W' },
      { label: 'Single-phase AC', expression: '10 A, 240 V, PF 0.9', result: '2,160 W' },
      { label: 'Three-phase AC', expression: '20 A, 208 V, PF 0.85', result: 'About 6,124 W' },
    ],
    relatedSlugs: ['watts-to-amps-calculator', 'ohms-law-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'kilowatts-to-amps-calculator',
    name: 'Kilowatts to Amps Calculator',
    category: 'calculators',
    summary: 'Convert kilowatts to amps with voltage, phase, power factor, and efficiency.',
    description:
      'Use this free kilowatts to amps calculator to estimate current for DC, single-phase AC, and three-phase AC loads.',
    icon: 'calculator-kw-to-amps',
    formula:
      'The calculator converts kW to watts, adjusts for efficiency, then divides by voltage, phase factor, and power factor.',
    limit:
      'Motors and AC equipment can behave differently while starting. Use equipment nameplates and professional electrical sizing for real installs.',
    inputExplanations: [
      { term: 'Kilowatts', meaning: 'real power in thousands of watts.' },
      { term: 'Voltage', meaning: 'the supply voltage for the load.' },
      { term: 'Power factor', meaning: 'AC correction factor for real power versus apparent power.' },
      { term: 'Efficiency', meaning: 'how much input power becomes useful output power.' },
    ],
    extraFaq: [
      {
        question: 'Why does the calculator ask for efficiency?',
        answer:
          'If kW describes output power, the equipment may need more input power because of losses. Lower efficiency increases the estimated input watts and therefore the amps.',
      },
      {
        question: 'Should I use kW or kVA?',
        answer:
          'Use kW when you know real power. Use the kVA to Amps Calculator when the rating is apparent power, such as many transformer or UPS ratings.',
      },
    ],
    useCases: [
      'Estimate current for a kW-rated load.',
      'Include simple motor efficiency and power factor assumptions.',
      'Compare DC, single-phase, and three-phase examples.',
      'Convert larger power ratings into current for planning conversation.',
    ],
    examples: [
      { label: 'Motor estimate', expression: '5 kW, 240 V, PF 0.9, 90% efficiency', result: 'About 25.72 A' },
      { label: 'Three-phase load', expression: '15 kW, 480 V, PF 0.88, 92% efficiency', result: 'About 22.27 A' },
      { label: '48 V DC equipment', expression: '1.2 kW, 48 V', result: '25 A' },
    ],
    relatedSlugs: ['watts-to-amps-calculator', 'kva-to-amps-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'kva-to-amps-calculator',
    name: 'kVA to Amps Calculator',
    category: 'calculators',
    summary: 'Convert apparent power in kVA to amps for single-phase or three-phase systems.',
    description:
      'Use this free kVA to amps calculator to estimate current from kilovolt-amps, voltage, and phase type.',
    icon: 'calculator-kva-to-amps',
    formula:
      'The calculator converts kVA to volt-amps, then divides by volts for single-phase or by volts x sqrt(3) for three-phase.',
    limit:
      'kVA is apparent power. Transformer, UPS, breaker, and conductor sizing still need equipment instructions and qualified review.',
    inputExplanations: [
      { term: 'kVA', meaning: 'apparent power in kilovolt-amps.' },
      { term: 'Volts', meaning: 'the equipment voltage used in the current calculation.' },
      { term: 'Phase', meaning: 'single-phase or three-phase formula selection.' },
    ],
    extraFaq: [
      {
        question: 'Why is there no power factor field?',
        answer:
          'kVA is already apparent power. Power factor is used when converting between real power in kW and apparent power in kVA, not when turning kVA directly into amps.',
      },
      {
        question: 'Is kVA the same as kW?',
        answer:
          'Not always. kW is real power and kVA is apparent power. They match only when power factor is 1, which is not true for many AC loads.',
      },
    ],
    useCases: [
      'Estimate transformer or UPS current from a kVA rating.',
      'Compare single-phase and three-phase current.',
      'Understand apparent power separately from real power.',
      'Check a rough current number before professional equipment sizing.',
    ],
    examples: [
      { label: 'Single-phase equipment', expression: '25 kVA, 220 V', result: 'About 113.64 A' },
      { label: 'Three-phase transformer', expression: '75 kVA, 480 V', result: 'About 90.21 A' },
      { label: 'Small UPS', expression: '3 kVA, 120 V', result: '25 A' },
    ],
    relatedSlugs: ['kilowatts-to-amps-calculator', 'watts-to-amps-calculator', 'voltage-drop-calculator'],
  }),
  makeUtilityTool({
    slug: 'amp-hours-to-watt-hours-calculator',
    name: 'Amp Hours to Watt Hours Calculator',
    category: 'calculators',
    summary: 'Convert battery amp-hours and voltage into watt-hours and kilowatt-hours.',
    description:
      'Use this free amp hours to watt hours calculator to estimate battery energy from Ah and nominal voltage.',
    icon: 'calculator-ah-to-wh',
    formula: 'The calculator multiplies amp-hours by volts to estimate watt-hours, then divides by 1,000 for kilowatt-hours.',
    limit:
      'Battery labels are nominal. Real usable energy changes with chemistry, discharge rate, temperature, age, and conversion losses.',
    inputExplanations: [
      { term: 'Amp-hours', meaning: 'battery capacity rating at the listed voltage.' },
      { term: 'Volts', meaning: 'nominal battery voltage.' },
      { term: 'Watt-hours', meaning: 'energy estimate that is easier to compare across different voltages.' },
    ],
    extraFaq: [
      {
        question: 'Why are watt-hours better for comparing batteries?',
        answer:
          'Amp-hours depend on voltage. A 100 Ah 12 V battery stores about 1,200 Wh, while a 100 Ah 48 V battery stores about 4,800 Wh.',
      },
      {
        question: 'Does this tell me runtime?',
        answer:
          'It gives stored energy before real losses. Use a battery-life or electricity tool when you also know the device watts and expected efficiency.',
      },
    ],
    useCases: [
      'Convert battery Ah labels into watt-hours.',
      'Compare batteries with different voltages.',
      'Estimate kWh for larger battery packs.',
      'Prepare inputs for battery runtime planning.',
    ],
    examples: [
      { label: '12 V battery', expression: '300 Ah at 12 V', result: '3,600 Wh' },
      { label: '48 V pack', expression: '100 Ah at 48 V', result: '4,800 Wh' },
      { label: 'Small 24 V pack', expression: '20 Ah at 24 V', result: '480 Wh' },
    ],
    relatedSlugs: ['watt-hours-to-amp-hours-calculator', 'device-battery-life-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'watt-hours-to-amp-hours-calculator',
    name: 'Watt Hours to Amp Hours Calculator',
    category: 'calculators',
    summary: 'Convert battery watt-hours into amp-hours at a selected voltage.',
    description:
      'Use this free watt hours to amp hours calculator to convert stored energy into Ah at the battery voltage you choose.',
    icon: 'calculator-wh-to-ah',
    formula: 'The calculator divides watt-hours by volts to estimate amp-hours.',
    limit:
      'Amp-hour ratings depend on voltage. Real usable capacity also changes with discharge rate, temperature, age, and conversion losses.',
    inputExplanations: [
      { term: 'Watt-hours', meaning: 'energy capacity of the battery or power station.' },
      { term: 'Volts', meaning: 'nominal voltage used to convert energy into amp-hours.' },
      { term: 'Amp-hours', meaning: 'capacity estimate at the selected voltage.' },
    ],
    extraFaq: [
      {
        question: 'Why does voltage change amp-hours?',
        answer:
          'Amp-hours measure charge capacity at a voltage. The same watt-hours divided by a higher voltage gives fewer amp-hours, even though the energy can be the same.',
      },
      {
        question: 'Can I compare two batteries by amp-hours only?',
        answer:
          'Only when the voltage is the same. For different battery voltages, compare watt-hours because it describes stored energy more directly.',
      },
    ],
    useCases: [
      'Convert a Wh-rated power station into Ah.',
      'Compare energy capacity at 12 V, 24 V, or 48 V.',
      'Understand why Ah labels change with voltage.',
      'Prepare battery numbers for runtime estimates.',
    ],
    examples: [
      { label: 'Power station', expression: '5,000 Wh at 120 V', result: 'About 41.67 Ah' },
      { label: '48 V battery', expression: '4,800 Wh at 48 V', result: '100 Ah' },
      { label: '12 V battery', expression: '1,200 Wh at 12 V', result: '100 Ah' },
    ],
    relatedSlugs: ['amp-hours-to-watt-hours-calculator', 'device-battery-life-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'wire-resistance-calculator',
    name: 'Wire Resistance Calculator',
    category: 'calculators',
    summary: 'Estimate copper wire resistance from AWG size, length, and conductor count.',
    description:
      'Use this free wire resistance calculator to estimate total ohms for common copper AWG wire sizes and lengths.',
    icon: 'calculator-wire-resistance',
    formula:
      'The calculator scales the copper ohms-per-1,000-feet value by wire length and multiplies by the number of conductor lengths included.',
    limit:
      'This is a simplified copper resistance estimate. Temperature, strand type, material, connections, and code rules can change real behavior.',
    inputExplanations: [
      { term: 'Copper wire size', meaning: 'AWG size used to look up approximate resistance.' },
      { term: 'One-way length', meaning: 'the conductor length in feet before multiplying by conductor count.' },
      { term: 'Conductor count', meaning: 'how many conductor lengths are included in the total resistance.' },
    ],
    extraFaq: [
      {
        question: 'Why is conductor count usually 2?',
        answer:
          'A simple circuit usually has an out path and a return path. If each path is the same length, using conductor count 2 estimates the loop resistance.',
      },
      {
        question: 'Does wire resistance change with temperature?',
        answer:
          'Yes. Copper resistance changes with temperature, and real installations also involve terminations, material, raceway, and code rules. This tool keeps the estimate simple.',
      },
    ],
    useCases: [
      'Estimate loop resistance for common copper AWG sizes.',
      'Compare how thicker wire lowers resistance.',
      'Prepare a resistance value for voltage-drop thinking.',
      'Learn why length matters in electrical runs.',
    ],
    examples: [
      { label: '12 AWG loop', expression: '12 AWG, 100 ft, conductor count 2', result: 'About 0.3176 ohms' },
      { label: '8 AWG long run', expression: '8 AWG, 150 ft, conductor count 2', result: 'Resistance estimate' },
      { label: 'One conductor', expression: '10 AWG, 50 ft, conductor count 1', result: 'One-way resistance estimate' },
    ],
    relatedSlugs: ['wire-size-calculator', 'voltage-drop-calculator', 'ohms-law-calculator'],
  }),
  makeUtilityTool({
    slug: 'wire-size-calculator',
    name: 'Wire Size Calculator',
    category: 'calculators',
    summary: 'Estimate a copper AWG size from current, length, voltage, phase, and voltage-drop target.',
    description:
      'Use this free wire size calculator to estimate a common copper AWG size that stays within a chosen voltage-drop percentage.',
    icon: 'calculator-wire-size',
    formula:
      'The calculator tests common copper AWG sizes and returns the first size whose estimated voltage drop is within the selected percentage.',
    limit:
      'This is not a code-complete wire sizing tool. Ampacity, insulation rating, terminals, raceway, temperature, material, and local code must be checked separately.',
    inputExplanations: [
      { term: 'Source voltage', meaning: 'voltage before the wire run loses voltage.' },
      { term: 'Current amps', meaning: 'load current for the voltage-drop estimate.' },
      { term: 'One-way length', meaning: 'distance from source to load.' },
      { term: 'Max voltage drop', meaning: 'the target percentage the estimate tries to stay under.' },
    ],
    extraFaq: [
      {
        question: 'Is this the same as an electrical code wire-size chart?',
        answer:
          'No. This estimates voltage drop only. Real wire sizing also needs ampacity, conductor insulation, raceway fill, terminals, temperature, material, and local code rules.',
      },
      {
        question: 'Why can a long run need a larger wire?',
        answer:
          'Longer wire has more resistance. More resistance causes more voltage drop, so increasing wire size can reduce the estimated voltage lost along the run.',
      },
    ],
    useCases: [
      'Estimate copper AWG size for a voltage-drop target.',
      'Compare branch-circuit and longer-run examples.',
      'See estimated voltage drop and load voltage together.',
      'Learn why current and length affect conductor choice.',
    ],
    examples: [
      { label: '120 V branch', expression: '120 V, 15 A, 75 ft, max 3%', result: '12 AWG copper estimate' },
      { label: '240 V run', expression: '240 V, 30 A, 100 ft, max 3%', result: 'Estimated AWG size' },
      { label: 'Three-phase run', expression: '208 V, 20 A, 150 ft, max 3%', result: 'Estimated AWG size' },
    ],
    relatedSlugs: ['wire-resistance-calculator', 'voltage-drop-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'btu-calculator',
    name: 'BTU Calculator',
    category: 'everyday-tools',
    summary: 'Estimate room air conditioner BTU capacity from room size and simple adjustments.',
    description:
      'Use this free BTU calculator to estimate room cooling capacity from square feet, ceiling height, sunlight, people, and kitchen heat load.',
    icon: 'calculator-btu',
    formula:
      'The calculator starts with a room-size BTU table, adjusts for ceiling height, sunlight, extra people, and kitchen heat, then rounds to a practical BTU amount.',
    limit:
      'This is a room AC shopping estimate, not a full HVAC load calculation. Insulation, climate, windows, ducts, and humidity matter.',
    inputExplanations: [
      { term: 'Room square feet', meaning: 'the floor area of the room you want to cool.' },
      { term: 'Ceiling height', meaning: 'the room height. Taller rooms have more air volume than a normal 8-foot room.' },
      { term: 'Sunlight', meaning: 'whether the room is normally shaded, average, or sunny.' },
      { term: 'Kitchen heat load', meaning: 'extra cooling demand from cooking appliances and kitchen heat.' },
    ],
    extraFaq: [
      {
        question: 'Why is a bigger BTU number not always better?',
        answer:
          'An oversized room air conditioner can cool the air quickly but cycle off before removing enough humidity. That can make the room feel cold and clammy instead of comfortable.',
      },
    ],
    useCases: [
      'Estimate a window or room air conditioner size.',
      'Adjust for sunny or shaded rooms.',
      'Account for extra people and kitchen heat.',
      'Avoid buying a unit that is wildly under- or oversized.',
    ],
    examples: [
      { label: 'Bedroom', expression: '180 ft2, 8 ft ceiling', result: 'Approximate room BTU' },
      { label: 'Sunny room', expression: '420 ft2, 9 ft ceiling, sunny, 3 people', result: 'Adjusted BTU estimate' },
      { label: 'Kitchen area', expression: '300 ft2, kitchen heat selected', result: 'Higher BTU estimate' },
    ],
    relatedSlugs: ['square-footage-calculator', 'electricity-calculator', 'area-calculator'],
  }),
  makeUtilityTool({
    slug: 'stair-calculator',
    name: 'Stair Calculator',
    category: 'calculators',
    summary: 'Estimate risers, treads, stair run, and angle from total rise and tread depth.',
    description:
      'Use this free stair calculator to estimate riser count, actual riser height, tread count, total run, and stair angle for a simple stair layout.',
    icon: 'calculator-stair',
    formula:
      'The calculator divides total rise by target riser height, rounds to a whole riser count, then calculates actual riser height and run from tread depth.',
    limit:
      'Stairs are safety critical. Check local building code, uniformity, headroom, landings, handrails, and professional requirements before building.',
    inputExplanations: [
      { term: 'Total rise', meaning: 'the vertical distance from the lower finished floor to the upper finished floor.' },
      { term: 'Target riser', meaning: 'the step height you are aiming for before the calculator rounds to a whole number of risers.' },
      { term: 'Tread depth', meaning: 'the horizontal walking depth of each tread used to estimate total run and angle.' },
    ],
    extraFaq: [
      {
        question: 'Why can stair math not replace building code?',
        answer:
          'Stairs affect safety every time someone uses them. Code rules can cover riser limits, tread depth, uniformity, landings, headroom, handrails, guardrails, and local inspection requirements.',
      },
    ],
    useCases: [
      'Estimate a simple straight stair layout.',
      'Find actual riser height after rounding to a whole step count.',
      'Estimate total horizontal run.',
      'Check the stair angle for planning conversation.',
    ],
    examples: [
      { label: 'Basement rise', expression: '108 in rise, 7.5 in target riser, 10 in tread', result: '14 risers' },
      { label: 'Deck rise', expression: '36 in rise, 7 in target riser, 11 in tread', result: 'Simple stair estimate' },
      { label: 'Tall rise', expression: '144 in rise, 7.75 in target riser, 10.5 in tread', result: 'Riser and run estimate' },
    ],
    relatedSlugs: ['slope-calculator', 'right-triangle-calculator', 'distance-calculator'],
  }),
  makeUtilityTool({
    slug: 'resistor-calculator',
    name: 'Resistor Calculator',
    category: 'calculators',
    summary: 'Decode 4-band resistor color codes into ohms and tolerance range.',
    description:
      'Use this free resistor calculator to convert common 4-band resistor color codes into resistance, tolerance, minimum, and maximum values.',
    icon: 'calculator-resistor',
    formula:
      'The first two bands are digits, the third band is a multiplier, and the fourth band gives tolerance percentage.',
    limit:
      'Use a multimeter and circuit safety practices for real parts. Color bands can be faded, damaged, or read in the wrong direction.',
    inputExplanations: [
      { term: 'First and second digit bands', meaning: 'the first two significant digits of a common 4-band resistor.' },
      { term: 'Multiplier band', meaning: 'the power-of-ten multiplier that scales the first two digits.' },
      { term: 'Tolerance band', meaning: 'the expected manufacturing range around the nominal resistance.' },
    ],
    extraFaq: [
      {
        question: 'What does resistor tolerance mean?',
        answer:
          'Tolerance says how far the real part may be from the printed value. A 1,000 ohm resistor with +/- 5% tolerance may be roughly 950 to 1,050 ohms and still match its rating.',
      },
    ],
    useCases: [
      'Decode a common 4-band resistor.',
      'See the tolerance range around the nominal resistance.',
      'Check a breadboard or electronics study example.',
      'Compare resistor values before using Ohm law.',
    ],
    examples: [
      { label: '1 kOhm', expression: 'brown black red gold', result: '1,000 ohms +/- 5%' },
      { label: '4.7 kOhm', expression: 'yellow violet red gold', result: '4,700 ohms +/- 5%' },
      { label: '220 ohm', expression: 'red red brown gold', result: '220 ohms +/- 5%' },
    ],
    relatedSlugs: ['ohms-law-calculator', 'voltage-drop-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'ohms-law-calculator',
    name: 'Ohms Law Calculator',
    category: 'calculators',
    summary: 'Solve voltage, current, resistance, and power from two known circuit values.',
    description:
      'Use this free Ohms law calculator to solve V, I, R, and P from common voltage-current-resistance pairs.',
    icon: 'calculator-ohms-law',
    formula:
      'The calculator uses V = I x R and P = V x I after the missing voltage, current, or resistance value is solved.',
    limit:
      'This is simple DC or resistive-circuit math. AC circuits, impedance, heat, component ratings, and electrical safety require more care.',
    inputExplanations: [
      { term: 'Voltage V', meaning: 'electrical potential difference, measured in volts.' },
      { term: 'Current A', meaning: 'electrical flow through the circuit, measured in amps.' },
      { term: 'Resistance ohms', meaning: 'how much the component or circuit resists current flow.' },
      { term: 'Power W', meaning: 'energy rate, calculated after voltage and current are known.' },
    ],
    extraFaq: [
      {
        question: 'Why do I only enter two values?',
        answer:
          'Ohm law connects voltage, current, and resistance. If you know any valid pair, the calculator can solve the missing core value and then calculate power from voltage times current.',
      },
    ],
    useCases: [
      'Find resistance from voltage and current.',
      'Find current from voltage and resistance.',
      'Find voltage from current and resistance.',
      'Estimate power after the core values are known.',
    ],
    examples: [
      { label: 'Voltage and current', expression: '12 V and 2 A', result: '6 ohms and 24 W' },
      { label: 'Current and resistance', expression: '2 A and 6 ohms', result: '12 V and 24 W' },
      { label: 'Voltage and resistance', expression: '9 V and 3 ohms', result: '3 A and 27 W' },
    ],
    relatedSlugs: ['watts-to-amps-calculator', 'resistor-calculator', 'voltage-drop-calculator', 'electricity-calculator'],
  }),
  makeUtilityTool({
    slug: 'electricity-calculator',
    name: 'Electricity Calculator',
    category: 'everyday-tools',
    summary: 'Estimate electricity use and cost from watts, hours, days, and rate per kWh.',
    description:
      'Use this free electricity calculator to estimate kilowatt-hours and cost for an appliance or device from wattage and usage time.',
    icon: 'calculator-electricity',
    formula:
      'The calculator divides watts by 1,000 to get kilowatts, multiplies by hours and days for kWh, then multiplies by the rate per kWh.',
    limit:
      'Real bills include taxes, fees, tiered rates, demand charges, standby use, and variable device power draw.',
    inputExplanations: [
      { term: 'Watts', meaning: 'the device power draw. One kilowatt is 1,000 watts.' },
      { term: 'Hours per day', meaning: 'how long the device runs on an average day.' },
      { term: 'Days', meaning: 'how many days you want to estimate.' },
      { term: 'Rate per kWh', meaning: 'your electricity price for one kilowatt-hour before any extra bill fees.' },
    ],
    extraFaq: [
      {
        question: 'What is a kilowatt-hour?',
        answer:
          'A kilowatt-hour is energy use. Running a 1,000 watt device for 1 hour uses 1 kWh. Running a 100 watt device for 10 hours also uses 1 kWh.',
      },
    ],
    useCases: [
      'Estimate appliance energy use.',
      'Compare a heater, AC, computer, or light over time.',
      'Turn watts and usage time into kWh.',
      'Multiply kWh by your local rate.',
    ],
    examples: [
      { label: 'Space heater', expression: '1,500 W, 4 h/day, 30 days, $0.16/kWh', result: '$28.80' },
      { label: 'LED bulb', expression: '10 W, 5 h/day, 365 days, $0.16/kWh', result: 'Low yearly estimate' },
      { label: 'Gaming PC', expression: '450 W, 3 h/day, 30 days, $0.18/kWh', result: 'Monthly energy cost' },
    ],
    relatedSlugs: ['watts-to-amps-calculator', 'btu-calculator', 'voltage-drop-calculator', 'ohms-law-calculator'],
  }),
  makeUtilityTool({
    slug: 'shoe-size-conversion',
    name: 'Shoe Size Conversion',
    category: 'converters',
    summary: 'Convert foot length into approximate US men, US women, UK, and EU adult shoe sizes.',
    description:
      'Use this free shoe size conversion tool to estimate adult shoe sizes from foot length in centimeters.',
    icon: 'calculator-shoe-size',
    formula:
      'The converter turns centimeters into inches, applies common US and UK adult size formulas, and estimates EU size from centimeter length.',
    limit:
      'Shoe sizing varies by brand, last shape, socks, width, and country. Use official brand size charts when fit matters.',
    useCases: [
      'Estimate adult shoe size from measured foot length.',
      'Compare US men, US women, UK, and EU sizes.',
      'Check nearby half sizes before reading a brand chart.',
      'Understand why shoe conversions are approximate.',
    ],
    examples: [
      { label: '26 cm foot', expression: '26 cm', result: 'Approximate adult sizes' },
      { label: '24 cm foot', expression: '24 cm', result: 'Compare US, UK, and EU sizes' },
      { label: '28 cm foot', expression: '28 cm', result: 'Larger adult size estimate' },
    ],
    relatedSlugs: ['conversion-calculator', 'height-calculator', 'body-type-calculator'],
  }),
  makeUtilityTool({
    slug: 'molarity-calculator',
    name: 'Molarity Calculator',
    category: 'school-study',
    summary: 'Calculate molarity from moles and liters or from grams, molar mass, and liters.',
    description:
      'Use this free molarity calculator to find mol/L concentration from moles or from grams and molar mass.',
    icon: 'calculator-molarity',
    formula:
      'The calculator uses molarity = moles of solute / liters of solution. In grams mode, it first divides grams by molar mass to find moles.',
    limit:
      'Lab work needs correct significant figures, final solution volume, purity, hydration state, safety procedures, and teacher or lab instructions.',
    inputExplanations: [
      { term: 'Moles solute', meaning: 'the amount of dissolved substance in moles.' },
      { term: 'Grams solute', meaning: 'mass of the solute when you are starting from a weighed amount.' },
      { term: 'Molar mass', meaning: 'grams per mole for the substance, often found from the Molecular Weight Calculator.' },
      { term: 'Volume liters', meaning: 'the final solution volume in liters, not just the solvent poured in first.' },
    ],
    extraFaq: [
      {
        question: 'Why does final solution volume matter?',
        answer:
          'Molarity uses moles per liter of final solution. If you dissolve a solid and then fill to the final mark in a flask, use that final volume, not only the amount of water you started with.',
      },
    ],
    useCases: [
      'Calculate molarity from moles and liters.',
      'Calculate moles from grams and molar mass first.',
      'Check chemistry homework setup.',
      'Use molecular weight output as a molar mass input.',
    ],
    examples: [
      { label: 'Simple molarity', expression: '0.5 mol / 1 L', result: '0.5 M' },
      { label: 'NaCl grams', expression: '58.44 g / 58.44 g/mol / 1 L', result: '1 M' },
      { label: 'Dilute sample', expression: '0.25 mol / 0.5 L', result: '0.5 M' },
    ],
    relatedSlugs: ['molecular-weight-calculator', 'conversion-calculator', 'density-calculator'],
  }),
  makeUtilityTool({
    slug: 'molecular-weight-calculator',
    name: 'Molecular Weight Calculator',
    category: 'school-study',
    summary: 'Estimate molecular weight from a chemical formula with element counts and mass shares.',
    description:
      'Use this free molecular weight calculator to parse common chemical formulas and estimate molar mass in grams per mole.',
    icon: 'calculator-molecular-weight',
    formula:
      'The calculator parses element symbols, subscripts, parentheses, and dot hydrate parts, then adds each element count times its rounded atomic weight.',
    limit:
      'The atomic-weight table is rounded and supports common classroom elements. Isotopes, charges, exact masses, and unsupported elements need reference data.',
    inputExplanations: [
      { term: 'Chemical formula', meaning: 'the element symbols and counts, such as H2O, C6H12O6, Ca(OH)2, or CuSO4.5H2O.' },
      { term: 'Subscripts', meaning: 'the numbers after element symbols or parentheses that multiply atom counts.' },
      { term: 'Dot hydrates', meaning: 'formula parts separated by a period, where a leading number multiplies the following hydrate group.' },
    ],
    extraFaq: [
      {
        question: 'Why does capitalization matter in a formula?',
        answer:
          'Element symbols use one capital letter and sometimes one lowercase letter. CO means carbon and oxygen, but Co means cobalt. The calculator reads capitalization as part of the chemistry symbol.',
      },
    ],
    useCases: [
      'Find molar mass for common formulas.',
      'Check element counts in parentheses.',
      'Estimate mass percentage by element.',
      'Use the result in the Molarity Calculator.',
    ],
    examples: [
      { label: 'Water', expression: 'H2O', result: 'About 18.015 g/mol' },
      { label: 'Glucose', expression: 'C6H12O6', result: 'About 180.156 g/mol' },
      { label: 'Calcium hydroxide', expression: 'Ca(OH)2', result: 'Parentheses parsed' },
    ],
    relatedSlugs: ['molarity-calculator', 'scientific-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'sleep-calculator',
    name: 'Sleep Calculator',
    category: 'health-fitness',
    summary: 'Find a bedtime or wake-up time from 90-minute sleep cycles and a fall-asleep buffer.',
    description:
      'Plan a bedtime or wake-up time with 90-minute sleep cycles, a real fall-asleep buffer, and a clear warning when cycle math is not enough.',
    icon: 'calculator-sleep',
    aliases: ['Sleep Cycle Calculator', 'Bedtime Calculator', 'Wake Up Time Calculator'],
    seoTitle: 'Sleep Calculator | Bedtime And Wake-Up Cycle Planner',
    seoDescription:
      'Find a bedtime or wake-up time from 90-minute sleep cycles. Add a fall-asleep buffer, compare 4-6 cycles, and check sleep-quality limits.',
    formula:
      'The calculator treats one sleep cycle as about 90 minutes, then adds or subtracts cycles and your fall-asleep buffer from the clock time.',
    limit:
      'Sleep needs vary by age, health, schedule, stress, and sleep quality. This is a planning helper, not medical advice.',
    faqLanguage: {
      expectedInputs: 'wake-up or bedtime mode, the clock time, sleep cycles, and the minutes you usually need to fall asleep',
      inputFallback:
        'Choose wake-up time or bedtime mode, enter the clock time, then set the number of sleep cycles and your fall-asleep buffer.',
      examplePhrase: 'sleep-cycle example',
      doubleCheck:
        'Also check wake-up or bedtime mode, AM/PM or 24-hour time, sleep cycles, fall-asleep buffer, age-based sleep needs, and whether poor sleep needs a healthcare provider.',
    },
    inputExplanations: [
      { term: 'Wake-up mode', meaning: 'counts backward from the time you need to wake up.' },
      { term: 'Bedtime mode', meaning: 'counts forward from the time you plan to get into bed.' },
      { term: 'Sleep cycles', meaning: '90-minute blocks used for the timing estimate. Five cycles equals 7 hours 30 minutes.' },
      { term: 'Fall-asleep buffer', meaning: 'extra minutes before sleep starts, so the bedtime result is not too late.' },
    ],
    extraFaq: [
      {
        question: 'How should I read the Sleep Calculator answer?',
        answer:
          'Read the suggested clock time first, then check the sleep-time line and fall-asleep buffer. If the plan gives you less sleep than your age usually needs, try more cycles or move the schedule.',
      },
      {
        question: 'Is 90 minutes exact for everyone?',
        answer:
          'No. Ninety minutes is a useful average for planning. Real sleep cycles can be shorter or longer, and waking between cycles does not guarantee you will feel rested.',
      },
      {
        question: 'How many sleep cycles should most adults try?',
        answer:
          'Five cycles gives 7 hours 30 minutes of sleep, and six cycles gives 9 hours. Four cycles is only 6 hours, so it is usually a backup-night option, not a good normal target for most adults.',
      },
      {
        question: 'Does this replace sleep advice from a doctor?',
        answer:
          'No. Use it as a planning helper. Talk to a healthcare provider if sleep problems keep happening, you wake up tired after enough hours, snore loudly, or someone notices breathing pauses during sleep.',
      },
      {
        question: 'Why does the fall-asleep buffer matter?',
        answer:
          'If you need 15 minutes to fall asleep, a 23:30 bedtime does not start sleep at 23:30. The buffer moves the suggested time earlier or later so the cycle math starts closer to actual sleep.',
      },
    ],
    useCases: [
      'Find a bedtime from a planned wake-up time.',
      'Find a wake-up time from bedtime.',
      'Compare 4, 5, or 6 sleep cycles.',
      'Add a realistic fall-asleep buffer.',
    ],
    examples: [
      { label: 'Wake at 7:00', expression: '5 cycles plus 15 min buffer', result: 'Bed at 23:15' },
      { label: 'Bed at 10:30 PM', expression: '5 cycles plus 15 min buffer', result: 'Wake at 06:15' },
      { label: 'Six-cycle night', expression: 'Wake at 7:00, 6 cycles plus 15 min buffer', result: 'Bed at 21:45' },
    ],
    relatedSlugs: ['time-calculator', 'hours-calculator', 'target-heart-rate-calculator'],
  }),
  makeUtilityTool({
    slug: 'tire-size-calculator',
    name: 'Tire Size Calculator',
    category: 'everyday-tools',
    summary: 'Calculate sidewall, diameter, circumference, and revs per mile from a metric tire size.',
    description:
      'Use this free tire size calculator for metric tire sizes such as 225/60R16 to estimate diameter, circumference, and revolutions per mile.',
    icon: 'calculator-tire-size',
    formula:
      'The calculator multiplies width by aspect ratio for sidewall height, converts millimeters to inches, then adds two sidewalls to wheel diameter.',
    limit:
      'Tire changes can affect safety, fitment, load rating, speedometer readings, braking, and driver-assist systems. Follow manufacturer guidance.',
    useCases: [
      'Decode a metric tire size.',
      'Compare tire diameter and circumference.',
      'Estimate revolutions per mile.',
      'Understand how aspect ratio changes sidewall height.',
    ],
    examples: [
      { label: 'Common size', expression: '225/60R16', result: 'Diameter and revs per mile' },
      { label: 'Low profile comparison', expression: '235/45R18', result: 'Sidewall and diameter estimate' },
      { label: 'Truck tire', expression: '275/65R18', result: 'Larger diameter estimate' },
    ],
    relatedSlugs: ['conversion-calculator', 'speed-calculator', 'mileage-calculator'],
  }),
  makeUtilityTool({
    slug: 'roofing-calculator',
    name: 'Roofing Calculator',
    category: 'home-projects',
    summary: 'Estimate roof squares and shingle bundles from footprint, pitch, and waste.',
    description:
      'Use this free roofing calculator to estimate roof area, roofing squares, and shingle bundles for a simple pitched roof before you check the real roof and product label.',
    seoTitle: 'Roofing Calculator | Squares And Shingle Bundles',
    seoDescription:
      'Estimate roof squares and shingle bundles from footprint, pitch, and waste. Includes a 40 x 30 ft example, 3-bundle caveat, and safety limits.',
    icon: 'calculator-roofing',
    formula:
      'The calculator multiplies footprint area by a pitch factor, adds waste, divides by 100 square feet per roofing square, and estimates 3 bundles per square.',
    limit:
      'Complex roofs, valleys, hips, dormers, openings, starter strips, ridge cap, product coverage, low-slope rules, and local installation practices can change material needs.',
    faqLanguage: {
      expectedInputs: 'simple footprint length, footprint width, pitch rise per 12, and waste percent',
      inputFallback:
        'Enter the flat footprint length and width, the roof rise per 12 inches of run, and the waste percent you want to add.',
      examplePhrase: 'roofing material example',
      doubleCheck:
        'Check the roof shape, pitch, shingle wrapper, manufacturer instructions, local code, and safe access before ordering materials.',
      privacy:
        'No. The roofing estimate runs in your browser tab. Do not enter your address or any private job details.',
    },
    inputExplanations: [
      { term: 'Footprint length and width', meaning: 'The flat building footprint, not the house square footage and not the sloped roof surface.' },
      { term: 'Pitch rise per 12', meaning: 'How many inches the roof rises for every 12 inches of horizontal run. A 6/12 roof rises 6 inches over 12 inches.' },
      { term: 'Waste percent', meaning: 'Extra roofing for cuts, starter strips, ridge cap, hips, valleys, overhangs, and mistakes.' },
    ],
    extraFaq: [
      {
        question: 'How many square feet are in one roofing square?',
        answer:
          'One roofing square is 100 square feet of roof surface. If the calculator shows 14.76 squares, that means about 1,476 square feet after pitch and waste.',
      },
      {
        question: 'Does every shingle use 3 bundles per square?',
        answer:
          'No. Three bundles per square is common for many asphalt shingles, but heavier or specialty products can be different. Check the wrapper or manufacturer sheet before buying.',
      },
      {
        question: 'Does this include starter strips and ridge cap?',
        answer:
          'Not exactly. The waste percent can help cover cuts and small extras, but starter strips, ridge cap, ridge vent, flashing, underlayment, nails, and drip edge often need separate planning.',
      },
      {
        question: 'Can I use this for a low-slope roof?',
        answer:
          'Use extra caution. Low-slope roofs can need special underlayment or different roofing materials. Check the shingle instructions, local code, and a roofer before ordering.',
      },
      {
        question: 'Should I measure from the roof?',
        answer:
          'Do not climb onto a roof just to use this calculator. Use ground measurements, plans, a safe measurement report, or a professional if roof access is not clearly safe.',
      },
    ],
    useCases: [
      'Estimate roof squares for a simple footprint.',
      'Adjust for roof pitch and waste.',
      'Estimate shingle bundles at 3 bundles per square.',
      'Prepare a rough number before contractor measurement.',
    ],
    examples: [
      { label: 'Simple roof', expression: '40 ft x 30 ft, 6/12 pitch, 10% waste', result: '14.76 squares, 45 bundles' },
      { label: 'Low pitch', expression: '30 ft x 24 ft, 3/12 pitch, 10% waste', result: '8.16 squares, 25 bundles' },
      { label: 'Higher waste', expression: '48 ft x 32 ft, 8/12 pitch, 15% waste', result: '21.23 squares, 64 bundles' },
    ],
    relatedSlugs: ['square-footage-calculator', 'area-calculator', 'slope-calculator'],
  }),
  makeUtilityTool({
    slug: 'tile-calculator',
    name: 'Tile Calculator',
    category: 'home-projects',
    summary: 'Estimate floor, wall, or shower tile count from square feet, tile size, and waste.',
    description:
      'Use this free tile calculator to estimate whole tiles from project square feet, tile dimensions, and waste before checking box coverage.',
    seoTitle: 'Tile Calculator | Floor, Wall, Shower Tile Count',
    seoDescription:
      'Estimate floor, wall, or shower tile count from square feet, tile dimensions, and waste percent before checking layout cuts and box coverage.',
    icon: 'calculator-tile',
    aliases: [
      'Tile Calculator Square Feet',
      'Floor Tile Calculator',
      'Shower Tile Calculator',
      'Wall Tile Calculator',
      'Tile Count Calculator',
      'Tile Square Foot Calculator',
      'Tile Calculator Formula',
      'Tile Calculator Square Meters',
    ],
    formula:
      'The calculator uses tile area = tile length inches x tile width inches / 144, adjusted area = project square feet x (1 + waste percent / 100), and tiles needed = ceiling(adjusted area / tile area).',
    limit:
      'This is a planning count, not a full installer takeoff. Real projects can change with grout joints, layout direction, cuts at edges, diagonal or herringbone patterns, broken pieces, spare tiles, box coverage, shade lots, trim, thinset, waterproofing, and store rounding.',
    faqLanguage: {
      expectedInputs: 'project square feet, tile length and width in inches, and the waste percent you want to add',
      examplePhrase: 'tile-count example',
      doubleCheck:
        'Also check the tile box coverage, tiles per box, grout joint, layout pattern, shade lot, and whether floor, wall, or shower surfaces should be measured separately.',
    },
    inputExplanations: [
      { term: 'Project area (ft2)', meaning: 'the floor, wall, backsplash, or shower surface area before extra tile is added.' },
      { term: 'Tile length and width (in)', meaning: 'the visible face size of one tile, not the box size or carton coverage.' },
      { term: 'Waste (%)', meaning: 'extra tile for cuts, breakage, pattern layout, chipped corners, and a few future repair pieces.' },
      { term: 'Tiles needed', meaning: 'the rounded-up tile count before you convert it to boxes or cartons.' },
    ],
    extraFaq: [
      {
        question: 'How many 12 x 12 tiles do I need for 120 square feet?',
        answer:
          'A 12 x 12 inch tile covers 1 square foot. For 120 square feet with 10% waste, the calculator uses 132 square feet and returns 132 tiles.',
      },
      {
        question: 'Can I use this as a shower tile calculator?',
        answer:
          'Yes for a first count. Measure each shower wall or floor area, add the square feet together, and use a higher waste percent if there are niches, benches, plumbing cuts, mosaics, or many small pieces.',
      },
      {
        question: 'Should I enter floor area or wall area?',
        answer:
          'Enter the surface you are actually tiling. For a floor, use floor square feet. For a wall, backsplash, or shower, measure each rectangle, subtract large openings when needed, and add the areas together.',
      },
      {
        question: 'What waste percent should I use for tile?',
        answer:
          'Ten percent is a common starting point for simple straight layouts. Use more for diagonal layouts, herringbone, small rooms with many edge cuts, fragile tile, patterned tile, or hard-to-replace colors.',
      },
      {
        question: 'Does grout spacing change the tile count?',
        answer:
          'It can change the final layout, especially across long runs. This calculator uses the tile face size you enter, so check grout joint width, starting lines, and cut rows before ordering exact boxes.',
      },
      {
        question: 'How do I turn tiles needed into boxes?',
        answer:
          'Divide the tile count by the number of tiles per box and round up, or compare the adjusted square feet with the box coverage printed on the product label. Buy by the store rule, not by half boxes.',
      },
      {
        question: 'Can I use square meters or centimeters?',
        answer:
          'This page expects square feet and inches. Convert square meters to square feet and centimeters to inches first, then enter the converted values. Keep all measurements in the same unit system.',
      },
      {
        question: 'Why is the answer higher than the raw area?',
        answer:
          'The calculator adds your waste percent before dividing by tile area, then rounds up to a whole tile. That extra count is meant to cover cuts, breakage, and small layout surprises.',
      },
    ],
    useCases: [
      'Estimate floor tile count from square feet.',
      'Estimate wall, backsplash, or shower tile count.',
      'Add a waste percentage before buying boxes.',
      'Compare 12 x 12, 12 x 24, subway, and mosaic tile sizes.',
      'Convert tile dimensions into square feet per tile.',
      'Get a quick count before checking carton coverage and layout cuts.',
    ],
    examples: [
      { label: '12 inch tile', expression: '120 ft2, 12 x 12 in tile, 10% waste', result: '132 tiles' },
      { label: 'Large floor tile', expression: '200 ft2, 12 x 24 in tile, 10% waste', result: '110 tiles' },
      { label: 'Shower wall tile', expression: '84 ft2, 3 x 12 in tile, 15% waste', result: '387 tiles' },
      { label: 'Backsplash tile', expression: '35 ft2, 4 x 4 in tile, 10% waste', result: '347 tiles' },
    ],
    relatedSlugs: ['square-footage-calculator', 'flooring-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'mulch-calculator',
    name: 'Mulch Calculator',
    category: 'home-projects',
    summary: 'Estimate mulch cubic yards, cubic feet, and 2-cubic-foot bags from area and depth.',
    description:
      'Use this free mulch calculator to estimate bulk cubic yards or common bag counts from square feet, depth, and waste.',
    seoTitle: 'Mulch Calculator | Yards, Bags, Depth',
    seoDescription:
      'Estimate mulch cubic yards, cubic feet, and bag count from square feet, depth in inches, bag size, and waste before buying bagged or bulk mulch.',
    icon: 'calculator-mulch',
    aliases: [
      'Mulch Yard Calculator',
      'Mulch Bags Calculator',
      'Mulch Cubic Yard Calculator',
      'Landscape Mulch Calculator',
      'Garden Mulch Calculator',
      'Bark Mulch Calculator',
    ],
    formula:
      'The calculator uses cubic feet = area square feet x depth inches / 12, adjusted cubic feet = cubic feet x (1 + waste percent / 100), cubic yards = adjusted cubic feet / 27, and bags = ceiling(adjusted cubic feet / bag cubic feet).',
    limit:
      'This is a planning estimate. Real mulch needs can change with old mulch depth, bed shape, slope, settling, mulch texture, moisture, bag fill, bulk delivery minimums, plant spacing, tree trunks, edging, wind, runoff, and supplier rounding.',
    faqLanguage: {
      expectedInputs: 'bed area in square feet, depth in inches, bag size, and waste percent',
      examplePhrase: 'mulch bed example',
      doubleCheck:
        'Also check whether you are topping up old mulch, whether the bag size is 1.5, 2, or 3 cubic feet, and whether bulk delivery has a minimum order.',
    },
    inputExplanations: [
      { term: 'Area square feet', meaning: 'the garden or landscape bed area you want to cover.' },
      { term: 'Depth inches', meaning: 'the finished mulch depth after spreading.' },
      { term: 'Bag cubic feet', meaning: 'the volume printed on the mulch bag, often 1.5, 2, or 3 cubic feet.' },
      { term: 'Waste percent', meaning: 'extra mulch for settling, uneven beds, slopes, and spreading loss.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate mulch cubic yards?',
        answer:
          'Multiply square feet by depth in inches, divide by 12 to get cubic feet, then divide by 27 to get cubic yards. The shortcut is square feet x depth inches / 324.',
      },
      {
        question: 'How many 2 cubic foot bags are in one cubic yard?',
        answer:
          'One cubic yard is 27 cubic feet, so it equals 13.5 two-cubic-foot bags. The calculator rounds up because stores do not sell half bags.',
      },
      {
        question: 'What mulch depth should I enter?',
        answer:
          'Use the finished depth you want after spreading. Two inches is a common light layer, 3 inches is common for many beds, and coarse mulch may be used deeper only when it fits the plant and site. Do not pile mulch against trunks or stems.',
      },
      {
        question: 'Should I remove old mulch first?',
        answer:
          'If old mulch is still loose and thin, you may only need a top-up layer. If it is matted, sour, piled too deep, or touching trunks, rake it back or remove some before adding more.',
      },
      {
        question: 'Why add waste percent for mulch?',
        answer:
          'Waste percent covers settling, uneven beds, spreading loss, edge cleanup, and small measuring mistakes. Use a small amount for simple beds and more for odd shapes or slopes.',
      },
      {
        question: 'Can I use this for several beds?',
        answer:
          'Yes. Add the square footage for each bed, then enter the total area and the same depth. If different beds need different depths, run the calculator separately for each group.',
      },
      {
        question: 'Does this work for circular tree rings?',
        answer:
          'Yes if you already know the square footage. For a circle, area is radius x radius x 3.14. Keep mulch pulled away from the tree trunk instead of making a mulch mound against the bark.',
      },
      {
        question: 'Should I buy mulch by bags or bulk yards?',
        answer:
          'Use cubic yards for bulk quotes and bag count for store pickup. Bagged mulch is easier for small jobs, while bulk delivery can make sense for larger beds if the delivery fee and minimum order work for you.',
      },
    ],
    useCases: [
      'Estimate mulch for a garden bed.',
      'Convert square feet and inches deep into cubic yards.',
      'Estimate 1.5, 2, or 3 cubic-foot bag count.',
      'Add a small waste buffer before buying.',
      'Compare bagged mulch with a bulk-yard delivery quote.',
      'Plan a top-up layer without burying plant stems or tree trunks.',
    ],
    examples: [
      { label: 'Garden bed', expression: '200 ft2 at 3 in, 2 ft3 bags, 5% waste', result: '1.94 yd3 and 27 bags' },
      { label: 'Refresh layer', expression: '150 ft2 at 2 in, 2 ft3 bags', result: '0.93 yd3 and 13 bags' },
      { label: 'Large bed', expression: '500 ft2 at 2.5 in, 2 ft3 bags, 10% waste', result: '4.24 yd3 and 58 bags' },
      { label: 'Tree ring group', expression: '80 ft2 at 3 in, 2 ft3 bags', result: '0.74 yd3 and 10 bags' },
    ],
    relatedSlugs: ['soil-calculator', 'sand-calculator', 'gravel-calculator'],
  }),
  makeUtilityTool({
    slug: 'gravel-calculator',
    name: 'Gravel Calculator',
    category: 'home-projects',
    summary: 'Estimate gravel cubic yards and tons from length, width, depth, and density.',
    description:
      'Use this free gravel calculator to estimate cubic yards and tons for a rectangular gravel area.',
    seoTitle: 'Gravel Calculator | Yards, Tons, Depth',
    seoDescription:
      'Estimate gravel cubic yards and tons from length, width, depth in inches, and supplier density before checking compaction and delivery rules.',
    icon: 'calculator-gravel',
    aliases: [
      'Gravel Yard Calculator',
      'Gravel Tons Calculator',
      'Driveway Gravel Calculator',
      'Pea Gravel Calculator',
      'Crushed Stone Calculator',
      'Gravel Material Calculator',
    ],
    formula:
      'The calculator uses cubic feet = length x width x depth inches / 12, cubic yards = cubic feet / 27, estimated tons = cubic yards x tons per cubic yard, and bag count = ceiling(cubic feet / bag cubic feet) when bag sizing is available.',
    limit:
      'This is a rectangular planning estimate. Real orders can change with stone type, moisture, compaction, loose versus compacted volume, driveway layers, drainage, edging, fabric, supplier density, truck access, delivery minimums, and local site conditions.',
    faqLanguage: {
      expectedInputs: 'length, width, depth in inches, tons per cubic yard, and optional bag size',
      examplePhrase: 'gravel material example',
      doubleCheck:
        'Also check whether your supplier sells by cubic yard, by ton, or by bag, and ask how compaction, moisture, and delivery minimums affect the final order.',
    },
    inputExplanations: [
      { term: 'Length, width, and depth', meaning: 'the rectangular gravel area and average finished depth.' },
      { term: 'Tons per cubic yard', meaning: 'the supplier density used to turn volume into weight. Use the yard or quarry number when you have it.' },
      { term: 'Cubic yards result', meaning: 'the bulk volume number many landscape suppliers use for gravel, stone, and base material.' },
      { term: 'Tons result', meaning: 'the weight estimate. It is not interchangeable with yards unless the density matches.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate gravel cubic yards?',
        answer:
          'Multiply length by width by depth in feet to get cubic feet, then divide by 27. If depth is in inches, divide the depth by 12 first. The calculator does that conversion for you.',
      },
      {
        question: 'Are gravel tons and cubic yards the same thing?',
        answer:
          'No. Cubic yards measure volume, while tons measure weight. One cubic yard of common crushed stone is often around 1.35 to 1.5 tons, but the right number depends on the material and supplier.',
      },
      {
        question: 'What depth should I use for gravel?',
        answer:
          'Use the finished depth you want. Decorative beds may be around 2 inches, paths often use about 2 to 3 inches, and driveways or base layers can need more. Match the depth to the job, not just the cheapest order.',
      },
      {
        question: 'Should I add extra gravel for compaction?',
        answer:
          'Often yes for crushed or base gravel. Loose gravel can settle or compact after spreading, so ask the supplier how much extra to order for the material and equipment you are using.',
      },
      {
        question: 'Can I use this for pea gravel or river rock?',
        answer:
          'Yes for rough volume. For tons, change the tons-per-cubic-yard input because pea gravel, crushed stone, river rock, road base, and wet gravel can weigh different amounts.',
      },
      {
        question: 'Does this plan driveway gravel layers?',
        answer:
          'No. It estimates one rectangular layer at one depth. A full driveway may need separate base, middle, and surface layers, each with its own material, depth, compaction, and drainage plan.',
      },
      {
        question: 'What should I ask the supplier before ordering?',
        answer:
          'Ask whether they sell by the yard, ton, or bag; what density they use; the minimum delivery amount; dump-truck access needs; and whether they recommend an overage for compaction or spillage.',
      },
    ],
    useCases: [
      'Estimate gravel for a path, pad, or driveway section.',
      'Convert cubic feet into cubic yards.',
      'Estimate tons from supplier density.',
      'Check how changing depth changes material needs.',
      'Compare bulk yard orders with ton-based supplier quotes.',
      'Plan a small bagged job before switching to bulk delivery.',
    ],
    examples: [
      { label: 'Small driveway top-up', expression: '20 ft x 10 ft x 4 in, 1.4 tons/yd3', result: '2.47 yd3 and 3.46 tons' },
      { label: 'Garden path', expression: '30 ft x 3 ft x 2 in, 1.35 tons/yd3', result: '0.56 yd3 and 0.75 tons' },
      { label: 'Parking pad', expression: '18 ft x 18 ft x 4 in, 1.5 tons/yd3', result: '4.00 yd3 and 6.00 tons' },
      { label: 'Deep base layer', expression: '40 ft x 12 ft x 6 in, 1.5 tons/yd3', result: '8.89 yd3 and 13.33 tons' },
    ],
    relatedSlugs: ['cubic-yard-calculator', 'sand-calculator', 'paver-base-calculator'],
  }),
  makeUtilityTool({
    slug: 'paint-calculator',
    name: 'Paint Calculator',
    category: 'home-projects',
    summary: 'Estimate interior wall paint gallons from room size, openings, coats, coverage, and extra percent.',
    description:
      'Use this free paint calculator to estimate interior wall paint gallons from room dimensions, doors, windows, coats, paint-label coverage, and extra percent.',
    seoTitle: 'Paint Calculator | Estimate Gallons For Room Walls',
    seoDescription:
      'Estimate interior wall paint gallons from room length, width, height, doors, windows, coats, coverage, and extra percent before you buy.',
    icon: 'calculator-paint',
    aliases: [
      'Wall Paint Calculator',
      'Room Paint Calculator',
      'Interior Paint Calculator',
      'Paint Gallon Calculator',
      'Paint Coverage Calculator',
    ],
    formula:
      'The calculator finds wall area as 2 x (length + width) x wall height, subtracts 20 square feet per door and 15 square feet per window, multiplies by coats and extra percent, then divides by square-foot coverage per gallon.',
    limit:
      'This is an interior wall buying estimate. Paint coverage still depends on the product label, primer, surface texture, color change, application method, ceiling or trim work, and how much paint remains in the can or tray.',
    faqLanguage: {
      expectedInputs: 'room length, room width, wall height, doors, windows, coats, coverage in square feet per gallon, and extra percent',
      inputFallback:
        'Measure the room length, width, and wall height in feet, count doors and windows, then enter the coats and coverage from the paint can or product page.',
      examplePhrase: 'paint gallon example',
      doubleCheck:
        'Also check whether you are painting ceilings, trim, closets, textured walls, patched drywall, dark color changes, or primer because those can change the final order.',
    },
    inputExplanations: [
      { term: 'Room length, width, and wall height', meaning: 'the rectangular room dimensions used to estimate wall square footage.' },
      { term: 'Doors and windows', meaning: 'standard openings subtracted before coats and extra paint are added. The calculator uses 20 sq ft per door and 15 sq ft per window.' },
      { term: 'Coats', meaning: 'how many full wall coats you plan to apply. Two coats roughly doubles the paintable area before coverage is applied.' },
      { term: 'Coverage per gallon', meaning: 'the square feet one gallon covers for one coat according to the paint label or product page.' },
      { term: 'Extra percent', meaning: 'extra paint for texture, roller and tray loss, touchups, small measurement errors, and a safer shopping estimate.' },
    ],
    extraFaq: [
      {
        question: 'How many gallons of paint do I need for a 12 x 10 room?',
        answer:
          'With the default 8 foot walls, 1 door, 2 windows, 2 coats, 350 sq ft per gallon coverage, and 10% extra, the calculator estimates 302 paintable sq ft and 1.898 gallons before rounding. Buy about 2 gallons for that example.',
      },
      {
        question: 'Does the Paint Calculator include ceilings and trim?',
        answer:
          'No. This calculator estimates interior wall paint for a simple rectangular room. Estimate ceilings, baseboards, doors, cabinets, and trim separately because they use different areas, products, finishes, or application methods.',
      },
      {
        question: 'What coverage number should I enter?',
        answer:
          'Use the coverage number printed on the paint can or product page when you have it. If a label gives a range, use the lower end for rough, patched, porous, or dark-to-light color changes so the estimate is not too optimistic.',
      },
      {
        question: 'Should I include primer as a coat?',
        answer:
          'Only include primer if you are buying primer by the same coverage assumption and want a rough material count. For a real shopping list, estimate primer and finish paint separately because their coverage and package sizes can differ.',
      },
      {
        question: 'Why does the calculator subtract doors and windows?',
        answer:
          'Doors and windows are wall openings you usually do not paint with the wall color. This calculator subtracts 20 sq ft per door and 15 sq ft per window, which is a practical estimate rather than a custom opening measurement.',
      },
      {
        question: 'Can I use floor square footage to estimate paint?',
        answer:
          'Not directly. Floor square footage is length times width, while wall paint uses the room perimeter times wall height. A 12 x 10 room has 120 sq ft of floor area but 352 sq ft of wall area before openings.',
      },
      {
        question: 'Can this estimate one accent wall?',
        answer:
          'The current calculator is built for full room walls. For one accent wall, multiply that wall width by wall height, subtract any opening on that wall, then compare the area with the gallons result or use the Square Footage Calculator first.',
      },
      {
        question: 'Can I use this paint estimate for wallpaper too?',
        answer:
          'Use the wall area idea, but do not use paint gallons as a wallpaper answer. Wallpaper is bought by roll coverage and can need extra waste for pattern matching, trimming, and dye lots, so switch to the Wallpaper Calculator when the wall covering is paper, vinyl, or peel-and-stick.',
      },
    ],
    useCases: [
      'Estimate gallons for a bedroom, office, or living room.',
      'Adjust for one or two coats before buying paint.',
      'Subtract common doors and windows from wall area.',
      'Compare coverage values from different paint labels.',
      'Check how much rougher walls or a safer extra percent change the order.',
    ],
    examples: [
      { label: 'Small bedroom', expression: '12 x 10 x 8 ft, 1 door, 2 windows, 2 coats, 350 sq ft/gal, 10% extra', result: '302 sq ft paintable, buy 2 gallons' },
      { label: 'Living room', expression: '18 x 14 x 9 ft, 2 doors, 3 windows, 2 coats, 375 sq ft/gal, 10% extra', result: '491 sq ft paintable, buy 3 gallons' },
      { label: 'One-coat office', expression: '10 x 9 x 8 ft, 1 door, 1 window, 1 coat, 350 sq ft/gal, 5% extra', result: '269 sq ft paintable, buy 1 gallon' },
      { label: 'Patchy room', expression: '14 x 12 x 8 ft, 1 door, 2 windows, 2 coats, 300 sq ft/gal, 15% extra', result: '366 sq ft paintable, buy 3 gallons' },
    ],
    relatedSlugs: ['wallpaper-calculator', 'square-footage-calculator', 'drywall-calculator', 'flooring-calculator'],
  }),
  makeUtilityTool({
    slug: 'drywall-calculator',
    name: 'Drywall Calculator',
    category: 'home-projects',
    summary: 'Estimate drywall sheet count from project area, sheet size, and waste percentage.',
    description:
      'Use this free drywall calculator to estimate whole drywall sheets from wall or ceiling square feet, sheet size, and waste percentage.',
    seoTitle: 'Drywall Calculator | Sheets, Size, Waste',
    seoDescription:
      'Estimate whole drywall sheets from project square footage, panel size, and waste percent before checking tape, mud, screws, and code needs.',
    icon: 'calculator-drywall',
    aliases: [
      'Sheetrock Calculator',
      'Plasterboard Calculator',
      'Drywall Sheet Calculator',
      'Drywall Material Calculator',
      'Drywall Board Calculator',
      'Drywall Panel Calculator',
    ],
    formula:
      'The calculator uses sheet area = sheet length x sheet width, adjusted project area = project area x (1 + waste percent / 100), and whole sheets = ceiling(adjusted project area / sheet area).',
    limit:
      'This estimates sheets only. Real drywall planning also depends on openings, ceilings, sheet orientation, seams, thickness, fire rating, moisture rating, screw schedule, tape, joint compound, corner bead, lift help, delivery, breakage, and local building rules.',
    faqLanguage: {
      expectedInputs: 'project square footage, sheet length, sheet width, and waste percent',
      examplePhrase: 'drywall sheet example',
      doubleCheck:
        'Also check whether the area already removes doors and windows, and remember that tape, mud, screws, corner bead, thickness, moisture rating, and fire rating are separate buying decisions.',
    },
    inputExplanations: [
      { term: 'Wall or ceiling area', meaning: 'the measured surface area you plan to board before extra sheets are added.' },
      { term: 'Sheet size', meaning: 'the drywall panel dimensions, such as 4 by 8 or 4 by 12 feet.' },
      { term: 'Waste percent', meaning: 'extra sheets for cuts, broken corners, offcuts, and layout mistakes.' },
    ],
    extraFaq: [
      {
        question: 'What does the Drywall Calculator include?',
        answer:
          'It estimates whole drywall panels from the area, sheet size, and waste percent you enter. It does not estimate tape, joint compound, screws, corner bead, labor, delivery, or finishing level.',
      },
      {
        question: 'How do I get the wall or ceiling area?',
        answer:
          'For each wall, multiply wall length by wall height, then add the walls together. For a ceiling, multiply length by width. Enter the total square footage you want covered by drywall.',
      },
      {
        question: 'Should I subtract doors and windows?',
        answer:
          'If your measured area already subtracts openings, enter that number. For rough buying, small openings may not reduce the whole-sheet count because panels are still cut around them and offcuts are not always reusable.',
      },
      {
        question: 'Is 10% waste enough for drywall?',
        answer:
          'Ten percent is a common starting point for simple rectangular areas. Use more for ceilings, closets, stairs, lots of openings, awkward cuts, broken corners, or if returning for one missing sheet would slow the job.',
      },
      {
        question: 'Which sheet size should I choose?',
        answer:
          '4 by 8 sheets are easier to carry. 4 by 10 and 4 by 12 sheets can reduce seams, but they are heavier and harder to move. Pick the size you can actually deliver, lift, and hang safely.',
      },
      {
        question: 'Does this choose drywall thickness or type?',
        answer:
          'No. Choose thickness, fire-rated board, moisture-resistant board, cement board, or sound-rated board from the room use, local code, and product instructions. The calculator only counts panels.',
      },
      {
        question: 'Does this estimate mud, tape, and screws?',
        answer:
          'No. Those depend on sheet count, seams, finish level, screw spacing, corners, and the product you buy. Use this page for the sheet count, then check the joint compound, tape, and screw labels or installer takeoff.',
      },
    ],
    useCases: [
      'Estimate drywall sheets for a room or basement wall area.',
      'Compare 4x8, 4x10, and 4x12 sheet sizes.',
      'Add a waste allowance for cuts and broken sheets.',
      'Plan a rough material count before measuring openings and layout.',
      'Check whether longer sheets reduce the panel count before buying.',
      'Separate a sheet-count estimate from tape, mud, screws, and code choices.',
    ],
    examples: [
      { label: '4x8 sheets', expression: '480 ft2, 4 x 8 sheet, 10% waste', result: '17 sheets' },
      { label: 'Long sheets', expression: '720 ft2, 4 x 12 sheet, 12% waste', result: '17 sheets' },
      { label: 'Ceiling section', expression: '240 ft2, 4 x 10 sheet, 10% waste', result: '7 sheets' },
      { label: 'Small repair area', expression: '96 ft2, 4 x 8 sheet, 5% waste', result: '4 sheets' },
    ],
    relatedSlugs: ['paint-calculator', 'square-footage-calculator', 'wallpaper-calculator'],
  }),
  makeUtilityTool({
    slug: 'carpet-calculator',
    name: 'Carpet Calculator',
    category: 'home-projects',
    summary: 'Estimate carpet square yards, adjusted area, and roll length from room size, roll width, and waste.',
    description:
      'Use this free carpet calculator to estimate carpet square yards, adjusted square feet, and approximate roll length from room size, roll width, and waste.',
    seoTitle: 'Carpet Calculator | Square Yards And Roll Length',
    seoDescription:
      'Estimate carpet square yards, adjusted square feet, and approximate roll length from room size, roll width, and waste with seam and pattern limits.',
    icon: 'calculator-carpet',
    aliases: [
      'Carpet Yardage Calculator',
      'Carpet Square Yard Calculator',
      'Carpet Roll Calculator',
      'Carpet Room Calculator',
    ],
    formula:
      'The calculator uses floor area = length x width, adjusted area = floor area x (1 + waste percent / 100), square yards = adjusted area / 9, and approximate linear feet = adjusted area / roll width.',
    limit:
      'Carpet orders depend on seam placement, stairs, closets, hallways, doorway cuts, pile direction, pattern matching, roll width, tack strips, padding, transitions, dye lot, and installer layout.',
    faqLanguage: {
      expectedInputs: 'room length, room width, roll width, and waste percent',
      examplePhrase: 'carpet room example',
      doubleCheck:
        'Also check whether the room needs more than one strip, whether the pile or pattern must run one direction, and whether closets, stairs, or hallways were measured separately.',
    },
    inputExplanations: [
      { term: 'Room length and width', meaning: 'the simple rectangular floor area before closets, seams, or stairs are handled separately.' },
      { term: 'Roll width', meaning: 'the carpet roll width from the product, commonly 12 feet for many carpets.' },
      { term: 'Waste percent', meaning: 'extra carpet for trimming, seams, closets, pattern direction, and installer layout.' },
    ],
    extraFaq: [
      {
        question: 'How do I turn square feet into square yards for carpet?',
        answer:
          'Divide square feet by 9 because one square yard is 3 feet by 3 feet. A 180 square foot room is 20 square yards before waste, then 22 square yards with 10% waste.',
      },
      {
        question: 'Why does roll width matter?',
        answer:
          'Carpet comes from a fixed-width roll. A room that fits inside a 12 foot roll may need one piece, while a wider room may need seams or a different roll width. This calculator gives a simple roll-length estimate, not a full cutting diagram.',
      },
      {
        question: 'Does this handle seams and pattern matching?',
        answer:
          'Only as a warning, not as a layout plan. Seam placement, pile direction, pattern repeat, and matching can change the order, so use the result as a planning number before an installer measures the room.',
      },
      {
        question: 'Should I include closets and stairs?',
        answer:
          'Measure closets, stair runs, landings, and hallways separately. A simple rectangular room entry can miss extra cuts, nosing, turns, and trim waste.',
      },
      {
        question: 'Does this include padding or installation cost?',
        answer:
          'No. It estimates carpet material area and roll length only. Padding, tack strips, transitions, delivery, furniture moving, old-carpet removal, and labor need separate pricing.',
      },
    ],
    useCases: [
      'Estimate carpet for a simple rectangular room.',
      'Convert square feet into square yards.',
      'Estimate linear feet from common roll width.',
      'Add waste before talking with an installer.',
      'Compare a 12 foot roll with a wider roll before asking for a quote.',
    ],
    examples: [
      { label: 'Bedroom carpet', expression: '15 ft x 12 ft, 12 ft roll, 10% waste', result: '22 sq yd and 16.5 linear ft' },
      { label: 'Large room', expression: '22 ft x 16 ft, 12 ft roll, 12% waste', result: '43.8 sq yd and 32.9 linear ft' },
      { label: 'Small office', expression: '10 ft x 11 ft, 12 ft roll, 8% waste', result: '13.2 sq yd and 9.9 linear ft' },
      { label: 'Roll-width check', expression: '13 ft wide room, 12 ft roll', result: 'Installer seam check needed' },
    ],
    relatedSlugs: ['flooring-calculator', 'tile-calculator', 'paint-calculator'],
  }),
  makeUtilityTool({
    slug: 'flooring-calculator',
    name: 'Flooring Calculator',
    category: 'home-projects',
    summary: 'Estimate flooring boxes, adjusted square feet, coverage ordered, and optional material cost.',
    description:
      'Estimate whole flooring boxes from measured floor area, waste percent, box coverage, and optional box price.',
    seoTitle: 'Flooring Calculator | Boxes, Waste, And Cost',
    seoDescription:
      'Estimate flooring boxes from square feet, waste percent, box coverage, and optional box price. See adjusted area, coverage ordered, and rough material cost.',
    icon: 'calculator-flooring',
    aliases: [
      'Floor Calculator',
      'Flooring Box Calculator',
      'Laminate Flooring Calculator',
      'Vinyl Plank Flooring Calculator',
      'LVP Box Calculator',
    ],
    formula:
      'The calculator uses adjusted area = floor area x (1 + waste percent / 100), then boxes = ceiling(adjusted area / square feet per box). If price per box is entered, it multiplies whole boxes by that price.',
    limit:
      'Flooring orders depend on room shape, product layout, diagonal or herringbone patterns, stairs, closets, transitions, damaged pieces, underlayment, trim, installer layout, returns, and matching dye lots.',
    inputExplanations: [
      { term: 'Floor area', meaning: 'the measured square footage for every room, closet, hallway, or connected area that gets the same flooring.' },
      { term: 'Waste percent', meaning: 'extra flooring for cuts, damaged planks, pattern direction, mistakes, and future repairs.' },
      { term: 'Box coverage', meaning: 'how many square feet one box covers according to the product label.' },
      { term: 'Price per box', meaning: 'an optional material price used only when you want an estimated product cost.' },
    ],
    extraFaq: [
      {
        question: 'How much waste should I add for flooring?',
        answer:
          'For a simple straight layout, 5% to 10% is a common starting point. Use more when the room has many cuts, closets, stairs, diagonal layout, herringbone layout, fragile boards, or if you want spare pieces for repairs. The product label or installer should win if they give a specific overage.',
      },
      {
        question: 'Why does the Flooring Calculator round boxes up?',
        answer:
          'Flooring is bought in whole boxes. If the math says 10.2 boxes, you still need 11 boxes because stores will not sell 0.2 of a box for most plank or laminate products. Rounding up also helps cover small measuring mistakes.',
      },
      {
        question: 'Where do I find square feet per box?',
        answer:
          'Look on the product label, product page, or carton. Use the square feet per carton or box number, not the size of one plank. If the box says 24 square feet, enter 24.',
      },
      {
        question: 'Does the estimate include stairs, trim, or underlayment?',
        answer:
          'Only if you include those areas or costs yourself. The calculator estimates flooring boxes and optional product cost. It does not price stair noses, transition strips, underlayment, adhesive, tax, delivery, tools, or labor.',
      },
      {
        question: 'Should I buy all boxes at the same time?',
        answer:
          'Yes when you can. Flooring bought later may come from a different dye lot, finish run, or shade batch. Buying the main order together and keeping a little spare material can make future repairs less obvious.',
      },
      {
        question: 'Can I use this for tile or carpet?',
        answer:
          'Use this page for boxed plank, laminate, vinyl, engineered wood, or similar flooring. For tile counts and grout assumptions, use the Tile Calculator. For roll width and square yards, use the Carpet Calculator.',
      },
      {
        question: 'Why do flooring and wallpaper both ask for waste percent?',
        answer:
          'Both materials are sold in whole packages and both create offcuts. Flooring waste covers cuts, damaged boards, pattern direction, and future repairs. Wallpaper waste covers trimming, pattern matching, damaged strips, and dye lot safety. The idea is similar, but the best percentage can be different.',
      },
    ],
    useCases: [
      'Estimate laminate, vinyl plank, engineered wood, or boxed flooring.',
      'Add waste before buying boxes.',
      'Compare product box coverage values.',
      'Estimate material cost when you know price per box.',
    ],
    examples: [
      { label: 'Living room', expression: '240 ft2, 10% waste, 24 ft2/box, $48/box', result: '11 boxes, 264 ft2 ordered, about $528' },
      { label: 'Small bedroom', expression: '120 ft2, 8% waste, 22.5 ft2/box', result: '6 boxes, 135 ft2 ordered' },
      { label: 'Whole level', expression: '850 ft2, 12% waste, 20 ft2/box', result: '48 boxes, 960 ft2 ordered' },
    ],
    relatedSlugs: ['wallpaper-calculator', 'area-calculator', 'carpet-calculator', 'paint-calculator'],
  }),
  makeUtilityTool({
    slug: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    category: 'home-projects',
    summary: 'Figure out how many wallpaper rolls to buy, plus rough material cost when you add a roll price.',
    description:
      'Estimate how many wallpaper rolls to buy from room size, doors, windows, roll coverage, pattern repeat, waste percent, and optional roll price.',
    seoTitle: 'Wallpaper Calculator: Rolls, Pattern Repeat, and Cost',
    seoDescription:
      'Estimate wallpaper rolls from room size, roll coverage, pattern repeat, waste percent, one-wall projects, and optional roll price.',
    icon: 'calculator-wallpaper',
    aliases: ['Wallpaper Roll Calculator', 'Wall Covering Calculator'],
    formula:
      'The calculator finds wall area from room perimeter and height, subtracts estimated doors and windows, adds waste, divides by roll coverage, rounds up, and multiplies by roll price when entered.',
    limit:
      'Wallpaper needs can change with pattern repeat, usable roll yield, accent walls, odd wall shapes, trimming, damaged strips, product returns, and dye lots.',
    inputExplanations: [
      { term: 'Room length and width', meaning: 'the two pairs of walls used to estimate total wall area from room perimeter.' },
      { term: 'Wall height', meaning: 'the average height from the floor or baseboard to the ceiling, trim, or stopping point.' },
      { term: 'Doors and windows', meaning: 'standard openings subtracted from wall area before waste is added.' },
      { term: 'Roll coverage', meaning: 'usable square feet one roll covers; use the product label before trying to calculate it from roll width and roll length.' },
      { term: 'Waste percent', meaning: 'extra wallpaper for trimming, matching patterns, damaged strips, corners, and mistakes.' },
      { term: 'Price per roll', meaning: 'optional roll price used only for a rough material cost before tax, shipping, paste, tools, or labor.' },
    ],
    extraFaq: [
      {
        question: 'What is waste percent in the Wallpaper Calculator?',
        answer:
          'Waste percent is extra wallpaper added before the roll count is rounded up. It covers the pieces you cut off at the ceiling and baseboard, strips that need to shift so the pattern lines up, damaged pieces, and small measuring mistakes. If the wall math says you need 300 square feet and you enter 10% waste, the calculator plans for 330 square feet before dividing by roll coverage.',
      },
      {
        question: 'How much waste percent should I use for wallpaper?',
        answer:
          'Use 10% as a simple starting point for plain, random-match, or easy peel-and-stick wallpaper. Use about 15% when there is a normal pattern repeat or several corners and openings. Use 20% or more for large pattern repeats, drop matches, older uneven walls, or if you want spare paper for repairs. The product label and installer advice should win when they give a specific number.',
      },
      {
        question: 'What does roll coverage mean?',
        answer:
          'Roll coverage is the usable square feet from one roll or bolt. Do not guess this from the roll size if the product page already gives coverage, because pattern repeat can lower the amount that actually lands on the wall. Some products are priced as single rolls but shipped as double rolls, so check whether the coverage number belongs to the roll you are buying.',
      },
      {
        question: 'Why can pattern repeat change the roll count?',
        answer:
          'A repeating pattern has to line up from strip to strip. That means a strip may need to be cut longer than the wall height so the design starts in the right place. The extra cut-off part is not a mistake; it is the cost of making the pattern match instead of looking shifted.',
      },
      {
        question: 'What if I only know the roll width and roll length?',
        answer:
          'Multiply roll width by roll length only as a fallback. The better input is the usable coverage printed on the wallpaper label or product page, because sellers may list single rolls, double rolls, bolts, or coverage after pattern repeat. If the label says one roll covers 56 square feet, use 56 even if the raw width times length looks different.',
      },
      {
        question: 'Can I use inches in the Wallpaper Calculator?',
        answer:
          'The room fields use feet, so convert inches to feet before entering them. Divide inches by 12. For example, 108 inches is 9 feet. If you only have roll width and roll length in inches, convert both to feet before multiplying them, or use the usable roll coverage from the product label when it is listed.',
      },
      {
        question: 'How much wallpaper do I need for a 12 x 12 room?',
        answer:
          'A 12 x 12 room with 8-foot walls has about 384 square feet of wall area before openings. One standard door and two standard windows bring that to about 334 square feet. With 10% waste, the calculator plans for about 367 square feet. If each roll covers 56 square feet, that rounds up to 7 rolls.',
      },
      {
        question: 'How should I handle an accent wall?',
        answer:
          'For one accent wall, do not enter the whole room unless all walls are being covered. Estimate that wall area separately, subtract major openings if needed, then use the roll coverage and waste percent from the wallpaper you plan to buy. If the accent wall has a large pattern, keep the waste percent higher than a plain texture.',
      },
      {
        question: 'Should I subtract doors and windows?',
        answer:
          'For a rough estimate, subtracting standard doors and windows keeps the roll count from getting too high. For peel-and-stick or patterned wallpaper, some stores advise not subtracting openings because you still cut around them and may need full-height strips. If you are close to the next roll, it is usually safer to round up.',
      },
      {
        question: 'Why should wallpaper rolls come from the same lot or batch?',
        answer:
          'Wallpaper can have tiny color differences between print runs. The lot, run, or batch number helps you buy rolls printed together. If you buy more later from a different lot, the pattern may be correct but the color can still look slightly off on the wall.',
      },
      {
        question: 'Can the Wallpaper Calculator estimate cost?',
        answer:
          'Yes. Add a price per roll if you want a rough material cost. The calculator multiplies that price by the whole rolls needed, but it does not include tax, shipping, paste, primer, tools, returns, or labor. Use it as a quick shopping check, not a contractor quote.',
      },
    ],
    useCases: [
      'Estimate rolls for a bedroom, office, or powder room.',
      'Subtract common doors and windows from wall area.',
      'Compare roll coverage from different wallpaper products.',
      'Check rough material cost when you know the roll price.',
      'Add waste for pattern matching before buying.',
    ],
    examples: [
      { label: 'Bedroom', expression: '12 x 10 x 8 ft, 1 door, 2 windows, 56 ft2/roll, $42/roll', result: '6 rolls, about $252' },
      { label: 'Small office', expression: '10 x 9 x 8 ft, 1 door, 1 window, 48 ft2/roll, 12% waste', result: '7 rolls, about 301 ft2 with waste' },
      { label: 'Accent wall plan', expression: '96 ft2 wall, 56 ft2/roll, 15% waste', result: '2 rolls' },
    ],
    relatedSlugs: ['paint-calculator', 'drywall-calculator', 'flooring-calculator', 'square-footage-calculator'],
  }),
  makeUtilityTool({
    slug: 'fence-calculator',
    name: 'Fence Calculator',
    category: 'home-projects',
    summary: 'Estimate fence panels and posts from perimeter, panel width, post spacing, and gates.',
    description:
      'Use this free fence calculator to estimate panels, line posts, gate posts, and fence run from a simple perimeter layout.',
    seoTitle: 'Fence Calculator | Panels, Posts, Gates',
    seoDescription:
      'Estimate fence run after gates, panels, line posts, gate posts, and total posts from perimeter, panel width, post spacing, and gate openings.',
    icon: 'calculator-fence',
    aliases: [
      'Fence Material Calculator',
      'Fence Panel Calculator',
      'Fence Post Calculator',
      'Wood Fence Calculator',
      'Privacy Fence Calculator',
      'Fence Estimate Calculator',
    ],
    formula:
      'The calculator uses fence run after gates = perimeter - gate count x gate width, panels needed = ceiling(fence run after gates / panel width), line posts = ceiling(fence run after gates / post spacing) + 1, gate posts = gate count x 2, and total posts = line posts + gate posts.',
    limit:
      'This is a rough panel-and-post count. Real fences also need corner posts, end posts, brace posts, terminal posts, pickets, rails, concrete, gravel, fasteners, post caps, gate hardware, slope handling, utility marking, permits, setbacks, wind exposure, soil checks, and local code review.',
    faqLanguage: {
      expectedInputs: 'fence perimeter, panel width, post spacing, gate count, and gate width',
      examplePhrase: 'fence material example',
      doubleCheck:
        'Also check corner posts, end posts, brace posts, terminal posts, rails, pickets, concrete, fasteners, gate hardware, utilities, setbacks, and local code before buying.',
    },
    inputExplanations: [
      { term: 'Perimeter', meaning: 'the total fence path length before gate openings are removed.' },
      { term: 'Panel width', meaning: 'the width of one fence panel or bay before cuts.' },
      { term: 'Post spacing', meaning: 'the maximum distance between line posts based on the material or rail span.' },
      { term: 'Gate count and width', meaning: 'openings that reduce panel run and usually need two gate posts per gate.' },
    ],
    extraFaq: [
      {
        question: 'What does the Fence Calculator include?',
        answer:
          'It estimates fence run after gates, panels needed, line posts, gate posts, and total posts. It does not directly count pickets, rails, concrete bags, screws, brackets, post caps, or gate hardware.',
      },
      {
        question: 'How does gate width change the fence estimate?',
        answer:
          'Gate openings are subtracted from the panel run, so fewer panels may be needed. Each gate also adds two gate posts in this simple estimate, because a gate usually needs a post on each side.',
      },
      {
        question: 'What post spacing should I enter?',
        answer:
          'Use the spacing allowed by the fence panel, rail, or manufacturer instructions. Eight feet is common for many wood layouts, but heavy gates, wind, slopes, and local rules can require a shorter span.',
      },
      {
        question: 'Does this count corner, end, and brace posts?',
        answer:
          'Not separately. The line-post count is a simple run estimate. Corners, ends, brace assemblies, terminal posts, transitions, and gate loads may require extra or stronger posts.',
      },
      {
        question: 'Does this estimate individual pickets and rails?',
        answer:
          'No. If you are building from loose pickets, use the panel result as a bay count, then calculate pickets from picket width, gap, fence height, rail layout, and waste.',
      },
      {
        question: 'Should I add extra panels or posts?',
        answer:
          'Usually yes for real jobs. Extra material helps with cuts, damaged boards, bad pickets, layout changes, and small measuring mistakes. Keep the calculator result as the clean starting count.',
      },
      {
        question: 'Does slope or uneven ground change the count?',
        answer:
          'It can. Stepped panels, racked panels, grade changes, short sections, and custom cuts can change panel count and post placement. Mark the real fence line before ordering.',
      },
    ],
    useCases: [
      'Estimate panels for a backyard fence.',
      'Plan post counts from a chosen spacing.',
      'Account for one or more gates.',
      'Compare 6-foot and 8-foot panel layouts.',
      'Separate panel and post counts from pickets, rails, concrete, and hardware.',
      'Check whether gate openings change the number of panels needed.',
    ],
    examples: [
      { label: 'Backyard fence', expression: '120 ft perimeter, 8 ft panels, 8 ft post spacing, 1 gate at 4 ft', result: '116 ft run, 15 panels, 18 total posts' },
      { label: 'Two gates', expression: '180 ft perimeter, 6 ft panels, 6 ft post spacing, 2 gates at 4 ft', result: '172 ft run, 29 panels, 34 total posts' },
      { label: 'Small side yard', expression: '48 ft run, 8 ft panels, 8 ft post spacing, no gate', result: '48 ft run, 6 panels, 7 total posts' },
      { label: 'Long privacy run', expression: '150 ft perimeter, 8 ft panels, 8 ft post spacing, 2 gates at 4 ft', result: '142 ft run, 18 panels, 23 total posts' },
    ],
    relatedSlugs: ['distance-calculator', 'square-footage-calculator', 'paint-calculator'],
  }),
  makeUtilityTool({
    slug: 'deck-cost-calculator',
    name: 'Deck Cost Calculator',
    category: 'home-projects',
    summary: 'Estimate rough deck project cost from deck size, decking price, railing, stairs, and waste.',
    description:
      'Use this free deck cost calculator to estimate rough decking, railing, stair allowance, and total project cost from simple inputs.',
    seoTitle: 'Deck Cost Calculator | Size, Railing, Stairs, Waste',
    seoDescription:
      'Estimate a rough deck project budget from deck size, decking cost per square foot, waste, railing length, railing cost, and stairs.',
    icon: 'calculator-deck',
    aliases: [
      'Deck Calculator',
      'Decking Cost Calculator',
      'Deck Building Cost Calculator',
      'Deck Estimate Calculator',
      'Composite Deck Cost Calculator',
      'Deck Material Cost Calculator',
    ],
    formula:
      'The calculator uses deck area = length x width, adjusted decking area = deck area x (1 + waste percent / 100), decking cost = adjusted decking area x deck cost per square foot, railing cost = railing linear feet x railing cost per foot, and rough total = decking cost + railing cost + stair allowance.',
    limit:
      'This is an early planning estimate, not a contractor quote. Framing, footings, posts, beams, joists, ledgers, fasteners, rail code, permits, demolition, height, stairs, labor, taxes, delivery, material grade, and location can change the real price a lot.',
    faqLanguage: {
      expectedInputs: 'deck length, width, waste percent, decking cost per square foot, railing length, railing cost, and stairs allowance',
      examplePhrase: 'deck budget example',
      doubleCheck:
        'Also check whether your price per square foot is material-only or installed, because labor, framing, footings, permits, and demolition can be bigger than the visible decking surface.',
    },
    inputExplanations: [
      { term: 'Decking waste percent', meaning: 'extra surface material for board cuts, layout choices, and mistakes.' },
      { term: 'Decking cost per square foot', meaning: 'the surface material cost only, unless you intentionally use an installed-price number.' },
      { term: 'Railing and stairs', meaning: 'separate rough allowances added after the deck surface estimate because they often swing the budget.' },
    ],
    extraFaq: [
      {
        question: 'What does the Deck Cost Calculator include?',
        answer:
          'It includes the deck surface cost, railing cost, and a stair allowance from the numbers you enter. It does not automatically price framing, footings, permits, demolition, delivery, taxes, or contractor labor unless you build those into your inputs.',
      },
      {
        question: 'Should deck cost per square foot be material-only or installed?',
        answer:
          'Use material-only pricing if you only want to estimate the visible decking surface. Use an installed-price number only when you already have one from a local contractor or supplier and want the calculator to act like a quick budget sheet.',
      },
      {
        question: 'How does waste percent affect a deck estimate?',
        answer:
          'Waste adds extra square footage before the decking cost is multiplied. A 16 ft by 12 ft deck is 192 square feet; with 10% waste, the calculator prices 211.2 square feet of decking surface.',
      },
      {
        question: 'Why are railings and stairs separate?',
        answer:
          'Railings and stairs can cost very different amounts from the main deck boards. A low platform might need no railing, while a raised deck with stairs can need posts, guards, hardware, landings, and more labor.',
      },
      {
        question: 'Why can a contractor quote be much higher?',
        answer:
          'A real quote may include structure, permits, site work, demolition, footings, framing, hardware, rail code, stairs, cleanup, insurance, overhead, and local labor. The calculator is for early planning, not final ordering.',
      },
      {
        question: 'Can this calculator compare wood and composite decking?',
        answer:
          'Yes. Run the same deck size twice with different cost-per-square-foot inputs. Keep the other inputs the same so you can see how much the surface material changes the rough total.',
      },
    ],
    useCases: [
      'Create a rough deck material budget.',
      'Compare different decking cost assumptions.',
      'Add railing and stair allowances to a surface estimate.',
      'Discuss scope before requesting contractor quotes.',
      'Test wood, composite, and railing choices before asking for bids.',
    ],
    examples: [
      { label: 'Small deck', expression: '16 x 12 ft, $12/ft2 decking, 10% waste, 40 ft railing at $35/ft, $750 stairs', result: '$4,684.40 rough total' },
      { label: 'Larger deck', expression: '24 x 14 ft, $18/ft2 decking, 10% waste, 58 ft railing at $45/ft, $1,200 stairs', result: '$10,062.80 rough total' },
      { label: 'No railing pad', expression: '12 x 10 ft, $10/ft2 decking, 5% waste, no railing, no stairs', result: '$1,260.00 rough total' },
      { label: 'Composite comparison', expression: '16 x 12 ft, $22/ft2 decking, 10% waste, same railing and stairs', result: '$6,796.40 rough total' },
    ],
    relatedSlugs: ['area-calculator', 'square-footage-calculator', 'fence-calculator'],
  }),
  makeUtilityTool({
    slug: 'deck-board-calculator',
    name: 'Deck Board Calculator',
    category: 'home-projects',
    summary: 'Estimate deck boards, fastener rows, deck screws, and optional board cost from deck and board dimensions.',
    description:
      'Use this free deck board calculator to estimate deck board count, fastener rows, screw count, and optional board cost from deck size, actual board width, joist spacing, and waste.',
    seoTitle: 'Deck Board Calculator | Boards, Screws, Cost',
    seoDescription:
      'Estimate deck boards, fastener rows, screws, and optional board cost from deck size, actual board width, joist spacing, and waste.',
    icon: 'calculator-deck-board',
    aliases: [
      'Decking Calculator',
      'Deck Flooring Calculator',
      'Decking Board Calculator',
      'Deck Board Count Calculator',
      'Decking Material Calculator',
      'Deck Boards Needed Calculator',
      '5/4 Deck Board Calculator',
    ],
    formula:
      'The calculator uses deck area = deck length x deck width, adjusted area = deck area x (1 + waste percent / 100), board coverage = board length x actual board width / 12, boards needed = ceiling(adjusted area / board coverage), fastener rows = floor(deck length x 12 / joist spacing) + 1, and screws = boards needed x fastener rows x 2.',
    limit:
      'This is a straight rectangular deck-surface estimate, not a full deck plan. Board gaps, diagonal layouts, picture frames, breaker boards, stairs, fascia, borders, hidden fastener clips, blocking, stock lengths, manufacturer rules, and local code can change the real material list.',
    faqLanguage: {
      expectedInputs: 'deck length, deck width, board length, actual board width, joist spacing, waste percent, and optional price per board',
      inputFallback:
        'Enter the rectangular deck size in feet, the purchased board length in feet, the actual board face width in inches, joist spacing in inches, and a waste percent for cuts and layout changes.',
      examplePhrase: '16 x 12 deck example',
      doubleCheck:
        'Also check the board gap, picture-frame borders, breaker boards, stair boards, fascia, hidden fastener system, stock lengths, and local building rules before buying.',
    },
    inputExplanations: [
      { term: 'Deck length and width', meaning: 'the rectangular deck surface area before waste is added.' },
      { term: 'Board length and width', meaning: 'the coverage of one deck board. Use actual face width, not only the nominal board name.' },
      { term: 'Joist spacing', meaning: 'the on-center distance between joists, used to estimate fastener rows.' },
      { term: 'Waste percent', meaning: 'extra boards for cuts, starter pieces, layout changes, and damaged boards.' },
      { term: 'Price per board', meaning: 'optional cost for one board, used only for the rough board-cost line.' },
    ],
    extraFaq: [
      {
        question: 'How many deck boards do I need for a 16 x 12 deck?',
        answer:
          'With 16 ft boards, 5.5 in actual board width, 16 in joist spacing, and 10% waste, the calculator estimates 29 boards. The same example shows 13 fastener rows, 754 deck screws, and $522 if each board costs $18.',
      },
      {
        question: 'Why does the Deck Board Calculator ask for actual board width?',
        answer:
          'Deck boards are often sold with a nominal size that is not the exact face width. The calculator needs the width that actually covers the deck surface because a small width difference can change the board count on a large deck.',
      },
      {
        question: 'Does this include the gap between deck boards?',
        answer:
          'Not as a separate field. The calculator divides by the actual board face width you enter. Board-gap layout still matters for the real installed surface, edge boards, and cut planning, so check the manufacturer gap instructions before ordering.',
      },
      {
        question: 'What does joist spacing change?',
        answer:
          'Joist spacing changes the fastener-row and screw estimate. It does not change the board count in this tool, because board count comes from deck area, board coverage, and waste.',
      },
      {
        question: 'What does the screw count mean?',
        answer:
          'The screw count is a planning estimate using two screws at each board-and-joist crossing. Hidden fasteners, clips, perimeter boards, stairs, blocking, and manufacturer instructions can change the real fastener list.',
      },
      {
        question: 'Can this estimate diagonal deck boards?',
        answer:
          'Use it only as a rough starting point for diagonal decking. Diagonal layouts usually create more angled cuts and can need a higher waste percent, different board lengths, or a detailed takeoff.',
      },
      {
        question: 'Does this include picture-frame or breaker boards?',
        answer:
          'No. The count is for a simple field of straight boards across a rectangular surface. Picture frames, borders, breaker boards, fascia, stairs, and feature strips should be counted separately.',
      },
      {
        question: 'Why add waste percent?',
        answer:
          'Waste covers board cuts, starter pieces, damaged boards, layout adjustments, and small measuring errors. A zero-waste estimate can look neat on screen but leave you short when boards need to be cut to fit.',
      },
      {
        question: 'Is the estimated board cost a contractor quote?',
        answer:
          'No. The cost line is only boards needed times your price per board. It does not include framing, joists, posts, beams, railings, stairs, fasteners, delivery, tools, permits, labor, taxes, or code-required changes.',
      },
    ],
    useCases: [
      'Estimate deck boards for a simple rectangular deck.',
      'Compare 12-foot, 16-foot, and 20-foot board layouts.',
      'Plan a rough deck screw count from joist spacing.',
      'Add a waste allowance before pricing boards.',
      'Check whether a wider board changes the board count.',
      'Estimate board-only material cost before using a full deck cost calculator.',
    ],
    examples: [
      { label: '16 x 12 deck', expression: '16 x 12 ft deck, 16 ft boards, 5.5 in actual width, 16 in joists, 10% waste, $18/board', result: '29 boards, 13 rows, 754 screws, $522' },
      { label: 'Small landing', expression: '10 x 8 ft deck, 12 ft boards, 5.5 in actual width, 12% waste', result: '17 boards and 272 screws' },
      { label: 'Wide boards', expression: '20 x 14 ft deck, 16 ft boards, 7.25 in actual width, 8% waste, $32/board', result: '32 boards, 16 rows, 1,024 screws, $1,024' },
      { label: 'Tighter joists', expression: '16 x 16 ft deck, 16 ft boards, 5.5 in actual width, 12 in joists, 10% waste', result: '39 boards and 1,326 screws' },
    ],
    relatedSlugs: ['deck-cost-calculator', 'stair-calculator', 'plywood-calculator'],
  }),
  makeUtilityTool({
    slug: 'deck-stain-calculator',
    name: 'Deck Stain Calculator',
    category: 'home-projects',
    summary: 'Estimate deck stain gallons from deck size, railings, steps, coat count, coverage, and waste.',
    seoTitle: 'Deck Stain Calculator | Estimate Stain Gallons',
    seoDescription:
      'Estimate deck stain gallons from deck size, railings, stairs, coats, label coverage, waste, and optional price per gallon.',
    description:
      'Use this free deck stain calculator to estimate stain gallons and optional cost from deck surface area, railing area, stairs, coats, label coverage, and waste.',
    icon: 'calculator-deck-stain',
    aliases: [
      'Deck Sealer Calculator',
      'Deck Paint Calculator',
      'Deck Stain Coverage Calculator',
      'How Much Stain Do I Need For My Deck',
      'Deck Stain Gallon Calculator',
      'Deck Sealer Coverage Calculator',
      'Deck Railing Stain Calculator',
    ],
    formula:
      'Deck surface = deck length x deck width. Railing area = railing length x railing height x 2. Step area = step count x step width x ((step depth + riser height) / 12). Total surface = deck surface + railing area + step area. Surface with waste = total surface x (1 + waste percent / 100). Coat-adjusted area = surface with waste x coats. Exact gallons = coat-adjusted area / coverage per gallon. Gallons to buy = ceiling(exact gallons).',
    limit:
      'Real stain coverage changes with wood age, roughness, previous finish, sprayer loss, rail details, board condition, product solids, weather, prep work, and the exact product label. This is a buying estimate, not a finish-performance guarantee.',
    inputExplanations: [
      { term: 'Deck length and width', meaning: 'the flat walking surface of the deck in feet.' },
      { term: 'Railing length and height', meaning: 'the rail run and average rail height. The calculator counts both sides for a rough coating estimate.' },
      { term: 'Step details', meaning: 'the number of steps plus tread depth, riser height, and width. Treads and risers are counted together.' },
      { term: 'Coverage per gallon', meaning: 'the square feet one gallon covers according to the stain product label. Use a lower number for rough or thirsty wood.' },
      { term: 'Coats', meaning: 'how many full applications you plan to apply. Follow the stain label because more stain is not always better.' },
      { term: 'Waste percent', meaning: 'extra stain for board edges, overlap, rough spots, drips, sprayer loss, rail details, and touch-ups.' },
      { term: 'Price per gallon', meaning: 'optional material price for one gallon. The cost line does not include cleaner, stripper, brushes, pads, tape, tarps, or labor.' },
    ],
    extraFaq: [
      {
        question: 'Should I enter one coat or two coats?',
        answer:
          'Use the coat count from the stain label. Some products need one coat, some recommend two thin coats, and some warn against over-application. The calculator multiplies the surface area by your coat count.',
      },
      {
        question: 'How much stain does the default 16 x 12 deck need?',
        answer:
          'With a 16 x 12 ft deck, 40 ft of 3 ft railing, 4 steps, 2 coats, 200 sq ft per gallon coverage, 10% waste, and $45 per gallon, the calculator estimates 456 sq ft of surface, 501.6 sq ft with waste, 1,003.2 coat-adjusted sq ft, 5.016 exact gallons, 6 gallons to buy, and $270 in stain.',
      },
      {
        question: 'Why does railing get counted on both sides?',
        answer:
          'A railing usually has an inside face and an outside face. The calculator uses railing length x railing height x 2 so the estimate does not count only one visible side. Detailed balusters, posts, caps, and lattice can still use more stain.',
      },
      {
        question: 'Does the calculator include stair treads and risers?',
        answer:
          'Yes. Step area uses step count x step width x (tread depth + riser height). It is a rough coating area for simple stairs, not a detailed count for stringers, rail posts, landings, trim, or stair undersides.',
      },
      {
        question: 'Why can old wood need more stain?',
        answer:
          'Older, rough, dry, or weathered wood can absorb more finish than smooth new boards. If your deck is thirsty, has railings, or has lots of edges, use a lower coverage number or a higher waste percent.',
      },
      {
        question: 'What coverage number should I enter?',
        answer:
          'Start with the coverage number on the product label or technical sheet. If the label gives a first-coat and second-coat range, use the number that matches your deck condition and coat plan. Rough wood usually needs a more conservative coverage number than smooth wood.',
      },
      {
        question: 'Does sprayer application change the estimate?',
        answer:
          'It can. Sprayers can lose stain to overspray, wind, masking, and uneven rail details. If you spray, add waste or use a lower coverage number unless the product instructions give a clear sprayer coverage rate.',
      },
      {
        question: 'Can I use this as a deck paint calculator?',
        answer:
          'Only as a rough quantity estimate if your deck paint or solid stain label gives coverage per gallon. Paint-like coatings may have different prep, coat, dry-time, and slip warnings, so follow the product instructions before applying.',
      },
      {
        question: 'Does this include deck cleaner, stripper, or brushes?',
        answer:
          'No. The optional cost line is gallons to buy times price per gallon. Cleaners, brighteners, strippers, sandpaper, brushes, pads, rollers, sprayer supplies, drop cloths, tape, and labor are separate.',
      },
      {
        question: 'When should I not rely on the gallon estimate by itself?',
        answer:
          'Do not rely on it alone when the deck has peeling finish, wet wood, heavy mildew, unusual rails, lattice, built-in benches, multiple colors, or product-specific prep rules. Measure those surfaces separately and read the label before buying.',
      },
    ],
    useCases: [
      'Estimate gallons before staining a deck surface.',
      'Include railings and stairs in the surface area.',
      'Compare one-coat and two-coat products.',
      'Test label coverage numbers before buying stain.',
      'Add price per gallon for a rough material cost.',
      'Plan a little extra for rough boards, rail details, and touch-ups.',
    ],
    examples: [
      { label: 'Deck with rails', expression: '16 x 12 ft deck, 40 ft railing, 4 steps, 2 coats, 200 sq ft/gal, 10% waste, $45/gal', result: '456 ft2 surface, 1,003.2 coat-adjusted ft2, 6 gallons, $270' },
      { label: 'Platform deck', expression: '12 x 10 ft deck, no railing, 1 coat, 250 sq ft/gal, 8% waste', result: '129.6 coat-adjusted ft2, 1 gallon' },
      { label: 'Large rough deck', expression: '24 x 14 ft deck, 60 ft railing, 5 steps, 2 coats, 175 sq ft/gal, 15% waste, $55/gal', result: '908.213 ft2 with waste, 11 gallons, $605' },
      { label: 'Rail-heavy refresh', expression: '14 x 10 ft deck, 52 ft railing, no stairs, 1 coat, 225 sq ft/gal, 12% waste', result: '467.6 coat-adjusted ft2, 3 gallons' },
    ],
    relatedSlugs: ['deck-board-calculator', 'paint-calculator', 'fence-calculator'],
  }),
  makeUtilityTool({
    slug: 'baluster-calculator',
    name: 'Baluster Calculator',
    category: 'home-projects',
    summary: 'Estimate deck railing baluster count and equal open spacing after posts are subtracted from the rail run.',
    seoTitle: 'Baluster Calculator | Deck Railing Spacing',
    seoDescription:
      'Estimate balusters for a straight rail section from rail length, post width, baluster width, and max open gap, then see the actual equal spacing.',
    description:
      'Use this free baluster calculator to estimate how many balusters a straight rail section needs and how much equal open space will be left between them.',
    icon: 'calculator-baluster',
    aliases: [
      'Spindle Calculator',
      'Railing Spacing Calculator',
      'Baluster Spacing Calculator',
      'Deck Baluster Calculator',
      'Deck Railing Spacing Calculator',
      'Baluster Gap Calculator',
      'Picket Spacing Calculator',
    ],
    formula:
      'Clear opening in inches = rail length in feet x 12 - post count x post width. Balusters needed = ceiling((clear opening - max open spacing) / (baluster width + max open spacing)). Actual open spacing = (clear opening - balusters needed x baluster width) / (balusters needed + 1).',
    limit:
      'This is layout math for one straight rail section, not a permit, inspection, or structural railing design. Local code, stair guards, handrails, post strength, rail height, bottom-rail openings, product instructions, and inspector requirements still need a real code check.',
    inputExplanations: [
      { term: 'Rail length', meaning: 'the full straight rail run in feet before the calculator subtracts post widths.' },
      { term: 'Post width and count', meaning: 'the posts inside that run. Their combined width is removed from the clear opening.' },
      { term: 'Baluster width', meaning: 'the actual visible width of one spindle, picket, or metal baluster in inches.' },
      { term: 'Max open spacing', meaning: 'the largest open gap you are willing to allow between balusters, usually entered as 4 inches or less after checking local rules.' },
    ],
    faqLanguage: {
      expectedInputs: 'rail length in feet, post width and count, baluster width, and the largest open gap you want to allow',
      examplePhrase: 'straight deck rail bay',
      doubleCheck:
        'Double-check the layout against local building code, stair rules, rail height, post attachment details, and the actual baluster product before building.',
    },
    extraFaq: [
      {
        question: 'Why does actual spacing end up smaller than max spacing?',
        answer:
          'The calculator rounds the baluster count up so the gaps do not go over your max spacing. After rounding up, it spreads the remaining open space evenly, so the real spacing is usually a little smaller.',
      },
      {
        question: 'Can this replace local railing code?',
        answer:
          'No. This is layout math only. Local code can control guard height, stair openings, handrails, post strength, and the size of any object that can pass through the railing.',
      },
      {
        question: 'Why do posts reduce the opening length?',
        answer:
          'Posts take up physical space inside the measured rail run. A 10 foot rail with two 3.5 inch posts starts at 120 inches, then loses 7 inches to posts, leaving 113 inches for balusters and gaps.',
      },
      {
        question: 'What max spacing should I enter?',
        answer:
          'Many residential guard layouts use a 4 inch maximum open gap as the planning target, but code language and local adoption can vary. Enter the stricter number your local code, inspector, or product instructions require.',
      },
      {
        question: 'Does this work for stair railings?',
        answer:
          'Use it only as a rough straight-run layout helper for stairs. Stair guards can have angle, tread, riser, triangle-opening, handrail, and local inspection rules that this simple straight-section calculator does not model.',
      },
      {
        question: 'Should I measure baluster width or use the nominal size?',
        answer:
          'Measure the actual visible width when you can. A nominal 2 by 2 wood baluster may be closer to 1.5 inches wide, and that smaller real width changes the count and equal gap.',
      },
      {
        question: 'Why are there gaps at both ends?',
        answer:
          'The calculator treats the clear opening as a repeated pattern: end gap, baluster, gap, baluster, and so on. That creates one more gap than the baluster count, which is why the spacing formula divides by balusters needed plus one.',
      },
      {
        question: 'Can I use fewer balusters if I like wider spacing?',
        answer:
          'Only if the resulting open spaces still satisfy your code and safety requirements. For required guards, wider-looking spacing can fail inspection even if it looks balanced.',
      },
      {
        question: 'What if the opening length comes out zero or negative?',
        answer:
          'That means the post widths are equal to or wider than the rail run you entered. Recheck the measured rail length, post count, and post width before trusting any layout.',
      },
      {
        question: 'How do I mark the layout after calculating it?',
        answer:
          'Use the actual open spacing as the clear gap between adjacent balusters, then mark carefully from one end. For finish work, many builders make a spacer block that matches the calculated gap and still verify the last opening before fastening.',
      },
    ],
    useCases: [
      'Plan balusters for one straight deck rail bay before buying materials.',
      'Check equal spacing after post widths are removed from the measured rail run.',
      'Compare wood, metal, composite, or narrow baluster widths.',
      'Keep the calculated open gaps at or below the spacing limit you enter.',
      'Turn a rough railing sketch into a count you can check against supplier packs.',
    ],
    examples: [
      { label: 'Deck rail bay', expression: '10 ft rail, two 3.5 in posts, 1.5 in balusters, 4 in max gap', result: '113 in opening, 20 balusters, 3.952 in actual spacing' },
      { label: 'Metal rail section', expression: '8 ft rail, two 4 in posts, 0.75 in metal balusters, 4 in max gap', result: '88 in opening, 18 balusters, 3.921 in actual spacing' },
      { label: 'Short stair rail check', expression: '6 ft straight rail run, two 3.5 in posts, 1.25 in balusters, 4 in max gap', result: '65 in opening, 12 balusters, 3.846 in actual spacing' },
      { label: 'Tighter porch rail', expression: '14 ft rail, three 3.5 in posts, 1.5 in balusters, 3.5 in max gap', result: '157.5 in opening, 31 balusters, 3.469 in actual spacing' },
    ],
    relatedSlugs: ['stair-calculator', 'deck-board-calculator', 'fence-calculator'],
  }),
  makeUtilityTool({
    slug: 'paver-calculator',
    name: 'Paver Calculator',
    category: 'home-projects',
    summary: 'Estimate paver count from project area, paver dimensions, and waste percentage.',
    seoTitle: 'Paver Calculator | Count Patio Pavers',
    seoDescription:
      'Estimate how many pavers you need from square feet, paver length, paver width, and waste before buying patio, walkway, or driveway pavers.',
    description:
      'Use this free paver calculator to estimate whole pavers from patio, walkway, path, or driveway-pad area, paver size, and waste percentage.',
    icon: 'calculator-paver',
    aliases: [
      'Patio Paver Calculator',
      'Paving Stone Calculator',
      'Paver Count Calculator',
      'Paver Square Feet Calculator',
      '4x8 Paver Calculator',
      '12x12 Paver Calculator',
    ],
    formula:
      'Paver area in square feet = paver length in inches x paver width in inches / 144. Adjusted area = project area x (1 + waste percent / 100). Pavers needed = ceiling(adjusted area / paver area).',
    limit:
      'This is a top-layer buying count, not a full patio design. Paver projects also need base material, bedding sand, joint sand, edge restraints, cuts, pattern planning, compaction, slope, drainage, soil checks, traffic-load checks, and supplier package rounding.',
    inputExplanations: [
      { term: 'Project area', meaning: 'the finished patio, walkway, path, or driveway-pad surface area before extra pavers are added.' },
      { term: 'Paver length and width', meaning: 'the visible size of one paver in inches. Use the real paver size from the product label when you have it.' },
      { term: 'Waste percent', meaning: 'extra pavers for cuts, broken pieces, border pieces, color matching, and future replacement.' },
    ],
    faqLanguage: {
      expectedInputs: 'the finished square footage, one paver size in inches, and a waste percent for cuts and spare pieces',
      examplePhrase: 'real patio or walkway count',
      doubleCheck:
        'Double-check the final count against the supplier package size, layout pattern, and any base, sand, or edge-restraint plan before buying.',
    },
    extraFaq: [
      {
        question: 'How do I calculate how many pavers I need?',
        answer:
          'Find the project square footage, divide by the square-foot area of one paver, add waste, then round up. A 4 by 8 inch paver covers 32 square inches, or about 0.222 square feet.',
      },
      {
        question: 'How many 4x8 pavers do I need for a 10 by 10 patio?',
        answer:
          'A 10 by 10 patio is 100 square feet. With 10% waste and 4 by 8 inch pavers, the estimate is 495 pavers.',
      },
      {
        question: 'Should I include joint spacing in this paver count?',
        answer:
          'This calculator uses the paver face size only. If wide joints are part of the design, your exact paver count may be lower, but joint sand needs separate checking.',
      },
      {
        question: 'What waste percent should I use for pavers?',
        answer:
          'Use about 10% for a simple rectangle. Use more for curves, diagonal patterns, herringbone layouts, many border cuts, or if you want spare matching pavers for later repairs.',
      },
      {
        question: 'Can I use this for a circle patio or curved path?',
        answer:
          'Yes, if you already know the finished square footage. Curves usually need more cutting, so increase the waste percent and check the layout before ordering.',
      },
      {
        question: 'Does this estimate paver base or bedding sand?',
        answer:
          'No. This calculator estimates paver pieces only. Use the Paver Base Calculator for compacted base and bedding sand, then check edge restraints and drainage separately.',
      },
      {
        question: 'Can I use this for mixed-size paver patterns?',
        answer:
          'Only as a rough total-area check. A mixed-size pattern needs the ratio for each paver size in one pattern repeat, or the supplier layout chart.',
      },
      {
        question: 'Why does the calculator round up?',
        answer:
          'You cannot buy part of a paver, and cut pieces are not always reusable. Rounding up keeps the estimate practical before package-size rounding.',
      },
    ],
    useCases: [
      'Estimate paver count for a patio or walkway.',
      'Compare different paver sizes.',
      'Add waste for cuts and broken pieces.',
      'Prepare a rough count before checking box quantities.',
      'Check whether 4x8, 12x12, or larger pavers change the piece count a lot.',
    ],
    examples: [
      { label: 'Patio pavers', expression: '180 ft2, 8 x 4 in pavers, 10% waste', result: '891 pavers' },
      { label: 'Large pavers', expression: '240 ft2, 12 x 12 in pavers, 8% waste', result: '260 pavers' },
      { label: 'Walkway', expression: '75 ft2, 6 x 9 in pavers, 12% waste', result: '224 pavers' },
      { label: 'Small patio', expression: '100 ft2, 4 x 8 in pavers, 10% waste', result: '495 pavers' },
    ],
    relatedSlugs: ['paver-base-calculator', 'polymeric-sand-calculator', 'gravel-calculator'],
  }),
  makeUtilityTool({
    slug: 'paver-base-calculator',
    name: 'Paver Base Calculator',
    category: 'home-projects',
    summary: 'Estimate gravel base and bedding sand volume for patios, walkways, and paver projects.',
    description:
      'Use this free paver base calculator to estimate compacted gravel base volume, approximate base tons, and bedding sand volume from paver area and layer depths.',
    icon: 'calculator-paver-base',
    aliases: ['Patio Base Calculator', 'Paver Gravel Calculator', 'Paver Sand Base Calculator'],
    formula:
      'The calculator multiplies paver area by base depth and bedding depth, adds waste, converts cubic feet to cubic yards, and estimates base tons from tons per cubic yard.',
    limit:
      'Real paver base design depends on soil, drainage, compaction, freeze-thaw, traffic load, slope, edging, and local installation practice.',
    inputExplanations: [
      { term: 'Base depth', meaning: 'the compacted gravel layer below the pavers.' },
      { term: 'Bedding depth', meaning: 'the leveling sand layer directly under the pavers.' },
      { term: 'Tons per cubic yard', meaning: 'a rough density for converting gravel volume to weight.' },
      { term: 'Waste percent', meaning: 'extra material for compaction, uneven grade, edge loss, and small measurement differences.' },
    ],
    extraFaq: [
      {
        question: 'Is paver base depth the loose depth or compacted depth?',
        answer:
          'Use the compacted depth you want to end with. Loose gravel can settle after compaction, so a real project may need more loose material than the compacted volume suggests.',
      },
      {
        question: 'Why does the calculator separate base and bedding sand?',
        answer:
          'The gravel base supports the pavers, while the bedding sand helps level them. They are different layers, so it is easier to estimate them separately before ordering.',
      },
    ],
    useCases: [
      'Estimate base gravel for a patio or walkway.',
      'Convert base volume into approximate tons.',
      'Estimate bedding sand volume separately.',
      'Add waste for compaction and uneven ground.',
    ],
    examples: [
      { label: 'Patio base', expression: '200 ft2, 4 in base, 1 in bedding, 10% waste', result: '2.716 yd3 base' },
      { label: 'Walkway', expression: '80 ft2, 4 in base, 1 in bedding', result: 'Base and sand estimate' },
      { label: 'Driveway base', expression: '420 ft2, 6 in base, 12% waste', result: 'Base tons' },
    ],
    relatedSlugs: ['paver-calculator', 'gravel-calculator', 'sand-calculator'],
  }),
  makeUtilityTool({
    slug: 'polymeric-sand-calculator',
    name: 'Polymeric Sand Calculator',
    category: 'home-projects',
    summary: 'Estimate polymeric sand volume and bag count from paver area, paver size, joint width, and joint depth.',
    description:
      'Estimate polymeric sand volume and whole bags from finished paver area, paver size, joint width, joint depth, waste, and bag coverage.',
    seoTitle: 'Polymeric Sand Calculator | Pavers, Flagstone, And Bags',
    seoDescription:
      'Estimate polymeric sand bags from square feet, paver or flagstone joint width, joint depth, waste, and bag coverage before checking the product label.',
    icon: 'calculator-polymeric-sand',
    aliases: [
      'Joint Sand Calculator',
      'Paver Sand Calculator',
      'Polymeric Joint Sand Calculator',
      'polymeric sand calculator square feet',
      'polymeric sand calculator for pavers',
      'polymeric sand calculator for flagstone',
      'paver sand calculator square feet',
      '50 lb bag polymeric sand calculator',
    ],
    formula:
      'The calculator estimates paver count from area and paver size, estimates joint volume from paver edges, adds waste, then divides by bag coverage.',
    limit:
      'This is a planning estimate. Irregular pavers, flagstone shapes, old joint cleanup, wide joints, deep joints, product coverage, sweeping loss, watering, and installation method can change the actual bag count.',
    inputExplanations: [
      { term: 'Paver area', meaning: 'the finished paver area in square feet, such as a patio, walkway, or flagstone section.' },
      { term: 'Joint width', meaning: 'the average gap between pavers or flagstone pieces.' },
      { term: 'Joint depth', meaning: 'how deep the sand needs to fill the joints.' },
      { term: 'Bag coverage', meaning: 'the cubic feet one bag fills, or the coverage number you convert from the product label.' },
      { term: 'Waste percent', meaning: 'extra sand for sweeping loss, uneven joints, and touch-ups.' },
    ],
    extraFaq: [
      {
        question: 'Why is polymeric sand hard to estimate exactly?',
        answer:
          'The gaps between pavers are not always perfect rectangles. Paver shape, joint width, joint depth, old sand left in the joints, and sweeping technique all change how much sand actually fits.',
      },
      {
        question: 'Should I use the bag coverage or the calculator volume?',
        answer:
          'Use the bag coverage from the product label when you have it. The calculator volume helps you understand the math, but the exact product label is the number to check before buying.',
      },
      {
        question: 'Can I use this for pavers or flagstone?',
        answer:
          'Yes, as a rough estimate. Rectangular pavers fit the math best. Flagstone and random stone joints are less even, so measure a few real joints, use a higher waste percent, and check the product instructions.',
      },
      {
        question: 'What if the bag lists square-foot coverage instead of cubic feet?',
        answer:
          'Use the square-foot coverage as a reality check. A 50 lb bag may cover very different areas depending on joint width, joint depth, and paver shape. If the label gives a calculator or chart, check it before buying.',
      },
      {
        question: 'Why do joint width and joint depth matter so much?',
        answer:
          'A small change in the gap can change the bag count fast. Wider or deeper joints hold more sand, and shallow joints may not match the product instructions.',
      },
      {
        question: 'Should old polymeric sand be removed first?',
        answer:
          'For repairs, old joints may already contain some sand or debris. Clean the joints to the depth required by the product, then measure the space you actually need to refill.',
      },
      {
        question: 'Does the calculator tell me how to install the sand?',
        answer:
          'No. It estimates quantity only. Follow the bag instructions for dry pavers, sweeping, compacting, cleaning dust, watering, curing time, and rain protection.',
      },
    ],
    useCases: [
      'Estimate polymeric sand for a paver patio.',
      'Compare narrow and wide joint projects.',
      'Plan bag count from product coverage.',
      'Add waste for sweeping loss and touch-ups.',
    ],
    examples: [
      { label: 'Standard paver patio', expression: '200 ft2, 8 x 4 in pavers, 1/4 in joints, 1 in deep, 0.5 ft3 per bag', result: '1.72 ft3, 4 bags' },
      { label: 'Wide walkway joints', expression: '120 ft2, 6 x 9 in pavers, 3/8 in joints, 1.25 in deep, 0.45 ft3 per bag', result: '1.46 ft3, 4 bags' },
      { label: 'Flagstone check', expression: '180 ft2, uneven joints, 50 lb bag label coverage', result: 'Measure real joints and check the product label' },
    ],
    relatedSlugs: ['paver-calculator', 'paver-base-calculator', 'sand-calculator'],
  }),
  makeUtilityTool({
    slug: 'grass-seed-calculator',
    name: 'Grass Seed Calculator',
    category: 'home-projects',
    summary: 'Estimate grass seed pounds, bags, and optional cost from lawn area, seed rate, waste, and bag size.',
    description:
      'Use this free grass seed calculator to estimate seed pounds, bags to buy, and optional cost from lawn area, seed label rate, waste percent, and bag weight.',
    icon: 'calculator-grass-seed',
    aliases: ['Lawn Seed Calculator', 'Grass Seed Bag Calculator', 'Overseeding Calculator'],
    formula:
      'The calculator adds waste to lawn area, multiplies by the seed rate per 1,000 square feet, then divides by bag weight and rounds up to whole bags.',
    limit:
      'Seed needs depend on grass type, new lawn versus overseeding, soil prep, shade, slope, spreader setting, climate, and seed label instructions.',
    inputExplanations: [
      { term: 'Seed rate', meaning: 'the pounds of seed recommended per 1,000 square feet on the seed label.' },
      { term: 'Lawn area', meaning: 'the measured area you want to seed or overseed.' },
      { term: 'Bag weight', meaning: 'how many pounds one seed bag contains.' },
      { term: 'Waste percent', meaning: 'extra seed for overlap, missed strips, bare spots, and uneven spreading.' },
    ],
    extraFaq: [
      {
        question: 'Why are new lawn and overseeding rates different?',
        answer:
          'A new lawn needs seed over bare soil, so the rate is usually higher. Overseeding fills in an existing lawn, so the label rate is often lower. Use the rate that matches your job.',
      },
      {
        question: 'Should I round up grass seed bags?',
        answer:
          'Yes. Seed is sold by bag size, and small bare spots often need a little extra. The calculator rounds bags up so you do not plan to buy part of a bag.',
      },
    ],
    useCases: [
      'Estimate seed for a new lawn.',
      'Estimate seed for overseeding.',
      'Convert seed label rates into pounds and bags.',
      'Add optional bag price for material cost.',
    ],
    examples: [
      { label: 'New lawn seed', expression: '5,000 ft2, 6 lb / 1,000 ft2, 5% waste', result: '31.5 lb' },
      { label: 'Overseeding', expression: '3,000 ft2, 3 lb / 1,000 ft2', result: 'Seed pounds and bags' },
      { label: 'Patch repair', expression: '400 ft2, 5 lb / 1,000 ft2, 3 lb bag', result: '1 bag' },
    ],
    relatedSlugs: ['sod-calculator', 'lawn-mowing-calculator', 'area-calculator'],
  }),
  makeUtilityTool({
    slug: 'lawn-mowing-calculator',
    name: 'Lawn Mowing Calculator',
    category: 'home-projects',
    summary: 'Estimate lawn mowing time from lawn area, mower width, mowing speed, and efficiency.',
    description:
      'Use this free lawn mowing calculator to estimate mowing minutes and hours from lawn area, mower cutting width, average speed, and real-world efficiency.',
    icon: 'calculator-lawn-mowing',
    aliases: ['Mowing Time Calculator', 'Lawn Cutting Time Calculator', 'Mower Time Calculator'],
    formula:
      'The calculator converts mower width to feet, multiplies by speed in feet per hour, applies efficiency, then divides lawn area by the mowing rate.',
    limit:
      'Mowing time changes with hills, turns, wet grass, trimming, bagging, obstacles, overlap, mower power, walking speed, and how carefully you mow.',
    inputExplanations: [
      { term: 'Mower width', meaning: 'the actual cutting width of the mower deck or blade.' },
      { term: 'Speed', meaning: 'your average mowing speed, not the mower top speed.' },
      { term: 'Efficiency percent', meaning: 'how much time is productive cutting after turns, overlap, slowing down, and obstacles.' },
      { term: 'Lawn area', meaning: 'the mowable grass area, not the full property size unless the whole property is grass.' },
    ],
    extraFaq: [
      {
        question: 'What is efficiency percent for mowing?',
        answer:
          'Efficiency percent lowers the perfect straight-line mowing rate to something closer to a real yard. A simple yard might use 80%, while a yard with trees, slopes, toys, gates, or tight turns may need 60% to 70%.',
      },
      {
        question: 'Why does mower width matter so much?',
        answer:
          'A wider mower cuts a wider strip each pass. If speed and efficiency stay the same, doubling the cutting width roughly doubles the area cut per hour.',
      },
    ],
    useCases: [
      'Estimate how long mowing a lawn will take.',
      'Compare push mower and riding mower time.',
      'Plan weekly mowing time for a route.',
      'Understand how mower width changes productivity.',
    ],
    examples: [
      { label: 'Push mower lawn', expression: '10,000 ft2, 21 in mower, 3 mph, 80% efficiency', result: '27.06 minutes' },
      { label: 'Small yard', expression: '3,500 ft2, 21 in mower, 75% efficiency', result: 'Mowing time' },
      { label: 'Riding mower acre', expression: '1 acre, 42 in mower, 4.5 mph', result: 'Hours and minutes' },
    ],
    relatedSlugs: ['grass-seed-calculator', 'sod-calculator', 'area-calculator'],
  }),
  makeUtilityTool({
    slug: 'plant-spacing-calculator',
    name: 'Plant Spacing Calculator',
    category: 'home-projects',
    summary: 'Estimate plants needed for a bed from bed size, plant spacing, and square or triangular layout.',
    description:
      'Use this free plant spacing calculator to estimate plant count, rows, and plants per row from bed dimensions, center-to-center spacing, and planting pattern.',
    icon: 'calculator-plant-spacing',
    aliases: ['Plant Calculator', 'Planting Spacing Calculator', 'Flower Spacing Calculator'],
    formula:
      'The calculator converts bed dimensions to inches, fits rows and columns from plant spacing, and uses tighter row spacing for a triangular staggered pattern.',
    limit:
      'Real plant spacing depends on mature plant size, border setbacks, airflow, sunlight, soil, irregular bed edges, growth habit, and the plant tag.',
    inputExplanations: [
      { term: 'Plant spacing', meaning: 'the center-to-center distance recommended on the plant tag or seed packet.' },
      { term: 'Square grid', meaning: 'plants line up in straight rows and columns.' },
      { term: 'Triangular pattern', meaning: 'rows are staggered, so the bed can usually fit more plants.' },
      { term: 'Bed size', meaning: 'the rectangular planting area before edges or paths are removed.' },
    ],
    extraFaq: [
      {
        question: 'Why does triangular spacing fit more plants?',
        answer:
          'Triangular spacing staggers each row between the plants in the row before it. The rows sit closer together than a square grid, so the same bed can usually fit more plants.',
      },
      {
        question: 'Should I plant right to the edge of the bed?',
        answer:
          'Usually no. Many beds need a border setback so mature plants do not spill too far onto paths, walls, or edging. Subtract that border before entering bed length and width if it matters.',
      },
    ],
    useCases: [
      'Estimate annual flowers for a rectangular bed.',
      'Compare square and staggered planting patterns.',
      'Plan ground cover spacing.',
      'Turn plant tag spacing into a rough plant count.',
    ],
    examples: [
      { label: 'Square rows', expression: '10 x 4 ft bed, 12 in spacing, square', result: '40 plants' },
      { label: 'Staggered rows', expression: '10 x 4 ft bed, 12 in spacing, triangular', result: '44 plants' },
      { label: 'Ground cover', expression: '18 x 6 ft bed, 18 in spacing', result: 'Plant count estimate' },
    ],
    relatedSlugs: ['mulch-calculator', 'grass-seed-calculator', 'area-calculator'],
  }),
  makeUtilityTool({
    slug: 'siding-calculator',
    name: 'Siding Calculator',
    category: 'home-projects',
    summary: 'Estimate siding squares from wall area, openings, waste, and optional price per square.',
    description:
      'Use this free siding calculator to estimate siding square feet, siding squares, rounded boxes, and material cost from wall area, openings, waste, and price.',
    icon: 'calculator-siding',
    aliases: [
      'Siding Squares Calculator',
      'Vinyl Siding Calculator',
      'Hardie Siding Calculator',
      'Lap Siding Calculator',
      'Siding Calculator Square Feet',
      'Siding Box Calculator',
      'Siding Material Calculator',
    ],
    seoTitle: 'Siding Calculator | Squares, Boxes & Cost',
    seoDescription:
      'Estimate siding square feet, siding squares, rounded boxes, waste, and material cost from wall area, openings, and price per square.',
    formula:
      'Net wall area = wall area - door and window openings. Area with waste = net wall area x (1 + waste percent / 100). Siding squares = area with waste / 100. Rounded boxes = ceiling(squares / squares per box). Material cost = rounded squares x price per square.',
    limit:
      'Siding projects also need gable measurements, corners, starter strips, J-channel, trim, box coverage, panel exposure, color lots, installer layout, weatherproofing, and local building review.',
    inputExplanations: [
      { term: 'Wall area', meaning: 'total exterior wall square footage before doors and windows are subtracted.' },
      { term: 'Doors/windows', meaning: 'the combined opening area removed before the siding waste allowance is added.' },
      { term: 'Siding square', meaning: 'a siding unit equal to 100 square feet of coverage.' },
      { term: 'Waste percent', meaning: 'extra siding for cuts, gables, corners, trim-heavy sections, and damaged pieces.' },
    ],
    extraFaq: [
      {
        question: 'What does the Siding Calculator estimate?',
        answer:
          'It estimates net wall area, area after waste, siding squares, rounded whole squares, optional box count, and optional material cost.',
      },
      {
        question: 'What is one square of siding?',
        answer:
          'One siding square means 100 square feet of installed coverage. The calculator divides adjusted square feet by 100 to estimate squares.',
      },
      {
        question: 'Can I use this for vinyl siding?',
        answer:
          'Yes. Use it for a vinyl siding material estimate when you know the wall area, opening area, waste percent, and product coverage.',
      },
      {
        question: 'Can I use this for Hardie or lap siding?',
        answer:
          'Yes for rough square-foot and square estimates. Check the product label because board exposure, profile, and box coverage can change the real order.',
      },
      {
        question: 'How do I include gables?',
        answer:
          'Estimate each triangular gable as width times height divided by 2, then add that area to the wall area before subtracting openings and adding waste.',
      },
      {
        question: 'Should I subtract doors and windows?',
        answer:
          'Subtract larger openings when you have their area. Small trim-heavy openings may still create cuts and waste, so do not subtract every tiny section too tightly.',
      },
      {
        question: 'Does this calculate J-channel or trim?',
        answer:
          'No. It estimates siding coverage. J-channel, starter strip, corner posts, trim, soffit, fascia, fasteners, house wrap, and labor need separate checks.',
      },
      {
        question: 'How much waste should I use?',
        answer:
          'A simple wall may use around 10% waste, while complex gables, corners, repairs, and many cuts may need more. Ask the supplier or installer if the layout is tricky.',
      },
    ],
    useCases: [
      'Estimate vinyl, fiber cement, wood, or engineered siding squares.',
      'Convert wall square footage into 100-square-foot siding squares.',
      'Subtract doors and windows before adding waste.',
      'Add optional price per square for an early material estimate.',
      'Check whether a rounded box count makes sense before comparing product labels.',
      'Keep siding coverage separate from trim, channel, soffit, fascia, wrap, and labor.',
    ],
    examples: [
      { label: 'Small exterior', expression: '1,200 ft2 wall area, 120 ft2 openings, 10% waste', result: '11.88 squares, round to 12' },
      { label: 'Gable add-on', expression: '20 ft wide gable, 10 ft peak height', result: '100 ft2, or 1 siding square before waste' },
      { label: 'One wall', expression: '240 ft2 wall, 35 ft2 openings, 12% waste', result: '2.30 squares, round to 3' },
      { label: 'Box check', expression: '12 rounded squares, 2 squares per box', result: '6 boxes' },
      { label: 'Budget check', expression: '12 rounded squares at $180 per square', result: '$2,160 material estimate' },
    ],
    relatedSlugs: ['square-footage-calculator', 'paint-calculator', 'roofing-calculator', 'insulation-calculator'],
  }),
  makeUtilityTool({
    slug: 'brick-calculator',
    name: 'Brick Calculator',
    category: 'home-projects',
    summary: 'Estimate bricks from wall area, brick face size, mortar joint, and waste.',
    description:
      'Use this free brick calculator to estimate whole bricks from wall face area, brick face dimensions, mortar joint thickness, and waste percentage.',
    seoTitle: 'Brick Calculator | Wall Brick Count With Mortar Joint',
    seoDescription:
      'Estimate bricks for a wall face from square footage, brick size, mortar joint, and waste with clear examples, formula notes, and limits.',
    icon: 'calculator-brick',
    aliases: [
      'Brick Wall Calculator',
      'Masonry Brick Calculator',
      'Brick Count Calculator',
      'Bricks Needed Calculator',
    ],
    formula:
      'The calculator adds the mortar joint to the brick face length and height, converts that face area to square feet, multiplies wall area by the waste factor, divides by brick coverage, and rounds up.',
    limit:
      'Brick counts can change with bond pattern, corners, openings, piers, returns, cuts, wall thickness, damaged units, mortar, ties, flashing, and professional masonry layout.',
    faqLanguage: {
      expectedInputs: 'the wall face area, brick face dimensions, mortar joint thickness, and waste percent',
      examplePhrase: 'brick-wall example',
      doubleCheck:
        'Also check whether your brick dimensions are actual face dimensions, whether the joint is 3/8 inch or another size, and whether openings were already subtracted.',
    },
    inputExplanations: [
      { term: 'Wall area', meaning: 'the visible wall face area, not the thickness or volume of the wall.' },
      { term: 'Brick dimensions', meaning: 'the visible face length and height of one brick in inches.' },
      { term: 'Mortar joint', meaning: 'the planned gap between bricks, included in the face coverage estimate.' },
      { term: 'Waste percent', meaning: 'extra bricks for cuts, breakage, corners, bond pattern, and color matching.' },
    ],
    extraFaq: [
      {
        question: 'Should I use a 3/8 inch mortar joint?',
        answer:
          'Use 3/8 inch only if it matches your plan or supplier guidance. The Brick Industry Association tables often show 3/8 inch and 1/2 inch joint examples, and changing the joint changes brick coverage.',
      },
      {
        question: 'Do I subtract doors and windows first?',
        answer:
          'Yes. Subtract large openings before entering wall area. Then add waste for cuts, corners, damage, and layout changes so the estimate is not too tight.',
      },
      {
        question: 'Does this estimate mortar bags too?',
        answer:
          'No. This page estimates brick count. Mortar depends on brick type, joint thickness, bed depth, collar joints, waste, and the mortar product, so price and bag counts should be checked separately.',
      },
      {
        question: 'Can I use this for patios or pavers?',
        answer:
          'Only for a rough face-count check. Patio and paver layouts often need base gravel, bedding sand, edge restraints, pattern cuts, and drainage planning, so use a paver-specific calculator for that job.',
      },
      {
        question: 'Why is my answer different from a supplier table?',
        answer:
          'Supplier tables may use a different brick size, nominal dimension, joint width, wall type, or no waste. Match the exact brick face size and joint before comparing numbers.',
      },
    ],
    useCases: [
      'Estimate brick count for a simple wall face after openings are removed.',
      'Use actual brick face dimensions and mortar joint thickness.',
      'Add waste for cuts and broken pieces.',
      'Compare 3/8 inch and 1/2 inch mortar-joint assumptions.',
      'Compare brick sizes before asking a supplier or mason to confirm the order.',
    ],
    examples: [
      { label: 'Modular brick wall', expression: '120 ft2, 7.625 x 2.25 in brick, 3/8 in joint, 10% waste', result: '906 bricks' },
      { label: 'Small repair wall', expression: '42 ft2, 7.625 x 2.25 in brick, 3/8 in joint, 8% waste', result: '312 bricks' },
      { label: 'Opening check', expression: '160 ft2 wall - 24 ft2 window area, then 10% waste', result: 'Net brick estimate' },
      { label: 'Supplier check', expression: 'Compare 3/8 in vs 1/2 in joint', result: 'Different brick coverage' },
    ],
    relatedSlugs: ['siding-calculator', 'paver-base-calculator', 'paint-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-block-calculator',
    name: 'Concrete Block Calculator',
    category: 'home-projects',
    summary: 'Estimate CMU wall units, courses, and layout waste from wall size, openings, and nominal unit size.',
    description:
      'Use this free concrete block calculator to estimate CMU block count, courses, and blocks per course from wall length, height, nominal block size, openings, and waste.',
    seoTitle: 'Concrete Block Calculator | CMU Blocks Per Wall',
    seoDescription:
      'Estimate CMU block count, courses, and blocks per course from wall size, openings, nominal 8 by 16 blocks, waste, and layout limits.',
    icon: 'calculator-concrete-block',
    aliases: [
      'CMU Calculator',
      'CMU Block Calculator',
      'Cinder Block Calculator',
      'Block Wall Calculator',
      '8x8x16 Block Calculator',
      'Concrete Masonry Unit Calculator',
    ],
    formula:
      'The calculator uses wall area = length x height, net area = wall area - openings, adjusted area = net area x (1 + waste percent / 100), nominal block face area = block length x block height / 144, and blocks needed = adjusted area / block face area rounded up.',
    limit:
      'This is a block count estimate, not structural design. Block walls need professional review for footings, drainage, reinforcement, grout, lintels, mortar, bond pattern, corners, retaining-wall loads, permits, and local code.',
    faqLanguage: {
      expectedInputs: 'wall length, wall height, block length, block height, opening area, and waste percent',
      examplePhrase: 'concrete block wall example',
      doubleCheck:
        'Also check whether the block size is nominal, whether openings were subtracted before waste, and whether corners, half blocks, reinforcement, mortar, grout, and footings were planned separately.',
    },
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the finished wall face dimensions in feet.' },
      { term: 'Nominal block size', meaning: 'the common wall-layout module, such as 16 by 8 inches, which usually includes the mortar-joint spacing.' },
      { term: 'Openings', meaning: 'door, window, or other areas subtracted before waste is added.' },
      { term: 'Waste percent', meaning: 'extra blocks for cuts, broken units, corners, and layout changes.' },
    ],
    extraFaq: [
      {
        question: 'How many 8 by 8 by 16 blocks fit in a square foot?',
        answer:
          'A common nominal 8 by 16 inch block face covers about 8/9 square foot, so it takes about 1.125 blocks per square foot before waste. That is about 113 blocks for 100 square feet, or about 119 blocks with 5% waste.',
      },
      {
        question: 'Should I use nominal or actual CMU size?',
        answer:
          'Use the nominal size for a wall-layout estimate unless your supplier tells you otherwise. The actual block is usually smaller because the nominal size includes the mortar joint space.',
      },
      {
        question: 'Why subtract openings before adding waste?',
        answer:
          'A door or window removes wall area, so subtract openings first. Then add waste to the remaining wall area for cuts, broken blocks, corners, and layout changes.',
      },
      {
        question: 'Does this include mortar, grout, rebar, or footings?',
        answer:
          'No. It estimates block count, courses, and blocks per course only. Mortar, grout, reinforcement, footings, lintels, drainage, and labor need their own estimate and code check.',
      },
      {
        question: 'Can I use this for a retaining wall?',
        answer:
          'Use it only for a rough block count. Retaining walls need drainage, reinforcement, soil-load checks, permits, and local code review, so the calculator cannot approve the design.',
      },
    ],
    useCases: [
      'Estimate block count for a simple wall.',
      'See approximate course count and blocks per course.',
      'Subtract large openings before adding waste.',
      'Compare common nominal block sizes.',
      'Check a supplier quote against a simple wall-area estimate.',
    ],
    examples: [
      { label: '40 ft wall', expression: '40 x 8 ft, 16 x 8 in block, 20 ft2 openings, 5% waste', result: '355 blocks' },
      { label: 'Short garden wall', expression: '24 x 3 ft, 16 x 8 in block, 5% waste', result: '86 blocks' },
      { label: 'Small wall with opening', expression: '30 x 6 ft wall, 12 ft2 opening, 7% waste', result: '203 blocks' },
      { label: 'Course check', expression: '8 ft wall height, 8 in nominal block height', result: '12 courses' },
      { label: 'Opening check', expression: 'Subtract door or window area', result: 'Net wall count' },
    ],
    relatedSlugs: ['brick-calculator', 'concrete-calculator', 'rebar-calculator'],
  }),
  makeUtilityTool({
    slug: 'rebar-calculator',
    name: 'Rebar Calculator',
    category: 'home-projects',
    summary: 'Estimate rebar grid counts, linear feet, and stock bars from slab size and spacing.',
    description:
      'Use this free rebar calculator to estimate slab rebar grid counts, total linear feet, and stock bars to buy from slab size, spacing, bar length, and waste.',
    icon: 'calculator-rebar',
    aliases: [
      'Rebar Grid Calculator',
      'Rebar Calculator for Slab',
      'Rebar Spacing Calculator',
      'Rebar Linear Feet Calculator',
      'Rebar Calculator Weight',
      'Rebar Calculator for Wall',
      'Reinforcement Bar Calculator',
    ],
    seoTitle: 'Rebar Calculator | Slab Grid & Bar Count',
    seoDescription:
      'Estimate rebar for a simple slab grid. Enter slab size, spacing, stock bar length, and waste to get bar counts, linear feet, and stock bars.',
    formula:
      'Lengthwise bars = floor(slab width x 12 / spacing inches) + 1. Widthwise bars = floor(slab length x 12 / spacing inches) + 1. Total linear feet = lengthwise bars x slab length + widthwise bars x slab width. Add waste, divide by stock bar length, and round up.',
    limit:
      'This is a material takeoff, not structural design. Bar size, spacing, laps, cover, supports, edge distance, and code requirements need professional review.',
    inputExplanations: [
      { term: 'Slab length and width', meaning: 'the rectangular slab dimensions for the grid estimate.' },
      { term: 'Bar spacing', meaning: 'the distance between parallel bars; smaller spacing means more bars.' },
      { term: 'Stock bar length', meaning: 'the length of one purchased bar from the supplier.' },
      { term: 'Waste percent', meaning: 'extra length for cuts, lap planning, and small layout changes.' },
    ],
    extraFaq: [
      {
        question: 'What does the Rebar Calculator count?',
        answer:
          'It counts a simple two-direction grid for a rectangular slab. It returns bars running each direction, adjusted linear feet, and whole stock bars to buy.',
      },
      {
        question: 'Does this work for a concrete slab?',
        answer:
          'Yes, it is aimed at simple rectangular slab takeoffs. Enter slab length, slab width, bar spacing, stock bar length, and waste percent.',
      },
      {
        question: 'Does this calculate rebar weight?',
        answer:
          'Not on this page. This page estimates grid length and bars to buy. Use the Rebar Weight Calculator if you need pounds or tons from bar size and quantity.',
      },
      {
        question: 'Can I use this for a wall or footing?',
        answer:
          'Only as a rough material-count idea. Walls, footings, beams, and structural slabs can need different bar sizes, layers, bends, hooks, spacing, cover, and lap details.',
      },
      {
        question: 'Why does smaller spacing increase the bar count?',
        answer:
          'Spacing is the distance between parallel bars. If the bars are closer together, more bars fit across the slab, so total linear feet and stock bars go up.',
      },
      {
        question: 'Does the result include lap splices?',
        answer:
          'Only if you cover them with the waste percent. Real lap length depends on bar size, concrete strength, bar spacing, cover, grade, and the project drawings.',
      },
      {
        question: 'Does this replace a concrete plan?',
        answer:
          'No. It is for estimating materials before ordering or comparing layouts. The actual reinforcement design should come from the plan, code requirements, or a qualified professional.',
      },
      {
        question: 'What should I check before buying bars?',
        answer:
          'Check the drawing, required bar size, spacing, slab thickness, cover, chair/support needs, lap length, stock lengths, delivery minimums, and local code rules.',
      },
    ],
    useCases: [
      'Estimate stock rebar bars for a simple rectangular slab grid.',
      'Compare 12-inch, 18-inch, and 24-inch spacing.',
      'Add waste for cuts and lap planning.',
      'Check adjusted linear feet before using a weight estimate.',
      'Separate simple slab takeoff math from structural design decisions.',
      'Plan a rough material list before professional review.',
    ],
    examples: [
      { label: '20 x 12 slab', expression: '20 x 12 ft, 18 in spacing, 20 ft stock bars, 10% waste', result: '20 bars' },
      { label: 'Garage pad', expression: '24 x 20 ft, 24 in spacing, 20 ft stock bars, 10% waste', result: '29 bars' },
      { label: 'Tighter spacing', expression: '20 x 12 ft, 12 in spacing, 20 ft stock bars, 10% waste', result: '29 bars' },
      { label: 'Small patio', expression: '12 x 10 ft, 18 in spacing, 20 ft stock bars, 5% waste', result: '10 bars' },
      { label: 'Weight handoff', expression: 'Use adjusted linear feet with bar size', result: 'Check rebar weight separately' },
    ],
    relatedSlugs: [
      'rebar-weight-calculator',
      'concrete-reinforcing-mesh-calculator',
      'concrete-footing-calculator',
      'concrete-driveway-calculator',
    ],
  }),
  makeUtilityTool({
    slug: 'concrete-mix-calculator',
    name: 'Concrete Mix Calculator',
    category: 'home-projects',
    summary: 'Estimate cement, sand, and gravel from concrete volume and a mix ratio.',
    description:
      'Use this free concrete mix calculator to estimate cement bags, sand, and gravel from cubic yards, 1:2:3 or 1:2:4 ratio parts, bag yield, and waste percent.',
    seoTitle: 'Concrete Mix Calculator | Cement, Sand & Gravel',
    seoDescription:
      'Estimate cement bags, sand, and gravel from concrete volume, 1:2:3 or 1:2:4 mix ratio parts, cement-bag yield, and waste.',
    icon: 'calculator-concrete-mix',
    aliases: [
      'Concrete Ratio Calculator',
      'Cement Sand Gravel Calculator',
      '1:2:3 Concrete Mix Calculator',
      '1:2:4 Concrete Mix Calculator',
      'Concrete Mix Calculator For Slab',
      'Sand And Cement Calculator',
    ],
    formula:
      'The calculator converts cubic yards to cubic feet, adds waste, adds the cement, sand, and gravel parts, then gives each material its share of the adjusted volume. Cement bags are rounded up from the cement cubic feet and the bag yield you enter.',
    limit:
      'Concrete strength depends on water, aggregate, cement type, moisture, additives, curing, placement, and code requirements. This is a rough material takeoff, not an engineered mix design or safety sign-off.',
    inputExplanations: [
      { term: 'Concrete volume', meaning: 'the final amount of concrete you want to make before waste is added.' },
      { term: 'Mix ratio', meaning: 'cement, sand, and gravel parts by volume, such as 1:2:3 or 1:2:4.' },
      { term: 'Cement bag yield', meaning: 'how many cubic feet one cement bag contributes. Use the bag or supplier label when you have it.' },
      { term: 'Waste percent', meaning: 'extra material for spills, uneven measuring, low spots, and small batch losses.' },
    ],
    extraFaq: [
      {
        question: 'What does a 1:2:3 concrete mix mean?',
        answer:
          'It means 1 part cement, 2 parts sand, and 3 parts gravel by volume. The calculator uses those parts to split the total adjusted volume.',
      },
      {
        question: 'What does a 1:2:4 concrete mix mean?',
        answer:
          'It means 1 part cement, 2 parts sand, and 4 parts gravel by volume. It uses more gravel than a 1:2:3 mix, so check your project instructions before choosing it.',
      },
      {
        question: 'Why does the calculator ask for cement bag yield?',
        answer:
          'Different bags and products can cover different volumes. The calculator divides cement cubic feet by the yield you enter, then rounds up to whole bags.',
      },
      {
        question: 'Does this estimate water?',
        answer:
          'No. Water amount affects workability and strength, so follow the cement or concrete product directions instead of guessing from this material split.',
      },
      {
        question: 'Can I use this as a sand and cement calculator?',
        answer:
          'Only if your job is still a concrete mix with a gravel part. This page requires cement, sand, and gravel parts; mortar-only or render mixes need a separate check.',
      },
      {
        question: 'Can this guarantee concrete strength?',
        answer:
          'No. Strength depends on the actual mix design, water ratio, aggregate, curing, and product instructions. Use a specified mix for structural work.',
      },
      {
        question: 'Is this enough for a slab?',
        answer:
          'It can help with material planning for a simple slab batch, but slab thickness, base prep, reinforcement, joints, drainage, and local code still need separate checks.',
      },
    ],
    useCases: [
      'Plan cement, sand, and gravel for small concrete batches.',
      'Compare 1:2:3 and 1:2:4 style ratios.',
      'Add waste before buying bagged materials.',
      'Turn cubic yards into cubic feet, whole cement bags, sand, and gravel.',
      'Check whether a slab batch estimate needs a ready-mix quote instead.',
    ],
    examples: [
      { label: '1:2:3 mix', expression: '1 yd3, 1:2:3 ratio, 1 ft3 bag yield, 10% waste', result: '5 cement bags, 9.90 ft3 sand, 14.85 ft3 gravel' },
      { label: 'Small 1:2:4 batch', expression: '0.25 yd3, 1:2:4 ratio, 1 ft3 bag yield, 8% waste', result: '2 cement bags, 2.08 ft3 sand, 4.17 ft3 gravel' },
      { label: 'Waste check', expression: '1 yd3 with 5% waste vs 10% waste', result: '28.35 ft3 vs 29.70 ft3 adjusted concrete' },
      { label: 'Bag yield check', expression: '4.95 ft3 cement, 0.75 ft3 bag yield', result: '7 cement bags' },
    ],
    relatedSlugs: [
      'concrete-driveway-calculator',
      'concrete-footing-calculator',
      'concrete-steps-calculator',
      'post-hole-concrete-calculator',
    ],
  }),
  makeUtilityTool({
    slug: 'concrete-driveway-calculator',
    name: 'Concrete Driveway Calculator',
    category: 'home-projects',
    summary: 'Estimate driveway concrete yards, bag counts, and rough material-only cost.',
    description:
      'Use this free concrete driveway calculator to estimate slab cubic yards, cubic feet, 60 lb and 80 lb bag counts, and rough material cost from driveway length, width, thickness, and waste.',
    icon: 'calculator-concrete-driveway',
    seoTitle: 'Concrete Driveway Calculator | Yards, Bags & Cost',
    seoDescription:
      'Estimate concrete yards, cubic feet, 60 lb and 80 lb bag counts, and material-only cost for a driveway slab using length, width, thickness, and waste.',
    aliases: [
      'Driveway Concrete Calculator',
      'Concrete Slab Driveway Calculator',
      'Concrete Slab Calculator',
      'Concrete Driveway Cost Calculator',
      'Driveway Estimate Calculator',
      'Concrete Driveway Cost Per Sq Ft Calculator',
      'Concrete Calculator For Driveway',
    ],
    formula:
      'The calculator converts thickness from inches to feet, multiplies length x width x thickness, adds the waste percent, converts cubic feet to cubic yards by dividing by 27, rounds 60 lb and 80 lb bag counts up from common bag yields, and multiplies cubic yards by price per cubic yard when a price is entered.',
    limit:
      'This is a concrete quantity and material-cost estimate only. Driveways also need the right base, compaction, thickness, reinforcement, joints, drainage, slope, curing, permits, inspections, and local code checks.',
    inputExplanations: [
      { term: 'Driveway length and width', meaning: 'the rectangular slab footprint in feet, measured inside the forms.' },
      { term: 'Thickness', meaning: 'the average concrete slab depth in inches, not the gravel base depth.' },
      { term: 'Waste percent', meaning: 'extra concrete for low spots, uneven forms, spillage, and a small ordering cushion.' },
      { term: 'Price per cubic yard', meaning: 'optional ready-mix concrete price for a rough material-only cost.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate concrete for a driveway?',
        answer:
          'Multiply length x width x thickness in feet to get cubic feet. Add waste, then divide by 27 to get cubic yards. This calculator does those steps and rounds bag counts up.',
      },
      {
        question: 'What does 40 x 12 feet at 4 inches mean?',
        answer:
          'It means a 40-foot long, 12-foot wide driveway slab with 4 inches of concrete depth. With 10% waste, that example needs about 6.52 yd3 of concrete.',
      },
      {
        question: 'Why does driveway thickness matter so much?',
        answer:
          'Volume changes directly with thickness. A 5-inch slab uses 25% more concrete than a 4-inch slab over the same driveway area.',
      },
      {
        question: 'Should I use bags or ready-mix for a driveway?',
        answer:
          'Most driveway pours are better planned in ready-mix cubic yards because the volume is large. Bag counts are useful for tiny patches or a sanity check, not for choosing the best pour method.',
      },
      {
        question: 'Does the estimate include driveway cost per square foot?',
        answer:
          'No. It can show material cost from price per cubic yard, but it does not include labor, base gravel, demolition, forms, reinforcement, delivery fees, finishing, or permits.',
      },
      {
        question: 'Does the driveway estimate include gravel base or rebar?',
        answer:
          'No. It only estimates concrete volume and bags. Use separate tools for reinforcing mesh, rebar, gravel, or subbase planning.',
      },
      {
        question: 'Can this choose the right slab thickness?',
        answer:
          'No. It compares volume for the thickness you enter. Vehicle weight, soil, base prep, drainage, reinforcement, frost, and local rules can change the right thickness.',
      },
      {
        question: 'Why add waste for concrete?',
        answer:
          'Real forms and subgrades are not perfect. A small waste cushion helps cover uneven depth, spills, low spots, and the risk of running short during a pour.',
      },
      {
        question: 'Can I use this for a garage slab or patio?',
        answer:
          'You can use the same rectangular slab math, but the limits may change. A garage, patio, sidewalk, or apron may need different thickness, joints, base prep, drainage, or code checks.',
      },
    ],
    useCases: [
      'Estimate ready-mix concrete for driveway slabs.',
      'Compare 4-inch and 5-inch slab thickness.',
      'Add a waste cushion before pricing material.',
      'Check 60 lb and 80 lb bag counts for small driveway repairs.',
      'Get a rough material-only cost from price per cubic yard.',
    ],
    examples: [
      { label: 'Single-car driveway', expression: '40 x 12 ft, 4 in thick, 10% waste, $160/yd3', result: '6.52 yd3, 294 eighty-pound bags, about $1,043 material' },
      { label: 'Two-car pad', expression: '30 x 20 ft, 5 in thick, 10% waste, $155/yd3', result: '10.19 yd3, 459 eighty-pound bags, about $1,579 material' },
      { label: 'Small apron', expression: '24 x 10 ft, 4 in thick, 5% waste, $170/yd3', result: '3.11 yd3, 140 eighty-pound bags, about $529 material' },
      { label: 'Thickness check', expression: 'Same driveway: 4 in vs 5 in', result: '5 inches uses 25% more concrete than 4 inches' },
    ],
    relatedSlugs: [
      'concrete-calculator',
      'concrete-mix-calculator',
      'concrete-reinforcing-mesh-calculator',
      'concrete-weight-calculator',
    ],
  }),
  makeUtilityTool({
    slug: 'concrete-steps-calculator',
    name: 'Concrete Steps Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete yards and bag counts for solid steps with an optional landing.',
    description:
      'Use this free concrete steps calculator to estimate cubic yards, cubic feet, and 60 lb or 80 lb bag counts from step count, stair width, riser height, tread depth, optional landing depth, and waste.',
    icon: 'calculator-concrete-steps',
    seoTitle: 'Concrete Steps Calculator | Stairs, Landing & Bags',
    seoDescription:
      'Estimate concrete yards, cubic feet, and bag counts for solid concrete steps using step count, width, riser height, tread depth, landing depth, and waste.',
    aliases: [
      'Concrete Stair Calculator',
      'Concrete Stairs Calculator',
      'Concrete Step Calculator',
      'Cement Steps Calculator',
      'Concrete Steps With Landing Calculator',
      'Concrete Step Volume Calculator',
      'Stair Concrete Calculator Rise And Run',
    ],
    formula:
      'The calculator converts riser height and tread depth from inches to feet, models solid steps as stacked rectangular blocks, adds an optional landing block at the full stair height, applies waste, converts cubic feet to cubic yards by dividing by 27, and rounds 60 lb and 80 lb bag counts up.',
    limit:
      'This assumes solid poured concrete steps. Hollow forms, precast steps, footings, reinforcement, forms, nosing, frost, slope, landings, handrails, drainage, and local building code can change the real design and material need.',
    inputExplanations: [
      { term: 'Step count', meaning: 'the number of risers in the solid stair shape.' },
      { term: 'Step width', meaning: 'the side-to-side width of the stair in feet.' },
      { term: 'Riser height', meaning: 'the vertical height of one step in inches, not total stair height.' },
      { term: 'Tread depth', meaning: 'the front-to-back run of one tread in inches.' },
      { term: 'Landing depth', meaning: 'optional top landing depth in feet; enter 0 if there is no landing.' },
      { term: 'Waste percent', meaning: 'extra concrete for form variation, spillage, low spots, and a small cushion.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate concrete for steps?',
        answer:
          'For solid steps, estimate each step as a rectangular block, stack those blocks, add any landing, then add waste and divide cubic feet by 27 for cubic yards. This calculator does those steps for you.',
      },
      {
        question: 'Why does the calculator use stacked steps?',
        answer:
          'Solid concrete stairs can be estimated as stacked rectangular blocks. Each higher step includes the volume below it.',
      },
      {
        question: 'What is riser height?',
        answer:
          'Riser height is the height of one step. Do not enter total stair height there. Four steps with 7-inch risers have a total rise of 28 inches.',
      },
      {
        question: 'What is tread depth?',
        answer:
          'Tread depth is the front-to-back walking surface of one step. It is part of the concrete volume and also affects whether the stair layout is comfortable and code-friendly.',
      },
      {
        question: 'How does the landing depth work?',
        answer:
          'Landing depth adds a top rectangular block. Enter 0 when there is no landing. If the landing sits on another base or is hollow, adjust the estimate instead of trusting the simple block model.',
      },
      {
        question: 'How many bags are in the porch step example?',
        answer:
          'The 4-step porch example is about 2.01 yd3, or about 91 eighty-pound bags using common dry-mix yield. That is why larger step pours often need ready-mix planning.',
      },
      {
        question: 'Can I use this for hollow formed steps?',
        answer:
          'Not directly. Hollow or filled forms need a different takeoff because only part of the stair shape is solid concrete.',
      },
      {
        question: 'Does this choose legal stair rise and run?',
        answer:
          'No. It estimates concrete volume from the dimensions you enter. Stair rise, tread depth, landing size, handrails, and nosing rules are local code and safety questions.',
      },
      {
        question: 'Does this include rebar, mesh, or footings?',
        answer:
          'No. It only estimates concrete volume and common bag counts. Reinforcement, footings, frost depth, forms, and base prep need separate planning.',
      },
      {
        question: 'Can I use it for precast steps?',
        answer:
          'Not directly. Precast steps are usually bought as a unit or measured from product data. This page is for simple solid poured-in-place shapes.',
      },
    ],
    useCases: [
      'Estimate concrete for porch or garden steps.',
      'Include a simple top landing in the volume.',
      'Convert step dimensions to cubic yards.',
      'Compare different riser and tread layouts.',
      'Check 60 lb and 80 lb bag counts for small step pours.',
      'Separate concrete quantity from code, formwork, and handrail decisions.',
    ],
    examples: [
      { label: 'Porch steps', expression: '4 steps, 4 ft wide, 7 in riser, 11 in tread, 3 ft landing, 10% waste', result: '2.01 yd3, about 91 eighty-pound bags' },
      { label: 'Garden steps', expression: '3 steps, 5 ft wide, 6 in riser, 12 in tread, no landing, 8% waste', result: '0.60 yd3, about 27 eighty-pound bags' },
      { label: 'Landing check', expression: 'Add a 3 ft top landing to 4 porch steps', result: 'Landing volume is included at the full stair height' },
      { label: 'Riser check', expression: '4 steps x 7 in riser', result: '28 in total rise before any landing or base details' },
    ],
    relatedSlugs: [
      'stair-calculator',
      'concrete-calculator',
      'concrete-mix-calculator',
      'concrete-footing-calculator',
    ],
  }),
  makeUtilityTool({
    slug: 'concrete-weight-calculator',
    name: 'Concrete Weight Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete weight in pounds and US tons from cubic yards, density, and waste.',
    description:
      'Use this free concrete weight calculator to estimate pounds and US tons from cubic yards, density, and optional waste. Normal-weight concrete is often around 145 to 150 lb/ft3, but the right density depends on the mix.',
    seoTitle: 'Concrete Weight Calculator | Pounds, Tons & Density',
    seoDescription:
      'Estimate concrete weight in pounds and US tons from cubic yards, density, and waste. Includes normal-weight, lightweight, cured concrete, and hauling notes.',
    icon: 'calculator-concrete-weight',
    aliases: [
      'Concrete Density Calculator',
      'Concrete Tons Calculator',
      'Concrete Weight Calculator by Dimensions',
      'Cured Concrete Weight Calculator',
      'Concrete Weight in Kg',
    ],
    formula:
      'The calculator multiplies cubic yards by 27 to get cubic feet, applies waste, multiplies adjusted cubic feet by density in pounds per cubic foot, and divides pounds by 2,000 to get US tons.',
    limit:
      'Concrete density varies by mix, aggregate, reinforcement, moisture, air content, and lightweight or heavyweight material choices. Use supplier data for truck limits, crane picks, disposal tickets, forms, or engineering decisions.',
    inputExplanations: [
      { term: 'Cubic yards', meaning: 'the concrete volume you already measured or calculated from a slab, footing, column, or pour.' },
      {
        term: 'Density',
        meaning:
          'pounds per cubic foot. Normal-weight concrete is often estimated around 145 to 150 lb/ft3, while lightweight concrete can be much lower.',
      },
      { term: 'Waste percent', meaning: 'extra volume before weighing, useful when you want the weight after adding an ordering cushion.' },
      { term: 'US tons', meaning: 'the total pounds divided by 2,000, useful for hauling and disposal estimates.' },
    ],
    extraFaq: [
      {
        question: 'What density should I use for concrete weight?',
        answer:
          'For rough planning, normal-weight concrete is commonly estimated around 145 to 150 lb/ft3. Use your supplier or project specs when hauling, disposal, lifting, or structural loads matter.',
      },
      {
        question: 'How much does one cubic yard of concrete weigh?',
        answer:
          'At 150 lb/ft3, one cubic yard weighs about 4,050 lb, or about 2.03 US tons. At 145 lb/ft3, it weighs about 3,915 lb.',
      },
      {
        question: 'How much does 2 cubic yards of concrete weigh?',
        answer:
          'At 145 lb/ft3, 2 cubic yards weighs 7,830 lb, or about 3.92 US tons. Change the density field if your mix is lighter or heavier.',
      },
      {
        question: 'Does cured concrete weigh less than wet concrete?',
        answer:
          'It can. Water leaves the mix as concrete cures, but aggregate and mix design still control most of the weight. Use the density that matches the state you care about.',
      },
      {
        question: 'Can this estimate concrete weight by dimensions?',
        answer:
          'This page starts with cubic yards. If you only have length, width, and thickness, use the Concrete Calculator or Cubic Yard Calculator first, then bring the cubic yards back here.',
      },
      {
        question: 'What does 1 m3 of concrete weigh in kg?',
        answer:
          'Normalweight concrete is often about 2,400 kg per cubic meter. This calculator uses US units, so use the density field in lb/ft3 for the final estimate.',
      },
      {
        question: 'Is lightweight concrete the same weight?',
        answer:
          'No. Structural lightweight concrete can be much lighter than normal-weight concrete, often around 90 to 120 lb/ft3 depending on the aggregate and mix.',
      },
      {
        question: 'Why add waste percent to a weight estimate?',
        answer:
          'Waste raises the volume before weight is calculated. That helps when you want the weight of the amount you plan to order, not just the neat shape.',
      },
      {
        question: 'Does this include rebar weight?',
        answer:
          'No. It estimates concrete material only. Use the Rebar Weight Calculator if you also need reinforcing steel weight.',
      },
      {
        question: 'Can I use this for truck or trailer limits?',
        answer:
          'Use it only as a planning check. For real load limits, confirm the density, container weight, trailer rating, axle limits, and disposal or supplier ticket weights.',
      },
    ],
    useCases: [
      'Estimate concrete weight for hauling, disposal, or trailer planning.',
      'Convert cubic yards into pounds and US tons.',
      'Compare normal-weight, lightweight, and heavier density assumptions.',
      'Add waste volume before estimating order weight.',
      'Check concrete-only weight before adding rebar or formwork separately.',
    ],
    examples: [
      { label: 'Normal concrete', expression: '2 yd3 at 145 lb/ft3', result: '7,830 lb, about 3.92 US tons' },
      { label: 'One cubic yard check', expression: '1 yd3 at 150 lb/ft3', result: '4,050 lb, about 2.03 US tons' },
      { label: 'Heavy estimate with cushion', expression: '3.5 yd3 at 150 lb/ft3 plus 5% waste', result: '14,884 lb, about 7.44 US tons' },
      { label: 'Lightweight comparison', expression: '2 yd3 at 115 lb/ft3', result: '6,210 lb, about 3.11 US tons' },
    ],
    relatedSlugs: ['cubic-yard-calculator', 'density-calculator', 'mass-calculator', 'weight-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-reinforcing-mesh-calculator',
    name: 'Concrete Mesh Calculator',
    category: 'home-projects',
    summary: 'Estimate welded wire mesh sheets for a rectangular concrete slab.',
    description:
      'Estimate concrete mesh sheets for a slab. Enter slab size, sheet size, overlap, and waste to get effective coverage and sheets to buy.',
    icon: 'calculator-concrete-mesh',
    aliases: [
      'Concrete Reinforcing Mesh Calculator',
      'Wire Mesh Calculator',
      'Welded Wire Mesh Calculator',
      'Remesh Calculator',
      'WWR Calculator',
      'Reinforcement Mesh Calculator',
    ],
    seoTitle: 'Concrete Mesh Calculator | Slab Sheet Count',
    seoDescription:
      'Estimate concrete mesh sheets for a rectangular slab. Enter slab size, mesh sheet size, overlap, and waste to get sheets to buy.',
    formula:
      'Slab area = length x width. Effective sheet area = (sheet length - overlap) x (sheet width - overlap). Adjusted area = slab area x (1 + waste percent / 100). Sheets = adjusted area / effective sheet area, rounded up.',
    limit:
      'This is a sheet-count takeoff only. It does not choose wire gauge, layers, lap length, chair spacing, concrete cover, placement height, slab design, loads, or code requirements.',
    inputExplanations: [
      { term: 'Slab length and width', meaning: 'the rectangular concrete area you want the mesh to cover.' },
      { term: 'Sheet size', meaning: 'the length and width of one mesh sheet or one cut section from a roll.' },
      { term: 'Overlap', meaning: 'the strip shared by two sheets; it reduces the new area each sheet covers.' },
      { term: 'Waste percent', meaning: 'extra mesh for edge cuts, trimmed pieces, layout changes, and damaged sheets.' },
    ],
    extraFaq: [
      {
        question: 'What does the Concrete Mesh Calculator count?',
        answer:
          'It counts whole mesh sheets or roll sections for a simple rectangular slab. It uses slab size, sheet size, overlap, and waste, then rounds up so you do not order a fraction of a sheet.',
      },
      {
        question: 'Why does overlap reduce sheet coverage?',
        answer:
          'When two sheets overlap, the shared strip does not cover fresh slab area. A 10 ft by 5 ft sheet with 6 in overlap behaves more like 9.5 ft by 4.5 ft for estimating coverage.',
      },
      {
        question: 'Can I use this for wire mesh rolls?',
        answer:
          'Yes, if you treat one cut piece from the roll like a sheet. Enter the planned cut length and roll width as the sheet size, then add waste for offcuts.',
      },
      {
        question: 'Does this choose the right mesh size?',
        answer:
          'No. It only estimates sheet count. Wire size, slab thickness, load, soil, cracks, spacing, and local code need the project drawing or a qualified concrete professional.',
      },
      {
        question: 'Does this include two layers of mesh?',
        answer:
          'No. The result is for one layer. If your plan clearly calls for two layers, estimate one layer first and then double the sheet count before adding any project-specific layout changes.',
      },
      {
        question: 'Should mesh sit on the ground before the pour?',
        answer:
          'No. Welded wire reinforcement is usually supported at the specified height before concrete is placed. Do not rely on pulling mesh up after the pour starts.',
      },
      {
        question: 'How much waste should I add?',
        answer:
          'For a plain rectangle, 5% to 10% is a common planning range. Add more for odd corners, short offcuts, door openings, ramps, or a layout that wastes half-sheets.',
      },
      {
        question: 'Does overlap replace lap rules on the drawing?',
        answer:
          'No. The overlap field is only for estimating coverage. Required laps and splice details can depend on the mesh type, spacing, cover, concrete, and project drawings.',
      },
    ],
    useCases: [
      'Estimate welded wire mesh sheets for a slab, patio, or pad.',
      'Compare 10 x 5 ft sheets with a cut section from a roll.',
      'See how 4 in, 6 in, or 12 in overlap changes the sheet count.',
      'Add waste before ordering mesh from a supplier.',
      'Plan mesh separately from concrete volume and rebar weight.',
    ],
    examples: [
      {
        label: '30 x 20 slab',
        expression: '10 x 5 ft sheets, 6 in overlap, 10% waste',
        result: '16 sheets, because each sheet covers about 42.75 ft2 after overlap',
      },
      {
        label: 'Small patio',
        expression: '18 x 12 ft slab, 10 x 5 ft sheets, 4 in overlap, 8% waste',
        result: '6 sheets',
      },
      {
        label: 'Garage pad roll cut',
        expression: '24 x 24 ft slab, 20 x 8 ft roll sections, 6 in overlap, 10% waste',
        result: '5 sections',
      },
      {
        label: 'Overlap check',
        expression: 'Raise overlap from 4 in to 12 in',
        result: 'Effective sheet area drops, so the sheet count may rise',
      },
    ],
    relatedSlugs: ['concrete-calculator', 'rebar-calculator', 'concrete-weight-calculator', 'concrete-driveway-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-block-fill-calculator',
    name: 'Concrete Block Fill Calculator',
    category: 'home-projects',
    summary: 'Estimate grout or concrete for filling CMU block cores.',
    description:
      'Estimate concrete block core fill from block count, fill volume per block, and waste. Get cubic feet, cubic yards, and bag counts.',
    icon: 'calculator-concrete-block-fill',
    aliases: [
      'CMU Fill Calculator',
      'Block Core Fill Calculator',
      'Grout Fill Calculator',
      'Concrete Fill Calculator',
      '8 Block Core Fill Calculator',
      '12 Inch Block Fill Calculator',
      'QUIKRETE Block Fill Calculator',
    ],
    seoTitle: 'Concrete Block Fill Calculator | CMU Core Fill',
    seoDescription:
      'Estimate CMU block core fill. Enter block count, fill cubic feet per block, and waste to get cubic feet, cubic yards, and bags.',
    formula:
      'Adjusted cubic feet = block count x fill cubic feet per block x (1 + waste percent / 100). Cubic yards = adjusted cubic feet / 27. Bag counts use common 60 lb and 80 lb bag yields and round up.',
    limit:
      'Actual fill depends on CMU size, core shape, filled-cell pattern, bond beams, rebar cells, grout mix, cleanouts, consolidation, spillage, and structural requirements.',
    inputExplanations: [
      { term: 'Block count', meaning: 'how many CMU blocks or filled cells you plan to fill, depending on how your takeoff is written.' },
      { term: 'Fill per block', meaning: 'the cubic feet of grout or concrete needed for one block or filled cell from product data, a drawing, or a takeoff.' },
      { term: 'Waste percent', meaning: 'extra fill for spillage, overfilled cells, pump loss, cleanouts, and small measurement differences.' },
      { term: 'Bag counts', meaning: 'rounded estimates using common dry-mix bag yields. Check the actual bag label before buying.' },
    ],
    extraFaq: [
      {
        question: 'What is fill cubic feet per block?',
        answer:
          'It is the approximate grout or concrete volume needed for one block or one filled cell, depending on your takeoff. Different 8 inch, 10 inch, and 12 inch CMUs can have different core volumes.',
      },
      {
        question: 'How do I calculate concrete block fill?',
        answer:
          'Multiply the blocks or filled cells by the fill volume per block, add waste, then divide cubic feet by 27 for cubic yards. The calculator also rounds common bag counts up.',
      },
      {
        question: 'How much fill is needed for 120 blocks at 0.25 ft3 each?',
        answer:
          'With 10% waste, 120 blocks at 0.25 ft3 each needs 33 ft3, or about 1.22 yd3. That is about 55 eighty-pound bags using the common 0.6 ft3 yield.',
      },
      {
        question: 'Can I use this for 8x8x16 block fill?',
        answer:
          'Yes, if you enter the fill volume that matches your 8x8x16 block or cell pattern. Do not assume one universal number, because core shapes and filled-cell patterns vary.',
      },
      {
        question: 'Can I use this for 12 inch block fill?',
        answer:
          'Yes. Enter the cubic feet per 12 inch block or filled cell from the block data, masonry table, or plan. Larger blocks usually need more fill than 8 inch units.',
      },
      {
        question: 'Should I use concrete or masonry grout?',
        answer:
          'Follow the plan or product instructions. CMHA describes masonry grout as the material used to fill concrete masonry cores and cavities, and many structural walls call for grout that meets the project spec.',
      },
      {
        question: 'Does this include mortar between blocks?',
        answer:
          'No. It only estimates core fill. Mortar joints, bond beams, reinforcing steel, and footing concrete need separate estimates.',
      },
      {
        question: 'Does this know which cells get filled?',
        answer:
          'No. You enter the count. Some walls fill every cell, some fill rebar cells, and some include bond beams. Use the drawing or code requirement to decide the count first.',
      },
      {
        question: 'Why add waste to block fill?',
        answer:
          'Core fill can be lost to spillage, pump hose waste, cleanouts, overfilled cells, consolidation, and small counting errors. Waste gives the estimate a practical cushion.',
      },
    ],
    useCases: [
      'Estimate grout or concrete for CMU block cores.',
      'Convert block core fill from cubic feet to cubic yards.',
      'Plan 60 lb and 80 lb bag counts for small masonry jobs.',
      'Compare 8 inch and 12 inch block fill takeoffs when you already know fill per block.',
      'Add waste before ordering grout, bag mix, or ready-mix.',
    ],
    examples: [
      { label: '120 filled blocks', expression: '0.25 ft3 per block, 10% waste', result: '33 ft3, about 1.22 yd3, about 55 eighty-pound bags' },
      { label: 'Small wall fill', expression: '64 blocks, 0.22 ft3 each, 8% waste', result: '15.21 ft3, about 0.56 yd3, about 26 eighty-pound bags' },
      { label: 'Larger core check', expression: '200 blocks, 0.33 ft3 per block, 5% waste', result: '69.3 ft3, about 2.57 yd3' },
      { label: 'Bag planning', expression: '33 ft3 divided by 0.6 ft3 per 80 lb bag', result: '55 eighty-pound bags' },
    ],
    relatedSlugs: ['concrete-block-calculator', 'concrete-calculator', 'retaining-wall-calculator', 'concrete-mix-calculator'],
  }),
  makeUtilityTool({
    slug: 'retaining-wall-calculator',
    name: 'Retaining Wall Calculator',
    category: 'home-projects',
    summary: 'Estimate segmental retaining wall blocks, caps, courses, and base gravel.',
    description:
      'Estimate segmental retaining wall blocks, cap blocks, courses, and base gravel from wall size, block size, cap length, base trench size, and waste.',
    seoTitle: 'Retaining Wall Calculator | Blocks, Caps, Base Gravel',
    seoDescription:
      'Estimate retaining wall blocks, cap blocks, courses, and base gravel. Enter wall size, block size, cap length, base trench size, and waste.',
    icon: 'calculator-retaining-wall',
    aliases: [
      'Retaining Wall Block Calculator',
      'Retaining Wall Materials Calculator',
      'Concrete Retaining Wall Calculator',
      'Retaining Wall Base Calculator',
      'Retaining Wall Square Feet Calculator',
      'Landscape Wall Calculator',
      'Block Retaining Wall Calculator',
    ],
    formula:
      'Courses = ceiling(wall height x 12 / block height). Blocks per course = ceiling(wall length x 12 / block length). Wall blocks = courses x blocks per course x waste factor, rounded up. Cap blocks use wall length and cap length. Base gravel = wall length x base width x base depth x waste factor.',
    limit:
      'This counts materials for simple segmental wall planning. It does not design a safe retaining wall. Soil, drainage, surcharge loads, slopes, setback, embedment, geogrid, base compaction, frost, utilities, permits, and local code can change the real plan.',
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the finished face size of the retaining wall, measured before adding hidden buried courses or curves.' },
      { term: 'Block size', meaning: 'the visible face length and height of one segmental wall block from the supplier label or product sheet.' },
      { term: 'Cap length', meaning: 'the length of one cap block along the top of the wall.' },
      { term: 'Base depth and width', meaning: 'the compacted gravel trench dimensions used for the base estimate, not the drainage stone behind the wall.' },
      { term: 'Waste percent', meaning: 'extra blocks and gravel for cuts, broken units, end pieces, curves, base cleanup, and small measuring errors.' },
    ],
    extraFaq: [
      {
        question: 'Why does a retaining wall need a base gravel estimate?',
        answer:
          'Segmental retaining walls usually sit on a compacted base. The calculator estimates the base trench volume so you can plan material separately from wall blocks.',
      },
      {
        question: 'How does the Retaining Wall Calculator count blocks?',
        answer:
          'It rounds wall height up to whole courses, rounds wall length up to blocks per course, multiplies them, then adds the waste percent. This is a layout estimate, not a cut sheet.',
      },
      {
        question: 'What does the 40 ft by 3 ft example mean?',
        answer:
          'With 16 by 6 inch blocks and 5% waste, the example needs 6 courses, 30 blocks per course, 189 wall blocks, 42 cap blocks, and about 1.17 cubic yards of base gravel.',
      },
      {
        question: 'Does this calculate retaining wall square feet?',
        answer:
          'The wall face area is length times height, but the calculator uses courses and blocks because you buy whole blocks. Square feet alone can hide rounded rows, caps, cuts, and waste.',
      },
      {
        question: 'Can I use this for a concrete retaining wall?',
        answer:
          'Use it for segmental concrete retaining wall blocks. It does not estimate poured concrete wall volume, footings, rebar, formwork, or structural design.',
      },
      {
        question: 'Can it handle curved retaining walls?',
        answer:
          'Only as a rough material check. Enter the wall length along the face or centerline you are using, then add extra waste because curves usually need more cuts and cap fitting.',
      },
      {
        question: 'Does the base gravel include drainage gravel behind the wall?',
        answer:
          'No. The base result is only the leveling/base trench. Drainage stone, drain pipe, filter fabric, geogrid, and backfill need their own takeoff.',
      },
      {
        question: 'When should I ask an engineer or local building office?',
        answer:
          'Ask before relying on this for taller walls, slopes above or below the wall, driveways, fences, buildings, poor soil, water problems, terraced walls, or any wall that needs a permit.',
      },
      {
        question: 'Can this design a safe retaining wall?',
        answer:
          'No. It only counts materials. Drainage, soil pressure, wall height, geogrid, surcharge loads, setback, embedment, and local rules need proper design.',
      },
    ],
    useCases: [
      'Estimate block count for simple segmental retaining walls.',
      'Plan cap blocks for the top course.',
      'Estimate gravel base volume.',
      'Compare block sizes before buying material.',
      'Check a store material list before ordering blocks, caps, and base gravel.',
    ],
    examples: [
      { label: 'Garden wall', expression: '40 ft long, 3 ft high, 16 x 6 in blocks, 5% waste', result: '189 wall blocks, 42 caps, about 1.17 yd3 base gravel' },
      { label: 'Short landscape wall', expression: '24 ft long, 2 ft high, 12 x 4 in blocks, 8% waste', result: '156 wall blocks, 26 caps, about 0.43 yd3 base gravel' },
      { label: 'Course check', expression: '3 ft wall height and 6 in block height', result: '6 courses' },
      { label: 'Base trench', expression: '40 ft long, 18 in wide, 6 in deep, 5% waste', result: '31.5 ft3, about 1.17 yd3 base gravel' },
    ],
    relatedSlugs: ['concrete-block-calculator', 'gravel-calculator', 'concrete-block-fill-calculator', 'concrete-footing-calculator'],
  }),
  makeUtilityTool({
    slug: 'rebar-weight-calculator',
    name: 'Rebar Weight Calculator',
    category: 'home-projects',
    summary: 'Estimate rebar weight from bar size, length, quantity, and waste.',
    description:
      'Estimate rebar pounds, US tons, adjusted length, and weight per foot for common US rebar sizes from #3 through #8.',
    seoTitle: 'Rebar Weight Calculator | Pounds, Tons, Chart',
    seoDescription:
      'Estimate rebar weight from bar size, length, quantity, and waste. See pounds, US tons, adjusted feet, and #3 to #8 weight-per-foot values.',
    icon: 'calculator-rebar-weight',
    aliases: [
      'Rebar Weight Per Foot Calculator',
      'Reinforcing Bar Weight Calculator',
      'Steel Rebar Weight Calculator',
      'Rebar Weight Chart',
      '#4 Rebar Weight Calculator',
      '#5 Rebar Weight Calculator',
      'Rebar Tons Calculator',
      'Rebar Weight Calculator For Slab',
    ],
    formula:
      'The calculator multiplies length per bar by quantity, adds the waste percent, uses the nominal weight per foot for the selected rebar size, and divides total pounds by 2,000 for US tons.',
    limit:
      'This is ordering and hauling math only. Nominal weights are planning values, and mill tolerances, coatings, cut lists, lap splices, chairs, bundle rules, bar spacing, concrete cover, inspections, and structural design can change the real order.',
    inputExplanations: [
      { term: 'Rebar size', meaning: 'the US bar size, such as #4 or #5, used to choose nominal weight per foot.' },
      { term: 'Length per bar', meaning: 'the length of one straight bar, stock bar, or cut piece in feet.' },
      { term: 'Quantity', meaning: 'how many matching bars or pieces at that length.' },
      { term: 'Waste percent', meaning: 'extra length for cuts, lap splices, layout changes, bent pieces, and damaged bars.' },
    ],
    extraFaq: [
      {
        question: 'What does #4 rebar mean?',
        answer:
          '#4 is a common US rebar size with a nominal diameter of 1/2 inch and a planning weight of about 0.668 lb per foot.',
      },
      {
        question: 'How much does #5 rebar weigh per foot?',
        answer:
          '#5 rebar weighs about 1.043 lb per foot. For example, eight 30-foot #5 bars with 8% waste come out to about 270.35 lb.',
      },
      {
        question: 'How do I calculate total rebar weight?',
        answer:
          'Multiply length per bar by quantity, add waste, then multiply by the weight per foot for the bar size. The calculator also divides pounds by 2,000 to show US tons.',
      },
      {
        question: 'Does this work as a rebar weight chart?',
        answer:
          'Yes. The rebar size menu shows the weight per foot for #3, #4, #5, #6, #7, and #8 bars. Use the calculator when you also know length and quantity.',
      },
      {
        question: 'Can I use this for a concrete slab?',
        answer:
          'Yes, if you already know the bar size, bar length, and quantity. Use the separate Rebar Calculator first if you still need a slab grid count from spacing.',
      },
      {
        question: 'Why does waste matter for rebar weight?',
        answer:
          'Waste covers cutoffs, overlaps, lap splices, bent bars, layout changes, and damaged pieces. A neat cut list may need little waste; a messy layout needs more.',
      },
      {
        question: 'Does this include lap splice design?',
        answer:
          'No. It can add a waste allowance for laps, but lap length itself depends on bar size, concrete strength, grade, spacing, cover, and the project drawings.',
      },
      {
        question: 'Can this estimate delivery or hauling weight?',
        answer:
          'It gives a good planning weight in pounds and US tons. Check supplier bundle counts, coatings, mill tolerances, and truck or trailer limits before hauling.',
      },
      {
        question: 'Does epoxy-coated rebar weigh the same?',
        answer:
          'The steel weight is based on nominal bar size. Coatings, tags, bundling, and supplier packaging can add small differences to the delivered weight.',
      },
      {
        question: 'Is rebar weight the same as rebar design?',
        answer:
          'No. Weight helps with ordering and hauling. Bar size, spacing, lap length, cover, support chairs, placement, and inspections still need project-specific design.',
      },
    ],
    useCases: [
      'Estimate rebar weight for pickup or delivery planning.',
      'Compare #3, #4, #5, and larger bars.',
      'Add waste for cut lists and lap planning.',
      'Convert total pounds to US tons.',
      'Check a supplier list against a quick weight-per-foot chart.',
    ],
    examples: [
      { label: '#4 slab bars', expression: '12 bars, 20 ft each, 10% waste', result: '176.352 lb' },
      { label: '#5 footing bars', expression: '8 bars, 30 ft each, 8% waste', result: '270.346 lb' },
      { label: '#3 light grid', expression: '20 bars, 10 ft each, no waste', result: '75.2 lb' },
      { label: '#6 heavy bars', expression: '6 bars, 40 ft each, 5% waste', result: '378.504 lb, about 0.189 tons' },
    ],
    relatedSlugs: ['rebar-calculator', 'concrete-reinforcing-mesh-calculator', 'concrete-calculator', 'concrete-weight-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-footing-calculator',
    name: 'Concrete Footing Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete volume and bag counts for straight rectangular footings.',
    description:
      'Estimate cubic feet, cubic yards, 60 lb bags, and 80 lb bags for straight rectangular concrete footings from length, width, depth, and waste.',
    seoTitle: 'Concrete Footing Calculator | Yards And Bags',
    seoDescription:
      'Estimate concrete for straight footings. Enter footing length, width, depth, and waste to get cubic feet, cubic yards, 60 lb bags, and 80 lb bags.',
    icon: 'calculator-concrete-footing',
    aliases: [
      'Footing Concrete Calculator',
      'Foundation Footing Calculator',
      'Concrete Footing Cost Calculator',
      'Concrete Footing Bags Calculator',
      'Concrete Footing Cubic Yard Calculator',
      'Concrete Foundation Footing Calculator',
      'Free Concrete Footing Calculator',
    ],
    formula:
      'The calculator converts footing width and depth from inches to feet, multiplies length by width by depth, adds the waste percent, converts cubic feet to cubic yards, and rounds 60 lb and 80 lb bag counts up.',
    limit:
      'This estimates concrete material after you already know the footing size. Soil bearing, loads, frost depth, reinforcement, drainage, slope, forms, inspections, and local code can change the real footing design.',
    inputExplanations: [
      { term: 'Footing length', meaning: 'the total straight run of the footing in feet.' },
      { term: 'Footing width', meaning: 'the planned cross-section width in inches, not the wall width unless they match your drawing.' },
      { term: 'Footing depth', meaning: 'the planned concrete thickness in inches.' },
      { term: 'Waste percent', meaning: 'extra concrete for uneven trench bottoms, overdigging, spillage, and a small ordering cushion.' },
      { term: 'Bag counts', meaning: 'rounded estimates using common dry-mix yields, useful for small hand-mixed jobs.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Concrete Footing Calculator show both cubic yards and bags?',
        answer:
          'Cubic yards are useful for ready-mix orders, while 60 lb and 80 lb bag counts are useful for smaller hand-mixed projects. Large footings are usually better handled with a concrete supplier or contractor.',
      },
      {
        question: 'How do I calculate concrete for a footing?',
        answer:
          'Convert width and depth from inches to feet, multiply length x width x depth, add waste, then divide cubic feet by 27 to get cubic yards.',
      },
      {
        question: 'How much concrete is in a 30 ft by 16 in by 8 in footing?',
        answer:
          'With 10% waste, that footing is about 29.33 cubic feet, 1.09 cubic yards, 49 eighty-pound bags, or 66 sixty-pound bags.',
      },
      {
        question: 'Should I order bags or ready-mix for footings?',
        answer:
          'Small repairs can make sense with bags. Long footing runs usually become heavy fast, so cubic yards and a ready-mix quote are often easier to manage.',
      },
      {
        question: 'Does this include rebar?',
        answer:
          'No. It estimates concrete volume only. Use the Rebar Calculator for grid or bar counts and the Rebar Weight Calculator if you need steel weight.',
      },
      {
        question: 'Does this include footing cost?',
        answer:
          'Not directly. Use the cubic-yard result for ready-mix pricing or the rounded bag counts for store pricing, then add delivery, tools, forms, reinforcement, and labor separately.',
      },
      {
        question: 'What waste percent should I use?',
        answer:
          'For neat forms, 5% to 10% is a common planning cushion. Rough trenches, overdigging, uneven bottoms, and hand mixing may need more.',
      },
      {
        question: 'Can I use this for foundation footings?',
        answer:
          'Yes, for material volume after the footing size is chosen. It does not choose code-safe width, depth, reinforcement, frost depth, or soil-bearing design.',
      },
      {
        question: 'Can I use this for pier or post footings?',
        answer:
          'Only if the footing is rectangular. Use the Concrete Column Calculator or Post Hole Concrete Calculator for round tube forms or post holes.',
      },
      {
        question: 'Can this tell me the correct footing size?',
        answer:
          'No. It only estimates material from the size you enter. The right footing size depends on loads, soil, frost depth, reinforcement, and building rules.',
      },
    ],
    useCases: [
      'Estimate concrete for a simple straight footing run.',
      'Convert width and depth in inches into cubic yards.',
      'Compare ready-mix volume with common bag counts.',
      'Add a realistic waste cushion before pricing material.',
      'Check a small footing repair against bag yield before shopping.',
    ],
    examples: [
      { label: 'Garage footing run', expression: '30 ft long, 16 in wide, 8 in deep, 10% waste', result: '29.33 ft3, about 1.09 yd3, 49 eighty-pound bags' },
      { label: 'Garden wall footing', expression: '18 ft long, 12 in wide, 8 in deep, 8% waste', result: '12.96 ft3, about 0.48 yd3, 22 eighty-pound bags' },
      { label: 'Small repair footing', expression: '8 ft long, 10 in wide, 6 in deep, 5% waste', result: '3.5 ft3, about 0.13 yd3, 6 eighty-pound bags' },
      { label: 'Long foundation run', expression: '50 ft long, 24 in wide, 10 in deep, 10% waste', result: '91.67 ft3, about 3.4 yd3' },
    ],
    relatedSlugs: ['concrete-calculator', 'rebar-calculator', 'cubic-yard-calculator', 'concrete-column-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-column-calculator',
    name: 'Concrete Column Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete for round columns, piers, and tube forms.',
    description:
      'Estimate concrete for round columns, piers, and tube forms. Enter inside diameter, filled height, quantity, and waste to get cubic feet, cubic yards, 60 lb bags, and 80 lb bags.',
    icon: 'calculator-concrete-column',
    seoTitle: 'Concrete Column Calculator | Yards And Bags',
    seoDescription:
      'Estimate concrete for round columns and piers. Enter inside diameter, filled height, quantity, and waste to get cubic feet, cubic yards, 60 lb bags, and 80 lb bags.',
    aliases: [
      'Concrete Pier Calculator',
      'Sonotube Concrete Calculator',
      'Round Column Concrete Calculator',
      'Concrete Column Calculator Bags',
      'Circular Column Volume Calculator',
      'Column Concrete Ratio',
    ],
    formula:
      'The calculator converts inside diameter from inches to feet, divides by two for radius, uses pi times radius squared times filled height, multiplies by quantity, adds waste, converts to cubic yards, and rounds bag counts up.',
    limit:
      'This is material volume math only. Footing bells, flared bases, reinforcement, anchors, structural loads, form bracing, vibration, soil, frost depth, inspections, and local code can change the real pour.',
    inputExplanations: [
      { term: 'Inside diameter', meaning: 'the clear width across the inside of the round tube or form, measured in inches.' },
      { term: 'Filled height', meaning: 'the height of concrete inside the form, measured in feet.' },
      { term: 'Quantity', meaning: 'how many matching round columns or piers are included.' },
      { term: 'Waste percent', meaning: 'extra concrete for form variation, spillage, overfill, and ordering cushion.' },
    ],
    extraFaq: [
      {
        question: 'What does diameter mean for a concrete column?',
        answer:
          'Diameter is the full width across the round form. The calculator divides it by two to get radius, then uses the cylinder formula. Do not enter radius in the diameter box.',
      },
      {
        question: 'Does this include a wider footing or bell at the bottom?',
        answer:
          'No. It estimates the straight round column only. If your pier has a widened base, calculate that extra concrete separately or ask the designer for the takeoff.',
      },
      {
        question: 'How much concrete is in an 18 inch by 8 foot round column?',
        answer:
          'One 18 inch diameter column filled 8 feet high is about 14.14 cubic feet before waste. Three matching columns with 10% waste need about 46.65 cubic feet, or 1.73 cubic yards.',
      },
      {
        question: 'How many 80 lb bags are needed for three 18 inch by 8 foot columns?',
        answer:
          'Using the default 10% waste setting, three 18 inch by 8 foot round columns need about 78 eighty-pound bags. Bag yields vary, so check the bag label before buying.',
      },
      {
        question: 'Should I enter the outside or inside diameter of a tube form?',
        answer:
          'Enter the inside diameter because concrete fills the empty space inside the form. If a product lists both sizes, use the inner size or the finished column diameter.',
      },
      {
        question: 'Does this calculate square concrete columns?',
        answer:
          'No. This page is for round columns and piers. For a square or rectangular column, multiply length by width by height or use the regular Concrete Calculator with those dimensions.',
      },
      {
        question: 'Does this design a reinforced concrete column?',
        answer:
          'No. It only estimates concrete volume. Reinforced concrete column design needs loads, rebar, ties, concrete strength, footing details, and local code review.',
      },
      {
        question: 'Why does the calculator round bag counts up?',
        answer:
          'You cannot buy part of a bag, and shorting a column pour is painful. The calculator rounds 60 lb and 80 lb bag estimates up after adding the waste percent.',
      },
      {
        question: 'What waste percent should I use for round column forms?',
        answer:
          'Small pours often use 5% to 10% waste for small spills, uneven height, and form variation. Use more if the forms are rough, the ground is uneven, or the pour will be hard to control.',
      },
      {
        question: 'Does this include anchor bolts, rebar, or form bracing?',
        answer:
          'No. It estimates concrete only. Anchor bolts, rebar cages, ties, bracing, vibration, and finishing are separate planning items.',
      },
      {
        question: 'Can I use this for deck piers?',
        answer:
          'Only for the straight round concrete volume. Deck pier size, depth, rebar, uplift, frost protection, and inspection rules can be code-sensitive, so use the approved plan for the actual dimensions.',
      },
    ],
    useCases: [
      'Estimate concrete for round tube forms.',
      'Compare 12-inch, 16-inch, and 18-inch pier sizes.',
      'Plan bag counts for small column pours.',
      'Add waste before pricing ready-mix or bagged concrete.',
    ],
    examples: [
      { label: 'Three round piers', expression: '18 in inside diameter, 8 ft filled height, 3 columns, 10% waste', result: '46.65 ft3, about 1.73 yd3, 78 eighty-pound bags' },
      { label: 'Porch column bases', expression: '12 in inside diameter, 3 ft filled height, 4 columns, 8% waste', result: '10.18 ft3, about 0.38 yd3, 17 eighty-pound bags' },
      { label: 'Deck support tubes', expression: '10 in inside diameter, 4 ft filled height, 6 tubes, 8% waste', result: '14.14 ft3, about 0.52 yd3, 24 eighty-pound bags' },
      { label: 'Single short pier', expression: '16 in inside diameter, 5 ft filled height, 1 pier, 5% waste', result: '7.33 ft3, about 0.27 yd3' },
    ],
    relatedSlugs: ['concrete-footing-calculator', 'post-hole-concrete-calculator', 'concrete-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'post-hole-concrete-calculator',
    name: 'Post Hole Concrete Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete bag counts for fence, deck, and mailbox post holes.',
    description:
      'Estimate concrete for fence posts, deck posts, mailbox posts, and small round post holes. Enter hole size, post size, quantity, and waste to get concrete per hole, cubic yards, 60 lb bags, and 80 lb bags.',
    icon: 'calculator-post-hole-concrete',
    seoTitle: 'Post Hole Concrete Calculator | Bags Per Hole',
    seoDescription:
      'Estimate concrete for fence, deck, and mailbox post holes. Enter hole diameter, depth, post diameter, quantity, and waste to get bag counts and concrete per hole.',
    aliases: [
      'Fence Post Concrete Calculator',
      'Post Hole Calculator',
      'Concrete Post Hole Calculator',
      'Bag Concrete Calculator',
      'Quikrete Concrete Calculator',
      'Post Concrete Calculator',
      'Post Hole Concrete Bags',
    ],
    formula:
      'The calculator finds round hole volume, subtracts the round post volume inside the hole, multiplies the net fill by the number of holes, adds waste, converts to cubic yards, and rounds 60 lb and 80 lb bag counts up.',
    limit:
      'Post depth, hole width, gravel base, frost depth, uplift, gate loads, deck loads, soil, drainage, bracing, product instructions, and local code can change what you actually need.',
    inputExplanations: [
      { term: 'Hole diameter', meaning: 'the width across the round hole in inches.' },
      { term: 'Hole depth', meaning: 'the depth filled with concrete in inches.' },
      { term: 'Post diameter', meaning: 'the round-equivalent width of the post that takes up space inside the hole.' },
      { term: 'Quantity', meaning: 'how many matching holes to estimate.' },
      { term: 'Waste percent', meaning: 'extra concrete for uneven holes, overfill, spillage, and ordering cushion.' },
    ],
    extraFaq: [
      {
        question: 'Why does the calculator subtract the post volume?',
        answer:
          'The post occupies part of the hole, so concrete only fills the space around it. Subtracting the post keeps the estimate closer than treating the whole hole as concrete.',
      },
      {
        question: 'What if my post is square?',
        answer:
          'Use the closest equivalent diameter for a rough estimate or calculate the square post area separately. For big jobs, a contractor takeoff is safer.',
      },
      {
        question: 'How much concrete is needed for six 12 inch by 30 inch post holes?',
        answer:
          'With a 4 inch post in each hole and 10% waste, the default example needs about 11.52 cubic feet of concrete total, or 20 eighty-pound bags.',
      },
      {
        question: 'How many 80 lb bags do I need per fence post?',
        answer:
          'The default 12 inch by 30 inch hole with a 4 inch post uses about 3.3 eighty-pound bags per hole after 10% waste, so six holes round up to 20 bags total.',
      },
      {
        question: 'Should I include the post diameter?',
        answer:
          'Yes if the post sits in the concrete while the hole is filled. The post takes up space, so subtracting it keeps the bag count closer than filling the whole hole as solid concrete.',
      },
      {
        question: 'What if the post is square?',
        answer:
          'A square post does not subtract perfectly with a round diameter field. For a quick estimate, enter the post width as the diameter. For important or expensive work, calculate the square post volume separately.',
      },
      {
        question: 'Does this include gravel under the post?',
        answer:
          'No. If your plan uses gravel at the bottom, subtract that depth from the concrete depth or estimate the gravel separately.',
      },
      {
        question: 'Can I use this for deck posts or gate posts?',
        answer:
          'Use it only for the concrete volume around the post. Deck and gate posts can need deeper holes, wider holes, bracing, uplift checks, frost protection, and inspections.',
      },
      {
        question: 'Does this choose the right hole depth?',
        answer:
          'No. The calculator uses the depth you enter. Fence height, soil, frost line, wind, gate load, deck load, and local code can all change the depth.',
      },
      {
        question: 'Why are bag counts rounded up?',
        answer:
          'Concrete bags are sold as whole bags. The calculator rounds up after waste because running short during a post pour is worse than having a little left over.',
      },
      {
        question: 'Can I use fast-setting concrete numbers?',
        answer:
          'Yes, but use the yield printed on the product bag if it differs from the common 60 lb and 80 lb bag assumptions used by this calculator.',
      },
    ],
    useCases: [
      'Estimate concrete bags for fence posts.',
      'Plan concrete for deck support holes.',
      'Subtract post volume from round hole volume.',
      'Compare hole sizes before buying concrete.',
    ],
    examples: [
      { label: 'Fence posts', expression: '12 in hole, 30 in deep, 4 in post, 6 holes, 10% waste', result: '11.52 ft3 total, about 0.43 yd3, 20 eighty-pound bags' },
      { label: 'Deck posts', expression: '14 in hole, 36 in deep, 6 in post, 4 holes, 10% waste', result: '11.52 ft3 total, about 0.43 yd3, 20 eighty-pound bags' },
      { label: 'Mailbox post', expression: '10 in hole, 24 in deep, 4 in post, 5% waste', result: '0.96 ft3, about 2 eighty-pound bags' },
      { label: 'Gate posts', expression: '16 in hole, 42 in deep, 6 in post, 2 holes, 10% waste', result: '9.24 ft3 total, about 16 eighty-pound bags' },
    ],
    relatedSlugs: ['fence-calculator', 'concrete-column-calculator', 'concrete-footing-calculator', 'concrete-calculator'],
  }),
  makeUtilityTool({
    slug: 'plywood-calculator',
    name: 'Plywood Calculator',
    category: 'home-projects',
    summary: 'Estimate plywood sheet count, coverage, waste, and optional cost.',
    description:
      'Use this free plywood calculator to estimate 4x8 sheet count, square-foot coverage, waste, and rough material cost before you buy panels.',
    seoTitle: 'Plywood Calculator | 4x8 Sheet Count',
    seoDescription:
      'Estimate 4x8 plywood sheets from square feet, waste, sheet size, and price per sheet. Check roof, floor, wall, cabinet, and cut-layout limits.',
    icon: 'calculator-plywood',
    aliases: [
      '4x8 Plywood Calculator',
      'Plywood Sheet Calculator',
      'Plywood Calculator Square Feet',
      'Plywood Calculator For Roof',
      'Plywood Calculator For Cabinets',
      'Plywood Calculator For Floor',
      'Plywood Calculator For Walls',
      'Sheet Goods Calculator',
    ],
    formula:
      'The calculator multiplies sheet width by sheet length for sheet coverage, adds waste to the project area, divides adjusted area by sheet coverage, and rounds up.',
    limit:
      'This is area math, not a cut plan or building approval. Roof pitch, subfloor rating, wall openings, cabinet cut lists, seams, grain, thickness, grade, fasteners, and local code can change what you actually buy.',
    inputExplanations: [
      { term: 'Project area', meaning: 'the floor, wall, roof deck, cabinet, or furniture square feet you want to cover before waste.' },
      { term: 'Sheet width and length', meaning: 'the actual panel size in feet. A common full plywood sheet is 4 by 8 feet, or 32 square feet.' },
      { term: 'Waste percent', meaning: 'extra sheet area for cuts, layout, damaged edges, saw kerf, and mistakes.' },
      { term: 'Price per sheet', meaning: 'optional cost input used only for a rough panel-material price.' },
    ],
    extraFaq: [
      {
        question: 'How many square feet are in a 4x8 plywood sheet?',
        answer:
          'A 4 by 8 foot plywood sheet covers 32 square feet before cuts. The calculator uses width x length, so you can also enter 2 x 4 project panels, 4 x 10 panels, or another sheet size.',
      },
      {
        question: 'How does the plywood calculator handle waste?',
        answer:
          'It multiplies the project area by 1 plus the waste percent. For 420 square feet with 10% waste, the adjusted area is 462 square feet before dividing by sheet coverage.',
      },
      {
        question: 'Does plywood sheet count include the best cut layout?',
        answer:
          'No. It estimates sheets by area. Real layouts need seams on framing, grain direction, panel orientation, and leftover pieces checked before buying.',
      },
      {
        question: 'Can I use this as a plywood calculator for a roof?',
        answer:
          'Yes for a rough roof-deck sheet count after you know the roof square footage. It does not choose sheathing thickness, panel rating, nail pattern, spacing, clips, underlayment, or code details.',
      },
      {
        question: 'Can I use it for subfloor plywood?',
        answer:
          'Yes for quantity planning. For a real subfloor, check the span rating, tongue-and-groove type, panel orientation, fastening schedule, joist spacing, and local code before buying.',
      },
      {
        question: 'Can I use it for cabinet plywood or furniture panels?',
        answer:
          'Use it for a rough panel budget, but do not treat it as a cut-list optimizer. Cabinets and furniture depend on part sizes, grain direction, kerf, edge banding, and which offcuts are usable.',
      },
      {
        question: 'Should I subtract windows, doors, or other openings?',
        answer:
          'Subtract large openings from your project area before entering it. Then add waste because cuts around openings can still use more material than the net square footage suggests.',
      },
      {
        question: 'Should I enter nominal or actual sheet size?',
        answer:
          'Use the size printed for the sheet you will buy. Most full sheets are 4 by 8 feet, but project panels and specialty goods can be different.',
      },
      {
        question: 'What waste percent should I use for plywood?',
        answer:
          'For simple square areas, 10% is a common starting point. Use more for angled roofs, cut-up rooms, cabinet parts, visible grain matching, damaged edges, or layouts with many small pieces.',
      },
      {
        question: 'Does the cost estimate include fasteners or delivery?',
        answer:
          'No. Price per sheet only multiplies whole sheets by the panel price. Screws, nails, adhesive, edge banding, underlayment, delivery, tax, and tool rental are outside this estimate.',
      },
      {
        question: 'Can I use this for OSB, MDF, or other sheet goods?',
        answer:
          'Yes if you only need area-based sheet count. The material choice still matters because OSB, MDF, sanded plywood, hardwood plywood, and rated sheathing are used for different jobs.',
      },
    ],
    useCases: [
      'Estimate 4x8 plywood sheets for a subfloor or wall.',
      'Plan rough roof sheathing sheet count from roof square footage.',
      'Compare full sheets with smaller project panels.',
      'Add waste for cuts, offcuts, and layout mistakes.',
      'Estimate rough sheet cost before a store run.',
    ],
    examples: [
      { label: 'Subfloor sheets', expression: '420 ft2, 4 x 8 ft sheets, 10% waste', result: '462 adjusted ft2, 15 sheets, 480 ft2 bought' },
      { label: 'Small wall sheathing', expression: '180 ft2, 4 x 8 ft sheets, 12% waste', result: '201.6 adjusted ft2, 7 sheets' },
      { label: 'Roof deck', expression: '750 ft2, 4 x 8 ft sheets, 10% waste', result: '825 adjusted ft2, 26 sheets' },
      { label: 'Project panels', expression: '96 ft2, 2 x 4 ft panels, 15% waste', result: '110.4 adjusted ft2, 14 panels' },
    ],
    relatedSlugs: ['roofing-calculator', 'drywall-calculator', 'flooring-calculator', 'carpet-calculator'],
  }),
  makeUtilityTool({
    slug: 'insulation-calculator',
    name: 'Insulation Calculator',
    category: 'home-projects',
    summary: 'Estimate insulation pack count from area, openings, package coverage, and waste.',
    description:
      'Estimate insulation packs from square footage, openings, package coverage, and waste before you compare product labels.',
    seoTitle: 'Insulation Calculator | Square Feet And Packs',
    seoDescription:
      'Estimate insulation packs from wall, attic, ceiling, or floor square footage. Subtract openings, add waste, and check R-value limits before buying.',
    icon: 'calculator-insulation',
    aliases: [
      'Insulation Roll Calculator',
      'Insulation Batt Calculator',
      'insulation calculator square feet',
      'wall insulation calculator',
      'attic insulation calculator',
      'ceiling insulation calculator',
      'residential insulation calculator',
    ],
    formula:
      'The calculator subtracts openings from measured area, adds waste, divides by square feet covered per pack, and rounds up to whole packs.',
    limit:
      'Insulation is not just area. R-value, climate zone, air sealing, vapor control, moisture, ventilation, fire rules, and local code all matter.',
    inputExplanations: [
      { term: 'Area', meaning: 'the wall, ceiling, floor, or attic square footage before subtracting openings.' },
      { term: 'Openings', meaning: 'windows, doors, attic hatches, or other spaces that should not receive insulation.' },
      { term: 'Coverage per pack', meaning: 'the square feet one package covers at the product thickness or R-value.' },
      { term: 'Waste percent', meaning: 'extra insulation for cuts, odd cavities, fitting, and mistakes.' },
    ],
    extraFaq: [
      {
        question: 'What does R-value mean in insulation planning?',
        answer:
          'R-value is resistance to heat flow. Higher R-value usually slows heat movement more, but the right target depends on the location, climate, product type, and code.',
      },
      {
        question: 'Can this choose the correct insulation for my house?',
        answer:
          'No. It estimates packs after you choose a product. Use local code, ENERGY STAR or DOE guidance, and product labels to choose the right R-value and installation method.',
      },
      {
        question: 'Why do I need coverage per pack?',
        answer:
          'Coverage changes by product, thickness, and R-value. Use the square-foot coverage printed on the bag, roll, batt pack, or store product page.',
      },
      {
        question: 'Should I subtract windows, doors, and attic hatches?',
        answer:
          'Yes. Subtract areas that will not receive insulation, then add waste for cuts, odd framing bays, and fitting around small obstacles.',
      },
      {
        question: 'Can I use this for attic insulation?',
        answer:
          'Yes, if you already know the product coverage at the R-value or depth you plan to install. For blown-in insulation, use the bag coverage chart instead of guessing.',
      },
      {
        question: 'Does higher R-value always mean fewer packs?',
        answer:
          'Usually no. Higher R-value often means thicker insulation or more material, so each pack may cover fewer square feet. Check the label for the exact coverage.',
      },
    ],
    useCases: [
      'Estimate insulation packs for walls, attics, or floor areas.',
      'Subtract doors, windows, and hatches before waste.',
      'Use product-label coverage per package.',
      'Estimate rough cost from price per pack.',
    ],
    examples: [
      { label: 'Wall insulation', expression: '960 ft2 area, 80 ft2 openings, 40 ft2 per pack, 10% waste', result: '25 packs' },
      { label: 'Attic roll coverage', expression: '1,200 ft2 area, 48 ft2 per pack, 10% waste', result: '28 packs' },
      { label: 'Small garage wall', expression: '420 ft2 area, 20 ft2 openings, 32 ft2 per pack, 12% waste', result: '14 packs' },
    ],
    relatedSlugs: ['btu-calculator', 'square-footage-calculator', 'drywall-calculator'],
  }),
  makeUtilityTool({
    slug: 'countertop-calculator',
    name: 'Countertop Calculator',
    category: 'home-projects',
    summary: 'Estimate countertop square footage, backsplash area, waste, and optional material cost.',
    seoTitle: 'Countertop Calculator | Square Feet And Cost',
    seoDescription:
      'Estimate kitchen countertop square feet and cost for quartz, granite, or laminate from run length, depth, backsplash, cutouts, waste, and price per ft2.',
    description:
      'Use this free countertop calculator to estimate kitchen countertop area and rough material cost from run length, depth, backsplash, cutouts, waste, and optional price per square foot.',
    icon: 'calculator-countertop',
    aliases: [
      'Countertop Square Foot Calculator',
      'Kitchen Countertop Calculator',
      'Quartz Countertop Calculator',
      'Granite Countertop Calculator',
      'Laminate Countertop Calculator',
      'Countertop Measurement Tool',
      'L-Shaped Countertop Calculator',
    ],
    formula:
      'The calculator converts depth and backsplash height to feet, multiplies each run by its depth, adds backsplash area, subtracts known cutouts, adds waste, and multiplies by price when entered.',
    limit:
      'Real quotes can change for slab layout, seams, sink type, cutout labor, edge profile, overhangs, templating, fabrication, install labor, delivery, and supplier minimums.',
    inputExplanations: [
      { term: 'Run length', meaning: 'the combined straight countertop runs in feet. Add matching-depth L-shape sections together, or estimate different depths separately.' },
      { term: 'Depth', meaning: 'finished front-to-wall countertop depth in inches, including overhang when it is part of the top.' },
      { term: 'Backsplash', meaning: 'optional backsplash run length and height added to the square footage.' },
      { term: 'Cutouts', meaning: 'sink or cooktop areas subtracted before waste when you know them, while remembering labor charges usually remain.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate countertop square feet?',
        answer:
          'Multiply countertop run length by depth after converting depth from inches to feet. Add backsplash area, subtract any known cutout area, then add waste for layout and trimming.',
      },
      {
        question: 'Does this work for quartz, granite, and laminate countertops?',
        answer:
          'Yes for rough square-foot planning. Quartz, granite, laminate, solid surface, butcher block, and other materials can use the same area math, but each supplier may price slabs, seams, edges, and labor differently.',
      },
      {
        question: 'How do I use the calculator for an L-shaped countertop?',
        answer:
          'If both legs have the same depth, add the two straight runs and enter the total length. If one section is deeper, estimate each section separately and add the adjusted square-foot results.',
      },
      {
        question: 'Should I include an island or peninsula?',
        answer:
          'Yes. Measure the island or peninsula as its own run. If it has a different depth than the wall counters, run the calculator once for each depth and add the results.',
      },
      {
        question: 'Should I include backsplash in the countertop estimate?',
        answer:
          'Include backsplash when the backsplash uses the same countertop material and the supplier prices it by square foot. Enter 0 for backsplash length or height when there is none.',
      },
      {
        question: 'Should I subtract sink and cooktop cutouts?',
        answer:
          'Only subtract them for a rough material area check. Many fabricators still charge for cutout work, templates, and the slab waste around the opening.',
      },
      {
        question: 'What waste percent should I use for countertops?',
        answer:
          'Ten percent is a useful early planning number for simple layouts. Complex corners, slab direction, matching patterns, large islands, or supplier slab minimums can make real waste higher.',
      },
      {
        question: 'Does the estimated cost include installation?',
        answer:
          'No. The cost result only multiplies adjusted square feet by the price you enter. Edge profiles, templates, sink cutouts, removal, plumbing, fabrication, delivery, and installation are separate quote items.',
      },
      {
        question: 'Why can a countertop quote be higher than the square-foot estimate?',
        answer:
          'Countertops often include edge profiles, seams, corner layouts, backsplash pieces, sink cutouts, delivery, labor, and minimum slab purchase rules.',
      },
    ],
    useCases: [
      'Estimate countertop square footage for a kitchen or vanity.',
      'Add backsplash area when the backsplash uses the same material.',
      'Subtract known cutout area for rough material planning.',
      'Compare quartz, granite, laminate, or solid-surface rough cost at different material prices.',
      'Plan L-shaped counters by adding matching-depth runs or estimating sections separately.',
    ],
    examples: [
      { label: 'Kitchen run', expression: '18 ft run, 25.5 in depth, 18 ft x 4 in backsplash, 4 ft2 cutouts, 10% waste', result: '44.275 ft2 after waste' },
      { label: 'Bathroom vanity', expression: '6 ft run, 22 in depth, 6 ft x 4 in backsplash, 2 ft2 sink cutout, 8% waste', result: '11.88 ft2 after waste' },
      { label: 'Kitchen island', expression: '7 ft island, 42 in depth, no backsplash, 8% waste', result: '26.46 ft2 after waste' },
      { label: 'L-shaped counter', expression: '10 ft + 8 ft runs at 25.5 in depth, no backsplash, 10% waste', result: '42.075 ft2 after waste' },
    ],
    relatedSlugs: ['unit-price-calculator', 'discount-calculator', 'budget-calculator'],
  }),
  makeUtilityTool({
    slug: 'sod-calculator',
    name: 'Sod Calculator',
    category: 'home-projects',
    summary: 'Estimate sod rolls, pallets, adjusted area, and optional cost.',
    seoTitle: 'Sod Calculator | Rolls, Pallets, And Cost',
    seoDescription:
      'Estimate sod rolls, pallets, adjusted lawn area, and rough cost from square feet, roll coverage, rolls per pallet, waste, and price per roll.',
    description:
      'Use this free sod calculator to estimate rolls, slabs, pallets, adjusted lawn area, and rough material cost from square feet, roll coverage, waste, and optional price.',
    icon: 'calculator-sod',
    aliases: [
      'Grass Sod Calculator',
      'Lawn Sod Calculator',
      'Sod Roll Calculator',
      'Sod Pallet Calculator',
      'St Augustine Sod Calculator',
      'Sod Square Foot Calculator',
      'Sod Cost Calculator',
      'Free Sod Calculator',
    ],
    formula:
      'The calculator multiplies lawn area by 1 plus waste percent, divides adjusted area by coverage per roll or slab, rounds up to whole rolls, rounds pallets up from rolls per pallet, and multiplies by price when entered.',
    limit:
      'Supplier roll and pallet sizes vary by farm, store, grass type, and moisture. Curves, slopes, damaged sod, soil prep, irrigation, seams, delivery, minimum orders, and install labor can change the final order.',
    inputExplanations: [
      { term: 'Lawn area', meaning: 'the final square feet that will receive sod after edging, grading, and section measurements.' },
      { term: 'Coverage per roll', meaning: 'the square feet one roll, slab, or piece covers according to your supplier.' },
      { term: 'Rolls per pallet', meaning: 'supplier packaging used to convert whole rolls into a pallet count.' },
      { term: 'Waste percent', meaning: 'extra sod for curved edges, trimming around beds or sprinklers, damaged pieces, seams, and small repairs.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate how much sod I need?',
        answer:
          'Measure the lawn area in square feet, add a waste percent, divide by the square feet covered by one roll or slab, then round up to whole rolls. The calculator also rounds up pallets from rolls per pallet.',
      },
      {
        question: 'What coverage per roll should I enter?',
        answer:
          'Use the coverage from the sod farm, garden center, or delivery quote you plan to buy from. Sod rolls and slabs are not universal, so the supplier number matters more than a generic average.',
      },
      {
        question: 'How many square feet are in a pallet of sod?',
        answer:
          'A pallet is packaging, not a fixed unit. Multiply your supplier coverage per roll by rolls per pallet to estimate pallet coverage, then check the supplier minimum before ordering.',
      },
      {
        question: 'What waste percent should I use for sod?',
        answer:
          'Five percent can work for a simple rectangle. Use more when the lawn has curves, beds, sidewalks, slopes, sprinkler heads, odd cuts, or if you want extra pieces for small repairs.',
      },
      {
        question: 'Does this work for St. Augustine sod?',
        answer:
          'Yes. The math is the same for St. Augustine, Bermuda, zoysia, fescue, and other sod types as long as you enter the actual coverage per roll or slab from the supplier.',
      },
      {
        question: 'How much sod do I need for 200 square feet?',
        answer:
          'With 10 ft2 rolls and 5% waste, 200 ft2 becomes 210 adjusted ft2, so you would plan for 21 rolls. Change the coverage and waste if your supplier or lawn shape is different.',
      },
      {
        question: 'Why does the Sod Calculator add waste?',
        answer:
          'Sod gets trimmed around curves, sidewalks, beds, and sprinklers. Extra pieces also help replace damaged rolls or fill small missed spots.',
      },
      {
        question: 'Should I measure lawn area before or after removing old grass?',
        answer:
          'Measure the final area that will receive new sod. Soil prep, grading, and edging can slightly change the real area, so recheck before ordering.',
      },
      {
        question: 'Does the cost include delivery, soil prep, or installation?',
        answer:
          'No. The cost result only multiplies rolls by the price per roll you enter. Delivery, grading, soil amendments, removal, irrigation fixes, labor, and minimum-order fees are separate quote items.',
      },
    ],
    useCases: [
      'Estimate sod rolls for a new lawn.',
      'Convert lawn square footage into pallets.',
      'Add waste for curved and trimmed areas.',
      'Estimate rough sod material cost.',
      'Check a small 200 square foot repair against roll coverage.',
    ],
    examples: [
      { label: 'Front lawn', expression: '1,800 ft2, 10 ft2 per roll, 50 rolls per pallet, 5% waste, $4.50 per roll', result: '189 rolls, 4 pallets, $850.50' },
      { label: 'Repair patch', expression: '220 ft2, 10 ft2 per roll, 8% waste, $5 per roll', result: '24 rolls, 1 pallet, $120' },
      { label: 'Backyard section', expression: '3,200 ft2, 10 ft2 per roll, 50 rolls per pallet, 7% waste', result: '343 rolls, 7 pallets' },
      { label: '200 ft2 spot', expression: '200 ft2, 10 ft2 per roll, 5% waste', result: '21 rolls, 1 pallet' },
    ],
    relatedSlugs: ['cubic-yard-calculator', 'unit-price-calculator', 'budget-calculator'],
  }),
  makeUtilityTool({
    slug: 'wall-stud-calculator',
    name: 'Wall Stud Calculator',
    category: 'home-projects',
    summary: 'Estimate wall studs, plate pieces, and framing board count from wall layout.',
    seoTitle: 'Wall Stud Calculator | Studs, Plates, And Boards',
    seoDescription:
      'Estimate wall studs, plate pieces, total boards, and linear feet from wall length, height, stud spacing, openings, plate rows, board length, and waste.',
    description:
      'Use this free wall stud calculator to estimate layout studs, opening allowance, plate pieces, waste, total boards, and linear feet for a simple straight wall.',
    icon: 'calculator-wall-stud',
    aliases: [
      'Stud Calculator',
      'Framing Stud Calculator',
      'Wall Framing Calculator',
      'Free Framing Calculator',
      'Stud Count Calculator',
      'Interior Wall Stud Calculator',
      'Wall Framing Calculator With Door',
      'Wall Framing Calculator With Windows And Doors',
      'Metal Stud Calculator',
      '2x4 Stud Calculator',
    ],
    formula:
      'The calculator uses floor(wall length in inches / on-center spacing) + 1 for layout studs, adds two studs per opening plus extra corner studs, rounds vertical studs up after waste, then adds plate pieces from wall length, plate rows, and board length.',
    limit:
      'This is a rough material count for a simple straight wall. Headers, jack studs, king studs, cripple studs, fire blocking, sheathing, bracing, loads, metal-stud gauge, treated plates, and code rules need a real framing plan.',
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the straight wall size in feet. Use the planned framing height, not the finished drywall height.' },
      { term: 'Stud spacing', meaning: 'on-center spacing in inches, commonly 16 or 24 for many simple residential layouts.' },
      { term: 'Openings', meaning: 'door or window openings; the tool adds two extra vertical studs per opening as a simple allowance.' },
      { term: 'Plate rows', meaning: 'horizontal top and bottom runs along the wall, often 2 rows for a simple partition or 3 rows when a double top plate is planned.' },
      { term: 'Board length', meaning: 'the purchased lumber or stud length used to round plate pieces up to whole boards.' },
    ],
    extraFaq: [
      {
        question: 'How many studs do I need for a 24 foot wall?',
        answer:
          'With 16 inch on-center spacing, a 24 ft wall has 19 layout studs before openings, corners, and waste. With the default 2 openings, 4 extra corner studs, 2 plate rows, 8 ft boards, and 10% waste, the calculator estimates 36 total boards.',
      },
      {
        question: 'How does the Wall Stud Calculator count studs?',
        answer:
          'It converts wall length to inches, divides by on-center spacing, floors that number, and adds one end stud. Then it adds the opening and corner allowances you enter.',
      },
      {
        question: 'What does on-center spacing mean?',
        answer:
          'On-center spacing is the distance from the center of one stud to the center of the next stud. A 16-inch layout means each stud center is about 16 inches apart.',
      },
      {
        question: 'Can I use 24 inch on-center spacing?',
        answer:
          'Yes. Enter 24 for stud spacing when your plan allows it. Spacing depends on wall type, sheathing or drywall requirements, load, local code, and project drawings.',
      },
      {
        question: 'Does this work with windows and doors?',
        answer:
          'It gives a rough allowance by adding two extra studs per opening. Real framed openings can need king studs, jack studs, headers, sills, cripples, and other pieces not counted by this simple mode.',
      },
      {
        question: 'Does this include headers for doors and windows?',
        answer:
          'No. It only adds a simple extra-stud allowance around openings. Header sizes, jack studs, king studs, and structural details depend on the wall design and code.',
      },
      {
        question: 'Can I use this for metal studs?',
        answer:
          'Only as rough spacing math. Metal-stud projects also need the correct gauge, track, fasteners, wall height limits, and load or fire-rating details from the plan or supplier.',
      },
      {
        question: 'What board length should I enter?',
        answer:
          'Enter the length of the boards you plan to buy for studs and plates, such as 8, 9, 10, or 12 ft. Plate pieces are rounded up from wall length and plate rows using this board length.',
      },
      {
        question: 'Why are plate pieces separate from vertical studs?',
        answer:
          'Vertical studs run between the plates. Plates run horizontally along the wall, so the calculator counts them by wall length, plate rows, and board length instead of by spacing.',
      },
      {
        question: 'What waste percent should I use for framing studs?',
        answer:
          'Five to ten percent is a common early planning range for simple walls. Use more if the wall has many cuts, layout changes, damaged boards, blocking, or extra pieces from the framing plan.',
      },
      {
        question: 'Is this a structural framing plan?',
        answer:
          'No. It is a material-count helper. Load-bearing walls, exterior walls, tall walls, braced walls, fire-rated assemblies, and engineered layouts need project drawings and code checks.',
      },
    ],
    useCases: [
      'Estimate studs for a simple interior wall.',
      'Compare 16-inch and 24-inch on-center spacing.',
      'Add plate pieces to vertical stud count.',
      'Add waste before buying framing boards.',
      'Check a rough door or window opening allowance before a real takeoff.',
    ],
    examples: [
      { label: 'Interior wall', expression: '24 ft wall, 8 ft high, 16 in spacing, 2 openings, 4 extra corner studs, 2 plate rows, 10% waste', result: '36 boards' },
      { label: 'Garage wall', expression: '32 ft wall, 9 ft high, 16 in spacing, 1 opening, 6 extra corner studs, 3 plate rows, 10 ft boards, 10% waste', result: '47 boards' },
      { label: 'Short partition', expression: '10 ft wall, 8 ft high, 16 in spacing, no openings, 2 extra corner studs, 5% waste', result: '14 boards' },
      { label: 'Window and door wall', expression: '20 ft wall, 8 ft high, 16 in spacing, 3 openings, 3 plate rows, 10% waste', result: '37 boards' },
    ],
    relatedSlugs: ['unit-price-calculator', 'discount-calculator', 'budget-calculator'],
  }),
  makeUtilityTool({
    slug: 'board-foot-calculator',
    name: 'Board Foot Calculator',
    category: 'home-projects',
    summary: 'Estimate board feet from lumber size, quantity, and actual board dimensions.',
    description:
      'Estimate sawn-lumber board feet from thickness in inches, width in inches, length in feet, and quantity, with actual-size and pricing cautions.',
    seoTitle: 'Board Foot Calculator | Lumber Volume And Price Checks',
    seoDescription:
      'Calculate board feet from thickness, width, length, and quantity. Includes 1x6 and slab examples, actual vs nominal size tips, and log-rule limits.',
    icon: 'calculator-board-foot',
    aliases: ['Lumber Board Foot Calculator', 'Board Feet Calculator', 'Hardwood Board Foot Calculator'],
    formula:
      'Board feet each = thickness inches x width inches x length feet / 12. Total board feet = board feet each x quantity.',
    limit:
      'Board feet measure sawn-lumber volume only. Actual vs nominal dimensions, surfaced thickness, seller rules, moisture, defects, species, grade, waste, and log rules can change real buying needs.',
    faqLanguage: {
      expectedInputs: 'thickness in inches, width in inches, length in feet, and quantity',
      inputFallback:
        'Thickness and width are board dimensions in inches. Length is the board length in feet. Quantity multiplies the same board size. Use actual measured dimensions when the seller gives them.',
      examplePhrase: '1 x 6 lumber example',
      doubleCheck:
        'Check whether the seller prices by rough, surfaced, nominal, or actual size. Also leave waste for defects, milling, knots, and bad cuts.',
      privacy:
        'No. The board-foot estimate runs in your browser tab. Your lumber dimensions, quantity, price checks, and recent answers are not sent to a server.',
    },
    inputExplanations: [
      { term: 'Thickness', meaning: 'board thickness in inches, such as 1, 1.5, 2, or a rough-lumber value like 4/4 when converted to inches.' },
      { term: 'Width', meaning: 'board width in inches. Use the measured width when the board is rough, live edge, or not a simple store label.' },
      { term: 'Length', meaning: 'board length in feet. An 8-foot board is entered as 8, not 96.' },
      { term: 'Quantity', meaning: 'how many boards with that same thickness, width, and length to include.' },
      { term: 'Board feet each', meaning: 'the lumber volume for one board before multiplying by quantity.' },
      { term: 'Total board feet', meaning: 'the combined lumber volume to compare with board-foot pricing.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Board Foot Calculator divide by 12?',
        answer:
          'Thickness and width are entered in inches, but length is entered in feet. Dividing by 12 converts that mixed-unit volume into board feet.',
      },
      {
        question: 'Should I use actual or nominal lumber size?',
        answer:
          'Use the size your seller uses for board-foot pricing. Rough lumber, surfaced lumber, and home-center labels can be different, so ask before comparing prices.',
      },
      {
        question: 'How many board feet are in four 1x6 boards that are 8 feet long?',
        answer:
          'One board is 1 x 6 x 8 / 12 = 4 board feet. Four matching boards are 16 board feet total.',
      },
      {
        question: 'Is board foot the same as linear foot?',
        answer:
          'No. Linear foot only measures length. Board foot measures lumber volume, so thickness and width change the answer.',
      },
      {
        question: 'Can I use this for logs or standing timber?',
        answer:
          'Not by itself. Logs need a local log rule such as Doyle, Scribner, or International 1/4-inch, plus allowances for taper, saw kerf, slabs, shrinkage, and defects.',
      },
      {
        question: 'Should I add waste to a board-foot estimate?',
        answer:
          'Usually, yes. Board feet measure volume, not usable finished parts. Add waste for knots, cracks, milling, mistakes, matching grain, and offcuts.',
      },
    ],
    useCases: [
      'Estimate lumber volume before visiting a lumber yard.',
      'Compare rough boards with different dimensions.',
      'Multiply one board size by quantity.',
      'Understand board-foot pricing better.',
      'Check whether a slab or hardwood board listing is in the right range.',
    ],
    examples: [
      { label: 'Four 1x6 boards', expression: '1 in x 6 in x 8 ft x 4', result: '16 board feet' },
      { label: 'Rough boards', expression: '2 in x 8 in x 10 ft x 3', result: '40 board feet' },
      { label: 'Single slab', expression: '2 in x 18 in x 7 ft', result: '21 board feet' },
    ],
    relatedSlugs: ['deck-cost-calculator', 'plywood-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'cubic-yard-calculator',
    name: 'Cubic Yard Calculator',
    category: 'home-projects',
    summary: 'Convert length, width, depth, and waste into cubic feet and cubic yards.',
    description:
      'Use this free cubic yard calculator to estimate cubic feet and cubic yards from rectangular dimensions, depth, and waste percent.',
    seoTitle: 'Cubic Yard Calculator | Feet, Inches, And Waste',
    seoDescription:
      'Estimate cubic feet, cubic yards, cubic meters, and waste from length, width, and depth in inches for soil, gravel, sand, mulch, or fill.',
    icon: 'calculator-cubic-yard',
    aliases: [
      'Cubic Yardage Calculator',
      'Yardage Calculator',
      'Cubic Feet To Cubic Yards Calculator',
      'Material Yard Calculator',
      'Bulk Material Calculator',
    ],
    formula:
      'The calculator uses cubic feet = length x width x (depth inches / 12), adjusted cubic feet = cubic feet x (1 + waste percent / 100), cubic yards = adjusted cubic feet / 27, and cubic meters = adjusted cubic feet x 0.0283168.',
    limit:
      'This is a simple rectangular-volume estimate, not a supplier order guarantee. Uneven ground, compaction, slopes, forms, settling, moisture, truck minimums, bag yield, and supplier rounding can change what you buy.',
    faqLanguage: {
      expectedInputs: 'length, width, depth in inches, and waste percent',
      examplePhrase: 'cubic yard material example',
      doubleCheck:
        'Also check whether your supplier sells loose cubic yards, compacted cubic yards, tons, bags, or a minimum delivery amount.',
    },
    inputExplanations: [
      { term: 'Length and width', meaning: 'the rectangular area to fill or cover.' },
      { term: 'Depth', meaning: 'the average material depth in inches.' },
      { term: 'Waste percent', meaning: 'extra material for uneven grade, compaction, settling, and ordering cushion.' },
    ],
    extraFaq: [
      {
        question: 'How many cubic feet are in a cubic yard?',
        answer:
          'There are 27 cubic feet in one cubic yard because 1 yard is 3 feet, and 3 x 3 x 3 = 27. That is why the calculator divides adjusted cubic feet by 27.',
      },
      {
        question: 'How do I calculate cubic yards from feet and inches?',
        answer:
          'Multiply length by width by depth in feet to get cubic feet, then divide by 27. If your depth is in inches, divide it by 12 first. For example, 3 inches is 0.25 foot.',
      },
      {
        question: 'How many cubic yards are in a 20 by 10 area at 3 inches deep?',
        answer:
          'A 20 ft by 10 ft area at 3 inches deep is 50 cubic feet before waste. With 5% waste, it becomes 52.5 cubic feet, or about 1.94 cubic yards.',
      },
      {
        question: 'Should I round cubic yards up when ordering material?',
        answer:
          'Usually yes, but do it based on the supplier rules. Some sellers round to the nearest half yard, some have a one-yard minimum, and some sell bags or tons instead of loose cubic yards.',
      },
      {
        question: 'Can cubic yards be converted to tons?',
        answer:
          'Only when you know the material density. A cubic yard of loose mulch, wet sand, gravel, and concrete can weigh very different amounts, so use the supplier tons-per-yard number when weight matters.',
      },
    ],
    useCases: [
      'Estimate cubic yards for fill, soil, mulch, sand, or gravel.',
      'Convert a shallow depth in inches into cubic yards.',
      'Add waste before ordering bulk material.',
      'Check the math behind material calculators.',
      'Compare loose-yard bulk delivery with bagged material.',
    ],
    examples: [
      { label: 'Material bed', expression: '20 ft x 10 ft x 3 in, 5% waste', result: '52.5 ft3 and 1.94 yd3' },
      { label: 'Deep fill', expression: '12 ft x 8 ft x 6 in, 10% waste', result: '52.8 ft3 and 1.96 yd3' },
      { label: 'Small patch', expression: '6 ft x 4 ft x 2 in, no waste', result: '4 ft3 and 0.15 yd3' },
      { label: 'Raised bed', expression: '8 ft x 4 ft x 12 in, no waste', result: '32 ft3 and 1.19 yd3' },
    ],
    relatedSlugs: ['soil-calculator', 'sand-calculator', 'gravel-calculator'],
  }),
  makeUtilityTool({
    slug: 'pool-volume-calculator',
    name: 'Pool Volume Calculator',
    category: 'home-projects',
    summary: 'Estimate pool gallons from shape, length, width, and average depth.',
    seoTitle: 'Pool Volume Calculator | Pool Gallons',
    seoDescription:
      'Estimate pool gallons from rectangular, round, or oval shape, length, width or diameter, and average water depth before checking chemicals or equipment.',
    description:
      'Use this free pool volume calculator to estimate U.S. gallons for rectangular, round, or oval pools from shape, measurements, and average water depth.',
    icon: 'calculator-pool',
    aliases: [
      'Pool Gallon Calculator',
      'Swimming Pool Volume Calculator',
      'Round Pool Volume Calculator',
      'Oval Pool Volume Calculator',
      'Pool Water Volume Calculator',
      'Pool Litres Calculator',
    ],
    formula:
      'Rectangle cubic feet = length x width x average depth. Round or oval cubic feet = length x width x average depth x pi / 4. U.S. gallons = cubic feet x 7.48052.',
    limit:
      'This is a shape-based estimate. Sloped bottoms, steps, benches, freeform shapes, kidney shapes, rounded corners, spas, waterline height, deep hoppers, and measurement error can change real pool volume and chemical dosing.',
    inputExplanations: [
      { term: 'Pool shape', meaning: 'the simple shape used for the volume formula: rectangle, round, or oval.' },
      { term: 'Length or diameter', meaning: 'the long measurement for rectangles and ovals, or the diameter for round pools.' },
      { term: 'Width or diameter', meaning: 'the short measurement for rectangles and ovals, or the same diameter again for a round pool.' },
      { term: 'Average depth', meaning: 'the average water depth, useful when the shallow and deep ends differ. Measure from the waterline, not the top of the wall.' },
    ],
    faqLanguage: {
      expectedInputs: 'pool shape, length or diameter, width or diameter, and average water depth',
      examplePhrase: 'real pool-gallon estimate',
      doubleCheck:
        'Double-check chemical dosing against product labels, water tests, and your pool professional when the pool shape is unusual or the dose matters.',
    },
    extraFaq: [
      {
        question: 'How do I calculate pool gallons?',
        answer:
          'Find cubic feet from the pool shape and average depth, then multiply by 7.48052. For a rectangle, that is length x width x average depth x 7.48052.',
      },
      {
        question: 'How do I find average pool depth?',
        answer:
          'For a steady slope, add shallow depth and deep depth, then divide by 2. For example, 3 feet plus 6 feet is 9, divided by 2, so average depth is 4.5 feet.',
      },
      {
        question: 'Should I use wall height or water depth?',
        answer:
          'Use actual water depth from the waterline to the floor. Wall height can overstate gallons if the water sits below the top rail or coping.',
      },
      {
        question: 'How do I enter a round pool?',
        answer:
          'Choose round, then enter the diameter in both length and width fields. The calculator applies the pi / 4 shape factor for the circular surface.',
      },
      {
        question: 'Why do pool calculators use 7.48 or 7.5?',
        answer:
          'One cubic foot is about 7.48052 U.S. gallons. Many pool charts round that to 7.5 for quick mental math, but this calculator uses 7.48052.',
      },
      {
        question: 'Can I use this for an oval pool?',
        answer:
          'Yes, choose oval and enter the long and short measurements. The calculator uses the same pi / 4 surface factor as an ellipse-style oval estimate.',
      },
      {
        question: 'Can I use this for a kidney or freeform pool?',
        answer:
          'Only as a rough starting point. For irregular pools, break the pool into simpler sections or compare the estimate with fill-meter, builder, or chemical-adjustment clues.',
      },
      {
        question: 'Can I dose pool chemicals from this number?',
        answer:
          'Use it as the starting gallon estimate, then follow chemical labels and water-test results. A wrong gallon number can make chemical doses too weak or too strong.',
      },
    ],
    useCases: [
      'Estimate gallons before adding pool chemicals.',
      'Compare rectangular, round, and oval pool volume.',
      'Use average depth for shallow and deep ends.',
      'Plan fill volume or rough equipment context.',
      'Check whether a pool heater, pump, or filter estimate uses a realistic gallon number.',
    ],
    examples: [
      { label: 'Rectangle pool', expression: '24 ft x 12 ft x 4.5 ft average depth', result: '9,695 gallons' },
      { label: 'Round pool', expression: '18 ft diameter, 4 ft depth', result: '7,614 gallons' },
      { label: 'Oval pool', expression: '30 ft x 15 ft x 4.3 ft average depth', result: '11,368 gallons' },
      { label: 'Lap-style rectangle', expression: '12 ft x 24 ft x 5 ft average depth', result: '10,772 gallons' },
    ],
    relatedSlugs: ['volume-calculator', 'conversion-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'sand-calculator',
    name: 'Sand Calculator',
    category: 'home-projects',
    summary: 'Estimate sand cubic yards and tons from length, width, depth, density, and waste.',
    description:
      'Use this free sand calculator to estimate cubic feet, cubic yards, and tons for paver bedding, leveling sand, sandboxes, and small rectangular sand beds.',
    icon: 'calculator-sand',
    aliases: [
      'Sand Yard Calculator',
      'Sand Tons Calculator',
      'Sand Calculator Bags',
      'Sand Calculator Square Feet',
      'Paver Sand Calculator',
      'Sandbox Sand Calculator',
      'Pool Sand Calculator',
      'Aquarium Sand Calculator',
    ],
    seoTitle: 'Sand Calculator | Cubic Yards, Tons, Depth',
    seoDescription:
      'Estimate sand cubic feet, cubic yards, and tons from length, width, depth, density, and waste for pavers, sandboxes, and leveling layers.',
    formula:
      'Cubic feet = length x width x depth inches / 12. Adjusted cubic feet = cubic feet x (1 + waste percent / 100). Cubic yards = adjusted cubic feet / 27. Estimated tons = cubic yards x tons per cubic yard.',
    limit:
      'Sand density changes with moisture, sand type, compaction, and supplier measurement. This is a rectangular material estimate, not a paver, pool, aquarium, or drainage specification.',
    inputExplanations: [
      { term: 'Length and width', meaning: 'the rectangular project size in feet.' },
      { term: 'Depth', meaning: 'the average sand depth in inches.' },
      { term: 'Tons per cubic yard', meaning: 'the supplier density used to turn volume into weight.' },
      { term: 'Waste percent', meaning: 'extra sand for leveling, spreading loss, compaction, and uneven areas.' },
    ],
    extraFaq: [
      {
        question: 'What does the Sand Calculator estimate?',
        answer:
          'It estimates a rectangular layer of sand in cubic feet, cubic yards, and tons. Enter length, width, depth, density, and waste percent.',
      },
      {
        question: 'Can I use this for paver sand?',
        answer:
          'Yes for the bedding or leveling sand layer if the area is rectangular. Keep base gravel, edge restraints, slope, compaction, and joint sand as separate checks.',
      },
      {
        question: 'Can I use this for a sandbox?',
        answer:
          'Yes. Enter the sandbox length and width in feet, then enter the fill depth in inches. Check play-sand bag weight or volume before buying bags.',
      },
      {
        question: 'Does this calculate sand bags?',
        answer:
          'Not directly. It gives cubic yards and tons. To estimate bags, divide the estimated tons by the bag weight in tons, or compare cubic feet with the bag volume.',
      },
      {
        question: 'Can I use this for pool sand?',
        answer:
          'Only for a rectangular sand base or filter-sand quantity check when the supplier gives the density. Use the Pool Volume Calculator for water gallons.',
      },
      {
        question: 'Can I use this for aquarium sand?',
        answer:
          'Only as a rough bed-volume estimate after converting tank length and width to feet. Aquarium sand is usually bought by bag weight, so check the product label.',
      },
      {
        question: 'Why does wet sand change the tons?',
        answer:
          'Water adds weight and packed sand can settle differently. That is why the tons-per-cubic-yard input matters more than one fixed internet number.',
      },
      {
        question: 'Can this handle a round area?',
        answer:
          'Not by itself. For a circle, calculate the round area first, then use an equivalent square-foot area or split the project into simpler sections.',
      },
    ],
    useCases: [
      'Estimate sand for paver bedding or leveling.',
      'Estimate sand volume for a sandbox or small base layer.',
      'Convert cubic yards into estimated tons.',
      'Compare different depth assumptions.',
      'Check whether a bagged-sand order seems close before reading the bag label.',
      'Separate bedding sand from gravel base, joint sand, pool water, and aquarium product limits.',
    ],
    examples: [
      { label: 'Paver bedding layer', expression: '10 ft x 10 ft x 1 in, 10% waste, 1.35 tons/yd3', result: '0.34 yd3 and 0.46 tons' },
      { label: 'Leveling sand', expression: '20 ft x 10 ft x 2 in, 10% waste, 1.35 tons/yd3', result: '1.36 yd3 and 1.83 tons' },
      { label: 'Sandbox', expression: '8 ft x 6 ft x 8 in, 5% waste, 1.25 tons/yd3', result: '1.24 yd3 and 1.56 tons' },
      { label: 'Path layer', expression: '30 ft x 3 ft x 1 in, 5% waste, 1.35 tons/yd3', result: '0.29 yd3 and 0.39 tons' },
      { label: 'Bag check', expression: '0.46 tons from the paver example', result: 'About 19 bags at 50 lb each' },
    ],
    relatedSlugs: ['paver-base-calculator', 'gravel-calculator', 'polymeric-sand-calculator', 'soil-calculator'],
  }),
  makeUtilityTool({
    slug: 'soil-calculator',
    name: 'Soil Calculator',
    category: 'home-projects',
    summary: 'Estimate topsoil, garden soil, cubic yards, cubic feet, and common bag counts from area and depth.',
    description:
      'Use this free soil calculator to estimate topsoil, garden soil, raised-bed soil, potting soil volume, cubic yards, cubic feet, and common bag counts from square feet, depth in inches, and extra percent.',
    seoTitle: 'Soil Calculator | Cubic Yards And Bags',
    seoDescription:
      'Estimate topsoil, garden soil, raised-bed soil, potting soil, cubic yards, cubic feet, and bag counts from square feet, depth, and extra percent.',
    icon: 'calculator-soil',
    aliases: [
      'Topsoil Calculator',
      'Garden Soil Calculator',
      'Raised Bed Soil Calculator',
      'Potting Soil Calculator',
      'Soil Bag Calculator',
      'Soil Cubic Yard Calculator',
      'Soil Calculator Square Feet',
      'Topsoil Yard Calculator',
      'How Many Bags Of Soil Calculator',
    ],
    formula:
      'Cubic feet = square feet x depth inches / 12 x (1 + extra percent / 100). Cubic yards = cubic feet / 27. Bag counts round up cubic feet divided by 1.5 and 2 cubic feet.',
    limit:
      'Soil settles and bag fill varies. Existing bed depth, compost or potting mix, moisture, raised-bed shape, drainage, plant needs, delivery minimums, and product labels can change the amount to buy.',
    inputExplanations: [
      { term: 'Bed area', meaning: 'the final square footage of the garden bed, raised bed, planter, or lawn patch. Add separate shapes together before entering the number.' },
      { term: 'Soil depth', meaning: 'the added soil depth in inches, not the full bed height if part of the bed is already filled.' },
      { term: 'Extra percent', meaning: 'extra soil for settling, uneven beds, spreading loss, moisture differences, and a small ordering cushion.' },
    ],
    extraFaq: [
      {
        question: 'How do I calculate how much soil I need?',
        answer:
          'Measure the area in square feet, choose the added soil depth in inches, then multiply square feet by depth divided by 12. Add any extra percent for settling, then divide cubic feet by 27 for cubic yards.',
      },
      {
        question: 'How much soil do I need for a raised bed?',
        answer:
          'Enter the raised bed square footage and only the depth you still need to fill. A bed that is already partly filled should use the top-off depth, not the full bed height.',
      },
      {
        question: 'How many bags of soil do I need?',
        answer:
          'Use the cubic feet result, then compare it with the bag label. This calculator rounds up estimates for 1.5-cubic-foot bags and 2-cubic-foot bags.',
      },
      {
        question: 'Should I use cubic yards or bags?',
        answer:
          'Use cubic yards for bulk soil orders and delivery quotes. Use cubic feet and bag counts when you are comparing retail bags at a garden center.',
      },
      {
        question: 'What depth should I enter for topsoil?',
        answer:
          'Enter the depth you want to add. A thin lawn topdress might be under 1 inch, a garden top-off might be 3 to 6 inches, and a new raised bed can be much deeper.',
      },
      {
        question: 'Does this work for potting soil?',
        answer:
          'Yes for rough volume planning if you know the planter area and fill depth. Potting mixes are often sold by bag volume, so check the product label before buying.',
      },
      {
        question: 'Can I use this for triangle or round beds?',
        answer:
          'Yes after you calculate the bed area first. Find the square footage of the triangle, circle, or combined shapes, then enter that total area here.',
      },
      {
        question: 'What extra percent should I use?',
        answer:
          'For many small garden jobs, 5% to 15% is a reasonable planning cushion. Use more if the bed is uneven, loose soil may settle, or spreading loss is likely.',
      },
      {
        question: 'Why can bag counts vary?',
        answer:
          'Retail bags can use different volumes, fill levels, moisture, and product mixes. Treat the bag count as a planning estimate and read the label on the exact product.',
      },
      {
        question: 'Does this include compost or fill layers?',
        answer:
          'No. It estimates total added soil volume. If you plan separate compost, fill, drainage, or soil layers, calculate each layer separately.',
      },
    ],
    useCases: [
      'Estimate soil for raised beds or garden top-offs.',
      'Convert square feet and inches deep into cubic yards.',
      'Estimate 1.5-cubic-foot and 2-cubic-foot bag counts.',
      'Add extra percent for settling or uneven beds.',
      'Compare bulk topsoil delivery with bagged garden soil.',
      'Plan potting soil or planter fill from square footage and depth.',
    ],
    examples: [
      { label: 'Raised bed top-off', expression: '120 ft2 at 4 in, 10% extra', result: '44 ft3, 1.63 yd3, and 22 two-ft3 bags' },
      { label: 'Small garden', expression: '48 ft2 at 6 in, 5% extra', result: '25.2 ft3, 0.93 yd3, and 13 two-ft3 bags' },
      { label: 'Thin topdress', expression: '300 ft2 at 1 in', result: '25 ft3, 0.93 yd3, and 13 two-ft3 bags' },
      { label: 'New raised bed', expression: '32 ft2 at 12 in, 10% extra', result: '35.2 ft3, 1.3 yd3, and 18 two-ft3 bags' },
    ],
    relatedSlugs: ['unit-price-calculator', 'budget-calculator', 'discount-calculator'],
  }),
  makeUtilityTool({
    slug: 'asphalt-calculator',
    name: 'Asphalt Calculator',
    category: 'home-projects',
    summary: 'Estimate asphalt tons from pavement size, compacted depth, density, and waste.',
    description:
      'Estimate hot-mix asphalt cubic yards and tons from length, width, compacted depth, tons per cubic yard, and waste.',
    seoTitle: 'Asphalt Calculator | Tons, Cubic Yards, And Waste',
    seoDescription:
      'Estimate asphalt tons from length, width, compacted depth, density, and waste. Includes a 30 ft by 12 ft driveway example and density limits.',
    icon: 'calculator-asphalt',
    aliases: ['Asphalt Tonnage Calculator', 'Asphalt Driveway Calculator', 'Hot Mix Asphalt Calculator'],
    formula:
      'Cubic feet = length x width x compacted depth in feet. Cubic yards = cubic feet / 27. Tons = cubic yards x tons per cubic yard.',
    limit:
      'Asphalt Institute gives 142 to 148 lb/ft3 as a common in-place asphalt mixture range. Local mix, compaction target, lift thickness, base, plant minimums, and professional measurement can change the order.',
    faqLanguage: {
      expectedInputs: 'the paved length, paved width, compacted depth, tons per cubic yard, and waste percent',
      inputFallback:
        'Length and width define the paved rectangle. Compacted depth is the finished thickness after rolling. Tons per cubic yard is the density assumption. Waste percent adds a small cushion for edges and measurement misses.',
      examplePhrase: 'driveway section example',
      doubleCheck:
        'Check that the depth is compacted depth, the density came from a supplier when possible, and the area matches the part being paved. A real paving quote also needs base condition, drainage, lift thickness, and site access.',
      privacy:
        'No. The asphalt estimate runs in your browser tab. Your dimensions, density, waste percent, and recent answers are not sent to a server.',
    },
    inputExplanations: [
      { term: 'Length and width', meaning: 'the paved rectangle in feet, measured only for the section you want to estimate.' },
      { term: 'Compacted depth', meaning: 'the finished asphalt thickness after compaction, not loose material depth.' },
      { term: 'Tons per cubic yard', meaning: 'the density assumption used to convert volume into asphalt tonnage. About 2 is a common planning shortcut for hot mix.' },
      { term: 'Waste percent', meaning: 'extra material for edges, compaction differences, and small measurement errors.' },
      { term: 'Cubic yards', meaning: 'the volume before it is converted into tons.' },
      { term: 'Estimated tons', meaning: 'the rough material weight to discuss with a supplier or paving contractor.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Asphalt Calculator use compacted depth?',
        answer:
          'Because the finished pavement thickness is what matters. Loose hot mix can change depth after rolling, so loose depth and compacted depth should not be treated as the same number.',
      },
      {
        question: 'Is 2 tons per cubic yard always right for asphalt?',
        answer:
          'No. It is a useful planning shortcut because 148 lb/ft3 is about 2 tons per cubic yard. Ask your asphalt supplier for the density they want you to use.',
      },
      {
        question: 'What does the 5 percent waste setting cover?',
        answer:
          'It adds a small cushion for edges, odd shapes, and measurement misses. It does not replace a contractor measurement or a plant minimum order.',
      },
      {
        question: 'Can I use this number as my paving quote?',
        answer:
          'No. Use it as a rough check before talking to a paving contractor. A quote needs base condition, drainage, lift thickness, mix type, access, labor, and local plant rules.',
      },
      {
        question: 'Should I order exactly the tons shown?',
        answer:
          'Not without checking with the supplier. Some asphalt plants have minimum loads, truck limits, mix rules, or rounding rules that can change the final order.',
      },
      {
        question: 'What does the asphalt estimate leave out?',
        answer:
          'It does not price excavation, base repair, grading, drainage, tack coat, disposal, equipment, labor, permits, or local specs. It only estimates material volume and tons.',
      },
    ],
    useCases: [
      'Estimate asphalt tons for a simple driveway section.',
      'Convert compacted depth into cubic yards.',
      'Compare 2-inch, 3-inch, and 4-inch depth assumptions.',
      'Use supplier density before talking with a paving contractor.',
    ],
    examples: [
      { label: 'Driveway section', expression: '30 ft x 12 ft x 3 in, 2 tons/yd3, 5% waste', result: '7 tons' },
      { label: 'Parking pad', expression: '20 ft x 18 ft x 4 in, 2 tons/yd3, 8% waste', result: '9.6 tons' },
      { label: 'Thin overlay', expression: '40 ft x 10 ft x 2 in, 2 tons/yd3, 5% waste', result: '5.19 tons' },
    ],
    relatedSlugs: ['gravel-calculator', 'cubic-yard-calculator', 'area-calculator'],
  }),
  makeUtilityTool({
    slug: 'wind-chill-calculator',
    name: 'Wind Chill Calculator',
    category: 'everyday-tools',
    summary: 'Calculate wind chill from Fahrenheit temperature and wind speed using the NWS formula.',
    description:
      'Use this free wind chill calculator to estimate what cold weather feels like from air temperature and wind speed.',
    icon: 'calculator-wind-chill',
    formula:
      'The calculator uses the National Weather Service wind chill equation with air temperature in Fahrenheit and wind speed in miles per hour.',
    limit:
      'The formula is intended for cold temperatures with meaningful wind. Follow local alerts for frostbite and outdoor safety decisions.',
    inputExplanations: [
      { term: 'Temperature F', meaning: 'the air temperature in degrees Fahrenheit, intended for 50 F or colder.' },
      { term: 'Wind speed mph', meaning: 'the wind speed in miles per hour, intended for speeds above 3 mph.' },
      { term: 'Wind chill', meaning: 'a feels-like estimate for exposed skin in cold, windy weather.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Wind Chill Calculator reject warm weather?',
        answer:
          'The NWS wind chill equation is designed for cold air and meaningful wind. Warm-weather comfort uses other ideas, like heat index and dew point.',
      },
    ],
    useCases: [
      'Estimate wind chill before going outside.',
      'Compare actual air temperature with feels-like temperature.',
      'Convert the result to Celsius.',
      'Understand wind chill limits and safety notes.',
    ],
    examples: [
      { label: 'Cold windy day', expression: '30 F and 15 mph', result: 'Feels colder than 30 F' },
      { label: 'Freezing wind', expression: '20 F and 25 mph', result: 'Wind chill estimate' },
      { label: 'Very cold wind', expression: '5 F and 20 mph', result: 'Severe feels-like estimate' },
    ],
    relatedSlugs: ['heat-index-calculator', 'dew-point-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'heat-index-calculator',
    name: 'Heat Index Calculator',
    category: 'everyday-tools',
    summary: 'Calculate heat index from Fahrenheit temperature and relative humidity.',
    description:
      'Enter air temperature and relative humidity to estimate heat index, then check the Fahrenheit and Celsius apparent-temperature result.',
    seoTitle: 'Heat Index Calculator | Temperature And Humidity',
    seoDescription:
      'Calculate heat index from Fahrenheit temperature and relative humidity with the NWS method. See apparent temperature, chart-style examples, and safety limits.',
    icon: 'calculator-heat-index',
    aliases: ['heat index chart', 'apparent temperature calculator', 'humidity heat calculator', 'NWS heat index calculator'],
    formula:
      'The calculator uses the National Weather Service heat index method: a simple branch first, then the Rothfusz regression and standard humidity adjustments when the preliminary value reaches about 80 F.',
    limit:
      'Heat risk depends on sun, exertion, wind, hydration, clothing, health, and local warnings. Treat this as a weather-math estimate, not a safety clearance.',
    inputExplanations: [
      { term: 'Temperature F', meaning: 'the air temperature in degrees Fahrenheit.' },
      { term: 'Relative humidity %', meaning: 'how much water vapor is in the air compared with the most it could hold at that temperature.' },
      { term: 'Heat index', meaning: 'an apparent-temperature estimate for hot, humid conditions.' },
    ],
    extraFaq: [
      {
        question: 'Why can direct sun make heat feel worse?',
        answer:
          'Heat index is usually based on air temperature and humidity in shade-like conditions. Direct sun, hard activity, heavy clothing, and low wind can raise real heat stress.',
      },
      {
        question: 'Is heat index the same as the real air temperature?',
        answer:
          'No. Air temperature is the thermometer reading. Heat index is a feels-like estimate for people in hot, humid weather.',
      },
      {
        question: 'Why does humidity raise the heat index?',
        answer:
          'High humidity makes sweat evaporate more slowly. That can make the same air temperature feel hotter to your body.',
      },
      {
        question: 'Can I use Celsius with this calculator?',
        answer:
          'Enter Fahrenheit on this page. The result also shows Celsius, so you can read the apparent temperature in both units after calculating.',
      },
      {
        question: 'Does wind speed belong in heat index?',
        answer:
          'Not in this calculator. Heat index uses temperature and humidity. Wind, sun, work level, clothing, and local alerts can still change real heat risk.',
      },
      {
        question: 'When should I ignore the calculator and use official help?',
        answer:
          'Use local heat advisories first. If someone is confused, fainting, very hot, or showing heat-stroke warning signs, treat it as urgent and follow emergency guidance.',
      },
    ],
    useCases: [
      'Estimate how hot humid weather feels.',
      'Compare air temperature with heat index.',
      'Convert apparent temperature to Celsius.',
      'Understand why humidity changes heat stress.',
    ],
    examples: [
      { label: 'Humid heat', expression: '90 F and 70% RH', result: 'About 105.9 F heat index' },
      { label: 'Dryer heat', expression: '95 F and 35% RH', result: 'About 96.5 F heat index' },
      { label: 'Danger check', expression: '100 F and 55% RH', result: 'About 123.6 F heat index' },
    ],
    relatedSlugs: ['wind-chill-calculator', 'dew-point-calculator', 'btu-calculator'],
  }),
  makeUtilityTool({
    slug: 'dew-point-calculator',
    name: 'Dew Point Calculator',
    category: 'everyday-tools',
    summary: 'Estimate dew point from Fahrenheit temperature and relative humidity.',
    description:
      'Use this free dew point calculator to estimate dew point in Fahrenheit and Celsius from temperature and relative humidity.',
    icon: 'calculator-dew-point',
    formula:
      'The calculator converts Fahrenheit to Celsius, uses the Magnus approximation with relative humidity, then converts the dew point back to Fahrenheit.',
    limit:
      'This is an approximation from temperature and relative humidity. Instrument readings and official forecasts can differ.',
    inputExplanations: [
      { term: 'Temperature F', meaning: 'the current air temperature in degrees Fahrenheit.' },
      { term: 'Relative humidity %', meaning: 'how close the air is to saturation at that temperature.' },
      { term: 'Dew point', meaning: 'the temperature where the air would be saturated and water vapor could start condensing.' },
    ],
    extraFaq: [
      {
        question: 'Why can dew point feel clearer than relative humidity?',
        answer:
          'Relative humidity changes when temperature changes. Dew point gives a more direct clue about how much moisture is actually in the air, so a higher dew point usually feels more humid.',
      },
    ],
    useCases: [
      'Estimate dew point from weather readings.',
      'Compare humidity comfort more clearly than relative humidity alone.',
      'Convert dew point between Fahrenheit and Celsius.',
      'Use with heat index for weather context.',
    ],
    examples: [
      { label: 'Humid day', expression: '75 F and 60% RH', result: 'Dew point estimate' },
      { label: 'Dry indoor air', expression: '70 F and 30% RH', result: 'Lower dew point' },
      { label: 'Muggy evening', expression: '82 F and 75% RH', result: 'Higher dew point estimate' },
    ],
    relatedSlugs: ['heat-index-calculator', 'wind-chill-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'bandwidth-calculator',
    name: 'Bandwidth Calculator',
    category: 'developer-tools',
    summary: 'Estimate file transfer time from data size and network bandwidth.',
    description:
      'Use this free bandwidth calculator to estimate how long a file transfer takes from KB, MB, GB, or TB and Kbps, Mbps, or Gbps.',
    seoTitle: 'Bandwidth Calculator | File Transfer Time',
    seoDescription:
      'Estimate download or upload time from file size and bandwidth. Convert KB, MB, GB, or TB with Kbps, Mbps, or Gbps and read real-world limits.',
    icon: 'calculator-bandwidth',
    aliases: ['File Transfer Time Calculator', 'Data Transfer Calculator', 'Internet Bandwidth Calculator'],
    formula:
      'The calculator treats KB, MB, GB, and TB as decimal data-size units, converts bytes to bits by multiplying by 8, converts Kbps, Mbps, or Gbps to bits per second, then divides total bits by bits per second for transfer time.',
    limit:
      'Real transfer time depends on Wi-Fi, server speed, upload caps, congestion, packet overhead, throttling, retries, and whether another app is sharing the connection.',
    inputExplanations: [
      { term: 'Data size', meaning: 'the file, backup, media, or transfer size you want to estimate.' },
      { term: 'Data unit', meaning: 'the size unit for that amount. The calculator uses decimal KB, MB, GB, and TB.' },
      { term: 'Bandwidth', meaning: 'the usable connection speed for the transfer, not always the advertised plan speed.' },
      { term: 'Speed unit', meaning: 'Kbps, Mbps, or Gbps. Network speed is usually written in bits per second, not bytes per second.' },
    ],
    useCases: [
      'Estimate download or upload time.',
      'Compare file sizes against connection speed.',
      'Convert seconds into minutes and hours.',
      'Plan rough transfer windows for large files.',
    ],
    examples: [
      { label: 'Large download', expression: '5 GB at 100 Mbps', result: 'About 6m 40s' },
      { label: 'Medium file', expression: '700 MB at 25 Mbps', result: 'About 3m 44s' },
      { label: 'Backup upload', expression: '50 GB at 20 Mbps', result: 'About 5h 33m 20s' },
    ],
    extraFaq: [
      {
        question: 'Why does 5 GB at 100 Mbps take about 6 minutes 40 seconds?',
        answer:
          'The calculator converts 5 GB to 40,000,000,000 bits, then divides by 100,000,000 bits per second. That gives 400 seconds, which is about 6 minutes and 40 seconds before real-world slowdowns.',
      },
      {
        question: 'Are Mbps and MB/s the same thing?',
        answer:
          'No. Mbps means megabits per second. MB/s means megabytes per second. One byte is 8 bits, so 100 Mbps is about 12.5 MB/s before overhead.',
      },
      {
        question: 'Can I use this for upload time too?',
        answer:
          'Yes, if you enter your real upload speed. Many home plans have much lower upload bandwidth than download bandwidth, so a cloud backup can take far longer than a normal download.',
      },
      {
        question: 'Why might my real transfer take longer?',
        answer:
          'Transfers can slow down because of Wi-Fi signal, server limits, router load, VPNs, packet overhead, congestion, throttling, retries, or other devices using the same connection.',
      },
      {
        question: 'Does this use decimal or binary file units?',
        answer:
          'This calculator uses decimal units, where 1 GB is 1,000 MB. Some operating systems and storage tools use binary-style units behind the scenes, so exact file-manager numbers can differ slightly.',
      },
    ],
    relatedSlugs: ['download-time-calculator', 'internet-speed-needs-calculator', 'streaming-bitrate-calculator'],
  }),
  makeUtilityTool({
    slug: 'gdp-calculator',
    name: 'GDP Calculator',
    category: 'finance',
    summary: 'Estimate gross domestic product from consumption, investment, government spending, exports, and imports.',
    description:
      'Use this free GDP calculator to learn the expenditure approach: consumption plus investment plus government spending plus net exports.',
    seoTitle: 'GDP Calculator | Expenditure Approach And Per Person',
    seoDescription:
      'Estimate GDP with C + I + G + exports minus imports, then check GDP per person with clear scale warnings and official-data limits.',
    icon: 'calculator-gdp',
    aliases: ['Gross Domestic Product Calculator', 'GDP Per Capita Calculator', 'Expenditure Approach Calculator'],
    formula:
      'The calculator uses the expenditure approach: GDP = C + I + G + (exports - imports). If population is entered in the same scale, it divides GDP by population for GDP per person.',
    limit:
      'Use consistent money units. This is a learning estimate, not an official national account, forecast, or economic policy model.',
    faqLanguage: {
      expectedInputs:
        'consumption, investment, government spending, exports, imports, and optional population with matching money and population scales',
      inputFallback:
        'Enter consumption, investment, government spending, exports, and imports in the same money scale. Add population only if you want GDP per person, and keep that population in the same scale too.',
      doubleCheck:
        'Also check that exports and imports are separate, imports are subtracted, money values use the same scale, and population matches that scale.',
    },
    inputExplanations: [
      { term: 'Consumption', meaning: 'household spending on final goods and services in the scale you picked.' },
      { term: 'Investment', meaning: 'private investment spending, not your personal stock portfolio return.' },
      { term: 'Government spending', meaning: 'government purchases in the same money scale as the other GDP fields.' },
      { term: 'Exports and imports', meaning: 'exports are added, imports are subtracted to get net exports.' },
      { term: 'Population', meaning: 'optional. Use 0.34 if your money fields are in billions and population is 340 million.' },
    ],
    extraFaq: [
      {
        question: 'How should I read the GDP Calculator answer?',
        answer:
          'Start with estimated GDP, then check net exports and GDP per person. Net exports show whether imports pulled the total down, and GDP per person only makes sense when the population scale matches the money scale.',
      },
      {
        question: 'Is this official GDP data?',
        answer:
          'No. This calculator does not fetch BEA releases, country tables, revision dates, annualized rates, real GDP, chained-dollar series, or currency conversions. It only helps you understand the formula with numbers you enter.',
      },
      {
        question: 'Why are imports subtracted from GDP?',
        answer:
          'Imports can already sit inside consumption, investment, or government spending. Subtracting imports helps keep the final GDP number focused on domestic production instead of counting foreign-made goods as local output.',
      },
      {
        question: 'What does GDP per person mean here?',
        answer:
          'GDP per person is total GDP divided by the population scale you entered. It is not the same as wages, household income, or how well people are doing day to day.',
      },
      {
        question: 'Should I enter dollars, millions, or billions?',
        answer:
          'Any scale can work if every field uses the same scale. If consumption is entered in billions, investment, government spending, exports, imports, and population should use billions too.',
      },
      {
        question: 'What does this GDP calculator leave out?',
        answer:
          'It does not measure the income approach, production approach, inflation adjustment, underground activity, environmental costs, inequality, or later official revisions. Use it for learning and quick examples, not policy decisions.',
      },
    ],
    useCases: [
      'Practice GDP homework examples with the expenditure formula.',
      'See how imports reduce net exports in the GDP identity.',
      'Estimate GDP per person when population is known.',
      'Compare how each spending category changes the headline GDP number.',
    ],
    examples: [
      { label: 'Economy example', expression: '18,000 + 5,000 + 6,500 + (3,200 - 4,100), population 0.34', result: '28,600 and about 84,118 per person' },
      { label: 'Classroom example', expression: '700 + 150 + 220 + (90 - 120)', result: '1,040' },
      { label: 'Net exports surplus', expression: '900 + 180 + 250 + (140 - 100)', result: '1,370' },
    ],
    relatedSlugs: ['inflation-calculator', 'finance-calculator', 'percentage-calculator'],
  }),
  makeUtilityTool({
    slug: 'horsepower-calculator',
    name: 'Horsepower Calculator',
    category: 'converters',
    summary: 'Convert mechanical horsepower, metric horsepower, watts, and kilowatts.',
    description:
      'Use this free horsepower calculator to convert between mechanical horsepower, metric horsepower, watts, and kilowatts.',
    icon: 'calculator-horsepower',
    formula:
      'The calculator converts the starting unit to watts, then divides by 745.6999 for mechanical horsepower or 735.4988 for metric horsepower.',
    limit:
      'Horsepower units are not all the same. Confirm whether your label means mechanical, metric, electric, boiler, or another horsepower standard.',
    useCases: [
      'Convert horsepower to watts or kilowatts.',
      'Convert kilowatts into mechanical horsepower.',
      'Compare mechanical horsepower with metric horsepower.',
      'Check power-unit labels on motors, tools, and engines.',
    ],
    examples: [
      { label: '150 mechanical hp', expression: '150 hp', result: '111,854.985 W' },
      { label: '100 kW', expression: '100 kW', result: '134.1022 hp' },
      { label: 'Metric hp', expression: '100 metric hp', result: '73,549.88 W' },
    ],
    relatedSlugs: ['engine-horsepower-calculator', 'conversion-calculator', 'ohms-law-calculator'],
  }),
  makeUtilityTool({
    slug: 'engine-horsepower-calculator',
    name: 'Engine Horsepower Calculator',
    category: 'everyday-tools',
    summary: 'Estimate engine horsepower from torque and RPM with optional drivetrain loss.',
    description:
      'Use this free engine horsepower calculator to estimate horsepower from pound-feet of torque and RPM, plus optional wheel horsepower after drivetrain loss.',
    icon: 'calculator-engine-horsepower',
    formula:
      'The calculator uses horsepower = torque in lb-ft x RPM / 5252.1131, then applies optional drivetrain loss to estimate wheel horsepower.',
    limit:
      'This is formula math, not a certified dyno result. Real engine ratings depend on test standard, correction factor, drivetrain loss, and conditions.',
    useCases: [
      'Estimate horsepower from a torque and RPM point.',
      'Compare engine horsepower with wheel horsepower after estimated loss.',
      'Convert horsepower into kilowatts.',
      'Understand why torque and RPM both matter for power.',
    ],
    examples: [
      { label: '300 lb-ft at 5,252 rpm', expression: '300 x 5,252 / 5,252.1131', result: 'About 300 hp' },
      { label: '250 lb-ft at 4,000 rpm', expression: '250 x 4,000 / 5,252.1131', result: 'About 190.4 hp' },
      { label: 'Wheel estimate', expression: '400 lb-ft at 5,000 rpm with 15% loss', result: 'Engine and wheel hp' },
    ],
    relatedSlugs: ['horsepower-calculator', 'speed-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'golf-handicap-calculator',
    name: 'Golf Handicap Calculator',
    category: 'everyday-tools',
    summary: 'Estimate score differential, course handicap, and playing handicap from the numbers on your scorecard.',
    description:
      'Estimate a golf score differential or course handicap from adjusted score, rating, slope, par, index, PCC, and allowance.',
    seoTitle: 'Golf Handicap Calculator | Score Differential And Course Handicap',
    seoDescription:
      'Estimate score differential, course handicap, and playing handicap from WHS-style inputs. Includes rating, slope, par, PCC, allowance, and clear limits.',
    icon: 'calculator-golf-handicap',
    aliases: ['Course Handicap Calculator', 'Score Differential Calculator', 'Playing Handicap Calculator'],
    formula:
      'Score differential uses (113 / slope rating) x (adjusted gross score - course rating - PCC). Course handicap uses Handicap Index x (slope / 113) + (course rating - par).',
    limit:
      'This estimates one round or one tee setup. It does not create an official Handicap Index. Official records can include score-history rules, caps, exceptional-score reductions, 9-hole handling, and committee adjustments.',
    faqLanguage: {
      expectedInputs:
        'the adjusted gross score, course rating, slope rating, PCC, Handicap Index, par, and allowance from the exact tees or format you are checking',
      inputFallback:
        'Adjusted gross score is the score after handicap max-hole rules. Course rating and slope rating come from the tees played. PCC is the playing conditions adjustment when your scoring record gives one. Handicap Index is your official index, not your average score. Allowance is the format percentage, such as 95% or 85%.',
      examplePhrase: 'golf scorecard example',
      doubleCheck:
        'Also check the exact tees, rating, slope, par, PCC, and allowance. A small tee or rating change can move the answer by a stroke.',
      privacy:
        'No. The calculation runs in your browser tab. Your score, rating, slope, par, index, and allowance are not sent to a server.',
    },
    inputExplanations: [
      {
        term: 'Adjusted gross score',
        meaning:
          'the round score after any maximum-hole-score adjustments required by the handicap rules. If you only know raw strokes, confirm the adjusted score first.',
      },
      {
        term: 'Course rating',
        meaning:
          'the expected score for a scratch player from the exact tees. Use the rating printed for your tee set, not a different box.',
      },
      {
        term: 'Slope rating',
        meaning:
          'the course difficulty number for non-scratch players. WHS-style formulas use 113 as the standard slope.',
      },
      {
        term: 'PCC',
        meaning:
          'the playing conditions calculation. Leave it at 0 unless your official scoring record or event gives a value.',
      },
      {
        term: 'Handicap Index',
        meaning:
          'your official index before it is adjusted for the course and tees you are playing.',
      },
      {
        term: 'Allowance',
        meaning:
          'the event or format percentage used to turn course handicap into playing handicap.',
      },
    ],
    extraFaq: [
      {
        question: 'Does this calculate my official Handicap Index?',
        answer:
          'No. It estimates score differential, course handicap, and playing handicap. An official Handicap Index needs your scoring record and the rules used by your golf association.',
      },
      {
        question: 'Why do course rating and slope matter?',
        answer:
          'They adjust for the course and tees. An 86 from harder tees can be a better round than an 86 from easier tees, so the calculator needs those numbers.',
      },
      {
        question: 'What should I enter for PCC?',
        answer:
          'Use 0 for a normal estimate. Enter -1, 1, 2, or 3 only when the official scoring record or event gives a playing conditions adjustment.',
      },
      {
        question: 'Why is playing handicap different from course handicap?',
        answer:
          'Course handicap is the tee-adjusted number. Playing handicap applies the allowance for the game format, such as 95% for some singles formats or 85% for some partner formats.',
      },
      {
        question: 'Can I use this for a tournament?',
        answer:
          'Use it as a check only. For an official event, use the tournament committee, GHIN or local association app, and the exact rules for that format.',
      },
    ],
    useCases: [
      'Estimate a round score differential from adjusted score, course rating, slope rating, and PCC.',
      'Estimate course handicap from Handicap Index, slope rating, course rating, and par.',
      'Apply a playing handicap allowance for casual matches or format checks.',
      'See why changing tees can change the handicap strokes you receive.',
    ],
    examples: [
      { label: 'Score differential', expression: '(113 / 128) x (86 - 71.2 - 0)', result: '13.1' },
      { label: 'Hard-weather PCC', expression: '(113 / 136) x (92 - 73.4 - 1)', result: '14.6' },
      { label: 'Course handicap', expression: '14.2 x (128 / 113) + (71.2 - 72)', result: '15' },
    ],
    relatedSlugs: ['percentage-calculator', 'average-calculator', 'rounding-calculator'],
  }),
  makeUtilityTool({
    slug: 'love-calculator',
    name: 'Love Calculator',
    category: 'everyday-tools',
    summary: 'Type two names and get a silly match score for fun.',
    description:
      'Use this free love calculator as a silly name-match game. It gives a repeatable score for laughs, not life decisions.',
    seoTitle: 'Love Calculator | Silly Name Match Game',
    seoDescription:
      'Type two names or nicknames and get a repeatable love score for fun. No signup, clear privacy note, and no fake relationship science.',
    icon: 'calculator-love',
    aliases: ['Love Test', 'Love Compatibility Calculator', 'Crush Calculator', 'Name Match Calculator'],
    formula:
      'The calculator trims the two names, lowercases the letters, creates a deterministic local hash, and turns that into a playful percentage score from 40 to 100.',
    limit:
      'This is only a game. It cannot measure attraction, trust, effort, communication, values, consent, timing, or real relationship health.',
    faqLanguage: {
      expectedInputs: 'two names, nicknames, or initials only',
      inputFallback:
        'Enter two names, nicknames, or initials. The spelling matters because the browser turns those exact letters into the repeatable game score.',
      examplePhrase: 'name-match example',
      doubleCheck:
        'Use the score for fun only, and never use it to pressure, shame, judge, or make decisions about another person.',
      privacy:
        'No. The game runs in your browser tab. Use nicknames or initials if you want, and do not enter ages, locations, photos, socials, or other private details.',
    },
    inputExplanations: [
      {
        term: 'First name',
        meaning: 'Use a first name, nickname, initials, or a made-up name. The tool does not need a full legal name.',
      },
      {
        term: 'Second name',
        meaning: 'Use the other name or nickname. Different spellings can make a different game score.',
      },
      {
        term: 'Playful score',
        meaning: 'A repeatable name-game percentage. It is not a real compatibility test.',
      },
    ],
    extraFaq: [
      {
        question: 'How should I read the Love Calculator answer?',
        answer:
          'Read it as a joke score only. The percentage, label, and cleaned name keys explain the name-game result, not real attraction, effort, or compatibility.',
      },
      {
        question: 'Is the Love Calculator accurate?',
        answer:
          'No. It is a silly name game. Real relationships depend on things like respect, honesty, communication, boundaries, timing, and how people treat each other.',
      },
      {
        question: 'Should I trust a low love score?',
        answer:
          'No. A low score only means the name-game rule made a lower number. It says nothing real about a crush, friendship, partner, or future relationship.',
      },
      {
        question: 'Can I use nicknames or initials?',
        answer:
          'Yes. Nicknames, initials, and fictional names are better if you do not want to type real names. Just remember that changing the spelling can change the score.',
      },
    ],
    useCases: [
      'Play a harmless name-match game with friends or a group chat.',
      'Check the same pair again and get the same score from the same spelling.',
      'Use a novelty calculator without pretending it is real compatibility science.',
      'Use nicknames or initials instead of typing private details.',
    ],
    examples: [
      { label: 'Alex + Sam', expression: 'Alex and Sam', result: '86% Sparkly match' },
      { label: 'Taylor + Jordan', expression: 'Taylor and Jordan', result: '79% Sweet match' },
      { label: 'Case check', expression: 'alex and SAM', result: 'Same 86% score after cleanup' },
    ],
    relatedSlugs: ['random-number-generator', 'dice-roller', 'percentage-calculator'],
  }),
  makeUtilityTool({
    slug: 'word-counter',
    name: 'Word Counter',
    category: 'text-tools',
    summary: 'Count words, characters, sentences, paragraphs, lines, and estimated reading time.',
    description:
      'Use this free word counter to count words, characters, sentences, paragraphs, lines, UTF-8 bytes, and estimated reading time in your browser.',
    icon: 'tool-word-counter',
    aliases: ['Online Word Counter', 'Text Word Count Tool'],
    formula:
      'The tool splits plain text into word-like groups, counts the surrounding text structure, and estimates reading time at about 200 words per minute.',
    limit:
      'Different editors and social platforms can count emojis, punctuation, links, line breaks, or hyphenated words differently.',
    useCases: [
      'Check blog drafts, essays, product copy, and article sections before publishing.',
      'Estimate reading time from a rough word count.',
      'Count sentences, paragraphs, and lines while editing text.',
      'Compare word count and character count in one local browser tool.',
    ],
    examples: [
      { label: 'Short sentence', expression: 'Access Free Tools helps people finish quick browser tasks.', result: 'Word count and reading time' },
      { label: 'Meta copy', expression: 'A 150-character summary draft', result: 'Words, characters, and bytes' },
      { label: 'Paragraph draft', expression: 'Two paragraphs separated by a blank line', result: 'Paragraph and line counts' },
    ],
    relatedSlugs: ['character-counter', 'text-case-converter', 'slug-generator'],
  }),
  makeUtilityTool({
    slug: 'character-counter',
    name: 'Character Counter',
    category: 'text-tools',
    summary: 'Count characters, words, lines, no-space text, and UTF-8 bytes.',
    description:
      'Count characters, words, lines, no-space text, and UTF-8 bytes in your browser for titles, snippets, captions, messages, and field limits.',
    icon: 'tool-character-counter',
    aliases: ['Letter Counter', 'Online Character Counter', 'Character Count Online', 'Free Character Counter'],
    formula:
      'The tool counts Unicode code points, removes whitespace for a no-spaces count, splits line breaks, counts word-like groups, and encodes the text as UTF-8 to estimate byte length.',
    limit:
      'Hard limits can vary by app because some platforms count emoji sequences, links, rich text, spaces, or line breaks in their own way.',
    inputExplanations: [
      {
        term: 'Text to count',
        meaning: 'Paste the exact title, snippet, caption, message, or technical string you plan to use, including spaces and line breaks.',
      },
      {
        term: 'Characters',
        meaning: 'The main count uses Unicode code points, so combined emoji can still differ from a platform count.',
      },
      {
        term: 'UTF-8 bytes',
        meaning: 'This shows how many bytes the same text uses when encoded as UTF-8, which matters for some technical fields.',
      },
    ],
    extraFaq: [
      {
        question: 'Do emoji always count as one character?',
        answer:
          'No. Some emoji are built from more than one Unicode code point, and platforms can count those sequences differently. Use this counter for a fast draft check, then paste into the target app when the limit is strict.',
      },
      {
        question: 'Why can UTF-8 bytes be higher than the character count?',
        answer:
          'Plain English letters usually use one UTF-8 byte each, but many symbols, accents, and emoji use more. Check the byte count when a form, API, database, or message system sets a byte limit instead of a visible character limit.',
      },
    ],
    useCases: [
      'Check page titles, snippets, captions, messages, and form text against limits.',
      'Compare character count with and without spaces.',
      'Estimate UTF-8 byte length for technical inputs.',
      'Review line and word counts while editing short text.',
    ],
    examples: [
      { label: 'Page title', expression: 'Free Character Counter for Titles and Messages', result: '46 characters, 40 without spaces' },
      { label: 'Short message', expression: 'Meeting moved to 2:30 PM. Bring notes.', result: '38 characters and 8 words' },
      { label: 'Emoji line check', expression: 'Line one\nLine two with emoji 🙂', result: '30 characters, 33 UTF-8 bytes, 2 lines' },
    ],
    relatedSlugs: ['word-counter', 'text-case-converter', 'slug-generator'],
  }),
  makeUtilityTool({
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    category: 'text-tools',
    summary: 'Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case.',
    description:
      'Use this free text case converter to rewrite plain text into common writing, coding, and URL case styles without sending text to a server.',
    icon: 'tool-text-case',
    aliases: ['Case Converter', 'Title Case Converter', 'Uppercase Lowercase Converter'],
    formula:
      'The tool reads plain text, tokenizes words for identifier-style modes, and applies the selected case transformation to produce copy-ready output.',
    limit:
      'Title case rules vary by style guide, and identifier modes remove punctuation that may matter in the original wording.',
    useCases: [
      'Convert headings between uppercase, lowercase, title case, and sentence case.',
      'Create camelCase, PascalCase, snake_case, or kebab-case labels.',
      'Clean inconsistent capitalization in drafts.',
      'Prepare quick variable names, file names, or URL text.',
    ],
    examples: [
      { label: 'Title case', expression: 'access free tools utility website', result: 'Access Free Tools Utility Website' },
      { label: 'kebab-case', expression: 'Kawaii Calculator Blog Guide', result: 'kawaii-calculator-blog-guide' },
      { label: 'camelCase', expression: 'basic calculator result', result: 'basicCalculatorResult' },
    ],
    relatedSlugs: ['slug-generator', 'word-counter', 'character-counter'],
  }),
  makeUtilityTool({
    slug: 'slug-generator',
    name: 'Slug Generator',
    category: 'text-tools',
    summary: 'Turn titles and phrases into clean lowercase URL slugs with optional length control.',
    description:
      'Use this free slug generator to convert titles, tool names, and blog ideas into lowercase hyphenated URL slugs with optional maximum length.',
    icon: 'tool-slug',
    aliases: ['URL Slug Generator', 'SEO Slug Generator'],
    formula:
      'The generator normalizes text, keeps letters and numbers, changes spaces and punctuation to hyphens, trims repeated hyphens, and applies an optional length limit.',
    limit:
      'A clean slug helps readability, but one canonical helpful page matters more than several thin pages with nearly identical slugs.',
    useCases: [
      'Create draft URL paths for tool pages and blog guides.',
      'Shorten long titles into readable slugs.',
      'Turn headings into lowercase hyphenated text.',
      'Keep search-intent variations on one canonical page instead of creating duplicates.',
    ],
    examples: [
      { label: 'Blog title', expression: 'How to Use the Kawaii Calculator', result: 'how-to-use-the-kawaii-calculator' },
      { label: 'Tool name', expression: 'Color Contrast Checker', result: 'color-contrast-checker' },
      { label: 'Long phrase', expression: 'Simple SEO-Friendly Guide for Free Online Utility Tools', result: 'Short hyphenated slug' },
    ],
    relatedSlugs: ['text-case-converter', 'word-counter', 'json-formatter'],
  }),
  makeUtilityTool({
    slug: 'json-formatter',
    name: 'JSON Formatter',
    category: 'developer-tools',
    summary: 'Format and validate JSON with two-space indentation and optional sorted object keys.',
    description:
      'Use this free JSON formatter to parse JSON, format it with readable indentation, optionally sort object keys, and copy the formatted output.',
    icon: 'tool-json',
    aliases: ['JSON Beautifier', 'JSON Validator', 'JSON Pretty Print'],
    formula:
      'The tool parses JSON text in the browser, optionally sorts object keys recursively, then serializes the result with two-space indentation.',
    limit:
      'This checks JSON syntax, not whether the data matches an API schema, security rule, or business requirement.',
    useCases: [
      'Pretty-print minified JSON before reading or sharing it.',
      'Check whether copied JSON has valid quotes, commas, braces, and brackets.',
      'Sort keys when comparing small JSON objects.',
      'Copy formatted output for notes, debugging, or documentation.',
    ],
    examples: [
      { label: 'Tool object', expression: '{"tool":"calculator","live":true}', result: 'Formatted JSON' },
      { label: 'Array data', expression: '[{"name":"Basic"},{"name":"Scientific"}]', result: 'Indented array' },
      { label: 'Sorted keys', expression: '{"z":3,"a":1}', result: 'Keys sorted alphabetically' },
    ],
    relatedSlugs: ['base64-encode-decode', 'url-encode-decode', 'hash-generator'],
  }),
  makeUtilityTool({
    slug: 'uuid-generator',
    name: 'UUID Generator',
    category: 'developer-tools',
    summary: 'Generate UUID v4 identifiers with quantity, uppercase, and hyphen options.',
    description:
      'Use this free UUID generator to create browser-generated UUID v4 values for identifiers, test data, database records, and development workflows.',
    icon: 'tool-uuid',
    aliases: ['GUID Generator', 'UUID v4 Generator'],
    formula:
      'The generator creates random bytes in the browser, sets the UUID version and variant bits for UUID v4, then formats the identifier.',
    limit:
      'UUIDs are useful identifiers, but they do not prove identity, authorization, ordering, or secrecy by themselves.',
    useCases: [
      'Generate IDs for mock data, test records, fixtures, or local prototypes.',
      'Create one UUID or a small batch at once.',
      'Choose uppercase or compact no-hyphen formatting when another system needs it.',
      'Avoid sending identifier-generation requests to a server.',
    ],
    examples: [
      { label: 'Five IDs', expression: '5 lowercase UUID v4 values', result: 'Five random UUIDs' },
      { label: 'Uppercase ID', expression: '1 uppercase UUID', result: 'Uppercase formatted UUID' },
      { label: 'Compact IDs', expression: '3 UUIDs without hyphens', result: '32-character identifiers' },
    ],
    relatedSlugs: ['password-generator', 'hash-generator', 'random-number-generator'],
  }),
  makeUtilityTool({
    slug: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer-tools',
    summary: 'Generate SHA-256, SHA-384, or SHA-512 text digests in hexadecimal format.',
    description:
      'Use this free hash generator to create SHA-256, SHA-384, or SHA-512 hex digests from text with the browser SubtleCrypto API.',
    icon: 'tool-hash',
    aliases: ['SHA-256 Generator', 'SHA Hash Generator', 'Text Hash Generator'],
    seoTitle: 'Hash Generator | SHA-256, SHA-384, SHA-512',
    seoDescription:
      'Generate SHA-256, SHA-384, or SHA-512 text hashes in the browser, see input and digest byte counts, and avoid raw-hash password or authenticity mistakes.',
    formula:
      'The tool uses TextEncoder to turn text into UTF-8 bytes, calls browser crypto.subtle.digest() with SHA-256, SHA-384, or SHA-512, then writes each digest byte as two lowercase hexadecimal characters. SHA-256 returns 32 digest bytes, SHA-384 returns 48, and SHA-512 returns 64.',
    limit:
      'A hash is not encryption, a login design, or proof of who created text. Do not use raw hashes for password storage, signatures, API secrets, or authenticity checks; those need salts, key-derivation functions, HMACs, signatures, and security-specific code.',
    inputExplanations: [
      {
        term: 'Algorithm',
        meaning: 'Choose SHA-256 for the common 32-byte digest, SHA-384 for a 48-byte digest, or SHA-512 for a 64-byte digest.',
      },
      {
        term: 'Text to hash',
        meaning: 'Paste the exact text you want to digest. Case, spaces, punctuation, emoji, and line breaks all change the output.',
      },
      {
        term: 'Input bytes',
        meaning: 'This is the UTF-8 byte length of your text before hashing. It can be different from the character count when the text includes emoji or non-English characters.',
      },
      {
        term: 'Hex digest',
        meaning: 'The result is lowercase hexadecimal text. Two hex characters represent one digest byte.',
      },
    ],
    useCases: [
      'Create a quick SHA-256 digest for a text sample.',
      'Compare whether two pasted text values produce the same digest.',
      'Generate SHA-384 or SHA-512 outputs for learning and debugging.',
      'Keep small text hashing local in the browser.',
    ],
    examples: [
      {
        label: 'SHA-256 text',
        expression: 'Access Free Tools',
        result: 'bdcddc51dd9df0bad4c886a189a36bde524fd4c43f2ac196c7d8e2d4fe53076f',
      },
      { label: 'SHA-384 note', expression: 'browser utility', result: '96-character hex digest' },
      { label: 'SHA-512 phrase', expression: 'local hash example', result: '128-character hex digest' },
    ],
    extraFaq: [
      {
        question: 'Is a hash the same as encryption?',
        answer:
          'No. Encryption is designed to be reversed with a key. A SHA-2 hash is a one-way digest, so this page cannot decrypt the output back into the original text.',
      },
      {
        question: 'Why does a tiny text change create a different hash?',
        answer:
          'Hash functions are built so small input changes create very different digests. Changing a capital letter, adding a trailing space, or changing a line break should produce a new hash.',
      },
      {
        question: 'Why is a SHA-256 digest 64 hex characters?',
        answer:
          'SHA-256 returns 32 digest bytes. Hex uses two characters per byte, so 32 bytes become 64 lowercase hex characters. SHA-384 becomes 96 hex characters, and SHA-512 becomes 128.',
      },
      {
        question: 'Can I use this for password storage?',
        answer:
          'No. Password storage needs a password-hashing design such as a modern salted key-derivation function with security parameters. A raw SHA digest is not enough.',
      },
      {
        question: 'Can this page hash files?',
        answer:
          'No. This page is for text. File hashing needs a file picker, visible file-size limits, browser memory notes, and clear handling for large or binary files.',
      },
      {
        question: 'Does a matching hash prove who wrote the text?',
        answer:
          'No. A matching digest can show that two exact text values match, but it does not prove the sender or owner. Authenticity checks need HMACs, digital signatures, or another trusted system.',
      },
    ],
    relatedSlugs: ['base64-encode-decode', 'url-encode-decode', 'password-generator'],
  }),
  makeUtilityTool({
    slug: 'unix-timestamp-converter',
    name: 'Unix Timestamp Converter',
    category: 'date-time',
    summary: 'Convert UTC dates to Unix timestamps and Unix timestamps back to UTC date-time strings.',
    description:
      'Use this free Unix timestamp converter to convert UTC date-time values into Unix seconds and milliseconds or convert timestamps back to UTC ISO time.',
    icon: 'tool-timestamp',
    aliases: ['Epoch Converter', 'Timestamp Converter', 'Unix Time Converter'],
    seoTitle: 'Unix Timestamp Converter | UTC Epoch Seconds & Milliseconds',
    seoDescription:
      'Convert UTC dates to Unix seconds or milliseconds, turn epoch timestamps back into ISO time, and catch seconds-vs-milliseconds mistakes.',
    formula:
      'Date mode reads the entered date and clock time as UTC, uses Date.UTC to count milliseconds since 1970-01-01T00:00:00Z, then divides by 1,000 for Unix seconds. Timestamp mode reverses that by multiplying seconds by 1,000 or reading milliseconds directly before displaying the UTC ISO time.',
    limit:
      'The converter uses UTC on purpose. It does not guess your local time zone, daylight-saving rules, database storage format, or event-scheduling rules, so the same timestamp can appear as a different wall-clock time in another app.',
    faqLanguage: {
      expectedInputs: 'a UTC date and time, or a numeric Unix timestamp with the seconds or milliseconds unit selected',
      inputFallback:
        'Enter a UTC date and time when converting to a timestamp. Enter the timestamp digits and choose seconds or milliseconds when converting back to a date.',
      examplePhrase: 'UTC timestamp example',
      doubleCheck:
        'Check the mode, confirm the time is already in UTC, and make sure you did not paste a millisecond timestamp while seconds is selected.',
      privacy:
        'Yes. The conversion runs in your browser tab with JavaScript date math, so the timestamp value does not need to be sent to a server.',
    },
    inputExplanations: [
      {
        term: 'Date to timestamp mode',
        meaning: 'Use this when you have a UTC calendar date and UTC clock time and need Unix seconds plus milliseconds.',
      },
      {
        term: 'Timestamp to date mode',
        meaning: 'Use this when you have a stored epoch value and need to read the matching UTC date-time.',
      },
      {
        term: 'UTC date',
        meaning: 'The calendar date is read as UTC, not as your computer or phone time zone.',
      },
      {
        term: 'UTC time',
        meaning: 'The clock time is read as UTC. Convert local times to UTC first when the source time came from a local schedule.',
      },
      {
        term: 'Timestamp',
        meaning: 'Enter the epoch number only. Unix seconds are usually 10 digits for modern dates, while JavaScript-style milliseconds are usually 13 digits.',
      },
      {
        term: 'Unit',
        meaning: 'Choose seconds for compact Unix timestamps and milliseconds for JavaScript Date-style values.',
      },
    ],
    useCases: [
      'Convert a UTC date and time into Unix seconds for logs or APIs.',
      'Convert Unix seconds or milliseconds into an ISO UTC timestamp.',
      'Check whether a timestamp is seconds or milliseconds.',
      'Compare date-time values without local time-zone ambiguity.',
    ],
    examples: [
      { label: 'Date to seconds', expression: '2026-04-30 12:00 UTC', result: '1777464000 seconds' },
      { label: 'Milliseconds', expression: '1777464000000 ms', result: '2026-04-30T12:00:00.000Z' },
      { label: 'Unix epoch', expression: '0 seconds', result: '1970-01-01T00:00:00.000Z' },
    ],
    extraFaq: [
      {
        question: 'Are Unix timestamps seconds or milliseconds?',
        answer:
          'Both show up in real tools. Unix timestamp usually means seconds since the Unix epoch, while JavaScript Date values use milliseconds. For example, 1777464000 seconds and 1777464000000 milliseconds point to the same UTC instant.',
      },
      {
        question: 'Does this converter use my local time zone?',
        answer:
          'No. It treats the date and time fields as UTC and displays converted timestamps as UTC ISO time. A local app can display the same instant differently after applying its own time-zone rules.',
      },
      {
        question: 'What is the Unix epoch?',
        answer:
          'The Unix epoch is 1970-01-01T00:00:00.000Z. A timestamp of 0 seconds means that exact UTC instant, and positive values count forward from there.',
      },
      {
        question: 'Why is my converted time off by hours?',
        answer:
          'The usual causes are using local time as if it were UTC, choosing seconds when the value is milliseconds, or reading the result in an app that applies a local time zone or daylight-saving rule.',
      },
      {
        question: 'Can this schedule an event in a local time zone?',
        answer:
          'Not by itself. This converter shows one UTC instant. Scheduling real events needs the intended local time zone, daylight-saving behavior, recurrence rules, and the application rules that store or display the event.',
      },
    ],
    relatedSlugs: ['time-zone-calculator', 'date-calculator', 'day-of-the-week-calculator'],
  }),
  makeUtilityTool({
    slug: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    category: 'image-tools',
    summary: 'Check WCAG contrast ratio for text and background hex colors.',
    description:
      'Use this free color contrast checker to compare two hex colors, calculate contrast ratio, and see WCAG AA and AAA pass or fail results.',
    icon: 'tool-contrast',
    aliases: ['WCAG Contrast Checker', 'Accessibility Contrast Checker'],
    seoTitle: 'Color Contrast Checker | WCAG AA Ratio Tool',
    seoDescription:
      'Check foreground and background hex colors, calculate the WCAG contrast ratio, and see AA or AAA pass states for normal and large text.',
    formula:
      'The checker normalizes #RGB or #RRGGBB hex colors, converts each sRGB channel to linear light, calculates relative luminance, then uses the WCAG contrast formula: (lighter luminance + 0.05) / (darker luminance + 0.05).',
    limit:
      'Contrast ratio is one accessibility check. Also review actual font size and weight, focus states, hover states, selected states, icons, disabled controls, color-blind cues, and the real page background.',
    faqLanguage: {
      expectedInputs: 'the exact foreground text color and background color as #RGB or #RRGGBB hex values',
      inputFallback:
        'Text color is the foreground color you plan to use for letters, labels, icons, or button text. Background color is the color directly behind it. Enter both as #RGB or #RRGGBB hex values.',
      doubleCheck:
        'Also check the actual font size, font weight, state, theme, and page background because a color pair can pass in one component and fail in another.',
    },
    inputExplanations: [
      { term: 'Text color', meaning: 'the foreground hex color for the text, icon, label, or button copy you want people to read.' },
      { term: 'Background color', meaning: 'the exact hex color directly behind that foreground color, not a nearby surface color.' },
      { term: 'Contrast ratio', meaning: 'the lighter relative luminance divided by the darker relative luminance after WCAG adds 0.05 to both sides.' },
      { term: 'AA normal text', meaning: 'passes when the ratio is at least 4.5:1 for typical body text.' },
      { term: 'AA large text', meaning: 'passes when the ratio is at least 3:1 for large or bold text that meets the WCAG large-text size rule.' },
    ],
    extraFaq: [
      {
        question: 'What contrast ratio do I need for WCAG AA?',
        answer:
          'For most normal text, WCAG AA needs at least 4.5:1. Large text can pass AA at 3:1. If the result is close to the line, test the real font size, weight, and state before approving the color pair.',
      },
      {
        question: 'What contrast ratio do I need for WCAG AAA?',
        answer:
          'WCAG AAA is stricter: 7:1 for normal text and 4.5:1 for large text. AAA can be hard to meet with some brand palettes, so use it as a stronger readability target when the design can support it.',
      },
      {
        question: 'Why does #777777 on white fail normal AA text?',
        answer:
          '#777777 on #ffffff is about 4.4780894536:1. That is very close, but it is still below the 4.5:1 AA normal-text threshold, so the checker marks normal text as fail while large text can pass.',
      },
      {
        question: 'Does a passing contrast ratio make the design accessible?',
        answer:
          'No. A passing ratio is important, but it does not check font size, line height, focus outlines, hover states, disabled controls, icons without text, color-only meaning, or whether the color sits on a gradient or image.',
      },
    ],
    useCases: [
      'Check text color against a page background before publishing.',
      'Compare brand colors against WCAG AA and AAA thresholds.',
      'Test button, label, and navigation color pairs.',
      'Quickly reject low-contrast combinations during design work.',
    ],
    examples: [
      { label: 'Dark on white', expression: '#101828 on #ffffff', result: '17.7465943159:1, AA and AAA normal pass' },
      { label: 'Muted text', expression: '#667085 on #f9fafb', result: '4.7604112926:1, AA normal pass and AAA normal fail' },
      { label: 'Near miss', expression: '#777777 on #ffffff', result: '4.4780894536:1, AA normal fail but large text passes' },
    ],
    relatedSlugs: ['aspect-ratio-calculator', 'css-clamp-calculator', 'monitor-ppi-calculator'],
  }),
  makeUtilityTool({
    slug: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    category: 'image-tools',
    summary: 'Simplify aspect ratios and scale width or height while keeping proportions.',
    description:
      'Use this free aspect ratio calculator to simplify width and height ratios or resize a design, image, video, or screenshot without stretching it.',
    icon: 'tool-aspect-ratio',
    aliases: ['Image Ratio Calculator', 'Video Aspect Ratio Calculator'],
    seoTitle: 'Aspect Ratio Calculator | Resize Images & Video',
    seoDescription:
      'Simplify width and height ratios, scale one dimension from another, and avoid stretched images, videos, thumbnails, and social graphics.',
    formula:
      'The calculator scales decimal inputs to whole-number precision, divides width and height by their greatest common divisor to simplify the ratio, then uses width / height to calculate the missing scaled dimension.',
    limit:
      'Aspect ratio preserves shape, not subject framing. Use exact upload specs for platforms, product images, video editors, and print jobs, and remember that rounding a scaled dimension can cause a one-pixel difference.',
    faqLanguage: {
      expectedInputs: 'the original width and height, plus either the new width or the new height when you are resizing',
      inputFallback:
        'Use the same unit for width and height. Pixels are common for screens, but inches, centimeters, or any matching unit can work when you only need the ratio.',
      doubleCheck:
        'Check whether the job needs resizing, cropping, padding, or a platform-specific preset because keeping the same ratio does not decide what part of the image stays visible.',
    },
    inputExplanations: [
      { term: 'Width', meaning: 'the horizontal size of the image, video, screen, card, or design.' },
      { term: 'Height', meaning: 'the vertical size of the same item, using the same unit as width.' },
      { term: 'Simplified ratio', meaning: 'the width and height divided by their greatest common divisor, such as 1920 x 1080 becoming 16:9.' },
      { term: 'Decimal', meaning: 'width divided by height, useful for comparing whether two sizes have the same shape.' },
      { term: 'Scaled size', meaning: 'the matching width or height that keeps the original shape when one dimension changes.' },
    ],
    extraFaq: [
      {
        question: 'What is an aspect ratio?',
        answer:
          'An aspect ratio is the relationship between width and height. A 16:9 image can be 1920 x 1080, 1280 x 720, or 3840 x 2160 because each size keeps the same width-to-height shape.',
      },
      {
        question: 'How do I scale a 16:9 video to 1280 wide?',
        answer:
          'Enter 1920 width, 1080 height, choose Scale by width, and enter 1280 as the new width. The matching height is 720, so the scaled size is 1280 x 720.',
      },
      {
        question: 'Why can the scaled answer be off by one pixel?',
        answer:
          'Some ratios produce fractional pixels after scaling. The calculator shows readable dimensions, but a platform or editor may round up or down differently, so check the final export size before uploading.',
      },
      {
        question: 'Is resizing the same as cropping?',
        answer:
          'No. Resizing changes the dimensions while keeping the whole image. Cropping cuts away part of the image to fit a different shape. If a platform requires a new ratio, you may need crop or padding instead of only resizing.',
      },
    ],
    useCases: [
      'Simplify image, video, thumbnail, and screenshot dimensions.',
      'Resize a design to a new width while preserving height proportion.',
      'Resize a design to a new height while preserving width proportion.',
      'Compare landscape, square, and portrait formats before exporting.',
    ],
    examples: [
      { label: '4K video', expression: '3840 x 2160', result: '16:9, decimal 1.7777777778' },
      { label: 'Vertical story', expression: '1080 x 1920 to 720 wide', result: '720 x 1280' },
      { label: 'Social preview', expression: '1200 x 630 to 600 wide', result: '600 x 315' },
    ],
    relatedSlugs: ['color-contrast-checker', 'monitor-ppi-calculator', 'css-clamp-calculator'],
  }),
  makeUtilityTool({
    slug: 'utm-builder',
    name: 'UTM Builder',
    category: 'developer-tools',
    summary: 'Build campaign URLs with source, medium, campaign, content, and term parameters.',
    description:
      'Use this free UTM builder to add campaign tracking parameters to a URL, preserve existing query values, and copy a clean analytics-ready link.',
    icon: 'tool-utm',
    aliases: ['Campaign URL Builder', 'UTM Link Builder', 'Google Analytics URL Builder'],
    seoTitle: 'UTM Builder | Campaign URL Generator',
    seoDescription:
      'Build campaign URLs with utm_source, utm_medium, utm_campaign, optional content and term fields, and existing query parameters preserved.',
    formula:
      'The builder validates an http or https base URL, keeps existing query parameters, then sets utm_source, utm_medium, utm_campaign, and optional utm_content and utm_term values with URLSearchParams.',
    limit:
      'UTM links only help analytics when the destination site is configured to collect campaign data and your team uses consistent naming rules. Different spelling, casing, or private data in a public URL can create messy or unsafe reports.',
    faqLanguage: {
      expectedInputs: 'the destination URL, campaign source, medium, campaign name, and any optional content or term labels you want to track',
      inputFallback:
        'Enter the destination URL first, then add source, medium, campaign, and optional content or term fields. Use short lower-case labels when your team does not already have a naming rule.',
      examplePhrase: 'campaign URL example',
      doubleCheck:
        'Also check the final URL, existing query parameters, spelling, casing, and whether your analytics tool will read the values the way your team expects.',
    },
    inputExplanations: [
      { term: 'Base URL', meaning: 'the page people should land on. It must start with http:// or https://.' },
      { term: 'UTM source', meaning: 'where the click comes from, such as newsletter, google, instagram, or partner-site.' },
      { term: 'UTM medium', meaning: 'the channel type, such as email, cpc, social, referral, or banner.' },
      { term: 'UTM campaign', meaning: 'the shared campaign name that groups related links in reports.' },
      { term: 'UTM content', meaning: 'an optional label for the link or creative version, such as hero-button or text-link.' },
      { term: 'UTM term', meaning: 'an optional paid keyword, audience, or search term label.' },
    ],
    extraFaq: [
      {
        question: 'Which UTM fields are required?',
        answer:
          'Use source, medium, and campaign for most campaign links. Source says where the click came from, medium says the channel type, and campaign says why the link exists. Content and term are optional detail fields.',
      },
      {
        question: 'Does this work with Google Analytics 4?',
        answer:
          'Yes, the generated URL uses standard UTM parameter names that GA4 and many other analytics tools can read. The tool does not install analytics for you, so the destination site still needs its analytics setup working.',
      },
      {
        question: 'Are UTM values case sensitive?',
        answer:
          'Analytics reports can split values when you use different casing or spellings, such as Email, email, and e-mail. Pick one naming style before sharing links so reports stay easier to group.',
      },
      {
        question: 'What happens if my URL already has a question mark?',
        answer:
          'The builder keeps existing query parameters and adds the UTM values after them. For example, https://example.com/landing?page=1 becomes https://example.com/landing?page=1&utm_source=newsletter&utm_medium=email&utm_campaign=spring-tools.',
      },
      {
        question: 'Can I put customer names or email addresses in UTM fields?',
        answer:
          'No. UTM values travel inside the public URL and may appear in analytics, logs, screenshots, shared links, or browser history. Use campaign labels, not personal data or private identifiers.',
      },
    ],
    useCases: [
      'Create campaign links for newsletters, social posts, partner links, and launch announcements.',
      'Keep source, medium, and campaign names consistent before sharing a URL.',
      'Add content or term values when two links point to the same page.',
      'Copy one finished URL instead of hand-editing query parameters.',
    ],
    examples: [
      {
        label: 'Newsletter link',
        expression: 'https://accessfreetools.com/tools/ + newsletter / email / spring-tools',
        result: 'https://accessfreetools.com/tools/?utm_source=newsletter&utm_medium=email&utm_campaign=spring-tools&utm_content=hero-button',
      },
      {
        label: 'Social profile link',
        expression: 'percentage tool + instagram / social / calculator-tips',
        result: 'https://accessfreetools.com/tools/percentage-calculator/?utm_source=instagram&utm_medium=social&utm_campaign=calculator-tips&utm_content=bio-link',
      },
      {
        label: 'Search campaign',
        expression: 'source google, medium cpc, campaign utility-tools, term free calculators',
        result: 'https://accessfreetools.com/tools/?utm_source=google&utm_medium=cpc&utm_campaign=utility-tools&utm_content=ad-a&utm_term=free+calculators',
      },
    ],
    relatedSlugs: ['query-string-parser', 'url-encode-decode', 'slug-generator'],
  }),
  makeUtilityTool({
    slug: 'query-string-parser',
    name: 'Query String Parser',
    category: 'developer-tools',
    summary: 'Parse URL query strings into JSON or build encoded query strings from key-value lines.',
    description:
      'Use this free query string parser to decode URL parameters, group repeated keys, or build an encoded query string from one key-value pair per line.',
    icon: 'tool-query',
    aliases: ['URL Query Parser', 'Query Parameter Parser', 'Query String Builder'],
    seoTitle: 'Query String Parser | URL Parameters To JSON',
    seoDescription:
      'Parse URL query strings, decode URL parameters, group repeated keys, and build encoded query strings from key=value lines.',
    formula:
      'Parse mode extracts the query part from a full URL, raw query string, or question-mark string, removes hash fragments from raw input, reads the parameters with URLSearchParams, and groups repeated keys as arrays. Build mode reads one key=value line at a time, appends each pair with URLSearchParams, and returns a copy-ready encoded query string.',
    limit:
      'Query strings can be logged, shared, or indexed. Do not place passwords, private tokens, or sensitive identifiers in public URLs.',
    inputExplanations: [
      {
        term: 'Parse query mode',
        meaning:
          'Paste a full URL, a raw query string, or text that starts with a question mark. The tool works on the query part after the question mark.',
      },
      {
        term: 'Build query mode',
        meaning:
          'Enter one key=value pair per line. Blank values are allowed when the target app expects an empty parameter.',
      },
      {
        term: 'Repeated keys',
        meaning:
          'The parser keeps repeated parameter names visible as arrays in JSON, and build mode lets you repeat the same key on multiple lines.',
      },
      {
        term: 'Encoded characters',
        meaning:
          'URLSearchParams decodes query values in parse mode and encodes spaces and special characters when building the output.',
      },
      {
        term: 'Private URL data',
        meaning:
          'Treat query strings as shareable URL text, not as a secret place to put tokens, passwords, or customer identifiers.',
      },
    ],
    extraFaq: [
      {
        question: 'Can I paste a full URL instead of only the query string?',
        answer:
          'Yes. In parse mode you can paste a full URL such as https://example.com/products?tag=free&page=2, a raw string such as tag=free&page=2, or the same string with a leading question mark. The tool extracts and parses the query part.',
      },
      {
        question: 'How does the parser handle repeated parameters?',
        answer:
          'Repeated keys stay visible. For tag=free&tag=calculator&page=2, the JSON output shows tag as an array with both values, and the duplicate-key count warns you that the same parameter name appeared more than once.',
      },
      {
        question: 'Why did a space become a plus sign in the built query?',
        answer:
          'URLSearchParams serializes spaces in query values as plus signs. That is normal for form-style query strings, so q=calculator tools becomes ?q=calculator+tools when the builder returns the URL-ready query.',
      },
      {
        question: 'Is this a complete URL parser?',
        answer:
          'No. It focuses on the query string: the part after the question mark. It does not break a URL into protocol, host, path, port, and hash fields except when it needs to extract the query section from a full URL.',
      },
      {
        question: 'Can build mode create array-style query parameters?',
        answer:
          'It appends exactly the keys you enter. Use tag=free and tag=calculator on separate lines for repeated-key arrays, or enter bracket-style keys such as tag[]=free only when the target app expects that convention.',
      },
    ],
    useCases: [
      'Decode URL parameters while debugging filters, search pages, or app links.',
      'Group repeated keys so duplicate values are easy to spot.',
      'Build a correctly encoded query string from plain key-value lines.',
      'Compare UTM links, search URLs, and app-state URLs before sharing.',
      'Turn search-filter URLs into readable JSON for support tickets, QA notes, or API tests.',
    ],
    examples: [
      {
        label: 'Full URL with repeated tag',
        expression: 'https://example.com/products?utm_source=newsletter&tag=free&tag=calculator&page=2',
        result: '4 parameters, 1 duplicate key, and tag shown as ["free", "calculator"]',
      },
      {
        label: 'Raw query with plus-space text',
        expression: 'name=Access+Free+Tools&tool=json&empty=',
        result: '3 parameters, name decoded as "Access Free Tools", and empty kept as a blank value',
      },
      {
        label: 'Build search filters',
        expression: 'q=calculator tools, category=developer tools, page=1',
        result: '?q=calculator+tools&category=developer+tools&page=1',
      },
    ],
    relatedSlugs: ['utm-builder', 'url-encode-decode', 'json-formatter'],
  }),
  makeUtilityTool({
    slug: 'html-entity-encoder-decoder',
    name: 'HTML Entity Encoder / Decoder',
    category: 'developer-tools',
    summary: 'Encode HTML-sensitive characters or decode common named and numeric HTML entities.',
    description:
      'Use this free HTML entity encoder and decoder to turn HTML characters into display-safe entity text or convert entity codes back to readable text.',
    icon: 'tool-html-entity',
    aliases: ['HTML Entity Encoder', 'HTML Entity Decoder', 'HTML Escape Tool'],
    seoTitle: 'HTML Entity Encoder / Decoder | Escape HTML Text',
    seoDescription:
      'Encode HTML-sensitive characters, decode named or numeric entities, and copy safe display text for examples, docs, and snippets.',
    formula:
      'Encode mode replaces &, <, >, double quotes, and apostrophes with &amp;, &lt;, &gt;, &quot;, and &apos;. Decode mode converts the supported named entities amp, apos, copy, gt, lt, nbsp, quot, and reg, plus valid decimal entities such as &#36; and hexadecimal entities such as &#x26;, back to characters.',
    limit:
      'Entity encoding is useful for displaying code examples as text, but it is not a complete sanitizer for untrusted HTML or script content.',
    inputExplanations: [
      {
        term: 'Encode characters mode',
        meaning:
          'Use this when you want text such as <strong>Free & fast</strong> to show as visible code instead of being interpreted as HTML markup.',
      },
      {
        term: 'Decode entities mode',
        meaning:
          'Use this when copied text contains entity codes such as &lt;, &amp;, &quot;, &#36;, or &#x26; and you want to read the characters again.',
      },
      {
        term: 'Entity count',
        meaning:
          'The result counts how many characters or entity codes were converted. For example, <strong>Free & fast</strong> changes 5 entities when encoded.',
      },
      {
        term: 'Changed positions',
        meaning:
          'This is a quick difference check between input and output text. It helps confirm that encoding or decoding actually changed the snippet.',
      },
      {
        term: 'Security boundary',
        meaning:
          'Encoding helps display code as text. It does not validate HTML, remove unsafe scripts, or make untrusted user input safe to render as real markup.',
      },
    ],
    extraFaq: [
      {
        question: 'What characters does encode mode change?',
        answer:
          'Encode mode changes ampersands, less-than signs, greater-than signs, double quotes, and apostrophes. Those become &amp;, &lt;, &gt;, &quot;, and &apos; so the snippet can be shown as text in HTML.',
      },
      {
        question: 'Does this encode every possible symbol into an HTML entity?',
        answer:
          'No. It focuses on the characters that most often break visible HTML text or code examples. Regular letters, numbers, spaces, punctuation, and symbols that do not need escaping are left alone.',
      },
      {
        question: 'Can decode mode handle numeric entities?',
        answer:
          'Yes. Decode mode supports valid decimal entities such as &#36; and hexadecimal entities such as &#x26; when the code point is in the valid Unicode range.',
      },
      {
        question: 'Which named HTML entities are supported?',
        answer:
          'The compact decoder supports amp, apos, copy, gt, lt, nbsp, quot, and reg. Unknown named entities are left unchanged so you can spot text that needs a fuller entity reference.',
      },
      {
        question: 'Why does an ampersand become &amp; before other text?',
        answer:
          'Ampersands start entity codes in HTML. Encoding a plain ampersand first prevents text such as A&B from being confused with an entity-like sequence when the snippet is displayed.',
      },
      {
        question: 'Is HTML entity encoding the same as sanitizing HTML?',
        answer:
          'No. Entity encoding is useful for showing code examples as text. Sanitizing untrusted HTML is a separate security job that needs a maintained sanitizer and clear allowlist rules.',
      },
      {
        question: 'When should I use URL encoding instead?',
        answer:
          'Use URL encoding for query strings, path values, and links. Use HTML entity encoding for text that will be displayed inside HTML. The two formats solve different problems.',
      },
    ],
    useCases: [
      'Show HTML code examples inside a blog post, guide, or documentation page.',
      'Decode copied entity text so it is easier to read.',
      'Escape short snippets before placing them in visible HTML text.',
      'Check whether a string changed after encoding or decoding.',
      'Confirm whether numeric entities such as &#36; or &#x26; decode to the expected characters.',
    ],
    examples: [
      {
        label: 'Encode tag text',
        expression: '<strong>Free & fast</strong>',
        result: '5 entities changed from 28 input characters: &lt;strong&gt;Free &amp; fast&lt;/strong&gt;',
      },
      {
        label: 'Decode a quoted span',
        expression: '&lt;span title=&quot;A&amp;B&quot;&gt;Save&lt;/span&gt;',
        result: '7 entities changed into readable HTML text: <span title="A&B">Save</span>',
      },
      {
        label: 'Quote cleanup',
        expression: 'title="Calculator" data-label="A&B"',
        result: 'title=&quot;Calculator&quot; data-label=&quot;A&amp;B&quot;',
      },
      {
        label: 'Numeric entity decode',
        expression: 'Price &#36;9.99 &#x26; no tracking',
        result: '2 numeric entities changed: Price $9.99 & no tracking',
      },
    ],
    relatedSlugs: ['json-formatter', 'url-encode-decode', 'text-case-converter'],
  }),
  makeUtilityTool({
    slug: 'css-clamp-calculator',
    name: 'CSS Clamp Calculator',
    category: 'developer-tools',
    summary: 'Generate CSS clamp formulas for fluid font sizes, spacing, and responsive layout values.',
    description:
      'Use this free CSS clamp calculator to create a copy-ready responsive clamp() formula from minimum size, maximum size, viewport range, and root font size.',
    icon: 'tool-css-clamp',
    aliases: ['Fluid Typography Calculator', 'CSS Fluid Type Calculator', 'Clamp Generator'],
    seoTitle: 'CSS Clamp Calculator | Fluid Type Formula Tool',
    seoDescription:
      'Generate a CSS clamp() formula for fluid typography, spacing, or layout values from min/max sizes, viewport range, and root font size.',
    formula:
      'Slope = (maximum size - minimum size) / (maximum viewport - minimum viewport) * 100. Intercept px = minimum size - slope * minimum viewport / 100. The calculator converts minimum size, intercept, and maximum size to rem with the root font size, then formats clamp(minRem, calc(interceptRem + slopevw), maxRem).',
    limit:
      'Clamp formulas control numeric scaling only. Real layouts still need browser checks for text wrapping, readability, zoom, root font-size changes, tap targets, and container width.',
    inputExplanations: [
      { term: 'Minimum size', meaning: 'The smallest value you want the CSS property to use, usually the mobile size in pixels.' },
      { term: 'Maximum size', meaning: 'The largest value you want the CSS property to use, usually the desktop size in pixels.' },
      { term: 'Minimum viewport', meaning: 'The viewport width where the value should stop shrinking.' },
      { term: 'Maximum viewport', meaning: 'The viewport width where the value should stop growing.' },
      { term: 'Root font size', meaning: 'The px value used to convert px values into rem. The browser default is usually 16px.' },
      { term: 'Middle size', meaning: 'A quick midpoint check so you can see whether the scale feels reasonable before copying the CSS.' },
    ],
    extraFaq: [
      {
        question: 'What does CSS clamp() do?',
        answer:
          'CSS clamp() keeps a value between a minimum and a maximum. The middle value can be fluid, so a heading, spacing token, or layout value can grow with the viewport without extra media queries.',
      },
      {
        question: 'Why does the preferred value use rem plus vw?',
        answer:
          'The vw part creates the viewport-based growth. The rem intercept anchors the line so the formula lands on your chosen minimum size at the minimum viewport and your chosen maximum size at the maximum viewport.',
      },
      {
        question: 'Should I use px, rem, or vw in the final CSS?',
        answer:
          'This calculator asks for pixel inputs because design specs often use pixels, then returns rem endpoints and a rem-plus-vw preferred value. That keeps the formula friendlier to root font-size changes while still matching your design numbers.',
      },
      {
        question: 'What viewport range should I choose?',
        answer:
          'Use the width range where you actually want the value to scale. A common pattern is a mobile width such as 360px or 375px and a desktop width such as 1200px, 1280px, or 1440px.',
      },
      {
        question: 'Can I use this for spacing, not only font-size?',
        answer:
          'Yes. clamp() can work for font-size, margin, padding, gaps, widths, and other numeric CSS values. For spacing, still check small screens so the fluid value does not crowd content.',
      },
      {
        question: 'Why can text still wrap badly after using clamp()?',
        answer:
          'clamp() only controls the numeric size. Long words, narrow containers, line height, font choice, and content length can still create awkward wrapping, so check the real component in a browser.',
      },
      {
        question: 'Is this the same as container queries?',
        answer:
          'No. This formula scales with viewport width because it uses vw. Container queries respond to a component container. Use browser testing or container-query CSS when the component width matters more than the full viewport.',
      },
    ],
    useCases: [
      'Create fluid heading sizes that grow between mobile and desktop widths.',
      'Generate responsive spacing values without writing several media queries.',
      'Convert a design-system min and max size into copy-ready CSS.',
      'Compare the middle size before placing the formula in a stylesheet.',
    ],
    examples: [
      {
        label: 'Responsive heading',
        expression: '32px to 64px from 360px to 1280px, root 16px',
        result: 'clamp(2rem, calc(1.217391rem + 3.478261vw), 4rem)',
      },
      {
        label: 'Body text',
        expression: '16px to 20px from 375px to 1200px, root 16px',
        result: 'clamp(1rem, calc(0.886364rem + 0.484848vw), 1.25rem)',
      },
      {
        label: 'Section padding',
        expression: '24px to 72px from 360px to 1440px, root 16px',
        result: 'clamp(1.5rem, calc(0.5rem + 4.444444vw), 4.5rem)',
      },
    ],
    relatedSlugs: ['color-contrast-checker', 'aspect-ratio-calculator', 'markdown-table-generator'],
  }),
  makeUtilityTool({
    slug: 'ai-token-cost-calculator',
    name: 'AI Token Cost Calculator',
    category: 'ai-tools',
    summary: 'Estimate AI model input, output, and total token cost from your own current price rates.',
    description:
      'Use this free AI token cost calculator to estimate input token cost, output token cost, total cost, and cost per request without hardcoded stale model prices.',
    icon: 'tool-ai-token-cost',
    aliases: ['LLM Token Cost Calculator', 'AI Cost Calculator', 'Token Pricing Calculator'],
    seoTitle: 'AI Token Cost Calculator | Estimate LLM API Cost',
    seoDescription:
      'Estimate AI API spend from requests, input tokens, output tokens, and your current model prices per 1M tokens.',
    formula:
      'Input cost = input tokens per request * request count / 1,000,000 * input price per 1M tokens. Output cost = output tokens per request * request count / 1,000,000 * output price per 1M tokens. Total cost = input cost + output cost. Cost per request = total cost / request count.',
    limit:
      'This is a planning estimate, not a live provider bill. AI providers can change prices, count cached tokens differently, round usage, add batch discounts, include tool-call costs, or apply credits and taxes. Use the current provider rate card and your real usage logs for budgets that matter.',
    inputExplanations: [
      { term: 'Requests', meaning: 'How many model calls you want to estimate, such as one day, one month, or one product test.' },
      { term: 'Input tokens per request', meaning: 'Tokens sent to the model each time, including instructions, prompt text, context, and tool messages.' },
      { term: 'Output tokens per request', meaning: 'Tokens generated by the model in each response.' },
      { term: 'Input price per 1M tokens', meaning: 'The current provider rate for one million input tokens for the model you plan to use.' },
      { term: 'Output price per 1M tokens', meaning: 'The current provider rate for one million output tokens. This is often different from the input price.' },
    ],
    extraFaq: [
      {
        question: 'Why does the calculator ask me to enter model prices?',
        answer:
          'Model prices change and different providers charge different rates for input, output, cached input, fine-tuned models, batch jobs, and special tools. Entering the rate yourself keeps the calculator useful without pretending one price is always current.',
      },
      {
        question: 'Does this count cached tokens or special model discounts?',
        answer:
          'No. It is a plain estimate for normal input and output tokens. If your provider has cached-token pricing, batch discounts, minimum charges, or credits, calculate those separately or adjust the prices you enter.',
      },
      {
        question: 'How do I estimate monthly AI API cost?',
        answer:
          'Use the number of requests you expect in a month, then enter the average input tokens and output tokens for one request. The total cost is the input spend plus output spend for that whole request count.',
      },
      {
        question: 'Why are input and output prices separate?',
        answer:
          'Many model providers charge different rates for tokens you send and tokens the model generates. Long prompts raise input cost, while long answers raise output cost, so keeping them separate makes the estimate easier to check.',
      },
      {
        question: 'Is the token count exact?',
        answer:
          'Only if your token numbers came from the exact tokenizer or usage logs for the model. Rough text estimates can be useful for planning, but code, symbols, non-English text, whitespace, and tool messages can change the real token count.',
      },
      {
        question: 'Can I compare two AI models with this calculator?',
        answer:
          'Yes. Keep the request count and token assumptions the same, then enter one model price card and compare it with another. This shows the pricing effect, not quality, latency, rate limits, or reliability.',
      },
      {
        question: 'Does this include hosting, vector database, or tool-call costs?',
        answer:
          'No. It only estimates model token charges from the rates you enter. Add hosting, storage, retrieval, image/audio/video tools, retries, monitoring, and other platform costs separately.',
      },
    ],
    useCases: [
      'Estimate the monthly cost of an AI support bot, writing helper, or internal tool.',
      'Compare two model price cards using the same token and request assumptions.',
      'Turn a token estimate into a rough budget before building a prototype.',
      'Explain why long prompts and long answers can cost different amounts.',
    ],
    examples: [
      {
        label: 'Support bot month',
        expression: '10,000 requests, 1,200 input tokens, 500 output tokens, $2 input and $8 output per 1M',
        result: '$24 input + $40 output = $64 total, or $0.0064 per request',
      },
      {
        label: 'Small prototype',
        expression: '1,000 requests, 300 input tokens, 150 output tokens, $0.15 input and $0.60 output per 1M',
        result: '$0.045 input + $0.09 output = $0.135 total',
      },
      {
        label: 'Long summaries',
        expression: '2,000 requests, 8,000 input tokens, 700 output tokens, $1.25 input and $5 output per 1M',
        result: '$20 input + $7 output = $27 total',
      },
    ],
    relatedSlugs: ['prompt-token-estimator', 'api-pricing-calculator', 'text-summarizer'],
  }),
  makeUtilityTool({
    slug: 'prompt-token-estimator',
    name: 'Prompt Token Estimator',
    category: 'ai-tools',
    summary: 'Estimate prompt tokens from text length with a visible rough range and tokenizer warning.',
    description:
      'Use this free prompt token estimator to turn pasted prompt text into a rough token estimate, low-high range, character count, and word count.',
    icon: 'tool-prompt-token',
    aliases: ['Token Estimator', 'Prompt Length Estimator', 'AI Prompt Token Counter'],
    seoTitle: 'Prompt Token Estimator Calculator | AI Token Counter',
    seoDescription:
      'Estimate prompt tokens from text length, characters per token, low-high range, character count, and word count before checking a model tokenizer.',
    formula:
      'Estimated tokens = ceiling(character count / selected average characters per token). Low estimate = ceiling(character count / 5). High estimate = ceiling(character count / 3). Words are counted from letter and number groups so you can compare the token estimate with normal writing length.',
    limit:
      'This is a rough planning estimate, not a model tokenizer or billing record. Real tokenizers split text by model vocabulary, and the provider may also count system prompts, chat history, retrieved context, tool messages, code, URLs, emojis, non-English text, and whitespace differently. Use the exact tokenizer or usage logs before relying on a context-window or cost number.',
    inputExplanations: [
      {
        term: 'Prompt text',
        meaning:
          'The text you plan to send to an AI model, such as a user prompt, system instruction, draft, code snippet, or retrieved context sample.',
      },
      {
        term: 'Average characters per token',
        meaning:
          'The rough divider used for the main estimate. Four characters per token is a common planning default for plain English, but the tool lets you adjust it between 2 and 8.',
      },
      {
        term: 'Low and high estimate',
        meaning:
          'A built-in range that divides the same character count by 5 and by 3 so you can see how much the rough estimate could move.',
      },
      {
        term: 'Words and characters',
        meaning:
          'Supporting counts that help you compare prompt drafts in normal writing terms before you check the exact tokenizer.',
      },
    ],
    extraFaq: [
      {
        question: 'Is this an exact tokenizer?',
        answer:
          'No. It is a quick planning estimate. For exact billing or context-window checks, use the tokenizer from the model provider you plan to use.',
      },
      {
        question: 'Why is there a low and high estimate?',
        answer:
          'Different text splits differently. A paragraph of normal English often behaves differently from code, lists, URLs, punctuation-heavy text, or another language, so the range helps you avoid treating the estimate as exact.',
      },
      {
        question: 'What average characters per token should I use?',
        answer:
          'Use 4 for a quick plain-English estimate. Try a lower value when the prompt has code, URLs, symbols, dense punctuation, or many short fragments. Try a higher value only when you have evidence from the tokenizer or usage logs.',
      },
      {
        question: 'Does this include system prompts, chat history, or retrieved context?',
        answer:
          'Only if you paste that text into the box. Real model calls may include hidden instructions, conversation history, retrieval snippets, tool schemas, or other context that the user never sees.',
      },
      {
        question: 'Why can code, URLs, or emojis change the real token count?',
        answer:
          'Tokenizers use model-specific vocabulary pieces, not normal words. Code symbols, long URLs, emoji sequences, whitespace, and non-English text can split into tokens very differently from a plain English paragraph.',
      },
      {
        question: 'Can I use this estimate for AI cost planning?',
        answer:
          'Yes, as a first pass. Estimate the prompt tokens here, estimate expected output tokens separately, then use the AI Token Cost Calculator with current model prices. Check real usage logs before making a budget decision.',
      },
      {
        question: 'Does my prompt text leave the browser?',
        answer:
          'The estimator is designed as a browser-side utility. Still, avoid pasting private prompts, customer data, keys, or unreleased content into any convenience tool unless you are comfortable handling that data in the current browser session.',
      },
    ],
    useCases: [
      'Quickly estimate whether a prompt is short, medium, or long before using a model.',
      'Plan token cost by pairing this tool with the AI Token Cost Calculator.',
      'Compare prompt drafts before choosing the shorter one.',
      'Explain why exact token counts need a provider tokenizer.',
    ],
    examples: [
      {
        label: 'Short instruction',
        expression: '480 characters at 4 characters per token',
        result: '120 estimated tokens, with a rough 96 to 160 range',
      },
      {
        label: 'System prompt',
        expression: '1,500 characters at 4 characters per token',
        result: '375 estimated tokens, with a rough 300 to 500 range',
      },
      {
        label: 'Long context prompt',
        expression: '2,400 characters at 3.5 characters per token',
        result: '686 estimated tokens, with a rough 480 to 800 range',
      },
    ],
    relatedSlugs: ['ai-token-cost-calculator', 'api-pricing-calculator', 'word-counter', 'text-summarizer'],
  }),
  makeUtilityTool({
    slug: 'api-pricing-calculator',
    name: 'API Pricing Calculator',
    category: 'developer-tools',
    summary: 'Estimate API usage cost from request count, units per request, unit price, fees, and overhead.',
    description:
      'Use this free API pricing calculator to estimate usage cost, billable units, fixed fees, overhead, and average cost per request.',
    icon: 'tool-api-pricing',
    aliases: ['API Cost Calculator', 'Usage Pricing Calculator', 'SaaS API Cost Calculator'],
    seoTitle: 'API Pricing Calculator | Estimate Usage Cost',
    seoDescription:
      'Estimate API usage cost from requests, billable units, price per unit, fixed fees, retry overhead, total cost, and average cost per request.',
    formula:
      'Billable units = requests * units per request * (1 + retry or overhead percent / 100). Usage cost = billable units * price per unit. Total cost = usage cost + fixed fee. Average cost per request = total cost / requests.',
    limit:
      'This is provider-neutral planning math, not a live bill. Provider billing can include free tiers, regional prices, taxes, credits, minimums, tiered prices, currency conversion, rounding, rate limits, failed-call rules, batch discounts, or special plan terms that this calculator does not know.',
    inputExplanations: [
      { term: 'Requests', meaning: 'The number of API calls, jobs, messages, images, events, or tasks you want to estimate.' },
      { term: 'Units per request', meaning: 'How many billable units each request uses, such as tokens, images, seconds, messages, credits, or GB.' },
      { term: 'Price per unit', meaning: 'The cost for one billable unit. Convert provider prices to one unit before entering them.' },
      { term: 'Fixed fee', meaning: 'An optional monthly fee, minimum charge, platform fee, or other fixed cost to include in the total.' },
      { term: 'Retry or overhead percent', meaning: 'Extra cushion for retries, failed jobs, logging overhead, queue replays, or normal usage bursts.' },
    ],
    extraFaq: [
      {
        question: 'What is a billable unit?',
        answer:
          'A billable unit is whatever the provider charges for: one request, one image, one minute, one message, one credit, one GB, or one token. Use the unit from that provider price table.',
      },
      {
        question: 'How do I use this for token pricing?',
        answer:
          'If a model price is listed per 1 million tokens, divide that price by 1,000,000 to get the price per token, or use the AI Token Cost Calculator for the token-specific version.',
      },
      {
        question: 'How do I convert a price per 1,000 or 1 million units?',
        answer:
          'Divide the listed price by the number of units in that price. A $2 price per 1 million units becomes $0.000002 per unit. A $0.50 price per 1,000 units becomes $0.0005 per unit.',
      },
      {
        question: 'What should I put in fixed fee?',
        answer:
          'Use fixed fee for a monthly platform fee, minimum spend, support fee, base subscription, or other cost that does not change with request count. Leave it at 0 when the provider only charges for usage.',
      },
      {
        question: 'What overhead percent should I use?',
        answer:
          'Use 0 when you only want exact planned requests. Add 3% to 10% when retries, failed calls, background jobs, logs, or normal traffic bursts are likely. Use a higher value only when your own logs justify it.',
      },
      {
        question: 'Does this include free tiers or tiered pricing?',
        answer:
          'No. It uses one price per unit for the whole estimate. If a provider has a free tier, volume discounts, or tiered pricing, run the paid and free portions separately or use the blended unit price you trust.',
      },
      {
        question: 'Can I compare two API plans with this calculator?',
        answer:
          'Yes. Keep requests, units per request, fixed fee, and overhead the same, then swap the price per unit. That compares cost only, not rate limits, latency, support, reliability, or data retention rules.',
      },
      {
        question: 'Should I enter API keys or customer data?',
        answer:
          'No. The calculator only needs pricing numbers. Do not paste API keys, customer records, private payloads, or unreleased usage logs into the input fields.',
      },
    ],
    useCases: [
      'Estimate API cost before launching a feature, automation, or internal workflow.',
      'Compare pricing plans with the same request and billable-unit assumptions.',
      'Add a cushion for retries, failed calls, logging overhead, or traffic bursts.',
      'Explain why cheap per-unit prices can still add up at volume.',
    ],
    examples: [
      { label: 'Image API', expression: '1,000 requests x 1 image at $0.04 with 5% overhead', result: '1,050 billable units, $42 total' },
      { label: 'Message API', expression: '50,000 messages at $0.002, $10 fixed fee, 3% overhead', result: '51,500 billable units, $113 total, about $0.00226 per request' },
      { label: 'Credit bundle', expression: '20,000 jobs x 3 credits at $0.0005 with 10% overhead', result: '66,000 billable units, $33 total' },
    ],
    relatedSlugs: ['ai-token-cost-calculator', 'prompt-token-estimator', 'utm-builder', 'query-string-parser'],
  }),
  makeUtilityTool({
    slug: 'download-time-calculator',
    name: 'Download Time Calculator',
    category: 'developer-tools',
    summary: 'Estimate how long a file, game, backup, or update will take to download.',
    description:
      'Use this free download time calculator to estimate transfer time from file size, Mbps speed, and a realistic efficiency percentage.',
    seoTitle: 'Download Time Calculator | File Size to Time',
    seoDescription:
      'Estimate download time from file size, KB/MB/GB/TB units, Mbps speed, efficiency percent, effective Mbps, seconds, minutes, and hours.',
    icon: 'tool-download-time',
    aliases: ['File Download Calculator', 'Game Download Time Calculator', 'Download Speed Calculator'],
    formula:
      'The calculator uses decimal KB, MB, GB, and TB. Bytes = file size * unit bytes. Bits = bytes * 8. Effective Mbps = speed Mbps * efficiency percent / 100. Seconds = bits / (effective Mbps * 1,000,000).',
    limit:
      'Real downloads can be slower because of Wi-Fi quality, server limits, congestion, VPNs, protocol overhead, retries, throttling, device storage speed, router load, and background traffic. It does not measure your live connection.',
    inputExplanations: [
      { term: 'File size', meaning: 'The size shown by the app store, cloud drive, download page, or backup tool.' },
      { term: 'File unit', meaning: 'KB, MB, GB, or TB. The calculator uses decimal units, so 1 GB equals 1,000,000,000 bytes.' },
      { term: 'Speed Mbps', meaning: 'Megabits per second, which is different from megabytes per second. Internet plans usually advertise bits.' },
      { term: 'Efficiency percent', meaning: 'How much of the listed speed you realistically expect after overhead and network conditions.' },
    ],
    extraFaq: [
      {
        question: 'Why is Mbps different from MB/s?',
        answer:
          'Mbps means megabits per second. File sizes are usually shown in bytes. There are 8 bits in one byte, so a 100 Mbps connection cannot download 100 MB every second.',
      },
      {
        question: 'What efficiency percentage should I use?',
        answer:
          'Use 90% for a strong wired connection, 70% to 85% for normal Wi-Fi, and lower values when the connection is busy or the server is slow.',
      },
      {
        question: 'Does the calculator use GB or GiB?',
        answer:
          'It uses decimal GB, where 1 GB is 1,000,000,000 bytes. Some operating systems and storage tools use binary GiB instead, so very large files can differ slightly from what you see on disk.',
      },
      {
        question: 'Can I use this for upload time?',
        answer:
          'Yes, if you enter your real upload speed instead of download speed. Do not use your advertised download speed for cloud backup, video upload, or file sharing unless that is also your upload speed.',
      },
      {
        question: 'Why was my real download slower than the estimate?',
        answer:
          'The estimate cannot see server throttling, Wi-Fi interference, router load, VPN overhead, packet loss, background updates, storage speed, or other people sharing the connection.',
      },
      {
        question: 'Does this include data caps?',
        answer:
          'No. It estimates time, not monthly data allowance. Check your plan data cap separately when downloading large games, backups, videos, or system images.',
      },
    ],
    useCases: [
      'Estimate a game download before starting it.',
      'Plan how long a large backup or video file may take.',
      'Compare what happens when real speed is lower than the advertised plan.',
      'Explain bits versus bytes in plain language.',
    ],
    examples: [
      { label: '50 GB game', expression: '50 GB at 100 Mbps, 85% efficiency', result: 'About 1h 18m 26s' },
      { label: 'Small update', expression: '700 MB at 25 Mbps, 90% efficiency', result: 'About 4m 9s' },
      { label: 'Cloud backup', expression: '2 TB at 500 Mbps, 90% efficiency', result: 'About 9h 52m 36s' },
    ],
    relatedSlugs: ['bandwidth-calculator', 'internet-speed-needs-calculator', 'streaming-bitrate-calculator'],
  }),
  makeUtilityTool({
    slug: 'internet-speed-needs-calculator',
    name: 'Internet Speed Needs Calculator',
    category: 'developer-tools',
    summary: 'Estimate a household or workspace internet speed need from simultaneous activities.',
    description:
      'Use this free internet speed needs calculator to estimate recommended Mbps for streaming, gaming, video calls, smart devices, and a buffer.',
    seoTitle: 'Internet Speed Needs Calculator | Mbps Plan Estimate',
    seoDescription:
      'Estimate recommended internet Mbps from simultaneous streams, gaming devices, video calls, smart devices, per-activity Mbps, and buffer percent.',
    icon: 'tool-speed-needs',
    aliases: ['Internet Speed Calculator', 'WiFi Speed Needs Calculator', 'Mbps Needs Calculator'],
    formula:
      'The calculator multiplies video streams, gaming devices, video calls, and smart devices by their Mbps-per-device settings. Base Mbps = video load + gaming load + call load + smart-device load. Recommended Mbps = base Mbps * (1 + buffer percent / 100).',
    limit:
      'Mbps is only one part of internet quality. Wi-Fi signal, latency, jitter, upload speed, router quality, provider congestion, data caps, and the plan speed that actually reaches the room can matter just as much.',
    inputExplanations: [
      { term: 'Video streams', meaning: 'Streams that may play at the same time, such as TV, YouTube, or class videos.' },
      { term: 'Mbps per video stream', meaning: 'Use a rough per-stream value such as 8 Mbps for HD or 25 Mbps for 4K when you want a higher-quality estimate.' },
      { term: 'Gaming devices', meaning: 'Devices gaming online. Gaming often needs low latency more than huge Mbps.' },
      { term: 'Video calls', meaning: 'Calls that may run at the same time. For remote work, check upload speed too, not only download speed.' },
      { term: 'Smart devices', meaning: 'Background devices such as cameras, speakers, hubs, thermostats, or small connected devices.' },
      { term: 'Buffer percent', meaning: 'Extra speed so normal bursts and overhead do not fill the whole plan.' },
    ],
    extraFaq: [
      {
        question: 'Does this choose my exact internet plan?',
        answer:
          'No. It gives a planning estimate. Check upload speed, latency, data caps, router coverage, and actual provider performance before choosing a plan.',
      },
      {
        question: 'Why can gaming still lag when Mbps looks fine?',
        answer:
          'Online games usually use modest data, but they care a lot about latency, jitter, packet loss, Wi-Fi interference, and overloaded routers.',
      },
      {
        question: 'Should I use download speed or upload speed for video calls?',
        answer:
          'The calculator estimates download speed need. Video calls also send your camera and microphone upstream, so check your plan upload speed when several people call, stream, or back up files at once.',
      },
      {
        question: 'How much buffer should I add?',
        answer:
          'Start around 25% for normal home use. Use more when the router is far away, Wi-Fi is crowded, several people download large files, or you want the plan to feel comfortable during busy hours.',
      },
      {
        question: 'Does this include monthly data caps?',
        answer:
          'No. Mbps is speed, not monthly data allowance. A plan can be fast enough for 4K streaming and still hit a data cap if the household watches or downloads a lot.',
      },
    ],
    useCases: [
      'Estimate a family internet plan before comparing providers.',
      'Plan for work-from-home video calls plus streaming.',
      'Explain why 4K video changes speed needs more than normal browsing.',
      'Add a buffer instead of planning right at the limit.',
    ],
    examples: [
      { label: 'Small household', expression: '1 HD stream, 1 gamer, 1 call, 4 smart devices, 25% buffer', result: '23.75 Mbps' },
      { label: '4K evening', expression: '3 4K streams, 1 gamer, 8 smart devices, 30% buffer', result: '109.2 Mbps' },
      { label: 'Work from home', expression: '1 HD stream, 3 video calls, 6 smart devices, 35% buffer', result: '31.05 Mbps' },
    ],
    relatedSlugs: ['download-time-calculator', 'bandwidth-calculator', 'streaming-bitrate-calculator'],
  }),
  makeUtilityTool({
    slug: 'streaming-bitrate-calculator',
    name: 'Streaming Bitrate Calculator',
    category: 'developer-tools',
    summary: 'Estimate stream or recording data use from bitrate, time, and stream count.',
    description:
      'Use this free streaming bitrate calculator to estimate megabytes and gigabytes used by a bitrate over a chosen duration.',
    seoTitle: 'Streaming Bitrate Calculator | Data Use Estimate',
    seoDescription:
      'Estimate stream or recording data use from bitrate, duration, and stream count. See MB, GB, megabits, examples, and variable-bitrate limits.',
    icon: 'tool-streaming-bitrate',
    aliases: ['Video Bitrate Calculator', 'Stream Data Calculator', 'Recording Size Calculator'],
    formula:
      'Mbps = Kbps / 1,000 when needed. Total seconds = (hours * 3,600 + minutes * 60) * streams. Megabits = Mbps * total seconds. MB = megabits / 8. GB = MB / 1,000.',
    limit:
      'Variable bitrate, adaptive streaming, audio tracks, subtitles, chat, metadata, retransmits, previews, and platform processing can make real data use different.',
    inputExplanations: [
      { term: 'Bitrate', meaning: 'The video or audio data rate from the encoder, export setting, platform recommendation, or stream dashboard.' },
      { term: 'Bitrate unit', meaning: 'Choose Kbps for small audio rates and Mbps for most video streams or recordings.' },
      { term: 'Duration', meaning: 'How long the stream, upload, recording, lesson, event, or camera feed runs.' },
      { term: 'Streams', meaning: 'How many streams, cameras, files, or simultaneous feeds use the same bitrate and duration.' },
    ],
    extraFaq: [
      {
        question: 'Is bitrate the same as resolution?',
        answer:
          'No. Resolution is pixel size, such as 1920 x 1080. Bitrate is how much data per second the video or audio uses.',
      },
      {
        question: 'Should I enter video bitrate or audio bitrate?',
        answer:
          'Enter the total bitrate you want to estimate. For a video file or livestream, add video and audio bitrate together if your export or platform shows them separately.',
      },
      {
        question: 'Does this tell me the upload speed I need?',
        answer:
          'It estimates data use from bitrate and time. For live streaming, your upload speed should usually be comfortably higher than the stream bitrate because overhead, Wi-Fi, and congestion can cause drops.',
      },
      {
        question: 'Why are MB and GB decimal estimates?',
        answer:
          'The calculator uses decimal units: 1 GB = 1,000 MB. Some storage apps show binary GiB instead, so a saved file may look slightly different in your operating system.',
      },
      {
        question: 'Can I use this for multiple cameras?',
        answer:
          'Yes. Use the Streams field for cameras or feeds that share the same bitrate and runtime. If each camera uses a different bitrate, calculate each group separately and add the results.',
      },
      {
        question: 'Why does my actual file size differ?',
        answer:
          'Many apps use variable bitrate, which changes data rate scene by scene. Audio, subtitles, thumbnails, and container overhead can also change final size.',
      },
    ],
    useCases: [
      'Estimate data use before streaming on a limited connection.',
      'Plan recording storage for a long event.',
      'Compare 320 Kbps audio with multi-Mbps video.',
      'Estimate multiple camera feeds with the same bitrate.',
    ],
    examples: [
      { label: '2 hour 1080p stream', expression: '6 Mbps for 2 hours x 1 stream', result: '5.4 GB' },
      { label: 'Music stream', expression: '320 Kbps for 3.5 hours x 1 stream', result: '504 MB (0.504 GB)' },
      { label: 'Two cameras', expression: '4.5 Mbps for 1h 45m x 2 streams', result: '7.0875 GB' },
    ],
    relatedSlugs: ['download-time-calculator', 'internet-speed-needs-calculator', 'bandwidth-calculator'],
  }),
  makeUtilityTool({
    slug: 'device-battery-life-calculator',
    name: 'Device Battery Life Calculator',
    category: 'everyday-tools',
    summary: 'Estimate battery runtime from mAh, voltage, device watts, and efficiency.',
    seoTitle: 'Device Battery Life Calculator | mAh to Runtime',
    seoDescription:
      'Estimate device battery runtime from mAh, voltage, watts, and efficiency. See Wh, usable Wh, minutes, examples, and real-world battery limits.',
    description:
      'Use this free device battery life calculator to convert mAh and voltage into watt-hours, apply efficiency loss, and estimate runtime for small electronics.',
    icon: 'tool-battery-life',
    aliases: ['Battery Life Calculator', 'Power Bank Runtime Calculator', 'mAh to Hours Calculator'],
    formula:
      'Watt-hours = (mAh / 1,000) * volts. Usable Wh = watt-hours * efficiency / 100. Runtime hours = usable Wh / device watts. Runtime minutes = runtime hours * 60.',
    limit:
      'Real battery life depends on battery age, temperature, chemistry, discharge rate, screen brightness, radio use, power spikes, voltage-converter loss, inverter loss, cable loss, low-battery cutoff, and manufacturer limits.',
    inputExplanations: [
      { term: 'Battery capacity mAh', meaning: 'The milliamp-hour rating from the battery, phone, power bank, or small electronics label.' },
      { term: 'Voltage', meaning: 'The nominal battery voltage used to convert capacity into watt-hours. Use the pack or cell voltage from the spec sheet.' },
      { term: 'Device watts', meaning: 'The average power draw of the device while it is running. If you only know amps, multiply volts by amps to estimate watts.' },
      { term: 'Efficiency %', meaning: 'The usable energy after conversion losses, heat, cables, battery overhead, and safety cutoffs.' },
    ],
    extraFaq: [
      {
        question: 'Why do I need voltage when I already know mAh?',
        answer:
          'mAh alone does not tell total energy unless voltage is known. A 10,000 mAh battery at 3.7 V stores different energy than 10,000 mAh at 12 V.',
      },
      {
        question: 'What efficiency percentage should I use?',
        answer:
          'Use 80% to 90% for many USB power bank estimates. Use lower values when voltage conversion, heat, old batteries, or long cables waste more energy.',
      },
      {
        question: 'Can I use this for a USB power bank?',
        answer:
          'Yes. Use the mAh and nominal voltage listed for the pack. Many power banks advertise mAh at the internal cell voltage, often around 3.7 V, not the 5 V USB output.',
      },
      {
        question: 'Is mAh the same as battery life?',
        answer:
          'No. mAh is a capacity label, not a runtime promise. Voltage, device watts, efficiency, and real usage decide how long the battery may run.',
      },
      {
        question: 'Why does a high-power device run shorter than expected?',
        answer:
          'High loads can create heat, voltage sag, converter losses, and early cutoff. A device with startup spikes or bright screens may draw more than its average watt rating.',
      },
      {
        question: 'Should I enter watts or amps?',
        answer:
          'This calculator uses watts because watt-hours divided by watts gives hours directly. If your device lists current, estimate watts with volts x amps before entering it.',
      },
      {
        question: 'Can I compare two batteries by mAh alone?',
        answer:
          'Only when the batteries use the same voltage. For different voltages, compare watt-hours because watt-hours describe stored energy more directly.',
      },
      {
        question: 'Will this predict phone or laptop battery life exactly?',
        answer:
          'No. Phones and laptops change power draw constantly as the screen, processor, radios, charging circuits, and battery health change. Treat the result as a planning estimate.',
      },
    ],
    useCases: [
      'Estimate how long a power bank may run a tablet, light, router, or camera.',
      'Convert mAh and volts into watt-hours.',
      'Add realistic loss instead of assuming 100% battery use.',
      'Compare two batteries that use different voltages.',
    ],
    examples: [
      { label: 'Power bank and tablet', expression: '10,000 mAh, 3.7 V, 8 W, 85% efficiency', result: '3h 55m 53s (31.45 usable Wh)' },
      { label: 'Small light', expression: '5,000 mAh, 3.7 V, 3 W, 90% efficiency', result: '5h 33m 0s (16.65 usable Wh)' },
      { label: 'Laptop pack', expression: '5,000 mAh, 11.1 V, 30 W, 88% efficiency', result: '1h 37m 41s (48.84 usable Wh)' },
    ],
    relatedSlugs: ['electricity-calculator', 'download-time-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'monitor-ppi-calculator',
    name: 'Monitor PPI Calculator',
    category: 'image-tools',
    seoTitle: 'Monitor PPI Calculator | Pixels Per Inch',
    summary: 'Calculate pixels per inch from screen resolution and diagonal size.',
    seoDescription:
      'Use the Monitor PPI Calculator to estimate screen pixel density from width pixels, height pixels, diagonal inches, pixel diagonal, and aspect ratio.',
    description:
      'Use this free monitor PPI calculator to find screen pixel density, pixel diagonal, and simplified aspect ratio from resolution and diagonal inches before comparing displays.',
    icon: 'tool-monitor-ppi',
    aliases: ['Screen PPI Calculator', 'Pixel Density Calculator', 'DPI Calculator'],
    formula:
      'Pixel diagonal = sqrt(width pixels^2 + height pixels^2). PPI = pixel diagonal / screen diagonal inches. Aspect ratio is width pixels to height pixels simplified by their greatest common divisor.',
    limit:
      'PPI is not the same as perceived sharpness. Viewing distance, operating-system scaling, panel quality, subpixel layout, anti-aliasing, eyesight, brightness, and content quality also matter.',
    inputExplanations: [
      { term: 'Width pixels', meaning: 'The horizontal resolution from the screen spec, such as 1920, 2560, 3440, or 3840 pixels.' },
      { term: 'Height pixels', meaning: 'The vertical resolution from the screen spec, such as 1080, 1440, 1600, or 2160 pixels.' },
      { term: 'Diagonal inches', meaning: 'The physical diagonal screen size from the monitor, laptop, tablet, or TV spec.' },
    ],
    extraFaq: [
      {
        question: 'Is PPI the same as DPI?',
        answer:
          'People sometimes say DPI for screens, but PPI is the clearer term because it means pixels per inch. DPI is more often used for printers or mouse sensitivity.',
      },
      {
        question: 'Why can two 4K monitors look different?',
        answer:
          'A smaller 4K screen has higher PPI than a larger 4K screen. Panel type, scaling, brightness, subpixel layout, and viewing distance also change how sharp it feels.',
      },
      {
        question: 'What is a good PPI for a monitor?',
        answer:
          'There is no single perfect PPI. Around 90 PPI can be comfortable for many desktop setups without much scaling, while higher-density screens often look sharper but may need operating-system scaling to keep text readable.',
      },
      {
        question: 'Why does diagonal size matter?',
        answer:
          'The same resolution spread over a larger diagonal gives each pixel more physical space, so PPI goes down. That is why a 32 inch 4K screen has lower PPI than a 27 inch 4K screen.',
      },
      {
        question: 'Does PPI decide text size?',
        answer:
          'PPI affects physical pixel density, but the final text size also depends on scaling, browser zoom, app settings, and viewing distance. Use PPI as a comparison number, not the whole readability answer.',
      },
      {
        question: 'Can I use this for phones, tablets, or TVs?',
        answer:
          'Yes, if you know the pixel width, pixel height, and diagonal inches. The same math works, but viewing distance changes what feels sharp on a phone, desk monitor, or living-room TV.',
      },
    ],
    useCases: [
      'Compare a 24-inch 1080p monitor with a 27-inch 1440p monitor.',
      'Estimate pixel density before buying a display.',
      'Check whether a screen has a common 16:9, 16:10, or ultrawide ratio.',
      'Explain why resolution and screen size both matter.',
    ],
    examples: [
      { label: '24 inch 1080p', expression: '1920 x 1080, 24 inches', result: '91.7878 PPI, 16:9 aspect ratio' },
      { label: '27 inch 1440p', expression: '2560 x 1440, 27 inches', result: '108.7855 PPI, 16:9 aspect ratio' },
      { label: '32 inch 4K', expression: '3840 x 2160, 32 inches', result: '137.6817 PPI, 16:9 aspect ratio' },
    ],
    relatedSlugs: ['aspect-ratio-calculator', 'streaming-bitrate-calculator', 'color-contrast-checker'],
  }),
  makeUtilityTool({
    slug: 'recipe-scaler',
    name: 'Recipe Scaler',
    category: 'everyday-tools',
    summary: 'Scale one recipe ingredient from original servings to the servings you want to make.',
    description:
      'Use this free recipe scaler to resize ingredient amounts from the original serving count to a smaller or larger batch, with the scale factor shown.',
    seoTitle: 'Recipe Scaler | Adjust Servings',
    seoDescription:
      'Use the Recipe Scaler to resize an ingredient amount from original servings to desired servings and see the scale factor.',
    icon: 'tool-recipe-scale',
    aliases: ['Recipe Scaling Calculator', 'Recipe Converter', 'Serving Size Calculator'],
    formula:
      'Scale factor = desired servings / original servings. Scaled amount = original ingredient amount x scale factor.',
    limit:
      'Ingredient math scales cleanly, but eggs, packets, salt, spices, yeast, leavening, gelatin, thickeners, pan size, and cook time may need real kitchen judgment.',
    inputExplanations: [
      { term: 'Ingredient', meaning: 'The ingredient line you are scaling, such as flour, sugar, eggs, butter, sauce, or oats.' },
      { term: 'Original servings', meaning: 'How many servings the recipe normally makes before scaling.' },
      { term: 'Desired servings', meaning: 'How many servings you want to make now.' },
      { term: 'Original amount', meaning: 'The numeric amount from one ingredient line in the recipe.' },
      { term: 'Unit', meaning: 'The recipe unit to keep with the answer, such as cups, grams, tablespoons, ounces, eggs, or packets.' },
    ],
    extraFaq: [
      {
        question: 'Why does the tool scale one ingredient at a time?',
        answer:
          'It keeps the math easy to check. Enter each important ingredient line from the recipe, copy the scaled amount, then repeat for the next line. This avoids hiding mistakes in a giant pasted recipe table.',
      },
      {
        question: 'Do seasonings scale perfectly?',
        answer:
          'Not always. Salt, hot spices, yeast, gelatin, thickeners, and extracts can taste too strong or behave differently when scaled. Use the answer as a starting point and adjust carefully.',
      },
      {
        question: 'What is the scale factor in a recipe?',
        answer:
          'The scale factor is desired servings divided by original servings. A recipe going from 4 servings to 10 servings has a scale factor of 2.5, so each ingredient amount is multiplied by 2.5.',
      },
      {
        question: 'Why does the calculator show decimal eggs or packets?',
        answer:
          'The calculator shows the exact math first. If the answer is 7.5 eggs or 1.25 packets, decide how to round based on the recipe, ingredient size, texture, and how forgiving the dish is.',
      },
      {
        question: 'Can I scale cups, grams, tablespoons, and ounces?',
        answer:
          'Yes. Enter the number and the unit from the recipe. The scaler keeps the same unit in the answer; use a cooking measurement converter when you also need to change cups to grams, tablespoons to cups, or ounces to pounds.',
      },
      {
        question: 'Does cooking time scale with servings?',
        answer:
          'Not directly. A larger batch may need a different pan, deeper food, more stirring, or more time, while a thinner batch may cook faster. Use the scaled ingredients as the math step, then follow recipe doneness cues.',
      },
      {
        question: 'Should I weigh ingredients before scaling?',
        answer:
          'For baking and dry ingredients, grams or ounces are usually easier to scale accurately than loosely measured cups. Volume measurements can vary when ingredients are packed, sifted, chopped, or heaped.',
      },
    ],
    useCases: [
      'Resize a recipe from 4 servings to 10 servings.',
      'Make a half batch when you do not need the full recipe.',
      'Scale party trays, meal prep, or bake sale batches one ingredient line at a time.',
      'Check decimal answers before rounding eggs, packets, cans, or small teaspoons.',
      'Show the scale factor so the recipe math is easy to audit.',
    ],
    examples: [
      { label: 'Dinner for 10', expression: '2 cups flour, 4 servings to 10 servings', result: 'Scale factor 2.5, 5 cups flour' },
      { label: 'Half batch', expression: '300 g sugar, 12 servings to 6 servings', result: 'Scale factor 0.5, 150 g sugar' },
      { label: 'Party tray', expression: '3 eggs, 8 servings to 20 servings', result: 'Scale factor 2.5, 7.5 eggs before rounding' },
    ],
    relatedSlugs: ['cooking-measurement-converter', 'ingredient-cost-calculator', 'cost-per-serving-calculator'],
  }),
  makeUtilityTool({
    slug: 'cooking-measurement-converter',
    name: 'Cooking Measurement Converter',
    category: 'converters',
    summary: 'Convert recipe units, including approximate volume-to-weight conversions with ingredient density.',
    description:
      'Use this free cooking measurement converter for teaspoons, tablespoons, cups, milliliters, grams, ounces, pounds, and ingredient-density conversions.',
    icon: 'tool-cooking-measure',
    aliases: ['Kitchen Measurement Converter', 'Recipe Measurement Converter', 'Cups to Grams Converter'],
    formula:
      'The converter uses fixed unit factors for volume-to-volume or weight-to-weight conversions. For volume-to-weight conversions, it uses grams per cup as the ingredient density.',
    limit:
      'Volume-to-weight conversions are approximate because chopped, sifted, packed, and liquid ingredients can have different weights per cup.',
    inputExplanations: [
      { term: 'From and to units', meaning: 'The recipe unit you have and the unit you want.' },
      { term: 'Density grams per cup', meaning: 'How many grams one US cup of that ingredient weighs.' },
    ],
    extraFaq: [
      {
        question: 'What does density grams per cup mean?',
        answer:
          'It means the weight of one level US cup of a specific ingredient. A cup of flour may be around 120 g, while a cup of water is about 237 g, so the same volume can weigh very different amounts.',
      },
      {
        question: 'Can I use this for exact baking science?',
        answer:
          'Use it as a helpful estimate, then prefer a kitchen scale for baking when accuracy matters. How an ingredient is scooped, sifted, chopped, or packed can change the true weight.',
      },
    ],
    useCases: [
      'Convert cups of flour into grams with a density value.',
      'Convert milliliters to cups for a recipe from another country.',
      'Change ounces to grams without using a separate generic converter.',
      'Explain why cups-to-grams depends on the ingredient.',
    ],
    examples: [
      { label: 'Flour cups to grams', expression: '2 cups, 120 g per cup', result: '240 g' },
      { label: 'Milk mL to cups', expression: '500 mL to cups', result: 'About 2.11 cups' },
      { label: 'Butter ounces to grams', expression: '4 oz to grams', result: 'About 113.4 g' },
    ],
    relatedSlugs: ['recipe-scaler', 'butter-converter', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'ingredient-cost-calculator',
    name: 'Ingredient Cost Calculator',
    category: 'everyday-tools',
    summary: 'Estimate how much one recipe ingredient costs from package price and amount used.',
    description:
      'Use this free ingredient cost calculator to convert package size into recipe units and estimate the cost of the ingredient amount you need.',
    icon: 'tool-ingredient-cost',
    aliases: ['Recipe Ingredient Cost Calculator', 'Food Cost Calculator', 'Ingredient Price Calculator'],
    formula:
      'The calculator converts package amount into the needed unit, divides package price by converted package amount, then multiplies by the recipe amount.',
    limit:
      'It does not include tax, spoilage, coupons, waste, or leftover value unless you include those costs yourself.',
    inputExplanations: [
      { term: 'Amount needed', meaning: 'How much of the ingredient your recipe uses.' },
      { term: 'Package amount', meaning: 'How much ingredient is in the package you bought.' },
      { term: 'Density grams per cup', meaning: 'Used only when converting between volume and weight units.' },
    ],
    extraFaq: [
      {
        question: 'Why does ingredient density matter for cost?',
        answer:
          'If a recipe says 2 cups but the package says pounds or grams, the calculator needs to know how heavy one cup is. That weight is different for flour, sugar, oats, honey, and many other ingredients.',
      },
      {
        question: 'Should I include tax or wasted food?',
        answer:
          'Include them in the package price if you want the estimate to reflect real spending. If you only want shelf-price math, enter the shelf price and leave waste out.',
      },
    ],
    useCases: [
      'Estimate how much flour, sugar, butter, or chocolate costs in a recipe.',
      'Compare homemade cost with store-bought food.',
      'Build a simple bake sale or meal prep cost sheet.',
      'Convert package units before calculating cost.',
    ],
    examples: [
      { label: 'Flour for recipe', expression: '2 cups from a 5 lb bag at $4.49', result: 'Estimated ingredient cost' },
      { label: 'Chocolate chips', expression: '170 g from a 12 oz bag at $3.99', result: 'Recipe cost for chips' },
      { label: 'Milk in batter', expression: '250 mL from a gallon at $4.20', result: 'Small recipe cost' },
    ],
    relatedSlugs: ['recipe-scaler', 'cost-per-serving-calculator', 'unit-price-calculator'],
  }),
  makeUtilityTool({
    slug: 'unit-price-calculator',
    name: 'Unit Price Calculator',
    category: 'everyday-tools',
    summary: 'Compare two products by price per shared unit so the cheaper package is clearer.',
    description:
      'Use this free unit price calculator to compare two package sizes by price per ounce, pound, count, sheet, roll, or any shared unit.',
    icon: 'tool-unit-price',
    aliases: ['Price Per Unit Calculator', 'Unit Cost Calculator', 'Price Comparison Calculator'],
    formula:
      'The calculator divides each item price by its package quantity, compares both unit prices, and shows the cheaper option.',
    limit:
      'A lower unit price is not always the best choice if quality, expiration date, storage space, coupons, or product differences matter.',
    inputExplanations: [
      { term: 'Price', meaning: 'The shelf or sale price for each product.' },
      { term: 'Quantity', meaning: 'Package size for each product in the same unit.' },
      { term: 'Shared unit', meaning: 'The unit both products use, such as oz, lb, count, roll, or sheet.' },
    ],
    extraFaq: [
      {
        question: 'What if one package uses ounces and the other uses pounds?',
        answer:
          'Convert them to the same unit first. For example, change pounds to ounces or ounces to pounds, then enter both quantities using that one shared unit.',
      },
      {
        question: 'Why can the bigger package be worse?',
        answer:
          'A bigger package can cost more per unit, expire before you use it, or be different quality. Unit price tells you the math, but it does not judge whether the product is actually better for you.',
      },
    ],
    useCases: [
      'Compare small and family-size grocery packages.',
      'Check whether bulk paper towels, pet food, or detergent are actually cheaper.',
      'Convert sale prices into a fair per-unit comparison.',
      'Teach price-per-unit shopping math in plain language.',
    ],
    examples: [
      { label: 'Cereal boxes', expression: '$4.49 / 12 oz vs $6.99 / 21 oz', result: 'Cheaper price per oz' },
      { label: 'Paper towels', expression: '$8.99 / 6 rolls vs $12.49 / 10 rolls', result: 'Cheaper per roll' },
      { label: 'Pet food', expression: '$18.99 / 8 lb vs $35.99 / 18 lb', result: 'Cheaper per lb' },
    ],
    relatedSlugs: ['ingredient-cost-calculator', 'discount-calculator', 'cost-per-serving-calculator'],
  }),
  makeUtilityTool({
    slug: 'cost-per-serving-calculator',
    name: 'Cost Per Serving Calculator',
    category: 'everyday-tools',
    summary: 'Split a recipe, meal prep, or food batch cost across the number of servings.',
    description:
      'Use this free cost per serving calculator to divide a total recipe or food batch cost by servings and include optional extra costs.',
    icon: 'tool-serving-cost',
    aliases: ['Serving Cost Calculator', 'Meal Cost Calculator', 'Cost Per Portion Calculator'],
    formula:
      'The calculator adds main cost and extra cost, then divides total batch cost by servings.',
    limit:
      'The answer is only as accurate as the total cost and serving count. Big portions, waste, leftovers, and different appetites can change real cost per person.',
    inputExplanations: [
      { term: 'Main cost', meaning: 'The recipe, meal, or batch cost before optional extras.' },
      { term: 'Extra cost', meaning: 'Optional packaging, topping, delivery fee, or side cost to include.' },
      { term: 'Servings', meaning: 'How many portions the batch actually makes.' },
    ],
    extraFaq: [
      {
        question: 'What counts as a serving?',
        answer:
          'A serving is the portion size you choose to count. For meal prep, it might be one container. For a cake, it might be one slice. Keep the serving size realistic or the answer will be misleading.',
      },
      {
        question: 'Is this the same as ingredient cost?',
        answer:
          'No. Ingredient cost estimates one ingredient or a list you total yourself. Cost per serving takes the final batch total and spreads it across servings.',
      },
    ],
    useCases: [
      'Price meal prep containers by serving.',
      'Estimate bake sale cost before choosing a selling price.',
      'Compare homemade meals with takeout or store-bought food.',
      'Add packaging or topping costs before dividing by servings.',
    ],
    examples: [
      { label: 'Soup batch', expression: '$18.50 ingredients + $2 extras, 8 servings', result: '$2.56 per serving' },
      { label: 'Meal prep', expression: '$42 total, 10 servings', result: '$4.20 per serving' },
      { label: 'Bake sale', expression: '$19 total, 24 cupcakes', result: 'Cost per cupcake' },
    ],
    relatedSlugs: ['ingredient-cost-calculator', 'recipe-scaler', 'unit-price-calculator'],
  }),
  makeUtilityTool({
    slug: 'oven-temperature-converter',
    name: 'Oven Temperature Converter',
    category: 'converters',
    summary: 'Convert recipe oven settings between Fahrenheit, Celsius, gas mark, and a rough fan-oven starting point.',
    description:
      'Translate recipe oven settings between Fahrenheit, Celsius, common gas mark, and an approximate fan-oven starting point.',
    seoTitle: 'Oven Temperature Converter | F, C, Gas Mark, Fan',
    seoDescription:
      'Convert recipe oven settings between Fahrenheit, Celsius, gas mark, and a rough fan-oven starting point. Check 350 F, 180 C, and gas mark 4 quickly.',
    icon: 'tool-oven-temp',
    aliases: [
      'Oven Temp Converter',
      'Fahrenheit Celsius Gas Mark Converter',
      'Baking Temperature Converter',
      'Fan Oven Temperature Converter',
      'Gas Mark Converter',
      '350 F to C Oven Converter',
    ],
    formula:
      'The converter uses F = C x 9 / 5 + 32 and C = (F - 32) x 5 / 9, estimates a fan-oven starting point by lowering the rounded Celsius setting by about 20 C, then finds the nearest common gas mark temperature.',
    limit:
      'Oven settings are approximate. Fan and gas mark charts vary, some ovens auto-convert convection settings, real ovens can run hot or cold, and this does not replace safe internal food temperature checks.',
    inputExplanations: [
      { term: 'Temperature', meaning: 'the oven setting printed in the recipe, not the cooked food temperature.' },
      { term: 'Unit', meaning: 'whether the recipe uses Fahrenheit, Celsius, or gas mark.' },
    ],
    extraFaq: [
      {
        question: 'Is gas mark exact?',
        answer:
          'No. Gas mark is usually treated as a practical oven setting with common approximate Fahrenheit and Celsius equivalents. Use the nearest mark and watch the food.',
      },
      {
        question: 'What fan oven temperature should I use?',
        answer:
          'For a conventional-oven recipe, a common fan-oven starting point is about 20 C lower than the rounded Celsius setting. Some US convection ovens instead auto-lower by about 25 F. Check the oven manual and recipe notes before trusting one rule.',
      },
      {
        question: 'What is 350 F in Celsius and gas mark?',
        answer:
          '350 F is about 177 C by the formula, commonly rounded to 180 C on oven charts, and nearest to gas mark 4. A rough fan-oven starting point is about 160 C.',
      },
      {
        question: 'What is 180 C in Fahrenheit?',
        answer:
          '180 C is 356 F by the formula, so many recipe charts round it to 350 F. It is also nearest to gas mark 4.',
      },
      {
        question: 'Why does the converter show "nearest" gas mark?',
        answer:
          'Gas mark settings use common steps, so not every exact Fahrenheit or Celsius result has a perfect match. The converter picks the closest common mark and keeps the Fahrenheit value visible.',
      },
      {
        question: 'What if my oven runs hot or cold?',
        answer:
          'Use the converter for the recipe setting, then check the real oven with an oven thermometer if accuracy matters. Older ovens, small countertop ovens, and fan settings can drift from the dial.',
      },
      {
        question: 'Does this tell me when food is safe to eat?',
        answer:
          'No. It converts oven settings. Food safety depends on the food reaching a safe internal temperature, which is checked with a food thermometer and trusted guidance.',
      },
    ],
    useCases: [
      'Use a Celsius recipe in a Fahrenheit oven.',
      'Convert a gas mark recipe to Fahrenheit or Celsius.',
      'Estimate a fan-oven starting point for a conventional recipe.',
      'Check a baking temperature before preheating.',
      'Explain why oven setting and food internal temperature are different.',
    ],
    examples: [
      { label: 'Common bake temp', expression: '350 F', result: 'About 177 C, gas mark 4, fan about 160 C' },
      { label: 'Celsius recipe', expression: '180 C', result: '356 F, gas mark 4, fan about 160 C' },
      { label: 'Gas mark recipe', expression: 'Gas mark 6', result: '400 F, about 204 C, fan about 180 C' },
    ],
    relatedSlugs: ['cooking-measurement-converter', 'recipe-scaler', 'baking-pan-conversion-calculator', 'butter-converter'],
  }),
  makeUtilityTool({
    slug: 'butter-converter',
    name: 'Butter Converter',
    category: 'converters',
    summary: 'Convert butter between sticks, tablespoons, cups, ounces, grams, teaspoons, and pounds.',
    description:
      'Use this free butter converter to translate common recipe butter measurements, including US sticks, tablespoons, cups, ounces, grams, and pounds.',
    icon: 'tool-butter',
    aliases: ['Butter Measurement Converter', 'Butter Sticks to Cups', 'Butter Grams Converter'],
    formula:
      'The converter uses common US butter equivalents: 1 stick = 8 tablespoons = 1/2 cup = 4 ounces = about 113.4 grams.',
    limit:
      'Butter packaging can vary by country. Check your package label when stick size or block markings are different from common US butter sizes.',
    inputExplanations: [
      { term: 'Amount', meaning: 'The butter quantity from the recipe or package.' },
      { term: 'Unit', meaning: 'The butter unit you are starting from.' },
    ],
    extraFaq: [
      {
        question: 'Why does one stick equal 1/2 cup?',
        answer:
          'In common US packaging, one butter stick is 8 tablespoons, and 16 tablespoons make 1 cup. That makes one stick equal to 1/2 cup.',
      },
      {
        question: 'Can I use this outside the United States?',
        answer:
          'Yes for grams, ounces, tablespoons, and cups, but be careful with sticks. Some countries do not package butter in US-size sticks, so grams from the label may be safer.',
      },
    ],
    useCases: [
      'Convert one stick of butter into tablespoons, cups, or grams.',
      'Use a gram-based recipe with US butter packaging.',
      'Scale butter in baking recipes alongside a recipe scaler.',
      'Avoid guessing how many tablespoons are in a stick.',
    ],
    examples: [
      { label: 'One stick', expression: '1 stick', result: '8 tbsp, 1/2 cup, about 113.4 g' },
      { label: 'Half cup', expression: '0.5 cup', result: '1 stick' },
      { label: 'Metric recipe', expression: '115 g', result: 'About 8.1 tbsp' },
    ],
    relatedSlugs: ['cooking-measurement-converter', 'recipe-scaler', 'ingredient-cost-calculator'],
  }),
  makeUtilityTool({
    slug: 'baking-pan-conversion-calculator',
    name: 'Baking Pan Conversion Calculator',
    category: 'everyday-tools',
    summary: 'Compare rectangular baking pan areas and estimate how much to scale a recipe.',
    description:
      'Use this free baking pan conversion calculator to compare old and new rectangular pan sizes and estimate a recipe scaling factor.',
    icon: 'tool-baking-pan',
    aliases: ['Cake Pan Conversion Calculator', 'Baking Pan Size Calculator', 'Pan Area Calculator'],
    formula:
      'The calculator multiplies length by width for each pan, then divides new pan area by old pan area to get a scale factor.',
    limit:
      'Area scaling does not perfectly predict bake time, batter depth, rise, texture, or results for round, loaf, deep, or shaped pans.',
    inputExplanations: [
      { term: 'Old pan', meaning: 'The pan size in the original recipe.' },
      { term: 'New pan', meaning: 'The pan size you want to use instead.' },
      { term: 'Original servings', meaning: 'Optional serving count used to estimate new servings.' },
    ],
    extraFaq: [
      {
        question: 'Why does pan area matter?',
        answer:
          'For similar rectangular pans, batter depth changes when area changes. A larger pan spreads batter thinner, while a smaller pan makes it deeper. The area ratio gives a useful scaling starting point.',
      },
      {
        question: 'Will bake time stay the same?',
        answer:
          'Usually not exactly. Thinner batter may bake faster, deeper batter may bake slower, and delicate recipes can behave differently. Start checking early and use the recipe signs of doneness.',
      },
    ],
    useCases: [
      'Scale a 9x13 inch recipe down to an 8x8 inch pan.',
      'Estimate how much batter to make when switching rectangular pans.',
      'Convert servings when a pan gets larger or smaller.',
      'Understand why pan size can change bake time.',
    ],
    examples: [
      { label: '9x13 to 8x8', expression: '117 sq in to 64 sq in', result: 'About 0.55x batch' },
      { label: '8x8 to 9x13', expression: '64 sq in to 117 sq in', result: 'About 1.83x batch' },
      { label: 'Sheet pan change', expression: '13x18 to 11x15', result: 'Smaller pan area factor' },
    ],
    relatedSlugs: ['recipe-scaler', 'cooking-measurement-converter', 'cost-per-serving-calculator'],
  }),
  makeUtilityTool({
    slug: 'markdown-table-generator',
    name: 'Markdown Table Generator',
    category: 'text-tools',
    summary: 'Create GitHub-flavored Markdown tables from headers, rows, and alignment choices.',
    description:
      'Use this free markdown table generator to turn comma-separated or pipe-separated headers and rows into a copy-ready GitHub-flavored Markdown table.',
    icon: 'tool-markdown-table',
    aliases: ['Markdown Table Maker', 'GFM Table Generator', 'Markdown Table Builder'],
    formula:
      'The generator splits headers and rows into cells, creates a GitHub-flavored Markdown delimiter row, pads short rows, and outputs table text.',
    limit:
      'Markdown table rendering depends on the publishing platform. Preview the result in the editor or site where the table will be used.',
    useCases: [
      'Create quick comparison tables for blog posts, docs, and project notes.',
      'Turn a small list of rows into GitHub-flavored Markdown syntax.',
      'Choose left, center, or right alignment without memorizing delimiter marks.',
      'Build compact feature, comparison, or checklist tables for content planning.',
    ],
    examples: [
      { label: 'Tool table', expression: 'Tool, Use, Status plus two rows', result: 'GitHub-flavored Markdown table' },
      { label: 'Feature matrix', expression: 'Feature | Free | Notes', result: 'Pipe-style markdown table' },
      { label: 'Simple report', expression: 'Metric, Value with two rows', result: 'Right-aligned markdown table' },
    ],
    relatedSlugs: ['word-counter', 'character-counter', 'css-clamp-calculator'],
  }),
];
