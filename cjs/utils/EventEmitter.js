"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("./Types");
class EventEmitter {
    constructor(bind) {
        this.listeners = {};
        this.bind = bind;
    }
    fix(types) {
        return (0, Types_1.isArray)(types) ? types : [types];
    }
    has(type) {
        return this.count(type) > 0;
    }
    count(type) {
        return type in this.listeners ? this.listeners[type].length : 0;
    }
    on(types, listener, bind) {
        if (!(0, Types_1.isFunction)(listener)) {
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
    off(types, fn) {
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
    fire(type, ...args) {
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
exports.default = EventEmitter;
//# sourceMappingURL=EventEmitter.js.map