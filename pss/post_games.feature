@api @games @functional @smoke @loginUser1 @deleteGame 
Feature: Post games
  Test performed on API endpoints, contains test cases related to the creation of games with POST method.

  @pog01
  Scenario: Create a game (1)
    Given the user sets the following request body for create a game:
      | Key       | value     |
      | name      | Game 1    |
      | deck.name | Fibonacci |
    When the user sends a "POST" request to "/planning-poker/games"
    Then the response status code should be 201
    And the response body should verify the game with:
      | name           | Game 1    |
      | status         | INITIAL   |
      | deck.name      | Fibonacci |
      | deck.userOwner | system    |
    And the response schema should be verified with "create_game"

  @pog04 
  Scenario: Create two games with the same name (2)
    Given the user creates a game with:
      | Key       | value     |
      | name      | Game Test |
      | deck.name | Fibonacci | 
    And the user sets the following request body for create a game:
      | Key       | value     |
      | name      | Game Test |
      | deck.name | Fibonacci |
    When the user sends a "POST" request to "/planning-poker/games"
    And the response body should verify the error with:
      | errorMessage  | Entity already registered |
      | details.field | name                      |
      | details.error | Entity already registered |
    Then the response status code should be 400
