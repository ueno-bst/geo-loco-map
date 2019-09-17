import {ILatLng, LatLng} from "./LatLng";
import {IMarkerData} from "./Response";
import {IController} from "../controllers/IController";

export enum MapType {
    GoogleMap = "google",
    YahooMap = "yahoo"
}

export interface IMapConfig {
    /**
     *　表示する地図のタイプを指定する
     */
    map_type: MapType;

    /**
     * 地図の初期表示する中心点を指定
     */
    center: ILatLng;

    /**
     * 地図の初期表示状態のズーム率を指定
     */
    zoom: number;

    /**
     *　表示対象のHTMLエレメントを指定
     */
    selector: string;

    /**
     * 地図の表示用コントローラーを表示する
     */
    show_ui: boolean;

    /**
     * クリックした際に、地図上にインフォメーションバルーンを表示する
     */
    show_info: boolean;

    /**
     * マーカーを取得するためのAPIのURL
     */
    api_url: string;

    grid: number;
    lazy_load: number;


    /**
     * マップの初期化・サイズ変更時のイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     */
    onInit?: (ctrl: IController) => void;

    /**
     * ズーム率変更時のイベントリスナー
     * @param zoom
     * @param ctrl マップコントローラーオブジェクト
     */
    onZoom?: (zoom: number, ctrl: IController) => void;

    /**
     * マップ移動時のイベントリスナー
     * @param coordinate
     * @param ctrl マップコントローラーオブジェクト
     */
    onMove?: (coordinate: ILatLng, ctrl: IController) => void;

    /**
     * マップコントローラー表示時のイベントリストナー
     * @param flag
     * @param ctrl マップコントローラーオブジェクト
     */
    onUI?: (flag: boolean, ctrl: IController) => void;

    /**
     * マップのパラメータが変更された際に実行されるイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     */
    onChange?: (ctrl: IController) => void;

    /**
     *
     */
    onShowMarker?: (marker: IMarkerData, ctrl: IController) => void;
    onHideMarker?: (marker: IMarkerData, ctrl: IController) => void;

    /**
     * マーカーがクリックされた際に実行されるイベントリスナー
     * @param marker クリックされたマーカーのデータ
     * @param ctrl マップコントローラーオブジェクト
     */
    onClickMarker?: (marker: IMarkerData, ctrl: IController) => void;
}

export class MapConfig implements IMapConfig {
    show_ui = true;

    /**
     * クリックした際に、地図上にインフォメーションバルーンを表示する
     */
    show_info = true;

    /**
     *
     */
    center = new LatLng(35.681236, 139.767125);

    grid = 5;
    lazy_load = 500;
    map_type = MapType.GoogleMap;
    selector = "#map";
    zoom = 13;

    api_url = "";

    /**
     * マップの初期化・サイズ変更時のイベントリスナー
     */
    onInit?: (ctrl: IController) => void;
    onZoom?: (zoom: number, ctrl: IController) => void;
    onMove?: (coordinate: ILatLng, ctrl: IController) => void;
    onChange?: (ctrl: IController) => void;
    onUI?: (flag: boolean, ctrl: IController) => void;
    onClickMarker?: (marker: IMarkerData, ctrl: IController) => void;

    constructor(params: any) {

        const p: MapConfig = {...this, ...params};

        this.show_ui = Boolean(p.show_ui);
        this.show_info = Boolean(p.show_info);
        this.grid = Number(p.grid);
        this.center = new LatLng(p.center);
        this.lazy_load = Number(p.lazy_load);

        const map_type = String(p.map_type);

        switch (map_type) {
            case MapType.GoogleMap:
                this.map_type = MapType.GoogleMap;
                break;
            case MapType.YahooMap:
                this.map_type = MapType.YahooMap;
                break;
        }

        this.selector = String(p.selector);
        this.api_url = String(p.api_url);

        this.onInit = p.onInit;
        this.onZoom = p.onZoom;
        this.onMove = p.onMove;
        this.onChange = p.onChange;
        this.onUI = p.onUI;
        this.onClickMarker = p.onClickMarker;
    }
}