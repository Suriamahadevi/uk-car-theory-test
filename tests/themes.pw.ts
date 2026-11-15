import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const THEMES = ['midnight-teal', 'royal-blue', 'forest-green', 'burgundy-rose', 'royal-purple', 'ocean-blue', 'charcoal-gold', 'sunset-coral', 'sage-minimal', 'arctic-ice'];
const MODES = ['light', 'dark'] as const;

const setPrefs = async (page: Page, themeId: string, mode: string) => {
  await page.addInitScript(([t, m]) => { localStorage.setItem('ttr-theme', JSON.stringify({ themeId: t, mode: m })); }, [themeId, mode]);
};
const contrastViolations = async (page: Page) => {
  const r = await new AxeBuilder({ page }).withRules(['color-contrast']).exclude('.app-hp-stage').exclude('.app-sign').analyze();
  return r.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')} – ${n.any[0]?.message ?? v.help}`));
};

test.describe('Theme contrast on real pages (axe-core, WCAG AA)', () => {
  test.skip(({ isMobile }) => !!isMobile, 'run on desktop only');
  for (const theme of THEMES) {
    for (const mode of MODES) {
      test(`${theme} ${mode}`, async ({ page }) => {
        await setPrefs(page, theme, mode);
        // Measure final colours, not mid-transition values (the site disables transitions for reduced motion).
        await page.emulateMedia({ reducedMotion: 'reduce' });
        const failures: string[] = [];
        // Dashboard, topic, settings gallery, and a practice question with feedback.
        for (const hash of ['/', '/topics/motorway', '/settings', '/mistakes']) {
          await page.goto(`#${hash}`);
          await page.waitForSelector('h1');
          failures.push(...(await contrastViolations(page)).map((f) => `${hash}: ${f}`));
        }
        await page.goto('#/practice');
        await page.click('button:has-text("20 mixed questions")');
        await page.waitForSelector('.app-question__text');
        await page.locator('.app-option').first().click();
        if (await page.locator('button:has-text("Check answer")').count()) { await page.locator('.app-option').nth(1).click(); await page.click('button:has-text("Check answer")'); }
        await page.waitForSelector('.app-feedback');
        await page.click('summary:has-text("More detail")');
        failures.push(...(await contrastViolations(page)).map((f) => `session: ${f}`));
        // Exam screen
        await page.goto('#/mock');
        await page.click('button:has-text("Start the mock test")');
        await page.waitForSelector('.app-timer');
        await page.locator('.app-option').first().click();
        failures.push(...(await contrastViolations(page)).map((f) => `exam: ${f}`));
        expect(failures).toEqual([]);
      });
    }
  }
});

test.describe('Theme gallery behaviour', () => {
  test.skip(({ isMobile }) => !!isMobile, 'run on desktop only');

  test('hover previews without saving; click applies and persists after reload', async ({ page }) => {
    await page.goto('#/settings');
    await page.waitForSelector('.app-theme-card');
    const primary = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--sidebar-bg').trim().toLowerCase());
    expect(await primary()).toBe('#102a35');
    await page.hover('[data-theme-id="royal-blue"]');
    expect(await primary()).toBe('#172554'); // live preview
    expect(await page.evaluate(() => localStorage.getItem('ttr-theme'))).not.toContain('royal-blue'); // not saved
    await page.mouse.move(0, 0);
    await page.hover('h1');
    expect(await primary()).toBe('#102a35'); // preview reverted
    await page.click('[data-theme-id="forest-green"]');
    expect(await primary()).toBe('#173b32');
    expect(await page.locator('[data-theme-id="forest-green"]').getAttribute('aria-pressed')).toBe('true');
    await page.reload();
    await page.waitForSelector('h1');
    expect(await primary()).toBe('#173b32');
  });

  test('keyboard: arrows move and preview, Enter applies; mode toggle; reset', async ({ page }) => {
    await page.goto('#/settings');
    await page.waitForSelector('.app-theme-card');
    await page.focus('[data-theme-id="midnight-teal"]');
    await page.keyboard.press('ArrowRight');
    expect(await page.evaluate(() => (document.activeElement as HTMLElement).dataset.themeId)).toBe('royal-blue');
    await page.keyboard.press('Enter');
    expect(JSON.parse((await page.evaluate(() => localStorage.getItem('ttr-theme')))!).themeId).toBe('royal-blue');
    await page.click('[role="radio"][data-mode="dark"]');
    expect(await page.evaluate(() => document.documentElement.dataset.mode)).toBe('dark');
    expect(JSON.parse((await page.evaluate(() => localStorage.getItem('ttr-theme')))!).mode).toBe('dark');
    await page.keyboard.press('ArrowLeft');
    expect(await page.evaluate(() => document.documentElement.dataset.mode)).toBe('light');
    await page.click('button:has-text("Reset to default theme")');
    expect(JSON.parse((await page.evaluate(() => localStorage.getItem('ttr-theme')))!)).toEqual({ themeId: 'midnight-teal', mode: 'light' });
  });

  test('saved theme is applied before the app script runs (no flash)', async ({ page }) => {
    await page.goto('#/settings');
    await page.click('[data-theme-id="sunset-coral"]');
    await page.click('[role="radio"][data-mode="dark"]');
    const expected = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
    // Block the application bundle: only the inline boot script can set the theme.
    await page.route('**/assets/*.js', (r) => r.abort());
    await page.reload();
    const bg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg').trim());
    expect(bg).toBe(expected);
    expect(await page.evaluate(() => document.documentElement.dataset.mode)).toBe('dark');
  });

  test('progress data is untouched by theme changes', async ({ page }) => {
    await page.goto('#/settings');
    await page.evaluate(() => localStorage.setItem('theory-test-ready:v1', JSON.stringify({ version: 1, attempts: [{ qid: 'AL-01', selected: [2], correct: true, at: 1, mode: 'learn', sessionId: 's' }] })));
    await page.reload();
    await page.click('[data-theme-id="arctic-ice"]');
    const data = await page.evaluate(() => JSON.parse(localStorage.getItem('theory-test-ready:v1')!));
    expect(data.attempts.length).toBe(1);
  });
});
