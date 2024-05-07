const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../../main/core/utils/chaiExpect.js");
const logger = require("../../../../main/core/utils/loggerManager.js");
const myGamePage = require("../../../../main/pps/ui/components/myGamesPage/myGamesPage.js");
const getFiles = require("../../../../main/core/utils/getFiles.js")
const actions = require("../../../../main/core/ui/utils/driverActions.js");
const getProperties = require("../../../../main/core/utils/getProperties");

Then ("the following games {should} be shown in the list:", async function (shouldVisible, table){
    const dataTable = table.transpose().raw()[0];
    dataTable.forEach((element, index, array) => {
        array[index] = this.replaceTag(element).string;
    });
    logger.info(`"These names ${shouldVisible} be in the game list"`, dataTable);
    if(shouldVisible === "should") {
        const isVisible = await myGamePage.gameNameIsVisible(dataTable);
        expect(isVisible).to.be.true;
    } else if (shouldVisible === "shouldn't") {
        const notVisible = await myGamePage.gameNameIsNotVisible();
        expect(notVisible.includes(dataTable)).to.be.false;
    }

});

Then ("the game list should be displayed the following elements:", async function (table){
    const dataTable = table.transpose().raw()[0];
    logger.info("These are the elements to find them", dataTable);
    const locatedElements = await myGamePage.displayedElements(dataTable);
    expect(locatedElements).to.be.true;
});

Then ("the user deletes the game {string}", async function (gameName){
    gameName = this.replaceTag(gameName).string;
    logger.info("This game was be deleted:", gameName);   
    await myGamePage.deleteGame(gameName);
});

Then('the user verifies the name of the facilitator with:', async function (dataTable) {
    const facilitatorUsernames = dataTable.transpose().raw()[0];
    const expectedFacilitatorNames = [];
    for (const key of facilitatorUsernames) {
        const username = getFiles.environment.users[key]['username'];
        if (!username) {
            throw new Error(`Username for '${key}' is not defined in the environment file.`);
        }
        expectedFacilitatorNames.push(username);
    }
    const isFacilitatorNameVisible = await myGamePage.facilitatorNameIsVisible(expectedFacilitatorNames.join(', '));
    expect(isFacilitatorNameVisible).to.be.true;
    logger.info(`Verified facilitator names '${expectedFacilitatorNames.join(', ')}' are displayed.`);
});

Then('the user verifies that the game {should} be in the games list with:', async function (isVisible, table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = /<[\w .]+>/g.test(fields.value) ?
            this.replaceTag(fields.value).string :
            fields.value;
    }
    if (isVisible === "should") {
        const gameInfoVisible = await actions.getWebElement(myGamePage.gameInfo(this.body.Name, this.body["Voting System"]))
        const gameInfoDisplayed = await gameInfoVisible.isDisplayed();
        expect(gameInfoDisplayed).to.be.true;
        logger.info(`The game with name '${this.body.Name}' and deck '${this.body["Voting System"]}' is in the games list.`);
    } else if (isVisible === "should not") {
        const gameInfoVisible = await actions.getWebElement(myGamePage.gameInfo(this.body.Name, this.body["Voting System"]))
        const gameInfoDisplayed = await gameInfoVisible.isDisplayed();
        expect(gameInfoDisplayed).to.be.false;
        logger.info(`The game with name '${this.body.Name}' and deck '${this.body["Voting System"]}' is not in the games list.`);
    }
});
