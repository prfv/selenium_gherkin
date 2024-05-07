const axios = require("axios");
const getFiles = require("../utils/getFiles");
const logger = require("../../core/utils/loggerManager");
const { ppsApiRoutes } = require("../../pps/utils/ppsApiConstants");
/**
 * Creates the request controller class
 */
class RequestManager {
    /**
     * Creates an axios instance
     */
    constructor() {
        this.environment = getFiles.environment;
        this.defaultPort = this.environment["port"]["api"];
        this.currentPort = this.defaultPort;
        this.config = getFiles.config;
        this.baseUrl = this.environment["api-url"];
        this.axios = axios.create({
            baseURL: `${this.baseUrl}:${this.defaultPort}`,
            timeout: this.config.timeout,
            headers: {
                "Content-Type": this.config.headers,
            },
        });
    }

    /**
   * Sends the request using the following parameters
   * @param method http method
   * @param endpoint resource path
   * @param body data to send in the body param
   * @param query data to send in the query params
   * @returns returns the response from the request even if the request succeeded or failed

   */
    async sendRequest(method, endpoint, token = null, body={}, query={}) {
        const headers = {}
        if (token !== null){
            headers[
                "Authorization"
            ] = `Bearer ${token}`;}
        const url = this.axios.defaults.baseURL + endpoint;
        if (ppsApiRoutes.LOGIN !== endpoint){
            logger.info(`The user sends ${method} request to ${url}
                with body: ${JSON.stringify(body)}
                and query: ${JSON.stringify(query)}`);
        } else{
            logger.info("Sends the request to:", url);
        }
        const getResponse = await this.axios.request({
            method: method,
            url: endpoint,
            params: { ...query },
            data: body,
            validateStatus: false,
            headers: headers,
        });
        logger.debug("Response status code:", getResponse.status);
        logger.debug("Response body:", JSON.stringify(getResponse.data));
        return getResponse;
    }

    /**
     * Method to change port in baseURL
     * @param {*} newPort new port for base url
     */
    changePort(newPort) {
        this.currentPort = this.axios.defaults.baseURL.split(":")[2];
        this.axios.defaults.baseURL = `${this.baseUrl}:${newPort}`;
    }
    /**
     * Method to revert previous port in base url
     */
    revertPreviousPort() {
        this.axios.defaults.baseURL = `${this.baseUrl}:${this.currentPort}`;
    }
}

module.exports = new RequestManager();
