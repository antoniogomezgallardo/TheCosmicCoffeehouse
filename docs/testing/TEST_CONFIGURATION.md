# Test Configuration Documentation

## Overview

The feature/github-actions-ci-cd branch implemented comprehensive test configuration improvements across both backend (Jest) and frontend (Vitest) testing frameworks. These configurations establish a robust testing foundation that supports the "Quality Guardian" approach with emphasis on coverage reporting, type safety, and CI/CD integration.

## Testing Stack Overview

### Backend Testing (Node.js/Express)
- **Framework**: Jest with TypeScript support
- **API Testing**: Supertest for HTTP endpoint testing
- **Database Testing**: MongoDB Memory Server for isolated testing
- **Coverage**: Built-in Jest coverage with threshold enforcement
- **Mocking**: Comprehensive mocking strategy with auto-reset

### Frontend Testing (React/TypeScript)
- **Framework**: Vitest (Vite-native testing)
- **Component Testing**: React Testing Library integration
- **DOM Testing**: jsdom environment for browser simulation
- **Coverage**: V8 coverage provider with multiple reporters
- **Type Safety**: Full TypeScript integration

## Backend Test Configuration (Jest)

### Configuration File: `backend/jest.config.js`

#### 1. Core Jest Configuration
```javascript
/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],

  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ]
};
```

**Key Features**:
- **TypeScript-First**: Native TypeScript support via ts-jest
- **Node Environment**: Optimized for server-side testing
- **Flexible Test Discovery**: Multiple test file patterns supported
- **Source-Only Testing**: Tests restricted to src directory

#### 2. TypeScript Integration
```javascript
transform: {
  '^.+\\.(ts|tsx)$': ['ts-jest', {
    tsconfig: {
      esModuleInterop: true,
      allowJs: true
    }
  }]
}
```

**Benefits**:
- **ES Module Support**: Modern import/export syntax
- **Type Checking**: Compile-time type validation during tests
- **Source Maps**: Accurate debugging with TypeScript source maps
- **Incremental Compilation**: Faster test execution with caching

#### 3. Module Resolution and Path Aliases
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@models/(.*)$': '<rootDir>/src/models/$1',
  '^@routes/(.*)$': '<rootDir>/src/routes/$1',
  '^@config/(.*)$': '<rootDir>/src/config/$1',
  '^@types/(.*)$': '<rootDir>/src/types/$1'
}
```

**Advantages**:
- **Clean Imports**: Eliminates relative path complexity
- **Refactoring Safety**: Module moves don't break imports
- **Consistent Structure**: Matches TypeScript path mapping
- **IDE Support**: Full autocomplete and navigation

#### 4. Coverage Configuration
```javascript
collectCoverage: false, // Enable with --coverage flag
collectCoverageFrom: [
  'src/**/*.{ts,tsx}',
  '!src/**/*.d.ts',
  '!src/**/*.test.{ts,tsx}',
  '!src/**/*.spec.{ts,tsx}',
  '!src/**/__tests__/**',
  '!src/types/**',
  '!src/scripts/**',
  '!src/server.ts'
],

coverageThreshold: {
  global: {
    branches: 50,
    functions: 60,
    lines: 65,
    statements: 65
  }
}
```

**Coverage Strategy**:
- **Selective Collection**: Focus on business logic, exclude test files
- **Type Exclusion**: Skip TypeScript declaration files
- **Realistic Thresholds**: Achievable targets that improve over time
- **Incremental Improvement**: Baseline thresholds for continuous improvement

#### 5. Coverage Reporting
```javascript
coverageReporters: ['text', 'text-summary', 'html', 'lcov'],
coverageDirectory: 'coverage'
```

**Report Types**:
- **Text**: Console output for CI/CD pipelines
- **HTML**: Interactive coverage browser for developers
- **LCOV**: Industry-standard format for external tools
- **Text-Summary**: Concise coverage overview

#### 6. Test Environment Configuration
```javascript
clearMocks: true,
resetMocks: true,
restoreMocks: true,
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
testTimeout: 10000,
verbose: true,
maxWorkers: '50%',
forceExit: true
```

**Environment Features**:
- **Clean State**: Automatic mock cleanup between tests
- **Setup Files**: Global test configuration
- **Timeout Control**: 10-second timeout for async operations
- **Parallel Execution**: 50% worker utilization for optimal performance
- **Force Exit**: Prevents hanging test processes

#### 7. Development Experience
```javascript
watchPlugins: [
  'jest-watch-typeahead/filename',
  'jest-watch-typeahead/testname'
],
errorOnDeprecated: true,
detectOpenHandles: false
```

**Developer Tools**:
- **Intelligent Watching**: Typeahead search for test files and names
- **Deprecation Warnings**: Early warning for deprecated APIs
- **Handle Detection**: Configurable for debugging hanging processes

## Frontend Test Configuration (Vitest)

### Configuration File: `frontend/vitest.config.ts`

#### 1. Core Vitest Configuration
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
})
```

