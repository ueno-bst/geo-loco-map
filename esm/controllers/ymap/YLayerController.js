import { ILayerController } from "../ILayerController";
import { getClass } from "../../utils/Mixin";
import { Point, Rectangle } from "../../entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
import { MapEventType } from "../MapEventType";
const get_class = getClass;
function YLayerBase(base) {
    const ext = get_class(base);
    return class Layer extends ext {
        constructor() {
            super(...arguments);
            this.drawLayer = (force) => {
                const root = this.root;
                if (root) {
                    if (force) {
                        root.onAdd();
                    }
                    root.onDraw();
                }
            };
            this.remove = () => {
                const root = this.root;
                if (root) {
                    root.onRemove();
                }
                super.remove();
            };
        }
    };
}
const Layer = YLayerBase(Y.Layer);
const FeatureLayer = YLayerBase(Y.FeatureLayer);
const Feature = get_class(Y.Feature);
class YLayer extends Layer {
    constructor(controller, name, options) {
        super(name, options);
        this.root = controller;
    }
}
class YFeatureLayer extends FeatureLayer {
    constructor(controller, name) {
        super(name);
        this.root = controller;
    }
    addFeature() {
    }
    removeFeature() {
    }
    clearFeatures() {
    }
}
class YLayerControllerBase extends ILayerController {
    constructor(map) {
        super();
        this.coordinateToPixel = (latlng) => new Point(this.layer.fromLatLngToDivPixel(latlng.ymap()));
        this.boundToRect = (bounds) => new Rectangle(this.coordinateToPixel(bounds.ne), this.coordinateToPixel(bounds.sw));
        this.refresh = () => {
            this.layer.drawLayer(true);
            return this;
        };
        this.remove = () => {
            this.layer.remove();
            return this;
        };
        this.show = () => {
            this.layer.show();
            return this;
        };
        this.hide = () => {
            this.layer.hide();
            return this;
        };
        this.target = (clickable) => {
            const container = this.layer.getContainer();
            return container && container.length > 0 ? new ElementHelper(container[0]) : null;
        };
        this.map = map;
        // ズーム率変更時の、地物再配置を行う
        map.emit.on(MapEventType.ZOOM, () => {
            this.onDraw();
        });
    }
    onAdd() {
    }
    onDraw() {
    }
    onRemove() {
    }
}
export class YLayerController extends YLayerControllerBase {
    constructor(map, name, options) {
        super(map);
        this.layer = new YLayer(this, name, options);
        map.getMap().addLayer(this.layer);
    }
}
export class YFeatureLayerController extends YLayerControllerBase {
    constructor(map, name) {
        super(map);
        this.layer = new YFeatureLayer(this, name);
        map.getMap().addLayer(this.layer);
    }
}
//# sourceMappingURL=YLayerController.js.map