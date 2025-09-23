import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

When('I register with valid credentials:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  await authPage.register(data);
});

When('I login with valid credentials:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  await authPage.login(data.email, data.password);
});

When('I attempt to login with invalid credentials:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  await authPage.login(data.email, data.password);
});

When('I attempt to register with invalid data:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  await authPage.register(data);
});

When('I attempt to register with an existing email:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  await authPage.register(data);
});

When('I click the logout button', async ({ page, authPage }) => {
  await authPage.logout();
});

Then('I should be successfully registered', async ({ page }) => {
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});

Then('I should be successfully logged in', async ({ page }) => {
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  await page.locator('[data-testid="user-menu"]').click();
});

Then('I should see user-specific elements', async ({ page }) => {
  await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
});

Then('I should see an error message', async ({ page }) => {
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});

Then('I should remain on the login page', async ({ page }) => {
  expect(page.url()).toContain('/login');
});

Then('I should see validation errors', async ({ page }) => {
  await expect(page.locator('.validation-error')).toBeVisible();
});

Then('I should remain on the registration page', async ({ page }) => {
  expect(page.url()).toContain('/register');
});

Then('I should see a duplicate email error', async ({ page }) => {
  await expect(page.locator('[data-testid="duplicate-email-error"]')).toBeVisible();
});

Then('I should be logged out successfully', async ({ page }) => {
  await expect(page.locator('[data-testid="login-button"]')).toBeVisible();
});

Then('I should not see user-specific elements', async ({ page }) => {
  await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
});