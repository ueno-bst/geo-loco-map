import {getClass} from "../../utils/Mixin";
import {ElementHelper} from "../../utils/ElementHelper";
import {IBoundGridContentData, IBoundGridData} from "../../entities/Response";
import {GridBoundElement, GridMarkerElement, IOverWrapBaseElement, LoadingElement, MessageElement} from "../Element";
import {Rectangle, Point} from "../../entities/LatLng";

window.google = window.google || {maps: {}};

const OverlayView = getClass(google.maps.OverlayView);

class Layer extends OverlayView {

    protected layer?: ElementHelper;

    public constructor(map: google.maps.Map) {
        super();

        this.setMap(map);
    }

    onAdd(): void {
        const panes = this.getPanes();

        if (!this.layer) {
            this.layer = new ElementHelper(panes.overlayMouseTarget as HTMLElement);
        }
    }
}

class OverWrapLayer<T extends IOverWrapBaseElement> extends Layer {
    protected element?: T;


    onAdd(): void {
        const panes = this.getPanes();

        if (!this.layer) {
            this.layer = new ElementHelper(panes.overlayLayer as HTMLElement);
        }
    }

    draw(): void {
        const map = this.getMap();

        if (this.element && this.layer && map instanceof google.maps.Map) {
            const bounds = map.getBounds();

            if (bounds instanceof google.maps.LatLngBounds) {
                const projection = this.getProjection();

                const ne = projection.fromLatLngToDivPixel(bounds.getNorthEast());
                const sw = projection.fromLatLngToDivPixel(bounds.getSouthWest());

                this.element.setPosition(new Rectangle(ne, sw));
            }
        }
    }

    show() {
        if (this.element) {
            this.element.setStyles({
                visibility: "visible",
            });
        }
    }

    hide() {
        if (this.element) {
            this.element.setStyles({
                visibility: "hidden",
            });
        }
    }
}

export class GridFeatureLayer extends Layer {

    protected div?: ElementHelper;

    protected layer?: ElementHelper;

    protected bounds: GridBoundElement[] = [];
    protected markers: GridMarkerElement[] = [];

    onAdd(): void {
        super.onAdd();

        if (this.layer) {
            this.layer.setID("gl-grids");
        }
    }

    draw(force: boolean = false): void {
        if (!this.layer) {
            return;
        }

        if (force) {
            this.layer.empty();
        }

        const projection = this.getProjection();

        for (let bound of this.bounds) {
            const b = bound.bounds;
            const sw = projection.fromLatLngToDivPixel(b.sw.gmap());
            const ne = projection.fromLatLngToDivPixel(b.ne.gmap());

            bound.setPosition(new Rectangle(ne, sw));

            if (force) {
                this.layer.append(bound);
            }
        }

        for (let marker of this.markers) {
            const p = marker.point;
            const centre = projection.fromLatLngToDivPixel(p.gmap());

            marker.setPosition(new Point(centre));

            if (force) {
                this.layer.append(marker);
            }
        }
    }

    addBounds(bounds: IBoundGridData[]) {
        for (let bound of bounds) {
            if (bound.count > 0) {
                const element = new GridBoundElement(bound);

                element.on('click', (e) => this.onClickBound(e as MouseEvent, element));

                this.bounds.push(element);
            }
        }

        this.draw(true);
    }

    addMarkers(markers: IBoundGridContentData[]) {
        markers = markers.sort(function (a, b) {
            if (a.coordinate.lat > b.coordinate.lat) {
                return -1;
            }
            return 1;
        });

        for (let marker of markers) {
            const element = new GridMarkerElement(marker).on("click", (e) => this.onClickMarker(e as MouseEvent, element));

            this.markers.push(element);
        }

        this.draw(true);
    }

    removeBounds() {
        for (let bound of this.bounds) {
            bound.remove();
        }

        for (let marker of this.markers) {
            marker.remove();
        }

        this.bounds = [];
        this.markers = [];
    }

    onClickBound(event: MouseEvent, element: GridBoundElement) {
        if (element.active) {
            const map = this.getMap();

            if (map instanceof google.maps.Map) {
                map.fitBounds(element.bounds.gmap());
            }
        }

        event.stopPropagation();
    }

    onClickMarker(event: MouseEvent, element: GridMarkerElement) {
        if (element.active) {
            console.info(element.value.id);
        }

        event.stopPropagation();
    }
}

export class LoadingLayer extends OverWrapLayer<LoadingElement> {
    onAdd(): void {
        super.onAdd();

        if (this.layer) {
            this.element = new LoadingElement();

            this.layer
                .append(this.element);
        }
    }
}

export class MessageLayer extends OverWrapLayer<MessageElement> {

    onAdd(): void {
        super.onAdd();

        if (this.layer) {
            this.element = new MessageElement();

            this.layer
                .append(this.element);
        }
    }

    setText(text: string) {
        if (this.element) {
            this.element.setText(text);
        }
    }

    setHtml(html: string) {
        if (this.element) {
            this.element.setHtml(html);
        }
    }
}