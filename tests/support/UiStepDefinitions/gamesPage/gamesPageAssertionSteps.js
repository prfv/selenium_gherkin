const { Then } = require("@cucumber/cucumber");
const { expect } = require("../../../../main/core/utils/chaiExpect");
const actions = require("../../../../main/core/ui/utils/driverActions");
const createGameForm = require("../../../../main/pps/ui/components/gamePage/createGameForm");
const logger = require("../../../../main/core/utils/loggerManager");
const gamePage = require("../../../../main/pps/ui/components/gamePage/gamePage");
const getProperties = require("../../../../main/core/utils/getProperties");
const invitePlayersModal = require("../../../../main/pps/ui/components/gamePage/invitePlayersModal");
const joinGameModal = require("../../../../main/pps/ui/components/gamePage/joinGameModal");
const conditions = require("../../../../main/core/ui/utils/driverConditions");
const gameSettingsModal = require("../../../../main/pps/ui/components/gamePage/gameSettingsModal");
const path = require('path');
const os = require('os');
const fs = require("fs");

Then('the created game should display this information on the header:', async function (table) {
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = /<[\w .]+>/g.test(fields.value) ?
            this.replaceTag(fields.value).string :
            fields.value;
    }
    const isGameVisible = await actions.getWebElement(gamePage.gameName(this.body.Name));
    const gameNameDisplayed = await isGameVisible.isDisplayed();
    expect(gameNameDisplayed).to.be.true;
    logger.info(`Game name '${this.game.Name}'.`);
    logger.info(`The game with name '${this.game.Name}' is displayed on the header.`);
});

Then("the {string} game should be displayed the following elements:", async function (gameName, table){
    const dataTable = table.transpose().raw()[0];
    logger.info("These are the elements to find them", dataTable, this.games);
    const locatedElements = await gamePage.displayedElements(dataTable, this.replaceTag(gameName).string);
    expect(locatedElements).to.be.true;
});

Then('the game page should display the following data:', async function (table) {
    const dataTable = table.rowsHash();
    const players = (await gamePage.getPlayersList()).toString().replaceAll("\n",",");
    logger.info(`The players are: "${players}".`);
    expect(dataTable.Players).to.equals(players);
    const cards = (await gamePage.getCardsDeck()).toString().replaceAll("\n",",");
    logger.info(`The cards are: "${cards}".`);
    expect(dataTable.Cards).to.equals(cards);
});

Then("the user should see the {string} error message below the Game name field", async function(errorMessageUI){
    const errorMessage = await actions.getWebElement(createGameForm.errorMessageNameField);
    expect(await errorMessage.isDisplayed()).to.be.true;
    const getTextErrorMessage = await errorMessage.getText();
    expect(errorMessageUI).to.equals(getTextErrorMessage);
    logger.info(`This error message is displayed: "${getTextErrorMessage}"`);
});

Then("the Save button should keep disabled", async function(){
    const element = await actions.getWebElement(createGameForm.saveButton);
    expect(await element.isEnabled()).to.be.false;
    logger.info("The Save button is disabled");
});

Then("the user should only see the first 200 characters of the game name on the header", async function() {
    const gameName = await actions.getWebElement(gamePage.gameName(this.game.name));
    const gameNameText = await gameName.isDisplayed();
    expect(gameNameText).to.be.true;
    logger.info("Game name:", gameNameText);
});

Then ("the {string} should see the invite player modal with this information:", async function (user, table){
    const dataTable = table.transpose().raw()[0];
    const locatedElements = await invitePlayersModal.displayedElements(dataTable);
    expect(locatedElements).to.be.true;
    logger.info(`The ${user} verifies that the invite player modal is displayed with the following information: ${JSON.stringify(dataTable)}`);
});

Then ("the {string} should see displayed the join game modal of the {string} with this information:", async function (user, gameName, table){
    logger.info(`The ${user} sees the join game of ${gameName} modal`); 
    const dataTable = table.transpose().raw()[0];
    logger.info("These are the elements to find them", dataTable, this.games);
    const locatedElements = await joinGameModal.displayedElements(dataTable, this.replaceTag(gameName).string);
    expect(locatedElements).to.be.true;
});
Then ("the results graph should be verified with the players' votes", async function () {
    const letters = this.votes;
    const countletters = letters.reduce((cont, letter) => 
        (cont[letter] = (cont[letter] || 0) + 1, cont), {});
    logger.info("This is the vote counter", countletters)
    const votesLetters = await gamePage.getListOfVotes("labels");
    const votesValues = await gamePage.getListOfVotes("values");
    logger.info("This is the votes", votesLetters, votesValues);
    for (let index = 0; index < votesLetters.length; index++) {
        const value = countletters[votesLetters[index]];
        expect(votesValues.includes(String(value))).to.be.true;
    }       
});

Then("the {string} vote of player {string} should be visible on the revealed cards", async function (vote, user) {
    const expectName = user === "user1"? "Me": this.users[user].username;
    const locator = await gamePage.playerInCardReveal(vote, expectName);
    const element = await actions.getWebElement(
        locator
    );
    const name = await element.getText();
    logger.info("This is the name in the card", name)
    expect(expectName).to.equals(name);
});

Then("the graph should be a {string}", async function (graf){
    const locator = gamePage.graphic(graf);
    const isVisible = await actions.getWebElement(locator);
    const graphicDisplayed = await isVisible.isDisplayed();
    expect(graphicDisplayed).to.be.true;
    logger.info(`The '${graf}' graphic is displayed.`);
});

