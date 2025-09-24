/**
 * Pact Consumer Configuration
 *
 * This configuration defines how the frontend (consumer) creates contracts
 * for the backend (provider) to verify.
 */

import path from 'path';
import { LogLevel } from '@pact-foundation/pact';

export const PACT_CONSUMER_CONFIG = {
  // Consumer details
  consumer: 'CosmicCoffeehouse-Frontend',
  provider: 'CosmicCoffeehouse-Backend',

  // Pact file configuration
  dir: path.resolve(process.cwd(), 'pacts'),

  // Logging configuration
  logLevel: (process.env.PACT_LOG_LEVEL as LogLevel) || 'info',

  // Mock server configuration
  port: 9876,
  host: '127.0.0.1',

  // Specification version
  spec: 2,

  // CORS configuration for browser testing
  cors: true,

  // Pact file write mode
  pactfileWriteMode: 'update' as const,
};

// API endpoints configuration matching our backend
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    VERIFY_TOKEN: '/api/auth/verify',
  },
  PRODUCTS: {
    GET_CAPSULES: '/api/products/capsules',
    GET_MACHINES: '/api/products/machines',
    GET_CAPSULE_BY_ID: '/api/products/capsules/:id',
    GET_MACHINE_BY_ID: '/api/products/machines/:id',
  },
  CART: {
    GET_CART: '/api/cart',
    ADD_TO_CART: '/api/cart/add',
    UPDATE_ITEM: '/api/cart/update/:itemId',
    REMOVE_ITEM: '/api/cart/remove/:itemId',
    CLEAR_CART: '/api/cart/clear',
  },
  ORDERS: {
    CREATE_ORDER: '/api/orders',
    GET_ORDERS: '/api/orders',
    GET_ORDER_BY_ID: '/api/orders/:id',
    UPDATE_ORDER_STATUS: '/api/orders/:id/status',
  },
};

// Response matchers for flexible contract matching
export const MATCHERS = {
  // Common matchers
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
  isoDateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,

  // Business-specific matchers
  mongoId: /^[0-9a-fA-F]{24}$/,
  powerLevel: (value: number) => value >= 0 && value <= 100,
  price: (value: number) => value >= 0,
  quantity: (value: number) => value > 0 && Number.isInteger(value),
};

// Provider states for test scenarios
export const PROVIDER_STATES = {
  // User states
  USER_EXISTS: 'a user with valid credentials exists',
  USER_DOES_NOT_EXIST: 'user does not exist',
  USER_LOGGED_IN: 'user is logged in with valid token',
  USER_LOGGED_OUT: 'user is logged out',

  // Product states
  PRODUCTS_EXIST: 'products exist in the database',
  PRODUCT_WITH_ID_EXISTS: 'product with specific ID exists',
  PRODUCT_OUT_OF_STOCK: 'product is out of stock',

  // Cart states
  CART_EMPTY: 'user has an empty cart',
  CART_WITH_ITEMS: 'user has items in cart',

  // Order states
  ORDERS_EXIST: 'user has previous orders',
  ORDER_WITH_ID_EXISTS: 'order with specific ID exists',
};

// Error response templates for contract testing
export const ERROR_RESPONSES = {
  UNAUTHORIZED: {
    status: 401,
    body: {
      success: false,
      message: 'Unauthorized',
      error: 'UNAUTHORIZED',
    },
  },
  NOT_FOUND: {
    status: 404,
    body: {
      success: false,
      message: 'Resource not found',
      error: 'NOT_FOUND',
    },
  },
  VALIDATION_ERROR: {
    status: 400,
    body: {
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      errors: expect.any(Array),
    },
  },
  SERVER_ERROR: {
    status: 500,
    body: {
      success: false,
      message: 'Internal server error',
      error: 'SERVER_ERROR',
    },
  },
};

// Test data factories for consistent contract testing
export const TEST_DATA = {
  // Valid user for registration
  validUser: {
    email: 'test@cosmic.com',
    username: 'cosmicuser',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
  },

  // Valid login credentials
  validCredentials: {
    email: 'test@cosmic.com',
    password: 'SecurePass123!',
  },

  // Sample product (capsule)
  sampleCapsule: {
    id: '507f1f77bcf86cd799439011',
    name: 'Quantum Roast',
    description: 'A powerful blend for morning energy',
    price: 12.99,
    intensity: 8,
    flavorProfile: 'Bold and Rich',
    powerBoost: 75,
    stock: 100,
    imageUrl: 'https://cosmic.com/images/quantum-roast.jpg',
    isActive: true,
  },

  // Sample cart item
  sampleCartItem: {
    productId: '507f1f77bcf86cd799439011',
    quantity: 2,
  },
};

// Timeout configurations
export const TIMEOUTS = {
  DEFAULT: 10000, // 10 seconds
  PROVIDER_VERIFICATION: 30000, // 30 seconds
  SERVER_START: 5000, // 5 seconds
};

export default PACT_CONSUMER_CONFIG;