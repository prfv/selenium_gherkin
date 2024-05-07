@api @decks @functional @negative @loginUser1
Feature: Get deck
  Test performed on API endpoints, contains test cases related to the deck with Get method.

  @ged01
  Scenario: Verify that a deck can not be retrieve with a deck ID with special characters
    When the "user1" sends a "GET" request to "/planning-poker/decks/.,"
    Then the response body should verify the "error" with:
      | Key             | value                          |
      | errorMessage    | Entity not found               |
      | details.0.field | ID                             |
      | details.0.error | Deck with id: ., was not found |
    And the response status code should be 404

  @ged02
  Scenario: Verify that a deck can not be retrieve with an inexistent deck ID
    When the "user1" sends a "GET" request to "/planning-poker/decks/100"
    Then the response body should verify the "error" with:
      | Key             | value                               |
      | errorMessage    | Entity not found                    |
      | details.0.field | ID                                  |
      | details.0.error | The deck with ID: 100 was not found |
    And the response status code should be 404
