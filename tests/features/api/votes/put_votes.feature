@api @vote @functional @loginUser1 @deleteGame  

Feature: Put vote

  Test performed on API endpoint, contains test cases related to the votes.
  
  @puv01 @smoke
  Scenario: Verify that vote can be edited
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv01 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | L                                         |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response status code should be 200
    And the response body should verify the "data" with:
           | Key                               | value                                     |
           | name                              | Game puv01                                |
           | status                            | PICKED_CARDS                              |
           | issues.0.issueVotes.0.vote        | L                                         |
           | issues.0.issueVotes.0.player.id   | <Game.playersInGame.0.playerDetails.id>   |
           | issues.0.issueVotes.0.player.name | <Game.playersInGame.0.playerDetails.name> |
    And the response schema should be verified with "create_issue"

  @puv02 @negative
  Scenario: Verify that when editing a vote with a value not included in the deck, the request should not be processed.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv02 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | 2                                         |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response body should verify the "error" with:
           | Key             | value                                  |
           | errorMessage    | Record validation failed               |
           | details.0.field | vote                                   |
           | details.0.error | Invalid vote for current voting system |
    And the response status code should be 400

  @puv06 @negative
  Scenario: Verify that when editing a vote without the vote field, the request should not be processed.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv06 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response body should verify the "error" with:
           | Key             | value                                  |
           | errorMessage    | Record validation failed               |
           | details.0.field | vote                                   |
           | details.0.error | vote: must not be empty                |
    And the response status code should be 400
    
  @puv05 @negative
  Scenario: Verify that when issueID is incorrect, the vote should not be updated.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv05 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | L                                         |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/-0/votes"
    Then the response body should verify the "error" with:
           | Key             | value                          |
           | errorMessage    | Entity not found               |
           | details.0.field | ID                             |
           | details.0.error | Issue with ID: 0 was not found |
    And the response status code should be 404

  @puv03 @negative
  Scenario: Verify that when editing  a vote without a valid token, the request should not be processed.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv03 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | L                                         |
    When the "user invalid" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response body should verify the "error" with:
           | Key             | value                |
           | errorMessage    | Bad User credentials |
           | details.0.field | Authorization        |
           | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @puv04 @negative @bug
  Scenario: Verify that when editing a vote that does not belong to the user, the request should not be processed.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv04 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    When the "user2" logs in to PPS
    And the "user1" adds a player to the created game
           | Key                       | value                  |
           | playerDetails.name        | <Users.user2.username> |
           | playerDetails.userOwner   | <Users.user2.username> |
           | isSpectator               | false                  |
           | isAvailableToRevealCards  | true                   |
           | isAvailableToManageIssues | true                   |
           | isPlaying                 | true                   |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.1.playerDetails.id>   |
           | player.name      | <Game.playersInGame.1.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.1.playerDetails.name> |
           | vote             | L                                         |
    And the "user2" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response body should verify the "error" with:
           | Key             | value                                             |
           | errorMessage    | Forbidden access                                  |
           | details.0.error | Forbidden access to entity with id: <Issues.0.id> |
           | details.0.field | userOwner                                         |
    And the response status code should be 401

  @puv07 @negative
  Scenario: Verify that when editing a vote with an empty value, the request should not be processed.
    Given the user creates a game with:
           | Key       | value      |
           | name      | Game puv06 |
           | deck.name | T-shirt    | 
    And the user creates an issue with:
           | Key         | value                                     |
           | name        | API: add issue                            |
           | description | As user I want to be able to add an issue |
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | <Game.playersInGame.0.playerDetails.id>   |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | M                                         |
    And the "user1" sends a "POST" request to "/planning-poker/games/issues/<Issues.0.id>" 
    And the user sets the following request body for a "issueVotes":
           | Key              | value                                     |
           | player.id        | (EmptyString)                             |
           | player.name      | <Game.playersInGame.0.playerDetails.name> |
           | player.userOwner | <Game.playersInGame.0.playerDetails.name> |
           | vote             | L                                         |
    When the "user1" sends a "PUT" request to "/planning-poker/games/issues/<Issues.0.id>/votes"
    Then the response body should verify the "error" with:
           | Key             | value                                                |
           | errorMessage    | Entity not found                                     |      
           | details.0.field | Player id                                                   |
           | details.0.error | Player has not voted on Issue with ID: <Issues.0.id> |
    And the response status code should be 404
