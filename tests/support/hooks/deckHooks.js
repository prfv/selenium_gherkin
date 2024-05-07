const { After } = require("@cucumber/cucumber");
const deckAPI = require("../../../main/pps/api/deckAPI");
const logger = require("../../../main/core/utils/loggerManager");

After({ tags: "@deleteDeck" }, async function () {
    logger.debug("Calling deleteDeck hook")
    await deckAPI.deleteDeck(this.deck.id, this.users["user1"].token);
});
