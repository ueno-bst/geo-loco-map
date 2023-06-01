import { LatLng, LatLngBounds } from "../../entities/LatLng";
import { MapController } from "../MapController";
import { isNumber, isUndefined } from "../../utils/Types";
import { YGridMarkerLayer, YLoadingLayer, YMessageLayer } from "./YLayer";
import EventType from "../../utils/EventType";
export class YMapController extends MapController {
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
            grid: new YGridMarkerLayer(this, 'grid'),
            message: new YMessageLayer(this, 'message'),
            load: new YLoadingLayer(this, 'loading')
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
            if (isNumber(config.zoom_min)) {
                zoom = Math.max(config.zoom_min, zoom);
            }
            if (isNumber(config.zoom_max)) {
                zoom = Math.min(config.zoom_max, zoom);
            }
            if (zoom != this.getZoom()) {
                // 縮尺率が範囲外を超えた場合、適正値に戻す
                setTimeout(() => {
                    // 縮尺前から中心点がズレている場合、元の中心点に戻す
                    if (!isUndefined(this.parentCentre) && !this.parentCentre.equals(this.getCenter())) {
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
        this.target.on(EventType.RESIZE, this.map.updateSize, this.map);
    }
    getBounds() {
        const bound = this.map.getBounds();
        if (bound instanceof Y.LatLngBounds) {
            return new LatLngBounds(bound);
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
        return new LatLng(this.map.getCenter());
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
//# sourceMappingURL=YMapController.js.map