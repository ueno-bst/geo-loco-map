export interface IMinMax {
    max: number;
    min: number;
    round(value: number): number;
}
export declare class MinMax implements IMinMax {
    max: number;
    min: number;
    constructor(min: number, max: number);
    constructor(min: number[]);
    constructor(min: IMinMax);
    /**
     * 裁定された値を、最小・最大値の範囲に収まるように補正する
     * @param value
     */
    round(value: number): number;
}
//# sourceMappingURL=MinMax.d.ts.map