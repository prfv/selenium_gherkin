const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../../main/core/utils/chaiExpect");
const getProperties = require("../../../../main/core/utils/getProperties");
const actions = require("../../../../main/core/ui/utils/driverActions");
const conditions = require("../../../../main/core/ui/utils/driverConditions");
const logger = require("../../../../main/core/utils/loggerManager");
const votingSystemMenu = require("../../../../main/pps/ui/components/votingSystem/votingSystemMenu");
const votingSystemForm = require("../../../../main/pps/ui/components/votingSystem/votingSystemForm");
const votingSystemPage = require("../../../../main/pps/ui/components/votingSystem/votingSystemPage");

Then("the user {should} see the following data in the list of voting systems:", async function(shouldVisible, table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    if(shouldVisible === "should") {
        await conditions.waitUntilElementIsLocated(votingSystemMenu.votingSystemOption(this.body["Voting System Name"]));
        await conditions.waitUntilElementIsVisible(votingSystemMenu.votingSystemOption(this.body["Voting System Name"]));
        const votingSystemName = await actions.getText(votingSystemMenu.votingSystemOption(this.body["Voting System Name"]));
        const votingSystemCards = await actions.getText(votingSystemMenu.votingSystemCards(this.body["Voting System Name"]));
        expect(this.deck["Voting System Name"]).to.equal(votingSystemName);
        expect(`(${this.deck["Voting System Cards"]})`).to.equal(votingSystemCards);
    } else if(shouldVisible === "should not") {
        const isVisibleDeckName = await actions.getWebElement(votingSystemMenu.votingSystemOption(this.body["Voting System Name"]));
        const isVisibleDeckCards = await actions.getWebElement(votingSystemMenu.votingSystemCards(this.body["Voting System Name"]));
        expect(await isVisibleDeckName.isDisplayed()).to.equal(false);
        expect(await isVisibleDeckCards.isDisplayed()).to.equal(false);
    }
});

Then("the user should see the {string} error message on {string} field", async function(message, field){
    const helperContainer = await actions.getText(votingSystemForm.helperTextContainer(field));
    logger.debug(`Helper text is "${helperContainer}"`);
    expect(helperContainer).to.equal(message);
});

Then("the user should see the trash icon to delete the created voting system", async function(){
    await conditions.waitUntilElementIsLocated(votingSystemMenu.votingSystemDeleteButton(this.body["Voting System Name"]));
    const trashIcon = await actions.getWebElement(votingSystemMenu.votingSystemDeleteButton(this.body["Voting System Name"]));
    logger.debug(`Is the trash icon displayed? ${trashIcon.isDisplayed()}`);
    expect(await trashIcon.isDisplayed()).to.equal(true);
});

Then("the user should not have save button enabled", async function(){
    const saveButton = await actions.driver.findElement(votingSystemForm.saveButton).isEnabled()
    logger.debug(`Save button is enabled ${saveButton}`);
    expect(saveButton).to.equal(false);
});

Then("the user should see {string} characters in the list name of voting systems", async function(number) {  
    const name = (this.body["Voting System Name"]).slice(0,number);
    this.body["Voting System Name"] = name;
    logger.info("The voting System Name have ",name.length," characters")
    const isVisibleDeckName = await actions.getWebElement(votingSystemMenu.votingSystemOption(name));
    expect(await isVisibleDeckName.isDisplayed()).to.equal(true);
});

Then("the user should not be able to send text on Name field", async function(){
    const readonly = await actions.driver.findElement(votingSystemForm.votingSystemNameField).getAttribute('readonly')
    logger.debug(`Readonly fot the Name field is enabled ${readonly}`);
    expect(readonly).to.equal('true');
});

Then("the user should not be able to send text on Cards field", async function(){
    const readonly = await actions.driver.findElement(votingSystemForm.votingSystemCardsField).getAttribute('readonly')
    logger.debug(`Readonly for the Cards field is enabled ${readonly}`);
    expect(readonly).to.equal('true');
});

Then("the user should see the following data in the list of default voting systems:", async function(table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    logger.info("Name ", this.body["Voting System Name"]);
    logger.info("Cards ", this.body["Voting System Cards"]);
    const isVisibleDeckName = await actions.getWebElement(votingSystemMenu.votingSystemOption(this.body["Voting System Name"]));
    const isVisibleDeckCards = await actions.getWebElement(votingSystemMenu.votingSystemCards(this.body["Voting System Name"]));
    expect(await isVisibleDeckName.isDisplayed()).to.equal(true);
    expect(await isVisibleDeckCards.isDisplayed()).to.equal(true);
});

Then("the user should see the {string} notification", async function(expectedNotification) {
    const notification = await actions.getWebElement(votingSystemPage.notificationToast);
    const notificationText = await notification.getText();
    const notificationIsVisible = await notification.isDisplayed();
    logger.info(`Expected notification: ${expectedNotification}`);
    logger.info(`Actual notification: ${notificationText}`);
    logger.info(`Is the notification visible? "${notificationIsVisible}"`);
    expect(expectedNotification).to.equals(notificationText);
    expect(notificationIsVisible).to.be.true;
});
