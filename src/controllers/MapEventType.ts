import IController from "~/controllers/IController";
import {ILatLng} from "~/entities/LatLng";
import {URLBuilder} from "~/utils/URLBuilder";
import {IMarkerData, IResponse} from "~/entities/Response";

export enum MapEventType {
    /**
     * 地図の起動が完了したイベント
     */
    INIT = "init",
    /**
     * 地図内のなにかが変更された際に実行されるイベント
     */
    CHANGE = "change",
    /**
     * 地図の座標移動が行われたイベント
     */
    MOVE = "move",
    /**
     * 地図の表示縮尺が変更された際に発行されるイベント
     */
    ZOOM = "zoom",
    /**
     * UIの表示状態が変更された際に発行されるイベント
     */
    UI = "ui",
    info = "info",
    /**
     * マーカーが追加された際に発行されるイベント
     */
    MARKER_ADD = "marker.add",
    /**
     * マーカーが削除された際に発行されるイベント
     */
    MARKER_HIDE = "marker.hide",
    /**
     * マーカーが選択された際に発行されるイベント
     */
    MARKER_SELECT = "marker.active",
    /**
     * マーカーが選択解除された際に発行されるイベント
     */
    MARKER_RELEASE = "marker.disable",
    /**
     * マーカーにカーソルが当たった際に発行されるイベント
     */
    MARKER_HOVER = "marker.hover",
    /**
     * APIのリクエストが実行される際に発行されるイベント
     */
    API_REQUEST = "request",
    /**
     * APIのレスポンスを受信した際に発行されるイベント
     */
    API_RESPONSE = "response",
}

export interface MapEventListener {
    (c: IController, ...args: any[]): void;
}

export type MapEventMap = {
    [MapEventType.INIT]: (ctrl: IController) => void,
    [MapEventType.CHANGE]: (ctrl: IController) => void,
    [MapEventType.MOVE]: (ctrl: IController, coordinate: ILatLng) => void,
    [MapEventType.ZOOM]: (ctrl: IController, zoom: number) => void,
    [MapEventType.UI]: (ctrl: IController, flag: boolean) => void,
    [MapEventType.info]: (ctrl: IController, flag: boolean) => void,
    [MapEventType.API_REQUEST]: (ctrl: IController, url: URLBuilder) => void,
    [MapEventType.API_RESPONSE]: (ctrl: IController, json: IResponse) => void,
    [MapEventType.MARKER_ADD]: (ctrl: IController) => void,
    [MapEventType.MARKER_HIDE]: (ctrl: IController, marker: IMarkerData) => void,
    [MapEventType.MARKER_SELECT]: (ctrl: IController, refs: string[]) => void,
    [MapEventType.MARKER_RELEASE]: (ctrl: IController, refs: string[]) => void,
    [MapEventType.MARKER_HOVER]: (ctrl: IController, refs: string[]) => void,
}
