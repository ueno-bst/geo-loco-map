/**
 * オブジェクトが numberかを検証
 * @param value
 */
export declare function isNumber(value: any): value is number;
/**
 * オブジェクトが stringかを検証
 * @param value
 */
export declare function isString(value: any): value is string;
/**
 * オブジェクトが functionかを検証
 * @param value
 */
export declare function isFunction(value: any): value is Function;
/**
 * オブジェクトが nullかを検証
 * @param value
 */
export declare function isNull(value: any): value is null;
/**
 * オブジェクトが booleanかを検証
 * @param value
 */
export declare function isBoolean(value: any): value is boolean;
/**
 * オブジェクトが undefinedかを検証
 * @param value
 */
export declare function isUndefined(value: any): value is undefined;
/**
 * オブジェクトが Objectかを検証
 * @param value
 */
export declare function isObject(value: any): value is Object;
/**
 * オブジェクトが arrayかを検証
 * @param value
 */
export declare function isArray<T extends any>(value: any): value is T[];
export declare function isInstanceOf<T>(value: any, type: any): value is T;
/**
 * オブジェクトが空ではない要素かを検証する
 * @param value
 */
export declare function isExist<T>(value: any): value is T;
//# sourceMappingURL=Types.d.ts.map