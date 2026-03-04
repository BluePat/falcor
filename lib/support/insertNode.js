/* eslint-disable camelcase */
var isSafeKey = require("./isSafeKey");

module.exports = function insertNode(node, parent, key, version, optimizedPath) {
    // Prevent prototype pollution by blocking dangerous keys
    if (!isSafeKey(key)) {
        return node;
    }

    node.$_key = key;
    node.$_parent = parent;

    if (version !== undefined) {
        node.$_version = version;
    }
    if (!node.$_absolutePath) {
        if (Array.isArray(key)) {
            node.$_absolutePath = optimizedPath.slice(0, optimizedPath.index);
            Array.prototype.push.apply(node.$_absolutePath, key);
        } else {
            node.$_absolutePath = optimizedPath.slice(0, optimizedPath.index);
            node.$_absolutePath.push(key);
        }
    }

    parent[key] = node;

    return node;
};
