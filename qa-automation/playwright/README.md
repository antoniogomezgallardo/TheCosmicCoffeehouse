# E2E Testing Foundation with Playwright & BDD

## 🎯 Phase 2 Implementation Summary

This directory contains the **End-to-End testing foundation** for The Cosmic Coffeehouse, implementing **Behavior-Driven Development (BDD)** methodology with **Playwright** and **Cucumber**.

### 🏗️ Architecture Overview

```
qa-automation/playwright/
├── config/                 # Global setup and configuration
│   ├── global-setup.ts     # Pre-test environment setup
│   └── global-teardown.ts  # Post-test cleanup
├── features/               # BDD Feature files (Gherkin)
│   ├── user-authentication.feature
│   └── e-commerce-workflow.feature
├── pages/                  # Page Object Model classes
│   ├── BasePage.ts         # Base page with common functionality
│   ├── HomePage.ts         # Home page interactions
│   └── AuthPage.ts         # Authentication page interactions
├── steps/                  # Cucumber step definitions
│   ├── common.steps.ts     # Shared step definitions
│   └── authentication.steps.ts # Auth-specific steps
├── tests/                  # Traditional Playwright tests
│   └── smoke.spec.ts       # Smoke test suite
├── fixtures/               # Test data and utilities
├── utils/                  # Helper functions
├── reports/                # Test execution reports
├── test-results/           # Screenshots, videos, traces
├── playwright.config.ts    # Playwright configuration
├── cucumber.js            # Cucumber configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🚀 Features Implemented

### ✅ Cross-Browser Testing
- **Chromium** (Google Chrome, Microsoft Edge)
- **Firefox** (Mozilla Firefox)
- **WebKit** (Safari)
- **Mobile browsers** (Mobile Chrome, Mobile Safari)

### ✅ Page Object Model (POM)
- **BasePage**: Common functionality for all pages
- **HomePage**: Home page interactions and navigation
- **AuthPage**: Login/registration functionality
- **Extensible**: Easy to add new page objects

### ✅ BDD Implementation
- **Cucumber integration** with TypeScript
- **Gherkin feature files** for business-readable tests
- **Step definitions** implementing the scenarios
- **Multiple test profiles** (smoke, regression, critical)

### ✅ Test Categories
- **@smoke**: Quick tests for basic functionality
- **@critical**: Essential user journeys
- **@regression**: Comprehensive test coverage
- **@performance**: Performance-focused tests

### ✅ Advanced Features
- **Global setup/teardown** for environment preparation
- **Screenshot/video capture** on failures
- **Network request interception**
- **Mobile responsive testing**
- **Parallel test execution**
- **Retry mechanisms** for flaky tests

## 📋 Prerequisites

### Required Software
- **Node.js** 16+ and npm
- **Playwright** browsers (auto-installed)
- **Backend API** running on port 3001
- **Frontend app** running on port 5174

### Environment Setup
```bash
cd qa-automation/playwright
npm install
npm run setup  # Install browsers and dependencies
```

## 🏃‍♂️ Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run with visible browser
npm run test:headed

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile
```

### Test Categories
```bash
# Smoke tests (fast, essential)
npm run test:smoke

# Critical user journeys
npm run test:critical

# Full regression suite
npm run test:regression
```

### BDD/Cucumber Tests
```bash
# Run all Cucumber scenarios
npm run cucumber

# Run specific tags
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical and not @skip"

# Generate HTML report
npm run cucumber:report
```

### Debug & Development
```bash
# Debug mode (step-by-step)
npm run test:debug

# Interactive UI mode
npm run test:ui

# Generate new test code
npm run codegen
```

## 📊 Reporting

### Playwright Reports
- **HTML Report**: `test-results/html/index.html`
- **JUnit XML**: `test-results/junit.xml`
- **JSON Report**: `test-results/results.json`

### Cucumber Reports
- **HTML Report**: `reports/cucumber-report.html`
- **JSON Report**: `reports/cucumber-report.json`

### View Reports
```bash
# Show Playwright report
npm run report

# Open Cucumber report
open reports/cucumber-report.html
```

## 🔧 Configuration

### Environment Variables
```bash
# Browser selection
BROWSER=chromium|firefox|webkit

# Display mode
HEADED=true          # Show browser
HEADLESS=false       # Hide browser

# Performance
SLOW_MO=500         # Slow down actions (ms)

# Test execution
FAIL_FAST=true      # Stop on first failure
PARALLEL=2          # Number of parallel workers

# Application URLs
BASE_URL=http://localhost:5174
API_URL=http://localhost:3001
```

### Playwright Configuration
The `playwright.config.ts` file includes:
- **Multi-browser testing** across 6+ browsers
- **Mobile device emulation**
- **Automatic retries** on CI
- **Video/screenshot capture**
- **Parallel execution**
- **Global setup/teardown**

### Cucumber Profiles
Multiple test profiles in `cucumber.js`:
- **default**: All tests with standard settings
- **smoke**: Fast smoke tests only
- **regression**: Full regression suite
- **critical**: Critical path tests with retries

