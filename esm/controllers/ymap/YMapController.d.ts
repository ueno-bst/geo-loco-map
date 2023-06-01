/// <reference types="yahoo" />
import { LatLng, LatLngBounds } from "../../entities/LatLng";
import { ILayers, MapController } from "../MapController";
import { MarkerData } from "../../entities/Response";
import IController from "../IController";
export declare class YMapController extends MapController<Y.Map, Y.Marker> {
    /**
     * 地図オブジェクト
     */
    protected readonly map: Y.Map;
    protected readonly layers: ILayers;
    /**
     * Yahoo Map の表示するコントローラーリスト
     */
    private yc;
    private parentCentre?;
    constructor(root: IController);
    protected init(): void;
    getBounds(): LatLngBounds | null;
    setBounds(bounds: LatLngBounds): void;
    getZoom(): number;
    setZoom(number: number): void;
    getCenter(): LatLng;
    setCenter(coordinate: LatLng): void;
    setUI(show: boolean): void;
    protected openModal(markers: MarkerData[]): void;
}
//# sourceMappingURL=YMapController.d.ts.map