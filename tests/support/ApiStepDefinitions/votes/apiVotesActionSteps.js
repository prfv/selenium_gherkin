const { When } = require("@cucumber/cucumber");

When("the deleted issue ID is saved", function() {
    const issueId = this.issues[0].id;
    this.deletedIssueId = issueId; 
});
