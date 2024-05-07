@api @decks @functional @loginUser1
Feature: Put decks
  Test performed on API endpoints, contains test cases related to the edition of decks with PUT method.

  @pud01 @smoke @deleteDeck
  Scenario: Edit a deck successfully
    Given the user creates a deck with:
      | Key           | value      |
      | name          | Deck pud01 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | c1         |
      | cards.1.value | c2         |
      | cards.2.value | c3         |
    When the user sets the following request body for a "deck":
      | Key           | value          |
      | name          | New deck pud01 |
      | isActive      | true           |
      | isCustom      | true           |
      | cards.0.value | c1             |
      | cards.1.value | c2             |
      | cards.2.value | c3             |
      | cards.3.value | c4             |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    And the response body should verify the "deck" with:
      | Key           | value                  |
      | name          | New deck pud01         |
      | isActive      | true                   |
      | isCustom      | true                   |
      | cards.0.value | c1                     |
      | cards.1.value | c2                     |
      | cards.2.value | c3                     |
      | cards.3.value | c4                     |
      | userOwner     | <Users.user1.username> |
    And the response schema should be verified with "edit_deck"
    And the response status code should be 200

  @pud02 @negative @deleteDeck
  Scenario: Edit a deck with incorrect parameters 
    Given the user creates a deck with:
      | Key           | value      |
      | name          | Deck pud02 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | c1         |
      | cards.1.value | c2         |
      | cards.2.value | c3         |
    When the user sets the following request body for a "deck":
      | Key          | value          |
      | nameDeck     | New deck pud02 |
      | active       | true           |
      | custom       | true           |
      | cards0.value | c1             |
      | cards1.value | c2             |
      | cards2.value | c3             |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                    |
      | errorMessage    | Record validation failed |
      | details.0.field | cards                    |
      | details.0.error | cards: must not be null  |
      | details.1.field | name                     |
      | details.1.error | name: must not be null   |
      | details.2.field | name                     |
      | details.2.error | name: must not be empty  |
      | statusCode      | 400                      |
    And the response status code should be 400

  @pud03 @negative @deleteDeck
  Scenario: Edit a deck with invalid credentials
    Given the user creates a deck with:
      | Key           | value      |
      | name          | Deck pud03 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | c1         |
      | cards.1.value | c2         |
      | cards.2.value | c3         |
    And the user sets the following request body for a "deck":
      | Key           | value          |
      | name          | New deck pud03 |
      | isActive      | true           |
      | isCustom      | true           |
      | cards.0.value | c1             |
      | cards.1.value | c2             |
      | cards.2.value | c3             |
      | cards.3.value | c4             |
    And the "user invalid" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                |
      | errorMessage    | Bad User credentials |
      | details.0.error | Unauthorized token   |
      | details.0.field | Authorization        |
    And the response status code should be 401

  @pud04 @negative @bug @deleteDeck
  Scenario: Edit a deck without permissions
    Given the user creates a deck with:
      | Key           | value      |
      | name          | Deck pud04 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | c1         |
      | cards.1.value | c2         |
      | cards.2.value | c3         |
    When the "user2" logs in to PPS
    And the user sets the following request body for a "deck":
      | Key           | value          |
      | name          | New deck pud04 |
      | isActive      | true           |
      | isCustom      | true           |
      | cards.0.value | c1             |
      | cards.1.value | c2             |
      | cards.2.value | c3             |
      | cards.3.value | c4             |
    And the "user2" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                         |
      | errorMessage    | Forbidden access                              |
      | details.0.error | Forbidden access to entity with id: <Deck.id> |
      | details.0.field | userOwner                                     |
    And the response status code should be 401

  @pud05 @negative
  Scenario: Edit a non-existing deck
    When the user sets the following request body for a "deck":
      | Key           | value          |
      | name          | New deck pud05 |
      | isActive      | true           |
      | isCustom      | true           |
      | cards.0.value | c1             |
      | cards.1.value | c2             |
      | cards.2.value | c3             |
      | cards.3.value | c4             |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/100"
    Then the response body should verify the "error" with:
      | Key             | value                               |
      | errorMessage    | Entity not found                    |
      | details.0.field | ID                                  |
      | details.0.error | The deck with ID: 100 was not found |
    And the response status code should be 404

  @pud06 @acceptance @negative @bug @deleteDeck
  Scenario: Change the name of a deck to an existing one
    Given the user creates a deck with:
      | Key           | value        |
      | name          | Deck pud06 1 |
      | isActive      | true         |
      | isCustom      | true         |
      | cards.0.value | c1           |
      | cards.1.value | c2           |
      | cards.2.value | c3           |
    When the user sets the following request body for a "deck":
      | Key           | value      |
      | name          | Power of 2 |
      | isActive      | true       |
      | isCustom      | true       |
      | cards.0.value | d1         |
      | cards.1.value | d2         |
      | cards.2.value | d3         |
      | cards.3.value | d4         |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                     |
      | errorMessage    | Entity already registered |
      | details.0.field | name                      |
      | details.0.error | Entity already registered |
    And the response status code should be 400

  @pud07 @negative @deleteDeck
  Scenario: Verify that a deck can not be edited with empty name
    Given the user creates a deck with:
      | Key           | value        |
      | name          | Deck pud07   |
      | isActive      | true         |
      | isCustom      | true         |
      | cards.0.value | c1           |
      | cards.1.value | c2           |
      | cards.2.value | c3           |
    When the user sets the following request body for a "deck":
      | Key           | value         |
      | name          | (EmptyString) |
      | isActive      | true          |
      | isCustom      | true          |
      | cards.0.value | d1            |
      | cards.1.value | d2            |
      | cards.2.value | d3            |
      | cards.3.value | d4            |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                         |
      | errorMessage    | Record validation failed      |
      | details.0.field | name                          |
      | details.0.error | name: must not be empty       |
    And the response status code should be 400

  @pud08 @negative @deleteDeck
  Scenario: Verify that a deck can not be edited with a name with special characters
    Given the user creates a deck with:
      | Key           | value        |
      | name          | Deck pud08   |
      | isActive      | true         |
      | isCustom      | true         |
      | cards.0.value | c1           |
      | cards.1.value | c2           |
      | cards.2.value | c3           |
    When the user sets the following request body for a "deck":
      | Key           | value             |
      | name          | Deck pod08..,/-_  |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | d1                |
      | cards.1.value | d2                |
      | cards.2.value | d3                |
      | cards.3.value | d4                |
    And the "user1" sends a "PUT" request to "/planning-poker/decks/<Deck.id>"
    Then the response body should verify the "error" with:
      | Key             | value                                                                                                             |
      | errorMessage    | Record validation failed                                                                                          |
      | details.0.field | name                                                                                                              |
      | details.0.error | Voting system Name should match the format. Example: [1-System, System, System123, System_1, System-1, System 1]  |
    And the response status code should be 400
