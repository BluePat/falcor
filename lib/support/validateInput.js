var isArray = Array.isArray;
var isPathValue = require("./../support/isPathValue");
var isJSONGraphEnvelope = require("./../support/isJSONGraphEnvelope");
var isJSONEnvelope = require("./../support/isJSONEnvelope");
var pathSyntax = require("falcor-path-syntax");

/**
 *
 * @param {Object} allowedInput - allowedInput is a map of input styles
 * that are allowed
 * @private
 */
module.exports = function validateInput(args, allowedInput, method) {
    for (var i = 0, len = args.length; i < len; ++i) {
        var arg = args[i];
        var valid = false;

        // Path
        if (isArray(arg) && allowedInput.path) {
            // Prevent prototype pollution by rejecting dangerous property names
            for (var m = 0; m < arg.length; m++) {
                var arrayKey = arg[m];
                if (arrayKey === "__proto__" || arrayKey === "prototype" || arrayKey === "constructor") {
                    return new Error("Invalid path: prototype pollution attempt detected");
                }
            }
            valid = true;
        }

        // Path Syntax
        else if (typeof arg === "string" && allowedInput.pathSyntax) {
            try {
                var parsedPath = pathSyntax.fromPath(arg);
                // Prevent prototype pollution by rejecting dangerous property names
                for (var j = 0; j < parsedPath.length; j++) {
                    var key = parsedPath[j];
                    if (key === "__proto__" || key === "prototype" || key === "constructor") {
                        return new Error("Invalid path: prototype pollution attempt detected");
                    }
                }
                valid = true;
            } catch (errorMessage) {
                return new Error("Path syntax validation error -- " + errorMessage);
            }
        }

        // Path Value
        else if (isPathValue(arg) && allowedInput.pathValue) {
            try {
                arg.path = pathSyntax.fromPath(arg.path);
                // Prevent prototype pollution by rejecting dangerous property names
                for (var k = 0; k < arg.path.length; k++) {
                    var pathKey = arg.path[k];
                    if (pathKey === "__proto__" || pathKey === "prototype" || pathKey === "constructor") {
                        return new Error("Invalid path: prototype pollution attempt detected");
                    }
                }
                valid = true;
            } catch (errorMessage) {
                return new Error("Path syntax validation error -- " + errorMessage);
            }
        }

        // jsonGraph {jsonGraph: { ... }, paths: [ ... ]}
        else if (isJSONGraphEnvelope(arg) && allowedInput.jsonGraph) {
            valid = true;
        }

        // json env {json: {...}}
        else if (isJSONEnvelope(arg) && allowedInput.json) {
            valid = true;
        }

        // selector functions
        else if (typeof arg === "function" &&
                 i + 1 === len &&
                 allowedInput.selector) {
            valid = true;
        }

        if (!valid) {
            return new Error("Unrecognized argument " + (typeof arg) + " [" + String(arg) + "] " + "to Model#" + method + "");
        }
    }
    return true;
};
