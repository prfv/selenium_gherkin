@api @issues @functional @loginUser1 @deleteGame 
Feature: Put issues
  Test performed on API endpoints, contains test cases related to the issues with PUT method.
  
  @pui01 @smoke
  Scenario: Verify an issue can be edited successfully
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui01 |
          | deck.name | Power of 2 |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |
    And the user sets the following request body for a "issue":
          | Key         | value                    |
          | name        | API: edit issue          |
          | description | Be able to edit an issue |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "data" with:
          | Key                  | value                    |
          | issues.0.name        | API: edit issue          |
          | issues.0.description | Be able to edit an issue |
          | issues.0.issueVotes  | []                       |
    And the response schema should be verified with "create_issue"
    And the response status code should be 200

  @pui02 @negative
  Scenario: Verify an issue cannot be edited when name attribute is missing in the request body
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui02 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |      
    And the user sets the following request body for a "issue":
          | Key         | value                    |
          | description | Be able to edit an issue |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key             | value                    |
          | errorMessage    | Record validation failed |
          | details.0.field | name                     |
          | details.0.error | name: Name is mandatory  |
    And the response status code should be 400

  @pui03 @negative
  Scenario: Verify an issue cannot be edited when the user credentials are invalid
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui03 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |
    And the user sets the following request body for a "issue":
          | Key         | value                    |
          | name        | API: add new issue       |
          | description | Be able to edit an issue |
    When the "user invalid" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key             | value                |
          | errorMessage    | Bad User credentials |
          | details.0.field | Authorization        |
          | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @pui04 @negative @bug
  Scenario: Verify an issue cannot be edited when the user is not the owner 
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pui04 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                   |
      | name        | API: add issue          |
      | description | Be able to add an issue |
    And the "user2" logs in to PPS
    And the user sets the following request body for a "issue":
          | Key         | value                             |
          | name        | API: not able to edit issue       |
          | description | Not able to edit an issue         |
    When the "user2" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key              | value                                             |
          | errorMessage     | Forbidden access                                  |
          | details.0.field  | userOwner                                         |
          | details.0.error  | Forbidden access to entity with id: <Issues.0.id> |
    And the response status code should be 401
 
  @pui05 @smoke
  Scenario: Verify that a user cannot edit an issue by providing a nonexistent ID
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui01 |
          | deck.name | Power of 2 |
    And the user sets the following request body for a "issue":
          | Key         | value                    |
          | name        | API: edit issue          |
          | description | Be able to edit an issue |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/-100"
    Then the response body should verify the "error" with:
          | Key                  | value                                 |
          | errorMessage         | Entity not found                      |
          | details.0.field      | ID                                    |
          | details.0.error      | Issue with ID: -100 was not found     |
    And the response status code should be 404

  @pui06 @smoke
  Scenario: Verify an issue's name can be updated when it is already in use
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui06 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                     |
          | name        | Issue pui06 1             |
          | description | Be able to add an issue 1 |
    And the user creates an issue with:
          | Key         | value                     |
          | name        | Issue pui06 2             |
          | description | Be able to add an issue 2 |
    And the user sets the following request body for a "issue":
          | Key         | value                     |
          | name        | Issue pui06 1             |
          | description | Be able to edit an issue 2 |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.1.id>"
    Then the response body should verify the "issues" with:
          | Key                  | value                      |
          | issues.0.name        | Issue pui06 1              |
          | issues.0.description | Be able to add an issue 1  |
          | issues.0.issueVotes  | []                         |
          | issues.1.name        | Issue pui06 1              |
          | issues.1.description | Be able to edit an issue 2 |
          | issues.1.issueVotes  | []                         |
    And the response status code should be 200
    And the "user1" sends a "GET" request to "/planning-poker/games/issues/<Issues.1.id>"
    And the response body should verify the "data" with:
          | Key         | value                      |
          | id          | <Issues.1.id>              |
          | name        | Issue pui06 1              |
          | description | Be able to edit an issue 2 |
          | issueVotes  | []                         |
    And the response status code should be 200

  @pui07 @negative
  Scenario: Verify an issue cannot be edited when payload is missing
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui07 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | Issue pui07             |
          | description | Be able to add an issue |
    And the user sets the following request body for a "issue":
          | Key         | value                   |
          | description | Be able to edit an issue|
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key             | value                    |
          | errorMessage    | Record validation failed |
          | details.0.field | name                     |
          | details.0.error | name: Name is mandatory  |
    And the response status code should be 400

  @pui08 @negative
  Scenario: Verify that an issue cannot be edited if the name field is empty.
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game pui08 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | Issue pui07             |
          | description | Be able to add an issue |
    And the user sets the following request body for a "issue":
          | Key         | value                   |
          | name        | (EmptyString)           |
          | description | Be able to edit an issue|
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key             | value                                |
          | errorMessage    | Record validation failed             |
          | details.0.field | name                                 |
          | details.0.error | name: Name is mandatory              |
          | details.1.field | name                                 |
          | details.1.error | name: size must be between 1 and 200 |
    And the response status code should be 400
