import {isFunction} from "./Types";

export type Constructor<T = {}> = new (...args: any[]) => T;

class dummy {
}

export function getClass<T extends Constructor<object>>(base: T): T {
    return base ? base : dummy as T;
}

export function mixin(base: Function, ...targets: Function[]) {
    for (let target of targets) {
        if (isFunction(target)) {
            for (let name of Object.getOwnPropertyNames(target.prototype)) {
                base.prototype[name] = target.prototype[name];
            }
        }
    }
}