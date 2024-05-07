const swaggerDocumentation8763 = require("../../../pps/api/resources/swaggerDocumentation8763.json");
const swaggerRequestManager = require("../swaggerRequestManager");
const getFiles = require("../../utils/getFiles");
const { httpMethods } = require("../../utils/httpMethods");
const { ppsApiRoutes } = require("../../../pps/utils/ppsApiConstants");
const { expect } = require("chai");
const { describe, it } = require("mocha");

describe("Swagger Request Manager should be working properly ", () => {
    this.environment = getFiles.environment;

    it("is possible to change the Swagger Request Manager port for auth: 8764", async () => {
        swaggerRequestManager.changePort(getFiles.environment["port"]["auth"]);

        expect(swaggerRequestManager.currentPort).to.be.equals("8764");
    });

    it("is possible to change the Swagger Request Manager port back to PPS features endpoint: 8763", async () => {
        swaggerRequestManager.revertPreviousPort();

        expect(swaggerRequestManager.currentPort).to.be.equals("8763");
    });

    it("is possible to find the correspondent endpoint with ID parameter from the Swagger documentation", async () => {
        swaggerRequestManager.documentation = swaggerDocumentation8763["paths"];
        let endpoint = "/planning-poker/decks/-55555";
        let documentationEndpoint = swaggerRequestManager.getDocumentationEndpoint(endpoint);

        expect(documentationEndpoint).to.be.equals("/planning-poker/decks/{id}");
    });

    it("is possible to login the application with a POST request", async () => {
        let body = {
            "usernameOrEmail": this.environment["users"]["user1"]["username"],
            "password": this.environment["users"]["user1"]["password"]
        };

        swaggerRequestManager.changePort(getFiles.environment["port"]["auth"]);

        let response = await swaggerRequestManager.sendRequest(httpMethods.POST, ppsApiRoutes.LOGIN, null, body);

        swaggerRequestManager.revertPreviousPort();

        expect(response.status).to.be.equals(200);
        expect(response.body).to.have.property("token");
    });
});

