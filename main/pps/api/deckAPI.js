const request = require("../../core/api/requestManager");
const { httpMethods } = require("../../core/utils/httpMethods");
const { ppsApiRoutes } = require("../utils/ppsApiConstants");
const logger = require("../../core/utils/loggerManager");

/**
 * Manages API request to Decks PPS endpoints
 */
class deckApi {
    /**
     * Method to get all decks
     * @returns Fetch all decks by user
     */
    async getDecks(token) {
        const response = await request.sendRequest(
            httpMethods.GET,
            ppsApiRoutes.DECK,
            token,
        );
        if (response.status === 200) {
            logger.debug("All the decks were collected.");
        } else {
            logger.error("An error occurred while getting the decks");
        }
        return response;
    }
    /**
     * Method to find a specific id using the deck name
     * @param {string} nameDeck deck name to find
     * @returns
     */
    async findIdDeck(nameDeck, token) {
        const decks = await this.getDecks(token);
        const deck = decks.data.find((deck) => deck.name === nameDeck);
        if(deck)
            return deck.id
        else
            return 0;
    }
    
    /**
     * Method to delete a specific deck
     * @param {string} deckId deck id to delete
     * @returns
     */
    async deleteDeck(deckId, token) {
        const response = await request.sendRequest(
            httpMethods.DELETE,
            ppsApiRoutes.DECK + `/${deckId}`,
            token,
        );
        if (response.status === 204) {
            logger.debug(`The deck ${deckId} was deleted successfully`);
        } else {
            logger.error(`The deck ${deckId} was not deleted`);
        }
        return response;
    }
    
    /**
     * Method to create a deck
     * @param {object} body Body to request
     * @param {string} token Token to request
     * @returns
     */
    async createDeck(deckBody, token) {
        const response = await request.sendRequest(
            httpMethods.POST,
            ppsApiRoutes.DECK,
            token,
            deckBody
        );
        if (response.status === 201) {
            logger.debug(`The "${deckBody.name}" deck was created successfully with "${response.data.id}" ID`);
        } else {
            logger.error(`The "${deckBody.name}" deck was not created`);
        }
        return response;
    }
}

module.exports = new deckApi();
