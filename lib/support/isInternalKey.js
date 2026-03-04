var privatePrefix = require("./../internal/privatePrefix");
var isSafeKey = require("./isSafeKey");

/**
 * Determined if the key passed in is an internal key.
 *
 * @param {String} x The key
 * @private
 * @returns {Boolean}
 */
module.exports = function isInternalKey(x) {
    // Also treat prototype pollution keys as internal to filter them out
    return x === "$size" || x.lastIndexOf(privatePrefix, 0) === 0 || !isSafeKey(x);
};
