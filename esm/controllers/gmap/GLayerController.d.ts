/// <reference types="googlemaps" />
import { ILayer, ILayerController } from "../ILayerController";
import { LatLng, LatLngBounds, Point, Rectangle } from "../../entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
import { GMapController } from "./GMapController";
declare const Layer: typeof google.maps.OverlayView;
declare class GLayer extends Layer implements ILayer {
    root: GLayerController;
    name: string;
    constructor(controller: GLayerController, name: string);
    onAdd: () => void;
    draw: () => void;
    onRemove: () => void;
}
export declare class GLayerController extends ILayerController {
    layer: GLayer;
    map: GMapController;
    constructor(map: GMapController, name: string);
    coordinateToPixel: (latlng: LatLng) => Point;
    boundToRect: (bounds: LatLngBounds) => Rectangle;
    refresh: () => this;
    remove: () => this;
    show: () => this;
    hide: () => this;
    target: (clickable: boolean) => ElementHelper | null;
    onAdd(): void;
    onDraw(): void;
    onRemove(): void;
}
export {};
//# sourceMappingURL=GLayerController.d.ts.map