const { By } = require("selenium-webdriver");
const actions = require("../../../../core/ui/utils/driverActions");
const logger = require("../../../../core/utils/loggerManager");

/**
 * The CreateGameForm class that represents a form for creating a game and
 * provides methods for filling out the form and submitting it. 
 */
class CreateGameForm {
    /**
     * Sets locators for the Create Game Form class
     */
    constructor() {
        this.gameNameField = By.id("name");
        this.votingSystemSelect = By.id("deck");
        this.votingSystemsList = By.css("ul[role='listbox'] li p");
        this.errorMessageNameField = By.id("name-helper-text");
        this.cancelButton = By.css("div.MuiDialogActions-root button[type='button']");
        this.saveButton = By.css("div.MuiDialogActions-root button[type='submit']");
    }

    /**
     * Function to fill out the form.
     * @param data - The `data` parameter is an object that contains the necessary information to
     * create a game.
     */
    async fillOutForm( data ) {
        await actions.sendKeys(this.gameNameField, data.Name);
        logger.debug(`"Game name" field was filled with "${data.Name}"`);
        await actions.clickOn(this.votingSystemSelect);
        const votingSystemsOptions = await actions.getWebElements(this.votingSystemsList);
        for(let element of votingSystemsOptions) {
            const votingSystem = (await element.getText()).split(' - ')[0].trim();
            if(votingSystem === data["Voting System"]) await element.click();
        }
        logger.debug(`"${ data["Voting System"] }" was selected as voting system`);
    }

    /**
     * The `createGame` function clicks on a "Save" button.
     */
    async createGame() {
        await actions.clickOn(this.saveButton);
        logger.debug(`The "Save" button was clicked`);
    }
}

module.exports = new CreateGameForm();
