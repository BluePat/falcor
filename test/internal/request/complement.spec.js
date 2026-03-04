const complement = require("../../../lib/request/complement");
const findPartialIntersections = require("../../../lib/request/complement").__test.findPartialIntersections;

describe("complement", () => {
    it("handles empty path sets", () => {
        expect(complement([], [], {})).toEqual({
            intersection: [],
            optimizedComplement: [],
            requestedComplement: []
        });
    });

    it("returns all paths if no deduping possible", () => {
        const paths = [["videos", 0, "title"]];
        expect(complement(paths, paths, {})).toEqual({
            intersection: [],
            optimizedComplement: paths,
            requestedComplement: paths
        });
    });

    it("returns the complement and intersection consisting of paths that can be partially deduped", () => {
        const partialMatchingPath = ["videos", [0, 1], "title"];
        const paths = [partialMatchingPath];
        const pathTree = { 3: { videos: { 0: { title: null } } } };

        expect(complement(paths, paths, pathTree)).toEqual({
            intersection: [["videos", 0, "title"]],
            optimizedComplement: [["videos", 1, "title"]],
            requestedComplement: [["videos", 1, "title"]]
        });
    });
});

describe("findPartialIntersections", () => {
    let matchingPath;
    let matchingPathTree;

    beforeEach(() => {
        matchingPath = ["lolomo", 123, "summary"];
        matchingPathTree = { lolomo: { 123: { summary: null } } };
    });

    it("returns paths if no deduping was possible", () => {
        const requestedPath = ["videos", 0, "title"];
        const optimizedPath = ["videosById", 1232, "title"];

        expect(findPartialIntersections(requestedPath, optimizedPath, {})).toEqual([
            [],
            [optimizedPath],
            [requestedPath]
        ]);
    });

    it("returns the intersection consisting of paths that can be fully deduped", () => {
        expect(findPartialIntersections(matchingPath, matchingPath, matchingPathTree)).toEqual([
            [matchingPath],
            [],
            []
        ]);
    });

    describe("with optimized paths shorter than requested paths", () => {
        it("returns the complement and intersection consisting of paths than can be partially deduped", () => {
            const partialMatchingRequestedPath = ["lolomo", 123, 0, 0, ["title", "boxart"]];
            const partialMatchingOptimizedPath = ["videosById", 456, ["title", "boxart"]];
            const pathTree = { videosById: { 456: { title: null } } };

            expect(
                findPartialIntersections(partialMatchingRequestedPath, partialMatchingOptimizedPath, pathTree)
            ).toEqual([
                [["lolomo", 123, 0, 0, "title"]],
                [["videosById", 456, "boxart"]],
                [["lolomo", 123, 0, 0, "boxart"]]
            ]);
        });
    });

    describe("with optimized paths longer than requested paths", () => {
        it("returns the complement and intersection consisting of paths than can be partially deduped", () => {
            const partialMatchingRequestedPath = ["videos", 123, ["title", "boxart"]];
            const partialMatchingOptimizedPath = ["some", "weird", "long", "ref", 456, ["title", "boxart"]];
            const pathTree = { some: { weird: { long: { ref: { 456: { title: null } } } } } };

            expect(
                findPartialIntersections(partialMatchingRequestedPath, partialMatchingOptimizedPath, pathTree)
            ).toEqual([
                [["videos", 123, "title"]],
                [["some", "weird", "long", "ref", 456, "boxart"]],
                [["videos", 123, "boxart"]]
            ]);
        });

        it("halts descent into the subtree", () => {
            const requestedPath = ["videos", 123, "title"];
            const optimizedPath = ["some", "weird", "long", "ref", 456, "title"];
            const pathTree = { some: { differentPath: null } };

            expect(findPartialIntersections(requestedPath, optimizedPath, pathTree)).toEqual([
                [],
                [optimizedPath],
                [requestedPath]
            ]);
        });
    });

    describe("prototype pollution prevention", () => {
        it("blocks access to __proto__ in path", () => {
            const requestedPath = ["__proto__", "polluted"];
            const optimizedPath = ["__proto__", "polluted"];
            const pathTree = { __proto__: { polluted: null } };

            // Should not find anything and return complement
            expect(findPartialIntersections(requestedPath, optimizedPath, pathTree)).toEqual([
                [],
                [optimizedPath],
                [requestedPath]
            ]);
        });

        it("blocks access to constructor in path", () => {
            const requestedPath = ["constructor", "prototype"];
            const optimizedPath = ["constructor", "prototype"];
            const pathTree = { constructor: { prototype: null } };

            // Should not find anything and return complement
            expect(findPartialIntersections(requestedPath, optimizedPath, pathTree)).toEqual([
                [],
                [optimizedPath],
                [requestedPath]
            ]);
        });

        it("blocks access to prototype in path", () => {
            const requestedPath = ["prototype", "value"];
            const optimizedPath = ["prototype", "value"];
            const pathTree = { prototype: { value: null } };

            // Should not find anything and return complement
            expect(findPartialIntersections(requestedPath, optimizedPath, pathTree)).toEqual([
                [],
                [optimizedPath],
                [requestedPath]
            ]);
        });

        it("prevents prototype pollution via range keys", () => {
            const requestedPath = ["videos", ["__proto__", "constructor"], "title"];
            const optimizedPath = ["videos", ["__proto__", "constructor"], "title"];
            const pathTree = { videos: { __proto__: { title: null }, constructor: { title: null } } };

            // Should not find any matches for __proto__ or constructor
            expect(findPartialIntersections(requestedPath, optimizedPath, pathTree)).toEqual([
                [],
                [["videos", "__proto__", "title"], ["videos", "constructor", "title"]],
                [["videos", "__proto__", "title"], ["videos", "constructor", "title"]]
            ]);
        });
    });
});
