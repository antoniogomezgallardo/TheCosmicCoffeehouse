@authentication @smoke
Feature: User Authentication
  As a customer of The Cosmic Coffeehouse
  I want to be able to register and login to my account
  So that I can access personalized features and make purchases

  Background:
    Given the application is running
    And I am on the home page

  @smoke @critical
  Scenario: Successful user registration
    Given I navigate to the registration page
    When I register with valid credentials:
      | email           | bdd.test@cosmicoffeehouse.com |
      | username        | bddtestuser                   |
      | password        | BDDTest123!                   |
      | firstName       | BDD                           |
      | lastName        | Test                          |
    Then I should be successfully registered
    And I should be redirected to the dashboard or login page

  @smoke @critical
  Scenario: Successful user login
    Given I have a registered user account
    And I navigate to the login page
    When I login with valid credentials:
      | email    | e2e.test@cosmicoffeehouse.com |
      | password | TestPassword123!              |
    Then I should be successfully logged in
    And I should see user-specific elements

  @regression
  Scenario: Login with invalid credentials
    Given I navigate to the login page
    When I attempt to login with invalid credentials:
      | email    | invalid@email.com |
      | password | wrongpassword     |
    Then I should see an error message
    And I should remain on the login page

  @regression
  Scenario: Registration with invalid data
    Given I navigate to the registration page
    When I attempt to register with invalid data:
      | email    | invalid-email |
      | username |               |
      | password | 123           |
    Then I should see validation errors
    And I should remain on the registration page

  @regression
  Scenario: Duplicate email registration
    Given I have a registered user account
    And I navigate to the registration page
    When I attempt to register with an existing email:
      | email    | e2e.test@cosmicoffeehouse.com |
      | username | duplicateuser                 |
      | password | TestPassword123!              |
    Then I should see a duplicate email error
    And I should remain on the registration page

  @regression
  Scenario: User logout
    Given I am logged in as a valid user
    When I click the logout button
    Then I should be logged out successfully
    And I should be redirected to the home page
    And I should not see user-specific elements