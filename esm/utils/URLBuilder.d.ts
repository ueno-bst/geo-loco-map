type QueryValue = string | undefined;
type QueryValueList = QueryValue[];
export declare class URLBuilder {
    scheme: string;
    user: string;
    password: string;
    host: string;
    port: string;
    path: string;
    query: QueryBuilder;
    hash: string;
    constructor(url: string);
    build(): string;
}
declare class QueryBuilder {
    private query;
    constructor(query: string);
    build(): string;
    get keys(): string[];
    get length(): number;
    indexOf(key: string): number;
    has(key: string): boolean;
    single(key: string): QueryValue | null;
    get(key: string): QueryValueList | null;
    getByIndex(index: number): QueryValueList | null;
    set(key: string, ...value: QueryValueList): this;
    add(key: string, ...value: QueryValueList): this;
    drop(key: string): boolean;
    clear(): void;
}
export {};
//# sourceMappingURL=URLBuilder.d.ts.map