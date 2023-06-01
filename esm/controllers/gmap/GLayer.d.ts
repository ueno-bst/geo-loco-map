import { GLayerController } from "./GLayerController";
declare const GGridMarkerLayer_base: (abstract new (...args: any[]) => {
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
}) & typeof GLayerController;
export declare class GGridMarkerLayer extends GGridMarkerLayer_base {
}
declare const GLoadingLayer_base: (abstract new (...args: any[]) => {
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
}) & typeof GLayerController;
export declare class GLoadingLayer extends GLoadingLayer_base {
}
declare const GMessageLayer_base: (abstract new (...args: any[]) => {
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
}) & typeof GLayerController;
export declare class GMessageLayer extends GMessageLayer_base {
}
declare const GDebugLayer_base: (abstract new (...args: any[]) => {
    e?: import("../../utils/ElementHelper").default | undefined;
    _classes: string[];
    _bounds?: import("../../entities/LatLng").LatLngBounds | undefined;
    _rectangle?: import("../../entities/LatLng").Rectangle | undefined;
    onAdd(): void;
    onDraw(): void;
    setClasses(...classes: string[]): any;
    setBound(bounds: import("../../entities/LatLng").LatLngBounds): any;
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
    onRemove(): void;
}) & typeof GLayerController;
export declare class GDebugLayer extends GDebugLayer_base {
}
export {};
//# sourceMappingURL=GLayer.d.ts.map