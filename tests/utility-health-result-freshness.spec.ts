import { expect, test, type Locator, type Page } from '@playwright/test';

type CalculatorKind = 'utility' | 'health';

async function openWorkspace(page: Page, slug: string, kind: CalculatorKind) {
  const response = await page.goto(`/tools/${slug}/`);
  expect(response?.status()).toBe(200);
  const workspace = page.locator(`.advanced-calculator-${kind}`);
  await expect(workspace).toBeVisible();
  await page.waitForFunction((selector) =>
    !document.querySelector(selector)?.closest('astro-island')?.hasAttribute('ssr'),
  `.advanced-calculator-${kind}`);
  return workspace;
}

function answer(workspace: Locator, kind: CalculatorKind) {
  return workspace.locator(`.${kind}-result-card strong`);
}

function recentAnswers(workspace: Locator) {
  return workspace.locator('.advanced-side-panel ol li');
}

async function expectPending(workspace: Locator, kind: CalculatorKind, action: string) {
  await expect(answer(workspace, kind)).toHaveCount(0);
  await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  await expect(workspace.getByRole('status')).toHaveText(`Inputs changed. Press ${action} for a new answer.`);
  await expect(workspace.getByRole('alert')).toHaveCount(0);
}

async function expectInvalid(workspace: Locator, kind: CalculatorKind, message: string) {
  await expect(workspace.getByRole('alert')).toHaveText(message);
  await expect(workspace.locator(`.${kind}-result-card`)).toHaveCount(0);
  await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  await expect(workspace.getByRole('status')).toHaveCount(0);
}

async function expectValid(workspace: Locator, kind: CalculatorKind, value?: string) {
  if (value === undefined) await expect(answer(workspace, kind)).toBeVisible();
  else await expect(answer(workspace, kind)).toHaveText(value);
  await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
  await expect(workspace.getByRole('alert')).toHaveCount(0);
  await expect(workspace.getByRole('status')).toHaveCount(0);
}

test.beforeEach(async ({ page }) => {
  // This local calculator check does not depend on the external publisher service.
  await page.route('https://news.google.com/swg/js/v1/publisher.js', route => route.fulfill({
    status: 200, contentType: 'application/javascript', body: '',
  }));
});

test('conversion mode defaults and examples replace pending or invalid results', async ({ page }) => {
  const workspace = await openWorkspace(page, 'conversion-calculator', 'utility');
  await workspace.getByRole('button', { name: 'Convert value', exact: true }).click();
  const initialHistory = await recentAnswers(workspace).allTextContents();
  await expect(recentAnswers(workspace)).toHaveCount(1);
  await workspace.getByLabel('Value', { exact: true }).fill('Infinity');
  expect(await recentAnswers(workspace).allTextContents()).toEqual(initialHistory);
  await workspace.getByRole('button', { name: 'Convert value', exact: true }).click();
  await expectInvalid(workspace, 'utility', 'Value must be a number');
  expect(await recentAnswers(workspace).allTextContents()).toEqual(initialHistory);

  await workspace.getByRole('button', { name: 'Mass', exact: false }).click();
  await expect(workspace.getByLabel('Value', { exact: true })).toHaveValue('150');
  await expect(workspace.getByRole('combobox', { name: 'From', exact: true })).toHaveValue('pound');
  await expect(workspace.getByRole('combobox', { name: 'To', exact: true })).toHaveValue('kilogram');
  await expectValid(workspace, 'utility', '68.0388555 kilogram');
  expect(await recentAnswers(workspace).allTextContents()).toEqual(initialHistory);

  await workspace.getByLabel('Value', { exact: true }).fill('160');
  await expectPending(workspace, 'utility', 'Convert value');
  await workspace.getByRole('button', { name: 'Ounces to grams', exact: true }).click();
  await expect(workspace.getByLabel('Value', { exact: true })).toHaveValue('16');
  await expectValid(workspace, 'utility', '453.59237 gram');
  await expect(recentAnswers(workspace)).toHaveCount(2);
  const exampleHistory = await recentAnswers(workspace).allTextContents();

  await workspace.getByRole('button', { name: 'Volume', exact: false }).click();
  await expectValid(workspace, 'utility', '3.785411784 liter');
  await workspace.getByRole('button', { name: 'Temperature', exact: false }).click();
  await expectValid(workspace, 'utility', '22.2222222222 celsius');
  expect(await recentAnswers(workspace).allTextContents()).toEqual(exampleHistory);
  await workspace.getByRole('button', { name: 'C to K', exact: true }).click();
  await expectValid(workspace, 'utility', '273.15 kelvin');
  await workspace.getByRole('button', { name: 'Length', exact: false }).click();
  await expectValid(workspace, 'utility', '3.6576 meter');
  await expect(recentAnswers(workspace)).toHaveCount(3);
});

test('pending and invalid conversion results cannot write a stale answer to the clipboard', async ({ page }) => {
  await page.addInitScript(() => {
    const writes: string[] = [];
    Object.defineProperty(window, '__aftFreshnessClipboardWrites', { value: writes });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text: string) => { writes.push(text); } },
    });
  });
  const writes = () => page.evaluate(() =>
    (window as typeof window & { __aftFreshnessClipboardWrites: string[] }).__aftFreshnessClipboardWrites);
  const workspace = await openWorkspace(page, 'conversion-calculator', 'utility');
  const value = workspace.getByLabel('Value', { exact: true });
  const calculate = workspace.getByRole('button', { name: 'Convert value', exact: true });
  const copy = workspace.getByRole('button', { name: /^(Copy answer|Copied)$/ });
  await copy.click();
  await expect(copy).toHaveText('Copied');
  expect(await writes()).toEqual(['12 foot = 3.6576 meter']);

  await value.fill('');
  await expectPending(workspace, 'utility', 'Convert value');
  await copy.dispatchEvent('click');
  expect(await writes()).toEqual(['12 foot = 3.6576 meter']);
  await calculate.click();
  await expectInvalid(workspace, 'utility', 'Value is required');
  await copy.dispatchEvent('click');
  expect(await writes()).toEqual(['12 foot = 3.6576 meter']);

  await value.fill('0');
  await calculate.click();
  await expectValid(workspace, 'utility', '0 meter');
  await copy.click();
  await expect(copy).toHaveText('Copied');
  expect(await writes()).toEqual(['12 foot = 3.6576 meter', '0 foot = 0 meter']);
});

