const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../../main/core/utils/chaiExpect");
const { unflatten } = require("flat");
const logger = require("../../../../main/core/utils/loggerManager");

Then("the response body should verify the error with:", async function (table) {
    const expected = unflatten(table.rowsHash());
    expected.details = [expected.details];
    logger.debug("Table: ", expected);
    logger.debug("Response Data: ", this.response.data);
    expect(this.response.data).to.containSubset(expected);
});
