@api @games @functional
Feature: Post games
  Test performed on API endpoints, contains test cases related to the creation of games with POST method.

  @pog01 @smoke @loginUser1 @deleteGame
  Scenario: Create a game
    Given the user sets the following request body for "create" a game:
      | Key       | value      |
      | name      | Game pog01 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    Then the response body should verify the "game" with:
      | Key            | value      |
      | name           | Game pog01 |
      | status         | INITIAL    |
      | deck.name      | Fibonacci  |
      | deck.userOwner | system     |
    And the response schema should be verified with "create_game"
    And the response status code should be 201
    And the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user1.username>"
    And the response body should verify the "game" with:
      | Key                                     | value                  |
      | name                                    | Game pog01             |
      | status                                  | INITIAL                |
      | deck.name                               | Fibonacci              |
      | deck.userOwner                          | system                 |
      | playersInGame.0.playerDetails.name      | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner | <Users.user1.username> |
    And the response status code should be 200
    And the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>"
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game pog01             |
      | status                                    | INITIAL                |
      | validName                                 | true                   |
      | id                                        | <Game.id>              |
      | facilitator                               | <Users.user1.username> |
      | allowFacilitatorVoting                    | true                   |
      | userOwner                                 | <Users.user1.username> |
      | deck.name                                 | Fibonacci              |
      | isDonutChart                              | true                   |
      | playersInGame.0.isSpectator               | false                  |
      | playersInGame.0.isAvailableToRevealCards  | true                   |
      | playersInGame.0.isAvailableToManageIssues | true                   |
      | playersInGame.0.isPlaying                 | true                   |
      | issues                                    | []                     |
    And the response status code should be 200

  @pog02 @acceptance @negative @loginUser1
  Scenario: Verify that the game cannot be created with an invalid deck
    And the user sets the following request body for "create" a game:
      | Key       | value      |
      | name      | Game pog02 |
      | deck.name | Invalid    |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    And the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | deck                     |
      | details.0.error | Entity not found         |
    Then the response status code should be 400

  @pog04 @acceptance @loginUser1 @negative @deleteGame @bug
  Scenario: Create two games with the same name (4)
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pog04 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for "create" a game:
      | Key       | value      |
      | name      | Game pog04 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    And the response body should verify the "error" with:
      | Key             | value                     |
      | errorMessage    | Entity already registered |
      | details.0.field | name                      |
      | details.0.error | Entity already registered |
    Then the response status code should be 400

  @pog06 @smoke @negative
  Scenario: Create a game without authentication
    Given the user sets the following request body for a "game":
      | Key       | value      |
      | name      | Game pog06 |
      | deck.name | Fibonacci  |
    When the "user without token" sends a "POST" request to "/planning-poker/games"
    Then the response body should verify the "error" with:
      | Key   | value                 |
      | error | Unauthorized          |
      | path  | /planning-poker/games |
    And the response status code should be 401

  @pog03 @negative @loginUser1
  Scenario: Create a game with an empty field
    Given the user sets the following request body for "create" a game:
      | Key       | value         |
      | name      | (EmptyString) |
      | deck.name | (EmptyString) |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    Then the response body should verify the "error" with:
      | Key             | value                                |
      | errorMessage    | Record validation failed             |
      | details.0.field | name                                 |
      | details.0.error | name: size must be between 1 and 200 |
      | details.1.field | name                                 |
      | details.1.error | name: Name is mandatory              |
    And the response status code should be 400

  @pog05 @negative @loginUser1
  Scenario: Create a game that not have the parameters required
    Given the user sets the following request body for "create" a game:
      | Key  | value      |
      | name | Game pog05 |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    Then the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | deck                     |
      | details.0.error | Entity not found         |
    And the response status code should be 400
    And the user sets the following request body for "create" a game:
      | Key       | value     |
      | deck.name | Fibonacci |
    And the "user1" sends a "POST" request to "/planning-poker/games"
    And the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | name                     |
      | details.0.error | name: Name is mandatory  |
    And the response status code should be 400

  @pog07 @negative @loginUser1
  Scenario: Create a game with invalid authentication
    Given the user sets the following request body for "create" a game:
      | Key       | value      |
      | name      | Game pog07 |
      | deck.name | T-shirt    |
    When the "user invalid" sends a "POST" request to "/planning-poker/games"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401
