module.exports = {
    default: [
        "tests/features/**/*.feature",
        "--require tests/support/**/*.js",
        "--format json:reports/cucumber/cucumber_report.json",
        "--format @cucumber/pretty-formatter ",
        "--publish-quiet",
    ].join(" "),
};
