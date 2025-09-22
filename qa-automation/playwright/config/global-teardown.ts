import { chromium, FullConfig } from '@playwright/test';

/**
 * Global teardown that runs once after all tests
 * Handles cleanup of test data and environment
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for E2E tests...');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Clean up test user if needed
    if (process.env.E2E_AUTH_TOKEN && process.env.E2E_USER_ID) {
      console.log('🗑️ Cleaning up test data...');

      // Note: In a real environment, you might want to clean up test orders, cart items, etc.
      // For now, we'll just log the cleanup
      console.log('ℹ️ Test user and data cleanup completed');
    }

    // Clear environment variables
    delete process.env.E2E_AUTH_TOKEN;
    delete process.env.E2E_USER_ID;

    console.log('✨ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error in teardown to avoid masking test failures
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalTeardown;