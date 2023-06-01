import ElementHelper from "../utils/ElementHelper";
import { LatLng, LatLngBounds, Rectangle } from "../entities/LatLng";
import { IBoundData } from "../entities/Response";
declare abstract class BaseElement extends ElementHelper {
    protected _hover: boolean;
    protected _active: boolean;
    get active(): boolean;
    get hover(): boolean;
    protected constructor(className?: string);
    private onInactivate;
    private onDeactivate;
    private onHover;
    private updateClasses;
}
export interface IOverWrapBaseElement extends BaseElement {
    setPosition(rect: Rectangle): this;
}
declare abstract class OverWrapBaseElement extends BaseElement implements IOverWrapBaseElement {
    setPosition(rect: Rectangle): this;
}
export declare class MapElement extends ElementHelper {
    private width;
    private height;
    constructor(node: HTMLElement | string);
    private triggerResize;
}
export declare class GridBoundElement extends OverWrapBaseElement {
    value: IBoundData;
    protected inner: ElementHelper;
    get bounds(): LatLngBounds;
    constructor(bound: IBoundData);
    setPosition(rect: Rectangle): this;
}
export declare class GridMarkerElement extends BaseElement {
    readonly point: LatLng;
    protected readonly refs: string[];
    private readonly label;
    private readonly inner;
    constructor(latlng: LatLng, ...ids: string[]);
    addRefs(...refs: string[]): number;
    getRefs(): string[];
}
export declare class MessageElement extends OverWrapBaseElement {
    protected p: ElementHelper;
    constructor();
    getText(): string;
    setText(text: string): this;
    getHtml(): string;
    setHtml(text: string): this;
}
export declare class LoadingElement extends OverWrapBaseElement {
    constructor();
}
export declare class DebugElement extends OverWrapBaseElement {
    constructor();
}
export {};
//# sourceMappingURL=Element.d.ts.map