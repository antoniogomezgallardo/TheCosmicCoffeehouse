/**
 * Test Configuration for API Integration Tests
 */

export const TEST_CONFIG = {
  // API endpoints
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Test timeouts (in milliseconds)
  TIMEOUTS: {
    API_RESPONSE: 5000,
    DATABASE_OPERATION: 10000,
    SETUP_TEARDOWN: 30000,
  },

  // Performance benchmarks
  PERFORMANCE: {
    API_RESPONSE_TIME_MS: 200, // Target: <200ms for API responses
    DATABASE_QUERY_TIME_MS: 100, // Target: <100ms for database queries
  },

  // Test database configuration
  DATABASE: {
    NAME: 'cosmic-coffeehouse-api-tests',
    CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // Authentication configuration for tests
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret-key-for-api-tests',
    TOKEN_EXPIRY: '1h',
    BCRYPT_ROUNDS: 10,
  },

  // Test user configurations
  TEST_USERS: {
    VALID_USER: {
      email: 'api.test@cosmicoffeehouse.com',
      username: 'apitestuser',
      password: 'APITest123!',
      firstName: 'API',
      lastName: 'Test',
      powerLevel: 50,
    },
    ADMIN_USER: {
      email: 'admin.api@cosmicoffeehouse.com',
      username: 'adminapi',
      password: 'AdminAPI123!',
      firstName: 'Admin',
      lastName: 'API',
      powerLevel: 100,
      isAdmin: true,
    },
  },

  // Test product configurations
  TEST_PRODUCTS: {
    VALID_CAPSULE: {
      name: 'API Test Cosmic Blend',
      description: 'Test capsule for API integration tests',
      price: 15.99,
      stock: 100,
      category: 'premium',
      flavorProfile: 'rich',
      intensity: 8,
      powerBoost: 25,
      imageUrl: 'https://example.com/test-capsule.jpg',
    },
  },
} as const;

/**
 * Test utilities and constants
 */
export const TEST_CONSTANTS = {
  // HTTP status codes for testing
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Common response patterns
  RESPONSE_PATTERNS: {
    SUCCESS: {
      success: true,
      data: expect.any(Object),
      message: expect.any(String),
    },
    ERROR: {
      success: false,
      message: expect.any(String),
    },
    VALIDATION_ERROR: {
      success: false,
      message: expect.stringContaining('validation'),
      errors: expect.any(Array),
    },
  },

  // Test data patterns
  VALIDATION_PATTERNS: {
    MONGODB_OBJECT_ID: /^[a-f\d]{24}$/i,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    JWT_TOKEN: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
    ISO_DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
  },
} as const;

/**
 * Environment-specific configurations
 */
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'test';

  const configs = {
    test: {
      logLevel: 'error', // Minimize logging during tests
      enableMetrics: false,
      enableRateLimit: false,
    },
    development: {
      logLevel: 'debug',
      enableMetrics: true,
      enableRateLimit: true,
    },
    ci: {
      logLevel: 'warn',
      enableMetrics: false,
      enableRateLimit: false,
      timeoutMultiplier: 2, // Increase timeouts for CI environment
    },
  };

  return configs[env as keyof typeof configs] || configs.test;
};