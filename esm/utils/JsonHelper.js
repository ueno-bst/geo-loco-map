import { isNull, isUndefined } from "./Types";
const is_undefined = isUndefined, is_null = isNull;
export class JsonHelper {
    constructor(data) {
        this.data = data;
    }
    static as(value, def, nullable = false) {
        if (is_undefined(value)) {
            return nullable ? undefined : def;
        }
        return value;
    }
    static asNum(value, def, nullable = false) {
        const val = JsonHelper.as(value, def, nullable);
        return is_undefined(val) ? val : Number(val);
    }
    static asStr(value, def, nullable = false) {
        const val = JsonHelper.as(value, def, nullable);
        return is_undefined(val) ? val : String(val);
    }
    static asBool(value, def, nullable = false) {
        const val = JsonHelper.as(value, def, nullable);
        return is_undefined(val) ? val : Boolean(val);
    }
    static asEnum(list, value, def, nullable = false) {
        const val = JsonHelper.as(value, def, nullable);
        if (is_undefined(val)) {
            return val;
        }
        let exists = Object.keys(list).filter(k => isNaN(Number(k))).filter(k => list[k] === value).length > 0;
        return exists ? val : nullable ? undefined : def;
    }
    get(key, def, nullable = false) {
        return JsonHelper.as(this.data[key], def, nullable);
    }
    number(key, def, nullable = false) {
        return JsonHelper.asNum(this.data[key], def, nullable);
    }
    string(key, def, nullable = false) {
        return JsonHelper.asStr(this.data[key], def, nullable);
    }
    boolean(key, def, nullable = false) {
        return JsonHelper.asBool(this.data[key], def, nullable);
    }
    enum(list, key, def, nullable = false) {
        return JsonHelper.asEnum(list, this.data[key], def, nullable);
    }
}
//# sourceMappingURL=JsonHelper.js.map