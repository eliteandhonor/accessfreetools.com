import type { CategorySlug } from './categories';
import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface UtilityToolSpec {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  icon: string;
  formula: string;
  limit: string;
  useCases: string[];
  examples: ToolExample[];
  relatedSlugs: string[];
}

function makeFaq(spec: UtilityToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it when your task matches one of these common needs: ${exampleUses} It works best when you already know the values, dates, units, or settings the page asks for.`,
    },
    {
      question: `What is the ${spec.name} doing with my inputs?`,
      answer: `In plain language: ${spec.formula} The examples on the page are there so you can compare your inputs with a filled-out calculation before copying the answer.`,
    },
    {
      question: 'What should I double-check before trusting the answer?',
      answer: `${spec.limit} Also check that you used the right unit, date, scale, or mode because small input changes can change the result.`,
    },
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
      { label: 'Born Jan 1, 2000', expression: '2000-01-01 to 2026-04-29', result: '26 years, 3 months, 28 days' },
      { label: 'Leap day birthday', expression: '2004-02-29 to 2026-04-29', result: 'Leap-aware calendar age' },
      { label: 'Birthday today', expression: '2010-04-29 to 2026-04-29', result: '16 years, 0 months, 0 days' },
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
      { label: 'Rest of 2026', expression: '2026-04-29 to 2026-12-31', result: '246 days' },
      { label: 'Add 1 month, 2 weeks, 3 days', expression: '2026-04-29 + 0y 1m 2w 3d', result: '2026-06-15' },
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
    category: 'calculators',
    summary: 'Estimate concrete volume for a slab in cubic feet, cubic yards, and bags.',
    description:
      'Use this free concrete calculator to estimate slab volume from length, width, depth, waste percentage, cubic yards, cubic meters, and bag counts.',
    icon: 'calculator-concrete',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, adds waste percentage, and converts cubic feet to cubic yards.',
    limit:
      'This is a planning estimate. Forms, uneven ground, compaction, reinforcement, waste, truck minimums, and exact bag yield can change what you need.',
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
      { label: 'New York', expression: '2026-04-29 12:00 UTC', result: 'Local time in America/New_York' },
      { label: 'London', expression: '2026-04-29 12:00 UTC', result: 'Local time in Europe/London' },
      { label: 'Tokyo', expression: '2026-04-29 12:00 UTC', result: 'Local time in Asia/Tokyo' },
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
    summary: 'Calculate mass from density and volume.',
    description:
      'Use this free mass calculator to multiply density by volume and estimate mass with formula steps and a custom unit label.',
    icon: 'calculator-mass',
    formula:
      'The calculator uses mass = density x volume. Density and volume must be in matching units for the result label to make sense.',
    limit:
      'This is a formula helper, not a scale. Material density, temperature, moisture, and measurement precision can change real mass.',
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
      { label: 'Today', expression: '2026-04-29', result: 'Wednesday' },
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
    useCases: [
      'Estimate voltage drop for a branch circuit run.',
      'Compare common copper AWG wire sizes.',
      'Check percent voltage drop from source voltage.',
      'See load voltage after the estimated drop.',
    ],
    examples: [
      { label: 'Branch run', expression: '120 V, 15 A, 75 ft, 12 AWG copper', result: 'Voltage drop estimate' },
      { label: 'Longer 240 V run', expression: '240 V, 30 A, 100 ft, 8 AWG copper', result: 'Percent drop estimate' },
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
    useCases: [
      'Estimate a window or room air conditioner size.',
      'Adjust for sunny or shaded rooms.',
      'Account for extra people and kitchen heat.',
      'Avoid buying a unit that is wildly under- or oversized.',
    ],
    examples: [
      { label: 'Bedroom', expression: '180 ft2, 8 ft ceiling', result: 'Approximate room BTU' },
      { label: 'Sunny room', expression: '420 ft2, 9 ft ceiling, sunny, 3 people', result: 'Adjusted BTU estimate' },
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
    useCases: [
      'Estimate a simple straight stair layout.',
      'Find actual riser height after rounding to a whole step count.',
      'Estimate total horizontal run.',
      'Check the stair angle for planning conversation.',
    ],
    examples: [
      { label: 'Basement rise', expression: '108 in rise, 7.5 in target riser, 10 in tread', result: '14 risers' },
      { label: 'Deck rise', expression: '36 in rise, 7 in target riser, 11 in tread', result: 'Simple stair estimate' },
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
    useCases: [
      'Decode a common 4-band resistor.',
      'See the tolerance range around the nominal resistance.',
      'Check a breadboard or electronics study example.',
      'Compare resistor values before using Ohm law.',
    ],
    examples: [
      { label: '1 kOhm', expression: 'brown black red gold', result: '1,000 ohms +/- 5%' },
      { label: '4.7 kOhm', expression: 'yellow violet red gold', result: '4,700 ohms +/- 5%' },
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
    useCases: [
      'Find resistance from voltage and current.',
      'Find current from voltage and resistance.',
      'Find voltage from current and resistance.',
      'Estimate power after the core values are known.',
    ],
    examples: [
      { label: 'Voltage and current', expression: '12 V and 2 A', result: '6 ohms and 24 W' },
      { label: 'Current and resistance', expression: '2 A and 6 ohms', result: '12 V and 24 W' },
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
    useCases: [
      'Estimate appliance energy use.',
      'Compare a heater, AC, computer, or light over time.',
      'Turn watts and usage time into kWh.',
      'Multiply kWh by your local rate.',
    ],
    examples: [
      { label: 'Space heater', expression: '1,500 W, 4 h/day, 30 days, $0.16/kWh', result: '$28.80' },
      { label: 'LED bulb', expression: '10 W, 5 h/day, 365 days, $0.16/kWh', result: 'Low yearly estimate' },
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
    useCases: [
      'Calculate molarity from moles and liters.',
      'Calculate moles from grams and molar mass first.',
      'Check chemistry homework setup.',
      'Use molecular weight output as a molar mass input.',
    ],
    examples: [
      { label: 'Simple molarity', expression: '0.5 mol / 1 L', result: '0.5 M' },
      { label: 'NaCl grams', expression: '58.44 g / 58.44 g/mol / 1 L', result: '1 M' },
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
    ],
    relatedSlugs: ['conversion-calculator', 'speed-calculator', 'mileage-calculator'],
  }),
  makeUtilityTool({
    slug: 'roofing-calculator',
    name: 'Roofing Calculator',
    category: 'calculators',
    summary: 'Estimate roof squares and shingle bundles from footprint, pitch, and waste.',
    description:
      'Use this free roofing calculator to estimate roof area, roofing squares, and shingle bundles for a simple pitched roof.',
    icon: 'calculator-roofing',
    formula:
      'The calculator multiplies footprint area by a pitch factor, adds waste, divides by 100 square feet per roofing square, and estimates 3 bundles per square.',
    limit:
      'Complex roofs, valleys, hips, dormers, openings, product coverage, and local installation practices can change material needs.',
    useCases: [
      'Estimate roof squares for a simple footprint.',
      'Adjust for roof pitch and waste.',
      'Estimate shingle bundles at 3 bundles per square.',
      'Prepare a rough number before contractor measurement.',
    ],
    examples: [
      { label: 'Simple roof', expression: '40 ft x 30 ft, 6/12 pitch, 10% waste', result: 'Roof squares and bundles' },
      { label: 'Low pitch', expression: '30 ft x 24 ft, 3/12 pitch', result: 'Pitch-adjusted area' },
    ],
    relatedSlugs: ['square-footage-calculator', 'area-calculator', 'slope-calculator'],
  }),
  makeUtilityTool({
    slug: 'tile-calculator',
    name: 'Tile Calculator',
    category: 'calculators',
    summary: 'Estimate tile count from area, tile size, and waste percentage.',
    description:
      'Use this free tile calculator to estimate how many tiles you need from project square feet and tile dimensions.',
    icon: 'calculator-tile',
    formula:
      'The calculator converts tile length and width from square inches to square feet, adds waste to project area, then rounds up the tile count.',
    limit:
      'Real projects need layout planning, cuts, breakage, pattern matching, grout spacing, boxes, and product coverage checks.',
    useCases: [
      'Estimate floor or wall tile count.',
      'Add a waste percentage before buying.',
      'Compare tile sizes for the same room.',
      'Convert tile dimensions into square feet per tile.',
    ],
    examples: [
      { label: '12 inch tile', expression: '120 ft2, 12 x 12 in tile, 10% waste', result: '132 tiles' },
      { label: 'Large format tile', expression: '200 ft2, 12 x 24 in tile', result: 'Tile count estimate' },
    ],
    relatedSlugs: ['square-footage-calculator', 'area-calculator', 'conversion-calculator'],
  }),
  makeUtilityTool({
    slug: 'mulch-calculator',
    name: 'Mulch Calculator',
    category: 'everyday-tools',
    summary: 'Estimate mulch cubic yards, cubic feet, and 2-cubic-foot bags from area and depth.',
    description:
      'Use this free mulch calculator to estimate bulk cubic yards or common bag counts from square feet, depth, and waste.',
    icon: 'calculator-mulch',
    formula:
      'The calculator converts depth from inches to feet, multiplies by area for cubic feet, adds waste, then divides by 27 for cubic yards.',
    limit:
      'Mulch settles and bag fill can vary. Bed shape, old mulch, slope, and desired finished depth affect real material needs.',
    useCases: [
      'Estimate mulch for a garden bed.',
      'Convert square feet and inches deep into cubic yards.',
      'Estimate common 2-cubic-foot bag count.',
      'Add a small waste buffer before buying.',
    ],
    examples: [
      { label: 'Garden bed', expression: '200 ft2 at 3 in, 5% extra', result: 'About 1.94 yd3' },
      { label: 'Refresh layer', expression: '150 ft2 at 2 in', result: 'Bulk and bag estimate' },
    ],
    relatedSlugs: ['gravel-calculator', 'square-footage-calculator', 'volume-calculator'],
  }),
  makeUtilityTool({
    slug: 'gravel-calculator',
    name: 'Gravel Calculator',
    category: 'everyday-tools',
    summary: 'Estimate gravel cubic yards and tons from length, width, depth, and density.',
    description:
      'Use this free gravel calculator to estimate cubic yards and tons for a rectangular gravel area.',
    icon: 'calculator-gravel',
    formula:
      'The calculator converts depth from inches to feet, multiplies length by width by depth, divides by 27 for cubic yards, then multiplies by tons per cubic yard.',
    limit:
      'Stone type, compaction, moisture, supplier density, and delivery minimums can change the actual order amount.',
    useCases: [
      'Estimate gravel for a path, pad, or driveway section.',
      'Convert cubic feet into cubic yards.',
      'Estimate tons from supplier density.',
      'Check how changing depth changes material needs.',
    ],
    examples: [
      { label: 'Driveway bed', expression: '20 ft x 10 ft x 3 in, 1.4 tons/yd3', result: 'Cubic yards and tons' },
      { label: 'Path', expression: '30 ft x 3 ft x 2 in', result: 'Material estimate' },
    ],
    relatedSlugs: ['mulch-calculator', 'volume-calculator', 'square-footage-calculator'],
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
    useCases: [
      'Estimate wind chill before going outside.',
      'Compare actual air temperature with feels-like temperature.',
      'Convert the result to Celsius.',
      'Understand wind chill limits and safety notes.',
    ],
    examples: [
      { label: 'Cold windy day', expression: '30 F and 15 mph', result: 'Feels colder than 30 F' },
      { label: 'Freezing wind', expression: '20 F and 25 mph', result: 'Wind chill estimate' },
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
      'The calculator uses the National Weather Service Rothfusz regression for heat index and applies the standard humidity adjustments.',
    limit:
      'Heat risk depends on sun, exertion, wind, hydration, clothing, health, and local warnings. Do not rely on a calculator alone.',
    useCases: [
      'Estimate how hot humid weather feels.',
      'Compare air temperature with heat index.',
      'Convert apparent temperature to Celsius.',
      'Understand why humidity changes heat stress.',
    ],
    examples: [
      { label: 'Humid heat', expression: '90 F and 70% RH', result: 'Higher apparent temperature' },
      { label: 'Dryer heat', expression: '95 F and 35% RH', result: 'Adjusted heat index' },
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
    useCases: [
      'Estimate dew point from weather readings.',
      'Compare humidity comfort more clearly than relative humidity alone.',
      'Convert dew point between Fahrenheit and Celsius.',
      'Use with heat index for weather context.',
    ],
    examples: [
      { label: 'Humid day', expression: '75 F and 60% RH', result: 'Dew point estimate' },
      { label: 'Dry indoor air', expression: '70 F and 30% RH', result: 'Lower dew point' },
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
    ],
    relatedSlugs: ['percentage-calculator', 'average-calculator', 'rounding-calculator'],
  }),
];
