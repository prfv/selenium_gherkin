const { expect } = require("../main/core/utils/chaiExpect");

describe("test 1 example percy", () => {
    it("sum of two numbers", () => {
        expect(1 + 1).to.equal(2);
    });
});
