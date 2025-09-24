/**
 * Authentication API Provider Contract Verification
 *
 * This test verifies that the backend (provider) fulfills all the contract
 * expectations defined by the frontend (consumer) for authentication endpoints.
 */

import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import {
  PACT_PROVIDER_CONFIG,
  PROVIDER_STATE_HANDLERS,
  connectTestDatabase,
  disconnectTestDatabase,
} from '../config/pact.provider.config';

describe('Authentication Provider Contract Verification', () => {
  let server: any;
  let verifier: Verifier;

  beforeAll(async () => {
    // Connect to test database
    await connectTestDatabase();

    // Start the provider (backend server) for testing
    server = require('../../../../backend/src/server');

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('🚀 Provider server started for contract verification');
  });

  afterAll(async () => {
    // Clean up
    if (server && server.close) {
      server.close();
    }
    await disconnectTestDatabase();
    console.log('🛑 Provider server stopped');
  });

  describe('Auth Contract Verification', () => {
    it('should verify all authentication contracts', async () => {
      const pactFile = path.resolve(__dirname, '../../pacts/CosmicCoffeehouse-Frontend-CosmicCoffeehouse-Backend.json');

      const opts = {
        ...PACT_PROVIDER_CONFIG,
        pactUrls: [pactFile],

        // State handlers for different test scenarios
        stateHandlers: {
          // User registration states
          'user does not exist': async () => {
            console.log('🔄 Setting up state: user does not exist');
            const handler = PROVIDER_STATE_HANDLERS['user does not exist'];
            const result = await handler();
            await result.setup();
            console.log('✅ State setup complete: user does not exist');
          },

          'a user with valid credentials exists': async () => {
            console.log('🔄 Setting up state: user with valid credentials exists');
            const handler = PROVIDER_STATE_HANDLERS['a user with valid credentials exists'];
            const result = await handler();
            const setupResult = await result.setup();
            console.log('✅ State setup complete: user exists with ID', setupResult.userId);
          },

          // User login states
          'user is logged in with valid token': async () => {
            console.log('🔄 Setting up state: user logged in with valid token');
            const handler = PROVIDER_STATE_HANDLERS['user is logged in with valid token'];
            const result = await handler();
            const setupResult = await result.setup();
            console.log('✅ State setup complete: user logged in', setupResult.userId);
          },

          'user is logged out': async () => {
            console.log('🔄 Setting up state: user logged out');
            const handler = PROVIDER_STATE_HANDLERS['user is logged out'];
            const result = await handler();
            await result.setup();
            console.log('✅ State setup complete: user logged out');
          },
        },

        // Request filter to add test-specific headers or modify requests
        requestFilter: (req: any, _res: any, next: any) => {
          // Add test mode header to identify contract verification requests
          req.headers['x-test-mode'] = 'contract-verification';

          // Log request for debugging
          console.log(`📝 Contract verification request: ${req.method} ${req.path}`);

          next();
        },

        // Before each verification, ensure clean state
        beforeEach: async () => {
          console.log('🧹 Preparing for next contract verification');
          // Additional cleanup if needed
        },

        // After each verification, log results
        afterEach: async () => {
          console.log('✅ Contract verification completed');
        },

        // Custom verification timeout
        timeout: 30000,

        // Enable request/response logging for debugging
        logLevel: 'info' as const,
      };

      // Run the verification
      verifier = new Verifier(opts);

      try {
        console.log('🔍 Starting authentication contract verification...');
        await verifier.verifyProvider();
        console.log('🎉 All authentication contracts verified successfully!');
      } catch (error) {
        console.error('❌ Contract verification failed:', error);

        // Enhanced error reporting for debugging
        if (error instanceof Error) {
          console.error('Error details:');
          console.error('- Message:', error.message);
          console.error('- Stack:', error.stack);

          // Check if it's a Pact verification error with additional details
          if ('verificationResult' in error) {
            console.error('- Verification details:', (error as any).verificationResult);
          }
        }

        throw error;
      }
    }, 60000); // 60 second timeout for the entire verification process

    it('should handle registration contract expectations', async () => {
      // This test focuses specifically on registration-related contracts
      const pactFile = path.resolve(__dirname, '../../pacts/CosmicCoffeehouse-Frontend-CosmicCoffeehouse-Backend.json');

      const opts = {
        ...PACT_PROVIDER_CONFIG,
        pactUrls: [pactFile],

        // Filter to only verify registration-related interactions
        providerStatesSetupUrl: `${PACT_PROVIDER_CONFIG.providerBaseUrl}/pact/provider-states`,

        stateHandlers: {
          'user does not exist': async () => {
            const User = require('../../../../backend/src/models/User');
            await User.deleteMany({ email: 'test@cosmic.com' });
            console.log('✅ Cleared existing users for registration test');
          },

          'a user with valid credentials exists': async () => {
            const User = require('../../../../backend/src/models/User');
            await User.deleteMany({ email: 'test@cosmic.com' });

            // Create user with exact test data
            const user = new User({
              email: 'test@cosmic.com',
              username: 'cosmicuser',
              password: 'SecurePass123!',
              firstName: 'John',
              lastName: 'Doe',
              isActive: true,
            });

            await user.save();
            console.log('✅ Created test user for duplicate registration test');
          },
        },

        // Only verify registration-related interactions
        filterDescription: 'registration',

        logLevel: 'debug' as const, // More detailed logging for registration tests
      };

      const registrationVerifier = new Verifier(opts);

      try {
        console.log('📝 Verifying registration contracts...');
        await registrationVerifier.verifyProvider();
        console.log('✅ Registration contracts verified successfully');
      } catch (error) {
        console.error('❌ Registration contract verification failed');
        throw error;
      }
    });

    it('should handle login contract expectations', async () => {
      // This test focuses specifically on login-related contracts
      const pactFile = path.resolve(__dirname, '../../pacts/CosmicCoffeehouse-Frontend-CosmicCoffeehouse-Backend.json');

      const opts = {
        ...PACT_PROVIDER_CONFIG,
        pactUrls: [pactFile],

        stateHandlers: {
          'a user with valid credentials exists': async () => {
            const User = require('../../../../backend/src/models/User');
            const bcrypt = require('bcryptjs');

            await User.deleteMany({ email: 'test@cosmic.com' });

            // Create user with exact credentials expected by the contract
            const hashedPassword = await bcrypt.hash('SecurePass123!', 12);

            const user = new User({
              email: 'test@cosmic.com',
              username: 'cosmicuser',
              password: hashedPassword, // Use pre-hashed password
              firstName: 'John',
              lastName: 'Doe',
              powerLevel: 50,
              isActive: true,
            });

            await user.save();
            console.log('✅ Created user with exact credentials for login test');
          },

          'user does not exist': async () => {
            const User = require('../../../../backend/src/models/User');
            await User.deleteMany({ email: 'nonexistent@cosmic.com' });
            console.log('✅ Ensured non-existent user for 404 login test');
          },
        },

        // Only verify login-related interactions
        filterDescription: 'login',
        logLevel: 'debug' as const,
      };

      const loginVerifier = new Verifier(opts);

      try {
        console.log('🔐 Verifying login contracts...');
        await loginVerifier.verifyProvider();
        console.log('✅ Login contracts verified successfully');
      } catch (error) {
        console.error('❌ Login contract verification failed');
        throw error;
      }
    });

    it('should handle token verification contract expectations', async () => {
      // This test focuses specifically on JWT token verification contracts
      const pactFile = path.resolve(__dirname, '../../pacts/CosmicCoffeehouse-Frontend-CosmicCoffeehouse-Backend.json');

      const opts = {
        ...PACT_PROVIDER_CONFIG,
        pactUrls: [pactFile],

        stateHandlers: {
          'user is logged in with valid token': async () => {
            const User = require('../../../../backend/src/models/User');
            const jwt = require('jsonwebtoken');

            await User.deleteMany({ email: 'test@cosmic.com' });

            // Create user
            const user = new User({
              email: 'test@cosmic.com',
              username: 'cosmicuser',
              firstName: 'John',
              lastName: 'Doe',
              isActive: true,
            });

            await user.save();

            // Generate valid token that matches the contract expectations
            const token = jwt.sign(
              {
                id: user._id.toString(),
                email: user.email,
              },
              process.env.JWT_SECRET || 'test-secret-key',
              { expiresIn: '24h' }
            );

            console.log('✅ Created user with valid JWT token for verification');
            return { userId: user._id.toString(), token };
          },

          'user is logged out': async () => {
            // No specific setup needed for logged out state
            console.log('✅ Setup complete for logged out state');
          },
        },

        // Only verify token-related interactions
        filterDescription: 'token',
        logLevel: 'debug' as const,
      };

      const tokenVerifier = new Verifier(opts);

      try {
        console.log('🎫 Verifying token contracts...');
        await tokenVerifier.verifyProvider();
        console.log('✅ Token contracts verified successfully');
      } catch (error) {
        console.error('❌ Token contract verification failed');
        throw error;
      }
    });
  });
});

