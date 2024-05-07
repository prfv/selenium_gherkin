const { When } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const actions = require("../../../../main/core/ui/utils/driverActions.js");
const conditions = require("../../../../main/core/ui/utils/driverConditions.js");
const myGamesPage = require("../../../../main/pps/ui/components/myGamesPage/myGamesPage.js");

When("the user selects {string} Game", async function (gameName) {
    logger.info(`the user selects "${gameName}" Game`);
    await myGamesPage.openGame(gameName);
});

When('the user deletes a selected game', async function () {
    await myGamesPage.deleteGame(this.body.Name);
    logger.info(`User deletes the game with name '${this.body.Name}'.`);
});

When('the user confirms deleting the game', async function () {
    await actions.clickOn(myGamesPage.confirmDeleteBtn);
    await conditions.waitUntilElementIsLocated(myGamesPage.myGameContent);
    logger.info(`User confirms to delete the game with name '${this.body.Name}'.`);
});

When("the user selects the game {string}", async function (gameName) {
    gameName = this.replaceTag(gameName).string;
    logger.info(`The ${gameName} game will be selected`);
    await actions.clickOn(myGamesPage.selectGameName(gameName));
});

