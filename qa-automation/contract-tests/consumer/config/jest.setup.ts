/**
 * Jest setup for consumer contract tests
 * Configures test environment and global settings
 */

// Set test environment variables
process.env.NODE_ENV = 'test';

// Increase test timeout for contract tests
jest.setTimeout(30000);

// Global test setup
beforeAll(() => {
  console.log('🎭 Starting contract tests setup');
});

afterAll(() => {
  console.log('✅ Contract tests completed');
});

export {};