export var MapEventType;
(function (MapEventType) {
    /**
     * 地図の起動が完了したイベント
     */
    MapEventType["INIT"] = "init";
    /**
     * 地図内のなにかが変更された際に実行されるイベント
     */
    MapEventType["CHANGE"] = "change";
    /**
     * 地図の座標移動が行われたイベント
     */
    MapEventType["MOVE"] = "move";
    /**
     * 地図の表示縮尺が変更された際に発行されるイベント
     */
    MapEventType["ZOOM"] = "zoom";
    /**
     * UIの表示状態が変更された際に発行されるイベント
     */
    MapEventType["UI"] = "ui";
    MapEventType["info"] = "info";
    /**
     * ピンマーカーが追加された際に発行されるイベント
     */
    MapEventType["MARKER_ADD"] = "marker.add";
    /**
     * ピンマーカーが削除された際に発行されるイベント
     */
    MapEventType["MARKER_HIDE"] = "marker.hide";
    /**
     * ピンマーカーが選択された際に発行されるイベント
     */
    MapEventType["MARKER_SELECT"] = "marker.active";
    /**
     * ピンマーカーが選択解除された際に発行されるイベント
     */
    MapEventType["MARKER_RELEASE"] = "marker.disable";
    /**
     * ピンマーカーにカーソルが当たった際に発行されるイベント
     */
    MapEventType["MARKER_HOVER"] = "marker.hover";
    /**
     * グリッドマーカーが追加された際に発行されるイベント
     */
    MapEventType["GRID_ADD"] = "grid.add";
    /**
     * グリッドマーカーが削除された際に発行されるイベント
     */
    MapEventType["GRID_HIDE"] = "grid.hide";
    /**
     * グリッドマーカーが選択された際に発行されるイベント
     */
    MapEventType["GRID_SELECT"] = "grid.active";
    /**
     * グリッドマーカーが選択解除された際に発行されるイベント
     */
    MapEventType["GRID_RELEASE"] = "grid.disable";
    /**
     * グリッドマーカーが選択解除された際に発行されるイベント
     */
    MapEventType["GRID_HOVER"] = "grid.hover";
    /**
     * APIのリクエストが実行される際に発行されるイベント
     */
    MapEventType["API_REQUEST"] = "request";
    /**
     * APIのレスポンスを受信した際に発行されるイベント
     */
    MapEventType["API_RESPONSE"] = "response";
})(MapEventType || (MapEventType = {}));
//# sourceMappingURL=MapEventType.js.map