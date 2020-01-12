import {isNumber, isArray, isNull, isObject} from "../utils/Types";

export interface IMinMax {
    max: number;
    min: number;

    round(value: number): number;
}

function isMinMax(args: any): args is IMinMax {
    return !isNull(args) && isObject(args) && isNumber(args['min']) && isNumber(args['max']);
}

export class MinMax implements IMinMax {
    max = 0;
    min = 0;

    constructor(min: number, max: number);
    constructor(min: number[]);
    constructor(min: IMinMax);

    constructor(min: number | number[] | IMinMax, max?: number) {
        if (isArray<number>(min)) {
            this.min = min[0];
            this.max = min[1];
        } else if (isMinMax(min)) {
            this.min = min.min;
            this.max = min.max;
        } else if (isNumber(min) && isNumber(max)) {
            this.min = min;
            this.max = max;
        }
    }

    /**
     * 裁定された値を、最小・最大値の範囲に収まるように補正する
     * @param value
     */
    round(value: number): number {
        return Math.min(this.max, Math.max(this.min, value));
    }
}
