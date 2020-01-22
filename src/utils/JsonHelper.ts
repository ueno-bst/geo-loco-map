import {isNull, isUndefined} from "./Types";

const
    is_undefined = isUndefined,
    is_null = isNull;

export class JsonHelper {
    private readonly data: any;

    constructor(data: any) {
        this.data = data;
    }

    static as<T = any>(value: T | undefined, def: T): T;
    static as<T = any>(value: T | undefined, def: T, nullable: boolean): T | undefined;
    static as<T = any>(value: T | undefined, def: T, nullable: boolean = false): T | undefined {
        if (is_undefined(value)) {
            return nullable ? undefined : def;
        }
        return value;
    }

    static asNum(value: number | undefined, def: number): number;
    static asNum(value: number | undefined, def: number, nullable: boolean): number | undefined;
    static asNum(value: number | undefined, def: number, nullable: boolean = false): number | undefined {
        const val = JsonHelper.as<number>(value, def, nullable);
        return is_undefined(val) ? val : Number(val);
    }

    static asStr(value: string | undefined, def: string): string;
    static asStr(value: string | undefined, def: string, nullable: boolean): string | undefined;
    static asStr(value: string | undefined, def: string, nullable: boolean = false): string | undefined {
        const val = JsonHelper.as<string>(value, def, nullable);
        return is_undefined(val) ? val : String(val);
    }

    static asBool(value: boolean | undefined, def: boolean): boolean;
    static asBool(value: boolean | undefined, def: boolean, nullable: boolean): boolean | undefined;
    static asBool(value: boolean | undefined, def: boolean, nullable: boolean = false): boolean | undefined {
        const val = JsonHelper.as<boolean>(value, def, nullable);
        return is_undefined(val) ? val : Boolean(val);
    }

    static asEnum<T>(list: { [key: string]: T }, value: T | undefined, def: T): T;
    static asEnum<T>(list: { [key: string]: T }, value: T | undefined, def: T, nullable: boolean): T | undefined;
    static asEnum<T>(list: { [key: string]: T }, value: T | undefined, def: T, nullable: boolean = false): T | undefined {
        const val = JsonHelper.as<T>(value, def, nullable);

        if (is_undefined(val)) {
            return val;
        }

        let exists = Object.keys(list).filter(k => isNaN(Number(k))).filter(k => list[k] === value).length > 0;

        return exists ? val : nullable ? undefined : def;
    }

    get<T = any>(key: string, def: T): T;
    get<T = any>(key: string, def: T, nullable: boolean): T | undefined;
    get<T = any>(key: string, def: T, nullable: boolean = false): T | undefined {
        return JsonHelper.as<T>(this.data[key], def, nullable);
    }

    number(key: string, def: number): number;
    number(key: string, def: number, nullable: boolean): number | undefined;
    number(key: string, def: number, nullable: boolean = false): number | undefined {
        return JsonHelper.asNum(this.data[key], def, nullable);
    }

    string(key: string, def: string): string;
    string(key: string, def: string): string | undefined
    string(key: string, def: string, nullable: boolean = false): string | undefined {
        return JsonHelper.asStr(this.data[key], def, nullable);
    }

    boolean(key: string, def: boolean): boolean;
    boolean(key: string, def: boolean, nullable: boolean): boolean | undefined;
    boolean(key: string, def: boolean, nullable: boolean = false): boolean | undefined {
        return JsonHelper.asBool(this.data[key], def, nullable);
    }

    enum<T>(list: { [key: string]: T }, key: T, def: T): T;
    enum<T>(list: { [key: string]: T }, key: T, def: T, nullable: boolean): T | undefined;
    enum<T>(list: { [key: string]: T }, key: T, def: T, nullable: boolean = false): any | undefined {
        return JsonHelper.asEnum<T>(list, this.data[key], def, nullable);
    }
}
