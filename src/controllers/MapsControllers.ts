import MapsUseCase from '../usecases/MapsUseCase'
import { IMaps } from '../entities/Maps'
import {ICoordinate} from "../entities/Coordinate";

export default class MapsControllers {

    maps: IMaps
    map: any

    constructor(maps: IMaps) {
        this.maps = maps
    }

    InitMap() {
       this.map  = new MapsUseCase(this.maps).execute()
        return this.map
    }

    addMarker(coorinate: ICoordinate) {
        new MapsUseCase(this.maps).addMarker(coorinate)
    }
    deleteMarker(id:number, reponse: any) {
        new MapsUseCase(this.maps).deleteMarker(id,reponse)
    }

}
