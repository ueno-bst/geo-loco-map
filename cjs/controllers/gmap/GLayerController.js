"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLayerController = void 0;
const Mixin_1 = require("../../utils/Mixin");
const ILayerController_1 = require("../ILayerController");
const LatLng_1 = require("../../entities/LatLng");
const ElementHelper_1 = __importDefault(require("../../utils/ElementHelper"));
const get_class = Mixin_1.getClass;
const Layer = get_class(google.maps.OverlayView);
class GLayer extends Layer {
    constructor(controller, name) {
        super();
        this.onAdd = () => {
            this.root.onAdd();
        };
        this.draw = () => {
            this.root.onDraw();
        };
        this.onRemove = () => {
            this.root.onRemove();
        };
        this.root = controller;
        this.name = name;
    }
}
class GLayerController extends ILayerController_1.ILayerController {
    constructor(map, name) {
        super();
        this.coordinateToPixel = (latlng) => new LatLng_1.Point(this.layer.getProjection().fromLatLngToDivPixel(latlng.gmap()));
        this.boundToRect = (bounds) => new LatLng_1.Rectangle(this.coordinateToPixel(bounds.ne), this.coordinateToPixel(bounds.sw));
        this.refresh = () => {
            this.layer.onAdd();
            this.layer.draw();
            return this;
        };
        this.remove = () => {
            this.layer.onRemove();
            return this;
        };
        this.show = () => {
            this.layer.setMap(this.map.getMap());
            return this;
        };
        this.hide = () => {
            this.layer.setMap(null);
            return this;
        };
        this.target = (clickable) => {
            const panes = this.layer.getPanes();
            return new ElementHelper_1.default((clickable ? panes.overlayMouseTarget : panes.overlayLayer));
        };
        this.map = map;
        this.layer = new GLayer(this, name);
        this.layer.setMap(map.getMap());
    }
    onAdd() {
    }
    ;
    onDraw() {
    }
    ;
    onRemove() {
    }
    ;
}
exports.GLayerController = GLayerController;
//# sourceMappingURL=GLayerController.js.map