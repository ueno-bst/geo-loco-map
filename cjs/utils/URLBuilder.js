"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLBuilder = void 0;
const Types_1 = require("./Types");
const is_null = Types_1.isNull;
function decode(value) {
    return decodeURIComponent(value);
}
function encode(value) {
    return encodeURIComponent(value);
}
function parseURL(obj, url) {
    const pattern = url.match(/^(?:(\w.+?):)?(?:\/\/(?:(.+?)(?::(.+?))?@)?([^\/:]+)(?::([0-9]+))?\/?)?([^?#]*?)?(?:\?(.*?))?(?:#(.*?))?$/);
    if (!is_null(pattern)) {
        obj.scheme = pattern[1] || "";
        obj.user = pattern[2] || "";
        obj.password = pattern[3] || "";
        obj.host = pattern[4] || "";
        obj.port = pattern[5] || "";
        obj.path = pattern[6] || "";
        obj.query = new QueryBuilder(pattern[7] || "");
        obj.hash = pattern[8] || "";
    }
}
function parseQuery(obj, query) {
    const queries = query.split("&");
    queries.forEach((value, index) => {
        if (value.length == 0) {
            return;
        }
        const param = value.match(/^(.*?)(?:=(.*))$/);
        if (param) {
            obj.add(decode(param[1]), decode(param[2]));
        }
        else {
            obj.add(decode(value), undefined);
        }
    });
    return obj;
}
function buildURL(obj) {
    let url = "";
    if (obj.scheme != "") {
        url += obj.scheme + ":";
    }
    if (obj.host != "") {
        url += "//";
        if (obj.user != "") {
            url += obj.user;
            if (obj.password != "") {
                url += ":" + obj.password;
            }
            url += "@";
        }
        url += obj.host;
        if (obj.port != "") {
            url += ":" + obj.port;
        }
        url += "/";
    }
    if (obj.path != "") {
        url += obj.path;
    }
    if (obj.query.length > 0) {
        url += "?" + obj.query.build();
    }
    if (obj.hash) {
        url += "#" + encode(obj.hash);
    }
    return url;
}
function buildQuery(obj) {
    const args = [];
    obj.keys.forEach((key) => {
        const values = obj.get(key);
        if (is_null(values)) {
            return;
        }
        for (let value of values) {
            if ((0, Types_1.isUndefined)(value)) {
                args.push(encode(key));
            }
            else {
                args.push(encode(key) + "=" + encode(value));
            }
        }
    });
    return args.join("&");
}
class URLBuilder {
    constructor(url) {
        this.scheme = "";
        this.user = "";
        this.password = "";
        this.host = "";
        this.port = "";
        this.path = "";
        this.hash = "";
        parseURL(this, url);
    }
    build() {
        return buildURL(this);
    }
}
exports.URLBuilder = URLBuilder;
class QueryBuilder {
    constructor(query) {
        this.query = [];
        parseQuery(this, query);
    }
    build() {
        return buildQuery(this);
    }
    get keys() {
        const keys = [];
        this.query.forEach((v) => {
            keys.push(v.key);
        });
        return keys;
    }
    get length() {
        return this.query.length;
    }
    indexOf(key) {
        return this.keys.indexOf(key);
    }
    has(key) {
        return this.indexOf(key) >= 0;
    }
    single(key) {
        const value = this.get(key);
        if (is_null(value) || value.length == 0) {
            return null;
        }
        return value[0];
    }
    get(key) {
        return this.getByIndex(this.indexOf(key));
    }
    getByIndex(index) {
        if (this.query[index]) {
            return this.query[index].value;
        }
        return null;
    }
    set(key, ...value) {
        const index = this.indexOf(key);
        if (index < 0) {
            this.query.push({ key: key, value: value });
        }
        else {
            this.query[index] = { key: key, value: value };
        }
        return this;
    }
    add(key, ...value) {
        const index = this.indexOf(key);
        if (index < 0) {
            this.query.push({ key: key, value: value });
        }
        else {
            value.forEach((v) => {
                this.query[index].value.push(v);
            });
        }
        return this;
    }
    drop(key) {
        const length = this.length;
        this.query = this.query.filter((value) => {
            return key != value.key;
        });
        return length != this.length;
    }
    clear() {
        this.query = [];
    }
}
//# sourceMappingURL=URLBuilder.js.map