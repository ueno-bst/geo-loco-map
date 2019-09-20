import {ILatLng, LatLng} from "./LatLng";
import {IMarkerData} from "./Response";
import {IController} from "../controllers/IController";
import {ILatLngBound, LatLngBound} from "./LatLngBound";
import {isUndefined} from "../utils/Types";

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
     * 地図のスクロール範囲を指定したい場合に
     */
    center_bound?: ILatLngBound;

    /**
     * 地図の初期表示状態のズーム率を指定
     */
    zoom: number;

    /**
     * ズーム率の最小比率
     */
    zoom_min: number;

    /**
     * ズーム率の最大比率
     */
    zoom_max: number;

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
     * @param ctrl マップコントローラーオブジェクト
     * @param zoom
     */
    onZoom?: (ctrl: IController, zoom: number) => void;

    /**
     * マップ移動時のイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     * @param coordinate
     */
    onMove?: (ctrl: IController, coordinate: ILatLng) => void;

    /**
     * マップコントローラー表示時のイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     * @param flag
     */
    onUI?: (ctrl: IController, flag: boolean) => void;

    /**
     * インフォメーションバルーン表示の有効状態変更時のイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     * @param flag
     */
    onInfo?: (ctrl: IController, flag: boolean) => void;

    /**
     * マップのパラメータが変更された際に実行されるイベントリスナー
     * @param ctrl マップコントローラーオブジェクト
     */
    onChange?: (ctrl: IController) => void;

    /**
     *
     */
    onAddMarker?: (ctrl: IController) => void;
    onHideMarker?: (marker: IMarkerData, ctrl: IController) => void;

    /**
     * マーカーがクリックされた際に実行されるイベントリスナー
     * @param marker クリックされたマーカーのデータ
     * @param ctrl マップコントローラーオブジェクト
     */
    onClickMarker?: (marker: IMarkerData, ctrl: IController) => void;
}

export function fixMapConfig(params: IMapConfig) {
    const def: IMapConfig = {
        show_ui: true,
        show_info: true,
        center: new LatLng(35.681236, 139.767125),
        center_bound: undefined,
        zoom: 9,
        zoom_min: 0,
        zoom_max: 99,
        grid: 5,
        lazy_load: 900,
        map_type: MapType.GoogleMap,
        selector: "#map",
        api_url: "",
    };

    const config: IMapConfig = {
        ...def,
        ...params
    };

    config.center = new LatLng(config.center);

    if (!isUndefined(config.center_bound)) {
        config.center_bound = new LatLngBound(config.center_bound);
    }

    switch (config.map_type) {
        case MapType.YahooMap:
            break;
        case MapType.GoogleMap:
        default:
            config.map_type = MapType.GoogleMap;
            break;
    }

    return config;
}