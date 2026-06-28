import { test, expect } from '../../utils/Pages';

test.describe('Security · headers', () => {
  // US-012 — audit important response headers on the homepage
  test('homepage response includes baseline security headers', async ({ page }) => {  // bug found
    const resp = await page.request.get('https://techdome.io/');
    const headers = resp.headers();

    expect(headers['strict-transport-security'], 'HSTS header').toBeTruthy();

    const clickjackingProtected =
      !!headers['x-frame-options'] ||
      /frame-ancestors/i.test(headers['content-security-policy'] || '');
    expect(clickjackingProtected, 'clickjacking protection (XFO or CSP frame-ancestors)').toBeTruthy();
  });
});


test.describe('Security · injection & data exposure', () => {
  // US-013 — the contact form must sanitise/reject script injection
 test('contact form does not execute injected script', async ({ page, contact }) => {
    let alertFired = false;
    page.on('dialog', async (d) => {
      alertFired = true;
      await d.dismiss();
    });

    await contact.goto();
    await contact.fillValid({ firstName: '<script>alert(1)</script>' });
    await contact.submit().click();

    await expect(page.locator('script:has-text("alert(1)")')).toHaveCount(0);
    expect(alertFired, 'injected <script> must NOT execute').toBe(false);
  });

  // US-014 — no obvious secrets leaked in page source
  test ('homepage source does not leak API keys or tokens', async ({ page }) => {
    const resp = await page.request.get('https://techdome.io/');
    const html = await resp.text();
    const secretPatterns = [
      /AKIA[0-9A-Z]{16}/, // AWS access key id
      /sk_live_[0-9a-zA-Z]{24,}/, // Stripe live secret
      /AIza[0-9A-Za-z\-_]{35}/, // Google API key
      /-----BEGIN (RSA|PRIVATE) KEY-----/,
    ];
    for (const re of secretPatterns) {
      expect(html, `source should not contain ${re}`).not.toMatch(re);
    }
  });
});
