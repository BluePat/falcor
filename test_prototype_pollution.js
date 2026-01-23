// Test to verify prototype pollution is prevented
var falcor = require('./lib/Model');
var Model = falcor.Model;

// Test 1: Try to pollute via __proto__
console.log("Test 1: Attempting prototype pollution via __proto__");
var model1 = new Model({
    cache: {
        "__proto__": {
            polluted: "yes"
        }
    }
});

// Check if Object.prototype was polluted
var testObj1 = {};
console.log("testObj1.polluted:", testObj1.polluted); // Should be undefined
console.log("Test 1:", testObj1.polluted === undefined ? "PASS" : "FAIL");

// Test 2: Try to get a value with __proto__ in the path
console.log("\nTest 2: Getting value with __proto__ in path");
var model2 = new Model({
    cache: {
        normal: {
            "__proto__": {
                value: "bad"
            }
        }
    }
});

try {
    var result = model2.get(["normal", "__proto__", "value"]);
    console.log("Result:", JSON.stringify(result, null, 2));
} catch (e) {
    console.log("Error:", e.message);
}

var testObj2 = {};
console.log("testObj2.value:", testObj2.value); // Should be undefined
console.log("Test 2:", testObj2.value === undefined ? "PASS" : "FAIL");

// Test 3: Try constructor pollution
console.log("\nTest 3: Attempting prototype pollution via constructor");
var model3 = new Model({
    cache: {
        constructor: {
            prototype: {
                polluted: "yes"
            }
        }
    }
});

var testObj3 = {};
console.log("testObj3.polluted:", testObj3.polluted); // Should be undefined
console.log("Test 3:", testObj3.polluted === undefined ? "PASS" : "FAIL");

// Test 4: Normal operation should still work
console.log("\nTest 4: Normal operation");
var model4 = new Model({
    cache: {
        user: {
            name: "John"
        }
    }
});

model4.get(["user", "name"]).subscribe(function(result) {
    console.log("Result:", JSON.stringify(result, null, 2));
    console.log("Test 4:", result.json.user.name === "John" ? "PASS" : "FAIL");
});

console.log("\nAll tests completed!");
