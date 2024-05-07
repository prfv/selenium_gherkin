const { When, Given } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const getFiles = require("../../../../main/core/utils/getFiles.js");
const loginPage = require("../../../../main/pps/ui/components/login/loginPage.js");

When("the {string} fills his credentials in the login page", async function (user) {
    if(Object.prototype.hasOwnProperty.call(this.users, user)){
        this.users.currentUIUser = this.users[user]
    } else {
        this.users.currentUIUser = getFiles.environment.users[user];
    }
    logger.info(`the user with username ${this.users.currentUIUser.username} is loging`);
    await loginPage.loginUser(this.users.currentUIUser.username, this.users.currentUIUser.password);
});

Given("the user clicks on sign up button", async function () {
    await loginPage.clickSignUpButton()
});
