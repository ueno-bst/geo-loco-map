import {ApiType, IMapConfig, MapType} from '../entities/MapConfig'
import {IBoundGridContentData, IBoundGridData, IMarkerData, IResponse, MarkerData} from "../entities/Response";
import {IMarkerList, isIMarkerList} from "./IMarkers";
import {IController} from "./IController";
import {isArray, isFunction, isNull, isString} from "../utils/Types";
import {MapEvent, MapEventType} from "../entities/MapEvent";
import {URLBuilder} from "../utils/URLBuilder";
import {LatLng, LatLngBounds} from "../entities/LatLng";
import {MapElement} from "./Element";
import {ElementHelper} from "../utils/ElementHelper";

function numberFixed(value: number, digit: number): string {
    return value.toFixed(digit).replace(/(\.?0+)$/, "");
}

export abstract class MapController<T extends Object> {

    /**
     * ルートコントローラ
     */
    protected readonly root: IController;

    get config(): IMapConfig {
        return this.root.config;
    }

    /**
     * イベントエミッタ
     */
    public readonly emit: MapEvent;

    protected target: MapElement;

    protected markers: { [key: string]: IMarkerList<T>; } = {};

    private xhr: XMLHttpRequest | null = null;

    protected constructor(root: IController) {
        this.root = root;

        // イベントエミッタを定義
        this.emit = new MapEvent(root);

        const element = ElementHelper.query(this.config.selector);

        if (element) {
            this.target = new MapElement(element.element);
        } else {
            throw new Error("Cannot find element to display map");
        }
    }

    protected init() {
        // 初期化イベント発行
        this.onInitHandler();

        // コントロースの表示制御
        this.setUI(this.config.show_ui);

        // APIをリクエスト
        this.request();
    }

    /**
     * APIリクエストを実行
     */
    protected onApiRequestHandler() {
        clearTimeout(this.requestTimer);

        this.requestTimer = setTimeout(() => {
            this.request();
        }, this.config.api.delay);
    }

    /**
     * APIにリクエストを送信する
     */
    protected request(): void {
        const api = this.config.api;

        if (api.url.length === 0) {
            return;
        }

        let zoom = 0;
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

                url.query.set("nelt", numberFixed(bounds.ne.lat, api.precision));
                url.query.set("neln", numberFixed(bounds.ne.lng, api.precision));
                url.query.set("swlt", numberFixed(bounds.sw.lat, api.precision));
                url.query.set("swln", numberFixed(bounds.sw.lng, api.precision));
                break;
            case ApiType.CENTER:
                const centre = this.getCenter();

                url.query.set("lat", numberFixed(centre.lat, api.precision));
                url.query.set("lng", numberFixed(centre.lng, api.precision));
                break;
        }

        url.query.set("zoom", String(zoom));

        this.emit.fire(MapEventType.request, url);

        if (isFunction(this.config.onRequest)) {
            this.config.onRequest(this.root, url);
        }

        /*
         * XHR リクエスト発信
         */
        // 未完了のAPIリクエストがある場合は終了する
        if (this.xhr instanceof XMLHttpRequest) {
            this.xhr.abort();
            this.xhr = null;
        }

        console.info(url.build());

        const xhr = new XMLHttpRequest();

