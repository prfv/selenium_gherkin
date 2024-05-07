/**
 * The function "stringifyObject" takes an object as input, converts it to a JSON string, and
 * returns the "ref" property of the parsed JSON object.
 * @param obj - The `obj` parameter is an object that you want to convert into a string
 * representation.
 * @returns The "ref" property of the parsed JSON object.
 */
const stringifyObject = function (obj) {
    const str = JSON.stringify(obj);
    const { ref } = JSON.parse(str);
    return ref;
};

module.exports = stringifyObject;
