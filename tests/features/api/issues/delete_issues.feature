@api @issues @functional @loginUser1 @deleteGame
Feature: Delete issues
  Test performed on API endpoints, contains test cases related to the issues with DELETE method.
  
  @dei01
  Scenario: Verify that an issue can be deleted
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game dei01 |
          | deck.name | Power of 2 |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response status code should be 204
    And the "user1" sends a "GET" request to "/planning-poker/games/issues/<Issues.0.id>"
    And the response body should verify the "error" with:
          | Key             | value                                      |
          | errorMessage    | Entity not found                           |
          | details.0.field | ID                                         |
          | details.0.error | Issue with ID: <Issues.0.id> was not found |
          | statusCode      | 404                                        |

  @dei02 @negative
  Scenario: Verify that an issue cannot be deleted without issue ID
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game dei02 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |      
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/"
    Then the response status code should be 404
    And the response body should verify the "error" with:
          | Key             | value                              |
          | errorMessage    | Entity not found                   |
          | details.0.field | ID                                 |
          | details.0.error | Game with id: issues was not found |
          | statusCode      | 404                                |

  @dei03 @negative
  Scenario: Verify that an issue cannot be deleted with ID invalid
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game dei03 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |      
    When the "user1" sends a "DELETE" request to "/planning-poker/games/issues/-100"
    Then the response status code should be 404
    And the response body should verify the "error" with:
          | Key             | value                             |
          | errorMessage    | Entity not found                  |
          | details.0.field | ID                                |
          | details.0.error | Issue with ID: -100 was not found |
          | statusCode      | 404                               |

  @dei04 @negative
  Scenario: Verify that an issue cannot be deleted with invalid token
    Given the user creates a game with:
          | Key       | value      |
          | name      | Game dei04 |
          | deck.name | Fibonacci  |
    And the user creates an issue with:
          | Key         | value                   |
          | name        | API: add issue          |
          | description | Be able to add an issue |
    When the "user invalid" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response status code should be 401
    And the response body should verify the "error" with:
          | Key             | value                |
          | errorMessage    | Bad User credentials |
          | details.0.field | Authorization        |
          | details.0.error | Unauthorized token   |
          | statusCode      | 401                  |

  @dei05 @negative @bug
  Scenario: Verify that an issue cannot be deleted. if it does not belong to the user. 
    Given the user creates a game with:
      | Key       | value      |
      | name      | Game dei05 |
      | deck.name | Fibonacci  |
    And the user creates an issue with:
      | Key         | value                   |
      | name        | API: add issue          |
      | description | Be able to add an issue |
    And the "user2" logs in to PPS
    When the "user2" sends a "DELETE" request to "/planning-poker/games/issues/<Issues.0.id>"
    Then the response body should verify the "error" with:
          | Key              | value                                             |
          | errorMessage     | Forbidden access                                  |
          | details.0.field  | userOwner                                         |
          | details.0.error  | Forbidden access to entity with id: <Issues.0.id> |
    And the response status code should be 401
