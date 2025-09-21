# Unit Test Metrics Guide

## 📊 Overview

This document defines the key metrics for measuring unit test effectiveness, based on industry best practices and research. These metrics help ensure our tests provide value while maintaining efficiency.

## 🎯 Primary Metrics (Must Have)

### 1. Code Coverage (Target: 80-85%)

**Definition**: Percentage of code executed during test runs.

#### Types of Coverage

| Metric | Description | Target | Priority |
|--------|-------------|--------|----------|
| **Line Coverage** | % of code lines executed | 80% | High |
| **Branch Coverage** | % of decision branches tested | 75% | High |
| **Function Coverage** | % of functions called | 80% | Medium |
| **Statement Coverage** | % of statements executed | 80% | Medium |

#### Why Not 100%?

Research shows diminishing returns above 80-85%:
- **80% coverage** catches ~95% of bugs
- **100% coverage** requires 3x more effort for minimal gain
- Focus on critical paths over total coverage

#### Measurement

```bash
# Run tests with coverage
npm run test:coverage

# View detailed report
open coverage/index.html
```

### 2. Cyclomatic Complexity Coverage

**Definition**: Ensuring complex code paths are well-tested.

#### Complexity Levels

| Complexity | Risk Level | Coverage Target | Description |
|------------|------------|-----------------|-------------|
| 1-10 | Low | 70% | Simple, linear code |
| 11-20 | Medium | 85% | Moderate complexity |
| 21-50 | High | 95% | Complex, error-prone |
| 50+ | Very High | 100% | Requires refactoring |

#### Formula

```
Risk Score = Cyclomatic Complexity × (1 - Coverage)
```

**Example**:
- Function with complexity 15 and 60% coverage
- Risk Score = 15 × 0.4 = 6 (High priority for testing)

### 3. Test Execution Time

**Definition**: Time taken to run the complete test suite.

| Test Type | Target Time | Maximum Time |
|-----------|-------------|--------------|
| Single Unit Test | <10ms | 50ms |
| Test Suite | <1s | 5s |
| All Unit Tests | <10s | 30s |
| With Coverage | <30s | 60s |

#### Performance Optimization

```javascript
// Use describe.concurrent for parallel tests
describe.concurrent('User Service', () => {
  test('should create user', async () => { /* ... */ });
  test('should update user', async () => { /* ... */ });
});
```

### 4. Test Success Rate

**Definition**: Percentage of tests passing consistently.

| Metric | Target | Action Threshold |
|--------|--------|------------------|
| Pass Rate | >98% | <95% requires investigation |
| Flaky Tests | <2% | >5% requires fixing |
| False Positives | 0% | Any occurrence requires fix |

## 📈 Secondary Metrics (Nice to Have)

### 1. Mutation Testing Score

**Definition**: Percentage of code mutations detected by tests.

#### What is Mutation Testing?

Mutation testing introduces small changes (mutations) to code and checks if tests detect them:

```javascript
// Original code
function add(a, b) {
  return a + b;  // Mutation: change + to -
}

// Good test detects the mutation
expect(add(2, 3)).toBe(5); // Fails with mutation

// Poor test might not detect it
expect(add(0, 0)).toBe(0); // Passes even with mutation
```

**Target**: >75% mutation score

### 2. Test Maintenance Burden

**Definition**: Time spent maintaining tests vs. writing new features.

| Metric | Healthy Range | Warning Signs |
|--------|---------------|---------------|
| Test/Code Ratio | 1:1 to 2:1 | >3:1 (over-testing) |
| Test Fix Time | <20% of dev time | >40% indicates brittle tests |
| Test Updates per Feature | 1-3 tests | >5 tests suggests coupling |

### 3. Defect Detection Rate

**Definition**: Percentage of bugs caught by unit tests before production.

```
Detection Rate = (Bugs Found by Unit Tests / Total Bugs Found) × 100
```

**Target**: >60% of bugs caught in unit testing phase

## 🎭 Risk-Based Metrics

### Coverage × Complexity Matrix

Prioritize testing based on risk:

```
Priority Score = (Cyclomatic Complexity × Business Impact) / Current Coverage
```

| Priority Score | Action |
|----------------|--------|
| >20 | Critical - Test immediately |
| 10-20 | High - Test this sprint |
| 5-10 | Medium - Test next sprint |
| <5 | Low - Test if time permits |

### Critical Path Coverage

**Definition**: Coverage of business-critical functions.

| Function Type | Coverage Target | Examples |
|---------------|-----------------|----------|
| Authentication | 100% | Login, JWT validation |
| Payment Processing | 100% | Checkout, refunds |
| Core Business Logic | 95% | Price calculation, inventory |
| User Interface | 80% | Form validation, display |
| Utilities | 70% | Formatting, helpers |

## 📏 Measurement Tools & Techniques

### 1. Coverage Tools

