@api @dev @functional

Feature: Delete votes
  Test performed on API endpoints, contains test cases related to delete a vote from an isuue with DELETE method.

  @dev01 @smoke @loginUser1 @deleteGame
  Scenario: The user is able to remove a vote from an issue
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dev01 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                    |
      | name        | Issue dev01              |
      | description | Add a vote to this Issue |
    And the user sets the following request body for a "issueVotes":
      | Key              | value                                     |
      | player.id        | <Game.playersInGame.0.playerDetails.id>   |
      | player.name      | <Game.playersInGame.0.playerDetails.name> |
      | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
      | vote             | 2                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 200
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    Then the response status code should be 204

  @dev02 @smoke @loginUser1 @deleteGame
  Scenario: The user is not able to remove a vote from an issue with bad authentication.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dev02 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                    |
      | name        | Issue dev02              |
      | description | Add a vote to this Issue |
    And the user sets the following request body for a "issueVotes":
      | Key              | value                                     |
      | player.id        | <Game.playersInGame.0.playerDetails.id>   |
      | player.name      | <Game.playersInGame.0.playerDetails.name> |
      | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
      | vote             | 2                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 200
    When the "user invalid" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @dev03 @smoke @loginUser1 @deleteGame
  Scenario: The user is not able to remove a vote from an issue without authentication.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dev03 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                    |
      | name        | Issue dev03              |
      | description | Add a vote to this Issue |
    And the user sets the following request body for a "issueVotes":
      | Key              | value                                     |
      | player.id        | <Game.playersInGame.0.playerDetails.id>   |
      | player.name      | <Game.playersInGame.0.playerDetails.name> |
      | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
      | vote             | 2                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 200
    When the "user without token" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key    | value                                                                     |
      | error  | Unauthorized                                                              |
      | path   | /planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username> |
      | status | 401                                                                       |
    And the response status code should be 401

  @dev04 @smoke @loginUser1 @deleteGame
  Scenario: The user is not able to remove a vote from a deleted issue.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dev04 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                    |
      | name        | Issue dev04              |
      | description | Add a vote to this Issue |
    And the user sets the following request body for a "issueVotes":
      | Key              | value                                     |
      | player.id        | <Game.playersInGame.0.playerDetails.id>   |
      | player.name      | <Game.playersInGame.0.playerDetails.name> |
      | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
      | vote             | 2                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 200
    And the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 204
    And the deleted issue ID is saved
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key             | value                                      |
      | errorMessage    | Entity not found                           |
      | details.0.field | ID                                         |
      | details.0.error | Issue with ID: <Issues.0.id> was not found |
    And the response status code should be 404

  @dev05 @smoke @loginUser1 @deleteGame
  Scenario: The user is not able to remove a vote from an issue twice.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dev05 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                    |
      | name        | Issue dev05              |
      | description | Add a vote to this Issue |
    And the user sets the following request body for a "issueVotes":
      | Key              | value                                     |
      | player.id        | <Game.playersInGame.0.playerDetails.id>   |
      | player.name      | <Game.playersInGame.0.playerDetails.name> |
      | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
      | vote             | 2                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response status code should be 200
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    And the response status code should be 204
    And the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>/players/<Users.user1.username>"
    Then the response body should verify the "error" with:
      | Key             | value            |
      | errorMessage    | Entity not found |
      | details.0.field | Player name      |
      | details.0.error | Entity not found |
    And the response status code should be 404
