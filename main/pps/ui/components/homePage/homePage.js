const { By } = require('selenium-webdriver');

/**
 * The class "HomePage" represents the home page of a website and contains properties for various
 * elements on the page.
 */
class HomePage {

    /**
     * The constructor function initializes variables for various elements on a web page using CSS
     * selectors.
     */
    constructor() {
        this.homeContainer = By.css("div.home-container");
        this.homeContent = By.css("div.home-content");
        this.createGameButton = By.css("div.home-content button");
        this.firstTextHome = By.css("p.first-text");
        this.secondTextHome = By.css("p.second-text");
    }
}

module.exports = new HomePage();
