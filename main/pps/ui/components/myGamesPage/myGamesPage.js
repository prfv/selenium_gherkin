const { By } = require('selenium-webdriver');
const actions = require("../../../../../main/core/ui/utils/driverActions.js");
const loggerService= require('./../../../../core/utils/loggerManager');
const conditions = require("../../../../core/ui/utils/driverConditions");
    
/**
 * The `myGamesPage` class represents a page containing the games list, providing methods to interact with
 * and check the visibility of game list elements.
 */
class MyGamesPage {

    /**
     * Constructor function initializes an instance of the `myGamesPage` class with a property
     */
    constructor() {
        this.deleteButton = By.xpath("//button//p[text()='Delete']");
        this.confirmDeleteBtn = By.xpath("//button[text()='Delete']");
        this.gameInfo = ( gameName, gameDeck) => {
            return By.xpath(`//h2[text()='${gameName}']/../..//h2[text()='${gameDeck}']/../..`);
        };
        this.gameSelected = ( gameName ) => {
            return By.xpath(`//h2[text()='${gameName}']/ancestor::tr/td[1]//input[@type='checkbox']`);
        };
        this.selectGameName = (gameName) => {
            return By.xpath(
                `//h2[@class='label-body game-name' and text()="${gameName}"]`,
            );
        };
        this.gameNameList = By.css("h2[class=label-body game-name]");
        this.deleteGamesButton = By.xpath("//p[text()='Delete']");
        this.nameInHeader = By.xpath(`//h2[@class='label-head-left' and text()="Name"]`);
        this.votingSystemInHeader = By.xpath(`//h2[@class='label-head-left' and text()="Voting System"]`);
        this.facilitatorInHeader = By.xpath(`//h2[@class='label-head-left' and text()="Facilitator"]`);
        this.issuesNumberInHeader = By.xpath(`//h2[@class='label-head' and text()="#Issues"]`);
        this.totalEstimationInHeader = By.xpath(`//h2[@class='label-head' and text()="Total Estimation"]`);
        this.durationEstimationInHeader = By.xpath(`//h2[@class='label-head' and text()="Duration Estimation"]`);
        this.playersNumberInHeader = By.xpath(`//h2[@class='label-head' and text()="#Players"]`);
        this.dateInHeader = By.xpath(`//h2[@class='label-head' and text()="Date"]`);
        this.myGameContent = By.css("div[class=game-page]");
    }
    
    /**
   * Deletes a game with the given game name.
   * @param {string} gameName - The name of the game to create.
   */
    async deleteGame(gameName) {
        try{
            loggerService.info(`Deleting game: ${gameName}`);    
            const gameSelected = await this.gameSelected(gameName);
            await actions.clickOn(gameSelected);
            await actions.clickOn(this.deleteButton);
        } catch (error) {
            loggerService.error(`Error while deleting game: ${gameName}`, error);
            throw error;
        }
    } 
    
    /**
     * Opens a Game
     */
    async openGame(gameName) {
        loggerService.info(`the user clicks on "${gameName}" game`);
        const gameLabel = By.xpath(`//tr//h2[text() = '${gameName}']`)
        return await actions.clickOn(gameLabel);
    }
     

    /**
     * Returns true if the game is in the ;game list.
     * @param {string} games array with the game names.
     */
    async gameNameIsVisible (games) {
        const visibleGame = [];
        for (const element of games) {
            const locator = this.selectGameName(element);
            loggerService.debug("This is the game name.", element);
            const isVisibleGame = await actions.getWebElement(locator);
            visibleGame.push(await isVisibleGame.isDisplayed());
        }
        return visibleGame.every((isVisible) => isVisible === true);
    }

    /**
     * Returns the elements in the mygame page.
     */
    async gameNameIsNotVisible () {
        let elements = [];
        await conditions.waitUntilElementIsLocated(this.myGameContent);
        await conditions.waitUntilElementIsEnabled(this.myGameContent);
        const listOfElements = await actions.getWebElements(
            this.myGameContent
        );
        for (const element of listOfElements) {
            elements.push(await element.getText());
        }
        elements = elements[0].slice("+");
        loggerService.debug("These are the content.", elements);
        return elements;
    }

    /**
     * Returns the locators of the elements that are inside the myGame page.
     */
    myGameElements() {
        return {
            "Delete Button": this.deleteGamesButton,              
            "Name": this.nameInHeader,                
            "Voting System": this.votingSystemInHeader,
            "Facilitator": this.facilitatorInHeader,         
            "Issues Number": this.issuesNumberInHeader,
            "Total Estimation": this.totalEstimationInHeader,    
            "Duration Estimation": this.durationEstimationInHeader,
            "Players Number": this.playersNumberInHeader,     
            "Date": this.dateInHeader,                
        }
    }

    /**
     * Returns true if all the elements were located in the myGame page.
     * @param {string} elements Array of elements to check.
     */
    async displayedElements (elements) {
        const visibleElements = [];
        for (const element of elements) {
            const locator = this.myGameElements()[element];
            loggerService.debug("This is the element locator.", locator);
            await conditions.waitUntilElementIsLocated(locator);
            const isVisible = await actions.getWebElement(locator);
            visibleElements.push(await isVisible.isDisplayed());
        }
        return visibleElements.every((isVisible) => isVisible === true);
    }
    /**
     * Verifies if the facilitator's name is visible on the page.
     * @param {string} usernameKey - The key to get the username from the environment variables.
     * @returns {Promise<boolean>} - True if the facilitator's name is visible, false otherwise.
     */
    async facilitatorNameIsVisible(expectedFacilitatorNames) {
        try {
            let containsQueries = expectedFacilitatorNames.split(', ').map(name => `contains(text(), "${name.trim()}")`).join(' and ');
            const facilitatorNameLocator = By.xpath("//h2[@class='label-body' and " + containsQueries + "]");
            await conditions.waitUntilElementIsLocated(facilitatorNameLocator);
            const facilitatorNameElement = await actions.getWebElement(facilitatorNameLocator);
            const isFacilitatorNameVisible = await facilitatorNameElement.isDisplayed();
            loggerService.info(`Facilitator names visibility check: ${isFacilitatorNameVisible}`);
            return isFacilitatorNameVisible;
        } catch (error) {
            loggerService.error('Error checking facilitator names visibility', error);
            throw error;
        }
    }
}    
module.exports = new MyGamesPage();
