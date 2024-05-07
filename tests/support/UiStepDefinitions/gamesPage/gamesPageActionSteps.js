const { Given, When } = require("@cucumber/cucumber");
const getProperties = require("../../../../main/core/utils/getProperties.js");
const restructureObject = require("../../../../main/core/utils/restructureObject.js");
const logger = require("../../../../main/core/utils/loggerManager.js");
const actions = require("../../../../main/core/ui/utils/driverActions.js");
const conditions = require("../../../../main/core/ui/utils/driverConditions.js");
const createGameForm = require("../../../../main/pps/ui/components/gamePage/createGameForm.js");
const homePage = require("../../../../main/pps/ui/components/homePage/homePage.js");
const gamePage = require("../../../../main/pps/ui/components/gamePage/gamePage.js");
const navBar = require("../../../../main/pps/ui/components/navBar/navBar.js");
const randomGeneratorManager = require("../../../../main/core/utils/randomGenerator/RandomGeneratorManager.js");
const invitePlayersModal = require("../../../../main/pps/ui/components/gamePage/invitePlayersModal.js");
const driverManager = require("../../../../main/core/ui/driverManager.js");
const getFiles = require("../../../../main/core/utils/getFiles.js")
const loginPage = require("../../../../main/pps/ui/components/login/loginPage.js");
const joinGameModal = require("../../../../main/pps/ui/components/gamePage/joinGameModal.js");
const gameSettingsModal = require("../../../../main/pps/ui/components/gamePage/gameSettingsModal.js");
const gameApi = require("../../../../main/pps/api/gameAPI.js");
const voteAPI = require("../../../../main/pps/api/voteAPI.js");

Given("the user creates a game with the following data:", async function( table ) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value === "(String with 200 characters)" ?
            randomGeneratorManager.generateName(parseInt(fields.value.split(' ')[2])) :
            fields.value === "(String with 201 characters)" ?
                randomGeneratorManager.generateName(parseInt(fields.value.split(' ')[2])) :
                fields.value;
    }
    await actions.clickOn(homePage.createGameButton);
    await createGameForm.fillOutForm( this.body );
    await createGameForm.createGame();
    this.game.name = this.body.Name.length > 200 ?
        this.body.Name.substring(0,this.body.Name.length-1) :
        this.body.Name;
    logger.info("Game data:", this.game);
    logger.info(`The "${this.game.name}" game with the "${this.body["Voting System"]}" as its voting system was created successful`);
    await conditions.waitUntilElementIsLocated(gamePage.gameName(this.game.name));
    await conditions.waitUntilElementIsVisible(gamePage.gameName(this.game.name));
    const idGame = "-" + (await actions.driver.getCurrentUrl()).split("-")[1];
    logger.info("Game ID:", idGame);
    this.games = [ {"id": idGame} ];
});

Given(
    "the user creates a game from navbar with the following data:",
    async function (table) {
        const dataTable = getProperties(table.hashes());
        this.body = {};
        for (const fields of dataTable) {
            this.body[fields.Key] = fields.value;
        }
        logger.info(
            "The game will be created with the following data:",
            this.body,
        );
        await actions.clickOn(navBar.createGameButton);
        await createGameForm.fillOutForm( this.body );
        await createGameForm.createGame();
        await conditions.waitUntilElementIsLocated(gamePage.gameName(this.body.Name));
        await conditions.waitUntilElementIsVisible(gamePage.gameName(this.body.Name));
        const idGame = "-" + (await actions.driver.getCurrentUrl()).split("-")[1];
        logger.info("Game ID:", idGame);
        this.game = {...this.body, ...{"id": idGame}}
        logger.info("This is a new game", this.game);
        this.games.push(this.game);
    },
)

When("the user tries to create a game with:", async function( table ) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    const emptyString = "";
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value === "(Empty String)" ?
            emptyString :
            fields.value;
    }
    await actions.clickOn(homePage.createGameButton);
    await createGameForm.fillOutForm( this.body );
    logger.info("Filling out the form with:", this.body);
});

When('the user enters the following game details:', async function (table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value;
    }
    await createGameForm.fillOutForm( this.body );
    await createGameForm.createGame();
    logger.info(`User entered the following game details: Name='${this.body.Name}', Deck='${this.body["Voting System"]}'`);
});

When("the user clicks on the Cancel button", async function(){
    await actions.clickOn(createGameForm.cancelButton);
    logger.debug(`The "Cancel" button was clicked`);
});

When("the {string} clicks on add member icon button", async function(user){
    await gamePage.clickAddPlayer();
    logger.info(`the ${user} clicked on the add member icon button.`);
});

When('the {string} saves the invitation link', async function(user) {
    logger.info(`The ${user} is saving the invitation link`); 
    this.link = await invitePlayersModal.getInvLink();
});
  
