export declare class JsonHelper {
    private readonly data;
    constructor(data: any);
    static as<T = any>(value: T | undefined, def: T): T;
    static as<T = any>(value: T | undefined, def: T, nullable: boolean): T | undefined;
    static asNum(value: number | undefined, def: number): number;
    static asNum(value: number | undefined, def: number, nullable: boolean): number | undefined;
    static asStr(value: string | undefined, def: string): string;
    static asStr(value: string | undefined, def: string, nullable: boolean): string | undefined;
    static asBool(value: boolean | undefined, def: boolean): boolean;
    static asBool(value: boolean | undefined, def: boolean, nullable: boolean): boolean | undefined;
    static asEnum<T>(list: {
        [key: string]: T;
    }, value: T | undefined, def: T): T;
    static asEnum<T>(list: {
        [key: string]: T;
    }, value: T | undefined, def: T, nullable: boolean): T | undefined;
    get<T = any>(key: string, def: T): T;
    get<T = any>(key: string, def: T, nullable: boolean): T | undefined;
    number(key: string, def: number): number;
    number(key: string, def: number, nullable: boolean): number | undefined;
    string(key: string, def: string): string;
    string(key: string, def: string): string | undefined;
    boolean(key: string, def: boolean): boolean;
    boolean(key: string, def: boolean, nullable: boolean): boolean | undefined;
    enum<T>(list: {
        [key: string]: T;
    }, key: T, def: T): T;
    enum<T>(list: {
        [key: string]: T;
    }, key: T, def: T, nullable: boolean): T | undefined;
}
//# sourceMappingURL=JsonHelper.d.ts.map