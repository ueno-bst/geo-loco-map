import {GridLayerController, LoadingLayer, MessageLayer} from "../Layer";
import {YFeatureLayerController, YLayerController} from "./YLayerController";


export class YGridMarkerLayer extends GridLayerController(YFeatureLayerController) {
}

export class YLoadingLayer extends LoadingLayer(YLayerController) {
}

export class YMessageLayer extends MessageLayer(YLayerController) {
}
