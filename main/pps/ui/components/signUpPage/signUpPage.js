const { By } = require('selenium-webdriver');
const actions = require("../../../../../main/core/ui/utils/driverActions.js");
const logger= require('./../../../../core/utils/loggerManager');
const conditions = require("../../../../core/ui/utils/driverConditions");
   
/**
 * The `SignUpPage` class represents a page containing all elements
 */
class SignUpPage {

    /**
     * Constructor function initializes an instance of the `SignUpPage` class with a property
     */
    constructor() {
        this.usernameTextBox = By.css("#username");
        this.emailTextBox = By.css("#email");
        this.passwordTextBox = By.css("#password");
        this.signUpButton = By.css("p.signup-button");
        this.messages = By.css("div.MuiContainer-root p.container-text");
        this.loginButton = By.css("div.MuiContainer-root button");
        this.retryButton = By.xpath("//button[text()='Retry']");
        this.signUpform = By.css('form.signup-form');
    }
    
    /**
     * Fill the new user data and click on the sign up button
     * @param username - The username of the user
     * @param email - The email of the user
     * @param password - The password of the user
     */
    async signUpUser(username = "", email = "", password = "") {
        logger.info("Filling username")
        await actions.clearValue(this.usernameTextBox);
        await actions.sendKeys(this.usernameTextBox, username);
        logger.info("Filling email")
        await actions.clearValue(this.emailTextBox);
        await actions.sendKeys(this.emailTextBox, email);
        logger.info("Filling password")
        await actions.clearValue(this.passwordTextBox);
        await actions.sendKeys(this.passwordTextBox, password);
        logger.info("Cllicking login button")
        await actions.clickOn(this.signUpButton);
    }
    
    /**
     * Returns all succesfull messages
     */
    async getMessageTexts() {
        const issues = await actions.getWebElements(this.messages);
        let messagesTexts = await Promise.all(issues.map(messagesText => {
            return messagesText.getText();
        }));
        return messagesTexts
    }

    /**
     * Clicks on Login button
     */
    async clickLoginButton() {
        logger.info("Clicking login button from sucessfull container element")
        await actions.clickOn(this.loginButton);
    }
    
    /**
     * Returns password verifications
     * @param type - The password verification tyoe
     */
    async getPasswordVerifications(type) {
        const passwordVerificationLocators = By.xpath(`//img[contains(@src,"${type}")]/ancestor::li//span`);
        const passwordVerifications = await actions.getWebElements(passwordVerificationLocators);
        let passwordVerificationNames = await Promise.all(passwordVerifications.map(passwordVerificationName => {
            return passwordVerificationName.getText();
        }));
        return passwordVerificationNames
    }

    /**
     * Clicks the "Retry" button to attempt a sign-up.
     */
    async clickRetryButton() {
        try {
            await actions.clickOn(this.retryButton);
            logger.info("Clicked on retry button.");
            await conditions.waitUntilElementIsLocated(this.signUpform);
            const modal = await actions.getWebElement(this.signUpform);
            const isModalDisplayed = await modal.isDisplayed();
            await actions.clearValue(this.usernameTextBox);
            await actions.clearValue(this.emailTextBox);
            await actions.clearValue(this.passwordTextBox);    
            logger.info(`Sign-up form is displayed: ${isModalDisplayed}`);
            return isModalDisplayed;
        } catch (error) {
            logger.error("Error while trying to click on retry button and check sign-up form.", error);
            throw error;
        }
    }
}    
module.exports = new SignUpPage();
