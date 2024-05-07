@ui @issuesUI @loginUser1 @deleteGame
Feature: Issues
  Test performed on UI, contains test cases related to the issues.

  Background:
    Given the "user1" logs into the PPS

  @games08 @functional @acceptance @e2e @deleteDownloadedFile @onlyLocal
  Scenario: Verify that is possible to download the list of issues from a created game
    Given the user creates a game with:
      | Key       | value              |
      | name      | Game Issues Upload |
      | deck.name | Fibonacci          |
    And the user creates an issue with:
      | Key         | value         |
      | name        | Issue 1       |
      | description | Issue to test |
    And the user goes to the games list
    And the user selects "Game Issues Upload" Game
    When the user downloads issues in a file
    Then the "Game Issues Upload-issues.csv" file should be in dowload folder
    And the file should contain the following lines
      | Lines                       |
      | Name,Description,Estimation |
      | Issue 1,Issue to test,      |

  @games09 @functional @acceptance @e2e @onlyLocal
  Scenario: Verify that is possible to upload a list of issues to a created game
    Given the user creates a game with:
      | Key       | value       |
      | name      | Game Issues |
      | deck.name | Fibonacci   |
    And the user goes to the games list
    And the user selects "Game Issues" Game
    When the user adds issues from a file
    Then the "issue 1" issue is displayed
    And the "issue 2" issue is displayed

  @games05 @smoke @functional @acceptance @visualTesting
  Scenario: Verify that is possible to create, edit and delete an issue
    And the user creates a game from navbar with the following data:
      | Key           | value        |
      | Name          | Game issue01 |
      | Voting System | Fibonacci    |
    When the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue 01                           |
      | Description | This is a description for issue 01 |
    And the user goes to the home page
    And the user goes to the games list
    And the user selects the game "<Game.Name>"
    And the "<Issue.Name>" issue should be displayed in the issues list
    And the user goes to the home page
    And the user goes to the games list
    And the user selects the game "<Game.Name>"
    And the user edits an issue with the following data:
      | Key         | value                                      |
      | Name        | Issue 01 edit                              |
      | Description | This is a description for edit an issue 01 |
    And Percy takes a modal screenshot and save it with the name "Filled edit issue modal"
    And the user confirm the Save action
    And the user goes to the home page
    And the user goes to the games list
    And the user selects the game "<Game.Name>"
    Then the "<Issue.Name>" issue should be displayed in the issues list
    And the user goes to the home page
    And the user goes to the games list
    And the user selects the game "<Game.Name>"
    And the user deletes "<Issue.Name>" issue
    And Percy takes a modal screenshot and save it with the name "Delete issue modal"
    And the user confirm the Delete action
    And the user goes to the home page
    And the user goes to the games list
    And the user selects the game "<Game.Name>"
    And the "<Issue.Name>" issue shouldn't be displayed in the issues list

  @games16 @acceptance @functional @loginUser2
  Scenario: Verify that an issue can be set with the final result
    And the user creates a game from navbar with the following data:
      | Key           | value      |
      | Name          | Game 16    |
      | Voting System | Power of 2 |
    And the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue game 16                      |
      | Description | This is a description for issue 01 |
    And the "user1" should be in the player list
    And the user adds the player "user2" by API
      | Key                       | value                  |
      | playerDetails.name        | <Users.user2.username> |
      | playerDetails.userOwner   | <Users.user2.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    And the "user2" should be in the player list
    And the user sends the issue to vote
    When the user starts the voting
    And the user votes with the value "2" in the game
    And the "user2" votes for API the value "4" in the game
    And the user reveals cards
    And the graph should be a "pie"
    And the user sets the issue result with "2" card
    Then the estimate of the issue result should be in the created issue:
      | Key         | value                              |
      | Name        | Issue game 16                      |
      | Description | This is a description for issue 01 |
      | Estimation  | 2                                  |

  @games17 @functional @onlyLocal
  Scenario: Verify that an issue can be dragged to the vote
    And the user creates a game from navbar with the following data:
      | Key           | value     |
      | Name          | Game 17   |
      | Voting System | Fibonacci |
    And the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue game 17                      |
      | Description | This is a description for issue 01 |
    When the user drags the issue to vote
    Then the issue should be in the voting area with the following data:
      | Key                 | value                              |
      | Name to vote        | Issue game 17                      |
      | Description to vote | This is a description for issue 01 |
