import { useMemo, useState, type HTMLAttributes } from 'react';
import {
  calculateAge,
  calculateConcrete,
  calculateDateDifference,
  calculateDateShift,
  calculateGpa,
  calculateHoursWorked,
  calculateNeededFinalGrade,
  calculateSubnet,
  calculateTimeDuration,
  convertMeasurement,
  formatCalculatorNumber,
  generatePassword,
  type ConversionCategory,
  type GpaCourseInput,
} from '../lib/calculator';

export type UtilityToolVariant =
  | 'age'
  | 'date'
  | 'time'
  | 'hours'
  | 'gpa'
  | 'grade'
  | 'concrete'
  | 'subnet'
  | 'password-generator'
  | 'conversion';

type InputMode = HTMLAttributes<HTMLInputElement>['inputMode'];
type UtilityInputs = Record<string, string>;

interface SelectOption {
  label: string;
  value: string;
}

interface UtilityField {
  key: string;
  label: string;
  type?: 'number' | 'select' | 'date' | 'time' | 'checkbox' | 'text';
  inputMode?: InputMode;
  placeholder?: string;
  options?: SelectOption[];
}

interface UtilityExample {
  label: string;
  inputs: UtilityInputs;
}

interface UtilityMode {
  id: string;
  label: string;
  symbol: string;
  fields: UtilityField[];
  defaultInputs: UtilityInputs;
  examples: UtilityExample[];
}

interface UtilityConfig {
  title: string;
  buttonLabel: string;
  emptyHistory: string;
  privacyNote: string;
  modes: UtilityMode[];
}

interface UtilityCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
  note?: string;
  keepOutOfHistory?: boolean;
}

interface Props {
  variant: UtilityToolVariant;
}

const numberInput: InputMode = 'decimal';
const integerInput: InputMode = 'numeric';

const numberField = (key: string, label: string, placeholder?: string): UtilityField => ({
  key,
  label,
  placeholder,
  inputMode: numberInput,
  type: 'number',
});
const integerField = (key: string, label: string, placeholder?: string): UtilityField => ({
  key,
  label,
  placeholder,
  inputMode: integerInput,
  type: 'number',
});
const dateField = (key: string, label: string): UtilityField => ({ key, label, type: 'date' });
const timeField = (key: string, label: string): UtilityField => ({ key, label, type: 'time' });
const textField = (key: string, label: string, placeholder?: string): UtilityField => ({ key, label, placeholder, type: 'text' });
const checkboxField = (key: string, label: string): UtilityField => ({ key, label, type: 'checkbox' });
const selectField = (key: string, label: string, options: SelectOption[]): UtilityField => ({
  key,
  label,
  type: 'select',
  options,
});

const directionOptions: SelectOption[] = [
  { label: 'Add', value: 'add' },
  { label: 'Subtract', value: 'subtract' },
];

const operationOptions: SelectOption[] = [
  { label: 'Add', value: 'add' },
  { label: 'Subtract', value: 'subtract' },
];

