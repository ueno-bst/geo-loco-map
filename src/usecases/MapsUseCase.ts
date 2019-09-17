import { IMapConfig } from "../entities/MapConfig";
import { GoogleMapController } from "../controllers/GoogleMapController";
import { YahooMapController } from "../controllers/YahooMapController";
import {ILatLng} from "../entities/LatLng";
import { GeoLocoMapRequest } from "../Request";

export  class MapsUseCase  {
    imaps: IMapConfig;
    map: GoogleMapController | YahooMapController |  any


    constructor(maps: IMapConfig, geoLocoMapRequest?: GeoLocoMapRequest) {
        this.imaps = maps
        this.map = this.execute(geoLocoMapRequest)
    }

    execute(geoLocoMapRequest?: GeoLocoMapRequest) {

        /*
        if (this.imaps.map_type == 'yahoo') {
            return new YahooMapController(this.imaps,geoLocoMapRequest)
        } else {
            return new GoogleMapController(this.imaps, geoLocoMapRequest)
        }

         */

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

    setCenter(coordinate: ILatLng) {
        if (this.map.maps.map_type == 'google') {

            this.map.setCenter(coordinate)

        } else if (this.map.maps.map_type == 'yahoo') {

            this.map.setCenter(coordinate)

        }
    }

    addMarker(coordinate: ILatLng) {
        this.map.addMarker(coordinate)

    }

    deleteMarker(id:number) {
        this.map.deleteMarker(id)
    }


}
