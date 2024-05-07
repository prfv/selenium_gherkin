const request = require("../../core/api/requestManager");
const { httpMethods } = require("../../core/utils/httpMethods");
const { ppsApiRoutes } = require("../utils/ppsApiConstants");
const logger = require("../../core/utils/loggerManager");
/**
 * Manages API request to Game PPS endpoints
 */
class gameApi {
    /**
     * Method to create a Game
     * @param {object} body to request
     * @returns
     */
    async createGame(body, token) {
        const response = await request.sendRequest(
            httpMethods.POST,
            ppsApiRoutes.GAME,
            token,
            body,
        );
        logger.debug(body);
        if (response.status === 201) {
            logger.debug(`${body.name} game created successfully`);
        } else {
            logger.error(`${body.name} game was not created`);
        }
        return response;
    }

    /**
     * This method deletes a game
     * @param {string} idGame, it is the game id to delete
     * @returns the response that contains the data from the API request DELETE
     */
    async deleteGame(games, token) {
        let arrayIds = [];
        games.forEach((game) => {
            arrayIds.push(game.id);
        });
        
        logger.debug("Game IDs to be deleted:", arrayIds);
        const response = await request.sendRequest(
            httpMethods.DELETE,
            ppsApiRoutes.GAME + `/batch-delete`,
            token,
            arrayIds,
        );
        if (response.status === 204) {
            logger.debug("The games were deleted successfully");
        } else {
            logger.error("The games were not deleted");
        }
        return response;
    }

    /**
     * This method edit a game
     * @param {string} gameId, it is the game id to edit.
     * @param {string} token to request.
     * @param {Object} body to request.
     * @returns the response that contains the data from the API request PUT
     */
    async editGame(gameId, token, body) {
        logger.debug(`Edit ${body.name} game with ID ${body.id}`);
        const response = await request.sendRequest(
            httpMethods.PUT,
            `${ppsApiRoutes.GAME}/${gameId}`,
            token,
            body,
        );
        if (response.status === 200) {
            logger.debug(
                `The ${body.name} game with ID ${body.id} edited successfully`,
            );
        } else {
            logger.error("The games were not edited");
        }
        return response;
    }

    /**
     * This method get a game
     * @param {string} gameId, it is the game id to edit.
     * @param {string} token to request.
     * @returns the response that contains the data from the API request GET
     */
    async getGame(gameId, token) {
        const response = await request.sendRequest(
            httpMethods.GET,
            `${ppsApiRoutes.GAME}/${gameId}`,
            token,
        );
        if (response.status === 200) {
            logger.debug(
                `The  game with ID ${gameId} got successfully`,
            );
        } else {
            logger.error("The game were not got");
        }
        return response;
    }
}

module.exports = new gameApi();
