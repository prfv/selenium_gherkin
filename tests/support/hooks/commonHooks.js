const { After, Before, Status } = require("@cucumber/cucumber");
const logger = require("../../../main/core/utils/loggerManager");
const loginAPI = require("../../../main/pps/api/loginAPI");
const driverManager = require("../../../main/core/ui/driverManager");
const config = require ("../../../configuration.json")
const environment = require ("../../../environment.json")
const fs = require("fs");

Before(function (scenario) {
    logger.info(`----------------Starting Scenario: ${scenario.pickle.name}----------------`);
});

Before("@loginUser1", async function () {
    const USER = "user1";
    logger.debug(`${USER} logs in via hook`);
    const response = await loginAPI.loginPPS(USER);
    this.users[USER] = response.data;
    this.users[USER]["statusCode"] = response.status;
    logger.debug("logged User1 value: ", JSON.stringify(this.users.user1));
});

Before("@loginUser2", async function () {
    const USER = "user2";
    logger.debug(`${USER} logs in via hook`);
    const response = await loginAPI.loginPPS(USER);
    this.users[USER] = response.data;
    this.users[USER]["statusCode"] = response.status;
    logger.debug("logged User2 value: ", JSON.stringify(this.users.user2));
});

Before("@loginUser3", async function () {
    const USER = "user3";
    logger.debug(`${USER} logs in via hook`);
    const response = await loginAPI.loginPPS(USER);
    this.users[USER] = response.data;
    this.users[USER]["statusCode"] = response.status;
    logger.debug("logged User3 value: ", JSON.stringify(this.users.user3));
});

After(function (scenario) {
    logger.info(`----------------Finishing Scenario: ${scenario.result.status.toUpperCase()} - ${scenario.pickle.name}----------------`);

});

Before("@ui", async function () {
    const uiURL = environment[config.environment]["ui-url"]
    await driverManager.openBrowser();
    await driverManager.navigateTo(uiURL);
});
  
After("@ui", async function (scenario) {
    if (scenario.result?.status === Status.FAILED) {
        const screenshot = await driverManager.takeScreenshot();
        // eslint-disable-next-line no-undef
        this.attach(Buffer.from(screenshot, "base64"), "image/png");
    }
    await driverManager.closeBrowser();
});

After({ tags: "@deleteDownloadedFile" }, async function () {
    logger.debug("Removing:", this.dowloadedFilePath);
    fs.rmSync(this.dowloadedFilePath)
});
