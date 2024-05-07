const { By } = require("selenium-webdriver");
const actions = require("../../../../core/ui/utils/driverActions");
const logger = require("../../../../core/utils/loggerManager");
const conditions = require("../../../../core/ui/utils/driverConditions");

/**
 * The `JoinGameModal` class represents a modal for joining a game. It provides methods to interact with and verify elements within the modal.
 */
class GameSettingsModal {
    /**
     * Creates an instance of the `JoinGameModal` class.
     */
    constructor() {
        this.facilitatorSelector = By.css("div[data-testid='edit-game-facilitator-input']");
        this.facilitatorName = (newFacilitatorName) => {
            return By.xpath(`//li[contains(., '${newFacilitatorName}')]`);
        }; 
        this.isDonutChartInput = By.css("input[name=isDonutChart] + span");
        this.saveSettingButton = By.xpath("//button[text()='Save']");
        this.gameNameInput = By.id("name");
        this.allowFacilitatorVotingToggle = By.css("input[name=allowFacilitatorVoting]");
        this.playersAbleToRevealCardsInput = By.css("input[name=playersAbleToRevealCards]");
        this.playersAbleToManageIssuesInput = By.css("input[name=playersAbleToManageIssues]");
        this.playersListPopper = By.css("div.MuiAutocomplete-popper");
        this.clearPlayersSelectedRevealCards = By.css("div[data-testid='edit-game-reveal-cards'] svg[data-testid='CancelIcon'].MuiChip-deleteIcon");
        this.clearPlayersSelectedManageIssues = By.css("div[data-testid='edit-game-manage-issues'] svg[data-testid='CancelIcon'].MuiChip-deleteIcon");
        this.votingSystemSelected = By.id("votingSystem");
        this.votingSystemsList = (votingSystemName) => {
            return By.css(`li[data-value="${votingSystemName}"]`);
        };
        this.deckPreview = By.css("div.preview div.cards-container div");
        this.errorMessages = (errorMessage) => {
            return By.xpath(`//p[contains(@class,'Mui-error') and text()='${errorMessage}']`);
        };
    }
    /**
     * Returns the locators of elements within the Join Game modal.
     */
    async changeFacilitator(newFacilitatorName) {
        try {
            await actions.clickOn(this.facilitatorSelector);
            logger.info("Facilitator selector dropdown clicked.");
            const facilitatorOption = this.facilitatorName(newFacilitatorName);
            await conditions.waitUntilElementIsLocated(facilitatorOption);
            await actions.clickOn(facilitatorOption);
            logger.info(`Facilitator changed to ${newFacilitatorName}.`);
            await conditions.waitUntilElementIsLocated(this.saveSettingButton);
            await actions.clickOn(this.saveSettingButton);
            logger.info("Changes saved successfully.");
        } catch (error) {
            logger.error("Error while trying to change the facilitator and click save.", error);
            throw error;
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
    /**
     * Change the pie chart to bars.
    */
    async changeChart() {
        await conditions.waitUntilElementIsLocated(this.isDonutChartInput);
        await actions.clickOn(By.xpath("//input[@name='isDonutChart']//parent::span")) ;
        await conditions.waitUntilElementIsLocated(this.saveSettingButton);
        await conditions.waitUntilElementIsEnabled(this.saveSettingButton);
        await actions.clickOn(this.saveSettingButton);
    }

    /**
     * The function changes the fields values.
     * @param data - The `data` parameter is an object that contains the fields and their corresponding
     * values that need to be changed.
     */
    async changeFields( data ) {
        for (const field in data) {
            logger.debug(`Fields: "${field}" = ${data[field]}`);
            if(field === "Name") {
                await actions.clearValue(this.gameNameInput);
                const gameName = 
                    data[field] === "(emptyString)" ? "" : 
                        data[field] === "(onlyWhitespaces)" ? "  " : data[field];
                await actions.sendKeys(this.gameNameInput, gameName);
            }
            if(field === "Can facilitator vote") {
                await actions.clickOn(this.allowFacilitatorVotingToggle);
            }
            if(field === "Voting System") {
                await actions.clickOn(this.votingSystemSelected);
                await actions.clickOn(this.votingSystemsList(data[field]));
            }
            if(field === "Can Reveal Cards") {
                if(data[field] === "(none)") await actions.clickOn(this.clearPlayersSelectedRevealCards);
                else{
                    await actions.clickOn(this.playersAbleToRevealCardsInput);
                    await actions.sendKeys(this.playersAbleToRevealCardsInput, data[field]);
                    const player = await actions.getWebElement(this.playersListPopper);
                    logger.debug("Players list popper:", await player.getText());
                    await actions.clickOn(this.playersListPopper);
                }
            }
            if(field === "Can Manage Issues") {
                if(data[field] === "(none)") await actions.clickOn(this.clearPlayersSelectedManageIssues);
                else{
                    await actions.clickOn(this.playersAbleToManageIssuesInput);
                    await actions.sendKeys(this.playersAbleToManageIssuesInput, data[field]);
                    const player = await actions.getWebElement(this.playersListPopper);
                    logger.debug("Players list popper:", await player.getText());
                    await actions.clickOn(this.playersListPopper);
                }
            }
        }
    }

    /**
     * Preview deck cards.
    */
    async previewDeckCards() {
        const cardsDeck = [];
        const cardsElement = await actions.getWebElements(this.deckPreview);
        for(let card of cardsElement) {
            cardsDeck.push(await card.getText());
        }
        logger.debug(`Cards deck: ${cardsDeck}`);
        return cardsDeck;
    } 
}

module.exports = new GameSettingsModal();
