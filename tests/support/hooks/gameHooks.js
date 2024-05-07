const { After } = require("@cucumber/cucumber");
const gameAPI = require("../../../main/pps/api/gameAPI");
const logger = require("../../../main/core/utils/loggerManager");

After({ tags: "@deleteGame" }, async function () {
    logger.debug("These games will be deleted:", JSON.stringify(this.games));
    await gameAPI.deleteGame(this.games, this.users["user1"].token);
    this.games = [];
});
