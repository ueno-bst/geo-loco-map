"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mixin = exports.getClass = void 0;
const Types_1 = require("./Types");
class dummy {
}
function getClass(base) {
    return base ? base : dummy;
}
exports.getClass = getClass;
function mixin(base, ...targets) {
    for (let target of targets) {
        if ((0, Types_1.isFunction)(target)) {
            for (let name of Object.getOwnPropertyNames(target.prototype)) {
                base.prototype[name] = target.prototype[name];
            }
        }
    }
}
exports.mixin = mixin;
//# sourceMappingURL=Mixin.js.map