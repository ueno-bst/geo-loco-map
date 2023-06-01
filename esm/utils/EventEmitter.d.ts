interface ICallback<T> {
    (...args: any): boolean | false | void | undefined;
}
export type IEventTypes<T extends string = string> = T | T[];
export default class EventEmitter<T, C extends any[]> {
    private readonly bind;
    private listeners;
    constructor(bind: any);
    fix(types: IEventTypes): string[];
    has(type: string): boolean;
    count(type: string): number;
    on(types: IEventTypes, listener?: ICallback<T>, bind?: Object): this;
    off(types: IEventTypes, fn: ICallback<T>): this;
    fire(type: string, ...args: C): boolean;
}
export {};
//# sourceMappingURL=EventEmitter.d.ts.map