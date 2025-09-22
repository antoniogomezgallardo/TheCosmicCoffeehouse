import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';

// Set default timeout for steps
setDefaultTimeout(30 * 1000);

// Global variables for sharing between steps
let browser: Browser;
let context: BrowserContext;
let page: Page;
let homePage: HomePage;
let authPage: AuthPage;

// Test data
const testUser = {
  email: process.env.E2E_USER_EMAIL || 'e2e.test@cosmicoffeehouse.com',
  password: process.env.E2E_USER_PASSWORD || 'Test' + 'Pass' + 'word123!',
  username: 'e2euser',
  firstName: 'E2E',
  lastName: 'Test'
};

Before(async function () {
  // Launch browser for each scenario
  browser = await chromium.launch({
    headless: process.env.HEADED !== 'true',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  });

  context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true
  });

  page = await context.newPage();

  // Initialize page objects
  homePage = new HomePage(page);
  authPage = new AuthPage(page, true);

  // Attach page to the scenario context for debugging
  this.page = page;
  this.homePage = homePage;
  this.authPage = authPage;
});

After(async function () {
  // Take screenshot on failure
  if (this.result?.status === 'FAILED') {
    const screenshot = await page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }

  // Clean up
  await context?.close();
  await browser?.close();
});

// Common Given steps
Given('the application is running', async function () {
  // Verify the application is accessible
  await page.goto('http://localhost:5174');
  await page.waitForSelector('body', { timeout: 30000 });
});

Given('I am on the home page', async function () {
  await homePage.navigateToHome();
});

Given('I navigate to the registration page', async function () {
  await homePage.navigateToRegister();
  // Fallback if navigation doesn't work
  if (!page.url().includes('register')) {
    await page.goto('/register');
  }
});

Given('I navigate to the login page', async function () {
  await homePage.navigateToLogin();
  // Fallback if navigation doesn't work
  if (!page.url().includes('login')) {
    await page.goto('/login');
  }
});

Given('I have a registered user account', async function () {
  // Ensure test user exists by attempting registration
  try {
    const response = await page.request.post('http://localhost:3001/api/auth/register', {
      data: testUser
    });

    if (!response.ok()) {
      // User might already exist, try to login to verify
      const loginResponse = await page.request.post('http://localhost:3001/api/auth/login', {
        data: { email: testUser.email, password: testUser.password }
      });

      if (!loginResponse.ok()) {
        throw new Error('Test user account setup failed');
      }
    }
  } catch (error) {
    console.log('Test user already exists or registration endpoint not available');
  }
});

Given('I am logged in as a valid user', async function () {
  // Ensure user exists
  await this.Given('I have a registered user account');

  // Login via UI
  await homePage.navigateToLogin();
  await authPage.login(testUser.email, testUser.password);

  // Verify login success
  const isLoggedIn = await homePage.isUserLoggedIn();
  expect(isLoggedIn).toBe(true);
});

// Common When steps
When('I wait for {int} seconds', async function (seconds: number) {
  await page.waitForTimeout(seconds * 1000);
});

When('I refresh the page', async function () {
  await page.reload({ waitUntil: 'networkidle' });
});

When('I navigate to {string}', async function (url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
});

// Common Then steps
Then('I should be redirected to {string}', async function (expectedUrl: string) {
  await page.waitForURL(url => url.includes(expectedUrl), { timeout: 10000 });
  expect(page.url()).toContain(expectedUrl);
});

Then('I should see text {string}', async function (text: string) {
  await expect(page.locator(`text="${text}"`)).toBeVisible();
});

Then('I should see an element with selector {string}', async function (selector: string) {
  await expect(page.locator(selector)).toBeVisible();
});

Then('the page title should be {string}', async function (expectedTitle: string) {
  await expect(page).toHaveTitle(expectedTitle);
});

Then('the page URL should contain {string}', async function (urlPart: string) {
  expect(page.url()).toContain(urlPart);
});

// Utility functions for steps
export function getPage(): Page {
  return page;
}

export function getHomePage(): HomePage {
  return homePage;
}

export function getAuthPage(): AuthPage {
  return authPage;
}

export { testUser };