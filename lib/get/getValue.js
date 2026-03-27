var ModelResponse = require("./../response/ModelResponse");
var pathSyntax = require("falcor-path-syntax");

// Helper function to check if a key could lead to prototype pollution
function isDangerousKey(key) {
    return key === "__proto__" || key === "constructor" || key === "prototype";
}

module.exports = function getValue(path) {
    var parsedPath = pathSyntax.fromPath(path);
    var pathIdx = 0;
    var pathLen = parsedPath.length;
    while (++pathIdx < pathLen) {
        if (typeof parsedPath[pathIdx] === "object") {
            /* eslint-disable no-loop-func */
            return new ModelResponse(function(o) {
                o.onError(new Error("Paths must be simple paths"));
            });
            /* eslint-enable no-loop-func */
        }
    }

    // Check for dangerous keys that could access prototype chain
    for (var i = 0; i < parsedPath.length; i++) {
        if (isDangerousKey(String(parsedPath[i]))) {
            /* eslint-disable no-loop-func */
            return new ModelResponse(function(o) {
                o.onError(new Error("Path contains invalid property access"));
            });
            /* eslint-enable no-loop-func */
        }
    }

    var self = this;
    return new ModelResponse(function(obs) {
        return self.get(parsedPath).subscribe(function(data) {
            var curr = data.json;
            var depth = -1;
            var length = parsedPath.length;

            while (curr && ++depth < length) {
                curr = curr[parsedPath[depth]];
            }
            obs.onNext(curr);
        }, function(err) {
            obs.onError(err);
        }, function() {
            obs.onCompleted();
        });
    });
};
