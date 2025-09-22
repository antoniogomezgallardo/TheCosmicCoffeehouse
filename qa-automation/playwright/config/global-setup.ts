import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup that runs once before all tests
 * Handles authentication, database seeding, and environment preparation
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for E2E tests...');

  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    await page.goto(baseURL || 'http://localhost:5173');
    await page.waitForSelector('body', { timeout: 30000 });

    // Verify backend API is accessible
    console.log('🔍 Verifying backend API accessibility...');
    const apiResponse = await page.request.get('http://localhost:3001/api/products/capsules');
    if (!apiResponse.ok()) {
      throw new Error(`Backend API not accessible: ${apiResponse.status()}`);
    }

    // Create test user for authenticated tests
    console.log('👤 Creating test user...');
    const testUser = {
      email: 'e2e.test@cosmicoffeehouse.com',
      username: 'e2euser',
      password: 'TestPassword123!',
      firstName: 'E2E',
      lastName: 'Test'
    };

    const registerResponse = await page.request.post('http://localhost:3001/api/auth/register', {
      data: testUser
    });

    if (registerResponse.ok()) {
      const userData = await registerResponse.json();
      console.log('✅ Test user created successfully');

      // Store auth token for authenticated tests
      process.env.E2E_AUTH_TOKEN = userData.data.token;
      process.env.E2E_USER_ID = userData.data.user.id;
    } else {
      console.log('ℹ️ Test user may already exist, attempting login...');
      const loginResponse = await page.request.post('http://localhost:3001/api/auth/login', {
        data: { email: testUser.email, password: testUser.password }
      });

      if (loginResponse.ok()) {
        const userData = await loginResponse.json();
        process.env.E2E_AUTH_TOKEN = userData.data.token;
        process.env.E2E_USER_ID = userData.data.user.id;
        console.log('✅ Test user logged in successfully');
      }
    }

    console.log('✨ Global setup completed successfully');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;