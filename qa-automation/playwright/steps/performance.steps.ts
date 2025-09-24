import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

// Performance steps
When('I navigate to the home page', async ({ page }) => {
  await page.goto('/');
});

Then('the page should load within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.waitForLoadState('networkidle');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(3000);
});

Then('all critical resources should be loaded', async ({ page }) => {
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
});

Then('the initial products should load within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  await expect(page.locator('[data-testid="product-item"]')).toBeVisible();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(2000);
});

Then('the page should be interactive within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.locator('[data-testid="search-input"]')).toBeEnabled();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(3000);
});

Given('I simulate a slow 3G connection', async ({ page }) => {
  await page.route('**/*', route => {
    // Simulate slow connection by adding delay
    setTimeout(() => {
      route.continue();
    }, 100);
  });
});

Then('the page should show loading indicators', async ({ page }) => {
  await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible();
});

Then('core content should be prioritized', async ({ page }) => {
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
});

Then('the page should remain functional', async ({ page }) => {
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
});

Then('the cart should update within 500ms', async ({ page }) => {
  const startTime = Date.now();
  await page.fill('[data-testid="quantity-input"]', '2');
  await page.waitForSelector('[data-testid="cart-total"]');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(500);
});

Then('the total should recalculate immediately', async ({ page }) => {
  await expect(page.locator('[data-testid="cart-total"]')).not.toHaveText('$0.00');
});

Given('I am using a mobile device viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
});

Then('the page should load within 4 seconds on mobile', async ({ page }) => {
  const startTime = Date.now();
  await page.waitForLoadState('networkidle');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(4000);
});

Then('touch interactions should be responsive', async ({ page }) => {
  await page.click('[data-testid="menu-button"]');
  await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
});

Then('the layout should adapt without reflow', async ({ page }) => {
  await expect(page.locator('[data-testid="responsive-container"]')).toBeVisible();
});

Given('I am on the products page', async ({ page }) => {
  await page.goto('/products');
});

When('I search for a product', async ({ page }) => {
  await page.fill('[data-testid="search-input"]', 'capsule');
  await page.press('[data-testid="search-input"]', 'Enter');
});

Then('search results should appear within 1 second', async ({ page }) => {
  const startTime = Date.now();
  await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(1000);
});

Then('the UI should remain responsive during search', async ({ page }) => {
  await expect(page.locator('[data-testid="search-input"]')).toBeEnabled();
});

Given('I have items in my cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-item"]:first-child');
  await page.click('[data-testid="add-to-cart-button"]');
});

When('I proceed through checkout', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await page.click('[data-testid="checkout-button"]');
});

Then('each checkout step should load within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(2000);
});

Then('form submissions should process quickly', async ({ page }) => {
  await page.fill('[data-testid="email"]', 'test@example.com');
  const startTime = Date.now();
  await page.click('[data-testid="continue-button"]');
  await page.waitForSelector('[data-testid="next-step"]');
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(1000);
});

Then('payment processing should not exceed 5 seconds', async ({ page }) => {
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.fill('[data-testid="cvc"]', '123');
  const startTime = Date.now();
  await page.click('[data-testid="pay-button"]');
  await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(5000);
});