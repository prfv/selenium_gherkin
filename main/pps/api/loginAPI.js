const request = require("../../core/api/requestManager");
const getFiles = require("../../core/utils/getFiles");
const { httpMethods } = require("../../core/utils/httpMethods");
const { ppsApiRoutes } = require("../utils/ppsApiConstants");
/**
 * The LoginAPI class provides a method for logging in using a POST request.
 */
class LoginAPI {
    /**
     * The function `loginPPS` is an asynchronous function that sends a POST request to the PPS API
     * login endpoint with the provided user's username or email and password, and returns the
     * response.
     * @param user - The `user` parameter is the identifier for the user you want to log in. It is used
     * to retrieve the username and password from the `environment.local.users` object.
     * @returns the response object if the status code is 200, otherwise it is returning the response
     * object's response property.
     */
    async loginPPS(user) {
        const method = httpMethods.POST;
        const endpoint = ppsApiRoutes.LOGIN;
        const body = {
            usernameOrEmail: getFiles.environment.users[user].username,
            password: getFiles.environment.users[user].password,
        };
        request.changePort(getFiles.environment["port"]["auth"]);
        const response = await request.sendRequest(
            method,
            endpoint,
            null,
            body,
        );
        request.revertPreviousPort();
        return response;
    }
}

module.exports = new LoginAPI();
