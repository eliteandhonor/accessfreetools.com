import { expect, test } from '@playwright/test';

const workingPages = [
  '/tools/text-case-converter/',
  '/tools/conversion-calculator/',
  '/tools/image-to-text-ocr-tool/',
  '/tools/audio-video-transcriber/',
  '/tools/bmi-calculator/',
  '/tools/wallpaper-calculator/',
];

test.describe('working tool comes before supporting content', () => {
  for (const path of workingPages) {
    test(`${path} exposes its working controls and keyboard jump before the artwork`, async ({ page }) => {
      await page.goto(path);
      const workspace = page.locator('#tool-workspace');
      await expect(workspace).toBeVisible();
      await expect(workspace).toHaveAttribute('data-clarity-mask', 'true');
      await expect(workspace).toHaveAttribute('data-aft-tool-usage-surface', '');
      await expect(workspace.locator('input, textarea, select, button').first()).toBeAttached();

      const placement = await workspace.evaluate((element) => {
        const artwork = document.querySelector('.tool-art-figure');
        const notes = document.querySelector('#tool-notes');
        return {
          top: element.getBoundingClientRect().top,
          precedesArtwork: Boolean(artwork && element.compareDocumentPosition(artwork) & Node.DOCUMENT_POSITION_FOLLOWING),
          precedesNotes: Boolean(notes && element.compareDocumentPosition(notes) & Node.DOCUMENT_POSITION_FOLLOWING),
        };
      });
      expect(placement.top).toBeLessThan(600);
      expect(placement.precedesArtwork).toBe(true);
      expect(placement.precedesNotes).toBe(true);

      const jump = page.getByRole('link', { name: 'Use tool', exact: true });
      await jump.focus();
      await page.keyboard.press('Enter');
      await expect.poll(() => workspace.evaluate((element) => element.contains(document.activeElement))).toBe(true);
      await expect(page).toHaveURL(/#tool-workspace$/);
      await expect(page.getByRole('link', { name: 'Read guide', exact: true })).toHaveAttribute('href', /^\/blog\//);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)).toBe(false);
    });
  }

  test('planning limits remain beside high-trust working controls', async ({ page }) => {
    await page.goto('/tools/bmi-calculator/');
    await expect(page.locator('#tool-workspace .workspace-limit-note')).toContainText('not a diagnosis');
    await page.goto('/tools/sales-tax-calculator/');
    await expect(page.locator('#tool-workspace .workspace-limit-note')).toContainText('not financial or tax advice');
    await page.goto('/tools/wallpaper-calculator/');
    await expect(page.locator('#tool-workspace .workspace-limit-note')).toContainText('local requirements');
  });

  test('speech privacy, permission, and current comparison promises remain truthful', async ({ page }) => {
    await page.goto('/tools/text-to-speech-audiobook-generator/');
    const workspace = page.locator('#tool-workspace');
    await expect(workspace).toContainText(/browser|device/i);
    await expect(page.locator('#tool-notes')).toContainText('Use only text you have permission to convert');
    await expect(page.locator('#tool-notes')).not.toContainText('measured Edge and Chrome');
    await expect(page.locator('#tool-notes')).toContainText('privacy and license limits');
  });
});
