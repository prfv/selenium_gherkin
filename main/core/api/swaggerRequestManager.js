const SwaggerClient = require("swagger-client");
const getFiles = require("../utils/getFiles");
const logger = require("../../core/utils/loggerManager");
const { ppsApiRoutes } = require("../../pps/utils/ppsApiConstants");
const swaggerDocumentation8763 = require("../../pps/api/resources/swaggerDocumentation8763.json");


/**
 * SwaggerRequestManager Class
 */
class SwaggerRequestManager {

    /**
     * SwaggerRequestManager constructor
     */
    constructor() {
        this.environment = getFiles.environment;
        this.defaultPort = this.environment["port"]["api"];
        this.currentPort = this.defaultPort;
        this.config = getFiles.config;
        this.baseUrl = this.environment["api-url"];
        this.params = {};
    }

    /**
   * Sends the request using the following parameters
   * @param method http method
   * @param endpoint resource path
   * @param body data to send in the body param
   * @param query data to send in the query params
   * @returns returns the response from the request [[even if the request succeeded or failed]]
   */
    async sendRequest(method, endpoint, token=null, body={}) {
        this.documentation = {};
        if (token !== null){
            this.params["Authorization"] = `Bearer ${token}`;
        }

        // Find the correct documentation for each port (login or game/deck-controller)
        let url = this.baseUrl + ":" + this.currentPort;
        let swaggerClient = ppsApiRoutes.LOGIN !== endpoint
            ? await new SwaggerClient({spec: swaggerDocumentation8763})
            : await new SwaggerClient(url + this.environment["swaggerDoc"]);
        this.documentation = swaggerClient["spec"]["paths"];

        let endpointDoc = this.getDocumentationEndpoint(endpoint);
        let operationId = this.documentation[endpointDoc][method.toLowerCase()]["operationId"];
        let parametersArray = this.documentation[endpointDoc][method.toLowerCase()]["parameters"];

        // Add the ID to the correspondent path parameter
        if (JSON.stringify(this.id) !== "{}"){
            let idPathParameterName = parametersArray.filter(p => p.in === "path")[0]["name"];
            this.params[idPathParameterName] = this.id;
        }

        //Add the request body parameter if needed
        if (JSON.stringify(body) !== "{}"){
            let bodyParameterName = parametersArray.filter(p => p.in === "body")[0]["name"];
            this.params[bodyParameterName] = body;
        }

        logger.info(`The user sends ${method} request to ${url}${endpoint} (${endpointDoc})
            with parameters: ${JSON.stringify(Object.fromEntries(
        Object.entries(this.params).filter(([key]) => key !== "Authorization"))
    )}`);

        let response = {};

        try{
            response = await swaggerClient.execute({
                operationId: operationId,
                method: method,
                parameters: this.params
            });

            //Parses the data argument, since it is retrieved as string and the TC consumes JSON object
            response["data"] = response["data"] !== ''
                ? JSON.parse(response.data) : '';

        } catch (err) {
            response = err;
        }

        logger.debug(`Response: ${JSON.stringify(response)}`);
        this.params = {};
        return response
    }

    /**
     * Method to change port in baseURL
     * @param newPort new port for base url
     */
    changePort(newPort) { this.currentPort = newPort }

    /**
     * Method to revert previous port in base url
     */
    revertPreviousPort() { this.currentPort = this.defaultPort }

    /**
     * Method to get the correspondent endpoint from the Swagger API Documentation
     * @param endpoint resource path
     */
    getDocumentationEndpoint(endpoint) {
        this.id = {};
        let finalEndpoint = "";
        let endpointArr = endpoint.split("/");

        for (let i=2; i <= endpointArr.length; i++) {
            let tempPath = new RegExp(endpointArr.slice(0,i+1).join("/"));
            let filterTempPath = Object.keys(this.documentation).filter((path) => tempPath.test(path));

            if ((!isNaN(endpointArr[i]) && !isNaN(parseFloat(endpointArr[i]))) || filterTempPath.length == 0 && i > 2){
                this.id = endpointArr[i];
                endpointArr[i] = "{(.*)}";

            } else if (filterTempPath.length == 1){
                finalEndpoint = filterTempPath[0];
                break

            } else {
                finalEndpoint = "/error";
                break
            }
        }

        logger.debug("Endpoint found in the documentation: ", finalEndpoint);
        return finalEndpoint
    }
}

module.exports = new SwaggerRequestManager();