const gradeOptions: SelectOption[] = [
  { label: 'A+', value: 'A+' },
  { label: 'A', value: 'A' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B', value: 'B' },
  { label: 'B-', value: 'B-' },
  { label: 'C+', value: 'C+' },
  { label: 'C', value: 'C' },
  { label: 'C-', value: 'C-' },
  { label: 'D+', value: 'D+' },
  { label: 'D', value: 'D' },
  { label: 'D-', value: 'D-' },
  { label: 'F', value: 'F' },
];

const conversionUnitOptions: Record<ConversionCategory, SelectOption[]> = {
  length: [
    { label: 'Millimeters', value: 'millimeter' },
    { label: 'Centimeters', value: 'centimeter' },
    { label: 'Meters', value: 'meter' },
    { label: 'Kilometers', value: 'kilometer' },
    { label: 'Inches', value: 'inch' },
    { label: 'Feet', value: 'foot' },
    { label: 'Yards', value: 'yard' },
    { label: 'Miles', value: 'mile' },
  ],
  mass: [
    { label: 'Milligrams', value: 'milligram' },
    { label: 'Grams', value: 'gram' },
    { label: 'Kilograms', value: 'kilogram' },
    { label: 'Ounces', value: 'ounce' },
    { label: 'Pounds', value: 'pound' },
    { label: 'Short tons', value: 'ton' },
  ],
  volume: [
    { label: 'Milliliters', value: 'milliliter' },
    { label: 'Liters', value: 'liter' },
    { label: 'Cubic meters', value: 'cubic-meter' },
    { label: 'Teaspoons', value: 'teaspoon' },
    { label: 'Tablespoons', value: 'tablespoon' },
    { label: 'Fluid ounces', value: 'fluid-ounce' },
    { label: 'Cups', value: 'cup' },
    { label: 'Pints', value: 'pint' },
    { label: 'Quarts', value: 'quart' },
    { label: 'Gallons', value: 'gallon' },
  ],
  temperature: [
    { label: 'Celsius', value: 'celsius' },
    { label: 'Fahrenheit', value: 'fahrenheit' },
    { label: 'Kelvin', value: 'kelvin' },
  ],
};

const utilityConfigs: Record<UtilityToolVariant, UtilityConfig> = {
  age: {
    title: 'Age Calculator',
    buttonLabel: 'Calculate age',
    emptyHistory: 'Recent age calculations will appear here.',
    privacyNote: 'Age calculations use calendar dates in the browser and do not send birth dates to a server.',
    modes: [
      {
        id: 'age',
        label: 'Age',
        symbol: 'AGE',
        fields: [dateField('birthDate', 'Birth date'), dateField('asOfDate', 'Age on date')],
        defaultInputs: { birthDate: '2000-01-01', asOfDate: '2026-04-29' },
        examples: [
          { label: 'Born Jan 1, 2000', inputs: { birthDate: '2000-01-01', asOfDate: '2026-04-29' } },
          { label: 'Leap day birthday', inputs: { birthDate: '2004-02-29', asOfDate: '2026-04-29' } },
          { label: 'Birthday today', inputs: { birthDate: '2010-04-29', asOfDate: '2026-04-29' } },
        ],
      },
    ],
  },
  date: {
    title: 'Date Calculator',
    buttonLabel: 'Calculate date',
    emptyHistory: 'Recent date calculations will appear here.',
    privacyNote: 'Date math uses UTC calendar dates to avoid daylight-saving time shifts.',
    modes: [
      {
        id: 'difference',
        label: 'Difference',
        symbol: 'DAYS',
        fields: [dateField('startDate', 'Start date'), dateField('endDate', 'End date')],
        defaultInputs: { startDate: '2026-04-29', endDate: '2026-12-31' },
        examples: [
          { label: 'Rest of 2026', inputs: { startDate: '2026-04-29', endDate: '2026-12-31' } },
          { label: 'Project window', inputs: { startDate: '2026-05-01', endDate: '2026-08-15' } },
          { label: 'Backward check', inputs: { startDate: '2026-10-01', endDate: '2026-09-01' } },
        ],
      },
      {
        id: 'shift',
        label: 'Add or subtract',
        symbol: '+/-',
        fields: [
          dateField('startDate', 'Start date'),
          selectField('direction', 'Direction', directionOptions),
          integerField('years', 'Years'),
          integerField('months', 'Months'),
          integerField('weeks', 'Weeks'),
          integerField('days', 'Days'),
        ],
        defaultInputs: { startDate: '2026-04-29', direction: 'add', years: '0', months: '1', weeks: '2', days: '3' },
        examples: [
          { label: '45-ish days out', inputs: { startDate: '2026-04-29', direction: 'add', years: '0', months: '1', weeks: '2', days: '3' } },
          { label: 'Subtract 90 days', inputs: { startDate: '2026-12-31', direction: 'subtract', years: '0', months: '0', weeks: '12', days: '6' } },
          { label: 'One year ahead', inputs: { startDate: '2026-04-29', direction: 'add', years: '1', months: '0', weeks: '0', days: '0' } },
        ],
      },
    ],
  },
  time: {
    title: 'Time Calculator',
    buttonLabel: 'Calculate time',
    emptyHistory: 'Recent time calculations will appear here.',
    privacyNote: 'Time calculations stay in this browser tab and use duration math, not time-zone lookup.',
    modes: [
      {
        id: 'duration',
        label: 'Durations',
        symbol: 'H:M:S',
        fields: [
          integerField('firstHours', 'First hours'),
          integerField('firstMinutes', 'First minutes'),
          integerField('firstSeconds', 'First seconds'),
          selectField('operation', 'Operation', operationOptions),
          integerField('secondHours', 'Second hours'),
          integerField('secondMinutes', 'Second minutes'),
          integerField('secondSeconds', 'Second seconds'),
        ],
        defaultInputs: {
          firstHours: '2',
          firstMinutes: '45',
          firstSeconds: '30',
          operation: 'add',
          secondHours: '1',
          secondMinutes: '20',
          secondSeconds: '45',
        },
        examples: [
          { label: 'Add two times', inputs: { firstHours: '2', firstMinutes: '45', firstSeconds: '30', operation: 'add', secondHours: '1', secondMinutes: '20', secondSeconds: '45' } },
          { label: 'Subtract time', inputs: { firstHours: '5', firstMinutes: '0', firstSeconds: '0', operation: 'subtract', secondHours: '1', secondMinutes: '35', secondSeconds: '15' } },
          { label: 'Seconds cleanup', inputs: { firstHours: '0', firstMinutes: '59', firstSeconds: '50', operation: 'add', secondHours: '0', secondMinutes: '0', secondSeconds: '25' } },
        ],
      },
    ],
  },
  hours: {
    title: 'Hours Calculator',
    buttonLabel: 'Calculate hours',
    emptyHistory: 'Recent hour calculations will appear here.',
    privacyNote: 'Hours and pay estimates are simple time-card math and not payroll advice.',
    modes: [
      {
        id: 'hours',
        label: 'Shift',
        symbol: 'TIME',
        fields: [
          timeField('startTime', 'Start time'),
          timeField('endTime', 'End time'),
          integerField('breakMinutes', 'Break minutes'),
          numberField('hourlyRate', 'Hourly rate ($, optional)', 'Optional'),
        ],
        defaultInputs: { startTime: '09:00', endTime: '17:30', breakMinutes: '30', hourlyRate: '25' },
        examples: [
          { label: '9 to 5:30', inputs: { startTime: '09:00', endTime: '17:30', breakMinutes: '30', hourlyRate: '25' } },
          { label: 'No break', inputs: { startTime: '08:15', endTime: '16:00', breakMinutes: '0', hourlyRate: '' } },
          { label: 'Overnight shift', inputs: { startTime: '22:00', endTime: '06:30', breakMinutes: '45', hourlyRate: '32' } },
        ],
      },
    ],
  },
  gpa: {
    title: 'GPA Calculator',
    buttonLabel: 'Calculate GPA',
    emptyHistory: 'Recent GPA calculations will appear here.',
    privacyNote: 'GPA scales vary by school. This tool uses a common unweighted 4.0 scale unless your school says otherwise.',
    modes: [
      {
        id: 'gpa',
        label: 'Courses',
        symbol: '4.0',
        fields: [
          numberField('credits1', 'Course 1 credits'),
          selectField('grade1', 'Course 1 grade', gradeOptions),
          numberField('credits2', 'Course 2 credits'),
          selectField('grade2', 'Course 2 grade', gradeOptions),
          numberField('credits3', 'Course 3 credits'),
          selectField('grade3', 'Course 3 grade', gradeOptions),
          numberField('credits4', 'Course 4 credits'),
          selectField('grade4', 'Course 4 grade', gradeOptions),
        ],
        defaultInputs: { credits1: '3', grade1: 'A', credits2: '4', grade2: 'B+', credits3: '3', grade3: 'A-', credits4: '2', grade4: 'B' },
        examples: [
          { label: 'Four classes', inputs: { credits1: '3', grade1: 'A', credits2: '4', grade2: 'B+', credits3: '3', grade3: 'A-', credits4: '2', grade4: 'B' } },
          { label: 'All A term', inputs: { credits1: '3', grade1: 'A', credits2: '3', grade2: 'A', credits3: '4', grade3: 'A', credits4: '0', grade4: 'A' } },
          { label: 'Mixed credits', inputs: { credits1: '4', grade1: 'B', credits2: '4', grade2: 'A-', credits3: '2', grade3: 'C+', credits4: '1', grade4: 'A' } },
        ],
      },
    ],
  },
  grade: {
    title: 'Grade Calculator',
    buttonLabel: 'Calculate needed grade',
    emptyHistory: 'Recent grade calculations will appear here.',
    privacyNote: 'Grade policies vary by class. Use your syllabus weights when you need an exact school calculation.',
    modes: [
      {
        id: 'needed-final',
        label: 'Needed final',
        symbol: 'GOAL',
        fields: [
          numberField('currentGradePercent', 'Current grade (%)'),
          numberField('finalWeightPercent', 'Final weight (%)'),
          numberField('desiredGradePercent', 'Desired course grade (%)'),
        ],
        defaultInputs: { currentGradePercent: '87', finalWeightPercent: '30', desiredGradePercent: '90' },
        examples: [
          { label: 'Aim for A-', inputs: { currentGradePercent: '87', finalWeightPercent: '30', desiredGradePercent: '90' } },
          { label: 'Pass the class', inputs: { currentGradePercent: '62', finalWeightPercent: '40', desiredGradePercent: '70' } },
          { label: 'Final is small', inputs: { currentGradePercent: '91', finalWeightPercent: '15', desiredGradePercent: '90' } },
        ],
      },
    ],
  },
  concrete: {
    title: 'Concrete Calculator',
    buttonLabel: 'Estimate concrete',
    emptyHistory: 'Recent concrete estimates will appear here.',
    privacyNote: 'Concrete estimates are planning numbers. Site conditions, forms, compaction, ordering rules, and waste can change real needs.',
    modes: [
      {
        id: 'slab',
        label: 'Slab',
        symbol: 'YD3',
        fields: [
          numberField('lengthFeet', 'Length (ft)'),
          numberField('widthFeet', 'Width (ft)'),
          numberField('depthInches', 'Depth (in)'),
          numberField('wastePercent', 'Extra waste (%)'),
        ],
        defaultInputs: { lengthFeet: '10', widthFeet: '12', depthInches: '4', wastePercent: '10' },
        examples: [
          { label: '10 x 12 slab', inputs: { lengthFeet: '10', widthFeet: '12', depthInches: '4', wastePercent: '10' } },
          { label: 'Walkway', inputs: { lengthFeet: '24', widthFeet: '3', depthInches: '4', wastePercent: '10' } },
          { label: 'Small pad', inputs: { lengthFeet: '6', widthFeet: '6', depthInches: '3.5', wastePercent: '5' } },
        ],
      },
    ],
  },
  subnet: {
    title: 'Subnet Calculator',
    buttonLabel: 'Calculate subnet',
    emptyHistory: 'Recent subnet calculations will appear here.',
    privacyNote: 'Subnet calculations run locally and are for IPv4 CIDR planning and learning.',
    modes: [
      {
        id: 'ipv4',
        label: 'IPv4 CIDR',
        symbol: '/24',
        fields: [textField('ipAddress', 'IP address', '192.168.1.10'), integerField('prefixLength', 'Prefix length')],
        defaultInputs: { ipAddress: '192.168.1.10', prefixLength: '24' },
        examples: [
          { label: 'Home LAN /24', inputs: { ipAddress: '192.168.1.10', prefixLength: '24' } },
          { label: 'Small subnet /28', inputs: { ipAddress: '10.0.5.17', prefixLength: '28' } },
          { label: 'Point-to-point /31', inputs: { ipAddress: '172.16.0.8', prefixLength: '31' } },
        ],
      },
    ],
  },
  'password-generator': {
    title: 'Password Generator',
    buttonLabel: 'Generate password',
    emptyHistory: 'Generated passwords are not saved in recent history.',
    privacyNote: 'Generated passwords are created in your browser. Copy them into a trusted password manager and do not reuse them.',
    modes: [
      {
        id: 'password',
        label: 'Password',
        symbol: 'KEY',
        fields: [
          integerField('length', 'Length'),
          checkboxField('includeUppercase', 'Uppercase letters'),
          checkboxField('includeLowercase', 'Lowercase letters'),
          checkboxField('includeNumbers', 'Numbers'),
          checkboxField('includeSymbols', 'Symbols'),
          checkboxField('avoidAmbiguous', 'Avoid ambiguous characters'),
        ],
        defaultInputs: {
          length: '20',
          includeUppercase: 'true',
          includeLowercase: 'true',
          includeNumbers: 'true',
          includeSymbols: 'true',
          avoidAmbiguous: 'true',
        },
        examples: [
          { label: 'Strong default', inputs: { length: '20', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'true', avoidAmbiguous: 'true' } },
          { label: 'Long readable', inputs: { length: '24', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'false', avoidAmbiguous: 'true' } },
          { label: 'Maximum mix', inputs: { length: '32', includeUppercase: 'true', includeLowercase: 'true', includeNumbers: 'true', includeSymbols: 'true', avoidAmbiguous: 'false' } },
        ],
      },
    ],
  },
  conversion: {
    title: 'Conversion Calculator',
    buttonLabel: 'Convert value',
    emptyHistory: 'Recent conversions will appear here.',
    privacyNote: 'Conversions use fixed unit factors in the browser and do not send values to a server.',
    modes: [
      {
        id: 'length',
        label: 'Length',
        symbol: 'm',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.length),
          selectField('toUnit', 'To', conversionUnitOptions.length),
        ],
        defaultInputs: { value: '12', fromUnit: 'foot', toUnit: 'meter' },
        examples: [
          { label: 'Feet to meters', inputs: { value: '12', fromUnit: 'foot', toUnit: 'meter' } },
          { label: 'Miles to km', inputs: { value: '5', fromUnit: 'mile', toUnit: 'kilometer' } },
          { label: 'Inches to cm', inputs: { value: '72', fromUnit: 'inch', toUnit: 'centimeter' } },
        ],
      },
      {
        id: 'mass',
        label: 'Mass',
        symbol: 'kg',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.mass),
          selectField('toUnit', 'To', conversionUnitOptions.mass),
        ],
        defaultInputs: { value: '150', fromUnit: 'pound', toUnit: 'kilogram' },
        examples: [
          { label: 'Pounds to kg', inputs: { value: '150', fromUnit: 'pound', toUnit: 'kilogram' } },
          { label: 'Ounces to grams', inputs: { value: '16', fromUnit: 'ounce', toUnit: 'gram' } },
          { label: 'Kg to pounds', inputs: { value: '70', fromUnit: 'kilogram', toUnit: 'pound' } },
        ],
      },
      {
        id: 'volume',
        label: 'Volume',
        symbol: 'L',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.volume),
          selectField('toUnit', 'To', conversionUnitOptions.volume),
        ],
        defaultInputs: { value: '1', fromUnit: 'gallon', toUnit: 'liter' },
        examples: [
          { label: 'Gallons to liters', inputs: { value: '1', fromUnit: 'gallon', toUnit: 'liter' } },
          { label: 'Cups to mL', inputs: { value: '2', fromUnit: 'cup', toUnit: 'milliliter' } },
          { label: 'Liters to quarts', inputs: { value: '3', fromUnit: 'liter', toUnit: 'quart' } },
        ],
      },
      {
        id: 'temperature',
        label: 'Temperature',
        symbol: 'C/F',
        fields: [
          numberField('value', 'Value'),
          selectField('fromUnit', 'From', conversionUnitOptions.temperature),
          selectField('toUnit', 'To', conversionUnitOptions.temperature),
        ],
        defaultInputs: { value: '72', fromUnit: 'fahrenheit', toUnit: 'celsius' },
        examples: [
          { label: 'F to C', inputs: { value: '72', fromUnit: 'fahrenheit', toUnit: 'celsius' } },
          { label: 'C to F', inputs: { value: '20', fromUnit: 'celsius', toUnit: 'fahrenheit' } },
          { label: 'C to K', inputs: { value: '0', fromUnit: 'celsius', toUnit: 'kelvin' } },
        ],
      },
    ],
  },
};

