var casual = require("casual");
const GeneratorInterface = require("./generatorInterface");

/**
 * Casual Generator class that use Generator interface
 */
class CasualGeneratorAdapter extends GeneratorInterface {
    generator = casual;
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
        const name = this.generator
            .words(nameLegth)
            .replace(" ", "")
            .substring(0, nameLegth);
        const number = this.generator.integer(1, 10 ** numberLegth - 1);
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
}

module.exports = CasualGeneratorAdapter;
