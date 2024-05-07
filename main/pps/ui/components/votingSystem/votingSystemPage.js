const { By } = require("selenium-webdriver");

/**
 * Create the VotingSystemPage class.
 */
class VotingSystemPage {
    /**
     * The constructor function initializes selectors.
     */
    constructor() {
        this.notificationToast = By.css("div[role=alert]");
    }
}

module.exports = new VotingSystemPage();
