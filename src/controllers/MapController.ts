import {IBoundData, IMarkerData, IResponse, MarkerData} from "~/entities/Response";
import {isArray, isString} from "~/utils/Types";
import {URLBuilder} from "~/utils/URLBuilder";
import {LatLng, LatLngBounds} from "~/entities/LatLng";
import {MapEventType} from "~/controllers/MapEventType";
import EventEmitter from "~/utils/EventEmitter";
import ElementHelper from "~/utils/ElementHelper";
import {MapElement} from "~/controllers/Element";
import {IGridLayerController, ILayerController, IMessageLayerController} from "~/controllers/ILayerController";
import {IController} from "~/controllers/IController";
import {ApiType, Config, MapType} from "~/controllers/Config";

function numberFixed(value: number, digit: number): string {
    return value.toFixed(digit).replace(/(\.?0+)$/, "");
}

export interface ILayers {
    grid: IGridLayerController,
    load: ILayerController,
    message: IMessageLayerController
}

export abstract class MapController<M extends Object = {}, T extends Object = {}> {

    /**
     * ルートコントローラ
     */
    protected readonly root: IController;

    get config(): Config {
        return this.root.config;
    }

    /**
     * 地図オブジェクト
     */
    protected readonly abstract map: M;

    public getMap = (): M => this.map;

    /**
     * レイヤー定義
     */
    protected readonly abstract layers: ILayers;

    /**
     * イベントエミッタ
     */
    public readonly emit: EventEmitter<HTMLElement, [IController, ...any[]]>;

    protected target: MapElement;

    private xhr: XMLHttpRequest | null = null;

    protected constructor(root: IController) {
        this.root = root;

        const element = isString(this.config.selector) ? ElementHelper.query(this.config.selector) : new ElementHelper(this.config.selector);

        if (element) {
            this.target = new MapElement(element.src);
        } else {
            throw new Error("Cannot find element to display map");
        }

        element.uniqueID()

        // イベントエミッタを定義
        this.emit = new EventEmitter(element.src);
    }

    protected init() {
        const
            type = MapEventType,
            config = this.config;

        this.emit
            .on(type.INIT, config.onInit)
            .on(type.CHANGE, config.onChange)
            .on(type.MOVE, config.onMove)
            .on(type.ZOOM, config.onZoom)
            .on(type.UI, config.onUI)
            .on(type.MARKER_ADD, config.onAddMarker)
            .on(type.MARKER_SELECT, config.onClickMarker)
            .on(type.API_REQUEST, config.onRequest);

        // 初期化イベント発行
        this.fire(MapEventType.INIT, true);

        // コントロースの表示制御
        this.setUI(config.show_ui);

        // APIをリクエスト
        this.apiRequestAwait();

        this.layers.message.hide();
        this.layers.load.hide();
    }

    public fire(type: MapEventType, change: boolean, ...args: any) {
        if (this.emit.has(type)) {
            this.emit.fire(type, this.root, ...args);
        }

        if (change && type !== MapEventType.CHANGE) {
            this.fire(MapEventType.CHANGE, false);
        }
    }

    /**
     * APIリクエストを遅延実行
     */
    protected apiRequestAwait() {
        clearTimeout(this.requestTimer);

        if (this.config.api.auto) {
            this.requestTimer = setTimeout(() => {
                this.apiRequest();
            }, this.config.api.delay);
        }
    }

    /**
     * APIにリクエストを送信する
     */
    public apiRequest(): void {
        const api = this.config.api;

        if (api.url.length === 0) {
            return;
        }

        let zoom: number;

        if (this.config.map_type === MapType.GoogleMap) {
            zoom = this.getZoom() + 1;
        } else {
            zoom = this.getZoom();
        }

        const url = new URLBuilder(api.url);

        switch (api.type) {
            case ApiType.BOUNDS:
                const bounds = this.getBounds();

                if (!bounds) {
                    return;
                }

                bounds.round(zoom);

                url.query
                    .set("nelt", numberFixed(bounds.ne.lat, api.precision))
                    .set("neln", numberFixed(bounds.ne.lng, api.precision))
                    .set("swlt", numberFixed(bounds.sw.lat, api.precision))
                    .set("swln", numberFixed(bounds.sw.lng, api.precision));

                break;
            case ApiType.CENTER:
                const centre = this.getCenter();

                url.query
                    .set("lat", numberFixed(centre.lat, api.precision))
                    .set("lng", numberFixed(centre.lng, api.precision));

                break;
        }

        url.query.set("zoom", String(zoom));

        this.fire(MapEventType.API_REQUEST, false, url);

        /*
         * XHR リクエスト発信
         */
        // 未完了のAPIリクエストがある場合は終了する
        if (this.xhr instanceof XMLHttpRequest) {
            this.xhr.abort();
            this.xhr = null;
        }

        const xhr = new XMLHttpRequest();

        // APIレスポンス受信処理
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                this.layers.load.hide();
                if (xhr.status === 200) {
                    this.apiResponse(JSON.parse(xhr.responseText));
                }
            }

