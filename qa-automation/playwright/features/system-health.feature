@system @health
Feature: System Health and Resilience
  As a quality engineer
  I want to verify system stability and error handling
  So that the application remains reliable under various conditions

  Background:
    Given the application is running

  @smoke @critical
  Scenario: Application loads successfully
    When I navigate to the home page
    Then the page should load without errors
    And the page title should contain "Cosmic Coffeehouse"
    And basic navigation elements should be visible

  @smoke @critical
  Scenario: Backend API connectivity
    When I check the backend API status
    Then the API should respond with status 200
    And the API should return valid JSON
    And critical endpoints should be accessible

  @smoke
  Scenario: Page reload stability
    Given I am on the home page
    When I reload the page
    Then the page should reload successfully
    And user session should be maintained
    And no data should be lost

  @regression
  Scenario: Graceful network error handling
    Given I simulate offline mode
    When I attempt to navigate to the home page
    Then I should see an appropriate offline message
    And the application should not crash
    When I restore network connectivity
    Then the application should recover automatically

  @regression
  Scenario: Browser navigation stability
    Given I navigate through multiple pages
    When I use browser back and forward buttons
    Then navigation should work correctly
    And page state should be maintained
    And no console errors should appear

  @smoke
  Scenario: Cross-browser compatibility
    When I access the application on "<browser>"
    Then the application should function correctly
    And all features should be accessible
    Examples:
      | browser  |
      | chromium |
      | firefox  |
      | webkit   |

  @regression
  Scenario: Session timeout handling
    Given I am logged in as a user
    When my session expires
    Then I should be notified appropriately
    And I should be redirected to login page
    And my work should be preserved if possible

  @critical
  Scenario: Error boundary functionality
    When an unexpected error occurs in the application
    Then the error should be caught gracefully
    And a user-friendly error message should be displayed
    And the user should be able to recover

  @regression
  Scenario: Memory leak prevention
    Given I perform repeated actions on the page
    When I monitor memory usage
    Then memory should not increase indefinitely
    And performance should remain stable

  @smoke
  Scenario: Static asset loading
    When I load the application
    Then all CSS files should load successfully
    And all JavaScript files should load successfully
    And all images should load or show appropriate placeholders
    And fonts should load correctly