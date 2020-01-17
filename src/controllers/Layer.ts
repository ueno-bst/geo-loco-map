import {Constructor} from "../utils/Mixin";
import {IGridLayerController, ILayerController, IMessageLayerController} from "./ILayerController";
import ElementHelper from "../utils/ElementHelper";
import {GridBoundElement, GridMarkerElement, LoadingElement, MessageElement} from "./Element";
import {IBoundGridData, IMarkerData, MarkerData} from "../entities/Response";
import EventType from "../utils/EventType";
import {GeoHash} from "../entities/GeoHash";

function FullSizeLayer<T extends Constructor<ILayerController>>(base: T) {
    abstract class FullSizeLayer extends base implements ILayerController {
        e?: ElementHelper;

        onDraw(): void {
            const e = this.e;
            const bound = this.map.getBounds();

            if (e && bound) {
                e.setPosition(this.boundToRect(bound));
            }
        }
    }

    return FullSizeLayer;
}

export function LoadingLayer<T extends Constructor<ILayerController>>(base: T) {
    base = FullSizeLayer(base);

    abstract class LoadingLayer extends base implements ILayerController {
        e?: ElementHelper;

        onAdd(): void {
            if (!this.e) {
                this.e = new LoadingElement();
            }

            const target = this.target(true);

            if (target) {
                target.append(this.e);
            }
        }

        onRemove(): void {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }
    }

    return LoadingLayer;
}

export function MessageLayer<T extends Constructor<ILayerController>>(base: T) {
    base = FullSizeLayer(base);

    abstract class MessageLayer extends base implements IMessageLayerController {
        e?: ElementHelper;

        onAdd(): void {
            if (!this.e) {
                this.e = new MessageElement();
            }

            const target = this.target(false);

            if (target) {
                target.append(this.e);
            }
        }

        onRemove(): void {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }

        html(html?: string): string | void {
            const e = this.e;

            if (e) {

                if (!html) {
                    return e.getHtml();
                }

                e.setHtml(html);
            }
        }

        text(text?: string): string | void {
            const e = this.e;

            if (e) {
                if (!text) {
                    return e.getText();
                }

                e.setText(text);
            }
        }
    }

    return MessageLayer;
}

export function GridLayerController<T extends Constructor<ILayerController>>(base: T) {
    const o = Object;

    abstract class GridLayerController extends base implements IGridLayerController {
        e?: ElementHelper;

        /**
         * 矩形範囲の HTMLElement リスト
         */
        be: GridBoundElement[] = [];

        /**
         * マーカーの生データリスト
         */
        mo: { [id: string]: MarkerData } = {};

        /**
         * マーカー用 HTMLElement リスト
         */
        me: {[hash: string]: GridMarkerElement } = {};

        onAdd(): void {
            let e = this.e;

            if (!e) {
                const target = this.target(true);

                if (target) {
                    e = this.e = target.setID("gl-grids");
                }
            }

            if (e) {
                e.empty();

                for (let bound of this.be || []) {
                    e.append(bound);
                }

                const markers = this.me || {};

                if (o.keys(markers).length === 0) {
                    for (let id in this.mo || {}) {
                        const data = this.mo[id];

                        if (!data.marker_display) {
                            continue;
                        }

                        const hash = GeoHash.encode(data.coordinate, 8);

                        let marker = markers[hash];

                        if (!marker) {
                            marker = new GridMarkerElement(data.coordinate)
                                .setID("gl-marker-" + hash)
                                .on(EventType.CLICK, (e) => this.selectMarker(marker));
                        }

                        marker.addRefs(data.id);

                        markers[hash] = marker;
                    }
                }

                for (let marker of o.values(markers)) {
                    e.append(marker);
                }

                this.me = markers;
            }
        }

        onDraw(): void {
            if (this.e) {
                for (let bound of this.be || []) {
                    bound.setPosition(this.boundToRect(bound.bounds));
                }

                for (let marker of o.values(this.me || {})) {
                    marker.setPosition(this.coordinateToPixel(marker.point));
                }
            }
        };

        addBound(...bounds: IBoundGridData[]): void {
            this.be = this.be || [];

            for (let bound of bounds) {
                const element = new GridBoundElement(bound)
                    .on(EventType.CLICK, (e) => this.zoomToBound(element));
                this.be.push(element);
            }

            this.refresh();
        }

        addMarker(...markers: IMarkerData[]): void {
            let markerObjects = this.mo || {};

            const markerList = o.values(markerObjects);

            // 新しいマーカーを追加
            for (let marker of markers) {
                const data = new MarkerData(marker);

                if (!markerObjects[data.id]) {
                    markerList.push(data);
                }
            }

            // マーカーデータを座標(緯度)順にソート
            markerList.sort((a, b) => {
                if (a.coordinate.lat == b.coordinate.lat) {
                    return 0;
                }

                if (a.coordinate.lat > b.coordinate.lat) {
                    return -1;
                }

                return 1;
            });

            // マーカーオブジェクトリストに追加
            markerObjects = {};

            for (let marker of markerList) {
                markerObjects[marker.id] = marker;
            }

            this.mo = markerObjects;

            // 既存のマーカーエレメントを削除する
            for (let element of o.values(this.me)) {
                element.remove();
            }

            this.me = {};

            // 再描写
            this.refresh();
        }

        clear(): void {
            this.be = [];
            this.mo = {};
            this.me = {};
            this.refresh();
        }

        zoomToBound(element: GridBoundElement): false {
            if (element.active) {
                this.map.setBounds(element.bounds);
            }

            return false;
        }

        selectMarker(element: GridMarkerElement): false {
            if (element.active) {
                console.info("selectMarker", element.getRefs());
            }

            return false;
        }
    }

    return GridLayerController;
}