import {IMarkerData} from "./entities/Response";
import {IController} from "./controllers/IController";
import {ILatLng, ILatLngBounds, LatLng} from "./entities/LatLng";

export class GeoLocoMap extends IController {

    request(): void {
        this.controller.apiRequest();
    }

    getElement(): Element {
        return this.controller.getElement();
    }

    getBounds(): ILatLngBounds | null {
        return this.controller.getBounds();
    }

    getZoom(): number {
        return this.config.zoom;
    }

    setZoom(zoom: number): void {
        return this.controller.setZoom(Math.min(20, Math.max(1, zoom)));
    }

    getCenter(): ILatLng {
        return this.config.center;
    }

    setCenter(lat: number, lng: number) {
        return this.controller.setCenter(new LatLng(lat, lng));
    }

    addMarker(...markers: IMarkerData[]): void {
        // ユーザー用マーカーとして認識する
        for (let marker of markers) {
            marker.user = true;
        }

        return this.controller.addMarker(...markers);
    }

    hasMarker(id: string): boolean {
        return this.getMarker(id) !== null;
    }

    getMarker(id: string): IMarkerData | null {
        return this.controller.getMarker(id);
    }

    removeMarker(...ids: string[]): number {
        return this.controller.removeMarker(...ids)
    }

    getViewInMarkers(limit: number = 10) {
        return this.controller.getDisplayMarkers(limit);
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