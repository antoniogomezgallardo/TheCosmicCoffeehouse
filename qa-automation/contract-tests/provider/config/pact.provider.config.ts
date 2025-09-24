/**
 * Pact Provider Configuration
 *
 * This configuration defines how the backend (provider) verifies contracts
 * created by the frontend (consumer).
 */

import { LogLevel } from '@pact-foundation/pact';

export const PACT_PROVIDER_CONFIG = {
  // Provider details
  provider: 'CosmicCoffeehouse-Backend',

  // Provider base URL (where the backend runs)
  providerBaseUrl: process.env.PROVIDER_BASE_URL || 'http://localhost:3001',

  // Pact files to verify (can be URLs or file paths)
  pactUrls: [
    '../pacts/CosmicCoffeehouse-Frontend-CosmicCoffeehouse-Backend.json',
  ],

  // Pact broker configuration (if using remote pact broker)
  pactBrokerUrl: process.env.PACT_BROKER_URL,
  pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
  pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,

  // Logging
  logLevel: (process.env.PACT_LOG_LEVEL as LogLevel) || 'info',

  // Publishing verification results
  publishVerificationResult: process.env.NODE_ENV === 'ci' || false,
  providerVersion: process.env.PROVIDER_VERSION || '1.0.0',

  // Request filtering
  requestFilter: (_req: any, _res: any, next: any) => {
    // Add any request modifications needed for verification
    // For example, adding test headers or modifying auth
    next();
  },

  // Custom headers for all verification requests
  customProviderHeaders: [
    'X-Test-Mode: contract-verification',
  ],

  // Timeout settings
  timeout: 30000, // 30 seconds
};

// Database configuration for provider state setup
export const PROVIDER_DATABASE_CONFIG = {
  // Test database URL (should be separate from development)
  mongoUrl: process.env.TEST_MONGO_URL || 'mongodb://localhost:27017/cosmic-coffeehouse-contracts',

  // Database cleanup settings
  dropDatabase: true, // Clean database before each state setup
  seedData: true,     // Seed with test data when needed
};

