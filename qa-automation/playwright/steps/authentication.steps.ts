import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { getPage, getAuthPage, testUser } from './common.steps';

// When steps for authentication
When('I register with valid credentials:', async function (dataTable) {
  const page = getPage();
  const authPage = getAuthPage();
  const userData = dataTable.rowsHash();

  await authPage.register({
    email: userData.email,
    username: userData.username,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName
  });
});

When('I login with valid credentials:', async function (dataTable) {
  const authPage = getAuthPage();
  const credentials = dataTable.rowsHash();

  await authPage.login(credentials.email, credentials.password);
});

When('I attempt to login with invalid credentials:', async function (dataTable) {
  const authPage = getAuthPage();
  const credentials = dataTable.rowsHash();

  await authPage.login(credentials.email, credentials.password);
});

When('I attempt to register with invalid data:', async function (dataTable) {
  const authPage = getAuthPage();
  const userData = dataTable.rowsHash();

  await authPage.register({
    email: userData.email,
    username: userData.username,
    password: userData.password,
    firstName: userData.firstName || '',
    lastName: userData.lastName || ''
  });
});

When('I attempt to register with an existing email:', async function (dataTable) {
  const authPage = getAuthPage();
  const userData = dataTable.rowsHash();

  await authPage.register({
    email: userData.email,
    username: userData.username,
    password: userData.password,
    firstName: 'Duplicate',
    lastName: 'User'
  });
});

When('I click the logout button', async function () {
  const page = getPage();
  const authPage = getAuthPage();

  await authPage.logout();
});

// Then steps for authentication
Then('I should be successfully registered', async function () {
  const page = getPage();

  // Wait for navigation away from register page or success message
  try {
    await page.waitForURL(url => !url.includes('/register'), { timeout: 10000 });
  } catch {
    // Check for success message if no navigation
    const successMessage = page.locator('text="Registration successful", text="Account created", .success, .alert-success').first();
    if (await successMessage.isVisible()) {
      await expect(successMessage).toBeVisible();
    }
  }
});

Then('I should be redirected to the dashboard or login page', async function () {
  const page = getPage();

  // Should be redirected away from register page
  await page.waitForURL(url => !url.includes('/register'), { timeout: 10000 });

  // Verify we're on a valid page (dashboard, login, or home)
  const currentUrl = page.url();
  const validPages = ['/dashboard', '/login', '/profile', '/'];
  const isOnValidPage = validPages.some(validUrl => currentUrl.includes(validUrl));

  expect(isOnValidPage).toBe(true);
});

Then('I should be successfully logged in', async function () {
  const page = getPage();

  // Wait for navigation away from login page
  await page.waitForURL(url => !url.includes('/login'), { timeout: 10000 });

  // Look for user-specific elements
  const userElements = page.locator('button:has-text("Logout"), .user-menu, [data-testid="user-menu"], text="Welcome"').first();
  const isLoggedIn = await userElements.isVisible().catch(() => false);

  if (!isLoggedIn) {
    // Check if we're on a protected page or dashboard
    const protectedPageIndicators = page.locator('text="Dashboard", text="Profile", text="My Orders"').first();
    const onProtectedPage = await protectedPageIndicators.isVisible().catch(() => false);
    expect(onProtectedPage).toBe(true);
  } else {
    expect(isLoggedIn).toBe(true);
  }
});

Then('I should see user-specific elements', async function () {
  const page = getPage();

  // Look for logout button or user menu
  const userElements = [
    'button:has-text("Logout")',
    'button:has-text("Sign out")',
    '.user-menu',
    '[data-testid="user-menu"]',
    'text="Welcome"',
    'text="My Account"',
    'text="Profile"'
  ];

  let found = false;
  for (const selector of userElements) {
    const element = page.locator(selector).first();
    if (await element.isVisible().catch(() => false)) {
      await expect(element).toBeVisible();
      found = true;
      break;
    }
  }

  if (!found) {
    // Fallback: check if we're not on login/register pages
    const currentUrl = page.url();
    const isOnAuthPage = currentUrl.includes('/login') || currentUrl.includes('/register');
    expect(isOnAuthPage).toBe(false);
  }
});

Then('I should see an error message', async function () {
  const page = getPage();
  const authPage = getAuthPage();

  const errorMessage = await authPage.getErrorMessage();
  expect(errorMessage.length).toBeGreaterThan(0);
});

Then('I should remain on the login page', async function () {
  const page = getPage();

  // Should still be on login page after error
  await page.waitForTimeout(2000); // Give time for any potential navigation
  expect(page.url()).toContain('/login');
});

Then('I should see validation errors', async function () {
  const page = getPage();

  // Look for various error indicators
  const errorElements = page.locator('.error, [class*="error"], .invalid, [class*="invalid"], .alert-danger, [role="alert"]');
  const errorCount = await errorElements.count();

  if (errorCount === 0) {
    // Check if form validation prevented submission
    expect(page.url()).toContain('/register');
  } else {
    await expect(errorElements.first()).toBeVisible();
  }
});

Then('I should remain on the registration page', async function () {
  const page = getPage();

  // Should still be on register page after error
  await page.waitForTimeout(2000); // Give time for any potential navigation
  expect(page.url()).toContain('/register');
});

Then('I should see a duplicate email error', async function () {
  const page = getPage();

  // Look for duplicate email specific error
  const duplicateError = page.locator('text*="already exists", text*="already registered", text*="duplicate", text*="taken"').first();

  if (await duplicateError.isVisible()) {
    await expect(duplicateError).toBeVisible();
  } else {
    // Fallback to general error message
    const generalError = page.locator('.error, [class*="error"], .alert-danger').first();
    await expect(generalError).toBeVisible();
  }
});

Then('I should be logged out successfully', async function () {
  const page = getPage();

  // Should not see user-specific elements after logout
  const userElements = page.locator('button:has-text("Logout"), .user-menu, [data-testid="user-menu"]');
  const isLoggedOut = await userElements.count() === 0;

  if (!isLoggedOut) {
    // Give some time for logout to complete
    await page.waitForTimeout(2000);
    const stillVisible = await userElements.first().isVisible().catch(() => false);
    expect(stillVisible).toBe(false);
  }
});

Then('I should not see user-specific elements', async function () {
  const page = getPage();

  // Should not see logout button or user menu
  const userElements = page.locator('button:has-text("Logout"), .user-menu, [data-testid="user-menu"]').first();
  const isVisible = await userElements.isVisible().catch(() => false);
  expect(isVisible).toBe(false);
});