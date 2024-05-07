const { When } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const actions = require("../../../../main/core/ui/utils/driverActions.js");
const navBar = require("../../../../main/pps/ui/components/navBar/navBar.js");
const conditions = require("../../../../main/core/ui/utils/driverConditions.js");

When("the user goes to the home page", async function () {
    logger.info("The user clicks in the home page button");
    await conditions.waitUntilElementIsLocated(navBar.homeElement)
    await actions.clickOn(navBar.homeElement);
});

When("the user goes to the games list", async function () {
    logger.info("The user clicks in the My Games button");
    await actions.clickOn(navBar.myGamesButton);
});

When("the user clicks to the create game button on the navigation bar", async function() {
    await actions.clickOn(navBar.createGameButton);  
});
