const { When, Then } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const signUpPage = require("../../../../main/pps/ui/components/signUpPage/signUpPage.js");
const randomGenerator = require("../../../../main/core/utils/randomGenerator/RandomGeneratorManager.js")

When("the user fills the sign up form with:", async function (table) {
    const dataTable = table.rowsHash();
    if (dataTable.username === "(randomUsername)") {
        dataTable.username = randomGenerator.generateNameWithPrefix(8)
    }
    if (dataTable.email === "(randomEmail)") {
        dataTable.email = dataTable.username + "@email.com"
    }
    logger.info(`the user fills the new user form with: `, dataTable)
    await signUpPage.signUpUser(dataTable.username, dataTable.email, dataTable.password)
    this.users.currentUIUser = dataTable
});

When("the user fills the sign up form with duplicate username:", async function (table) {
    const dataTable = table.rowsHash();
    if (dataTable.username === "(duplicateUsername)") {
        dataTable.username = this.users.currentUIUser.username;
    }
    if (dataTable.email === "(randomEmail)") {
        dataTable.email = randomGenerator.generateNameWithPrefix(8) + "@email.com";
    }
    logger.info("the user tries to register a new user with the duplicate username:", dataTable);
    await signUpPage.signUpUser(dataTable.username, dataTable.email, dataTable.password);
});

When("the user fills the sign up form with duplicate email:", async function (table) {
    const dataTable = table.rowsHash();
    if (dataTable.username === "(randomUsername)") {
        dataTable.username = randomGenerator.generateNameWithPrefix(8)
    }
    if (dataTable.email === "(duplicateEmail)") {
        dataTable.email = this.users.currentUIUser.email;
    }
    logger.info("the user tries to register a new user with the duplicate email:", dataTable);
    await signUpPage.signUpUser(dataTable.username, dataTable.email, dataTable.password);
});

Then("the user clicks on login button", async function () {
    await signUpPage.clickLoginButton()
});

Then("the user clicks on retry button", async function () {
    await signUpPage.clickRetryButton()
});