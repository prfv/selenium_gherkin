const { Then } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const loginPage = require("../../../../main/pps/ui/components/login/loginPage.js");
const { expect } = require("../../../../main/core/utils/chaiExpect.js");

Then("the user should see the {string} error message in the login page", async function (message) {
    const errorMessage = await loginPage.getErrorMessage()
    logger.info(`The "${errorMessage}" should be equal than ${message}`);
    expect(errorMessage).to.be.equal(message);
});
