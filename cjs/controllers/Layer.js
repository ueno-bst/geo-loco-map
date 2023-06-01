"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebugLayer = exports.GridLayerController = exports.MessageLayer = exports.LoadingLayer = void 0;
const Element_1 = require("./Element");
const Response_1 = require("../entities/Response");
const EventType_1 = __importDefault(require("../utils/EventType"));
const MapEventType_1 = require("./MapEventType");
function FullSizeLayer(base) {
    class FullSizeLayer extends base {
        onDraw() {
            const e = this.e;
            const bound = this.map.getBounds();
            if (e && bound) {
                e.setPosition(this.boundToRect(bound));
            }
        }
    }
    return FullSizeLayer;
}
function LoadingLayer(base) {
    base = FullSizeLayer(base);
    class LoadingLayer extends base {
        onAdd() {
            if (!this.e) {
                this.e = new Element_1.LoadingElement();
            }
            const target = this.target(true);
            if (target) {
                target.append(this.e);
            }
        }
        onRemove() {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }
    }
    return LoadingLayer;
}
exports.LoadingLayer = LoadingLayer;
function MessageLayer(base) {
    base = FullSizeLayer(base);
    class MessageLayer extends base {
        onAdd() {
            if (!this.e) {
                this.e = new Element_1.MessageElement();
            }
            const target = this.target(false);
            if (target) {
                target.append(this.e);
            }
        }
        onRemove() {
            const e = this.e;
            if (e) {
                e.remove();
            }
        }
        html(html) {
            const e = this.e;
            if (e) {
                if (!html) {
                    return e.getHtml();
                }
                e.setHtml(html);
            }
        }
        text(text) {
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
exports.MessageLayer = MessageLayer;
function GridLayerController(base) {
    const o = Object;
    class GridLayerController extends base {
        constructor() {
            super(...arguments);
            /**
             * 矩形範囲の HTMLElement リスト
             */
            this.be = [];
            /**
             * マーカーの生データリスト
             */
            this.mo = {};
            /**
             * マーカー用 HTMLElement リスト
             */
            this.me = {};
            /**
             * アクティブなマーカーグリッドのリスト
             */
            this._selected = null;
        }
        init() {
            const t = this;
            t.mo = t.mo || {};
            t.me = t.me || {};
            t.be = t.be || [];
            this.selected(null);
            super.init();
        }
        onAdd() {
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
                        const mid = data.marker_id;
                        let marker = this.me[mid];
                        if (!marker) {
                            marker = new Element_1.GridMarkerElement(data.coordinate)
                                .setID(mid)
                                .on(EventType_1.default.MOUSE_OVER, (e) => {
                                this.map.fire(MapEventType_1.MapEventType.MARKER_HOVER, false, marker.getRefs());
                                return false;
                            })
                                .on(EventType_1.default.CLICK, (e) => {
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
        onDraw() {
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
        }
        ;
        addBound(...bounds) {
            for (let bound of bounds) {
                const element = new Element_1.GridBoundElement(bound)
                    .on(EventType_1.default.CLICK, (e) => {
                    if (element.active) {
                        this.map.setBounds(element.bounds);
                        return false;
                    }
                });
                this.be.push(element);
            }
            this.refresh();
            // グリッドマーカー追加イベントを発行
            this.map.fire(MapEventType_1.MapEventType.GRID_ADD, true, bounds);
        }
        addMarker(...markers) {
            const markerList = o.values(this.mo);
            // 新しいマーカーを追加
            for (let marker of markers) {
                const data = new Response_1.MarkerData(marker);
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
            this.map.fire(MapEventType_1.MapEventType.MARKER_ADD, true, this.mo);
        }
        getMarker(id) {
            const markers = this.mo || {};
            if (markers[id]) {
                return markers[id];
            }
            return null;
        }
        getGroupInMarker(id) {
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
        getDisplayMarkers(limit = 0) {
            let list = [];
            const bound = this.map.getBounds(), center = this.map.getCenter();
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
        removeMarker(...ids) {
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
        clearMarker() {
            this.selected();
            for (let element of o.values(this.me)) {
                element.remove();
            }
            this.me = {};
            // マーカー追加イベントを発行
            this.map.fire(MapEventType_1.MapEventType.MARKER_HIDE, true);
        }
        clear() {
            this.be = [];
            for (let id of o.keys(this.mo)) {
                if (!this.mo[id].user) {
                    delete this.mo[id];
                }
            }
            this.clearMarker();
            this.refresh();
        }
        selected(id = null) {
            const current = this._selected;
            if (current == id) {
                id = null;
            }
            if (current && this.me[current]) {
                this.map.fire(MapEventType_1.MapEventType.MARKER_RELEASE, false, this.me[current].getRefs());
                this.me[current].removeClass("is-select");
            }
            if (id && this.me[id]) {
                this.map.fire(MapEventType_1.MapEventType.MARKER_SELECT, false, this.me[id].getRefs());
            }
            this._selected = id;
            this.onDraw();
        }
    }
    return GridLayerController;
}
exports.GridLayerController = GridLayerController;
function DebugLayer(base) {
    class DebugLayerController extends base {
        constructor() {
            super(...arguments);
            this._classes = [];
        }
        onAdd() {
            if (!this.e) {
                this.e = new Element_1.DebugElement();
            }
            const target = this.target(false);
            if (target) {
                target.append(this.e).addClass("gl-debugs");
            }
        }
        onDraw() {
            const e = this.e;
            if (e) {
                e.addClass(...this._classes);
                if (this._bounds) {
                    e.setPosition(this.boundToRect(this._bounds));
                }
            }
        }
        setClasses(...classes) {
            this._classes = classes;
            return this;
        }
        setBound(bounds) {
            this._bounds = bounds;
            this.refresh();
            return this;
        }
    }
    return DebugLayerController;
}
exports.DebugLayer = DebugLayer;
//# sourceMappingURL=Layer.js.map