@ui @mygamesUI
Feature: My game UI
  Test performed on UI pages related to myGame.

  @games01 @games02 @games04 @smoke @functional @e2e @visualTesting
  Scenario: Verify that is possible to open games
    Verify that the list of created games is displayed
    Verify that is possible to delete games
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value         |
      | Name          | Game myGame01 |
      | Voting System | Fibonacci     |
    And the "<Games.0.Name>" game should be displayed the following elements:
      | Game Name   |
      | Issues Area |
      | Voting Area |
    And the user goes to the home page
    And the user creates a game from navbar with the following data:
      | Key           | value         |
      | Name          | Game myGame02 |
      | Voting System | Power of 2    |
    And the "<Games.1.Name>" game should be displayed the following elements:
      | Game Name   |
      | Issues Area |
      | Voting Area |
    When the user goes to the games list
    Then the game list should be displayed the following elements:
      | Delete Button       |
      | Name                |
      | Voting System       |
      | Facilitator         |
      | Issues Number       |
      | Total Estimation    |
      | Duration Estimation |
      | Players Number      |
      | Date                |
    And the following games should be shown in the list:
      | <Games.0.Name> |
      | <Games.1.Name> |
    And take a snapshot with Percy with the name "games01-verify mygames page"
    And the user selects the game "<Games.0.Name>"
    And the "<Games.0.Name>" game should be displayed the following elements:
      | Game Name   |
      | Issues Area |
      | Voting Area |
    And the user goes to the games list
    And the user selects the game "<Games.1.Name>"
    And the "<Games.1.Name>" game should be displayed the following elements:
      | Game Name   |
      | Issues Area |
      | Voting Area |
    And the user goes to the games list
    And the user deletes the game "<Games.0.Name>"
    And the user confirms deleting the game
    And the user goes to the home page
    And the user goes to the games list
    And the user deletes the game "<Games.1.Name>"
    And the user confirms deleting the game
    And the user goes to the home page
    And the user goes to the games list
    And the following games shouldn't be shown in the list:
      | <Games.0.Name> |
      | <Games.1.Name> |

  @games14 @acceptance @deleteGame @loginUser1 
  Scenario: Verify that the names of facilitators is displayed in my game list
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value        |
      | Name          | Game games14 |
      | Voting System | T-shirt      |
    And the user creates an issue with the following data:
      | Key         | value                             |
      | Name        | Issue games14 test 1              |
      | Description | This is a description for issue 1 |
    And the user goes to the games list
    And the user verifies the name of the facilitator with:
      | user1 |
    And the user selects the game "<Game.Name>"
    And the "user1" clicks on add member icon button
    And the "user1" saves the invitation link
    And the "user1" logs out from PPS
    And the "user2" logs into PPS and opens the invitation link
    And the "user2" clicks on the continue to game button
    And the "user2" clicks on game settings button
    When the "user2" changes the actual facilitator
    And the user creates an issue with the following data:
      | Key         | value                             |
      | Name        | Issue games14 test 2              |
      | Description | This is a description for issue 2 |
    And the user goes to the games list
    And the user verifies the name of the facilitator with:
      | user1 |
      | user2 |
    And the "user2" logs out from PPS
    And the "user3" logs into PPS and opens the invitation link
    And the "user3" clicks on the continue to game button
    And the "user3" clicks on game settings button
    And the "user3" changes the actual facilitator
    And the user creates an issue with the following data:
      | Key         | value                             |
      | Name        | Issue games14 test 3              |
      | Description | This is a description for issue 3 |
    And the user goes to the games list
    Then the user verifies the name of the facilitator with:
      | user1 |
      | user2 |
      | user3 |
