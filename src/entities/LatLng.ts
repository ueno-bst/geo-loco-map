import {isArray, isNull, isNumber, isObject} from "../utils/Types";

export interface ILatLng {
    lat: number;
    lng: number;
}

function isILatLng(args: any): args is ILatLng {
    return !isNull(args) &&
        isObject(args) &&
        isNumber(args['lat']) &&
        isNumber(args['lng']);
}

export class LatLng implements ILatLng {
    lat = 35;
    lng = 135;

    constructor(latitude: number, longitude: number);
    constructor(latitude: ILatLng);
    constructor(latitude: any[]);

    constructor(latitude?: number | ILatLng | any[] | null, longitude?: number | null) {
        if (isNumber(latitude) && isNumber(longitude)) {
            this.lat = latitude;
            this.lng = longitude;
        } else if (isILatLng(latitude)) {
            this.lat = latitude.lat;
            this.lng = latitude.lng;
        } else if (isArray(latitude) && latitude.length >= 2) {
            this.lat = Number(latitude[0]) || this.lat;
            this.lng = Number(latitude[1]) || this.lng;
        }
    }

    /**
     * ポイント間の距離を計測する
     * @param p
     */
    distance(p: LatLng): number {
        return Math.sqrt(Math.pow(this.lat - p.lat, 2) + Math.pow(this.lng - p.lng, 2));
    }
}

export interface ILatLngBound {
    /**
     * 座標の北東値
     */
    ne: ILatLng;

    /**
     * 座標の南西値
     */
    sw: ILatLng;
}

export class LatLngBound implements ILatLngBound {
    ne: LatLng;
    sw: LatLng;

    constructor(ne: ILatLng, sw: ILatLng) {
        this.ne = new LatLng(ne);
        this.sw = new LatLng(sw);
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
}