"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinMax = void 0;
const Types_1 = require("../utils/Types");
function isMinMax(args) {
    return !(0, Types_1.isNull)(args) && (0, Types_1.isObject)(args) && (0, Types_1.isNumber)(args['min']) && (0, Types_1.isNumber)(args['max']);
}
class MinMax {
    constructor(min, max) {
        this.max = 0;
        this.min = 0;
        if ((0, Types_1.isArray)(min)) {
            this.min = min[0];
            this.max = min[1];
        }
        else if (isMinMax(min)) {
            this.min = min.min;
            this.max = min.max;
        }
        else if ((0, Types_1.isNumber)(min) && (0, Types_1.isNumber)(max)) {
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
exports.MinMax = MinMax;
//# sourceMappingURL=MinMax.js.map