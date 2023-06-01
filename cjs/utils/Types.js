"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isExist = exports.isInstanceOf = exports.isArray = exports.isObject = exports.isUndefined = exports.isBoolean = exports.isNull = exports.isFunction = exports.isString = exports.isNumber = void 0;
/**
 * オブジェクトが numberかを検証
 * @param value
 */
function isNumber(value) {
    return typeof value == "number";
}
exports.isNumber = isNumber;
/**
 * オブジェクトが stringかを検証
 * @param value
 */
function isString(value) {
    return typeof value == "string";
}
exports.isString = isString;
/**
 * オブジェクトが functionかを検証
 * @param value
 */
function isFunction(value) {
    return typeof value == "function";
}
exports.isFunction = isFunction;
/**
 * オブジェクトが nullかを検証
 * @param value
 */
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
/**
 * オブジェクトが booleanかを検証
 * @param value
 */
function isBoolean(value) {
    return typeof value == "boolean";
}
exports.isBoolean = isBoolean;
/**
 * オブジェクトが undefinedかを検証
 * @param value
 */
function isUndefined(value) {
    return typeof value == "undefined";
}
exports.isUndefined = isUndefined;
/**
 * オブジェクトが Objectかを検証
 * @param value
 */
function isObject(value) {
    return typeof value == "object";
}
exports.isObject = isObject;
/**
 * オブジェクトが arrayかを検証
 * @param value
 */
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isInstanceOf(value, type) {
    return type && value instanceof type;
}
exports.isInstanceOf = isInstanceOf;
/**
 * オブジェクトが空ではない要素かを検証する
 * @param value
 */
function isExist(value) {
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
exports.isExist = isExist;
//# sourceMappingURL=Types.js.map