const { until } = require("selenium-webdriver");
const DriverManager = require("../driverManager");
const loggerService = require("../../utils/loggerManager");
const getFiles = require("../../utils/getFiles");
 
/**
 * Creates a web driver conditions class
 */
class WebDriverConditions {

    /**
     * Getter for active driver to perform actions
     */
    static get driver() {
        return DriverManager.getBrowser();
    }

    /**
     * Waits until an element is in a given location
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async waitUntilElementIsLocated(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        loggerService.debug(
            `Waiting until element is located: "${locator.toString()}"`,
        );
        await WebDriverConditions.driver.wait(
            until.elementLocated(locator),
            timeout,
        );
    }

    /**
     * Waits until an element is visible
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async waitUntilElementIsVisible(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        loggerService.debug(
            `Waiting until element is visible: "${locator.toString()}"`,
        );
        const element = await WebDriverConditions.driver.findElement(locator);
        return await WebDriverConditions.driver.wait(
            until.elementIsVisible(element),
            timeout,
        );
    }
 
    /**
     * Waits until an element is enabled
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async waitUntilElementIsEnabled(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        loggerService.debug(
            `Waiting until element is enable: "${locator.toString()}"`,
        );
        const element = await WebDriverConditions.driver.findElement(locator);
        await WebDriverConditions.driver.wait(
            until.elementIsEnabled(element),
            timeout,
        );
    }

    /**
     * Waits until an element is disabled
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async waitUntilElementIsDisabled(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        loggerService.debug(
            `Waiting until element is disable: "${locator.toString()}"`,
        );
        const element = await WebDriverConditions.driver.findElement(locator);
        await WebDriverConditions.driver.wait(
            until.elementIsDisabled(element),
            timeout,
        );
    }

    /**
     * Waits until an element is not visible
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async waitUntilElementIsNotVisible(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        loggerService.debug(
            `Waiting until element is not visible: "${locator.toString()}"`,
        );
        const element = await WebDriverConditions.driver.findElement(locator);
        await WebDriverConditions.driver.wait(
            until.elementIsNotVisible(element),
            timeout,
        );
    }

    /**
     * Return true if element is visible, otherwise, return false
     * @param locator locator for the web element to wait
     * @param timeout timeout set by the configuration file
     */
    static async isVisible(
        locator,
        timeout = getFiles.config["uiStepTimeout"],
    ) {
        try {
            await this.waitUntilElementIsVisible(locator, timeout);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = WebDriverConditions;
