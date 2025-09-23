import { Page, APIRequestContext } from '@playwright/test';

/**
 * Test utility functions for E2E testing
 */

/**
 * Interface for test user cleanup response
 */
interface CleanupResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    username: string;
  };
}

/**
 * Cleanup test user by email address
 *
 * @param page - Playwright page instance
 * @param email - Email address of the test user to delete
 * @returns Promise<boolean> - True if cleanup was successful
 */
export async function cleanupTestUser(page: Page, email: string): Promise<boolean> {
  try {
    console.log(`🧹 Cleaning up test user: ${email}`);

    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    const response = await page.request.delete(`${baseUrl}/api/auth/user/${encodeURIComponent(email)}`);

    if (response.ok()) {
      const result: CleanupResponse = await response.json();
      console.log(`✅ User cleanup successful: ${result.message}`);
      return true;
    } else if (response.status() === 404) {
      console.log(`ℹ️ User ${email} not found (may have been deleted already)`);
      return true; // Consider this successful since user doesn't exist
    } else if (response.status() === 403) {
      const result: CleanupResponse = await response.json();
      console.warn(`⚠️ User cleanup forbidden: ${result.message}`);
      return false;
    } else {
      const result: CleanupResponse = await response.json().catch(() => ({ success: false, message: 'Unknown error' }));
      console.error(`❌ User cleanup failed: ${result.message} (Status: ${response.status()})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error during user cleanup: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Cleanup test user using API request context
 *
 * @param request - Playwright API request context
 * @param email - Email address of the test user to delete
 * @returns Promise<boolean> - True if cleanup was successful
 */
export async function cleanupTestUserAPI(request: APIRequestContext, email: string): Promise<boolean> {
  try {
    console.log(`🧹 Cleaning up test user via API: ${email}`);

    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';

    const response = await request.delete(`${baseUrl}/api/auth/user/${encodeURIComponent(email)}`);

    if (response.ok()) {
      const result: CleanupResponse = await response.json();
      console.log(`✅ User cleanup successful: ${result.message}`);
      return true;
    } else if (response.status() === 404) {
      console.log(`ℹ️ User ${email} not found (may have been deleted already)`);
      return true;
    } else if (response.status() === 403) {
      const result: CleanupResponse = await response.json();
      console.warn(`⚠️ User cleanup forbidden: ${result.message}`);
      return false;
    } else {
      const result: CleanupResponse = await response.json().catch(() => ({ success: false, message: 'Unknown error' }));
      console.error(`❌ User cleanup failed: ${result.message} (Status: ${response.status()})`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error during user cleanup: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

/**
 * Validate if an email is a test user email based on patterns
 *
 * @param email - Email address to validate
 * @returns boolean - True if email matches test user patterns
 */
export function isTestUserEmail(email: string): boolean {
  const testEmailPatterns = [
    /^.*\.test@.*$/,           // *.test@*
    /^test\..*@.*$/,           // test.*@*
    /^bdd\.test@.*$/,          // bdd.test@*
    /^e2e\.test@.*$/,          // e2e.test@*
    /^.*@.*\.test$/,           // *@*.test
    /^.*@test\..*$/            // *@test.*
  ];

  return testEmailPatterns.some(pattern => pattern.test(email));
}

/**
 * Generate a unique test email for scenarios that need isolated users
 *
 * @param prefix - Email prefix (e.g., 'registration', 'login')
 * @param domain - Email domain (default: 'cosmicoffeehouse.com')
 * @returns string - Unique test email
 */
export function generateTestEmail(prefix: string = 'test', domain: string = 'cosmicoffeehouse.com'): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${prefix}.test.${timestamp}.${randomSuffix}@${domain}`;
}

/**
 * Sleep utility for test delays
 *
 * @param ms - Milliseconds to wait
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wait for condition with timeout
 *
 * @param condition - Function that returns boolean when condition is met
 * @param timeout - Maximum time to wait in milliseconds (default: 5000)
 * @param interval - Check interval in milliseconds (default: 100)
 * @returns Promise<boolean> - True if condition was met, false if timeout
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const result = await condition();
      if (result) {
        return true;
      }
    } catch (error) {
      // Ignore errors and continue checking
    }

    await sleep(interval);
  }

  return false;
}

/**
 * Log test step with consistent formatting
 *
 * @param step - Test step description
 * @param status - Step status ('info', 'success', 'warning', 'error')
 */
export function logTestStep(step: string, status: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  console.log(`${icons[status]} ${step}`);
}

export default {
  cleanupTestUser,
  cleanupTestUserAPI,
  isTestUserEmail,
  generateTestEmail,
  sleep,
  waitForCondition,
  logTestStep
};