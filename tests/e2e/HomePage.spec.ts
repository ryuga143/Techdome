import { test, expect } from '../../utils/Pages';
import { HomePage,ContactPage } from  '../../utils/Pages';
import { ROUTES, expectHealthyPage,FOOTER_COMPANY_LINKS} from '../../utils/Links';


test.describe('E2E-Homepage & navigation', () => {
test('homepage loads with correct title, meta description, and hero ', async ({ page, home }) => {
    await home.goto();
    await expect(page).toHaveTitle("Techdome - Consultancy | IT Solutions | Digitization");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /one-stop-shop for all things tech/i);

    await expect(home.heroHeading()).toBeVisible();
  });

  test('primary nav links resolve without 404s', async ({ page }) => {
    const targets = [ROUTES.about, ROUTES.careers, ROUTES.contact];
    for (const path of targets) {
      const resp = await page.goto(path, { waitUntil: 'domcontentloaded' });
      expect(resp?.status(), `${path} should return 2xx/3xx`).toBeLessThan(400);
      await expectHealthyPage(page);
    }
  });
});


test.describe('E2E-Contact form', () => {
  // US-003a — valid submission
  test('contact form accepts a valid submission', async ({ page, contact }) => {
    await contact.goto();
    await contact.fillValid();
    await contact.submit().click();
    // We assert on an observable success signal.
    // if NO confirmation ever appears, that is a HIGH-severity bug. Log it.
    await expect(page.getByText(/thank you|received|we'?ll get back|success/i)).toBeVisible({ timeout: 15_000 });
    
  });

  // US-003b — required-field validation blocks empty submit
  test('contact form blocks submission when required fields are empty', async ({ page, contact }) => {
  await page.goto('https://techdome.io/');
  await page.getByRole('button', { name: 'Contact Us' }).click();
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByText('Please complete this required').first()).toBeVisible();
  await expect(page.locator('body')).toContainText('Please complete this required field');
  
const errorCount = await page.getByText('Please complete this required field').count();
console.log('Total error fields:', errorCount);
expect(errorCount).toBeGreaterThan(0);
  });
});

test.describe('E2E-Responsiveness', () => {
  // US-004 — mobile 375px
  test('mobile 375px — content reflows without horizontal overflow', async ({ page, home }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await home.goto();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    // Allow 1px rounding slack.
    expect(scrollWidth, 'no horizontal scroll at 375px').toBeLessThanOrEqual(clientWidth + 1);
  });

  // US-005 — tablet 768px
  test('tablet 768px — layout renders and hero is visible', async ({ page, home }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await home.goto();
    await expect(home.heroHeading()).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});

test.describe('E2E · CTAs & footer', () => {
  // US-006 — primary hero CTA routes correctly
  test('"Meet the Minds" CTA routes to the leaders section', async ({ page, home }) => {
    await home.goto();
    const MeetTheMinds = home.navLink(/meet the minds/i);
    await expect(MeetTheMinds).toBeVisible();
    await MeetTheMinds.click();
    await expect(page).toHaveURL(/about-us\/?#leaders/);
  });

  // US-007 — footer Company links are present and functional
  test('footer Company links resolve', async ({ page, home }) => {
    await home.goto();
    for (const href of FOOTER_COMPANY_LINKS) {
      const resp = await page.request.get(href); // Use page.request.get to avoid navigation and preserve test state.
      expect(resp.status(), `${href} should resolve`).toBeLessThan(400);
    }
  });
});

test.describe('E2E · Performance', () => {  
  // US-008 — record LCP (assertion is optional per the brief; we record + soft-check)
  test('records Largest Contentful Paint', async ({ page, home }) => {
    await home.goto();
    const lcp = await page.evaluate<number>(
      () =>
        new Promise((resolve) => {
          let last = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) last = entry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          // Give the background video / hero time to settle.
          setTimeout(() => resolve(last), 4000);
        })
    );
    console.log(`LCP ≈ ${Math.round(lcp)}ms`);
    expect(lcp, 'LCP should be measurable').toBeGreaterThan(0);
    // Soft budget — not a hard fail, but flag slow loads as a MEDIUM bug.
    if (lcp > 4000) console.warn(`LCP ${Math.round(lcp)}ms exceeds 4s budget`);
  });
});



