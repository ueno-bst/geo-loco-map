import {IController} from "../controllers/IController";
import {ILatLng} from "./LatLng";
import {isFunction} from "../utils/Types";

export enum MapEventType {
    init = "init",
    change = "change",
    move = "move",
    zoom = "zoom",
    ui = "ui",
    info = "info",
    addMarker = "marker.add",
    hideMarker = "marker.hide",
    clickMarker = "marker.click",
    hoverMarker = "marker.hover",
}

export interface MapEventListener {
    (c: IController, ...args: any): void;
}

interface LatLngEventListener extends MapEventListener {
    (c: IController, l: ILatLng): void;
}

export class MapEvent {
    private readonly controller: IController;
    private readonly listener: { [key: string]: MapEventListener[]; };

    constructor(c: IController) {
        this.controller = c;
        this.listener = {};
    }

    protected has(type: string) {
        return type in this.listener;
    }

    on(type: string, listener: MapEventListener | null): void {
        if (!this.has(type)) {
            this.listener[type] = [];
        }

        if (isFunction(listener)) {
            this.listener[type].push(listener);
        }
    }

    off(type: string, callback: MapEventListener | null): boolean {
        if (!this.has(type)) {
            return false;
        }

        for (let index = 0, stack = this.listener[type], length = stack.length; index < length; index++) {
            if (stack[index] === callback) {
                stack.splice(index, 1);
                return true;
            }
        }

        return false;
    }

    fire(type: string, ...args: any): boolean {
        if (!this.has(type)) {
            return false;
        }

        for (let index = 0, stack = this.listener[type], length = stack.length; index < length; index++) {
            stack[index].call(this, this.controller, ...args);
        }

        return true;
    }

}