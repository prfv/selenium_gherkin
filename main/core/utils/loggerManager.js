const log4js = require("log4js");
const configuration = require("../../../configuration.json");

/* The line `const logLevel = configuration["log-level"];` is retrieving the value of the property
"log-level" from the "configuration" object and assigning it to the constant variable "logLevel".
This value is used to set the log level for the logging system provided by the log4js library. */
const logLevel = configuration["log-level"];

/* The `log4js.configure()` function is used to configure the logging system provided by the log4js
library. */
log4js.configure({
    appenders: {
        console: { type: "console" },
        file: { type: "file", filename: "reports/logs/exec.log", backups: 3 },
    },
    categories: {
        default: { appenders: ["console", "file"], level: logLevel },
        console: { appenders: ["console"], level: logLevel },
        file: { appenders: ["file"], level: logLevel },
    },
});

let logger = log4js.getLogger();

module.exports = logger;
