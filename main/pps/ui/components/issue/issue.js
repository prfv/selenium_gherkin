const { By } = require("selenium-webdriver");
const actions = require("../../../../core/ui/utils/driverActions");
const loggerManager = require("../../../../core/utils/loggerManager");
const conditions = require("../../../../core/ui/utils/driverConditions");
/**
 * The class "Issues" represents the issues of a website.
 */
class Issues {
    /**
     * The constructor function initializes variables for various elements on an issues.
     */
    constructor() {
        this.addCircleIconButton = By.css("svg[data-testid='AddCircleIcon']");
        this.addIssueButton = By.xpath("//p[text()='Add an issue']//parent::button");
        this.issueTitleInput = By.name("name");
        this.issueDescriptionTextArea = By.css(
            "textarea[name = 'description']",
        );
        this.saveIssueButon = By.xpath("//button//following::p[text()='Save']");
        this.issuesCards = By.css("div[data-testid=issue-card-name]");
        this.issueListCards = By.css("div[data-testid=issue-card-list]");
        this.issueDeleteConfirmButton = By.xpath("//button[text()= 'Delete']");
        this.expandIssueEditButton = (issueName) => {
            return By.xpath(
                `//span[@title="${issueName}"]//ancestor::div[@data-testid="issue-card-name"]//descendant::button[@data-testid="issue-expand-btn"]`,
            );
        };
        this.deleteIssueButton = (issueName) => {
            return By.xpath(
                `//span[@title="${issueName}"]//ancestor::div[@data-testid="issue-card-name"]//descendant::button[@data-testid="issue-delete-btn"]`,
            );
        };
        this.estimationIssue = By.css("div[data-testid=playing-issue-estimation]");
        this.valueIssueInVote = (value) => {
            return By.css(`li[data-value='${value}']`);
        };
        this.valueIssueCard = By.css("div[data-testid=issue-card-estimation] div");
        this.descriptionIssueCard = By.css("p[data-testid=issue-card-description]");
        this.nameIssueCard = By.css("div[data-testid=issue-card-name]");
        this.estimationIssueIcon = By.css("svg[data-testid=saved-estimation-icon]");
        this.issueDeckCards = By.css("ul[role*='listbox']");
        this.closeDropDownCards = By.css("li[tabindex='0']");
        this.issueCard = By.css("div[data-type=issue-card]");
        this.boardIssue = By.xpath("//p[text()='Drag an issue here']");
        this.namePlayingIssue = By.css("div[data-testid=playing-issue-header]");
        this.descriptionPlayingIssue = By.css("p[data-testid=playing-issue-description]");
    }

    /**
     * Creates a new issue
     * @param {string} nameIssue the name to the issue
     * @param {string} descriptionIssue the description to the issue
     */
    async createIssue(nameIssue, descriptionIssue) {
        await actions.clickOn(this.addCircleIconButton);
        await actions.sendKeys(this.issueTitleInput, nameIssue);
        await actions.sendKeys(this.issueDescriptionTextArea, descriptionIssue);
        await actions.clickOn(this.saveIssueButon);
        loggerManager.debug(
            `The issue was created with the name: ${nameIssue} and description: ${descriptionIssue}`,
        );
    }

    /**
     * Edits an issue
     * @param {string} nameIssue the name to the issue
     * @param {string} descriptionIssue the description to the issue
     */
    async editIssue(nameIssue, newNameIssue, newDescriptionIssue) {
        await actions.clickOn(this.expandIssueEditButton(nameIssue));
        await actions.clearValue(this.issueTitleInput, newNameIssue);
        await actions.sendKeys(this.issueTitleInput, newNameIssue);
        await actions.clearValue(
            this.issueDescriptionTextArea,
            newDescriptionIssue,
        );
        await actions.sendKeys(
            this.issueDescriptionTextArea,
            newDescriptionIssue,
        );
        loggerManager.debug(
            `The issue was edited with the name: ${newNameIssue} and description: ${newDescriptionIssue}`,
        );
    }

    /**
     * Deletes an issue
     * @param {string} nameIssue the name to the issue
     */
    async deleteIssue(nameIssue) {
        await actions.clickOn(this.deleteIssueButton(nameIssue));
        loggerManager.debug(`The ${nameIssue} issue is deleting`);
    }

    /**
     * Clicks on Delete or Save button
     * @param {string} action the action that the user is doing
     */
    async clickOnSaveOrDeleteButton(action) {
        if (action == "Save"){
            await actions.clickOn(this.saveIssueButon);
        } else  {
            await actions.clickOn(this.issueDeleteConfirmButton);
        }
        loggerManager.debug(`The user clicks on ${action} button`);
    }

    /**
     * Returns the issues list
     */
    async getListOfIssues() {
        let elements = [];
        await conditions.waitUntilElementIsLocated(this.issueListCards);
        const listOfElements = await actions.getWebElements(
            this.issueListCards
        );
        for (const element of listOfElements) {
            elements.push(await element.getText());
        }
        elements = elements[0].slice("\n");
        return elements;
    }

    /**
     * Returns the locators of the elements that are inside the issue card.
     */
    issueElements() {
        return {
            "Name": this.nameIssueCard,              
            "Description": this.descriptionIssueCard,
            "Estimation": this.valueIssueCard,  
            "Name to vote": this.namePlayingIssue,
            "Description to vote": this.descriptionPlayingIssue,                 
        }
    }

    /**
     * Returns an object with the texts obtained from the issueElement locators.
     */
    async displayedElements (body) {
        const elements = {};
        for (const key in body) {
            const locator = await this.issueElements()[key];
            const element = await actions.getWebElement(locator);
            const elementText = await element.getText();
            loggerManager.debug("The text obtained from the locator:", elementText);
            elements[key] = elementText;
        }
        return elements;
    }

    /**
     * Sets the issue result with final result in the voting.
     * @param {string} value it is the final result to issue.
     */
    async setIssueResult(value){
        await conditions.waitUntilElementIsLocated(this.estimationIssue);
        await conditions.waitUntilElementIsVisible(this.estimationIssue);
        await actions.clickOn(this.estimationIssue);
        loggerManager.debug("The user clicks on the estimate button to select the estimated value");
        await conditions.waitUntilElementIsLocated(this.valueIssueInVote(value));
        await conditions.waitUntilElementIsVisible(this.valueIssueInVote(value));
        await actions.clickOn(this.valueIssueInVote(value));
        await conditions.waitUntilElementIsLocated(this.estimationIssueIcon);
        await conditions.waitUntilElementIsVisible(this.estimationIssueIcon);
        loggerManager.debug("The user selects the estimated value", value);
    }

    /**
     * The function `getListOfCardsInIssue` retrieves a list of card names from a specific issue deck.
     * @returns an array of strings, which represents the list of cards in an issue deck.
     */
    async getListOfCardsInIssue() {
        await actions.clickOn(this.valueIssueCard)
        let elements = [];
        await conditions.waitUntilElementIsLocated(this.issueDeckCards);
        await conditions.waitUntilElementIsVisible(this.issueDeckCards);
        const listOfElements = await actions.getWebElements(
            this.issueDeckCards
        );
        for (const element of listOfElements) {
            elements.push(await element.getText());           
        }
        elements = elements[0].split("\n");
        return elements;
    }

    /**
     * The function "clickOnDropDown" logs a message and then clicks on a dropdown element.
     */
    async clickOnDropDown(){
        loggerManager.info("The user clicks on the cards dropdown")
        await actions.clickOn(this.valueIssueCard)
    }

}

module.exports = new Issues();
