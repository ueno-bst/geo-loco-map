"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YMessageLayer = exports.YLoadingLayer = exports.YGridMarkerLayer = void 0;
const Layer_1 = require("../Layer");
const YLayerController_1 = require("./YLayerController");
class YGridMarkerLayer extends (0, Layer_1.GridLayerController)(YLayerController_1.YFeatureLayerController) {
}
exports.YGridMarkerLayer = YGridMarkerLayer;
class YLoadingLayer extends (0, Layer_1.LoadingLayer)(YLayerController_1.YLayerController) {
}
exports.YLoadingLayer = YLoadingLayer;
class YMessageLayer extends (0, Layer_1.MessageLayer)(YLayerController_1.YLayerController) {
}
exports.YMessageLayer = YMessageLayer;
//# sourceMappingURL=YLayer.js.map