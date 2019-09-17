import { ILatLng } from "./entities/LatLng";
import { RequestControllers } from "./controllers/RequestControllers";


export  class GeoLocoMapRequest {

    coordinate: ILatLng
    url: string
    response: any


    constructor(coordinate: ILatLng, url: string) {
        this.coordinate = coordinate
        this.url = url
    }

    initRequest(zoom?:number) {
        return new RequestControllers(this.coordinate,this.url,zoom)
    }
}
