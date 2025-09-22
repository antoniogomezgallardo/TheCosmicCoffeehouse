# Unit Testing Strategy Guide

## 📚 Table of Contents
1. [Introduction](#introduction)
2. [What Are Unit Tests?](#what-are-unit-tests)
3. [Testing Principles](#testing-principles)
4. [Testing Strategy](#testing-strategy)
5. [Implementation Guide](#implementation-guide)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)
8. [Anti-Patterns](#anti-patterns)

## Introduction

This guide provides a comprehensive strategy for implementing unit tests in The Cosmic Coffeehouse project. Unit testing forms the foundation of our testing pyramid, comprising approximately 40% of our total test coverage.

## What Are Unit Tests?

Unit tests are automated tests that verify the behavior of individual units of code (functions, methods, classes) in isolation from their dependencies.

### Key Characteristics
- **Fast**: Execute in milliseconds
- **Isolated**: Test one unit at a time
- **Deterministic**: Same input always produces same output
- **Automated**: Run without human intervention
- **Self-validating**: Pass or fail without interpretation

## Testing Principles

### FIRST Principles
- **F**ast: Tests should run quickly (< 10ms per test)
- **I**ndependent: Tests should not depend on each other
- **R**epeatable: Same results every time
- **S**elf-validating: Clear pass/fail result
- **T**imely: Written just before or after the code

### AAA Pattern
Every test should follow the Arrange-Act-Assert pattern:

```typescript
describe('User Model', () => {
  it('should increase power level within bounds', () => {
    // Arrange: Set up test data and conditions
    const user = new User({ powerLevel: 50 });

    // Act: Execute the function being tested
    user.increasePowerLevel(30);

    // Assert: Verify the expected outcome
    expect(user.powerLevel).toBe(80);
  });
});
```

## Testing Strategy

### 1. Test Categorization

#### Happy Path (60% of tests)
Normal, expected scenarios where everything works correctly:
- Valid inputs
- Expected user behavior
- Successful operations

#### Edge Cases (25% of tests)
Boundary conditions and limits:
- Maximum/minimum values
- Empty collections
- Boundary transitions

#### Error Cases (15% of tests)
Invalid inputs and error handling:
- Null/undefined values
- Invalid data types
- Exception handling

### 2. Test Priority Matrix

| Priority | Criteria | Example |
|----------|----------|---------|
| **Critical** | Business logic, Authentication | Password validation, JWT generation |
| **High** | Data transformation, Calculations | Price calculations, Power level updates |
| **Medium** | Utility functions, Helpers | Date formatting, String manipulation |
| **Low** | Simple getters/setters | Basic property access |

### 3. Coverage Strategy

#### Target Coverage by File Type
- **Models**: 90% coverage (critical business logic)
- **Services**: 85% coverage (application logic)
- **Utilities**: 80% coverage (helper functions)
- **Routes**: 70% coverage (focus on middleware/validation)
- **Types**: 0% coverage (TypeScript interfaces)

## Implementation Guide

### Step 1: Identify Test Targets

```typescript
// Example: User model methods to test
class User {
  // HIGH PRIORITY: Business logic
  comparePassword(candidatePassword: string): Promise<boolean>
  generateAuthToken(): string
  increasePowerLevel(amount: number): void

  // MEDIUM PRIORITY: Data transformation
  toPublicProfile(): PublicProfile

  // LOW PRIORITY: Simple getters
  getFullName(): string
}
```

### Step 2: Write Test Cases

```typescript
// backend/src/tests/models/User.test.ts
import { User } from '../../models/User';

describe('User Model', () => {
  describe('comparePassword', () => {
    // Happy path
    it('should return true when password matches', async () => {
      const user = new User({ password: 'hashedPassword' });
      const result = await user.comparePassword('correctPassword');
      expect(result).toBe(true);
    });

    // Error case
    it('should return false when password does not match', async () => {
      const user = new User({ password: 'hashedPassword' });
      const result = await user.comparePassword('wrongPassword');
      expect(result).toBe(false);
    });

    // Edge case
    it('should handle empty password', async () => {
      const user = new User({ password: 'hashedPassword' });
      const result = await user.comparePassword('');
      expect(result).toBe(false);
    });
  });
});
```

### Step 3: Mock External Dependencies

```typescript
// Mock MongoDB connection
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock external services
jest.mock('../../services/EmailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));
```

## Best Practices

### 1. Test Naming Conventions

Use descriptive test names that explain what is being tested:

```typescript
// ✅ Good
it('should return 401 when authentication token is invalid')

// ❌ Bad
it('test auth')
```

### 2. Test Organization

Group related tests using `describe` blocks:

```typescript
describe('UserController', () => {
  describe('POST /register', () => {
    describe('with valid data', () => {
      it('should create a new user');
      it('should return 201 status');
      it('should return user without password');
    });

    describe('with invalid data', () => {
      it('should return 400 for missing email');
      it('should return 400 for invalid email format');
    });
  });
});
```

### 3. Isolation Techniques

```typescript
// Use test doubles
const mockUserRepository = {
  findById: jest.fn(),
  save: jest.fn(),
  delete: jest.fn()
};

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

### 4. Assertion Best Practices

```typescript
// Be specific with assertions
expect(user.email).toBe('test@example.com'); // ✅ Specific
expect(user).toBeDefined(); // ❌ Too vague

// Use appropriate matchers
expect(array).toHaveLength(3); // ✅ Clear intent
expect(array.length).toBe(3); // ❌ Less clear

// Test one behavior per test
it('should increase power level and cap at 100', () => {
  user.increasePowerLevel(60);
  expect(user.powerLevel).toBe(100); // ✅ Single assertion
});
```

## Common Patterns

### 1. Testing Async Functions

```typescript
// Using async/await
it('should fetch user data', async () => {
  const userData = await userService.getUser('123');
  expect(userData).toMatchObject({ id: '123' });
});

// Using promises
it('should reject with error', () => {
  return expect(userService.getUser('invalid'))
    .rejects.toThrow('User not found');
});
```

### 2. Testing Errors

```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    validateEmail('not-an-email');
  }).toThrow('Invalid email format');
});
```

### 3. Testing with Time

```typescript
// Mock timers for time-dependent code
jest.useFakeTimers();

it('should expire token after 15 minutes', () => {
  const token = generateToken();
  jest.advanceTimersByTime(15 * 60 * 1000);
  expect(isTokenExpired(token)).toBe(true);
});

jest.useRealTimers();
```

## Anti-Patterns

### 1. Testing Implementation Details

```typescript
// ❌ Bad: Testing private methods or internal state
it('should set _internalFlag to true', () => {
  obj.doSomething();
  expect(obj._internalFlag).toBe(true);
});

// ✅ Good: Test observable behavior
it('should be in active state after initialization', () => {
  obj.doSomething();
  expect(obj.isActive()).toBe(true);
});
```

### 2. Excessive Mocking

```typescript
// ❌ Bad: Mocking everything
jest.mock('../../entire-module');

// ✅ Good: Mock only external dependencies
jest.mock('axios');
const mockDatabase = createMockDatabase();
```

### 3. Test Interdependence

```typescript
// ❌ Bad: Tests depend on execution order
it('should create user', () => {
  user = createUser();
});

it('should update user', () => {
  updateUser(user); // Depends on previous test
});

// ✅ Good: Independent tests
it('should update user', () => {
  const user = createUser(); // Setup within test
  updateUser(user);
});
```

### 4. Ignoring Test Failures

```typescript
// ❌ Bad: Skipping failing tests
it.skip('should validate email format', () => {
  // TODO: Fix this later
});

// ✅ Good: Fix or remove broken tests immediately
it('should validate email format', () => {
  expect(isValidEmail('test@example.com')).toBe(true);
});
```

## Test-Driven Development (TDD)

### Red-Green-Refactor Cycle

1. **Red**: Write a failing test for new functionality
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

```typescript
// Step 1: Red - Write failing test
it('should calculate discount for premium users', () => {
  const discount = calculateDiscount({ isPremium: true, total: 100 });
  expect(discount).toBe(10);
});

// Step 2: Green - Minimal implementation
function calculateDiscount(order) {
  return order.isPremium ? 10 : 0;
}

// Step 3: Refactor - Improve implementation
function calculateDiscount(order: Order): number {
  const PREMIUM_DISCOUNT_RATE = 0.1;
  return order.isPremium ? order.total * PREMIUM_DISCOUNT_RATE : 0;
}
```

## Continuous Improvement

### Regular Review Questions
1. Are tests running fast enough? (target: <10 seconds)
2. Is coverage meeting targets? (80% minimum)
3. Are tests catching real bugs?
4. How much time is spent maintaining tests?
5. Are tests documenting behavior clearly?

### Metrics to Track
- Test execution time
- Code coverage percentage
- Test flakiness rate
- Defect detection rate
- Test maintenance effort

## Resources

### Tools
- **Jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **MongoDB Memory Server**: In-memory MongoDB for tests
- **Supertest**: HTTP assertion library
- **Coverage Reports**: Istanbul/nyc

### Further Reading
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Unit Testing Principles](https://www.amazon.com/Unit-Testing-Principles-Practices-Patterns/dp/1617296279)

---

*Last Updated: January 2025*
*Version: 1.0.0*