const { Builder }  = require("selenium-webdriver");
const { Options }  = require("selenium-webdriver/chrome");
const { setDefaultTimeout }  = require("@cucumber/cucumber");
const config  = require("../../../configuration.json");
const logger = require("../../../main/core/utils/loggerManager");

setDefaultTimeout(config.uiStepTimeout);

/**
 * DriverManager class that use selenium-webdriver to UI tests
 */
class DriverManager {
    static browser;

    /**
     * Load all the configuration and open the Driver Manager
     */
    async openBrowser() {
        const opt = new Options();
        if (config.capabilities.headless) opt.headless();
        opt.addArguments(`--lang=${config.capabilities.language}`);
        opt.windowSize(config.capabilities.size);
        DriverManager.browser = config.capabilities.standalone ?
            await new Builder().forBrowser("chrome").setChromeOptions(opt).usingServer(config.capabilities["selenium-grid"]).build() :
            await new Builder().forBrowser("chrome").setChromeOptions(opt).build();
        logger.info("Successfully opened the browser");
    }

    /**
     * Quit the Driver Manager
     */
    async closeBrowser() {
        await DriverManager.browser.quit();
        logger.info("Successfully closed the browser");
    }

    /**
     * Navigate to specific URL
     * @param {string} url The URL to be loaded.
     */
    async navigateTo(url) {
        await DriverManager.browser.navigate().to(url);
        logger.info(`${url} page successfully loaded`);
    }

    /**
     * Take a screenshot of the screen
     */
    async takeScreenshot(){
        logger.info("Taking a screenshot of the browser");
        return await DriverManager.browser.takeScreenshot();
    }

    /**
     *Reload the page
     */
    async reload() {
        await DriverManager.browser.navigate().refresh();
        logger.info("Successfully reloaded the page");
    }

    /**
     * get the Driver Manager
     */
    getBrowser() {
        logger.info("Returning driver manager");
        return DriverManager.browser;
    }
}

const driverManager = Object.freeze(new DriverManager());

module.exports = driverManager;