When('the {string} logs into PPS and opens the invitation link', async function (user) {
    logger.info(`The ${user} is opening the link`); 
    await loginPage.loginUser(
        getFiles.environment.users[user]['username'], 
        getFiles.environment.users[user]['password']
    );
    const userNameElement  = await actions.getWebElement(navBar.userName);
    logger.debug("The user name verification: ", await userNameElement.isDisplayed());
    await driverManager.navigateTo(this.link);
    const joinGameModal  = await actions.getWebElement(gamePage.joinGameModal);
    logger.debug("The join game modal verification: ", await joinGameModal.isDisplayed());
});

When('the {string} clicks on the continue to game button', async function (user){
    logger.info(`The ${user} is opening the link`); 
    await conditions.waitUntilElementIsVisible(joinGameModal.continueToGameBtn);
    await actions.clickOn(joinGameModal.continueToGameBtn);  
});

When("the {string} clicks on game settings button", async function (user) {
    logger.info(`The ${user} is opening the game settings`); 
    await gamePage.clickGameSettings()
});

When('the {string} changes the actual facilitator', async function (user) {
    const userName = getFiles.environment.users[user]['username'];
    logger.info(`The ${userName} is attempting to change the facilitator.`);
    await gameSettingsModal.changeFacilitator(userName);
});
  
When ("the user adds the player {string} by API", async function(user, table){ 
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = /<[\w .]+>/g.test(fields.value)
            ? this.replaceTag(fields.value).string
            : fields.value;
    }
    this.body = restructureObject(this.body);
    logger.debug(`this.body is set with ${JSON.stringify(this.body)}`);
    this.response = await gameApi.getGame(this.games[0].id, this.users.user1.token);
    this.game = this.response.data
    logger.debug(`Players in the game`, JSON.stringify(this.game.playersInGame));
    this.game.playersInGame.push(this.body);
    const response = await gameApi.editGame(
        this.game.id,
        this.users["user1"].token,
        this.game,
    );
    this.game = response.data;
    await actions.waitForMiliseconds(1500);
    logger.debug(`Players in the game`, JSON.stringify(this.game.playersInGame));
});

When("the user sends the issue to vote", async function () {
    await conditions.waitUntilElementIsLocated(gamePage.sendToVoteIssueButton);
    await conditions.waitUntilElementIsVisible(gamePage.sendToVoteIssueButton);
    await actions.clickOn(gamePage.sendToVoteIssueButton);
    await actions.waitForMiliseconds(3500);
    logger.info("The user has sent the issue for voting.");
});

When ("the user starts the voting", async function () {
    await conditions.waitUntilElementIsLocated(gamePage.startVotingButton);
    await conditions.waitUntilElementIsVisible(gamePage.startVotingButton);
    await actions.clickOn(gamePage.startVotingButton); 
    logger.debug(`Players in te star the vote `, this.game.playersInGame);
    this.game.status = "STARTED";
});

When ("the user votes with the value {string} in the game", async function (value) {
    await conditions.waitUntilElementIsLocated(gamePage.valueVoteButton(value));
    await conditions.waitUntilElementIsVisible(gamePage.valueVoteButton(value));
    await actions.clickOn(gamePage.valueVoteButton(value));
    this.votes.push(value);
    logger.debug("The user has voted with the following card:", value);
});

When ("the {string} votes for API the value {string} in the game", async function (user, value) {
    const userValue = this.users[user].username;
    logger.debug(`this is the username of ${user}:`, userValue);
    const player = this.game.playersInGame.find(player => player.playerDetails.name === userValue)
    logger.debug(`This is the data of ${user} within the game`, player);
    this.body =  {
        "player": {
            "id": player.playerDetails.id,
            "name": player.playerDetails.name,
            "userOwner": player.playerDetails.name,
        },
        "vote": value 
    }
    logger.debug("This is the body that will be sent to the request", this.body);
    await voteAPI.addVote(this.body, this.game.issues[0].id, this.users.user1.token);
    this.votes.push(value);
});

When ("the user reveals cards", async function () {
    await conditions.waitUntilElementIsLocated(gamePage.revealCardsButton);
    await conditions.waitUntilElementIsVisible(gamePage.revealCardsButton);
    await actions.clickOn(gamePage.revealCardsButton);
    logger.debug("The user has revealed the cards with the following votes:", this.votes);
});

When("the user adds issues from a file", async function () {
    logger.info(`the user is adding issus from a file`);
    await gamePage.uploadIssuesFromAFile();
});

When("the user downloads issues in a file", async function () {
    logger.info(`the user is downloading issues`);
    await gamePage.downloadIssuesIntoAFile();
});

When("the user sets the following data to edit the game:", async function(table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = /<[\w .]+>/g.test(fields.value)
            ? this.replaceTag(fields.value).string
            : fields.value;
    }
    logger.info("Data to edit the game: ", this.body);
    await gameSettingsModal.changeFields(this.body);
});

When("the user clicks on the Save button to save the changes", async function() {
    logger.info("The user clicks on the Save button");
    await actions.clickOn(gameSettingsModal.saveSettingButton);
});
