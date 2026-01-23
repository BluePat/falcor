// Copies the node
var privatePrefix = require("./../../internal/privatePrefix");
var isSafeKey = require("./../../support/isSafeKey");

module.exports = function clone(node) {
    if (node === undefined) {
        return node;
    }

    var outValue = {};
    for (var k in node) {
        if (k.lastIndexOf(privatePrefix, 0) === 0) {
            continue;
        }
        // Skip unsafe keys to prevent prototype pollution
        if (!isSafeKey(k)) {
            continue;
        }
        outValue[k] = node[k];
    }
    return outValue;
};
