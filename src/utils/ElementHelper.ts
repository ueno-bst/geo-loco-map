import {isNumber, isNull, isString, isArray} from "./Types";
import {Rectangle, Point} from "../entities/LatLng";

interface IListenerObject {
    callback: Function,
    binding: Object
}

type IListenerList = { [key: string]: IListenerObject[] };

function isHtmlElement(value: any): value is HTMLElement {
    return value instanceof HTMLElement;
}

function isHelper(value: any): value is Helper {
    return value instanceof Helper;
}

function toPixel(value?: number): string {
    return isNumber(value) ? value + "px" : "";
}

function hasListener(listener: IListenerList, type: string) {
    return type in listener;
}

const EventRegex: { [s: string]: RegExp } = {
    KeyboardEvent: /^key/,
    MouseEvent: /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Event: /.*/,
};

class Helper {
    protected node: HTMLElement;

    static query(query: string): Helper | null {
        const object = Helper.queryAll(query);

        if (object.length > 0) {
            return object[0];
        }

        return null;
    }

    static queryAll(query: string): Helper[] {
        const elements = [];

        const nodes = document.querySelectorAll(query);

        for (let index = 0; index < nodes.length; index++) {
            const node = nodes.item(index);

            if (isHtmlElement(node)) {
                elements.push(new Helper(node));
            }
        }

        return elements;
    }

    constructor(node: HTMLElement | Helper | string) {
        if (isString(node)) {
            node = document.createElement(node);
        }

        if (isHelper(node)) {
            node = node.element;
        }

        this.node = node;
    }

    get element(): HTMLElement {
        return this.node;
    }

    getID(): string {
        return this.node.id;
    }

    setID(id: string): this {
        this.node.id = id;
        return this;
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

    append(child: Helper | HTMLElement): this {
        if (isHelper(child)) {
            child = child.element;
        }

        this.node.appendChild(child);

        return this;
    }

    parent(): Helper | null {
        const parent = this.node.parentElement;

        if (isNull(parent)) {
            return null;
        }

        return new Helper(parent);
    }

    /**
     * 自分自身を削除する
     */
    remove(): this {
        const parent = this.parent();

        if (!isNull(parent)) {
            parent.element.removeChild(this.element);
        }

        return this;
    }

    empty(): this {
        let child: ChildNode | null;

        while ((child = this.node.firstChild)) {
            this.node.removeChild(child);
        }

        return this;
    }

    first(): Helper | null {
        const child = this.node.firstChild;

        if (!isNull(child) && isHtmlElement(child)) {
            return new Helper(child);
        }

        return null;
    }

    private readonly listener: IListenerList = {};

    on(types: string | string[], listener: (e: Event) => void, binding?: Object): this {
        if (!isArray(types)) {
            types = [types];
        }

        for (let type of types) {
            if (!hasListener(this.listener, type)) {
                this.node.addEventListener(type, (e) => (this.emit(e), console.info(e)));
                this.listener[type] = [];
            }

            binding = binding || this.element;

            this.listener[type].push({
                callback: listener,
                binding: binding,
            });
        }

        return this;
    }

    off(types: string | string[], listener: (e: Event) => void): this {
        if (!isArray(types)) {
            types = [types];
        }

        for (let type of types) {
            if (!hasListener(this.listener, type)) {
                continue;
            }

            for (let index = 0, stack = this.listener[type], length = stack.length; index < length; index++) {
                if (stack[index].callback === listener) {
                    stack.splice(index, 1);
                }
            }

            if (this.listener[type].length == 0) {
                this.node.removeEventListener(type, (e) => this.emit(e));
            }
        }

        return this;
    }

    fire(types: string | string[], ...args: any): this {
        if (isString(types)) {
            types = [types];
        }

        for (let type of types) {
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

    private emit(event: Event, ...args: any) {
        if (hasListener(this.listener, event.type)) {
            for (let index = 0, stack = this.listener[event.type], length = stack.length; index < length; index++) {
                const _this = stack[index].binding || this.element;
                stack[index].callback.call(_this, event, ...args);
            }
        }
    }
}

export {Helper as ElementHelper};