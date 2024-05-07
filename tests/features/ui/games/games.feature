@ui @gamesUI
Feature: Games
  Test performed on UI, contains test cases related to games.

  @cg01 @smoke @functional @acceptance @visualTesting
  Scenario: The user creates a game through homepage button
    Given the "user1" logs into the PPS
    When the user clicks to the create game button
    And Percy takes a modal screenshot and save it with the name "Create game modal - home page button"
    And the user enters the following game details:
      | Key           | value     |
      | Name          | Game cg01 |
      | Voting System | T-shirt   |
    And the created game should display this information on the header:
      | Key  | value     |
      | Name | Game cg01 |
    And take a snapshot with Percy with the name "cg01-verify the game page"
    And the user goes to the games list
    Then the user verifies that the game should be in the games list with:
      | Key           | value     |
      | Name          | Game cg01 |
      | Voting System | T-shirt   |
    And the user deletes a selected game
    And Percy takes a modal screenshot and save it with the name "Delete game modal - mygames"
    And the user confirms deleting the game
    And the user verifies that the game shouldn't be in the games list with:
      | Key           | value     |
      | Name          | Game cg01 |
      | Voting System | T-shirt   |

  @cg02 @smoke @functional @acceptance @visualTesting
  Scenario: The user creates a game through navigation bar button
    Given the "user1" logs into the PPS
    When the user clicks to the create game button on the navigation bar
    And Percy takes a modal screenshot and save it with the name "Create game modal - navbar option"
    And the user enters the following game details:
      | Key           | value     |
      | Name          | Game cg02 |
      | Voting System | Fibonacci |
    And the created game should display this information on the header:
      | Key  | value     |
      | Name | Game cg02 |
    And the user goes to the games list
    Then the user verifies that the game should be in the games list with:
      | Key           | value     |
      | Name          | Game cg02 |
      | Voting System | Fibonacci |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user verifies that the game shouldn't be in the games list with:
      | Key           | value     |
      | Name          | Game cg02 |
      | Voting System | Fibonacci |

  @cg03 @functional @negative @deleteGame @loginUser1
  Scenario: Verify the error messages in the Game name field
    Given the "user1" logs into the PPS
    And the user creates a game with the following data:
      | Key           | value     |
      | Name          | Game cg03 |
      | Voting System | T-shirt   |
    And the user goes to the home page
    When the user tries to create a game with:
      | Key           | value     |
      | Name          | Game cg03 |
      | Voting System | Fibonacci |
    Then the user should see the "Game name is already in use." error message below the Game name field
    And the Save button should keep disabled
    And the user clicks on the Cancel button
    And the user goes to the home page
    And the user tries to create a game with:
      | Key           | value          |
      | Name          | (Empty String) |
      | Voting System | Fibonacci      |
    And the user should see the "Name is required." error message below the Game name field
    And the Save button should keep disabled

  @cg05 @acceptance @negative @visualTesting
  Scenario: Verify that the game name field allows a maximum of 200 characters
    Given the "user1" logs into the PPS
    And the user creates a game with the following data:
      | Key           | value                        |
      | Name          | (String with 200 characters) |
      | Voting System | Fibonacci                    |
    And the created game should display this information on the header:
      | Key  | value       |
      | Name | <Game.name> |
    And take a snapshot with Percy with the name "cg05-verify the game page"
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value       |
      | Name          | <Game.name> |
      | Voting System | Fibonacci   |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user goes to the home page
    When the user creates a game with the following data:
      | Key           | value                        |
      | Name          | (String with 201 characters) |
      | Voting System | Power of 2                   |
    Then the user should only see the first 200 characters of the game name on the header
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value       |
      | Name          | <Game.name> |
      | Voting System | Power of 2  |
    And the user deletes a selected game
    And the user confirms deleting the game

  @cg06 @smoke @functional
  Scenario: The user verifies that Game Name field accepts special characters (!@#$%^&*_+?)
    Given the "user1" logs into the PPS
    When the user clicks to the create game button
    And the user enters the following game details:
      | Key           | value                   |
      | Name          | Game cg06 - !@#$%^&*_+? |
      | Voting System | T-shirt                 |
    And the created game should display this information on the header:
      | Key  | value                   |
      | Name | Game cg06 - !@#$%^&*_+? |
    And the user goes to the games list
    Then the user verifies that the game should be in the games list with:
      | Key           | value                   |
      | Name          | Game cg06 - !@#$%^&*_+? |
      | Voting System | T-shirt                 |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user verifies that the game shouldn't be in the games list with:
      | Key           | value                   |
      | Name          | Game cg06 - !@#$%^&*_+? |
      | Voting System | T-shirt                 |

  @games10 @acceptance @deleteGame @loginUser1
  Scenario: Verify that is possible to get the invitation link for a game
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value        |
      | Name          | Game games10 |
      | Voting System | T-shirt      |
    When the "user1" clicks on add member icon button
    And the "user1" should see the invite player modal with this information:
      | Game's URL           |
      | Copy Invitation Link |
    And the "user1" saves the invitation link
    And the "user1" logs out from PPS
    And the "user2" logs into PPS and opens the invitation link
    Then the "user2" should see displayed the join game modal of the "<Games.0.Name>" with this information:
      | Join Game            |
      | Game Name            |
      | Continue game button |
    And the "user2" clicks on the continue to game button
    And the created game should display this information on the header:
      | Key  | value        |
      | Name | Game games10 |

  @games03 @games13 @acceptance @functional @e2e @loginUser1 @loginUser2 @loginUser3 @deleteGame @visualTesting @bug
  Scenario: Verify that is possible to change voting results chart type to bars
    Verify that is possibble to vote an existing game
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value         |
      | Name          | Game games 03 |
      | Voting System | T-shirt       |
    And the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue games 03                     |
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
    And the user adds the player "user3" by API
      | Key                       | value                  |
      | playerDetails.name        | <Users.user3.username> |
      | playerDetails.userOwner   | <Users.user3.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    And the "user3" should be in the player list
    And the user should see in the players area the following data:
      | Me                     |
      | <Users.user2.username> |
      | <Users.user3.username> |
    And the "user1" sends a "GET" request to "/planning-poker/games/<Games.0.id>"
    And the response status code should be 200
    And the response body should verify the "game" with:
      | Key                                     | value                  |
      | name                                    | Game games 03          |
      | deck.name                               | T-shirt                |
      | playersInGame.0.playerDetails.name      | <Users.user1.username> |
      | playersInGame.0.playerDetails.userOwner | <Users.user1.username> |
      | playersInGame.1.playerDetails.name      | <Users.user2.username> |
      | playersInGame.1.playerDetails.userOwner | <Users.user2.username> |
      | playersInGame.2.playerDetails.name      | <Users.user3.username> |
      | playersInGame.2.playerDetails.userOwner | <Users.user3.username> |
    And the user sends the issue to vote
    When the user starts the voting
    And the user votes with the value "M" in the game
    And the "user2" votes for API the value "XL" in the game
    And the "user3" votes for API the value "M" in the game
    And the user reveals cards
    And take a snapshot with Percy with the name "games03-verify pie graph"
    Then the graph should be a "pie"
    And the results graph should be verified with the players' votes
    And the "M" card with the highest number of votes should be in "green" on the graph
    And the "M" vote of player "user1" should be visible on the revealed cards
    And the "XL" vote of player "user2" should be visible on the revealed cards
    And the "M" vote of player "user3" should be visible on the revealed cards
    And the user changes the pie chart to bar charts
    And the graph should be a "bar"
    And the user starts the voting
    And the graph should not be displayed

  @eg01 @smoke @functional @deleteGame @loginUser1 @visualTesting
  Scenario: Verify that a player can change unrestricted properties of a game
    Verify that a player can change the name of a created game
    Verify that in a game it is possible to set that the game facilitator can not vote
    Verify that a player can change the voting system of a created game
    Verify that it is possible to preview the selected deck
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value     |
      | Name          | Game eg01 |
      | Voting System | T-shirt   |
    And the created game should display this information on the header:
      | Key  | value     |
      | Name | Game eg01 |
    And the "user1" clicks on add member icon button
    And the "user1" should see the invite player modal with this information:
      | Game's URL           |
      | Copy Invitation Link |
    And the "user1" saves the invitation link
    And the "user1" logs out from PPS
    And the "user2" logs into PPS and opens the invitation link
    And the "user2" should see displayed the join game modal of the "<Games.0.Name>" with this information:
      | Join Game            |
      | Game Name            |
      | Continue game button |
    And the "user2" clicks on the continue to game button
    When the "user2" clicks on game settings button
    And Percy takes a modal screenshot and save it with the name "Edit game modal as guest"
    And the user sets the following data to edit the game:
      | Key                  | value         |
      | Name                 | New Game eg01 |
      | Can facilitator vote | false         |
      | Voting System        | Power of 2    |
    Then the user should preview the cards of the new selected voting system:
      | 0,1,2,4,8,16,32 |
    And the user clicks on the Save button to save the changes
    And the created game should display this information on the header:
      | Key  | value         |
      | Name | New Game eg01 |
    And the game page should display the following data:
      | Key     | value           |
      | Players | Me              |
      | Cards   | 0,1,2,4,8,16,32 |
    And the user goes to the games list
    And the "user2" logs out from PPS
    And the "user1" logs into the PPS
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value         |
      | Name          | New Game eg01 |
      | Voting System | Power of 2    |
    And the user selects the game "New Game eg01"
    And the user starts the voting
    And the user should not be able to choose any card from the deck

  @eg02 @smoke @functional @deleteGame @loginUser1 @visualTesting
  Scenario: Verify that the game owner can set the reveal cards and manage issues fields
    Verify that the game owner can set who can reveal the cards in the game
    Verify that the game owner can set who can manage the issues in the game
    Verify that an invited player can not set who can reveal cards and manage issues in a game
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value     |
      | Name          | Game eg02 |
      | Voting System | T-shirt   |
    And the created game should display this information on the header:
      | Key  | value     |
      | Name | Game eg02 |
    And the "user1" clicks on add member icon button
    And the "user1" should see the invite player modal with this information:
      | Game's URL           |
      | Copy Invitation Link |
    And the "user1" saves the invitation link
    And the "user1" logs out from PPS
    And the "user2" logs into PPS and opens the invitation link
    And the "user2" should see displayed the join game modal of the "<Games.0.Name>" with this information:
      | Join Game            |
      | Game Name            |
      | Continue game button |
    And the "user2" clicks on the continue to game button
    When the "user2" clicks on game settings button
    Then the user should see the Can Reveal Cards and Can Manage Issues fields disabled
    And the user clicks on the Cancel button
    And the user goes to the games list
    And the "user2" logs out from PPS
    And the "user1" logs into the PPS
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value     |
      | Name          | Game eg02 |
      | Voting System | T-shirt   |
    And the user selects the game "Game eg02"
    And the "user1" clicks on game settings button
    And Percy takes a modal screenshot and save it with the name "Edit game modal as owner"
    And the user sets the following data to edit the game:
      | Key               | value                  |
      | Can Reveal Cards  | <Users.user1.username> |
      | Can Manage Issues | <Users.user1.username> |
    And the user clicks on the Save button to save the changes
    And the user should see the Add an issue button "enabled" in the Issues section
    And the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue Game eg02                    |
      | Description | This is a description for issue 01 |
    And the user sends the issue to vote
    And the user starts the voting
    And the user votes with the value "M" in the game
    And the "user1" logs out from PPS
    And the "user2" logs into the PPS
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value     |
      | Name          | Game eg02 |
      | Voting System | T-shirt   |
    And the user selects the game "Game eg02"
    And the user votes with the value "XL" in the game
    And the user should see the Reveal Cards button disabled
    And the user should see the Add an issue button "disabled" in the Issues section
    And the user goes to the games list
    And the "user2" logs out from PPS
    And the "user1" logs into the PPS
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value     |
      | Name          | Game eg02 |
      | Voting System | T-shirt   |
    And the user selects the game "Game eg02"
    And the user reveals cards
    And the graph should be a "pie"

  @eg03 @acceptance @negative @deleteGame @loginUser1 @onlyLocal
  Scenario: Verify the error messages in the edit game fields
    Verify that the Game name field does not allow an empty string
    Verify that the Game name field does not allow only whitespace characters
    Verify that at least one player is able to reveal cards in a created game
    Verify that at least one player is able to manage issues in a created game
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value     |
      | Name          | Game eg03 |
      | Voting System | Fibonacci |
    And the created game should display this information on the header:
      | Key  | value     |
      | Name | Game eg03 |
    When the "user1" clicks on game settings button
    And the user sets the following data to edit the game:
      | Key  | value         |
      | Name | (emptyString) |
    Then the user should see the "Name is required" error message bellow the field
    And the Save button should keep disabled
    And the user sets the following data to edit the game:
      | Key  | value             |
      | Name | (onlyWhitespaces) |
    And the user should see the "Name must not be empty" error message bellow the field
    And the Save button should keep disabled
    And the user sets the following data to edit the game:
      | Key              | value  |
      | Can Reveal Cards | (none) |
    And the user should see the "At least one player must be able to reveal cards" error message bellow the field
    And the Save button should keep disabled
    And the user sets the following data to edit the game:
      | Key               | value  |
      | Can Manage Issues | (none) |
    And the user should see the "At least one player must be able to manage issues" error message bellow the field
    And the Save button should keep disabled
    And the user clicks on the Cancel button

  @games18 @acceptance @functional @loginUser1 @loginUser2 @loginUser3 @deleteGame @visualTesting
  Scenario: Verify that it is possible to change the chart type to bars before the vote
    Given the "user1" logs into the PPS
    And the user creates a game from navbar with the following data:
      | Key           | value     |
      | Name          | Games 18  |
      | Voting System | Fibonacci |
    And the user creates an issue with the following data:
      | Key         | value                              |
      | Name        | Issue games 018                    |
      | Description | This is a description for issue 18 |
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
    And the user adds the player "user3" by API
      | Key                       | value                  |
      | playerDetails.name        | <Users.user3.username> |
      | playerDetails.userOwner   | <Users.user3.username> |
      | isSpectator               | false                  |
      | isAvailableToRevealCards  | true                   |
      | isAvailableToManageIssues | true                   |
      | isPlaying                 | true                   |
    And the "user3" should be in the player list
    And the user should see in the players area the following data:
      | Me                     |
      | <Users.user2.username> |
      | <Users.user3.username> |
    And the user changes the pie chart to bar charts
    And the user sends the issue to vote
    When the user starts the voting
    And the user votes with the value "2" in the game
    And the "user2" votes for API the value "8" in the game
    And the "user3" votes for API the value "2" in the game
    And the user reveals cards
    And take a snapshot with Percy with the name "games18-verify bars graph"
    Then the graph should be a "bar"
