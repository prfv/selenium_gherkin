const { Given } = require("@cucumber/cucumber");
const deckApi = require("../../../../main/pps/api/deckAPI");
const restructureObject = require("../../../../main/core/utils/restructureObject");
const logger = require("../../../../main/core/utils/loggerManager");

Given(
    "the user sets the following request body for {string} a game:",
    async function (action, table) {
        if( action === "edit" ) {
            const addGame = this.games.filter( game => game["id"] == this.response.data.id );
            if ( addGame.length === 0 ) {
                this.game = this.response.data;
                this.games.push(this.game);
            }
        }
        const dataTable = table.hashes();
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = (/<[\w .]+>/g).test(fields.value)
                ? this.replaceTag(fields.value).string
                : fields.value == "(EmptyString)"
                    ? ""
                    : fields.value;
        }
        this.body["deck.id"] = await deckApi.findIdDeck(
            this.body["deck.name"],
            this.users.user1.token,
        );
        this.body = restructureObject(this.body);
        logger.info(`Body request to ${action} a game :`, JSON.stringify(this.body));
    }
);
