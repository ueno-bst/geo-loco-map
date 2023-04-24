import {ILatLng, ILatLngBounds, LatLng, LatLngBounds} from "../entities/LatLng";
import {IMarkerData} from "../entities/Response";
import IController from "./IController";
import {JsonHelper} from "../utils/JsonHelper";
import {URLBuilder} from "@ueno-bst/url-builder";

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
    map_type: MapType | string;

    /**
     * 地図の初期表示する中心点を指定
     */
    center: ILatLng | number[];

    /**
     * 地図のスクロール範囲を指定したい場合に
     */
    center_bound?: ILatLngBounds;

    /**
     * 地図の初期表示状態のズーム率を指定
     */
    zoom?: number;

    /**
     * ズーム率の最小比率
     */
    zoom_min?: number;

    /**
     * ズーム率の最大比率
     */
    zoom_max?: number;

    /**
     *　表示対象のHTMLエレメントを指定
     */
    selector: string | HTMLElement;

    /**
     * 地図の表示用コントローラーを表示する
     */
    show_ui?: boolean;

    /**
     * クリックした際に、地図上にインフォメーションバルーンを表示する
     */
    show_info?: boolean;

    /**
     * マーカーを取得するためのAPIのURL
     * @deprecated
     */
    api_url?: string;

    /**
     * マーカーを取得するためのAPI設定
     */
    api?: IConfigApi;

    /**
     * APIに座標を送る際の精度
     * @deprecated
     */
    grid?: number;

    /**
     * マップの静止から、APIにリクエストを送るまでのタイムラグ
     * @deprecated
     */
    lazy_load?: number;

    /**
     * デバッグモードを使用するかの設定
     */
    debug?: boolean;

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
    onHideMarker?: (ctrl: IController, marker: IMarkerData) => void;

    /**
     * マーカーがクリックされた際に実行されるイベントリスナー
     * @param marker クリックされたマーカーのデータ
     * @param ctrl マップコントローラーオブジェクト
     */
    onClickMarker?: (ctrl: IController, marker: IMarkerData) => void;

    /**
     * APIをリクエストする処理
     * @param ctrl
     * @param url
     */
    onRequest?: (ctrl: IController, url: URLBuilder) => void;
}

export interface IConfigApi {
    /**
     * API接続用URLを指定します
     */
    url?: string,

    /**
     * API接続時に使用する、Basic認証のユーザーIDを指定します。
     */
    user?: string,

    /**
     * APIに接続時に使用する、Basic認証のパスワードを指定します。
     */
    password?: string,

    /**
     * APIへのリクエストタイプを指定します。
     */
    type?: ApiType | string,

    /**
     * APIに座標を送る際の精度を、小数点以下の桁数で指定します。デフォルト値は 10 です。
     */
    precision?: number,

    /**
     * マップの静止から、APIにリクエストを送るまでの待機時間をしていします
     */
    delay?: number,

    /**
     * APIのリクエストを自動で行います。デフォルト値は true です。
     */
    auto?: boolean,
}

export class Config implements IConfig {

    api: ConfigApi;
    center: LatLng;
    center_bound?: LatLngBounds;
    map_type: MapType;
    selector: string | HTMLElement;

    show_info: boolean;
    show_ui: boolean;

    zoom: number;
    zoom_min: number;
    zoom_max: number;

    debug: boolean;

    onInit?: (ctrl: IController) => void;
    onChange?: (ctrl: IController) => void;
    onInfo?: (ctrl: IController, flag: boolean) => void;
    onMove?: (ctrl: IController, coordinate: ILatLng) => void;
    onZoom?: (ctrl: IController, zoom: number) => void;
    onUI?: (ctrl: IController, flag: boolean) => void;
    onAddMarker?: (ctrl: IController) => void;
    onClickMarker?: (ctrl: IController, marker: IMarkerData) => void;
    onHideMarker?: (ctrl: IController, marker: IMarkerData) => void;
    onRequest?: (ctrl: IController, url: URLBuilder) => void;

    constructor(data: IConfig) {
        const
            helper = JsonHelper,
            llb = LatLngBounds,
            ll = LatLng;

        this.center = new ll(data.center as ILatLng);

        if (llb.is(data.center_bound)) {
            this.center_bound = new LatLngBounds(data.center_bound);
        }

        this.map_type = helper.asEnum<MapType>(MapType, data.map_type as MapType, MapType.GoogleMap);
        this.selector = data.selector instanceof HTMLElement ? data.selector : helper.asStr(data.selector, "#map");
        this.api = new ConfigApi(data.api || {});

        this.show_ui = helper.asBool(data.show_ui, true);
        this.show_info = helper.asBool(data.show_info, true);

        this.zoom = helper.asNum(data.zoom, 9);
        this.zoom_min = helper.asNum(data.zoom_min, 0);
        this.zoom_max = helper.asNum(data.zoom_max, 99);

        this.debug = helper.asBool(data.debug, false);

        this.onInit = data.onInit;
        this.onChange = data.onChange;
        this.onInfo = data.onInfo;
        this.onMove = data.onMove;
        this.onZoom = data.onZoom;
        this.onUI = data.onUI;
        this.onAddMarker = data.onAddMarker;
        this.onClickMarker = data.onClickMarker;
        this.onHideMarker = data.onHideMarker;
        this.onRequest = data.onRequest;
    }
}

class ConfigApi implements IConfigApi {

    auto: boolean;
    delay: number;
    precision: number;
    type: ApiType | string;
    url: string;
    user: string;
    password: string;

    constructor(data: IConfigApi) {
        const helper = JsonHelper;

        this.url = helper.asStr(data.url, "");
        this.user = helper.asStr(data.user, "");
        this.password = helper.asStr(data.password, "");
        this.type = helper.asEnum(ApiType, data.type, ApiType.CENTER);
        this.precision = helper.asNum(data.precision, 10);
        this.delay = helper.asNum(data.delay, 10);
        this.auto = helper.asBool(data.auto, true);
    }
}
