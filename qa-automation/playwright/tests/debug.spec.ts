import { test, expect } from '@playwright/test';

test('debug - check what elements are available on homepage', async ({ page }) => {
  // Go to the homepage
  await page.goto('http://localhost:5173');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take a screenshot to see what we're working with
  await page.screenshot({ path: 'test-results/screenshots/debug-homepage.png', fullPage: true });

  // Log the page title
  const title = await page.title();
  console.log('Page title:', title);

  // Log all headings
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
  console.log('Page headings:', headings);

  // Log all buttons
  const buttons = await page.locator('button').allTextContents();
  console.log('Buttons found:', buttons);

  // Log all links
  const links = await page.locator('a').allTextContents();
  console.log('Links found:', links);

  // Log all input fields
  const inputs = page.locator('input');
  const inputCount = await inputs.count();
  console.log('Input fields found:', inputCount);

  for (let i = 0; i < inputCount; i++) {
    const input = inputs.nth(i);
    const type = await input.getAttribute('type');
    const placeholder = await input.getAttribute('placeholder');
    const name = await input.getAttribute('name');
    console.log(`Input ${i + 1}: type=${type}, placeholder=${placeholder}, name=${name}`);
  }

  // Check if we can access the main content
  const body = page.locator('body');
  await expect(body).toBeVisible();
});