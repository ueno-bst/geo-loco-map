import { IMarkerData, IResponse, MarkerData } from "../entities/Response";
import { LatLng, LatLngBounds } from "../entities/LatLng";
import { MapEventType } from "./MapEventType";
import EventEmitter from "../utils/EventEmitter";
import { MapElement } from "./Element";
import { IDebugLayerController, IGridLayerController, ILayerController, IMessageLayerController } from "./ILayerController";
import IController from "../controllers/IController";
import { Config } from "./Config";
export interface ILayers {
    grid: IGridLayerController;
    load: ILayerController;
    message: IMessageLayerController;
    debug?: {
        request: IDebugLayerController;
        response: IDebugLayerController;
    };
}
export declare abstract class MapController<M extends Object = {}, T extends Object = {}> {
    /**
     * ルートコントローラ
     */
    protected readonly root: IController;
    get config(): Config;
    /**
     * 地図オブジェクト
     */
    protected readonly abstract map: M;
    getMap: () => M;
    /**
     * レイヤー定義
     */
    protected readonly abstract layers: ILayers;
    /**
     * イベントエミッタ
     */
    readonly emit: EventEmitter<HTMLElement, [IController, ...any[]]>;
    protected target: MapElement;
    private xhr;
    protected currentBounds: LatLngBounds | null;
    protected currentZoom: number | null;
    protected constructor(root: IController);
    protected init(): void;
    fire(type: MapEventType, change: boolean, ...args: any): void;
    /**
     * APIリクエストを遅延実行
     */
    protected apiRequestAwait(): void;
    /**
     * APIにリクエストを送信する
     */
    apiRequest(): void;
    /**
     * APIの受信処理
     * @param json
     */
    protected apiResponse(json: IResponse): void;
    private requestTimer?;
    /**
     * パラメータ変更イベントハンドラー
     */
    protected onChangeHandler(): void;
    /**
     * 中心点移動イベントハンドラー
     */
    protected onMoveHandler(): void;
    /**
     * 地図のズーム率変更イベントハンドラー
     */
    protected onZoomListener(): void;
    /**
     * UIコントローラー表示状態変更イベントハンドラー
     * @param show
     */
    protected onUIListener(show: boolean): void;
    /**
     * モーダル表示用の継承メソッド
     * @param markers
     */
    protected abstract openModal(markers: MarkerData[]): void;
    /**
     * 表示している地図の矩形領域を返却する
     */
    abstract getBounds(): LatLngBounds | null;
    /**
     * 地図の指定の矩形領域に収まるように表示する
     * @param bounds
     */
    abstract setBounds(bounds: LatLngBounds): void;
    /**
     * 地図の表示要素を取得する
     */
    getElement(): Element;
    /**
     * マップのズーム率を取得する
     */
    abstract getZoom(): number;
    /**
     * マップのズーム率を変更する
     */
    abstract setZoom(zoom: number): void;
    /**
     * マップの中心座標を取得する
     */
    abstract getCenter(): LatLng;
    /**
     * マップの中心座標を変更する
     * @param center
     */
    abstract setCenter(center: LatLng): void;
    /**
     * マップにマーカーを追加する
     */
    addMarker: (...markers: IMarkerData[]) => void;
    /**
     * マーカー情報を取得する
     * @param id
     */
    getMarker: (id: string) => IMarkerData | null;
    /**
     * 表示中のマーカーを中心点からの距離順にソートして返却する
     * @param limit
     */
    getDisplayMarkers: (limit?: number) => IMarkerData[];
    /**
     * マーカーを削除する
     */
    removeMarker: (...ids: string[]) => number;
    /**
     * コントロールの表示状態を設定する
     */
    abstract setUI(show: boolean): void;
}
//# sourceMappingURL=MapController.d.ts.map