**Key Features**:
- **Vite Integration**: Native Vite ecosystem support
- **React Plugin**: Optimized React component testing
- **Global APIs**: Jest-compatible global test functions
- **jsdom Environment**: Browser simulation for DOM testing

#### 2. Coverage Configuration
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
  exclude: [
    'node_modules/**',
    'dist/**',
    '**/*.config.*',
    '**/*.test.*',
    '**/test/**'
  ]
}
```

**Coverage Features**:
- **V8 Provider**: Fast, accurate coverage with Chrome's V8 engine
- **Multiple Reporters**: Text, HTML, and LCOV formats
- **Smart Exclusions**: Excludes configuration, test files, and build artifacts
- **Build Integration**: Works seamlessly with Vite's build process

#### 3. Test Setup Configuration

**Setup File**: `frontend/src/test/setup.ts`
```typescript
import '@testing-library/jest-dom'

// Add any global test setup here
export {}
```

**Setup Features**:
- **Jest-DOM Integration**: Custom matchers for DOM testing
- **Global Configuration**: Centralized test environment setup
- **Type Safety**: TypeScript configuration for test setup
- **Extensibility**: Easy addition of global test utilities

## Integration with CI/CD Pipeline

### Backend Testing in GitHub Actions
```yaml
- name: Run unit tests with coverage
  working-directory: ./backend
  env:
    NODE_ENV: test
    JWT_SECRET: test-jwt-secret-for-github-actions
  run: npm run test:coverage
```

**CI/CD Features**:
- **Environment Configuration**: Test-specific environment variables
- **Coverage Generation**: Automatic coverage report creation
- **Fail-Fast**: Immediate failure on test failures
- **Coverage Upload**: Integration with Codecov

### Frontend Testing in GitHub Actions
```yaml
- name: Run frontend unit tests
  working-directory: ./frontend
  run: npm run test:unit -- --passWithNoTests
```

**CI/CD Features**:
- **Graceful Handling**: Passes when no tests exist (for gradual implementation)
- **Parallel Execution**: Runs alongside backend tests
- **Build Integration**: Ensures tests pass before building

## Test Scripts Configuration

### Backend NPM Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

### Frontend NPM Scripts
```json
{
  "scripts": {
    "test:unit": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Advanced Testing Features

### 1. Database Testing with MongoDB Memory Server
```typescript
// Example test configuration
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

**Benefits**:
- **Isolation**: Each test suite gets a fresh database
- **Speed**: In-memory database for fast test execution
- **Consistency**: Identical database state across environments
- **Clean State**: No test pollution between runs

### 2. API Testing with Supertest
```typescript
describe('Authentication API', () => {
  it('should authenticate valid user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send(validCredentials)
      .expect(200);

    expect(response.body).toHaveProperty('token');
  });
});
```

**Features**:
- **HTTP Testing**: Full request/response testing
- **Assertion Integration**: Works with Jest/Vitest assertions
- **Middleware Testing**: Tests entire request pipeline
- **Status Code Validation**: Built-in HTTP status checking

### 3. React Component Testing
```typescript
describe('ProductCard Component', () => {
  it('should render product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
  });
});
```

**Testing Library Benefits**:
- **User-Centric Testing**: Tests from user perspective
- **Accessibility Focus**: Encourages accessible component design
- **Async Support**: Built-in handling for async operations
- **Event Testing**: Comprehensive user interaction testing

## Coverage Threshold Strategy

### Backend Coverage Targets
```javascript
coverageThreshold: {
  global: {
    branches: 50,    // Conditional logic coverage
    functions: 60,   // Function execution coverage
    lines: 65,       // Line execution coverage
    statements: 65   // Statement execution coverage
  }
}
```

### Incremental Improvement Plan
1. **Phase 1**: Establish baseline (current thresholds)
2. **Phase 2**: Increase to 70% across all metrics
3. **Phase 3**: Target 80% for critical business logic
4. **Phase 4**: Achieve 85%+ for production readiness

## Mock Strategy and Configuration

### Automatic Mock Management
```javascript
clearMocks: true,      // Clear mock calls between tests
resetMocks: true,      // Reset mock implementations
restoreMocks: true     // Restore original implementations
```

### Manual Mock Examples
```typescript
// Database mock
jest.mock('../config/database', () => ({
  connect: jest.fn(),
  disconnect: jest.fn()
}));

