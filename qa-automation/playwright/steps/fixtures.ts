import { test as base } from 'playwright-bdd';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';

// Extend Playwright test with our page objects
export const test = base.extend<{
  homePage: HomePage;
  authPage: AuthPage;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page, true));
  },
});

export default test;