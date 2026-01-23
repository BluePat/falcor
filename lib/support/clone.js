var privatePrefix = require("./../internal/privatePrefix");
var hasOwn = require("./../support/hasOwn");
var isArray = Array.isArray;
var isObject = require("./../support/isObject");
var isSafeKey = require("./../support/isSafeKey");

module.exports = function clone(value) {
    var dest = value;
    if (isObject(dest)) {
        dest = isArray(value) ? [] : {};
        var src = value;
        for (var key in src) {
            if (key.lastIndexOf(privatePrefix, 0) === 0 || !hasOwn(src, key)) {
                continue;
            }
            // Skip unsafe keys to prevent prototype pollution
            if (!isSafeKey(key)) {
                continue;
            }
            dest[key] = src[key];
        }
    }
    return dest;
};
