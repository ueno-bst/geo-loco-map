import {ILatLng, ILatLngBound} from "./entities/LatLng";
import {IMarkerData} from "./entities/Response";
import {IController} from "./controllers/IController";


export class GeoLocoMap extends IController {

    getElement(): Element {
        return this.controller.getElement();
    }

    getBounds(): ILatLngBound | null {
        return this.controller.getBounds();
    }

    getZoom(): number {
        return this.config.zoom;
    }

    setZoom(zoom: number): void {
        return this.controller.setZoom(Math.min(20, Math.max(1, zoom)));
    }

    getCenter() {
        return this.config.center;
    }

    setCenter(lat: number, lng: number) {
        return this.controller.setCenter({lat: lat, lng: lng});
    }

    addMarker(marker: IMarkerData): IMarkerData {
        return this.controller.addMarker(marker);
    }

    hasMarker(id: string): boolean {
        return this.getMarker(id) !== null;
    }

    getMarker(id: string): IMarkerData | null {
        return this.controller.getMarker(id);
    }

    removeMarker(id: string): boolean {
        return this.controller.removeMarker(id)
    }

    getViewInMarkers(limit: number = 10) {
        return this.controller.getViewInMarkers(limit);
    }

    getUI(): boolean {
        return this.config.show_ui;
    }

    setUI(flag: boolean): void {
        if (this.config.show_ui != flag) {
            return this.controller.setUI(flag);
        }
    }

    getInfo(): boolean {
        return this.config.show_info;
    }

    setInfo(flag: boolean): void {
        if (this.config.show_info != flag) {
            this.config.show_info = flag;
        }
    }
}

