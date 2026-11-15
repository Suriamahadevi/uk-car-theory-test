import { test, expect } from '@playwright/test';

// Fresh profile each test (empty localStorage) so screens are deterministic.
const SCREENS: [string, string][] = [
  ['dashboard-welcome', '/'],
  ['topics', '/topics'],
  ['topic-motorway', '/topics/motorway'],
  ['practice', '/practice'],
  ['mock-start', '/mock'],
  ['hazard', '/hazard'],
  ['mistakes-empty', '/mistakes'],
  ['revision', '/revision'],
  ['performance', '/analytics'],
  ['first-aid', '/first-aid'],
  ['about', '/about'],
  ['settings', '/settings'],
];

for (const [name, hash] of SCREENS) {
  test(`UI regression: ${name}`, async ({ page }) => {
    await page.goto(`#${hash}`);
    await page.waitForSelector('h1');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

test('UI regression: exam screen stays flat and minimal', async ({ page }) => {
  await page.goto('#/mock');
  await page.click('button:has-text("Start the mock test")');
  await page.waitForSelector('.app-timer');
  const shadow = await page.locator('.app-option').first().evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toBe('none');
  await page.mouse.move(0, 0); // avoid hover styles
  // Questions are random, so compare the fixed exam chrome only (timer masked).
  await expect(page.locator('.app-exam__bar')).toHaveScreenshot('exam-bar.png', { mask: [page.locator('.app-timer')] });
  // Controls: verify they are flat (no clay depth) rather than pixel-compare.
  for (const sel of ['.app-exam__controls .govuk-button', '.app-qgrid button']) {
    const shadows = await page.locator(sel).evaluateAll((els) => els.map((e) => getComputedStyle(e).boxShadow));
    expect(shadows.every((x) => x === 'none')).toBe(true);
  }
});
