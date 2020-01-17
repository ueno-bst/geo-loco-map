import {YFeatureLayerController, YLayerController} from "./YLayerController";
import {GridLayerController, LoadingLayer, MessageLayer} from "../Layer";

export class YGridMarkerLayer extends GridLayerController(YFeatureLayerController) {
}

export class YLoadingLayer extends LoadingLayer(YLayerController) {
}

export class YMessageLayer extends MessageLayer(YLayerController) {
}