/**
 * Determines if the key is safe to use for object property access.
 * Prevents prototype pollution by blocking dangerous keys.
 *
 * @param {*} key The key to check
 * @private
 * @returns {Boolean}
 */
module.exports = function isSafeKey(key) {
    // Block prototype pollution vectors
    return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};
