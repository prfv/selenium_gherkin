@ui @decksUI
Feature: Custom voting systems
  Test performed on UI, contains test cases related to custom voting systems.

  @decks01 @functional @smoke @acceptance @visualTesting
  Scenario: Create, edit and delete a custom voting system
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    When the user selects from the menu the option to add a custom voting system
    And Percy takes a modal screenshot and save it with the name "Create voting system modal"
    And the user uses the following data to create a custom voting system:
      | Key                 | value            |
      | Voting System Name  | Deck decks01     |
      | Voting System Cards | 2,4,6,8,10,12,14 |
    Then the user should see the following data in the list of voting systems:
      | Key                 | value              |
      | Voting System Name  | Deck decks01       |
      | Voting System Cards | (2,4,6,8,10,12,14) |
    And the user selects from the menu the "Deck decks01" option to edit a custom voting system
    And Percy takes a modal screenshot and save it with the name "Edit voting system modal"
    And the user uses the following data to edit a custom voting system:
      | Key                 | value           |
      | Voting System Name  | New decks01     |
      | Voting System Cards | 1,3,5,7,9,11,13 |
    And the user should see the following data in the list of voting systems:
      | Key                 | value             |
      | Voting System Name  | New decks01       |
      | Voting System Cards | (1,3,5,7,9,11,13) |
    And the user should see the trash icon to delete the created voting system
    And the user clicks on the delete voting system button
    And Percy takes a modal screenshot and save it with the name "Delete voting system modal"
    And the user deletes the created voting system
    And the user shouldn't see the following data in the list of voting systems:
      | Key                 | value             |
      | Voting System Name  | New decks01       |
      | Voting System Cards | (1,3,5,7,9,11,13) |

  @decks04 @decks14 @decks15 @decks17 @negative @boundary
  Scenario: Verify deck field restrictions
    #Verify that is not possible to add less than 2 cards to a deck
    #Verify that is not possible to add more than 15 cards
    #Verify that is not possible to end with a comma.
    #Verify that is not possible to create a new voting system without cards
    #Verify that is not possible to add a card to a deck with more than 3 characters
    Given the "user1" logs into the PPS
    When the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    And the user fill the deck field with:
      | Key                 | value          |
      | Voting System Cards | (Empty String) |
    Then the user should see the "Enter up 3 characters per value, separated by commas." error message on "deck" field
    And the user should not have save button enabled
    And the user fill the deck field with:
      | Key                 | value |
      | Voting System Cards | (1)   |
    And the user should see the "The minimum number of cards required is 2" error message on "deck" field
    And the user should not have save button enabled
    And the user fill the deck field with:
      | Key                 | value                                    |
      | Voting System Cards | (1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16) |
    And the user should see the "The maximum number of cards required is 15" error message on "deck" field
    And the user fill the deck field with:
      | Key                 | value              |
      | Voting System Cards | 1,2,3,4,5,6,7,8,9, |
    And the user should see the "Cards must have the following structure: (Ex: 1,2,3) or (Ex: A,B,C) and the values must have a length of 1 to 3" error message on "deck" field
    And the user should not have save button enabled
    And the user fill the deck field with:
      | Key                 | value               |
      | Voting System Cards | 1a2b,2a3b,3a4b,4a5b |
    And the user should see the "Cards must have the following structure: (Ex: 1,2,3) or (Ex: A,B,C) and the values must have a length of 1 to 3" error message on "deck" field
    And the user should not have save button enabled

  @decks05 @decks06 @negative @boundary
  Scenario: Verify name field restrictions
    #Verify that the voting system Name cannot contain special characters
    #Verify that is not possible to create a new voting system with an empty name
    Given the "user1" logs into the PPS
    When the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    And the user fill the deck field with:
      | Key                 | value   |
      | Voting System Cards | 1,2,3,4 |
    Then the user should see the "Voting system name is required." error message on "name" field
    And the user should not have save button enabled
    And the user fill the name field with:
      | Key                | value   |
      | Voting System Name | $%&name |
    And the user should see the "Voting system Name should match the format. Example: [1-System, System, System123, System_1, System-1, System 1]" error message on "name" field
    And the user should not have save button enabled

  @decks08 @acceptance @negative @loginUser1
  Scenario: Verify that is not possible to add an empty card to new voting system
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    When the user fill the Create Voting System form with:
      | Key                 | value        |
      | Voting System Name  | Deck decks08 |
      | Voting System Cards | 1,,3         |
    Then the user should see the "Cards must have the following structure: (Ex: 1,2,3) or (Ex: A,B,C) and the values must have a length of 1 to 3" error message on "deck" field
    And the user should not have save button enabled
    And the user sets the following request body for a "deck":
      | Key           | value         |
      | name          | Deck decks08  |
      | isActive      | true          |
      | isCustom      | true          |
      | cards.0.value | 1             |
      | cards.1.value | (EmptyString) |
      | cards.2.value | 3             |
    And the "user1" sends a "POST" request to "/planning-poker/decks"
    And the response body should verify the "error" with:
      | Key             | value                                    |
      | errorMessage    | Record validation failed                 |
      | details.0.field | cards[1].value                           |
      | details.0.error | cards[1].value: Card should not be blank |
    And the response status code should be 400

  @decks16 @negative @boundary
  Scenario: Verify name field max length
    Given the "user1" logs into the PPS
    When the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    And the user uses the following data to create a custom voting system:
      | Key                 | value            |
      | Voting System Name  | (randomName51)   |
      | Voting System Cards | 2,4,6,8,10,12,14 |
    Then the user should see "50" characters in the list name of voting systems
    And the user deletes voting system

  @decks18 @functional @negative
  Scenario: Verify that a custom voting system cannot be deleted when it is used in a game
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    And the user uses the following data to create a custom voting system:
      | Key                 | value            |
      | Voting System Name  | Deck decks18     |
      | Voting System Cards | 2,4,6,8,10,12,14 |
    And the user should see the following data in the list of voting systems:
      | Key                 | value              |
      | Voting System Name  | Deck decks18       |
      | Voting System Cards | (2,4,6,8,10,12,14) |
    And the user goes to the home page
    And the user creates a game with the following data:
      | Key           | value        |
      | Name          | Game decks18 |
      | Voting System | Deck decks18 |
    And the created game should display this information on the header:
      | Key  | value        |
      | Name | Game decks18 |
    When the user clicks on the Voting Systems option in the navbar
    And the user deletes voting system
    Then the user should see the "The voting system cannot be deleted because it is currently used in a game." notification
    And the user should see the following data in the list of voting systems:
      | Key                 | value              |
      | Voting System Name  | Deck decks18       |
      | Voting System Cards | (2,4,6,8,10,12,14) |
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value        |
      | Name          | Game decks18 |
      | Voting System | Deck decks18 |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user verifies that the game shouldn't be in the games list with:
      | Key           | value        |
      | Name          | Game decks18 |
      | Voting System | Deck decks18 |
    And the user goes to the home page
    And the user clicks on the Voting Systems option in the navbar
    And the user deletes voting system
    And the user shouldn't see the following data in the list of voting systems:
      | Key                 | value              |
      | Voting System Name  | Deck decks18       |
      | Voting System Cards | (2,4,6,8,10,12,14) |

  @decks10 @functional @smoke @acceptance
  Scenario: Verify that clicking Cancel button does not add a new voting system
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    When the user selects from the menu the option to add a custom voting system
    And the user fill the Create Voting System form with:
      | Key                 | value   |
      | Voting System Name  | decks10 |
      | Voting System Cards | 1,2,3,4 |
    And the user clicks the cancel button
    And the user shouldn't see the following data in the list of voting systems:
      | Key                 | value   |
      | Voting System Name  | decks10 |
      | Voting System Cards | 1,2,3,4 |

  @decks09 @negative
  Scenario: Verify default voting system
    #Verify that is possible to view the default voting system
    #Verify that is not possible to edit a default voting system
    Given the "user1" logs into the PPS
    When the user clicks on the Voting Systems option in the navbar
    Then the user should see the following data in the list of default voting systems:
      | Key                 | value                |
      | Voting System Name  | Fibonacci            |
      | Voting System Cards | (1,2,3,5,8,13,21,34) |
    And the user selects from the menu the "Fibonacci" option to edit a custom voting system
    And the user should not be able to send text on Name field
    And the user should not be able to send text on Cards field
    And the user clicks the cancel button
    And the user should see the following data in the list of default voting systems:
      | Key                 | value             |
      | Voting System Name  | Power of 2        |
      | Voting System Cards | (0,1,2,4,8,16,32) |
    And the user selects from the menu the "Power of 2" option to edit a custom voting system
    And the user should not be able to send text on Name field
    And the user should not be able to send text on Cards field
    And the user clicks the cancel button
    And the user should see the following data in the list of default voting systems:
      | Key                 | value                 |
      | Voting System Name  | T-shirt               |
      | Voting System Cards | (XXS,XS,S,M,L,XL,XXL) |
    And the user selects from the menu the "T-shirt" option to edit a custom voting system
    And the user should not be able to send text on Name field
    And the user should not be able to send text on Cards field

  @decks12 @smoke @functional @acceptance @e2e
  Scenario: Verify that is possible to create a New Game with a created Voting System
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    And the user uses the following data to create a custom voting system:
      | Key                 | value          |
      | Voting System Name  | Deck decks12   |
      | Voting System Cards | c1,c2,c3,c4,c5 |
    And the user should see the following data in the list of voting systems:
      | Key                 | value            |
      | Voting System Name  | Deck decks12     |
      | Voting System Cards | (c1,c2,c3,c4,c5) |
    When the user goes to the home page
    And the user creates a game with the following data:
      | Key           | value        |
      | Name          | Game decks12 |
      | Voting System | Deck decks12 |
    Then the "Game decks12" game should be displayed the following elements:
      | Game Name         |
      | Spectator         |
      | Invitation link   |
      | Settings          |
      | Issues Area       |
      | Issue box         |
      | Start voting      |
      | Players area      |
      | Cards area        |
      | Deck presentation |
    And the game page should display the following data:
      | Key     | value          |
      | Players | Me             |
      | Cards   | c1,c2,c3,c4,c5 |
    And the user goes to the games list
    And the user verifies that the game should be in the games list with:
      | Key           | value        |
      | Name          | Game decks12 |
      | Voting System | Deck decks12 |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user verifies that the game shouldn't be in the games list with:
      | Key           | value        |
      | Name          | Game decks12 |
      | Voting System | Deck decks12 |
    And the user goes to the home page
    And the user clicks on the Voting Systems option in the navbar
    And the user deletes voting system
    And the user shouldn't see the following data in the list of voting systems:
      | Key                 | value            |
      | Voting System Name  | Deck decks12     |
      | Voting System Cards | (c1,c2,c3,c4,c5) |

  @decks19 @smoke @functional @acceptance @e2e
  Scenario: Verify that the created voting system is displayed to preset value of an issue
    Given the "user1" logs into the PPS
    And the user clicks on the Voting Systems option in the navbar
    And the user selects from the menu the option to add a custom voting system
    When the user uses the following data to create a custom voting system:
      | Key                 | value          |
      | Voting System Name  | Deck decks19   |
      | Voting System Cards | p1,p2,p3,p4,p5 |
    And the user goes to the home page
    And the user creates a game with the following data:
      | Key           | value             |
      | Name          | Game Deck decks19 |
      | Voting System | Deck decks19      |
    And the "Game Deck decks19" game should be displayed the following elements:
      | Game Name         |
      | Spectator         |
      | Invitation link   |
      | Settings          |
      | Issues Area       |
      | Issue box         |
      | Start voting      |
      | Players area      |
      | Cards area        |
      | Deck presentation |
    And the game page should display the following data:
      | Key     | value          |
      | Players | Me             |
      | Cards   | p1,p2,p3,p4,p5 |
    And the user creates an issue with the following data:
      | Key         | value                                   |
      | Name        | Issue Deck decks19                      |
      | Description | This is a description for issue decks19 |
    And the user should see following data in the card list:
      | Key   | value            |
      | Cards | [p1,p2,p3,p4,p5] |
    And the user goes to the games list
    Then the user verifies that the game should be in the games list with:
      | Key           | value             |
      | Name          | Game Deck decks19 |
      | Voting System | Deck decks19      |
    And the user deletes a selected game
    And the user confirms deleting the game
    And the user goes to the home page
    And the user clicks on the Voting Systems option in the navbar
    And the user deletes voting system
    And the user shouldn't see the following data in the list of voting systems:
      | Key                 | value            |
      | Voting System Name  | Deck decks19     |
      | Voting System Cards | (p1,p2,p3,p4,p5) |
