import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

// Common Given steps
Given('the application is running', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('body', { timeout: 30000 });
});

Given('I am on the home page', async ({ homePage }) => {
  await homePage.navigateToHome();
});

Given('I navigate to the registration page', async ({ page }) => {
  await page.goto('/register');
  await page.waitForLoadState('networkidle');
});

Given('I navigate to the login page', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
});

Given('I have a registered user account', async ({ page }) => {
  // This would typically ensure a user exists in the database
  // For now, we'll assume the test user exists
  console.log('Assuming test user exists: e2e.test@cosmicoffeehouse.com');
});

Given('I am logged in as a valid user', async ({ page, authPage }) => {
  await page.goto('/login');
  await authPage.login('e2e.test@cosmicoffeehouse.com', 'TestPassword123!');
});

Given('I browse the product catalog', async ({ page }) => {
  await page.goto('/products');
  await page.waitForLoadState('networkidle');
});

// Common When steps
When('I click on {string}', async ({ page }, text: string) => {
  await page.click(`text="${text}"`);
});

When('I navigate to {string}', async ({ page }, path: string) => {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
});

When('I wait for {int} seconds', async ({ page }, seconds: number) => {
  await page.waitForTimeout(seconds * 1000);
});

// Common Then steps
Then('I should be redirected to {string}', async ({ page }, expectedUrl: string) => {
  await page.waitForURL(url => url.toString().includes(expectedUrl), { timeout: 10000 });
  expect(page.url()).toContain(expectedUrl);
});

Then('I should see text {string}', async ({ page }, text: string) => {
  await expect(page.locator(`text="${text}"`)).toBeVisible();
});

Then('I should not see text {string}', async ({ page }, text: string) => {
  await expect(page.locator(`text="${text}"`)).not.toBeVisible();
});

Then('the page title should be {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(title);
});

Then('the page title should contain {string}', async ({ page }, title: string) => {
  await expect(page).toHaveTitle(new RegExp(title, 'i'));
});

Then('I should be redirected to login page', async ({ page }) => {
  await page.waitForURL('**/login', { timeout: 10000 });
  expect(page.url()).toContain('/login');
});

Then('I should be redirected to the dashboard or login page', async ({ page }) => {
  await page.waitForURL(url => url.toString().includes('/dashboard') || url.toString().includes('/login'), { timeout: 10000 });
  expect(page.url()).toMatch(/\/(dashboard|login)/);
});

Then('I should be redirected to the home page', async ({ page }) => {
  await page.waitForURL(url => url.pathname === '/' || url.toString().includes('/home'), { timeout: 10000 });
  expect(page.url()).toMatch(/\/(home|$)/);
});