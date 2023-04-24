import {Config, IConfig, MapType} from "./Config";
import {MapController} from "./MapController";
import {YMapController} from "./ymap/YMapController";
import {GMapController} from "./gmap/GMapController";
import {ILatLng, ILatLngBounds} from "../entities/LatLng";
import {IMarkerData} from "../entities/Response";
import {MapEventMap} from "./MapEventType";


export default abstract class IController {

    public config: Config;

    protected readonly controller: MapController<Object>;

    protected constructor(params: IConfig) {
        // 実行パラメータを正規化
        this.config = new Config(params);

        switch (this.config.map_type) {
            case MapType.GoogleMap:
                this.controller = new GMapController(this);
                break;
            case MapType.YahooMap:
                this.controller = new YMapController(this);
                break;
            default:
                throw new Error("Unable to initialize due to map type error.");
        }
    }

    public abstract request(): void;

    public abstract getElement(): Element;

    public abstract getBounds(): ILatLngBounds | null;

    public abstract getZoom(): number;

    public abstract setZoom(zoom: number): void;

    public abstract getCenter(): ILatLng;

    public abstract setCenter(lat: number, lng: number): void;

    public abstract addMarker(marker: IMarkerData): void;

    public abstract hasMarker(id: string): boolean;

    public abstract getMarker(id: string): IMarkerData | null;

    public abstract removeMarker(...ids: string[]): number;

    public abstract getViewInMarkers(limit: number): IMarkerData[];

    public abstract getUI(): boolean;

    public abstract setUI(flag: boolean): void;

    public abstract getInfo(): boolean;

    public abstract setInfo(flag: boolean): void;

    public on<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this {
        this.controller.emit.on(event, callback);
        return this;
    }

    public off<K extends keyof MapEventMap>(event: K, callback: MapEventMap[K]): this {
        this.controller.emit.off(event, callback);
        return this;
    }
}
