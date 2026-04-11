// playwright.config.js
// Playwright settings for the contact list app.

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Where our UI test files live
  testDir: './tests-ui',

  // Use Chromium (Chrome) as the browser
  use: {
    browserName: 'chromium',

    // The address of our running server
    baseURL: 'http://localhost:3000',

    // Headless on CI (no screen available), headed locally so you can watch.
    headless: !!process.env.CI,

    // Slow down each action by 500ms so you can follow along visually.
    // Remove or set to 0 for faster runs.
    launchOptions: {
      slowMo: 500,
    },

    // Record a video of every test run.
    // 'retain-on-failure' means: record always, but only keep the file if the test fails.
    // This saves disk space — passing tests don't need evidence.
    video: 'retain-on-failure',

    // Take a screenshot automatically when a test fails.
    screenshot: 'only-on-failure',
  },

  // Where to save videos, screenshots, and other test artifacts
  outputDir: 'test-results/',

  // Generate reports after every run.
  // - HTML report: viewable with: npx playwright show-report
  // - JSON report: machine-readable results used by save-results.js to build history
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});
