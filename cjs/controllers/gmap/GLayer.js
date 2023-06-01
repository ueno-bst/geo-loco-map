"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDebugLayer = exports.GMessageLayer = exports.GLoadingLayer = exports.GGridMarkerLayer = void 0;
const Layer_1 = require("../Layer");
const GLayerController_1 = require("./GLayerController");
class GGridMarkerLayer extends (0, Layer_1.GridLayerController)(GLayerController_1.GLayerController) {
}
exports.GGridMarkerLayer = GGridMarkerLayer;
class GLoadingLayer extends (0, Layer_1.LoadingLayer)(GLayerController_1.GLayerController) {
}
exports.GLoadingLayer = GLoadingLayer;
class GMessageLayer extends (0, Layer_1.MessageLayer)(GLayerController_1.GLayerController) {
}
exports.GMessageLayer = GMessageLayer;
class GDebugLayer extends (0, Layer_1.DebugLayer)(GLayerController_1.GLayerController) {
}
exports.GDebugLayer = GDebugLayer;
//# sourceMappingURL=GLayer.js.map