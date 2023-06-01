import { isArray, isInstanceOf, isNull, isNumber, isObject } from "../utils/Types";
import { init } from "./Initialize";
import { GeoHash } from "./GeoHash";
init();
const math = Math, min = math.min, max = math.max, pow = math.pow;
const is_array = isArray, is_null = isNull, is_number = isNumber, is_object = isObject, is_instance_of = isInstanceOf;
function isIPoint(args) {
    return !is_null(args) && is_object(args) && is_number(args.x) && is_number(args.y);
}
function isIRectangle(args) {
    return !is_null(args) && is_object(args) && Point.is(args.lt) && Point.is(args.rb);
}
function isILatLng(args) {
    return !is_null(args) && is_object(args) && is_number(args.lat) && is_number(args.lng);
}
function isILatLngBounds(args) {
    return !is_null(args) && is_object(args) && LatLng.is(args.ne) && LatLng.is(args.sw);
}
function roundnessCoordinate(value, base) {
    return value - math.round(value / (base * 2)) * (base * 2);
}
export class Point {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (Point.is(x)) {
            this.y = x.y;
            this.x = x.x;
        }
        else if (is_number(x) && is_number(y)) {
            this.y = y;
            this.x = x;
        }
        else if (is_array(x) && x.length > 2) {
            this.y = x[1];
            this.x = x[0];
        }
    }
    gmap() {
        return new google.maps.Point(this.x, this.y);
    }
    ymap() {
        return new Y.Point(this.x, this.y);
    }
    obj() {
        return { x: this.x, y: this.y };
    }
}
Point.is = (args) => isIPoint(args);
export class Rectangle {
    constructor(lt, rb) {
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
    get left() {
        return this.lt.x;
    }
    get right() {
        return this.rb.x;
    }
    get top() {
        return this.lt.y;
    }
    get bottom() {
        return this.rb.y;
    }
    get width() {
        const t = this;
        return t.right - t.left;
    }
    get height() {
        const t = this;
        return t.bottom - t.top;
    }
}
Rectangle.is = (args) => isIRectangle(args);
export class LatLng {
    constructor(lat, lng) {
        this.lat = 35;
        this.lng = 135;
        const t = this;
        if (is_instance_of(lat, Y.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        }
        else if (is_instance_of(lat, google.maps.LatLng)) {
            lng = lat.lng();
            lat = lat.lat();
        }
        if (is_number(lat) && is_number(lng)) {
            t.lat = lat;
            t.lng = lng;
        }
        else if (LatLng.is(lat)) {
            t.lat = lat.lat;
            t.lng = lat.lng;
        }
        else if (is_array(lat) && lat.length >= 2) {
            t.lat = Number(lat[0]) || t.lat;
            t.lng = Number(lat[1]) || t.lng;
        }
    }
    static fromHash(hash) {
        return GeoHash.decode(hash);
    }
    hash(length) {
        return GeoHash.encode(this, length);
    }
    /**
     * 2点の値が同一かを検証する
     * @param p
     */
    equals(p) {
        return this.lng == p.lng && this.lat == p.lat;
    }
    /**
     * ポイント間の距離を計測する
     * @param p
     */
    distance(p) {
        const t = this;
        return math.sqrt(pow(t.lat - p.lat, 2) + pow(t.lng - p.lng, 2));
    }
    fix() {
        const t = this;
        t.lat = roundnessCoordinate(t.lat, 90);
        t.lng = roundnessCoordinate(t.lng, 180);
        return t;
    }
    round(base, append = false) {
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
    gmap() {
        return new google.maps.LatLng(this.lat, this.lng);
    }
    ymap() {
        return new Y.LatLng(this.lat, this.lng);
    }
    obj() {
        return { lat: this.lat, lng: this.lng };
    }
}
LatLng.is = (args) => isILatLng(args);
export class LatLngBounds {
    constructor(ne, sw) {
        const ll = LatLng;
        if (is_array(ne) && ne.length >= 2) {
            sw = is_array(ne[1]) ? new ll(ne[1]) : ne[1];
            ne = is_array(ne[0]) ? new ll(ne[0]) : ne[0];
        }
        if (is_instance_of(ne, Y.LatLngBounds)) {
            sw = new ll(ne.sw);
            ne = new ll(ne.ne);
        }
        else if (is_instance_of(ne, google.maps.LatLngBounds)) {
            sw = new ll(ne.getSouthWest());
            ne = new ll(ne.getNorthEast());
        }
        if (ll.is(ne) && ll.is(sw)) {
            this.sw = new ll(sw);
            this.ne = new ll(ne);
        }
        else if (LatLngBounds.is(ne)) {
            this.sw = new ll(ne.sw);
            this.ne = new ll(ne.ne);
        }
        else {
            throw new Error("The argument format is incorrect");
        }
    }
    /**
     * 点|矩形が矩形の範囲内にあるか検証する
     * @param p
     */
    inside(p) {
        const t = this;
        if (p instanceof LatLng) {
            return (t.ne.lat >= p.lat && t.ne.lng >= p.lng) &&
                (t.sw.lat <= p.lat && t.sw.lng <= p.lng);
        }
        return this.inside(p.ne) && this.inside(p.sw);
    }
    /**
     * 点|矩形が矩形の範囲外にあるか検証する
     * @param p
     */
    outside(p) {
        return !this.inside(p);
    }
    fix() {
        const t = this;
        t.ne.fix();
        t.sw.fix();
        return t;
    }
    round(base) {
        const t = this;
        t.ne.round(base, true);
        t.sw.round(base);
        return t;
    }
    gmap() {
        const t = this;
        return new google.maps.LatLngBounds(t.sw.gmap(), t.ne.gmap());
    }
    ymap() {
        const t = this;
        return new Y.LatLngBounds(t.sw.ymap(), t.ne.ymap());
    }
    obj() {
        const t = this;
        return { ne: t.ne.obj(), sw: t.sw.obj() };
    }
}
LatLngBounds.is = (args) => isILatLngBounds(args);
//# sourceMappingURL=LatLng.js.map