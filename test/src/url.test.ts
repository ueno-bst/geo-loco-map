import {describe, it} from "mocha";
import {assert} from "chai";
import {URLBuilder} from "@tueeeeno/url-builder";

describe("QueryBuilder Test", () => {
    it("Full URL", () => {
        const url = "http://test.com/path?query_args=example#hash";
        const object = new URLBuilder(url);
        assert.equal(object.build(), url);
    });

    it("Domain Only", () => {
        const i = new URLBuilder("test.com");
        assert.equal(i.build(), "test.com");
    });

    it("Domain + Port", () => {
        const url = "test.com:80";
        const object = new URLBuilder(url);
        assert.equal(object.build(), url);
    });

    it("Schema + User + Password + Domain + Port", () => {
        const url = "https://user:password@test.com:4080/";
        const object = new URLBuilder(url);
        assert.equal(object.build(), url);
    });

    it("User + Password + Domain + Port", () => {
        const url = "user:password@test.com:4080";
        const object = new URLBuilder(url);
        assert.equal(object.build(), url);
    });
});

