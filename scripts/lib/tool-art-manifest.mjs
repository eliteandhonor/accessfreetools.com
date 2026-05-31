import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export const rootDir = resolve(fileURLToPath(new URL('../..', import.meta.url)));

export const toolDataFiles = [
  'src/data/tools.ts',
  'src/data/mathExpansionTools.ts',
  'src/data/financeTools.ts',
  'src/data/healthTools.ts',
  'src/data/utilityTools.ts',
  'src/data/aiTools.ts',
];

export const categoryNames = {
  calculators: 'Calculators',
  converters: 'Converters',
  'text-tools': 'Text Tools',
  'date-time': 'Date & Time',
  finance: 'Finance',
  'health-fitness': 'Health & Fitness',
  'home-projects': 'Home & Projects',
  'developer-tools': 'Developer Tools',
  'image-tools': 'Image Tools',
  'ai-tools': 'AI Tools',
  'school-study': 'School & Study',
  'everyday-tools': 'Everyday Tools',
};

const defaultCategoryByFile = {
  'aiTools.ts': 'ai-tools',
  'financeTools.ts': 'finance',
  'healthTools.ts': 'health-fitness',
  'mathExpansionTools.ts': 'calculators',
};

const categoryVisualCues = {
  calculators: 'calculator buttons, number blocks, and tidy math shapes',
  converters: 'swapping arrows, measuring cups, and unit tiles',
  'text-tools': 'paper sheets, pencil marks, and tidy writing lines',
  'date-time': 'calendar pages, clock circles, and reminder dots',
  finance: 'coins, charts, receipt shapes, and careful budgeting blocks',
  'health-fitness': 'heart shapes, movement arcs, and wellness note cards',
  'home-projects': 'house outlines, rulers, buckets, and project material shapes',
  'developer-tools': 'code brackets, terminal panels, and connected nodes',
  'image-tools': 'picture frames, crop handles, and sparkle shapes',
  'ai-tools': 'soft neural dots, lens shapes, and model-chip blocks',
  'school-study': 'notebook pages, stars, and study cards',
  'everyday-tools': 'checklists, small household objects, and simple task icons',
};

