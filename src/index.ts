import RequestControllers from './controllers/RequestControllers'
import MapsControllers from './controllers/MapsControllers'
import { IMaps, Maps }  from './entities/Maps'
import { ICoordinate} from "./entities/Coordinate";

export default class GeoLocoMap {
    maps: IMaps

    constructor(maps: IMaps)
    {
        this.maps = maps
    }

    InitMaps(){
        new  MapsControllers(this.maps)
    }

    request(req: ICoordinate, url = this.maps.api_url, mapType: string | undefined = this.maps.map_type) {
        if (mapType == undefined) {
            mapType = 'google'
        }
        new RequestControllers(req, url, mapType)
    }
}

const geolocomap = new GeoLocoMap({map_type:'yahoo',latlng: [35.658581, 139.745433],selector: 'map', api_url: 'http://localhost:8888/response.php'})
//geolocomap.InitMaps()
geolocomap.request({lat: 35, lng:135})
