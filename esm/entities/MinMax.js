import { isArray, isNull, isNumber, isObject } from "../utils/Types";
function isMinMax(args) {
    return !isNull(args) && isObject(args) && isNumber(args['min']) && isNumber(args['max']);
}
export class MinMax {
    constructor(min, max) {
        this.max = 0;
        this.min = 0;
        if (isArray(min)) {
            this.min = min[0];
            this.max = min[1];
        }
        else if (isMinMax(min)) {
            this.min = min.min;
            this.max = min.max;
        }
        else if (isNumber(min) && isNumber(max)) {
            this.min = min;
            this.max = max;
        }
    }
    /**
     * 裁定された値を、最小・最大値の範囲に収まるように補正する
     * @param value
     */
    round(value) {
        return Math.min(this.max, Math.max(this.min, value));
    }
}
//# sourceMappingURL=MinMax.js.map