// External service mock
jest.mock('../services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true)
}));
```

## Performance Optimization

### Test Execution Performance
- **Parallel Execution**: 50% worker utilization
- **Incremental Testing**: TypeScript incremental compilation
- **Selective Testing**: Run only changed test files
- **Memory Management**: Automatic cleanup and force exit

### Coverage Performance
- **Smart Collection**: Only when --coverage flag is used
- **Exclusion Patterns**: Skip non-business logic files
- **Report Optimization**: Multiple formats for different use cases
- **Threshold Enforcement**: Fast fail on coverage violations

## Quality Assurance Features

### 1. Type Safety in Tests
```typescript
// Strongly typed test data
interface TestUser {
  email: string;
  password: string;
  username: string;
}

const createTestUser = (): TestUser => ({
  email: 'test@example.com',
  password: 'securePassword123',
  username: 'testuser'
});
```

### 2. Test Data Management
```typescript
// Centralized test fixtures
export const testData = {
  users: {
    validUser: createTestUser(),
    invalidUser: { email: 'invalid' }
  },
  products: {
    validCapsule: createTestCapsule()
  }
};
```

### 3. Error Handling Testing
```typescript
describe('Error Handling', () => {
  it('should handle database connection failures', async () => {
    jest.spyOn(mongoose, 'connect').mockRejectedValue(new Error('Connection failed'));

    await expect(connectToDatabase()).rejects.toThrow('Connection failed');
  });
});
```

## Best Practices Implemented

### 1. Test Organization
```
src/
├── tests/
│   ├── fixtures/        # Test data and fixtures
│   ├── utils/          # Test helper functions
│   ├── models/         # Model testing
│   └── routes/         # API endpoint testing
```

### 2. Naming Conventions
- **Test Files**: `*.test.ts` or `*.spec.ts`
- **Test Suites**: Descriptive `describe` blocks
- **Test Cases**: Behavior-driven `it` statements
- **Fixtures**: Clearly named test data files

### 3. Test Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup for each test
  });

  describe('when condition is met', () => {
    it('should perform expected behavior', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Troubleshooting Guide

### Common Issues

#### 1. TypeScript Compilation Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit
# Verify Jest TypeScript integration
npm run test -- --verbose
```

#### 2. Module Resolution Issues
```bash
# Verify path aliases
npm run test -- --showConfig
# Check moduleNameMapper configuration
```

#### 3. Coverage Collection Problems
```bash
# Generate coverage report
npm run test:coverage
# Check coverage exclusions
npm run test -- --coverage --verbose
```

#### 4. Async Test Timeouts
```bash
# Increase timeout for specific tests
jest.setTimeout(30000)
# Check for hanging promises
npm run test -- --detectOpenHandles
```

## Integration Testing Strategy

### API Integration Tests
- **Full Stack Testing**: Database to API response
- **Middleware Testing**: Authentication, validation, logging
- **Error Scenario Testing**: Edge cases and error conditions
- **Performance Testing**: Response time validation

### Component Integration Tests
- **User Flow Testing**: Multi-step user interactions
- **State Management Testing**: Redux/Context integration
- **API Integration Testing**: Component to backend communication
- **Routing Testing**: Navigation and route protection

## Future Enhancements

### Planned Improvements
1. **Snapshot Testing**: Visual regression testing for components
2. **E2E Integration**: Playwright integration with unit tests
3. **Performance Testing**: Memory and CPU usage monitoring
4. **Mutation Testing**: Code quality validation with mutation testing

### Advanced Features
1. **Test Parallelization**: Distributed testing across multiple machines
2. **Visual Testing**: Automated visual regression detection
3. **Contract Testing**: API contract validation with Pact
4. **Load Testing**: Integration with K6 performance testing

## Metrics and Monitoring

### Test Metrics Tracked
- **Test Success Rate**: Percentage of passing tests
- **Coverage Trends**: Coverage improvement over time
- **Test Execution Time**: Performance monitoring
- **Test Stability**: Flaky test detection and resolution

### Quality Metrics
- **Code Quality**: ESLint integration with tests
- **Type Safety**: TypeScript strict mode compliance
- **Security**: Security-focused test scenarios
- **Performance**: Response time and resource usage testing

## Conclusion

The comprehensive test configuration implemented in this branch establishes a robust foundation for quality assurance that supports both development velocity and production reliability. The combination of Jest for backend testing and Vitest for frontend testing provides modern, performant, and feature-rich testing capabilities that align with the "Quality Guardian" philosophy.

This configuration demonstrates enterprise-level testing practices suitable for Senior QA Engineer responsibilities, including coverage enforcement, CI/CD integration, type safety, and comprehensive quality metrics tracking.