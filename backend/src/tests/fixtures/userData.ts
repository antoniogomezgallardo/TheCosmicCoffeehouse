/**
 * User Test Data Fixtures
 *
 * Predefined test data for consistent testing
 */

import { PowerType } from '../../types';

/**
 * Valid user data for testing
 */
export const validUsers = [
  {
    email: 'john.doe@cosmicoffeehouse.com',
    username: 'johndoe',
    password: 'SecurePassword123!',
    firstName: 'John',
    lastName: 'Doe',
    powerLevel: 75,
    favoriteSuperpowers: [PowerType.MENTAL, PowerType.TEMPORAL],
    isPremium: true,
    isActive: true
  },
  {
    email: 'jane.smith@cosmicoffeehouse.com',
    username: 'janesmith',
    password: 'AnotherSecure456!',
    firstName: 'Jane',
    lastName: 'Smith',
    powerLevel: 50,
    favoriteSuperpowers: [PowerType.PHYSICAL],
    isPremium: false,
    isActive: true
  },
  {
    email: 'admin@cosmicoffeehouse.com',
    username: 'admin',
    password: 'AdminSuper789!',
    firstName: 'Admin',
    lastName: 'User',
    powerLevel: 100,
    favoriteSuperpowers: [PowerType.MYSTICAL, PowerType.TEMPORAL, PowerType.MENTAL, PowerType.PHYSICAL],
    isPremium: true,
    isActive: true,
    role: 'admin'
  }
];

/**
 * Invalid user data for error testing
 */
export const invalidUsers = {
  missingEmail: {
    username: 'nomail',
    password: 'Password123!',
    firstName: 'No',
    lastName: 'Email'
  },
  invalidEmail: {
    email: 'not-an-email',
    username: 'badmail',
    password: 'Password123!',
    firstName: 'Bad',
    lastName: 'Email'
  },
  shortPassword: {
    email: 'short@cosmicoffeehouse.com',
    username: 'shortpass',
    password: 'short',
    firstName: 'Short',
    lastName: 'Password'
  },
  missingUsername: {
    email: 'nouser@cosmicoffeehouse.com',
    password: 'Password123!',
    firstName: 'No',
    lastName: 'Username'
  },
  invalidPowerLevel: {
    email: 'invalid@cosmicoffeehouse.com',
    username: 'invalidpower',
    password: 'Password123!',
    firstName: 'Invalid',
    lastName: 'Power',
    powerLevel: 150 // Over maximum
  }
};

/**
 * Edge case user data
 */
export const edgeCaseUsers = {
  minimumFields: {
    email: 'min@cosmicoffeehouse.com',
    username: 'min',
    password: '12345678', // Minimum length
    firstName: 'M',
    lastName: 'U'
  },
  maximumPowerLevel: {
    email: 'max@cosmicoffeehouse.com',
    username: 'maxpower',
    password: 'MaxPower123!',
    firstName: 'Max',
    lastName: 'Power',
    powerLevel: 100
  },
  specialCharacters: {
    email: 'special.chars+test@cosmicoffeehouse.com',
    username: 'special_chars_123',
    password: 'Special!@#$%^&*()123',
    firstName: "O'Brien",
    lastName: 'García-López'
  },
  longStrings: {
    email: 'verylongemailaddress@cosmicoffeehouse.com',
    username: 'verylongusername123456789012',
    password: 'VeryLongPasswordThatMeetsAllRequirements123!',
    firstName: 'Verylongfirstnamethatshouldstillwork',
    lastName: 'Verylonglastnamethatshouldstillwork'
  }
};

/**
 * User data for authentication testing
 */
export const authTestUsers = {
  loginUser: {
    email: 'login@cosmicoffeehouse.com',
    username: 'loginuser',
    password: 'LoginPass123!',
    firstName: 'Login',
    lastName: 'User',
    powerLevel: 25
  },
  refreshTokenUser: {
    email: 'refresh@cosmicoffeehouse.com',
    username: 'refreshuser',
    password: 'RefreshPass123!',
    firstName: 'Refresh',
    lastName: 'User',
    powerLevel: 30
  },
  expiredTokenUser: {
    email: 'expired@cosmicoffeehouse.com',
    username: 'expireduser',
    password: 'ExpiredPass123!',
    firstName: 'Expired',
    lastName: 'User',
    powerLevel: 10
  }
};

/**
 * Bulk user data for performance testing
 */
export function generateBulkUsers(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      email: `user${i}@cosmicoffeehouse.com`,
      username: `user${i}`,
      password: `Password${i}!`,
      firstName: `First${i}`,
      lastName: `Last${i}`,
      powerLevel: Math.floor(Math.random() * 100) + 1,
      favoriteSuperpowers: [
        Object.values(PowerType)[Math.floor(Math.random() * 4)]
      ],
      isPremium: i % 3 === 0, // Every third user is premium
      isActive: i % 10 !== 0 // 90% active users
    });
  }
  return users;
}

/**
 * User state transitions for testing
 */
export const userStateTransitions = {
  newToActive: {
    initial: {
      email: 'new@cosmicoffeehouse.com',
      username: 'newuser',
      password: 'NewUser123!',
      firstName: 'New',
      lastName: 'User',
      isActive: false
    },
    updated: {
      isActive: true,
      emailVerified: true
    }
  },
  activeToPremium: {
    initial: {
      email: 'regular@cosmicoffeehouse.com',
      username: 'regularuser',
      password: 'Regular123!',
      firstName: 'Regular',
      lastName: 'User',
      isPremium: false
    },
    updated: {
      isPremium: true,
      powerLevel: 50
    }
  },
  activeToDeactivated: {
    initial: {
      email: 'active@cosmicoffeehouse.com',
      username: 'activeuser',
      password: 'Active123!',
      firstName: 'Active',
      lastName: 'User',
      isActive: true
    },
    updated: {
      isActive: false,
      deactivatedAt: new Date()
    }
  }
};

/**
 * Password test cases
 */
export const passwordTestCases = {
  valid: [
    'SimplePass123!',
    'C0mpl3x!P@ssw0rd',
    'SuperSecure2025$',
    'MyP@ssw0rd!123'
  ],
  invalid: [
    'short', // Too short
    'nouppercase123!', // No uppercase
    'NOLOWERCASE123!', // No lowercase
    'NoNumbers!', // No numbers
    'NoSpecialChar123', // No special characters
    '        ', // Only spaces
    '' // Empty
  ]
};

export default {
  validUsers,
  invalidUsers,
  edgeCaseUsers,
  authTestUsers,
  generateBulkUsers,
  userStateTransitions,
  passwordTestCases
};