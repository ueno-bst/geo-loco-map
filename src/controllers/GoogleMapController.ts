import {ILatLng, ILatLngBound, LatLng, LatLngBound} from "../entities/LatLng";
import {MapController} from "./MapController";
import {IMarkerData} from "../entities/Response";
import {IMarkerList} from "./IMarkers";
import {IController} from "./IController";


export class GoogleMapController extends MapController<google.maps.Marker> {

    /**
     * 地図オブジェクト
     */
    private readonly map: google.maps.Map;

    constructor(root: IController) {
        super(root);

        // 地図をレンダリング
        this.map = new google.maps.Map(this.element, {
                center: {lat: this.config.center.lat, lng: this.config.center.lng},
                scrollwheel: true,
                zoom: this.config.zoom,
                disableDefaultUI: !this.config.show_ui,
            }
        );

        // 地図の中心点変更時イベントを登録
        google.maps.event.addListenerOnce(this.map, "idle", () => {
            // 初期化イベント発行
            this.onInitHandler();

            // コントロースの表示制御
            this.setUI(this.config.show_ui);

            // APIをリクエスト
            this.request();
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
    }

    getBounds(): LatLngBound | null {
        const bound = this.map.getBounds();

        if (bound instanceof google.maps.LatLngBounds) {
            const
                ne = bound.getNorthEast(),
                sw = bound.getSouthWest();

            return new LatLngBound(
                {lat: ne.lat(), lng: ne.lng()},
                {lat: sw.lat(), lng: sw.lng()},
            );
        }

        return null;
    }

    getZoom(): number {
        return this.map.getZoom();
    }

    setZoom(zoom: number): void {
        this.map.setZoom(zoom);
    }

    getCenter(): LatLng {
        const center = this.map.getCenter();
        return new LatLng(center.lat(), center.lng());
    }

    setCenter(center: ILatLng): void {
        this.map.setCenter(new google.maps.LatLng(center.lat, center.lng))
    }

    addMarker(marker: IMarkerData): IMarkerData {
        const m = this.createMarker(marker);

        if (m.origin === null) {
            m.origin = new google.maps.Marker({
                position: new google.maps.LatLng(m.marker.lat, m.marker.lng),
                label: m.marker.label,
            });

            m.origin.addListener("click", () => {
                this.onClickMarkerHandler(m);
            });
        }

        if (!m.display && m.marker.display()) {
            m.display = true;
            m.origin.setMap(this.map);
        }

        return m.marker;
    }

    removeMarker(id: string): boolean {
        const m = this.findMarker(id);

        if (m !== null && m.origin !== null) {
            m.display = false;
            m.origin.setMap(null);
            return true;
        }

        return false;
    }

    setUI(show: boolean): void {
        this.map.setOptions({
            disableDefaultUI: !show
        });

        this.onUIListener(show);
    }

    /**
     * モーダルを開く
     * @param marker
     */
    protected openModal(marker: IMarkerList<google.maps.Marker>): void {
        const
            content = marker.marker.content();

        if (marker.origin instanceof google.maps.Marker && content !== "") {
            let info = new google.maps.InfoWindow({
                content: content,
            });

            info.open(this.map, marker.origin);
        }
    }
}