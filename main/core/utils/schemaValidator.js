const Validator = require("jsonschema").Validator;
const { ppsSchemasPath } = require("../../pps/utils/ppsApiConstants");
const { getJson } = require("./jsonReader");
const logger = require("./loggerManager");
/**
 * Validates the response body structure with a Json schema template
 * @param {object} response response body from request
 * @param {string} schemaPath path to schema to compare with
 */
const validateSchema = function (response, schemaPath) {
    let validator = new Validator();
    let schema = getJson(ppsSchemasPath.replace("<schema>", schemaPath));
    if ( schema.code === "ENOENT" ) {
        logger.error("Error: Schema does not exist: ", schema.path);
        return false;
    }
    logger.debug("Valid schema. These are the required properties: ", schema.required);
    return validator.validate(response, schema).valid;
};

module.exports = validateSchema;
