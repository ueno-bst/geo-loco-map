import {isNull, isUndefined, isString} from "./Types";

const
    is_null = isNull;

interface QueryObject {
    key: string,
    value: QueryValueList,
}

type QueryValue = string | undefined;
type QueryValueList = QueryValue[]
type QueryObjectList = QueryObject[];

function decode(value: string): string {
    return decodeURIComponent(value);
}

function encode(value: string): string {
    return encodeURIComponent(value);
}

function parseURL(obj: URLBuilder, url: string): void {
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

function parseQuery(obj: QueryBuilder, query: string): QueryBuilder {
    const queries = query.split("&");

    queries.forEach((value: string, index: number) => {
        if (value.length == 0) {
            return;
        }

        const param = value.match(/^(.*?)(?:=(.*))$/);

        if (param) {
            obj.add(decode(param[1]), decode(param[2]));
        } else {
            obj.add(decode(value), undefined);
        }
    });

    return obj;
}

function buildURL(obj: URLBuilder): string {
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

function buildQuery(obj: QueryBuilder): string {
    const args: string[] = [];

    obj.keys.forEach((key) => {
        const values = obj.get(key);

        if (is_null(values)) {
            return;
        }

        for (let value of values) {
            if (isUndefined(value)) {
                args.push(encode(key));
            } else {
                args.push(encode(key) + "=" + encode(value));
            }
        }
    });

    return args.join("&");
}

export class URLBuilder {
    public scheme: string = "";
    public user: string = "";
    public password: string = "";
    public host: string = "";
    public port: string = "";
    public path: string = "";
    public query!: QueryBuilder;
    public hash: string = "";

    constructor(url: string) {
        parseURL(this, url);
    }

    build(): string {
        return buildURL(this);
    }
}

class QueryBuilder {
    private query: QueryObjectList = [];

    constructor(query: string = "") {
        parseQuery(this, query);
    }

    build(): string {
        return buildQuery(this);
    }

    get keys(): string[] {
        const keys: string[] = [];

        this.query.forEach((v) => {
            keys.push(v.key);
        });

        return keys;
    }

    get length(): number {
        return this.query.length;
    }

    indexOf(key: string): number {
        return this.keys.indexOf(key);
    }

    has(key: string): boolean {
        return this.indexOf(key) >= 0;
    }

    single(key: string): QueryValue | null {
        const value = this.get(key);

        if (is_null(value) || value.length == 0) {
            return null;
        }

        return value[0];
    }

    get(key: string): QueryValueList | null {
        return this.getByIndex(this.indexOf(key));
    }

    getByIndex(index: number): QueryValueList | null {
        if (this.query[index]) {
            return this.query[index].value;
        }

        return null;
    }

    set(key: string, ...value: QueryValueList): this {
        const index = this.indexOf(key);

        if (index < 0) {
            this.query.push({key: key, value: value});
        } else {
            this.query[index] = {key: key, value: value};
        }

        return this;
    }

    add(key: string, ...value: QueryValueList): this {
        const index = this.indexOf(key);

        if (index < 0) {
            this.query.push({key: key, value: value});
        } else {
            value.forEach((v) => {
                this.query[index].value.push(v);
            });
        }

        return this;
    }

    drop(key: string): boolean {
        const length = this.length;
        this.query = this.query.filter((value) => {
            return key != value.key;
        });

        return length != this.length;
    }

    /**
     *
     * @param queries
     * @param replace
     */
    merge(queries: string | QueryBuilder, replace: boolean = false): this {
        if (isString(queries)) {
            queries = new QueryBuilder(queries);
        }

        const keys = queries.keys;

        for (let index = 0; index < keys.length; index++) {
            const
                key = keys[index],
                values = queries.get(key);

            if (values === null) {
                if (replace) {
                    this.drop(key);
                }
            } else {
                if (replace) {
                    this.set(key, ...values);
                } else {
                    this.add(key, ...values);
                }
            }
        }

        return this;
    }

    clear(): void {
        this.query = [];
    }
}