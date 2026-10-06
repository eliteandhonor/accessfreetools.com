import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const questions = [
  { mode: 'Percent of a number', fields: ['Percentage', 'Of value'], values: ['20', '80'], answer: '16' },
  { mode: 'What percent?', fields: ['Part', 'Whole'], values: ['25', '200'], answer: '12.5%' },
  { mode: 'Percentage change', fields: ['Original value', 'New value'], values: ['160', '116'], answer: '27.5% decrease' },
  { mode: 'Add or subtract percent', fields: ['Base value', 'Percentage'], values: ['120', '25'], answer: '150' },
  { mode: 'Reverse percent', reverse: 'Part is % of whole', fields: ['Known part', 'Percentage of whole'], values: ['30', '15'], answer: '200' },
  { mode: 'Reverse percent', reverse: 'After increase', fields: ['Final value', 'Increase percentage'], values: ['120', '20'], answer: '100' },
  { mode: 'Reverse percent', reverse: 'After decrease', fields: ['Final value', 'Decrease percentage'], values: ['80', '20'], answer: '100' },
];

async function chooseQuestion(page: Page, question: typeof questions[number]) {
  const modes = page.getByRole('group', { name: 'Percentage calculation type', exact: true });
  await modes.getByRole('button').filter({ has: page.locator('strong', { hasText: question.mode }) }).click();
  if (question.reverse) {
    await page.getByRole('group', { name: 'Reverse percentage question type', exact: true })
      .getByRole('button', { name: question.reverse, exact: true }).click();
  }
  if (question.mode === 'Add or subtract percent') {
    await page.getByRole('group', { name: 'Adjustment direction', exact: true })
      .getByRole('button', { name: 'Increase', exact: true }).click();
  }
  for (const [index, label] of question.fields.entries()) {
    await page.getByLabel(label, { exact: true }).fill(question.values[index]);
  }
}

test.beforeEach(async ({ page }) => {
  await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: '',
  }));
  const response = await page.goto('/tools/percentage-calculator/');
  expect(response?.status()).toBe(200);
  await page.waitForFunction(() => !document.querySelector('.percentage-calculator')?.closest('astro-island')?.hasAttribute('ssr'));
});

for (const question of questions) {
  test(`${question.reverse ?? question.mode} requires both operands and recovers after correction`, async ({ page }) => {
    await chooseQuestion(page, question);
    for (const [index, label] of question.fields.entries()) {
      const input = page.getByLabel(label, { exact: true });
      for (const blank of ['', '   ']) {
        await input.fill(blank);
        await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
        const alert = page.getByRole('alert');
        await expect(alert).toHaveText(`${label} is required.`);
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(input).toHaveAttribute('aria-describedby', await alert.getAttribute('id') ?? 'missing-error-id');
        await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
        await expect(page.locator('.percentage-result-card strong')).not.toHaveText('0');
        await expect(page.locator('.percentage-steps')).toHaveCount(0);
        await input.fill(question.values[index]);
        await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
        await expect(page.getByRole('alert')).toHaveCount(0);
        await expect(input).not.toHaveAttribute('aria-invalid', 'true');
        await expect(page.locator('.percentage-result-card strong')).toHaveText(question.answer);
        await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
      }
    }
  });
}

test('explicit zero stays valid where defined and denominator limits stay errors', async ({ page }) => {
  const validZeros = [
    { question: questions[0], field: 'Percentage', answer: '0' },
    { question: questions[0], field: 'Of value', answer: '0' },
    { question: questions[1], field: 'Part', answer: '0%' },
    { question: questions[2], field: 'New value', answer: '100% decrease' },
    { question: questions[3], field: 'Percentage', answer: '120' },
    { question: questions[3], field: 'Base value', answer: '0' },
    { question: questions[4], field: 'Known part', answer: '0' },
    { question: questions[5], field: 'Final value', answer: '0' },
    { question: questions[5], field: 'Increase percentage', answer: '120' },
    { question: questions[6], field: 'Final value', answer: '0' },
    { question: questions[6], field: 'Decrease percentage', answer: '80' },
  ];
  for (const entry of validZeros) {
    await chooseQuestion(page, entry.question);
    await page.getByLabel(entry.field, { exact: true }).fill('0');
    await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.locator('.percentage-result-card strong')).toHaveText(entry.answer);
    await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
  }
  const limits = [
    { question: questions[1], field: 'Whole', value: '0', error: 'Whole value cannot be zero' },
    { question: questions[2], field: 'Original value', value: '0', error: 'Original value cannot be zero' },
    { question: questions[4], field: 'Percentage of whole', value: '0', error: 'Percentage cannot be zero' },
    { question: questions[6], field: 'Decrease percentage', value: '100', error: 'Decrease percentage must be less than 100' },
  ];
  for (const entry of limits) {
    await chooseQuestion(page, entry.question);
    await page.getByLabel(entry.field, { exact: true }).fill(entry.value);
    await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText(entry.error);
    await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  }
});

test('nonfinite operands are rejected while finite signed inputs still calculate', async ({ page }) => {
  for (const value of ['Infinity', '-Infinity', 'NaN', '1e309']) {
    await page.getByLabel('Percentage', { exact: true }).fill(value);
    await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
    await expect(page.getByRole('alert')).toHaveText('Percentage must be a finite number.');
    await expect(page.getByLabel('Percentage', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  }
  await page.getByLabel('Percentage', { exact: true }).fill('-20');
  await page.getByLabel('Of value', { exact: true }).fill('80');
  await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
  await expect(page.locator('.percentage-result-card strong')).toHaveText('-16');
});

test('mode groups expose names, repeat choices and accessible errors without unsupported labels', async ({ page }, testInfo) => {
  const modes = page.getByRole('group', { name: 'Percentage calculation type', exact: true });
  await expect(modes.getByRole('button')).toHaveCount(5);
  await chooseQuestion(page, questions[3]);
  const direction = page.getByRole('group', { name: 'Adjustment direction', exact: true });
  await direction.getByRole('button', { name: 'Decrease', exact: true }).click();
  await direction.getByRole('button', { name: 'Decrease', exact: true }).click();
  await expect(direction.getByRole('button', { name: 'Decrease', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
  await expect(page.locator('.percentage-result-card strong')).toHaveText('90');

  await chooseQuestion(page, questions[6]);
  const reverse = page.getByRole('group', { name: 'Reverse percentage question type', exact: true });
  await reverse.getByRole('button', { name: 'After decrease', exact: true }).click();
  await expect(reverse.getByRole('button', { name: 'After decrease', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('Final value', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Calculate percentage', exact: true }).click();
  await expect(page.getByRole('group', { name: 'Reverse percent', exact: true })).toHaveAccessibleDescription('Final value is required.');
  const accessibility = await new AxeBuilder({ page }).include('.percentage-calculator')
    .withRules(['aria-allowed-attr', 'aria-valid-attr-value', 'label', 'aria-command-name']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.screenshot({ path: testInfo.outputPath('percentage-required-error.png') });
  await page.getByRole('button', { name: '80 after 20% decrease', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('.percentage-result-card strong')).toHaveText('100');
});
