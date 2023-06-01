"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapController = void 0;
const Types_1 = require("../utils/Types");
const url_builder_1 = require("@ueno-bst/url-builder");
const LatLng_1 = require("../entities/LatLng");
const MapEventType_1 = require("./MapEventType");
const EventEmitter_1 = __importDefault(require("../utils/EventEmitter"));
const ElementHelper_1 = __importDefault(require("../utils/ElementHelper"));
const Element_1 = require("./Element");
const Config_1 = require("./Config");
function numberFixed(value, digit) {
    return value.toFixed(digit).replace(/(\.?0+)$/, "");
}
class MapController {
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
        const element = (0, Types_1.isString)(this.config.selector) ? ElementHelper_1.default.query(this.config.selector) : new ElementHelper_1.default(this.config.selector);
        if (element) {
            this.target = new Element_1.MapElement(element.src);
        }
        else {
            throw new Error("Cannot find element to display map");
        }
        element.uniqueID();
        // イベントエミッタを定義
        this.emit = new EventEmitter_1.default(element.src);
    }
    init() {
        const type = MapEventType_1.MapEventType, config = this.config;
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
        this.fire(MapEventType_1.MapEventType.INIT, true);
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
        if (change && type !== MapEventType_1.MapEventType.CHANGE) {
            this.fire(MapEventType_1.MapEventType.CHANGE, false);
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
        if (this.config.map_type === Config_1.MapType.GoogleMap) {
            zoom = this.getZoom() + 1;
        }
        else {
            zoom = this.getZoom();
        }
        const url = new url_builder_1.URLBuilder(api.url);
        switch (api.type) {
            case Config_1.ApiType.BOUNDS:
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
            case Config_1.ApiType.CENTER:
                const centre = this.getCenter();
                url.query
                    .set("lat", numberFixed(centre.lat, api.precision))
                    .set("lng", numberFixed(centre.lng, api.precision));
                break;
        }
        url.query.set("zoom", String(zoom));
        this.fire(MapEventType_1.MapEventType.API_REQUEST, false, url);
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
            this.currentBounds = new LatLng_1.LatLngBounds(json.bounds);
            if ((_a = layers.debug) === null || _a === void 0 ? void 0 : _a.response) {
                layers.debug.response.setBound(new LatLng_1.LatLngBounds(json.bounds));
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
        else if ((0, Types_1.isArray)(json.data)) {
            this.addMarker(...json.data);
        }
        this.fire(MapEventType_1.MapEventType.API_RESPONSE, false, json);
    }
    /**
     * パラメータ変更イベントハンドラー
     */
    onChangeHandler() {
        this.fire(MapEventType_1.MapEventType.CHANGE, false);
    }
    /**
     * 中心点移動イベントハンドラー
     */
    onMoveHandler() {
        const center = this.config.center = this.getCenter();
        this.fire(MapEventType_1.MapEventType.MOVE, true, center);
        this.apiRequestAwait();
    }
    /**
     * 地図のズーム率変更イベントハンドラー
     */
    onZoomListener() {
        const zoom = this.config.zoom = this.getZoom();
        this.fire(MapEventType_1.MapEventType.ZOOM, true, zoom);
        this.apiRequestAwait();
    }
    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    onUIListener(show) {
        const show_uri = this.config.show_ui = show;
        this.fire(MapEventType_1.MapEventType.UI, true, show_uri);
    }
    /**
     * 地図の表示要素を取得する
     */
    getElement() {
        return this.target.src;
    }
}
exports.MapController = MapController;
//# sourceMappingURL=MapController.js.map