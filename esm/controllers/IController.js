import { Config, MapType } from "./Config";
import { YMapController } from "./ymap/YMapController";
import { GMapController } from "./gmap/GMapController";
export default class IController {
    constructor(params) {
        // 実行パラメータを正規化
        this.config = new Config(params);
        switch (this.config.map_type) {
            case MapType.GoogleMap:
                this.controller = new GMapController(this);
                break;
            case MapType.YahooMap:
                this.controller = new YMapController(this);
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
//# sourceMappingURL=IController.js.map