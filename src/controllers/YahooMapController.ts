import {LatLng, LatLngBounds} from "../entities/LatLng";
import {MapController} from "./MapController";
import {IBoundGridContentData, IBoundGridData, IMarkerData} from "../entities/Response";
import {IMarkerList} from "./IMarkers";
import {IController} from "./IController";
import {isNumber, isUndefined} from "../utils/Types";
import {GridFeatureLayer, LoadingLayer, MessageLayer} from "./yolp/Layer";

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

    private readonly _grid: GridFeatureLayer;

    private readonly _msg: MessageLayer;

    private readonly _loading: LoadingLayer;

    constructor(root: IController) {
        super(root);

        // 表示するインターフェイスを初期化
        this.yc.push(
            new Y.SliderZoomControlVertical(),
            new Y.LayerSetControl(),
            new Y.ScaleControl(),
        );

        // 地図を初期化
        this.map = new Y.Map(this.target.getID(), {
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

        // test
        this._grid = new GridFeatureLayer('grid');
        this.map.addLayer(this._grid);

        this._msg = new MessageLayer('message');
        this.map.addLayer(this._msg);
        this._msg.hide();

        this._loading = new LoadingLayer('loading');
        this.map.addLayer(this._loading);
        // this._loading.hide();

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
        this.target.on("resize", this.map.updateSize, this.map);
    }

    getBounds(): LatLngBounds | null {
        const bound = this.map.getBounds();

        if (bound instanceof Y.LatLngBounds) {
            return new LatLngBounds(bound);
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
        return new LatLng(this.map.getCenter());
    }

    setCenter(coordinate: LatLng) {
        this.map.drawMap(coordinate.yolp(), this.getZoom(), Y.LayerSetId.NORMAL)
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
        for (let yc of this.yc) {
            if (show) {
                this.map.addControl(yc);
            } else {
                this.map.removeControl(yc);
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
        this._msg.setMessage(message);

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