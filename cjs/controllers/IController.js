"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
const YMapController_1 = require("./ymap/YMapController");
const GMapController_1 = require("./gmap/GMapController");
class IController {
    constructor(params) {
        // 実行パラメータを正規化
        this.config = new Config_1.Config(params);
        switch (this.config.map_type) {
            case Config_1.MapType.GoogleMap:
                this.controller = new GMapController_1.GMapController(this);
                break;
            case Config_1.MapType.YahooMap:
                this.controller = new YMapController_1.YMapController(this);
                break;
            default:
                throw new Error("Unable to initialize due to map type error.");
        }
    }
    on(event, callback) {
        this.controller.emit.on(event, callback);
        return this;
    }
    off(event, callback) {
        this.controller.emit.off(event, callback);
        return this;
    }
}
exports.default = IController;
//# sourceMappingURL=IController.js.map