import {IMapConfig} from '../entities/MapConfig'
import {IMapController} from "./IMapController";
import {MarkerData, IApiResponse, IMarkerData} from "../entities/Response";
import {IMarkerList, isIMarkerList} from "./IMarkers";
import {IController} from "./IController";
import {isArray, isNull, isString} from "../utils/Types";

export abstract class MapController<T extends Object> extends IMapController {

    private readonly root: IController;

    protected config: IMapConfig;

    protected element: Element;

    protected element_id: string;

    protected markers: { [key: string]: IMarkerList<T>; } = {};

    protected constructor(root: IController) {
        super();

        this.root = root;
        this.config = root.config;

        const element = document.querySelector(this.config.selector);

        if (element === null) {
            throw new Error("Cannot find element to display map");
        } else {
            let element_id = element.getAttribute("id");
            if (element_id === null || element_id === "") {
                do {
                    element_id = this.getUniqueID();
                } while (document.getElementById(element_id) !== null);
                element.setAttribute("id", element_id);
            }

            this.element_id = element_id;
            this.element = element;
        }
    }

    private getUniqueID(): string {
        return 'xxxx-xxxx-xxxxx-xxxxx'.replace(/[x]/g, function (c) {
            let r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * APIリクエストを実行
     */
    protected onApiRequestHandler() {
        clearTimeout(this.requestTimer);

        this.requestTimer = setTimeout(() => {
            this.request();
        }, this.config.lazy_load);
    }

    /**
     * APIにリクエストを送信する
     */
    protected request(): void {
        if (this.config.api_url.length === 0) {
            return;
        }

        const centre = this.getCenter();
        const zoom = this.getZoom();

        const request_url = this.config.api_url + "?lat=" + centre.lat.toFixed(5) + "&lng=" + centre.lng.toFixed(5) + "&zoom=" + zoom;

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    this.onApiReceiveListener(JSON.parse(xhr.responseText));
                }
            }
        };

        xhr.open("GET", request_url, true);
        xhr.send();
    }

    /**
     * APIの受信処理
     * @param json
     */
    protected onApiReceiveListener(json: IApiResponse) {
        if (isArray(json.data)) {
            for (let index = 0; index < json.data.length; index++) {
                this.addMarker(json.data[index]);
            }
        }
    }

    private requestTimer?: any;

    /**
     * 初期化完了イベントハンドラー
     */
    protected onInitHandler() {
        if (this.config.onInit) {
            this.config.onInit(this.root);
        }
        this.onChangeHandler();
    }

    private changeTimer?: any;

    /**
     * パラメータ変更イベントハンドラー
     */
    protected onChangeHandler() {
        clearTimeout(this.changeTimer);

        this.changeTimer = setTimeout(() => {
            if (this.config.onChange) {
                this.config.onChange(this.root);
            }
        }, 10);
    }

    /**
     * 中心点移動イベントハンドラー
     */
    protected onMoveHandler() {
        this.config.center = this.getCenter();
        if (this.config.onMove) {
            this.config.onMove(this.root, this.config.center);
        }
        this.onChangeHandler();
        this.onApiRequestHandler();
    }

    /**
     * 地図のズーム率変更イベントハンドラー
     */
    protected onZoomListener() {
        this.config.zoom = this.getZoom();
        if (this.config.onZoom) {
            this.config.onZoom(this.root, this.config.zoom);
        }
        this.onChangeHandler();
        this.onApiRequestHandler();
    }

    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    protected onUIListener(show: boolean) {
        this.config.show_ui = show;
        if (this.config.onUI) {
            this.config.onUI(this.root, this.config.show_ui,);
        }
        this.onChangeHandler();
    }

    /**
     * マーカークリック時イベントハンドラー
     * @param marker
     */
    protected onClickMarkerHandler(marker: IMarkerList<T>) {
        if (this.config.show_info) {
            this.openModal(marker);
        }

        if (this.config.onClickMarker) {
            this.config.onClickMarker(marker.marker, this.root);
        }
    }

    /**
     * モーダル表示用の継承メソッド
     * @param marker
     */
    protected abstract openModal(marker: IMarkerList<T>): void;

    /**
     * 地図を表示しているHTML要素を返却する
     */
    public getElement(): Element {
        return this.element;
    }

    /**
     * マーカーデータを生成する
     * @param marker
     */
    protected createMarker(marker: IMarkerData): IMarkerList<T> {
        let new_marker = new MarkerData(marker);
        const current_marker = this.findMarker(new_marker);

        if (current_marker !== null) {
            return current_marker;
        }

        return this.markers[new_marker.id] = {
            marker: new_marker,
            origin: null,
            display: false,
        };
    }

    /**
     * マーカー情報を取得する
     * @param id
     */
    public getMarker(id: string): IMarkerData | null {
        const m = this.findMarker(id);
        return m === null ? null : m.marker;
    }

    /**
     * 表示中のマーカーを中心点からの距離順にソートして返却する
     * @param limit
     */
    public getViewInMarkers(limit: number = 10): IMarkerData[] {
        const ms: MarkerData[] = [],
            bound = this.getBounds(),
            centre = this.getCenter();

        if (isNull(bound) || isNull(centre)) {
            return ms;
        }

        for (let id in this.markers) {
            const m = this.markers[id];

            if (!m.display) {
                continue;
            }

            if (!bound.inside(m.marker.coordinate)) {
                continue;
            }

            ms.push(m.marker);
        }

        ms.sort((a: MarkerData, b: MarkerData): number => {
            const ad = centre.distance(a.coordinate), bd = centre.distance(b.coordinate);
            if (ad < bd) {
                return -1;
            }

            if (ad > bd) {
                return 1;
            }

            return 0;
        });

        return ms.slice(0, limit);
    }

    protected findMarker(target: MarkerData): IMarkerList<T> | null;
    protected findMarker(target: IMarkerList<T>): IMarkerList<T> | null;
    protected findMarker(target: string): IMarkerList<T> | null
    protected findMarker(target: string | MarkerData | IMarkerList<T>): IMarkerList<T> | null {

        let id: string = "";

        if (isString(target)) {
            id = target as string;
        } else if (target instanceof MarkerData) {
            id = target.id;
        } else if (isIMarkerList<T>(target)) {
            id = target.marker.id;
        }

        if (id === "" || this.markers[id] === undefined) {
            return null;
        }

        return this.markers[id];
    }
}
