import { ICoordinate } from "./entities/Coordinate";
import { RequestControllers } from "./controllers/RequestControllers";


export  class GeoLocoMapRequest {

    coordinate: ICoordinate
    url: string
    response: any


    constructor(coordinate: ICoordinate, url: string) {
        this.coordinate = coordinate
        this.url = url
    }

    initRequest(zoom?:number) {
        return new RequestControllers(this.coordinate,this.url,zoom)
    }
}
