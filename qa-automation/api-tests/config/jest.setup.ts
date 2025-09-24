import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables for tests
dotenv.config();

// Increase timeout for database operations
jest.setTimeout(30000);

// Global variables for MongoDB Memory Server
declare global {
  var __MONGOINSTANCE__: MongoMemoryServer | undefined;
  var __MONGO_URI__: string;
}

/**
 * Global setup that runs once before all test suites
 */
beforeAll(async () => {
  // Start MongoDB Memory Server if not already running
  if (!global.__MONGOINSTANCE__) {
    global.__MONGOINSTANCE__ = await MongoMemoryServer.create({
      instance: {
        port: 27017, // Use default MongoDB port for consistency
        dbName: 'cosmic-coffeehouse-api-tests',
      },
    });
    global.__MONGO_URI__ = global.__MONGOINSTANCE__.getUri();

    console.log(`🗄️  MongoDB Memory Server started at: ${global.__MONGO_URI__}`);
  }

  // Connect to MongoDB Memory Server
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(global.__MONGO_URI__, {
      dbName: 'cosmic-coffeehouse-api-tests',
    });
    console.log('📦 Connected to MongoDB Memory Server for API integration tests');
  }
});

/**
 * Cleanup after each test to ensure isolation
 */
afterEach(async () => {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    // Clean up all collections after each test
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  // Clear all mocks
  jest.clearAllMocks();
});

/**
 * Global teardown that runs once after all test suites
 */
afterAll(async () => {
  // Close mongoose connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB Memory Server');
  }

  // Stop MongoDB Memory Server
  if (global.__MONGOINSTANCE__) {
    await global.__MONGOINSTANCE__.stop();
    console.log('🛑 MongoDB Memory Server stopped');
    global.__MONGOINSTANCE__ = undefined;
  }
});

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection in tests:', err);
});