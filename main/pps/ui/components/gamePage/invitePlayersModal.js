const { By } = require("selenium-webdriver");
const actions = require("../../../../core/ui/utils/driverActions");
const logger = require("../../../../core/utils/loggerManager");
const conditions = require("../../../../core/ui/utils/driverConditions");

/**
 * The `InvitePlayersModal` class represents a modal used to invite players to a game.
 * It provides methods to interact with and verify elements within the modal.
 */
class InvitePlayersModal {
    /**
     * Creates an instance of the `InvitePlayersModal` class.
     */
    constructor() {
        this.gameUrl = By.id("url");
        this.copyLinkButton = By.xpath("//button[text()='Copy Invitation Link']");
    }
    /**
     * Returns the locators of the elements that are inside the inivte players modal.
     */
    invitePlayerElements() {
        return {
            "Game's URL": this.gameUrl,              
            "Copy Invitation Link": this.copyLinkButton,                             
        }
    }

    /**
     * Verifies if specified elements are displayed within the invite players modal.
     * @returns {boolean} `true` if all specified elements are displayed; otherwise, `false`.
     */
    async displayedElements (elements) {
        const visibleElements = [];
        for (const element of elements) {
            const locator = this.invitePlayerElements()[element];
            logger.debug("This is the element locator.", locator);
            await conditions.waitUntilElementIsLocated(locator);
            const isVisible = await actions.getWebElement(locator);
            visibleElements.push(await isVisible.isDisplayed());
        }
        return visibleElements.every((isVisible) => isVisible === true);
    }
    /**
     * Retrieves the game's invitation link from the modal and copies it.
     *  @returns {string} The invitation link.
     */
    async getInvLink() {
        await conditions.waitUntilElementIsLocated(this.gameUrl);
        logger.debug('Located copy link button and game URL elements.');
        const getLink = await actions.getWebElement(this.gameUrl);
        const invitationLink = await getLink.getAttribute('value');
        logger.debug('Retrieved game link.', invitationLink);
        await actions.clickOn(this.copyLinkButton);
        logger.debug('Clicked the copy link button.');
        return invitationLink;
    }
}

module.exports = new InvitePlayersModal();
