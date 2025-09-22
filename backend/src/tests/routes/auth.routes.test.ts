import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../../models/User';
import authRoutes from '../../routes/auth.routes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test user data
const validUserData = {
  email: 'test@cosmic.com',
  username: 'testuser',
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User'
};

describe('Authentication Routes', () => {
  // Setup and teardown
  beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear all collections before each test
    await User.deleteMany({});
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    describe('Successful Registration', () => {
      it('should register a new user with valid data', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(validUserData)
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            user: {
              email: validUserData.email,
              username: validUserData.username,
              firstName: validUserData.firstName,
              lastName: validUserData.lastName,
              powerLevel: 1
            }
          }
        });

        // Verify token is returned
        expect(response.body.data.token).toBeDefined();
        expect(typeof response.body.data.token).toBe('string');

        // Verify user is saved in database
        const savedUser = await User.findOne({ email: validUserData.email });
        expect(savedUser).toBeDefined();
        expect(savedUser?.username).toBe(validUserData.username);
      });

      it('should hash the password before saving', async () => {
        await request(app)
          .post('/api/auth/register')
          .send(validUserData)
          .expect(201);

        const savedUser = await User.findOne({ email: validUserData.email }).select('+password');
        expect(savedUser?.password).toBeDefined();
        expect(savedUser?.password).not.toBe(validUserData.password);

        // Verify it's a valid bcrypt hash
        const isValidHash = await bcrypt.compare(validUserData.password, savedUser?.password as string);
        expect(isValidHash).toBe(true);
      });

      it('should generate a valid JWT token', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(validUserData)
          .expect(201);

        const token = response.body.data.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

        expect(decoded).toMatchObject({
          id: response.body.data.user.id,
          email: validUserData.email,
          username: validUserData.username
        });
        expect(decoded.exp).toBeDefined();
      });
    });

    describe('Validation Errors', () => {
      it('should reject registration without email', async () => {
        const dataWithoutEmail = {
          username: validUserData.username,
          password: validUserData.password,
          firstName: validUserData.firstName,
          lastName: validUserData.lastName
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(dataWithoutEmail)
          .expect(500);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('required')
        });
      });

      it('should reject registration without username', async () => {
        const dataWithoutUsername = {
          email: validUserData.email,
          password: validUserData.password,
          firstName: validUserData.firstName,
          lastName: validUserData.lastName
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(dataWithoutUsername)
          .expect(500);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('required')
        });
      });

      it('should reject registration without password', async () => {
        const dataWithoutPassword = {
          email: validUserData.email,
          username: validUserData.username,
          firstName: validUserData.firstName,
          lastName: validUserData.lastName
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(dataWithoutPassword)
          .expect(500);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('required')
        });
      });

      it('should reject registration with invalid email format', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...validUserData,
            email: 'invalid-email'
          })
          .expect(500);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('validation failed')
        });
      });

      it('should reject registration with short password', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...validUserData,
            password: '123'
          })
          .expect(500);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('shorter')
        });
      });
    });

    describe('Duplicate User Prevention', () => {
      beforeEach(async () => {
        // Create an existing user
        const user = new User(validUserData);
        await user.save();
      });

      it('should reject registration with duplicate email', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...validUserData,
            username: 'differentusername'
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'User already exists'
        });
      });

      it('should reject registration with duplicate username', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...validUserData,
            email: 'different@email.com'
          })
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: 'User already exists'
        });
      });
    });

    describe('Edge Cases', () => {
      it('should reject registration without required firstName and lastName', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: 'minimal@test.com',
            username: 'minimaluser',
            password: 'MinimalPass123!'
          })
          .expect(500);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('required');
      });

      it('should handle very long valid inputs', async () => {
        const longValidData = {
          email: 'a'.repeat(50) + '@cosmic.com',
          username: 'u'.repeat(30), // Max length
          password: 'p'.repeat(100) + '123!A',
          firstName: 'F'.repeat(50),
          lastName: 'L'.repeat(50)
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(longValidData)
          .expect(201);

        expect(response.body.success).toBe(true);
      });

      it('should trim whitespace from email and username', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            ...validUserData,
            email: '  trimmed@test.com  ',
            username: '  trimmeduser  '
          })
          .expect(201);

        expect(response.body.data.user.email).toBe('trimmed@test.com');
        expect(response.body.data.user.username).toBe('trimmeduser');
      });
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const user = new User(validUserData);
      await user.save();
    });

    describe('Successful Login', () => {
      it('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: validUserData.password
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            user: {
              email: validUserData.email,
              username: validUserData.username,
              firstName: validUserData.firstName,
              lastName: validUserData.lastName,
              powerLevel: 1
            }
          }
        });

        expect(response.body.data.token).toBeDefined();
        expect(typeof response.body.data.token).toBe('string');
      });

      it('should return a valid JWT token on login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: validUserData.password
          })
          .expect(200);

        const token = response.body.data.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

        expect(decoded).toMatchObject({
          id: response.body.data.user.id,
          email: validUserData.email,
          username: validUserData.username
        });
      });

      it('should not return password in response', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: validUserData.password
          })
          .expect(200);

        expect(response.body.data.user.password).toBeUndefined();
      });
    });

    describe('Authentication Failures', () => {
      it('should reject login with invalid email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@test.com',
            password: validUserData.password
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });

      it('should reject login with invalid password', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: 'WrongPassword123!'
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });

      it('should reject login without email', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            password: validUserData.password
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });

      it('should reject login without password', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });

      it('should reject login with empty credentials', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: '',
            password: ''
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });
    });

    describe('Security Considerations', () => {
      it('should not reveal whether email exists on failed login', async () => {
        const responseInvalidEmail = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'nonexistent@test.com',
            password: 'SomePassword123!'
          });

        const responseInvalidPassword = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email,
            password: 'WrongPassword123!'
          });

        // Both should return the same error message
        expect(responseInvalidEmail.body.message).toBe(responseInvalidPassword.body.message);
        expect(responseInvalidEmail.status).toBe(responseInvalidPassword.status);
      });

      it('should handle SQL injection attempts safely', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: "' OR '1'='1",
            password: "' OR '1'='1"
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });

      it('should handle NoSQL injection attempts safely', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: { $ne: null },
            password: { $ne: null }
          })
          .expect(401);

        expect(response.body.success).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle case-insensitive email correctly (MongoDB lowercases emails)', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: validUserData.email.toUpperCase(),
            password: validUserData.password
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true
        });
        expect(response.body.data.user.email).toBe(validUserData.email.toLowerCase());
      });

      it('should handle and trim whitespace in email (MongoDB trims emails)', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: `  ${validUserData.email}  `,
            password: validUserData.password
          })
          .expect(200);

        expect(response.body).toMatchObject({
          success: true
        });
        expect(response.body.data.user.email).toBe(validUserData.email.trim().toLowerCase());
      });

      it('should handle very long invalid inputs gracefully', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'a'.repeat(1000) + '@test.com',
            password: 'p'.repeat(1000)
          })
          .expect(401);

        expect(response.body).toMatchObject({
          success: false,
          message: 'Invalid credentials'
        });
      });
    });
  });

  describe('GET /api/auth/logout', () => {
    it('should return success message for logout', async () => {
      const response = await request(app)
        .get('/api/auth/logout')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully'
      });
    });

    it('should logout without authentication token', async () => {
      const response = await request(app)
        .get('/api/auth/logout')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully'
      });
    });

    it('should logout even with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid registration attempts', async () => {
      const promises = [];

      for (let i = 0; i < 10; i++) {
        const userData = {
          ...validUserData,
          email: `rapid${i}@test.com`,
          username: `rapiduser${i}`
        };

        promises.push(
          request(app)
            .post('/api/auth/register')
            .send(userData)
        );
      }

      const responses = await Promise.all(promises);
      const successCount = responses.filter(r => r.status === 201).length;

      expect(successCount).toBe(10);
    });

    it('should handle rapid login attempts', async () => {
      // First create a user for login tests
      const user = new User(validUserData);
      await user.save();

      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: validUserData.email,
              password: validUserData.password
            })
        );
      }

      const responses = await Promise.all(promises);
      const successCount = responses.filter(r => r.status === 200).length;

      expect(successCount).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Temporarily disconnect from database
      await mongoose.disconnect();

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);

      // Reconnect for other tests
      await mongoose.connect(mongoServer.getUri());
    });

    it('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);

      expect(response.status).toBe(400);
    });
  });
});
