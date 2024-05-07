@api @issues @functional @loginUser1
Feature: Post issues
  Test performed on API endpoints, contains test cases related to the creation of issues with POST method.

  @poi01 @smoke @bug @deleteGame
  Scenario: Create an issue
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi01 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for create an issue:
      | Key         | value               |
      | name        | Issue poi01 1       |
      | description | Description poi01 1 |
    When the "user1" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "data" with:
      | Key                      | value               |
      | validName                | true                |
      | issues.0.name            | Issue poi01 1       |
      | issues.0.description     | Description poi01 1 |
      | issues.0.issueVotes      | []                  |
      | issues.0.isAutoGenerated | false               |
    And the response schema should be verified with "create_issue"
    And the response status code should be 201
    And the user creates an issue with:
      | Key         | value               |
      | name        | Issue poi01 2       |
      | description | Description poi01 2 |
    And the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/issues"
    And the response body should verify the issues with:
      | name          | description         | id            |
      | Issue poi01 1 | Description poi01 1 | <Issues.0.id> |
      | Issue poi01 2 | Description poi01 2 | <Issues.1.id> |
    And the response status code should be 200

  @poi02 @negative @deleteGame
  Scenario: Verify that user is not able to create issue without token
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi02 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for create an issue:
      | Key         | value         |
      | name        | Test Issue    |
      | description | Issue Created |
    When the "user2" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "data" with:
      | Key   | value                                  |
      | error | Unauthorized                           |
      | path  | /planning-poker/games/<Game.id>/issues |
    And the response status code should be 401

  @poi05 @deleteGame
  Scenario: Create an issue with duplicate name
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi05 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                 |
      | name        | Issue One             |
      | description | Issue description one |
    And the user creates an issue with:
      | Key         | value                 |
      | name        | Issue One             |
      | description | Issue description two |
    When the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the issues with:
      | name      | description           | id            |
      | Issue One | Issue description one | <Issues.0.id> |
      | Issue One | Issue description two | <Issues.1.id> |
    And the response status code should be 200

  @poi06 @negative @deleteGame
  Scenario: Create an issue with empty parameters
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi06 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for a "issue":
      | Key         | value         |
      | name        | (EmptyString) |
      | description | (EmptyString) |
    When the "user1" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                                |
      | errorMessage    | Record validation failed             |
      | details.0.field | name                                 |
      | details.0.error | name: Name is mandatory              |
      | details.1.field | name                                 |
      | details.1.error | name: size must be between 1 and 200 |
      | statusCode      | 400                                  |
    And the response status code should be 400

  @poi07 @negative @deleteGame
  Scenario: Create an issue with an incorrect payload
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi07 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for create an issue:
      | Key     | value                 |
      | issue   | Issue One             |
      | details | Issue description one |
    When the "user1" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | name                     |
      | details.0.error | name: Name is mandatory  |
      | statusCode      | 400                      |
    And the response status code should be 400

  @poi04 @negative
  Scenario: Create an issue in a game that does not exist
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi04 |
      | deck.name | Fibonacci  |
    And the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    When the user sets the following request body for create an issue:
      | Key         | value                      |
      | name        | Issue poi04                |
      | description | Issue in game non-existent |
    And the "user1" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                                 |
      | errorMessage    | Entity not found                      |
      | details.0.field | ID                                    |
      | details.0.error | Game with ID: <Game.id> was not found |
    And the response status code should be 404

  @poi03 @negative @deleteGame @bug
  Scenario: Verify that the user is not able to create an issue in a game that does not belong to the user
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi03 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    When the user sets the following request body for create an issue:
      | Key         | value                          |
      | name        | Issue poi03                    |
      | description | Issue in not allowed user game |
    And the "user2" sends a "POST" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Forbidden access                              |
      | details.0.field | userOwner                                     |
      | details.0.error | Forbidden access to entity with id: <Game.id> |
    And the response status code should be 401
