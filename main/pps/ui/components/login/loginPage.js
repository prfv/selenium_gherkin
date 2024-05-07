const { By } = require("selenium-webdriver");
const actions = require("../../../../../main/core/ui/utils/driverActions.js");
const logger = require("../../../../core/utils/loggerManager");

/**
 * Creates the login page class
 */
class LoginPage {
    /**
     * Sets the locators for the login class
     */
    constructor() {
        this.userNameOrEmail = By.id("userNameOrEmail");
        this.password = By.id("password");
        this.loginButton = By.css(".login-button");
        this.signUpButton = By.css("div.header a");
        this.errorMessageToast = By.css("div.MuiAlert-message");
    }

    /**
     * Fill the login user data and click on the login button
     * @param username - The username of the user
     * @param password - The password of the user
     */
    async loginUser(username, password) {
        logger.info("Filling username")
        await actions.sendKeys(this.userNameOrEmail, username);
        logger.info("Filling password")
        await actions.sendKeys(this.password, password);
        logger.info("Cllicking login button")
        await actions.clickOn(this.loginButton);
    }

    /**
     * Returns the error message displayed in the toast
     */
    async getErrorMessage() {
        const message = await actions.getText(this.errorMessageToast);
        logger.info(`Error Message is ${message}`);
        return message;
    }

    /**
     * Clicks on Sign Up button
     */
    async clickSignUpButton() {
        logger.info("Clicking Sign Up button from login page")
        await actions.clickOn(this.signUpButton);
    }
}

const loginPage = new LoginPage();
module.exports = loginPage;