const toolArtMetadataOverrides = {
  'annuity-calculator': {
    tool: {
      alt: 'Smoke mascot comparing annuity payment cards with $500 monthly payments, 5 percent rate, 20 years, ordinary timing, future value, and present value.',
      caption:
        'Annuity Calculator artwork matches the live workflow: fixed payment amount, annual rate, years, payment frequency, timing, future value, and present value.',
    },
    guide: {
      alt: 'Smoke mascot explaining annuity due versus ordinary annuity timing beside payment-count, future-value, present-value, fee, and surrender-charge notes.',
      caption:
        'Annuity Calculator guide artwork supports the walkthrough by showing payment timing, 240 monthly payments, future value, present value, and contract cautions.',
    },
  },
  'annuity-payout-calculator': {
    tool: {
      alt: 'Smoke mascot spreading a $100,000 annuity balance into 240 monthly payout cards with 5 percent rate, payment count, total paid, and interest notes.',
      caption:
        'Annuity Payout Calculator artwork matches the live workflow: starting balance, annual rate, payout term, payments per year, payout amount, total paid, and interest.',
    },
    guide: {
      alt: 'Smoke mascot comparing fixed-term annuity payout cards with monthly payment, total-paid, interest, surrender-charge, rider, and tax caution notes.',
      caption:
        'Annuity Payout Calculator guide artwork supports the walkthrough by showing fixed-term payout math beside contract limits like fees, riders, taxes, and surrender rules.',
    },
  },
  'credit-card-calculator': {
    tool: {
      alt: 'Smoke mascot checking one credit card balance with 22.9 percent APR, $250 monthly payment, payoff months, interest, and total paid cards.',
      caption:
        'Credit Card Calculator artwork matches the live workflow: balance, APR, monthly payment, new card spending, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing $250 and $350 credit card payments beside payoff-month, interest, total-paid, and new-spending notes.',
      caption:
        'Credit Card Calculator guide artwork supports the walkthrough by showing how APR, payment size, and new spending change payoff time and interest.',
    },
  },
  'credit-cards-payoff-calculator': {
    tool: {
      alt: 'Smoke mascot grouping three credit card balance cards into one $8,500 payoff plan with 21.5 percent weighted APR, $350 regular payment, $100 extra payment, payoff months, interest, and total paid.',
      caption:
        'Credit Cards Payoff Calculator artwork matches the combined-card workflow: balances, weighted APR, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a combined credit card payoff shortcut with separate card notes for APR, payment allocation, grace period, fees, balance transfers, and new purchases.',
      caption:
        'Credit Cards Payoff Calculator guide artwork supports the walkthrough by showing where a combined payoff shortcut helps and where card-by-card rules still matter.',
    },
  },
  'debt-payoff-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $10,000 debt payoff plan with 12 percent annual rate, $300 regular payment, $100 extra payment, 29 months, interest, total paid, and final payment.',
      caption:
        'Debt Payoff Calculator artwork matches the fixed-balance workflow: balance, annual rate, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a fixed debt payoff estimate with budget notes, creditor call notes, payment-plan paperwork, debt-collection warnings, and extra-payment choices.',
      caption:
        'Debt Payoff Calculator guide artwork supports the walkthrough by showing where payoff math helps and where creditor, collector, budget, or counseling details still matter.',
    },
  },
  'debt-consolidation-calculator': {
    tool: {
      alt: 'Smoke mascot comparing $18,000 current debt with a 10.5 percent three-year consolidation loan, $300 fee, lower monthly payment, and total cost savings.',
      caption:
        'Debt Consolidation Calculator artwork matches the comparison job: current debt, current APR, current payment, new loan APR, term, fees, monthly payment change, and total cost change.',
    },
    guide: {
      alt: 'Smoke mascot checking a consolidation loan offer beside budget notes, fee slips, credit-warning cards, home-collateral caution, and payoff comparison charts.',
      caption:
        'Debt Consolidation Calculator guide artwork supports the walkthrough by showing why the fee, term, APR, credit risk, collateral risk, and total cost matter before signing.',
    },
  },
  'repayment-calculator': {
    tool: {
      alt: 'Smoke mascot checking a $12,000 repayment balance with 8 percent annual rate, $300 regular payment, $50 extra payment, 40-month payoff, interest, total paid, and final payment cards.',
      caption:
        'Repayment Calculator artwork matches the fixed-balance workflow: balance, annual rate or APR, regular payment, extra payment, payoff months, interest, total paid, and final payment.',
    },
    guide: {
      alt: 'Smoke mascot comparing a fixed-balance repayment estimate with APR disclosure notes, Federal Student Aid plan notes, budget reminders, fee warnings, and extra-payment choices.',
      caption:
        'Repayment Calculator guide artwork supports the walkthrough by showing where simple payoff math helps and where official plans, fees, payment timing, and budget limits still matter.',
    },
  },
  'student-loan-calculator': {
    tool: {
      alt: 'Smoke mascot checking a student loan screen with $30,000 balance, 6.5 percent annual rate, 10-year term, $50 extra principal, scheduled payment, payoff months, and interest-saved cards.',
      caption:
        'Student Loan Calculator artwork matches the live workflow: balance, annual rate, term, extra monthly principal, scheduled payment, payoff time, total interest, and interest saved.',
    },
    guide: {
      alt: 'Smoke mascot comparing student loan payment math with Federal Student Aid Loan Simulator notes, interest-rate notes, servicer rules, IDR warnings, and private-loan cautions.',
      caption:
        'Student Loan Calculator guide artwork supports the walkthrough by showing where simple payment math helps and where official federal, servicer, and private-loan rules still matter.',
    },
  },
  'college-cost-calculator': {
    tool: {
      alt: 'Smoke mascot planning a college cost screen with $28,000 annual cost, 8 years until start, 4 school years, monthly savings, first-year cost, total cost, projected savings, and gap cards.',
      caption:
        'College Cost Calculator artwork matches the live workflow: annual cost, years until school, school years, cost increase, savings, first-year cost, total cost, and savings gap.',
    },
    guide: {
      alt: 'Smoke mascot comparing college sticker cost with net price calculator notes, aid-offer cards, tuition, fees, housing, books, transportation, savings, and loan cautions.',
      caption:
        'College Cost Calculator guide artwork supports the walkthrough by showing where a savings-gap estimate helps and where net price calculators, aid offers, and school-specific costs still matter.',
    },
  },
  'interest-calculator': {
    tool: {
      alt: 'Smoke mascot comparing simple and compound interest screens with $1,000 principal, 5 percent annual rate, 3 years, $150 interest, and compound-growth cards.',
      caption:
        'Interest Calculator artwork matches the live workflow: simple mode, compound mode, principal, annual interest rate, time in years, compounding frequency, monthly deposits, and ending balance.',
    },
    guide: {
      alt: 'Smoke mascot explaining simple interest versus compound interest beside APR, APY, bank-account, loan, and investment-return warning notes.',
      caption:
        'Interest Calculator guide artwork supports the walkthrough by showing when to use simple interest, when to use compounding, and why APR, APY, fees, taxes, and risk still need checking.',
    },
  },
  'simple-interest-calculator': {
    tool: {
      alt: 'Smoke mascot checking a simple interest screen with $1,000 principal, 5 percent annual rate, 3 years, $150 interest, and $1,150 ending balance cards.',
      caption:
        'Simple Interest Calculator artwork matches the live workflow: principal, annual simple interest rate, time in years, simple interest, and ending balance.',
    },
    guide: {
      alt: 'Smoke mascot explaining principal x annual rate x time beside $1,000, 5 percent, 3 years, APR warning, compounding warning, and ending balance notes.',
      caption:
        'Simple Interest Calculator guide artwork supports the walkthrough by showing the principal-rate-time formula, the $150 interest example, and limits around APR, compounding, and fees.',
    },
  },
  'pension-calculator': {
    tool: {
      alt: 'Smoke mascot checking a defined-benefit pension formula with salary, credited service years, plan multiplier, monthly pension, and replacement-rate cards.',
      caption:
        'Pension Calculator artwork matches the live workflow: final average salary, credited service years, plan multiplier, annual pension, monthly pension, and replacement rate.',
    },
    guide: {
      alt: 'Smoke mascot comparing pension plan notes for salary, service credit, multiplier, survivor choice, early retirement, PBGC limits, and monthly benefit.',
      caption:
        'Pension Calculator guide artwork supports the walkthrough by showing salary-service-multiplier math beside plan-rule cautions like survivor choices and PBGC limits.',
    },
  },
  'rent-calculator': {
    tool: {
      alt: 'Smoke mascot checking a rent budget screen with monthly income, rent target percent, debt payments, utilities, max rent, and income-left cards.',
      caption:
        'Rent Calculator artwork matches the live rent workflow: income and rent target at the top, debts and utilities subtracted, then max rent and income-left result cards.',
    },
    guide: {
      alt: 'Smoke mascot comparing apartment rent notes with monthly income, 30 percent target, debt payments, utilities, deposits, and moving-cost reminders.',
      caption:
        'Rent Calculator guide artwork supports the walkthrough by showing the rent ceiling, utility costs, debt payments, and lease extras a renter should check before applying.',
    },
  },
};

function propertyKeyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function collectConstStrings(sourceFile) {
  const values = new Map();

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          const value = literalText(declaration.initializer, values);
          if (value) values.set(declaration.name.text, value);
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return values;
}

function literalText(expression, constStrings = new Map()) {
  if (!expression) return undefined;
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  if (ts.isIdentifier(expression)) return constStrings.get(expression.text);
  if (ts.isParenthesizedExpression(expression)) return literalText(expression.expression, constStrings);
  if (ts.isAsExpression(expression) || ts.isTypeAssertionExpression(expression) || ts.isSatisfiesExpression(expression)) {
    return literalText(expression.expression, constStrings);
  }
  if (ts.isBinaryExpression(expression) && expression.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = literalText(expression.left, constStrings);
    const right = literalText(expression.right, constStrings);
    return left !== undefined && right !== undefined ? `${left}${right}` : undefined;
  }
  return undefined;
}

function objectStringProperty(objectExpression, key, constStrings) {
  for (const property of objectExpression.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    if (propertyKeyName(property.name) !== key) continue;
    return literalText(property.initializer, constStrings);
  }

  return undefined;
}

function inferFileDefaultCategory(filePath) {
  const fileName = filePath.replaceAll('\\', '/').split('/').pop() ?? '';
  return defaultCategoryByFile[fileName];
}

