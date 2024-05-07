const { By } = require("selenium-webdriver");
const conditions = require("../../../../core/ui/utils/driverConditions");
const actions = require("../../../../core/ui/utils/driverActions");
const path = require("path");
const logger = require("../../../../core/utils/loggerManager");

/**
 * The `GamePage` class represents a page containing a game, providing methods to interact with
 * and check the visibility of game elements.
 */
class GamePage {
    /**
     * Constructor function initializes an instance of the `GamePage` class with a property
     */
    constructor() {
        this.gameName = (name) => {
            return By.xpath(`//p[text()='${name}']`);
        }; 
        this.issueArea = By.xpath("//div[h6[text() = 'Issues']]");
        this.votingArea = By.className("main-content");
        this.dragAndDropArea = By.xpath("//p[text()='Drag an issue here']");
        this.playersArea = By.css("div.player-card-content");
        this.cardsArea = By.css("div[aria-label='select card']");
        this.cards = By.css("div[aria-label='select card'] button");
        this.deckPresentation = By.css("button[data-testid='deck-toggle-btn']");
        this.spectadorButton = By.css("button[data-testid='spectator-toggle-btn']");
        this.addPlayerButton = By.css("button[data-testid='add-player-btn']");
        this.settingsButton = By.css("button[data-testid='settings-btn']");
        this.editGameModal = By.xpath("//div/div/div[text()='Edit game']")
        this.addPlayerModal = By.xpath("//div[div/div[text()='Invite Players']]");
        this.joinGameModal = By.css('div.MuiPaper-root[role="dialog"]');
        this.sendToVoteIssueButton = By.xpath("//button[text()='Send to vote']");
        this.startVotingButton = By.xpath("//button[text()='Start Voting']");
        this.revealCardsButton = By.xpath("//button[text()='Reveal Cards']");
        this.valueVoteButton =  (value) => {
            return By.xpath(`//div[@data-testid='separated-deck']//button[div[div[text()='${value}']]]`);
        };  
        this.playerContainer = By.css("div[class=players-container]");
        this.votesLetters = By.className("recharts-layer recharts-pie-labels");
        this.votesValues = By.className("recharts-layer recharts-label-list");
        this.playerInCardReveal = (vote, user) => {
            return By.xpath(`//div[@class='player-estimation' and p[text()='${vote}']]//following-sibling::div[@class="player-card-name" and p[text()='${user}']]`);
        }; 
        this.settingGameButton = By.css("button[data-testid=settings-btn]");
        this.graphic = (figure) => {
            return By.className(`recharts-layer recharts-${figure}`);
        };
        this.textInColor = (color) => {
            return By.css(`rect[fill='${color}'] + text`);
        };
        this.uploadIssuesButton = By.css("#fileInput");
        this.issueLabels = By.xpath("//span[contains(@class, 'MuiCardHeader-title')]");
        this.downloadButton = By.xpath("//button[@data-testid='download-issues-btn']");
        this.colorInGraphic = By.className("recharts-sector");
    }
    
    /**
     * Returns the locators of the elements that are inside the game page.
     */
    gameElements(name) {
        return {
            "Game Name": this.gameName(name),
            "Issues Area": this.issueArea,
            "Voting Area": this.votingArea,
            "Spectator": this.spectadorButton,
            "Invitation link": this.addPlayerButton,
            "Settings": this.settingsButton,
            "Issue box": this.dragAndDropArea,
            "Start voting": this.startVotingButton,
            "Players area": this.playersArea,
            "Cards area": this.cardsArea,
            "Deck presentation": this.deckPresentation,
        }
    }

    /**
     * Returns true if all the elements were located in the game page.
     * @param {string} elements Array of elements to check.
     */
    async displayedElements (elements, gameName) {
        const visibleElements = [];
        for (const element of elements) {
            const locator = this.gameElements(gameName)[element];
            logger.debug("This is the element locator.", locator);
            await conditions.waitUntilElementIsLocated(locator);
            const isVisible = await actions.getWebElement(locator);
            visibleElements.push(await isVisible.isDisplayed());
        }
        return visibleElements.every((isVisible) => isVisible === true);
    }

    /**
     * Returns the players list
     */
    async getListOfPlayers() {
        let elements = [];
        await conditions.waitUntilElementIsLocated(this.playerContainer);
        await conditions.waitUntilElementIsVisible(this.playerContainer);
        const listOfElements = await actions.getWebElements(
            this.playerContainer
        );
        for (const element of listOfElements) {
            elements.push(await element.getText());
        }
        elements = elements[0].split("\n");
        return elements;
    }
    
