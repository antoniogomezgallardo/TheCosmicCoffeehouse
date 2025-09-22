@ecommerce @workflow @smoke
Feature: E-commerce User Journey
  As a customer of The Cosmic Coffeehouse
  I want to browse products, add them to my cart, and complete purchases
  So that I can buy cosmic capsules and brewing machines

  Background:
    Given the application is running
    And I am on the home page

  @smoke @critical
  Scenario: Complete guest checkout workflow
    Given I browse the product catalog
    When I add a cosmic capsule to my cart:
      | product | Integration Test Capsule |
      | quantity| 2                        |
    And I proceed to checkout as a guest
    And I provide shipping information:
      | firstName | Guest           |
      | lastName  | User           |
      | address   | 123 Test Street |
      | city      | Test City       |
      | zipCode   | 12345          |
      | country   | Test Country    |
    Then my order should be successfully placed
    And I should receive an order confirmation

  @smoke @critical
  Scenario: Complete authenticated user checkout workflow
    Given I am logged in as a valid user
    And I browse the product catalog
    When I add multiple products to my cart:
      | product                  | quantity |
      | Integration Test Capsule | 2        |
      | Test Machine             | 1        |
    And I update my cart quantities:
      | product                  | newQuantity |
      | Integration Test Capsule | 3           |
    And I proceed to checkout as an authenticated user
    And I provide shipping information:
      | firstName | Authenticated   |
      | lastName  | User           |
      | address   | 456 Auth Street |
      | city      | Auth City       |
      | zipCode   | 54321          |
      | country   | Auth Country    |
    Then my order should be successfully placed
    And I should see the order in my order history

  @regression
  Scenario: Shopping cart persistence
    Given I add a product to my cart as a guest
    When I refresh the page
    Then my cart should still contain the product
    When I navigate away and return
    Then my cart should still contain the product

  @regression
  Scenario: Product catalog browsing
    Given I navigate to the products page
    When I browse different product categories:
      | category |
      | Capsules |
      | Machines |
    Then I should see relevant products for each category
    And product details should be displayed correctly

  @regression
  Scenario: Cart management
    Given I have products in my cart
    When I update product quantities
    And I remove a product from my cart
    Then the cart total should be recalculated correctly
    And removed products should not appear in the cart

  @regression
  Scenario: Empty cart handling
    Given I have an empty cart
    When I try to proceed to checkout
    Then I should see an appropriate message
    And I should not be able to complete checkout

  @performance
  Scenario: Product loading performance
    Given I navigate to the products page
    When I load the product catalog
    Then products should load within 3 seconds
    And images should load progressively

  @smoke
  Scenario: Featured products display
    Given I am on the home page
    Then I should see featured products displayed
    And featured products should be clickable
    When I click on a featured product
    Then I should be taken to the product details page