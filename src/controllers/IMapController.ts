import {ILatLng, LatLng, LatLngBound} from "../entities/LatLng";
import {IMarkerData} from "../entities/Response";


export abstract class IMapController {

    /**
     * 表示している地図の矩形領域を返却する
     */
    public abstract getBounds(): LatLngBound | null;

    /**
     * 地図の表示要素を取得する
     */
    public abstract getElement(): Element

    /**
     * マップのズーム率を取得する
     */
    public abstract getZoom(): number;

    /**
     * マップのズーム率を変更する
     */
    public abstract setZoom(zoom: number): void;

    /**
     * マップの中心座標を取得する
     */
    public abstract getCenter(): LatLng;

    /**
     * マップの中心座標を変更する
     * @param center
     */
    public abstract setCenter(center: ILatLng): void;

    /**
     * マップにマーカーを追加する
     */
    public abstract addMarker(marker: IMarkerData): IMarkerData;

    public abstract getMarker(id: string): IMarkerData | null;

    /**
     * マーカーを削除する
     */
    public abstract removeMarker(id: string): boolean;

    /**
     * コントロールの表示状態を設定する
     */
    public abstract setUI(show: boolean): void;

    public abstract getViewInMarkers(limit: number): IMarkerData[];
}