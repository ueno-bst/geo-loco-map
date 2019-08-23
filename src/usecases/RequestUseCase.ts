import { ICoordinate } from "../entities/Coordinate"
import { API } from "../entities/Request"
import {GoogleMapEntiry} from "../entities/GoogleMap";
import { IMaps} from "../entities/Maps";

export default class RequestUseCase {
    coodinate: ICoordinate;
    maps: IMaps
    response: any

    constructor(coordinate: ICoordinate, maps: IMaps) {
        this.coodinate = coordinate
        this.maps = maps
        this.response =  new API( coordinate,maps)
    }

}
