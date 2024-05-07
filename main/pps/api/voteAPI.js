const request = require("../../core/api/requestManager");
const { httpMethods } = require("../../core/utils/httpMethods");
const { ppsApiRoutes } = require("../utils/ppsApiConstants");
const logger = require("../../core/utils/loggerManager");
/**
 * Manages API request to vote PPS endpoints
 */
class voteApi {
    /**
     * Method to add a vote in an Issue
     * @param {object} body to request
     * @returns
     */
    async addVote(body, issueID, token) {
        const response = await request.sendRequest(
            httpMethods.POST,
            `${ppsApiRoutes.GAME}/issues/${issueID}`,
            token,
            body,
        );
        logger.debug(body);
        if (response.status === 200) {
            logger.debug(`${body.player.name} player added his/her vote successfully`);
        } else {
            logger.error(`${body.player.name} player could not add his/her vote`);
        }
        return response;
    }
}

module.exports = new voteApi();
