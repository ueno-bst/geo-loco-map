import {IBoundGridContentData, IBoundGridData} from "../../entities/Response";
import ElementHelper from "../../utils/ElementHelper";
import {getClass} from "../../utils/Mixin";
import {GridBoundElement, GridMarkerElement, LoadingElement, MessageElement} from "../Element";
import {Rectangle, LatLngBounds, Point} from "../../entities/LatLng";

window.Y = window.Y || {};

const get_class = getClass;

const Layer = get_class(Y.Layer);
const FeatureLayer = get_class(Y.FeatureLayer);
const Feature = get_class(Y.Feature);

export class GridFeatureLayer extends FeatureLayer {
    drawLayer(force: boolean): void {
        super.drawLayer(force);

        const container = this.getContainer();

        container.attr("id", "gl-grids");
    }

    refreshGrid(grids: IBoundGridData[]): void {
        this.removeBounds();
        this.addBounds(grids);
    }

    removeBounds() {
        this.clearFeatures();
    }

    addBounds(grids: IBoundGridData[]) {

        for (let grid of grids) {
            if (grid.count > 0) {
                const bounds = new LatLngBounds(grid.bounds);
                const feature = new GridBound(grid);

                this.addFeature(feature);
            }
        }
    }

    addMarkers(markers: IBoundGridContentData[]) {
        markers = markers.sort(function (a, b) {
            if (a.coordinate.lat > b.coordinate.lat) {
                return -1;
            }
            return 1;
        });

        for (let content of markers) {
            if (content.count > 0) {
                const feature = new GridMarker(content);
                this.addFeature(feature);
            }
        }
    }
}

class GridBound extends Feature {
    protected element: GridBoundElement;

    protected div?: ElementHelper;

    constructor(bound: IBoundGridData) {
        super();

        this.element = new GridBoundElement(bound).on('click', (e) => {
            this.onClick(e as MouseEvent);
        });
    }

    draw(force: boolean): void {
        if (!this.div || force) {
            if (this.div) {
                this.div.remove();
            }

            const container = this.layer.getContainer();
            const bound = this.element.bounds;
            const sw = this.layer.fromLatLngToDivPixel(bound.sw.ymap());
            const ne = this.layer.fromLatLngToDivPixel(bound.ne.ymap());

            this.element.setPosition(new Rectangle(ne, sw));

            container.append(this.element.src);

            this.drawn = true;
        }
    }

    remove(): void {
        this.element.remove();
    }

    protected onClick(event: MouseEvent) {
        if (this.element.active) {
            const bound = this.element.bounds.ymap();
            const map = this.getMap();
            const zoom = map.getBoundsZoomLevel(bound);

            map.setZoom(zoom, true, bound.getCenter());
        }

        event.stopPropagation();
    }
}

class GridMarker extends Feature {
    protected element: GridMarkerElement;

    protected div?: ElementHelper;

    constructor(marker: IBoundGridContentData) {
        super();

        this.element = new GridMarkerElement(marker).on("click", (e) => this.onClick(e as MouseEvent));
    }

    draw(force: boolean): void {
        if (force) {

            const container = this.layer.getContainer();
            const centre = this.layer.fromLatLngToDivPixel(this.element.point.ymap());

            this.element.setPosition(new Point(centre));

            container.append(this.element.src);

            this.drawn = true;
        }
    }

    remove(): void {
        this.element.remove();
    }

    protected onClick(event: MouseEvent) {
        if (this.element.active) {
            console.info(this.element.value.id);
        }

        event.stopPropagation();
    }
}

export class LoadingLayer extends Layer {

    protected e?: LoadingElement;

    drawLayer(force: boolean): void {
        const container = this.getContainer();

        if (!this.e || force) {
            this.e = new LoadingElement();

            container
                .empty()
                .append(this.e.src);
        }

        const bounds = this.getMap().getBounds();

        if (!bounds) {
            return;
        }

        const ne = this.fromLatLngToDivPixel(bounds.ne);
        const sw = this.fromLatLngToDivPixel(bounds.sw);

        this.e.setPosition(new Rectangle(ne, sw));
    }
}

export class MessageLayer extends Layer {
    protected e?: MessageElement;

    protected message: string = 'MessageBox';

    drawLayer(force: boolean): void {
        const container = this.getContainer();

        if (!this.e || force) {
            const e = this.e = new MessageElement();

            container
                .empty()
                .append(e.src);
        }

        const bounds = this.getMap().getBounds();

        if (!bounds) {
            return;
        }

        const ne = this.fromLatLngToDivPixel(bounds.ne);
        const sw = this.fromLatLngToDivPixel(bounds.sw);

        this.e
            .setPosition(new Rectangle(ne, sw))
            .setHtml(this.message);
    }

    setMessage(message: string) {
        this.message = message;
        this.drawLayer(false);
    }
}