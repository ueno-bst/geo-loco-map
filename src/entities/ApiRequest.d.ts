import { ICoordinate } from "./Coordinate";
export declare class ApiRequest {
    coordinate: ICoordinate;
    response: any;
    url: string;
    zoom: number;
    constructor(coordinate: ICoordinate, url: string, zoom?: number);
    request(): Promise<any>;
}
//# sourceMappingURL=ApiRequest.d.ts.map