/// <reference types="node" />
import { test, expect, chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';


const USERS = 5;
const BASE_URL = 'https://techdome.io';

function p95(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(0.95 * sorted.length) - 1];
}

test('5 users load homepage + contact', async () => {
  test.setTimeout(120_000);

  const browser = await chromium.launch();
  const times: number[] = [];
  const errors: { url: string; status: number }[] = [];

  async function oneUser(id: number) {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Catch ALL 5xx responses, not just main navigation
    page.on('response', (resp) => {
      if (resp.status() >= 500) errors.push({ url: resp.url(), status: resp.status() });
    });

    for (const route of ['/', '/contact-us']) {
      const start = Date.now();
      const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'load' });
      const elapsed = Date.now() - start;
      times.push(elapsed);
      console.log(`User ${id} visited ${route} in ${elapsed}ms`);
    }

    await context.close();
  }

  await Promise.all(Array.from({ length: USERS }, (_, i) => oneUser(i + 1)));
  await browser.close();

 const p95Val = p95(times);
  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  const max = Math.max(...times);
  const verdict = p95Val < 3000 && errors.length === 0 ? 'PASS' : 'FAIL';

  console.log(`p95: ${p95Val}ms, avg: ${avg}ms, errors: ${errors.length}`);

  // ── Write docs/load-test-results.md ───────────────────────────
  const md = `# Load Test Results

**Date:** ${new Date().toISOString()}
**Target:** ${BASE_URL}
**Concurrent users:** ${USERS} (hard cap, controlled via Promise.all over 5 contexts)
**Journey per user:** GET / then GET /contact-us
**Total navigations sampled:** ${times.length}

| Metric | Value | Threshold | Result |
|---|---|---|---|
| p95 response time | ${p95Val} ms | < 3000 ms | ${p95Val < 3000 ? '✅' : '❌'} |
| Average response time | ${avg} ms | — | — |
| Max response time | ${max} ms | — | — |
| HTTP 5xx errors | ${errors.length} | 0 | ${errors.length === 0 ? '✅' : '❌'} |

**Verdict: ${verdict}**

${errors.length ? '## 5xx errors\n' + errors.map((e) => `- ${e.status} ${e.url}`).join('\n') : '_No server errors observed._'}
`;

  const out = path.join(__dirname, '..', '..', 'docs', 'load-test-results.md');
  fs.writeFileSync(out, md);
  console.log(`\nLoad results written to ${out}\nVerdict: ${verdict}`);


  expect(errors, 'no 5xx errors').toHaveLength(0);
  expect(p95Val, 'p95 under 3s').toBeLessThan(3000);  
});