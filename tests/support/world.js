const {
    setWorldConstructor,
    setDefaultTimeout,
} = require("@cucumber/cucumber");
const getFiles = require("../../main/core/utils/getFiles");
const replaceTag = require("../../main/core/utils/tagReplacer");

/**
 * The CustomWorld function initializes an objects with an empty values.
 */
function CustomWorld({ attach }) {
    this.attach = attach;
    this.users = {
        "user invalid": {
            token: "fake token",
            username: "invalid username",
            password: "invalid password",
        },
        "user without token": {
            token: null
        },
        currentUIUser:{}
    };
    this.game = {};
    this.games = [];
    this.response = {};
    this.query = {};
    this.issue = {};
    this.issues = {};
    this.issueVotes = {};
    this.deck = {};
    this.dowloadedFilePath = "";
    this.votes = [];
    this.colors = {
        "green":"#06FF2E"
    }

    this.replaceTag = function (string) {
        return replaceTag.replace(string, this);
    };
}

setDefaultTimeout(getFiles.config.cucumberStepTimeout);
setWorldConstructor(CustomWorld);
