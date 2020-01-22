import {isNumber, isNull, isString} from "./Types";
import {Rectangle, Point} from "../entities/LatLng";
import EventEmitter from "./EventEmitter";

function isHtmlElement(value: any): value is HTMLElement {
    return value instanceof HTMLElement;
}

function isHelper(value: any): value is ElementHelper {
    return value instanceof ElementHelper;
}

function toPixel(value?: number): string {
    return isNumber(value) ? value + "px" : "";
}

const EventRegex: { [s: string]: RegExp } = {
    KeyboardEvent: /^key/,
    MouseEvent: /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Event: /.*/,
};

const document = window.document;

export default class ElementHelper {
    protected node: HTMLElement;

    private readonly emitter: EventEmitter<HTMLElement, [Event]>;

    private readonly callback: (event: Event) => void;

    static query(query: string): ElementHelper | null {
        const object = ElementHelper.queryAll(query);

        if (object.length > 0) {
            return object[0];
        }

        return null;
    }

    static queryAll(query: string): ElementHelper[] {
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

    constructor(node: HTMLElement | ElementHelper | string) {
        if (isString(node)) {
            node = document.createElement(node);
        }

        if (isHelper(node)) {
            node = node.src;
        }

        this.node = node;
        this.emitter = new EventEmitter(node);

        this.callback = (event: Event) => this.trigger(event);
    }

    get src(): HTMLElement {
        return this.node;
    }

    getID(): string {
        return this.node.id;
    }

    setID(id: string): this {
        const t = this;
        t.node.id = id;
        return t;
    }

    uniqueID(override: boolean = false): this {
        if (override || this.getID() == "") {
            // 種を作る
            let seed = "", id = "";

            do {
                seed = seed + "x";
            } while (seed.length < 16);

            // IDを生成して、重複要素がない
            do {
                id = "id-" + seed.replace(/[x]/g, function (c) {
                    let r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
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
    getStyle(key: string): string | null {
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
    setStyle(key: string, value: string | null): this {
        const style = this.node.style;

        if (style.hasOwnProperty(key)) {
            style.setProperty(key, value);
        }

        return this;
    }

    /**
     * スタイル値をリストで設定する
     * @param values
     */
    setStyles(values: { [s: string]: string | null }): this {
        for (let key in values) {
            this.setStyle(key, values[key]);
        }
        return this;
    }

    setPosition(value?: Rectangle | Point): this {
        let left!: number;
        let bottom!: number;
        let top!: number;
        let right!: number;

        if (value instanceof Rectangle) {
            left = value.left;
            right = value.right;
            top = value.top;
            bottom = value.bottom;
        } else if (value instanceof Point) {
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

    setSize(value?: Rectangle): this {
        let width!: number;
        let height!: number;

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

    getText(): string {
        return this.node.innerText;
    }

    setText(text: string): this {
        this.node.innerText = text;
        return this;
    }

    getHtml(): string {
        return this.node.innerHTML;
    }

    setHtml(text: string): this {
        this.node.innerHTML = text;
        return this;
    }

    hasClass(name: string): boolean {
        return this.node.classList.contains(name);
    }

    addClass(...names: string[]): this {
        this.node.classList.add(...names);
        return this;
    }

    removeClass(...names: string[]): this {
        this.node.classList.remove(...names);
        return this;
    }

    toggleClass(name: string, toggle: boolean): this {
        if (toggle) {
            this.addClass(name);
        } else {
            this.removeClass(name);
        }
        return this;
    }

    append(child: ElementHelper | HTMLElement): this {
        if (isHelper(child)) {
            child = child.src;
        }

        this.node.appendChild(child);

        return this;
    }

    parent(): ElementHelper | null {
        const parent = this.node.parentElement;

        if (isNull(parent)) {
            return null;
        }

        return new ElementHelper(parent);
    }

    /**
     * 自分自身を削除する
     */
    remove(): this {
        const parent = this.parent();

        if (!isNull(parent)) {
            parent.src.removeChild(this.src);
        }

        return this;
    }

    empty(): this {
        const node = this.node;
        let child: ChildNode | null;

        while ((child = node.firstChild)) {
            node.removeChild(child);
        }

        return this;
    }

    first(): ElementHelper | null {
        const child = this.node.firstChild;

        if (!isNull(child) && isHtmlElement(child)) {
            return new ElementHelper(child);
        }

        return null;
    }

    on(types: string | string[], listener: (e: Event) => void, binding?: Object): this {
        const emitter = this.emitter;

        for (let type of emitter.fix(types)) {
            if (!emitter.has(type)) {
                this.node.addEventListener(type, this.callback);
            }

            emitter.on(type, listener, binding);
        }

        return this;
    }

    off(types: string | string[], listener: (e: Event) => void): this {
        const emitter = this.emitter;

        for (let type of emitter.fix(types)) {
            emitter.off(type, listener);

            if (!emitter.has(type)) {
                this.node.removeEventListener(type, this.callback);
            }
        }

        return this;
    }

    fire(types: string | string[]): this {
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

    private trigger(event: Event) {
        this.emitter.fire(event.type, event);
    }
}