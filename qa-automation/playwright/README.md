# E2E Testing with Playwright + BDD

> **Comprehensive End-to-End testing suite for The Cosmic Coffeehouse using Playwright and Cucumber BDD**

## 🚀 Quick Start

```bash
# Install dependencies and browsers
npm run setup

# Run smoke tests
npm run test:smoke

# View test report
npm run report

# Debug failing tests
npm run show-trace test-results/traces/[test-name].zip
```

## 📋 Available Commands

### **Cucumber Testing (Primary)**
```bash
npm run test              # Run all tests
npm run test:smoke        # Run smoke tests (@smoke)
npm run test:regression   # Run regression tests (@regression)
npm run test:critical     # Run critical tests (@critical)
npm run test:headed       # Run with visible browser
npm run test:debug        # Debug smoke tests
npm run test:tags "@tag"  # Run custom tag combinations
```

### **Playwright-BDD Testing (Alternative)**
```bash
npm run test:pw           # Run with Playwright Test Runner
npm run test:pw:smoke     # Playwright smoke tests
npm run test:pw:ui        # Playwright UI mode
npm run test:pw:debug     # Playwright debug mode
```

### **Reports & Debugging**
```bash
npm run report            # Open Cucumber HTML report
npm run report:pw         # Open Playwright HTML report
npm run show-trace <file> # View detailed test trace
```

### **Development**
```bash
npm run codegen           # Generate tests with Playwright
npm run lint              # TypeScript type checking
npm run clean             # Clean up test artifacts
```

## 🎨 Features

- ✅ **BDD with Gherkin** - Business-readable test scenarios
- ✅ **Screenshots & Videos** - Automatic capture on failures
- ✅ **Traces & Debugging** - Detailed execution analysis
- ✅ **Cross-Browser Testing** - Chrome, Firefox, Safari
- ✅ **Page Object Model** - Maintainable test architecture
- ✅ **CI/CD Integration** - JUnit XML and JSON reports
- ✅ **TypeScript** - Type safety and excellent DX
- ✅ **Dual Test Runners** - Cucumber OR Playwright Test Runner

## 🏷️ Test Tags

| Tag | Purpose | Usage |
|-----|---------|-------|
| `@smoke` | Quick confidence checks | `npm run test:smoke` |
| `@critical` | Must-never-fail tests | `npm run test:critical` |
| `@regression` | Comprehensive coverage | `npm run test:regression` |
| `@performance` | Speed and efficiency | `npm run test:tags "@performance"` |

## 📁 Project Structure

```
features/          # Gherkin feature files
steps/            # Cucumber step definitions
steps-pw/         # Playwright-BDD step definitions
pages/            # Page Object Model
test-results/     # Videos, traces, screenshots
reports/          # HTML test reports
```

## 🔧 Configuration

- **cucumber.js** - Cucumber test runner config
- **playwright.config.ts** - Playwright browser config
- **playwright-bdd.config.ts** - Playwright-BDD integration
- **tsconfig.json** - TypeScript settings

## 📊 Test Reports

After running tests, you get:

1. **📸 Screenshots** - Embedded in HTML reports
2. **🎥 Videos** - Full test execution recordings
3. **🔍 Traces** - Interactive debugging with DOM snapshots
4. **📈 HTML Reports** - Beautiful test result visualization
5. **🤖 CI Reports** - JUnit XML for pipeline integration

## 🆘 Troubleshooting

**Tests not finding elements?**
- Check selectors in Page Object files
- Use `npm run test:headed` to see browser actions

**Need to debug a failure?**
- Use `npm run show-trace <trace-file>`
- Check videos in `test-results/videos/`
- Review screenshots in HTML reports

**Want Playwright's native HTML report?**
- Use `npm run test:pw:smoke` instead
- View with `npm run report:pw`

For detailed documentation, see [E2E-TESTING-DOCUMENTATION.md](./E2E-TESTING-DOCUMENTATION.md)