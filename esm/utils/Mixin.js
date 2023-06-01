import { isFunction } from "./Types";
class dummy {
}
export function getClass(base) {
    return base ? base : dummy;
}
export function mixin(base, ...targets) {
    for (let target of targets) {
        if (isFunction(target)) {
            for (let name of Object.getOwnPropertyNames(target.prototype)) {
                base.prototype[name] = target.prototype[name];
            }
        }
    }
}
//# sourceMappingURL=Mixin.js.map