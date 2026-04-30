import { useMemo, useState, type HTMLAttributes, type KeyboardEvent } from 'react';
import {
  activityLevelFactors,
  addDaysToIsoDate,
  calculateBmi,
  calculateNutritionPoints,
  calculateOverweightBmiCheck,
  calculateUnderweightBmiCheck,
  calculateBodySurfaceArea,
  calculateBoerLeanBodyMass,
  calculateCaloriesBurned,
  calculateDevineIdealWeight,
  calculateDueDateFromLmp,
  calculateGfr2021CkdEpi,
  calculateMacroSplit,
  calculateMifflinStJeor,
  calculateNavyBodyFat,
  calculateOneRepMax,
  calculatePace,
  calculatePregnancyWeightGain,
  calculateProteinGrams,
  calculateTargetHeartRate,
  calculateTdeeFromBmr,
  classifyBodyType,
  daysBetweenIsoDates,
  estimateBac,
  formatCalculatorNumber,
  type ActivityLevel,
  type HealthSex,
} from '../lib/calculator';

export type HealthToolVariant =
  | 'bmi'
  | 'underweight-bmi'
  | 'overweight'
  | 'nutrition-points'
  | 'calorie'
  | 'body-fat'
  | 'bmr'
  | 'ideal-weight'
  | 'pace'
  | 'army-body-fat'
  | 'lean-body-mass'
  | 'healthy-weight'
  | 'calories-burned'
  | 'one-rep-max'
  | 'target-heart-rate'
  | 'pregnancy'
  | 'pregnancy-weight-gain'
  | 'pregnancy-conception'
  | 'due-date'
  | 'ovulation'
  | 'conception'
  | 'period'
  | 'macro'
  | 'carbohydrate'
  | 'protein'
  | 'fat-intake'
  | 'tdee'
  | 'gfr'
  | 'body-type'
  | 'body-surface-area'
  | 'bac';

type InputMode = HTMLAttributes<HTMLInputElement>['inputMode'];
type HealthInputs = Record<string, string>;

interface SelectOption {
  label: string;
  value: string;
}

interface HealthField {
  key: string;
  label: string;
  type?: 'number' | 'select' | 'date';
  inputMode?: InputMode;
  placeholder?: string;
  options?: SelectOption[];
}

interface HealthExample {
  label: string;
  inputs: HealthInputs;
}

interface HealthMode {
  id: string;
  label: string;
  symbol: string;
  fields: HealthField[];
  defaultInputs: HealthInputs;
  examples: HealthExample[];
}

interface HealthConfig {
  title: string;
  buttonLabel: string;
  emptyHistory: string;
  privacyNote: string;
  modes: HealthMode[];
}

interface HealthCalculation {
  expression: string;
  answer: string;
  label: string;
  metrics: Array<{ label: string; value: string }>;
  steps: string[];
  note?: string;
}

interface Props {
  variant: HealthToolVariant;
}

const numberInput: InputMode = 'decimal';
const numberField = (key: string, label: string, placeholder?: string): HealthField => ({
  key,
  label,
  placeholder,
  inputMode: numberInput,
  type: 'number',
});
const dateField = (key: string, label: string): HealthField => ({ key, label, type: 'date' });
const selectField = (key: string, label: string, options: SelectOption[]): HealthField => ({
  key,
  label,
  type: 'select',
  options,
});

const sexOptions: SelectOption[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

const activityOptions: SelectOption[] = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light activity', value: 'light' },
  { label: 'Moderate activity', value: 'moderate' },
  { label: 'Very active', value: 'very' },
  { label: 'Extra active', value: 'extra' },
];

const goalOptions: SelectOption[] = [
  { label: 'Maintain', value: 'maintain' },
  { label: 'Gentle loss', value: 'loss' },
  { label: 'Gentle gain', value: 'gain' },
];

const distanceUnitOptions: SelectOption[] = [
  { label: 'Kilometers', value: 'km' },
  { label: 'Miles', value: 'mi' },
];

const activityMetOptions: SelectOption[] = [
  { label: 'Walking briskly (3.8 MET)', value: '3.8' },
  { label: 'Cycling easy (4 MET)', value: '4' },
  { label: 'Strength training (5 MET)', value: '5' },
  { label: 'Jogging (7 MET)', value: '7' },
  { label: 'Running (9.8 MET)', value: '9.8' },
  { label: 'Swimming laps (8 MET)', value: '8' },
];

const heartZoneOptions: SelectOption[] = [
  { label: 'Moderate 50-70%', value: '50-70' },
  { label: 'Vigorous 70-85%', value: '70-85' },
  { label: 'General target 50-85%', value: '50-85' },
];

const macroGoalOptions: SelectOption[] = [
  { label: 'Balanced', value: 'balanced' },
  { label: 'Higher protein', value: 'high-protein' },
  { label: 'Lower carb', value: 'lower-carb' },
];

const proteinGoalOptions: SelectOption[] = [
  { label: 'RDA 0.8 g/kg', value: '0.8' },
  { label: 'Active 1.2 g/kg', value: '1.2' },
  { label: 'Strength 1.6 g/kg', value: '1.6' },
];

