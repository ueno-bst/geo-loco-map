/// <reference types="googlemaps" />
import { LatLng, LatLngBounds } from "../entities/LatLng";
import { MapController } from "./MapController";
import { IBoundGridContentData, IBoundGridData, IMarkerData } from "../entities/Response";
import { IMarkerList } from "./IMarkers";
import { IController } from "./IController";
export declare class GoogleMapController extends MapController<google.maps.Marker> {
    private readonly map;
    private readonly _grid;
    private readonly _msg;
    private readonly _loading;
    constructor(root: IController);
    getBounds(): LatLngBounds | null;
    getZoom(): number;
    setZoom(zoom: number): void;
    getCenter(): LatLng;
    setCenter(center: LatLng): void;
    addMarker(marker: IMarkerData): IMarkerData;
    removeMarker(id: string): boolean;
    setUI(show: boolean): void;
    protected openModal(marker: IMarkerList<google.maps.Marker>): void;
    addGrids(grids: IBoundGridData[]): void;
    addGridContents(contents: IBoundGridContentData[]): void;
    removeGrids(): void;
    setMessage(message: string, show: boolean): void;
    showMessage(): void;
    hideMessage(): void;
    showLoading(): void;
    hideLoading(): void;
}
