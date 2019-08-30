import { ICoordinate } from "./entities/Coordinate";
import { RequestControllers } from "./controllers/RequestControllers";


export  class GeoLocoMapRequest {

    coordinate: ICoordinate
    url: string
    response: any


    constructor(coordinate: ICoordinate, url: string) {
        this.coordinate = coordinate
        this.url = url
        this.response = this.initRequest()
    }

    initRequest() {
        return new RequestControllers(this.coordinate,this.url)
    }
}
