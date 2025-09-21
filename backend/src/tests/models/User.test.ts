/**
 * User Model Unit Tests
 *
 * This test suite demonstrates unit testing best practices including:
 * - AAA (Arrange-Act-Assert) pattern
 * - Testing happy paths, edge cases, and error scenarios
 * - Proper mocking and isolation
 * - Descriptive test names
 */

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

// Mock bcrypt for predictable testing
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Test data fixtures
const validUserData = {
  email: 'test@cosmicoffeehouse.com',
  username: 'testuser',
  password: 'SuperSecure123!',
  firstName: 'John',
  lastName: 'Doe',
  powerLevel: 50
};

describe('User Model', () => {
  let mongoServer: MongoMemoryServer;

  // Setup and teardown
  beforeAll(async () => {
    // Create an in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await User.deleteMany({});
    // Reset all mocks
    jest.clearAllMocks();
  });

  // =====================================
  // Schema Validation Tests
  // =====================================
  describe('Schema Validation', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = { ...validUserData };

      // Act
      const user = new User(userData);
      const savedUser = await user.save();

      // Assert
      expect(savedUser._id).toBeDefined();
      expect(savedUser.email).toBe(userData.email.toLowerCase());
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.firstName).toBe(userData.firstName);
      expect(savedUser.lastName).toBe(userData.lastName);
      expect(savedUser.powerLevel).toBe(userData.powerLevel);
    });

    it('should require email field', async () => {
      // Arrange
      const userData = { ...validUserData };
      delete (userData as any).email;

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce email uniqueness', async () => {
      // Arrange
      await User.create(validUserData);

      // Act & Assert
      const duplicateUser = new User(validUserData);
      await expect(duplicateUser.save()).rejects.toThrow();
    });

    it('should validate email format', async () => {
      // Arrange
      const userData = { ...validUserData, email: 'invalid-email' };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow(/valid email/);
    });

    it('should enforce minimum password length', async () => {
      // Arrange
      const userData = { ...validUserData, password: 'short' };

      // Act & Assert
      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    it('should set default power level to 1', async () => {
      // Arrange
      const userData = { ...validUserData };
      delete (userData as any).powerLevel;

      // Act
      const user = new User(userData);
      await user.save();

      // Assert
      expect(user.powerLevel).toBe(1);
    });
  });

  // =====================================
  // comparePassword Method Tests
  // =====================================
  describe('comparePassword', () => {
    let user: any;

    beforeEach(async () => {
      // Setup: Create a user with mocked password hashing
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      user = await User.create(validUserData);
      user.password = 'hashedPassword'; // Manually set for testing
    });

    describe('Happy Path', () => {
      it('should return true when password matches', async () => {
        // Arrange
        mockedBcrypt.compare.mockResolvedValue(true as never);

        // Act
        const result = await user.comparePassword('correctPassword');

        // Assert
        expect(result).toBe(true);
        expect(mockedBcrypt.compare).toHaveBeenCalledWith(
          'correctPassword',
          'hashedPassword'
        );
      });
    });

    describe('Error Cases', () => {
      it('should return false when password does not match', async () => {
        // Arrange
        mockedBcrypt.compare.mockResolvedValue(false as never);

        // Act
        const result = await user.comparePassword('wrongPassword');

        // Assert
        expect(result).toBe(false);
        expect(mockedBcrypt.compare).toHaveBeenCalledWith(
          'wrongPassword',
          'hashedPassword'
        );
      });

      it('should return false when bcrypt throws an error', async () => {
        // Arrange
        mockedBcrypt.compare.mockRejectedValue(new Error('Bcrypt error') as never);

        // Act
        const result = await user.comparePassword('anyPassword');

        // Assert
        expect(result).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty password string', async () => {
        // Arrange
        mockedBcrypt.compare.mockResolvedValue(false as never);

        // Act
        const result = await user.comparePassword('');

        // Assert
        expect(result).toBe(false);
        expect(mockedBcrypt.compare).toHaveBeenCalledWith('', 'hashedPassword');
      });

      it('should handle null password gracefully', async () => {
        // Arrange
        mockedBcrypt.compare.mockResolvedValue(false as never);

        // Act
        const result = await user.comparePassword(null as any);

        // Assert
        expect(result).toBe(false);
      });

      it('should handle undefined password gracefully', async () => {
        // Arrange
        mockedBcrypt.compare.mockResolvedValue(false as never);

        // Act
        const result = await user.comparePassword(undefined as any);

        // Assert
        expect(result).toBe(false);
      });
    });
  });

  // =====================================
  // increasePowerLevel Method Tests
  // =====================================
  describe('increasePowerLevel', () => {
    let user: any;

    beforeEach(async () => {
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      user = await User.create({ ...validUserData, powerLevel: 50 });
    });

    describe('Happy Path', () => {
      it('should increase power level by specified amount', async () => {
        // Act
        await user.increasePowerLevel(20);

        // Assert
        expect(user.powerLevel).toBe(70);
      });

      it('should save the updated power level to database', async () => {
        // Act
        await user.increasePowerLevel(15);

        // Assert
        const updatedUser = await User.findById(user._id);
        expect(updatedUser?.powerLevel).toBe(65);
      });
    });

    describe('Edge Cases', () => {
      it('should cap power level at 100', async () => {
        // Arrange
        user.powerLevel = 90;
        await user.save();

        // Act
        await user.increasePowerLevel(20);

        // Assert
        expect(user.powerLevel).toBe(100);
      });

      it('should handle increasing from maximum', async () => {
        // Arrange
        user.powerLevel = 100;
        await user.save();

        // Act
        await user.increasePowerLevel(10);

        // Assert
        expect(user.powerLevel).toBe(100);
      });

      it('should handle zero increase', async () => {
        // Act
        await user.increasePowerLevel(0);

        // Assert
        expect(user.powerLevel).toBe(50);
      });

      it('should handle negative values by decreasing power level', async () => {
        // Act
        await user.increasePowerLevel(-10);

        // Assert - Negative values actually decrease the power level
        expect(user.powerLevel).toBe(40);
      });

      it('should handle decimal values', async () => {
        // Act
        await user.increasePowerLevel(5.7);

        // Assert - Should handle decimals appropriately
        expect(user.powerLevel).toBeGreaterThanOrEqual(55);
        expect(user.powerLevel).toBeLessThanOrEqual(56);
      });
    });
  });

  // =====================================
  // generateAuthToken Method Tests
  // =====================================
  describe('generateAuthToken', () => {
    let user: any;

    beforeEach(async () => {
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      user = await User.create(validUserData);
    });

    describe('Happy Path', () => {
      it('should generate a valid JWT token', () => {
        // Act
        const token = user.generateAuthToken();

        // Assert
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
      });

      it('should include user data in token payload', () => {
        // Act
        const token = user.generateAuthToken();
        const decoded = jwt.decode(token) as any;

        // Assert
        expect(decoded.id).toBe(user._id.toString());
        expect(decoded.email).toBe(user.email);
        expect(decoded.username).toBe(user.username);
        expect(decoded.powerLevel).toBe(user.powerLevel);
      });

      it('should set token expiration', () => {
        // Act
        const token = user.generateAuthToken();
        const decoded = jwt.decode(token) as any;

        // Assert
        expect(decoded.exp).toBeDefined();
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeGreaterThan(decoded.iat);
      });
    });

    describe('Security Tests', () => {
      it('should use the JWT_SECRET from environment', () => {
        // Arrange
        const originalSecret = process.env.JWT_SECRET;
        process.env.JWT_SECRET = 'test-secret-key';

        // Act
        const token = user.generateAuthToken();

        // Assert
        const verified = jwt.verify(token, 'test-secret-key') as any;
        expect(verified.id).toBe(user._id.toString());

        // Cleanup
        process.env.JWT_SECRET = originalSecret;
      });

      it('should use default secret if JWT_SECRET is not set', () => {
        // Arrange
        const originalSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;

        // Act
        const token = user.generateAuthToken();

        // Assert
        const verified = jwt.verify(token, 'cosmic-secret-key') as any;
        expect(verified.id).toBe(user._id.toString());

        // Cleanup
        process.env.JWT_SECRET = originalSecret;
      });
    });
  });

  // =====================================
  // generateRefreshToken Method Tests
  // =====================================
  describe('generateRefreshToken', () => {
    let user: any;

    beforeEach(async () => {
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      user = await User.create(validUserData);
    });

    it('should generate a valid refresh token', () => {
      // Act
      const token = user.generateRefreshToken();

      // Assert
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include tokenVersion in payload', () => {
      // Act
      const token = user.generateRefreshToken();
      const decoded = jwt.decode(token) as any;

      // Assert
      expect(decoded.id).toBe(user._id.toString());
      expect(decoded.tokenVersion).toBeDefined();
      expect(typeof decoded.tokenVersion).toBe('number');
    });

    it('should have longer expiration than auth token', () => {
      // Act
      const refreshToken = user.generateRefreshToken();
      const authToken = user.generateAuthToken();

      const refreshDecoded = jwt.decode(refreshToken) as any;
      const authDecoded = jwt.decode(authToken) as any;

      // Assert
      const refreshDuration = refreshDecoded.exp - refreshDecoded.iat;
      const authDuration = authDecoded.exp - authDecoded.iat;
      expect(refreshDuration).toBeGreaterThan(authDuration);
    });
  });

  // =====================================
  // Additional Tests
  // =====================================
  describe('User Creation and Updates', () => {
    it('should create user with all fields', async () => {
      // Arrange
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      const user = await User.create({ ...validUserData, powerLevel: 75 });

      // Act & Assert
      expect(user.powerLevel).toBeGreaterThanOrEqual(1);
      expect(user.powerLevel).toBeLessThanOrEqual(100);
      expect(user.email).toBe(validUserData.email.toLowerCase());
    });
  });
});