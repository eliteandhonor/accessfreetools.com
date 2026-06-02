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
    summary: 'Estimate slab concrete volume, cubic yards, cubic meters, and common 40 lb, 60 lb, and 80 lb bag counts.',
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
    summary: 'Calculate mass from density and volume with clear formula steps.',
    description:
      'Use this free mass calculator to multiply density by volume and estimate mass with formula steps and a custom unit label.',
    icon: 'calculator-mass',
    formula:
      'The calculator uses mass = density x volume. Density and volume must be in matching units for the result label to make sense.',
    limit:
      'This is a formula helper, not a scale. Material density, temperature, moisture, and measurement precision can change real mass.',
    inputExplanations: [
      { term: 'Density', meaning: 'mass per volume, such as g/mL, kg/m3, lb/ft3, or a supplier density.' },
      { term: 'Volume', meaning: 'the space the material fills, written in the matching volume unit for the density.' },
      { term: 'Mass unit label', meaning: 'the label you want printed beside the answer, such as g, kg, or lb.' },
    ],
    extraFaq: [
      {
        question: 'Is this the same as weighing something on a scale?',
        answer:
          'No. This estimates mass from a density value and a volume value. A real scale measures the object directly, while this calculator is only as good as the density and volume you enter.',
      },
    ],
    useCases: [
      'Find mass when density and volume are known.',
      'Check science homework that rearranges density formulas.',
      'Estimate material mass before using a weight-force calculator.',
      'Compare density, mass, and volume relationships.',
    ],
    examples: [
      { label: 'Density sample', expression: '2.7 x 10', result: '27 mass units' },
      { label: 'Water-like', expression: '1 x 250', result: '250 mass units' },
      { label: 'Bulk material', expression: '1600 x 0.5', result: '800 mass units' },
    ],
    relatedSlugs: ['density-calculator', 'weight-calculator', 'volume-calculator'],
  }),
  makeUtilityTool({
    slug: 'weight-calculator',
    name: 'Weight Calculator',
    category: 'calculators',
    summary: 'Calculate weight force from mass and gravity in newtons and pounds-force.',
    description:
      'Use this free weight calculator to estimate weight force from mass in kilograms and gravity, with newtons, pounds-force, and mass pounds.',
    icon: 'calculator-weight',
    formula:
      'The calculator uses weight force = mass x gravity. Standard Earth gravity is about 9.80665 m/s2.',
    limit:
      'In everyday speech weight and mass are often mixed. This tool separates mass from weight force and should not replace safety-rated load calculations.',
    inputExplanations: [
      { term: 'Mass kg', meaning: 'the amount of matter in kilograms. Mass does not change just because gravity changes.' },
      { term: 'Gravity m/s2', meaning: 'the gravitational acceleration. Earth standard gravity is about 9.80665 m/s2.' },
      { term: 'Newtons', meaning: 'the SI force unit used for the main weight-force answer.' },
    ],
    extraFaq: [
      {
        question: 'Why is weight different from mass?',
        answer:
          'Mass is the amount of matter. Weight is the force gravity pulls on that mass. The same 70 kg mass has less weight force on the Moon because lunar gravity is smaller.',
      },
    ],
    useCases: [
      'Calculate force in newtons from mass and gravity.',
      'Compare Earth and Moon gravity examples.',
      'Convert weight force into pounds-force for context.',
      'Understand the difference between mass and weight force.',
    ],
    examples: [
      { label: 'Earth standard', expression: '70 kg x 9.80665 m/s2', result: '686.4655 N' },
      { label: 'Moon example', expression: '70 kg x 1.62 m/s2', result: '113.4 N' },
      { label: 'Small object', expression: '2.5 kg x 9.80665 m/s2', result: '24.516625 N' },
    ],
    relatedSlugs: ['mass-calculator', 'density-calculator', 'conversion-calculator'],
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
      'Use this free Base64 encode/decode tool to convert text to Base64 and decode Base64 text back into UTF-8 locally in your browser.',
    icon: 'calculator-base64',
    formula:
      'Base64 represents bytes using 64 printable characters and padding. This tool converts text to UTF-8 bytes before encoding and decodes valid UTF-8 after Base64 decoding.',
    limit:
      'Base64 is encoding, not encryption. Do not use it to hide secrets, passwords, tokens, or private data.',
    useCases: [
      'Encode a short text value into Base64.',
      'Decode a Base64 string back to readable text.',
      'Check API examples, headers, payloads, and data snippets.',
      'Work locally without sending the text to a server.',
    ],
    examples: [
      { label: 'Encode text', expression: 'Hello tools', result: 'SGVsbG8gdG9vbHM=' },
      { label: 'Decode text', expression: 'SGVsbG8gdG9vbHM=', result: 'Hello tools' },
      { label: 'Unicode text', expression: 'UTF-8 input', result: 'Base64 output with padding if needed' },
    ],
    relatedSlugs: ['url-encode-decode', 'password-generator', 'hex-calculator'],
  }),
  makeUtilityTool({
    slug: 'url-encode-decode',
    name: 'URL Encode / Decode',
    category: 'developer-tools',
    summary: 'Percent-encode URL component text or decode percent-encoded text.',
    description:
      'Use this free URL encode/decode tool to percent-encode query values or decode URL-encoded text, with optional plus-for-spaces handling.',
    icon: 'calculator-url',
    formula:
      'The tool uses percent-encoding for URL components: reserved characters become percent signs followed by two hexadecimal digits.',
    limit:
      'Encode complete URLs and individual URL components differently. This tool is best for component values such as query parameters.',
    useCases: [
      'Encode a query value that contains &, =, spaces, or punctuation.',
      'Decode percent-encoded text back into readable text.',
      'Handle plus signs as spaces for form-style values.',
      'Check developer examples locally in the browser.',
    ],
    examples: [
      { label: 'Encode query value', expression: 'price=10&tax=2', result: 'price%3D10%26tax%3D2' },
      { label: 'Decode query value', expression: 'price%3D10%26tax%3D2', result: 'price=10&tax=2' },
      { label: 'Form spaces', expression: 'hello tools', result: 'hello+tools when plus mode is on' },
    ],
    relatedSlugs: ['base64-encode-decode', 'subnet-calculator', 'hex-calculator'],
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
    summary: 'Estimate tile count from area, tile size, and waste percentage.',
    description:
      'Use this free tile calculator to estimate how many tiles you need from project square feet and tile dimensions.',
    icon: 'calculator-tile',
    formula:
      'The calculator converts tile length and width from square inches to square feet, adds waste to project area, then rounds up the tile count.',
    limit:
      'Real projects need layout planning, cuts, breakage, pattern matching, grout spacing, boxes, and product coverage checks.',
    inputExplanations: [
      { term: 'Area square feet', meaning: 'the floor or wall area you plan to cover before extra tile is added.' },
      { term: 'Tile length and width', meaning: 'the visible dimensions of one tile in inches.' },
      { term: 'Waste percent', meaning: 'extra tile for cuts, breakage, layout pattern, and future replacement pieces.' },
    ],
    useCases: [
      'Estimate floor or wall tile count.',
      'Add a waste percentage before buying.',
      'Compare tile sizes for the same room.',
      'Convert tile dimensions into square feet per tile.',
    ],
    examples: [
      { label: '12 inch tile', expression: '120 ft2, 12 x 12 in tile, 10% waste', result: '132 tiles' },
      { label: 'Large format tile', expression: '200 ft2, 12 x 24 in tile', result: 'Tile count estimate' },
      { label: 'Small wall tile', expression: '60 ft2, 6 x 6 in tile, 12% waste', result: 'Tile quantity estimate' },
    ],
    relatedSlugs: ['square-footage-calculator', 'area-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'mulch-calculator',
    name: 'Mulch Calculator',
    category: 'home-projects',
    summary: 'Estimate mulch cubic yards, cubic feet, and 2-cubic-foot bags from area and depth.',
    description:
      'Use this free mulch calculator to estimate bulk cubic yards or common bag counts from square feet, depth, and waste.',
    icon: 'calculator-mulch',
    formula:
      'The calculator converts depth from inches to feet, multiplies by area for cubic feet, adds waste, then divides by 27 for cubic yards.',
    limit:
      'Mulch settles and bag fill can vary. Bed shape, old mulch, slope, and desired finished depth affect real material needs.',
    inputExplanations: [
      { term: 'Area square feet', meaning: 'the garden or landscape bed area you want to cover.' },
      { term: 'Depth inches', meaning: 'the finished mulch depth after spreading.' },
      { term: 'Waste percent', meaning: 'extra mulch for settling, uneven beds, slopes, and spreading loss.' },
    ],
    useCases: [
      'Estimate mulch for a garden bed.',
      'Convert square feet and inches deep into cubic yards.',
      'Estimate common 2-cubic-foot bag count.',
      'Add a small waste buffer before buying.',
    ],
    examples: [
      { label: 'Garden bed', expression: '200 ft2 at 3 in, 5% extra', result: 'About 1.94 yd3' },
      { label: 'Refresh layer', expression: '150 ft2 at 2 in', result: 'Bulk and bag estimate' },
      { label: 'Large bed', expression: '500 ft2 at 2.5 in, 10% extra', result: 'Cubic yards and bags' },
    ],
    relatedSlugs: ['gravel-calculator', 'square-footage-calculator', 'volume-calculator'],
  }),
  makeUtilityTool({
    slug: 'gravel-calculator',
    name: 'Gravel Calculator',
    category: 'home-projects',
    summary: 'Estimate gravel cubic yards and tons from length, width, depth, and density.',
    description:
      'Use this free gravel calculator to estimate cubic yards and tons for a rectangular gravel area.',
    icon: 'calculator-gravel',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, divides by 27 for cubic yards, then multiplies by tons per cubic yard.',
    limit:
      'Stone type, compaction, moisture, supplier density, and delivery minimums can change the actual order amount.',
    inputExplanations: [
      { term: 'Length, width, and depth', meaning: 'the rectangular gravel area and average finished depth.' },
      { term: 'Tons per cubic yard', meaning: 'the supplier density used to convert volume into weight.' },
      { term: 'Tons result', meaning: 'a weight estimate; delivery minimums and compaction can still change the order.' },
    ],
    useCases: [
      'Estimate gravel for a path, pad, or driveway section.',
      'Convert cubic feet into cubic yards.',
      'Estimate tons from supplier density.',
      'Check how changing depth changes material needs.',
    ],
    examples: [
      { label: 'Driveway bed', expression: '20 ft x 10 ft x 3 in, 1.4 tons/yd3', result: 'Cubic yards and tons' },
      { label: 'Path', expression: '30 ft x 3 ft x 2 in', result: 'Material estimate' },
      { label: 'Parking pad', expression: '18 ft x 18 ft x 4 in, 1.5 tons/yd3', result: 'Bulk gravel estimate' },
    ],
    relatedSlugs: ['mulch-calculator', 'volume-calculator', 'square-footage-calculator'],
  }),
  makeUtilityTool({
    slug: 'paint-calculator',
    name: 'Paint Calculator',
    category: 'home-projects',
    summary: 'Estimate interior wall paint gallons from room size, openings, coats, coverage, and extra percent.',
    description:
      'Use this free paint calculator to estimate wall paint gallons from room dimensions, doors, windows, coats, coverage, and extra percent.',
    icon: 'calculator-paint',
    aliases: ['Wall Paint Calculator', 'Room Paint Calculator'],
    formula:
      'The calculator finds wall area from room perimeter and height, subtracts estimated doors and windows, multiplies by coats and extra percent, then divides by square-foot coverage per gallon.',
    limit:
      'Paint coverage depends on product, primer, surface texture, color change, application method, and how much paint remains in the can or tray.',
    inputExplanations: [
      { term: 'Coverage per gallon', meaning: 'the square feet one gallon covers for one coat according to the paint label.' },
      { term: 'Doors and windows', meaning: 'standard openings subtracted from the wall area before coats and extra paint are added.' },
      { term: 'Extra percent', meaning: 'extra paint for texture, roller and tray loss, touchups, and small measurement errors.' },
    ],
    extraFaq: [
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
    ],
    examples: [
      { label: 'Bedroom', expression: '12 x 10 x 8 ft, 1 door, 2 windows, 2 coats', result: 'Gallons to buy' },
      { label: 'Living room', expression: '18 x 14 x 9 ft, 2 doors, 3 windows, 2 coats', result: 'Paintable area and gallons' },
      { label: 'Accent wall planning', expression: '10 x 8 ft wall, 1 coat, 350 ft2/gal', result: 'Low paint estimate' },
    ],
    relatedSlugs: ['wallpaper-calculator', 'square-footage-calculator', 'drywall-calculator', 'tile-calculator'],
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
    icon: 'calculator-fence',
    formula:
      'The calculator subtracts gate width from total perimeter, divides the remaining run by panel width, estimates line posts from spacing, and adds two gate posts per gate.',
    limit:
      'Real fences need corner posts, end posts, bracing, slope handling, permits, setbacks, gate hardware, terrain checks, and local code review.',
    inputExplanations: [
      { term: 'Perimeter', meaning: 'the total fence path length before gate openings are removed.' },
      { term: 'Panel width', meaning: 'the width of one fence panel or bay.' },
      { term: 'Post spacing', meaning: 'the maximum distance between line posts.' },
      { term: 'Gate count and width', meaning: 'openings that reduce fence run and add gate posts.' },
    ],
    useCases: [
      'Estimate panels for a backyard fence.',
      'Plan post counts from a chosen spacing.',
      'Account for one or more gates.',
      'Compare 6-foot and 8-foot panel layouts.',
    ],
    examples: [
      { label: 'Backyard fence', expression: '120 ft perimeter, 8 ft panels, 1 gate', result: 'Panels and posts' },
      { label: 'Two gates', expression: '180 ft perimeter, 6 ft panels, 2 gates', result: 'Gate-adjusted estimate' },
      { label: 'Small side yard', expression: '48 ft run, 8 ft panels, no gate', result: 'Simple run count' },
    ],
    relatedSlugs: ['square-footage-calculator', 'distance-calculator', 'deck-cost-calculator'],
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
      'Use this free deck board calculator to estimate deck board count, joist fastener rows, screw count, and optional board cost from your deck size and board dimensions.',
    icon: 'calculator-deck-board',
    aliases: ['Decking Calculator', 'Deck Flooring Calculator', 'Decking Board Calculator'],
    formula:
      'The calculator finds deck area, adds waste, divides by one board coverage, rounds up to whole boards, then estimates fasteners from joist spacing.',
    limit:
      'Deck board counts can change with board gaps, breaker boards, picture frames, stair boards, diagonal layouts, hidden fastener systems, local code, and supplier stock lengths.',
    inputExplanations: [
      { term: 'Deck length and width', meaning: 'the rectangular deck surface area before waste is added.' },
      { term: 'Board length and width', meaning: 'the actual coverage of one board. Use actual face width, not only the nominal board name.' },
      { term: 'Joist spacing', meaning: 'the on-center distance between joists, used to estimate fastener rows.' },
      { term: 'Waste percent', meaning: 'extra boards for cuts, starter pieces, layout changes, and damaged boards.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Deck Board Calculator ask for actual board width?',
        answer:
          'Deck boards are often sold with a nominal size that is not the exact face width. The calculator needs the width that actually covers the deck surface because a small width difference can change the board count on a large deck.',
      },
      {
        question: 'What does the screw count mean?',
        answer:
          'The screw count is a planning estimate using two screws at each board-and-joist crossing. Hidden fasteners, clips, perimeter boards, stairs, blocking, and manufacturer instructions can change the real fastener list.',
      },
    ],
    useCases: [
      'Estimate deck boards for a simple rectangular deck.',
      'Compare 12-foot, 16-foot, and 20-foot board layouts.',
      'Plan a rough deck screw or hidden fastener count.',
      'Add a waste allowance before pricing boards.',
    ],
    examples: [
      { label: '16 x 12 deck', expression: '16 x 12 ft deck, 16 ft boards, 5.5 in width, 10% waste', result: '29 boards' },
      { label: 'Small landing', expression: '10 x 8 ft deck, 12 ft boards, 12% waste', result: 'Board estimate' },
      { label: 'Wide boards', expression: '20 x 14 ft deck, 7.25 in boards, 8% waste', result: 'Board and fastener rows' },
    ],
    relatedSlugs: ['deck-cost-calculator', 'board-foot-calculator', 'deck-stain-calculator'],
  }),
  makeUtilityTool({
    slug: 'deck-stain-calculator',
    name: 'Deck Stain Calculator',
    category: 'home-projects',
    summary: 'Estimate deck stain gallons from deck size, railings, steps, coat count, coverage, and waste.',
    description:
      'Use this free deck stain calculator to estimate stain gallons and optional cost from deck surface area, railing area, stairs, coats, label coverage, and waste.',
    icon: 'calculator-deck-stain',
    aliases: ['Deck Sealer Calculator', 'Deck Paint Calculator', 'Deck Stain Coverage Calculator'],
    formula:
      'The calculator adds deck surface, railing faces, and step area, adds waste, multiplies by coat count, divides by coverage per gallon, and rounds up to whole gallons.',
    limit:
      'Real stain coverage changes with wood age, roughness, previous finish, sprayer loss, rail details, board condition, weather, and the product label.',
    inputExplanations: [
      { term: 'Coverage per gallon', meaning: 'the square feet one gallon covers according to the stain product label.' },
      { term: 'Coats', meaning: 'how many full applications you plan to apply.' },
      { term: 'Railing area', meaning: 'railing length times height, counted on both sides for a rough coating estimate.' },
      { term: 'Waste percent', meaning: 'extra stain for edges, overlap, rough boards, drips, and touch-ups.' },
    ],
    extraFaq: [
      {
        question: 'Should I enter one coat or two coats?',
        answer:
          'Use the coat count from the stain label. Some products need one coat, some recommend two thin coats, and some warn against over-application. The calculator multiplies the surface area by your coat count.',
      },
      {
        question: 'Why can old wood need more stain?',
        answer:
          'Older or rough wood can absorb more finish than smooth new boards. If your deck is weathered, has railings, or has lots of edges, use a lower coverage number or a higher waste percent.',
      },
    ],
    useCases: [
      'Estimate gallons before staining a deck.',
      'Include railings and stairs in the surface area.',
      'Compare one-coat and two-coat products.',
      'Add price per gallon for a rough material cost.',
    ],
    examples: [
      { label: 'Deck with rails', expression: '16 x 12 ft deck, 40 ft railing, 4 steps, 2 coats', result: '6 gallons' },
      { label: 'Platform deck', expression: '12 x 10 ft deck, no railing, 1 coat', result: 'Stain gallons' },
      { label: 'Large rough deck', expression: '24 x 14 ft deck, 15% waste, 175 ft2/gallon', result: 'Whole gallons to buy' },
    ],
    relatedSlugs: ['deck-board-calculator', 'paint-calculator', 'deck-cost-calculator'],
  }),
  makeUtilityTool({
    slug: 'baluster-calculator',
    name: 'Baluster Calculator',
    category: 'home-projects',
    summary: 'Estimate railing baluster count and equal spacing from rail length, post width, baluster width, and max gap.',
    description:
      'Use this free baluster calculator to estimate how many balusters a rail opening needs and the actual equal spacing between them.',
    icon: 'calculator-baluster',
    aliases: ['Spindle Calculator', 'Railing Spacing Calculator', 'Baluster Spacing Calculator'],
    formula:
      'The calculator subtracts post widths from the rail run, fits balusters so each opening stays below the max spacing, and recalculates the equal open space.',
    limit:
      'Railing rules can be strict. Stair rails, guards, child-safety gaps, local code, post layout, and actual product dimensions need a real code check.',
    inputExplanations: [
      { term: 'Rail length', meaning: 'the full straight run you measured before subtracting posts.' },
      { term: 'Post width and count', meaning: 'post space that is removed from the clear opening.' },
      { term: 'Baluster width', meaning: 'the width of one spindle or picket.' },
      { term: 'Max spacing', meaning: 'the largest open gap you want between balusters.' },
    ],
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
    ],
    useCases: [
      'Plan balusters for one straight deck rail bay.',
      'Check equal spacing after post widths are removed.',
      'Compare wood, metal, or narrow baluster widths.',
      'Avoid gaps larger than the spacing you enter.',
    ],
    examples: [
      { label: 'Deck rail bay', expression: '10 ft rail, 2 posts, 1.5 in balusters, 4 in max gap', result: '20 balusters' },
      { label: 'Metal balusters', expression: '8 ft rail, 0.75 in balusters', result: 'Baluster count and spacing' },
      { label: 'Short stair rail', expression: '6 ft rail, 1.25 in balusters', result: 'Equal spacing estimate' },
    ],
    relatedSlugs: ['fence-calculator', 'deck-board-calculator', 'deck-cost-calculator'],
  }),
  makeUtilityTool({
    slug: 'paver-calculator',
    name: 'Paver Calculator',
    category: 'home-projects',
    summary: 'Estimate paver count from project area, paver dimensions, and waste percentage.',
    description:
      'Use this free paver calculator to estimate whole pavers from patio, path, or driveway area, paver size, and waste percentage.',
    icon: 'calculator-paver',
    aliases: ['Patio Paver Calculator', 'Paving Stone Calculator'],
    formula:
      'The calculator converts paver dimensions from square inches to square feet, adds waste to project area, then rounds up adjusted area divided by paver area.',
    limit:
      'Paver projects also need base material, bedding sand, joint sand, edging, cuts, pattern planning, compaction, and drainage checks.',
    inputExplanations: [
      { term: 'Project area', meaning: 'the patio, path, or driveway surface area before extra pavers are added.' },
      { term: 'Paver length and width', meaning: 'the visible dimensions of one paver in inches.' },
      { term: 'Waste percent', meaning: 'extra pavers for cuts, breakage, border pieces, and future replacement.' },
    ],
    useCases: [
      'Estimate paver count for a patio or walkway.',
      'Compare different paver sizes.',
      'Add waste for cuts and broken pieces.',
      'Prepare a rough count before checking box quantities.',
    ],
    examples: [
      { label: 'Patio pavers', expression: '180 ft2, 8 x 4 in pavers, 10% waste', result: 'Pavers needed' },
      { label: 'Large pavers', expression: '240 ft2, 12 x 12 in pavers, 8% waste', result: 'Lower piece count' },
      { label: 'Walkway', expression: '75 ft2, 6 x 9 in pavers, 12% waste', result: 'Path estimate' },
    ],
    relatedSlugs: ['sand-calculator', 'gravel-calculator', 'area-calculator'],
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
      'Use this free siding calculator to estimate exterior siding squares from wall square footage, door and window openings, waste, and optional price per square.',
    icon: 'calculator-siding',
    aliases: ['Siding Squares Calculator', 'Vinyl Siding Calculator'],
    formula:
      'The calculator subtracts openings from wall area, adds waste, divides by 100 square feet per siding square, and rounds up.',
    limit:
      'Siding projects also need gables, corners, starter strips, trim, channels, product exposure, color lots, installer layout, and local building review.',
    inputExplanations: [
      { term: 'Wall area', meaning: 'total exterior wall square footage before doors and windows are subtracted.' },
      { term: 'Doors/windows', meaning: 'the combined opening area removed before the siding waste allowance is added.' },
      { term: 'Siding square', meaning: 'a siding unit equal to 100 square feet of coverage.' },
      { term: 'Waste percent', meaning: 'extra siding for cuts, gables, corners, trim-heavy sections, and damaged pieces.' },
    ],
    useCases: [
      'Estimate vinyl, fiber cement, wood, or engineered siding squares.',
      'Convert wall square footage into 100-square-foot siding squares.',
      'Subtract doors and windows before adding waste.',
      'Add optional price per square for an early material estimate.',
    ],
    examples: [
      { label: 'Small exterior', expression: '1,200 ft2 wall area, 120 ft2 openings, 10% waste', result: '12 squares' },
      { label: 'One wall', expression: '240 ft2, 35 ft2 openings, 12% waste', result: 'Siding squares estimate' },
      { label: 'Budget check', expression: 'Add price per square', result: 'Estimated material cost' },
    ],
    relatedSlugs: ['paint-calculator', 'square-footage-calculator', 'roofing-calculator'],
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
    summary: 'Estimate CMU block count, courses, and blocks per course from wall size, openings, block size, and waste.',
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
      'Use this free rebar calculator to estimate a simple two-direction rebar grid from slab dimensions, bar spacing, stock bar length, and waste.',
    icon: 'calculator-rebar',
    aliases: ['Rebar Grid Calculator', 'Reinforcement Bar Calculator'],
    formula:
      'The calculator counts bars in both slab directions from spacing, totals linear feet, adds waste, divides by stock bar length, and rounds up.',
    limit:
      'This is a material takeoff, not structural design. Bar size, spacing, laps, cover, supports, edge distance, and code requirements need professional review.',
    inputExplanations: [
      { term: 'Slab length and width', meaning: 'the rectangular slab dimensions for the grid estimate.' },
      { term: 'Bar spacing', meaning: 'the distance between parallel bars; smaller spacing means more bars.' },
      { term: 'Stock bar length', meaning: 'the length of one purchased bar from the supplier.' },
      { term: 'Waste percent', meaning: 'extra length for cuts, lap planning, and small layout changes.' },
    ],
    useCases: [
      'Estimate stock rebar bars for a simple rectangular slab grid.',
      'Compare 12-inch, 18-inch, and 24-inch spacing.',
      'Add waste for cuts and lap planning.',
      'Plan a rough material list before professional review.',
    ],
    examples: [
      { label: '20 x 12 slab', expression: '20 x 12 ft, 18 in spacing, 20 ft stock bars, 10% waste', result: '20 bars' },
      { label: 'Garage pad', expression: '24 x 20 ft, 24 in spacing', result: 'Rebar grid estimate' },
      { label: 'Spacing comparison', expression: 'Change spacing and bar length', result: 'Linear feet and bar count' },
    ],
    relatedSlugs: ['concrete-calculator', 'concrete-block-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-mix-calculator',
    name: 'Concrete Mix Calculator',
    category: 'home-projects',
    summary: 'Estimate cement, sand, and gravel from concrete volume and a mix ratio.',
    description:
      'Use this free concrete mix calculator to estimate cement bags, sand, and gravel from cubic yards, mix ratio, bag yield, and waste percent.',
    icon: 'calculator-concrete-mix',
    aliases: ['Concrete Ratio Calculator', 'Cement Sand Gravel Calculator'],
    formula:
      'The calculator converts cubic yards to cubic feet, adds waste, splits the adjusted volume by the cement:sand:gravel ratio, and rounds cement bags up.',
    limit:
      'Concrete strength depends on water, aggregate, cement type, moisture, additives, curing, and code requirements. This is a rough material planning tool, not a mix design.',
    inputExplanations: [
      { term: 'Concrete volume', meaning: 'the final amount of concrete you want to make before waste is added.' },
      { term: 'Mix ratio', meaning: 'cement, sand, and gravel parts, such as 1:2:3.' },
      { term: 'Cement bag cubic feet', meaning: 'the approximate volume one cement bag contributes; use the bag or supplier label when available.' },
      { term: 'Waste percent', meaning: 'extra material for spillage, uneven measuring, and small batch losses.' },
    ],
    extraFaq: [
      {
        question: 'What does a 1:2:3 concrete mix mean?',
        answer:
          'It means 1 part cement, 2 parts sand, and 3 parts gravel by volume. The calculator uses those parts to split the total adjusted volume.',
      },
      {
        question: 'Can this guarantee concrete strength?',
        answer:
          'No. Strength depends on the actual mix design, water ratio, aggregate, curing, and product instructions. Use a specified mix for structural work.',
      },
    ],
    useCases: [
      'Plan cement, sand, and gravel for small concrete batches.',
      'Compare 1:2:3 and 1:2:4 style ratios.',
      'Add waste before buying bagged materials.',
      'Turn cubic yards into practical material quantities.',
    ],
    examples: [
      { label: '1:2:3 mix', expression: '1 yd3, 1:2:3 ratio, 10% waste', result: '5 cement-bag cubic feet plus sand and gravel' },
      { label: 'Small batch', expression: '0.25 yd3, 1:2:4 ratio', result: 'Split material estimate' },
      { label: 'Waste check', expression: 'Change waste from 5% to 10%', result: 'Updated material quantities' },
    ],
    relatedSlugs: ['concrete-calculator', 'concrete-footing-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-driveway-calculator',
    name: 'Concrete Driveway Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete volume, bags, and rough material cost for a driveway slab.',
    description:
      'Use this free concrete driveway calculator to estimate cubic yards, cubic feet, bag counts, and optional cost from driveway length, width, thickness, and waste.',
    icon: 'calculator-concrete-driveway',
    aliases: ['Driveway Concrete Calculator', 'Concrete Slab Driveway Calculator'],
    formula:
      'The calculator multiplies driveway length by width by thickness in feet, adds waste, converts cubic feet to cubic yards, and estimates bags and optional cost.',
    limit:
      'Driveways need the right subbase, thickness, reinforcement, joints, drainage, slope, soil preparation, and local code checks. This only estimates concrete quantity.',
    inputExplanations: [
      { term: 'Length and width', meaning: 'the driveway slab footprint in feet.' },
      { term: 'Thickness', meaning: 'average slab depth in inches.' },
      { term: 'Price per cubic yard', meaning: 'optional ready-mix price used for a rough material cost.' },
      { term: 'Waste percent', meaning: 'extra concrete for low spots, forms, spillage, and ordering cushion.' },
    ],
    extraFaq: [
      {
        question: 'Why does driveway thickness matter so much?',
        answer:
          'Volume changes directly with thickness. A 5-inch slab uses 25% more concrete than a 4-inch slab over the same driveway area.',
      },
      {
        question: 'Does the driveway estimate include gravel base or rebar?',
        answer:
          'No. It only estimates concrete volume and bags. Use separate tools for reinforcing mesh, rebar, gravel, or subbase planning.',
      },
    ],
    useCases: [
      'Estimate ready-mix concrete for driveway slabs.',
      'Compare 4-inch and 5-inch slab thickness.',
      'Add a waste cushion before pricing material.',
      'Get a rough cost from price per cubic yard.',
    ],
    examples: [
      { label: 'Single-car driveway', expression: '40 x 12 ft, 4 in thick, 10% waste', result: 'About 6.52 yd3' },
      { label: 'Two-car pad', expression: '30 x 20 ft, 5 in thick', result: 'Driveway volume estimate' },
      { label: 'Cost planning', expression: 'Enter price per cubic yard', result: 'Rough material cost' },
    ],
    relatedSlugs: ['concrete-calculator', 'concrete-reinforcing-mesh-calculator', 'concrete-weight-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-steps-calculator',
    name: 'Concrete Steps Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete volume and bag counts for solid stair steps.',
    description:
      'Use this free concrete steps calculator to estimate cubic yards and bag counts from step count, width, riser height, tread depth, optional landing, and waste.',
    icon: 'calculator-concrete-steps',
    aliases: ['Concrete Stair Calculator', 'Cement Steps Calculator'],
    formula:
      'The calculator models solid steps as stacked rectangular volumes, adds optional landing volume, applies waste, converts to cubic yards, and rounds bag counts up.',
    limit:
      'This assumes solid concrete steps. Footings, reinforcement, forms, nosing, hollow shapes, frost, slope, handrails, and building code can change real material needs.',
    inputExplanations: [
      { term: 'Step count', meaning: 'the number of risers in the solid stair shape.' },
      { term: 'Riser height', meaning: 'the vertical height of each step.' },
      { term: 'Tread depth', meaning: 'the front-to-back run of each tread.' },
      { term: 'Landing depth', meaning: 'optional top landing depth; enter 0 if there is no landing.' },
    ],
    extraFaq: [
      {
        question: 'Why does the calculator use stacked steps?',
        answer:
          'Solid concrete stairs can be estimated as stacked rectangular blocks. Each higher step includes the volume below it.',
      },
      {
        question: 'Can I use this for hollow formed steps?',
        answer:
          'Not directly. Hollow or filled forms need a different takeoff because only part of the stair shape is solid concrete.',
      },
    ],
    useCases: [
      'Estimate concrete for porch or garden steps.',
      'Include a simple top landing in the volume.',
      'Convert step dimensions to cubic yards.',
      'Compare different riser and tread layouts.',
    ],
    examples: [
      { label: 'Porch steps', expression: '4 steps, 4 ft wide, 7 in riser, 11 in tread, 3 ft landing', result: 'About 2.01 yd3' },
      { label: 'Garden steps', expression: '3 steps, 5 ft wide, no landing', result: 'Solid step volume estimate' },
      { label: 'Bag planning', expression: 'Add 10% waste', result: 'Rounded 60 lb and 80 lb bags' },
    ],
    relatedSlugs: ['stair-calculator', 'concrete-calculator', 'concrete-footing-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-weight-calculator',
    name: 'Concrete Weight Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete weight from cubic yards and density.',
    description:
      'Use this free concrete weight calculator to estimate pounds and US tons from concrete volume, density, and optional waste percent.',
    icon: 'calculator-concrete-weight',
    aliases: ['Concrete Density Calculator', 'Concrete Tons Calculator'],
    formula:
      'The calculator converts cubic yards to cubic feet, applies the waste allowance, multiplies by density in pounds per cubic foot, and converts pounds to US tons.',
    limit:
      'Concrete density varies by mix, aggregate, reinforcement, moisture, and air content. Use supplier data for hauling, disposal, or engineering decisions.',
    inputExplanations: [
      { term: 'Cubic yards', meaning: 'the concrete volume to weigh.' },
      { term: 'Density', meaning: 'pounds per cubic foot. Normal-weight concrete is often estimated near 145 to 150 lb/ft3.' },
      { term: 'Waste percent', meaning: 'optional extra volume if you want the weight after adding a cushion.' },
      { term: 'US tons', meaning: 'pounds divided by 2,000.' },
    ],
    extraFaq: [
      {
        question: 'What density should I use for concrete weight?',
        answer:
          'For rough planning, many people use about 145 to 150 lb/ft3 for normal-weight concrete. Use supplier data when weight matters.',
      },
      {
        question: 'Does this include rebar weight?',
        answer:
          'No. It estimates concrete material only. Use the Rebar Weight Calculator if you also need reinforcing steel weight.',
      },
    ],
    useCases: [
      'Estimate concrete weight for hauling or disposal planning.',
      'Convert cubic yards into pounds and tons.',
      'Compare density assumptions.',
      'Add waste volume before estimating weight.',
    ],
    examples: [
      { label: 'Normal concrete', expression: '2 yd3 at 145 lb/ft3', result: '7,830 lb' },
      { label: 'Heavy estimate', expression: '3.5 yd3 at 150 lb/ft3', result: 'Weight with cushion' },
      { label: 'Tonnage check', expression: 'Pounds divided by 2,000', result: 'US tons' },
    ],
    relatedSlugs: ['cubic-yard-calculator', 'concrete-calculator', 'asphalt-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-reinforcing-mesh-calculator',
    name: 'Concrete Mesh Calculator',
    category: 'home-projects',
    summary: 'Estimate reinforcing mesh sheets for a rectangular concrete slab.',
    description:
      'Use this free concrete reinforcing mesh calculator to estimate mesh sheet count from slab size, sheet size, overlap, and waste percent.',
    icon: 'calculator-concrete-mesh',
    aliases: ['Concrete Reinforcing Mesh Calculator', 'Wire Mesh Calculator', 'Reinforcement Mesh Calculator'],
    formula:
      'The calculator finds slab area, reduces sheet coverage by overlap, adds waste, divides adjusted area by effective sheet area, and rounds up.',
    limit:
      'This is an area takeoff only. Wire size, chair height, cover, lap length, placement, slab design, loads, and code requirements need project-specific review.',
    inputExplanations: [
      { term: 'Slab length and width', meaning: 'the rectangular slab area to cover.' },
      { term: 'Sheet size', meaning: 'the length and width of one mesh sheet or roll section.' },
      { term: 'Overlap', meaning: 'the amount sheets overlap, reducing usable coverage.' },
      { term: 'Waste percent', meaning: 'extra mesh for trimming, edge cuts, overlaps, and mistakes.' },
    ],
    extraFaq: [
      {
        question: 'Why does overlap reduce sheet coverage?',
        answer:
          'When two mesh sheets overlap, the overlapped strip does not cover new slab area. The calculator subtracts overlap from effective sheet dimensions.',
      },
      {
        question: 'Does this choose the right mesh size?',
        answer:
          'No. It only estimates sheet count. The right reinforcement depends on slab purpose, thickness, soil, load, and local code.',
      },
    ],
    useCases: [
      'Estimate mesh sheets for a slab or patio.',
      'Compare sheet sizes and overlap allowances.',
      'Add waste before buying mesh.',
      'Plan mesh alongside concrete volume.',
    ],
    examples: [
      { label: '30 x 20 slab', expression: '10 x 5 ft sheets, 6 in overlap, 10% waste', result: '16 sheets' },
      { label: 'Small patio', expression: '18 x 12 ft slab, 4 in overlap', result: 'Mesh sheet estimate' },
      { label: 'Overlap check', expression: 'Increase overlap', result: 'More sheets may be needed' },
    ],
    relatedSlugs: ['concrete-calculator', 'rebar-calculator', 'concrete-driveway-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-block-fill-calculator',
    name: 'Concrete Block Fill Calculator',
    category: 'home-projects',
    summary: 'Estimate grout or concrete fill volume for concrete block cores.',
    description:
      'Use this free concrete block fill calculator to estimate cubic yards and bag counts from block count, fill volume per block, and waste percent.',
    icon: 'calculator-concrete-block-fill',
    aliases: ['CMU Fill Calculator', 'Block Core Fill Calculator', 'Grout Fill Calculator'],
    formula:
      'The calculator multiplies block count by fill cubic feet per block, adds waste, converts to cubic yards, and rounds 60 lb and 80 lb bag counts up.',
    limit:
      'Actual fill depends on block core size, bond beams, rebar cells, grout mix, cleanouts, consolidation, spillage, and structural requirements.',
    inputExplanations: [
      { term: 'Block count', meaning: 'how many block cores you plan to fill.' },
      { term: 'Fill per block', meaning: 'the cubic feet of grout or concrete needed per block.' },
      { term: 'Waste percent', meaning: 'extra fill for spillage, overfilled cores, and measurement differences.' },
      { term: 'Bag counts', meaning: 'rounded estimates using common dry-mix bag yields.' },
    ],
    extraFaq: [
      {
        question: 'What is fill cubic feet per block?',
        answer:
          'It is the approximate grout or concrete volume needed to fill one block. Different block sizes and core shapes can need different amounts.',
      },
      {
        question: 'Does this include mortar between blocks?',
        answer:
          'No. It only estimates core fill. Mortar joints, bond beams, reinforcing steel, and footing concrete need separate estimates.',
      },
    ],
    useCases: [
      'Estimate fill for reinforced block cells.',
      'Convert block fill volume to cubic yards.',
      'Plan bag counts for small masonry jobs.',
      'Add waste before ordering grout or concrete.',
    ],
    examples: [
      { label: '120 filled blocks', expression: '0.25 ft3 per block, 10% waste', result: 'About 1.22 yd3' },
      { label: 'Small wall fill', expression: '64 blocks, 0.22 ft3 each', result: 'Fill volume estimate' },
      { label: 'Bag planning', expression: 'Fill volume divided by bag yield', result: 'Rounded bag counts' },
    ],
    relatedSlugs: ['concrete-block-calculator', 'concrete-calculator', 'retaining-wall-calculator'],
  }),
  makeUtilityTool({
    slug: 'retaining-wall-calculator',
    name: 'Retaining Wall Calculator',
    category: 'home-projects',
    summary: 'Estimate retaining wall blocks, cap blocks, courses, and base gravel.',
    description:
      'Use this free retaining wall calculator to estimate wall blocks, cap blocks, courses, and base gravel volume from wall and block dimensions.',
    icon: 'calculator-retaining-wall',
    aliases: ['Landscape Wall Calculator', 'Block Retaining Wall Calculator'],
    formula:
      'The calculator divides wall height by block height for courses, divides wall length by block length for blocks per course, adds waste, estimates cap blocks, and finds base trench volume.',
    limit:
      'Retaining walls can fail if drainage, soil, surcharge, setbacks, geogrid, base prep, frost, height limits, and permits are ignored. This is only a material estimate.',
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the finished face size of the retaining wall.' },
      { term: 'Block size', meaning: 'the face length and height of one wall block.' },
      { term: 'Cap length', meaning: 'the length of one cap block along the top of the wall.' },
      { term: 'Base depth and width', meaning: 'the gravel trench dimensions used for the base estimate.' },
    ],
    extraFaq: [
      {
        question: 'Why does a retaining wall need a base gravel estimate?',
        answer:
          'Segmental retaining walls usually sit on a compacted base. The calculator estimates the base trench volume so you can plan material separately from wall blocks.',
      },
      {
        question: 'Can this design a safe retaining wall?',
        answer:
          'No. It only counts materials. Drainage, soil pressure, wall height, geogrid, surcharge loads, and local rules need proper design.',
      },
    ],
    useCases: [
      'Estimate block count for landscape retaining walls.',
      'Plan cap blocks for the top course.',
      'Estimate gravel base volume.',
      'Compare block sizes before buying material.',
    ],
    examples: [
      { label: 'Garden wall', expression: '40 ft long, 3 ft high, 16 x 6 in blocks, 5% waste', result: '189 wall blocks' },
      { label: 'Short wall', expression: '24 ft long, 2 ft high', result: 'Blocks, caps, and base' },
      { label: 'Base trench', expression: '18 in wide, 6 in deep', result: 'Cubic yards of base gravel' },
    ],
    relatedSlugs: ['concrete-block-calculator', 'paver-calculator', 'gravel-calculator'],
  }),
  makeUtilityTool({
    slug: 'rebar-weight-calculator',
    name: 'Rebar Weight Calculator',
    category: 'home-projects',
    summary: 'Estimate rebar weight from bar size, length, quantity, and waste.',
    description:
      'Use this free rebar weight calculator to estimate pounds, tons, adjusted length, and weight per foot for common US rebar sizes.',
    icon: 'calculator-rebar-weight',
    aliases: ['Rebar Weight Per Foot Calculator', 'Reinforcing Bar Weight Calculator'],
    formula:
      'The calculator multiplies length by quantity, adds waste, selects the nominal weight per foot for the rebar size, and converts total pounds to US tons.',
    limit:
      'Nominal weights are planning values. Mill tolerances, coatings, cut lists, laps, supports, bundles, and structural design can change the real order.',
    inputExplanations: [
      { term: 'Rebar size', meaning: 'the US bar size, such as #4, used to choose nominal weight per foot.' },
      { term: 'Length per bar', meaning: 'the length of one bar or cut piece.' },
      { term: 'Quantity', meaning: 'how many bars or pieces at that length.' },
      { term: 'Waste percent', meaning: 'extra length for cuts, laps, layout changes, and damaged pieces.' },
    ],
    extraFaq: [
      {
        question: 'What does #4 rebar mean?',
        answer:
          '#4 is a common US rebar size with a nominal diameter of about 1/2 inch and a planning weight of about 0.668 lb per foot.',
      },
      {
        question: 'Is rebar weight the same as rebar design?',
        answer:
          'No. Weight helps with ordering and hauling. Bar size, spacing, lap length, cover, and placement still need project-specific design.',
      },
    ],
    useCases: [
      'Estimate rebar weight for pickup or delivery planning.',
      'Compare #3, #4, #5, and larger bars.',
      'Add waste for cut lists and lap planning.',
      'Convert total pounds to US tons.',
    ],
    examples: [
      { label: '#4 slab bars', expression: '12 bars, 20 ft each, 10% waste', result: '176.352 lb' },
      { label: '#5 footing bars', expression: '8 bars, 30 ft each', result: 'Rebar weight estimate' },
      { label: 'Waste check', expression: 'Increase waste percent', result: 'Adjusted length and weight' },
    ],
    relatedSlugs: ['rebar-calculator', 'concrete-reinforcing-mesh-calculator', 'concrete-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-footing-calculator',
    name: 'Concrete Footing Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete volume and bag counts for straight rectangular footings.',
    description:
      'Use this free concrete footing calculator to estimate cubic feet, cubic yards, and common concrete bag counts from footing length, width, depth, and waste.',
    icon: 'calculator-concrete-footing',
    aliases: ['Footing Concrete Calculator', 'Foundation Footing Calculator'],
    formula:
      'The calculator converts footing width and depth from inches to feet, multiplies length by width by depth, adds waste, converts cubic feet to cubic yards, and rounds bag counts up.',
    limit:
      'Footing dimensions are structural decisions. Soil bearing, frost depth, reinforcement, drainage, inspections, and local code can change the real footing design.',
    inputExplanations: [
      { term: 'Footing length', meaning: 'the total straight run of the footing in feet.' },
      { term: 'Width and depth', meaning: 'the footing cross-section in inches.' },
      { term: 'Waste percent', meaning: 'extra concrete for uneven trenches, spillage, and a small ordering cushion.' },
      { term: 'Bag counts', meaning: 'rounded estimates based on common dry-mix bag yields, useful for small jobs.' },
    ],
    extraFaq: [
      {
        question: 'Why does the Concrete Footing Calculator show both cubic yards and bags?',
        answer:
          'Cubic yards are useful for ready-mix orders, while 60 lb and 80 lb bag counts are useful for smaller hand-mixed projects. Large footings are usually better handled with a concrete supplier or contractor.',
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
    ],
    examples: [
      { label: 'Garage footing run', expression: '30 ft long, 16 in wide, 8 in deep, 10% waste', result: 'About 1.09 cubic yards' },
      { label: 'Garden wall footing', expression: '18 ft long, 12 in wide, 8 in deep, 8% waste', result: 'Concrete and bag estimate' },
      { label: 'Small repair footing', expression: '8 ft long, 10 in wide, 6 in deep', result: 'Small-volume estimate' },
    ],
    relatedSlugs: ['concrete-calculator', 'rebar-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-column-calculator',
    name: 'Concrete Column Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete for round columns, piers, and tube forms.',
    description:
      'Use this free concrete column calculator to estimate cubic feet, cubic yards, and bag counts for round concrete columns or piers.',
    icon: 'calculator-concrete-column',
    aliases: ['Concrete Pier Calculator', 'Sonotube Concrete Calculator', 'Round Column Concrete Calculator'],
    formula:
      'The calculator converts diameter to a radius in feet, uses pi times radius squared times height, multiplies by quantity, adds waste, and rounds bag counts up.',
    limit:
      'This is volume math only. Footing bells, reinforcement, anchors, structural loads, form size, and code rules can change real material needs.',
    inputExplanations: [
      { term: 'Diameter', meaning: 'the inside diameter of the round form or pier in inches.' },
      { term: 'Height', meaning: 'the filled concrete height in feet.' },
      { term: 'Quantity', meaning: 'how many matching round columns or piers are included.' },
      { term: 'Waste percent', meaning: 'extra concrete for form variation, spillage, and ordering cushion.' },
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
    ],
    useCases: [
      'Estimate concrete for round tube forms.',
      'Compare 12-inch, 16-inch, and 18-inch pier sizes.',
      'Plan bag counts for small column pours.',
      'Add waste before pricing ready-mix or bagged concrete.',
    ],
    examples: [
      { label: 'Three round piers', expression: '18 in diameter, 8 ft high, 3 columns, 10% waste', result: 'About 1.73 cubic yards' },
      { label: 'Porch column bases', expression: '12 in diameter, 3 ft high, 4 columns', result: 'Bag count estimate' },
      { label: 'Deck support tubes', expression: '10 in diameter, 4 ft high, 6 tubes', result: 'Round concrete volume' },
    ],
    relatedSlugs: ['concrete-footing-calculator', 'concrete-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'post-hole-concrete-calculator',
    name: 'Post Hole Concrete Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete bag counts for fence, deck, and mailbox post holes.',
    description:
      'Use this free post hole concrete calculator to estimate concrete volume and bag counts from hole diameter, hole depth, post diameter, quantity, and waste.',
    icon: 'calculator-post-hole-concrete',
    aliases: ['Fence Post Concrete Calculator', 'Post Hole Calculator'],
    formula:
      'The calculator finds the round hole volume, subtracts the round post volume inside the hole, multiplies by the number of holes, adds waste, and rounds bag counts up.',
    limit:
      'Post depth, hole width, gravel base, frost depth, uplift, gate loads, deck loads, and local code can change what you actually need.',
    inputExplanations: [
      { term: 'Hole diameter', meaning: 'the width across the round hole in inches.' },
      { term: 'Hole depth', meaning: 'the filled depth in inches.' },
      { term: 'Post diameter', meaning: 'the width of the post that takes up space inside the hole.' },
      { term: 'Quantity', meaning: 'how many matching holes to estimate.' },
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
    ],
    useCases: [
      'Estimate concrete bags for fence posts.',
      'Plan concrete for deck support holes.',
      'Subtract post volume from round hole volume.',
      'Compare hole sizes before buying concrete.',
    ],
    examples: [
      { label: 'Fence posts', expression: '12 in hole, 30 in deep, 4 in post, 6 holes, 10% waste', result: 'About 20 eighty-pound bags' },
      { label: 'Deck posts', expression: '14 in hole, 36 in deep, 6 in post, 4 holes', result: 'Post concrete estimate' },
      { label: 'Mailbox post', expression: '10 in hole, 24 in deep, 4 in post', result: 'Small bag estimate' },
    ],
    relatedSlugs: ['fence-calculator', 'concrete-footing-calculator', 'concrete-calculator'],
  }),
  makeUtilityTool({
    slug: 'plywood-calculator',
    name: 'Plywood Calculator',
    category: 'home-projects',
    summary: 'Estimate plywood sheet count, coverage, waste, and optional cost.',
    description:
      'Use this free plywood calculator to estimate how many sheets to buy from project area, sheet size, waste percent, and optional price per sheet.',
    icon: 'calculator-plywood',
    aliases: ['Sheet Goods Calculator', 'Plywood Sheet Calculator'],
    formula:
      'The calculator multiplies sheet width by sheet length for sheet coverage, adds waste to the project area, divides adjusted area by sheet coverage, and rounds up.',
    limit:
      'Panel direction, seams, joist spacing, fastener rules, thickness, grade, subfloor code, and cut layout can change the final sheet count.',
    inputExplanations: [
      { term: 'Area', meaning: 'the total square feet you want to cover before waste.' },
      { term: 'Sheet width and length', meaning: 'the actual sheet size in feet, commonly 4 by 8.' },
      { term: 'Waste percent', meaning: 'extra sheet area for cuts, layout, mistakes, and damaged edges.' },
      { term: 'Price per sheet', meaning: 'optional cost input used only for a rough material price.' },
    ],
    extraFaq: [
      {
        question: 'Does plywood sheet count include the best cut layout?',
        answer:
          'No. It estimates sheets by area. Real layouts need seams on framing, grain direction, panel orientation, and leftover pieces checked before buying.',
      },
      {
        question: 'Should I enter nominal or actual sheet size?',
        answer:
          'Use the size printed for the sheet you will buy. Most full sheets are 4 by 8 feet, but project panels and specialty goods can be different.',
      },
    ],
    useCases: [
      'Estimate plywood sheets for subfloor or sheathing.',
      'Compare 4x8 sheets with smaller project panels.',
      'Add waste for cuts and layout.',
      'Estimate rough sheet cost before shopping.',
    ],
    examples: [
      { label: 'Subfloor sheets', expression: '420 ft2, 4 x 8 ft sheets, 10% waste', result: '15 sheets' },
      { label: 'Small wall sheathing', expression: '180 ft2, 12% waste', result: 'Sheet estimate' },
      { label: 'Project panels', expression: '96 ft2, 2 x 4 ft panels', result: 'Panel count' },
    ],
    relatedSlugs: ['square-footage-calculator', 'flooring-calculator', 'wall-stud-calculator'],
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
    description:
      'Use this free countertop calculator to estimate countertop area from run length, depth, backsplash, cutouts, waste, and optional price per square foot.',
    icon: 'calculator-countertop',
    aliases: ['Countertop Square Foot Calculator', 'Kitchen Countertop Calculator'],
    formula:
      'The calculator converts depth and backsplash height to feet, finds top area plus backsplash area, subtracts cutouts, adds waste, and multiplies by price when entered.',
    limit:
      'Real quotes can change for slab layout, seams, sink type, cutouts, edge profile, overhangs, templating, fabrication, install labor, and delivery.',
    inputExplanations: [
      { term: 'Length', meaning: 'the total countertop run length in feet.' },
      { term: 'Depth', meaning: 'front-to-back countertop depth in inches.' },
      { term: 'Backsplash', meaning: 'optional backsplash length and height added to the square footage.' },
      { term: 'Cutouts', meaning: 'sink or cooktop areas subtracted before waste when you know them.' },
    ],
    extraFaq: [
      {
        question: 'Should I subtract sink and cooktop cutouts?',
        answer:
          'Only subtract them for a rough material area check. Many fabricators still charge for cutout work, templates, and the slab waste around the opening.',
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
      'Compare rough cost at different material prices.',
    ],
    examples: [
      { label: 'Kitchen run', expression: '18 ft run, 25.5 in depth, 4 in backsplash, 10% waste', result: 'About 44.28 ft2' },
      { label: 'Bathroom vanity', expression: '6 ft run, 22 in depth, small sink cutout', result: 'Vanity area estimate' },
      { label: 'No backsplash', expression: '12 ft run, 25 in depth, 0 backsplash', result: 'Top-only square feet' },
    ],
    relatedSlugs: ['square-footage-calculator', 'tile-calculator', 'unit-price-calculator'],
  }),
  makeUtilityTool({
    slug: 'sod-calculator',
    name: 'Sod Calculator',
    category: 'home-projects',
    summary: 'Estimate sod rolls, pallets, adjusted area, and optional cost.',
    description:
      'Use this free sod calculator to estimate rolls or slabs of sod from lawn area, coverage per roll, rolls per pallet, waste, and optional price.',
    icon: 'calculator-sod',
    aliases: ['Grass Sod Calculator', 'Lawn Sod Calculator'],
    formula:
      'The calculator adds waste to lawn area, divides by coverage per roll or slab, rounds up to whole rolls, and then rounds pallets up from rolls per pallet.',
    limit:
      'Curves, slopes, damaged sod, soil prep, irrigation, seams, supplier roll sizes, pallet minimums, and delivery rules can change the final order.',
    inputExplanations: [
      { term: 'Lawn area', meaning: 'the measured square feet you want to cover.' },
      { term: 'Coverage per roll', meaning: 'the square feet one roll, slab, or piece covers.' },
      { term: 'Rolls per pallet', meaning: 'supplier packaging used to estimate pallet count.' },
      { term: 'Waste percent', meaning: 'extra sod for curved edges, trimming, damaged pieces, and small repairs.' },
    ],
    extraFaq: [
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
    ],
    useCases: [
      'Estimate sod rolls for a new lawn.',
      'Convert lawn square footage into pallets.',
      'Add waste for curved and trimmed areas.',
      'Estimate rough sod material cost.',
    ],
    examples: [
      { label: 'Front lawn', expression: '1,800 ft2, 10 ft2 per roll, 50 rolls per pallet, 5% waste', result: '189 rolls, 4 pallets' },
      { label: 'Repair patch', expression: '220 ft2, 10 ft2 per roll, 8% waste', result: 'Small roll count' },
      { label: 'Backyard section', expression: '3,200 ft2, pallet packaging', result: 'Pallet estimate' },
    ],
    relatedSlugs: ['square-footage-calculator', 'soil-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'wall-stud-calculator',
    name: 'Wall Stud Calculator',
    category: 'home-projects',
    summary: 'Estimate wall studs, plate pieces, and framing board count from wall layout.',
    description:
      'Use this free wall stud calculator to estimate layout studs, extra opening studs, plate pieces, waste, and total boards for a simple wall.',
    icon: 'calculator-wall-stud',
    aliases: ['Stud Calculator', 'Framing Stud Calculator'],
    formula:
      'The calculator counts studs from wall length and on-center spacing, adds two studs per opening plus extra corner studs, adds waste, then adds plate pieces from wall length and board length.',
    limit:
      'This is a rough material count. Headers, jack studs, king studs, fire blocking, sheathing, bracing, loads, treated plates, and code rules need a real framing plan.',
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the planned wall size in feet.' },
      { term: 'Stud spacing', meaning: 'on-center spacing, commonly 16 or 24 inches.' },
      { term: 'Openings', meaning: 'door or window openings; the tool adds two extra studs per opening as a simple allowance.' },
      { term: 'Plate rows', meaning: 'horizontal top and bottom runs along the wall, often 2 or 3 rows.' },
    ],
    extraFaq: [
      {
        question: 'What does on-center spacing mean?',
        answer:
          'On-center spacing is the distance from the center of one stud to the center of the next stud. A 16-inch layout means each stud center is about 16 inches apart.',
      },
      {
        question: 'Does this include headers for doors and windows?',
        answer:
          'No. It only adds a simple extra-stud allowance around openings. Header sizes, jack studs, king studs, and structural details depend on the wall design and code.',
      },
    ],
    useCases: [
      'Estimate studs for a simple interior wall.',
      'Compare 16-inch and 24-inch on-center spacing.',
      'Add plate pieces to vertical stud count.',
      'Add waste before buying framing boards.',
    ],
    examples: [
      { label: 'Interior wall', expression: '24 ft wall, 8 ft high, 16 in spacing, 2 openings, 10% waste', result: '36 boards' },
      { label: 'Garage wall', expression: '32 ft wall, 9 ft high, 16 in spacing, 3 plate rows', result: 'Stud and plate estimate' },
      { label: 'Short partition', expression: '10 ft wall, 8 ft high, no openings', result: 'Small wall count' },
    ],
    relatedSlugs: ['drywall-calculator', 'board-foot-calculator', 'square-footage-calculator'],
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
    description:
      'Use this free pool volume calculator to estimate U.S. gallons for rectangular, round, or oval pools from simple measurements.',
    icon: 'calculator-pool',
    formula:
      'The calculator estimates pool cubic feet from the selected shape and average depth, then multiplies cubic feet by 7.48052 gallons per cubic foot.',
    limit:
      'Sloped bottoms, steps, benches, freeform shapes, rounded corners, waterline height, and measurement error can change real pool volume.',
    inputExplanations: [
      { term: 'Pool shape', meaning: 'the simple shape used for the volume formula: rectangle, round, or oval.' },
      { term: 'Length or diameter', meaning: 'the long measurement for rectangles and ovals, or the diameter for round pools.' },
      { term: 'Average depth', meaning: 'the average water depth, useful when the shallow and deep ends differ.' },
    ],
    useCases: [
      'Estimate gallons before adding pool chemicals.',
      'Compare rectangular, round, and oval pool volume.',
      'Use average depth for shallow and deep ends.',
      'Plan fill volume or rough equipment context.',
    ],
    examples: [
      { label: 'Rectangle pool', expression: '24 ft x 12 ft x 4.5 ft average depth', result: 'Gallons estimate' },
      { label: 'Round pool', expression: '18 ft diameter, 4 ft depth', result: 'Circular pool gallons' },
      { label: 'Oval pool', expression: '30 ft x 15 ft x 4.3 ft average depth', result: 'Oval volume estimate' },
    ],
    relatedSlugs: ['volume-calculator', 'conversion-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'sand-calculator',
    name: 'Sand Calculator',
    category: 'home-projects',
    summary: 'Estimate sand cubic yards and tons from length, width, depth, density, and waste.',
    description:
      'Use this free sand calculator to estimate cubic yards, cubic feet, and tons for sand beds, leveling layers, and small projects.',
    icon: 'calculator-sand',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, adds waste, divides by 27 for cubic yards, and multiplies by tons per cubic yard.',
    limit:
      'Sand density changes with moisture, material type, compaction, and supplier measurement. Ask your supplier for the best tons-per-yard value.',
    inputExplanations: [
      { term: 'Depth', meaning: 'the average sand depth in inches.' },
      { term: 'Tons per cubic yard', meaning: 'the supplier density used to turn volume into weight.' },
      { term: 'Waste percent', meaning: 'extra sand for leveling, spreading loss, compaction, and uneven areas.' },
    ],
    useCases: [
      'Estimate sand for paver bedding or leveling.',
      'Estimate sand volume for a sandbox or small base layer.',
      'Convert cubic yards into estimated tons.',
      'Compare different depth assumptions.',
    ],
    examples: [
      { label: 'Leveling sand', expression: '20 ft x 10 ft x 2 in, 1.35 tons/yd3', result: 'Yards and tons' },
      { label: 'Sandbox', expression: '8 ft x 6 ft x 8 in, 1.25 tons/yd3', result: 'Fill estimate' },
      { label: 'Path base', expression: '30 ft x 3 ft x 1 in', result: 'Small layer estimate' },
    ],
    relatedSlugs: ['paver-calculator', 'gravel-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'soil-calculator',
    name: 'Soil Calculator',
    category: 'home-projects',
    summary: 'Estimate soil cubic yards, cubic feet, and common bag counts from area and depth.',
    description:
      'Use this free soil calculator to estimate garden soil volume and bag counts from square feet, depth in inches, and extra percent.',
    icon: 'calculator-soil',
    aliases: ['Garden Soil Calculator', 'Topsoil Calculator'],
    formula:
      'The calculator converts depth from inches to feet, multiplies by area, adds extra percent, divides by 27 for cubic yards, and estimates common bag counts.',
    limit:
      'Soil settles and bag fill varies. Existing bed depth, compost mix, moisture, raised bed shape, and plant needs can change the amount to buy.',
    inputExplanations: [
      { term: 'Bed area', meaning: 'the square footage of the garden bed, raised bed, or lawn patch.' },
      { term: 'Soil depth', meaning: 'how many inches of soil you want to add.' },
      { term: 'Extra percent', meaning: 'extra soil for settling, uneven beds, and spreading loss.' },
    ],
    useCases: [
      'Estimate soil for raised beds or garden top-offs.',
      'Convert square feet and inches deep into cubic yards.',
      'Estimate 1.5-cubic-foot and 2-cubic-foot bag counts.',
      'Add extra percent for settling or uneven beds.',
    ],
    examples: [
      { label: 'Raised bed top-off', expression: '120 ft2 at 4 in, 10% extra', result: 'Cubic yards and bags' },
      { label: 'Small garden', expression: '48 ft2 at 6 in, 5% extra', result: 'Bag count estimate' },
      { label: 'Thin topdress', expression: '300 ft2 at 1 in', result: 'Low-depth soil estimate' },
    ],
    relatedSlugs: ['mulch-calculator', 'cubic-yard-calculator', 'area-calculator'],
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
    icon: 'calculator-bandwidth',
    formula:
      'The calculator converts data size to bits, converts speed to bits per second, then divides bits by bits per second for transfer time.',
    limit:
      'Real transfer time depends on Wi-Fi, server speed, congestion, overhead, protocol limits, and whether units are decimal or binary.',
    useCases: [
      'Estimate download or upload time.',
      'Compare file sizes against connection speed.',
      'Convert seconds into minutes and hours.',
      'Plan rough transfer windows for large files.',
    ],
    examples: [
      { label: 'Large download', expression: '5 GB at 100 Mbps', result: 'About 6m 40s' },
      { label: 'Medium file', expression: '700 MB at 25 Mbps', result: 'Transfer time estimate' },
      { label: 'Backup upload', expression: '50 GB at 20 Mbps', result: 'Long transfer estimate' },
    ],
    relatedSlugs: ['subnet-calculator', 'base64-encode-decode', 'url-encode-decode'],
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
    formula:
      'The tool encodes text as UTF-8 bytes, passes those bytes to browser SubtleCrypto for the selected SHA-2 digest, and formats digest bytes as hex.',
    limit:
      'A hash is not encryption. Do not use a raw digest as a password storage design, signature system, or proof of authenticity.',
    useCases: [
      'Create a quick SHA-256 digest for a text sample.',
      'Compare whether two pasted text values produce the same digest.',
      'Generate SHA-384 or SHA-512 outputs for learning and debugging.',
      'Keep small text hashing local in the browser.',
    ],
    examples: [
      { label: 'SHA-256 text', expression: 'Access Free Tools', result: '64-character hex digest' },
      { label: 'SHA-384 note', expression: 'browser utility', result: '96-character hex digest' },
      { label: 'SHA-512 phrase', expression: 'local hash example', result: '128-character hex digest' },
    ],
    relatedSlugs: ['uuid-generator', 'password-generator', 'json-formatter'],
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
    formula:
      'Date mode counts seconds and milliseconds since 1970-01-01T00:00:00Z. Timestamp mode reverses that count back to UTC date and time.',
    limit:
      'The converter uses UTC on purpose. Local time zones, daylight saving time, and application storage rules can change how a timestamp appears elsewhere.',
    useCases: [
      'Convert a UTC date and time into Unix seconds for logs or APIs.',
      'Convert Unix seconds or milliseconds into an ISO UTC timestamp.',
      'Check whether a timestamp is seconds or milliseconds.',
      'Compare date-time values without local time-zone ambiguity.',
    ],
    examples: [
      { label: 'Date to seconds', expression: '2026-04-30 12:00 UTC', result: 'Unix seconds' },
      { label: 'Milliseconds', expression: '1777464000000 ms', result: 'UTC ISO date-time' },
      { label: 'Unix epoch', expression: '0 seconds', result: '1970-01-01T00:00:00Z' },
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
    formula:
      'The checker converts hex colors to sRGB, calculates relative luminance, then uses the WCAG contrast formula: (lighter + 0.05) / (darker + 0.05).',
    limit:
      'Contrast ratio is one accessibility check. Also review font size, focus states, hover states, icons, disabled controls, and real page context.',
    useCases: [
      'Check text color against a page background before publishing.',
      'Compare brand colors against WCAG AA and AAA thresholds.',
      'Test button, label, and navigation color pairs.',
      'Quickly reject low-contrast combinations during design work.',
    ],
    examples: [
      { label: 'Dark on white', expression: '#101828 on #ffffff', result: 'High contrast ratio' },
      { label: 'Muted text', expression: '#667085 on #f9fafb', result: 'AA pass/fail check' },
      { label: 'Brand color', expression: '#0f766e on #ecfeff', result: 'Contrast ratio' },
    ],
    relatedSlugs: ['aspect-ratio-calculator', 'text-case-converter', 'word-counter'],
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
    formula:
      'The calculator divides width and height by their greatest common divisor for the ratio, then scales the missing dimension from the same width-to-height relationship.',
    limit:
      'Use the exact upload specs for platforms, products, and print jobs. Rounding a scaled dimension can cause a one-pixel difference.',
    useCases: [
      'Simplify image, video, thumbnail, and screenshot dimensions.',
      'Resize a design to a new width while preserving height proportion.',
      'Resize a design to a new height while preserving width proportion.',
      'Compare landscape, square, and portrait formats before exporting.',
    ],
    examples: [
      { label: 'HD video', expression: '1920 x 1080', result: '16:9' },
      { label: 'Square post', expression: '1080 x 1080', result: '1:1' },
      { label: 'Scale width', expression: '1920 x 1080 to 1280 wide', result: '1280 x 720' },
    ],
    relatedSlugs: ['color-contrast-checker', 'square-footage-calculator', 'conversion-calculator'],
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
    formula:
      'The builder validates the base URL, keeps existing query parameters, then sets utm_source, utm_medium, utm_campaign, and optional UTM fields.',
    limit:
      'UTM links only help analytics when the destination site is configured to collect campaign data and your team uses consistent naming rules.',
    useCases: [
      'Create campaign links for newsletters, social posts, partner links, and launch announcements.',
      'Keep source, medium, and campaign names consistent before sharing a URL.',
      'Add content or term values when two links point to the same page.',
      'Copy one finished URL instead of hand-editing query parameters.',
    ],
    examples: [
      { label: 'Newsletter link', expression: 'source newsletter, medium email, campaign spring-tools', result: 'URL with UTM parameters' },
      { label: 'Social profile link', expression: 'source instagram, medium social, campaign calculator-tips', result: 'Tracked social URL' },
      { label: 'Search campaign', expression: 'source google, medium cpc, campaign utility-tools', result: 'Campaign URL with term field' },
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
    formula:
      'Parse mode extracts the query part and reads it with URLSearchParams. Build mode appends each key-value line with URLSearchParams encoding.',
    limit:
      'Query strings can be logged, shared, or indexed. Do not place passwords, private tokens, or sensitive identifiers in public URLs.',
    useCases: [
      'Decode URL parameters while debugging filters, search pages, or app links.',
      'Group repeated keys so duplicate values are easy to spot.',
      'Build a correctly encoded query string from plain key-value lines.',
      'Compare UTM links, search URLs, and app-state URLs before sharing.',
    ],
    examples: [
      { label: 'Full URL', expression: 'https://example.com/?utm_source=newsletter&tag=a&tag=b', result: 'Decoded JSON with repeated tag values' },
      { label: 'Raw query', expression: 'name=Access+Free+Tools&tool=json', result: 'Readable key-value output' },
      { label: 'Build query', expression: 'utm_source=newsletter, utm_medium=email', result: '?utm_source=newsletter&utm_medium=email' },
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
    formula:
      'Encode mode replaces &, <, >, quotes, and apostrophes with HTML entities. Decode mode converts supported named and numeric entities back to characters.',
    limit:
      'Entity encoding is useful for displaying code examples as text, but it is not a complete sanitizer for untrusted HTML or script content.',
    useCases: [
      'Show HTML code examples inside a blog post, guide, or documentation page.',
      'Decode copied entity text so it is easier to read.',
      'Escape short snippets before placing them in visible HTML text.',
      'Check whether a string changed after encoding or decoding.',
    ],
    examples: [
      { label: 'Encode tag text', expression: '<strong>Free & fast</strong>', result: '&lt;strong&gt;Free &amp; fast&lt;/strong&gt;' },
      { label: 'Decode entities', expression: '&lt;strong&gt;Tools&lt;/strong&gt;', result: '<strong>Tools</strong>' },
      { label: 'Quote cleanup', expression: 'title="Calculator" data-label="A&B"', result: 'Encoded quote and ampersand text' },
    ],
    relatedSlugs: ['json-formatter', 'url-encode-decode', 'text-case-converter'],
  }),
  makeUtilityTool({
    slug: 'css-clamp-calculator',
    name: 'CSS Clamp Calculator',
    category: 'developer-tools',
    summary: 'Generate CSS clamp formulas for fluid font sizes, spacing, and responsive layout values.',
    description:
      'Use this free CSS clamp calculator to create a responsive clamp() formula from minimum size, maximum size, and viewport range.',
    icon: 'tool-css-clamp',
    aliases: ['Fluid Typography Calculator', 'CSS Fluid Type Calculator', 'Clamp Generator'],
    formula:
      'The calculator finds a viewport-based slope, calculates the rem intercept, then formats clamp(minimum, calc(intercept + vw), maximum).',
    limit:
      'Clamp formulas control numeric scaling only. Real layouts still need checks for text wrapping, readability, tap targets, and container width.',
    useCases: [
      'Create fluid heading sizes that grow between mobile and desktop widths.',
      'Generate responsive spacing values without writing several media queries.',
      'Convert a design-system min and max size into copy-ready CSS.',
      'Compare the middle size before placing the formula in a stylesheet.',
    ],
    examples: [
      { label: 'Responsive heading', expression: '32px to 64px from 360px to 1280px', result: 'CSS clamp() formula' },
      { label: 'Body text', expression: '16px to 20px from 375px to 1200px', result: 'Small fluid type rule' },
      { label: 'Section padding', expression: '24px to 72px from 360px to 1440px', result: 'Fluid spacing formula' },
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
    formula:
      'The calculator multiplies tokens per request by request count, divides by 1,000,000, then multiplies input and output tokens by the prices you enter.',
    limit:
      'AI providers can change prices, count cached tokens differently, or add plan rules. Use the current provider rate card for real budgets.',
    inputExplanations: [
      { term: 'Input tokens', meaning: 'Tokens sent to the model, including instructions, prompt text, context, and tool messages.' },
      { term: 'Output tokens', meaning: 'Tokens generated by the model in the response.' },
      { term: 'Price per 1M tokens', meaning: 'The provider rate for one million tokens, entered separately for input and output.' },
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
    ],
    useCases: [
      'Estimate the monthly cost of an AI support bot, writing helper, or internal tool.',
      'Compare two model price cards using the same token and request assumptions.',
      'Turn a token estimate into a rough budget before building a prototype.',
      'Explain why long prompts and long answers can cost different amounts.',
    ],
    examples: [
      { label: 'Support bot month', expression: '10,000 requests, 1,200 input tokens, 500 output tokens', result: 'Input, output, and total cost' },
      { label: 'Small prototype', expression: '1,000 requests with short prompts', result: 'Low-volume cost estimate' },
      { label: 'Long summaries', expression: 'Long input documents and medium answers', result: 'Input-heavy estimate' },
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
    seoTitle: 'Prompt Token Estimator Calculator | Free Token Counter',
    formula:
      'The estimator counts characters and divides by the average characters-per-token value you choose, then shows a rough low-high range.',
    limit:
      'Real tokenizers split text by model vocabulary. Code, symbols, non-English text, emojis, and whitespace can change the true token count.',
    inputExplanations: [
      { term: 'Prompt text', meaning: 'The text you plan to send to an AI model.' },
      { term: 'Average characters per token', meaning: 'A rough planning assumption; 4 is common, but exact tokenizers vary.' },
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
    ],
    useCases: [
      'Quickly estimate whether a prompt is short, medium, or long before using a model.',
      'Plan token cost by pairing this tool with the AI Token Cost Calculator.',
      'Compare prompt drafts before choosing the shorter one.',
      'Explain why exact token counts need a provider tokenizer.',
    ],
    examples: [
      { label: 'Short instruction', expression: 'Explain compound interest in plain language.', result: 'Rough token count' },
      { label: 'System prompt', expression: 'Long assistant behavior instruction', result: 'Character-based estimate' },
      { label: 'Blog task prompt', expression: 'Summarize and improve a draft', result: 'Low-high estimate range' },
    ],
    relatedSlugs: ['ai-token-cost-calculator', 'word-counter', 'text-summarizer'],
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
    formula:
      'The calculator multiplies requests by units per request, adds a retry or overhead percentage, multiplies by price per unit, and adds any fixed fee.',
    limit:
      'Provider billing can include free tiers, regional prices, taxes, credits, minimums, rounding, rate limits, or special plan rules that this simple calculator does not know.',
    inputExplanations: [
      { term: 'Requests', meaning: 'The number of API calls, jobs, messages, images, events, or tasks.' },
      { term: 'Units per request', meaning: 'How many billable units each request uses.' },
      { term: 'Retry or overhead percent', meaning: 'Extra cushion for retries, failed jobs, logs, or normal usage bursts.' },
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
    ],
    useCases: [
      'Estimate API cost before launching a feature.',
      'Compare pricing plans with the same request assumptions.',
      'Add a cushion for retries or failed requests.',
      'Explain why cheap per-unit prices can still add up at volume.',
    ],
    examples: [
      { label: 'Image API', expression: '1,000 requests x 1 image at $0.04', result: 'Usage cost plus overhead' },
      { label: 'Message API', expression: '50,000 messages and a monthly fee', result: 'Average cost per request' },
      { label: 'Credit bundle', expression: '20,000 jobs x 3 credits', result: 'Billable units and total cost' },
    ],
    relatedSlugs: ['ai-token-cost-calculator', 'utm-builder', 'query-string-parser'],
  }),
  makeUtilityTool({
    slug: 'download-time-calculator',
    name: 'Download Time Calculator',
    category: 'developer-tools',
    summary: 'Estimate how long a file, game, backup, or update will take to download.',
    description:
      'Use this free download time calculator to estimate transfer time from file size, Mbps speed, and a realistic efficiency percentage.',
    icon: 'tool-download-time',
    aliases: ['File Download Calculator', 'Game Download Time Calculator', 'Download Speed Calculator'],
    formula:
      'The calculator converts file size to bits, adjusts the Mbps speed by your efficiency percentage, then divides bits by effective bits per second.',
    limit:
      'Real downloads can be slower because of Wi-Fi, server limits, congestion, VPNs, protocol overhead, device speed, and background traffic.',
    inputExplanations: [
      { term: 'File size', meaning: 'The size shown by the app store, cloud drive, download page, or backup tool.' },
      { term: 'Speed Mbps', meaning: 'Megabits per second, which is different from megabytes per second.' },
      { term: 'Efficiency', meaning: 'How much of the listed speed you realistically expect after overhead and network conditions.' },
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
    ],
    useCases: [
      'Estimate a game download before starting it.',
      'Plan how long a large backup or video file may take.',
      'Compare what happens when real speed is lower than the advertised plan.',
      'Explain bits versus bytes in plain language.',
    ],
    examples: [
      { label: '50 GB game', expression: '50 GB at 100 Mbps, 85% efficiency', result: 'Download duration' },
      { label: 'Small update', expression: '700 MB at 25 Mbps', result: 'Minutes estimate' },
      { label: 'Cloud backup', expression: '2 TB at 500 Mbps', result: 'Hours estimate' },
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
    icon: 'tool-speed-needs',
    aliases: ['Internet Speed Calculator', 'WiFi Speed Needs Calculator', 'Mbps Needs Calculator'],
    formula:
      'The calculator multiplies each activity count by its Mbps estimate, adds the activity totals, then adds a buffer percentage.',
    limit:
      'Mbps is only one part of internet quality. Wi-Fi signal, latency, upload speed, router quality, and provider congestion can matter just as much.',
    inputExplanations: [
      { term: 'Video streams', meaning: 'Streams that may play at the same time, such as TV, YouTube, or class videos.' },
      { term: 'Gaming devices', meaning: 'Devices gaming online. Gaming often needs low latency more than huge Mbps.' },
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
    ],
    useCases: [
      'Estimate a family internet plan before comparing providers.',
      'Plan for work-from-home video calls plus streaming.',
      'Explain why 4K video changes speed needs more than normal browsing.',
      'Add a buffer instead of planning right at the limit.',
    ],
    examples: [
      { label: 'Small household', expression: 'One stream, one gamer, one call', result: 'Recommended Mbps' },
      { label: '4K evening', expression: 'Three 4K streams plus smart devices', result: 'Higher Mbps estimate' },
      { label: 'Work from home', expression: 'Several video calls and light streaming', result: 'Buffered speed estimate' },
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
    icon: 'tool-streaming-bitrate',
    aliases: ['Video Bitrate Calculator', 'Stream Data Calculator', 'Recording Size Calculator'],
    formula:
      'The calculator converts bitrate to megabits per second, multiplies by seconds and stream count, then divides by 8 for megabytes and by 1,000 for gigabytes.',
    limit:
      'Variable bitrate, adaptive streaming, audio tracks, chat, metadata, retransmits, and platform processing can make real data use different.',
    inputExplanations: [
      { term: 'Bitrate', meaning: 'Data rate from the encoder, export settings, or stream dashboard.' },
      { term: 'Duration', meaning: 'How long the stream or recording runs.' },
      { term: 'Streams', meaning: 'How many streams, cameras, or files use the same bitrate and duration.' },
    ],
    extraFaq: [
      {
        question: 'Is bitrate the same as resolution?',
        answer:
          'No. Resolution is pixel size, such as 1920 x 1080. Bitrate is how much data per second the video or audio uses.',
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
      { label: '2 hour 1080p stream', expression: '6 Mbps for 2 hours', result: 'Estimated GB' },
      { label: 'Music stream', expression: '320 Kbps for 3.5 hours', result: 'Estimated MB' },
      { label: 'Two cameras', expression: '4.5 Mbps for 1h 45m x 2', result: 'Combined data estimate' },
    ],
    relatedSlugs: ['download-time-calculator', 'internet-speed-needs-calculator', 'monitor-ppi-calculator'],
  }),
  makeUtilityTool({
    slug: 'device-battery-life-calculator',
    name: 'Device Battery Life Calculator',
    category: 'everyday-tools',
    summary: 'Estimate battery runtime from mAh, voltage, device watts, and efficiency.',
    description:
      'Use this free device battery life calculator to convert mAh and voltage into watt-hours and estimate runtime for small electronics.',
    icon: 'tool-battery-life',
    aliases: ['Battery Life Calculator', 'Power Bank Runtime Calculator', 'mAh to Hours Calculator'],
    formula:
      'The calculator converts milliamp-hours and voltage into watt-hours, applies an efficiency percentage, then divides usable watt-hours by device watts.',
    limit:
      'Real battery life depends on battery age, temperature, power spikes, screen brightness, radio use, inverter losses, and manufacturer limits.',
    inputExplanations: [
      { term: 'mAh', meaning: 'Battery capacity in milliamp-hours from the label.' },
      { term: 'Voltage', meaning: 'Nominal voltage used to convert capacity into watt-hours.' },
      { term: 'Device watts', meaning: 'Average power draw of the device while it is running.' },
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
    ],
    useCases: [
      'Estimate how long a power bank may run a tablet, light, router, or camera.',
      'Convert mAh and volts into watt-hours.',
      'Add realistic loss instead of assuming 100% battery use.',
      'Compare two batteries that use different voltages.',
    ],
    examples: [
      { label: 'Power bank and tablet', expression: '10,000 mAh, 3.7 V, 8 W', result: 'Runtime estimate' },
      { label: 'Small light', expression: '5,000 mAh, 3.7 V, 3 W', result: 'Longer runtime estimate' },
      { label: 'Laptop pack', expression: '5,000 mAh, 11.1 V, 30 W', result: 'Watt-hour based runtime' },
    ],
    relatedSlugs: ['electricity-calculator', 'download-time-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'monitor-ppi-calculator',
    name: 'Monitor PPI Calculator',
    category: 'image-tools',
    summary: 'Calculate pixels per inch from screen resolution and diagonal size.',
    description:
      'Use this free monitor PPI calculator to find screen pixel density, pixel diagonal, and simplified aspect ratio from resolution and diagonal inches.',
    icon: 'tool-monitor-ppi',
    aliases: ['Screen PPI Calculator', 'Pixel Density Calculator', 'DPI Calculator'],
    formula:
      'The calculator uses the Pythagorean theorem to find the pixel diagonal, then divides that by the screen diagonal in inches.',
    limit:
      'PPI is not the same as perceived sharpness. Viewing distance, scaling, panel quality, anti-aliasing, and eyesight also matter.',
    inputExplanations: [
      { term: 'Width and height pixels', meaning: 'The screen resolution, such as 1920 x 1080 or 2560 x 1440.' },
      { term: 'Diagonal inches', meaning: 'The physical diagonal screen size from the monitor or laptop spec.' },
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
    ],
    useCases: [
      'Compare a 24-inch 1080p monitor with a 27-inch 1440p monitor.',
      'Estimate pixel density before buying a display.',
      'Check whether a screen has a common 16:9, 16:10, or ultrawide ratio.',
      'Explain why resolution and screen size both matter.',
    ],
    examples: [
      { label: '24 inch 1080p', expression: '1920 x 1080, 24 inches', result: 'About 92 PPI' },
      { label: '27 inch 1440p', expression: '2560 x 1440, 27 inches', result: 'Higher PPI estimate' },
      { label: '32 inch 4K', expression: '3840 x 2160, 32 inches', result: 'High density monitor estimate' },
    ],
    relatedSlugs: ['aspect-ratio-calculator', 'streaming-bitrate-calculator', 'color-contrast-checker'],
  }),
  makeUtilityTool({
    slug: 'recipe-scaler',
    name: 'Recipe Scaler',
    category: 'everyday-tools',
    summary: 'Scale one recipe ingredient from original servings to the servings you want to make.',
    description:
      'Use this free recipe scaler to resize ingredient amounts from the original serving count to a smaller or larger batch.',
    icon: 'tool-recipe-scale',
    aliases: ['Recipe Scaling Calculator', 'Recipe Converter', 'Serving Size Calculator'],
    formula:
      'The scaler divides desired servings by original servings to get a scale factor, then multiplies the ingredient amount by that factor.',
    limit:
      'Ingredient math scales cleanly, but flavor, salt, spices, yeast, thickener, pan size, and cook time may need real kitchen judgment.',
    inputExplanations: [
      { term: 'Original servings', meaning: 'How many servings the recipe normally makes.' },
      { term: 'Desired servings', meaning: 'How many servings you want to make now.' },
      { term: 'Original amount', meaning: 'The amount from one ingredient line in the recipe.' },
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
    ],
    useCases: [
      'Resize a recipe from 4 servings to 10 servings. ',
      'Make a half batch when you do not need the full recipe.',
      'Scale party trays, meal prep, or bake sale batches one ingredient line at a time.',
      'Show the scale factor so the recipe math is easy to audit.',
    ],
    examples: [
      { label: 'Dinner for 10', expression: '2 cups flour, 4 servings to 10 servings', result: '5 cups flour' },
      { label: 'Half batch', expression: '300 g sugar, 12 servings to 6 servings', result: '150 g sugar' },
      { label: 'Party tray', expression: '3 eggs, 8 servings to 20 servings', result: '7.5 eggs before rounding' },
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
