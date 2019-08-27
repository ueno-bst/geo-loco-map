import MapsUseCase from '../usecases/MapsUseCase'
import { IMaps } from '../entities/Maps'
import {ICoordinate} from "../entities/Coordinate";
import { GeoLocoMapRequest } from "../Request";

export default class MapsControllers{

    imaps: IMaps
    map: MapsUseCase

    constructor(maps: IMaps, geoLocoMapRequest?: GeoLocoMapRequest) {
        var mapsUseCase = new MapsUseCase(maps, geoLocoMapRequest)
        this.imaps = mapsUseCase.imaps
        this.map =  mapsUseCase
    }

    getZoom(){
        return this.map.getZoom()
    }

    setZoom(number: number) {
        return this.map.setZoom(number)
    }


    getCenter() {
        return this.map.getCenter()
    }

    setCenter(coodinate: ICoordinate) {
        return this.map.setCenter(coodinate)
    }

    setController() {
        return this.map.setController()
    }

    addMarker(coorinate: ICoordinate) {
        return this.map.addMarker(coorinate)
    }

    deleteMarker(id:number) {
        return this.map.deleteMarker(id)
    }

}
