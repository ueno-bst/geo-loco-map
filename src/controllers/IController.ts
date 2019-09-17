import {IMapConfig, MapConfig, MapType} from "../entities/MapConfig";
import {IMapController} from "./IMapController";
import {GoogleMapController} from "./GoogleMapController";
import {YahooMapController} from "./YahooMapController";

export class IController {

    protected _config: IMapConfig;

    protected _controller: IMapController;

    constructor(params: IMapConfig) {
        // 実行パラメータを正規化
        this._config = new MapConfig(params);

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
}