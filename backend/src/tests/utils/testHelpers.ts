/**
 * Test Utilities and Helpers
 *
 * Common utilities for testing including:
 * - Database setup/teardown
 * - Mock data factories
 * - Custom assertions
 * - Test utilities
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import { PowerType, Rarity, MachineType, PowerSource, OrderStatus } from '../../types';

// =====================================
// Database Utilities
// =====================================

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connect to in-memory MongoDB for testing
 */
export async function connectTestDatabase(): Promise<void> {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}

/**
 * Disconnect and cleanup test database
 */
export async function disconnectTestDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
}

/**
 * Clear all collections in test database
 */
export async function clearTestDatabase(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

// =====================================
// Mock Data Factories
// =====================================

/**
 * Generate random email
 */
export function generateRandomEmail(): string {
  const randomString = Math.random().toString(36).substring(7);
  return `test_${randomString}@cosmicoffeehouse.com`;
}

/**
 * Generate random username
 */
export function generateRandomUsername(): string {
  const randomString = Math.random().toString(36).substring(7);
  return `user_${randomString}`;
}

/**
 * Create mock user data
 */
export function createMockUser(overrides: any = {}) {
  return {
    email: generateRandomEmail(),
    username: generateRandomUsername(),
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User',
    powerLevel: Math.floor(Math.random() * 100) + 1,
    favoriteSuperpowers: [PowerType.MENTAL, PowerType.PHYSICAL],
    isActive: true,
    isPremium: false,
    ...overrides
  };
}

/**
 * Create mock capsule data
 */
export function createMockCapsule(overrides: any = {}) {
  return {
    name: `Test Capsule ${Math.random().toString(36).substring(7)}`,
    description: 'A test superpower capsule',
    price: Math.floor(Math.random() * 100) + 10,
    powerType: PowerType.MENTAL,
    rarity: Rarity.COMMON,
    effectDuration: 30,
    stockQuantity: 100,
    ingredients: ['Cosmic Beans', 'Quantum Sugar'],
    sideEffects: ['Temporary glow'],
    compatibilityScore: 85,
    ...overrides
  };
}

/**
 * Create mock machine data
 */
export function createMockMachine(overrides: any = {}) {
  return {
    name: `Test Machine ${Math.random().toString(36).substring(7)}`,
    description: 'A test futuristic coffee machine',
    price: Math.floor(Math.random() * 1000) + 100,
    modelNumber: `TCM-${Math.floor(Math.random() * 10000)}`,
    manufacturer: 'Cosmic Corp',
    type: MachineType.QUANTUM,
    powerSource: PowerSource.QUANTUM_CELLS,
    stockQuantity: 50,
    specifications: {
      powerConsumption: '500W',
      brewTime: '30 seconds',
      capacity: '10 cups',
      maxPowerOutput: '1000 lumens'
    },
    ...overrides
  };
}

/**
 * Create mock order data
 */
export function createMockOrder(userId: string, overrides: any = {}) {
  return {
    user: userId,
    items: [
      {
        productType: 'capsule',
        productId: new mongoose.Types.ObjectId(),
        quantity: 2,
        price: 29.99
      }
    ],
    totalAmount: 59.98,
    status: OrderStatus.PENDING,
    shippingAddress: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TC',
      zipCode: '12345',
      country: 'Test Country'
    },
    ...overrides
  };
}

// =====================================
// Authentication Helpers
// =====================================

/**
 * Generate a test JWT token
 */
export function generateTestToken(payload: any = {}, expiresIn: string = '15m'): string {
  const defaultPayload = {
    id: new mongoose.Types.ObjectId().toString(),
    email: 'test@example.com',
    username: 'testuser',
    powerLevel: 50,
    ...payload
  };

  return jwt.sign(
    defaultPayload,
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn } as any
  );
}

/**
 * Generate an expired JWT token for testing
 */
export function generateExpiredToken(payload: any = {}): string {
  return generateTestToken(payload, '-1s');
}

/**
 * Decode a JWT token without verification
 */
export function decodeTestToken(token: string): any {
  return jwt.decode(token);
}

// =====================================
// Assertion Helpers
// =====================================

/**
 * Check if a value is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: any): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Check if a date is within a range
 */
export function isDateWithinRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate;
}

/**
 * Check if an object has required fields
 */
export function hasRequiredFields(obj: any, fields: string[]): boolean {
  return fields.every(field => field in obj && obj[field] !== undefined);
}

// =====================================
// Time Utilities
// =====================================

/**
 * Advance time by specified milliseconds (for testing time-dependent code)
 */
export function advanceTime(ms: number): void {
  jest.advanceTimersByTime(ms);
}

/**
 * Get current timestamp for testing
 */
export function getTestTimestamp(): number {
  return Date.now();
}

// =====================================
// Mock Functions
// =====================================

/**
 * Create a mock response object for Express
 */
export function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
}

/**
 * Create a mock request object for Express
 */
export function createMockRequest(overrides: any = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    user: null,
    ...overrides
  };
}

/**
 * Create a mock next function for Express middleware
 */
export function createMockNext() {
  return jest.fn();
}

// =====================================
// Async Utilities
// =====================================

/**
 * Wait for a specific condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

/**
 * Retry an async function multiple times
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

// =====================================
// Cleanup Utilities
// =====================================

/**
 * Setup global test environment
 */
export function setupTestEnvironment(): void {
  // Suppress console output during tests
  if (process.env.SUPPRESS_CONSOLE === 'true') {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  }
}

/**
 * Cleanup global test environment
 */
export function cleanupTestEnvironment(): void {
  // Restore all mocks
  jest.restoreAllMocks();

  // Clear all timers
  jest.clearAllTimers();

  // Use real timers
  jest.useRealTimers();
}

// =====================================
// Export Test Suites
// =====================================

/**
 * Standard test suite setup
 */
export const testSuiteSetup = {
  beforeAll: connectTestDatabase,
  afterAll: disconnectTestDatabase,
  beforeEach: clearTestDatabase,
  afterEach: jest.clearAllMocks
};

/**
 * Express middleware test suite setup
 */
export const middlewareTestSetup = {
  createRequest: createMockRequest,
  createResponse: createMockResponse,
  createNext: createMockNext
};