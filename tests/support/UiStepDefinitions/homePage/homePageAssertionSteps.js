const { Then } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const navBar = require("../../../../main/pps/ui/components/navBar/navBar.js")
const homePage = require("../../../../main/pps/ui/components/homePage/homePage.js")
const { expect } = require("../../../../main/core/utils/chaiExpect.js");
const driverActions = require("../../../../main/core/ui/utils/driverActions.js")

Then("the user should see his username in the landing page", async function () {
    logger.info(` Verifyng ${this.users.currentUIUser.username} is displayed in the landing page`);
    const usernameLabelText = await navBar.getUsernameText();
    logger.info(`${this.users.currentUIUser.username} should be equal to ${usernameLabelText}`);
    expect(this.users.currentUIUser.username).to.equal(usernameLabelText);
});

Then("the user should see Create Game button in the landing page", async function () {
    logger.info(` Verifyng Create Game button is displayed in the landing page`);
    const createGameButton = await driverActions.getWebElement(homePage.createGameButton);
    expect(await createGameButton.isDisplayed()).to.be.true;
});
