/**
 * The code is defining an object called `ppsApiRoutes` with a properties.
 * This object is then exported using `module.exports` so that it can be used in other parts of the code.
 */
const ppsApiRoutes = {
    LOGIN: "/login",
    LOGOUT: "/logout",
    GAME: "/planning-poker/games",
    DECK: "/planning-poker/decks",
    ISSUE: (gameID) => `/planning-poker/games/${gameID}/issues`,
};

/**
 * The line `const ppsSchemasPath = "/main/pps/api/resources/schemas/<schema>.json";` is defining
 * a constant variable called `ppsSchemasPath` and assigning it a string value. The string value is a
 * path to a JSON file that is used as a schema for a resource in an API. The `<schema>` placeholder
 * indicates that the actual schema name should be provided when using this path. The `<schema>` should be
 * replaced with the name of the schema to be used.
 */
const ppsSchemasPath = "/main/pps/api/resources/schemas/<schema>.json";

module.exports = {
    ppsApiRoutes,
    ppsSchemasPath,
};
