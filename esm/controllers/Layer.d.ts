import { Constructor } from "../utils/Mixin";
import { ILayerController } from "./ILayerController";
import ElementHelper from "../utils/ElementHelper";
import { GridBoundElement, GridMarkerElement } from "./Element";
import { IBoundData, IMarkerData, MarkerData } from "../entities/Response";
import { LatLngBounds, Rectangle } from "../entities/LatLng";
export declare function LoadingLayer<T extends Constructor<ILayerController>>(base: T): (abstract new (...args: any[]) => {
    e?: ElementHelper | undefined;
    onAdd(): void;
    onRemove(): void;
    map: import("./MapController").MapController<Object, {}>;
    layer: import("./ILayerController").ILayer;
    init(): void;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): ElementHelper | null;
    coordinateToPixel(latlng: import("../entities/LatLng").LatLng): import("../entities/LatLng").Point;
    boundToRect(bounds: LatLngBounds): Rectangle;
    onDraw(): void;
}) & T;
export declare function MessageLayer<T extends Constructor<ILayerController>>(base: T): (abstract new (...args: any[]) => {
    e?: ElementHelper | undefined;
    onAdd(): void;
    onRemove(): void;
    html(html?: string): string | void;
    text(text?: string): string | void;
    map: import("./MapController").MapController<Object, {}>;
    layer: import("./ILayerController").ILayer;
    init(): void;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): ElementHelper | null;
    coordinateToPixel(latlng: import("../entities/LatLng").LatLng): import("../entities/LatLng").Point;
    boundToRect(bounds: LatLngBounds): Rectangle;
    onDraw(): void;
}) & T;
export declare function GridLayerController<T extends Constructor<ILayerController>>(base: T): (abstract new (...args: any[]) => {
    e?: ElementHelper | undefined;
    /**
     * 矩形範囲の HTMLElement リスト
     */
    be: GridBoundElement[];
    /**
     * マーカーの生データリスト
     */
    mo: {
        [id: string]: MarkerData;
    };
    /**
     * マーカー用 HTMLElement リスト
     */
    me: {
        [hash: string]: GridMarkerElement;
    };
    /**
     * アクティブなマーカーグリッドのリスト
     */
    _selected: string | null;
    init(): void;
    onAdd(): void;
    onDraw(): void;
    addBound(...bounds: IBoundData[]): void;
    addMarker(...markers: IMarkerData[]): void;
    getMarker(id: string): MarkerData | null;
    getGroupInMarker(id: string): MarkerData[];
    getDisplayMarkers(limit?: number): MarkerData[];
    removeMarker(...ids: string[]): number;
    /**
     * 既存のマーカーエレメントを削除する
     */
    clearMarker(): void;
    clear(): void;
    selected(id?: string | null): void;
    map: import("./MapController").MapController<Object, {}>;
    layer: import("./ILayerController").ILayer;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): ElementHelper | null;
    coordinateToPixel(latlng: import("../entities/LatLng").LatLng): import("../entities/LatLng").Point;
    boundToRect(bounds: LatLngBounds): Rectangle;
    onRemove(): void;
}) & T;
export declare function DebugLayer<T extends Constructor<ILayerController>>(base: T): (abstract new (...args: any[]) => {
    e?: ElementHelper | undefined;
    _classes: string[];
    _bounds?: LatLngBounds | undefined;
    _rectangle?: Rectangle | undefined;
    onAdd(): void;
    onDraw(): void;
    setClasses(...classes: string[]): this;
    setBound(bounds: LatLngBounds): this;
    map: import("./MapController").MapController<Object, {}>;
    layer: import("./ILayerController").ILayer;
    init(): void;
    refresh(): any;
    remove(): any;
    show(): any;
    hide(): any;
    target(clickable: boolean): ElementHelper | null;
    coordinateToPixel(latlng: import("../entities/LatLng").LatLng): import("../entities/LatLng").Point;
    boundToRect(bounds: LatLngBounds): Rectangle;
    onRemove(): void;
}) & T;
//# sourceMappingURL=Layer.d.ts.map