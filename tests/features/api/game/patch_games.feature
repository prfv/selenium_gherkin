@api @game @functional @loginUser1 @deleteGame

Feature: Patch game

  Test performed on API endpoints, contains test cases related to the editing games with POST method.

  @pag01
  Scenario Outline: Verify that a player can be updated, with the parameters isIplaying and isSpectator.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value      |
      | propertyName  | <property> |
      | propertyValue | <value>    |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "data" with:
      | Key                        | value   |
      | playersInGame.0.<property> | <value> |
    And the response schema should be verified with "edit_game"
    And the response status code should be 200

    Examples:
      | property    | value |
      | isPlaying   | false |
      | isSpectator | true  |

  @pag02 @negative
  Scenario Outline: Verify that a player cannot be updated, if the property value has an empty value.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value      |
      | propertyName  | <property> |
      | propertyValue | <value>    |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Record validation failed                      |
      | details.0.field | propertyValue                                 |
      | details.0.error | propertyValue:  is not a valid property value |
    And the response status code should be 400

    Examples:
      | property    | value         |
      | isPlaying   | (EmptyString) |
      | isSpectator | (EmptyString) |

  @pag04 @negative
  Scenario Outline: Verify that a player cannot be updated, if the value for is isPlaying or isSpectator are not a boolean.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value      |
      | propertyName  | <property> |
      | propertyValue | <value>    |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                                |
      | errorMessage    | Record validation failed                             |
      | details.0.field | propertyValue                                        |
      | details.0.error | propertyValue: <value> is not a valid property value |
    And the response status code should be 400

    Examples:
      | property    | value |
      | isPlaying   | error |
      | isSpectator | *//8  |

  @pag03 @negative
  Scenario: Verify that a player cannot be updated, if the property name has an empty value.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value         |
      | propertyName  | (EmptyString) |
      | propertyValue | false         |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                       |
      | errorMessage    | Record validation failed                    |
      | details.0.field | propertyName                                |
      | details.0.error | propertyName:  is not a valid property name |
    And the response status code should be 400

  @pag05 @negative
  Scenario Outline: Verify that a player cannot be updated, if the property name is not isPlaying or isSpectator.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value      |
      | propertyName  | <property> |
      | propertyValue | <value>    |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                                 |
      | errorMessage    | Record validation failed                              |
      | details.0.field | propertyName                                          |
      | details.0.error | propertyName: <property> is not a valid property name |
    And the response status code should be 400

    Examples:
      | property                  | value |
      | isAvailableToRevealCards  | false |
      | isAvailableToManageIssues | true  |
      | /;'?'                     | true  |

  @pag06 @negative @bug
  Scenario: Verifies that a player cannot be updated, except by the game creator.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value     |
      | propertyName  | isPlaying |
      | propertyValue | false     |
    And  the "user2" logs in to PPS
    And the "user2" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                                                       |
      | errorMessage    | Forbidden access                                                            |
      | details.0.error | Forbidden access to entity with id: <Game.playersInGame.0.playerDetails.id> |
      | details.0.field | userOwner                                                                   |
    And the response status code should be 401

  @pag07 @negative
  Scenario: Verify that a player cannot be upgraded without a valid token.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag08 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value       |
      | propertyName  | isSpectator |
      | propertyValue | false       |
    And the "user invalid" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @pag08
  Scenario: Verify that a player cannot be updated with an invalid game ID.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value     |
      | propertyName  | isPlaying |
      | propertyValue | false     |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/-100/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key             | value                            |
      | errorMessage    | Entity not found                 |
      | details.0.error | Game with ID: -100 was not found |
      | details.0.field | ID                               |
    And the response status code should be 404

  @pag09
  Scenario: Verify that a player cannot be updated with an invalid player ID.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value       |
      | propertyName  | isSpectator |
      | propertyValue | true        |
    And the "user1" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/-100"
    Then the response body should verify the "error" with:
      | Key             | value                              |
      | errorMessage    | Entity not found                   |
      | details.0.error | Player with ID: -100 was not found |
      | details.0.field | ID                                 |
    And the response status code should be 404

  @pag10
  Scenario: Verify that a player cannot be updated without token.
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game pag01 |
      | deck.name | Power of 2 |
    When the user sets the request params with:
      | Key           | value     |
      | propertyName  | isPlaying |
      | propertyValue | false     |
    And the "user without token" sends a "PATCH" request to "/planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id>"
    Then the response body should verify the "error" with:
      | Key   | value                                                                           |
      | error | Unauthorized                                                                    |
      | path  | /planning-poker/games/<Game.id>/players/<Game.playersInGame.0.playerDetails.id> |
    And the response status code should be 401
