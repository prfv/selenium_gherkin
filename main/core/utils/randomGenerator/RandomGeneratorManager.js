const ChanceGeneratorAdapter = require("./chanceGeneratorAdapter");
const CasualGeneratorAdapter = require("./casualGeneratorAdapter");
const config = require("../../../../configuration.json");

/**
 * Random generator Manager
 */
class RandomGeneratorManager {
    /**
     * Returns one of the random generator tools
     */
    getRandomGenerator() {
        const randomGenerator = config.randomGenerator.name;
        const prefix = config.randomGenerator.prefix;

        if (randomGenerator === "chance") {
            return new ChanceGeneratorAdapter(prefix);
        } else if (randomGenerator === "casual") {
            return new CasualGeneratorAdapter(prefix);
        } else {
            throw new Error("Error! Unknown Random Generator.");
        }
    }
}

module.exports = new RandomGeneratorManager().getRandomGenerator();