import {Constructor} from "../utils/Mixin";
import {IDebugLayerController, IGridLayerController, ILayerController, IMessageLayerController} from "./ILayerController";
import ElementHelper from "../utils/ElementHelper";
import {DebugElement, GridBoundElement, GridMarkerElement, LoadingElement, MessageElement} from "./Element";
import {IBoundData, IMarkerData, MarkerData} from "../entities/Response";
import EventType from "../utils/EventType";
import {MapEventType} from "./MapEventType";
import {LatLngBounds, Rectangle} from "../entities/LatLng";

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
        me: { [hash: string]: GridMarkerElement } = {};

        /**
         * アクティブなマーカーグリッドのリスト
         */
        _selected: string | null = null;

        init(): void {
            const t = this;

            t.mo = t.mo || {};
            t.me = t.me || {};
            t.be = t.be || [];

            this.selected(null);

            super.init();
        }

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

                let hasBound = false;

                for (let bound of this.be) {
                    e.append(bound);
                    hasBound = true;
                }

                if (o.keys(this.me).length === 0) {
                    for (let id in this.mo) {
                        const data = this.mo[id];

                        if (!data.marker_display) {
                            continue;
                        }

                        const mid = data.marker_id

                        let marker = this.me[mid];

                        if (!marker) {
                            marker = new GridMarkerElement(data.coordinate)
                                .setID(mid)
                                .on(EventType.MOUSE_OVER, (e) => {
                                    this.map.fire(MapEventType.MARKER_HOVER, false, marker.getRefs());
                                    return false;
                                })
                                .on(EventType.CLICK, (e) => {
                                    if (marker.active) {
                                        this.selected(marker.getID());
                                    }
                                    return false;
                                });
                        }

                        marker.addRefs(data.id);

                        this.me[mid] = marker;
                    }
                }

                if (!hasBound) {
                    for (let marker of o.values(this.me)) {
                        e.append(marker);
                    }
                }
            }
        }

        onDraw(): void {
            if (this.e) {
                for (let bound of this.be) {
                    bound.setPosition(this.boundToRect(bound.bounds));
                }

                for (let marker of o.values(this.me)) {
                    marker
                        .setPosition(this.coordinateToPixel(marker.point))
                        .toggleClass('is-select', marker.getID() == this._selected);
                }
            }
        };

        addBound(...bounds: IBoundData[]): void {
            for (let bound of bounds) {
                const element = new GridBoundElement(bound)
                    .on(EventType.CLICK, (e) => {
                        if (element.active) {
                            this.map.setBounds(element.bounds);
                            return false;
                        }
                    });
                this.be.push(element);
            }

            this.refresh();

            // グリッドマーカー追加イベントを発行
            this.map.fire(MapEventType.GRID_ADD, true, bounds);
        }

        addMarker(...markers: IMarkerData[]): void {
            const markerList = o.values(this.mo);

            // 新しいマーカーを追加
            for (let marker of markers) {
                const data = new MarkerData(marker);

                if (!this.mo[data.id]) {
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

            for (let marker of markerList) {
                this.mo[marker.id] = marker;
            }

            this.clearMarker();

            // 再描写
            this.refresh();

            // ピンマーカー追加イベントを発行
            this.map.fire(MapEventType.MARKER_ADD, true, this.mo);
        }

        getMarker(id: string): MarkerData | null {
            const markers = this.mo || {};

            if (markers[id]) {
                return markers[id];
            }

            return null;
        }

        getGroupInMarker(id: string): MarkerData[] {
            const list = [];

            if (this.me[id]) {
                const refs = this.me[id].getRefs();

                for (let ref of refs) {
                    const marker = this.getMarker(ref);
                    if (marker) {
                        list.push(marker);
                    }
                }
            }

            return list;
        }

        getDisplayMarkers(limit: number = 0): MarkerData[] {
            let list: MarkerData[] = [];

            const bound = this.map.getBounds(),
                center = this.map.getCenter();

            if (!bound) {
                return list;
            }

            // 全てのマーカー情報を取得する
            for (let id in this.me) {
                list.push(...this.getGroupInMarker(id));
            }

            // 矩形内に存在しないマーカーは除外する
            list = list.filter((a) => {
                return bound.inside(a.coordinate);
            });

            // 中心点に近い順にマーカーをソートする
            list = list.sort((a, b) => {
                const ad = center.distance(a.coordinate), bd = center.distance(b.coordinate);

                if (ad < bd) {
                    return -1;
                }

                if (ad > bd) {
                    return 1;
                }

                return 0;
            });

            return limit > 0 ? list.slice(0, limit) : list;
        }

        removeMarker(...ids: string[]): number {
            let count = 0;

            for (let id of ids) {
                if (this.mo[id]) {
                    delete this.mo[id];
                    count++;
                }
            }

            if (count > 0) {
                this.clearMarker();
                this.refresh();
            }

            return count;
        }

        /**
         * 既存のマーカーエレメントを削除する
         */
        clearMarker(): void {
            this.selected();

            for (let element of o.values(this.me)) {
                element.remove();
            }

            this.me = {};

            // マーカー追加イベントを発行
            this.map.fire(MapEventType.MARKER_HIDE, true);
        }

        clear(): void {
            this.be = [];

            for (let id of o.keys(this.mo)) {
                if (!this.mo[id].user) {
                    delete this.mo[id];
                }
            }

            this.clearMarker();

            this.refresh();
        }

        selected(id: string | null = null): void {
            const current = this._selected;

            if (current == id) {
                id = null;
            }

            if (current && this.me[current]) {
                this.map.fire(MapEventType.MARKER_RELEASE, false, this.me[current].getRefs());
                this.me[current].removeClass("is-select");
            }

            if (id && this.me[id]) {
                this.map.fire(MapEventType.MARKER_SELECT, false, this.me[id].getRefs());
            }

            this._selected = id;

            this.onDraw();
        }
    }

    return GridLayerController;
}

export function DebugLayer<T extends Constructor<ILayerController>>(base: T) {
    abstract class DebugLayerController extends base implements IDebugLayerController {
        e?: ElementHelper;
        _classes: string[] = [];
        _bounds?: LatLngBounds;
        _rectangle?: Rectangle;

        onAdd(): void {
            if (!this.e) {
                this.e = new DebugElement();
            }

            const target = this.target(false);

            if (target) {
                target.append(this.e).addClass("gl-debugs");
            }
        }

        onDraw(): void {
            const e = this.e;

            if (e) {
                e.addClass(...this._classes);

                if (this._bounds) {
                    e.setPosition(this.boundToRect(this._bounds));
                }
            }
        }

        setClasses(...classes: string[]): this {
            this._classes = classes;
            return this;
        }

        setBound(bounds: LatLngBounds): this {
            this._bounds = bounds;
            this.refresh();
            return this;
        }
    }

    return DebugLayerController;
}