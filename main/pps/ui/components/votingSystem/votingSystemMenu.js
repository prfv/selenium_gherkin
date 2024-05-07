const { By } = require("selenium-webdriver");

/**
 * The `VotingSystemMenu` class represents a menu for a voting system and provides methods to locate
 * and interact with different elements of the menu.
 */
class VotingSystemMenu {
    /**
     * The constructor function initializes an instance of a class with a property representing a
     * button element.
     */
    constructor() {
        this.addDeckButton = By.css("button[data-testid='add-deck-btn']");
        this.votingSystemOption = ( nameOption ) => {
            return By.xpath(`//div[@data-testid='voting-system-content']/p[.='${nameOption}']`)
        };
        this.votingSystemCards = ( nameOption ) => {
            return By.xpath(`//div[@data-testid='voting-system-content']/p[.='${nameOption}']/following-sibling::p`);
        };
        this.votingSystemDeleteButton = ( nameOption ) => {
            return By.xpath(`//div[@data-testid='voting-system-content']/p[.='${nameOption}']//..//following-sibling::button`);
        };
    }
}

module.exports = new VotingSystemMenu();
