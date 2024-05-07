/**
 * Generator interface
 * Contains empty methods that throw error if they are not implemented
 */
class GeneratorInterface {
    // eslint-disable-next-line no-unused-vars, require-jsdoc
    generateName(length) {
        throw new Error(
            "generateName method must be implemented in derived classes",
        );
    }

    // eslint-disable-next-line no-unused-vars, require-jsdoc
    generateNameWithPrefix(length) {
        throw new Error(
            "generateNameWithPrefix method must be implemented in derived classes",
        );
    }
}

module.exports = GeneratorInterface;