            this.xhr = null;
        };

        // API接続開始
        xhr.open("GET", url.build(), true, api.user, api.password);
        xhr.send();

        this.layers.load.show();

        this.xhr = xhr;
    }

    /**
     * APIの受信処理
     * @param json
     */
    protected apiResponse(json: IResponse) {
        const layers = this.layers;

        layers.grid.clear();

        if (json.error) {
            layers.message.show().html(json.message);
            return;
        }

        layers.message.hide();

        if (json.type == 'bounds') {

            switch (json.format) {
                case 'grid':
                    layers.grid.addBound(...json.data as IBoundData[]);
                    break;
                case 'content':
                    layers.grid.addMarker(...json.data as IMarkerData[]);
                    break;
            }

        } else if (isArray(json.data)) {
            this.addMarker(...json.data as IMarkerData[]);
        }

        this.fire(MapEventType.API_RESPONSE, false, json);
    }

    private requestTimer?: any;

    /**
     * パラメータ変更イベントハンドラー
     */
    protected onChangeHandler() {
        this.fire(MapEventType.CHANGE, false);
    }

    /**
     * 中心点移動イベントハンドラー
     */
    protected onMoveHandler() {
        const center = this.config.center = this.getCenter();

        this.fire(MapEventType.MOVE, true, center);

        this.apiRequestAwait();
    }

    /**
     * 地図のズーム率変更イベントハンドラー
     */
    protected onZoomListener() {
        const zoom = this.config.zoom = this.getZoom();

        this.fire(MapEventType.ZOOM, true, zoom);

        this.apiRequestAwait();
    }

    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    protected onUIListener(show: boolean) {
        const show_uri = this.config.show_ui = show;

        this.fire(MapEventType.UI, true, show_uri);
    }

    /**
     * モーダル表示用の継承メソッド
     * @param markers
     */
    protected abstract openModal(markers: MarkerData[]): void;

    /**
     * 表示している地図の矩形領域を返却する
     */
    public abstract getBounds(): LatLngBounds | null;

    /**
     * 地図の指定の矩形領域に収まるように表示する
     * @param bounds
     */
    public abstract setBounds(bounds: LatLngBounds): void;

    /**
     * 地図の表示要素を取得する
     */
    public getElement(): Element {
        return this.target.src;
    }

    /**
     * マップのズーム率を取得する
     */
    public abstract getZoom(): number;

    /**
     * マップのズーム率を変更する
     */
    public abstract setZoom(zoom: number): void;

    /**
     * マップの中心座標を取得する
     */
    public abstract getCenter(): LatLng;

    /**
     * マップの中心座標を変更する
     * @param center
     */
    public abstract setCenter(center: LatLng): void;

    /**
     * マップにマーカーを追加する
     */
    public addMarker = (...markers: IMarkerData[]): void  => this.layers.grid.addMarker(...markers);

    /**
     * マーカー情報を取得する
     * @param id
     */
    public getMarker = (id: string): IMarkerData | null => this.layers.grid.getMarker(id);

    /**
     * 表示中のマーカーを中心点からの距離順にソートして返却する
     * @param limit
     */
    public getDisplayMarkers = (limit: number = 10): IMarkerData[] => this.layers.grid.getDisplayMarkers(limit);

    /**
     * マーカーを削除する
     */
    public removeMarker = (... ids: string[]): number => this.layers.grid.removeMarker(...ids);

    /**
     * コントロールの表示状態を設定する
     */
    public abstract setUI(show: boolean): void;
}
