import {isArray, isNull, isNumber, isObject} from "../utils/Types";

export interface ILatLng {
    lat: number;
    lng: number;
}

export function isILatLng(args: any): args is ILatLng {
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