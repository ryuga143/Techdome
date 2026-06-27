import { test as base, Page, Locator, expect } from '@playwright/test';

export class HomePage {

  constructor(private page: Page) {
    
  }

  async goto() : Promise<void> {
    await this.page.goto("https://techdome.io/", { waitUntil: 'domcontentloaded' });
  }

  heroHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Trusted Partner in Digital Excellence' });
  }
}

export class ContactPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://techdome.io/contact-us/", { waitUntil: 'domcontentloaded' });
  }
}

type Fixtures = { 
  home: HomePage;
  contact: ContactPage 
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  contact: async ({ page }, use) => {
    await use(new ContactPage(page));
  },
});

export { expect };

