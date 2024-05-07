const { Then } = require("@cucumber/cucumber");
const logger = require("../../../../main/core/utils/loggerManager.js");
const signUpPage = require("../../../../main/pps/ui/components/signUpPage/signUpPage.js");
const { expect } = require("../../../../main/core/utils/chaiExpect.js");

Then("the user should see the {string} sucessfull message in the login page", async function (message) {
    logger.info(`Verifyng ${message} message is displayed`);
    const messages = await signUpPage.getMessageTexts()
    logger.info(`${JSON.stringify(messages)} should contain "${message}"`);
    expect(messages).to.include(message);
});

Then("the user should see the {string} error message in the sign-up page", async function (message) {
    logger.info(`Verifyng ${message} error message is displayed`);
    const messages = await signUpPage.getMessageTexts()
    logger.info(`${JSON.stringify(messages)} should contain "${message}"`);
    expect(messages).to.include(message);
});

Then(/the user should see (unchecked|checked) this items/, async function (option, table) {
    const items = table.rows();
    let elementsToVerify = []
    if (option == "checked") {
        logger.info("Verifing checked password verifications")
        elementsToVerify = await signUpPage.getPasswordVerifications("check")
    } else {
        logger.info("Verifing unchecked password verifications")
        elementsToVerify = await signUpPage.getPasswordVerifications("close")
    }
    
    items.forEach(passwordVerification => {
        logger.info(`${JSON.stringify(elementsToVerify)} should contain "${JSON.stringify(passwordVerification)}"`);
        expect(elementsToVerify).to.include(passwordVerification[0]);
    });
    
    logger.info(`the number of ${option} elements is ${elementsToVerify.length} and 
        the number of elements in the table is ${items.length}`)
    expect(elementsToVerify.length).to.be.equal(items.length);
});

