import {GridLayerController, LoadingLayer, MessageLayer} from "../Layer";
import {GLayerController} from "./GLayerController";

export class GGridMarkerLayer extends GridLayerController(GLayerController) {
}

export class GLoadingLayer extends LoadingLayer(GLayerController) {
}

export class GMessageLayer extends MessageLayer(GLayerController) {
}