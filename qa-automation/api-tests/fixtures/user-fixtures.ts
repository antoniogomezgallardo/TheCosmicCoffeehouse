/**
 * User Fixtures for API Integration Tests
 */

export interface TestUser {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  powerLevel?: number;
  isAdmin?: boolean;
}

export interface TestLoginCredentials {
  email: string;
  password: string;
}

/**
 * Generate unique test user data to avoid conflicts in parallel tests
 */
export class UserFixtureFactory {
  private static counter = 0;
  private static getUniqueId(): string {
    return `${Date.now()}-${++this.counter}-${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Create a valid test user with unique data
   */
  static createValidUser(overrides: Partial<TestUser> = {}): TestUser {
    const uniqueId = this.getUniqueId();

    return {
      email: `test.user.${uniqueId}@cosmicoffeehouse.com`,
      username: `testuser${uniqueId}`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      powerLevel: 50,
      ...overrides,
    };
  }

  /**
   * Create an admin test user
   */
  static createAdminUser(overrides: Partial<TestUser> = {}): TestUser {
    const uniqueId = this.getUniqueId();

    return {
      email: `admin.${uniqueId}@cosmicoffeehouse.com`,
      username: `adminuser${uniqueId}`,
      password: 'AdminPassword123!',
      firstName: 'Admin',
      lastName: 'User',
      powerLevel: 100,
      isAdmin: true,
      ...overrides,
    };
  }

  /**
   * Create multiple test users
   */
  static createMultipleUsers(count: number, overrides: Partial<TestUser> = {}): TestUser[] {
    return Array.from({ length: count }, () => this.createValidUser(overrides));
  }

  /**
   * Create invalid user data for validation testing
   */
  static createInvalidUserData(): Array<{ data: Partial<TestUser>; expectedError: string }> {
    return [
      {
        data: { email: 'invalid-email', password: 'ValidPass123!', firstName: 'Test', lastName: 'User' },
        expectedError: 'email',
      },
      {
        data: { email: 'test@example.com', password: '123', firstName: 'Test', lastName: 'User' },
        expectedError: 'password',
      },
      {
        data: { email: 'test@example.com', password: 'ValidPass123!', firstName: '', lastName: 'User' },
        expectedError: 'firstName',
      },
      {
        data: { email: 'test@example.com', password: 'ValidPass123!', firstName: 'Test', lastName: '' },
        expectedError: 'lastName',
      },
      {
        data: { email: 'test@example.com', password: 'ValidPass123!', firstName: 'Test', lastName: 'User', username: '' },
        expectedError: 'username',
      },
    ];
  }

  /**
   * Create login credentials from user data
   */
  static createLoginCredentials(user: TestUser): TestLoginCredentials {
    return {
      email: user.email,
      password: user.password,
    };
  }

  /**
   * Create invalid login credentials for testing
   */
  static createInvalidLoginCredentials(): Array<{ credentials: TestLoginCredentials; expectedError: string }> {
    const uniqueId = this.getUniqueId();

    return [
      {
        credentials: { email: `nonexistent.${uniqueId}@example.com`, password: 'AnyPassword123!' },
        expectedError: 'user not found',
      },
      {
        credentials: { email: `test.${uniqueId}@cosmicoffeehouse.com`, password: 'WrongPassword123!' },
        expectedError: 'invalid credentials',
      },
      {
        credentials: { email: 'invalid-email-format', password: 'ValidPass123!' },
        expectedError: 'email format',
      },
      {
        credentials: { email: `test.${uniqueId}@cosmicoffeehouse.com`, password: '' },
        expectedError: 'password required',
      },
    ];
  }
}

/**
 * Predefined test users for specific scenarios
 */
export const PREDEFINED_TEST_USERS = {
  BASIC_USER: {
    email: 'basic.user@cosmicoffeehouse.com',
    username: 'basicuser',
    password: 'BasicUser123!',
    firstName: 'Basic',
    lastName: 'User',
    powerLevel: 25,
  },

  PREMIUM_USER: {
    email: 'premium.user@cosmicoffeehouse.com',
    username: 'premiumuser',
    password: 'PremiumUser123!',
    firstName: 'Premium',
    lastName: 'User',
    powerLevel: 75,
  },

  ADMIN_USER: {
    email: 'admin.user@cosmicoffeehouse.com',
    username: 'adminuser',
    password: 'AdminUser123!',
    firstName: 'Admin',
    lastName: 'User',
    powerLevel: 100,
    isAdmin: true,
  },
} as const;