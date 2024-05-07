const { getJson } = require("./jsonReader");

/**
 * Sets static values from configuration and environment files
 */
class GetFiles {
    /**
     * Creates file instances
     */
    constructor() {
        this.config = getJson("/configuration.json");
        this.environment =
            getJson("/environment.json")[this.config.environment];
    }
}

module.exports = new GetFiles();
