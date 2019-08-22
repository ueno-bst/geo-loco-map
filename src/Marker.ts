import { ICoordinate} from "./entities/Coordinate";
import { IMaps } from "./entities/Maps";
import MapsControllers from "./controllers/MapsControllers";

export class Marker {

    coordinate: ICoordinate
    maps: IMaps

    constructor(coordinate: ICoordinate, maps: IMaps) {
        this.coordinate = coordinate
        this.maps = maps
    }

    addMarker() {
        new MapsControllers(this.maps).addMarker(this.coordinate)
    }

    //removeMarker(req: ICoordinate) {
    //    new MapsControllers(this.maps, this.coordinate)
    //}

}
