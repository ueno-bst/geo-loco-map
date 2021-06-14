import {IController} from "./IController";

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
     * ピンマーカーが追加された際に発行されるイベント
     */
    MARKER_ADD = "marker.add",
    /**
     * ピンマーカーが削除された際に発行されるイベント
     */
    MARKER_HIDE = "marker.hide",
    /**
     * ピンマーカーが選択された際に発行されるイベント
     */
    MARKER_SELECT = "marker.active",
    /**
     * ピンマーカーが選択解除された際に発行されるイベント
     */
    MARKER_RELEASE = "marker.disable",
    /**
     * ピンマーカーにカーソルが当たった際に発行されるイベント
     */
    MARKER_HOVER = "marker.hover",
    /**
     * グリッドマーカーが追加された際に発行されるイベント
     */
    GRID_ADD = "grid.add",
    /**
     * グリッドマーカーが削除された際に発行されるイベント
     */
    GRID_HIDE = "grid.hide",
    /**
     * グリッドマーカーが選択された際に発行されるイベント
     */
    GRID_SELECT = "grid.active",
    /**
     * グリッドマーカーが選択解除された際に発行されるイベント
     */
    GRID_RELEASE = "grid.disable",
    /**
     * グリッドマーカーが選択解除された際に発行されるイベント
     */
    GRID_HOVER = "grid.hover",
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