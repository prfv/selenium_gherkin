const { By } = require("selenium-webdriver");
const actions = require("../../../../core/ui/utils/driverActions");
const logger = require("../../../../core/utils/loggerManager");
const conditions = require("../../../../core/ui/utils/driverConditions");

/**
 * The `JoinGameModal` class represents a modal for joining a game. It provides methods to interact with and verify elements within the modal.
 */
class JoinGameModal {
    /**
     * Creates an instance of the `JoinGameModal` class.
     */
    constructor() {
        this.joinGameTitle = By.xpath("//div[text()='Join Game']");
        this.gameName = (name) => {
            return By.xpath(`//div[text()='${name}']`);
        }; 
        this.continueToGameBtn = By.xpath("//button/p[text()='Continue to game']");
    }
    /**
     * Returns the locators of elements within the Join Game modal.
     */
    joinGameElements(name) {
        return {
            "Join Game": this.joinGameTitle,              
            "Game Name": this.gameName(name),                             
            "Continue game button": this.continueToGameBtn,                             
        }
    }

    /**
     * Verifies if specified elements are displayed within the Join Game modal.
     * @param {string} gameName - The name of the game for which elements should be verified.
     * @returns {boolean} `true` if all specified elements are displayed; otherwise, `false`.
     */
    async displayedElements (elements, gameName) {
        const visibleElements = [];
        for (const element of elements) {
            const locator = this.joinGameElements(gameName)[element];
            logger.debug("This is the element locator.", locator);
            await conditions.waitUntilElementIsLocated(locator);
            const isVisible = await actions.getWebElement(locator);
            visibleElements.push(await isVisible.isDisplayed());
        }
        return visibleElements.every((isVisible) => isVisible === true);
    }
}

module.exports = new JoinGameModal();
