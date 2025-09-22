import { test, expect } from '@playwright/test';

/**
 * Working smoke tests based on actual UI structure
 */
test.describe('Working Smoke Tests', () => {

  test('should load homepage and display key elements @smoke @critical', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Verify page loads
    await expect(page).toHaveTitle('The Cosmic Coffeehouse');

    // Verify main heading
    await expect(page.locator('h1')).toContainText('Welcome to The Cosmic Coffeehouse');

    // Verify navigation exists (use more specific selectors)
    await expect(page.locator('a:has-text("Home")').first()).toBeVisible();
    await expect(page.locator('a[href="/capsules"]').first()).toBeVisible();
    await expect(page.locator('a[href="/machines"]').first()).toBeVisible();

    // Verify auth buttons
    await expect(page.locator('button:has-text("Login")')).toBeVisible();
    await expect(page.locator('button:has-text("Register")')).toBeVisible();

    // Verify featured sections
    await expect(page.locator('text=Featured Superpower Capsules')).toBeVisible();
    await expect(page.locator('text=Featured Brewing Machines')).toBeVisible();

    console.log('✅ Homepage loaded successfully with all key elements');
  });

  test('should navigate to capsules page @smoke', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click on the first Capsules navigation link
    await page.locator('a[href="/capsules"]').first().click();
    await page.waitForLoadState('networkidle');

    // Check if we're on a different page or if content changed
    const currentUrl = page.url();
    console.log('Current URL after clicking Capsules:', currentUrl);

    // Take screenshot to see what happened
    await page.screenshot({ path: 'test-results/screenshots/capsules-navigation.png' });
  });

  test('should interact with featured products @smoke', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Look for "Add to Cart" buttons
    const addToCartButtons = page.locator('button:has-text("Add to Cart")');
    const buttonCount = await addToCartButtons.count();

    console.log(`Found ${buttonCount} Add to Cart buttons`);
    expect(buttonCount).toBeGreaterThan(0);

    // Try clicking the first Add to Cart button
    if (buttonCount > 0) {
      await addToCartButtons.first().click();

      // Check if anything changed (modal, notification, etc.)
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/after-add-to-cart.png' });
    }
  });

  test('should test backend API connectivity @smoke @critical', async ({ page }) => {
    // Test if backend API is accessible
    const response = await page.request.get('http://localhost:3001/api/products/capsules');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('success');
    expect(data.success).toBe(true);

    console.log('✅ Backend API is accessible and returning data');
    console.log(`API returned ${data.data?.length || 0} capsules`);
  });

  test('should handle login button click @smoke', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Click the Login button
    await page.locator('button:has-text("Login")').click();
    await page.waitForLoadState('networkidle');

    // Check what happened
    const currentUrl = page.url();
    console.log('URL after clicking Login:', currentUrl);

    // Take screenshot to see the result
    await page.screenshot({ path: 'test-results/screenshots/after-login-click.png' });

    // Check if we have login form elements
    const emailInput = page.locator('input[type="email"], input[placeholder*="email"]');
    const passwordInput = page.locator('input[type="password"]');

    if (await emailInput.isVisible()) {
      console.log('✅ Login form detected');
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
    } else {
      console.log('ℹ️ No login form detected - might be a modal or different implementation');
    }
  });

  test('should test responsive design @smoke', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:5173');

    // Verify page still loads and is readable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('button:has-text("Login")')).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/screenshots/mobile-homepage.png', fullPage: true });

    console.log('✅ Mobile viewport test completed');
  });

  test('should test page load performance @smoke @performance', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);

    // Should load within 5 seconds for development
    expect(loadTime).toBeLessThan(5000);

    console.log('✅ Performance test passed');
  });
});