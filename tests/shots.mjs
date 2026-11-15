// Captures review screenshots of key screens (desktop + mobile).
import { chromium } from '@playwright/test';
const BASE = process.env.BASE ?? 'http://localhost:4173/uk-car-theory-test/';
const OUT = process.env.OUT ?? 'tests/screenshots/review';
const b = await chromium.launch();
for (const [name, vp] of [['desktop', { width: 1366, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const p = await b.newPage({ viewport: vp });
  const shot = async (hash, file, prep) => { await p.goto(BASE + '#' + hash); await p.waitForSelector('h1'); if (prep) await prep(); await p.screenshot({ path: `${OUT}/${name}-${file}.png`, fullPage: true }); };
  await shot('/', 'welcome');
  await shot('/practice', 'practice');
  await p.click('button:has-text("Smart practice")'); await p.waitForSelector('.app-question__text');
  await p.locator('.app-option').nth(1).click(); if (await p.locator('button:has-text("Check answer")').count()) { await p.locator('.app-option').nth(2).click(); await p.click('button:has-text("Check answer")'); }
  await p.screenshot({ path: `${OUT}/${name}-feedback.png`, fullPage: true });
  await shot('/', 'dashboard');
  await shot('/topics/motorway', 'topic');
  await shot('/revision', 'revision');
  await shot('/analytics', 'analytics');
  await shot('/mistakes', 'mistakes');
  await shot('/hazard', 'hazard');
}
await b.close();