function extractToolsFromFile(filePath) {
  const absolutePath = resolve(rootDir, filePath);
  const source = readFileSync(absolutePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  const constStrings = collectConstStrings(sourceFile);
  const defaultCategory = inferFileDefaultCategory(filePath);
  const tools = [];

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const slug = objectStringProperty(node, 'slug', constStrings);
      const name = objectStringProperty(node, 'name', constStrings);
      const summary = objectStringProperty(node, 'summary', constStrings);
      const description = objectStringProperty(node, 'description', constStrings);
      const category = objectStringProperty(node, 'category', constStrings) ?? defaultCategory;

      if (slug && name && category && (summary || description)) {
        tools.push({
          slug,
          name,
          category,
          summary: summary ?? description,
          description: description ?? summary ?? '',
          sourceFile: filePath,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return tools;
}

export function readCanonicalTools() {
  const bySlug = new Map();

  for (const filePath of toolDataFiles) {
    for (const tool of extractToolsFromFile(filePath)) {
      if (!bySlug.has(tool.slug)) bySlug.set(tool.slug, tool);
    }
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function readBlogGuideRedirects() {
  const sourcePath = resolve(rootDir, 'src/data/blogGuideCanonicals.ts');
  if (!existsSync(sourcePath)) return new Map();

  const source = readFileSync(sourcePath, 'utf8');
  const redirectsBlock = source.match(/blogGuideRedirects\s*=\s*\{([\s\S]*?)\}\s*as const/);
  if (!redirectsBlock) return new Map();

  return new Map(
    [...redirectsBlock[1].matchAll(/['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
}

export function readRedirectedBlogGuideSlugs() {
  return new Set(readBlogGuideRedirects().keys());
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function safeSummary(summary) {
  const text = normalizeWhitespace(summary);
  return text.length > 140 ? `${text.slice(0, 137).trim()}...` : text;
}

function shortSummary(summary, maxLength = 92) {
  const text = normalizeWhitespace(summary).replace(/\.$/, '');
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(' ');
  const safeClip = lastSpace > 55 ? clipped.slice(0, lastSpace) : clipped.slice(0, maxLength);
  return safeClip.replace(/[,.:-]\s*$/, '');
}

function lowerFirst(value) {
  return value ? `${value.slice(0, 1).toLowerCase()}${value.slice(1)}` : value;
}

function imageAltConcept(value) {
  return value.replace(/\breadable text\b/gi, 'words and numbers');
}

function slugWords(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b(calculator|tool|converter|generator|checker|formatter|parser|encoder|decoder)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildAlt(tool, kind) {
  const override = toolArtMetadataOverrides[tool.slug]?.[kind]?.alt;
  if (override) return override;

  const concept = imageAltConcept(shortSummary(tool.summary, kind === 'tool' ? 116 : 72));

  if (kind === 'tool') {
    return normalizeWhitespace(
      `Illustration for ${tool.name} showing ${lowerFirst(concept)}.`,
    );
  }

  return normalizeWhitespace(
    `Guide image for ${tool.name} showing ${lowerFirst(concept)} with example inputs and result notes.`,
  );
}

function buildCaption(tool, kind) {
  const override = toolArtMetadataOverrides[tool.slug]?.[kind]?.caption;
  if (override) return override;

  const summary = shortSummary(tool.summary, 110);
  const concept = summary ? lowerFirst(summary) : `the ${slugWords(tool.slug) || tool.name} workflow`;

  if (kind === 'tool') {
    return normalizeWhitespace(
      `${tool.name} artwork matches the live tool workflow: ${concept}. Use it with the calculator, examples, and result notes.`,
    );
  }

  return normalizeWhitespace(
    `${tool.name} guide artwork sits with the walkthrough for ${concept}, including inputs, examples, limits, and mistakes to check.`,
  );
}

function buildPrompt(tool, kind) {
  const categoryName = categoryNames[tool.category] ?? tool.category;
  const visualCues = categoryVisualCues[tool.category] ?? 'friendly utility shapes and organized helper objects';
  const action =
    kind === 'tool'
      ? `The mascot is actively presenting the ${tool.name} as a usable browser utility.`
      : `The mascot is explaining the ${tool.name} concept like a simple visual guide.`;

  return normalizeWhitespace(
    [
      'Create one unique G-rated chibi/kawaii image using the established Access Free Tools smoke mascot: a translucent pale grey-white smoky chibi girl with soft wispy hair, expressive manga eyes, tiny hands, a dress-like smoke body, a small heart-shaped chest glow, and a lower floating smoke tail.',
      action,
      'The mascot should match the existing approved house style: soft charcoal/dark-slate background, hand-painted luminous smoke lines, gentle blush, white-pink-grey glow, and no purple ghost/spirit redesign.',
      'Show the full body character inside the frame, including all hair, smoky wisps, hands, props, and the lower floating smoke tail, with generous padding so nothing is cropped off.',
      'Use no readable text, no logos, no brand names, no watermark, no sexualized styling, and no generic abstract fog-only composition.',
      'Research the exact tool before generating: use visual details from its real inputs, outputs, formula/logic, examples, and guide notes, not only broad category symbols.',
      'The image must clearly represent this specific tool to someone comparing it with nearby related tools.',
      `Use visual hints for ${categoryName}: ${visualCues}.`,
      `Specific page concept: ${safeSummary(tool.summary)}.`,
      `Composition must be distinct for ${kind === 'tool' ? 'the tool page' : 'the guide/blog page'} and usable as a 1200 by 630 web image.`,
      'The result must look like an intentional character illustration, not a blurry background texture.',
    ].join(' '),
  );
}

export function createQueuedToolArtEntries(tools = readCanonicalTools()) {
  const redirectedBlogGuideSlugs = readRedirectedBlogGuideSlugs();

  return tools.flatMap((tool) => {
    const guideSlug = `how-to-use-${tool.slug}`;
    const kinds = redirectedBlogGuideSlugs.has(guideSlug) ? ['tool'] : ['tool', 'guide'];

    return kinds.map((kind) => ({
      slug: tool.slug,
      kind,
      toolName: tool.name,
      category: tool.category,
      categoryName: categoryNames[tool.category] ?? tool.category,
      imagePath: `/tool-art/${tool.slug}-${kind}.webp`,
      thumbnailPath: `/tool-art/thumbs/${tool.slug}-${kind}.webp`,
      pagePath: kind === 'tool' ? `/tools/${tool.slug}/` : `/blog/how-to-use-${tool.slug}/`,
      galleryPath: `/gallery/${tool.category}/#${tool.slug}-${kind}`,
      alt: buildAlt(tool, kind),
      caption: buildCaption(tool, kind),
      prompt: buildPrompt(tool, kind),
      status: 'queued',
      qaStatus: 'not-started',
    }));
  });
}

export function readToolArtApprovals() {
  const path = resolve(rootDir, 'src/data/toolArtApprovals.json');
  if (!existsSync(path)) return [];
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function createToolArtEntries(tools = readCanonicalTools()) {
  const approvals = readToolArtApprovals();
  const approvalMap = new Map(approvals.map((approval) => [`${approval.slug}:${approval.kind}`, approval]));

  return createQueuedToolArtEntries(tools).map((entry) => ({
    ...entry,
    ...(approvalMap.get(`${entry.slug}:${entry.kind}`) ?? {}),
  }));
}

export function writeJsonReport(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

export function manifestTsSource(entries) {
  const generated = new Date().toISOString().slice(0, 10);
  return `// Generated by scripts/generate-tool-art-manifest.mjs. Do not edit by hand.
// Last regenerated: ${generated}

export type ToolArtKind = 'tool' | 'guide';

export interface ToolArtManifestEntry {
  slug: string;
  kind: ToolArtKind;
  toolName: string;
  category: string;
  categoryName: string;
  imagePath: string;
  thumbnailPath: string;
  pagePath: string;
  galleryPath: string;
  alt: string;
  caption: string;
  prompt: string;
  status: 'queued' | 'draft' | 'approved' | 'rejected';
  qaStatus: 'not-started' | 'needs-review' | 'approved' | 'rejected';
}

export const toolArtManifest = ${JSON.stringify(entries, null, 2)} as const satisfies readonly ToolArtManifestEntry[];
`;
}

export function writeManifestOutputs(entries) {
  const manifestPath = resolve(rootDir, 'src/data/toolArtManifest.ts');
  const outputPath = resolve(rootDir, 'output/tool-art-manifest.json');
  const summaryPath = resolve(rootDir, 'output/tool-art-manifest.md');
  const toolCount = new Set(entries.map((entry) => entry.slug)).size;

  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, manifestTsSource(entries));
  writeJsonReport(outputPath, {
    generatedAt: new Date().toISOString(),
    tools: toolCount,
    entries: entries.length,
    categories: [...new Set(entries.map((entry) => entry.category))].sort(),
    manifestPath: 'src/data/toolArtManifest.ts',
    entries,
  });
  writeFileSync(
    summaryPath,
    [
      '# Tool Art Manifest',
      '',
      `Generated entries: ${entries.length}`,
      `Canonical tools covered: ${toolCount}`,
      `Categories covered: ${[...new Set(entries.map((entry) => entry.category))].sort().join(', ')}`,
      '',
      'Each canonical tool has one tool-page image. Tools with a canonical blog-guide redirect skip separate guide art.',
      '',
    ].join('\n'),
  );

  return { manifestPath, outputPath, summaryPath };
}

export function readTrackedManifestSource() {
  const path = resolve(rootDir, 'src/data/toolArtManifest.ts');
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}
