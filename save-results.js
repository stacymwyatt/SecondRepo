// save-results.js
// Reads the Playwright JSON results from the latest test run and appends
// a summary entry to test-history.json.
//
// Run this after every Playwright test run:
//   node save-results.js
//
// GitHub Actions runs this automatically after the UI test job.

const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(__dirname, 'test-results', 'results.json');
const HISTORY_FILE = path.join(__dirname, 'test-history.json');

// Read the Playwright JSON output
if (!fs.existsSync(RESULTS_FILE)) {
  console.error('No results.json found. Run Playwright tests first.');
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));

// Count passes and failures across all test suites
let passed = 0;
let failed = 0;
const failedTests = [];

// Playwright's JSON output nests results in suites → specs → tests
function countResults(suites) {
  for (const suite of suites) {
    // Recurse into nested suites (files contain suites which contain tests)
    if (suite.suites) countResults(suite.suites);

    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        if (test.status === 'expected') {
          passed++;
        } else {
          failed++;
          failedTests.push(spec.title);
        }
      }
    }
  }
}

countResults(results.suites || []);

// Build a summary entry for this run
const entry = {
  date: new Date().toISOString(),          // timestamp of this run
  passed,
  failed,
  total: passed + failed,
  failedTests,                              // which tests failed (empty if all passed)
};

// Load existing history (or start fresh if the file doesn't exist yet)
let history = [];
if (fs.existsSync(HISTORY_FILE)) {
  history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
}

// Append this run's summary and save
history.push(entry);
fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));

console.log(`Saved results: ${passed} passed, ${failed} failed`);
