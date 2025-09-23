@performance
Feature: Application Performance
  As a quality engineer
  I want to ensure the application meets performance standards
  So that users have a fast and responsive experience

  Background:
    Given the application is running

  @smoke @critical
  Scenario: Home page loads within acceptable time
    When I navigate to the home page
    Then the page should load within 3 seconds
    And all critical resources should be loaded

  @smoke
  Scenario: Product catalog loads efficiently
    When I navigate to the products page
    Then the initial products should load within 2 seconds
    And images should load progressively
    And the page should be interactive within 3 seconds

  @regression
  Scenario: Application handles slow network gracefully
    Given I simulate a slow 3G connection
    When I navigate to the home page
    Then the page should show loading indicators
    And core content should be prioritized
    And the page should remain functional

  @regression
  Scenario: Cart operations perform quickly
    Given I have products in my cart
    When I update product quantities
    Then the cart should update within 500ms
    And the total should recalculate immediately

  @smoke
  Scenario: Mobile viewport performance
    Given I am using a mobile device viewport
    When I navigate to the home page
    Then the page should load within 4 seconds on mobile
    And touch interactions should be responsive
    And the layout should adapt without reflow

  @regression
  Scenario: Search functionality performance
    Given I am on the products page
    When I search for a product
    Then search results should appear within 1 second
    And the UI should remain responsive during search

  @critical
  Scenario: Checkout process performance
    Given I have items in my cart
    When I proceed through checkout
    Then each checkout step should load within 2 seconds
    And form submissions should process quickly
    And payment processing should not exceed 5 seconds