/* eslint-env node */
/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory for tests
  roots: ['<rootDir>/src'],

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],

  // Transform TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        // Override tsconfig for tests to allow commonjs imports
        esModuleInterop: true,
        allowJs: true
      }
    }]
  },

  // Module name mapping for path aliases if needed
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  },

  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/types/**',
    '!src/scripts/**',
    '!src/server.ts' // Exclude main server file
  ],

  // Coverage thresholds - set to realistic levels based on current implementation
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 60,
      lines: 65,
      statements: 65
    }
  },

  // Coverage report formats
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // Directory for coverage reports
  coverageDirectory: 'coverage',

  // Clear mocks automatically between tests
  clearMocks: true,

  // Reset mocks automatically between tests
  resetMocks: true,

  // Restore mocks automatically between tests
  restoreMocks: true,

  // Setup files after environment is set up
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // Timeout for tests (10 seconds)
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Max worker threads for parallel testing
  maxWorkers: '50%',

  // Force exit after test run completes
  forceExit: true,

  // Detect open handles (useful for debugging)
  detectOpenHandles: false,

  // Error on deprecated APIs
  errorOnDeprecated: true,

  // Watch mode plugins
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};