const healthConfigs: Record<HealthToolVariant, HealthConfig> = {
  bmi: {
    title: 'BMI Calculator',
    buttonLabel: 'Calculate BMI',
    emptyHistory: 'Recent BMI estimates will appear here.',
    privacyNote: 'BMI is a screening estimate. It does not diagnose health, body composition, or risk by itself.',
    modes: [
      {
        id: 'bmi',
        label: 'BMI',
        symbol: 'BMI',
        fields: [numberField('heightCm', 'Height (cm)'), numberField('weightKg', 'Weight (kg)')],
        defaultInputs: { heightCm: '170', weightKg: '70' },
        examples: [
          { label: '170 cm, 70 kg', inputs: { heightCm: '170', weightKg: '70' } },
          { label: '183 cm, 82 kg', inputs: { heightCm: '183', weightKg: '82' } },
          { label: '160 cm, 52 kg', inputs: { heightCm: '160', weightKg: '52' } },
        ],
      },
    ],
  },
  'underweight-bmi': {
    title: 'Underweight BMI Calculator',
    buttonLabel: 'Check BMI category',
    emptyHistory: 'Recent underweight BMI checks will appear here.',
    privacyNote: 'BMI is a screening estimate. It cannot diagnose anorexia, malnutrition, or any eating disorder.',
    modes: [
      {
        id: 'underweight-bmi',
        label: 'Underweight',
        symbol: 'BMI',
        fields: [numberField('heightCm', 'Height (cm)'), numberField('weightKg', 'Weight (kg)')],
        defaultInputs: { heightCm: '170', weightKg: '50' },
        examples: [
          { label: '170 cm, 50 kg', inputs: { heightCm: '170', weightKg: '50' } },
          { label: '160 cm, 47 kg', inputs: { heightCm: '160', weightKg: '47' } },
          { label: '183 cm, 62 kg', inputs: { heightCm: '183', weightKg: '62' } },
        ],
      },
    ],
  },
  overweight: {
    title: 'Overweight BMI Calculator',
    buttonLabel: 'Check BMI category',
    emptyHistory: 'Recent overweight BMI checks will appear here.',
    privacyNote: 'BMI is a screening estimate. It does not measure body fat, fitness, or individual health risk by itself.',
    modes: [
      {
        id: 'overweight',
        label: 'Overweight',
        symbol: 'BMI',
        fields: [numberField('heightCm', 'Height (cm)'), numberField('weightKg', 'Weight (kg)')],
        defaultInputs: { heightCm: '170', weightKg: '78' },
        examples: [
          { label: '170 cm, 78 kg', inputs: { heightCm: '170', weightKg: '78' } },
          { label: '183 cm, 92 kg', inputs: { heightCm: '183', weightKg: '92' } },
          { label: '160 cm, 70 kg', inputs: { heightCm: '160', weightKg: '70' } },
        ],
      },
    ],
  },
  'nutrition-points': {
    title: 'Nutrition Points Calculator',
    buttonLabel: 'Calculate points',
    emptyHistory: 'Recent nutrition point checks will appear here.',
    privacyNote: 'This is an original transparent score from nutrition-label fields, not a proprietary diet-program formula or medical nutrition advice.',
    modes: [
      {
        id: 'nutrition-points',
        label: 'Food points',
        symbol: 'PTS',
        fields: [
          numberField('calories', 'Calories'),
          numberField('saturatedFatG', 'Saturated fat (g)'),
          numberField('addedSugarG', 'Added sugar (g)'),
          numberField('sodiumMg', 'Sodium (mg)'),
          numberField('fiberG', 'Dietary fiber (g)'),
          numberField('proteinG', 'Protein (g)'),
        ],
        defaultInputs: { calories: '240', saturatedFatG: '2', addedSugarG: '8', sodiumMg: '320', fiberG: '5', proteinG: '9' },
        examples: [
          { label: 'Snack label', inputs: { calories: '240', saturatedFatG: '2', addedSugarG: '8', sodiumMg: '320', fiberG: '5', proteinG: '9' } },
          { label: 'Greek yogurt', inputs: { calories: '150', saturatedFatG: '0', addedSugarG: '4', sodiumMg: '75', fiberG: '0', proteinG: '15' } },
          { label: 'Sweet drink', inputs: { calories: '180', saturatedFatG: '0', addedSugarG: '38', sodiumMg: '40', fiberG: '0', proteinG: '0' } },
        ],
      },
    ],
  },
  calorie: {
    title: 'Calorie Calculator',
    buttonLabel: 'Estimate calories',
    emptyHistory: 'Recent calorie estimates will appear here.',
    privacyNote: 'Daily calorie needs are estimates and can change with metabolism, health, training, and tracking accuracy.',
    modes: [
      {
        id: 'calorie',
        label: 'Calories',
        symbol: 'kcal',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('age', 'Age'),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
          selectField('activity', 'Activity level', activityOptions),
          selectField('goal', 'Goal', goalOptions),
        ],
        defaultInputs: { sex: 'female', age: '32', heightCm: '165', weightKg: '68', activity: 'moderate', goal: 'maintain' },
        examples: [
          { label: 'Moderate maintain', inputs: { sex: 'female', age: '32', heightCm: '165', weightKg: '68', activity: 'moderate', goal: 'maintain' } },
          { label: 'Light loss', inputs: { sex: 'male', age: '41', heightCm: '178', weightKg: '86', activity: 'light', goal: 'loss' } },
          { label: 'Very active gain', inputs: { sex: 'female', age: '27', heightCm: '172', weightKg: '63', activity: 'very', goal: 'gain' } },
        ],
      },
    ],
  },
  'body-fat': {
    title: 'Body Fat Calculator',
    buttonLabel: 'Estimate body fat',
    emptyHistory: 'Recent body fat estimates will appear here.',
    privacyNote: 'Tape-method body fat estimates are best for trend tracking, not diagnosis.',
    modes: [
      {
        id: 'body-fat',
        label: 'Tape method',
        symbol: '%',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
          numberField('neckCm', 'Neck (cm)'),
          numberField('waistCm', 'Waist (cm)'),
          numberField('hipCm', 'Hip (cm, required for female formula)'),
        ],
        defaultInputs: { sex: 'female', heightCm: '165', weightKg: '68', neckCm: '34', waistCm: '78', hipCm: '98' },
        examples: [
          { label: 'Female example', inputs: { sex: 'female', heightCm: '165', weightKg: '68', neckCm: '34', waistCm: '78', hipCm: '98' } },
          { label: 'Male example', inputs: { sex: 'male', heightCm: '180', weightKg: '84', neckCm: '40', waistCm: '88', hipCm: '96' } },
          { label: 'Tracking check', inputs: { sex: 'female', heightCm: '170', weightKg: '72', neckCm: '35', waistCm: '82', hipCm: '101' } },
        ],
      },
    ],
  },
  bmr: {
    title: 'BMR Calculator',
    buttonLabel: 'Calculate BMR',
    emptyHistory: 'Recent BMR estimates will appear here.',
    privacyNote: 'BMR equations estimate resting energy needs. Actual energy use varies by person.',
    modes: [
      {
        id: 'bmr',
        label: 'BMR',
        symbol: 'BMR',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('age', 'Age'),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
        ],
        defaultInputs: { sex: 'male', age: '35', heightCm: '178', weightKg: '82' },
        examples: [
          { label: 'Male 35', inputs: { sex: 'male', age: '35', heightCm: '178', weightKg: '82' } },
          { label: 'Female 29', inputs: { sex: 'female', age: '29', heightCm: '164', weightKg: '61' } },
          { label: 'Female 45', inputs: { sex: 'female', age: '45', heightCm: '170', weightKg: '76' } },
        ],
      },
    ],
  },
  'ideal-weight': {
    title: 'Ideal Weight Calculator',
    buttonLabel: 'Estimate ideal weight',
    emptyHistory: 'Recent ideal weight estimates will appear here.',
    privacyNote: 'Ideal-weight formulas are rough reference points. They do not define your personal best weight.',
    modes: [
      {
        id: 'ideal-weight',
        label: 'Ideal weight',
        symbol: 'kg',
        fields: [selectField('sex', 'Sex used by formula', sexOptions), numberField('heightCm', 'Height (cm)')],
        defaultInputs: { sex: 'male', heightCm: '180' },
        examples: [
          { label: 'Male 180 cm', inputs: { sex: 'male', heightCm: '180' } },
          { label: 'Female 165 cm', inputs: { sex: 'female', heightCm: '165' } },
          { label: 'Female 172 cm', inputs: { sex: 'female', heightCm: '172' } },
        ],
      },
    ],
  },
  pace: {
    title: 'Pace Calculator',
    buttonLabel: 'Calculate pace',
    emptyHistory: 'Recent pace calculations will appear here.',
    privacyNote: 'Pace results are simple time and distance math for training logs and planning.',
    modes: [
      {
        id: 'pace',
        label: 'Pace',
        symbol: 'pace',
        fields: [
          numberField('distance', 'Distance'),
          selectField('unit', 'Distance unit', distanceUnitOptions),
          numberField('hours', 'Hours'),
          numberField('minutes', 'Minutes'),
          numberField('seconds', 'Seconds'),
        ],
        defaultInputs: { distance: '5', unit: 'km', hours: '0', minutes: '25', seconds: '0' },
        examples: [
          { label: '5K in 25:00', inputs: { distance: '5', unit: 'km', hours: '0', minutes: '25', seconds: '0' } },
          { label: '10K in 55:30', inputs: { distance: '10', unit: 'km', hours: '0', minutes: '55', seconds: '30' } },
          { label: '3 miles in 30:00', inputs: { distance: '3', unit: 'mi', hours: '0', minutes: '30', seconds: '0' } },
        ],
      },
    ],
  },
  'army-body-fat': {
    title: 'Army Body Fat Calculator',
    buttonLabel: 'Estimate tape body fat',
    emptyHistory: 'Recent Army tape estimates will appear here.',
    privacyNote: 'This educational tape estimate is not an official Army record, waiver, or pass/fail decision.',
    modes: [
      {
        id: 'army-body-fat',
        label: 'Tape estimate',
        symbol: 'ABCP',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
          numberField('neckCm', 'Neck (cm)'),
          numberField('waistCm', 'Abdomen or waist (cm)'),
          numberField('hipCm', 'Hip (cm, required for female formula)'),
        ],
        defaultInputs: { sex: 'male', heightCm: '178', weightKg: '84', neckCm: '40', waistCm: '90', hipCm: '98' },
        examples: [
          { label: 'Male tape', inputs: { sex: 'male', heightCm: '178', weightKg: '84', neckCm: '40', waistCm: '90', hipCm: '98' } },
          { label: 'Female tape', inputs: { sex: 'female', heightCm: '165', weightKg: '66', neckCm: '34', waistCm: '76', hipCm: '96' } },
          { label: 'Check trend', inputs: { sex: 'male', heightCm: '183', weightKg: '92', neckCm: '42', waistCm: '96', hipCm: '104' } },
        ],
      },
    ],
  },
  'lean-body-mass': {
    title: 'Lean Body Mass Calculator',
    buttonLabel: 'Calculate lean mass',
    emptyHistory: 'Recent lean body mass estimates will appear here.',
    privacyNote: 'Lean body mass equations estimate fat-free mass from height and weight.',
    modes: [
      {
        id: 'lean-body-mass',
        label: 'Boer formula',
        symbol: 'LBM',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
        ],
        defaultInputs: { sex: 'male', heightCm: '180', weightKg: '82' },
        examples: [
          { label: 'Male 180/82', inputs: { sex: 'male', heightCm: '180', weightKg: '82' } },
          { label: 'Female 165/62', inputs: { sex: 'female', heightCm: '165', weightKg: '62' } },
          { label: 'Female 172/70', inputs: { sex: 'female', heightCm: '172', weightKg: '70' } },
        ],
      },
    ],
  },
  'healthy-weight': {
    title: 'Healthy Weight Calculator',
    buttonLabel: 'Find healthy weight range',
    emptyHistory: 'Recent healthy weight ranges will appear here.',
    privacyNote: 'Healthy-weight BMI ranges are screening ranges for adults, not personal medical targets.',
    modes: [
      {
        id: 'healthy-weight',
        label: 'Range',
        symbol: '18.5-24.9',
        fields: [numberField('heightCm', 'Height (cm)'), numberField('weightKg', 'Current weight (kg, optional)')],
        defaultInputs: { heightCm: '170', weightKg: '70' },
        examples: [
          { label: '170 cm', inputs: { heightCm: '170', weightKg: '70' } },
          { label: '160 cm', inputs: { heightCm: '160', weightKg: '55' } },
          { label: '183 cm', inputs: { heightCm: '183', weightKg: '82' } },
        ],
      },
    ],
  },
  'calories-burned': {
    title: 'Calories Burned Calculator',
    buttonLabel: 'Estimate calories burned',
    emptyHistory: 'Recent exercise calorie estimates will appear here.',
    privacyNote: 'Exercise calorie estimates depend on intensity, fitness, body size, and measurement error.',
    modes: [
      {
        id: 'calories-burned',
        label: 'MET estimate',
        symbol: 'MET',
        fields: [
          selectField('met', 'Activity', activityMetOptions),
          numberField('weightKg', 'Weight (kg)'),
          numberField('minutes', 'Duration (minutes)'),
        ],
        defaultInputs: { met: '3.8', weightKg: '70', minutes: '45' },
        examples: [
          { label: 'Brisk walk 45 min', inputs: { met: '3.8', weightKg: '70', minutes: '45' } },
          { label: 'Run 30 min', inputs: { met: '9.8', weightKg: '80', minutes: '30' } },
          { label: 'Strength 50 min', inputs: { met: '5', weightKg: '72', minutes: '50' } },
        ],
      },
    ],
  },
  'one-rep-max': {
    title: 'One Rep Max Calculator',
    buttonLabel: 'Estimate 1RM',
    emptyHistory: 'Recent one-rep max estimates will appear here.',
    privacyNote: 'One-rep max formulas are training estimates. Lift safely and use a spotter when needed.',
    modes: [
      {
        id: 'one-rep-max',
        label: '1RM',
        symbol: '1RM',
        fields: [numberField('weightKg', 'Weight lifted (kg)'), numberField('reps', 'Reps')],
        defaultInputs: { weightKg: '100', reps: '5' },
        examples: [
          { label: '100 kg x 5', inputs: { weightKg: '100', reps: '5' } },
          { label: '60 kg x 8', inputs: { weightKg: '60', reps: '8' } },
          { label: '140 kg x 3', inputs: { weightKg: '140', reps: '3' } },
        ],
      },
    ],
  },
  'target-heart-rate': {
    title: 'Target Heart Rate Calculator',
    buttonLabel: 'Calculate heart rate zone',
    emptyHistory: 'Recent target heart rate zones will appear here.',
    privacyNote: 'Heart-rate zones are general estimates. Ask a clinician if medication or heart conditions affect your pulse.',
    modes: [
      {
        id: 'target-heart-rate',
        label: 'Zone',
        symbol: 'HR',
        fields: [
          numberField('age', 'Age'),
          selectField('zone', 'Training zone', heartZoneOptions),
          numberField('restingHeartRate', 'Resting heart rate (optional)'),
        ],
        defaultInputs: { age: '35', zone: '50-85', restingHeartRate: '65' },
        examples: [
          { label: 'Age 35 target', inputs: { age: '35', zone: '50-85', restingHeartRate: '65' } },
          { label: 'Moderate age 50', inputs: { age: '50', zone: '50-70', restingHeartRate: '70' } },
          { label: 'Vigorous age 28', inputs: { age: '28', zone: '70-85', restingHeartRate: '58' } },
        ],
      },
    ],
  },
  pregnancy: {
    title: 'Pregnancy Calculator',
    buttonLabel: 'Calculate pregnancy dates',
    emptyHistory: 'Recent pregnancy date estimates will appear here.',
    privacyNote: 'Pregnancy date calculators estimate timing. Ultrasound and clinician dating can change the official due date.',
    modes: [
      {
        id: 'pregnancy',
        label: 'Pregnancy dates',
        symbol: 'EDD',
        fields: [dateField('lastPeriod', 'First day of last period'), numberField('cycleLength', 'Cycle length (days)')],
        defaultInputs: { lastPeriod: '2026-04-01', cycleLength: '28' },
        examples: [
          { label: '28-day cycle', inputs: { lastPeriod: '2026-04-01', cycleLength: '28' } },
          { label: 'Longer cycle', inputs: { lastPeriod: '2026-03-20', cycleLength: '32' } },
          { label: 'Shorter cycle', inputs: { lastPeriod: '2026-04-10', cycleLength: '26' } },
        ],
      },
    ],
  },
  'pregnancy-weight-gain': {
    title: 'Pregnancy Weight Gain Calculator',
    buttonLabel: 'Check weight gain range',
    emptyHistory: 'Recent pregnancy weight gain estimates will appear here.',
    privacyNote: 'Pregnancy weight gain ranges are guidelines. Personal care should come from your OB-GYN or midwife.',
    modes: [
      {
        id: 'pregnancy-weight-gain',
        label: 'Weight gain',
        symbol: 'gain',
        fields: [
          numberField('heightCm', 'Pre-pregnancy height (cm)'),
          numberField('preWeightKg', 'Pre-pregnancy weight (kg)'),
          numberField('currentWeightKg', 'Current weight (kg)'),
          numberField('week', 'Pregnancy week'),
        ],
        defaultInputs: { heightCm: '165', preWeightKg: '62', currentWeightKg: '70', week: '24' },
        examples: [
          { label: 'Week 24', inputs: { heightCm: '165', preWeightKg: '62', currentWeightKg: '70', week: '24' } },
          { label: 'Week 30', inputs: { heightCm: '170', preWeightKg: '78', currentWeightKg: '86', week: '30' } },
          { label: 'Week 18', inputs: { heightCm: '160', preWeightKg: '52', currentWeightKg: '57', week: '18' } },
        ],
      },
    ],
  },
  'pregnancy-conception': {
    title: 'Pregnancy Conception Calculator',
    buttonLabel: 'Estimate conception date',
    emptyHistory: 'Recent pregnancy conception estimates will appear here.',
    privacyNote: 'Conception estimates are approximate because ovulation and implantation timing vary.',
    modes: [
      {
        id: 'pregnancy-conception',
        label: 'From due date',
        symbol: 'date',
        fields: [dateField('dueDate', 'Estimated due date')],
        defaultInputs: { dueDate: '2027-01-06' },
        examples: [
          { label: 'Due Jan 6', inputs: { dueDate: '2027-01-06' } },
          { label: 'Due Oct 15', inputs: { dueDate: '2026-10-15' } },
          { label: 'Due Mar 1', inputs: { dueDate: '2027-03-01' } },
        ],
      },
    ],
  },
  'due-date': {
    title: 'Due Date Calculator',
    buttonLabel: 'Calculate due date',
    emptyHistory: 'Recent due date estimates will appear here.',
    privacyNote: 'A due date is an estimate, not a guarantee of delivery timing.',
    modes: [
      {
        id: 'due-date',
        label: 'LMP method',
        symbol: 'EDD',
        fields: [dateField('lastPeriod', 'First day of last period'), numberField('cycleLength', 'Cycle length (days)')],
        defaultInputs: { lastPeriod: '2026-04-01', cycleLength: '28' },
        examples: [
          { label: 'LMP Apr 1', inputs: { lastPeriod: '2026-04-01', cycleLength: '28' } },
          { label: '32-day cycle', inputs: { lastPeriod: '2026-02-14', cycleLength: '32' } },
          { label: '26-day cycle', inputs: { lastPeriod: '2026-05-05', cycleLength: '26' } },
        ],
      },
    ],
  },
  ovulation: {
    title: 'Ovulation Calculator',
    buttonLabel: 'Estimate ovulation',
    emptyHistory: 'Recent ovulation estimates will appear here.',
    privacyNote: 'Calendar ovulation estimates work best with regular cycles and are not contraception.',
    modes: [
      {
        id: 'ovulation',
        label: 'Fertile window',
        symbol: 'ovu',
        fields: [
          dateField('lastPeriod', 'First day of last period'),
          numberField('cycleLength', 'Cycle length (days)'),
          numberField('lutealLength', 'Luteal phase (days)'),
        ],
        defaultInputs: { lastPeriod: '2026-04-01', cycleLength: '28', lutealLength: '14' },
        examples: [
          { label: '28-day cycle', inputs: { lastPeriod: '2026-04-01', cycleLength: '28', lutealLength: '14' } },
          { label: '30-day cycle', inputs: { lastPeriod: '2026-04-04', cycleLength: '30', lutealLength: '14' } },
          { label: '26-day cycle', inputs: { lastPeriod: '2026-04-08', cycleLength: '26', lutealLength: '13' } },
        ],
      },
    ],
  },
  conception: {
    title: 'Conception Calculator',
    buttonLabel: 'Estimate conception',
    emptyHistory: 'Recent conception estimates will appear here.',
    privacyNote: 'Conception timing is approximate; cycles and ovulation can vary from month to month.',
    modes: [
      {
        id: 'conception',
        label: 'Cycle estimate',
        symbol: 'date',
        fields: [
          dateField('lastPeriod', 'First day of last period'),
          numberField('cycleLength', 'Cycle length (days)'),
          numberField('lutealLength', 'Luteal phase (days)'),
        ],
        defaultInputs: { lastPeriod: '2026-04-01', cycleLength: '28', lutealLength: '14' },
        examples: [
          { label: 'Typical cycle', inputs: { lastPeriod: '2026-04-01', cycleLength: '28', lutealLength: '14' } },
          { label: 'Long cycle', inputs: { lastPeriod: '2026-04-02', cycleLength: '32', lutealLength: '14' } },
          { label: 'Short luteal', inputs: { lastPeriod: '2026-04-10', cycleLength: '27', lutealLength: '12' } },
        ],
      },
    ],
  },
  period: {
    title: 'Period Calculator',
    buttonLabel: 'Predict period dates',
    emptyHistory: 'Recent period estimates will appear here.',
    privacyNote: 'Period predictions are calendar estimates and can be affected by stress, illness, medication, and cycle changes.',
    modes: [
      {
        id: 'period',
        label: 'Cycle',
        symbol: 'cyc',
        fields: [
          dateField('lastPeriod', 'First day of last period'),
          numberField('cycleLength', 'Cycle length (days)'),
          numberField('periodLength', 'Period length (days)'),
        ],
        defaultInputs: { lastPeriod: '2026-04-01', cycleLength: '28', periodLength: '5' },
        examples: [
          { label: '28-day cycle', inputs: { lastPeriod: '2026-04-01', cycleLength: '28', periodLength: '5' } },
          { label: '30-day cycle', inputs: { lastPeriod: '2026-04-05', cycleLength: '30', periodLength: '6' } },
          { label: '26-day cycle', inputs: { lastPeriod: '2026-04-12', cycleLength: '26', periodLength: '4' } },
        ],
      },
    ],
  },
  macro: {
    title: 'Macro Calculator',
    buttonLabel: 'Calculate macros',
    emptyHistory: 'Recent macro splits will appear here.',
    privacyNote: 'Macro targets are planning estimates and should be adjusted to appetite, results, and clinical needs.',
    modes: [
      {
        id: 'macro',
        label: 'Macros',
        symbol: 'g',
        fields: [numberField('calories', 'Daily calories'), selectField('macroGoal', 'Macro split', macroGoalOptions)],
        defaultInputs: { calories: '2000', macroGoal: 'balanced' },
        examples: [
          { label: 'Balanced 2000', inputs: { calories: '2000', macroGoal: 'balanced' } },
          { label: 'High protein 2400', inputs: { calories: '2400', macroGoal: 'high-protein' } },
          { label: 'Lower carb 1800', inputs: { calories: '1800', macroGoal: 'lower-carb' } },
        ],
      },
    ],
  },
  carbohydrate: {
    title: 'Carbohydrate Calculator',
    buttonLabel: 'Calculate carbs',
    emptyHistory: 'Recent carbohydrate targets will appear here.',
    privacyNote: 'Carbohydrate needs vary by activity, medical conditions, and nutrition plan.',
    modes: [
      {
        id: 'carbohydrate',
        label: 'Carbs',
        symbol: 'carb',
        fields: [numberField('calories', 'Daily calories'), numberField('percent', 'Carb percent')],
        defaultInputs: { calories: '2000', percent: '50' },
        examples: [
          { label: '50% of 2000', inputs: { calories: '2000', percent: '50' } },
          { label: '45% of 1800', inputs: { calories: '1800', percent: '45' } },
          { label: '60% of 2500', inputs: { calories: '2500', percent: '60' } },
        ],
      },
    ],
  },
  protein: {
    title: 'Protein Calculator',
    buttonLabel: 'Calculate protein',
    emptyHistory: 'Recent protein targets will appear here.',
    privacyNote: 'Protein needs can change with age, training, pregnancy, kidney disease, and clinical guidance.',
    modes: [
      {
        id: 'protein',
        label: 'Protein',
        symbol: 'pro',
        fields: [numberField('weightKg', 'Weight (kg)'), selectField('proteinGoal', 'Protein target', proteinGoalOptions)],
        defaultInputs: { weightKg: '70', proteinGoal: '0.8' },
        examples: [
          { label: 'RDA 70 kg', inputs: { weightKg: '70', proteinGoal: '0.8' } },
          { label: 'Active 80 kg', inputs: { weightKg: '80', proteinGoal: '1.2' } },
          { label: 'Strength 75 kg', inputs: { weightKg: '75', proteinGoal: '1.6' } },
        ],
      },
    ],
  },
  'fat-intake': {
    title: 'Fat Intake Calculator',
    buttonLabel: 'Calculate fat intake',
    emptyHistory: 'Recent fat intake targets will appear here.',
    privacyNote: 'Fat intake targets are nutrition planning estimates, not individualized medical advice.',
    modes: [
      {
        id: 'fat-intake',
        label: 'Fat',
        symbol: 'fat',
        fields: [numberField('calories', 'Daily calories'), numberField('percent', 'Fat percent')],
        defaultInputs: { calories: '2000', percent: '30' },
        examples: [
          { label: '30% of 2000', inputs: { calories: '2000', percent: '30' } },
          { label: '25% of 1800', inputs: { calories: '1800', percent: '25' } },
          { label: '35% of 2400', inputs: { calories: '2400', percent: '35' } },
        ],
      },
    ],
  },
  tdee: {
    title: 'TDEE Calculator',
    buttonLabel: 'Calculate TDEE',
    emptyHistory: 'Recent TDEE estimates will appear here.',
    privacyNote: 'TDEE is an estimate. Use real weight trends and intake tracking to adjust over time.',
    modes: [
      {
        id: 'tdee',
        label: 'TDEE',
        symbol: 'kcal',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('age', 'Age'),
          numberField('heightCm', 'Height (cm)'),
          numberField('weightKg', 'Weight (kg)'),
          selectField('activity', 'Activity level', activityOptions),
        ],
        defaultInputs: { sex: 'female', age: '32', heightCm: '165', weightKg: '68', activity: 'moderate' },
        examples: [
          { label: 'Moderate', inputs: { sex: 'female', age: '32', heightCm: '165', weightKg: '68', activity: 'moderate' } },
          { label: 'Sedentary', inputs: { sex: 'male', age: '45', heightCm: '180', weightKg: '88', activity: 'sedentary' } },
          { label: 'Very active', inputs: { sex: 'female', age: '27', heightCm: '172', weightKg: '63', activity: 'very' } },
        ],
      },
    ],
  },
  gfr: {
    title: 'GFR Calculator',
    buttonLabel: 'Estimate eGFR',
    emptyHistory: 'Recent eGFR estimates will appear here.',
    privacyNote: 'eGFR uses lab values and must be interpreted by a clinician with your health history.',
    modes: [
      {
        id: 'gfr',
        label: 'CKD-EPI 2021',
        symbol: 'GFR',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('age', 'Age'),
          numberField('creatinine', 'Serum creatinine (mg/dL)'),
        ],
        defaultInputs: { sex: 'female', age: '50', creatinine: '0.9' },
        examples: [
          { label: 'Female 50', inputs: { sex: 'female', age: '50', creatinine: '0.9' } },
          { label: 'Male 60', inputs: { sex: 'male', age: '60', creatinine: '1.1' } },
          { label: 'Female 70', inputs: { sex: 'female', age: '70', creatinine: '1.2' } },
        ],
      },
    ],
  },
  'body-type': {
    title: 'Body Type Calculator',
    buttonLabel: 'Estimate body type',
    emptyHistory: 'Recent body type estimates will appear here.',
    privacyNote: 'Body-shape labels are general style and measurement categories, not health rankings.',
    modes: [
      {
        id: 'body-type',
        label: 'Shape',
        symbol: 'type',
        fields: [
          numberField('shouldersCm', 'Shoulders (cm)'),
          numberField('bustCm', 'Bust/chest (cm)'),
          numberField('waistCm', 'Waist (cm)'),
          numberField('hipsCm', 'Hips (cm)'),
        ],
        defaultInputs: { shouldersCm: '100', bustCm: '96', waistCm: '76', hipsCm: '101' },
        examples: [
          { label: 'Balanced', inputs: { shouldersCm: '100', bustCm: '96', waistCm: '76', hipsCm: '101' } },
          { label: 'Triangle', inputs: { shouldersCm: '92', bustCm: '90', waistCm: '74', hipsCm: '105' } },
          { label: 'Inverted', inputs: { shouldersCm: '108', bustCm: '102', waistCm: '82', hipsCm: '95' } },
        ],
      },
    ],
  },
  'body-surface-area': {
    title: 'Body Surface Area Calculator',
    buttonLabel: 'Calculate BSA',
    emptyHistory: 'Recent body surface area estimates will appear here.',
    privacyNote: 'BSA is a clinical estimate and should not be used for medication dosing without professional guidance.',
    modes: [
      {
        id: 'body-surface-area',
        label: 'BSA',
        symbol: 'BSA',
        fields: [numberField('heightCm', 'Height (cm)'), numberField('weightKg', 'Weight (kg)')],
        defaultInputs: { heightCm: '170', weightKg: '70' },
        examples: [
          { label: '170 cm, 70 kg', inputs: { heightCm: '170', weightKg: '70' } },
          { label: '180 cm, 85 kg', inputs: { heightCm: '180', weightKg: '85' } },
          { label: '160 cm, 55 kg', inputs: { heightCm: '160', weightKg: '55' } },
        ],
      },
    ],
  },
  bac: {
    title: 'BAC Calculator',
    buttonLabel: 'Estimate BAC',
    emptyHistory: 'Recent BAC estimates will appear here.',
    privacyNote: 'BAC estimates are not legal, medical, or driving advice. Do not use them to decide whether to drive.',
    modes: [
      {
        id: 'bac',
        label: 'BAC',
        symbol: 'BAC',
        fields: [
          selectField('sex', 'Sex used by formula', sexOptions),
          numberField('weightKg', 'Weight (kg)'),
          numberField('drinkCount', 'Number of drinks'),
          numberField('volumeMl', 'Drink size (mL)'),
          numberField('alcoholPercent', 'Alcohol by volume (%)'),
          numberField('hours', 'Hours since first drink'),
        ],
        defaultInputs: { sex: 'male', weightKg: '80', drinkCount: '2', volumeMl: '355', alcoholPercent: '5', hours: '1' },
        examples: [
          { label: 'Two beers', inputs: { sex: 'male', weightKg: '80', drinkCount: '2', volumeMl: '355', alcoholPercent: '5', hours: '1' } },
          { label: 'Wine example', inputs: { sex: 'female', weightKg: '65', drinkCount: '2', volumeMl: '150', alcoholPercent: '12', hours: '2' } },
          { label: 'One drink', inputs: { sex: 'male', weightKg: '90', drinkCount: '1', volumeMl: '45', alcoholPercent: '40', hours: '1' } },
        ],
      },
    ],
  },
};

