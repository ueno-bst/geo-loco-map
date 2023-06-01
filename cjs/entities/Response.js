"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkerData = void 0;
const JsonHelper_1 = require("../utils/JsonHelper");
const LatLng_1 = require("./LatLng");
var FormatType;
(function (FormatType) {
    FormatType["HTML"] = "html";
    FormatType["TEXT"] = "text";
})(FormatType || (FormatType = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["BOUNDS"] = "bounds";
})(ResponseType || (ResponseType = {}));
var ResponseFormat;
(function (ResponseFormat) {
    ResponseFormat["MARKER"] = "marker";
    ResponseFormat["GRID"] = "grid";
})(ResponseFormat || (ResponseFormat = {}));
class MarkerData {
    constructor(data) {
        this.marker_id = "";
        this.coordinate = new LatLng_1.LatLng(0, 0);
        this.description = "";
        this.description_format = "html";
        this.feed = "";
        this.feed_flag = false;
        this.id = "";
        this.label = "";
        this.marker_display = true;
        this.url = "";
        this.user = false;
        this.data = {};
        const c = new JsonHelper_1.JsonHelper(data);
        this.description = c.string('description', this.description);
        this.description_format = c.enum(FormatType, 'description_format', this.description_format);
        this.feed = c.string('feed', this.feed);
        this.feed_flag = c.boolean('feed_flag', this.feed_flag);
        this.label = c.string('label', this.label);
        this.id = c.string('id', this.id);
        this.marker_display = c.boolean('marker_display', this.marker_display);
        this.url = c.string('url', this.url);
        this.user = c.boolean("user", this.user);
        this.data = c.get('data', this.data);
        let coordinate = data['coordinate'];
        if (Array.isArray(coordinate)) {
            this.coordinate = new LatLng_1.LatLng(coordinate);
        }
        this.marker_id = "gl-marker-" + this.coordinate.hash(8);
        if (this.id === "") {
            this.id = "#tmp-" + (MarkerData.index++);
        }
    }
    display() {
        return this.marker_display;
    }
    content() {
        if (!this.display()) {
            return "";
        }
        if (this.feed_flag && this.feed !== "") {
            return `<iframe src="${this.feed}" style="border:0;"></iframe>`;
        }
        else if (this.description !== "") {
            let classes = "format-html";
            let content = this.description;
            if (this.description_format == FormatType.TEXT) {
                classes = "format-text";
                content = this.escapeHtml(content);
            }
            return `<section class="${classes}">${content}</section>`;
        }
        return "";
    }
    get lat() {
        return this.coordinate.lat;
    }
    get lng() {
        return this.coordinate.lng;
    }
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/`/g, '&#x60;')
            .replace(/\r?\n/g, '<br>');
    }
}
exports.MarkerData = MarkerData;
MarkerData.index = 1;
//# sourceMappingURL=Response.js.map