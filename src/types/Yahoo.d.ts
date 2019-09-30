declare namespace Y {
    class LatLng {
        constructor(lat: number, lng: number)

        lat(): number

        lng(): number
    }

    class LatLngBounds {
        constructor(sw: LatLng, ne: LatLng)

        ne: LatLng;
        sw: LatLng;
    }

    class Point {
        x: number
        y: number

        constructor(x: number, y: number)
    }

    interface MapOption {
        configure?: MapConfig,
    }

    interface MapConfig {
        doubleClickZoom?: boolean,
        scrollWheelZoom?: boolean,
        singleClickPan?: boolean,
        dragging?: boolean,
        continuousZoom?: boolean,
        hybridPhoto?: boolean,
        enableFlickScroll?: boolean,
        enableOpenStreetMap?: boolean,
        mapType?: MapType,
        weatherOverlay?: boolean,
    }

    enum MapType {
        NORMAL,
        STANDARD,
        SMARTPHONE,
    }

    class Map {
        constructor(id: string, option: MapOption)

        getZoom(): number

        getCenter(): LatLng

        addFeature(feather: Feather): void

        removeFeature(feather: Feather): void

        drawMap(latlng: LatLng, zoom: number, LayerSetId: number): void

        setZoom(zoom: number, animation: boolean, latlng: Y.LatLng, center: boolean): void

        addControl(layer?: LayerSetControl,
                   center?: CenterMarkControl,
                   home?: HomeControl,
                   scale?: ScaleControl,
                   Zoom?: ZoomControl,
                   SlideZoomh?: SliderZoomControlHorizontal,
                   slideZoomv?: SliderZoomControlVertical,
                   search?: SearchControl
        ): void

        removeControl(layer?: LayerSetControl,
                      center?: CenterMarkControl,
                      home?: HomeControl,
                      scale?: ScaleControl,
                      Zoom?: ZoomControl,
                      SlideZoomh?: SliderZoomControlHorizontal,
                      slideZoomv?: SliderZoomControlVertical,
                      search?: SearchControl
        ): void

        bind(eventName: string, handler: (...args: any[]) => void): void

        getBounds(): LatLngBounds | null;

        updateSize(): void;
    }

    class LayerSetControl {
    }

    class CenterMarkControl {
    }

    class HomeControl {
    }

    class ScaleControl {
    }

    class ZoomControl {
    }

    class SliderZoomControlHorizontal {
    }

    class SliderZoomControlVertical {
    }

    class SearchControl {
    }

    class Controller {
    }

    class LayerSetId {
        static NORMAL: number
    }

    class Size {
        constructor(width: number, height: number)
    }

    type IconOption = {
        iconSize?: Size,
        iconAnchor?: Point,
        infoWindowAnchor?: Point,
        className?: string,
        iconHtml?: string
    }

    class Icon {
        constructor(src: string, option?: IconOption)
    }

    type MarkerOption = {
        icon: Icon
    }
    type LabelOption = {
        className: string
    }

    interface Feather {
        getLatLng(): LatLng

        getMap(): Map

        bind(eventName: string, fn: Function): void
    }

    class Marker implements Feather {
        constructor(latlng: LatLng, option?: MarkerOption)

        getLatLng(): LatLng

        getMap(): Map

        bind(eventName: string, fn: Function): void

        bindInfoWindow(detail: string): void

        openInfoWindow(content: string): void
    }

    class Label implements Feather {
        constructor(latlng: LatLng, label: string, option?: LabelOption)

        getLatLng(): LatLng

        getMap(): Map

        bind(eventName: string, fn: Function): void
    }

    class MapEvents {
        Drag(): void
    }
}