function parseNumber(value: string, label: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required`);
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }

  return parsed;
}

function parseOptionalNumber(value: string, label: string) {
  if (!value.trim()) return undefined;
  return parseNumber(value, label);
}

function money(value: number) {
  return value.toLocaleString('en-US', {
    currency: 'USD',
    maximumFractionDigits: 2,
    style: 'currency',
  });
}

function percent(value: number) {
  return `${formatCalculatorNumber(value)}%`;
}

function dateText(value: string) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });
}

function unitLabel(value: string) {
  return value.replace(/-/g, ' ');
}

function durationText(totalSeconds: number) {
  const sign = totalSeconds < 0 ? '-' : '';
  let remaining = Math.abs(Math.round(totalSeconds));
  const hours = Math.floor(remaining / 3600);
  remaining -= hours * 3600;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining - minutes * 60;
  return `${sign}${hours}h ${minutes}m ${seconds}s`;
}

function booleanInput(value: string) {
  return value === 'true';
}

function updateCheckedValue(checked: boolean) {
  return checked ? 'true' : 'false';
}

function readCourses(inputs: UtilityInputs): GpaCourseInput[] {
  const courses: GpaCourseInput[] = [];

  for (let index = 1; index <= 4; index += 1) {
    const credits = inputs[`credits${index}`]?.trim();
    const grade = inputs[`grade${index}`]?.trim();

    if (!credits || Number(credits) === 0) continue;

    courses.push({
      credits: parseNumber(credits, `Course ${index} credits`),
      grade: grade || 'F',
      name: `Course ${index}`,
    });
  }

  return courses;
}

function calculateUtility(variant: UtilityToolVariant, modeId: string, inputs: UtilityInputs): UtilityCalculation {
  switch (variant) {
    case 'age': {
      const result = calculateAge(inputs.birthDate, inputs.asOfDate);
      return {
        label: 'Calendar age',
        expression: `${dateText(result.birthDate)} to ${dateText(result.asOfDate)}`,
        answer: `${result.years} years, ${result.months} months, ${result.days} days`,
        metrics: [
          { label: 'Total days', value: formatCalculatorNumber(result.totalDays) },
          { label: 'Next birthday', value: dateText(result.nextBirthday) },
          { label: 'Days until next birthday', value: formatCalculatorNumber(result.daysUntilNextBirthday) },
        ],
        steps: [
          'Compare the birth date with the selected as-of date.',
          'Subtract full years first, then remaining full months, then remaining days.',
          'Count total days separately using UTC calendar dates.',
        ],
      };
    }
    case 'date': {
      if (modeId === 'shift') {
        const result = calculateDateShift(
          inputs.startDate,
          parseNumber(inputs.years, 'Years'),
          parseNumber(inputs.months, 'Months'),
          parseNumber(inputs.weeks, 'Weeks'),
          parseNumber(inputs.days, 'Days'),
          (inputs.direction || 'add') as 'add' | 'subtract',
        );
        return {
          label: result.direction === 'add' ? 'Date after adding time' : 'Date after subtracting time',
          expression: `${dateText(result.startDate)} ${result.direction} ${result.years}y ${result.months}m ${result.weeks}w ${result.days}d`,
          answer: dateText(result.resultDate),
          metrics: [
            { label: 'Result date', value: result.resultDate },
            { label: 'Months shifted first', value: `${formatCalculatorNumber(result.years * 12 + result.months)} months` },
            { label: 'Extra day shift', value: `${formatCalculatorNumber(result.weeks * 7 + result.days)} days` },
          ],
          steps: [
            'Start with the selected calendar date.',
            'Apply years and months first, clamping month-end dates when needed.',
            'Apply weeks and days after the month shift.',
          ],
        };
      }

      const result = calculateDateDifference(inputs.startDate, inputs.endDate);
      return {
        label: 'Date difference',
        expression: `${dateText(result.startDate)} to ${dateText(result.endDate)}`,
        answer: `${formatCalculatorNumber(result.days)} days`,
        metrics: [
          { label: 'Weeks and days', value: `${result.weeks} weeks, ${result.remainingDays} days` },
          { label: 'Calendar difference', value: `${result.calendarYears}y ${result.calendarMonths}m ${result.calendarDays}d` },
          { label: 'Direction', value: result.direction },
        ],
        steps: [
          'Convert both dates to UTC calendar dates.',
          'Subtract the timestamps to count full days between dates.',
          'Also compare calendar year, month, and day parts for a human-readable difference.',
        ],
      };
    }
    case 'time': {
      const result = calculateTimeDuration(
        {
          hours: parseNumber(inputs.firstHours, 'First hours'),
          minutes: parseNumber(inputs.firstMinutes, 'First minutes'),
          seconds: parseNumber(inputs.firstSeconds, 'First seconds'),
        },
        {
          hours: parseNumber(inputs.secondHours, 'Second hours'),
          minutes: parseNumber(inputs.secondMinutes, 'Second minutes'),
          seconds: parseNumber(inputs.secondSeconds, 'Second seconds'),
        },
        (inputs.operation || 'add') as 'add' | 'subtract',
      );
      return {
        label: 'Time duration result',
        expression: `${inputs.firstHours}:${inputs.firstMinutes}:${inputs.firstSeconds} ${inputs.operation === 'subtract' ? '-' : '+'} ${inputs.secondHours}:${inputs.secondMinutes}:${inputs.secondSeconds}`,
        answer: durationText(result.totalSeconds),
        metrics: [
          { label: 'Total seconds', value: formatCalculatorNumber(result.totalSeconds) },
          { label: 'Decimal hours', value: formatCalculatorNumber(result.totalSeconds / 3600) },
          { label: 'Operation', value: inputs.operation === 'subtract' ? 'Subtract' : 'Add' },
        ],
        steps: [
          'Convert each duration to total seconds.',
          'Add or subtract the second duration.',
          'Convert the final seconds back to hours, minutes, and seconds.',
        ],
      };
    }
    case 'hours': {
      const result = calculateHoursWorked(
        inputs.startTime,
        inputs.endTime,
        parseNumber(inputs.breakMinutes, 'Break minutes'),
        parseOptionalNumber(inputs.hourlyRate, 'Hourly rate'),
      );
      return {
        label: 'Hours worked',
        expression: `${inputs.startTime} to ${inputs.endTime}, ${inputs.breakMinutes || '0'} min break`,
        answer: `${formatCalculatorNumber(result.decimalHours)} hours`,
        metrics: [
          { label: 'Hours and minutes', value: durationText(result.decimalHours * 3600) },
          { label: 'Crossed midnight', value: result.crossedMidnight ? 'Yes' : 'No' },
          { label: 'Gross pay estimate', value: result.grossPay === null ? 'Add hourly rate' : money(result.grossPay) },
        ],
        steps: [
          'Convert start and end times into seconds after midnight.',
          'If the end time is earlier than the start time, treat it as an overnight shift.',
          'Subtract break minutes and convert the worked time to decimal hours.',
        ],
      };
    }
    case 'gpa': {
      const result = calculateGpa(readCourses(inputs));
      return {
        label: 'Estimated GPA',
        expression: `${formatCalculatorNumber(result.totalCredits)} credits`,
        answer: formatCalculatorNumber(result.gpa),
        metrics: [
          { label: 'Total credits', value: formatCalculatorNumber(result.totalCredits) },
          { label: 'Quality points', value: formatCalculatorNumber(result.totalQualityPoints) },
          { label: 'Scale', value: 'Common 4.0 scale' },
        ],
        steps: [
          'Convert each letter grade to grade points on the selected 4.0 scale.',
          'Multiply grade points by course credits to get quality points.',
          'Divide total quality points by total credits.',
        ],
        note: 'Use your school catalog or syllabus if it uses weighted, honors, AP, pass/fail, or plus/minus rules differently.',
      };
    }
    case 'grade': {
      const result = calculateNeededFinalGrade(
        parseNumber(inputs.currentGradePercent, 'Current grade'),
        parseNumber(inputs.finalWeightPercent, 'Final weight'),
        parseNumber(inputs.desiredGradePercent, 'Desired grade'),
      );
      return {
        label: 'Needed final exam grade',
        expression: `${percent(result.currentGradePercent)} current, final worth ${percent(result.finalWeightPercent)}`,
        answer: percent(result.neededFinalPercent),
        metrics: [
          { label: 'Goal', value: percent(result.desiredGradePercent) },
          { label: 'Possible without extra credit', value: result.possibleWithoutExtraCredit ? 'Yes' : 'No' },
          { label: 'Current coursework weight', value: percent(100 - result.finalWeightPercent) },
        ],
        steps: [
          'Convert the final exam weight into a decimal.',
          'Multiply the current grade by the remaining coursework weight.',
          'Solve for the final exam grade needed to reach the desired course grade.',
        ],
      };
    }
    case 'concrete': {
      const result = calculateConcrete({
        lengthFeet: parseNumber(inputs.lengthFeet, 'Length'),
        widthFeet: parseNumber(inputs.widthFeet, 'Width'),
        depthInches: parseNumber(inputs.depthInches, 'Depth'),
        wastePercent: parseNumber(inputs.wastePercent, 'Waste percent'),
      });
      return {
        label: 'Estimated concrete volume',
        expression: `${formatCalculatorNumber(result.lengthFeet)} ft x ${formatCalculatorNumber(result.widthFeet)} ft x ${formatCalculatorNumber(result.depthInches)} in`,
        answer: `${formatCalculatorNumber(result.cubicYards)} yd3`,
        metrics: [
          { label: 'Cubic feet', value: formatCalculatorNumber(result.cubicFeet) },
          { label: 'Cubic meters', value: formatCalculatorNumber(result.cubicMeters) },
          { label: '80 lb bags', value: formatCalculatorNumber(result.bags80lb) },
          { label: '60 lb bags', value: formatCalculatorNumber(result.bags60lb) },
        ],
        steps: [
          'Convert depth from inches to feet.',
          'Multiply length by width by depth to find cubic feet.',
          'Add the waste percentage, then divide by 27 for cubic yards.',
        ],
        note: 'Bag counts use common approximate dry-mix yields. Check the exact bag label before buying.',
      };
    }
    case 'subnet': {
      const result = calculateSubnet(inputs.ipAddress, parseNumber(inputs.prefixLength, 'Prefix length'));
      return {
        label: 'IPv4 subnet',
        expression: `${result.ipAddress}/${result.prefixLength}`,
        answer: `${result.networkAddress}/${result.prefixLength}`,
        metrics: [
          { label: 'Subnet mask', value: result.subnetMask },
          { label: 'Wildcard mask', value: result.wildcardMask },
          { label: 'Broadcast', value: result.broadcastAddress },
          { label: 'Usable range', value: `${result.firstUsableAddress} - ${result.lastUsableAddress}` },
          { label: 'Usable addresses', value: formatCalculatorNumber(result.usableAddresses) },
        ],
        steps: [
          'Convert the IPv4 address and CIDR prefix into 32-bit values.',
          'Build the subnet mask from the prefix length.',
          'Use bitwise network and wildcard math to find network, broadcast, and usable range.',
        ],
      };
    }
    case 'password-generator': {
      const result = generatePassword({
        length: parseNumber(inputs.length, 'Length'),
        includeUppercase: booleanInput(inputs.includeUppercase),
        includeLowercase: booleanInput(inputs.includeLowercase),
        includeNumbers: booleanInput(inputs.includeNumbers),
        includeSymbols: booleanInput(inputs.includeSymbols),
        avoidAmbiguous: booleanInput(inputs.avoidAmbiguous),
      });
      return {
        label: 'Generated password',
        expression: `${result.length} characters, pool size ${result.characterPoolSize}`,
        answer: result.password,
        metrics: [
          { label: 'Length', value: formatCalculatorNumber(result.length) },
          { label: 'Character pool', value: formatCalculatorNumber(result.characterPoolSize) },
          { label: 'Estimated entropy', value: `${formatCalculatorNumber(result.estimatedEntropyBits)} bits` },
        ],
        steps: [
          'Build a character pool from the options you selected.',
          'Use browser cryptographic random values to pick each character.',
          'Do not save generated passwords in the recent-answer panel.',
        ],
        note: 'Use a unique password for every account and store it in a trusted password manager.',
        keepOutOfHistory: true,
      };
    }
    case 'conversion': {
      const category = modeId as ConversionCategory;
      const result = convertMeasurement(category, parseNumber(inputs.value, 'Value'), inputs.fromUnit, inputs.toUnit);
      return {
        label: `${unitLabel(result.fromUnit)} to ${unitLabel(result.toUnit)}`,
        expression: `${formatCalculatorNumber(result.input)} ${unitLabel(result.fromUnit)}`,
        answer: `${formatCalculatorNumber(result.result)} ${unitLabel(result.toUnit)}`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'From', value: unitLabel(result.fromUnit) },
          { label: 'To', value: unitLabel(result.toUnit) },
        ],
        steps: [
          result.category === 'temperature'
            ? 'Convert the starting temperature to Celsius first.'
            : 'Convert the starting unit to the category base unit.',
          result.category === 'temperature'
            ? 'Convert Celsius into the target temperature unit.'
            : 'Divide by the target unit factor to get the converted value.',
          'Round the displayed result for readability while keeping the formula direct.',
        ],
      };
    }
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

export default function UtilityCalculator({ variant }: Props) {
  const config = utilityConfigs[variant];
  const [modeId, setModeId] = useState(config.modes[0].id);
  const activeMode = useMemo(
    () => config.modes.find((mode) => mode.id === modeId) ?? config.modes[0],
    [config.modes, modeId],
  );
  const [inputs, setInputs] = useState<UtilityInputs>(activeMode.defaultInputs);
  const [result, setResult] = useState<UtilityCalculation | null>(() =>
    variant === 'password-generator' ? null : calculateUtility(variant, activeMode.id, activeMode.defaultInputs),
  );
  const [error, setError] = useState('');
  const [history, setHistory] = useState<UtilityCalculation[]>([]);
  const [copied, setCopied] = useState(false);

  function changeMode(nextMode: UtilityMode) {
    setModeId(nextMode.id);
    setInputs(nextMode.defaultInputs);
    setResult(variant === 'password-generator' ? null : calculateUtility(variant, nextMode.id, nextMode.defaultInputs));
    setError('');
    setCopied(false);
  }

  function updateInput(key: string, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  function runCalculation(nextInputs = inputs) {
    try {
      const nextResult = calculateUtility(variant, activeMode.id, nextInputs);
      setResult(nextResult);
      setHistory((current) => (nextResult.keepOutOfHistory ? current : [nextResult, ...current].slice(0, 4)));
      setError('');
      setCopied(false);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Check the inputs and try again.');
      setCopied(false);
    }
  }

  function useExample(example: UtilityExample) {
    setInputs(example.inputs);
    runCalculation(example.inputs);
  }

  async function copyResult() {
    if (!result || !navigator.clipboard) return;
    await navigator.clipboard.writeText(variant === 'password-generator' ? result.answer : `${result.expression} = ${result.answer}`);
    setCopied(true);
  }

  return (
    <section className="advanced-calculator advanced-calculator-utility" aria-label={`${config.title} workspace`}>
      <div className="advanced-panel">
        {config.modes.length > 1 && (
          <div className="advanced-mode-grid" aria-label="Calculator modes">
            {config.modes.map((mode) => (
              <button
                aria-pressed={mode.id === activeMode.id}
                key={mode.id}
                onClick={() => changeMode(mode)}
                type="button"
              >
                <strong>{mode.symbol}</strong>
                <span>{mode.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="advanced-fields utility-fields">
          {activeMode.fields.map((field) => (
            <label className={field.type === 'checkbox' ? 'advanced-field advanced-checkbox-field' : 'advanced-field'} key={field.key}>
              {field.type === 'checkbox' ? (
                <>
                  <input
                    checked={booleanInput(inputs[field.key] ?? '')}
                    onChange={(event) => updateInput(field.key, updateCheckedValue(event.target.checked))}
                    type="checkbox"
                  />
                  <span>{field.label}</span>
                </>
              ) : (
                <>
                  <span>{field.label}</span>
                  {field.type === 'select' ? (
                    <select value={inputs[field.key] ?? ''} onChange={(event) => updateInput(field.key, event.target.value)}>
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      inputMode={field.inputMode}
                      onChange={(event) => updateInput(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      type={field.type === 'date' || field.type === 'time' ? field.type : 'text'}
                      value={inputs[field.key] ?? ''}
                    />
                  )}
                </>
              )}
            </label>
          ))}
        </div>

        <div className="advanced-actions">
          <button className="button-primary" onClick={() => runCalculation()} type="button">
            {config.buttonLabel}
          </button>
          <button className="button-secondary" disabled={!result || Boolean(error)} onClick={copyResult} type="button">
            {copied ? 'Copied' : 'Copy answer'}
          </button>
        </div>

        {error && <p className="calculator-error">{error}</p>}

        {result && (
          <article className="advanced-result-card utility-result-card" aria-live="polite">
            <span>{result.label}</span>
            <strong>{result.answer}</strong>
            <p>{result.expression}</p>
            <dl>
              {result.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            {result.note && <p>{result.note}</p>}
          </article>
        )}

        {result && (
          <div className="advanced-steps">
            <h2>Formula steps</h2>
            <ol>
              {result.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <aside className="advanced-side-panel">
        <div>
          <h2>Examples</h2>
          <div className="advanced-quick-grid utility-example-grid">
            {activeMode.examples.map((example) => (
              <button key={example.label} onClick={() => useExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>{variant === 'password-generator' ? 'Password handling' : 'Recent answers'}</h2>
          {history.length === 0 ? (
            <p>{config.emptyHistory}</p>
          ) : (
            <ol>
              {history.map((item, index) => (
                <li key={`${item.expression}-${index}`}>
                  <span>{item.expression}</span>
                  <strong>{item.answer}</strong>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="advanced-note">
          <p>{config.privacyNote}</p>
          <p>Inputs and recent answers stay in this browser tab and are not sent to a server.</p>
        </div>
      </aside>
    </section>
  );
}