    /**
     * Checks if a game with the specified name is visible on the page.
     * @param {string} gameName - The name of the game to check for visibility.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the game is visible, and `false` otherwise.
     */
    async gameNameIsVisible(gameName) {
        try {
            const gameLocator = this.gameName(gameName);
            await conditions.waitUntilElementIsLocated(gameLocator);
            const gameDisplayed = await actions.getWebElement(gameLocator);
            logger.info(`Game with name '${gameName}' is visible on the header: ${await gameDisplayed.isDisplayed()}`);
            return gameDisplayed.isDisplayed();
        } catch (error) {
            logger.error(`Error while checking if game '${gameName}' is visible`, error);
            throw error;
        }
    }
    
    /**
     * The function retrieves a list of players from a web page and returns it as an
     * array.
     * @returns The function returns a list of players.
     */
    async getPlayersList() {
        const playersList = [];
        const playersElement = await actions.getWebElements(this.playersArea);
        for(let player of playersElement) {
            playersList.push(await player.getText());
        }
        logger.debug(`Players list: ${playersList}`);
        return playersList;
    }
    
    /**
     * The function retrieves the text content of each card element in the cards area
     * and returns an array of the card texts.
     * @returns The function is returning an array of strings representing the cards in
     * the deck.
     */
    async getCardsDeck() {
        const cardsDeck = [];
        const cardsElement = await actions.getWebElements(this.cardsArea);
        for(let card of cardsElement) {
            cardsDeck.push(await card.getText());
        }
        logger.debug(`Cards deck: ${cardsDeck}`);
        return cardsDeck;
    }
    
    /**
     * This function verifies whether the cards are enabled or not.
     */
    async areCardsEnabled() {
        let cardsEnabled = true;
        const cardsElement = await actions.getWebElements(this.cards);
        for(const card of cardsElement) {
            const isCardEnabled = await card.isEnabled();
            cardsEnabled = cardsEnabled && isCardEnabled;
        }
        logger.debug(`Are the cards enabled? ${cardsEnabled}`);
        return cardsEnabled;
    }

    /**
     * Returns the votes list
     */
    async getListOfVotes(value) {
        let locator = value === "labels"? this.votesLetters : this.votesValues
        let elements = [];
        await conditions.waitUntilElementIsLocated(locator);
        await conditions.waitUntilElementIsVisible(locator);
        const listOfElements = await actions.getWebElements(
            locator
        );
        for (const element of listOfElements) {
            elements.push(await element.getText());
        }
        elements = elements[0].split("\n");
        return elements;
    }

    /**
     * Clicks on the game settings button and verifies that the edit game modal is displayed.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the modal is displayed, and `false` otherwise.
     */
    async clickGameSettings() {
        try {
            await actions.clickOn(this.settingsButton);
            logger.info("Clicked on the game settings button.");
            await conditions.waitUntilElementIsLocated(this.editGameModal);
            const modal = await actions.getWebElement(this.editGameModal);
            const isModalDisplayed = await modal.isDisplayed();
            logger.info(`Edit game modal is displayed: ${isModalDisplayed}`);
            return isModalDisplayed;
        } catch (error) {
            logger.error("Error while trying to click on settings and check modal.", error);
            throw error;
        }
    } 
    /**
     * Clicks on the add player button and verifies that the add player modal is displayed.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the modal is displayed, and `false` otherwise.
     */
    async clickAddPlayer() {
        try {
            await actions.clickOn(this.addPlayerButton);
            logger.info("Clicked on the add player button.");
            await conditions.waitUntilElementIsLocated(this.addPlayerModal);
            const modal = await actions.getWebElement(this.addPlayerModal);
            const isModalDisplayed = await modal.isDisplayed();
            logger.info(`Add player modal is displayed: ${isModalDisplayed}`);
            return isModalDisplayed;
        } catch (error) {
            logger.error("Error while trying to click on add player and check modal.", error);
            throw error;
        }
    } 
    /**
     * Upload issues drom a file
     */
    async uploadIssuesFromAFile() {
        // eslint-disable-next-line no-undef
        const filePath = path.join(__dirname, '../../../../../', 'main/pps/ui/resources/issues.csv')
        logger.info(`the file is uploadig from ${filePath}`);
        const file = path.resolve(filePath)
        await actions.sendKeys(this.uploadIssuesButton, file);
    }
        
    /**
         * Download issues into a file
         */
    async downloadIssuesIntoAFile() {
        await actions.clickOn(this.downloadButton)
    }
        
    /**
         * Returns all issues names of a game
         */
    async getIssuesNames() {
        const issues = await actions.getWebElements(this.issueLabels);
        let issueNames = await Promise.all(issues.map(issueName => {
            return issueName.getText();
        }));
        return issueNames
    }
}

module.exports = new GamePage();
