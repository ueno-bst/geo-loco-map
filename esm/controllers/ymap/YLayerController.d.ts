/// <reference types="yahoo" />
import { ILayer, ILayerController } from "../ILayerController";
import { LatLng, LatLngBounds, Point, Rectangle } from "../../entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
import { YMapController } from "./YMapController";
declare const Layer: {
    new (...args: any[]): {
        root?: ILayerController | undefined;
        drawLayer: (force: boolean) => void;
        remove: () => void;
        container: any;
        copyrightCollection: Y.CopyrightCollection;
        initialized: boolean;
        map: Y.Map | null;
        name: string;
        options: object;
        zIndex: number;
        bind(type: string, fn: Function, object?: Object | undefined): Y.EventListener;
        draw(): void;
        initialize(): void;
        isInitialized(): boolean;
        isSystemLayer(): boolean;
        isDrawn(): boolean;
        show(): void;
        hide(): void;
        isHidden(): boolean;
        fromContainerPixelToLatLng(p: Y.Point): Y.LatLng;
        fromDivPixelToLatLng(p: Y.Point): Y.LatLng;
        fromLatLngsToDivPixels(latlngs: Y.LatLng[], offset?: Y.Point | undefined): Y.Point[];
        fromLatLngToContainerPixel(g: Y.LatLng): Y.Point;
        fromLatLngToDivPixel(latlng: Y.LatLng): Y.Point;
        fromTileToLatLng(tx: number, ty: number, x: number, y: number): void;
        getContainer(): JQuery;
        getCopyrightCollection(): Y.CopyrightCollection;
        getMap(): Y.Map;
        getMapContainer(): JQuery;
        hasFeature(): boolean;
    };
} & typeof Y.Layer;
declare const FeatureLayer: {
    new (...args: any[]): {
        root?: ILayerController | undefined;
        drawLayer: (force: boolean) => void;
        remove: () => void;
        container: any;
        copyrightCollection: Y.CopyrightCollection;
        initialized: boolean;
        map: Y.Map | null;
        name: string;
        options: object;
        zIndex: number;
        bind(type: string, fn: Function, object?: Object | undefined): Y.EventListener;
        draw(): void;
        initialize(): void;
        isInitialized(): boolean;
        isSystemLayer(): boolean;
        isDrawn(): boolean;
        show(): void;
        hide(): void;
        isHidden(): boolean;
        fromContainerPixelToLatLng(p: Y.Point): Y.LatLng;
        fromDivPixelToLatLng(p: Y.Point): Y.LatLng;
        fromLatLngsToDivPixels(latlngs: Y.LatLng[], offset?: Y.Point | undefined): Y.Point[];
        fromLatLngToContainerPixel(g: Y.LatLng): Y.Point;
        fromLatLngToDivPixel(latlng: Y.LatLng): Y.Point;
        fromTileToLatLng(tx: number, ty: number, x: number, y: number): void;
        getContainer(): JQuery;
        getCopyrightCollection(): Y.CopyrightCollection;
        getMap(): Y.Map;
        getMapContainer(): JQuery;
        hasFeature(): boolean;
    };
} & typeof Y.FeatureLayer;
declare class YLayer extends Layer implements ILayer {
    root?: ILayerController;
    constructor(controller: YLayerController, name: string, options?: Object);
}
declare class YFeatureLayer extends FeatureLayer implements ILayer {
    root: YFeatureLayerController;
    constructor(controller: YFeatureLayerController, name: string);
    addFeature(): void;
    removeFeature(): void;
    clearFeatures(): void;
}
declare abstract class YLayerControllerBase<L extends YLayer> extends ILayerController {
    abstract layer: L;
    map: YMapController;
    protected constructor(map: YMapController);
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
export declare class YLayerController extends YLayerControllerBase<YLayer> {
    layer: YLayer;
    constructor(map: YMapController, name: string, options?: Object);
}
export declare class YFeatureLayerController extends YLayerControllerBase<YFeatureLayer> {
    layer: YFeatureLayer;
    constructor(map: YMapController, name: string);
}
export {};
//# sourceMappingURL=YLayerController.d.ts.map