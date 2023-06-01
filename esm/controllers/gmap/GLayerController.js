import { getClass } from "../../utils/Mixin";
import { ILayerController } from "../ILayerController";
import { Point, Rectangle } from "../../entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
const get_class = getClass;
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
export class GLayerController extends ILayerController {
    constructor(map, name) {
        super();
        this.coordinateToPixel = (latlng) => new Point(this.layer.getProjection().fromLatLngToDivPixel(latlng.gmap()));
        this.boundToRect = (bounds) => new Rectangle(this.coordinateToPixel(bounds.ne), this.coordinateToPixel(bounds.sw));
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
            return new ElementHelper((clickable ? panes.overlayMouseTarget : panes.overlayLayer));
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
//# sourceMappingURL=GLayerController.js.map