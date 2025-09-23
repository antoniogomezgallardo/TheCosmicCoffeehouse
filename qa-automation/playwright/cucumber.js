module.exports = {
  default: {
    // Features location
    paths: ['features/**/*.feature'],

    // Step definitions location - this is key for VSCode navigation
    require: [
      'steps/**/*.ts',
      'steps/**/*.js'
    ],

    // TypeScript support
    requireModule: ['ts-node/register'],

    // Other configurations
    format: ['html:reports/cucumber-report.html', 'json:reports/cucumber-report.json'],
    formatOptions: {
      snippetInterface: 'async-await'
    },

    // Parallel execution
    parallel: 1,

    // Retry configuration
    retry: 0,

    // Profile configurations
    profiles: {
      smoke: {
        tags: '@smoke'
      },
      regression: {
        tags: '@regression'
      },
      critical: {
        tags: '@critical'
      }
    }
  }
};