Then("the {string} card with the highest number of votes should be in {string} on the graph", async function(card, color){
    const locator = gamePage.colorInGraphic;
    const element = await actions.getWebElement(locator);
    const colorGraphic = await element.getAttribute('color')
    logger.info(`The color in the graphic with the highest number of votes is:`, colorGraphic);
    const textInColorLocator = gamePage.textInColor(colorGraphic);
    let textInColor = await actions.getWebElement(textInColorLocator);
    textInColor = await textInColor.getText();
    logger.info(`The card with the highest number of votes is:`, textInColor);
    expect(textInColor).to.equals(card);
    expect(this.colors[color]).to.equals(colorGraphic);
});

Then("the user changes the pie chart to bar charts", async function (){
    await gamePage.clickGameSettings()
    await gameSettingsModal.changeChart();
    logger.info("The user changed the pie chart to a bar chart");
});

Then("the graph should not be displayed", async function(){
    const isVisible = await conditions.isVisible(gamePage.graphic("pie"));
    expect(isVisible).to.be.false;
    logger.info("The graph is not present, after voting has started again");
});

Then("the user should see in the players area the following data:", async function(table) {
    const dataTable = table.transpose().raw()[0];
    let dataTableReplaced = [];
    for (const fields of dataTable) {
        dataTableReplaced.push(/<[\w .]+>/g.test(fields) ?
            this.replaceTag(fields).string :
            fields);
    }
    logger.info("Data table:", dataTableReplaced);
    const playersList = await gamePage.getPlayersList()
    logger.info("Players list:", playersList);
    expect(dataTableReplaced).to.have.deep.members(playersList);
});

Then("the {string} issue is displayed", async function (issueName) {
    logger.info(`Verifyng ${issueName} issue is displayed`);
    const issues = await gamePage.getIssuesNames()
    logger.info(`${JSON.stringify(issues)} should contain "${issueName}"`);
    expect(issues).to.include(issueName);
});

Then("the {string} file should be in dowload folder", async function (fileName) {
    this.dowloadedFilePath = path.join(os.homedir(), 'Downloads\\', fileName);
    logger.info(`Verifyng "${this.dowloadedFilePath}" file exists`);
    for (let seconds = 1; seconds < 11 && !fs.existsSync(this.dowloadedFilePath); seconds++) {
        logger.info(`Waiting ${seconds} of 10 seconds to appears "${this.dowloadedFilePath}" file`);
        await actions.waitForMiliseconds(1000)
    }
    expect(fs.existsSync(this.dowloadedFilePath)).to.be.true;
});

Then("the file should contain the following lines", async function (table) {
    const dataTable = table.rows();
    logger.info(`Verifyng ${JSON.stringify(dataTable)} lines exists in the "${this.dowloadedFilePath}" file`);
    fs.readFile(this.dowloadedFilePath, (err, fileData) => {
        if (err) {
            logger.error(JSON.stringify(err))
            throw err
        }
        fileData = fileData.toString()
        logger.info(`The file content is: `, fileData);
        dataTable.forEach(line => {
            expect(fileData).to.include(line)
        });
    })
});

Then ("the {string} should be in the player list", async function (user) {
    const expectName = user === "user1"? "Me":this.users[user].username;
    const playerList =  await gamePage.getListOfPlayers();
    logger.info("This is the player list:", playerList);
    expect(playerList.includes(expectName)).to.be.true;
})

Then("the user should preview the cards of the new selected voting system:", async function(table) {
    const expectedCards = table.raw()[0][0];
    logger.info("Cards of the new voting system:", expectedCards);
    const actualCards = (await gameSettingsModal.previewDeckCards()).toString();
    logger.info("Cards of the actual voting system:", actualCards);
    expect(expectedCards).to.equals(actualCards);
});

Then("the user should not be able to choose any card from the deck", async function() {
    const cardsEnabled = await gamePage.areCardsEnabled();
    logger.info(`The cards ${cardsEnabled ? "are" : "are not"} enabled`);
    expect(cardsEnabled).to.be.false;
});

Then("the user should see the Reveal Cards button disabled", async function() {
    const revealCardsButton = await actions.getWebElement(gamePage.revealCardsButton);
    const isEnabledButton = await revealCardsButton.isEnabled();
    logger.info(`The "Reveal Cards" button ${isEnabledButton ? "is" : "is not"} enabled`);
    expect(isEnabledButton).to.be.false;
});

Then("the user should see the Can Reveal Cards and Can Manage Issues fields disabled", async function() {
    const revealCards = await actions.getWebElement(gameSettingsModal.playersAbleToRevealCardsInput);
    const isEnabledRevealCardsInput = await revealCards.isEnabled();
    const manageIssues = await actions.getWebElement(gameSettingsModal.playersAbleToManageIssuesInput);
    const isEnabledManageIssuesInput = await manageIssues.isEnabled();
    expect(isEnabledRevealCardsInput).to.be.false;
    expect(isEnabledManageIssuesInput).to.be.false;
    logger.info("The Can Reveal Cards and Can Manage Issues fields are disabled");
});

Then("the user should see the {string} error message bellow the field", async function(errorMessage) {
    const errorMessageElemet = await actions.getWebElement(gameSettingsModal.errorMessages(errorMessage));
    const isDisplayedErrorMessage = await errorMessageElemet.isDisplayed();
    expect(isDisplayedErrorMessage).to.be.true;
    logger.info(`The "${errorMessage}" error message is displayed`);
});
