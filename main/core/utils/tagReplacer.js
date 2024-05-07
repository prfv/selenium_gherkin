/* eslint-disable require-jsdoc */
const flatten = require("flat");
/**
 * The function replaces tags in a <string> with corresponding values from an object.
 * @param string - The `string` parameter is a <string> that may contain HTML tags.
 * @returns The function `replaceTag` returns the modified <string> with the tags replaced by their
 * corresponding values.
 */
const replace = function (string, context) {
    const regex = RegExp(/<[\w .]+>/g);
    let value = null;
    if (regex.test(string)) {
        for (const tag of string.match(regex)) {
            const [entity, property] = tag.match(/<(\w+)[.](.+)>/).slice(1);
            let result = context[entity.substring(0,1).toLowerCase() + entity.substring(1)];
            result = flatten.flatten(result);
            value = result[property];
            string = string.replace(tag, value);
        }
    }
    
    return {
        string: string,
    };
};

module.exports = { replace };
