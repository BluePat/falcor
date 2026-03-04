var pathSyntax = require("falcor-path-syntax");
var isPathValue = require("./../support/isPathValue");
var setPathValues = require("./../set/setPathValues");

module.exports = function setValueSync(pathArg, valueArg, errorSelectorArg, comparatorArg) {

    var path = pathSyntax.fromPath(pathArg);
    var value = valueArg;
    var errorSelector = errorSelectorArg;
    // XXX comparator is never used.
    var comparator = comparatorArg;

    if (isPathValue(path)) {
        comparator = errorSelector;
        errorSelector = value;
        value = path;
    } else {
        value = {
            path: path,
            value: value
        };
    }

    if (isPathValue(value) === false) {
        throw new Error("Model#setValueSync must be called with an Array path.");
    }

    // Prevent prototype pollution by rejecting dangerous property names
    var pathToValidate = value.path;
    for (var i = 0; i < pathToValidate.length; i++) {
        var key = pathToValidate[i];
        if (key === "__proto__" || key === "prototype" || key === "constructor") {
            throw new Error("Invalid path: prototype pollution attempt detected");
        }
    }

    if (typeof errorSelector !== "function") {
        errorSelector = this._root._errorSelector;
    }

    if (typeof comparator !== "function") {
        comparator = this._root._comparator;
    }

    this._syncCheck("setValueSync");
    setPathValues(this, [value]);
    return this._getValueSync(value.path);
};
