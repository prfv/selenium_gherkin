const { Then } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const issue = require("../../../../main/pps/ui/components/issue/issue.js");
const { expect } = require("../../../../main/core/utils/chaiExpect");
const actions = require("../../../../main/core/ui/utils/driverActions");

Then(
    "the {string} issue {should} be displayed in the issues list",
    async function (nameIssue, shouldVisible) {
        const expectName = this.replaceTag(nameIssue).string;
        const listIssue = await issue.getListOfIssues();
        logger.info(
            `The ${expectName} issue ${shouldVisible} be included in the list:`,
            listIssue
        );
        if(shouldVisible === "should") {
            expect(listIssue.includes(expectName)).to.be.true;
        } else if (shouldVisible === "shouldn't") {
            expect(listIssue.includes(expectName)).to.be.false;
        }
    },
);

Then ("the estimate of the issue result should be in the created issue:", async function (table){
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    logger.info("This is the body with the creation data and the estimate of the issue card:", this.body);
    const expectBody = await issue.displayedElements(this.body)
    logger.info("This is the body with the data obtained through the issue card locator:", expectBody);
    expect(expectBody).to.deep.equal(this.body);
});

Then("the user should see following data in the card list:", async function (table) {
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    const expectCards = this.body["Cards"];
    const expectedCards = expectCards.slice(1,-1).split(',')
    logger.info("This is the card list in the table :", expectedCards);
    const cards =  await issue.getListOfCardsInIssue();
    logger.info("This is the card list in an issue:", cards);
    expect(cards).to.deep.equal(expectedCards);
    await actions.clickOn(issue.closeDropDownCards)
})

Then("the issue should be in the voting area with the following data:", async function(table) {
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    logger.info("This is the body with the creation data", this.body);
    const expectBody = await issue.displayedElements(this.body)
    logger.info("This is the body with the data obtained through the issue card locator:", expectBody);
    expect(expectBody).to.deep.equal(this.body);
});

Then("the user should see the Add an issue button {string} in the Issues section", async function(isEnabled) {
    const addIssueButton = await actions.getWebElement(issue.addIssueButton);
    const isEnabledButton = await addIssueButton.isEnabled();
    let expectedResult;
    if(isEnabled === "enabled") expectedResult = true;
    if(isEnabled === "disabled") expectedResult = false;
    expect(isEnabledButton).to.equals(expectedResult);
    logger.info(`The "Add an issue" button is ${isEnabled}`);
});
