"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YMapController = void 0;
const LatLng_1 = require("../../entities/LatLng");
const MapController_1 = require("../MapController");
const Types_1 = require("../../utils/Types");
const YLayer_1 = require("./YLayer");
const EventType_1 = __importDefault(require("../../utils/EventType"));
class YMapController extends MapController_1.MapController {
    constructor(root) {
        super(root);
        /**
         * Yahoo Map の表示するコントローラーリスト
         */
        this.yc = [];
        // 表示するインターフェイスを初期化
        this.yc.push(new Y.SliderZoomControlVertical(), new Y.LayerSetControl(), new Y.ScaleControl());
        // 地図を初期化
        const config = this.config;
        const map = this.map = new Y.Map(this.target.getID(), {
            configure: {
                scrollWheelZoom: true,
                continuousZoom: true,
            }
        });
        // イベント関連付け
        map.bind("load", () => {
            setTimeout(() => {
                this.init();
            });
        });
        // 地図のレンダリング
        map.drawMap(new Y.LatLng(config.center.lat, config.center.lng), config.zoom, Y.LayerSetId.NORMAL);
        // レイヤーの実装
        this.layers = {
            grid: new YLayer_1.YGridMarkerLayer(this, 'grid'),
            message: new YLayer_1.YMessageLayer(this, 'message'),
            load: new YLayer_1.YLoadingLayer(this, 'loading')
        };
        map.bind("moveend", () => {
            this.onMoveHandler();
        });
        map.bind("zoomstart", () => {
            // 縮尺率変更前の中心点を記録する
            this.parentCentre = this.getCenter();
        });
        map.bind("zoomend", () => {
            let zoom = this.getZoom();
            if ((0, Types_1.isNumber)(config.zoom_min)) {
                zoom = Math.max(config.zoom_min, zoom);
            }
            if ((0, Types_1.isNumber)(config.zoom_max)) {
                zoom = Math.min(config.zoom_max, zoom);
            }
            if (zoom != this.getZoom()) {
                // 縮尺率が範囲外を超えた場合、適正値に戻す
                setTimeout(() => {
                    // 縮尺前から中心点がズレている場合、元の中心点に戻す
                    if (!(0, Types_1.isUndefined)(this.parentCentre) && !this.parentCentre.equals(this.getCenter())) {
                        this.setCenter(this.parentCentre);
                    }
                    this.parentCentre = undefined;
                    // 縮尺率を戻す
                    this.setZoom(zoom);
                });
            }
            this.onZoomListener();
        });
    }
    init() {
        super.init();
        // 出力要素がリサイズされた場合の処理を追加
        this.target.on(EventType_1.default.RESIZE, this.map.updateSize, this.map);
    }
    getBounds() {
        const bound = this.map.getBounds();
        if (bound instanceof Y.LatLngBounds) {
            return new LatLng_1.LatLngBounds(bound);
        }
        return null;
    }
    setBounds(bounds) {
        const b = bounds.ymap();
        const zoom = this.map.getBoundsZoomLevel(b);
        this.map.setZoom(zoom, true, b.getCenter(), true);
    }
    getZoom() {
        return this.map.getZoom();
    }
    setZoom(number) {
        this.map.setZoom(number, true, this.map.getCenter(), true);
    }
    getCenter() {
        return new LatLng_1.LatLng(this.map.getCenter());
    }
    setCenter(coordinate) {
        this.map.drawMap(coordinate.ymap(), this.getZoom(), Y.LayerSetId.NORMAL);
    }
    setUI(show) {
        for (let yc of this.yc) {
            if (show) {
                this.map.addControl(yc);
            }
            else {
                this.map.removeControl(yc);
            }
        }
        this.onUIListener(show);
    }
    openModal(markers) {
        /*
        const
            content = marker.marker.content();

        if (marker.origin instanceof Y.Marker && content !== "") {
            marker.origin.openInfoWindow(content);
        }
         */
    }
}
exports.YMapController = YMapController;
//# sourceMappingURL=YMapController.js.map