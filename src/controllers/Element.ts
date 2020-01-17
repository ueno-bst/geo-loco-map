import ElementHelper from "../utils/ElementHelper";
import {IBoundGridData} from "../entities/Response";
import {Rectangle, LatLng, LatLngBounds, Point} from "../entities/LatLng";
import EventType from "../utils/EventType";

const ev = EventType;

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
            .on([ev.MOUSE_DOWN], this.onInactivate, this)
            .on([ev.MOUSE_OVER, ev.MOUSE_OUT], this.onHover, this)
            .on([ev.MOUSE_MOVE, ev.MOUSE_UP], this.onDeactivate, this);
    }

    private onInactivate(event: Event) {
        this._active = event.type === ev.MOUSE_DOWN;
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
        this._hover = event.type === ev.MOUSE_OVER;
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
        const
            t = this,
            node = t.node;

        const w = node.clientWidth;
        const h = node.clientHeight;

        if (t.width != w || t.height != h) {
            t.fire("resize");
        }

        t.width = w;
        t.height = h;
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

        const label = ElementHelper.p().setText(this.value.count + '');

        const inner = this.inner = ElementHelper.div()
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

    readonly point: LatLng;

    protected readonly refs:string[] = [];

    private readonly label: ElementHelper;
    private readonly inner: ElementHelper;

    constructor(latlng: LatLng, ...ids: string[]) {
        super("gl-feature");

        this.point = latlng;

        const label = this.label = ElementHelper.p();

        const inner = this.inner = ElementHelper.div()
            .addClass('gl-inner')
            .append(label);

        this
            .append(inner);

        this.addRefs(...ids);
    }

    addRefs(...refs: string[]): number {
        for (let ref of refs) {
            this.refs.push(ref);
        }

        const count = this.refs.length;

        this.label.setText(count + '');
        this.inner.toggleClass('is-multiple', count > 1);

        return count;
    }

    getRefs(): string[] {
        return this.refs;
    }
}

export class MessageElement extends OverWrapBaseElement {

    protected p: ElementHelper;

    constructor() {
        super();

        const p = this.p = ElementHelper.p();

        const div = ElementHelper.div()
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

        const inner = ElementHelper.div()
            .addClass("gl-inner");

        const layer = ElementHelper.div()
            .addClass("gl-layer")
            .append(inner);

        this
            .setID("gl-loader")
            .append(layer);
    }
}