import {ILatLng, LatLng} from "../entities/LatLng";
import {MapController} from "./MapController";
import {IMarkerData} from "../entities/Response";
import {IMarkerList} from "./IMarkers";
import {IController} from "./IController";
import {LatLngBound} from "../entities/LatLngBound";
import {isNumber, isUndefined} from "../utils/Types";


/// <reference path="../types/Yahoo.d.ts" />
export class YahooMapController extends MapController<Y.Marker> {

    /**
     * 地図オブジェクト
     */
    private map: Y.Map;

    /**
     * Yahoo Map の表示するコントローラーリスト
     */
    private yc: any[] = [];

    private parentCentre?: LatLng;

    constructor(root: IController) {
        super(root);

        // 表示するインターフェイスを初期化
        this.yc.push(
            new Y.SliderZoomControlVertical(),
            new Y.LayerSetControl(),
        );

        // 地図を初期化
        this.map = new Y.Map(this.target.id, {
            configure: {
                scrollWheelZoom: true,
                continuousZoom: true,
            }
        });

        // イベント関連付け
        this.map.bind("load", () => {
            setTimeout(() => {
                this.init();
            });
        });

        // 地図のレンダリング
        this.map.drawMap(new Y.LatLng(this.config.center.lat, this.config.center.lng), this.config.zoom, Y.LayerSetId.NORMAL);

        this.map.bind("moveend", () => {
            this.onMoveHandler();
        });

        this.map.bind("zoomstart", () => {
            // 縮尺率変更前の中心点を記録する
            this.parentCentre = this.getCenter();
        });

        this.map.bind("zoomend", () => {
            let zoom = this.getZoom();

            if (isNumber(this.config.zoom_min)) {
                zoom = Math.max(this.config.zoom_min, zoom);
            }

            if (isNumber(this.config.zoom_max)) {
                zoom = Math.min(this.config.zoom_max, zoom);
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

    protected init() {
        super.init();

        // 出力要素がリサイズされた場合の処理を追加
        this.target.onResize = (() => {
            this.map.updateSize();
        });
    }

    getBounds(): LatLngBound | null {
        const bound = this.map.getBounds();

        if (bound instanceof Y.LatLngBounds) {
            const
                ne = bound.ne,
                sw = bound.sw;

            return new LatLngBound(
                {lat: ne.lat(), lng: ne.lng()},
                {lat: sw.lat(), lng: sw.lng()},
            );
        }

        return null;
    }

    getZoom() {
        return this.map.getZoom()
    }

    setZoom(number: number) {
        this.map.setZoom(number, true, this.map.getCenter(), true)
    }

    getCenter(): LatLng {
        const center = this.map.getCenter();
        return new LatLng({lat: center.lat(), lng: center.lng()});
    }

    setCenter(coordinate: ILatLng) {
        this.map.drawMap(new Y.LatLng(coordinate.lat, coordinate.lng), this.getZoom(), Y.LayerSetId.NORMAL)
    }

    addMarker(marker: IMarkerData): IMarkerData {
        const m = super.createMarker(marker);

        if (m.origin === null) {
            m.origin = new Y.Marker(new Y.LatLng(m.marker.lat, m.marker.lng));

            m.origin.bind("click", () => {
                this.onClickMarkerHandler(m);
            });
        }

        if (!m.display && m.marker.display()) {
            m.display = true;
            this.map.addFeature(m.origin);
        }

        return m.marker;
    }

    removeMarker(id: string): boolean {
        const m = this.findMarker(id);

        if (m !== null && m.origin !== null) {
            m.display = false;
            this.map.removeFeature(m.origin);
            return true;
        }

        return false;
    }

    setUI(show: boolean): void {
        for (let index = 0; index < this.yc.length; index++) {
            if (show) {
                this.map.addControl(this.yc[index]);
            } else {
                this.map.removeControl(this.yc[index]);
            }
        }
        this.onUIListener(show);
    }

    protected openModal(marker: IMarkerList<Y.Marker>): void {
        const
            content = marker.marker.content();

        if (marker.origin instanceof Y.Marker && content !== "") {
            marker.origin.openInfoWindow(content);
        }
    }
}