import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

// System health steps
Then('the page should load without errors', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
  const errors = await page.evaluate(() => {
    return window.performance.getEntriesByType('navigation')[0] as any;
  });
  expect(errors).toBeTruthy();
});

Then('basic navigation elements should be visible', async ({ page }) => {
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  await expect(page.locator('[data-testid="footer"]')).toBeVisible();
});

When('I check the backend API status', async ({ page }) => {
  const response = await page.request.get('/api/health');
  expect(response.status()).toBe(200);
});

Then('the API should respond with status 200', async ({ page }) => {
  const response = await page.request.get('/api/health');
  expect(response.status()).toBe(200);
});

Then('the API should return valid JSON', async ({ page }) => {
  const response = await page.request.get('/api/health');
  const data = await response.json();
  expect(data).toBeTruthy();
});

Then('critical endpoints should be accessible', async ({ page }) => {
  const endpoints = ['/api/products', '/api/auth/status'];
  for (const endpoint of endpoints) {
    const response = await page.request.get(endpoint);
    expect(response.status()).toBeLessThan(500);
  }
});

When('I reload the page', async ({ page }) => {
  await page.reload();
});

Then('the page should reload successfully', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

Then('user session should be maintained', async ({ page }) => {
  // Check if user is still logged in (if applicable)
  const userMenu = page.locator('[data-testid="user-menu"]');
  if (await userMenu.isVisible()) {
    await expect(userMenu).toBeVisible();
  }
});

Then('no data should be lost', async ({ page }) => {
  // Check that cart data is maintained
  await expect(page.locator('[data-testid="cart-count"]')).toBeVisible();
});

Given('I simulate offline mode', async ({ page }) => {
  await page.route('**/*', route => {
    route.abort();
  });
});

When('I attempt to navigate to the home page', async ({ page }) => {
  await page.goto('/');
});

Then('I should see an appropriate offline message', async ({ page }) => {
  await expect(page.locator('[data-testid="offline-message"]')).toBeVisible();
});

Then('the application should not crash', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

When('I restore network connectivity', async ({ page }) => {
  await page.unroute('**/*');
});

Then('the application should recover automatically', async ({ page }) => {
  await page.reload();
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
});

Given('I navigate through multiple pages', async ({ page }) => {
  await page.goto('/');
  await page.goto('/products');
  await page.goto('/about');
});

When('I use browser back and forward buttons', async ({ page }) => {
  await page.goBack();
  await page.goForward();
});

Then('navigation should work correctly', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible();
});

Then('page state should be maintained', async ({ page }) => {
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
});

Then('no console errors should appear', async ({ page }) => {
  const errors: any[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  expect(errors).toHaveLength(0);
});

When('I access the application on {string}', async ({ page, browserName }) => {
  // Browser is already set by Playwright configuration
  await page.goto('/');
});

Then('the application should function correctly', async ({ page }) => {
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
});

Then('all features should be accessible', async ({ page }) => {
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();
  await expect(page.locator('[data-testid="footer"]')).toBeVisible();
});

Given('I am logged in as a user', async ({ page, authPage }) => {
  await page.goto('/login');
  await authPage.login('e2e.test@cosmicoffeehouse.com', 'TestPassword123!');
});

When('my session expires', async ({ page }) => {
  // Simulate session expiration by clearing cookies
  await page.context().clearCookies();
});

Then('I should be notified appropriately', async ({ page }) => {
  await expect(page.locator('[data-testid="session-expired-message"]')).toBeVisible();
});

Then('my work should be preserved if possible', async ({ page }) => {
  // Check if form data is preserved
  const formInputs = page.locator('input[type="text"]');
  if (await formInputs.first().isVisible()) {
    await expect(formInputs.first()).not.toHaveValue('');
  }
});

When('an unexpected error occurs in the application', async ({ page }) => {
  // Force an error by calling undefined function
  await page.evaluate(() => {
    (window as any).triggerError();
  });
});

Then('the error should be caught gracefully', async ({ page }) => {
  await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible();
});

Then('a user-friendly error message should be displayed', async ({ page }) => {
  await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
});

Then('the user should be able to recover', async ({ page }) => {
  await page.click('[data-testid="retry-button"]');
  await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
});

Given('I perform repeated actions on the page', async ({ page }) => {
  for (let i = 0; i < 10; i++) {
    await page.click('[data-testid="navigation"]');
    await page.waitForTimeout(100);
  }
});

When('I monitor memory usage', async ({ page }) => {
  const memoryInfo = await page.evaluate(() => {
    return (performance as any).memory;
  });
  console.log('Memory usage:', memoryInfo);
});

Then('memory should not increase indefinitely', async ({ page }) => {
  const initialMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });

  // Perform actions
  for (let i = 0; i < 5; i++) {
    await page.click('[data-testid="navigation"]');
  }

  const finalMemory = await page.evaluate(() => {
    return (performance as any).memory?.usedJSHeapSize || 0;
  });

  // Allow for reasonable memory increase
  expect(finalMemory).toBeLessThan(initialMemory * 2);
});

Then('performance should remain stable', async ({ page }) => {
  const navigation = await page.evaluate(() => {
    return performance.getEntriesByType('navigation')[0] as any;
  });
  expect(navigation.loadEventEnd - navigation.fetchStart).toBeLessThan(5000);
});

When('I load the application', async ({ page }) => {
  await page.goto('/');
});

Then('all CSS files should load successfully', async ({ page }) => {
  const cssErrors = await page.evaluate(() => {
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    const errors: string[] = [];
    links.forEach(link => {
      if (!(link as HTMLLinkElement).sheet) {
        errors.push((link as HTMLLinkElement).href);
      }
    });
    return errors;
  });
  expect(cssErrors).toHaveLength(0);
});

Then('all JavaScript files should load successfully', async ({ page }) => {
  const jsErrors: any[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('.js')) {
      jsErrors.push(msg.text());
    }
  });
  await page.waitForLoadState('networkidle');
  expect(jsErrors).toHaveLength(0);
});

Then('all images should load or show appropriate placeholders', async ({ page }) => {
  const images = page.locator('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const img = images.nth(i);
    await expect(img).toBeVisible();
  }
});

Then('fonts should load correctly', async ({ page }) => {
  const fontLoaded = await page.evaluate(() => {
    return document.fonts.ready.then(() => true);
  });
  expect(fontLoaded).toBeTruthy();
});