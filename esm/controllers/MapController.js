import { isArray, isString } from "../utils/Types";
import { URLBuilder } from "@ueno-bst/url-builder";
import { LatLngBounds } from "../entities/LatLng";
import { MapEventType } from "./MapEventType";
import EventEmitter from "../utils/EventEmitter";
import ElementHelper from "../utils/ElementHelper";
import { MapElement } from "./Element";
import { ApiType, MapType } from "./Config";
function numberFixed(value, digit) {
    return value.toFixed(digit).replace(/(\.?0+)$/, "");
}
export class MapController {
    get config() {
        return this.root.config;
    }
    constructor(root) {
        this.getMap = () => this.map;
        this.xhr = null;
        this.currentBounds = null;
        this.currentZoom = null;
        /**
         * マップにマーカーを追加する
         */
        this.addMarker = (...markers) => this.layers.grid.addMarker(...markers);
        /**
         * マーカー情報を取得する
         * @param id
         */
        this.getMarker = (id) => this.layers.grid.getMarker(id);
        /**
         * 表示中のマーカーを中心点からの距離順にソートして返却する
         * @param limit
         */
        this.getDisplayMarkers = (limit = 10) => this.layers.grid.getDisplayMarkers(limit);
        /**
         * マーカーを削除する
         */
        this.removeMarker = (...ids) => this.layers.grid.removeMarker(...ids);
        this.root = root;
        const element = isString(this.config.selector) ? ElementHelper.query(this.config.selector) : new ElementHelper(this.config.selector);
        if (element) {
            this.target = new MapElement(element.src);
        }
        else {
            throw new Error("Cannot find element to display map");
        }
        element.uniqueID();
        // イベントエミッタを定義
        this.emit = new EventEmitter(element.src);
    }
    init() {
        const type = MapEventType, config = this.config;
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
    fire(type, change, ...args) {
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
    apiRequestAwait() {
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
    apiRequest() {
        var _a;
        const api = this.config.api;
        if (api.url.length === 0) {
            return;
        }
        let zoom;
        if (this.config.map_type === MapType.GoogleMap) {
            zoom = this.getZoom() + 1;
        }
        else {
            zoom = this.getZoom();
        }
        const url = new URLBuilder(api.url);
        switch (api.type) {
            case ApiType.BOUNDS:
                const bounds = this.getBounds();
                if (!bounds) {
                    return;
                }
                if (this.currentBounds && this.currentZoom && this.currentBounds.inside(bounds) && this.currentZoom === zoom) {
                    return;
                }
                this.currentZoom = zoom;
                bounds.round(zoom);
                if ((_a = this.layers.debug) === null || _a === void 0 ? void 0 : _a.request) {
                    this.layers.debug.request.setBound(bounds);
                }
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
    apiResponse(json) {
        var _a;
        const layers = this.layers;
        layers.grid.clear();
        if (json.error) {
            layers.message.show().html(json.message);
        }
        else {
            layers.message.hide();
        }
        if (json.bounds) {
            this.currentBounds = new LatLngBounds(json.bounds);
            if ((_a = layers.debug) === null || _a === void 0 ? void 0 : _a.response) {
                layers.debug.response.setBound(new LatLngBounds(json.bounds));
            }
        }
        if (json.type == 'bounds') {
            switch (json.format) {
                case 'grid':
                    layers.grid.addBound(...json.data);
                    break;
                case 'content':
                    layers.grid.addMarker(...json.data);
                    break;
            }
        }
        else if (isArray(json.data)) {
            this.addMarker(...json.data);
        }
        this.fire(MapEventType.API_RESPONSE, false, json);
    }
    /**
     * パラメータ変更イベントハンドラー
     */
    onChangeHandler() {
        this.fire(MapEventType.CHANGE, false);
    }
    /**
     * 中心点移動イベントハンドラー
     */
    onMoveHandler() {
        const center = this.config.center = this.getCenter();
        this.fire(MapEventType.MOVE, true, center);
        this.apiRequestAwait();
    }
    /**
     * 地図のズーム率変更イベントハンドラー
     */
    onZoomListener() {
        const zoom = this.config.zoom = this.getZoom();
        this.fire(MapEventType.ZOOM, true, zoom);
        this.apiRequestAwait();
    }
    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    onUIListener(show) {
        const show_uri = this.config.show_ui = show;
        this.fire(MapEventType.UI, true, show_uri);
    }
    /**
     * 地図の表示要素を取得する
     */
    getElement() {
        return this.target.src;
    }
}
//# sourceMappingURL=MapController.js.map