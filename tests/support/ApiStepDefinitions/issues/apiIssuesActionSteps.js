const { Given } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager");

Given(
    "the user sets the following request body for create an issue:",
    async function (table) {
        const dataTable = table.hashes();
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = fields.value;
        }
        logger.debug(this.body);
    },
);
