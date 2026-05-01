import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface UtilityToolSpec {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  icon: string;
  aliases?: string[];
  formula: string;
  limit: string;
  inputExplanations?: Array<{
    term: string;
    meaning: string;
  }>;
  extraFaq?: ToolFaq[];
  useCases: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
}

function makeFaq(spec: UtilityToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');
  const inputExplanationFaq = {
    question: `What do the main ${spec.name} inputs mean?`,
    answer: spec.inputExplanations?.length
      ? spec.inputExplanations.map((item) => `${item.term}: ${item.meaning}`).join(' ')
      : 'The main inputs are the values, text, dates, units, or settings the tool needs before it can work. Read each field label carefully, keep units consistent, and compare your entry with the examples if the answer looks strange.',
  };

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it when your task matches one of these common needs: ${exampleUses} It works best when you already know the values, dates, units, or settings the page asks for.`,
    },
    {
      question: `What is the ${spec.name} doing with my inputs?`,
      answer: `In plain language: ${spec.formula} The examples on the page are there so you can compare your inputs with a filled-out calculation before copying the answer.`,
    },
    inputExplanationFaq,
    {
      question: 'What should I double-check before trusting the answer?',
      answer: `${spec.limit} Also check that you used the right unit, date, scale, or mode because small input changes can change the result.`,
    },
    ...(spec.extraFaq ?? []),
    {
      question: 'Does the site save what I enter?',
      answer:
        'No. The calculator runs in your browser tab. Your recent answers stay only on the page while you use it, and they are not sent to a server.',
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
    seoTitle: `${spec.name} | ${titleType}`,
    seoDescription: spec.description,
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
      'Use this free age calculator to find age on any date, total days lived, next birthday, and days until the next birthday.',
    icon: 'calculator-age',
    formula:
      'The calculator compares two valid calendar dates, subtracts full years, then remaining months and days. It also counts total days using UTC calendar dates.',
    limit:
      'Check the as-of date carefully. Legal, school, insurance, and age-restricted decisions can use their own cutoff rules.',
    useCases: [
      'Find exact age today or on a future date.',
      'Calculate age for forms, school records, birthday planning, or quick checks.',
      'See total days lived and days until the next birthday.',
      'Compare leap-day birthdays with normal calendar dates.',
    ],
    examples: [
      { label: 'Born Jan 1, 2000', expression: '2000-01-01 to 2026-04-30', result: '26 years, 3 months, 29 days' },
      { label: 'Leap day birthday', expression: '2004-02-29 to 2026-04-30', result: 'Leap-aware calendar age' },
      { label: 'Birthday today', expression: '2010-04-30 to 2026-04-30', result: '16 years, 0 months, 0 days' },
    ],
    relatedSlugs: ['date-calculator', 'time-calculator', 'hours-calculator'],
  }),
  makeUtilityTool({
    slug: 'date-calculator',
    name: 'Date Calculator',
    category: 'date-time',
    summary: 'Find days between dates or add and subtract years, months, weeks, and days.',
    description:
      'Use this free date calculator to count days between dates or add and subtract years, months, weeks, and days from a calendar date.',
    icon: 'calculator-date',
    formula:
      'Date difference counts full UTC calendar days between two dates. Add/subtract mode applies years and months first, then weeks and days.',
    limit:
      'Calendar-date math is not the same as time-zone scheduling. Confirm local deadlines, business days, holidays, and time zones separately.',
    useCases: [
      'Count days between deadlines, trips, projects, or events.',
      'Add or subtract a date offset such as 90 days or 3 months.',
      'Compare weeks plus remaining days with a calendar year-month-day difference.',
      'Avoid daylight-saving surprises by using date-only UTC math.',
    ],
    examples: [
      { label: 'Rest of 2026', expression: '2026-04-30 to 2026-12-31', result: '245 days' },
      { label: 'Add 1 month, 2 weeks, 3 days', expression: '2026-04-30 + 0y 1m 2w 3d', result: '2026-06-16' },
      { label: 'Subtract 90 days', expression: '2026-12-31 - 90 days', result: '2026-10-02' },
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
    summary: 'Estimate concrete volume for a slab in cubic feet, cubic yards, and bags.',
    description:
      'Use this free concrete calculator to estimate slab volume from length, width, depth, waste percentage, cubic yards, cubic meters, and bag counts.',
    icon: 'calculator-concrete',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, adds waste percentage, and converts cubic feet to cubic yards.',
    limit:
      'This is a planning estimate. Forms, uneven ground, compaction, reinforcement, waste, truck minimums, and exact bag yield can change what you need.',
    inputExplanations: [
      { term: 'Length and width', meaning: 'the inside form dimensions of the slab, pad, or walkway in feet.' },
      { term: 'Depth', meaning: 'the average concrete thickness in inches, such as 4 for a common small slab.' },
      { term: 'Extra waste', meaning: 'a cushion for uneven base, spillage, low spots, and ordering a little more than the exact volume.' },
    ],
    useCases: [
      'Estimate concrete for a simple slab, pad, walkway, or small project.',
      'Convert cubic feet to cubic yards before ordering ready-mix.',
      'Estimate common 40 lb, 60 lb, and 80 lb bag counts.',
      'Add waste percentage before buying materials.',
    ],
    examples: [
      { label: '10 x 12 slab', expression: '10 ft x 12 ft x 4 in, 10% extra', result: 'About 1.63 cubic yards' },
      { label: 'Walkway', expression: '24 ft x 3 ft x 4 in, 10% extra', result: 'About 0.98 cubic yards' },
      { label: 'Small pad', expression: '6 ft x 6 ft x 3.5 in, 5% extra', result: 'About 0.41 cubic yards' },
    ],
    relatedSlugs: ['volume-calculator', 'area-calculator', 'conversion-calculator'],
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
      'Use this free fuel cost calculator to estimate gallons needed, trip fuel cost, and cost per mile from distance, MPG, and fuel price.',
    icon: 'calculator-fuel-cost',
    formula:
      'The calculator divides trip miles by miles per gallon to estimate gallons needed, then multiplies gallons by the price per gallon.',
    limit:
      'Real fuel cost changes with traffic, speed, weather, terrain, vehicle load, maintenance, fuel blend, and the actual price you pay.',
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
    relatedSlugs: ['area-calculator', 'concrete-calculator', 'conversion-calculator'],
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
    summary: 'Calculate MPG, gallons per 100 miles, and liters per 100 km from miles and gallons.',
    description:
      'Use this free gas mileage calculator to find miles per gallon, gallons per 100 miles, and liters per 100 km from a tank or trip.',
    icon: 'calculator-gas-mileage',
    formula:
      'The calculator divides miles driven by gallons used to get MPG, then converts the same relationship into gallons per 100 miles and L/100 km.',
    limit:
      'Tank fill differences, tire pressure, route, speed, weather, and driving style can change real-world fuel economy.',
    useCases: [
      'Calculate MPG after filling a tank.',
      'Compare fuel use between trips or vehicles.',
      'Convert MPG into gallons per 100 miles or L/100 km.',
      'Use a real trip value inside the Fuel Cost Calculator.',
    ],
    examples: [
      { label: 'Road trip', expression: '350 miles, 12.5 gallons', result: '28 MPG' },
      { label: 'Commute tank', expression: '275 miles, 9.8 gallons', result: 'About 28.06 MPG' },
      { label: 'Truck tank', expression: '420 miles, 24 gallons', result: '17.5 MPG' },
    ],
    relatedSlugs: ['fuel-cost-calculator', 'mileage-calculator', 'conversion-calculator'],
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
    summary: 'Multiply miles by a rate per mile and add optional parking or toll costs.',
    description:
      'Use this free mileage calculator to estimate mileage reimbursement, delivery totals, or trip allowance from miles, rate per mile, and extra costs.',
    icon: 'calculator-mileage',
    formula:
      'The calculator multiplies miles by the rate per mile, then adds parking, tolls, or other extra costs when entered.',
    limit:
      'Use the rate required by your employer, client, contract, or tax authority. This tool does not decide official reimbursement eligibility.',
    useCases: [
      'Estimate mileage reimbursement from miles and rate.',
      'Add parking, tolls, or trip extras.',
      'Compare different mileage rates.',
      'Copy a quick total for an invoice draft or personal note.',
    ],
    examples: [
      { label: 'Client visit', expression: '125 miles x $0.67 + $12', result: '$95.75' },
      { label: 'Local errand', expression: '18.4 miles x $0.67', result: '$12.33' },
      { label: 'Delivery day', expression: '92 miles x $0.55 + $8', result: '$58.60' },
    ],
    relatedSlugs: ['fuel-cost-calculator', 'gas-mileage-calculator', 'auto-loan-calculator'],
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
    formula:
      'The calculator converts parent heights to inches, averages them, then adds 5 inches for a male estimate or subtracts 5 inches for a female estimate.',
    limit:
      'This is only a family-height estimate. Nutrition, health, puberty timing, genetics, and medical conditions can change growth.',
    useCases: [
      'Estimate a child adult height from parent heights.',
      'Compare the result in feet, inches, and centimeters.',
      'See an approximate plus-or-minus range instead of one exact promise.',
      'Understand why growth estimates are not medical predictions.',
    ],
    examples: [
      { label: 'Boy estimate', expression: 'Mother 5 ft 4 in, father 5 ft 10 in', result: 'About 5 ft 9 in' },
      { label: 'Girl estimate', expression: 'Mother 5 ft 3 in, father 6 ft 0 in', result: 'About 5 ft 5 in' },
      { label: 'Centimeter check', expression: 'Mother 162 cm, father 178 cm', result: 'Adult height estimate in cm' },
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
    relatedSlugs: ['ohms-law-calculator', 'electricity-calculator', 'resistor-calculator'],
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
    relatedSlugs: ['resistor-calculator', 'voltage-drop-calculator', 'electricity-calculator'],
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
    relatedSlugs: ['btu-calculator', 'voltage-drop-calculator', 'ohms-law-calculator'],
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
      'Use this free sleep calculator to count sleep cycles backward from wake-up time or forward from bedtime.',
    icon: 'calculator-sleep',
    formula:
      'The calculator treats one sleep cycle as about 90 minutes, then adds or subtracts cycles and your fall-asleep buffer from the clock time.',
    limit:
      'Sleep needs vary by age, health, schedule, stress, and sleep quality. This is a planning helper, not medical advice.',
    useCases: [
      'Find a bedtime from a planned wake-up time.',
      'Find a wake-up time from bedtime.',
      'Compare 4, 5, or 6 sleep cycles.',
      'Add a realistic fall-asleep buffer.',
    ],
    examples: [
      { label: 'Wake at 7:00', expression: '5 cycles plus 15 min buffer', result: 'Suggested bedtime' },
      { label: 'Bed at 10:30 PM', expression: '5 cycles plus 15 min buffer', result: 'Suggested wake time' },
      { label: 'Short night', expression: '4 cycles plus 20 min buffer', result: 'Alternate sleep time' },
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
      'Use this free roofing calculator to estimate roof area, roofing squares, and shingle bundles for a simple pitched roof.',
    icon: 'calculator-roofing',
    formula:
      'The calculator multiplies footprint area by a pitch factor, adds waste, divides by 100 square feet per roofing square, and estimates 3 bundles per square.',
    limit:
      'Complex roofs, valleys, hips, dormers, openings, product coverage, and local installation practices can change material needs.',
    inputExplanations: [
      { term: 'Footprint length and width', meaning: 'the flat building footprint, not the sloped roof surface.' },
      { term: 'Pitch rise per 12', meaning: 'how many inches the roof rises for every 12 inches of horizontal run.' },
      { term: 'Waste percent', meaning: 'extra roofing for cuts, starter strips, ridge, hips, valleys, and mistakes.' },
    ],
    useCases: [
      'Estimate roof squares for a simple footprint.',
      'Adjust for roof pitch and waste.',
      'Estimate shingle bundles at 3 bundles per square.',
      'Prepare a rough number before contractor measurement.',
    ],
    examples: [
      { label: 'Simple roof', expression: '40 ft x 30 ft, 6/12 pitch, 10% waste', result: 'Roof squares and bundles' },
      { label: 'Low pitch', expression: '30 ft x 24 ft, 3/12 pitch', result: 'Pitch-adjusted area' },
      { label: 'Higher waste', expression: '48 ft x 32 ft, 8/12 pitch, 15% waste', result: 'Roofing material estimate' },
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
    relatedSlugs: ['square-footage-calculator', 'drywall-calculator', 'tile-calculator'],
  }),
  makeUtilityTool({
    slug: 'drywall-calculator',
    name: 'Drywall Calculator',
    category: 'home-projects',
    summary: 'Estimate drywall sheet count from project area, sheet size, and waste percentage.',
    description:
      'Use this free drywall calculator to estimate whole drywall sheets from wall or ceiling square feet, sheet size, and waste percentage.',
    icon: 'calculator-drywall',
    aliases: ['Sheetrock Calculator', 'Plasterboard Calculator'],
    formula:
      'The calculator multiplies sheet length by width for sheet area, adds waste to the project area, then rounds up project area divided by sheet area.',
    limit:
      'Drywall layout depends on openings, sheet orientation, seams, thickness, fire rating, moisture rating, ceiling lift, and local building requirements.',
    inputExplanations: [
      { term: 'Wall or ceiling area', meaning: 'the measured surface area before extra sheets are added.' },
      { term: 'Sheet size', meaning: 'the drywall panel dimensions, such as 4 by 8 or 4 by 12 feet.' },
      { term: 'Waste percent', meaning: 'extra sheets for cuts, broken corners, offcuts, and layout mistakes.' },
    ],
    useCases: [
      'Estimate drywall sheets for a room or basement wall area.',
      'Compare 4x8, 4x10, and 4x12 sheet sizes.',
      'Add a waste allowance for cuts and broken sheets.',
      'Plan a rough material count before measuring openings and layout.',
    ],
    examples: [
      { label: '4x8 sheets', expression: '480 ft2, 4 x 8 sheet, 10% waste', result: 'Sheet count' },
      { label: 'Long sheets', expression: '720 ft2, 4 x 12 sheet, 12% waste', result: 'Fewer sheets, larger panels' },
      { label: 'Small repair area', expression: '96 ft2, 4 x 8 sheet, 5% waste', result: 'Repair sheet count' },
    ],
    relatedSlugs: ['paint-calculator', 'square-footage-calculator', 'cubic-yard-calculator'],
  }),
  makeUtilityTool({
    slug: 'carpet-calculator',
    name: 'Carpet Calculator',
    category: 'home-projects',
    summary: 'Estimate carpet square yards and roll linear feet from room dimensions and waste.',
    description:
      'Use this free carpet calculator to estimate carpet square yards, adjusted square feet, and linear feet from room size and roll width.',
    icon: 'calculator-carpet',
    formula:
      'The calculator multiplies room length by width, adds waste, divides by 9 for square yards, and divides by roll width for approximate linear feet.',
    limit:
      'Carpet orders depend on seam placement, stairs, closets, pile direction, pattern matching, roll width, and installer layout.',
    inputExplanations: [
      { term: 'Room length and width', meaning: 'the simple rectangular floor area before closets, seams, or stairs are handled separately.' },
      { term: 'Roll width', meaning: 'the carpet roll width from the product, commonly 12 feet for many carpets.' },
      { term: 'Waste percent', meaning: 'extra carpet for trimming, seams, closets, pattern direction, and installer layout.' },
    ],
    useCases: [
      'Estimate carpet for a simple rectangular room.',
      'Convert square feet into square yards.',
      'Estimate linear feet from common roll width.',
      'Add waste before talking with an installer.',
    ],
    examples: [
      { label: 'Bedroom carpet', expression: '15 ft x 12 ft, 12 ft roll, 10% waste', result: 'Square yards and linear feet' },
      { label: 'Large room', expression: '22 ft x 16 ft, 12 ft roll, 12% waste', result: 'Adjusted carpet area' },
      { label: 'Small office', expression: '10 ft x 11 ft, 12 ft roll, 8% waste', result: 'Rough carpet order' },
    ],
    relatedSlugs: ['square-footage-calculator', 'area-calculator', 'paint-calculator'],
  }),
  makeUtilityTool({
    slug: 'flooring-calculator',
    name: 'Flooring Calculator',
    category: 'home-projects',
    summary: 'Estimate flooring boxes, adjusted square feet, coverage ordered, and optional material cost.',
    description:
      'Use this free flooring calculator to estimate whole flooring boxes from project area, waste percentage, box coverage, and optional box price.',
    icon: 'calculator-flooring',
    aliases: ['Floor Calculator', 'Flooring Box Calculator', 'Laminate Flooring Calculator'],
    formula:
      'The calculator adds waste to the measured floor area, divides by square feet per box, rounds up to whole boxes, and multiplies by box price when entered.',
    limit:
      'Flooring orders depend on room shape, product layout, pattern direction, stairs, closets, damaged pieces, overage for repairs, and matching dye lots.',
    inputExplanations: [
      { term: 'Floor area', meaning: 'the measured square footage before extra material is added.' },
      { term: 'Waste percent', meaning: 'extra flooring for cuts, damaged planks, layout direction, and future repairs.' },
      { term: 'Box coverage', meaning: 'how many square feet one box covers according to the product label.' },
      { term: 'Price per box', meaning: 'an optional material price used only when you want an estimated product cost.' },
    ],
    useCases: [
      'Estimate laminate, vinyl plank, engineered wood, or boxed flooring.',
      'Add waste before buying boxes.',
      'Compare product box coverage values.',
      'Estimate material cost when you know price per box.',
    ],
    examples: [
      { label: 'Living room', expression: '240 ft2, 10% waste, 24 ft2/box, $48/box', result: '11 boxes' },
      { label: 'Small bedroom', expression: '120 ft2, 8% waste, 22.5 ft2/box', result: 'Box count estimate' },
      { label: 'Whole level', expression: '850 ft2, 12% waste, 20 ft2/box', result: 'Large flooring order' },
    ],
    relatedSlugs: ['square-footage-calculator', 'carpet-calculator', 'tile-calculator'],
  }),
  makeUtilityTool({
    slug: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    category: 'home-projects',
    summary: 'Estimate wallpaper rolls from room dimensions, openings, roll coverage, and waste.',
    description:
      'Use this free wallpaper calculator to estimate whole wallpaper rolls for simple room walls from dimensions, doors, windows, roll coverage, and waste.',
    icon: 'calculator-wallpaper',
    aliases: ['Wallpaper Roll Calculator', 'Wall Covering Calculator'],
    formula:
      'The calculator finds wall area from room perimeter and height, subtracts estimated doors and windows, adds waste, divides by roll coverage, and rounds up.',
    limit:
      'Wallpaper needs can change with pattern repeat, usable roll yield, accent walls, odd wall shapes, trimming, damaged strips, and dye lots.',
    inputExplanations: [
      { term: 'Room length and width', meaning: 'the two pairs of walls used to estimate total wall area from room perimeter.' },
      { term: 'Doors and windows', meaning: 'standard openings subtracted from wall area before waste is added.' },
      { term: 'Roll coverage', meaning: 'usable square feet one roll covers; use the product label because pattern repeat can reduce it.' },
      { term: 'Waste percent', meaning: 'extra wallpaper for trimming, matching patterns, damaged strips, and mistakes.' },
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
        question: 'Should I subtract doors and windows?',
        answer:
          'For a rough estimate, subtracting standard doors and windows keeps the roll count from getting too high. For peel-and-stick or patterned wallpaper, some stores advise not subtracting openings because you still cut around them and may need full-height strips. If you are close to the next roll, it is usually safer to round up.',
      },
      {
        question: 'Why should wallpaper rolls come from the same lot or batch?',
        answer:
          'Wallpaper can have tiny color differences between print runs. The lot, run, or batch number helps you buy rolls printed together. If you buy more later from a different lot, the pattern may be correct but the color can still look slightly off on the wall.',
      },
    ],
    useCases: [
      'Estimate rolls for a bedroom, office, or powder room.',
      'Subtract common doors and windows from wall area.',
      'Compare roll coverage from different wallpaper products.',
      'Add waste for pattern matching before buying.',
    ],
    examples: [
      { label: 'Bedroom', expression: '12 x 10 x 8 ft, 1 door, 2 windows, 56 ft2/roll', result: '6 rolls' },
      { label: 'Small office', expression: '10 x 9 x 8 ft, 48 ft2/roll, 12% waste', result: 'Wallpaper roll estimate' },
      { label: 'Accent room', expression: 'Measured wall area and roll coverage', result: 'Whole rolls to buy' },
    ],
    relatedSlugs: ['paint-calculator', 'drywall-calculator', 'square-footage-calculator'],
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
    icon: 'calculator-deck',
    aliases: ['Deck Calculator', 'Decking Cost Calculator'],
    formula:
      'The calculator multiplies deck area by a waste factor and cost per square foot, then adds railing cost and stair allowance.',
    limit:
      'Deck costs vary widely with framing, footings, fasteners, railing code, permits, demolition, labor, height, stairs, material grade, and location.',
    inputExplanations: [
      { term: 'Decking waste percent', meaning: 'extra surface material for board cuts, layout choices, and mistakes.' },
      { term: 'Decking cost per square foot', meaning: 'the surface material cost only, unless you intentionally include more in that number.' },
      { term: 'Railing and stairs', meaning: 'separate rough allowances added after the deck surface estimate.' },
    ],
    useCases: [
      'Create a rough deck material budget.',
      'Compare different decking cost assumptions.',
      'Add railing and stair allowances to a surface estimate.',
      'Discuss scope before requesting contractor quotes.',
    ],
    examples: [
      { label: 'Small deck', expression: '16 x 12 ft, $12/ft2 decking, 40 ft railing', result: 'Rough total cost' },
      { label: 'Larger deck', expression: '24 x 14 ft, $18/ft2 decking, 58 ft railing', result: 'Expanded budget estimate' },
      { label: 'No railing pad', expression: '12 x 10 ft, $10/ft2 decking, no railing', result: 'Simple platform estimate' },
    ],
    relatedSlugs: ['area-calculator', 'fence-calculator', 'board-foot-calculator'],
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
    summary: 'Estimate brick count from wall area, brick face dimensions, mortar joint, and waste.',
    description:
      'Use this free brick calculator to estimate whole bricks from wall face area, brick dimensions, mortar joint thickness, and waste percentage.',
    icon: 'calculator-brick',
    aliases: ['Brick Wall Calculator', 'Masonry Brick Calculator'],
    formula:
      'The calculator adds the mortar joint to brick length and height, converts the face area to square feet, adds waste to wall area, and rounds up.',
    limit:
      'Brick counts can change with bond pattern, corners, openings, piers, cuts, wall thickness, damaged units, mortar, and professional masonry layout.',
    inputExplanations: [
      { term: 'Wall area', meaning: 'the visible wall face area, not the thickness or volume of the wall.' },
      { term: 'Brick dimensions', meaning: 'the visible face length and height of one brick in inches.' },
      { term: 'Mortar joint', meaning: 'the planned gap between bricks, included in the face coverage estimate.' },
      { term: 'Waste percent', meaning: 'extra bricks for cuts, breakage, corners, bond pattern, and color matching.' },
    ],
    useCases: [
      'Estimate brick count for a simple wall face.',
      'Use actual brick face dimensions and mortar joint thickness.',
      'Add waste for cuts and broken pieces.',
      'Compare brick sizes for the same wall area.',
    ],
    examples: [
      { label: 'Modular brick wall', expression: '120 ft2, 7.625 x 2.25 in brick, 3/8 in joint, 10% waste', result: '906 bricks' },
      { label: 'Garden wall face', expression: '64 ft2, modular brick, 12% waste', result: 'Brick estimate' },
      { label: 'Veneer planning', expression: 'Measured wall face plus waste', result: 'Whole bricks to buy' },
    ],
    relatedSlugs: ['concrete-block-calculator', 'paver-calculator', 'square-footage-calculator'],
  }),
  makeUtilityTool({
    slug: 'concrete-block-calculator',
    name: 'Concrete Block Calculator',
    category: 'home-projects',
    summary: 'Estimate concrete block count, courses, and blocks per course from wall dimensions.',
    description:
      'Use this free concrete block calculator to estimate CMU or concrete block count from wall length, height, block face size, openings, and waste.',
    icon: 'calculator-concrete-block',
    aliases: ['CMU Calculator', 'Cinder Block Calculator', 'Block Wall Calculator'],
    formula:
      'The calculator multiplies wall length by height, subtracts openings, adds waste, divides by nominal block face area, and rounds up.',
    limit:
      'Block walls need professional review for footings, drainage, reinforcement, grout, lintels, mortar, corners, structural loads, and local code.',
    inputExplanations: [
      { term: 'Wall length and height', meaning: 'the finished wall face dimensions in feet.' },
      { term: 'Nominal block size', meaning: 'the common module size used for layout, such as 16 by 8 inches.' },
      { term: 'Openings', meaning: 'door, window, or other areas subtracted before waste is added.' },
      { term: 'Waste percent', meaning: 'extra blocks for cuts, broken units, corners, and layout changes.' },
    ],
    useCases: [
      'Estimate block count for a simple wall.',
      'See approximate course count and blocks per course.',
      'Subtract large openings before adding waste.',
      'Compare common nominal block sizes.',
    ],
    examples: [
      { label: '40 ft wall', expression: '40 x 8 ft, 16 x 8 in block, 20 ft2 openings, 5% waste', result: '355 blocks' },
      { label: 'Short garden wall', expression: '24 x 3 ft, 16 x 8 in block', result: 'Block count estimate' },
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
    slug: 'board-foot-calculator',
    name: 'Board Foot Calculator',
    category: 'home-projects',
    summary: 'Calculate lumber board feet from thickness, width, length, and quantity.',
    description:
      'Use this free board foot calculator to estimate lumber volume from thickness in inches, width in inches, length in feet, and quantity.',
    icon: 'calculator-board-foot',
    formula:
      'The calculator multiplies thickness in inches by width in inches by length in feet, divides by 12, then multiplies by quantity.',
    limit:
      'Board feet measure volume only. Nominal sizes, surfaced dimensions, seller rules, moisture, defects, species, grade, and waste can change real buying needs.',
    inputExplanations: [
      { term: 'Thickness and width', meaning: 'board dimensions in inches, preferably actual dimensions when you know them.' },
      { term: 'Length', meaning: 'board length in feet.' },
      { term: 'Quantity', meaning: 'how many boards of that same size to include.' },
    ],
    useCases: [
      'Estimate lumber volume before visiting a lumber yard.',
      'Compare rough boards with different dimensions.',
      'Multiply one board size by quantity.',
      'Understand board-foot pricing better.',
    ],
    examples: [
      { label: 'Four 1x6 boards', expression: '1 in x 6 in x 8 ft x 4', result: '16 board feet' },
      { label: 'Rough boards', expression: '2 in x 8 in x 10 ft x 3', result: '40 board feet' },
      { label: 'Single slab', expression: '2 in x 18 in x 7 ft', result: '21 board feet' },
    ],
    relatedSlugs: ['deck-cost-calculator', 'factor-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'cubic-yard-calculator',
    name: 'Cubic Yard Calculator',
    category: 'home-projects',
    summary: 'Convert length, width, depth, and waste into cubic feet and cubic yards.',
    description:
      'Use this free cubic yard calculator to estimate cubic feet and cubic yards from rectangular dimensions, depth, and waste percent.',
    icon: 'calculator-cubic-yard',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, adds waste, then divides cubic feet by 27 for cubic yards.',
    limit:
      'This is a simple rectangular-volume estimate. Uneven ground, compaction, slopes, forms, settling, and supplier rounding can change orders.',
    inputExplanations: [
      { term: 'Length and width', meaning: 'the rectangular area to fill or cover.' },
      { term: 'Depth', meaning: 'the average material depth in inches.' },
      { term: 'Waste percent', meaning: 'extra material for uneven grade, compaction, settling, and ordering cushion.' },
    ],
    useCases: [
      'Estimate cubic yards for fill, soil, mulch, sand, or gravel.',
      'Convert a shallow depth in inches into cubic yards.',
      'Add waste before ordering bulk material.',
      'Check the math behind material calculators.',
    ],
    examples: [
      { label: 'Material bed', expression: '20 ft x 10 ft x 3 in, 5% waste', result: 'Cubic yards' },
      { label: 'Deep fill', expression: '12 ft x 8 ft x 6 in, 10% waste', result: 'Cubic feet and yards' },
      { label: 'Small patch', expression: '6 ft x 4 ft x 2 in', result: 'Low-volume estimate' },
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
    summary: 'Estimate asphalt tons from length, width, compacted depth, density, and waste.',
    description:
      'Use this free asphalt calculator to estimate cubic yards and tons from pavement dimensions, compacted depth, density, and waste.',
    icon: 'calculator-asphalt',
    formula:
      'The calculator converts compacted depth from inches to feet, multiplies length by width by depth, adds waste, converts to cubic yards, then multiplies by tons per cubic yard.',
    limit:
      'Asphalt quantity depends on mix type, compaction, lift thickness, base condition, paving specs, plant minimums, and professional site measurement.',
    inputExplanations: [
      { term: 'Compacted depth', meaning: 'the finished asphalt thickness after compaction, not loose material depth.' },
      { term: 'Tons per cubic yard', meaning: 'the density assumption used to convert volume into asphalt tonnage.' },
      { term: 'Waste percent', meaning: 'extra material for edges, compaction differences, and small measurement errors.' },
    ],
    useCases: [
      'Estimate asphalt tons for a simple driveway section.',
      'Convert compacted depth into cubic yards.',
      'Compare 2-inch, 3-inch, and 4-inch depth assumptions.',
      'Use supplier density before talking with a paving contractor.',
    ],
    examples: [
      { label: 'Driveway section', expression: '30 ft x 12 ft x 3 in, 2 tons/yd3', result: 'Estimated tons' },
      { label: 'Parking pad', expression: '20 ft x 18 ft x 4 in, 2 tons/yd3', result: 'Cubic yards and tons' },
      { label: 'Thin overlay', expression: '40 ft x 10 ft x 2 in, 5% waste', result: 'Overlay estimate' },
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
      'Use this free heat index calculator to estimate apparent temperature from air temperature and humidity using the NWS regression.',
    icon: 'calculator-heat-index',
    formula:
      'The calculator uses the National Weather Service heat index method: a simple branch first, then the Rothfusz regression and standard humidity adjustments when the preliminary value reaches about 80 F.',
    limit:
      'Heat risk depends on sun, exertion, wind, hydration, clothing, health, and local warnings. Do not rely on a calculator alone.',
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
    ],
    useCases: [
      'Estimate how hot humid weather feels.',
      'Compare air temperature with heat index.',
      'Convert apparent temperature to Celsius.',
      'Understand why humidity changes heat stress.',
    ],
    examples: [
      { label: 'Humid heat', expression: '90 F and 70% RH', result: 'Higher apparent temperature' },
      { label: 'Dryer heat', expression: '95 F and 35% RH', result: 'Adjusted heat index' },
      { label: 'Danger check', expression: '100 F and 55% RH', result: 'High heat index estimate' },
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
    icon: 'calculator-gdp',
    formula:
      'The calculator uses the expenditure approach: GDP = C + I + G + (exports - imports). If population is entered in the same scale, it divides GDP by population for GDP per person.',
    limit:
      'Use consistent money units. This is a learning estimate, not an official national account, forecast, or economic policy model.',
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
    summary: 'Estimate a score differential or course handicap from rating, slope, par, and index inputs.',
    description:
      'Use this free golf handicap calculator to estimate score differential and course handicap using common World Handicap System formulas.',
    icon: 'calculator-golf-handicap',
    formula:
      'Score differential uses (113 / slope rating) x (adjusted gross score - course rating - PCC). Course handicap uses Handicap Index x (slope / 113) + (course rating - par).',
    limit:
      'This is not an official Handicap Index. Official records may include caps, exceptional-score reductions, 9-hole rules, and committee adjustments.',
    useCases: [
      'Estimate a round score differential from adjusted score, rating, slope, and PCC.',
      'Estimate course handicap from Handicap Index and tee ratings.',
      'Apply a playing handicap allowance for casual formats.',
      'Learn why course rating and slope change handicap math.',
    ],
    examples: [
      { label: 'Score differential', expression: '(113 / 128) x (86 - 71.2 - 0)', result: 'About 13.1' },
      { label: 'Course handicap', expression: '14.2 x (128 / 113) + (71.2 - 72)', result: 'About 15' },
      { label: 'Playing handicap', expression: 'Course handicap 15 with 85% allowance', result: 'About 13' },
    ],
    relatedSlugs: ['percentage-calculator', 'average-calculator', 'rounding-calculator'],
  }),
  makeUtilityTool({
    slug: 'love-calculator',
    name: 'Love Calculator',
    category: 'everyday-tools',
    summary: 'A playful name compatibility game that runs locally in your browser.',
    description:
      'Use this free love calculator as a light name-match game with a deterministic score and clear entertainment-only notes.',
    icon: 'calculator-love',
    formula:
      'The calculator cleans the two names, creates a deterministic local hash, and turns it into a playful percentage score from 40 to 100.',
    limit:
      'This is only a game. It cannot measure attraction, trust, communication, values, consent, or relationship health.',
    useCases: [
      'Play a harmless name-match game with friends.',
      'Get the same score for the same two names on the same page.',
      'Use a novelty calculator without pretending it is real compatibility science.',
      'Keep entered names private in the browser tab.',
    ],
    examples: [
      { label: 'Alex + Sam', expression: 'Alex and Sam', result: 'Playful match score' },
      { label: 'Taylor + Jordan', expression: 'Taylor and Jordan', result: 'Playful match score' },
      { label: 'Case check', expression: 'alex and SAM', result: 'Same deterministic style score' },
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
    summary: 'Count characters with spaces, characters without spaces, lines, words, and UTF-8 bytes.',
    description:
      'Use this free character counter to check total characters, characters without spaces, UTF-8 byte length, words, and lines for short-form text.',
    icon: 'tool-character-counter',
    aliases: ['Letter Counter', 'Online Character Counter'],
    formula:
      'The tool counts Unicode characters, removes whitespace for a no-spaces count, and encodes the text as UTF-8 to estimate byte length.',
    limit:
      'Hard limits can vary by app because some platforms count emoji sequences, links, rich text, or line breaks in their own way.',
    useCases: [
      'Check page titles, snippets, captions, messages, and form text against limits.',
      'Compare character count with and without spaces.',
      'Estimate UTF-8 byte length for technical inputs.',
      'Review line and word counts while editing short text.',
    ],
    examples: [
      { label: 'Page title', expression: 'Free calculator tools for quick everyday math.', result: 'Character total' },
      { label: 'Short message', expression: 'Meeting moved to 2:30 PM.', result: 'Characters and words' },
      { label: 'Technical text', expression: 'Text with line breaks', result: 'Lines and UTF-8 bytes' },
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
    summary: 'Convert oven temperatures between Fahrenheit, Celsius, and common gas mark settings.',
    description:
      'Use this free oven temperature converter to translate recipe oven settings between Fahrenheit, Celsius, and gas mark approximations.',
    icon: 'tool-oven-temp',
    aliases: ['Oven Temp Converter', 'Fahrenheit Celsius Gas Mark Converter', 'Baking Temperature Converter'],
    formula:
      'The converter uses F = C x 9 / 5 + 32 and C = (F - 32) x 5 / 9, then finds the nearest common gas mark temperature.',
    limit:
      'Oven settings are approximate. Real ovens can run hot or cold, and this does not replace safe internal food temperature checks.',
    inputExplanations: [
      { term: 'Temperature', meaning: 'The oven setting from the recipe.' },
      { term: 'Unit', meaning: 'Whether the recipe uses Fahrenheit, Celsius, or gas mark.' },
    ],
    extraFaq: [
      {
        question: 'Is gas mark exact?',
        answer:
          'No. Gas mark is usually treated as a practical oven setting with common approximate Fahrenheit and Celsius equivalents. Use the nearest mark and watch the food.',
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
      'Check a baking temperature before preheating.',
      'Explain why oven setting and food internal temperature are different.',
    ],
    examples: [
      { label: 'Common bake temp', expression: '350 F', result: 'About 177 C, gas mark 4' },
      { label: 'Celsius recipe', expression: '180 C', result: 'About 356 F' },
      { label: 'Gas mark recipe', expression: 'Gas mark 4', result: 'About 350 F' },
    ],
    relatedSlugs: ['cooking-measurement-converter', 'recipe-scaler', 'conversion-calculator'],
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
      'Build simple tool, feature, or checklist tables for content planning.',
    ],
    examples: [
      { label: 'Tool table', expression: 'Tool, Use, Status plus two rows', result: 'GitHub-flavored Markdown table' },
      { label: 'Feature matrix', expression: 'Feature | Free | Notes', result: 'Pipe-style markdown table' },
      { label: 'Simple report', expression: 'Metric, Value with two rows', result: 'Right-aligned markdown table' },
    ],
    relatedSlugs: ['word-counter', 'character-counter', 'css-clamp-calculator'],
  }),
];
