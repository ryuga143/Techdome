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
  
  navLink(name: RegExp): Locator {
    return this.page.getByRole('link', { name });
  }

  /** The footer newsletter signup (email + submit). */
  newsletterEmail(): Locator {
    return this.page.getByPlaceholder(/enter your email/i);
  }
}


export class ContactPage {

  
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("https://techdome.io/contact-us/", { waitUntil: 'domcontentloaded' });
  }
  
  // Fields. getByLabel works if the site wired <label for>; if these turn out
  // flaky in --ui, switch to getByPlaceholder — and LOG why you changed it.
  company = () => this.page.getByLabel(/company/i);
  firstName = () => this.page.getByLabel(/first name/i);
  lastName = () => this.page.getByLabel(/last name/i);
  email = () => this.page.getByRole('textbox', { name: 'Email *'});
  phone = () => this.page.getByLabel(/phone/i);
  message = () => this.page.getByLabel(/message/i);
  submit = () => this.page.getByRole('button', { name: /send message/i });

  async fillValid(overrides: Partial<Record<string, string>> = {}) {
    const data = {
      company: 'QA Test Co',
      firstName: 'Test',
      lastName: 'Candidate',
      email: 'candidate@example.com',
      phone: '9999919999',
      message: 'Automated E2E test submission — please ignore.',
      ...overrides,
    };
    await this.company().fill(data.company);
    await this.firstName().fill(data.firstName);
    await this.lastName().fill(data.lastName);
    await this.email().fill(data.email);
    await this.phone().fill(data.phone);
    await this.message().fill(data.message);
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

