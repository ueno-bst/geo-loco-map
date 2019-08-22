import { IMaps } from "../entities/Maps";
import { GoogleMapEntiry } from "../entities/GoogleMap";
import { YahooMapEntity } from "../entities/YahooMap";
import {ICoordinate} from "../entities/Coordinate";
import {GoogleMapRequestEntiry} from "../entities/GoogleMapRequest";

export default class MapsUseCase  {
    imaps: IMaps;

    map: any

    response: any

    constructor(maps: IMaps) {
        this.imaps = maps
    }

    execute() {
        if (this.imaps.map_type == 'yahoo') {
            this.map = new YahooMapEntity(this.imaps)
            return this.map
        }else {
            this.map = new GoogleMapEntiry(this.imaps)
            return this.map
        }
    }

    addMarker(coordinate: ICoordinate) {

        if (this.imaps.maps.map_type == 'yahoo') {
            var yahooMap = new YahooMapEntity(this.imaps)
            yahooMap.addMarker(coordinate,this.imaps, true)
        }else {
            new GoogleMapRequestEntiry(coordinate,this.imaps.maps, this.imaps.map).addMarker(coordinate)
        }

    }
    deleteMarker(id: number, response: any) {
        if (this.imaps.maps.map_type == 'yahoo') {
        }else {

            new GoogleMapRequestEntiry({lat:35, lng: 135}, this.imaps.maps, this.imaps.map).deleteMarker(id,response)
        }
    }

}
