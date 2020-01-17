import {IController} from "../controllers/IController";

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
    request = "request",
    response = "response",
}

export interface MapEventListener {
    (c: IController, ...args: any): void;
}