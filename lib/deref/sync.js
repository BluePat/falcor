var pathSyntax = require("falcor-path-syntax");
var getBoundValue = require("./../get/getBoundValue");
var InvalidModelError = require("./../errors/InvalidModelError");

module.exports = function derefSync(boundPathArg) {

    var boundPath = pathSyntax.fromPath(boundPathArg);

    if (!Array.isArray(boundPath)) {
        throw new Error("Model#derefSync must be called with an Array path.");
    }

    // Prevent prototype pollution by rejecting dangerous property names
    for (var i = 0; i < boundPath.length; i++) {
        var key = boundPath[i];
        if (key === "__proto__" || key === "prototype" || key === "constructor") {
            throw new Error("Invalid path: prototype pollution attempt detected");
        }
    }

    var boundValue = getBoundValue(this, this._path.concat(boundPath), false);

    var path = boundValue.path;
    var node = boundValue.value;
    var found = boundValue.found;

    // If the node is not found or the node is found but undefined is returned,
    // this happens when a reference is expired.
    if (!found || node === undefined) {
        return undefined;
    }

    if (node.$type) {
        throw new InvalidModelError(path, path);
    }

    return this._clone({ _path: path });
};
