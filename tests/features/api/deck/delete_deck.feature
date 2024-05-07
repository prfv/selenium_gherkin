@api @decks @functional @loginUser1
Feature: Delete decks
  Test performed on API endpoints, contains test cases related to the deck with Delete method.

  @ded01 @smoke @deleteDeck
  Scenario: Verify that a deck can be deleted
    Given the user creates a deck with:
      | Key           | value             |
      | name          | Deck ded01        |
      | isActive      | true              |
      | isCustom      | true              |
      | cards.0.value | c1                |
      | cards.1.value | c2                |
      | cards.2.value | c3                |
    When the "user1" sends a "DELETE" request to "/planning-poker/decks/<Deck.id>"
    Then the response status code should be 204

  @ded02 @negative
  Scenario: Verify that a deck can not be deleted without deck ID
    When the "user1" sends a "DELETE" request to "/planning-poker/decks"
    Then the response body should verify the "error" with:
      | Key                 | value                         |
      | errorMessage        | Oops! Invalid data provided   |
      | details.0.error     | invalid uri                   |
      | details.0.field     | URI                           |
    And the response status code should be 405

  @ded03 @negative
  Scenario: Verify that a deck can not be deleted without blank space instead deck ID
    When the "user1" sends a "DELETE" request to "/planning-poker/decks/ "
    Then the response body should verify the "error" with:
      | Key                 | value                         |
      | errorMessage        | Oops! Invalid data provided   |
      | details.0.error     | invalid uri                   |
      | details.0.field     | URI                           |
    And the response status code should be 405

  @ded04 @negative
  Scenario: Verify that a deck can not be deleted with a deck ID with special characters
    When the "user1" sends a "DELETE" request to "/planning-poker/decks/.,"
    Then the response body should verify the "error" with:
      | Key               | value                           |
      | errorMessage      | Entity not found                |
      | details.0.field   | ID                              |
      | details.0.error   | Deck with id: ., was not found  |
    And the response status code should be 404

  @ded05 @negative
  Scenario: Verify that a deck can not be deleted with an inexistent deck ID
    When the "user1" sends a "DELETE" request to "/planning-poker/decks/100"
    Then the response body should verify the "error" with:
      | Key               | value                           |
      | errorMessage      | Entity not found                |
      | details.0.field   | ID                              |
      | details.0.error   | Entity with ID: 100 not found   |
    And the response status code should be 404
