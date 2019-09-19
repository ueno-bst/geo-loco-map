import {ILatLng, ILatLngBound, LatLng, LatLngBound} from "../entities/LatLng";
import {MapController} from "./MapController";
import {IMarkerData, MarkerData} from "../entities/Response";
import {IMarkerList} from "./IMarkers";
import {IController} from "./IController";


/// <reference path="../typings/Yahoo.d.ts" />
export class YahooMapController extends MapController<Y.Marker> {

    /**
     * 地図オブジェクト
     */
    private map: Y.Map;

    /**
     * Yahoo Map の表示するコントローラーリスト
     */
    private yc: any[] = [];

    constructor(root: IController) {
        super(root);

        // 表示するインターフェイスを初期化
        this.yc.push(
            new Y.SliderZoomControlVertical(),
            new Y.LayerSetControl(),
        );

        // 地図を初期化
        this.map = new Y.Map(this.element_id, {
            configure: {
                scrollWheelZoom: true,
                continuousZoom: true,
            }
        });

        // イベント関連付け
        this.map.bind("load", () => {
            setTimeout(() => {
                // 初期化イベント発行
                this.onInitHandler();

                // インターフェイス制御
                this.setUI(this.config.show_ui);

                // 初回APIリクエストを発行
                this.request();
            });
        });

        // 地図のレンダリング
        this.map.drawMap(new Y.LatLng(this.config.center.lat, this.config.center.lng), this.config.zoom, Y.LayerSetId.NORMAL);

        this.map.bind("moveend", () => {
            this.onMoveHandler();
        });

        this.map.bind("zoomend", () => {
            this.onZoomListener();
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
        this.map.setZoom(number, true, this.map.getCenter(), false)
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