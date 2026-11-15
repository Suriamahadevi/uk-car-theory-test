import { defineConfig, devices } from '@playwright/test';

// UI regression tests: screenshot comparison of key screens on desktop and mobile.
// Run `npm run test:visual` (or `npm run test:visual -- --update-snapshots` after an intended design change).
export default defineConfig({
  testDir: 'tests',
  testMatch: '*.pw.ts',
  snapshotPathTemplate: '{testDir}/visual-baseline/{arg}-{projectName}{ext}',
  fullyParallel: false,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4175/uk-car-theory-test/', serviceWorkers: 'block' },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' } },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: { command: 'npx vite preview --port 4175 --strictPort', url: 'http://localhost:4175/uk-car-theory-test/', reuseExistingServer: true },
});
