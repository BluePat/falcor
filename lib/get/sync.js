var pathSyntax = require("falcor-path-syntax");
var getValueSync = require("./getValueSync");

module.exports = function _getValueSync(pathArg) {
    var path = pathSyntax.fromPath(pathArg);
    if (Array.isArray(path) === false) {
        throw new Error("Model#_getValueSync must be called with an Array path.");
    }
    // Prevent prototype pollution by rejecting dangerous property names
    for (var i = 0; i < path.length; i++) {
        var key = path[i];
        if (key === "__proto__" || key === "prototype" || key === "constructor") {
            throw new Error("Invalid path: prototype pollution attempt detected");
        }
    }
    if (this._path.length) {
        path = this._path.concat(path);
    }
    this._syncCheck("getValueSync");
    return getValueSync(this, path).value;
};
