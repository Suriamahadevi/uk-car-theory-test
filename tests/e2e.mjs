// End-to-end check of the built app in headless Chromium.
// Usage: npx vite preview --port 4173 (in another shell), then: node tests/e2e.mjs
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:4173/';
const SHOTS = process.env.SHOTS ?? 'tests/screenshots';
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const check = (name, ok, extra = '') => { results.push({ name, ok, extra }); console.log(`${ok ? 'PASS' : 'FAIL'} – ${name}${extra ? ` (${extra})` : ''}`); };

const browser = await chromium.launch();
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

const go = async (hash) => { await page.goto(`${BASE}#${hash}`); await page.waitForSelector('h1'); };

// ---- 1. every navigation item works
await go('/');
const navs = ['/', '/topics', '/practice', '/mock', '/hazard', '/mistakes', '/revision', '/history', '/settings', '/about', '/topics/motorway'];
for (const n of navs) {
  await go(n);
  const h1 = await page.textContent('h1');
  check(`page ${n} renders`, !!h1 && h1.length > 3, h1.trim());
}
await go('/');
for (const label of ['Learn by topic', 'Practice questions', 'Mock test', 'Hazard perception', 'Mistake Book', 'Revision centre', 'Test history', 'Settings', 'Dashboard']) {
  await page.click(`.govuk-service-navigation__link:has-text("${label}")`);
  const ok = await page.waitForFunction((l) => document.querySelector('.govuk-service-navigation__item--active')?.textContent.includes(l), label, { timeout: 5000 }).then(() => true, () => false);
  check(`nav link "${label}"`, ok);
}
await page.screenshot({ path: `${SHOTS}/dashboard-desktop.png`, fullPage: true });

// ---- 2. learning mode: wrong answer → red + correct green + explanation + Mistake Book
await go('/practice');
await page.click('button:has-text("20 mixed questions")');
await page.waitForSelector('.app-question__text');
// find a wrong option: read the question ID from localStorage then click a non-correct option
const pick = await page.evaluate(() => {
  const d = JSON.parse(localStorage.getItem('theory-test-ready:v1'));
  return d.activeSession.qids[0];
});
// click options until we find one that is wrong (first click answers the question)
await page.locator('.app-option').first().click();
const wrongShown = await page.locator('.app-option.is-wrong').count();
const correctShown = await page.locator('.app-option.is-correct').count();
const fb = await page.locator('.app-feedback').textContent();
if (wrongShown) {
  check('wrong answer highlighted red', wrongShown === 1);
  check('correct answer highlighted green when wrong', correctShown === 1);
  check('explanations shown for wrong answer', /Why your answer is wrong/.test(fb) && /Why the other options are wrong/.test(fb) && /Rule to remember/.test(fb));
} else {
  check('correct answer highlighted green', correctShown === 1);
  check('explanation shown for correct answer', /Why this answer is correct/.test(fb));
}
await page.screenshot({ path: `${SHOTS}/learning-feedback.png`, fullPage: true });
// answer the rest by always choosing option B; at least one should be wrong
for (let i = 1; i < 20; i++) {
  await page.click('button:has-text("Next question"), button:has-text("Finish session")');
  if (await page.locator('.govuk-panel__title:has-text("Session complete")').count()) break;
  await page.locator('.app-option').nth(1).click();
}
await page.click('button:has-text("Finish session")').catch(() => {});
await page.waitForSelector('.govuk-panel__title');
check('practice session completes with summary', (await page.textContent('.govuk-panel__title')).includes('Session complete'));
const mistakeCount = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('theory-test-ready:v1')).mistakes).length);
check('wrong answers saved in Mistake Book', mistakeCount > 0, `${mistakeCount} saved`);
console.log('first practice question was', pick);

// ---- 3. mock test
await go('/mock');
await page.click('button:has-text("Start the mock test")');
await page.waitForSelector('.app-timer');
const t1 = await page.textContent('.app-timer');
check('timer starts at 57:00 or just under', /^5[67]:\d\d$/.test(t1.trim()), t1);
await page.waitForTimeout(2200);
const t2 = await page.textContent('.app-timer');
check('timer counts down', t2 < t1, `${t1} → ${t2}`);
check('no answers revealed during exam', (await page.locator('.app-feedback, .is-correct, .is-wrong').count()) === 0);
await page.screenshot({ path: `${SHOTS}/mock-exam.png`, fullPage: true });

