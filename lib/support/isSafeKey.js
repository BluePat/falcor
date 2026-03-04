/**
 * Checks if a key is safe to use for object property assignment.
 * Prevents prototype pollution by blocking dangerous keys.
 *
 * @param {*} key - The key to check
 * @returns {boolean} - True if the key is safe to use
 */
module.exports = function isSafeKey(key) {
    // Block keys that can lead to prototype pollution
    return key !== "__proto__" &&
           key !== "constructor" &&
           key !== "prototype";
};
