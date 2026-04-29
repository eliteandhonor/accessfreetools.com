import type { BlogPostDefinition } from './blogPosts';
import { healthTools } from './healthTools';

interface GuideSection {
  title: string;
  paragraphs: string[];
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export interface HealthGuideDefinition {
  slug: string;
  toolSlug: string;
  label: string;
  title: string;
  description: string;
  path: string;
  intro: string;
  quickStart: string[];
  sections: GuideSection[];
  sidecarText: string;
}

const extraSafetyNotes: Record<string, string> = {
  'bac-calculator':
    'BAC estimates are especially uncertain because food, medication, drinking speed, tolerance, and body composition can change real-world results. Never use a BAC estimate to decide whether to drive.',
  'gfr-calculator':
    'eGFR depends on standardized lab creatinine and clinical context. A clinician may compare it with urine albumin, repeat labs, medications, age, and health history.',
  'pregnancy-calculator':
    'Pregnancy dating can change after ultrasound or clinician review. Treat calendar dates as planning estimates.',
  'due-date-calculator':
    'Due dates are estimates. Many healthy pregnancies deliver before or after the estimated date.',
  'pregnancy-weight-gain-calculator':
    'Pregnancy weight gain guidance should be personalized for your pregnancy, medical history, and care team.',
  'ovulation-calculator':
    'Calendar fertile-window estimates are not reliable contraception and work best only when cycles are regular.',
  'conception-calculator':
    'Conception timing is approximate because ovulation, fertilization, and implantation do not happen on a perfectly fixed schedule.',
  'pregnancy-conception-calculator':
    'A due-date-based conception estimate is a backward calendar estimate, not proof of an exact conception date.',
};

function getFormulaAnswer(toolSlug: string) {
  const formulaFaq = healthTools.find((tool) => tool.slug === toolSlug)?.faq[1]?.answer;
  return formulaFaq ?? 'The calculator uses the formula and inputs shown on the tool page.';
}

function getSourceLinks(toolSlug: string) {
  const bmiSources = [
    { href: 'https://www.cdc.gov/BMI/', label: 'CDC: Adult BMI categories and screening notes' },
    { href: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/bmitools', label: 'NHLBI: Healthy weight and BMI tools' },
  ];
  const energySources = [
    {
      href: 'https://academic.oup.com/ajcn/article-abstract/51/2/241/4695104',
      label: 'American Journal of Clinical Nutrition: Mifflin-St Jeor resting energy equation',
    },
    {
      href: 'https://www.cdc.gov/physical-activity-basics/measuring/index.html',
      label: 'CDC: Physical activity intensity and MET guidance',
    },
  ];
  const pregnancySources = [
    {
      href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-a-due-date',
      label: 'Johns Hopkins Medicine: Calculating a due date',
    },
    {
      href: 'https://www.hopkinsmedicine.org/health/wellness-and-prevention/calculating-your-monthly-fertility-window',
      label: 'Johns Hopkins Medicine: Fertile window basics',
    },
  ];
  const macroSources = [
    {
      href: 'https://www.ncbi.nlm.nih.gov/books/NBK610329/',
      label: 'National Academies / NCBI Bookshelf: Acceptable Macronutrient Distribution Range background',
    },
  ];

  if (['bmi-calculator', 'healthy-weight-calculator', 'ideal-weight-calculator', 'body-fat-calculator', 'army-body-fat-calculator', 'lean-body-mass-calculator', 'body-type-calculator'].includes(toolSlug)) {
    return bmiSources;
  }

  if (['calorie-calculator', 'bmr-calculator', 'tdee-calculator', 'calories-burned-calculator', 'pace-calculator', 'one-rep-max-calculator'].includes(toolSlug)) {
    return energySources;
  }

  if (toolSlug === 'target-heart-rate-calculator') {
    return [
      { href: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates', label: 'American Heart Association: Target heart rates' },
      ...energySources,
    ];
  }

  if (['pregnancy-calculator', 'pregnancy-conception-calculator', 'due-date-calculator', 'ovulation-calculator', 'conception-calculator', 'period-calculator'].includes(toolSlug)) {
    return pregnancySources;
  }

  if (toolSlug === 'pregnancy-weight-gain-calculator') {
    return [
      { href: 'https://www.cdc.gov/maternal-infant-health/pregnancy-weight/index.html', label: 'CDC: Weight gain during pregnancy' },
      ...pregnancySources,
    ];
  }

  if (['macro-calculator', 'carbohydrate-calculator', 'protein-calculator', 'fat-intake-calculator'].includes(toolSlug)) {
    return macroSources;
  }

  if (toolSlug === 'gfr-calculator') {
    return [
      { href: 'https://www.kidney.org/ckd-epi-creatinine-equation-2021-0', label: 'National Kidney Foundation: CKD-EPI creatinine equation 2021' },
    ];
  }

  if (toolSlug === 'body-surface-area-calculator') {
    return [
      { href: 'https://www.ncbi.nlm.nih.gov/books/NBK559005/', label: 'NCBI Bookshelf: Body surface area formulas' },
    ];
  }

  if (toolSlug === 'bac-calculator') {
    return [
      { href: 'https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/basics-defining-how-much-alcohol-too-much', label: 'NIAAA: Standard drink and alcohol guidance' },
      { href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4361698/', label: 'PMC: Alcohol calculations and their uncertainty' },
    ];
  }

  return [];
}

export const healthBlogPosts: BlogPostDefinition[] = healthTools.map((tool) => ({
  slug: `how-to-use-${tool.slug}`,
  title: `How to use the ${tool.name}`,
  label: `${tool.name.replace(' Calculator', '')} guide`,
  summary: `Learn how to use the ${tool.name}, read the estimate, understand the formula, and avoid common interpretation mistakes.`,
}));

export const healthBlogGuides: HealthGuideDefinition[] = healthTools.map((tool) => ({
  slug: `how-to-use-${tool.slug}`,
  toolSlug: tool.slug,
  label: `${tool.name.replace(' Calculator', '')} guide`,
  title: `How to use the ${tool.name}`,
  description: `Learn how to use the ${tool.name}, what inputs matter, how the estimate is calculated, and when to get professional guidance.`,
  path: `/blog/how-to-use-${tool.slug}/`,
  intro: `${tool.summary} This guide explains the inputs, the result, and the limits of the estimate so the tool stays useful and responsible.`,
  quickStart: [
    `Open the ${tool.name} and enter the requested measurements or dates.`,
    'Use the examples if you want to see a complete filled-out calculation first.',
    'Press the calculate button to update the answer, formula steps, and supporting metrics.',
    'Copy the answer only after checking that the units, dates, and assumptions match your situation.',
  ],
  sections: [
    {
      title: 'What this calculator estimates',
      paragraphs: [
        tool.description,
        `The best use is practical comparison: ${tool.useCases[0].toLowerCase()} ${tool.useCases[1]}`,
      ],
    },
    {
      title: 'Formula and inputs',
      paragraphs: [
        getFormulaAnswer(tool.slug),
        'Small input changes can move the result, so use consistent units and repeat measurements the same way when tracking trends.',
      ],
    },
    {
      title: 'How to read the answer',
      paragraphs: [
        'Read the main answer first, then check the supporting metrics and formula steps underneath it. Those extra lines explain what the calculator did and what assumptions shaped the result.',
        extraSafetyNotes[tool.slug] ??
          'Use the result as an educational estimate. For health, pregnancy, nutrition, kidney, alcohol, or training decisions with real consequences, get qualified professional guidance.',
      ],
    },
    {
      title: 'Sources and safety notes',
      paragraphs: [
        'This guide uses public-health, clinical, or peer-reviewed references where the calculator needs a specific formula or interpretation boundary.',
        'Source links are provided for transparency, but they do not turn the calculator into medical advice or a replacement for professional care.',
      ],
      links: getSourceLinks(tool.slug),
    },
  ],
  sidecarText: `Use the ${tool.name} with the guide open so you can compare the result, formula steps, examples, and safety notes in one place.`,
}));

export function getHealthBlogGuide(slug: string) {
  return healthBlogGuides.find((guide) => guide.slug === slug);
}
