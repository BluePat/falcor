/**
 * Checks if a key is safe to use for property assignment.
 * Prevents prototype pollution by rejecting keys that could
 * modify object prototypes.
 *
 * @param {*} key The key to check
 * @private
 * @returns {Boolean}
 */
module.exports = function isSafeKey(key) {
    // Reject keys that could pollute object prototype
    return key !== "__proto__" && 
           key !== "constructor" && 
           key !== "prototype";
};
