import { IMarkerData } from "./entities/Response";
import { ILatLng, ILatLngBounds } from "./entities/LatLng";
import { IConfig } from "./controllers/Config";
import IController from "./controllers/IController";
import { MapEventMap } from "./controllers/MapEventType";
export declare class GeoLocoMap extends IController {
    constructor(config: IConfig);
    request(): void;
    getElement(): Element;
    getBounds(): ILatLngBounds | null;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): ILatLng;
    setCenter(lat: number, lng: number): void;
    addMarker(...markers: IMarkerData[]): void;
    hasMarker(id: string): boolean;
    getMarker(id: string): IMarkerData | null;
    removeMarker(...ids: string[]): number;
    getViewInMarkers(limit?: number): IMarkerData[];
    getUI(): boolean;
    setUI(flag: boolean): void;
    getInfo(): boolean;
    setInfo(flag: boolean): void;
    on<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this;
    off<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this;
}
export default GeoLocoMap;
//# sourceMappingURL=index.d.ts.map