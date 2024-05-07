@api @games @functional @loginUser1
Feature: Put games
  Test performed on API endpoints, contains test cases related to the edition of games with PUT method.

  @pug01 @smoke @deleteGame
  Scenario: Edit a game successfully
    Given the user sets the following request body for "create" a game:
      | Key       | value      |
      | name      | Game pug01 |
      | deck.name | Fibonacci  |
    When the "user1" sends a "POST" request to "/planning-poker/games"
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game pug01             |
      | status                                    | INITIAL                |
      | deck.name                                 | Fibonacci              |
      | deck.userOwner                            | system                 |
      | isDonutChart                              | true                   |
      | facilitator                               | <Users.user1.username> |
      | allowFacilitatorVoting                    | true                   |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.isSpectator               | false                  |
      | playersInGame.0.isAvailableToRevealCards  | true                   |
      | playersInGame.0.isAvailableToManageIssues | true                   |
      | playersInGame.0.isPlaying                 | true                   |
    And the user sets the following request body for "edit" a game:
      | Key                    | value                  |
      | name                   | First Game             |
      | status                 | STARTED                |
      | deck.name              | Power of 2             |
      | deck.userOwner         | system                 |
      | isDonutChart           | false                  |
      | facilitator            | <Users.user1.username> |
      | allowFacilitatorVoting | false                  |
    And the "user1" sends a "PUT" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | First Game             |
      | status                                    | STARTED                |
      | deck.name                                 | Power of 2             |
      | deck.userOwner                            | system                 |
      | isDonutChart                              | false                  |
      | facilitator                               | <Users.user1.username> |
      | allowFacilitatorVoting                    | false                  |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.isSpectator               | false                  |
      | playersInGame.0.isAvailableToRevealCards  | true                   |
      | playersInGame.0.isAvailableToManageIssues | true                   |
      | playersInGame.0.isPlaying                 | true                   |
    And the response schema should be verified with "edit_game"
    And the response status code should be 200

  @pug02 @negative @deleteGame
  Scenario: Edit a game with incorrect parameters 
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pug02 |
      | deck.name | Fibonacci  |
    When the user sets the following request body for "edit" a game:
      | Key                | value                  |
      | gameName           | First Game             |
      | gameStatus         | INITIAL                |
      | deck.type          | Power of 2             |
      | donutChart         | false                  |
      | manager            | <Users.user1.username> |
      | allowManagerVoting | false                  |
    And the "user1" sends a "PUT" request to "/planning-poker/games/<Game.id>"
    Then the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | name                     |
      | details.0.error | name: Name is mandatory  |
      | statusCode      | 400                      |
    And the response status code should be 400

  @pug06 @acceptance @negative @bug @deleteGame
  Scenario: Change the name of a game to an existing one
    Given the user creates a game with:
      | Key       | value        |
      | name      | Game pug06 1 |
      | deck.name | Fibonacci    |
    And the user sets the following request body for "create" a game:
      | Key       | value        |
      | name      | Game pug06 2 |
      | deck.name | Fibonacci    |
    And the "user1" sends a "POST" request to "/planning-poker/games"
    When the user sets the following request body for "edit" a game:
      | Key                    | value                  |
      | name                   | Game pug06 1           |
      | deck.name              | Fibonacci              |
      | status                 | INITIAL                |
      | isDonutChart           | true                   |
      | allowFacilitatorVoting | true                   |
      | facilitator            | <Users.user1.username> |
    And the "user1" sends a "PUT" request to "/planning-poker/games/<Games.1.id>"
    Then the response body should verify the "error" with:
      | Key             | value                     |
      | errorMessage    | Entity already registered |
      | details.0.field | name                      |
      | details.0.error | Entity already registered |
    And the response status code should be 400
    And the "user1" sends a "GET" request to "/planning-poker/games/<Games.1.id>"
    And the response body should verify the "game" with:
      | Key       | value        |
      | name      | Game pug06 2 |
      | status    | INITIAL      |
      | deck.name | Fibonacci    |
    And the response status code should be 200

  @pug04 @negative @bug @deleteGame
  Scenario: Edit a game without permissions
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pug04 |
      | deck.name | Fibonacci  |
    When the "user2" logs in to PPS
    And the user sets the following request body for "edit" a game:
      | Key                    | value          |
      | name                   | New Game pug04 |
      | deck.name              | Power of 2     |
      | status                 | INITIAL        |
      | isDonutChart           | false          |
      | allowFacilitatorVoting | true           |
    And the "user2" sends a "PUT" request to "/planning-poker/games/<Games.0.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                            |
      | errorMessage    | Forbidden access                                 |
      | details.0.error | Forbidden access to entity with id: <Games.0.id> |
      | details.0.field | userOwner                                        |
    And the response status code should be 401

  @pug05 @smoke @negative
  Scenario: Edit a non-existing game
    When the user sets the following request body for "edit" a game:
      | Key                    | value                  |
      | name                   | Game pug05             |
      | deck.name              | Fibonacci              |
      | status                 | INITIAL                |
      | isDonutChart           | true                   |
      | allowFacilitatorVoting | true                   |
      | facilitator            | <Users.user1.username> |
    And the "user1" sends a "PUT" request to "/planning-poker/games/100"
    Then the response status code should be 404
    And the response body should verify the "error" with:
      | Key             | value                           |
      | errorMessage    | Entity not found                |
      | details.0.error | Game with ID: 100 was not found |
      | details.0.field | ID                              |

  @pug03 @negative @deleteGame
  Scenario: Edit a game with invalid credentials
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pug03 |
      | deck.name | Fibonacci  |
    And the user sets the following request body for a "game":
      | Key                    | value     |
      | name                   | Game 1    |
      | deck.name              | Fibonacci |
      | status                 | INITIAL   |
      | isDonutChart           | true      |
      | allowFacilitatorVoting | true      |
    And the "user invalid" sends a "PUT" request to "/planning-poker/games/<Games.0.id>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.error | Unauthorized token   |
      | details.0.field | Authorization        |
    And the response status code should be 401  
