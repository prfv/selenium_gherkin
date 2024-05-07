@api @games @functional @negative @loginUser1
Feature: Delete games
  Test performed on API endpoints, contains test cases related to game removal with DELETE method.

  @deg01
  Scenario: Verify that the user cannot delete a game that has already been deleted
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg01 |
      | deck.name | Power of 2 |
    And the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    And the response status code should be 204
    When the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                 |
      | errorMessage    | Entity not found                      |
      | details.0.field | ID                                    |
      | details.0.error | Game with ID: <Game.id> was not found |
    And the response status code should be 404

  @deg02 @deleteGame
  Scenario: Verify that the user cannot delete a game with an invalid Id-game
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg02 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/404"
    And the response body should verify the "error" with:
      | Key             | value                           |
      | errorMessage    | Entity not found                |
      | details.0.field | ID                              |
      | details.0.error | Game with ID: 404 was not found |
    And the response status code should be 404

  @deg03 @deleteGame
  Scenario: Verify that the user cannot delete a game without Id-game
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg03 |
      | deck.name | T-shirt    |
    When the "user1" sends a "DELETE" request to "/planning-poker/games//"
    And the response body should verify the "error" with:
      | Key             | value                       |
      | code            | INVALID_INPUT               |
      | errorMessage    | Oops! Invalid data provided |
      | details.0.field | URI                         |
      | details.0.error | invalid uri                 |
    And the response status code should be 405

  @deg04 @deleteGame
  Scenario: Verify that the user cannot delete a game without authentication
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg04 |
      | deck.name | Power of 2 |
    When the "user without token" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key   | value                           |
      | error | Unauthorized                    |
      | path  | /planning-poker/games/<Game.id> |
    And the response status code should be 401

  @deg05 @deleteGame
  Scenario: Verify that the user cannot delete a game with invalid authentication
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg04 |
      | deck.name | T-shirt    |
    When the "user invalid" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401
