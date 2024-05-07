const request = require("../../core/api/requestManager");
const { httpMethods } = require("../../core/utils/httpMethods");
const { ppsApiRoutes } = require("../utils/ppsApiConstants");
const logger = require("../../core/utils/loggerManager");
/**
 * Manages API request to Game PPS endpoints
 */
class issueApi {
    /**
     * Method to create an Issue
     * @param {object} body to request
     * @returns
     */
    async createIssue(body, gameID, token) {
        const response = await request.sendRequest(
            httpMethods.POST,
            ppsApiRoutes.ISSUE(gameID),
            token,
            body,
        );
        logger.debug(body);
        if (response.status === 200) {
            //this verify is a post and need to be 201
            logger.debug(`${body.name} issue created successfully`);
        } else {
            logger.error(`${body.name} issue was not created`);
        }
        return response;
    }
}

module.exports = new issueApi();
