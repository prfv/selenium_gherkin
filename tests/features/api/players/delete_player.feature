@api @player @deletePlayer @functional @loginUser1 @deleteGame
Feature: Delete players
  Test performed on API endpoints, contains test cases related to deleting players of games with DELETE method.

  @deg10 @smoke @bug
  Scenario: Verify that the game owner can remove a player from the game
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg10 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    Then the response status code should be 204
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    And the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Forbidden access                              |
      | details.0.field | ID                                            |
      | details.0.error | Forbidden access to entity with ID: <Game.id> |
    And the response status code should be 401

  @deg11 @negative
  Scenario: Verify that the game owner cannot remove a player from the game with an empty game ID
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg11 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user1" sends a "DELETE" request to "/planning-poker/games//players/<Users.user2.username>"
    Then the response body should verify the "error" with:
      | Key   | value                                                 |
      | error | Not Found                                             |
      | path  | /planning-poker/games//players/<Users.user2.username> |
    And the response status code should be 404
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game deg11             |
      | deck.name                                 | Fibonacci              |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner   | <Users.user1.username> |
      | playersInGame.1.playerDetails.name        | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner   | <Users.user2.username> |
      | playersInGame.1.isSpectator               | false                  |
      | playersInGame.1.isAvailableToRevealCards  | true                   |
      | playersInGame.1.isAvailableToManageIssues | true                   |
      | playersInGame.1.isPlaying                 | true                   |

  @deg12 @negative
  Scenario: Verify that the game owner cannot remove a player from the game with an incorrect game ID
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg12 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/404/players/<Users.user2.username>"
    Then the response body should verify the "error" with:
      | Key             | value                           |
      | errorMessage    | Entity not found                |
      | details.0.field | ID                              |
      | details.0.error | Game with ID: 404 was not found |
    And the response status code should be 404
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game deg12             |
      | deck.name                                 | Fibonacci              |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner   | <Users.user1.username> |
      | playersInGame.1.playerDetails.name        | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner   | <Users.user2.username> |
      | playersInGame.1.isSpectator               | false                  |
      | playersInGame.1.isAvailableToRevealCards  | true                   |
      | playersInGame.1.isAvailableToManageIssues | true                   |
      | playersInGame.1.isPlaying                 | true                   |

  @deg13 @negative
  Scenario: Verify that the game owner cannot remove a player from the game with empty player's userOwner property
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg13 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/<Game.id>/players/"
    Then the response body should verify the "error" with:
      | Key   | value                                    |
      | error | Not Found                                |
      | path  | /planning-poker/games/<Game.id>/players/ |
    And the response status code should be 404
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game deg13             |
      | deck.name                                 | Fibonacci              |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner   | <Users.user1.username> |
      | playersInGame.1.playerDetails.name        | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner   | <Users.user2.username> |
      | playersInGame.1.isSpectator               | false                  |
      | playersInGame.1.isAvailableToRevealCards  | true                   |
      | playersInGame.1.isAvailableToManageIssues | true                   |
      | playersInGame.1.isPlaying                 | true                   |

  @deg14 @negative
  Scenario: Verify that the game owner cannot remove a player from the game when his credential are invalids
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg14 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user without token" sends a "DELETE" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    Then the response body should verify the "error" with:
      | Key   | value                                                          |
      | error | Unauthorized                                                   |
      | path  | /planning-poker/games/<Game.id>/players/<Users.user2.username> |
    And the response status code should be 401
    And the "user2" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user2.username>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game deg14             |
      | deck.name                                 | Fibonacci              |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner   | <Users.user1.username> |
      | playersInGame.1.playerDetails.name        | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner   | <Users.user2.username> |
      | playersInGame.1.isSpectator               | false                  |
      | playersInGame.1.isAvailableToRevealCards  | true                   |
      | playersInGame.1.isAvailableToManageIssues | true                   |
      | playersInGame.1.isPlaying                 | true                   |

  @deg15 @negative @bug
  Scenario: Verify that a user cannot remove a player from a game if he is not the game owner
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game deg15 |
      | deck.name | Fibonacci  |
    And the "user2" logs in to PPS
    And the "user1" adds a player to the created game
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    When the "user2" sends a "DELETE" request to "/planning-poker/games/<Game.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Forbidden access                              |
      | details.0.field | userOwner                                     |
      | details.0.error | Forbidden access to entity with id: <Game.id> |
    And the response status code should be 401
    And the "user1" sends a "GET" request to "/planning-poker/games/<Game.id>/players/<Users.user1.username>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                       | value                  |
      | name                                      | Game deg15             |
      | deck.name                                 | Fibonacci              |
      | playersInGame.0.playerDetails.name        | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner   | <Users.user1.username> |
      | playersInGame.1.playerDetails.name        | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner   | <Users.user2.username> |