// State handlers for different test scenarios
export const PROVIDER_STATE_HANDLERS = {
  // User-related states
  'a user with valid credentials exists': async () => {
    // Create a user with known credentials for login tests
    return {
      description: 'User created for login testing',
      setup: async () => {
        const User = require('../../../backend/src/models/User');
        await User.deleteMany({}); // Clean existing users

        const user = new User({
          email: 'test@cosmic.com',
          username: 'cosmicuser',
          password: 'SecurePass123!', // Will be hashed by the model
          firstName: 'John',
          lastName: 'Doe',
          isActive: true,
        });

        await user.save();
        return { userId: user._id.toString() };
      },
    };
  },

  'user does not exist': async () => {
    // Ensure no users exist for registration tests
    return {
      description: 'Clean user database for registration',
      setup: async () => {
        const User = require('../../../backend/src/models/User');
        await User.deleteMany({});
        return { usersCleared: true };
      },
    };
  },

  'user is logged in with valid token': async () => {
    // Create a user and generate a valid JWT token
    return {
      description: 'User with valid JWT token',
      setup: async () => {
        const User = require('../../../backend/src/models/User');
        const jwt = require('jsonwebtoken');

        await User.deleteMany({});

        const user = new User({
          email: 'test@cosmic.com',
          username: 'cosmicuser',
          firstName: 'John',
          lastName: 'Doe',
          isActive: true,
        });

        await user.save();

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET || 'test-secret',
          { expiresIn: '1h' }
        );

        return { userId: user._id.toString(), token };
      },
    };
  },

  'user is logged out': async () => {
    // Ensure no valid authentication state
    return {
      description: 'No authenticated user',
      setup: async () => {
        // No specific setup needed - just ensure clean state
        return { authCleared: true };
      },
    };
  },

  // Product-related states
  'products exist in the database': async () => {
    // Seed database with sample products
    return {
      description: 'Database seeded with products',
      setup: async () => {
        const Capsule = require('../../../backend/src/models/Capsule');
        const Machine = require('../../../backend/src/models/Machine');

        // Clear existing products
        await Capsule.deleteMany({});
        await Machine.deleteMany({});

        // Create sample capsules
        const capsules = [
          {
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
          {
            name: 'Supernova Espresso',
            description: 'Intense espresso for energy boost',
            price: 14.99,
            intensity: 9,
            flavorProfile: 'Intense',
            powerBoost: 85,
            stock: 50,
            imageUrl: 'https://cosmic.com/images/supernova-espresso.jpg',
            isActive: true,
          },
        ];

        const createdCapsules = await Capsule.insertMany(capsules);

        // Create sample machines
        const machines = [
          {
            name: 'QuantumBrew X1',
            description: 'Professional quantum brewing system',
            price: 899.99,
            model: 'QBX1-2024',
            features: ['Quantum extraction', 'Auto-cleaning', 'Smart brewing'],
            specifications: {
              dimensions: '30x40x35 cm',
              weight: '8.5 kg',
              power: '1500W',
              capacity: '2.5L water tank',
            },
            stock: 15,
            imageUrl: 'https://cosmic.com/images/quantum-brew-x1.jpg',
            isActive: true,
            warranty: '2 years',
          },
        ];

        const createdMachines = await Machine.insertMany(machines);

        return {
          capsulesCount: createdCapsules.length,
          machinesCount: createdMachines.length,
        };
      },
    };
  },

  'product with specific ID exists': async () => {
    // Create a specific product with known ID for detail tests
    return {
      description: 'Specific product exists',
      setup: async () => {
        const Capsule = require('../../../backend/src/models/Capsule');
        const mongoose = require('mongoose');

        await Capsule.deleteMany({});

        const specificId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

        const capsule = new Capsule({
          _id: specificId,
          name: 'Quantum Roast',
          description: 'A powerful blend for morning energy',
          price: 12.99,
          intensity: 8,
          flavorProfile: 'Bold and Rich',
          powerBoost: 75,
          stock: 100,
          imageUrl: 'https://cosmic.com/images/quantum-roast.jpg',
          isActive: true,
          ingredients: ['Arabica beans', 'Natural flavors'],
          brewingTips: 'Best at 95°C',
        });

        await capsule.save();

        return { productId: specificId.toString() };
      },
    };
  },

  'product is out of stock': async () => {
    // Create a product that is out of stock
    return {
      description: 'Product with zero stock',
      setup: async () => {
        const Capsule = require('../../../backend/src/models/Capsule');
        const mongoose = require('mongoose');

        await Capsule.deleteMany({});

        const specificId = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011');

        const capsule = new Capsule({
          _id: specificId,
          name: 'Limited Edition Cosmic Blend',
          description: 'Rare limited edition blend',
          price: 19.99,
          intensity: 10,
          stock: 0, // Out of stock
          isActive: true,
          nextRestockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          notifyWhenAvailable: true,
        });

        await capsule.save();

        return { productId: specificId.toString() };
      },
    };
  },

  'product does not exist': async () => {
    // Ensure specific product doesn't exist for 404 tests
    return {
      description: 'Product database cleaned for 404 tests',
      setup: async () => {
        const Capsule = require('../../../backend/src/models/Capsule');
        const Machine = require('../../../backend/src/models/Machine');

        await Capsule.deleteMany({});
        await Machine.deleteMany({});

        return { productsCleared: true };
      },
    };
  },

  'no products exist': async () => {
    // Empty product database for empty results tests
    return {
      description: 'Empty product database',
      setup: async () => {
        const Capsule = require('../../../backend/src/models/Capsule');
        const Machine = require('../../../backend/src/models/Machine');

        await Capsule.deleteMany({});
        await Machine.deleteMany({});

        return { allProductsCleared: true };
      },
    };
  },

  // Cart-related states
  'user has an empty cart': async () => {
    // Ensure user has no cart items
    return {
      description: 'User with empty cart',
      setup: async () => {
        const Cart = require('../../../backend/src/models/Cart');
        await Cart.deleteMany({});
        return { cartCleared: true };
      },
    };
  },

  'user has items in cart': async () => {
    // Create a user with items in cart
    return {
      description: 'User with cart containing items',
      setup: async () => {
        const User = require('../../../backend/src/models/User');
        const Cart = require('../../../backend/src/models/Cart');
        const Capsule = require('../../../backend/src/models/Capsule');

        // Create user and product
        const [user, _cartCleanup] = await Promise.all([
          User.create({
            email: 'test@cosmic.com',
            username: 'cosmicuser',
            firstName: 'John',
            lastName: 'Doe',
            isActive: true,
          }),
          Cart.deleteMany({}),
        ]);

        const capsule = await Capsule.create({
          name: 'Test Capsule',
          price: 10.99,
          stock: 100,
          isActive: true,
        });

        // Create cart with items
        const userCart = await Cart.create({
          userId: user._id,
          items: [
            {
              productId: capsule._id,
              quantity: 2,
              priceAtTime: 10.99,
            },
          ],
        });

        return {
          userId: user._id.toString(),
          cartId: userCart._id.toString(),
          capsuleId: capsule._id.toString(),
        };
      },
    };
  },
};

// Helper function to connect to test database
export const connectTestDatabase = async () => {
  const mongoose = require('mongoose');

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(PROVIDER_DATABASE_CONFIG.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  console.log('✅ Connected to contract testing database');
};

// Helper function to disconnect from test database
export const disconnectTestDatabase = async () => {
  const mongoose = require('mongoose');

  if (PROVIDER_DATABASE_CONFIG.dropDatabase) {
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Test database cleaned');
  }

  await mongoose.disconnect();
  console.log('🔌 Disconnected from contract testing database');
};

export default PACT_PROVIDER_CONFIG;