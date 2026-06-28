# Techdome QA — Playwright Suite for techdome.io

End-to-end, integration, security and load tests for **techdome.io**, built for the
Techdome QA Engineer take-home assignment.

## Setup

```bash
npm install            # install Playwright + dependencies
npx playwright install # download browser binaries
```

## Run everything (single command)

```bash
npx playwright test
```
This runs all test suites -E2E,integration,security & load

### Run a single suite

```bash
npx playwright test --project=e2e
npm playwright test --project=integration
npm playwright test --project=load
npm playwright test --project=security      
npm playwright show-report              # open the HTML report after run
```

## ⚠️ Load test constraint

The load test simulates **exactly 5 concurrent users** and never more. Concurrency
is created by 5 browser contexts fired with `Promise.all` inside a single test, and
the `load` Playwright project is pinned to `workers: 1`.

Running the load test writes `docs/load-test-results.md` (p95, avg, max, 5xx, verdict).

## Structure

```
tests/
  e2e/          8 user-journey tests (US-001..US-008)
  integration/  3 network/API tests (US-009..US-011)
  security/     3 header/injection/leak tests (US-012..US-014)
  load/         1 five-user load test (US-015)
utils/
  helpers.ts    routes, link lists, shared assertions
  fixtures.ts   Home/Contact page objects + custom fixtures
docs/
  user-story-map.md
  claude-code-log.md
  bugs.md
  load-test-results.md
playwright.config.ts
```

## Configuration

Point the suite at a different environment with an env var:

```bash
BASE_URL=https://staging.techdome.io npx playwright test
```

## Notes for reviewers

- Selector strategy favours `getByRole`/`getByLabel` for resilience on this
  SvelteKit site; placeholder fallbacks are flagged in comments.
- Security assertions are intentionally strict: a missing header is reported as a
  bug rather than asserted away.
- See `docs/bugs.md` for findings and `docs/claude-code-log.md` for how AI was used.
