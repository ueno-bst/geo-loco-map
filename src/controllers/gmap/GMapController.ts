import {LatLng, LatLngBounds} from "../../entities/LatLng";
import {MapController} from "../MapController";
import {IBoundGridContentData, IBoundGridData, IMarkerData} from "../../entities/Response";
import {IMarkerList} from "../IMarkers";
import {IController} from "../IController";
import {GridFeatureLayer, LoadingLayer, MessageLayer} from "./Layer";
import {isNumber} from "../../utils/Types";

const
    is_number = isNumber;

export class GMapController extends MapController<google.maps.Marker> {

    /**
     * 地図オブジェクト
     */
    private readonly map: google.maps.Map;

    private readonly _grid: GridFeatureLayer;

    private readonly _msg: MessageLayer;

    private readonly _loading: LoadingLayer;

    constructor(root: IController) {
        super(root);

        // 地図をレンダリング
        const mapConfig: google.maps.MapOptions = {
            center: {lat: this.config.center.lat, lng: this.config.center.lng},
            scrollwheel: true,
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

        // test
        this._msg = new MessageLayer(this.map);
        this._loading = new LoadingLayer(this.map);
        this._grid = new GridFeatureLayer(this.map);
    }

    getBounds(): LatLngBounds | null {
        const bound = this.map.getBounds();

        if (bound instanceof google.maps.LatLngBounds) {
            return new LatLngBounds(bound);
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
        return new LatLng(this.map.getCenter());
    }

    setCenter(center: LatLng): void {
        this.map.setCenter(center.gmap());
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

    public addGrids(grids: IBoundGridData[]): void {
        this._grid.addBounds(grids);
    }

    public addGridContents(contents: IBoundGridContentData[]): void {
        this._grid.addMarkers(contents);
    }

    public removeGrids(): void {
        this._grid.removeBounds();
    }

    public setMessage(message: string, show: boolean): void {
        this._msg.setHtml(message);

        if (show) {
            this.showMessage();
        }
    }

    public showMessage(): void {
        this._msg.show();
    }

    public hideMessage(): void {
        this._msg.hide();
    }

    public showLoading(): void {
        this._loading.show();
    }

    public hideLoading(): void {
        this._loading.hide();
    }
}