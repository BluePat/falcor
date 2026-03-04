var $ref = require("./../types/ref");
var splice = require("./../lru/splice");
var isObject = require("./../support/isObject");
var isSafeKey = require("./isSafeKey");
var unlinkBackReferences = require("./../support/unlinkBackReferences");
var unlinkForwardReference = require("./../support/unlinkForwardReference");

module.exports = function removeNode(node, parent, key, lru) {
    // Prevent prototype pollution by blocking dangerous keys
    if (!isSafeKey(key)) {
        return false;
    }

    if (isObject(node)) {
        var type = node.$type;
        if (type) {
            if (type === $ref) {
                unlinkForwardReference(node);
            }
            splice(lru, node);
        }
        unlinkBackReferences(node);
        // eslint-disable-next-line camelcase
        parent[key] = node.$_parent = void 0;
        return true;
    }
    return false;
};
