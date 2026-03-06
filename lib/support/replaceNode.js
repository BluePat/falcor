var isObject = require("./../support/isObject");
var transferBackReferences = require("./../support/transferBackReferences");
var removeNodeAndDescendants = require("./../support/removeNodeAndDescendants");
var isSafeKey = require("./isSafeKey");

module.exports = function replaceNode(node, replacement, parent, key, lru, mergeContext) {
    if (node === replacement) {
        return node;
    } else if (isObject(node)) {
        transferBackReferences(node, replacement);
        removeNodeAndDescendants(node, parent, key, lru, mergeContext);
    }

    // Skip dangerous keys to prevent prototype pollution
    if (isSafeKey(key)) {
        parent[key] = replacement;
    }
    return replacement;
};
