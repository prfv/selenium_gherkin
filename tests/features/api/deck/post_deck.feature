@api @decks @functional @loginUser1
Feature: Post decks
  Test performed on API endpoints, contains test cases related to the deck with POST method.

  @pod01 @smoke @deleteDeck
  Scenario: Verify that an active and custom deck can be created
    Given the user sets the following request body for a "deck":
      | Key           | value      |
      | name          | Deck pod01 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | c1         |
      | cards.1.value | c2         |
      | cards.2.value | c3         |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response status code should be 201
    And the response body should verify the "deck" with:
      | Key           | value                  |
      | name          | Deck pod01             |
      | isActive      | true                   |
      | isCustom      | true                   |
      | cards.0.value | c1                     |
      | cards.1.value | c2                     |
      | cards.2.value | c3                     |
      | userOwner     | <Users.user1.username> |
    And the response schema should be verified with "create_deck"
    
  @pod02 @deleteDeck
  Scenario: Verify that an inactive deck can be created
    Given the user sets the following request body for a "deck":
      | Key             | value         |
      | name            | Deck pod02    |
      | isActive        | false         |
      | isCustom        | true          |
      | cards.0.value   | c1            |
      | cards.1.value   | c2            |
      | cards.2.value   | c3            |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response status code should be 201
    And the response body should verify the "deck" with:
      | Key               | value                 |
      | name              | Deck pod02            |
      | isActive          | false                 |
      | isCustom          | true                  |
      | cards.0.value     | c1                    |
      | cards.1.value     | c2                    |
      | cards.2.value     | c3                    |
      | userOwner         | <Users.user1.username>   |
    And the response schema should be verified with "create_deck"
    
  @pod03 @deleteDeck @negative
  Scenario: Verify that a not custom deck can not be created
    Given the user sets the following request body for a "deck":
      | Key             | value         |
      | name            | Deck pod03    |
      | isActive        | true          |
      | isCustom        | false         |
      | cards.0.value   | c1            |
      | cards.1.value   | c2            |
      | cards.2.value   | c3            |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response status code should be 201
    And the response body should verify the "deck" with:
      | Key               | value                     |
      | name              | Deck pod03                |
      | isActive          | true                      |
      | isCustom          | true                      |
      | cards.0.value     | c1                        |
      | cards.1.value     | c2                        |
      | cards.2.value     | c3                        |
      | userOwner         | <Users.user1.username>    |
    And the response schema should be verified with "create_deck"

  @pod04 @negative
  Scenario: Verify that a deck can not be created with an empty body
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key               | value                         |
      | errorMessage      | Record validation failed      |
      | details.0.field   | cards                         |
      | details.0.error   | cards: must not be null       |
      | details.1.field   | name                          |
      | details.1.error   | name: must not be empty       |
      | details.2.field   | name                          |
      | details.2.error   | name: must not be null        |
    And the response status code should be 400

  @pod05 @negative
  Scenario: Verify that a deck can not be created without required fields
    Given the user sets the following request body for a "deck":
      | Key             | value         |
      | isActive        | true          |
      | isCustom        | true          |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key               | value                         |
      | errorMessage      | Record validation failed      |
      | details.0.field   | cards                         |
      | details.0.error   | cards: must not be null       |
      | details.1.field   | name                          |
      | details.1.error   | name: must not be empty       |
      | details.2.field   | name                          |
      | details.2.error   | name: must not be null        |
    And the response status code should be 400

  @pod06 @negative
  Scenario: Verify that a deck can not be created without cards
    Given the user sets the following request body for a "deck":
      | Key             | value         |
      | name            | Deck pod06    |
      | isActive        | true          |
      | isCustom        | true          |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key             | value                         |
      | errorMessage    | Record validation failed      |
      | details.0.field | cards                         |
      | details.0.error | cards: must not be null       |
    And the response status code should be 400  

  @pod07 @negative
  Scenario: Verify that a deck can not be created with duplicated cards
    Given the user sets the following request body for a "deck":
      | Key           | value      |
      | name          | Deck pod07 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | 1          |
      | cards.1.value | 2          |
      | cards.2.value | 2          |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key             | value                                     |
      | errorMessage    | Record validation failed                  |
      | details.0.field | cards                                     |
      | details.0.error | Deck cards must not have duplicate values |
    And the response status code should be 400

  @pod08 @negative
  Scenario: Verify that a deck can not be created with empty array cards
    Given the user sets the following request body for a "deck":
      | Key      | value      |
      | name     | Deck pod08 |
      | isActive | true       |
      | isCustom | true       |
      | cards    | []         |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key             | value                                |
      | errorMessage    | Record validation failed             |
      | details.0.field | cards                                |
      | details.0.error | cards: size must be between 2 and 15 |
    And the response status code should be 400

  @pod09 @negative
  Scenario: Verify that a deck can not be created with empty name
    Given the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | (EmptyString)     |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "data" with:
      | Key             | value                         |
      | errorMessage    | Record validation failed      |
      | details.0.field | name                          |
      | details.0.error | name: must not be empty       |
    And the response status code should be 400

  @pod10 @negative
  Scenario: Verify that a deck can not be created with a name with special characters
    Given the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | Deck pod10..,/-_  |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key             | value                                                                                                             |
      | errorMessage    | Record validation failed                                                                                          |
      | details.0.field | name                                                                                                              |
      | details.0.error | Voting system Name should match the format. Example: [1-System, System, System123, System_1, System-1, System 1]  |
    And the response status code should be 400

  @pod11 @negative
  Scenario: Verify that a deck can not be created without token
    Given the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | Deck pod11        |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    When the "user without token" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key                 | value                         |
      | errorMessage        | Oops! Invalid data provided   |
      | details.0.error     | invalid uri                   |
      | details.0.field     | URI                           |
    And the response status code should be 400

  @pod12 @negative
  Scenario: Verify that a deck can not be created with an invalid token
    Given the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | Deck pod12        |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    When the "user invalid" sends a "POST" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.field | Authorization        |
      | details.0.error | Unauthorized token   |
    And the response status code should be 401

  @pod13 @negative @deleteDeck @bug
  Scenario: Verify that a deck can not be created with the name of an existent deck
    Given the user creates a deck with:
      | Key           | value             |
      | name          | Deck pod13        |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    And the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | Deck pod13        |
      | isActive      | false             |
      | isCustom      | true              |
      | cards.0.value | ca1               |
      | cards.1.value | ca2               |
      | cards.2.value | ca3               |
    When the "user1" sends a "POST" request to "/planning-poker/decks"
    And the response body should verify the "error" with:
      | Key             | value                     |
      | errorMessage    | Entity already registered |
      | details.0.field | name                      |
      | details.0.error | Entity already registered |
    Then the response status code should be 400
