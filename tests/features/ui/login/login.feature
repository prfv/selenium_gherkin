@ui @login
Feature: Login
  Test performed on UI, contains test cases related to the Login.

  @uiLogin01 @functional
  Scenario: Verify that is not possible to login with wrong credentials
    When the "user invalid" fills his credentials in the login page
    Then the user should see the "The username or password are invalid" error message in the login page

  @uiLogin02 @acceptance @onlyLocal
  Scenario: Verify that is possible to register a new user
    Given the user clicks on sign up button
    When the user fills the sign up form with:
      | username | (randomUsername) |
      | email    | (randomEmail)    |
      | password | Password1234.    |
    Then the user should see the "Congratulations!" sucessfull message in the login page
    And the user should see the "Your account has been successfully created." sucessfull message in the login page
    And the user clicks on login button
    And the "currentUIUser" fills his credentials in the login page
    And the user should see his username in the landing page
    And the user should see Create Game button in the landing page

  @uiLogin03 @functional @negative @onlyLocal
  Scenario: Verify that is not possible to register a duplicate user
    Given the user clicks on sign up button
    And the user fills the sign up form with:
      | username | (randomUsername) |
      | email    | (randomEmail)    |
      | password | Password1234.    |
    And the user should see the "Congratulations!" sucessfull message in the login page
    And the user clicks on login button
    And the user clicks on sign up button
    When the user fills the sign up form with duplicate username:
      | username | (duplicateUsername) |
      | email    | (randomEmail)       |
      | password | Password1234.       |
    And the user should see the "Oops!" error message in the sign-up page
    And the user should see the "Something went wrong." error message in the sign-up page
    And the user clicks on retry button
    And the user fills the sign up form with duplicate email:
      | username | (randomUsername) |
      | email    | (duplicateEmail) |
      | password | Password1234.    |
    And the user should see the "Oops!" error message in the sign-up page
    Then the user should see the "Something went wrong." error message in the sign-up page

  @uiLogin04 @acceptance @onlyLocal @visualTesting @wip
  Scenario: Verify the landing page when login
    When take a snapshot with Percy with the name "login_page"
    And the "user1" fills his credentials in the login page
    Then the user should see his username in the landing page
    And the user should see Create Game button in the landing page
    And take a snapshot with Percy with the name "home_page"

  @uiLogin05 @functional @acceptance @visualTesting
  Scenario: Verify the password complexity validation when creating a new user
    Given the user clicks on sign up button
    And take a snapshot with Percy with the name "signup_page"
    # Validating "8 characters" condition to passwords
    When the user fills the sign up form with:
      | password      | aaaaaaaa      |
    Then the user should see checked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
    And the user should see unchecked this items
      | Items                           |
      | At least one capital letter     |
      | At least one number             |
      | At least one special character  |
    # Validating "At least one lowercase letter" condition to passwords
    And the user fills the sign up form with:
      | password      | a               |
    And the user should see checked this items
      | Items                           |
      | At least one lowercase letter   |
    And the user should see unchecked this items
      | Items                           |
      | 8 characters                    |
      | At least one capital letter     |
      | At least one number             |
      | At least one special character  |
    # Validating "At least one capital letter" condition to passwords
    And the user fills the sign up form with:
      | password      | A               |
    And the user should see checked this items
      | Items                           |
      | At least one capital letter     |
    And the user should see unchecked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
      | At least one number             |
      | At least one special character  |
    # Validating "At least one number" condition to passwords
    And the user fills the sign up form with:
      | password      | 1               |
    And the user should see checked this items
      | Items                           |
      | At least one number             |
    And the user should see unchecked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
      | At least one capital letter     |
      | At least one special character  |
    # Validating "At least one special character" condition to passwords
    And the user fills the sign up form with:
      | password      | .               |
    And the user should see checked this items
      | Items                           |
      | At least one special character  |
    And the user should see unchecked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
      | At least one capital letter     |
      | At least one number             |
    # Validating no condition to passwords
    And the user fills the sign up form with:
      | password      |                 |
    And the user should see unchecked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
      | At least one capital letter     |
      | At least one number             |
      | At least one special character  |
    # Validating all conditions to passwords
    And the user fills the sign up form with:
      | password      | Mypassword1.    |
    And the user should see checked this items
      | Items                           |
      | 8 characters                    |
      | At least one lowercase letter   |
      | At least one capital letter     |
      | At least one number             |
      | At least one special character  |
