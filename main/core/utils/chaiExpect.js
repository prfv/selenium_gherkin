const chai = require("chai");
const chaiSubset = require("chai-subset");

chai.use(chaiSubset);

const expect = chai.expect;

module.exports = {
    expect,
};
