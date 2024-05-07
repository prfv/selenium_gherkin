const flatten = require("flat");

/**
 * Transform an object with keys tha contain underscore, into a nested object
 * @param {Object} originalBody is the original object to be transformed
 * @returns {Object} tramsformed object.
 */
function restructureObject(originalBody) {
    return flatten.unflatten(originalBody);
}

module.exports = restructureObject;
