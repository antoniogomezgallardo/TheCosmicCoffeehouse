/**
 * Authentication API Consumer Contract Tests
 *
 * These tests define the contract expectations from the frontend's perspective
 * for all authentication-related endpoints.
 */

import { Pact } from '@pact-foundation/pact';
import { like, term, iso8601DateTimeWithMillis, eachLike } from '@pact-foundation/pact/src/dsl/matchers';
import axios from 'axios';
import path from 'path';
import {
  PACT_CONSUMER_CONFIG,
  API_ENDPOINTS,
  PROVIDER_STATES,
  TEST_DATA,
} from '../config/pact.consumer.config';

describe('Authentication API Consumer Contract', () => {
  const provider = new Pact({
    consumer: PACT_CONSUMER_CONFIG.consumer,
    provider: PACT_CONSUMER_CONFIG.provider,
    port: PACT_CONSUMER_CONFIG.port,
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'info',
  });

  const baseURL = `http://localhost:${PACT_CONSUMER_CONFIG.port}`;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      // Define the expected interaction
      await provider.addInteraction({
        state: PROVIDER_STATES.USER_DOES_NOT_EXIST,
        uponReceiving: 'a valid registration request',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.REGISTER,
          headers: {
            'Content-Type': 'application/json',
          },
          body: TEST_DATA.validUser,
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'User registered successfully',
            data: {
              user: {
                id: like('507f1f77bcf86cd799439011'),
                email: TEST_DATA.validUser.email,
                username: TEST_DATA.validUser.username,
                firstName: TEST_DATA.validUser.firstName,
                lastName: TEST_DATA.validUser.lastName,
                powerLevel: like(0),
                isActive: true,
                createdAt: iso8601DateTimeWithMillis(),
                updatedAt: iso8601DateTimeWithMillis(),
              },
              token: term({
                matcher: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$',
                generate: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoidGVzdEBjb3NtaWMuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
              }),
            },
          },
        },
      });

      // Make the actual request
      const response = await axios.post(
        `${baseURL}${API_ENDPOINTS.AUTH.REGISTER}`,
        TEST_DATA.validUser,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Validate the response
      expect(response.status).toBe(201);
      expect(response.data.success).toBe(true);
      expect(response.data.data.user.email).toBe(TEST_DATA.validUser.email);
      expect(response.data.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it('should fail registration with duplicate email', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.USER_EXISTS,
        uponReceiving: 'a registration request with existing email',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.REGISTER,
          headers: {
            'Content-Type': 'application/json',
          },
          body: TEST_DATA.validUser,
        },
        willRespondWith: {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('User already exists'),
            error: 'CONFLICT',
          },
        },
      });

      try {
        await axios.post(
          `${baseURL}${API_ENDPOINTS.AUTH.REGISTER}`,
          TEST_DATA.validUser,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('CONFLICT');
      }
    });

    it('should fail registration with invalid data', async () => {
      const invalidUser = {
        email: 'not-an-email',
        username: '',
        password: '123', // Too short
        firstName: '',
        lastName: '',
      };

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_DOES_NOT_EXIST,
        uponReceiving: 'an invalid registration request',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.REGISTER,
          headers: {
            'Content-Type': 'application/json',
          },
          body: invalidUser,
        },
        willRespondWith: {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('Validation failed'),
            error: 'VALIDATION_ERROR',
            errors: eachLike({
              field: like('email'),
              message: like('Invalid email format'),
            }),
          },
        },
      });

      try {
        await axios.post(
          `${baseURL}${API_ENDPOINTS.AUTH.REGISTER}`,
          invalidUser,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('VALIDATION_ERROR');
        expect(error.response.data.errors).toBeInstanceOf(Array);
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully login with valid credentials', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.USER_EXISTS,
        uponReceiving: 'a valid login request',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.LOGIN,
          headers: {
            'Content-Type': 'application/json',
          },
          body: TEST_DATA.validCredentials,
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Login successful',
            data: {
              user: {
                id: like('507f1f77bcf86cd799439011'),
                email: TEST_DATA.validCredentials.email,
                username: like('cosmicuser'),
                firstName: like('John'),
                lastName: like('Doe'),
                powerLevel: like(50),
                isActive: true,
                lastLogin: iso8601DateTimeWithMillis(),
              },
              token: term({
                matcher: '^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$',
                generate: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoidGVzdEBjb3NtaWMuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
              }),
              refreshToken: like('refresh-token-abc123'),
            },
          },
        },
      });

      const response = await axios.post(
        `${baseURL}${API_ENDPOINTS.AUTH.LOGIN}`,
        TEST_DATA.validCredentials,
        { headers: { 'Content-Type': 'application/json' } }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.user.email).toBe(TEST_DATA.validCredentials.email);
      expect(response.data.data.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
      expect(response.data.data.refreshToken).toBeDefined();
    });

    it('should fail login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'test@cosmic.com',
        password: 'WrongPassword123!',
      };

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_EXISTS,
        uponReceiving: 'a login request with invalid credentials',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.LOGIN,
          headers: {
            'Content-Type': 'application/json',
          },
          body: invalidCredentials,
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('Invalid credentials'),
            error: 'UNAUTHORIZED',
          },
        },
      });

      try {
        await axios.post(
          `${baseURL}${API_ENDPOINTS.AUTH.LOGIN}`,
          invalidCredentials,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('UNAUTHORIZED');
      }
    });

    it('should fail login when user does not exist', async () => {
      const nonExistentUser = {
        email: 'nonexistent@cosmic.com',
        password: 'AnyPassword123!',
      };

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_DOES_NOT_EXIST,
        uponReceiving: 'a login request for non-existent user',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.LOGIN,
          headers: {
            'Content-Type': 'application/json',
          },
          body: nonExistentUser,
        },
        willRespondWith: {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('User not found'),
            error: 'NOT_FOUND',
          },
        },
      });

      try {
        await axios.post(
          `${baseURL}${API_ENDPOINTS.AUTH.LOGIN}`,
          nonExistentUser,
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('NOT_FOUND');
      }
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should successfully logout an authenticated user', async () => {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoidGVzdEBjb3NtaWMuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_LOGGED_IN,
        uponReceiving: 'a logout request from authenticated user',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.LOGOUT,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Logged out successfully',
          },
        },
      });

      const response = await axios.post(
        `${baseURL}${API_ENDPOINTS.AUTH.LOGOUT}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.message).toBe('Logged out successfully');
    });

    it('should fail logout without authentication', async () => {
      await provider.addInteraction({
        state: PROVIDER_STATES.USER_LOGGED_OUT,
        uponReceiving: 'a logout request without authentication',
        withRequest: {
          method: 'POST',
          path: API_ENDPOINTS.AUTH.LOGOUT,
          headers: {
            'Content-Type': 'application/json',
          },
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('Authentication required'),
            error: 'UNAUTHORIZED',
          },
        },
      });

      try {
        await axios.post(
          `${baseURL}${API_ENDPOINTS.AUTH.LOGOUT}`,
          {},
          { headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('UNAUTHORIZED');
      }
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify a valid JWT token', async () => {
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoidGVzdEBjb3NtaWMuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_LOGGED_IN,
        uponReceiving: 'a token verification request',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.AUTH.VERIFY_TOKEN,
          headers: {
            'Authorization': `Bearer ${validToken}`,
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: true,
            message: 'Token is valid',
            data: {
              valid: true,
              user: {
                id: like('507f1f77bcf86cd799439011'),
                email: like('test@cosmic.com'),
                username: like('cosmicuser'),
              },
              expiresAt: iso8601DateTimeWithMillis(),
            },
          },
        },
      });

      const response = await axios.get(
        `${baseURL}${API_ENDPOINTS.AUTH.VERIFY_TOKEN}`,
        {
          headers: {
            'Authorization': `Bearer ${validToken}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.valid).toBe(true);
      expect(response.data.data.user).toBeDefined();
    });

    it('should reject an invalid token', async () => {
      const invalidToken = 'invalid.token.here';

      await provider.addInteraction({
        state: PROVIDER_STATES.USER_LOGGED_OUT,
        uponReceiving: 'a token verification request with invalid token',
        withRequest: {
          method: 'GET',
          path: API_ENDPOINTS.AUTH.VERIFY_TOKEN,
          headers: {
            'Authorization': `Bearer ${invalidToken}`,
          },
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            success: false,
            message: like('Invalid token'),
            error: 'INVALID_TOKEN',
          },
        },
      });

      try {
        await axios.get(
          `${baseURL}${API_ENDPOINTS.AUTH.VERIFY_TOKEN}`,
          {
            headers: {
              'Authorization': `Bearer ${invalidToken}`,
            },
          }
        );
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.success).toBe(false);
        expect(error.response.data.error).toBe('INVALID_TOKEN');
      }
    });
  });
});