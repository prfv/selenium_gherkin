const { Given, When } = require("@cucumber/cucumber");
const restructureObject = require("../../../main/core/utils/restructureObject.js");
const gameApi = require("../../../main/pps/api/gameAPI");
const deckApi = require("../../../main/pps/api/deckAPI");
const requestManager = require("../../../main/core/api/requestManager");
const issuesAPI = require("../../../main/pps/api/issuesAPI.js");
const logger = require("../../../main/core/utils/loggerManager.js");
const getProperties = require("../../../main/core/utils/getProperties.js");
const { loginPPS } = require("../../../main/pps/api/loginAPI.js");

Given("the user creates a game with:", async function (table) {
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    this.body["deck.id"] = await deckApi.findIdDeck(
        this.body["deck.name"],
        this.users["user1"].token,
    );
    this.body = restructureObject(this.body);
    this.response = await gameApi.createGame(
        this.body,
        this.users["user1"].token,
    );
    this.game = this.response.data;
    this.games.push(this.response.data);
});

Given("the user creates an issue with:", async function (table) {
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    logger.debug("Table: ", this.body);
    this.response = await issuesAPI.createIssue(
        this.body,
        this.game.id,
        this.users["user1"].token,
    );
    this.issues = this.response.data.issues;
});

Given("the user creates a deck with:", async function (table) {
    const dataTable = table.hashes();
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    this.body = restructureObject(this.body);
    logger.debug("Deck: ", this.body);
    this.response = await deckApi.createDeck(
        this.body,
        this.users["user1"].token,
    );
    this.deck = this.response.data;
});

When(
    "the {string} sends a {string} request to {string}",
    async function (user, method, endpoint) {
        endpoint = this.replaceTag(endpoint).string;
        let token;
        token = this.users?.[user]?.token ?? null;
        this.response = ["GET", "DELETE"].includes(method.toUpperCase())
            ? await requestManager.sendRequest(method, endpoint, token)
            : await requestManager.sendRequest(
                method,
                endpoint,
                token,
                this.body,
                this.params,
            );
    },
);

Given(
    "the user sets the following request body for a {string}:",
    async function (feature, table) {
        const dataTable = getProperties(table.hashes());
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = /<[\w .]+>/g.test(fields.value)
                ? this.replaceTag(fields.value).string
                : fields.value == "(EmptyString)"
                    ? ""
                    : fields.value;
        }
        this.body = restructureObject(this.body);
        logger.debug(`this.body is set with ${JSON.stringify(this.body)}`);
        this[feature] = Object.assign(this[feature], this.body);
        logger.debug(
            `this.${feature} is set with ${JSON.stringify(this[feature])}`,
        );
    },
);

When("the {string} logs in to PPS", async function (user) {
    const userLogin = await loginPPS(user);
    this.users[user] = userLogin.data;
    logger.debug(`The ${user} logs in:`, this.users[user]);
});

When(
    "the {string} adds a player to the created game",
    async function (user1, table) {
        const dataTable = getProperties(table.hashes());
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = /<[\w .]+>/g.test(fields.value)
                ? this.replaceTag(fields.value).string
                : fields.value;
        }
        this.body = restructureObject(this.body);
        logger.debug(`this.body is set with ${JSON.stringify(this.body)}`);
        this.game.playersInGame.push(this.body);
        this.response = await gameApi.editGame(
            this.game.id,
            this.users[user1].token,
            this.game,
        );
        this.game = this.response.data;
        logger.debug(`Players in the game`, this.game.playersInGame);
    },
);

When("the user sets the request params with:", async function (table) {
    const dataTable = getProperties(table.hashes());
    this.params = {};
    for (const fields of dataTable) {
        this.params[fields.Key] =
            fields.value == "(EmptyString)" ? "" : fields.value;
    }
    logger.debug(`this.params is set with ${JSON.stringify(this.params)}`);
});
