import {fixMapConfig, IMapConfig, MapType} from "../entities/MapConfig";
import {IMapController} from "./IMapController";
import {GoogleMapController} from "./GoogleMapController";
import {YahooMapController} from "./YahooMapController";
import {ILatLng} from "../entities/LatLng";
import {IMarkerData} from "../entities/Response";
import {ILatLngBound} from "../entities/LatLngBound";

export abstract class IController {

    protected _config: IMapConfig;

    protected _controller: IMapController;

    constructor(params: IMapConfig) {
        // 実行パラメータを正規化
        this._config = fixMapConfig(params);

        switch (this.config.map_type) {
            case MapType.GoogleMap:
                this._controller = new GoogleMapController(this);
                break;
            case MapType.YahooMap:
                this._controller = new YahooMapController(this);
                break;
            default:
                throw new Error("Unable to initialize due to map type error.");
        }
    }

    get config(): IMapConfig {
        return this._config;
    }

    protected get controller(): IMapController {
        return this._controller;
    }

    public abstract getElement(): Element ;

    public abstract getBounds(): ILatLngBound | null;

    public abstract getZoom(): number;

    public abstract setZoom(zoom: number): void;

    public abstract getCenter(): ILatLng;

    public abstract setCenter(lat: number, lng: number): void;

    public abstract addMarker(marker: IMarkerData): IMarkerData;

    public abstract hasMarker(id: string): boolean;

    public abstract getMarker(id: string): IMarkerData | null;

    public abstract removeMarker(id: string): boolean;

    public abstract getViewInMarkers(limit: number): IMarkerData[];

    public abstract getUI(): boolean;

    public abstract setUI(flag: boolean): void;

    public abstract getInfo(): boolean;

    public abstract setInfo(flag: boolean): void;
}