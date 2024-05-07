const { Given, When } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const issue = require("../../../../main/pps/ui/components/issue/issue.js");
const getProperties = require("../../../../main/core/utils/getProperties.js");
const actions = require("../../../../main/core/ui/utils/driverActions.js");

Given(
    "the user creates an issue with the following data:",
    async function (table) {
        const dataTable = getProperties(table.hashes());
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = fields.value;
        }
        this.issue = this.body;
        logger.info(
            "The issue will be created with the following data:",
            this.body,
        );
        await issue.createIssue(this.issue.Name, this.issue.Description);
    },
);

When(
    "the user edits an issue with the following data:",
    async function (table) {
        const dataTable = getProperties(table.hashes());
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = fields.value;
        }
        logger.info(
            "The issue will be edited with the following data:",
            this.body,
        );
        await issue.editIssue(
            this.issue.Name,
            this.body.Name,
            this.body.Description,
        );
        this.issue = this.body;
    },
);

When("the user deletes {string} issue", async function (issueName) {
    issueName = this.replaceTag(issueName).string;
    logger.info("The issue will be deleted with the name:", issueName);
    await issue.deleteIssue(issueName);
});

When(/the user confirm the (Save|Delete) action/, async function (action) {
    await issue.clickOnSaveOrDeleteButton(action);
});

When("the user sets the issue result with {string} card", async function (value) {
    await issue.setIssueResult(value);
    logger.info("The user finished setting the issue result");
});

When("the user drags the issue to vote", async function () {
    await actions.dragAndDrop(issue.issueCard, issue.boardIssue);
    logger.info("The user dragged the issue to vote");
});