const { By } = require("selenium-webdriver");
const WebDriverConditions = require("../../../../core/ui/utils/driverConditions");
const WebDriverActions = require("../../../../core/ui/utils/driverActions");
const logger = require("../../../../core/utils/loggerManager");

/**
 * The VotingSystemForm class is a JavaScript class that represents a form for creating, editing, and
 * deleting voting systems.
 */
class VotingSystemForm {
    /**
     * The constructor function initializes variables for various elements on a form.
     */
    constructor() {
        this.formTitle = By.css("div.MuiBox-root div.MuiTypography-root.MuiTypography-body1");
        this.votingSystemNameField = By.id("name");
        this.votingSystemCardsField = By.id("cards");
        this.cancelButton = By.css("div.MuiDialogActions-root button[type='button']");
        this.saveButton = By.css("div.MuiDialogActions-root button[type='submit']");
        this.cancelDeleteButton = By.xpath("//button[.='Cancel']");
        this.deleteButton = By.xpath("//button[text()='Delete']");
        this.nameWarning = By.css("div[role='dialog'] p[id='name-helper-text']")
        this.deckWarning = By.css("div[role='dialog'] p[id='cards-helper-text']")
    }

    /**
     * The function creates a new voting system by filling in the form fields with the provided data
     * and clicking on the save button.
     * @param data - The `data` parameter is an object that contains the information needed to create a
     * new voting system. It should have the following properties:
     */
    async createNewVotingSystem( data ) {
        await WebDriverConditions.waitUntilElementIsLocated(this.formTitle);
        await WebDriverConditions.waitUntilElementIsVisible(this.formTitle);
        if(await WebDriverActions.getText(this.formTitle) === "Create Voting System") {
            await WebDriverActions.sendKeys(this.votingSystemNameField, data["Voting System Name"]);
            await WebDriverActions.sendKeys(this.votingSystemCardsField, data["Voting System Cards"]);
            await WebDriverActions.clickOn(this.saveButton);
            logger.debug(`A new deck was created: ${JSON.stringify(data)}`);
        }
    }

    /**
     * The function edits a voting system by updating the name and number of cards, and then saves the
     * changes.
     * @param data - The `data` parameter is an object that contains the following properties:
     */
    async editVotingSystem( data ) {
        await WebDriverConditions.waitUntilElementIsLocated(this.formTitle);
        await WebDriverConditions.waitUntilElementIsVisible(this.formTitle);
        if(await WebDriverActions.getText(this.formTitle) === "Voting System") {
            await WebDriverActions.clearValue(this.votingSystemNameField, data["Voting System Name"]);
            await WebDriverActions.sendKeys(this.votingSystemNameField, data["Voting System Name"]);
            await WebDriverActions.clearValue(this.votingSystemCardsField, data["Voting System Cards"]);
            await WebDriverActions.sendKeys(this.votingSystemCardsField, data["Voting System Cards"]);
            await WebDriverActions.clickOn(this.saveButton);
            logger.debug(`The deck was edited: ${JSON.stringify(data)}`);
        }
    }

    /**
     * This function deletes a voting system
     * @param data - The `data` parameter is an object that contains information about the voting
     * system that needs to be deleted.
     */
    async deleteVotingSystem( data ) {
        await WebDriverConditions.waitUntilElementIsLocated(this.formTitle);
        await WebDriverConditions.waitUntilElementIsVisible(this.formTitle);
        if(await WebDriverActions.getText(this.formTitle) === "Do you want to delete the Voting System?") {
            await WebDriverConditions.waitUntilElementIsLocated(this.deleteButton);
            await WebDriverActions.clickOn(this.deleteButton);
            logger.debug(`The deck was deleted: ${JSON.stringify(data)}`);
        }
    }

    /**
     * The function "fillDeck" fills a deck name input field with the provided data.
     * @param data - The `data` parameter is the value that will be filled in the deck name field.
     */
    async fillDeck(data) {
        logger.debug("Fill deck name with: ", data)
        await WebDriverConditions.waitUntilElementIsLocated(this.votingSystemCardsField);
        await WebDriverConditions.waitUntilElementIsVisible(this.votingSystemCardsField);
        await WebDriverActions.clearValue(this.votingSystemCardsField, data["Voting System Cards"]);
        await WebDriverActions.sendKeys(this.votingSystemCardsField , data["Voting System Cards"]);
    }

    /**
     * The function "fillName" fills a deck of cards with the provided data.
     * @param data - The `data` parameter is the input data that will be used to fill the deck cards.
     */
    async fillName(data) {
        logger.debug("Fill deck cards with: ", data)
        await WebDriverConditions.waitUntilElementIsLocated(this.votingSystemNameField);
        await WebDriverConditions.waitUntilElementIsVisible(this.votingSystemNameField);
        await WebDriverActions.clearValue(this.votingSystemNameField, data["Voting System Name"]);
        await WebDriverActions.sendKeys(this.votingSystemNameField , data["Voting System Name"]);
    }

    
    /**
     * The function `helperTextContainer` returns a warning message based on the type provided.
     * @param type - The type parameter is a string that specifies the type of warning message to
     * retrieve. It can have two possible values: 'name' or 'deck'.
     * @returns The warning message for the specified type.
     */
    helperTextContainer(type) {
        if(type === 'name'){
            return this.nameWarning
        } else if(type === 'deck'){
            return this.deckWarning
        }
    }
    
    /**
     * The function "cancelForm" clicks on the cancel button in a voting system form.
     */
    async cancelForm(){
        await WebDriverActions.clickOn(this.cancelButton);
    }
}

module.exports = new VotingSystemForm();
