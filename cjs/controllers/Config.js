"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.ApiType = exports.MapType = void 0;
const LatLng_1 = require("../entities/LatLng");
const JsonHelper_1 = require("../utils/JsonHelper");
var MapType;
(function (MapType) {
    MapType["GoogleMap"] = "google";
    MapType["YahooMap"] = "yahoo";
})(MapType = exports.MapType || (exports.MapType = {}));
var ApiType;
(function (ApiType) {
    ApiType["CENTER"] = "center";
    ApiType["BOUNDS"] = "bounds";
})(ApiType = exports.ApiType || (exports.ApiType = {}));
class Config {
    constructor(data) {
        const helper = JsonHelper_1.JsonHelper, llb = LatLng_1.LatLngBounds, ll = LatLng_1.LatLng;
        this.center = new ll(data.center);
        if (llb.is(data.center_bound)) {
            this.center_bound = new LatLng_1.LatLngBounds(data.center_bound);
        }
        this.map_type = helper.asEnum(MapType, data.map_type, MapType.GoogleMap);
        this.selector = data.selector instanceof HTMLElement ? data.selector : helper.asStr(data.selector, "#map");
        this.api = new ConfigApi(data.api || {});
        this.show_ui = helper.asBool(data.show_ui, true);
        this.show_info = helper.asBool(data.show_info, true);
        this.zoom = helper.asNum(data.zoom, 9);
        this.zoom_min = helper.asNum(data.zoom_min, 0);
        this.zoom_max = helper.asNum(data.zoom_max, 99);
        this.debug = helper.asBool(data.debug, false);
        this.onInit = data.onInit;
        this.onChange = data.onChange;
        this.onInfo = data.onInfo;
        this.onMove = data.onMove;
        this.onZoom = data.onZoom;
        this.onUI = data.onUI;
        this.onAddMarker = data.onAddMarker;
        this.onClickMarker = data.onClickMarker;
        this.onHideMarker = data.onHideMarker;
        this.onRequest = data.onRequest;
    }
}
exports.Config = Config;
class ConfigApi {
    constructor(data) {
        const helper = JsonHelper_1.JsonHelper;
        this.url = helper.asStr(data.url, "");
        this.user = helper.asStr(data.user, "");
        this.password = helper.asStr(data.password, "");
        this.type = helper.asEnum(ApiType, data.type, ApiType.CENTER);
        this.precision = helper.asNum(data.precision, 10);
        this.delay = helper.asNum(data.delay, 10);
        this.auto = helper.asBool(data.auto, true);
    }
}
//# sourceMappingURL=Config.js.map