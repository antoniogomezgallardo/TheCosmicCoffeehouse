# Unit Testing Implementation Guide

## 🎯 Quick Start

This guide provides step-by-step instructions for implementing unit tests in The Cosmic Coffeehouse project, based on our successful implementation of 97 comprehensive tests with 95%+ coverage.

## 📋 Prerequisites

### Required Dependencies (Already Configured)
```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "@types/jest": "^29.5.12",
    "jest": "^29.7.0",
    "mongodb-memory-server": "^9.1.6",
    "supertest": "^6.3.4",
    "ts-jest": "^29.1.1"
  }
}
```

### Project Structure
```
backend/
├── src/
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   ├── middleware/      # Express middleware
│   ├── types/           # TypeScript types
│   └── tests/           # Test files
│       ├── models/      # Model tests
│       ├── routes/      # Route tests
│       ├── fixtures/    # Test data
│       └── utils/       # Test utilities
├── jest.config.js       # Jest configuration
├── jest.setup.ts        # Global test setup
└── package.json
```

---

## 🚀 Step-by-Step Implementation

### Step 1: Set Up Jest Configuration

**File:** `backend/jest.config.js`
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/tests/**',
    '!src/**/*.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testTimeout: 30000,
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Step 2: Create Global Test Setup

**File:** `backend/jest.setup.ts`
```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Increase timeout for database operations
jest.setTimeout(30000);

// Optional: Global setup if needed
// This runs once before all test suites
```

### Step 3: Create Test Data Fixtures

**File:** `backend/src/tests/fixtures/userData.ts`
```typescript
export const validUserData = {
  email: 'test@cosmicoffeehouse.com',
  username: 'testuser',
  password: 'SuperSecure123!',
  firstName: 'John',
  lastName: 'Doe',
  powerLevel: 50
};

export const invalidUserData = {
  email: 'invalid-email',
  username: '',
  password: '123', // Too short
  firstName: '',
  lastName: ''
};

export const createMultipleUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...validUserData,
    email: `user${i}@test.com`,
    username: `testuser${i}`
  }));
};
```

---

## 📝 Creating Your First Test Suite

### Model Testing Template

**File:** `backend/src/tests/models/YourModel.test.ts`

```typescript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import YourModel from '../../models/YourModel';
import { afterAll, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data
const validModelData = {
  // Your test data here
  name: 'Test Item',
  description: 'Test description',
  // ... other required fields
};

describe('YourModel', () => {
  // Setup: Create isolated database
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  // Cleanup: Close database connection
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Reset: Clean database between tests
  beforeEach(async () => {
    await YourModel.deleteMany({});
    jest.clearAllMocks();
  });

  describe('Schema Validation', () => {
    it('should create model with valid data', async () => {
      // Arrange
      const modelData = { ...validModelData };

      // Act
      const model = new YourModel(modelData);
      const savedModel = await model.save();

      // Assert
      expect(savedModel._id).toBeDefined();
      expect(savedModel.name).toBe(modelData.name);
    });

    it('should require name field', async () => {
      // Arrange
      const modelData = { ...validModelData };
      delete (modelData as any).name;

      // Act & Assert
      const model = new YourModel(modelData);
      await expect(model.save()).rejects.toThrow('required');
    });

    it('should enforce unique name constraint', async () => {
      // Arrange
      await YourModel.create(validModelData);

      // Act & Assert
      const duplicateModel = new YourModel(validModelData);
      await expect(duplicateModel.save()).rejects.toThrow();
    });
  });

  describe('Instance Methods', () => {
    let model: any;

    beforeEach(async () => {
      model = new YourModel(validModelData);
      await model.save();
    });

    it('should execute custom method correctly', async () => {
      // Arrange
      const inputValue = 'test input';

      // Act
      const result = await model.yourCustomMethod(inputValue);

      // Assert
      expect(result).toBeDefined();
      // Add specific assertions based on your method
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test data for static method testing
      const testData = [
        { ...validModelData, name: 'Item 1' },
        { ...validModelData, name: 'Item 2' },
        { ...validModelData, name: 'Item 3' }
      ];

      for (const data of testData) {
        await YourModel.create(data);
      }
    });

    it('should find models by criteria', async () => {
      // Act
      const results = await YourModel.findByCriteria('some criteria');

      // Assert
      expect(results).toHaveLength(expectedCount);
      expect(results[0]).toMatchObject(expectedObject);
    });
  });
});
```

