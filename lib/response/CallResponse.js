var ModelResponse = require("./../response/ModelResponse");
var InvalidSourceError = require("./../errors/InvalidSourceError");

var pathSyntax = require("falcor-path-syntax");

/**
 * @private
 * @augments ModelResponse
 */
function CallResponse(model, callPath, args, suffix, paths) {
    this.callPath = pathSyntax.fromPath(callPath);
    this.args = args;

    // Prevent prototype pollution by rejecting dangerous property names
    for (var i = 0; i < this.callPath.length; i++) {
        var key = this.callPath[i];
        if (key === "__proto__" || key === "prototype" || key === "constructor") {
            throw new Error("Invalid path: prototype pollution attempt detected");
        }
    }

    if (paths) {
        this.paths = paths.map(pathSyntax.fromPath);
        for (var j = 0; j < this.paths.length; j++) {
            for (var k = 0; k < this.paths[j].length; k++) {
                var pathKey = this.paths[j][k];
                if (pathKey === "__proto__" || pathKey === "prototype" || pathKey === "constructor") {
                    throw new Error("Invalid path: prototype pollution attempt detected");
                }
            }
        }
    }
    if (suffix) {
        this.suffix = suffix.map(pathSyntax.fromPath);
        for (var m = 0; m < this.suffix.length; m++) {
            for (var n = 0; n < this.suffix[m].length; n++) {
                var suffixKey = this.suffix[m][n];
                if (suffixKey === "__proto__" || suffixKey === "prototype" || suffixKey === "constructor") {
                    throw new Error("Invalid path: prototype pollution attempt detected");
                }
            }
        }
    }
    this.model = model;
}

CallResponse.prototype = Object.create(ModelResponse.prototype);
CallResponse.prototype._subscribe = function _subscribe(observer) {
    var callPath = this.callPath;
    var callArgs = this.args;
    var suffixes = this.suffix;
    var extraPaths = this.paths;
    var model = this.model;
    var rootModel = model._clone({
        _path: []
    });
    var boundPath = model._path;
    var boundCallPath = boundPath.concat(callPath);

    /* eslint-disable consistent-return */
    // Precisely the same error as the router when a call function does not
    // exist.
    if (!model._source) {
        observer.onError(new Error("function does not exist"));
        return;
    }


    var response, obs;
    try {
        obs = model._source.
            call(boundCallPath, callArgs, suffixes, extraPaths);
    } catch (e) {
        observer.onError(new InvalidSourceError(e));
        return;
    }

    return obs.
        subscribe(function(res) {
            response = res;
        }, function(err) {
            observer.onError(err);
        }, function() {

            // Run the invalidations first then the follow up JSONGraph set.
            var invalidations = response.invalidated;
            if (invalidations && invalidations.length) {
                rootModel.invalidate.apply(rootModel, invalidations);
            }

            // The set
            rootModel.
                withoutDataSource().
                set(response).subscribe(function(x) {
                    observer.onNext(x);
                }, function(err) {
                    observer.onError(err);
                }, function() {
                    observer.onCompleted();
                });
        });
    /* eslint-enable consistent-return */
};

module.exports = CallResponse;
