import {LatLng, LatLngBounds} from "../../entities/LatLng";
import {ILayers, MapController} from "../MapController";
import {MarkerData} from "../../entities/Response";
import {IController} from "../IController";
import {GDebugLayer, GGridMarkerLayer, GLoadingLayer, GMessageLayer} from "./GLayer";
import {isNumber} from "../../utils/Types";

const
    is_number = isNumber;

export class GMapController extends MapController<google.maps.Map, google.maps.Marker> {

    protected readonly map: google.maps.Map;

    protected readonly layers: ILayers;

    constructor(root: IController) {
        super(root);

        // 地図をレンダリング
        const mapConfig: google.maps.MapOptions = {
            center: {lat: this.config.center.lat, lng: this.config.center.lng},
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
            grid: new GGridMarkerLayer(this, "grid"),
            load: new GLoadingLayer(this, "loading"),
            message: new GMessageLayer(this, "message"),
        };

        if (this.config.debug) {
            this.layers.debug = {
                response: new GDebugLayer(this, "response").setClasses("gl-response"),
                request: new GDebugLayer(this, "request").setClasses("gl-request"),
            }
        }
    }

    getBounds(): LatLngBounds | null {
        const bound = this.map.getBounds();

        if (bound instanceof google.maps.LatLngBounds) {
            return new LatLngBounds(bound);
        }

        return null;
    }

    setBounds(bounds: LatLngBounds): void {
        this.map.fitBounds(bounds.gmap());
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

    setUI(show: boolean): void {
        this.map.setOptions({
            disableDefaultUI: !show
        });

        this.onUIListener(show);
    }

    /**
     * モーダルを開く
     * @param markers
     */
    protected openModal(markers: MarkerData[]): void {
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