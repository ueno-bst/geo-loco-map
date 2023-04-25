import {JsonHelper} from "../utils/JsonHelper";
import {ILatLng, ILatLngBounds, LatLng} from "./LatLng";

enum FormatType {
    HTML = "html",
    TEXT = "text",
}

enum ResponseType {
    BOUNDS = 'bounds',
}

enum ResponseFormat {
    MARKER = 'marker',
    GRID = 'grid',
}

type ResponseFormats = {
    grid: IBoundData[],
    content: IMarkerData[],
}

export interface IResponse<T extends keyof ResponseFormats = keyof ResponseFormats, D = ResponseFormats[T]> {
    bounds: ILatLngBounds,
    /**
     * ピン/グリッド数
     */
    count: number,
    data: D,
    datetime: string,
    error: boolean,
    format: T,
    message: string,
    scale: number,
    timestamp: number,
    /**
     * ピン/グリッドに含まれる要素数
     */
    totalCount: number,
    type: string,
    zoom: number,
}

export interface IBoundData {
    id: string,
    url: string,
    bounds: ILatLngBounds,
    label?: string,
    count: number,
    data: any,
}

export interface IMarkerData {
    marker_id: string;
    id: string;
    url: string;
    label: string;
    description: string;
    description_format: string;
    feed: string;
    feed_flag: boolean;
    marker_display: boolean;
    coordinate: ILatLng;
    user: boolean;
    data: any;
}

export class MarkerData implements IMarkerData {
    marker_id = "";
    coordinate = new LatLng(0, 0);
    description = "";
    description_format = "html";
    feed = "";
    feed_flag = false;
    id = "";
    label = "";
    marker_display = true;
    url = "";
    user = false;
    data = {};

    static index: number = 1;

    constructor(data: any) {
        const c = new JsonHelper(data);

        this.description = c.string('description', this.description);
        this.description_format = c.enum(FormatType, 'description_format', this.description_format);
        this.feed = c.string('feed', this.feed);
        this.feed_flag = c.boolean('feed_flag', this.feed_flag);
        this.label = c.string('label', this.label);
        this.id = c.string('id', this.id);
        this.marker_display = c.boolean('marker_display', this.marker_display);
        this.url = c.string('url', this.url);
        this.user = c.boolean("user", this.user);
        this.data = c.get('data', this.data)

        let coordinate = data['coordinate'];

        if (Array.isArray(coordinate)) {
            this.coordinate = new LatLng(coordinate);
        }

        this.marker_id = "gl-marker-" + this.coordinate.hash(8);

        if (this.id === "") {
            this.id = "#tmp-" + (MarkerData.index++);
        }
    }

    display(): boolean {
        return this.marker_display;
    }

    content(): string {
        if (!this.display()) {
            return "";
        }

        if (this.feed_flag && this.feed !== "") {
            return `<iframe src="${this.feed}" style="border:0;"></iframe>`;
        } else if (this.description !== "") {
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

    get lat(): number {
        return this.coordinate.lat;
    }

    get lng(): number {
        return this.coordinate.lng;
    }

    protected escapeHtml(text: string): string {
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
