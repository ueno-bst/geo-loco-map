/**
 * オブジェクトが numberかを検証
 * @param value
 */
export function isNumber(value) {
    return typeof value == "number";
}
/**
 * オブジェクトが stringかを検証
 * @param value
 */
export function isString(value) {
    return typeof value == "string";
}
/**
 * オブジェクトが functionかを検証
 * @param value
 */
export function isFunction(value) {
    return typeof value == "function";
}
/**
 * オブジェクトが nullかを検証
 * @param value
 */
export function isNull(value) {
    return value === null;
}
/**
 * オブジェクトが booleanかを検証
 * @param value
 */
export function isBoolean(value) {
    return typeof value == "boolean";
}
/**
 * オブジェクトが undefinedかを検証
 * @param value
 */
export function isUndefined(value) {
    return typeof value == "undefined";
}
/**
 * オブジェクトが Objectかを検証
 * @param value
 */
export function isObject(value) {
    return typeof value == "object";
}
/**
 * オブジェクトが arrayかを検証
 * @param value
 */
export function isArray(value) {
    return Array.isArray(value);
}
export function isInstanceOf(value, type) {
    return type && value instanceof type;
}
/**
 * オブジェクトが空ではない要素かを検証する
 * @param value
 */
export function isExist(value) {
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
//# sourceMappingURL=Types.js.map