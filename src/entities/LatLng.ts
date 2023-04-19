import {isArray, isInstanceOf, isNull, isNumber, isObject} from "~/utils/Types";
import {init} from "~/entities/Initialize";
import {GeoHash} from "~/entities/GeoHash";

init();

const
    math = Math,
    min = math.min,
    max = math.max,
    pow = math.pow;

const
    is_array = isArray,
    is_null = isNull,
    is_number = isNumber,
    is_object = isObject,
    is_instance_of = isInstanceOf;

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

function isIPoint(args: any): args is IPoint {
    return !is_null(args) && is_object(args) && is_number(args.x) && is_number(args.y);
}

function isIRectangle(args: any): args is IRectangle {
    return !is_null(args) && is_object(args) && Point.is(args.lt) && Point.is(args.rb);
}

function isILatLng(args: any): args is ILatLng {
    return !is_null(args) && is_object(args) && is_number(args.lat) && is_number(args.lng);
}

function isILatLngBounds(args: any): args is ILatLngBounds {
    return !is_null(args) && is_object(args) && LatLng.is(args.ne) && LatLng.is(args.sw);
}

function roundnessCoordinate(value: number, base: number): number {
    return value - math.round(value / (base * 2)) * (base * 2);
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
        } else if (is_number(x) && is_number(y)) {
            this.y = y;
            this.x = x;
        } else if (is_array(x) && x.length > 2) {
            this.y = x[1];
            this.x = x[0];
        }
    }

    static is = (args: any): args is IPoint => isIPoint(args);

    gmap(): google.maps.Point {
        return new google.maps.Point(this.x, this.y);
    }

    ymap(): Y.Point {
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
        const r = Rectangle;
        const p = Point;

        if (r.is(lt)) {
            rb = lt.rb;
            lt = lt.lt;
        }

        if (!p.is(lt) || !p.is(rb)) {
            throw new Error("The argument format is incorrect");
        }

        this.lt = new p(min(lt.x, rb.x), min(lt.y, rb.y));
        this.rb = new p(max(lt.x, rb.x), max(lt.y, rb.y));
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
        const t = this;
        return t.right - t.left;
    }

    get height(): number {
        const t = this;
        return t.bottom - t.top;
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
    constructor(lat: number[]);

    constructor(lat?: number | ILatLng | Y.LatLng | google.maps.LatLng | any[] | null, lng?: number | null) {
        const t = this;
        if (is_instance_of<Y.LatLng>(lat, Y.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        } else if (is_instance_of<google.maps.LatLng>(lat, google.maps.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        }

        if (is_number(lat) && is_number(lng)) {
            t.lat = lat;
            t.lng = lng;
        } else if (LatLng.is(lat)) {
            t.lat = lat.lat;
            t.lng = lat.lng;
        } else if (is_array(lat) && lat.length >= 2) {
            t.lat = Number(lat[0]) || t.lat;
            t.lng = Number(lat[1]) || t.lng;
        }
    }

    static fromHash(hash: string): LatLng {
        return GeoHash.decode(hash);
    }

    hash(length: number): string {
        return GeoHash.encode(this, length);
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
        const t = this;
        return math.sqrt(pow(t.lat - p.lat, 2) + pow(t.lng - p.lng, 2));
    }

    fix(): this {
        const t = this;
        t.lat = roundnessCoordinate(t.lat, 90);
        t.lng = roundnessCoordinate(t.lng, 180);
        return t;
    }

    round(base: number, append: boolean = false): this {
        const t = this;
        let mod = 360;

        for (let index = 1; index < base; index++) {
            mod /= 2;
        }

        t.lat = t.lat - (t.lat % mod);
        t.lng = t.lng - (t.lng % mod);

        if (append) {
            t.lat += mod;
            t.lng += mod;
        }

        return t.fix();
    }

    gmap(): google.maps.LatLng {
        return new google.maps.LatLng(this.lat, this.lng);
    }

    ymap(): Y.LatLng {
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
    constructor(ne: ILatLng[]);
    constructor(ne: number[][]);

    constructor(ne: ILatLng | ILatLng[] | number[][] | ILatLngBounds | Y.LatLngBounds | google.maps.LatLngBounds, sw?: ILatLng) {
        const ll = LatLng;

        if (is_array(ne) && ne.length >= 2) {
            sw = is_array<number>(ne[1]) ? new ll(ne[1]) : ne[1];
            ne = is_array<number>(ne[0]) ? new ll(ne[0]) : ne[0];
        }

        if (is_instance_of<Y.LatLngBounds>(ne, Y.LatLngBounds)) {
            sw = new ll(ne.sw);
            ne = new ll(ne.ne);
        } else if (is_instance_of<google.maps.LatLngBounds>(ne, google.maps.LatLngBounds)) {
            sw = new ll(ne.getSouthWest());
            ne = new ll(ne.getNorthEast());
        }

        if (ll.is(ne) && ll.is(sw)) {
            this.sw = new ll(sw);
            this.ne = new ll(ne);
        } else if (LatLngBounds.is(ne)) {
            this.sw = new ll(ne.sw);
            this.ne = new ll(ne.ne);
        } else {
            throw new Error("The argument format is incorrect");
        }

    }

    /**
     * 点が矩形の範囲内にあるか検証する
     * @param p
     */
    inside(p: LatLng): boolean {
        const t = this;

        return (t.ne.lat >= p.lat && t.ne.lng >= p.lng) &&
            (t.sw.lat <= p.lat && t.sw.lng <= p.lng);
    }

    /**
     * 点が矩形の範囲外にあるか検証する
     * @param p
     */
    outside(p: LatLng): boolean {
        return !this.inside(p);
    }

    fix(): this {
        const t = this;

        t.ne.fix();
        t.sw.fix();

        return t;
    }

    round(base: number): this {
        const t = this;

        t.ne.round(base, true);
        t.sw.round(base);

        return t;
    }

    gmap(): google.maps.LatLngBounds {
        const t = this;

        return new google.maps.LatLngBounds(t.sw.gmap(), t.ne.gmap());
    }

    ymap(): Y.LatLngBounds {
        const t = this;

        return new Y.LatLngBounds(t.sw.ymap(), t.ne.ymap());
    }

    obj(): ILatLngBounds {
        const t = this;

        return {ne: t.ne.obj(), sw: t.sw.obj()};
    }

    static is = (args: any): args is ILatLngBounds => isILatLngBounds(args);
}
