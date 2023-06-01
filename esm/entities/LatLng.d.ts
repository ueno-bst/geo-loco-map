/// <reference types="yahoo" />
/// <reference types="googlemaps" />
interface IBase {
    gmap(): any;
    ymap(): any;
    obj(): any;
}
interface ICoordinate extends IBase {
    fix(): this;
    round(base: number): this;
}
export interface IPoint {
    /**
     * ポイント座標の横軸
     */
    x: number;
    /**
     * ポイント座標系の縦軸
     */
    y: number;
}
export interface IRectangle {
    /**
     *
     */
    lt: IPoint;
    /**
     * 矩形の右下座標
     */
    rb: IPoint;
}
export interface ILatLng {
    /**
     * 座標の緯度
     */
    lat: number;
    /**
     * 座標の経度
     */
    lng: number;
}
export interface ILatLngBounds {
    /**
     * 座標の北東値
     */
    ne: ILatLng;
    /**
     * 座標の南西値
     */
    sw: ILatLng;
}
export declare class Point implements IPoint, IBase {
    x: number;
    y: number;
    constructor(x: number, y: number);
    constructor(x: Y.Point);
    constructor(x: google.maps.Point);
    constructor(x: IPoint);
    constructor(x: number[]);
    static is: (args: any) => args is IPoint;
    gmap(): google.maps.Point;
    ymap(): Y.Point;
    obj(): IPoint;
}
export declare class Rectangle implements IRectangle {
    lt: Point;
    rb: Point;
    constructor(lt: IRectangle);
    constructor(lt: google.maps.Point, rb: google.maps.Point);
    constructor(lt: Y.Point, rb: Y.Point);
    constructor(lt: IPoint, rb: IPoint);
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get width(): number;
    get height(): number;
    static is: (args: any) => args is IRectangle;
}
export declare class LatLng implements ILatLng, ICoordinate {
    lat: number;
    lng: number;
    constructor(lat: number, lng: number);
    constructor(lat: ILatLng);
    constructor(lat: Y.LatLng);
    constructor(lat: google.maps.LatLng);
    constructor(lat: number[]);
    static fromHash(hash: string): LatLng;
    hash(length: number): string;
    /**
     * 2点の値が同一かを検証する
     * @param p
     */
    equals(p: LatLng): boolean;
    /**
     * ポイント間の距離を計測する
     * @param p
     */
    distance(p: LatLng): number;
    fix(): this;
    round(base: number, append?: boolean): this;
    gmap(): google.maps.LatLng;
    ymap(): Y.LatLng;
    obj(): ILatLng;
    static is: (args: any) => args is ILatLng;
}
export declare class LatLngBounds implements ILatLngBounds, ICoordinate {
    ne: LatLng;
    sw: LatLng;
    constructor(ne: ILatLng, sw: ILatLng);
    constructor(ne: ILatLngBounds);
    constructor(ne: Y.LatLngBounds);
    constructor(ne: google.maps.LatLngBounds);
    constructor(ne: ILatLng[]);
    constructor(ne: number[][]);
    /**
     * 点|矩形が矩形の範囲内にあるか検証する
     * @param p
     */
    inside(p: LatLng | LatLngBounds): boolean;
    /**
     * 点|矩形が矩形の範囲外にあるか検証する
     * @param p
     */
    outside(p: LatLng | LatLngBounds): boolean;
    fix(): this;
    round(base: number): this;
    gmap(): google.maps.LatLngBounds;
    ymap(): Y.LatLngBounds;
    obj(): ILatLngBounds;
    static is: (args: any) => args is ILatLngBounds;
}
export {};
//# sourceMappingURL=LatLng.d.ts.map