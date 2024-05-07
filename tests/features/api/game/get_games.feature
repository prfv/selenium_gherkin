@api @games @getGames @functional @negative @loginUser1
Feature: Get games
  Test performed on API endpoints, contains test cases related to getting of games with GET method using the game ID and player username.

  @geg11 @deleteGame
  Scenario: Verify that a user cannot get a game record with an incorrect game ID
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg11 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "GET" request to "/planning-poker/games/404/players/<Users.user1.username>"
    Then the response body should verify the "errro" with:
      | Key             | value                           |
      | errorMessage    | Entity not found                |
      | details.0.field | ID                              |
      | details.0.error | Game with ID: 404 was not found |
    And the response status code should be 404
    And the "user1" sends a "GET" request to "/planning-poker/games/404"
    And the response body should verify the "error" with:
      | Key             | value                           |
      | errorMessage    | Entity not found                |
      | details.0.field | ID                              |
      | details.0.error | Game with ID: 404 was not found |
    And the response status code should be 404

  @geg12 @deleteGame
  Scenario: Verify that a user cannot get a game record with an empty game ID
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg12 |
      | deck.name | Power of 2 |
    When the "user1" sends a "GET" request to "/planning-poker/games//players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key   | value                                                 |
      | error | Not Found                                             |
      | path  | /planning-poker/games//players/<Users.user1.username> |
    And the response status code should be 404
    And the "user1" sends a "GET" request to "/planning-poker/games//"
    And the response body should verify the "error" with:
      | Key             | value                       |
      | code            | INVALID_INPUT               |
      | errorMessage    | Oops! Invalid data provided |
      | details.0.field | URI                         |
      | details.0.error | invalid uri                 |
    And the response status code should be 405

  @geg13 @deleteGame
  Scenario: Verify that a user cannot get a game record with an empty username
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg13 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/players/"
    Then the response body should verify the "error" with:
      | Key   | value                                    |
      | error | Not Found                                |
      | path  | /planning-poker/games/<Game.id>/players/ |
    And the response status code should be 404

  @geg14 @deleteGame
  Scenario: Verify that a user cannot get a game record when his credentials are invalid
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg14 |
      | deck.name | Fibonacci  |
    When the "user without token" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key   | value                                                          |
      | error | Unauthorized                                                   |
      | path  | /planning-poker/games/<Game.id>/players/<Users.user1.username> |
    And the response status code should be 401

  @geg15 @deleteGame @bug
  Scenario: Verify that a user cannot get a game record if he is not in the game's player list
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg15 |
      | deck.name | Fibonacci  |
    When the "user2" logs in to PPS
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Forbidden access                              |
      | details.0.field | ID                                            |
      | details.0.error | Forbidden access to entity with ID: <Game.id> |
    And the response status code should be 401

  @geg01 @deleteGame
  Scenario: Verify that the user cannot get a game record without authentication
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg01 |
      | deck.name | T-shirt    |
    When the "user without token" sends a "GET" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key   | value                           |
      | error | Unauthorized                    |
      | path  | /planning-poker/games/<Game.id> |
    And the response status code should be 401

  @geg02 @deleteGame
  Scenario: Verify that the user cannot get a game record with invalid authentication
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg02 |
      | deck.name | T-shirt    |
    When the "user invalid" sends a "GET" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @geg03
  Scenario: Verify that the user cannot get a game record from one that was deleted
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game geg03 |
      | deck.name | Power of 2 |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>"
    Then the response status code should be 204
    And the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>"
    And the response body should verify the "error" with:
      | Key             | value                                 |
      | errorMessage    | Entity not found                      |
      | details.0.field | ID                                    |
      | details.0.error | Game with ID: <Game.id> was not found |
    And the response status code should be 404
