module.exports = function isSafeKey(key) {
    return key !== "__proto__" && key !== "constructor" && key !== "prototype";
};
