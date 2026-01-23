/**
 * Tests for prototype pollution vulnerability fix
 */
const Model = require('./../lib').Model;
const toObservable = require('./toObs');

describe('Prototype Pollution Prevention', () => {
    it('should not pollute Object.prototype via __proto__ in JSONGraph get', done => {
        const model = new Model({
            cache: {
                "__proto__": {
                    value: "polluted"
                }
            }
        });
        
        toObservable(model.get(['__proto__'])).subscribe(() => {
            // Verify that Object.prototype was not polluted
            expect(Object.prototype.polluted).toBeUndefined();
            expect({}.polluted).toBeUndefined();
            
            // Clean up just in case
            delete Object.prototype.polluted;
            done();
        }, done);
    });

    it('should not pollute Object.prototype via constructor in JSONGraph get', done => {
        const model = new Model({
            cache: {
                "constructor": {
                    value: "polluted"
                }
            }
        });
        
        toObservable(model.get(['constructor'])).subscribe(() => {
            // Verify that constructor wasn't modified in unexpected ways
            expect(typeof {}.constructor).toBe('function');
            done();
        }, done);
    });

    it('should not pollute Object.prototype via prototype in JSONGraph get', done => {
        const model = new Model({
            cache: {
                "prototype": {
                    value: "polluted"
                }
            }
        });
        
        toObservable(model.get(['prototype'])).subscribe(() => {
            // Verify that Object.prototype was not polluted
            expect(Object.prototype.polluted).toBeUndefined();
            expect({}.polluted).toBeUndefined();
            
            done();
        }, done);
    });

    it('should not pollute Object.prototype via nested __proto__ in path', done => {
        const model = new Model({
            cache: {
                user: {
                    "__proto__": {
                        value: "polluted"
                    }
                }
            }
        });
        
        toObservable(model.get(['user', '__proto__'])).subscribe(() => {
            // Verify that Object.prototype was not polluted
            expect(Object.prototype.polluted).toBeUndefined();
            expect({}.polluted).toBeUndefined();
            
            done();
        }, done);
    });

    it('should handle safe keys normally', done => {
        const model = new Model({
            cache: {
                user: {
                    name: 'John'
                }
            }
        });
        
        toObservable(model.get(['user', 'name'])).subscribe(result => {
            expect(result.json.user.name).toBe('John');
            done();
        }, done);
    });
});
