const logger = require("../loggerManager");
const { expect } = require("chai");
const { describe, it } = require("mocha");

describe("Logger should be working properly", () => {
    it("Logger should not be undefined", () => {
        expect(logger).not.to.be.undefined;
    });

    it("Logger should have a property for each level", () => {
        expect(logger).to.have.property("fatal");
        expect(logger).to.have.property("error");
        expect(logger).to.have.property("warn");
        expect(logger).to.have.property("info");
        expect(logger).to.have.property("debug");
        expect(logger).to.have.property("trace");
    });
});
