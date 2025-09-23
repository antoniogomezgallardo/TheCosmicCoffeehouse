import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

// E-commerce workflow steps
When('I add a cosmic capsule to my cart:', async ({ page }, table: any) => {
  const data = table.rowsHash();
  await page.click(`[data-testid="product-${data.product}"]`);
  await page.fill('[data-testid="quantity-input"]', data.quantity);
  await page.click('[data-testid="add-to-cart-button"]');
});

When('I proceed to checkout as a guest', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await page.click('[data-testid="checkout-button"]');
  await page.click('[data-testid="guest-checkout"]');
});

When('I provide shipping information:', async ({ page }, table: any) => {
  const data = table.rowsHash();
  await page.fill('[data-testid="first-name"]', data.firstName);
  await page.fill('[data-testid="last-name"]', data.lastName);
  await page.fill('[data-testid="address"]', data.address);
  await page.fill('[data-testid="city"]', data.city);
  await page.fill('[data-testid="zip-code"]', data.zipCode);
  await page.fill('[data-testid="country"]', data.country);
});

Then('my order should be successfully placed', async ({ page }) => {
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
});

Then('I should receive an order confirmation', async ({ page }) => {
  await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
});

When('I add multiple products to my cart:', async ({ page }, table: any) => {
  const rows = table.hashes();
  for (const row of rows) {
    await page.click(`[data-testid="product-${row.product}"]`);
    await page.fill('[data-testid="quantity-input"]', row.quantity);
    await page.click('[data-testid="add-to-cart-button"]');
  }
});

When('I update my cart quantities:', async ({ page }, table: any) => {
  const rows = table.hashes();
  await page.click('[data-testid="cart-button"]');
  for (const row of rows) {
    await page.fill(`[data-testid="cart-quantity-${row.product}"]`, row.newQuantity);
  }
});

When('I proceed to checkout as an authenticated user', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await page.click('[data-testid="checkout-button"]');
});

Then('I should see the order in my order history', async ({ page }) => {
  await page.click('[data-testid="user-menu"]');
  await page.click('[data-testid="order-history"]');
  await expect(page.locator('[data-testid="recent-order"]')).toBeVisible();
});

Given('I add a product to my cart as a guest', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-item"]:first-child');
  await page.click('[data-testid="add-to-cart-button"]');
});

When('I refresh the page', async ({ page }) => {
  await page.reload();
});

Then('my cart should still contain the product', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
});

When('I navigate away and return', async ({ page }) => {
  await page.goto('/');
  await page.goto('/products');
});

Given('I navigate to the products page', async ({ page }) => {
  await page.goto('/products');
});

When('I browse different product categories:', async ({ page }, table: any) => {
  const rows = table.hashes();
  for (const row of rows) {
    await page.click(`[data-testid="category-${row.category}"]`);
    await page.waitForLoadState('networkidle');
  }
});

Then('I should see relevant products for each category', async ({ page }) => {
  await expect(page.locator('[data-testid="product-item"]')).toHaveCount({ min: 1 });
});

Then('product details should be displayed correctly', async ({ page }) => {
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
  await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
});

Given('I have products in my cart', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-item"]:first-child');
  await page.click('[data-testid="add-to-cart-button"]');
});

When('I update product quantities', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await page.fill('[data-testid="quantity-input"]', '3');
});

When('I remove a product from my cart', async ({ page }) => {
  await page.click('[data-testid="remove-item-button"]');
});

Then('the cart total should be recalculated correctly', async ({ page }) => {
  await expect(page.locator('[data-testid="cart-total"]')).not.toHaveText('$0.00');
});

Then('removed products should not appear in the cart', async ({ page }) => {
  await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
});

Given('I have an empty cart', async ({ page }) => {
  // Cart is empty by default
});

When('I try to proceed to checkout', async ({ page }) => {
  await page.click('[data-testid="cart-button"]');
  await page.click('[data-testid="checkout-button"]');
});

Then('I should see an appropriate message', async ({ page }) => {
  await expect(page.locator('[data-testid="empty-cart-message"]')).toBeVisible();
});

Then('I should not be able to complete checkout', async ({ page }) => {
  await expect(page.locator('[data-testid="checkout-button"]')).toBeDisabled();
});

When('I load the product catalog', async ({ page }) => {
  await page.goto('/products');
});

Then('products should load within 3 seconds', async ({ page }) => {
  const startTime = Date.now();
  await expect(page.locator('[data-testid="product-item"]')).toBeVisible();
  const endTime = Date.now();
  expect(endTime - startTime).toBeLessThan(3000);
});

Then('images should load progressively', async ({ page }) => {
  await expect(page.locator('[data-testid="product-image"]')).toBeVisible();
});

Then('I should see featured products displayed', async ({ page }) => {
  await expect(page.locator('[data-testid="featured-products"]')).toBeVisible();
});

Then('featured products should be clickable', async ({ page }) => {
  await expect(page.locator('[data-testid="featured-product"]')).toBeVisible();
});

When('I click on a featured product', async ({ page }) => {
  await page.click('[data-testid="featured-product"]:first-child');
});

Then('I should be taken to the product details page', async ({ page }) => {
  await expect(page.locator('[data-testid="product-details"]')).toBeVisible();
});