# 🔍 E2E Test Debugging Guide

## 📚 **Table of Contents**
1. [Quick Start](#quick-start)
2. [Debugging Methods](#debugging-methods)
3. [Common Issues & Solutions](#common-issues--solutions)
4. [Pro Debugging Techniques](#pro-debugging-techniques)
5. [Troubleshooting Checklist](#troubleshooting-checklist)

---

## 🚀 **Quick Start**

### **When a Test Fails, Start Here:**

```bash
# 1. Run in UI Mode (BEST for debugging)
npm run test:ui

# 2. Run specific test in debug mode
npm run test:debug -- --grep "test name"

# 3. Run with trace viewer
npm run test:trace -- --grep "test name"
```

---

## 🛠️ **Debugging Methods**

### **1. UI Mode (Interactive Debugging) - RECOMMENDED**
The most powerful debugging tool for Playwright tests.

```bash
npm run test:ui
```

**Features:**
- ✅ Watch tests run in real-time
- ✅ Time-travel debugging
- ✅ Step through each action
- ✅ Inspect network requests
- ✅ View console logs
- ✅ Explore DOM snapshots

**How to use:**
1. Launch UI mode
2. Find your test in the list
3. Click play button
4. After failure, click "Show trace"
5. Use timeline to navigate through steps

### **2. Debug Mode (Step-by-Step)**
Opens Playwright Inspector for interactive debugging.

```bash
# Debug specific scenario (Unix/Linux/Git Bash)
npm run bddgen && npx playwright test -c playwright-bdd.config.ts --debug --grep "Successful user registration"

# Debug with specific browser (Unix/Linux/Git Bash)
npm run bddgen && npx playwright test -c playwright-bdd.config.ts --debug --project=chromium --grep "test name"
```

**For PowerShell/CMD on Windows:**
```powershell
# Debug specific scenario (PowerShell)
npm run bddgen; npx playwright test -c playwright-bdd.config.ts --debug --grep "Successful user registration"

# Or use the predefined scripts
npm run test:debug -- --grep "Successful user registration"
```

**Inspector Features:**
- Pause/Resume execution
- Step over actions
- Pick selector tool
- Console evaluation

### **3. Headed Mode (Watch It Run)**
See the browser while tests execute.

```bash
# Run specific test with visible browser
npm run test:smoke:headed -- --grep "test name"

# Or directly
npx playwright test --headed --project=chromium --grep "test name"
```

**When to use:**
- Quick visual verification
- Checking UI interactions
- Spotting timing issues

### **4. Trace Viewer (Post-Mortem Analysis)**
Comprehensive test execution recording.

```bash
# Run with trace (Unix/Linux/Git Bash)
npx playwright test --trace on --grep "test name"

# PowerShell/CMD
npm run test:trace -- --grep "test name"

# View trace after failure
npx playwright show-trace

# Open specific trace file
npx playwright show-trace test-results/your-test/trace.zip
```

**Trace Contains:**
- Screenshots before/after each action
- Full DOM snapshots
- Network activity
- Console logs
- Error details

### **5. VSCode Debugging**
Debug tests directly in VSCode.

**Setup `.vscode/launch.json`:**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug E2E Test",
      "program": "${workspaceFolder}/qa-automation/playwright/node_modules/.bin/playwright",
      "args": ["test", "--grep", "test name", "--debug"],
      "cwd": "${workspaceFolder}/qa-automation/playwright",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## 💻 **Windows PowerShell Commands**

When using VSCode with PowerShell terminal, use these commands instead of bash syntax:

### **Quick Scenario Debugging Scripts**
```powershell
# Debug specific scenario (Inspector mode)
npm run debug:scenario "Successful user registration"

# Debug scenario with visible browser
npm run debug:scenario:headed "Successful user registration"

# Debug scenario with UI mode (BEST for exploration)
npm run debug:scenario:ui "Successful user registration"

# Debug scenario with trace recording
npm run debug:scenario:trace "Successful user registration"
```

### **Traditional Commands**
```powershell
# Debug specific test (old way)
npm run test:debug -- --grep "Successful user registration"

# Run with trace
npm run test:trace -- --grep "Successful user registration"

# Run in UI mode
npm run test:ui

# Run headed mode
npm run test:smoke:headed

# View trace
npm run trace:show
```

---

## 🔧 **Pro Debugging Techniques**

### **1. Add Strategic Console Logs**

```typescript
// In your step definitions
When('I register with valid credentials:', async ({ page, authPage }, table: any) => {
  const data = table.rowsHash();

  // Log input data
  console.log('📝 Registration data:', JSON.stringify(data, null, 2));

  // Log current state
  console.log('📍 Current URL:', page.url());
  console.log('🔍 Page title:', await page.title());

  // Log before action
  console.log('⏳ Starting registration...');

  await authPage.register(data);

  // Log after action
  console.log('✅ Registration submitted');
});
```

### **2. Take Debug Screenshots**

```typescript
Then('I should be successfully registered', async ({ page }) => {
  // Take screenshot before assertion
  await page.screenshot({
    path: `debug-screenshots/registration-${Date.now()}.png`,
    fullPage: true
  });

  // Your assertion
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

### **3. Inspect Page Content**

```typescript
// Debug helper to see what's on the page
async function debugPage(page: Page) {
  // Get all data-testids
  const testIds = await page.evaluate(() => {
    const elements = document.querySelectorAll('[data-testid]');
    return Array.from(elements).map(el => ({
      testId: el.getAttribute('data-testid'),
      text: el.textContent?.trim(),
      visible: !!(el as HTMLElement).offsetParent,
      tagName: el.tagName.toLowerCase()
    }));
  });
  console.log('🏷️ Available data-testids:', testIds);

  // Check for error messages
  const errors = await page.locator('.error, [role="alert"]').allTextContents();
  if (errors.length) {
    console.log('❌ Error messages found:', errors);
  }

  // Current URL
  console.log('📍 Current URL:', page.url());
}

// Use in your test
Then('I should be successfully registered', async ({ page }) => {
  await debugPage(page);
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

### **4. Use Page.pause()**

```typescript
Then('I should see the dashboard', async ({ page }) => {
  // This pauses execution and opens Inspector
  await page.pause();

  // Continue with assertions
  await expect(page).toHaveURL(/dashboard/);
});
```

### **5. Network Monitoring**

```typescript
// Monitor API calls
page.on('response', response => {
  if (response.url().includes('/api/')) {
    console.log(`📡 API ${response.request().method()} ${response.url()}: ${response.status()}`);

    // Log error responses
    if (response.status() >= 400) {
      response.text().then(body => {
        console.error('❌ API Error:', body);
      });
    }
  }
});

// Monitor failed requests
page.on('requestfailed', request => {
  console.error('❌ Request failed:', request.url(), request.failure());
});
```

### **6. Wait Helpers**

```typescript
// Custom wait helpers for debugging
async function waitAndLog(page: Page, message: string, ms: number = 1000) {
  console.log(`⏳ ${message}... waiting ${ms}ms`);
  await page.waitForTimeout(ms);
}

// Use in tests
await waitAndLog(page, 'Waiting for registration to process', 2000);
```

### **7. Element State Debugging**

```typescript
// Check element state before interaction
async function debugElement(page: Page, selector: string) {
  const element = page.locator(selector);

  console.log(`🔍 Debugging: ${selector}`);
  console.log('  Visible:', await element.isVisible());
  console.log('  Enabled:', await element.isEnabled());
  console.log('  Editable:', await element.isEditable());
  console.log('  Count:', await element.count());

  if (await element.isVisible()) {
    console.log('  Text:', await element.textContent());
    console.log('  Value:', await element.inputValue().catch(() => 'N/A'));
  }
}

// Use before interactions
await debugElement(page, '[data-testid="submit-button"]');
await page.click('[data-testid="submit-button"]');
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Element Not Found**
```typescript
Error: locator.click: Timeout 30000ms exceeded
```

**Solutions:**
```typescript
// 1. Wait for element
await page.waitForSelector('[data-testid="element"]', { timeout: 10000 });

// 2. Check if element exists first
if (await page.locator('[data-testid="element"]').count() > 0) {
  await page.click('[data-testid="element"]');
}

// 3. Debug what's actually there
const html = await page.content();
console.log('Page contains data-testid="element"?', html.includes('data-testid="element"'));
```

### **Issue 2: Timing Issues**
```typescript
// Element appears and disappears quickly
```

**Solutions:**
```typescript
// 1. Wait for stable state
await page.waitForLoadState('networkidle');

// 2. Wait for specific condition
await page.waitForFunction(() => {
  const element = document.querySelector('[data-testid="success-message"]');
  return element && element.textContent?.includes('Success');
});

// 3. Retry mechanism
await expect(page.locator('[data-testid="element"]')).toBeVisible({ timeout: 10000 });
```

### **Issue 3: API/Backend Issues**
```typescript
// Registration fails silently
```

**Solutions:**
```typescript
// 1. Check backend is running
const health = await page.request.get('http://localhost:3001/api/health');
console.log('Backend status:', health.status());

// 2. Monitor network
page.on('response', response => {
  if (response.url().includes('/register')) {
    console.log('Registration response:', response.status());
    response.json().then(console.log).catch(console.error);
  }
});
```

### **Issue 4: Wrong Page/URL**
```typescript
// Test is on wrong page
```

**Solutions:**
```typescript
// 1. Verify navigation
console.log('Current URL:', page.url());
await expect(page).toHaveURL(/expected-path/);

// 2. Force navigation
if (!page.url().includes('/register')) {
  await page.goto('/register');
}
```

---

## 📋 **Troubleshooting Checklist**

### **Before Running Tests:**
- [ ] Is the frontend running? (`npm run dev` in frontend/)
- [ ] Is the backend running? (`npm run dev` in backend/)
- [ ] Is the database running? (MongoDB/Docker)
- [ ] Are environment variables set? (.env files)
- [ ] Have you run `npm run bddgen`?

### **When Test Fails:**
1. [ ] Check the error message carefully
2. [ ] Run in UI mode to see what happened
3. [ ] Check if the element exists (wrong selector?)
4. [ ] Check if you're on the right page
5. [ ] Check network tab for API errors
6. [ ] Check console for JavaScript errors
7. [ ] Take a screenshot at failure point
8. [ ] Check if it's a timing issue (add waits)
9. [ ] Check if data-testid is implemented
10. [ ] Verify test data is valid

### **Quick Debug Commands:**
```bash
# See what's on the page
await page.screenshot({ path: 'debug.png', fullPage: true });
await page.content().then(html => require('fs').writeFileSync('debug.html', html));

# List all interactive elements
await page.locator('button, a, input, [data-testid]').evaluateAll(els =>
  els.map(el => ({
    tag: el.tagName,
    text: el.textContent,
    testId: el.getAttribute('data-testid')
  }))
);

# Get page state
console.log({
  url: page.url(),
  title: await page.title(),
  cookies: await page.context().cookies(),
  localStorage: await page.evaluate(() => JSON.stringify(localStorage))
});
```

---

## 🎯 **Debugging Scripts**

Add these to your `package.json` for quick access:

```json
{
  "scripts": {
    "test:debug": "npm run bddgen && npx playwright test --debug --project=chromium",
    "test:debug:headed": "npm run bddgen && npx playwright test --debug --headed --project=chromium",
    "test:trace": "npm run bddgen && npx playwright test --trace on",
    "test:ui": "npm run bddgen && npx playwright test --ui",
    "trace:show": "npx playwright show-trace",
    "test:slow": "npm run bddgen && npx playwright test --timeout=60000 --slow-mo=1000"
  }
}
```

---

## 💡 **Pro Tips**

1. **Always start with UI mode** - it's the fastest way to understand failures
2. **Use descriptive console.log()** messages with emojis for easy scanning
3. **Take screenshots liberally** - disk space is cheap, debugging time is expensive
4. **Keep trace files** from CI failures for investigation
5. **Use `page.pause()` strategically** - great for exploratory debugging
6. **Write debug helpers** that you can reuse across tests
7. **Check the basics first** - is the app running? Are you on the right page?
8. **Read error messages carefully** - Playwright errors are usually very descriptive
9. **Use `--retries=0` when debugging** to avoid confusion from retries
10. **Commit working tests immediately** - before they mysteriously break again!

---

## 🆘 **Need More Help?**

- [Playwright Debugging Docs](https://playwright.dev/docs/debug)
- [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer)
- [Playwright Inspector](https://playwright.dev/docs/inspector)
- [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

---

## 📝 **Debug Output Examples**

### **Good Debug Output:**
```
📝 Registration data: {
  email: "test@example.com",
  username: "testuser"
}
📍 Current URL: http://localhost:5173/register
⏳ Starting registration...
📡 API POST /api/auth/register: 201
✅ Registration submitted
🔍 Checking for success message...
❌ Available data-testids: [
  { testId: 'error-message', text: 'Email already exists', visible: true }
]
```

### **What This Tells You:**
- Registration form submitted successfully (201)
- But showing error message instead of success
- User already exists in database
- Need to use unique email or clean database

---

*Remember: Good debugging is about being systematic and gathering information. Don't guess - investigate!* 🔍