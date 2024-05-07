const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../main/core/utils/chaiExpect");
const validateSchema = require("../../../main/core/utils/schemaValidator");
const logger = require("../../../main/core/utils/loggerManager");
const { unflatten } = require("flat");
const getProperties = require("../../../main/core/utils/getProperties");

Then("the response status code should be {int}", async function (statusCode) {
    expect(this.response.status).to.equal(statusCode);
});

Then(
    "the response schema should be verified with {string}",
    async function (jsonSchema) {
        expect(validateSchema(this.response.data, jsonSchema)).to.be.true;
        logger.debug("Shows the response data: ", this.response.data);
    },
);

Then("the response body should verify the {string} with:", async function (feature, table) {
    const dataTable = table.hashes();
    let expected = {};
    for (const fields of dataTable) {
        expected[fields.Key] = /<[\w .]+>/g.test(fields.value)
            ? this.replaceTag(fields.value).string
            : fields.value;
    }
    expected = unflatten(expected);
    const expectedProperties = getProperties(expected);
    logger.debug("Table: ", JSON.stringify(expectedProperties));
    logger.debug("Response Data: ", JSON.stringify(this.response.data));
    expect(this.response.data).to.containSubset(expectedProperties);
    if (feature === "game") {
        this.game = this.response.data;
        if ( this.games.length === 0 ) this.games.push(this.game);
    } else if (feature === "deck")
        this.deck = this.response.data
});
