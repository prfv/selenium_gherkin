const { Given, When } = require("@cucumber/cucumber");
const getFiles = require("../../../main/core/utils/getFiles.js")
const login = require("../../../main/pps/ui/components/login/loginPage.js");
const navBar = require("../../../main/pps/ui/components/navBar/navBar.js");
const actions = require("../../../main/core/ui/utils/driverActions.js");
const logger = require("../../../main/core/utils/loggerManager.js");
const percyScreenshot = require("@percy/selenium-webdriver");

Given("the {string} logs into the PPS", async function (user) {
    await login.loginUser(
        getFiles.environment.users[user]['username'], 
        getFiles.environment.users[user]['password']
    );
});

When("the {string} logs out from PPS", async function (user) {
    logger.info(`the"${user}" logsout from the PPS`);
    await actions.clickOn(navBar.logoutButton);
});

When("Percy takes a modal screenshot and save it with the name {string}", async function(name){
    const screenshotArea = "div[role=dialog].MuiPaper-root";
    logger.info(`Taking a screenshot of "${screenshotArea}" with the name "${name}"`);
    await actions.waitForMiliseconds(2000);
    await percyScreenshot(actions.driver, name, { scope: screenshotArea });
});

When("take a snapshot with Percy with the name {string}", async function(name){
    await actions.waitForMiliseconds(5000);
    await percyScreenshot(actions.driver, name);
});
