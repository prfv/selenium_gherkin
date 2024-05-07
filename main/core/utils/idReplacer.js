/**
 * The function `matchId` takes a <string> as input and returns an array of lowercase entities extracted
 * from HTML-like tags in the <string>.
 * @param string - The `string` parameter is a string that contains HTML tags.
 * @returns The function `matchId` returns an array containing the lowercase entities extracted from
 * the input string.
 */
const matchId = function (string) {
    let arrayMatch = [];
    const regex = RegExp(/<[\w .]+>/g);
    if (regex.test(string)) {
        for (const tag of string.match(/<[\w .]+>/g)) {
            const entity = tag.match(/[\w .]+/)[0].split(".")[0];
            arrayMatch.push(entity.toLowerCase());
        }
    }
    return arrayMatch;
};

module.exports = matchId;
