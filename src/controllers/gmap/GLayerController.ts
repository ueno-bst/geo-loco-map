import {getClass} from "~/utils/Mixin";
import {ILayer, ILayerController} from "../ILayerController";
import {LatLng, LatLngBounds, Point, Rectangle} from "~/entities/LatLng";
import ElementHelper from "../../utils/ElementHelper";
import {GMapController} from "./GMapController";

const
    get_class = getClass;

const Layer = get_class(google.maps.OverlayView);

class GLayer extends Layer implements ILayer {
    root: GLayerController;
    name: string;

    constructor(controller: GLayerController, name: string) {
        super();
        this.root = controller;
        this.name = name;
    }

    onAdd = (): void => {
        this.root.onAdd();
    };

    draw = (): void => {
        this.root.onDraw();
    };

    onRemove = (): void => {
        this.root.onRemove();
    };
}

export class GLayerController extends ILayerController {
    layer: GLayer;
    map: GMapController;

    constructor(map: GMapController, name: string) {
        super();

        this.map = map;
        this.layer = new GLayer(this, name);

        this.layer.setMap(map.getMap());
    }

    coordinateToPixel = (latlng: LatLng): Point => new Point(this.layer.getProjection().fromLatLngToDivPixel(latlng.gmap()));

    boundToRect = (bounds: LatLngBounds): Rectangle => new Rectangle(
        this.coordinateToPixel(bounds.ne),
        this.coordinateToPixel(bounds.sw)
    );

    refresh = (): this => {
        this.layer.onAdd();
        this.layer.draw();
        return this;
    };

    remove = (): this => {
        this.layer.onRemove();
        return this
    };

    show = (): this => {
        this.layer.setMap(this.map.getMap());
        return this
    };

    hide = (): this => {
        this.layer.setMap(null);
        return this;
    };

    target = (clickable: boolean): ElementHelper | null => {
        const panes = this.layer.getPanes();
        return new ElementHelper((clickable ? panes.overlayMouseTarget : panes.overlayLayer) as HTMLElement);
    };

    onAdd(): void {
    };

    onDraw(): void {
    };

    onRemove(): void {
    };
}
