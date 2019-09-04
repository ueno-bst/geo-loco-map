import { MapsControllers } from './controllers/MapsControllers'
import { IMaps, Maps }  from './entities/Maps'
import {ICoordinate} from "./entities/Coordinate";
import { GeoLocoMapRequest } from "./Request";


export class GeoLocoMap {

    maps: MapsControllers
    imaps: IMaps

    constructor(maps: IMaps, geolocorequest?: GeoLocoMapRequest)
    {
        const map = { ...Maps, ...maps }
        this.imaps = map

        if (geolocorequest != undefined) {
            this.maps =  new MapsControllers(this.imaps, geolocorequest)
        } else  {
            this.maps =  new MapsControllers(this.imaps)
        }

    }

    static Request(coordinate: ICoordinate, url: string, zoom:number) : GeoLocoMapRequest {
        return new GeoLocoMapRequest(coordinate, url,zoom);
    }

    getZoom(){
        return this.maps.getZoom()
    }

    setZoom(number: number) {
        return this.maps.setZoom(number)
    }

    getCenter() {
        return this.maps.getCenter()
    }

    setCenter(coordinate: ICoordinate) {
        return this.maps.setCenter(coordinate)
    }

    addMarker(coordinate: ICoordinate) {
        return this.maps.addMarker(coordinate)

    }

    deleteMarker(id:number) {
        return this.maps.deleteMarker(id)
    }
}

