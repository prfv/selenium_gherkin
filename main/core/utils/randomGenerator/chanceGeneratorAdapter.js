var Chance = require("chance");
const GeneratorInterface = require("./generatorInterface");

/**
 * Chance Generator class that use Generator interface
 */
class ChanceGeneratorAdapter extends GeneratorInterface {
    generator = new Chance();
    prefix = "";

    /**
     * Class constructor.
     * @param {string} prefix The prefix that random names will contain.
     */
    constructor(prefix) {
        super();
        this.prefix = prefix;
    }

    /**
     * Generate a random text that contains letters and numbers.
     * @param {int} length The length of random text.
     * @returns {string} The random text.
     */
    generateName(length) {
        const numberLegth = Math.floor(length / 2);
        const nameLegth = length - numberLegth;
        const name = this.generator.word({ length: nameLegth });
        const number = this.generator.integer({
            min: 1,
            max: 10 ** numberLegth - 1,
        });
        return name + number.toString().padStart(numberLegth, "0");
    }

    /**
     * Generate a random text that contains a prefix, letters and numbers.
     * @param {int} length The length of random text without prefix.
     * @returns {string} The random text with prefix.
     */
    generateNameWithPrefix(length) {
        return this.prefix + this.generateName(length);
    }

    /**
     * Generate a random text that contains letters.
     * @param {int} length The length of random text.
     * @returns {string} The random text.
     */
    generateNameLetters(length) {
        const name = this.generator.word({ length });
        return name
    }
}

module.exports = ChanceGeneratorAdapter;
