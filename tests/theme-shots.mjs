// Review screenshots of the theme system (not a test).
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173/uk-car-theory-test/';
const OUT = 'tests/screenshots/review';
const b = await chromium.launch();
const shots = [['midnight-teal', 'light', '/settings', 'settings-gallery'], ['royal-blue', 'dark', '/', 'dash-royal-dark'], ['burgundy-rose', 'dark', '/topics/motorway', 'topic-burgundy-dark'], ['sage-minimal', 'light', '/', 'dash-sage-light']];
for (const [t, m, hash, name] of shots) {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
  await ctx.addInitScript(([t, m]) => localStorage.setItem('ttr-theme', JSON.stringify({ themeId: t, mode: m })), [t, m]);
  const p = await ctx.newPage();
  await p.goto(BASE + '#' + hash); await p.waitForSelector('h1');
  await p.screenshot({ path: `${OUT}/${name}.png`, fullPage: hash === '/settings' });
  await ctx.close();
}
// Dark exam screen
const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, serviceWorkers: 'block' });
await ctx.addInitScript(() => localStorage.setItem('ttr-theme', JSON.stringify({ themeId: 'ocean-blue', mode: 'dark' })));
const p = await ctx.newPage();
await p.goto(BASE + '#/mock'); await p.click('button:has-text("Start the mock test")'); await p.waitForSelector('.app-timer');
await p.locator('.app-option').first().click(); await p.mouse.move(0, 0);
await p.screenshot({ path: `${OUT}/exam-ocean-dark.png` });
await b.close();
