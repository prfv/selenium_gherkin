const { When } = require("@cucumber/cucumber");
const actions = require("../../../../main/core/ui/utils/driverActions.js");
const logger = require("../../../../main/core/utils/loggerManager.js");
const homePage = require("../../../../main/pps/ui/components/homePage/homePage.js");

When("the user clicks to the create game button", async function() {
    await actions.clickOn(homePage.createGameButton);
    logger.debug(`The "Create game" button from home page was clicked`);  
});