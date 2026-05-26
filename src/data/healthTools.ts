import type { ToolDefinition, ToolExample, ToolFaq } from './tools';

interface HealthToolSpec {
  slug: string;
  name: string;
  summary: string;
  description: string;
  seoDescription?: string;
  icon: string;
  formula: string;
  caution: string;
  useCases: string[];
  examples: ToolExample[];
  extraFaq?: ToolFaq[];
  relatedSlugs: string[];
}

function makeFaq(spec: HealthToolSpec): ToolFaq[] {
  const exampleUses = spec.useCases.slice(0, 2).join(' ');
  const isBmiCalculator = spec.slug === 'bmi-calculator';
  const isTargetHeartRateCalculator = spec.slug === 'target-heart-rate-calculator';
  const inputAnswer = isBmiCalculator
    ? 'Enter adult height and weight in the units shown. BMI uses weight compared with height squared, so a small unit mistake can move the category. This page is for adult BMI screening only; children and teens use age-and-sex percentiles instead.'
    : isTargetHeartRateCalculator
      ? 'Enter your age, choose the effort range, and add resting heart rate only if you want the heart-rate-reserve estimate. Age sets the rough maximum heart rate. The effort range turns that into beats per minute.'
    : 'Enter the body, activity, date, or lab values exactly in the units shown on the page. Height, weight, age, sex, time, and activity level can change health estimates a lot, so treat each label like a rule instead of a suggestion. If you are unsure which option fits, choose the closest honest match and read the result as a rough estimate.';
  const readingAnswer = isBmiCalculator
    ? 'Read BMI as a quick adult screening number. It can miss important context such as pregnancy, high muscle mass, waist size, body composition, age, medical history, and ethnicity. Use it as a clue, not a final health answer.'
    : isTargetHeartRateCalculator
      ? 'Read the answer as a training range in beats per minute, not a perfect target you must hit. If the range feels too hard, you feel pain, or a clinician gave you a different limit, slow down and use the safer guidance.'
    : 'Use the result as a learning number, not a final answer about your body or health. The supporting lines can show categories, ranges, calories, dates, or targets, but those numbers still need context like age, medical history, pregnancy status, training level, and advice from a qualified professional.';

  return [
    {
      question: `When should I use the ${spec.name}?`,
      answer: `Use it for simple educational checks, trend tracking, or planning tasks like these: ${exampleUses} It can help you understand a number, but it cannot explain your whole health situation.`,
    },
    {
      question: `What do the main ${spec.name} inputs mean?`,
      answer: inputAnswer,
    },
    {
      question: `What is the ${spec.name} doing with my inputs?`,
      answer: `In plain language: ${spec.formula} Read the result together with the notes on the page, because health and fitness numbers often need personal context.`,
    },
    {
      question: `How should I read the ${spec.name} result?`,
      answer: readingAnswer,
    },
    ...(spec.extraFaq ?? []),
    ...(isBmiCalculator
      ? [
          {
            question: 'Can children, teens, pregnant people, or athletes use adult BMI the same way?',
            answer:
              'No. Children and teens need BMI percentiles, pregnancy changes body weight for a different reason, and athletes can have more muscle mass than BMI expects. In those cases, use BMI only as a rough note and ask a qualified professional for real guidance.',
          },
        ]
      : []),
    {
      question: 'Can I use this as medical advice?',
      answer: `${spec.caution} Use the calculator as a learning tool, then ask a qualified professional about decisions that affect care, pregnancy, medication, nutrition, or safety.`,
    },
    {
      question: 'What should I double-check before trusting the result?',
      answer:
        'Check the units, date, and personal details before reading the answer. For example, pounds and kilograms, inches and centimeters, or a wrong activity level can change the result quickly. If the number feels surprising, rerun it slowly and compare it with the examples.',
    },
    {
      question: 'Does the site save my health inputs?',
      answer:
        'No. The calculator runs in your browser tab. Recent answers stay only on the page while you use it, and they are not sent to a server.',
    },
  ];
}

function makeHealthTool(spec: HealthToolSpec): ToolDefinition {
  return {
    slug: spec.slug,
    name: spec.name,
    category: 'health-fitness',
    summary: spec.summary,
    description: spec.description,
    icon: spec.icon,
    seoTitle: `${spec.name} | Free Online Health Calculator`,
    seoDescription: spec.seoDescription ?? spec.description,
    useCases: spec.useCases,
    examples: spec.examples,
    faq: makeFaq(spec),
    relatedSlugs: spec.relatedSlugs,
  };
}

const estimateCaution =
  'No. This page provides an educational estimate only. Talk with a qualified health professional before making medical, pregnancy, nutrition, medication, or safety decisions.';

