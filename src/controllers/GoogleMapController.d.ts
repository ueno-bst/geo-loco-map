import { MapConfig } from '../entities/Maps';
import { ICoordinate } from "../entities/Coordinate";
import { MapController } from "./MapController";
export declare class GoogleMapController extends MapController {
    private g;
    constructor(config: MapConfig);
    markerEvent(i: number): void;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): ICoordinate;
    setCenter(center: ICoordinate): void;
    addMarker(coordinate: ICoordinate): boolean;
    deleteMarker(id: number): void;
    setControl(flag: boolean): void;
    marker(response: any, id?: number): void;
    escapeHtml(str: string): string;
    markerConvert(res: any, id?: number): any;
    apiRequest(): void;
}
//# sourceMappingURL=GoogleMapController.d.ts.map