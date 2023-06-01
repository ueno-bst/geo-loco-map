import { Point, Rectangle } from "../entities/LatLng";
export default class ElementHelper {
    protected node: HTMLElement;
    private readonly emitter;
    private readonly callback;
    static query(query: string): ElementHelper | null;
    static queryAll(query: string): ElementHelper[];
    static div(): ElementHelper;
    static p(): ElementHelper;
    constructor(node: HTMLElement | ElementHelper | string);
    get src(): HTMLElement;
    getID(): string;
    setID(id: string): this;
    uniqueID(override?: boolean): this;
    /**
     * スタイル値を取得する
     * @param key
     */
    getStyle(key: string): string | null;
    /**
     * スタイル値を設定する
     * @param key
     * @param value
     */
    setStyle(key: string, value: string | null): this;
    /**
     * スタイル値をリストで設定する
     * @param values
     */
    setStyles(values: {
        [s: string]: string | null;
    }): this;
    setPosition(value?: Rectangle | Point): this;
    setSize(value?: Rectangle): this;
    getText(): string;
    setText(text: string): this;
    getHtml(): string;
    setHtml(text: string): this;
    hasClass(name: string): boolean;
    addClass(...names: string[]): this;
    removeClass(...names: string[]): this;
    toggleClass(name: string, toggle: boolean): this;
    append(child: ElementHelper | HTMLElement): this;
    parent(): ElementHelper | null;
    /**
     * 自分自身を削除する
     */
    remove(): this;
    empty(): this;
    first(): ElementHelper | null;
    on(types: string | string[], listener: (e: Event) => void, binding?: Object): this;
    off(types: string | string[], listener: (e: Event) => void): this;
    fire(types: string | string[]): this;
    private trigger;
}
//# sourceMappingURL=ElementHelper.d.ts.map