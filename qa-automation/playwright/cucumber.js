module.exports = {
  default: {
    // Feature files location
    paths: ['features/**/*.feature'],

    // Step definitions location
    import: ['steps/**/*.ts'],

    // Require TypeScript support
    requireModule: ['ts-node/register'],

    // Format options
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      '@cucumber/pretty-formatter'
    ],

    // Parallel execution
    parallel: 2,

    // Retry failed scenarios
    retry: 1,

    // Tags to run
    tags: process.env.CUCUMBER_TAGS || 'not @skip',

    // Timeout for steps
    timeout: 30000,

    // World parameters
    worldParameters: {
      browser: process.env.BROWSER || 'chromium',
      headless: process.env.HEADLESS !== 'false',
      baseUrl: process.env.BASE_URL || 'http://localhost:5174'
    },

    // Publish results
    publish: false,

    // Fail fast
    failFast: process.env.FAIL_FAST === 'true'
  },

  // Profile for smoke tests
  smoke: {
    paths: ['features/**/*.feature'],
    import: ['steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:reports/smoke-report.html'],
    tags: '@smoke',
    timeout: 15000,
    parallel: 1
  },

  // Profile for regression tests
  regression: {
    paths: ['features/**/*.feature'],
    import: ['steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'json:reports/regression-report.json'],
    tags: '@regression',
    timeout: 60000,
    parallel: 3
  },

  // Profile for critical tests
  critical: {
    paths: ['features/**/*.feature'],
    import: ['steps/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'html:reports/critical-report.html'],
    tags: '@critical',
    timeout: 30000,
    parallel: 1,
    retry: 2
  }
};