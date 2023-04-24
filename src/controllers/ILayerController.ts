import {LatLng, LatLngBounds, Point, Rectangle} from "../entities/LatLng";
import ElementHelper from "../utils/ElementHelper";
import {MapController} from "./MapController";
import {IBoundData, IMarkerData, MarkerData} from "../entities/Response";

export interface ILayer {
    /**
     * 親レイヤーコントローラー
     */
    root?: ILayerController;
}

export abstract class ILayerController {
    abstract map: MapController<Object>;
    abstract layer: ILayer;

    constructor() {
        this.init();
    }

    /**
     * オブジェクトの初期化処理
     */
    init(): void {
    }

    /**
     * レイヤーの再描写
     */
    abstract refresh(): this;

    /**
     * レイヤー削除実行
     */
    abstract remove(): this;

    abstract show(): this;

    abstract hide(): this;

    /**
     * レイヤーラッパーを取得する
     * @param clickable
     */
    abstract target(clickable: boolean): ElementHelper | null;

    /**
     * 空間座標をピクセル座標に変換する
     * @param latlng
     */
    abstract coordinateToPixel(latlng: LatLng): Point;

    /**
     * 空間座標矩形をピクセル矩形に変換する
     * @param bounds
     */
    abstract boundToRect(bounds: LatLngBounds): Rectangle;

    /**
     * レイヤー初期化時の処理を行う
     */
    abstract onAdd(): void;

    /**
     * レイヤー更新時の処理を行う
     */
    abstract onDraw(): void;

    /**
     * レイヤー削除処理
     */
    abstract onRemove(): void;
}

export abstract class IMessageLayerController extends ILayerController {
    /**
     * HTMLをメッセージとして出力する
     * @param html
     */
    abstract html(html?: string): string | void;

    /**
     * プレインテキストをメッセージとして出力する
     * @param text
     */
    abstract text(text?: string): string | void;
}

export abstract class IGridLayerController extends ILayerController {
    /**
     * 範囲要素を追加する
     * @param bounds
     */
    abstract addBound(...bounds: IBoundData[]): void;

    /**
     * マーカー要素を追加する
     * @param markers
     */
    abstract addMarker(...markers: IMarkerData[]): void;

    /**
     * マーカー情報を取得する
     * @param id
     */
    abstract getMarker(id: string): MarkerData | null;

    /**
     * 表示中のマーカー情報のみ取得する
     * @param limit
     */
    abstract getDisplayMarkers(limit: number): MarkerData[];

    /**
     * マーカーグループ内にあるマーカーリストを取得する
     * @param id
     */
    abstract getGroupInMarker(id: string): MarkerData[];

    /**
     * 指定のマーカー情報を削除する
     * @param ids
     */
    abstract removeMarker(...ids: string[]): number;

    /**
     * レイヤー内の地物全てを削除する
     */
    abstract clear(): void;
}

export abstract class IDebugLayerController extends ILayerController {
    abstract setClasses(...classes: string[]): this;

    abstract setBound(rectangle: LatLngBounds): this;
}
