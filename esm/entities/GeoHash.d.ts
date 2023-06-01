import { ILatLng, LatLng } from "./LatLng";
export declare module GeoHash {
    function encode(coordinate: ILatLng, length?: number): string;
    function decode(hash: string): LatLng;
}
//# sourceMappingURL=GeoHash.d.ts.map