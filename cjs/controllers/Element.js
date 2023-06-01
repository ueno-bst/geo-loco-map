"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugElement = exports.LoadingElement = exports.MessageElement = exports.GridMarkerElement = exports.GridBoundElement = exports.MapElement = void 0;
const ElementHelper_1 = __importDefault(require("../utils/ElementHelper"));
const EventType_1 = __importDefault(require("../utils/EventType"));
const LatLng_1 = require("../entities/LatLng");
const ev = EventType_1.default;
class BaseElement extends ElementHelper_1.default {
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
class MapElement extends ElementHelper_1.default {
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
exports.MapElement = MapElement;
class GridBoundElement extends OverWrapBaseElement {
    get bounds() {
        return new LatLng_1.LatLngBounds(this.value.bounds);
    }
    constructor(bound) {
        super("gl-bound");
        this.value = bound;
        const label = ElementHelper_1.default.p().setText(this.value.count + '');
        const inner = this.inner = ElementHelper_1.default.div()
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
        const point = new LatLng_1.Point(width > height ? (width - height) / 2 : 0, height > width ? (height - width) / 2 : 0);
        this.inner.setPosition(new LatLng_1.Rectangle(point, point));
        return this;
    }
}
exports.GridBoundElement = GridBoundElement;
class GridMarkerElement extends BaseElement {
    constructor(latlng, ...ids) {
        super("gl-feature");
        this.refs = [];
        this.point = latlng;
        const label = this.label = ElementHelper_1.default.p();
        const inner = this.inner = ElementHelper_1.default.div()
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
exports.GridMarkerElement = GridMarkerElement;
class MessageElement extends OverWrapBaseElement {
    constructor() {
        super();
        const p = this.p = ElementHelper_1.default.p();
        const div = ElementHelper_1.default.div()
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
exports.MessageElement = MessageElement;
class LoadingElement extends OverWrapBaseElement {
    constructor() {
        super();
        const inner = ElementHelper_1.default.div()
            .addClass("gl-inner");
        const layer = ElementHelper_1.default.div()
            .addClass("gl-layer")
            .append(inner);
        this
            .setID("gl-loader")
            .append(layer);
    }
}
exports.LoadingElement = LoadingElement;
class DebugElement extends OverWrapBaseElement {
    constructor() {
        super();
        const div = ElementHelper_1.default.div()
            .addClass("gl-debug-layer");
        this.append(div);
    }
}
exports.DebugElement = DebugElement;
//# sourceMappingURL=Element.js.map