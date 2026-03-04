const falcor = require("./../lib/");
const Model = falcor.Model;

describe("Prototype Pollution Protection", () => {
    it("should reject __proto__ in getValue", (done) => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        model.getValue("user.__proto__").subscribe(
            () => {
                done(new Error("Should have rejected __proto__"));
            },
            (err) => {
                expect(err.message).toBe("Invalid path: prototype pollution attempt detected");
                done();
            }
        );
    });

    it("should reject prototype in getValue", (done) => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        model.getValue("user.prototype").subscribe(
            () => {
                done(new Error("Should have rejected prototype"));
            },
            (err) => {
                expect(err.message).toBe("Invalid path: prototype pollution attempt detected");
                done();
            }
        );
    });

    it("should reject constructor in getValue", (done) => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        model.getValue("user.constructor").subscribe(
            () => {
                done(new Error("Should have rejected constructor"));
            },
            (err) => {
                expect(err.message).toBe("Invalid path: prototype pollution attempt detected");
                done();
            }
        );
    });

    it("should reject __proto__ in _getValueSync", () => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        expect(() => {
            model._getValueSync(["user", "__proto__"]);
        }).toThrow("Invalid path: prototype pollution attempt detected");
    });

    it("should reject __proto__ in invalidate", () => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        expect(() => {
            model.invalidate(["user", "__proto__"]);
        }).toThrow("Invalid path: prototype pollution attempt detected");
    });

    it("should reject __proto__ in getVersion", () => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        expect(() => {
            model.getVersion(["user", "__proto__"]);
        }).toThrow("Invalid path: prototype pollution attempt detected");
    });

    it("should allow normal paths in getValue", (done) => {
        const model = new Model({
            cache: {
                user: { name: "test" }
            }
        });

        model.getValue("user.name").subscribe(
            (value) => {
                expect(value).toBe("test");
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
});
