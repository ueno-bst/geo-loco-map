import IController from "../controllers/IController";
import {ILatLng} from "../entities/LatLng";
import {URLBuilder} from "@ueno-bst/url-builder";
import {IMarkerData, IResponse} from "../entities/Response";

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
    init: (ctrl: IController) => void,
    change: (ctrl: IController) => void,
    move: (ctrl: IController, coordinate: ILatLng) => void,
    zoom: (ctrl: IController, zoom: number) => void,
    ui: (ctrl: IController, flag: boolean) => void,
    info: (ctrl: IController, flag: boolean) => void,
    request: (ctrl: IController, url: URLBuilder) => void,
    response: (ctrl: IController, json: IResponse) => void,
    "marker.add": (ctrl: IController) => void,
    "marker.hide": (ctrl: IController, marker: IMarkerData) => void,
    "marker.active": (ctrl: IController, refs: string[]) => void,
    "marker.disable": (ctrl: IController, refs: string[]) => void,
    "marker.hover": (ctrl: IController, refs: string[]) => void,
}
