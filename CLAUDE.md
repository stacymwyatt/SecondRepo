# Project: SecondRepo — Contact List App

## What this project is
A simple contact list web app. Users can add, view, edit, and delete contacts.
Built for local development and learning. Also used to practice API testing (Postman + Jest)
and UI testing (Playwright), with CI/CD via GitHub Actions.

---

## Stack
- **Frontend**: HTML, CSS, vanilla JavaScript (`index.html`)
- **Backend**: Node.js with Express (`server.js`)
- **Database**: SQLite via better-sqlite3 (`contacts.db`) — viewable in DBeaver
- **API testing**: Jest + Supertest (`contacts.test.js`)
- **UI testing**: Playwright (`tests-ui/contacts.spec.js`)
- **API exploration**: Postman collections in `postman/` and `.postman/`
- **CI/CD**: GitHub Actions (`.github/workflows/test.yml`)

---

## How to run

```bash
npm install       # install dependencies (first time only)
node server.js    # start the server at http://localhost:3000
```

**Always restart the server after making code changes** — changes don't take effect until it reloads.

---

## How to run tests

### API tests (Jest)
```bash
npm test
```
- Uses an in-memory SQLite database — never touches `contacts.db`
- Does NOT require the server to be running

### UI tests (Playwright)
```bash
# Terminal 1:
node server.js

# Terminal 2:
npx playwright test
```
- Requires the server to be running first
- Opens a real browser and interacts with the app like a user would
- Failure screenshots are saved to `test-results/`

---

## Project structure

```
index.html              — main contact list UI
dashboard.html          — test history dashboard (deployed to GitHub Pages)
server.js               — Express server and REST API routes
contacts.db             — SQLite database (auto-created on first run; ignored by git)
contacts.test.js        — Jest API tests (run with: npm test)
tests-ui/
  contacts.spec.js      — Playwright UI tests
generate-test-data.js   — script to seed the database with sample contacts
save-results.js         — script to append CI test results to test-history.json
test-history.json       — cumulative log of test run outcomes (committed by CI)
playwright.config.js    — Playwright configuration
package.json            — dependencies and npm scripts
postman/                — Postman collection and environment files
.postman/               — additional Postman config
.github/workflows/
  test.yml              — CI pipeline (runs on push, PR, and nightly schedule)
```

---

## CI/CD pipeline (GitHub Actions)

Three jobs run on every push and on a nightly schedule (2:00am UTC):

1. **api-tests** — runs Jest; no server needed
2. **ui-tests** — starts the server, runs Playwright, saves results to `test-history.json`, commits it back to the repo
3. **deploy-pages** — deploys `dashboard.html` + `test-history.json` to GitHub Pages

PRs trigger jobs 1 and 2 but do NOT update test history or deploy to Pages.

---

## Preferences
- Keep code simple and well-commented — explain what things do, not just what they are
- Prefer small, focused changes
- Always explain code changes in plain English alongside the code
- Do not over-engineer; keep the stack minimal
- Test locally before pushing

---

## SDLC: Testing expectations

Tests are written in the same sitting as the code — not in a follow-up task.

### When tests are required
- New features
- New or modified API endpoints
- Any change that affects app behavior (examples: adding field validation, changing data formats, making a field required)

### Which layer
- API changes → Jest tests (`contacts.test.js`)
- UI changes → Playwright tests (`tests-ui/contacts.spec.js`)

### Claude's role
When making a qualifying change, remind Stacy that tests are needed and ask whether to write them now. Do not write tests automatically and do not block the task — wait for her decision.
