import { LatLng } from "./entities/LatLng";
import IController from "./controllers/IController";
export class GeoLocoMap extends IController {
    constructor(config) {
        super(config);
    }
    request() {
        this.controller.apiRequest();
    }
    getElement() {
        return this.controller.getElement();
    }
    getBounds() {
        return this.controller.getBounds();
    }
    getZoom() {
        return this.config.zoom;
    }
    setZoom(zoom) {
        return this.controller.setZoom(Math.min(20, Math.max(1, zoom)));
    }
    getCenter() {
        return this.config.center;
    }
    setCenter(lat, lng) {
        return this.controller.setCenter(new LatLng(lat, lng));
    }
    addMarker(...markers) {
        // ユーザー用マーカーとして認識する
        for (let marker of markers) {
            marker.user = true;
        }
        return this.controller.addMarker(...markers);
    }
    hasMarker(id) {
        return this.getMarker(id) !== null;
    }
    getMarker(id) {
        return this.controller.getMarker(id);
    }
    removeMarker(...ids) {
        return this.controller.removeMarker(...ids);
    }
    getViewInMarkers(limit = 10) {
        return this.controller.getDisplayMarkers(limit);
    }
    getUI() {
        return this.config.show_ui;
    }
    setUI(flag) {
        if (this.config.show_ui != flag) {
            return this.controller.setUI(flag);
        }
    }
    getInfo() {
        return this.config.show_info;
    }
    setInfo(flag) {
        if (this.config.show_info != flag) {
            this.config.show_info = flag;
        }
    }
    on(event, callback) {
        return super.on(event, callback);
    }
    off(event, callback) {
        return super.off(event, callback);
    }
}
export default GeoLocoMap;
//# sourceMappingURL=index.js.map