interface DeferredClipboardProbe {
  writes: string[];
  resolve: () => void;
  reject: () => void;
}

const deferredCopyJourneys = [
  { slug: 'conversion-calculator', kind: 'utility', field: 'Value', value: '20', action: 'Convert value', expected: '6.096 meter' },
  { slug: 'wallpaper-calculator', kind: 'utility', field: 'Room length feet', value: '20', action: 'Estimate wallpaper', expected: '9 rolls' },
  { slug: 'bmi-calculator', kind: 'health', field: 'Height (cm)', value: '200', action: 'Calculate BMI', expected: 'BMI 17.5' },
] as const;

for (const journey of deferredCopyJourneys) {
  for (const outcome of ['resolve', 'reject'] as const) {
    test(`${journey.slug} ignores a deferred clipboard ${outcome} after a newer calculation`, async ({ page }, testInfo) => {
      await page.addInitScript(() => {
        const probe: DeferredClipboardProbe = { writes: [], resolve: () => {}, reject: () => {} };
        Object.defineProperty(window, '__aftDeferredClipboardProbe', { value: probe });
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: (text: string) => {
              probe.writes.push(text);
              return new Promise<void>((resolve, reject) => {
                probe.resolve = resolve;
                probe.reject = () => reject(new Error('Deferred clipboard denial'));
              });
            },
          },
        });
      });
      const workspace = await openWorkspace(page, journey.slug, journey.kind);
      const copy = workspace.getByRole('button', { name: /^(Copy answer|Copied)$/ });
      await expectValid(workspace, journey.kind);
      await copy.click();
      await expect.poll(() => page.evaluate(() =>
        (window as typeof window & { __aftDeferredClipboardProbe: DeferredClipboardProbe })
          .__aftDeferredClipboardProbe.writes.length)).toBe(1);

      await workspace.getByLabel(journey.field, { exact: false }).fill(journey.value);
      await workspace.getByRole('button', { name: journey.action, exact: true }).click();
      await expectValid(workspace, journey.kind, journey.expected);

      await page.evaluate(async (completion) => {
        const probe = (window as typeof window & { __aftDeferredClipboardProbe: DeferredClipboardProbe })
          .__aftDeferredClipboardProbe;
        probe[completion]();
        // Let the old promise continuation and its possible React update finish before checking.
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      }, outcome);
      await answer(workspace, journey.kind).scrollIntoViewIfNeeded();
      await testInfo.attach('deferred-copy-state', {
        body: await page.screenshot(), contentType: 'image/png',
      });
      await testInfo.attach('deferred-copy-observation', {
        body: Buffer.from(JSON.stringify({
          slug: journey.slug,
          outcome,
          answer: await answer(workspace, journey.kind).textContent(),
          copyLabel: await copy.textContent(),
          copyDisabled: await copy.isDisabled(),
          alerts: await workspace.getByRole('alert').allTextContents(),
        }, null, 2)),
        contentType: 'application/json',
      });
      await expect(answer(workspace, journey.kind)).toHaveText(journey.expected);
      await expect(copy).toHaveText('Copy answer');
      await expect(copy).toBeEnabled();
      await expect(workspace.getByRole('alert')).toHaveCount(0);
    });
  }
}

test('the contrast color pickers still update results immediately', async ({ page }) => {
  const workspace = await openWorkspace(page, 'color-contrast-checker', 'utility');
  await expectValid(workspace, 'utility');
  await workspace.getByLabel('Text color picker', { exact: true }).fill('#000000');
  await expectValid(workspace, 'utility', '21:1');
  await expect(workspace.getByLabel('Text color', { exact: true })).toHaveValue('#000000');
  await workspace.getByLabel('Background color picker', { exact: true }).fill('#000000');
  await expectValid(workspace, 'utility', '1:1');
  await expect(workspace.locator('.utility-result-card')).toContainText('Fail');
});

test('the asynchronous hash generator still waits for an action and produces the selected digest', async ({ page }) => {
  const workspace = await openWorkspace(page, 'hash-generator', 'utility');
  const output = workspace.locator('.utility-result-card pre');
  const generate = workspace.getByRole('button', { name: 'Generate hash', exact: true });
  await expect(workspace.locator('.utility-result-card')).toHaveCount(0);
  await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeDisabled();
  await workspace.getByLabel('Text to hash', { exact: false }).fill('abc');
  await generate.click();
  await expect(output).toHaveText('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  await expect(workspace.getByRole('button', { name: 'Copy answer', exact: true })).toBeEnabled();
  await workspace.getByRole('combobox', { name: 'Algorithm', exact: true }).selectOption('SHA-384');
  await generate.click();
  await expect(output).toHaveText(/^[a-f0-9]{96}$/);
  await expect(workspace.locator('.utility-result-card')).toContainText('SHA-384 digest');
  await expect(recentAnswers(workspace)).toHaveCount(2);
  await expect(workspace.getByRole('alert')).toHaveCount(0);
});
