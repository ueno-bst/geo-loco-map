import {ElementHelper} from "../utils/ElementHelper";
import {IBoundGridContentData, IBoundGridData} from "../entities/Response";
import {Rectangle, LatLng, LatLngBounds, Point} from "../entities/LatLng";

enum EventName {
    CLICK = 'click',
    MOUSE_DOWN = 'mousedown',
    MOUSE_OVER = 'mouseover',
    MOUSE_OUT = 'mouseout',
    MOUSE_MOVE = 'mousemove',
    MOUSE_UP = 'mouseup',
}

abstract class BaseElement extends ElementHelper {

    protected _hover: boolean = false;
    protected _active: boolean = false;

    get active(): boolean {
        return this._active;
    }

    get hover(): boolean {
        return this._hover;
    }

    protected constructor(className?: string) {
        super('div');

        if (className) {
            this.addClass(className);
        }

        this
            .setStyles({
                position: 'absolute'
            })
            .on([EventName.MOUSE_DOWN], this.onInactivate, this)
            .on([EventName.MOUSE_OVER, EventName.MOUSE_OUT], this.onHover, this)
            .on([EventName.MOUSE_MOVE, EventName.MOUSE_UP], this.onDeactivate, this);
    }

    private onInactivate(event: Event) {
        this._active = event.type === EventName.MOUSE_DOWN;
        this.updateClasses();
    }

    private onDeactivate(event: Event) {
        if (this._active) {
            setTimeout(() => {
                this._active = false;
            }, 50);
        }
        this.updateClasses();
    }

    private onHover(event: Event): void {
        this._hover = event.type === EventName.MOUSE_OVER;
        this.updateClasses();
    }

    private updateClasses() {
        this
            .toggleClass("is-hover", this._hover)
            .toggleClass("is-active", this._active)
    }
}

export interface IOverWrapBaseElement extends BaseElement {
    setPosition(rect: Rectangle): this;
}

abstract class OverWrapBaseElement extends BaseElement implements IOverWrapBaseElement {
    setPosition(rect: Rectangle): this {
        super.setPosition(rect.lt);
        this.setSize(rect);
        return this;
    }
}

export class MapElement extends ElementHelper {
    private width: number = 0;
    private height: number = 0;

    constructor(node: HTMLElement | string) {
        super(node);

        this.uniqueID();

        /**
         * リサイズ監視イベントを実装
         */
        setInterval(() => {
            this.triggerResize();
        }, 300);
    }

    private triggerResize() {
        const w = this.node.clientWidth;
        const h = this.node.clientHeight;

        if (this.width != w || this.height != h) {
            this.fire("resize");
        }

        this.width = w;
        this.height = h;
    }
}

export class GridBoundElement extends OverWrapBaseElement {
    public value: IBoundGridData;

    protected inner: ElementHelper;

    get bounds(): LatLngBounds {
        return new LatLngBounds(this.value.bounds);
    }

    constructor(bound: IBoundGridData) {
        super("gl-bound");

        this.value = bound;

        const label = new ElementHelper('p').setText(this.value.count + '');

        const inner = this.inner = new ElementHelper('div')
            .addClass('gl-inner', "gl-char-" + label.getText().length)
            .setStyles({
                position: 'absolute'
            })
            .append(label);

        this
            .append(inner);

        if (this.value.id) {
            this.setID(this.value.id);
        }
    }

    setPosition(rect: Rectangle): this {
        super.setPosition(rect);

        const width = rect.width;
        const height = rect.height;

        const point = new Point(
            width > height ? (width - height) / 2 : 0,
            height > width ? (height - width) / 2 : 0
        );

        this.inner.setPosition(new Rectangle(point, point));

        return this;
    }
}

export class GridMarkerElement extends BaseElement {

    public value: IBoundGridContentData;

    get point(): LatLng {
        return new LatLng(this.value.coordinate);
    }

    constructor(marker: IBoundGridContentData) {
        super("gl-feature");

        this.value = marker;

        const label = new ElementHelper('p').setText(this.value.count + '');

        const inner = new ElementHelper('div')
            .addClass('gl-inner')
            .toggleClass('is-multiple', this.value.count > 1)
            .append(label);

        this
            .append(inner);

        if (this.value.id) {
            this.setID(this.value.id);
        }
    }
}

export class MessageElement extends OverWrapBaseElement {

    protected p: ElementHelper;

    constructor() {
        super();

        const p = this.p = new ElementHelper('p');

        const div = new ElementHelper('div')
            .append(p);

        this
            .setID("gl-messenger")
            .append(div);
    }

    getText(): string {
        return this.p.getText();
    }

    setText(text: string): this {
        this.p.setText(text);
        return this;
    }

    getHtml(): string {
        return this.p.getHtml();
    }

    setHtml(text: string): this {
        this.p.setHtml(text);
        return this;
    }
}

export class LoadingElement extends OverWrapBaseElement {
    constructor() {
        super();

        const inner = new ElementHelper('div').addClass("gl-inner");

        const layer = new ElementHelper('div')
            .addClass("gl-layer")
            .append(inner);

        this
            .setID("gl-loader")
            .append(layer);
    }
}