```bash
# Jest built-in coverage
jest --coverage

# NYC for detailed reports
nyc --reporter=html --reporter=text jest

# Stryker for mutation testing
npx stryker run
```

### 2. Complexity Analysis

```bash
# Using complexity-report
npx complexity-report src/**/*.js

# Using plato for visualization
npx plato -r -d report src
```

### 3. Custom Metrics Script

```javascript
// scripts/testMetrics.js
const fs = require('fs');
const coverage = require('./coverage/coverage-summary.json');

function calculateMetrics() {
  const metrics = {
    lineCoverage: coverage.total.lines.pct,
    branchCoverage: coverage.total.branches.pct,
    complexityWeight: calculateComplexityWeight(),
    riskScore: calculateRiskScore()
  };

  console.table(metrics);
  return metrics;
}

function calculateRiskScore() {
  // Custom risk calculation
  const complexity = getAverageComplexity();
  const coverage = coverage.total.lines.pct;
  return complexity * (100 - coverage) / 100;
}
```

## 📊 Reporting & Tracking

### Dashboard Metrics

Create a test metrics dashboard tracking:

```javascript
{
  "date": "2025-01-20",
  "metrics": {
    "coverage": {
      "lines": 82.5,
      "branches": 78.3,
      "functions": 85.1,
      "statements": 81.9
    },
    "performance": {
      "totalTests": 256,
      "executionTime": 8.4,
      "avgTestTime": 0.033
    },
    "quality": {
      "passRate": 98.8,
      "flakyTests": 3,
      "mutationScore": 76.2
    },
    "complexity": {
      "avgComplexity": 4.2,
      "highComplexityFiles": 5,
      "untestableFunctions": 2
    }
  }
}
```

### Trend Analysis

Track metrics over time:

| Week | Coverage | Test Time | Pass Rate | Issues Found |
|------|----------|-----------|-----------|--------------|
| 1 | 75% | 12s | 96% | 8 |
| 2 | 78% | 11s | 97% | 5 |
| 3 | 80% | 10s | 98% | 3 |
| 4 | 82% | 9s | 99% | 1 |

## 🎯 Setting Realistic Targets

### Initial Phase (Months 1-3)
- Code Coverage: 60%
- Test Execution: <30s
- Pass Rate: >95%

### Growth Phase (Months 4-6)
- Code Coverage: 75%
- Test Execution: <20s
- Pass Rate: >97%
- Mutation Score: >60%

### Mature Phase (Months 7+)
- Code Coverage: 80-85%
- Test Execution: <10s
- Pass Rate: >98%
- Mutation Score: >75%

## 🚨 Warning Signs

### Metrics indicating problems:

1. **Declining Coverage** - New code not being tested
2. **Increasing Test Time** - Tests becoming slow/inefficient
3. **Rising Flaky Test Rate** - Tests with inconsistent results
4. **High Maintenance Burden** - Tests too tightly coupled
5. **Low Mutation Score** - Tests not catching changes

## 📈 Continuous Improvement

### Monthly Review Checklist

- [ ] Review coverage trends
- [ ] Analyze test execution times
- [ ] Identify and fix flaky tests
- [ ] Update high-complexity function tests
- [ ] Review test maintenance effort
- [ ] Calculate defect detection rate
- [ ] Run mutation testing analysis

### Improvement Actions

| Problem | Solution |
|---------|----------|
| Low Coverage | Add tests for uncovered critical paths |
| Slow Tests | Mock external dependencies, use test doubles |
| Flaky Tests | Remove timing dependencies, fix race conditions |
| High Maintenance | Reduce coupling, use better abstractions |
| Low Mutation Score | Write stronger assertions, test edge cases |

## 🔧 Implementation Example

```javascript
// Example: Tracking metrics in Jest
// jest.config.js
module.exports = {
  coverageReporters: ['json-summary', 'text', 'html'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/models/': {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'reports' }],
    ['jest-html-reporter', { pageTitle: 'Test Report' }]
  ]
};
```

## 📚 References & Tools

### Measurement Tools
- **Jest**: Built-in coverage reporting
- **Istanbul/NYC**: Advanced coverage analysis
- **Stryker**: Mutation testing for JavaScript
- **SonarQube**: Code quality and test metrics
- **Codecov**: Coverage tracking and reporting

### Best Practices Sources
- [Google Testing Blog](https://testing.googleblog.com/)
- [Microsoft Test Guidelines](https://docs.microsoft.com/en-us/dotnet/core/testing/unit-testing-best-practices)
- [Martin Fowler's Testing Strategies](https://martinfowler.com/testing/)

### Industry Benchmarks
- Google: 85% coverage target
- Microsoft: 80% coverage minimum
- Facebook: 70% coverage with mutation testing
- Netflix: Focus on critical path coverage (100%)

---

*Last Updated: January 2025*
*Version: 1.0.0*
*Based on current industry best practices and research*