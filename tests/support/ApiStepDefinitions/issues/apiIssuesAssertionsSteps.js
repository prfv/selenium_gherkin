const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../../main/core/utils/chaiExpect");
const { unflatten } = require("flat");
const logger = require("../../../../main/core/utils/loggerManager");
const getProperties = require("../../../../main/core/utils/getProperties");

Then("the response body should verify the issue with:", async function (table) {
    const expected = unflatten(table.rowsHash());
    const expectedProperties = getProperties(expected);
    expectedProperties.issues = [expectedProperties.issues];
    logger.debug("Table: ", expectedProperties);
    logger.debug("Response Data: ", this.response.data);
    expect(this.response.data).to.containSubset(expectedProperties);
    this.issues = this.response.data.issues;
});

Then("the response body should verify the issues with:", async function (table) {
    const dataTable = getProperties(table.hashes());
    const expectedProperties = [];
    dataTable.forEach(row =>{
        const expected = {
            name: row.name,
            description: row.description,
            id: this.replaceTag(row.id).string
        };
        expectedProperties.push(expected)
    })  
    logger.debug("Expected properties:", expectedProperties);
    logger.debug("Response Data: ", this.response.data);
    expect(this.response.data).to.containSubset(expectedProperties);
});
