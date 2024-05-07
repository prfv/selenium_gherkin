const fs = require("fs");
const process = require("process");

/**
 * Class to interact with JSON files
 */
class JsonReader {
    /**
     * Gets json object of read a json file.
     * @param filePath file path of json file
     * returns the JSON object
     */
    static getJson(filePath) {
        const basePath = process.cwd();
        try {
            const jsonString = fs.readFileSync(basePath + filePath);
            return JSON.parse(jsonString);
        } catch (err) {
            return err;
        }
    }
}

module.exports = JsonReader;
