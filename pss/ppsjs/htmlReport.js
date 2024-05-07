const reporter = require("cucumber-html-reporter");

const options = {
    theme: "bootstrap",
    jsonFile: "reports/cucumber/cucumber_report.json",
    output: "reports/cucumber/cucumberReport.html",
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    storeScreenshots: false,
    launchReport: true,
    failedSummaryReport: true,
};

reporter.generate(options);
