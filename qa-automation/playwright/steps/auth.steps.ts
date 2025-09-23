import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';
import { cleanupTestUser, logTestStep } from '../utils/test-utils';

const { Given, When, Then } = createBdd(test);

// Store user data for cleanup
let registeredUserEmail: string | null = null;

When('I register with valid credentials:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();
  registeredUserEmail = data.email; // Store email for potential cleanup
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
  await expect(page.locator('.validation-error').first()).toBeVisible();
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

Then('the test user should be cleaned up', async ({ page }) => {
  if (registeredUserEmail) {
    logTestStep(` Cleaning up test user: ${registeredUserEmail}`, 'info');
    const cleanupSuccess = await cleanupTestUser(page, registeredUserEmail);

    if (cleanupSuccess) {
      logTestStep(`Successfully cleaned up user: ${registeredUserEmail}`, 'success');
      registeredUserEmail = null; // Reset the stored email
    } else {
      logTestStep(`Failed to clean up user: ${registeredUserEmail}`, 'warning');
      // Don't fail the test if cleanup fails - just log the warning
    }
  } else {
    logTestStep('No registered user email found for cleanup', 'warning');
  }
});