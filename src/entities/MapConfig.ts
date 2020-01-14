import {ILatLng, ILatLngBounds, LatLng, LatLngBounds} from "./LatLng";
import {IMarkerData} from "./Response";
import {IController} from "../controllers/IController";
import {isNumber, isExist, isString, isUndefined} from "../utils/Types";
import {URLBuilder} from "../utils/URLBuilder";

export enum MapType {
    GoogleMap = "google",
    YahooMap = "yahoo",
}

export enum ApiType {
    CENTER = "center",
    BOUNDS = "bounds",
}

/**
 * マップ情報の設定値
 */
export interface IConfig {
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
    center_bound?: ILatLngBounds;

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
     * @deprecated
     */
    api_url?: string;

    /**
     * マーカーを取得するためのAPI設定
     */
    api: IConfigApi;

    /**
     * APIに座標を送る際の精度
     * @deprecated
     */
    grid: number;

    /**
     * マップの静止から、APIにリクエストを送るまでのタイムラグ
     * @deprecated
     */
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

    /**
     * APIをリクエストする処理
     * @param ctrl
     * @param url
     */
    onRequest?: (ctrl: IController, url: URLBuilder) => void;
}

export interface IConfigApi {
    url: string,
    user?: string,
    password?: string,
    type: ApiType,
    precision: number,
    delay: number,
}

const ConfigApiDefault: IConfigApi = {
    precision: 0,
    type: ApiType.CENTER,
    url: "",
    delay: 0,
};

const ConfigDefault: IConfig = {
    api: fixMapApi(),
    api_url: "",
    show_ui: true,
    show_info: true,
    center: new LatLng(35.681236, 139.767125),
    center_bound: undefined,
    zoom: 9,
    zoom_min: 0,
    zoom_max: 99,
    grid: 5,
    lazy_load: 500,
    map_type: MapType.GoogleMap,
    selector: "#map",
};

export function fixMapConfig(params: IConfig) {
    const config: IConfig = {
        ...ConfigDefault,
        ...params
    };

    config.api = fixMapApi(config.api);
    config.center = new LatLng(config.center);

    if (!isExist(config.api.url) && isString(config.api_url)) {
        config.api.url = config.api_url;
    }

    if (!isExist(config.api.precision) && isNumber(config.grid)) {
        config.api.precision = config.grid;
    }

    if (!isExist(config.api.delay) && isNumber(config.lazy_load)) {
        config.api.delay = config.lazy_load;
    }

    if (!isUndefined(config.center_bound)) {
        config.center_bound = new LatLngBounds(config.center_bound);
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

function fixMapApi(params?: IConfigApi): IConfigApi {
    const def: IConfigApi = {
        precision: 0,
        type: ApiType.CENTER,
        url: "",
        delay: 0,
    };

    const config: IConfigApi = {
        ...ConfigApiDefault,
        ...params,
    };

    switch (config.type) {
        case ApiType.BOUNDS:
            break;
        case ApiType.CENTER:
        default:
            config.type = ApiType.CENTER;
            break;
    }

    if (!isNumber(config.precision)) {
        config.precision = def.precision;
    }

    if (!isNumber(config.delay)) {
        config.delay = def.delay;
    }

    return config;
}