### Route Testing Template

**File:** `backend/src/tests/routes/yourroute.test.ts`

```typescript
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import yourRoutes from '../../routes/yourroute';
import YourModel from '../../models/YourModel';

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/your-endpoint', yourRoutes);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Test data
const validRequestData = {
  // Your request data here
};

describe('Your Route', () => {
  // Setup and teardown
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await YourModel.deleteMany({});
    jest.clearAllMocks();
  });

  describe('POST /api/your-endpoint', () => {
    describe('Successful Operations', () => {
      it('should create resource with valid data', async () => {
        const response = await request(app)
          .post('/api/your-endpoint')
          .send(validRequestData)
          .expect(201);

        expect(response.body).toMatchObject({
          success: true,
          data: {
            // Expected response structure
          }
        });

        // Verify database state
        const savedResource = await YourModel.findOne({ /* criteria */ });
        expect(savedResource).toBeDefined();
      });
    });

    describe('Validation Errors', () => {
      it('should reject request without required field', async () => {
        const invalidData = { ...validRequestData };
        delete (invalidData as any).requiredField;

        const response = await request(app)
          .post('/api/your-endpoint')
          .send(invalidData)
          .expect(400);

        expect(response.body).toMatchObject({
          success: false,
          message: expect.stringContaining('required')
        });
      });
    });

    describe('Error Handling', () => {
      it('should handle database errors gracefully', async () => {
        // Arrange: Cause a database error
        await mongoose.disconnect();

        const response = await request(app)
          .post('/api/your-endpoint')
          .send(validRequestData);

        expect(response.status).toBe(500);
        expect(response.body.success).toBe(false);

        // Reconnect for other tests
        await mongoose.connect(mongoServer.getUri());
      });
    });
  });

  describe('GET /api/your-endpoint', () => {
    beforeEach(async () => {
      // Create test data
      await YourModel.create(validRequestData);
    });

    it('should retrieve resources successfully', async () => {
      const response = await request(app)
        .get('/api/your-endpoint')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            // Expected object structure
          })
        ])
      });
    });
  });
});
```

---

## 🔧 Advanced Patterns

### 1. Testing with Authentication

```typescript
// Helper function for authenticated requests
const loginUser = async (app: express.Application, userData: any) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: userData.email,
      password: userData.password
    });

  return response.body.data.token;
};

// Using authentication in tests
it('should allow authenticated user to access protected route', async () => {
  // Arrange
  const user = await User.create(validUserData);
  const token = await loginUser(app, validUserData);

  // Act
  const response = await request(app)
    .get('/api/protected-route')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  // Assert
  expect(response.body.success).toBe(true);
});
```

### 2. Testing Complex Business Logic

```typescript
describe('Complex Business Logic', () => {
  it('should handle multi-step operation correctly', async () => {
    // Arrange: Set up complex scenario
    const user = await User.create(validUserData);
    const product = await Product.create(validProductData);

    // Act: Execute multi-step operation
    await user.addToCart(product._id, 3);
    await user.checkout();
    const order = await user.getLatestOrder();

    // Assert: Verify all side effects
    expect(order.status).toBe('pending');
    expect(order.items).toHaveLength(1);
    expect(product.stock).toBe(originalStock - 3);
  });
});
```

### 3. Testing Error Scenarios

```typescript
describe('Error Scenarios', () => {
  it('should handle network timeout gracefully', async () => {
    // Mock external service to simulate timeout
    jest.setTimeout(1000);

    // Test your error handling
    await expect(
      yourServiceMethod()
    ).rejects.toThrow('Operation timeout');
  });

  it('should validate input boundaries', async () => {
    const edgeCases = [
      { input: '', expected: 'Empty input error' },
      { input: 'x'.repeat(1001), expected: 'Input too long error' },
      { input: null, expected: 'Null input error' }
    ];

    for (const testCase of edgeCases) {
      await expect(
        yourValidationFunction(testCase.input)
      ).rejects.toThrow(testCase.expected);
    }
  });
});
```

---

## 🎯 Best Practices Checklist

