import ElementHelper from "../utils/ElementHelper";
import EventType from "../utils/EventType";
import { LatLngBounds, Point, Rectangle } from "../entities/LatLng";
const ev = EventType;
class BaseElement extends ElementHelper {
    get active() {
        return this._active;
    }
    get hover() {
        return this._hover;
    }
    constructor(className) {
        super('div');
        this._hover = false;
        this._active = false;
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
    onInactivate(event) {
        this._active = event.type === ev.MOUSE_DOWN;
        this.updateClasses();
    }
    onDeactivate(event) {
        if (this._active) {
            setTimeout(() => {
                this._active = false;
            }, 50);
        }
        this.updateClasses();
    }
    onHover(event) {
        this._hover = event.type === ev.MOUSE_OVER;
        this.updateClasses();
    }
    updateClasses() {
        this
            .toggleClass("is-hover", this._hover)
            .toggleClass("is-active", this._active);
    }
}
class OverWrapBaseElement extends BaseElement {
    setPosition(rect) {
        super.setPosition(rect.lt);
        this.setSize(rect);
        return this;
    }
}
export class MapElement extends ElementHelper {
    constructor(node) {
        super(node);
        this.width = 0;
        this.height = 0;
        this.uniqueID();
        /**
         * リサイズ監視イベントを実装
         */
        setInterval(() => {
            this.triggerResize();
        }, 300);
    }
    triggerResize() {
        const t = this, node = t.node;
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
    get bounds() {
        return new LatLngBounds(this.value.bounds);
    }
    constructor(bound) {
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
    setPosition(rect) {
        super.setPosition(rect);
        const width = rect.width;
        const height = rect.height;
        const point = new Point(width > height ? (width - height) / 2 : 0, height > width ? (height - width) / 2 : 0);
        this.inner.setPosition(new Rectangle(point, point));
        return this;
    }
}
export class GridMarkerElement extends BaseElement {
    constructor(latlng, ...ids) {
        super("gl-feature");
        this.refs = [];
        this.point = latlng;
        const label = this.label = ElementHelper.p();
        const inner = this.inner = ElementHelper.div()
            .addClass('gl-inner')
            .append(label);
        this
            .append(inner);
        this.addRefs(...ids);
    }
    addRefs(...refs) {
        for (let ref of refs) {
            this.refs.push(ref);
        }
        const count = this.refs.length;
        this.label.setText(count + '');
        this.inner.toggleClass('is-multiple', count > 1);
        return count;
    }
    getRefs() {
        return this.refs;
    }
}
export class MessageElement extends OverWrapBaseElement {
    constructor() {
        super();
        const p = this.p = ElementHelper.p();
        const div = ElementHelper.div()
            .append(p);
        this
            .setID("gl-messenger")
            .append(div);
    }
    getText() {
        return this.p.getText();
    }
    setText(text) {
        this.p.setText(text);
        return this;
    }
    getHtml() {
        return this.p.getHtml();
    }
    setHtml(text) {
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
export class DebugElement extends OverWrapBaseElement {
    constructor() {
        super();
        const div = ElementHelper.div()
            .addClass("gl-debug-layer");
        this.append(div);
    }
}
//# sourceMappingURL=Element.js.map