## 📝 Writing Tests

### BDD Feature Files
Create feature files in `features/` directory:

```gherkin
@smoke @critical
Feature: User Authentication
  As a customer of The Cosmic Coffeehouse
  I want to be able to login to my account
  So that I can access personalized features

  Scenario: Successful user login
    Given I am on the login page
    When I login with valid credentials:
      | email    | test@example.com |
      | password | TestPassword123! |
    Then I should be successfully logged in
```

### Step Definitions
Implement steps in `steps/` directory:

```typescript
When('I login with valid credentials:', async function (dataTable) {
  const credentials = dataTable.rowsHash();
  await authPage.login(credentials.email, credentials.password);
});
```

### Page Objects
Create page objects extending `BasePage`:

```typescript
export class MyPage extends BasePage {
  private readonly myButton: Locator;

  constructor(page: Page) {
    super(page, '/my-page');
    this.myButton = page.locator('[data-testid="my-button"]');
  }

  async clickMyButton(): Promise<void> {
    await this.myButton.click();
  }
}
```

### Traditional Playwright Tests
Create spec files in `tests/` directory:

```typescript
test('should do something @smoke', async ({ page }) => {
  const myPage = new MyPage(page);
  await myPage.goto();
  await myPage.clickMyButton();
  await expect(page).toHaveURL(/success/);
});
```

## 🎯 Test Scenarios Covered

### Authentication Scenarios
- ✅ User registration with valid data
- ✅ User login with valid credentials
- ✅ Login with invalid credentials (error handling)
- ✅ Registration with invalid data (validation)
- ✅ Duplicate email registration (error handling)
- ✅ User logout functionality

### E-commerce Workflows
- ✅ Guest checkout workflow
- ✅ Authenticated user checkout
- ✅ Shopping cart persistence
- ✅ Product catalog browsing
- ✅ Cart management (add/update/remove)
- ✅ Empty cart handling

### Smoke Tests
- ✅ Home page loading
- ✅ Navigation functionality
- ✅ API connectivity
- ✅ Mobile responsiveness
- ✅ Performance thresholds
- ✅ Error handling

## 🔍 Best Practices Implemented

### Test Design
- **Page Object Model** for maintainable tests
- **BDD approach** for business-readable scenarios
- **Test isolation** with proper setup/teardown
- **Retry mechanisms** for flaky tests
- **Parallel execution** for faster feedback

### Code Quality
- **TypeScript** for type safety
- **ESLint integration** for code standards
- **Modular architecture** for reusability
- **Comprehensive logging** for debugging
- **Error handling** for robust tests

### CI/CD Integration
- **Multiple browsers** support
- **Headless execution** for CI environments
- **XML/JSON reports** for CI integration
- **Screenshot/video capture** for debugging
- **Environment-specific configuration**

## 🚨 Known Limitations

### Current Limitations
- **Frontend UI**: Tests use flexible selectors (no data-testid attributes yet)
- **Test Data**: Uses hardcoded test data (can be enhanced with fixtures)
- **Authentication**: Basic login/logout (can be expanded for JWT handling)
- **API Testing**: Limited to connectivity checks (can be enhanced)

### Future Enhancements
- **Visual regression testing** with screenshot comparison
- **API contract testing** with Pact or similar
- **Database state management** for data-driven tests
- **Custom reporting** with business metrics
- **Integration** with test management tools

## 📈 Success Metrics

### Phase 2 Achievements
- **Cross-browser support**: 6+ browser configurations
- **BDD implementation**: Gherkin scenarios with Cucumber
- **Page Object Model**: Maintainable, reusable page classes
- **Test categories**: Smoke, critical, regression, performance
- **Comprehensive reporting**: HTML, JSON, JUnit formats
- **CI/CD ready**: Headless execution with parallel support

### Quality Indicators
- ✅ **Framework Setup**: Complete Playwright + Cucumber integration
- ✅ **Test Structure**: Organized, maintainable test architecture
- ✅ **Browser Coverage**: Desktop and mobile browser support
- ✅ **BDD Implementation**: Business-readable test scenarios
- ✅ **Reporting**: Multiple format support for different stakeholders
- ✅ **Documentation**: Comprehensive setup and usage guides

## 🔗 Integration

### With Existing Project
- **Frontend**: Tests adapt to current UI structure
- **Backend**: API connectivity verification included
- **CI/CD**: Ready for GitHub Actions integration
- **Monitoring**: Error tracking and performance metrics

### Development Workflow
1. **Write features** in Gherkin format
2. **Implement step definitions** for scenarios
3. **Create page objects** for new pages
4. **Run tests** in development environment
5. **Review reports** and fix issues
6. **Integrate** with CI/CD pipeline

---

*This E2E testing foundation provides a comprehensive, maintainable, and scalable approach to end-to-end testing for The Cosmic Coffeehouse, demonstrating Senior QA Engineer capabilities in test automation, BDD implementation, and quality assurance practices.*