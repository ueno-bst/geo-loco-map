import {ILayer, ILayerController, ILayerHookController} from "../ILayerController";
import {Constructor, getClass} from "../../utils/Mixin";
import {LatLng, LatLngBounds, Point, Rectangle} from "../../entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
import {YMapController} from "./YMapController";

const
    get_class = getClass;

function YLayerBase<T extends Constructor<Y.Layer>>(base: T) {
    const ext: T = get_class<T>(base);

    return class Layer extends ext implements ILayer {

        root?: ILayerController;

        drawLayer(force: boolean): void {
            const root = this.root;

            if (root) {
                if (force) {
                    root.onAdd();
                }

                root.onDraw();
            }
        }

        remove(): void {
            const root = this.root;

            if (root) {
                root.onRemove();
            }

            super.remove();
        }
    }
}

const Layer = YLayerBase(Y.Layer);
const FeatureLayer = YLayerBase(Y.FeatureLayer);
const Feature = get_class(Y.Feature);

class YLayer extends Layer implements ILayer {
    root?: ILayerController;

    constructor(controller: YLayerController, name: string, options?: Object) {
        super(name);
        this.root = controller;
    }
}

class YFeatureLayer extends FeatureLayer implements ILayer {
    root: YFeatureLayerController;

    constructor(controller: YFeatureLayerController, name: string) {
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

abstract class YLayerControllerBase<L extends YLayer> extends ILayerController {
    abstract layer: L;
    map: YMapController;

    protected constructor(map: YMapController) {
        super();
        this.map = map;
    }

    coordinateToPixel = (latlng: LatLng): Point => new Point(this.layer.fromLatLngToDivPixel(latlng.ymap()));

    boundToRect = (bounds: LatLngBounds): Rectangle => new Rectangle(
        this.coordinateToPixel(bounds.ne),
        this.coordinateToPixel(bounds.sw)
    );

    refresh = (): void => this.layer.drawLayer(true);

    remove = (): void => this.layer.remove();

    show = (): void => this.layer.show();

    hide = (): void => this.layer.hide();

    target(clickable: boolean): ElementHelper | null {
        const container = this.layer.getContainer();
        return container && container.length > 0 ? new ElementHelper(container[0]) : null;
    }

    onAdd(): void {
    }

    onDraw(): void {
    }

    onRemove(): void {
    }
}

export class YLayerController extends YLayerControllerBase<YLayer> {
    layer: YLayer;

    constructor(map: YMapController, name: string, options?: Object) {
        super(map);

        this.layer = new YLayer(this, name, options);

        map.map.addLayer(this.layer);
    }
}

export class YFeatureLayerController extends YLayerControllerBase<YFeatureLayer> {
    layer: YFeatureLayer;

    constructor(map: YMapController, name: string) {
        super(map);

        this.layer = new YFeatureLayer(this, name);
    }
}
