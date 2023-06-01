"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDebugLayerController = exports.IGridLayerController = exports.IMessageLayerController = exports.ILayerController = void 0;
class ILayerController {
    constructor() {
        this.init();
    }
    /**
     * オブジェクトの初期化処理
     */
    init() {
    }
}
exports.ILayerController = ILayerController;
class IMessageLayerController extends ILayerController {
}
exports.IMessageLayerController = IMessageLayerController;
class IGridLayerController extends ILayerController {
}
exports.IGridLayerController = IGridLayerController;
class IDebugLayerController extends ILayerController {
}
exports.IDebugLayerController = IDebugLayerController;
//# sourceMappingURL=ILayerController.js.map