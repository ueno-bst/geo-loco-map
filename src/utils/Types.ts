
/**
 * オブジェクトが numberかを検証
 * @param value
 */
export function isNumber(value: any): value is number {
    return typeof value == "number";
}

/**
 * オブジェクトが stringかを検証
 * @param value
 */
export function isString(value: any): value is string {
    return typeof value == "string";
}

/**
 * オブジェクトが functionかを検証
 * @param value
 */
export function isFunction(value: any): value is symbol {
    return typeof value == "function";
}

/**
 * オブジェクトが nullかを検証
 * @param value
 */
export function isNull(value: any): value is null {
    return value === null;
}

/**
 * オブジェクトが booleanかを検証
 * @param value
 */
export function isBoolean(value: any): value is boolean {
    return typeof value == "boolean";
}

/**
 * オブジェクトが undefinedかを検証
 * @param value
 */
export function isUndefined(value: any): value is undefined {
    return typeof value == "undefined";
}

/**
 * オブジェクトが Objectかを検証
 * @param value
 */
export function isObject(value: any): value is Object {
    return typeof value == "object";
}


/**
 * オブジェクトが arrayかを検証
 * @param value
 */
export function isArray<T extends any>(value: any): value is T[] {
    return Array.isArray(value);
}

/**
 * オブジェクトが空ではない要素かを検証する
 * @param value
 */
export function isExist<T>(value: any): value is T {
    // null | undefined は空要素とみなす
    if (isNull(value) || isUndefined(value)) {
        return false;
    }

    // number型の場合 0 | NaN は空要素とみなす
    if (isNumber(value)) {
        return value != 0 && !isNaN(value);
    }

    // string型の場合、空文字は空要素とみなす
    if (isString(value)) {
        return value != "";
    }

    // boolean型の場合、falseは空要素とみなす
    if (isBoolean(value)) {
        return value != false;
    }

    // array型の場合、要素数=0の場合は空要素とみなす
    if (isArray(value)) {
        return value.length != 0;
    }

    // その他はすべて実存要素とみなす
    return true;
}