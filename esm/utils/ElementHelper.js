import { isNull, isNumber, isString } from "./Types";
import { Point, Rectangle } from "../entities/LatLng";
import EventEmitter from "./EventEmitter";
function isHtmlElement(value) {
    return value instanceof HTMLElement;
}
function isHelper(value) {
    return value instanceof ElementHelper;
}
function toPixel(value) {
    return isNumber(value) ? value + "px" : "";
}
const EventRegex = {
    KeyboardEvent: /^key/,
    MouseEvent: /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Event: /.*/,
};
const document = window.document;
export default class ElementHelper {
    static query(query) {
        const object = ElementHelper.queryAll(query);
        if (object.length > 0) {
            return object[0];
        }
        return null;
    }
    static queryAll(query) {
        const elements = [];
        const nodes = document.querySelectorAll(query);
        for (let index = 0; index < nodes.length; index++) {
            const node = nodes.item(index);
            if (isHtmlElement(node)) {
                elements.push(new ElementHelper(node));
            }
        }
        return elements;
    }
    static div() {
        return new ElementHelper('div');
    }
    static p() {
        return new ElementHelper('p');
    }
    constructor(node) {
        if (isString(node)) {
            node = document.createElement(node);
        }
        if (isHelper(node)) {
            node = node.src;
        }
        this.node = node;
        this.emitter = new EventEmitter(node);
        this.callback = (event) => this.trigger(event);
    }
    get src() {
        return this.node;
    }
    getID() {
        return this.node.id;
    }
    setID(id) {
        const t = this;
        t.node.id = id;
        return t;
    }
    uniqueID(override = false) {
        if (override || this.getID() == "") {
            // 種を作る
            let seed = "", id = "";
            do {
                seed = seed + "x";
            } while (seed.length < 16);
            // IDを生成して、重複要素がない
            do {
                id = "id-" + seed.replace(/[x]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            } while (document.getElementById(id) !== null);
            this.setID(id);
        }
        return this;
    }
    /**
     * スタイル値を取得する
     * @param key
     */
    getStyle(key) {
        const style = this.node.style;
        if (style.hasOwnProperty(key)) {
            return style.getPropertyValue(key);
        }
        return null;
    }
    /**
     * スタイル値を設定する
     * @param key
     * @param value
     */
    setStyle(key, value) {
        const style = this.node.style;
        style.setProperty(key, value);
        return this;
    }
    /**
     * スタイル値をリストで設定する
     * @param values
     */
    setStyles(values) {
        for (let key in values) {
            this.setStyle(key, values[key]);
        }
        return this;
    }
    setPosition(value) {
        let left;
        let bottom;
        let top;
        let right;
        if (value instanceof Rectangle) {
            left = value.left;
            right = value.right;
            top = value.top;
            bottom = value.bottom;
        }
        else if (value instanceof Point) {
            left = value.x;
            top = value.y;
        }
        this.setStyles({
            left: toPixel(left),
            right: toPixel(right),
            top: toPixel(top),
            bottom: toPixel(bottom),
        });
        return this;
    }
    setSize(value) {
        let width;
        let height;
        if (value instanceof Rectangle) {
            width = value.width;
            height = value.height;
        }
        this.setStyles({
            width: toPixel(width),
            height: toPixel(height),
        });
        return this;
    }
    getText() {
        return this.node.innerText;
    }
    setText(text) {
        this.node.innerText = text;
        return this;
    }
    getHtml() {
        return this.node.innerHTML;
    }
    setHtml(text) {
        this.node.innerHTML = text;
        return this;
    }
    hasClass(name) {
        return this.node.classList.contains(name);
    }
    addClass(...names) {
        this.node.classList.add(...names);
        return this;
    }
    removeClass(...names) {
        this.node.classList.remove(...names);
        return this;
    }
    toggleClass(name, toggle) {
        if (toggle) {
            this.addClass(name);
        }
        else {
            this.removeClass(name);
        }
        return this;
    }
    append(child) {
        if (isHelper(child)) {
            child = child.src;
        }
        this.node.appendChild(child);
        return this;
    }
    parent() {
        const parent = this.node.parentElement;
        if (isNull(parent)) {
            return null;
        }
        return new ElementHelper(parent);
    }
    /**
     * 自分自身を削除する
     */
    remove() {
        const parent = this.parent();
        if (!isNull(parent)) {
            parent.src.removeChild(this.src);
        }
        return this;
    }
    empty() {
        const node = this.node;
        let child;
        while ((child = node.firstChild)) {
            node.removeChild(child);
        }
        return this;
    }
    first() {
        const child = this.node.firstChild;
        if (!isNull(child) && isHtmlElement(child)) {
            return new ElementHelper(child);
        }
        return null;
    }
    on(types, listener, binding) {
        const emitter = this.emitter;
        for (let type of emitter.fix(types)) {
            if (!emitter.has(type)) {
                this.node.addEventListener(type, this.callback);
            }
            emitter.on(type, listener, binding);
        }
        return this;
    }
    off(types, listener) {
        const emitter = this.emitter;
        for (let type of emitter.fix(types)) {
            emitter.off(type, listener);
            if (!emitter.has(type)) {
                this.node.removeEventListener(type, this.callback);
            }
        }
        return this;
    }
    fire(types) {
        const emitter = this.emitter;
        for (let type of emitter.fix(types)) {
            for (let key in EventRegex) {
                if (type.match(EventRegex[key])) {
                    const event = document.createEvent(key);
                    event.initEvent(type);
                    this.node.dispatchEvent(event);
                    break;
                }
            }
        }
        return this;
    }
    trigger(event) {
        this.emitter.fire(event.type, event);
    }
}
//# sourceMappingURL=ElementHelper.js.map