import { YFeatureLayerController, YLayerController } from "./YLayerController";
declare const YGridMarkerLayer_base: (abstract new (...args: any[]) => {
    e?: import("../../utils/ElementHelper").default | undefined;
    be: import("../Element").GridBoundElement[];
    mo: {
        [id: string]: import("../../entities/Response").MarkerData;
    };
    me: {
        [hash: string]: import("../Element").GridMarkerElement;
    };
    _selected: string | null;
    init(): void;
    onAdd(): void;
    onDraw(): void;
    addBound(...bounds: import("../../entities/Response").IBoundData[]): void;
    addMarker(...markers: import("../../entities/Response").IMarkerData[]): void;
    getMarker(id: string): import("../../entities/Response").MarkerData | null;
    getGroupInMarker(id: string): import("../../entities/Response").MarkerData[];
    getDisplayMarkers(limit?: number): import("../../entities/Response").MarkerData[];
    removeMarker(...ids: string[]): number;
    clearMarker(): void;
    clear(): void;
    selected(id?: string | null): void;
    map: import("../MapController").MapController<Object, {}>;
    layer: import("../ILayerController").ILayer;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): import("../../utils/ElementHelper").default | null;
    coordinateToPixel(latlng: import("../../entities/LatLng").LatLng): import("../../entities/LatLng").Point;
    boundToRect(bounds: import("../../entities/LatLng").LatLngBounds): import("../../entities/LatLng").Rectangle;
    onRemove(): void;
}) & typeof YFeatureLayerController;
export declare class YGridMarkerLayer extends YGridMarkerLayer_base {
}
declare const YLoadingLayer_base: (abstract new (...args: any[]) => {
    e?: import("../../utils/ElementHelper").default | undefined;
    onAdd(): void;
    onRemove(): void;
    map: import("../MapController").MapController<Object, {}>;
    layer: import("../ILayerController").ILayer;
    init(): void;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): import("../../utils/ElementHelper").default | null;
    coordinateToPixel(latlng: import("../../entities/LatLng").LatLng): import("../../entities/LatLng").Point;
    boundToRect(bounds: import("../../entities/LatLng").LatLngBounds): import("../../entities/LatLng").Rectangle;
    onDraw(): void;
}) & typeof YLayerController;
export declare class YLoadingLayer extends YLoadingLayer_base {
}
declare const YMessageLayer_base: (abstract new (...args: any[]) => {
    e?: import("../../utils/ElementHelper").default | undefined;
    onAdd(): void;
    onRemove(): void;
    html(html?: string | undefined): string | void;
    text(text?: string | undefined): string | void;
    map: import("../MapController").MapController<Object, {}>;
    layer: import("../ILayerController").ILayer;
    init(): void;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): import("../../utils/ElementHelper").default | null;
    coordinateToPixel(latlng: import("../../entities/LatLng").LatLng): import("../../entities/LatLng").Point;
    boundToRect(bounds: import("../../entities/LatLng").LatLngBounds): import("../../entities/LatLng").Rectangle;
    onDraw(): void;
}) & typeof YLayerController;
export declare class YMessageLayer extends YMessageLayer_base {
}
export {};
//# sourceMappingURL=YLayer.d.ts.map