export const healthTools: ToolDefinition[] = [
  makeHealthTool({
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    summary: 'Estimate adult body mass index and healthy BMI weight range.',
    description:
      'Use this free BMI calculator to estimate adult body mass index, weight category, and a healthy BMI reference range from height and weight.',
    icon: 'calculator-bmi',
    formula: 'BMI is calculated as weight in kilograms divided by height in meters squared, then compared with adult BMI screening categories.',
    caution:
      'No. BMI is an educational adult screening estimate, not medical advice and not a diagnosis. Talk with a qualified health professional before making medical, pregnancy, nutrition, medication, or safety decisions.',
    useCases: [
      'Estimate adult BMI from metric height and weight.',
      'Compare BMI with common adult screening categories.',
      'Find the weight range that matches BMI 18.5 to 24.9 for a height.',
      'Use a consistent estimate while tracking health or fitness changes.',
    ],
    examples: [
      { label: 'Healthy range example', expression: '170 cm, 70 kg', result: 'BMI about 24.2' },
      { label: 'Taller adult', expression: '183 cm, 82 kg', result: 'BMI about 24.5' },
      { label: 'Smaller adult', expression: '160 cm, 52 kg', result: 'BMI about 20.3' },
    ],
    relatedSlugs: ['healthy-weight-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'underweight-bmi-calculator',
    name: 'Underweight BMI Calculator',
    summary: 'Check adult BMI against the underweight screening threshold with careful safety notes.',
    description:
      'Use this free underweight BMI calculator to compare adult BMI with the BMI 18.5 screening threshold and healthy BMI reference range.',
    icon: 'calculator-underweight-bmi',
    formula:
      'BMI is weight in kilograms divided by height in meters squared. The calculator compares the result with the adult underweight threshold of BMI less than 18.5.',
    caution:
      'BMI cannot diagnose anorexia, malnutrition, or any eating disorder. If eating, weight, exercise, or body image feels hard to control, talk with a qualified health professional.',
    useCases: [
      'Check whether an adult BMI is below 18.5.',
      'See how far a weight is from the BMI 18.5 reference threshold.',
      'Read why BMI alone cannot diagnose an eating disorder.',
      'Use a safer alternative to harmful anorexic-BMI style pages.',
    ],
    examples: [
      { label: 'Underweight screen', expression: '170 cm, 50 kg', result: 'BMI about 17.3' },
      { label: 'Near threshold', expression: '160 cm, 47 kg', result: 'BMI about 18.4' },
      { label: 'Taller adult', expression: '183 cm, 62 kg', result: 'BMI about 18.5' },
    ],
    relatedSlugs: ['bmi-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'overweight-calculator',
    name: 'Overweight BMI Calculator',
    summary: 'Check adult BMI against overweight and obesity screening categories.',
    description:
      'Use this free overweight BMI calculator to compare adult BMI with the 25 and 30 BMI screening thresholds.',
    icon: 'calculator-overweight',
    formula:
      'BMI is weight in kilograms divided by height in meters squared. Adult BMI 25 to less than 30 is the overweight category, and 30 or greater is the obesity category.',
    caution:
      'BMI is a screening tool, not a complete health judgment. Body composition, waist size, medical history, medications, and clinician review can change the real health picture.',
    useCases: [
      'Check whether an adult BMI is in the overweight screening category.',
      'See how far a weight is above the BMI 24.9 reference boundary.',
      'Compare the result with the BMI 30 obesity screening threshold.',
      'Use people-first, non-shaming language around BMI categories.',
    ],
    examples: [
      { label: 'Overweight screen', expression: '170 cm, 78 kg', result: 'BMI about 27.0' },
      { label: 'Taller adult', expression: '183 cm, 92 kg', result: 'BMI about 27.5' },
      { label: 'Smaller adult', expression: '160 cm, 70 kg', result: 'BMI about 27.3' },
    ],
    relatedSlugs: ['bmi-calculator', 'healthy-weight-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'nutrition-points-calculator',
    name: 'Nutrition Points Calculator',
    summary: 'Create a transparent food-label score from calories, saturated fat, added sugar, sodium, fiber, and protein.',
    description:
      'Use this free nutrition points calculator to compare foods with an original transparent score based on common Nutrition Facts label fields.',
    icon: 'calculator-nutrition-points',
    formula:
      'The calculator adds moderation points from calories, saturated fat, added sugar, and sodium, then subtracts support credits from fiber and protein.',
    caution:
      'This is not Weight Watchers Points, not affiliated with WW, and not medical nutrition advice. It is a transparent educational score for rough comparisons.',
    useCases: [
      'Compare two packaged foods using the same label-based score.',
      'See how added sugar, saturated fat, sodium, fiber, and protein change a food score.',
      'Use a non-proprietary alternative to branded points calculators.',
      'Practice reading Nutrition Facts labels more carefully.',
    ],
    examples: [
      { label: 'Snack label', expression: '240 kcal, 2 g sat fat, 8 g added sugar', result: 'Moderate points' },
      { label: 'Greek yogurt', expression: '150 kcal, 15 g protein', result: 'Lower points' },
      { label: 'Sweet drink', expression: '180 kcal, 38 g added sugar', result: 'Higher points' },
    ],
    relatedSlugs: ['calorie-calculator', 'macro-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    summary: 'Estimate daily calories from BMR, activity level, and goal.',
    description:
      'Use this free calorie calculator to estimate maintenance calories and gentle loss or gain targets using BMR and activity level.',
    icon: 'calculator-calorie',
    formula: 'The calculator estimates BMR with the Mifflin-St Jeor equation, multiplies by an activity factor, then applies the selected goal adjustment.',
    caution: estimateCaution,
    useCases: [
      'Estimate daily maintenance calories.',
      'Compare sedentary, light, moderate, and active calorie needs.',
      'Create a gentle calorie target for weight loss or gain planning.',
      'Cross-check TDEE and macro calculations.',
    ],
    examples: [
      { label: 'Moderate maintenance', expression: '32, female, 165 cm, 68 kg', result: 'Maintenance calorie estimate' },
      { label: 'Light activity loss', expression: '41, male, 178 cm, 86 kg', result: 'Gentle loss target' },
      { label: 'Very active gain', expression: '27, female, 172 cm, 63 kg', result: 'Gentle gain target' },
    ],
    relatedSlugs: ['tdee-calculator', 'bmr-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    summary: 'Estimate body fat percentage with a tape-measure method.',
    description:
      'Use this free body fat calculator to estimate body fat percentage, fat mass, and lean mass from circumference measurements.',
    icon: 'calculator-body-fat',
    formula:
      'The calculator uses the common circumference method: height, neck, and waist for the male equation, and height, neck, waist, and hips for the female equation.',
    caution: estimateCaution,
    useCases: [
      'Estimate body fat percentage without a scale that measures body composition.',
      'Track tape-measure changes over time.',
      'Compare estimated fat mass and lean mass.',
      'Use alongside BMI for a broader screening picture.',
    ],
    examples: [
      { label: 'Female tape example', expression: '165 cm, neck 34, waist 78, hips 98', result: 'Estimated body fat percent' },
      { label: 'Male tape example', expression: '180 cm, neck 40, waist 88', result: 'Estimated body fat percent' },
      { label: 'Trend check', expression: 'Repeat the same tape sites', result: 'Compare estimated change' },
    ],
    relatedSlugs: ['army-body-fat-calculator', 'lean-body-mass-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'bmr-calculator',
    name: 'BMR Calculator',
    summary: 'Estimate basal metabolic rate with the Mifflin-St Jeor equation.',
    description:
      'Use this free BMR calculator to estimate resting daily energy needs from age, sex, height, and weight.',
    icon: 'calculator-bmr',
    formula: 'BMR uses the Mifflin-St Jeor equation: 10 x weight kg + 6.25 x height cm - 5 x age + sex adjustment.',
    caution: estimateCaution,
    useCases: [
      'Estimate resting energy needs before activity is added.',
      'Compare BMR with TDEE and calorie targets.',
      'Understand how height, weight, age, and formula sex affect the estimate.',
      'Use as the base for nutrition planning tools.',
    ],
    examples: [
      { label: 'Male example', expression: '35, 178 cm, 82 kg', result: 'BMR estimate' },
      { label: 'Female example', expression: '29, 164 cm, 61 kg', result: 'BMR estimate' },
      { label: 'Compare TDEE', expression: 'BMR x activity factor', result: 'Estimated daily expenditure' },
    ],
    relatedSlugs: ['tdee-calculator', 'calorie-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    summary: 'Estimate ideal body weight and compare it with healthy BMI range.',
    description:
      'Use this free ideal weight calculator to estimate Devine ideal body weight and adult healthy BMI range from height.',
    icon: 'calculator-ideal-weight',
    formula: 'The Devine estimate starts at 50 kg for males or 45.5 kg for females at 5 feet, then adds 2.3 kg per inch over 5 feet.',
    caution: estimateCaution,
    useCases: [
      'Estimate a classic ideal body weight reference.',
      'Compare a formula result with the healthy BMI range.',
      'Use height-based weight references in planning notes.',
      'Avoid treating one formula as a personal health target.',
    ],
    examples: [
      { label: 'Male 180 cm', expression: 'Devine estimate', result: 'About 75 kg' },
      { label: 'Female 165 cm', expression: 'Devine estimate', result: 'About 57 kg' },
      { label: 'BMI range', expression: 'Height-based', result: 'Healthy BMI reference range' },
    ],
    relatedSlugs: ['healthy-weight-calculator', 'bmi-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'pace-calculator',
    name: 'Pace Calculator',
    summary: 'Calculate running, walking, or cycling pace from time and distance.',
    description:
      'Use this free pace calculator to convert distance and time into pace per kilometer or mile and speed per hour.',
    icon: 'calculator-pace',
    formula: 'Pace is total time divided by distance. Speed is distance divided by total time in hours.',
    caution: 'This is a fitness planning calculator, not medical advice. Choose training intensity that fits your health and ability.',
    useCases: [
      'Find pace per kilometer after a run or walk.',
      'Find pace per mile for race planning.',
      'Convert a workout time into speed per hour.',
      'Compare training sessions with consistent distance units.',
    ],
    examples: [
      { label: '5K run', expression: '5 km in 25:00', result: '5:00 per km' },
      { label: '10K run', expression: '10 km in 55:30', result: '5:33 per km' },
      { label: 'Three miles', expression: '3 mi in 30:00', result: '10:00 per mile' },
    ],
    relatedSlugs: ['calories-burned-calculator', 'target-heart-rate-calculator', 'one-rep-max-calculator'],
  }),
  makeHealthTool({
    slug: 'army-body-fat-calculator',
    name: 'Army Body Fat Calculator',
    summary: 'Estimate body fat with a circumference tape method.',
    description:
      'Use this free Army body fat calculator for an educational tape-method body fat estimate from height and circumference measurements.',
    icon: 'calculator-army-body-fat',
    formula:
      'The calculator uses circumference equations with height, neck, and abdomen or waist measurements, plus hips for the female equation.',
    caution:
      'This is not an official Army determination, record, waiver, or pass/fail result. Use official policy and trained personnel for official assessments.',
    useCases: [
      'Estimate a tape-method body fat percentage.',
      'Practice what measurements affect circumference estimates.',
      'Track changes using the same measurement sites.',
      'Avoid treating the page as an official military decision.',
    ],
    examples: [
      { label: 'Male tape', expression: 'Height 178, neck 40, abdomen 90', result: 'Tape estimate' },
      { label: 'Female tape', expression: 'Height 165, neck 34, waist 76, hips 96', result: 'Tape estimate' },
      { label: 'Trend check', expression: 'Repeat measurements consistently', result: 'Compare estimated change' },
    ],
    relatedSlugs: ['body-fat-calculator', 'lean-body-mass-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'lean-body-mass-calculator',
    name: 'Lean Body Mass Calculator',
    summary: 'Estimate lean body mass from height, weight, and formula sex.',
    description:
      'Use this free lean body mass calculator to estimate fat-free mass from height, weight, and formula sex using the Boer equation.',
    icon: 'calculator-lean-mass',
    formula: 'The calculator uses Boer lean body mass equations based on height, weight, and formula sex.',
    caution: estimateCaution,
    useCases: [
      'Estimate lean body mass for fitness planning.',
      'Compare lean mass with body weight.',
      'Use a formula estimate when body fat percentage is unknown.',
      'Track changes only as rough estimates.',
    ],
    examples: [
      { label: 'Male 180/82', expression: '180 cm, 82 kg', result: 'Lean body mass estimate' },
      { label: 'Female 165/62', expression: '165 cm, 62 kg', result: 'Lean body mass estimate' },
      { label: 'Lean percent', expression: 'LBM / body weight', result: 'Estimated lean percentage' },
    ],
    relatedSlugs: ['body-fat-calculator', 'bmr-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'healthy-weight-calculator',
    name: 'Healthy Weight Calculator',
    summary: 'Find the adult healthy BMI weight range for a height.',
    description:
      'Use this free healthy weight calculator to find the adult BMI 18.5 to 24.9 weight range for a height and optional current BMI.',
    icon: 'calculator-healthy-weight',
    formula: 'The calculator multiplies height in meters squared by BMI 18.5 and 24.9 to estimate a healthy adult BMI range.',
    caution: estimateCaution,
    useCases: [
      'Find a height-based adult BMI reference range.',
      'Check an optional current BMI category.',
      'Compare healthy weight range with ideal weight formulas.',
      'Use as a screening estimate rather than a personal target.',
    ],
    examples: [
      { label: '170 cm', expression: 'BMI 18.5-24.9', result: 'Healthy weight range' },
      { label: '160 cm', expression: 'BMI 18.5-24.9', result: 'Healthy weight range' },
      { label: '183 cm', expression: 'BMI 18.5-24.9', result: 'Healthy weight range' },
    ],
    relatedSlugs: ['bmi-calculator', 'ideal-weight-calculator', 'body-fat-calculator'],
  }),
  makeHealthTool({
    slug: 'calories-burned-calculator',
    name: 'Calories Burned Calculator',
    summary: 'Estimate exercise calories from MET, body weight, and duration.',
    description:
      'Use this free calories burned calculator to estimate exercise energy from activity intensity, body weight, and time.',
    icon: 'calculator-calories-burned',
    formula: 'Calories per minute are estimated as MET x 3.5 x weight in kg / 200, then multiplied by duration.',
    caution: estimateCaution,
    useCases: [
      'Estimate calories burned during common activities.',
      'Compare walking, running, cycling, swimming, and strength sessions.',
      'See calories per hour from a workout estimate.',
      'Use activity estimates without treating them as exact energy balance.',
    ],
    examples: [
      { label: 'Brisk walk', expression: '3.8 MET, 70 kg, 45 min', result: 'About 210 kcal' },
      { label: 'Running', expression: '9.8 MET, 80 kg, 30 min', result: 'About 412 kcal' },
      { label: 'Strength', expression: '5 MET, 72 kg, 50 min', result: 'About 315 kcal' },
    ],
    relatedSlugs: ['pace-calculator', 'calorie-calculator', 'target-heart-rate-calculator'],
  }),
  makeHealthTool({
    slug: 'one-rep-max-calculator',
    name: 'One Rep Max Calculator',
    summary: 'Estimate one-rep max from weight lifted and reps completed.',
    description:
      'Use this free one rep max calculator to estimate 1RM with Epley and Brzycki formulas for strength training.',
    icon: 'calculator-one-rep-max',
    formula: 'The main estimate uses Epley: one-rep max = weight x (1 + reps / 30). Brzycki is shown as a comparison.',
    caution:
      'This is training math, not a safety guarantee. Do not attempt heavy max lifts without appropriate technique, equipment, and supervision.',
    useCases: [
      'Estimate a one-rep max without testing a true max.',
      'Compare Epley and Brzycki estimates.',
      'Plan training percentages from a recent rep set.',
      'Track strength changes over time.',
    ],
    examples: [
      { label: 'Bench example', expression: '100 kg x 5', result: 'Estimated 1RM about 117 kg' },
      { label: 'Squat example', expression: '140 kg x 3', result: 'Estimated 1RM about 154 kg' },
      { label: 'Volume set', expression: '60 kg x 8', result: 'Estimated 1RM about 76 kg' },
    ],
    relatedSlugs: ['calories-burned-calculator', 'target-heart-rate-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'target-heart-rate-calculator',
    name: 'Target Heart Rate Calculator',
    summary: 'Estimate exercise heart-rate zones in beats per minute.',
    description:
      'Estimate moderate, vigorous, or general exercise heart-rate zones from age, effort range, and optional resting pulse.',
    seoDescription:
      'Estimate target heart rate zones by age, compare 50-70% and 70-85% effort, and add resting pulse for heart-rate reserve.',
    icon: 'calculator-target-heart',
    formula:
      'The calculator estimates maximum heart rate as 220 minus age, multiplies that number by the selected intensity range, and also shows heart-rate reserve when resting pulse is entered.',
    caution:
      'This is an exercise-intensity estimate, not medical advice. Ask a clinician what heart-rate limit to use if you have a heart condition, take medication that affects pulse, are pregnant, or feel chest pain, dizziness, or unusual shortness of breath.',
    useCases: [
      'Estimate moderate-intensity heart-rate range.',
      'Estimate vigorous-intensity heart-rate range.',
      'Compare simple max-heart-rate and heart-rate-reserve methods.',
      'Check whether a workout feels close to the intended effort.',
    ],
    examples: [
      { label: 'Age 35', expression: '50-85% zone', result: '93-157 bpm from an estimated 185 bpm max' },
      { label: 'Age 50', expression: 'Moderate 50-70%', result: '85-119 bpm from an estimated 170 bpm max' },
      { label: 'Resting HR included', expression: 'Age 35, resting 65, 50-85%', result: '125-167 bpm heart-rate reserve range' },
    ],
    extraFaq: [
      {
        question: 'What does 50-70% mean for target heart rate?',
        answer:
          'It is the common moderate-intensity range. For a 35-year-old, the simple max estimate is 185 bpm, so 50-70% is about 93-130 bpm.',
      },
      {
        question: 'What does 70-85% mean for target heart rate?',
        answer:
          'It is the common vigorous-intensity range. For a 35-year-old, the simple estimate is about 130-157 bpm, but you should still listen to breathing, comfort, heat, and medical limits.',
      },
      {
        question: 'Why does resting heart rate change the result?',
        answer:
          'Resting heart rate lets the calculator show a heart-rate-reserve estimate. It starts from your resting pulse, then adds part of the gap between resting pulse and estimated maximum heart rate.',
      },
      {
        question: 'Is 220 minus age exact?',
        answer:
          'No. It is a quick age-based estimate. Real maximum heart rate can be higher or lower, and fitness level, sleep, heat, stress, and medication can all change how hard a number feels.',
      },
      {
        question: 'Should I chase the top of the zone?',
        answer:
          'No. Start near the lower end if you are new, coming back after a break, exercising in heat, or unsure how hard to go. A safer workout you can repeat is better than forcing a number.',
      },
      {
        question: 'When should I stop using the number and slow down?',
        answer:
          'Slow down or stop if you feel chest pain, dizziness, faintness, unusual shortness of breath, or a heart rate that feels wrong for you. Use medical advice before training through warning signs.',
      },
    ],
    relatedSlugs: ['pace-calculator', 'calories-burned-calculator', 'calorie-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-calculator',
    name: 'Pregnancy Calculator',
    summary: 'Estimate due date, gestational age, conception date, and trimester.',
    description:
      'Use this free pregnancy calculator to estimate due date, gestational age today, conception timing, and trimester from last period date.',
    icon: 'calculator-pregnancy',
    formula: 'The calculator starts with the first day of the last menstrual period, adds about 280 days, and adjusts for cycle length.',
    caution: estimateCaution,
    useCases: [
      'Estimate an expected due date from LMP.',
      'Check gestational age today.',
      'Estimate conception timing from cycle length.',
      'Use a simple date reference before clinical dating is confirmed.',
    ],
    examples: [
      { label: 'LMP Apr 1', expression: '28-day cycle', result: 'Estimated due date' },
      { label: 'Longer cycle', expression: '32-day cycle', result: 'Due date adjusted later' },
      { label: 'Shorter cycle', expression: '26-day cycle', result: 'Due date adjusted earlier' },
    ],
    relatedSlugs: ['due-date-calculator', 'pregnancy-conception-calculator', 'ovulation-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-weight-gain-calculator',
    name: 'Pregnancy Weight Gain Calculator',
    summary: 'Compare pregnancy weight gain with BMI-based guideline ranges.',
    description:
      'Use this free pregnancy weight gain calculator to compare current gain with BMI-based singleton pregnancy guideline ranges.',
    icon: 'calculator-pregnancy-weight',
    formula: 'The calculator finds pre-pregnancy BMI, matches the BMI category to recommended total gain ranges, and compares current gain.',
    caution: estimateCaution,
    useCases: [
      'Estimate pre-pregnancy BMI category.',
      'Compare current gain with guideline ranges.',
      'View second and third trimester weekly gain references.',
      'Prepare questions for prenatal visits.',
    ],
    examples: [
      { label: 'Week 24', expression: '165 cm, 62 kg to 70 kg', result: 'Gain compared with guideline range' },
      { label: 'Week 30', expression: '170 cm, 78 kg to 86 kg', result: 'Gain compared with guideline range' },
      { label: 'Week 18', expression: '160 cm, 52 kg to 57 kg', result: 'Gain compared with guideline range' },
    ],
    relatedSlugs: ['pregnancy-calculator', 'due-date-calculator', 'bmi-calculator'],
  }),
  makeHealthTool({
    slug: 'pregnancy-conception-calculator',
    name: 'Pregnancy Conception Calculator',
    summary: 'Estimate conception date from an expected due date.',
    description:
      'Use this free pregnancy conception calculator to estimate conception date, possible conception window, and LMP from a due date.',
    icon: 'calculator-pregnancy-conception',
    formula: 'The calculator estimates conception as about 266 days before the due date and shows a wider possible window.',
    caution: estimateCaution,
    useCases: [
      'Estimate conception timing from a due date.',
      'Find a possible conception window.',
      'Back-calculate an estimated LMP.',
      'Understand why conception dates are approximate.',
    ],
    examples: [
      { label: 'Due Jan 6', expression: 'Due date minus 266 days', result: 'Estimated conception date' },
      { label: 'Possible window', expression: 'Conception estimate +/- 5 days', result: 'Approximate range' },
      { label: 'Estimated LMP', expression: 'Due date minus 280 days', result: 'Estimated LMP' },
    ],
    relatedSlugs: ['pregnancy-calculator', 'due-date-calculator', 'conception-calculator'],
  }),
  makeHealthTool({
    slug: 'due-date-calculator',
    name: 'Due Date Calculator',
    summary: 'Estimate pregnancy due date from LMP and cycle length.',
    description:
      'Use this free due date calculator to estimate expected delivery date from the first day of the last period and cycle length.',
    icon: 'calculator-due-date',
    formula: 'The calculator uses Naegele-style dating: LMP plus 280 days, adjusted by the difference from a 28-day cycle.',
    caution: estimateCaution,
    useCases: [
      'Estimate a due date from last menstrual period.',
      'Adjust the estimate for shorter or longer cycles.',
      'Find estimated conception date alongside due date.',
      'Use as a planning reference before clinical confirmation.',
    ],
    examples: [
      { label: 'LMP Apr 1', expression: '28-day cycle', result: 'Estimated due date Jan 6, 2027' },
      { label: '32-day cycle', expression: 'Due date moves later', result: 'Cycle-adjusted estimate' },
      { label: '26-day cycle', expression: 'Due date moves earlier', result: 'Cycle-adjusted estimate' },
    ],
    relatedSlugs: ['pregnancy-calculator', 'pregnancy-conception-calculator', 'ovulation-calculator'],
  }),
  makeHealthTool({
    slug: 'ovulation-calculator',
    name: 'Ovulation Calculator',
    summary: 'Estimate ovulation date and fertile window from cycle details.',
    description:
      'Use this free ovulation calculator to estimate ovulation date, fertile window, and next period from last period and cycle length.',
    icon: 'calculator-ovulation',
    formula: 'The calculator estimates ovulation by subtracting luteal phase length from the next expected period date.',
    caution: estimateCaution,
    useCases: [
      'Estimate ovulation for regular cycles.',
      'See the fertile window around ovulation.',
      'Plan cycle tracking with a luteal phase assumption.',
      'Avoid using calendar estimates as contraception.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'LMP Apr 1, luteal 14', result: 'Ovulation around day 14' },
      { label: '30-day cycle', expression: 'LMP Apr 4, luteal 14', result: 'Ovulation around day 16' },
      { label: 'Fertile window', expression: 'Five days before ovulation through ovulation', result: 'Estimated window' },
    ],
    relatedSlugs: ['conception-calculator', 'period-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'conception-calculator',
    name: 'Conception Calculator',
    summary: 'Estimate conception timing from cycle and ovulation assumptions.',
    description:
      'Use this free conception calculator to estimate conception date and fertile window from last period, cycle length, and luteal phase.',
    icon: 'calculator-conception',
    formula: 'The calculator estimates ovulation as next period date minus luteal phase length, then uses that as an approximate conception date.',
    caution: estimateCaution,
    useCases: [
      'Estimate conception timing from cycle data.',
      'Find a fertile window for regular cycles.',
      'Compare conception estimates with due-date estimates.',
      'Understand that ovulation can vary month to month.',
    ],
    examples: [
      { label: 'Typical cycle', expression: '28-day cycle, luteal 14', result: 'Approximate conception date' },
      { label: 'Long cycle', expression: '32-day cycle', result: 'Later estimated ovulation' },
      { label: 'Short luteal', expression: '27-day cycle, luteal 12', result: 'Cycle-based estimate' },
    ],
    relatedSlugs: ['ovulation-calculator', 'pregnancy-conception-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'period-calculator',
    name: 'Period Calculator',
    summary: 'Predict upcoming period dates from cycle length and period length.',
    description:
      'Use this free period calculator to estimate the next period start, expected end, and upcoming cycle dates.',
    icon: 'calculator-period',
    formula: 'The calculator adds cycle length to the first day of the last period until it finds the next expected period start date.',
    caution: estimateCaution,
    useCases: [
      'Estimate the next period start date.',
      'Estimate expected period end date.',
      'List upcoming cycles for planning.',
      'Use calendar estimates while remembering cycles can change.',
    ],
    examples: [
      { label: '28-day cycle', expression: 'Last period Apr 1, 5 days long', result: 'Next period estimate' },
      { label: '30-day cycle', expression: 'Last period Apr 5', result: 'Next cycle dates' },
      { label: 'Short cycle', expression: '26-day cycle', result: 'Earlier next period estimate' },
    ],
    relatedSlugs: ['ovulation-calculator', 'conception-calculator', 'due-date-calculator'],
  }),
  makeHealthTool({
    slug: 'macro-calculator',
    name: 'Macro Calculator',
    summary: 'Split daily calories into protein, fat, and carbohydrate grams.',
    description:
      'Use this free macro calculator to convert daily calories into protein, fat, and carbohydrate targets for balanced or goal-based plans.',
    icon: 'calculator-macro',
    formula: 'The calculator applies a selected protein, fat, and carbohydrate percentage split, using 4 kcal per gram for protein and carbs and 9 kcal per gram for fat.',
    caution: estimateCaution,
    useCases: [
      'Convert calories into macro grams.',
      'Compare balanced, higher-protein, and lower-carb splits.',
      'Plan meals with calorie and macro targets.',
      'Cross-check carb, protein, and fat calculators.',
    ],
    examples: [
      { label: 'Balanced', expression: '2000 kcal', result: 'Carbs, protein, and fat grams' },
      { label: 'Higher protein', expression: '2400 kcal', result: 'Higher protein gram target' },
      { label: 'Lower carb', expression: '1800 kcal', result: 'Lower carbohydrate split' },
    ],
    relatedSlugs: ['carbohydrate-calculator', 'protein-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'carbohydrate-calculator',
    name: 'Carbohydrate Calculator',
    summary: 'Calculate carbohydrate grams from calories and carb percentage.',
    description:
      'Use this free carbohydrate calculator to convert daily calories and carbohydrate percentage into grams per day.',
    icon: 'calculator-carbohydrate',
    formula: 'Carbohydrate grams = calories x carbohydrate percentage / 100 / 4.',
    caution: estimateCaution,
    useCases: [
      'Convert carb percentage into grams.',
      'Compare targets against AMDR reference ranges.',
      'Plan carbohydrate intake for a calorie target.',
      'Use with macro and calorie calculators.',
    ],
    examples: [
      { label: '50% of 2000', expression: '2000 kcal x 50%', result: '250 g carbohydrate' },
      { label: '45% of 1800', expression: '1800 kcal x 45%', result: '202.5 g carbohydrate' },
      { label: '60% of 2500', expression: '2500 kcal x 60%', result: '375 g carbohydrate' },
    ],
    relatedSlugs: ['macro-calculator', 'protein-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'protein-calculator',
    name: 'Protein Calculator',
    summary: 'Estimate protein grams per day from body weight and target factor.',
    description:
      'Use this free protein calculator to estimate daily protein grams from body weight and common grams-per-kilogram targets.',
    icon: 'calculator-protein',
    formula: 'Protein target = body weight in kilograms x selected grams of protein per kilogram.',
    caution: estimateCaution,
    useCases: [
      'Estimate the RDA-style 0.8 g/kg protein target.',
      'Compare active and strength-training targets.',
      'Convert body weight to daily protein grams.',
      'Use with macro and calorie planning.',
    ],
    examples: [
      { label: 'RDA', expression: '70 kg x 0.8 g/kg', result: '56 g protein' },
      { label: 'Active', expression: '80 kg x 1.2 g/kg', result: '96 g protein' },
      { label: 'Strength', expression: '75 kg x 1.6 g/kg', result: '120 g protein' },
    ],
    relatedSlugs: ['macro-calculator', 'carbohydrate-calculator', 'fat-intake-calculator'],
  }),
  makeHealthTool({
    slug: 'fat-intake-calculator',
    name: 'Fat Intake Calculator',
    summary: 'Calculate fat grams from calories and fat percentage.',
    description:
      'Use this free fat intake calculator to convert daily calories and fat percentage into grams per day.',
    icon: 'calculator-fat-intake',
    formula: 'Fat grams = calories x fat percentage / 100 / 9.',
    caution: estimateCaution,
    useCases: [
      'Convert fat percentage into grams.',
      'Compare targets against AMDR reference ranges.',
      'Plan fat intake for a calorie target.',
      'Use with macro and calorie calculators.',
    ],
    examples: [
      { label: '30% of 2000', expression: '2000 kcal x 30%', result: 'About 66.7 g fat' },
      { label: '25% of 1800', expression: '1800 kcal x 25%', result: '50 g fat' },
      { label: '35% of 2400', expression: '2400 kcal x 35%', result: 'About 93.3 g fat' },
    ],
    relatedSlugs: ['macro-calculator', 'carbohydrate-calculator', 'protein-calculator'],
  }),
  makeHealthTool({
    slug: 'tdee-calculator',
    name: 'TDEE Calculator',
    summary: 'Estimate total daily energy expenditure from BMR and activity.',
    description:
      'Use this free TDEE calculator to estimate total daily energy expenditure using BMR and activity level.',
    icon: 'calculator-tdee',
    formula: 'TDEE is estimated by calculating BMR with Mifflin-St Jeor, then multiplying by the selected activity factor.',
    caution: estimateCaution,
    useCases: [
      'Estimate maintenance calories.',
      'Compare activity levels.',
      'Use TDEE as the base for calorie and macro planning.',
      'Adjust estimates with real-world tracking over time.',
    ],
    examples: [
      { label: 'Moderate activity', expression: 'BMR x 1.55', result: 'Estimated TDEE' },
      { label: 'Sedentary', expression: 'BMR x 1.2', result: 'Estimated TDEE' },
      { label: 'Very active', expression: 'BMR x 1.725', result: 'Estimated TDEE' },
    ],
    relatedSlugs: ['calorie-calculator', 'bmr-calculator', 'macro-calculator'],
  }),
  makeHealthTool({
    slug: 'gfr-calculator',
    name: 'GFR Calculator',
    summary: 'Estimate eGFR with the 2021 CKD-EPI creatinine equation.',
    description:
      'Use this free GFR calculator to estimate adult eGFR from age, sex, and serum creatinine using the 2021 CKD-EPI equation.',
    icon: 'calculator-gfr',
    formula: 'The calculator uses the 2021 CKD-EPI creatinine equation with age, sex, and serum creatinine. It does not use a race coefficient.',
    caution: estimateCaution,
    useCases: [
      'Estimate adult eGFR from a creatinine lab value.',
      'Use the 2021 CKD-EPI race-free equation.',
      'See a broad eGFR interpretation range.',
      'Prepare questions for a clinician about kidney labs.',
    ],
    examples: [
      { label: 'Female 50', expression: 'Creatinine 0.9 mg/dL', result: 'eGFR estimate' },
      { label: 'Male 60', expression: 'Creatinine 1.1 mg/dL', result: 'eGFR estimate' },
      { label: 'Female 70', expression: 'Creatinine 1.2 mg/dL', result: 'eGFR estimate' },
    ],
    relatedSlugs: ['body-surface-area-calculator', 'bmi-calculator', 'healthy-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'body-type-calculator',
    name: 'Body Type Calculator',
    summary: 'Estimate body shape category from shoulder, bust, waist, and hip measurements.',
    description:
      'Use this free body type calculator to estimate a broad body shape label from common body measurements.',
    icon: 'calculator-body-type',
    formula: 'The calculator compares shoulder or bust, waist, and hip measurements to estimate hourglass, triangle, inverted triangle, rectangle, or balanced categories.',
    caution:
      'This is a style and measurement helper, not a health score. Body shape labels are broad estimates and do not rank bodies.',
    useCases: [
      'Compare body measurements for style planning.',
      'Estimate a broad body shape category.',
      'Understand shoulder, bust, waist, and hip relationships.',
      'Avoid treating body type as a health diagnosis.',
    ],
    examples: [
      { label: 'Balanced', expression: 'Shoulders 100, waist 76, hips 101', result: 'Balanced or hourglass-style estimate' },
      { label: 'Triangle', expression: 'Hips wider than top', result: 'Triangle or pear estimate' },
      { label: 'Inverted', expression: 'Top wider than hips', result: 'Inverted triangle estimate' },
    ],
    relatedSlugs: ['body-fat-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'body-surface-area-calculator',
    name: 'Body Surface Area Calculator',
    summary: 'Estimate body surface area with Mosteller and Du Bois formulas.',
    description:
      'Use this free body surface area calculator to estimate BSA in square meters from height and weight.',
    icon: 'calculator-bsa',
    formula: 'The main result uses Mosteller: square root of height in cm times weight in kg divided by 3600. Du Bois is shown as a comparison.',
    caution: estimateCaution,
    useCases: [
      'Estimate BSA from height and weight.',
      'Compare Mosteller and Du Bois formulas.',
      'Use as an educational clinical math reference.',
      'Avoid using this page for medication dosing decisions.',
    ],
    examples: [
      { label: 'Average adult', expression: '170 cm, 70 kg', result: 'BSA about 1.82 m2' },
      { label: 'Taller adult', expression: '180 cm, 85 kg', result: 'BSA estimate' },
      { label: 'Smaller adult', expression: '160 cm, 55 kg', result: 'BSA estimate' },
    ],
    relatedSlugs: ['gfr-calculator', 'bmi-calculator', 'healthy-weight-calculator'],
  }),
  makeHealthTool({
    slug: 'bac-calculator',
    name: 'BAC Calculator',
    summary: 'Estimate blood alcohol concentration with a Widmark-style formula.',
    description:
      'Use this free BAC calculator for an educational blood alcohol concentration estimate from drinks, ABV, body weight, sex, and time.',
    icon: 'calculator-bac',
    formula: 'The calculator estimates grams of alcohol from drink volume and ABV, applies a Widmark-style body-water factor, then subtracts an average elimination rate.',
    caution:
      'No. This estimate is not legal, medical, or driving advice. Do not use it to decide whether to drive or perform safety-sensitive tasks.',
    useCases: [
      'Understand how drink count, ABV, body weight, and time affect an estimate.',
      'Compare different drink sizes and strengths.',
      'See why BAC estimates are uncertain.',
      'Avoid using estimates for legal or safety decisions.',
    ],
    examples: [
      { label: 'Two beers', expression: '2 x 355 mL at 5%', result: 'Estimated BAC after time adjustment' },
      { label: 'Wine', expression: '2 x 150 mL at 12%', result: 'Estimated BAC after time adjustment' },
      { label: 'Spirit drink', expression: '45 mL at 40%', result: 'Estimated BAC after time adjustment' },
    ],
    relatedSlugs: ['calorie-calculator', 'bmi-calculator', 'body-surface-area-calculator'],
  }),
];