        // APIレスポンス受信処理
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                this.hideLoading();
                if (xhr.status === 200) {
                    this.onApiReceiveListener(JSON.parse(xhr.responseText));
                }
            }

            this.xhr = null;
        };

        // API接続開始
        xhr.open("GET", url.build(), true, api.user, api.password);
        xhr.send();

        this.showLoading();

        this.xhr = xhr;
    }

    /**
     * APIの受信処理
     * @param json
     */
    protected onApiReceiveListener(json: IResponse) {
        if (json.type == 'bounds') {
            this.removeGrids();
            this.removeMarkers();

            if (json.error) {
                this.setMessage(json.message, true);
            } else {
                this.hideMessage();
                switch (json.format) {
                    case 'grid':
                        this.addGrids(json.data);
                        break;
                    case 'content':
                        this.addGridContents(json.data);
                        break;
                }
            }

        } else if (isArray(json.data)) {
            const before = Object.keys(this.markers).length;

            for (let datum of json.data) {
                this.addMarker(datum);
            }

            const after = Object.keys(this.markers).length;

            if (before != after) {
                this.onAddMarkerHandler();
            }
        }
    }

    private requestTimer?: any;

    /**
     * 初期化完了イベントハンドラー
     */
    protected onInitHandler() {
        this.emit.fire(MapEventType.init);

        if (isFunction(this.config.onInit)) {
            this.config.onInit(this.root);
        }

        this.onChangeHandler();
    }

    /**
     * パラメータ変更イベントハンドラー
     */
    protected onChangeHandler() {
        this.emit.fire(MapEventType.change);

        if (isFunction(this.config.onChange)) {
            this.config.onChange(this.root);
        }
    }

    /**
     * 中心点移動イベントハンドラー
     */
    protected onMoveHandler() {
        const center = this.config.center = this.getCenter();

        this.emit.fire(MapEventType.move, center);

        if (isFunction(this.config.onMove)) {
            this.config.onMove(this.root, center);
        }

        this.onChangeHandler();
        this.onApiRequestHandler();
    }

    /**
     * 地図のズーム率変更イベントハンドラー
     */
    protected onZoomListener() {
        const zoom = this.config.zoom = this.getZoom();

        this.emit.fire(MapEventType.zoom, zoom);

        if (isFunction(this.config.onZoom)) {
            this.config.onZoom(this.root, zoom);
        }

        this.onChangeHandler();
        this.onApiRequestHandler();
    }

    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    protected onUIListener(show: boolean) {
        const show_uri = this.config.show_ui = show;

        this.emit.fire(MapEventType.ui, show_uri);

        if (isFunction(this.config.onUI)) {
            this.config.onUI(this.root, show_uri);
        }

        this.onChangeHandler();
    }

    protected onAddMarkerHandler() {
        this.emit.fire(MapEventType.addMarker, this.root);

        if (isFunction(this.config.onAddMarker)) {
            this.config.onAddMarker(this.root);
        }

        this.onChangeHandler();
    }

    /**
     * マーカークリック時イベントハンドラー
     * @param marker
     */
    protected onClickMarkerHandler(marker: IMarkerList<T>) {
        if (this.config.show_info) {
            this.openModal(marker);
        }

        this.emit.fire(MapEventType.clickMarker, this.root);

        if (this.config.onClickMarker) {
            this.config.onClickMarker(marker.marker, this.root);
        }
    }

    /**
     * モーダル表示用の継承メソッド
     * @param marker
     */
    protected abstract openModal(marker: IMarkerList<T>): void;

    /**
     * 表示している地図の矩形領域を返却する
     */
    public abstract getBounds(): LatLngBounds | null;

    /**
     * 地図の表示要素を取得する
     */
    public getElement(): Element {
        return this.target.element;
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
     * マーカーデータを生成する
     * @param marker
     */
    protected createMarker(marker: IMarkerData): IMarkerList<T> {
        let new_marker = new MarkerData(marker);
        const current_marker = this.findMarker(new_marker);

        if (current_marker !== null) {
            return current_marker;
        }

        return this.markers[new_marker.id] = {
            marker: new_marker,
            origin: null,
            display: false,
        };
    }

    /**
     * マップにマーカーを追加する
     */
    public abstract addMarker(marker: IMarkerData): IMarkerData;

    /**
     * マーカー情報を取得する
     * @param id
     */
    public getMarker(id: string): IMarkerData | null {
        const m = this.findMarker(id);
        return m === null ? null : m.marker;
    }

    /**
     * 表示中のマーカーを中心点からの距離順にソートして返却する
     * @param limit
     */
    public getViewInMarkers(limit: number = 10): IMarkerData[] {
        const ms: MarkerData[] = [],
            bound = this.getBounds(),
            centre = this.getCenter();

        if (isNull(bound) || isNull(centre)) {
            return ms;
        }

        for (let id in this.markers) {
            const m = this.markers[id];

            if (!m.display) {
                continue;
            }

            if (!bound.inside(m.marker.coordinate)) {
                continue;
            }

            ms.push(m.marker);
        }

        ms.sort((a: MarkerData, b: MarkerData): number => {
            const ad = centre.distance(a.coordinate), bd = centre.distance(b.coordinate);
            if (ad < bd) {
                return -1;
            }

            if (ad > bd) {
                return 1;
            }

            return 0;
        });

        return ms.slice(0, limit);
    }

    protected findMarker(target: MarkerData): IMarkerList<T> | null;
    protected findMarker(target: IMarkerList<T>): IMarkerList<T> | null;
    protected findMarker(target: string): IMarkerList<T> | null
    protected findMarker(target: string | MarkerData | IMarkerList<T>): IMarkerList<T> | null {

        let id: string = "";

        if (isString(target)) {
            id = target as string;
        } else if (target instanceof MarkerData) {
            id = target.id;
        } else if (isIMarkerList<T>(target)) {
            id = target.marker.id;
        }

        if (id === "" || this.markers[id] === undefined) {
            return null;
        }

        return this.markers[id];
    }

    /**
     * マーカーを削除する
     */
    public abstract removeMarker(id: string): boolean;

    /**
     * すべてのマーカーを削除する
     */
    public removeMarkers(): void {
        for (let id in this.markers) {
            this.removeMarker(id);
        }
    }

    /**
     * グリッドを追加する
     * @param grids
     */
    public abstract addGrids(grids: IBoundGridData[]): void;

    public abstract addGridContents(contents: IBoundGridContentData[]): void;

    /**
     * グリッドをすべて削除する
     */
    public abstract removeGrids(): void;

    public abstract setMessage(message: string, show: boolean): void;

    public abstract showMessage(): void;

    public abstract hideMessage(): void;

    public abstract showLoading(): void;

    public abstract hideLoading(): void;

    /**
     * コントロールの表示状態を設定する
     */
    public abstract setUI(show: boolean): void;
}
