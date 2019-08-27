import { IMaps } from "../entities/Maps";
import { GoogleMapEntiry } from "../entities/GoogleMap";
import { YahooMapEntity } from "../entities/YahooMap";
import {ICoordinate} from "../entities/Coordinate";
import { GeoLocoMapRequest } from "../Request";

export default class MapsUseCase  {
    imaps: IMaps;
    map: GoogleMapEntiry | YahooMapEntity |  any


    constructor(maps: IMaps, geoLocoMapRequest?: GeoLocoMapRequest) {
        this.imaps = maps
        this.map = this.execute(geoLocoMapRequest)
    }

    execute(geoLocoMapRequest?: GeoLocoMapRequest) {

        if (this.imaps.map_type == 'yahoo') {
            return new YahooMapEntity(this.imaps,geoLocoMapRequest)
        } else {
            return new GoogleMapEntiry(this.imaps, geoLocoMapRequest)
        }

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

    setCenter(coordinate: ICoordinate) {
        if (this.map.maps.map_type == 'google') {

            this.map.setCenter(coordinate)

        } else if (this.map.maps.map_type == 'yahoo') {

            this.map.setCenter(coordinate)

        }
    }

    setController() {
        if (this.map.maps.map_type == 'google') {

            this.map.setOptions()

        } else if (this.map.maps.map_type == 'yahoo') {

            this.map.setOptions()

        }
    }

    addMarker(coordinate: ICoordinate) {
        this.map.addMarker(coordinate)

    }

    deleteMarker(id:number) {
        this.map.deleteMarker(id)
    }


}
