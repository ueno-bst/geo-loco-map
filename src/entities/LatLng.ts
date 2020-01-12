import {isNumber, isArray, isInstanceOf, isNull, isObject} from "../utils/Types";

interface IBase {
    gmap(): any;
    yolp(): any;
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

function isIPoint(args: any): args is IPoint {
    return !isNull(args) && isObject(args) && isNumber(args.x) && isNumber(args.y);
}

function isIRectangle(args: any): args is IRectangle {
    return !isNull(args) && isObject(args) && Point.is(args.lt) && Point.is(args.rb);
}

function isILatLng(args: any): args is ILatLng {
    return !isNull(args) && isObject(args) && isNumber(args.lat) && isNumber(args.lng);
}

function isILatLngBounds(args: any): args is ILatLngBounds {
    return !isNull(args) && isObject(args) && LatLng.is(args.ne) && LatLng.is(args.sw);
}

function roundnessCoordinate(value: number, base: number): number {
    return value - Math.round(value / (base * 2)) * (base * 2);
}

export class Point implements IPoint, IBase {
    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number);
    constructor(x: Y.Point);
    constructor(x: google.maps.Point);
    constructor(x: IPoint);
    constructor(x: number[]);

    constructor(x: number | number[] | IPoint | Y.Point | google.maps.Point, y?: number | null) {
        if (Point.is(x)) {
            this.y = x.y;
            this.x = x.x;
        } else if (isNumber(x) && isNumber(y)) {
            this.y = y;
            this.x = x;
        } else if (isArray(x) && x.length > 2) {
            this.y = x[1];
            this.x = x[0];
        }
    }

    static is = (args: any): args is IPoint => isIPoint(args);

    gmap(): google.maps.Point {
        return new google.maps.Point(this.x, this.y);
    }

    yolp(): Y.Point {
        return new Y.Point(this.x, this.y);
    }

    obj(): IPoint {
        return {x: this.x, y: this.y};
    }
}

export class Rectangle implements IRectangle {
    lt: Point;
    rb: Point;

    constructor(lt: IRectangle);
    constructor(lt: google.maps.Point, rb: google.maps.Point);
    constructor(lt: Y.Point, rb: Y.Point);
    constructor(lt: IPoint, rb: IPoint);

    constructor(lt: IRectangle | google.maps.Point | Y.Point | IPoint, rb?: google.maps.Point | Y.Point | IPoint) {
        if (Rectangle.is(lt)) {
            rb = lt.rb;
            lt = lt.lt;
        }

        if (!Point.is(lt) || !Point.is(rb)) {
            throw new Error("The argument format is incorrect");
        }

        this.lt = new Point(Math.min(lt.x, rb.x), Math.min(lt.y, rb.y));
        this.rb = new Point(Math.max(lt.x, rb.x), Math.max(lt.y, rb.y));
    }

    get left(): number {
        return this.lt.x;
    }

    get right(): number {
        return this.rb.x;
    }

    get top(): number {
        return this.lt.y;
    }

    get bottom(): number {
        return this.rb.y;
    }

    get width(): number {
        return this.right - this.left;
    }

    get height(): number {
        return this.bottom - this.top;
    }

    static is = (args: any): args is IRectangle => isIRectangle(args);
}

export class LatLng implements ILatLng, ICoordinate {
    lat = 35;
    lng = 135;

    constructor(lat: number, lng: number);
    constructor(lat: ILatLng);
    constructor(lat: Y.LatLng);
    constructor(lat: google.maps.LatLng);
    constructor(lat: any[]);

