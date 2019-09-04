import { ICoordinate } from "./entities/Coordinate";
import { RequestControllers } from "./controllers/RequestControllers";


export  class GeoLocoMapRequest {

    coordinate: ICoordinate
    url: string
    response: any
    zoom: number


    constructor(coordinate: ICoordinate, url: string,zoom: number) {
        this.coordinate = coordinate
        this.url = url
        this.zoom = zoom
        this.response = this.initRequest()
    }

    initRequest() {
        return new RequestControllers(this.coordinate,this.url,this.zoom)
    }
}
