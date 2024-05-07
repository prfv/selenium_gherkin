/**
 * Converts a feature datatable into list of properties for Jest assertion
 * @param {object[]} object to convert
 */
const getProperties = function (object) {
    for (const key in object) { // Convert string "[]" to an empty []
        if (typeof object[key] === "string") {
            if (key !== "id") {
                if (object[key] === "true") {
                    object[key] = true; // Convert "true" to boolean true
                } else if (object[key] === "false") {
                    object[key] = false; // Convert "false" to boolean false
                } else if (!isNaN(object[key])) {
                    object[key] = Number(object[key]); // Convert numeric string to number
                } else if (object[key] === "[]") {
                    object[key] = JSON.parse(object[key]); // Convert string "[]" to an empty []
                }
            }       
        } else if (typeof object[key] === "object") {
            getProperties(object[key]);
        }
    }
    return object;
};

module.exports = getProperties;