    constructor(lat?: number | ILatLng | Y.LatLng | google.maps.LatLng | any[] | null, lng?: number | null) {
        if (isInstanceOf<Y.LatLng>(lat, Y.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        } else if (isInstanceOf<google.maps.LatLng>(lat, google.maps.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        }

        if (isNumber(lat) && isNumber(lng)) {
            this.lat = lat;
            this.lng = lng;
        } else if (LatLng.is(lat)) {
            this.lat = lat.lat;
            this.lng = lat.lng;
        } else if (isArray(lat) && lat.length >= 2) {
            this.lat = Number(lat[0]) || this.lat;
            this.lng = Number(lat[1]) || this.lng;
        }
    }

    /**
     * 2点の値が同一かを検証する
     * @param p
     */
    equals(p: LatLng): boolean {
        return this.lng == p.lng && this.lat == p.lat;
    }

    /**
     * ポイント間の距離を計測する
     * @param p
     */
    distance(p: LatLng): number {
        return Math.sqrt(Math.pow(this.lat - p.lat, 2) + Math.pow(this.lng - p.lng, 2));
    }

    fix(): this {
        this.lat = roundnessCoordinate(this.lat, 90);
        this.lng = roundnessCoordinate(this.lng, 180);
        return this;
    }

    round(base: number, append: boolean = false): this {
        let mod = 360;

        for (let index = 1; index < base; index++) {
            mod /= 2;
        }

        this.lat = this.lat - (this.lat % mod);
        this.lng = this.lng - (this.lng % mod);

        if (append) {
            this.lat += mod;
            this.lng += mod;
        }

        return this.fix();
    }

    gmap(): google.maps.LatLng {
        return new google.maps.LatLng(this.lat, this.lng);
    }

    yolp(): Y.LatLng {
        return new Y.LatLng(this.lat, this.lng);
    }

    obj(): ILatLng {
        return {lat: this.lat, lng: this.lng}
    }

    static is = (args: any): args is ILatLng => isILatLng(args);
}

export class LatLngBounds implements ILatLngBounds, ICoordinate {
    ne: LatLng;
    sw: LatLng;

    constructor(ne: ILatLng, sw: ILatLng)
    constructor(ne: ILatLngBounds);
    constructor(ne: Y.LatLngBounds);
    constructor(ne: google.maps.LatLngBounds);

    constructor(ne: ILatLng | ILatLngBounds | Y.LatLngBounds | google.maps.LatLngBounds, sw?: ILatLng) {
        if (isInstanceOf<Y.LatLngBounds>(ne, Y.LatLngBounds)) {
            sw = new LatLng(ne.sw);
            ne = new LatLng(ne.ne);
        } else if (isInstanceOf<google.maps.LatLngBounds>(ne, google.maps.LatLngBounds)) {
            sw = new LatLng(ne.getSouthWest());
            ne = new LatLng(ne.getNorthEast());
        }

        if (LatLng.is(ne) && LatLng.is(sw)) {
            this.ne = new LatLng(ne);
            this.sw = new LatLng(sw);
        } else if (LatLngBounds.is(ne)) {
            this.ne = new LatLng(ne.ne);
            this.sw = new LatLng(ne.sw);
        } else {
            throw new Error("The argument format is incorrect");
        }

    }

    /**
     * 点が矩形の範囲内にあるか検証する
     * @param p
     */
    inside(p: LatLng): boolean {
        return (this.ne.lat >= p.lat && this.ne.lng >= p.lng) &&
            (this.sw.lat <= p.lat && this.sw.lng <= p.lng);
    }

    /**
     * 点が矩形の範囲外にあるか検証する
     * @param p
     */
    outside(p: LatLng): boolean {
        return !this.inside(p);
    }

    fix(): this {
        this.ne.fix();
        this.sw.fix();
        return this;
    }

    round(base: number): this {
        this.ne.round(base, true);
        this.sw.round(base);
        return this;
    }

    gmap(): google.maps.LatLngBounds {
        return new google.maps.LatLngBounds(this.sw.gmap(), this.ne.gmap());
    }

    yolp(): Y.LatLngBounds {
        return new Y.LatLngBounds(this.sw.yolp(), this.ne.yolp());
    }

    obj(): ILatLngBounds {
        return {ne: this.ne.obj(), sw: this.sw.obj()};
    }

    static is = (args: any): args is ILatLngBounds => isILatLngBounds(args);
}