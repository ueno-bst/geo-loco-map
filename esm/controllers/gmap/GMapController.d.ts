/// <reference types="googlemaps" />
/// <reference types="googlemaps" />
import { LatLng, LatLngBounds } from "../../entities/LatLng";
import { ILayers, MapController } from "../MapController";
import { MarkerData } from "../../entities/Response";
import IController from "../IController";
export declare class GMapController extends MapController<google.maps.Map, google.maps.Marker> {
    protected readonly map: google.maps.Map;
    protected readonly layers: ILayers;
    constructor(root: IController);
    getBounds(): LatLngBounds | null;
    setBounds(bounds: LatLngBounds): void;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): LatLng;
    setCenter(center: LatLng): void;
    setUI(show: boolean): void;
    /**
     * モーダルを開く
     * @param markers
     */
    protected openModal(markers: MarkerData[]): void;
}
//# sourceMappingURL=GMapController.d.ts.map