// answer all 50 with option A, using Next
for (let i = 0; i < 50; i++) {
  await page.locator('.app-option').first().click();
  if (i === 4) await page.click('button:has-text("Flag for review")');
  if (i < 49) await page.click('.app-exam__controls button:has-text("Next")');
}
check('reached question 50', (await page.textContent('h1')).includes('Question 50 of 50'));
// go back and change answer on Q50 to option B
await page.click('.app-exam__controls button:has-text("Previous")');
check('previous works', (await page.textContent('h1')).includes('Question 49 of 50'));
await page.locator('.app-option').nth(1).click();
const changed = await page.evaluate(() => JSON.parse(localStorage.getItem('theory-test-ready:v1')).activeMock.answers[48].selected[0]);
check('answer can be changed', changed === 1);
// jump to question 5 via grid
await page.click('.app-qgrid button:text-is("5")');
check('question number navigation works', (await page.textContent('h1')).includes('Question 5 of 50'));
check('flag persisted', (await page.locator('h1 .govuk-tag:has-text("Flagged")').count()) === 1);
// refresh mid-exam: timer and answers persist
await page.reload();
await page.waitForSelector('.app-timer');
const answeredAfterReload = await page.evaluate(() => JSON.parse(localStorage.getItem('theory-test-ready:v1')).activeMock.answers.filter((a) => a.selected.length).length);
check('mock answers survive refresh', answeredAfterReload === 50);
// review + confirm + submit
await page.click('.app-exam__controls button:text-is("Review")');
await page.click('button:has-text("Review flagged (1)")');
check('review flagged filter', (await page.locator('.app-qgrid button').count()) === 1);
await page.click('button:has-text("End test and submit")');
check('confirmation before submit', (await page.textContent('h1')).includes('Are you sure'));
await page.click('button:has-text("Yes, submit my answers")');
await page.waitForSelector('.govuk-panel__body');
const scoreText = await page.textContent('.govuk-panel__body');
const score = Number(scoreText.match(/scored (\d+) out of 50/)[1]);
await page.click('label:has-text("All (50)")');
const correctRows = await page.locator('.govuk-details__summary-text:has-text("✓ correct")').count();
check('score matches marked questions', correctRows === score, `score ${score}, rows ${correctRows}`);
check('pass/fail matches pass mark', (await page.textContent('.govuk-panel__title')).trim() === (score >= 43 ? 'Pass' : 'Not passed'));
await page.screenshot({ path: `${SHOTS}/mock-results.png`, fullPage: false });
const firstMockQids = await page.evaluate(() => JSON.parse(localStorage.getItem('theory-test-ready:v1')).mocks[0].answers.map((a) => a.qid));

// ---- 4. revise incorrect, then fresh mock
await page.click('button:has-text("Revise my")');
await page.waitForSelector('.app-question__text');
check('revision session from mock opens', (await page.textContent('.govuk-caption-m')).includes('Mock test revision'));
await page.click('button:has-text("End session now")');
await page.waitForSelector('.govuk-panel__title');
check('fresh mock offered after revision', (await page.locator('button:has-text("Start a fresh mock test")').count()) === 1);
await page.click('button:has-text("Start a fresh mock test")');
await page.waitForSelector('.app-timer');
const secondQids = await page.evaluate(() => JSON.parse(localStorage.getItem('theory-test-ready:v1')).activeMock.answers.map((a) => a.qid));
const overlap = secondQids.filter((q) => firstMockQids.includes(q)).length;
check('fresh mock uses new questions', overlap === 0, `${overlap} repeated`);
// submit empty second mock quickly
await page.click('.app-exam__controls button:text-is("Review")');
await page.click('button:has-text("End test and submit")');
check('warning about unanswered questions', (await page.textContent('.govuk-warning-text')).includes('50 unanswered'));
await page.click('button:has-text("Yes, submit my answers")');
await page.waitForSelector('.govuk-panel__body');

// ---- 5. history persists after refresh
await go('/history');
await page.reload();
await page.waitForSelector('h1');
const rows = await page.locator('table').first().locator('tbody tr').count();
check('history keeps both mock tests after refresh', rows === 2, `${rows} rows`);

// ---- 6. Mistake Book revision actions
await go('/mistakes');
await page.click('button:has-text("Revise all wrong questions")');
await page.waitForSelector('.app-question__text');
check('Mistake Book revision session starts', (await page.textContent('.govuk-caption-m')).includes('Revise all wrong questions'));
await go('/mistakes');
check('unanswered retry available', await page.locator('button:has-text("Retry unanswered questions")').isEnabled());

// ---- 7. revision centre quick check, topic notes
await go('/revision');
await page.locator('button:has-text("Quick check")').first().click();
await page.waitForSelector('.app-question__text');
check('revision quick check works', (await page.textContent('.govuk-caption-m')).includes('Quick check'));
await go('/topics/alertness');
await page.click('button:has-text("I have read these notes")');
check('notes can be marked read', (await page.locator('.govuk-tag:has-text("Notes read")').count()) === 1);

// ---- 8. hazard perception clip
await go('/hazard/clip/hp1');
await page.click('button:has-text("Play clip")');
await page.waitForTimeout(7400);
await page.click('button:has-text("Hazard!")');
await page.waitForSelector('.app-feedback', { timeout: 20000 });
const hpText = await page.textContent('.app-feedback h3');
check('hazard clip scores a timely click', /: [1-5] out of 5/.test(hpText), hpText);
await page.screenshot({ path: `${SHOTS}/hazard-clip.png`, fullPage: true });

// ---- 9. mobile layout: no horizontal scroll; menu toggle
const mobile = await browser.newPage({ viewport: { width: 375, height: 800 }, isMobile: true });
mobile.on('pageerror', (e) => errors.push(`mobile pageerror: ${e.message}`));
for (const n of ['/', '/topics', '/practice', '/mock', '/hazard', '/mistakes', '/revision', '/history', '/settings', '/about']) {
  await mobile.goto(`${BASE}#${n}`);
  await mobile.waitForSelector('h1');
  const over = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check(`mobile ${n} has no horizontal scroll`, over <= 0, `overflow ${over}px`);
}
await mobile.goto(`${BASE}#/`);
await mobile.waitForSelector('h1');
check('mobile menu hidden initially', !(await mobile.locator('#navigation').isVisible()));
await mobile.click('button.govuk-service-navigation__toggle');
check('mobile menu opens', await mobile.locator('#navigation').isVisible());
await mobile.screenshot({ path: `${SHOTS}/dashboard-mobile.png`, fullPage: true });
await mobile.goto(`${BASE}#/mock/exam`);
await mobile.waitForSelector('h1');
const overExam = await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
check('mobile exam screen has no horizontal scroll', overExam <= 0, `overflow ${overExam}px`);

// ---- console errors
const realErrors = errors.filter((e) => !/favicon/.test(e));
check('no console errors or warnings', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
