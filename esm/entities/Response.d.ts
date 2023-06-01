import { ILatLng, ILatLngBounds, LatLng } from "./LatLng";
type ResponseFormats = {
    grid: IBoundData[];
    content: IMarkerData[];
};
export interface IResponse<T extends keyof ResponseFormats = keyof ResponseFormats, D = ResponseFormats[T]> {
    bounds: ILatLngBounds;
    /**
     * ピン/グリッド数
     */
    count: number;
    data: D;
    datetime: string;
    error: boolean;
    format: T;
    message: string;
    scale: number;
    timestamp: number;
    /**
     * ピン/グリッドに含まれる要素数
     */
    totalCount: number;
    type: string;
    zoom: number;
}
export interface IBoundData {
    id: string;
    url: string;
    bounds: ILatLngBounds;
    label?: string;
    count: number;
    data: any;
    type: string;
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
export declare class MarkerData implements IMarkerData {
    marker_id: string;
    coordinate: LatLng;
    description: string;
    description_format: string;
    feed: string;
    feed_flag: boolean;
    id: string;
    label: string;
    marker_display: boolean;
    url: string;
    user: boolean;
    data: {};
    static index: number;
    constructor(data: any);
    display(): boolean;
    content(): string;
    get lat(): number;
    get lng(): number;
    protected escapeHtml(text: string): string;
}
export {};
//# sourceMappingURL=Response.d.ts.map