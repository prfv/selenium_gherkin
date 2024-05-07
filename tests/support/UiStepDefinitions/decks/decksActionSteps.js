const { When } = require("@cucumber/cucumber");
const getProperties = require("../../../../main/core/utils/getProperties");
const actions = require("../../../../main/core/ui/utils/driverActions");
const navBar = require("../../../../main/pps/ui/components/navBar/navBar");
const votingSystemMenu = require("../../../../main/pps/ui/components/votingSystem/votingSystemMenu");
const votingSystemForm = require("../../../../main/pps/ui/components/votingSystem/votingSystemForm");
const randomGenerator = require("../../../../main/core/utils/randomGenerator/chanceGeneratorAdapter");
const logger = require("../../../../main/core/utils/loggerManager");
const generator = new randomGenerator()

When("the user clicks on the Voting Systems option in the navbar", async function(){
    await actions.clickOn(navBar.votingSystemsButton);
});

When("the user selects from the menu the option to add a custom voting system", async function(){
    await actions.clickOn(votingSystemMenu.addDeckButton);
});

When("the user selects from the menu the {string} option to edit a custom voting system", async function(menuOption){
    await actions.clickOn(votingSystemMenu.votingSystemOption(menuOption));
});

When("the user uses the following data to {action} a custom voting system:", async function(actionToDo, table){
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value.startsWith("(randomName")
            ?(() => {
                const lengthMatch = fields.value.match(/\((randomName(\d+))\)/);
                if(lengthMatch){
                    const length = parseInt(lengthMatch[2]);
                    const name = generator.generateNameLetters(length);
                    this.randomName = name;
                    return name;
                }
            })():
            fields.value;
    }
    if(actionToDo === "create") {
        await votingSystemForm.createNewVotingSystem(this.body);
    } else if(actionToDo === "edit") {
        await votingSystemForm.editVotingSystem(this.body);
    }
    this.deck = this.body;
});

When("the user clicks on the delete voting system button", async function() {
    const votingSystemName = this.deck["Voting System Name"];
    logger.debug(`Clicking the Delete button for: ${votingSystemName}`);
    await actions.clickOn(votingSystemMenu.votingSystemDeleteButton(votingSystemName));
});

When("the user deletes the created voting system", async function() {
    logger.debug("Deleting the created voting system");
    await votingSystemForm.deleteVotingSystem(this.deck);
});

When("the user deletes voting system", async function() {
    await actions.clickOn(votingSystemMenu.votingSystemDeleteButton(this.deck["Voting System Name"]));
    await votingSystemForm.deleteVotingSystem(this.deck);
});

When("the user fill the name field with:", async function(table){
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value === "(Empty String)" ?
            "" : fields.value.startsWith("(randomName")
                ?(() => {
                    const lengthMatch = fields.value.match(/\((randomName(\d+))\)/);
                    if(lengthMatch){
                        const length = parseInt(lengthMatch[2]);
                        return generator.generateName(length);
                    }
                })():
                fields.value;
    }
    await votingSystemForm.fillName(this.body);
});

When("the user fill the deck field with:", async function(table){
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        this.body[fields.Key] = fields.value === "(Empty String)" ?
            "" :
            fields.value;
    }
    await votingSystemForm.fillDeck(this.body);
});

When("the user fill the Create Voting System form with:", async function(table){
    const dataTable = getProperties(table.hashes());
    this.body = {};
    for (const fields of dataTable) {
        if(fields.value === "(EmptyString)"){
            this.body[fields.Key] = "";    
        } else {
            this.body[fields.Key] = fields.value;
        }
    } 
    await votingSystemForm.fillName(this.body);
    await votingSystemForm.fillDeck(this.body);
});

When("the user clicks the cancel button", async function() {
    logger.debug("Cancel or close Voting System Form");
    await votingSystemForm.cancelForm()
});
