import { chromium, expect as ui, type Browser, type Page } from '@playwright/test';
import { build } from 'esbuild';
import { afterAll, afterEach, beforeAll, beforeEach, expect, it } from 'vitest';

const harness = `
import React from 'react';
import { createRoot } from 'react-dom/client';
import FourInARowGame from './src/components/FourInARowGame';
window.gameEvents = [];
document.addEventListener('aft:tool-action', event => window.gameEvents.push(event.detail));
const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode><FourInARowGame /></React.StrictMode>);
`;
let browser: Browser, page: Page, script: string;
let errors: string[];
beforeAll(async () => {
  script = (await build({ stdin: { contents: harness, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser', jsx: 'automatic' })).outputFiles[0].text;
  browser = await chromium.launch({ headless: true });
});
beforeEach(async () => {
  page = await browser.newPage(); errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => route.abort());
  await page.setContent('<button id="outside">Outside game</button><div id="root"></div>');
  await page.addScriptTag({ content: script });
  await ui(page.getByRole('heading', { name: 'Four in a Row', exact: true })).toBeVisible();
});
afterEach(async () => { await page.close(); expect(errors).toEqual([]); });
afterAll(async () => { await browser?.close(); });

const actions = () => page.evaluate(() => (window as any).gameEvents.map((event: { action: string }) => event.action));
const drop = async (column: number) => page.getByRole('button', { name: `Drop in column ${column}`, exact: true }).click();
const win = async () => { for (const column of [1, 2, 1, 2, 1, 2, 1]) await drop(column); };
const tabStop = () => page.locator('.four-row-game__column-controls button[tabindex="0"]:enabled');

it('counts first-move undo/replay as one local round, with no move or identity data', async () => {
  await page.getByRole('button', { name: 'Play a friend' }).click();
  await drop(1);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await drop(2);
  expect((await actions()).filter((action: string) => action.startsWith('Start round:'))).toHaveLength(1);
  expect(await actions()).toEqual(['Start round: friend (round-v2)']);
  const details = await page.evaluate(() => (window as any).gameEvents);
  expect(details).toEqual([{ action: 'Start round: friend (round-v2)', category: 'everyday-tools',
    clarityEvent: 'four_in_a_row_start_friend_v2', toolName: 'Four in a Row Game', toolSlug: 'four-in-a-row-game' }]);
});

it('counts win/undo/re-win once but keeps the visible reversible score correct', async () => {
  await page.getByRole('button', { name: 'Play a friend' }).click();
  await win();
  await ui(page.getByRole('status')).toContainText('Player 1 wins');
  await ui(page.locator('.four-row-game__score strong').first()).toHaveText('1');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await ui(page.locator('.four-row-game__score strong').first()).toHaveText('0');
  await drop(1);
  await ui(page.locator('.four-row-game__score strong').first()).toHaveText('1');
  expect((await actions()).filter((action: string) => action.startsWith('Complete round'))).toHaveLength(1);
  await page.getByRole('button', { name: 'Play again', exact: true }).click();
  expect(await actions()).toEqual(['Start round: friend (round-v2)', 'Complete round (round-v2)', 'Replay round (round-v2)']);
  await drop(3);
  expect((await actions()).filter((action: string) => action.startsWith('Start round:'))).toHaveLength(2);
});

it('New round and a mode change reset lifecycle without fabricating a replay or start', async () => {
  await page.getByRole('button', { name: 'Play a friend' }).click();
  await page.getByRole('button', { name: 'New round', exact: true }).click();
  expect(await actions()).toEqual([]);
  await drop(1);
  await page.getByRole('button', { name: 'New round', exact: true }).click();
  await drop(1);
  await page.getByRole('button', { name: 'Play computer' }).click();
  expect(await actions()).toEqual(['Start round: friend (round-v2)', 'Start round: friend (round-v2)']);
  await drop(2);
  expect((await actions()).at(-1)).toBe('Start round: computer (round-v2)');
});

for (const key of ['Enter', 'Space']) {
  it(`keeps one legal tab stop when keyboard ${key} fills the active column`, async () => {
    await page.getByRole('button', { name: 'Play a friend' }).click();
    const column = page.getByRole('button', { name: 'Drop in column 4', exact: true });
    await column.focus();
    for (let index = 0; index < 6; index++) await page.keyboard.press(key);
    await ui(page.getByRole('button', { name: 'Column 4 is full' })).toBeDisabled();
    await ui(tabStop()).toHaveCount(1);
    await ui(tabStop()).toBeFocused();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await ui(tabStop()).toBeFocused();
  });
}

it('Left/Right/Home/End skip full columns and undo/reset keep a re-enterable board', async () => {
  await page.getByRole('button', { name: 'Play a friend' }).click();
  for (const column of [1, 7]) for (let index = 0; index < 6; index++) await drop(column);
  await page.getByRole('button', { name: 'Drop in column 2', exact: true }).focus();
  await page.keyboard.press('ArrowLeft');
  await ui(page.getByRole('button', { name: 'Drop in column 6', exact: true })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await ui(page.getByRole('button', { name: 'Drop in column 2', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await ui(page.getByRole('button', { name: 'Drop in column 6', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await ui(page.getByRole('button', { name: 'Drop in column 2', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await ui(tabStop()).toHaveCount(1);
  await page.getByRole('button', { name: 'New round', exact: true }).click();
  await ui(tabStop()).toHaveCount(1);
  await ui(page.getByRole('button', { name: 'New round', exact: true })).toBeFocused();
});

it('restores board focus after a real computer turn unless the user moves elsewhere', async () => {
  await page.clock.install();
  await page.getByRole('button', { name: 'Drop in column 4', exact: true }).focus();
  await page.keyboard.press('Enter');
  await ui(tabStop()).toHaveCount(0);
  await page.clock.runFor(500);
  await ui(tabStop()).toHaveCount(1);
  await ui(tabStop()).toBeFocused();
  await page.keyboard.press('Enter');
  await page.locator('#outside').focus();
  await page.clock.runFor(500);
  await ui(tabStop()).toHaveCount(1);
  await ui(page.locator('#outside')).toBeFocused();
});
