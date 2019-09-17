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

    setZoom(number: number): void {
        return this.controller.setZoom(number);
    }

    getCenter() {
        return this.config.center;
    }

    setCenter(coordinate: ILatLng) {
        return this.controller.setCenter(coordinate);
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

    getViewInMarkers(limit:number = 10) {
        return this.controller.getViewInMarkers(limit);
    }

    setUI(flag: boolean): void {
        return this.controller.setUI(flag);
    }
}

