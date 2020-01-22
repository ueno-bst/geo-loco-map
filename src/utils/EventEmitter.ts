import {isArray, isFunction} from "./Types";

interface ICallback<T> {
    (...args: any): boolean | false | void;
}

interface IListener<T> {
    fn: ICallback<T>,
    bind?: Object
}

type IListenerList<T> = { [key: string]: IListener<T>[] };

export type IEventTypes<T extends string = string> = T | T[];

export default class EventEmitter<T, C extends any[]> {
    private readonly bind: any;

    private listeners: IListenerList<T> = {};

    constructor(bind: any) {
        this.bind = bind;
    }

    fix(types: IEventTypes): string[] {
        return isArray(types) ? types : [types];
    }

    has(type: string): boolean {
        return this.count(type) > 0;
    }

    count(type: string): number {
        return type in this.listeners ? this.listeners[type].length : 0;
    }

    on(types: IEventTypes, listener?: ICallback<T>, bind?: Object): this {
        if (!isFunction(listener)) {
            return this;
        }

        for (let type of this.fix(types)) {
            if (!this.has(type)) {
                this.listeners[type] = [];
            }

            this.listeners[type].push({
                fn: listener,
                bind: bind
            });
        }

        return this;
    }

    off(types: IEventTypes, fn: ICallback<T>): this {
        for (let type of this.fix(types)) {
            if (this.has(type)) {
                const listeners = this.listeners[type];

                for (let index = 0; index < listeners.length; index++) {
                    const listener = listeners[index];

                    if (listener.fn == fn) {
                        listeners.splice(index, 1);
                    }
                }
            }
        }

        return this;
    }

    fire(type: string, ...args: C): boolean {
        if (this.has(type)) {
            for (let index = 0, stack = this.listeners[type], length = stack.length; index < length; index++) {
                if (stack[index].fn.call(stack[index].bind || this.bind, ...args) === false) {
                    return false;
                }
            }
        }

        return true;
    }
}