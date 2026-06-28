import { Page, expect } from '@playwright/test';

export const ROUTES = {
  home: 'https://techdome.io/',
  about: 'https://techdome.io/about-us/',
  careers: 'https://techdome.io/careers/',
  contact: 'https://techdome.io/contact-us/',
  blog: 'https://techdome.io/blog-and-article/',
  privacy: 'https://techdome.io/privacy-policy/',
  terms: 'https://techdome.io/terms-of-use/',
}


/** Footer "Company" column links we expect to resolve without a 404. */
export const FOOTER_COMPANY_LINKS = [
  'https://techdome.io/about-us/',
  'https://techdome.io/careers/',
  'https://techdome.io/life-at-techdome/',
  'https://techdome.io/case-study/',
  'https://techdome.io/blog-and-article/',
  'https://techdome.io/newsletters/',
];


export async function expectHealthyPage(page: Page): Promise<void> {
  const body = await page.locator('body').innerText();
  expect(body.trim().length, 'page body should not be empty').toBeGreaterThan(0);
  expect(body).not.toMatch(/404|page not found/i);  
}