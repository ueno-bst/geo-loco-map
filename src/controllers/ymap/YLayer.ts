import {GridLayerController, LoadingLayer, MessageLayer} from "~/controllers/Layer";
import {YFeatureLayerController, YLayerController} from "~/controllers/ymap/YLayerController";


export class YGridMarkerLayer extends GridLayerController(YFeatureLayerController) {
}

export class YLoadingLayer extends LoadingLayer(YLayerController) {
}

export class YMessageLayer extends MessageLayer(YLayerController) {
}
