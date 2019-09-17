export function isNumber(value: any): value is number {
    return typeof value === "number";
}

export function isString(value: any): value is string {
    return typeof value === "string";
}

export function isFunction(value: any) {
    return typeof value === "function";
}

export function isNull(value: any): value is null {
    return value === null;
}

export function isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
}

export function isObject(value: any): value is Object {
    return typeof value === "object";
}

export function isArray<T extends any>(value: any): value is T[] {
    return Array.isArray(value);
}