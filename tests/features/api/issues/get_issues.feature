@api @issues @functional
Feature: Get all issues
  Test performed on API endpoints, contains test cases related to getting all the issues of a game with GET method.

  @geai01 @loginUser1 @deleteGame @negative
  Scenario: The user is not able to get all the issues with bad authentication.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi01 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value              |
      | name        | Issue geai01       |
      | description | Description geai01 |
    And the user creates an issue with:
      | Key         | value                |
      | name        | Issue geai01 2       |
      | description | Description geai01 2 |
    When the "user invalid" sends a "GET" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @geai02 @loginUser1 @deleteGame @negative
  Scenario: The user is not able to get all the issues without authentication.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi02 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value              |
      | name        | Issue geai02       |
      | description | Description geai02 |
    And the user creates an issue with:
      | Key         | value                |
      | name        | Issue geai02 2       |
      | description | Description geai02 2 |
    When the "user without token" sends a "GET" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key    | value                                  |
      | error  | Unauthorized                           |
      | path   | /planning-poker/games/<Game.id>/issues |
      | status | 401                                    |
    And the response status code should be 401

  @geai03 @loginUser1 @deleteGame @negative
  Scenario: The user is not able to get all the issues of a deleted game.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game poi03 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value              |
      | name        | Issue geai03       |
      | description | Description geai03 |
    And the user creates an issue with:
      | Key         | value                |
      | name        | Issue geai03 2       |
      | description | Description geai03 2 |
    And the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    When the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/issues"
    Then the response body should verify the "error" with:
      | Key             | value                                 |
      | errorMessage    | Entity not found                      |
      | details.0.field | ID                                    |
      | details.0.error | Game with ID: <Game.id> was not found |
      | statusCode      | 404                                   |
    And the response status code should be 404

  @gei01 @loginUser1 @deleteGame @negative
  Scenario: Verify that the user is not able to get records with invalid ID
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game new01 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value             |
      | name        | Issue gei01       |
      | description | Description gei01 |
    When the "user1" sends a "GET" request to "/planning-poker/games/issues/100"
    Then the response body should verify the "error" with:
      | Key             | value                                 |
      | errorMessage    | Entity not found                      |
      | details.0.field | ID                                    |
      | details.0.error | Issue with ID: 100 was not found |
      | statusCode      | 404                                   |
    And the response status code should be 404

  @gei02 @loginUser1 @deleteGame @negative 
  Scenario: Verify that the user is not able to get records without authentication
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game new02 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value             |
      | name        | Issue gei02       |
      | description | Description gei02 |
    When the "user2" sends a "GET" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | error           | Unauthorized                                  |
      | path            | /planning-poker/games/issues/<Issues.0.id>    |
    And the response status code should be 401
  
  @gei03 @loginUser1 @deleteGame @negative
  Scenario: Verify that the user is not able to get records with invalid pathParams or URI
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game new03 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value             |
      | name        | Issue gei03       |
      | description | Description gei03 |
    When the "user1" sends a "GETS" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
      | Key                  | value                          |
      | code                 | INVALID_INPUT                  |
      | errorMessage         | Oops! Invalid data provided    |
      | details.0.field      | URI                            |
      | details.1.error      | invalid uri                    |            
    And the response status code should be 405
