import { MapConfig } from '../entities/Maps';
import { ICoordinate } from "../entities/Coordinate";
import { MapController } from "./MapController";
import { IMapController } from "./IMapController";
interface IYahooMap {
    map: Y.Map;
    latlng: Y.LatLng;
    markers: Y.Marker[];
    zoomControl: Y.ZoomControl;
    homeControl: Y.HomeControl;
    layerControl: Y.LayerSetControl;
}
export declare class YahooMapController extends MapController implements IMapController {
    y: IYahooMap;
    response?: any;
    url?: string;
    constructor(config: MapConfig);
    request(id?: number): void;
    getZoom(): number;
    setZoom(number: number): void;
    getCenter(): {
        lat: number;
        lng: number;
    };
    setCenter(coordinate: ICoordinate): void;
    addMarker(coordinate: ICoordinate): boolean;
    marker(res: any, id?: number): void;
    setControl(flag: boolean): void;
    escapeHtml(str: string): string;
    deleteMarker(id: number): void;
    markerConvert(res: any, id?: number): any;
    apiRequest(): void;
}
export {};
//# sourceMappingURL=YahooMapController.d.ts.map