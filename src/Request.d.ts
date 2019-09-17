import { ICoordinate } from "./entities/Coordinate";
import { RequestControllers } from "./controllers/RequestControllers";
export declare class GeoLocoMapRequest {
    coordinate: ICoordinate;
    url: string;
    response: any;
    constructor(coordinate: ICoordinate, url: string);
    initRequest(zoom?: number): RequestControllers;
}
//# sourceMappingURL=Request.d.ts.map