import {ILatLng, isILatLng, LatLng} from "./LatLng";
import {isNull, isObject} from "../utils/Types";


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

function isILatLngBound(args: any): args is ILatLngBound {
    return !isNull(args) && isObject(args) && isILatLng(args.ne) && isILatLng(args.sw);
}

export class LatLngBound implements ILatLngBound {
    ne: LatLng;
    sw: LatLng;

    constructor(ne: ILatLng, sw: ILatLng)
    constructor(ne: ILatLngBound);

    constructor(ne: ILatLng | ILatLngBound, sw?: ILatLng) {
        if (isILatLng(ne) && isILatLng(sw)) {
            this.ne = new LatLng(ne);
            this.sw = new LatLng(sw);
        } else if (isILatLngBound(ne)) {
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
}