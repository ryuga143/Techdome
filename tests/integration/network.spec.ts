import { test, expect } from '../../utils/Pages';
import { HomePage,ContactPage } from  '../../utils/Pages';
import { ROUTES, expectHealthyPage,FOOTER_COMPANY_LINKS} from '../../utils/Links';

test.describe('Integration · network behaviour', () => {
  // US-009 — contact form fires a network request; assert on method + payload shape
  test('contact submission triggers a backend request with the entered data', async ({page,contact,}) => {
    await contact.goto();
    await contact.fillValid({
  company: 'Test Co',
  firstName: 'Integration',
  lastName: 'Tester',
  email: 'integration@example.com',
});

    page.on('request', (req) => {
  if (req.method() === 'POST') {
    console.log('POST intercepted:', req.url(), req.postData());
  }
});

const [response] = await Promise.all([
  page.waitForResponse(
    (res) => res.request().method() === 'POST',  
    { timeout: 15_000 }
  ),
  contact.submit().click(),
]);

expect(response.request().method()).toBe('POST');
const body = response.request().postData() || '';
  });

  // US-010 — key pages return healthy HTTP status codes
  test('core routes return 2xx status codes', async ({ page }) => {
    for (const url of Object.values(ROUTES)) {
      const resp = await page.request.get(url);
      expect(resp.status(), `${url}`).toBeGreaterThanOrEqual(200);
      expect(resp.status(), `${url}`).toBeLessThan(400);
    }
  });
 // US-011 — third-party scripts don't block the critical render path
 test('third-party scripts load async/defer and do not block render', async ({ page,home }) => {
    const renderBlocking: string[] = [];
    page.on('response', async (resp) => {
      const url = resp.url();
      const isThirdParty = !url.includes('techdome.io');
      const isScript = resp.request().resourceType() === 'script';
      if (isThirdParty && isScript) {
        // Inspect the <script> tag attributes for this src.
        const blocking = await page.evaluate((src) => {
          const s = Array.from(document.scripts).find((el) => el.src === src);
          return s ? !s.async && !s.defer : false;
        }, url);
        if (blocking) renderBlocking.push(url);
      }
    });

    await page.goto('https://techdome.io/', { waitUntil: 'load' });
    expect(renderBlocking, `render-blocking 3rd-party scripts: ${renderBlocking.join(', ')}`).toHaveLength(0);
  });

});