### Before Writing Tests
- [ ] Understand the function/feature requirements
- [ ] Identify happy path, edge cases, and error scenarios
- [ ] Plan test data fixtures
- [ ] Consider what external dependencies need mocking

### Writing Tests
- [ ] Follow AAA pattern (Arrange-Act-Assert)
- [ ] Use descriptive test names
- [ ] Test one behavior per test
- [ ] Include both positive and negative test cases
- [ ] Mock external dependencies properly
- [ ] Clean up after each test

### Test Quality
- [ ] Tests run fast (< 10ms for unit tests)
- [ ] Tests are deterministic (same result every time)
- [ ] Tests are independent (no test depends on another)
- [ ] Good error messages when tests fail
- [ ] Cover edge cases and boundary conditions

### Code Quality
- [ ] Tests are easy to read and understand
- [ ] No code duplication in test setup
- [ ] Proper TypeScript typing
- [ ] Consistent formatting and style

---

## 🚨 Common Pitfalls and Solutions

### Problem: Tests Are Slow
**Symptoms:** Test suite takes >30 seconds to run
**Solutions:**
- Use MongoDB Memory Server instead of real database
- Mock external HTTP calls
- Avoid unnecessary database operations
- Use `beforeAll` for expensive setup

### Problem: Flaky Tests
**Symptoms:** Tests sometimes pass, sometimes fail
**Solutions:**
- Ensure proper cleanup in `beforeEach`/`afterEach`
- Remove dependencies on external services
- Avoid timing-based tests
- Clear all mocks between tests

### Problem: Low Test Coverage
**Symptoms:** Coverage reports show low percentages
**Solutions:**
- Focus on critical business logic first
- Add tests for error scenarios
- Test edge cases and boundary conditions
- Use coverage reports to identify untested code

### Problem: Hard to Maintain Tests
**Symptoms:** Tests break frequently when code changes
**Solutions:**
- Test behavior, not implementation
- Reduce coupling between tests and internal code structure
- Use proper abstraction and helper functions
- Keep tests simple and focused

---

## 📊 Running and Monitoring Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- User.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create user"
```

### Coverage Analysis
```bash
# Generate HTML coverage report
npm run test:coverage

# Open coverage report
open coverage/index.html

# Check coverage thresholds
npm run test:coverage -- --coverage
```

### Debugging Tests
```bash
# Run with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="specific test" --verbose

# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📈 Measuring Success

### Key Metrics to Track
1. **Test Count:** Aim for comprehensive coverage of critical paths
2. **Execution Time:** Keep under 10 seconds for full suite
3. **Pass Rate:** Should be 100% consistently
4. **Coverage:** 80%+ overall, 95%+ for critical components
5. **Maintenance Time:** Tests should be easy to update

### Quality Indicators
- ✅ **Green builds:** All tests pass consistently
- ✅ **Fast feedback:** Quick test execution
- ✅ **Clear failures:** Easy to understand when tests fail
- ✅ **Good coverage:** Critical paths are well-tested
- ✅ **Easy maintenance:** Tests don't break with refactoring

---

## 🔄 Continuous Improvement

### Weekly Review Questions
1. Are tests running fast enough?
2. Is coverage meeting targets?
3. Are tests catching real bugs?
4. How much time is spent maintaining tests?
5. Are new features being tested?

### Monthly Actions
- Review and update test fixtures
- Refactor common test utilities
- Update coverage targets
- Remove or fix flaky tests
- Optimize slow-running tests

---

## 📚 Additional Resources

### Documentation Links
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [TypeScript Jest](https://kulshekhar.github.io/ts-jest/)

### Example Test Files (In This Project)
- `backend/src/tests/models/User.test.ts` - Model testing patterns
- `backend/src/tests/models/Capsule.test.ts` - Complex business logic
- `backend/src/tests/routes/auth.routes.test.ts` - Route testing with authentication

### Internal Documentation
- `docs/testing/TEST_PATTERNS.md` - Detailed patterns used in our tests
- `docs/testing/UNIT_TEST_METRICS.md` - Metrics and targets
- `docs/testing/UNIT_TESTING_STRATEGY.md` - Overall strategy and philosophy

---

*Last Updated: September 2025*
*Version: 1.0.0 - Based on 97 Production Tests*
*Success Rate: 100% passing tests, 5.4s execution time*