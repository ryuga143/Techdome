import { test, expect, chromium } from '@playwright/test';



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

  const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
  console.log(`p95: ${p95(times)}ms, avg: ${avg}ms, errors: ${errors.length}`);

  expect(errors, 'no 5xx errors').toHaveLength(0);
  expect(p95(times), 'p95 under 3s').toBeLessThan(3000);
});