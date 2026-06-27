import { test, expect } from '../../utils/Pages';
import { HomePage,ContactPage } from  '../../utils/Pages';

test('homepage loads with correct title, meta description, and hero ', async ({ page, home }) => {
    await home.goto();
    await expect(page).toHaveTitle("Techdome - Consultancy | IT Solutions | Digitization");

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /one-stop-shop for all things tech/i);

    await expect(home.heroHeading()).toBeVisible();
  });