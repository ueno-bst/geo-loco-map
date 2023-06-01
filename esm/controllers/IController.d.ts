import { Config, IConfig } from "./Config";
import { MapController } from "./MapController";
import { ILatLng, ILatLngBounds } from "../entities/LatLng";
import { IMarkerData } from "../entities/Response";
import { MapEventMap } from "./MapEventType";
export default abstract class IController {
    config: Config;
    protected readonly controller: MapController<Object>;
    protected constructor(params: IConfig);
    abstract request(): void;
    abstract getElement(): Element;
    abstract getBounds(): ILatLngBounds | null;
    abstract getZoom(): number;
    abstract setZoom(zoom: number): void;
    abstract getCenter(): ILatLng;
    abstract setCenter(lat: number, lng: number): void;
    abstract addMarker(marker: IMarkerData): void;
    abstract hasMarker(id: string): boolean;
    abstract getMarker(id: string): IMarkerData | null;
    abstract removeMarker(...ids: string[]): number;
    abstract getViewInMarkers(limit: number): IMarkerData[];
    abstract getUI(): boolean;
    abstract setUI(flag: boolean): void;
    abstract getInfo(): boolean;
    abstract setInfo(flag: boolean): void;
    on<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this;
    off<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this;
}
//# sourceMappingURL=IController.d.ts.map