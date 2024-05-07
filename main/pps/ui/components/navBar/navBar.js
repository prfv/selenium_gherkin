const { By } = require('selenium-webdriver');
const actions = require("../../../../../main/core/ui/utils/driverActions.js");
const logger = require("../../../../../main/core/utils/loggerManager.js");

/**
 * The "NavBar" class represents the Planning Poker website navigation bar and the elements it contains.
 */
class NavBar {
    /** In the constructor are declared the locators of elements in the navigator bar*/
    constructor() {
        this.navBarContainer = By.css("header[id=header-appbar]");
        this.homeElement = By.css("div.header-app-title");
        this.createGameButton = By.css("button[data-testid=create-game-button]");
        this.myGamesButton = By.css("p[data-testid='my-games-btn-text']");
        this.votingSystemsButton = By.css("button[data-testid=voting-systems-button]");
        this.userInfoContainer = By.css("div.header-user-info");
        this.userName = By.css("div.nav-bar-user");
        this.userAvatar = By.css("svg[data-type=avatar-icon]");
        this.logoutButton = By.css("button[aria-label=logout]");
    }
    
    /**
     * Return the username of the logged user dispalyed in the nav bar
     */
    async getUsernameText() {
        return await actions.getText(this.userName);
    }
    
    /**
     * Displays all games
     */
    async displayGames() {
        logger.info(`the user clicks on My Games button`);
        return await actions.clickOn(this.myGamesButton);
    }
     

}

module.exports = new NavBar();
