"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GMapController = void 0;
const LatLng_1 = require("../../entities/LatLng");
const MapController_1 = require("../MapController");
const GLayer_1 = require("./GLayer");
const Types_1 = require("../../utils/Types");
const is_number = Types_1.isNumber;
class GMapController extends MapController_1.MapController {
    constructor(root) {
        super(root);
        // 地図をレンダリング
        const mapConfig = {
            center: { lat: this.config.center.lat, lng: this.config.center.lng },
            scrollwheel: true,
            fullscreenControl: false,
            streetViewControl: false,
            zoom: this.config.zoom,
            disableDefaultUI: !this.config.show_ui,
            scaleControl: this.config.show_ui,
        };
        if (is_number(this.config.zoom_min)) {
            mapConfig.minZoom = this.config.zoom_min;
        }
        if (is_number(this.config.zoom_max)) {
            mapConfig.maxZoom = this.config.zoom_max;
        }
        this.map = new google.maps.Map(this.target.src, mapConfig);
        // 地図の中心点変更時イベントを登録
        google.maps.event.addListenerOnce(this.map, "idle", () => {
            setTimeout(() => {
                this.init();
            });
        });
        this.map.addListener("bounds_changed", () => {
            this.onChangeHandler();
        });
        this.map.addListener("center_changed", () => {
            this.onMoveHandler();
        });
        this.map.addListener("zoom_changed", () => {
            this.onZoomListener();
        });
        // マップクリック時のイベント処理
        this.map.addListener("click", (e) => {
            // 地物を対象にしたイベントの場合、情報ウィンドウ表示を抑止するためにイベントを停止する
            if (e.hasOwnProperty("placeId")) {
                e.stop();
            }
        });
        // test
        this.layers = {
            grid: new GLayer_1.GGridMarkerLayer(this, "grid"),
            load: new GLayer_1.GLoadingLayer(this, "loading"),
            message: new GLayer_1.GMessageLayer(this, "message"),
        };
        if (this.config.debug) {
            this.layers.debug = {
                response: new GLayer_1.GDebugLayer(this, "response").setClasses("gl-response"),
                request: new GLayer_1.GDebugLayer(this, "request").setClasses("gl-request"),
            };
        }
    }
    getBounds() {
        const bound = this.map.getBounds();
        if (bound instanceof google.maps.LatLngBounds) {
            return new LatLng_1.LatLngBounds(bound);
        }
        return null;
    }
    setBounds(bounds) {
        this.map.fitBounds(bounds.gmap());
    }
    getZoom() {
        return this.map.getZoom();
    }
    setZoom(zoom) {
        this.map.setZoom(zoom);
    }
    getCenter() {
        return new LatLng_1.LatLng(this.map.getCenter());
    }
    setCenter(center) {
        this.map.setCenter(center.gmap());
    }
    setUI(show) {
        this.map.setOptions({
            disableDefaultUI: !show
        });
        this.onUIListener(show);
    }
    /**
     * モーダルを開く
     * @param markers
     */
    openModal(markers) {
        /*
        const
            content = marker.marker.content();

        if (marker.origin instanceof google.maps.Marker && content !== "") {
            let info = new google.maps.InfoWindow({
                content: content,
            });

            info.open(this.map, marker.origin);
        }
         */
    }
}
exports.GMapController = GMapController;
//# sourceMappingURL=GMapController.js.map