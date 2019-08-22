import { ICoordinate} from "./entities/Coordinate";
import RequestControllers  from './controllers/RequestControllers'
import MapTypeControlStyle = google.maps.MapTypeControlStyle;
import MapsControllers from "./controllers/MapsControllers";
import {API} from "./entities/Request";

export class Request {

    coordinate: ICoordinate
    private request: RequestControllers

    constructor(coordinate: ICoordinate, maps: any) {

        this.coordinate = coordinate

        this.request = new RequestControllers(this.coordinate,maps)

    }

    addMarker(coordinate: ICoordinate)  {
        new MapsControllers(this.request.request.maps).addMarker(coordinate)
    }

    deleteMarker(id: number) {
        new MapsControllers(this.request.request.maps).deleteMarker(id,this.request.request.response.response)
    }
}