function parseNumber(input: string, label: string): number;
function parseNumber(input: string, label: string, optional: false): number;
function parseNumber(input: string, label: string, optional: true): number | undefined;
function parseNumber(input: string, label: string, optional = false) {
  const trimmed = input.trim();
  if (!trimmed && optional) return undefined;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a number`);
  }
  return parsed;
}

function formatKg(value: number) {
  return `${formatCalculatorNumber(value)} kg`;
}

function formatLb(value: number) {
  return `${formatCalculatorNumber(value)} lb`;
}

function formatKcal(value: number) {
  return `${formatCalculatorNumber(Math.round(value))} kcal`;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

function formatPace(secondsPerUnit: number) {
  const rounded = Math.round(secondsPerUnit);
  const minutes = Math.floor(rounded / 60);
  const seconds = String(rounded % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function getPregnancyDates(lastPeriod: string, cycleLength: number) {
  const dueDate = calculateDueDateFromLmp(lastPeriod, cycleLength);
  const ovulationDate = addDaysToIsoDate(lastPeriod, cycleLength - 14);
  const conceptionDate = ovulationDate;
  const gestationDays = Math.max(0, daysBetweenIsoDates(lastPeriod, getTodayIsoDate()));
  const gestationWeeks = Math.floor(gestationDays / 7);
  const gestationRemainderDays = gestationDays % 7;
  const trimester = gestationDays < 98 ? 'First trimester' : gestationDays < 196 ? 'Second trimester' : 'Third trimester';

  return { dueDate, ovulationDate, conceptionDate, gestationWeeks, gestationRemainderDays, trimester };
}

function getMacroPercents(goal: string) {
  if (goal === 'high-protein') return { protein: 30, fat: 30, carb: 40 };
  if (goal === 'lower-carb') return { protein: 30, fat: 40, carb: 30 };
  return { protein: 25, fat: 30, carb: 45 };
}

function calculateHealth(variant: HealthToolVariant, modeId: string, inputs: HealthInputs): HealthCalculation {
  const sex = (inputs.sex || 'female') as HealthSex;

  switch (variant) {
    case 'bmi': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const result = calculateBmi(weightKg, heightCm);
      return {
        label: 'BMI estimate',
        expression: `${formatKg(weightKg)} at ${formatCalculatorNumber(heightCm)} cm`,
        answer: `BMI ${formatCalculatorNumber(result.bmi)}`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'Healthy range', value: `${formatKg(result.healthyMinKg)}-${formatKg(result.healthyMaxKg)}` },
          { label: 'Height', value: `${formatCalculatorNumber(heightCm)} cm` },
        ],
        steps: [
          'Convert height from centimeters to meters.',
          'BMI = weight in kilograms / height in meters squared.',
          'Compare the result with adult BMI screening categories.',
        ],
      };
    }
    case 'underweight-bmi': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const result = calculateUnderweightBmiCheck(weightKg, heightCm);
      return {
        label: 'Underweight BMI screen',
        expression: `${formatKg(weightKg)} at ${formatCalculatorNumber(heightCm)} cm`,
        answer: `BMI ${formatCalculatorNumber(result.bmi)}`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'To BMI 18.5', value: result.kgToHealthyMinimum === 0 ? 'Already at or above 18.5' : `${formatKg(result.kgToHealthyMinimum)} / ${formatLb(result.poundsToHealthyMinimum)}` },
          { label: 'Healthy range', value: `${formatKg(result.healthyMinKg)}-${formatKg(result.healthyMaxKg)}` },
        ],
        steps: [
          'Convert height from centimeters to meters.',
          'BMI = weight in kilograms / height in meters squared.',
          'Compare with the adult underweight threshold of BMI less than 18.5.',
        ],
        note:
          'BMI cannot diagnose anorexia or any eating disorder. If food, weight, exercise, or body image feels hard to control, talk with a qualified health professional.',
      };
    }
    case 'overweight': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const result = calculateOverweightBmiCheck(weightKg, heightCm);
      return {
        label: 'Overweight BMI screen',
        expression: `${formatKg(weightKg)} at ${formatCalculatorNumber(heightCm)} cm`,
        answer: `BMI ${formatCalculatorNumber(result.bmi)}`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'Above BMI 24.9', value: result.kgToHealthyMaximum === 0 ? 'Within healthy BMI range' : `${formatKg(result.kgToHealthyMaximum)} / ${formatLb(result.poundsToHealthyMaximum)}` },
          {
            label: 'To BMI 30',
            value:
              result.kgToObesityThreshold > 0
                ? `${formatKg(result.kgToObesityThreshold)} below`
                : `${formatKg(Math.abs(result.kgToObesityThreshold))} above`,
          },
        ],
        steps: [
          'Convert height from centimeters to meters.',
          'BMI = weight in kilograms / height in meters squared.',
          'Compare with adult BMI screening ranges: 25 to less than 30 is the overweight category.',
        ],
        note:
          'BMI is only a screening tool. Waist size, body composition, health history, medications, and clinician review can change the real health picture.',
      };
    }
    case 'nutrition-points': {
      const result = calculateNutritionPoints({
        calories: parseNumber(inputs.calories, 'Calories'),
        saturatedFatG: parseNumber(inputs.saturatedFatG, 'Saturated fat'),
        addedSugarG: parseNumber(inputs.addedSugarG, 'Added sugar'),
        sodiumMg: parseNumber(inputs.sodiumMg, 'Sodium'),
        fiberG: parseNumber(inputs.fiberG, 'Dietary fiber'),
        proteinG: parseNumber(inputs.proteinG, 'Protein'),
      });
      return {
        label: 'Nutrition points',
        expression: `${formatKcal(parseNumber(inputs.calories, 'Calories'))}, ${formatCalculatorNumber(parseNumber(inputs.proteinG, 'Protein'))} g protein`,
        answer: `${formatCalculatorNumber(result.points)} points`,
        metrics: [
          { label: 'Category', value: result.category },
          { label: 'Moderation points', value: formatCalculatorNumber(result.moderationPoints) },
          { label: 'Fiber/protein credits', value: formatCalculatorNumber(result.supportCredits) },
        ],
        steps: [
          'Add moderation points from calories, saturated fat, added sugar, and sodium.',
          'Subtract support credits from dietary fiber and protein.',
          'Compare foods only as a simple label-reading aid, not as a branded diet score.',
        ],
        note:
          'This is an Access Free Tools score, not Weight Watchers Points and not medical nutrition advice. Use the same formula only for rough comparisons.',
      };
    }
    case 'calorie':
    case 'tdee': {
      const age = parseNumber(inputs.age, 'Age');
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const activity = (inputs.activity || 'moderate') as ActivityLevel;
      const bmr = calculateMifflinStJeor({ sex, age, heightCm, weightKg });
      const tdee = calculateTdeeFromBmr(bmr, activity);
      const goalAdjustment = inputs.goal === 'loss' ? -500 : inputs.goal === 'gain' ? 300 : 0;
      const target = tdee + goalAdjustment;
      const label = variant === 'tdee' ? 'TDEE estimate' : 'Daily calorie estimate';
      return {
        label,
        expression: `${formatKg(weightKg)}, ${formatCalculatorNumber(heightCm)} cm, age ${formatCalculatorNumber(age)}`,
        answer: `${formatKcal(target)}/day`,
        metrics: [
          { label: 'BMR', value: `${formatKcal(bmr)}/day` },
          { label: 'Maintenance', value: `${formatKcal(tdee)}/day` },
          { label: 'Activity factor', value: `${activityLevelFactors[activity]}x` },
        ],
        steps: [
          'Estimate resting energy with the Mifflin-St Jeor equation.',
          'Multiply BMR by the selected activity factor.',
          variant === 'calorie'
            ? 'Apply the selected goal adjustment for a planning target.'
            : 'Use the activity-adjusted result as estimated total daily energy expenditure.',
        ],
      };
    }
    case 'body-fat':
    case 'army-body-fat': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const weightKg = parseNumber(inputs.weightKg, 'Weight', true);
      const neckCm = parseNumber(inputs.neckCm, 'Neck');
      const waistCm = parseNumber(inputs.waistCm, 'Waist');
      const hipCm = sex === 'male' ? undefined : parseNumber(inputs.hipCm, 'Hip');
      const result = calculateNavyBodyFat({ sex, heightCm, weightKg, neckCm, waistCm, hipCm });
      return {
        label: variant === 'army-body-fat' ? 'Tape estimate' : 'Body fat estimate',
        expression: `${sex}, ${formatCalculatorNumber(heightCm)} cm height`,
        answer: `${formatCalculatorNumber(result.bodyFatPercent)}%`,
        metrics: [
          { label: 'Fat mass', value: result.fatMassKg ? formatKg(result.fatMassKg) : 'Add weight to estimate' },
          { label: 'Lean mass', value: result.leanMassKg ? formatKg(result.leanMassKg) : 'Add weight to estimate' },
          { label: 'Method', value: 'Circumference tape' },
        ],
        steps: [
          'Convert tape measurements to inches for the circumference equation.',
          sex === 'male'
            ? 'Use waist minus neck with height in the male equation.'
            : 'Use waist plus hip minus neck with height in the female equation.',
          'Treat the result as an estimate for trend tracking.',
        ],
      };
    }
    case 'bmr': {
      const age = parseNumber(inputs.age, 'Age');
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const bmr = calculateMifflinStJeor({ sex, age, heightCm, weightKg });
      return {
        label: 'BMR estimate',
        expression: `${sex}, age ${formatCalculatorNumber(age)}, ${formatKg(weightKg)}`,
        answer: `${formatKcal(bmr)}/day`,
        metrics: [
          { label: 'Sedentary TDEE', value: `${formatKcal(calculateTdeeFromBmr(bmr, 'sedentary'))}/day` },
          { label: 'Moderate TDEE', value: `${formatKcal(calculateTdeeFromBmr(bmr, 'moderate'))}/day` },
          { label: 'Formula', value: 'Mifflin-St Jeor' },
        ],
        steps: [
          'Multiply weight by 10.',
          'Multiply height by 6.25, subtract 5 times age, then apply the sex adjustment.',
          'Use BMR as resting energy before activity is added.',
        ],
      };
    }
    case 'ideal-weight': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const ideal = calculateDevineIdealWeight(sex, heightCm);
      const range = calculateBmi(ideal, heightCm);
      return {
        label: 'Ideal weight estimate',
        expression: `${sex}, ${formatCalculatorNumber(heightCm)} cm`,
        answer: formatKg(ideal),
        metrics: [
          { label: 'Healthy BMI range', value: `${formatKg(range.healthyMinKg)}-${formatKg(range.healthyMaxKg)}` },
          { label: 'Formula', value: 'Devine' },
          { label: 'Height', value: `${formatCalculatorNumber(heightCm)} cm` },
        ],
        steps: [
          'Start with the Devine base weight for 5 feet of height.',
          'Add 2.3 kg for each inch over 5 feet.',
          'Compare with the adult healthy BMI screening range.',
        ],
      };
    }
    case 'pace': {
      const distance = parseNumber(inputs.distance, 'Distance');
      const totalSeconds =
        parseNumber(inputs.hours || '0', 'Hours') * 3600 +
        parseNumber(inputs.minutes || '0', 'Minutes') * 60 +
        parseNumber(inputs.seconds || '0', 'Seconds');
      const result = calculatePace(distance, totalSeconds);
      const unit = inputs.unit === 'mi' ? 'mi' : 'km';
      return {
        label: 'Pace',
        expression: `${formatCalculatorNumber(distance)} ${unit} in ${formatPace(totalSeconds)}`,
        answer: `${formatPace(result.secondsPerUnit)} / ${unit}`,
        metrics: [
          { label: 'Speed', value: `${formatCalculatorNumber(result.speedPerHour)} ${unit}/h` },
          { label: 'Total time', value: formatPace(totalSeconds) },
          { label: 'Distance', value: `${formatCalculatorNumber(distance)} ${unit}` },
        ],
        steps: [
          'Convert the entered time to total seconds.',
          'Divide total seconds by distance.',
          'Format the result as minutes and seconds per distance unit.',
        ],
      };
    }
    case 'lean-body-mass': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const leanMass = calculateBoerLeanBodyMass({ sex, age: 30, heightCm, weightKg });
      return {
        label: 'Lean body mass',
        expression: `${sex}, ${formatKg(weightKg)}, ${formatCalculatorNumber(heightCm)} cm`,
        answer: formatKg(leanMass),
        metrics: [
          { label: 'Estimated fat mass', value: formatKg(Math.max(0, weightKg - leanMass)) },
          { label: 'Lean percent', value: `${formatCalculatorNumber((leanMass / weightKg) * 100)}%` },
          { label: 'Formula', value: 'Boer' },
        ],
        steps: [
          'Use height and weight in the Boer lean body mass equation.',
          'Subtract estimated lean mass from body weight for an approximate fat-mass comparison.',
          'Use consistent measurements if tracking changes over time.',
        ],
      };
    }
    case 'healthy-weight': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const currentWeight = parseNumber(inputs.weightKg, 'Current weight', true);
      const baselineWeight = currentWeight ?? 22 * (heightCm / 100) ** 2;
      const result = calculateBmi(baselineWeight, heightCm);
      return {
        label: 'Healthy weight range',
        expression: `${formatCalculatorNumber(heightCm)} cm height`,
        answer: `${formatKg(result.healthyMinKg)}-${formatKg(result.healthyMaxKg)}`,
        metrics: [
          { label: 'BMI range', value: '18.5-24.9' },
          { label: 'Current BMI', value: currentWeight ? formatCalculatorNumber(result.bmi) : 'Add weight to check' },
          { label: 'Current category', value: currentWeight ? result.category : 'Optional' },
        ],
        steps: [
          'Convert height to meters.',
          'Multiply height squared by BMI 18.5 and 24.9.',
          'Use the range as an adult screening reference, not a personal diagnosis.',
        ],
      };
    }
    case 'calories-burned': {
      const met = parseNumber(inputs.met, 'MET');
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const minutes = parseNumber(inputs.minutes, 'Minutes');
      const calories = calculateCaloriesBurned(met, weightKg, minutes);
      return {
        label: 'Calories burned estimate',
        expression: `${formatCalculatorNumber(met)} MET for ${formatCalculatorNumber(minutes)} min`,
        answer: formatKcal(calories),
        metrics: [
          { label: 'Calories per hour', value: formatKcal((calories / minutes) * 60) },
          { label: 'MET', value: formatCalculatorNumber(met) },
          { label: 'Weight', value: formatKg(weightKg) },
        ],
        steps: [
          'Use the MET value as an activity-intensity estimate.',
          'Calories per minute = MET x 3.5 x body weight in kg / 200.',
          'Multiply by the session duration in minutes.',
        ],
      };
    }
    case 'one-rep-max': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight lifted');
      const reps = parseNumber(inputs.reps, 'Reps');
      const result = calculateOneRepMax(weightKg, reps);
      return {
        label: 'Estimated one-rep max',
        expression: `${formatKg(weightKg)} x ${formatCalculatorNumber(reps)} reps`,
        answer: formatKg(result.epleyKg),
        metrics: [
          { label: 'Epley', value: formatKg(result.epleyKg) },
          { label: 'Brzycki', value: formatKg(result.brzyckiKg) },
          { label: 'Training range 80%', value: formatKg(result.epleyKg * 0.8) },
        ],
        steps: [
          'Use the lifted weight and reps completed.',
          'Epley estimate = weight x (1 + reps / 30).',
          'Brzycki gives a second estimate for comparison.',
        ],
      };
    }
    case 'target-heart-rate': {
      const age = parseNumber(inputs.age, 'Age');
      const zoneParts = (inputs.zone || '50-85').split('-').map(Number);
      const lower = Number.isFinite(zoneParts[0]) ? zoneParts[0] : 50;
      const upper = Number.isFinite(zoneParts[1]) ? zoneParts[1] : 85;
      const resting = parseNumber(inputs.restingHeartRate, 'Resting heart rate', true);
      const result = calculateTargetHeartRate(age, lower, upper, resting);
      return {
        label: 'Target heart rate',
        expression: `Age ${formatCalculatorNumber(age)}, ${lower}-${upper}%`,
        answer: `${formatCalculatorNumber(Math.round(result.lowerBpm))}-${formatCalculatorNumber(Math.round(result.upperBpm))} bpm`,
        metrics: [
          { label: 'Estimated max', value: `${formatCalculatorNumber(Math.round(result.maxHeartRate))} bpm` },
          {
            label: 'Heart-rate reserve',
            value:
              result.karvonenLowerBpm && result.karvonenUpperBpm
                ? `${formatCalculatorNumber(Math.round(result.karvonenLowerBpm))}-${formatCalculatorNumber(Math.round(result.karvonenUpperBpm))} bpm`
                : 'Add resting HR',
          },
          { label: 'Intensity', value: `${lower}-${upper}%` },
        ],
        steps: [
          'Estimate maximum heart rate as 220 minus age.',
          'Multiply maximum heart rate by the selected intensity range.',
          'If resting heart rate is entered, also show the heart-rate reserve estimate.',
        ],
      };
    }
    case 'pregnancy':
    case 'due-date': {
      const cycleLength = parseNumber(inputs.cycleLength, 'Cycle length');
      const dates = getPregnancyDates(inputs.lastPeriod, cycleLength);
      return {
        label: variant === 'pregnancy' ? 'Pregnancy dates' : 'Estimated due date',
        expression: `LMP ${formatDate(inputs.lastPeriod)}, ${formatCalculatorNumber(cycleLength)} day cycle`,
        answer: formatDate(dates.dueDate),
        metrics: [
          { label: 'Gestational age today', value: `${dates.gestationWeeks}w ${dates.gestationRemainderDays}d` },
          { label: 'Estimated conception', value: formatDate(dates.conceptionDate) },
          { label: 'Trimester', value: dates.trimester },
        ],
        steps: [
          'Start with the first day of the last menstrual period.',
          'Add 280 days, adjusting for cycle length compared with a 28-day cycle.',
          'Estimate conception near ovulation, about 14 days before the next period.',
        ],
      };
    }
    case 'pregnancy-weight-gain': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const preWeightKg = parseNumber(inputs.preWeightKg, 'Pre-pregnancy weight');
      const currentWeightKg = parseNumber(inputs.currentWeightKg, 'Current weight');
      const week = parseNumber(inputs.week, 'Pregnancy week');
      const result = calculatePregnancyWeightGain(heightCm, preWeightKg, currentWeightKg);
      return {
        label: 'Pregnancy weight gain',
        expression: `Week ${formatCalculatorNumber(week)}, pre-pregnancy BMI ${formatCalculatorNumber(result.bmi)}`,
        answer: `${formatKg(result.gainedKg)} gained`,
        metrics: [
          { label: 'Recommended total', value: `${formatKg(result.minGainKg)}-${formatKg(result.maxGainKg)}` },
          { label: 'BMI category', value: result.category },
          { label: '2nd/3rd trimester rate', value: `${formatKg(result.weeklyMinKg)}-${formatKg(result.weeklyMaxKg)}/week` },
        ],
        steps: [
          'Calculate pre-pregnancy BMI from height and pre-pregnancy weight.',
          'Match BMI category to guideline ranges for singleton pregnancy.',
          'Compare current gain with the total recommended range.',
        ],
      };
    }
    case 'pregnancy-conception': {
      const dueDate = inputs.dueDate;
      const conceptionDate = addDaysToIsoDate(dueDate, -266);
      return {
        label: 'Estimated conception date',
        expression: `Due date ${formatDate(dueDate)}`,
        answer: formatDate(conceptionDate),
        metrics: [
          { label: 'Possible window', value: `${formatDate(addDaysToIsoDate(conceptionDate, -5))}-${formatDate(addDaysToIsoDate(conceptionDate, 5))}` },
          { label: 'Estimated LMP', value: formatDate(addDaysToIsoDate(dueDate, -280)) },
          { label: 'Method', value: 'Due date minus 266 days' },
        ],
        steps: [
          'Use the estimated due date as the anchor.',
          'Subtract about 266 days to estimate conception timing.',
          'Show a wider window because ovulation and fertilization vary.',
        ],
      };
    }
    case 'ovulation':
    case 'conception': {
      const cycleLength = parseNumber(inputs.cycleLength, 'Cycle length');
      const lutealLength = parseNumber(inputs.lutealLength, 'Luteal phase');
      const ovulationDate = addDaysToIsoDate(inputs.lastPeriod, cycleLength - lutealLength);
      const fertileStart = addDaysToIsoDate(ovulationDate, -5);
      return {
        label: variant === 'ovulation' ? 'Ovulation estimate' : 'Conception estimate',
        expression: `LMP ${formatDate(inputs.lastPeriod)}, ${formatCalculatorNumber(cycleLength)} day cycle`,
        answer: formatDate(ovulationDate),
        metrics: [
          { label: 'Fertile window', value: `${formatDate(fertileStart)}-${formatDate(ovulationDate)}` },
          { label: 'Next period', value: formatDate(addDaysToIsoDate(inputs.lastPeriod, cycleLength)) },
          { label: 'Luteal phase', value: `${formatCalculatorNumber(lutealLength)} days` },
        ],
        steps: [
          'Estimate the next period from the last period date and cycle length.',
          'Subtract the luteal phase length to estimate ovulation.',
          'Show the fertile window as the five days before ovulation through ovulation day.',
        ],
      };
    }
    case 'period': {
      const cycleLength = parseNumber(inputs.cycleLength, 'Cycle length');
      const periodLength = parseNumber(inputs.periodLength, 'Period length');
      let nextPeriod = addDaysToIsoDate(inputs.lastPeriod, cycleLength);
      const today = getTodayIsoDate();
      while (daysBetweenIsoDates(nextPeriod, today) >= 0) {
        nextPeriod = addDaysToIsoDate(nextPeriod, cycleLength);
      }
      const secondPeriod = addDaysToIsoDate(nextPeriod, cycleLength);
      return {
        label: 'Next period estimate',
        expression: `${formatCalculatorNumber(cycleLength)} day cycle, ${formatCalculatorNumber(periodLength)} day period`,
        answer: formatDate(nextPeriod),
        metrics: [
          { label: 'Expected end', value: formatDate(addDaysToIsoDate(nextPeriod, periodLength - 1)) },
          { label: 'Following period', value: formatDate(secondPeriod) },
          { label: 'Third period', value: formatDate(addDaysToIsoDate(secondPeriod, cycleLength)) },
        ],
        steps: [
          'Start from the first day of the last period.',
          'Add cycle length until the next predicted start date is in the future.',
          'Use period length to estimate the expected end date.',
        ],
      };
    }
    case 'macro': {
      const calories = parseNumber(inputs.calories, 'Calories');
      const percents = getMacroPercents(inputs.macroGoal);
      const result = calculateMacroSplit(calories, percents.protein, percents.fat, percents.carb);
      return {
        label: 'Macro targets',
        expression: `${formatKcal(calories)}/day, ${inputs.macroGoal || 'balanced'} split`,
        answer: `${formatCalculatorNumber(result.carbGrams)}g carbs, ${formatCalculatorNumber(result.proteinGrams)}g protein`,
        metrics: [
          { label: 'Carbs', value: `${formatCalculatorNumber(result.carbGrams)} g` },
          { label: 'Protein', value: `${formatCalculatorNumber(result.proteinGrams)} g` },
          { label: 'Fat', value: `${formatCalculatorNumber(result.fatGrams)} g` },
        ],
        steps: [
          'Choose a macro percentage split that adds to 100%.',
          'Convert protein and carbohydrate calories to grams using 4 kcal per gram.',
          'Convert fat calories to grams using 9 kcal per gram.',
        ],
      };
    }
    case 'carbohydrate':
    case 'fat-intake': {
      const calories = parseNumber(inputs.calories, 'Calories');
      const percent = parseNumber(inputs.percent, 'Percent');
      const grams = variant === 'carbohydrate' ? (calories * (percent / 100)) / 4 : (calories * (percent / 100)) / 9;
      const macroName = variant === 'carbohydrate' ? 'Carbohydrate' : 'Fat';
      return {
        label: `${macroName} target`,
        expression: `${formatCalculatorNumber(percent)}% of ${formatKcal(calories)}`,
        answer: `${formatCalculatorNumber(grams)} g/day`,
        metrics: [
          { label: 'Calories from macro', value: formatKcal(calories * (percent / 100)) },
          { label: 'AMDR reference', value: variant === 'carbohydrate' ? '45-65%' : '20-35%' },
          { label: 'Calories per gram', value: variant === 'carbohydrate' ? '4' : '9' },
        ],
        steps: [
          'Multiply daily calories by the selected percentage.',
          `Divide by ${variant === 'carbohydrate' ? '4' : '9'} calories per gram.`,
          'Compare the percentage with general AMDR reference ranges when appropriate.',
        ],
      };
    }
    case 'protein': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const factor = parseNumber(inputs.proteinGoal, 'Protein factor');
      const grams = calculateProteinGrams(weightKg, factor);
      return {
        label: 'Protein target',
        expression: `${formatKg(weightKg)} x ${formatCalculatorNumber(factor)} g/kg`,
        answer: `${formatCalculatorNumber(grams)} g/day`,
        metrics: [
          { label: 'Calories from protein', value: formatKcal(grams * 4) },
          { label: 'Target factor', value: `${formatCalculatorNumber(factor)} g/kg` },
          { label: 'Weight', value: formatKg(weightKg) },
        ],
        steps: [
          'Choose a protein factor in grams per kilogram of body weight.',
          'Multiply body weight in kilograms by that factor.',
          'Adjust with professional guidance when medical conditions affect protein needs.',
        ],
      };
    }
    case 'gfr': {
      const age = parseNumber(inputs.age, 'Age');
      const creatinine = parseNumber(inputs.creatinine, 'Serum creatinine');
      const result = calculateGfr2021CkdEpi(age, sex, creatinine);
      return {
        label: 'eGFR estimate',
        expression: `${sex}, age ${formatCalculatorNumber(age)}, creatinine ${formatCalculatorNumber(creatinine)} mg/dL`,
        answer: `${formatCalculatorNumber(result.egfr)} mL/min/1.73m2`,
        metrics: [
          { label: 'Interpretation range', value: result.note },
          { label: 'Equation', value: 'CKD-EPI 2021 creatinine' },
          { label: 'Race coefficient', value: 'Not used' },
        ],
        steps: [
          'Use age, sex, and standardized serum creatinine.',
          'Apply the 2021 CKD-EPI creatinine equation.',
          'Interpret eGFR with urine tests, history, and clinician guidance.',
        ],
      };
    }
    case 'body-type': {
      const shouldersCm = parseNumber(inputs.shouldersCm, 'Shoulders');
      const bustCm = parseNumber(inputs.bustCm, 'Bust/chest');
      const waistCm = parseNumber(inputs.waistCm, 'Waist');
      const hipsCm = parseNumber(inputs.hipsCm, 'Hips');
      const bodyType = classifyBodyType(bustCm, waistCm, hipsCm, shouldersCm);
      return {
        label: 'Body type estimate',
        expression: `Shoulders ${formatCalculatorNumber(shouldersCm)}, waist ${formatCalculatorNumber(waistCm)}, hips ${formatCalculatorNumber(hipsCm)}`,
        answer: bodyType,
        metrics: [
          { label: 'Top measurement', value: `${formatCalculatorNumber(Math.max(shouldersCm, bustCm))} cm` },
          { label: 'Waist difference', value: `${formatCalculatorNumber(Math.min(Math.max(shouldersCm, bustCm), hipsCm) - waistCm)} cm` },
          { label: 'Hips', value: `${formatCalculatorNumber(hipsCm)} cm` },
        ],
        steps: [
          'Compare shoulder or bust measurement with hip measurement.',
          'Check how much smaller the waist is than the top and hips.',
          'Assign a broad shape label from those measurement relationships.',
        ],
      };
    }
    case 'body-surface-area': {
      const heightCm = parseNumber(inputs.heightCm, 'Height');
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const result = calculateBodySurfaceArea(heightCm, weightKg);
      return {
        label: 'Body surface area',
        expression: `${formatCalculatorNumber(heightCm)} cm, ${formatKg(weightKg)}`,
        answer: `${formatCalculatorNumber(result.mosteller)} m2`,
        metrics: [
          { label: 'Mosteller', value: `${formatCalculatorNumber(result.mosteller)} m2` },
          { label: 'Du Bois', value: `${formatCalculatorNumber(result.dubois)} m2` },
          { label: 'Formula input', value: 'height and weight' },
        ],
        steps: [
          'Mosteller BSA = square root of height in cm times weight in kg divided by 3600.',
          'Du Bois gives a second common estimate.',
          'Do not use this page for medication dosing decisions.',
        ],
      };
    }
    case 'bac': {
      const weightKg = parseNumber(inputs.weightKg, 'Weight');
      const drinkCount = parseNumber(inputs.drinkCount, 'Drink count');
      const volumeMl = parseNumber(inputs.volumeMl, 'Drink volume');
      const alcoholPercent = parseNumber(inputs.alcoholPercent, 'Alcohol percentage');
      const hours = parseNumber(inputs.hours, 'Hours');
      const result = estimateBac(sex, weightKg, drinkCount, volumeMl, alcoholPercent, hours);
      return {
        label: 'Estimated BAC',
        expression: `${formatCalculatorNumber(drinkCount)} drinks, ${formatCalculatorNumber(alcoholPercent)}% ABV`,
        answer: `${formatCalculatorNumber(result.bacPercent)}%`,
        metrics: [
          { label: 'Alcohol consumed', value: `${formatCalculatorNumber(result.gramsAlcohol)} g` },
          { label: 'Estimated time to zero', value: `${formatCalculatorNumber(result.hoursToZero)} hours` },
          { label: 'Widmark estimate', value: sex },
        ],
        steps: [
          'Estimate grams of alcohol from drink volume, ABV, and drink count.',
          'Apply a Widmark-style body-water factor by sex and body weight.',
          'Subtract an average elimination rate for elapsed time.',
        ],
        note: 'Never use this estimate to decide whether it is safe or legal to drive.',
      };
    }
    default: {
      const exhaustiveCheck: never = variant;
      return exhaustiveCheck;
    }
  }
}

export default function HealthFitnessCalculator({ variant }: Props) {
  const config = healthConfigs[variant];
  const [modeId, setModeId] = useState(config.modes[0].id);
  const activeMode = useMemo(
    () => config.modes.find((mode) => mode.id === modeId) ?? config.modes[0],
    [config.modes, modeId],
  );
  const [inputs, setInputs] = useState<HealthInputs>(activeMode.defaultInputs);
  const [result, setResult] = useState<HealthCalculation | null>(() =>
    calculateHealth(variant, activeMode.id, activeMode.defaultInputs),
  );
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HealthCalculation[]>([]);
  const [copied, setCopied] = useState(false);

  function changeMode(nextMode: HealthMode) {
    setModeId(nextMode.id);
    setInputs(nextMode.defaultInputs);
    setResult(calculateHealth(variant, nextMode.id, nextMode.defaultInputs));
    setError('');
    setCopied(false);
  }

  function updateInput(key: string, value: string) {
    setInputs((current) => ({ ...current, [key]: value }));
    setError('');
    setCopied(false);
  }

  function runCalculation(nextInputs = inputs) {
    try {
      const nextResult = calculateHealth(variant, activeMode.id, nextInputs);
      setResult(nextResult);
      setHistory((current) => [nextResult, ...current].slice(0, 4));
      setError('');
      setCopied(false);
    } catch (calculationError) {
      setError(calculationError instanceof Error ? calculationError.message : 'Check the inputs and try again.');
      setCopied(false);
    }
  }

  function useExample(example: HealthExample) {
    setInputs(example.inputs);
    runCalculation(example.inputs);
  }

  async function copyResult() {
    if (!result || error) return;

    try {
      await navigator.clipboard?.writeText(`${result.expression} = ${result.answer}`);
      setCopied(true);
    } catch {
      setCopied(false);
      setError('Copy was not available in this browser. You can still select the answer manually.');
    }
  }

  function runOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      runCalculation();
    }
  }

  return (
    <section className="advanced-calculator advanced-calculator-health" aria-label={`${config.title} workspace`}>
      <div className="advanced-panel">
        {config.modes.length > 1 && (
          <div className="advanced-mode-grid health-mode-grid" aria-label="Calculator modes">
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

        <div className="advanced-fields health-fields">
          {activeMode.fields.map((field) => (
            <label className="advanced-field" key={field.key}>
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
                  onKeyDown={runOnEnter}
                  placeholder={field.placeholder}
                  type={field.type === 'date' ? 'date' : 'text'}
                  value={inputs[field.key] ?? ''}
                />
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

        {error && <p className="calculator-error" role="alert">{error}</p>}

        {result && (
          <article className="advanced-result-card health-result-card" aria-live="polite">
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
          <div className="advanced-quick-grid health-example-grid">
            {activeMode.examples.map((example) => (
              <button key={example.label} onClick={() => useExample(example)} type="button">
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2>Recent answers</h2>
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
