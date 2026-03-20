/* eslint-disable camelcase */
module.exports = function insertNode(node, parent, key, version, optimizedPath) {
    // Prevent prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
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
