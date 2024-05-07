const DriverManager = require("../driverManager");
const logger = require("../../../core/utils/loggerManager");
const { until, Key } = require("selenium-webdriver");
const { getJson } = require("../../utils/jsonReader");
const WebDriverConditions = require("./driverConditions");
const configuration = getJson("../../../../configuration.json");
/**
 * Abstracts common UI actions
 */
class WebDriverActions {
    /**
     * Getter for active driver to perform actions
     */
    static get driver() {
        return DriverManager.getBrowser();
    }

    /**
     * Returns a web element to perform other actions
     * @param locator - The locator parameter is used to identify the element on the page. It can be a
     * CSS selector, XPath expression, or any other method of locating elements in the DOM.
     */
    static async getWebElement(
        locator,
        timeout = configuration["uiStepTimeout"],
    ) {
        logger.debug(`Getting element by: "${locator}"`);
        await WebDriverActions.driver.wait(
            until.elementLocated(locator),
            timeout,
        );
        return await WebDriverActions.driver.findElement(locator);
    }
    
    /**
     * Returns web elements to perform other actions
     * @param locator - The locator parameter is used to identify the elements on the page. It can be a
     * CSS selector, XPath expression, or any other method of locating elements in the DOM.
     */
    static async getWebElements(locator, timeout = configuration["uiStepTimeout"]) {
        logger.debug(`Getting elements by: "${locator}"`);
        await WebDriverActions.driver.wait(until.elementLocated(locator), timeout);
        return await WebDriverActions.driver.findElements(locator);
    }

    /**
     * Gets text from a locator
     * @param locator - The locator parameter is used to identify the element on the page. It can be a
     * CSS selector, XPath expression, or any other method of locating elements in the DOM.
     */
    static async getText(locator) {
        const element = await WebDriverActions.getWebElement(locator);
        const textElement = await element.getText();
        logger.debug(`Locator text: "${textElement}"`);
        return textElement;
    }

    /**
     * The function sends a specified value to a web element identified by a locator.
     * @param locator - The locator parameter is used to identify the element on the web page. It can
     * be a CSS selector, XPath expression, or any other supported locator strategy that can uniquely
     * identify the element.
     * @param value - The value parameter is the text or input that you want to send to the element
     * identified by the locator. It can be a string, number, or any other valid input value.
     */
    static async sendKeys(locator, value) {
        logger.debug(`Send "${value}" value to: "${locator.toString()}" `);
        const element = await WebDriverActions.getWebElement(locator);
        await element.sendKeys(value);
    }

    /**
     * Executes click on an element
     * @param locator - The locator parameter is used to identify the element on the page. It can be a
     * CSS selector, XPath expression, or any other method of locating elements in the DOM.
     */
    static async clickOn(locator) {
        logger.debug(`Clicking on: "${locator.toString()}" `);
        const element = await WebDriverActions.getWebElement(locator);
        await element.click();
    }

    /**
     * The function clears the value of a web element identified by a locator.
     * @param locator - The locator parameter is a way to identify an element on a web page. It can be
     * a CSS selector, XPath expression, or any other supported locator strategy. It is used to find
     * the element on the page so that its value can be cleared.
     */
    static async clearValue(locator) {
        logger.debug(`Cleaning the: "${locator.toString()}" web element value`);
        await WebDriverActions.driver
            .findElement(locator)
            .sendKeys(Key.CONTROL, "a", Key.DELETE);
    }

    /**
     * Waits for an specific time.
     * @param miliseconds - Time to wait in ms
     */
    static async waitForMiliseconds(miliseconds) {
        logger.debug(`waiting for ${miliseconds} ms`);
        await WebDriverActions.driver.sleep(miliseconds)
    }

    /**
    * Performs a "drag and drop" action from one element to another target element.
    * @param sourceLocator - The locator of the element to be dragged.
    * @param targetLocator - The locator of the destination where it will be dropped.
    */
    static async dragAndDrop(sourceLocator, targetLocator) {
        await WebDriverConditions.waitUntilElementIsLocated(sourceLocator);
        await WebDriverConditions.waitUntilElementIsVisible(sourceLocator);
        const sourceElement = await WebDriverActions.getWebElement(sourceLocator);
        await WebDriverConditions.waitUntilElementIsLocated(targetLocator);
        await WebDriverConditions.waitUntilElementIsVisible(targetLocator);
        const targetElement = await WebDriverActions.getWebElement(targetLocator);
        const actionsDriver = await WebDriverActions.driver.actions();
        await actionsDriver.dragAndDrop(sourceElement, targetElement).perform();
    }

}

module.exports = WebDriverActions;
