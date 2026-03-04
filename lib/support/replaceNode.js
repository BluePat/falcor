var isObject = require("./../support/isObject");
var isSafeKey = require("./isSafeKey");
var transferBackReferences = require("./../support/transferBackReferences");
var removeNodeAndDescendants = require("./../support/removeNodeAndDescendants");

module.exports = function replaceNode(node, replacement, parent, key, lru, mergeContext) {
    // Prevent prototype pollution by blocking dangerous keys
    if (!isSafeKey(key)) {
        return node;
    }

    if (node === replacement) {
        return node;
    } else if (isObject(node)) {
        transferBackReferences(node, replacement);
        removeNodeAndDescendants(node, parent, key, lru, mergeContext);
    }

    parent[key] = replacement;
    return replacement;
};
