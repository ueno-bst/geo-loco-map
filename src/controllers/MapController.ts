import {IMapConfig} from '../entities/MapConfig'
import {IMapController} from "./IMapController";
import {MarkerData, IApiResponse, IMarkerData} from "../entities/Response";
import {IMarkerList, isIMarkerList} from "./IMarkers";
import {IController} from "./IController";
import {isArray, isExist, isFunction, isNull, isString} from "../utils/Types";

export abstract class MapController<T extends Object> extends IMapController {

    private readonly root: IController;

    protected config: IMapConfig;

    protected target: TargetElement;

    protected markers: { [key: string]: IMarkerList<T>; } = {};

    protected constructor(root: IController) {
        super();

        this.root = root;
        this.config = root.config;

        const element = document.querySelector(this.config.selector);

        if (element === null) {
            throw new Error("Cannot find element to display map");
        } else {
            this.target = new TargetElement(element);
        }
    }

    protected init() {
        // 初期化イベント発行
        this.onInitHandler();

        // コントロースの表示制御
        this.setUI(this.config.show_ui);

        // APIをリクエスト
        this.request();
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
            const before = Object.keys(this.markers).length;
            for (let index = 0; index < json.data.length; index++) {
                this.addMarker(json.data[index]);
            }
            const after = Object.keys(this.markers).length;

            if (before != after) {
                this.onAddMarkerHandler();
            }
        }
    }

    private requestTimer?: any;

    /**
     * 初期化完了イベントハンドラー
     */
    protected onInitHandler() {
        if (isFunction(this.config.onInit)) {
            this.config.onInit(this.root);
        }
        this.onChangeHandler();
    }

    /**
     * パラメータ変更イベントハンドラー
     */
    protected onChangeHandler() {
        if (isFunction(this.config.onChange)) {
            this.config.onChange(this.root);
        }
    }

    /**
     * 中心点移動イベントハンドラー
     */
    protected onMoveHandler() {
        this.config.center = this.getCenter();
        if (isFunction(this.config.onMove)) {
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
        if (isFunction(this.config.onZoom)) {
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
        if (isFunction(this.config.onUI)) {
            this.config.onUI(this.root, this.config.show_ui,);
        }
        this.onChangeHandler();
    }

    protected onAddMarkerHandler() {
        if (isFunction(this.config.onAddMarker)) {
            this.config.onAddMarker(this.root);
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
        return this.target.node;
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


class TargetElement {
    private readonly target: Element;

    private width: number = 0;
    private height: number = 0;

    get node(): Element {
        return this.target;
    }

    get id(): string {
        let id = this.node.getAttribute("id");
        return isExist<string>(id) ? id : "";
    }

    onResize?: (t: TargetElement) => void;

    constructor(target: Element) {
        // プロパティの初期化
        this.target = target;

        /**
         * リサイズ監視イベントを実装
         */
        setInterval(() => {
            this.resizeCheck();
        }, 300);

        /**
         * 要素にIDがない場合は、ユニークIDを生成して追加
         */
        let id = this.id;
        console.info(id);

        if (id == "") {
            // 種を作る
            let seed = "";
            do {
                seed = seed + "x";
            } while (seed.length < 16);

            // IDを生成して、重複要素がない
            do {
                id = "id-" + seed.replace(/[x]/g, function (c) {
                    let r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            } while (document.getElementById(id) !== null);

            // 要素に割り当て
            this.node.setAttribute("id", id);
        }

        console.info(id);
    }

    private resizeCheck() {
        const w = this.node.clientWidth;
        const h = this.node.clientHeight;

        if (this.width != w || this.height != h) {
            if (isFunction(this.onResize)) {
                this.onResize(this);
            }
        }

        this.width = w;
        this.height = h;
    }
}